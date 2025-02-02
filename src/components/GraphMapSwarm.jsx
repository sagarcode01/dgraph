"use client";

import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "100vh",
};

const center = {
    lat: 12.9716, // Central coordinate
    lng: 77.5946,
};

const GraphMapSwarm = ({ isTracking }) => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [renderKey, setRenderKey] = useState(0); // Force re-render key

    const fetchSwarmData = async () => {
        try {
            const response = await fetch("/api/swarm-coordinates");
            const newNodes = await response.json();

            // Step 1: Clear nodes and edges
            setNodes([]);
            setEdges([]);
            setRenderKey((prev) => prev + 1); // Force re-render to clear map

            // Step 2: Wait for clearing to reflect, then add new data
            setTimeout(() => {
                setNodes(newNodes);

                const generatedEdges = newNodes.slice(0, -1).map((node, index) => ({
                    from: node,
                    to: newNodes[index + 1],
                }));
                setEdges(generatedEdges);
                setRenderKey((prev) => prev + 1); // Trigger re-render for new data
            }, 0); // Allow React to process the clearing step
        } catch (error) {
            console.error("Failed to fetch swarm data:", error);
        }
    };

    useEffect(() => {
        fetchSwarmData();

        let interval;
        if (isTracking) {
            interval = setInterval(fetchSwarmData, 5000);
        }
        return () => interval && clearInterval(interval);
    }, [isTracking]);

    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                key={renderKey} // Force a fresh render with new key
                mapContainerStyle={containerStyle}
                center={center}
                zoom={16}
            >
                {/* Markers */}
                {nodes.map((node) => (
                    <Marker
                        key={node.id}
                        position={{ lat: node.lat, lng: node.lng }}
                        title={node.name}
                        icon={{
                            url: "/marker.svg", // Custom marker
                            scaledSize: new google.maps.Size(30, 30),
                        }}
                    />
                ))}

                {/* Polylines */}
                {edges.map((edge, index) => (
                    <Polyline
                        key={index}
                        path={[
                            { lat: edge.from.lat, lng: edge.from.lng },
                            { lat: edge.to.lat, lng: edge.to.lng },
                        ]}
                        options={{
                            strokeColor: "#FF0000",
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                        }}
                    />
                ))}
            </GoogleMap>
        </LoadScript>
    );
};

export default GraphMapSwarm;
