const express = require("express");
const app = express();
const indexRouter = require('./src/routes/index');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT | 3000;


app.use(express.json());
app.use(cors());
app.use("/api/v1",indexRouter);

app.listen(port,()=>{
    console.log('server running on: ',port);
});

