import axios from "axios";
import { config } from "../config/index.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

function buildPrompt(query, contextPassages = []) {
  const context = contextPassages.map((p, i) => `(${i + 1}) ${p}`).join("\n\n");

  return `
You are a helpful AI assistant. Use the provided context to answer the question.

Context:
${context || "No context available."}

Question:
${query}

Answer:
Provide a detailed, clear, and well-structured answer. 
If the context does not contain the answer, respond with "I don’t know based on the provided context."
`;
}

export async function callLLM(query, retrievedPassages = []) {
  if (config.LLM_PROVIDER === "openai") {
    if (!config.LLM_API_KEY)
      throw new Error("LLM_API_KEY not set for openai provider");

    const body = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: buildPrompt(query, retrievedPassages) },
      ],
      max_tokens: 600,
    };

    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      body,
      {
        headers: { Authorization: `Bearer ${config.LLM_API_KEY}` },
      }
    );

    return res.data.choices?.[0]?.message?.content ?? "(no answer)";
  } else if (config.LLM_PROVIDER === "gemini") {
    console.log("using gemini");

    if (!config.LLM_API_KEY)
      throw new Error("LLM_API_KEY not set for gemini provider");

    const genAI = new GoogleGenerativeAI(config.LLM_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: buildPrompt(query, retrievedPassages) }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.3,
        topP: 0.9,
        topK: 40,
      },
    });

    return result.response.text() ?? "(no answer)";
  } else {
    const snippet = query.split("\n").slice(0, 20).join(" ").slice(0, 800);
    return `MOCK: Short answer based on context: ${snippet}`;
  }
}
