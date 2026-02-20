const mongoose = require("mongoose");

async function dbConnect() {
    await mongoose.connect(process.env.DB_URL).then(()=>{
        console.log("DB connected")
    }).catch((err)=>{
        console.log(err);
        process.exit(1)
    })
  
}

module.exports = dbConnect;