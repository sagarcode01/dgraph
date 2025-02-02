// app/api/swarm-coordinates/route.js
import { NextResponse } from "next/server";

export async function GET() {
    const centralLat = 12.9716; // Central latitude
    const centralLng = 77.5946; // Central longitude
    const swarmRadius = 0.005; // Radius of the swarm

    // Generate 20 nodes in the swarm
    const nodes = Array.from({ length: 4 }, (_, i) => ({
        id: i + 1,
        name: `Node ${i + 1}`,
        lat: centralLat + (Math.random() * swarmRadius * 2 - swarmRadius), // Random offset
        lng: centralLng + (Math.random() * swarmRadius * 2 - swarmRadius), // Random offset
    }));

    console.log("Generated swarm coordinates:", nodes);

    return NextResponse.json(nodes);
}
