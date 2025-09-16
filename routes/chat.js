import express from "express";
import createError from "http-errors";
import { pushHistory, getHistory } from "../redis/client.js";
import { embedTexts } from "../services/embedder.js";
import { qdrantSearch, buildPromptFromHits } from "../services/qdrant.js";
import { callLLM } from "../services/llm.js";
import { persistTranscript } from "../services/transcripts.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { sessionId, message, topK } = req.body;
    if (!sessionId || !message)
      throw createError(400, "sessionId and message required");

    const userMsg = { role: "user", text: message, ts: Date.now() };
    await pushHistory(sessionId, userMsg);

    const [embedding] = await embedTexts([message]);
    const hits = await qdrantSearch(embedding, topK);
    const prompt = buildPromptFromHits(hits, message);
    const finalAnswer = await callLLM(prompt);

    const assistantMsg = {
      role: "assistant",
      text: finalAnswer,
      ts: Date.now(),
    };
    await pushHistory(sessionId, assistantMsg);

    const history = await getHistory(sessionId);
    await persistTranscript(sessionId, history);

    console.log(finalAnswer);

    res.json({ answer: finalAnswer, sources: hits.map((h) => h.payload || h) });
  } catch (err) {
    next(err);
  }
});

export default router;
