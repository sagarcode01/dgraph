"use client";

import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "500px",
};

const center = {
    lat: 12.9716, // Initial center of the map
    lng: 77.5946,
};

const edges = [
    { from: 1, to: 2 },
    { from: 2, to: 3 },
];

const GraphMap = () => {
    const [nodes, setNodes] = useState([]);

    // Fetch data from API
    const fetchCoordinates = async () => {
        try {
            const response = await fetch("/api/swarm-coordinates");
            const data = await response.json();
            setNodes(data);
        } catch (error) {
            console.error("Failed to fetch swarm coordinates:", error);
        }
    };

    // Fetch data every 5 seconds
    useEffect(() => {
        fetchCoordinates(); // Initial fetch
        const interval = setInterval(fetchCoordinates, 50000);
        return () => clearInterval(interval);
    }, []);

    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={8}>
                {/* Add markers */}
                {nodes.map((node) => (
                    <Marker key={node.id} position={{ lat: node.lat, lng: node.lng }} title={node.name} />
                ))}

                {/* Add polylines for edges */}
                {edges.map((edge, index) => {
                    const fromNode = nodes.find((node) => node.id === edge.from);
                    const toNode = nodes.find((node) => node.id === edge.to);

                    if (fromNode && toNode) {
                        return (
                            <Polyline
                                key={index}
                                path={[
                                    { lat: fromNode.lat, lng: fromNode.lng },
                                    { lat: toNode.lat, lng: toNode.lng },
                                ]}
                                options={{
                                    strokeColor: "#FF0000",
                                    strokeOpacity: 1.0,
                                    strokeWeight: 2,
                                }}
                            />
                        );
                    }
                    return null;
                })}
            </GoogleMap>
        </LoadScript>
    );
};

export default GraphMap;
