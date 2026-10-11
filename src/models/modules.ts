import { Schema, model } from "mongoose";

export interface IModule {
  name: string;
  code: string;
  lecturer: string;
  semester: number;
}

const moduleSchema = new Schema<IModule>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    lecturer: { type: String, required: true },
    semester: { type: Number, required: true },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

export const ModuleModel = model<IModule>("Module", moduleSchema);