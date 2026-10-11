import { Router } from "express";
import { listTasks, getTask, addTask, editTask, removeTask } from "../controllers/tasks.js";

const router = Router();
router.get("/", listTasks);
router.post("/", addTask);
router.get("/:id", getTask);
router.put("/:id", editTask);
router.delete("/:id", removeTask);

export default router;