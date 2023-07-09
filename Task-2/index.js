import express from "express";
import Routes from "./routes/task.js"
import Connectdb from "./db/Connect.js";
import bodyParser from "body-parser";
const app=express();
app.use(express.json())

const port=2000;
const Uri="mongodb://127.0.0.1:27017"


//Database Conection 
 Connectdb(Uri)

 //Defining Routes
app.use('/',Routes)

// app.use(bodyParser.json())
// app.use(express.urlencoded({ extended: true}));

app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port} `)
})