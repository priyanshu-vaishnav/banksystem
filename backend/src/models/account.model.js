const mongoose = require('mongoose')
const ledgerModel = require('./ledger.model')
const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Account must be assosiated with user"],
        index: true,
    },
    status: {
        type: String,
        enum: {
            values: ["ACTIVE", "FROZEN", "DELETED"],
            message: "account should be ACITVE , FROZEN or CLOSED"
        },
        default: "ACTIVE"
    },
    currency: {
        type: String,
        required: [true, "currency is required for creating an account"],
        default: "INR"
    },
    phoneno: {
        type: String,
        required: [true, "Phone number is required for creating an account"],
        match: [/^\d{10}$/, "Phone number must be exactly 10 digits"]
    },

    address: {
        type: String,
        required: [true, "Address required before creating an account"],
        minlength: [5, "Address must be at least 5 characters"]
    },

    documentid: {
        type: String,
        required: [true, "Document ID is required"],
        match: [/^\d{12}$/, "Document ID must be exactly 12 digits"]
    }


}, { timestamps: true })

accountSchema.index({ user: 1, status: 1 })

accountSchema.methods.getbalance = async function () {

    const balanceData = await ledgerModel.aggregate([{ $match: { account: this._id } },
    {

        $group: {
            _id: null,
            totalDebit: {
                $sum: {
                    $cond:
                        [

                            { $eq: ["$type", "DEBIT"] },
                            "$amount",
                            0

                        ]
                }
            },
            totalCredit: {
                $sum: {
                    $cond: [
                        { $eq: ["$type", "CREDIT"] },
                        "$amount", 0
                    ]
                }
            }
        }

    }



        ,

    {
        $project: {
            _id: 0, balance: {
                $subtract: ["$totalCredit", "$totalDebit"]
            }
        }
    }])

    if (balanceData.length === 0) {
        return 0
    }

    return balanceData[0].balance

}

const accountModel = mongoose.model('account', accountSchema)
module.exports = accountModel;

