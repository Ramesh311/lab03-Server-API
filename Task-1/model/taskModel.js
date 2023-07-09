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
    
  });
  
  const TaskModel = mongoose.model('Task', taskSchema);
  export default TaskModel;