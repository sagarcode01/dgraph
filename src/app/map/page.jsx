"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import GraphMap from "@/components/GraphMap"; // Use the existing GraphMap component
import GraphMapSwarm from "@/components/GraphMapSwarm";

const MapsPage = () => {
    const [tracking, setTracking] = useState(true);

    // Toggle tracking state
    const toggleTracking = () => setTracking((prev) => !prev);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                <Card className="shadow-xl border rounded-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold text-gray-800">
                            Drone Swarm Tracking
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* GraphMap Component */}
                        <div className="relative w-full h-[500px] border rounded-lg overflow-hidden">
                            <GraphMapSwarm isTracking={tracking} />
                        </div>

                        {/* Control Panel */}
                        <div className="flex items-center justify-between">
                            <p className="text-gray-600">
                                {tracking
                                    ? "Live tracking is enabled. The map updates every 5 seconds."
                                    : "Tracking is paused. The map will not update."}
                            </p>
                            <Button onClick={toggleTracking}>
                                {tracking ? "Pause Tracking" : "Start Tracking"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default MapsPage;
