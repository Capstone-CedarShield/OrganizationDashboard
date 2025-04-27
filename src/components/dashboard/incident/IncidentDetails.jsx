import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import IncidentHeader from "./IncidentHeader";
import IncidentDescription from "./IncidentDescription";
import IncidentVerification from "./IncidentVerification";
import { getIncident } from "../../../services/incidentServices";
import MapSection from "../../../pages/Maps";
import DownloadZipButton from "./DownloadZipButton"; // Import the new download button

function IncidentDetails() {
  const { incidentId } = useParams();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        setLoading(true);
        const response = await getIncident(incidentId);
        setIncident(response);
      } catch (err) {
        console.error("Failed to fetch incident:", err);
        setError("Something went wrong while fetching the incident details.");
      } finally {
        setLoading(false);
      }
    };

    fetchIncident();
  }, [incidentId]);

  const handleVerifyChange = (isVerified) => {
    setIncident((prevIncident) => ({
      ...prevIncident,
      isVerified,
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!incident) {
    return <div>No incident found.</div>;
  }

  return (
    <div className="relative flex flex-col w-full h-full">
      <div>
        <IncidentHeader incident={incident} />
      </div>
      <div className="flex flex-1">
        <div className="flex flex-col flex-[0.4] gap-6 p-6 overflow-y-auto max-w-lg">
          <IncidentDescription
            title={"Incident Discription"}
            description={incident.description}
          />
          <IncidentDescription
            title={"Ministry Tasks"}
            description={incident.ministryTask}
          />

          <IncidentVerification
            verified={incident.isVerified}
            onVerifyChange={handleVerifyChange}
            incident={incident}
          />
          {/* Render the DownloadZipButton to allow downloading the images as a ZIP */}
          <DownloadZipButton incidentId={incident.uuid} />
        </div>
        <div className={`absolute right-0 w-[60%] h-full`}>
          <div className="w-full h-full">
            <MapSection incidentLocation={incident.location} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncidentDetails;
