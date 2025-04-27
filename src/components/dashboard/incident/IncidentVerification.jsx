import React, { useState } from "react";
import Modal from "../../shared/modal/Modal"; // Import your existing Modal
import Button from "../../shared/button/Button"; // Import the custom Button component

const IncidentVerification = ({ incident }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleActionSubmit = (description) => {
    // You can now use the description entered in the textarea
    console.log(
      "Action Taken on Incident:",
      incident.id,
      "Description:",
      description
    );
    // You can send this to your API or use it however you want
  };

  return (
    <>
      <div className="bg-white shadow-lg rounded-2xl p-7 border border-gray-300 text-center flex flex-col items-center justify-center">
        <p className="text-gray-900 text-2xl font-normal mb-6">
          Press the button to notify the ministry that the incident is in
          progress
        </p>
        {/* Center the button and set text size */}
        <div className="w-60">
          <Button onClick={handleOpenModal} className="text-lg ">
            Take Action
          </Button>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          onActionSubmit={handleActionSubmit}
        >
          <h2 className="text-3xl font-semibold mb-4 border-b-2 pb-6 text-black">
            Send information description to the Ministry
          </h2>
        </Modal>
      )}
    </>
  );
};

export default IncidentVerification;
