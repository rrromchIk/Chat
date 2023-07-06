const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },
    userId: String,
    status: String,
    name: {
        type: String,
        index: {
            unique: true,
            dropDups: true
        }
    },
    date: Date,
    description: String
});

const Task = mongoose.model("Task", taskSchema, "Tasks");

module.exports = Task;