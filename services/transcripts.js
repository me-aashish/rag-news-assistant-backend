import { Pool } from "pg";
import { config } from "../config/index.js";

let pgPool = null;
if (config.PERSIST_TRANSCRIPTS && config.POSTGRES_URL) {
  pgPool = new Pool({ connectionString: config.POSTGRES_URL });
  console.log("Postgres persistence enabled.");
}

export async function persistTranscript(sessionId, history) {
  if (!pgPool) return;
  const client = await pgPool.connect();
  try {
    const now = new Date();
    await client.query(
      `INSERT INTO transcripts (session_id, created_at, transcript) VALUES ($1, $2, $3)`,
      [sessionId, now, JSON.stringify(history)]
    );
  } finally {
    client.release();
  }
}
