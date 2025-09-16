import axios from "axios";
import { config } from "../config/index.js";

export async function embedTexts(texts) {
  const res = await axios.post(
    `${config.EMBEDDER_URL}/embed`,
    { texts },
    { timeout: 60000 }
  );
  return res.data.embeddings;
}
