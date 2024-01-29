const express = require("express");
const app = express();
const indexRouter = require('./src/routes/index');
require('dotenv').config();

const port = process.env.PORT | 3000;

app.use("/api/v1",indexRouter);

app.listen(port,()=>{
    console.log('server running on: ',port);
})

