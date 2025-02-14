const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    content: String,
    date: Date,
    done: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("Task", taskSchema);