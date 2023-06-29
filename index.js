const express = require('express');
const dotenv = require('dotenv');
const app = express();
const bodyParser = require('body-parser');


//config dotenv to read environment variables from .env file
dotenv.config();


app.use(bodyParser.json());

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

runMongo().then(()=>{
        db = conn.db("todo-db");
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

        const newTask = req.body.task;

        taskCollection = await db.collection("task");

        let result = await taskCollection.insertOne(newTask);

        res.send(result).status(200);

    }

    createTask().catch( (error) => {
        console.log(error);
    });

});


app.listen(port, ()=>{
    console.log(`todo api listening on port ${port}`);
});