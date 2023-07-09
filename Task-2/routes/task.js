import {TaskModel,Category} from "../model/taskModel.js";
import express from "express";
const router=express.Router()


router.post('/tasks', async(req, res) => {
    try {
        const { title, description, categoryId } = req.body;
        
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
        const task = new TaskModel({ title, description, category: category._id  });
           const newTask=await task.save()
            res.status(201).json(newTask);
            console.log(`Data Inserted Successfully and data are: ${task}`)
          }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
  });

  
// Retrieve a list of all tasks
router.get('/tasks', async(req, res) => {
     await TaskModel.find().populate('category')
      .then((tasks) => {
        res.json(tasks);
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
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
router.put('/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, status, categoryId } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, description, status, category: category._id },
      { new: true }
    ).populate('category');

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
  

// Delete a task by its id
router.delete('/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;

    const removedTask = await Task.findByIdAndRemove(taskId).populate('category');

    if (!removedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Create a new category
router.post('/categories', async (req, res) => {
  try {
    const { name } = req.body;

    const category = new Category({ name });
    await category.save();
    res.status(201).json(category);
    console.log(`Catagory Added Successfullly and the catagory is name is: ${category.name}`)
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//get all Categories
router.get('/categories',async(req,res)=>{
try {
  const cate=await Category.find();
  res.json(cate)
} catch (error) {
  req.status(400).json({error:error.message});
}
})

// Retrieve a single category by its id
router.get('/categories/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a category by its id
router.put('/categories/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a category by its id
router.delete('/categories/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;

    const removedCategory = await Category.findByIdAndDelete(categoryId);

    if (!removedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Update associated tasks with a default category or remove them
    await TaskModel.updateMany({ category: categoryId }, { category: null });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


  export default router;