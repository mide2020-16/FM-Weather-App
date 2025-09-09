import { NextResponse } from "next/server"
import OpenAI from "openai"

export async function GET() {
  const openai = new OpenAI()

  try {
    const prompt = `Generate a short, fun, and creative weather heading (max 12 words).
    Example styles: 
    - "How's the sky looking today?"
    - "Is the sun in a good mood?"
    - "Should we expect raindrops or sunshine smiles?"`

    const res = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [{ role: "user", content: prompt }],
      max_output_tokens: 30,
      temperature: 0.8,
    })

    // Extract text safely
    const heading = res.output[0].type || "How's the sky looking today?"

    return NextResponse.json({ heading })
  } catch (error) {
    console.error("Weather heading API error:", error)
    return NextResponse.json(
      { heading: "How's the sky looking today?" }, // fallback
      { status: 200 }
    )
  }
}
