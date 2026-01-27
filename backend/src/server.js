const express = require('express')
const app = express()
const sequelize = require('./db/database')
const routes = require('./routes');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

app.use(express.json())
app.use('/api', routes)

function startServer(){

    console.log('JWT_SECRET check:', process.env.JWT_SECRET)
    app.listen(5000, () => {
        console.log("Server started on  http://localhost:5000")
    })
}

startServer()