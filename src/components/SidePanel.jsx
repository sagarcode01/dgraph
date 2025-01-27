import React from "react";

const SidePanel = ({ node, onClose }) => {
    return (
        <div className="fixed top-0 right-0 w-1/3 h-full bg-white shadow-lg p-4">
            <button onClick={onClose} className="text-red-500">Close</button>
            <h2 className="text-2xl font-semibold">{node.name}</h2>
            <p>Latitude: {node.lat}</p>
            <p>Longitude: {node.lng}</p>
            {/* Add more details as needed */}
        </div>
    );
};

export default SidePanel;