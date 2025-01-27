
import React from "react";
import dynamic from "next/dynamic";

// Dynamically import the map to avoid server-side rendering issues
const GraphMap = dynamic(() => import("../components/GraphMap"), { ssr: false });

const MapPage = () => {
    return (
        <div>
            <h1>Graph on Google Maps</h1>
            <GraphMap />
        </div>
    );
};

export default MapPage;
