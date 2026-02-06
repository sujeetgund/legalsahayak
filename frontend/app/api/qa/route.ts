import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const backendBaseUrl = process.env.BACKEND_SERVER_URL;
    if (!backendBaseUrl) {
      return NextResponse.json(
        { error: "BACKEND_SERVER_URL is not set" },
        { status: 500 },
      );
    }

    const payload = await request.json();
    const response = await fetch(`${backendBaseUrl}/api/v1/qa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("QA proxy error:", error);
    return NextResponse.json(
      { error: "Failed to reach QA service" },
      { status: 502 },
    );
  }
}
