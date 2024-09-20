import { NextResponse } from "next/server";
import { Client } from "@gradio/client";

export async function POST(req) {
  const body = await req.json();
  const { prompt } = body;

  if (!prompt) {
    return NextResponse.json(
      { message: "Prompt is required." },
      { status: 400 }
    );
  }

  try {
    const client = await Client.connect(
      "latentexplorers/latentnavigation-flux"
    );

    // Adjust parameters based on the model's requirements
    const result = await client.predict("/generate", {
      prompt: prompt,
      concept_1: prompt, // Use prompt as concept_1 for testing
      concept_2: prompt, // Use prompt as concept_2 for testing
      // Remove additional parameters for now to simplify testing
    });

    console.log("Gradio Result:", result);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error generating image:", error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
