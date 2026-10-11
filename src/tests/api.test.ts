import { ModuleModel } from "../models/modules.js";
import { TaskModel } from "../models/tasks.js";

import "dotenv/config"; // Vitest doesn't load .env by itself
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";

const FAKE_ID = new mongoose.Types.ObjectId().toString(); // always a valid id that matches nothing

let moduleId: string;
let taskId: string;

beforeAll(async () => {
  // a separate test database, so your real test data is never touched
  await mongoose.connect(process.env.MONGO_URI as string, { dbName: "studyplanner_test" });
  await TaskModel.deleteMany({});   // start clean
  await ModuleModel.deleteMany({});
}, 30000);

afterAll(async () => {
  await TaskModel.deleteMany({});   // tidy up afterwards
  await ModuleModel.deleteMany({});
  await mongoose.disconnect();
});


describe("Modules", () => {
  const valid = { name: "Test Module", code: "TEST101", lecturer: "Dr Test", semester: 1 };


  it("POST valid data returns 201", async () => {
    const res = await request(app).post("/api/v1/modules").send(valid);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Test Module");
    moduleId = res.body._id; // saved for the later tests
  });


  it("POST invalid data returns 400", async () => {
    const res = await request(app).post("/api/v1/modules").send({ name: "", semester: 7 });

    expect(res.status).toBe(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it("GET all returns 200 and a list", async () => {
    const res = await request(app).get("/api/v1/modules");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });


  it("GET one that exists returns 200", async () => {
    const res = await request(app).get(`/api/v1/modules/${moduleId}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(moduleId);
  });


  it("GET one that doesn't exist returns 404", async () => {
    const res = await request(app).get(`/api/v1/modules/${FAKE_ID}`);
    expect(res.status).toBe(404);
  });


  it("GET with a badly formed id returns 400", async () => {
    const res = await request(app).get("/api/v1/modules/123");
    expect(res.status).toBe(400);
  });


  it("PUT valid data returns 200", async () => {
    const res = await request(app).put(`/api/v1/modules/${moduleId}`).send({ ...valid, lecturer: "Dr Changed" });

    expect(res.status).toBe(200);
    expect(res.body.lecturer).toBe("Dr Changed");
  });


  it("PUT on a module that doesn't exist returns 404", async () => {
    const res = await request(app).put(`/api/v1/modules/${FAKE_ID}`).send(valid);
    expect(res.status).toBe(404);
  });


  it("PUT with invalid data returns 400", async () => {
    const res = await request(app).put(`/api/v1/modules/${moduleId}`).send({ name: "" });
    expect(res.status).toBe(400);
  });
});


describe("Tasks", () => {
  const validTask = () => ({
    title: "Test task",
    description: "Testing",
    dueDate: "2026-11-01",
    priority: "high",
    module: moduleId, // a function, so it picks up the id created above
  });


  it("POST valid data returns 201", async () => {
    const res = await request(app).post("/api/v1/tasks").send(validTask());

    expect(res.status).toBe(201);
    expect(res.body.completed).toBe(false); // the default
    taskId = res.body._id;
  });


  it("POST invalid data returns 400", async () => {
    const res = await request(app).post("/api/v1/tasks").send({ title: "", priority: "banana" });
    expect(res.status).toBe(400);
  });


  it("POST for a module that doesn't exist returns 400", async () => {
    const res = await request(app).post("/api/v1/tasks").send({ ...validTask(), module: FAKE_ID });
    expect(res.status).toBe(400);
  });


  it("GET all returns 200 and a list", async () => {
    const res = await request(app).get("/api/v1/tasks");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });


  it("GET with a filter only returns matching tasks", async () => {
    await request(app).post("/api/v1/tasks").send({ ...validTask(), title: "Low one", priority: "low" });
    const res = await request(app).get("/api/v1/tasks?priority=low");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].priority).toBe("low");
  });


  it("GET one that exists returns 200", async () => {
    const res = await request(app).get(`/api/v1/tasks/${taskId}`);
    expect(res.status).toBe(200);
  });


  it("GET one that doesn't exist returns 404", async () => {
    const res = await request(app).get(`/api/v1/tasks/${FAKE_ID}`);
    expect(res.status).toBe(404);
  });


  it("PUT valid data returns 200", async () => {
    const res = await request(app).put(`/api/v1/tasks/${taskId}`).send({ ...validTask(), completed: true });

    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });


  it("PUT on a task that doesn't exist returns 404", async () => {
    const res = await request(app).put(`/api/v1/tasks/${FAKE_ID}`).send(validTask());
    expect(res.status).toBe(404);
  });


  it("PUT with invalid data returns 400", async () => {
    const res = await request(app).put(`/api/v1/tasks/${taskId}`).send({ title: "" });
    expect(res.status).toBe(400);
  });


  it("DELETE returns 204, then the task is gone", async () => {

    const res = await request(app).delete(`/api/v1/tasks/${taskId}`);
    expect(res.status).toBe(204);

    const again = await request(app).get(`/api/v1/tasks/${taskId}`);
    expect(again.status).toBe(404);
  });

  it("DELETE on a task that doesn't exist returns 404", async () => {
    const res = await request(app).delete(`/api/v1/tasks/${FAKE_ID}`);
    expect(res.status).toBe(404);
  });
});


describe("Module delete", () => {
  it("DELETE returns 204", async () => {
    const res = await request(app).delete(`/api/v1/modules/${moduleId}`);
    expect(res.status).toBe(204);
  });

  
  it("DELETE on a module that doesn't exist returns 404", async () => {
    const res = await request(app).delete(`/api/v1/modules/${FAKE_ID}`);
    expect(res.status).toBe(404);
  });
});