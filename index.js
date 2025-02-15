require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

const Task = require('./models/task');
const DoneTask = require('./models/doneTask');

const mongoose = require('mongoose');
mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('Connected to mongodb')
})


app.get('/tasks',async  (req, res) => {
    const result = await Task.find({})
    res.json(result)
})

app.get('/tasks/:id', async (req, res) => {
    const id = req.params.id;
    const task = await Task.findById(id);
    res.json(task)
})

app.get('/doneTasks', async (req, res) => {
    const result = await DoneTask.find({});
    res.json(result)
})


app.post('/tasks', async (req, res) => {
    const task = new Task({
        content: req.body.content,
        date: req.body.date,
    })
    await task.save();
    io.emit('taskAdded', task);
    res.status(201).json(task)

})

app.post('/doneTasks', async (req, res) => {
    const doneTask = new DoneTask({
        _id: req.body._id,
        content: req.body.content,
        date: req.body.date,
        done: true
    })
    await doneTask.save();
    io.emit('taskDone', doneTask);
    res.status(200).json(doneTask)
})

app.delete('/tasks/:id', async (req, res) => {
    const id = req.params.id;
    const result = await Task.findByIdAndDelete(id);
    if(result) {
        res.status(200).json(result)
    }
    else {
        res.status(404).end()
    }
})
app.delete('/doneTasks/:id', async (req, res) => {
    const id = req.params.id;
    const result = await DoneTask.findByIdAndDelete(id);
    if(result) {
        io.emit('clearDoneTasks')
        res.status(200).json(result)
    }
    else res.status(404).end()
})

const http = require('http');
const server = http.createServer(app);

const {Server} = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: "*",
    }
})

io.on('connection', (socket) => {
    console.log("new client connected", socket.id);

    socket.on('disconnect', () => {
        console.log('client disconnected', socket.id);
    })
})

const PORT = 3001;

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})