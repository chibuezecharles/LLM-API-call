require("dotenv").config();

const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL_NAME = process.env.MODEL_NAME;

const BASE_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/";

if (!API_KEY) {
  console.error("Missing OPENROUTER_API_KEY in .env");
  process.exit(1);
}

if (!MODEL_NAME) {
  console.error("Missing MODEL_NAME in .env");
  process.exit(1);
}

// generateText function 
const generateText = async(prompt) => {
  try {
    const response = await fetch(
      `${BASE_API_URL}${MODEL_NAME}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `API Error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated."
    );
  } catch (error) {
    console.error("Error calling Gemini API:", error.message);
    return null;
  }
}

//  CLI Usage
 
const main = async () => {
  const prompt = process.argv.slice(2).join(" ");

  if (!prompt) {
    console.log('Usage: node main.js "Your prompt here"');
    process.exit(1);
  }

  const result = await generateText(prompt);

  if (result) {
    console.log("\nAI Response:\n");
    console.log(result);
  }
}

main();