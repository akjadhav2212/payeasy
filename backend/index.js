const express = require("express");
const app = express();
const indexRouter = require('./src/routes/index');
const cors = require('cors');
const port = process.env.PORT | 3000;

require('dotenv').config();
require('./src/db/db');
app.use(express.json());
app.use(cors());
app.use("/api/v1",indexRouter);

app.listen(port,()=>{
    console.log('server running on: ',port);
});

