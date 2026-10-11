import { ModuleModel } from "../models/modules.js";
import type { IModule } from "../models/modules.js";

export const getAllModules = () => ModuleModel.find();
export const getModuleById = (id: string) => ModuleModel.findById(id);
export const createModule = (data: IModule) => ModuleModel.create(data);
export const updateModuleById = (id: string, data: IModule) =>
  ModuleModel.findByIdAndUpdate(id, data, { new: true }); // new: true returns the updated version
export const deleteModuleById = (id: string) => ModuleModel.findByIdAndDelete(id);