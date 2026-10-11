import type { Request, Response } from "express";
import mongoose from "mongoose";
import { moduleInput } from "../validation/schemas.js";
import * as service from "../services/modules.js";

const validId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export const listModules = async (_req: Request, res: Response) => {
  res.status(200).json(await service.getAllModules());
};

export const getModule = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!validId(id)) { res.status(400).json({ message: "Invalid module id" }); return; }
  const found = await service.getModuleById(id);
  if (!found) { res.status(404).json({ message: "Module not found" }); return; }
  res.status(200).json(found);
};

export const addModule = async (req: Request, res: Response) => {
  const result = moduleInput.safeParse(req.body);   // check the data first
  if (!result.success) { res.status(400).json({ errors: result.error.issues }); return; }
  res.status(201).json(await service.createModule(result.data)); // 201 = created
};

export const editModule = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!validId(id)) { res.status(400).json({ message: "Invalid module id" }); return; }
  const result = moduleInput.safeParse(req.body);
  if (!result.success) { res.status(400).json({ errors: result.error.issues }); return; }
  const updated = await service.updateModuleById(id, result.data);
  if (!updated) { res.status(404).json({ message: "Module not found" }); return; }
  res.status(200).json(updated);
};

export const removeModule = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!validId(id)) { res.status(400).json({ message: "Invalid module id" }); return; }
  const deleted = await service.deleteModuleById(id);
  if (!deleted) { res.status(404).json({ message: "Module not found" }); return; }
  res.status(204).send(); // 204 = done, nothing to send back
};