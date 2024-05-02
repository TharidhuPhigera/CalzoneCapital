import React from 'react';

const PredictionModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg" style={{
          width: '65%', 
          height: 'auto', 
          maxHeight: '80%', 
          overflowY: 'auto', 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
        {children}
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-[#38bfc3] border border-white text-white rounded hover:bg-white hover:border hover:border-[#38bfc3] hover:text-[#38bfc3] transition">Close</button>
      </div>
    </div>
  );
};

export default PredictionModal;
