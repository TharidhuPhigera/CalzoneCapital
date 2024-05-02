import React from 'react'

const AddCreditsModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
  
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
            {children}
            <button onClick={onClose} className="w-full mt-4 px-4 py-2 bg-[#38bfc3] border border-white text-white rounded hover:bg-white hover:border hover:border-[#38bfc3] hover:text-[#38bfc3] transition">Close</button>
        </div>
      </div>
    );
  };

export default AddCreditsModal;