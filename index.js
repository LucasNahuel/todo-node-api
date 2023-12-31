const express = require('express');
const dotenv = require('dotenv');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');


//config dotenv to read environment variables from .env file
dotenv.config();


app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT;


//initialize mongo driver, define database
const { MongoClient, Collection } = require('mongodb');

//mongo connections properties
const username = process.env.ATLAS_USER;
const password = process.env.ATLAS_PASSWORD;
const clusterUrl = "cluster0.ypdud.mongodb.net";
const authMechanism = "DEFAULT";
const connectionString = `mongodb+srv://${username}:${password}@${clusterUrl}/?authMechanism=${authMechanism}`;

const client = new MongoClient(connectionString);

let conn;

let db;

async function runMongo(){
    conn = await client.connect();
}

runMongo().then(async function(){
        db = await conn.db("todo-db");
    }).catch(
    error => {
        console.log(error);
    }
);








//define endpoints for express

app.get('/', (req, res) => {
    res.send('todo api works!');
});




app.post('/createTask', (req, res) =>{

    async function createTask(){



        console.log(req.body);

        const newTask = req.body.task;

        taskCollection = await db.collection("task");

        let result = await taskCollection.insertOne(newTask);

        res.send(result).status(200);

    }

    createTask().catch( (error) => {
        console.log(error);
    });

});


app.get('/getTasks', (req, res) => {
    async function getTasks(){

        const user = req.body.user;

        const userCollection = await db.collection("user");

        const userFound = await userCollection.findOne({ username : user.username });

        const taskCollection = await db.collection("task");

        const tasksFound = await taskCollection.find({ user: userFound._id }).toArray();

        console.log(tasksFound);

        res.status(200).send({ value : tasksFound });
    }

    getTasks().catch((error) => {
        
        res.status(500).send("there was an error getting tasks : "+error);
        console.log(error);
    })
});


app.post('/registerUser', (req, res) => {


    async function registerUser(){
        
        userCollection = await db.collection("user");


        console.log(req.body);

        const user = req.body.user;

        console.log(user);

        const userSaved = await userCollection.insertOne(user);

        if(userSaved.acknowledge){
            res.status(200).send(userSaved);
        }
    }

    registerUser().catch(
        (error) => {
            console.log(error);
            res.status(500).send("there was an error registering user : "+error);
        }
    );
});


app.get("/usernameExists", (req, res) => {
    async function usernameExists(){


        const reqUsername = req.query.username;

        const userCollection = await db.collection("user");

        const userfound = await userCollection.findOne({ username : reqUsername });

        console.log(userfound);

        if(userfound._id){
            res.status(200).send(userfound);
        }

    }

    usernameExists().catch( (err) => {
        console.log(err);

        res.status(500).send("there was an error serching for username : "+err);
    })
});




app.listen(port, ()=>{
    console.log(`todo api listening on port ${port}`);
});