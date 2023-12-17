const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const {join} = require("path");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const port = 8000

const secret = "apiJeremyAuthentificator/2023/12/17"

const corsOptions = ({
    origin: "*",
    methods: [
        "PUT",
        "GET",
        "DELETE",
        "POST"
    ],
})


const app = express()
mongoose.connect("mongodb://127.0.0.1:27017/authentification")

const Auth = require("./auth").model
const Task = require("./tasks").model


app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors(corsOptions))

app.set("view" ,
    join(__dirname, "/view"))

app.get("/", (req, res) => {
    res.send("Welcome to Authentificator API")
})

app.post("/register", async (req, res) => {
    const auth = new Auth({
        email: req.body.email,
        password: req.body.password
    })
    try {
        const exists = await Auth.findOne({email: auth.email})
        if(exists == null){
            await auth.save();
            res.status(200).send("Success to register :"+JSON.stringify({"id": auth._id}))
        }
       else{
           res.status(400).send("This email already exists")
        }
    }
    catch(err){
        res.status(400).send("Failed to register :"+err)
    }
})

app.post("/login", async (req, res) => {
    const user = await Auth.findOne({email: req.body.email})
    if (user !== null) {
        if(req.body.email === user.email && req.body.password === user.password){
            const token = jwt.sign({username: user.email}, secret, {expiresIn: "5s"})
            console.log(token)
            res.status(200).json({token:token})
        }
    }
    else {
        res.status(400).send("Failed login")
    }
})

app.delete("/delete/:id",  async(req, res) => {
    try {
        const user = await Auth.findById(req.params.id)
        if (user) {
            await Auth.deleteOne({_id: req.params.id})
            console.log("User deleted")
            res.status(200).send("User deleted successfully")
        } else {
            console.log("Failed to find this user")
            res.status(404).send("Failed to find this user id :" + req.params.id)
        }
    }
    catch(err){
        console.log(err)
        res.status(500).send("Server Error")
    }
})

app.post("/task", async(req,res) => {
    try {
        const task = new Task({
            userId: req.body.userId,
            name: req.body.name,
        })
        await task.save()
        res.status(200).send(task.toDTO())
    }
    catch(err){
        res.status(400)
    }
})

app.put("/task/:id", async(req,res) => {
    try {
        const task = await Task.findById({_id: req.params.id})
        if (task !== null){
            task.name = req.body.name
            await task.save()
            res.status(200).send(task.toDTO())
        }
    }
    catch(err) {
        res.status(500).send("Unable to modify this task :"+err)
    }
})

app.delete("/task/:id", async (req,res) =>{
    try {
        const task = await Task.findById({_id: req.params.id})
        if(task !== null){
            res.status(200).send("Task deleted")
        }
        else{
            res.status(400).send("Unable to delete this task")
        }
    }
    catch (err) {
        res.status(500).send("Server error :"+err)
    }
} )

app.listen(port, function() {
    console.log(`Server is listening on port ${port}`)
})

