//express init
const express = require ('express');
const app = express();

// middlewares init
const bodyParser = require('body-parser');
const cors = require('cors');

// mongoose init
const mongoose = require('mongoose');

//express routes init
const todoRoutes = express.Router();

//port
const PORT = 4000;

//importing the database schema for todo
let Todo = require('./todo.model');

//use the middlewares
app.use(cors());
app.use(bodyParser.json());

//Connection setup to mongoDB
mongoose.connect('mongodb://localhost/todos',{useNewUrlParser:true});
const connection = mongoose.connection;


connection.once('open', function(){
    console.log("MongoDB connection is on!");
})


//making the routes 
todoRoutes.route('/').get(function(req,res){
    Todo.find(function(err,todos){
        if(err)
        {
            console.log(err);
        }
        else{
            res.json(todos);
        }
    });
});

todoRoutes.route('/:id').get(function(req,res){
    let id = req.params.id;
    Todo.findById(id,function(err,todo){
        if(err)
        {
            console.log(err);
        }
        else{
            res.json(todo);
        }
    });
});

todoRoutes.route('/add').post(function(req,res){
    let todo = new Todo(req.body);
    todo.save()
    .then(todo=>{
        res.status(200).send("Todo added Succesfullly");
    })
    .catch(err =>{
        res.status(400).send("Adding new todo failed");
    })
});

todoRoutes.route('/update/:id').post(function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send('data is not found');
        else
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            todo.save().then(todo => {
                res.send(todo);

            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

app.use('/todos', todoRoutes);
//listen to server
app.listen(PORT,(req,res) => {
    // res.sent("Hello world");
    console.log("Server started at " + PORT);
})

