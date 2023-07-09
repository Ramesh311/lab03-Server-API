import {TaskModel,Category} from "../model/taskModel.js";
import express from "express";
import path from "path";
import multer from "multer"
const router=express.Router()

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}_${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Create a new task with file attachment
router.post('/tasks', upload.single('attachment'), async (req, res) => {
  try {
    const { title, description, categoryId,attachment } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const task = new TaskModel({ title, description, category: category._id,attachment });

    if (req.file) {
      task.attachment = req.file.filename;
    }

    await task.save();

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Retrieve a list of all tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await TaskModel.find().populate('category');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve a single task by its id
router.get('/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await TaskModel.findById(taskId).populate('category');
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a task by its id
router.put('/tasks/:id', upload.single('attachment'), async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, status, categoryId } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const updatedTask = await TaskModel.findById(taskId);
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    updatedTask.title = title;
    updatedTask.description = description;
    updatedTask.status = status;
    updatedTask.category = category._id;

    if (req.file) {
      updatedTask.attachment = req.file.filename;
    }

    await updatedTask.save();

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a task by its id
router.delete('/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;

    const removedTask = await TaskModel.findByIdAndRemove(taskId);

    if (!removedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve and download task attachments
router.get('/tasks/:id/attachment', async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (!task.attachment) {
      return res.status(404).json({ error: 'Task attachment not found' });
    }

    const filePath = path.join(__dirname, 'uploads', task.attachment);
    res.download(filePath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




  export default router;