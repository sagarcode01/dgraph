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

    const fetchSwarmData = async () => {
        try {
            const response = await fetch("/api/swarm-coordinates");
            const data = await response.json();

            // Generate edges dynamically
            const generatedEdges = data.map((node, index) => {
                const nextNode = data[(index + 1) % data.length];
                return { from: node, to: nextNode };
            });

            setNodes(data);
            setEdges(generatedEdges);
        } catch (error) {
            console.error("Failed to fetch swarm data:", error);
        }
    };

    useEffect(() => {
        // Fetch data initially
        fetchSwarmData();

        // Set interval if tracking is enabled
        let interval;
        if (isTracking) {
            interval = setInterval(fetchSwarmData, 5000);
        }

        // Cleanup interval on unmount or when tracking is disabled
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isTracking]); // Re-run the effect when `isTracking` changes

    return (
        <div>
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={16}>
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
        </div>
    );
};

export default GraphMapSwarm;
