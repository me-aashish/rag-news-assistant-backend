import axios from "axios";
import { config } from "../config/index.js";

export async function qdrantSearch(vector, topK = config.TOP_K) {
  const payload = {
    vector,
    limit: topK,
    with_payload: true,
  };
  const res = await axios.post(
    `${config.QDRANT_URL}/collections/${config.QDRANT_COLLECTION}/points/search`,
    payload,
    { timeout: 60000 }
  );
  return res.data.result ?? res.data;
}

export function buildPromptFromHits(hits, userQuestion) {
  const contextParts = hits.map((h, idx) => {
    const payload = h.payload || {};
    const title = payload.title || payload.source || "unknown";
    const url = payload.url || "";
    const chunk = payload.chunk_text || payload.chunk || "";
    return `Passage ${idx + 1} — ${title} ${url ? `(${url})` : ""}:\n${chunk}`;
  });
  const context = contextParts.join("\n\n---\n\n");
  return `You are an assistant that answers using ONLY the context below. If the answer is not present, say "I don't know." Be concise and cite source titles.\n\nContext:\n${context}\n\nUser question:\n${userQuestion}\n\nAnswer:`;
}
