const mongoose = require('mongoose');

const doneTaskSchema = new mongoose.Schema({
    content: String,
    date: Date,
    done: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model("DoneTask", doneTaskSchema);