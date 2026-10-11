import { Schema, model, Types } from "mongoose";

export interface ITask {
  title: string;
  description?: string | undefined;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  completed: boolean;
  module: Types.ObjectId;
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    priority: { type: String, enum: ["low", "medium", "high"], required: true },
    completed: { type: Boolean, default: false },
    module: { type: Schema.Types.ObjectId, ref: "Module", required: true }, // the link to a module
  },
  { timestamps: true }
);

export const TaskModel = model<ITask>("Task", taskSchema);