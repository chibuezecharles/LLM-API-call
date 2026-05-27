import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL_NAME = process.env.MODEL_NAME;

const BASE_API_URL = "https://openrouter.ai/api/v1/chat/completions";

if (!API_KEY) {
  console.error("Missing OPENROUTER_API_KEY in .env");
  process.exit(1);
}

if (!MODEL_NAME) {
  console.error("Missing MODEL_NAME in .env");
  process.exit(1);
}


const generateText = async (prompt) => {
  try {
    const response = await fetch(BASE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("API Error:", data);
      return;
    }

    return (
      data?.choices?.[0]?.message?.content ||
      "No response generated."
    );
  } catch (error) {
    console.error("Error calling OpenRouter API:", error.message);
  }
};

const main = async () => {
  const prompt = process.argv.slice(2).join(" ");

  if (!prompt) {
    console.log('Usage: node main.js "Your prompt here"');
    process.exit(1);
  }

  const result = await generateText(prompt);

  console.log("\nAI Response:\n");
  console.log(result);
};

main();