import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: Number(process.env.BACKEND_PORT || 3000),
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  REDIS_URL: process.env.REDIS_URL || "redis://redis:6379",
  SESSION_TTL_SECONDS: Number(process.env.SESSION_TTL_SECONDS || 604800),
  QDRANT_URL: process.env.QDRANT_URL || "http://qdrant:6333",
  QDRANT_COLLECTION: process.env.QDRANT_COLLECTION || "news",
  EMBEDDER_URL: process.env.EMBEDDER_URL || "http://embedder:8000",
  TOP_K: Number(process.env.TOP_K || 5),
  LLM_PROVIDER: process.env.LLM_PROVIDER || "mock",
  LLM_API_KEY: process.env.LLM_API_KEY || "",
  PERSIST_TRANSCRIPTS:
    (process.env.PERSIST_TRANSCRIPTS || "false").toLowerCase() === "true",
  POSTGRES_URL: process.env.POSTGRES_URL || "",
};
