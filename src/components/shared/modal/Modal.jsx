import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import InputField from "../../shared/input/InputField"; // Import the InputField component
import Button from "../../shared/button/Button"; // Import the custom Button component

const Modal = ({ open, onClose, onActionSubmit, children }) => {
  const dialogRef = useRef();
  const [description, setDescription] = useState("");

  useEffect(() => {
    const modal = dialogRef.current;
    if (open && modal && !modal.open) {
      modal.showModal();
    }
    return () => {
      if (modal && modal.open) {
        modal.close();
      }
    };
  }, [open]);

  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = () => {
    onActionSubmit(description);
    onClose(); // Close the modal after submission
  };

  return createPortal(
    <>
      {open && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-40"
          style={{ backdropFilter: "blur(10px)" }}
          onClick={handleBackdropClick}
        />
      )}
      <dialog
        ref={dialogRef}
        onClick={handleBackdropClick}
        className="bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center p-8 w-full max-w-sm z-50 absolute inset-0 m-auto"
        style={{
          width: "100%",
          maxWidth: "500px",
          margin: "auto", // Ensures the modal is centered both horizontally and vertically
        }}
      >
        <div className="w-full text-center">
          <h2 className="text-3xl font-semibold mb-6 text-black">
            Send information description to the Ministry
          </h2>
          {/* Use InputField component for the input field */}
          <InputField
            type="text"
            id="description"
            name="description"
            placeholder="Write action required and resource needed..."
            value={description}
            onChange={handleDescriptionChange}
            multiline={true}
            rows={4}
            className="border-gray-300" // Ensure the border is light gray
          />
          {/* Add a space between the input field and the button */}
          <Button onClick={handleSubmit} className="mt-4">
            Assign Incident
          </Button>
        </div>
      </dialog>
    </>,
    document.getElementById("modal") // This should match the div id you created in the HTML
  );
};

export default Modal;
