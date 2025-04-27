import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom"; // Added useNavigate
import Sidebar from "../components/dashboard/sidebar/sidebar.jsx";
import Map from "./Map.jsx";
import Navbar from "../components/dashboard/navbar/Navbar.jsx";
import io from "socket.io-client";
import Modal from "../components/Modal"; // Import the Modal component
import { useAuth } from "../context/authContext/index.jsx";
import { getTodayIncidents } from "../services/incidentServices.js";

const socket = io("http://localhost:3000");

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize the navigate hook
  const [showMap, setShowMap] = useState(true);
  const [incidents, setIncidents] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIncident, setCurrentIncident] = useState(null);
  const organizationName = "Lebanese Red Cross"; // Replace with dynamic organization name if needed
  const { user } = useAuth();



  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const data = await getTodayIncidents(user.email);
        setIncidents(data);
      } catch (error) {
        console.error("Error fetching incidents:", error);
      }
    };

    fetchIncidents();
  }, []);

  useEffect(() => {
    const baseRoutes = ["/dashboard/incident", "/dashboard/organization"];
    const shouldHideMap = baseRoutes.some(
      (route) =>
        location.pathname.startsWith(route) && location.pathname !== route
    );
    console.log(shouldHideMap);
    setShowMap(!shouldHideMap);
  }, [location]);

  useEffect(() => {
    socket.on("organizationAssign", (incidentData) => {
      if (
        user &&
        incidentData.assignedOrganizations &&
        incidentData.assignedOrganizations.some(
          (org) => org.email === user.email
        )
      ) {
        setIncidents((prevIncidents) => [...prevIncidents, incidentData]);
        setCurrentIncident(incidentData);
        setIsModalOpen(true);
      } else {
        console.log(
          "User email does not match any assigned organization's email."
        );
      }
    });

    // Clean up the socket listener
    return () => {
      socket.off("organizationAssign");
    };
  }, [organizationName, user]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Function to navigate to the incident details page
  const handleGoToIncident = () => {
    if (currentIncident && currentIncident.uuid) {
      navigate(`/dashboard/incident/${currentIncident.uuid}`);
      handleCloseModal();
    }
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div
          className={`flex flex-1 ${
            showMap ? "flex-row" : "flex-col"
          } overflow-hidden`}
        >
          {/* Main Content */}
          <div
            className={`flex-grow overflow-y-auto ${
              showMap ? "max-w-3xl" : "w-full"
            }`}
          >
            <Outlet />
          </div>

          {showMap && (
            <div
              className="h-full"
              style={{
                flexGrow: 1,
                minWidth: "300px",
                maxWidth: "calc(100vw - 800px)",
              }}
            >
              <Map incidents={incidents} />
            </div>
          )}
        </div>
      </div>

      {/* Modal for displaying incident data */}
      {currentIncident && <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        currentIncident={currentIncident}
      >
        {currentIncident && (
          <div className="max-w-md p-10 px-14 bg-white rounded-lg shadow-xl w-full mx-auto rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
              New Incident Assigned
            </h2>

            {/* Description Section */}
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Description
              </h3>
              <div className="p-4 bg-gray-50 border-l-4 border-red-700 rounded-md">
                <p className="text-gray-600">{currentIncident.description}</p>
              </div>
            </div>
            {/* Location Section */}
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Location
              </h3>
              <div className="p-4 bg-gray-50 border-l-4 border-red-700 rounded-md">
                <p className="text-gray-600">{currentIncident.location}</p>
              </div>
            </div>
            {/* Urgency Level Section */}
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Urgency Level
              </h3>
              <div className="p-4 bg-gray-50 border-l-4 border-red-700 rounded-md">
                <p className="text-gray-600">{currentIncident.urgencyLevel}</p>
              </div>
            </div>

            {/* Assigned Organizations Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Assigned Organizations
              </h3>
              <div className="p-4 bg-gray-50 border-l-4 border-red-700 rounded-md">
                <p className="text-gray-600">
                  {currentIncident.assignedOrganizations
                    .map((org) => org.name)
                    .join(", ")}
                </p>
              </div>
            </div>

            {/* Button Container */}
            <div className="flex justify-between gap-4 mt-10">
              {/* Close Button */}
              <button
                className="px-4 border-2 border-red-700 text-red-700 font-semibold rounded-lg hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-700 transition duration-200"
                onClick={handleCloseModal}
              >
                Close
              </button>
              {/* View Incident Details Button */}
              <button
                className="w-full p-3 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-700 transition duration-200"
                onClick={handleGoToIncident}
              >
                View Incident Details
              </button>
            </div>
          </div>
        )}
      </Modal>
}
    </div>
  );
}

export default Dashboard;
