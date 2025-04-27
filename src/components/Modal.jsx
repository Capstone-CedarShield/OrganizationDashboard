import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

const Modal = ({ isOpen, onClose, children, currentIncident }) => {
  const navigate = useNavigate();

  function handleIncident() {
    onClose();
    navigate(`/dashboard/incident/${currentIncident.uuid}`);
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Darkened backdrop with blur effect */}
      <div
        className="fixed inset-0 flex items-center justify-center z-40 bg-transparent"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Apply a semi-transparent black background
          backdropFilter: "blur(10px)", // Apply blur effect to content behind the modal
        }}
        onClick={onClose} // Close modal when clicking on backdrop
      >
        {/* Modal Content */}
        <div className="z-50">{children}</div>
      </div>
    </>
  );
};

export default Modal;
