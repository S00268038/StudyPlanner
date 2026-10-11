import type { Request, Response } from "express";
import mongoose from "mongoose";
import { taskInput } from "../validation/schemas.js";
import * as service from "../services/tasks.js";
import { ModuleModel } from "../models/modules.js";

const validId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export const listTasks = async (req: Request, res: Response) => {

  const filter: Record<string, unknown> = {};

  if (req.query.module) {
    const moduleId = String(req.query.module);
    if (!validId(moduleId)) { res.status(400).json({ message: "Invalid module id" }); return; }
    filter.module = moduleId;
  }

  if (req.query.priority) filter.priority = String(req.query.priority);

  if (req.query.completed) filter.completed = req.query.completed === "true";
  res.status(200).json(await service.getAllTasks(filter));
};

export const getTask = async (req: Request, res: Response) => {

  const id = String(req.params.id);
  if (!validId(id)) { res.status(400).json({ message: "Invalid task id" }); return; }

  const found = await service.getTaskById(id);
  if (!found) { res.status(404).json({ message: "Task not found" }); return; }
  res.status(200).json(found);
};

export const addTask = async (req: Request, res: Response) => {

  const result = taskInput.safeParse(req.body);
  if (!result.success) { res.status(400).json({ errors: result.error.issues }); return; }

  // the module this task points to must really exist
  if (!(await ModuleModel.findById(result.data.module))) {
    res.status(400).json({ message: "Module does not exist" }); return;
  }

  res.status(201).json(await service.createTask(result.data));
};

export const editTask = async (req: Request, res: Response) => {

  const id = String(req.params.id);
  if (!validId(id)) { res.status(400).json({ message: "Invalid task id" }); return; }

  const result = taskInput.safeParse(req.body);
  if (!result.success) { res.status(400).json({ errors: result.error.issues }); return; }

  const updated = await service.updateTaskById(id, result.data);
  if (!updated) { res.status(404).json({ message: "Task not found" }); return; }
  res.status(200).json(updated);
};

export const removeTask = async (req: Request, res: Response) => {

  const id = String(req.params.id);
  if (!validId(id)) { res.status(400).json({ message: "Invalid task id" }); return; }
  
  const deleted = await service.deleteTaskById(id);
  if (!deleted) { res.status(404).json({ message: "Task not found" }); return; }
  res.status(204).send();
};