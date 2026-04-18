const app = require("../app/app.js")
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const dotenv =require("dotenv")
dotenv.config();
const dbConnect = require('../db/db.js')
dbConnect();
app.listen(process.env.PORT,()=>{
    console.log("server is running on port ",process.env.PORT)
})

