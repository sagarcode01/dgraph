import { NextResponse } from "next/server";

export async function GET() {
    const nodes = [
        { id: 1, name: "Node 1", lat: 12.9716 + Math.random() * 0.1, lng: 77.5946 + Math.random() * 0.1 },
        { id: 2, name: "Node 2", lat: 12.2958 + Math.random() * 0.1, lng: 76.6394 + Math.random() * 0.1 },
        { id: 3, name: "Node 3", lat: 11.0168 + Math.random() * 0.1, lng: 76.9558 + Math.random() * 0.1 },
    ];

    return NextResponse.json(nodes);
}
