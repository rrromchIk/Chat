const Task = require('../models/task');

async function getAllTasksByUserId(req, res) {
    console.log("taskController ### getAllTasksByUserId");

    try {
        const userId = req.params.id;
        
        const tasks = await Task.find({userId: userId});
        console.log(`taskController ### extracted {${tasks.length}} tasks for user id: ` + userId);

        res.status(201).json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
}

async function createTask(req, res) {
    console.log("taskController ### createTask");

    try {
        const task = req.body;
        const taskToStore = new Task(task);

        try {
            await taskToStore.save();
            
            console.log('taskController ### Task created successfully.');
            const createdTask = await Task.find({name: task.name});

            res.status(201).json({createdTask});
        } catch(exc) {
            res.status(201).json({message: "Task already exist"});
            console.log("taskController ### Task already exist");
        }
        
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.'});
      }
    
}

async function updateTask(req, res) {
    console.log("taskController ### udpateTask");

    const taskIdToUpdate = req.params.id;
    const newTask = req.body;

    try {
        const updatedTask = await Task.findByIdAndUpdate(taskIdToUpdate, newTask);
        console.log("Task updated succesfully. Updated task: " + JSON.stringify(updatedTask));
        res.status(201).json(newTask);
    } catch(exc) {
        res.status(500).json({ message: exc});
        console.log("Error while updating task: " + JSON.stringify(exc));
    }
}

module.exports = {
    getAllTasksByUserId,
    createTask,
    updateTask
}