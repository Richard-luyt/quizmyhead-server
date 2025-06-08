export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!prompt || !apiKey) {
    return res.status(400).json({ error: "Missing prompt or GEMINI_API_KEY" });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const geminiRes = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  const data = await geminiRes.json();

  if (!data.candidates || !data.candidates[0]) {
    return res.status(500).json({ error: "No valid response from Gemini", raw: data });
  }

  res.status(200).json({ result: data.candidates[0].content.parts[0].text });
}
