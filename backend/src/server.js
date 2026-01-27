const express = require('express')
const app = express()
const connToDatabase = require('./db/database')
const routes = require('./routes');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
app.use(
  '/pictures',
  express.static(path.join(__dirname, '..', 'pictures'))
);

app.use(express.json())

async function startServer(){
    await connToDatabase()
    app.use('/api', routes)

    app.listen(5000, () => {
        console.log("Server started on  http://localhost:5000")
    })
}

startServer()