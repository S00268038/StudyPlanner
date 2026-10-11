import { TaskModel } from "../models/tasks.js";
import { taskInput } from "../validation/schemas.js";
import type { z } from "zod";

type TaskData = z.infer<typeof taskInput>;

export const getAllTasks = (filter: Record<string, unknown>) =>
  TaskModel.find(filter).sort({ dueDate: 1 }); // earliest due date first
export const getTaskById = (id: string) => TaskModel.findById(id);
export const createTask = (data: TaskData) => TaskModel.create(data);
export const updateTaskById = (id: string, data: TaskData) =>
  TaskModel.findByIdAndUpdate(id, data, { new: true });
export const deleteTaskById = (id: string) => TaskModel.findByIdAndDelete(id);