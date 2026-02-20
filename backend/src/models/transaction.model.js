const mongoose = require("mongoose");

const tscSchema =new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        index :true
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        index:true
    },

    status: {
        type: String,
        enum: {
            values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
            default: "PENDING"

        }

    },                                                                                 
    amount:{
        type:Number,
        required:true,
        min :0                               
    },
    transactionId: {
        type: String,
        required: true,
        index:true,
        unique:true

    },
    


}, { timestamps: true })


const transactionModel = mongoose.model("transaction", tscSchema);

module.exports = transactionModel;