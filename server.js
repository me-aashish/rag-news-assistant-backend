import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { config } from "./config/index.js";

import sessionRoutes from "./routes/session.js";
import chatRoutes from "./routes/chat.js";

import { pushHistory, getHistory } from "./redis/client.js";
import { embedTexts } from "./services/embedder.js";
import { qdrantSearch, buildPromptFromHits } from "./services/qdrant.js";
import { callLLM } from "./services/llm.js";
import { persistTranscript } from "./services/transcripts.js";

const app = express();
app.use(cors());
app.use(express.json());

// REST APIs
app.use("/rag/api/v1/session", sessionRoutes);
app.use("/rag/api/v1/chat", chatRoutes);

// Socket.IO for chat
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origins: "*:*" },
});

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on("chat", async ({ sessionId, message, topK }) => {
    try {
      if (!sessionId || !message) {
        socket.emit("error", { msg: "sessionId and message required" });
        return;
      }

      await pushHistory(sessionId, {
        role: "user",
        text: message,
        ts: Date.now(),
      });
      const [embedding] = await embedTexts([message]);
      const hits = await qdrantSearch(embedding, topK);
      const prompt = buildPromptFromHits(hits, message);
      const finalAnswer = await callLLM(prompt);

      const chunkSize = 50;
      for (let i = 0; i < finalAnswer.length; i += chunkSize) {
        socket.emit("bot.token", {
          token: finalAnswer.slice(i, i + chunkSize),
        });
        await new Promise((r) => setTimeout(r, 40));
      }

      await pushHistory(sessionId, {
        role: "assistant",
        text: finalAnswer,
        ts: Date.now(),
      });
      socket.emit("bot.done", {
        text: finalAnswer,
        sources: hits.map((h) => h.payload || h),
      });

      const history = await getHistory(sessionId);
      await persistTranscript(sessionId, history);
    } catch (err) {
      console.error("socket chat error", err);
      socket.emit("error", { msg: err.message });
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "internal error" });
});

httpServer.listen(config.PORT, () =>
  console.log(`Backend running on port ${config.PORT}`)
);
