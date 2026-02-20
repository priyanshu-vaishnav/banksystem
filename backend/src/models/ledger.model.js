const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: true,
        index: true,
        immutable: true,
    }, 
    
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        required :true,
        index:true,
        immutable :true
    },
    type: {
        type: String,
        enum: ["DEBIT", "CREDIT"],
        required: true,
        immutable: true
    },

}, { timestamps: true });


//
// 🔒 Make Ledger Immutable (No Updates / No Deletes)
//

ledgerSchema.pre(
    [
        "updateOne",
        "updateMany",
        "findOneAndUpdate",
        "deleteOne",
        "deleteMany",
        "findOneAndDelete",
        "replaceOne",
        "findOneAndReplace",
    ],
    function () {
        throw new Error("Ledger entries cannot be modified or deleted");
    }
);

//
// 🚫 Prevent direct save modification (optional extra protection)
//


const ledgerModel = mongoose.model("ledger", ledgerSchema);

module.exports = ledgerModel;
