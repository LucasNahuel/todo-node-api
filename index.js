const express = require('express');
const dotenv = require('dotenv');
const app = express();

//config dotenv to read environment variables from .env file
dotenv.config();


const port = process.env.PORT;


//initialize mongo driver, define database
const { MongoClient } = require('mongodb');

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



app.listen(port, ()=>{
    console.log(`todo api listening on port ${port}`);
});