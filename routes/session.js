import express from "express";
import { v4 as uuidv4 } from "uuid";
import { getHistory, clearHistory } from "../redis/client.js";

const router = express.Router();

router.post("/new", async (req, res) => {
  const sessionId = uuidv4();
  await clearHistory(sessionId); 
  res.json({ sessionId });
});

router.get("/:id/history", async (req, res, next) => {
  try {
    const history = await getHistory(req.params.id);
    res.json({ sessionId: req.params.id, history });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/clear", async (req, res, next) => {
  try {
    await clearHistory(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
