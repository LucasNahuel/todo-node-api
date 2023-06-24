const express = require('express');
const app = express();
const port = 4300;

app.get('/', (req, res) => {
    res.send('todo api works!');
});



app.listen(port, ()=>{
    console.log(`todo api listening on port ${port}`);
});