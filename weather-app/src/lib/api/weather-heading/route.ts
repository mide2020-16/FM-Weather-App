import { NextResponse } from "next/server"

export async function GET() {
  try {
    const prompt = `Generate a short, fun, and creative weather heading (max 12 words).
    Example styles: 
    - "How's the sky looking today?"
    - "Is the sun in a good mood?"
    - "Should we expect raindrops or sunshine smiles?"`

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 30,
        temperature: 0.8,
      }),
    })

    if (!res.ok) {
      throw new Error(`OpenAI API error: ${res.statusText}`)
    }

    const data = await res.json()
    const message =
      data?.choices?.[0]?.message?.content?.trim() ||
      "How's the sky looking today?"

    return NextResponse.json({ message })
  } catch (error) {
    console.error("Weather heading API error:", error)
    return NextResponse.json(
      { message: "How's the sky looking today?" }, // fallback
      { status: 200 }
    )
  }
}
