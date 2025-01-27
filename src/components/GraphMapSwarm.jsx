"use client";

import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

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
    const [selectedNode, setSelectedNode] = useState(null); // Store the selected node
    const [isPanelOpen, setIsPanelOpen] = useState(false); // Control side panel visibility

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

    // Open side panel with node details
    const handleMarkerClick = (node) => {
        setSelectedNode(node);
        setIsPanelOpen(true);
    };

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
                            onClick={() => handleMarkerClick(node)} // Handle marker click
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

            {/* Shadcn Side Panel */}
            <Sheet open={isPanelOpen} onOpenChange={setIsPanelOpen}>
                <SheetTrigger asChild>
                    {/* Optional: Add a trigger button if needed */}
                </SheetTrigger>
                <SheetContent side="right" className="w-96">
                    <SheetHeader>
                        <SheetTitle>Node Details</SheetTitle>
                        <SheetDescription>
                            Information about the selected node is displayed here.
                        </SheetDescription>
                    </SheetHeader>
                    {selectedNode ? (
                        <div className="mt-4 space-y-2">
                            <p>
                                <strong>Name:</strong> {selectedNode.name}
                            </p>
                            <p>
                                <strong>Latitude:</strong> {selectedNode.lat.toFixed(4)}
                            </p>
                            <p>
                                <strong>Longitude:</strong> {selectedNode.lng.toFixed(4)}
                            </p>
                            <p>
                                <strong>ID:</strong> {selectedNode.id}
                            </p>
                        </div>
                    ) : (
                        <p className="mt-4">No node selected.</p>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default GraphMapSwarm;
