import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import IncidentHeader from "./IncidentHeader";
import MapSection from "../../../pages/Maps";
import Modal from "../../shared/modal/Modal";
import UrgencyInput from "../../shared/input/UrgencyInput";
import InputField from "../../shared/input/InputField";
import uploadIcon from "../../../assets/icons/upload-icon.svg";
import SearchIcon from "../../../assets/icons/search-icon.svg";
import Button from "../../shared/button/Button";

function IncidentAssignment() {
  const { incidentId } = useParams();
  const location = useLocation();
  const incident = location.state?.incident;

  const [urgencyLevel, setUrgencyLevel] = useState(incident.urgencyLevel);
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedOrganizations, setSelectedOrganizations] = useState([
    "Lebanese Red Cross",
    "Lebanese Civil Defense",
  ]);

  const allOrganizations = [
    "Lebanese Red Cross",
    "Lebanese Civil Defense",
    "Doctors Without Borders",
    "Lebanese Armed Forces",
    "Internal Security Forces",
  ];

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter organizations based on search query
  const filteredOrganizations = allOrganizations.filter((org) =>
    org.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleOrganization = (org) => {
    setSelectedOrganizations((prev) =>
      prev.includes(org) ? prev.filter((item) => item !== org) : [...prev, org]
    );
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  // Remove specific file
  const handleRemoveFile = (fileName) => {
    setFiles(files.filter((file) => file.name !== fileName));
  };

  const handleAssignIncident = () => {
    console.log("Assign Incident clicked!");
  };

  return (
    <div className="relative flex flex-col w-full h-full p-6">
      <IncidentHeader incident={incident} />
      <div className="flex flex-1 gap-6">
        {/* Left Panel */}
        <div className="flex flex-col flex-[0.47] gap-4  p-4 border rounded-3xl bg-white-50 shadow-sm">
          {/* Assign to Organizations */}
          <h2 className="text-lg font-semibold text-gray-700">
            Assign to Organization(s)
          </h2>
          <div className="flex flex-wrap gap-2 bg-gray-100 p-3 rounded-2xl">
            {selectedOrganizations.map((org) => (
              <span
                key={org}
                className="bg-red-700 text-white px-3 py-1.5 rounded-full text-base font-normal flex items-center justify-center flex-shrink-0"
              >
                {org}
              </span>
            ))}
            <button
              className="border border-gray-400 px-3 py-2 rounded-full text-gray-600 hover:bg-gray-200"
              onClick={() => setIsModalOpen(true)}
            >
              +
            </button>
          </div>

          {/* Urgency Level */}
          <UrgencyInput
            urgencyLevel={urgencyLevel}
            setUrgencyLevel={setUrgencyLevel}
          />

          {/* Incident Content */}
          <h2 className="text-lg font-semibold text-gray-700">
            Incident Content
          </h2>
          <style>
            {`
    .dashed-border {
      border: 2px dashed #d1d5db;
      padding: 24px;
      border-radius: 1rem;
      background-color: #f3f4f6;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      position: relative;
      transition: border-color 0.3s ease; /* Smooth transition for border color change */
    }

    .file-name {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .file-name span {
      font-size: 14px;
      color: #4a4a4a;
    }

    .remove-file {
      cursor: pointer;
      color: red;
      font-size: 16px;
    }

    .file-list {
      margin-top: 10px;
      width: 100%;
      list-style-type: none;
      padding: 0;
    }

    .file-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px;
      background-color: #e0e0e0;
      margin-bottom: 5px;
      border-radius: 8px;
    }
  `}
          </style>

          <div className="dashed-border p-6 rounded-xl shadow-sm bg-gray-100 flex flex-col justify-center items-center cursor-pointer hover:border-red-700">
            <img src={uploadIcon} alt="Upload Icon" className="mb-2" />
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              multiple
            />
            <label
              htmlFor="file-upload"
              className="text-gray-500 text-sm cursor-pointer"
            >
              Upload
            </label>

            {/* Show the list of files */}
            {files.length > 0 && (
              <ul className="file-list">
                {files.map((file) => (
                  <li key={file.name} className="file-item">
                    <span>{file.name}</span>
                    <span
                      className="remove-file"
                      onClick={() => handleRemoveFile(file.name)}
                    >
                      X
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Incident Description */}
          <div className="mb-4">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Incident Description/Safety Information
            </label>
            <InputField
              multiline
              rows={4}
              placeholder="Write additional information..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Assign Incident Button */}
          <Button onClick={handleAssignIncident} className="mb-4">
            Assign Incident
          </Button>
        </div>

        {/* Map Section */}
        <div className="absolute right-0 w-[50%] h-full rounded-lg overflow-hidden shadow-md">
          <MapSection />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <style>
            {`
        .custom-checkbox {
          width: 1.25rem; /* w-5 */
          height: 1.25rem; /* h-5 */
          border-radius: 0.375rem; /* rounded-md */
          border: 2px solid #ddd; /* default border color */
          transition: all 0.3s ease;
          transform: rotate(45deg); /* Rotate 45 degrees */
          display: inline-block;
          cursor: pointer;
          position: relative;
        }

        /* When the checkbox is checked, change the background color */
        .custom-checkbox.checked {
          background-color: #b91c1c; /* Tailwind red-700 */
          border-color: #b91c1c;
        }

        /* Hover effect */
        .custom-checkbox:not(.checked):hover {
          border-color: #b91c1c; /* Border color change on hover */
        }
      `}
          </style>

          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search Organizations"
              className="w-full bg-gray-100 text-gray-500 p-4 pl-12 rounded-2xl shadow-md focus:outline-none"
              value={searchQuery} // Bind the value of the search input to searchQuery
              onChange={(e) => setSearchQuery(e.target.value)} // Update the search query on input change
            />
            <img
              src={SearchIcon}
              alt="Search Icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
            />
          </div>

          <div className="flex flex-col gap-4">
            {/* Filter organizations based on search query */}
            {filteredOrganizations.map((org) => (
              <div
                key={org}
                onClick={() => toggleOrganization(org)} // Allow clicking the whole div to toggle the checkbox
                className={`flex items-center justify-start p-3 rounded-2xl cursor-pointer ${
                  selectedOrganizations.includes(org)
                    ? "bg-gray-100" // Light gray background when selected
                    : "bg-white"
                }`}
              >
                <div
                  onClick={() => toggleOrganization(org)}
                  className={`custom-checkbox ${
                    selectedOrganizations.includes(org) ? "checked" : ""
                  } mr-4`} // Custom checkbox
                />
                <span
                  className={`text-xl ${
                    selectedOrganizations.includes(org)
                      ? "font-medium text-black" // Less bold, black when selected
                      : "font-medium text-gray-600"
                  } py-1`} // Less bold, gray when not selected
                >
                  {org}
                </span>
              </div>
            ))}
          </div>
          <button
            className="bg-red-700 text-white px-4 py-2 rounded-md mt-4"
            onClick={() => setIsModalOpen(false)}
          >
            Done
          </button>
        </Modal>
      )}
    </div>
  );
}

export default IncidentAssignment;
