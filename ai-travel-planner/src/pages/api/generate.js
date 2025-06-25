// pages/api/generate.js - Updated to return only one trip
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, passengers } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Missing prompt" });
  }

  // Check if user is traveling with children
  const hasChildren =
    passengers && (passengers.children > 0 || passengers.infants > 0);
  const totalChildren = hasChildren
    ? passengers.children + passengers.infants
    : 0;

  const systemMessage = `
You are a smart travel-planner AI. Given the user's request, generate *exactly* ONE perfect trip package in *valid JSON* only, formatted as an array with a single object.

${hasChildren ? `IMPORTANT: The user is traveling with ${totalChildren} child(ren). Include family-friendly activities, child-safe accommodations, and baby/kid-friendly options throughout.` : ""}

Focus on creating the BEST POSSIBLE match for their request. Consider:
- Their preferred destination or let the destination match their described experience
- The ideal time to visit based on weather and crowds
- A balance of popular attractions and hidden gems
- Comfortable but not excessive pricing
- Quality accommodations with good reviews
- Current weather patterns and seasonal considerations
${hasChildren ? "- Child-friendly activities and baby amenities" : ""}

Return ONLY this JSON structure:
[
  {
    "Destination": "City, Country",
    "Month": "Best month to visit",
    "Reason": "Detailed explanation of why this destination and time perfectly matches their request${hasChildren ? " and is great for families with children" : ""}",
    "Duration": "X days",
    "Flight": {
      "Outbound": "DEP→ARR, 9:00 AM - 10:30 PM",
      "Return": "ARR→DEP, 12:00 PM - 4:00 PM"
    },
    "Hotel": "Specific Hotel Name${hasChildren ? " (Family-Friendly)" : ""}",
    "HotelImage": "https://source.unsplash.com/600x400/?hotel,destination${hasChildren ? ",family" : ""}",
    "DestinationImage": "https://source.unsplash.com/600x400/?destination",
    "Activities": [
      "Must-do activity 1${hasChildren ? " (child-friendly)" : ""}",
      "Must-do activity 2${hasChildren ? " (suitable for kids)" : ""}",
      "Must-do activity 3${hasChildren ? " (family activity)" : ""}"
    ],
    "AvailableActivities": [
      ${
        hasChildren
          ? `{ "name": "Children's Activity", "price": 35, "childFriendly": true },
         { "name": "Baby Care Experience", "price": 25, "childFriendly": true },
         { "name": "Family Adventure", "price": 80, "childFriendly": true },`
          : ""
      }
      { "name": "Specific Activity Name", "price": 50${hasChildren ? ', "childFriendly": false' : ""} },
      { "name": "Another Activity", "price": 75${hasChildren ? ', "childFriendly": true' : ""} },
      { "name": "Cultural Experience", "price": 60${hasChildren ? ', "childFriendly": true' : ""} },
      { "name": "Adventure Activity", "price": 90${hasChildren ? ', "childFriendly": false' : ""} },
      { "name": "Relaxation Option", "price": 40${hasChildren ? ', "childFriendly": true' : ""} }
    ],
    "Weather": {
      "forecast": [
        { "date": "2025-XX-XX", "temp": "22°C", "condition": "Sunny", "icon": "☀️", "humidity": "65%" },
        { "date": "2025-XX-XX", "temp": "24°C", "condition": "Partly Cloudy", "icon": "⛅", "humidity": "70%" },
        { "date": "2025-XX-XX", "temp": "21°C", "condition": "Light Rain", "icon": "🌧️", "humidity": "80%" },
        { "date": "2025-XX-XX", "temp": "23°C", "condition": "Sunny", "icon": "☀️", "humidity": "60%" },
        { "date": "2025-XX-XX", "temp": "25°C", "condition": "Clear", "icon": "☀️", "humidity": "55%" }
      ],
      "averageTemp": "23°C",
      "bestConditions": "Mostly sunny with comfortable temperatures",
      "clothingAdvice": "Light layers recommended${hasChildren ? ", pack extra clothes for children" : ""}"
    },
    "ChildFriendlyFeatures": ${
      hasChildren
        ? `[
      "Baby changing facilities",
      "High chairs available",
      "Kids menu at restaurants",
      "Stroller-friendly paths",
      "Child safety locks",
      "Babysitting services"
    ]`
        : "null"
    },
    "Price": "$XXXX"
  }
]

Make sure the trip package perfectly matches their request and provides excellent value. Be specific with destination details, hotel names, and activity descriptions.
`.trim();

  try {
    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 1500,
        }),
      }
    );

    if (!openaiRes.ok) {
      const errorText = await openaiRes.text();
      console.error("OpenAI error:", errorText);
      return res.status(500).json({ error: "OpenAI request failed" });
    }

    const { choices } = await openaiRes.json();
    const resultText = choices[0].message.content;

    // Parse the result into JSON
    let trips;
    try {
      trips = JSON.parse(resultText);
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr, "\n<raw>", resultText);
      return res.status(500).json({ error: "Invalid JSON from AI" });
    }

    // Ensure we return an array with exactly one trip
    if (!Array.isArray(trips) || trips.length === 0) {
      return res
        .status(500)
        .json({ error: "AI did not return a valid trip array" });
    }

    // Return only the first trip in an array format for consistency
    return res.status(200).json({ result: [trips[0]] });
  } catch (err) {
    console.error("Generate handler error:", err);
    return res.status(500).json({ error: err.message });
  }
}
