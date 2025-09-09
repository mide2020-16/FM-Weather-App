"use client"
import { useEffect, useState } from "react"

const fallbackMessages = [
  "How's the sky looking today?",
  "Ready to check today’s forecast?",
  "Wondering if you’ll need an umbrella?",
  "What’s the weather vibe outside?",
  "Let’s see if the sun is smiling today 🌞",
]

export default function WeatherHeading() {
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Pick a random fallback message first
    const random = Math.floor(Math.random() * fallbackMessages.length)
    setMessage(fallbackMessages[random])

    // Try fetching an AI-generated one
    fetch("/lib/api/weather-heading")
      .then((res) => res.json())
      .then((data) => {
        if (data?.message) {
          setMessage(data.message)
        }
      })
      .catch(() => {
        // Fail silently, fallback already in place
      })
  }, [])

  return (
    <h1 className="font-extrabold font-display text-3xl sm:text-4xl text-center mb-6">
      {message}
    </h1>
  )
}
