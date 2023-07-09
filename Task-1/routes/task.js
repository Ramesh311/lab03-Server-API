import TaskModel from "../model/taskModel.js";
import express from "express";

const router = express.Router();

router.post('/tasks', async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = new TaskModel({ title, description });
    const newTask = await task.save();
    res.status(201).json(newTask);
    console.log(`Data Inserted Successfully and data are: ${task}`);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await TaskModel.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, status } = req.body;
    const updatedTask = await TaskModel.findByIdAndUpdate(taskId, { title, description, status }, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const removedTask = await TaskModel.findByIdAndDelete(taskId);
    if (!removedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
