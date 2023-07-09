import mongoose from "mongoose";

const status = {
  pending : "Pending",
  completed : "Completed"
};

// Create a Task schema
const taskSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default:'Completed'
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    attachment: {
      type: String,
    },
    
  });


// Create a Category schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Category = mongoose.model('Category', categorySchema);
  
  const TaskModel = mongoose.model('Task', taskSchema);
  export {TaskModel,Category};