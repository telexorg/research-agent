import express from "express";
import { getAgentCard } from "../utils/agentCard";

const router = express.Router();

router.get("/", (_, res) => {
  const card = getAgentCard();
  res.json(card);
});

export default router;
