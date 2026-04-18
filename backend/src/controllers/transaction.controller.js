const transactionModel = require("../models/transaction.model.js")
const userModel = require("../models/user.model.js")
const accountModel = require("../models/account.model.js");
const mongoose = require('mongoose');
const ledgerModel = require("../models/ledger.model");
const emailService = require('../services/mail.service.js')


//validate Request from client
async function createTransaction(req, res) {


    const { toAccount, amount, transactionId } = req.body

    if (!toAccount || !amount || !transactionId) {
        return res.status(400).json({
            mess: "All the required field must be filled"
        })
    }

    if (!mongoose.Types.ObjectId.isValid(toAccount)) {
        return res.status(400).json({
            message: "Invalid Reciever Account ID"
        });
    }


    const fromUserAccount = await accountModel.findOne({
        user: req.userId,
    })
    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    })

    const fromUserEmail = await userModel.findOne({
        _id: req.userId,
    })



    const toUserEmail = await accountModel.findById(toAccount).populate("user", "email");
    const receiverEmail = toUserEmail.user.email;

    if (!fromUserAccount || !toUserAccount) {
        return res.status(400).json({
            msg: "we can't find fromAccount or UserAccount"
        })
    }

    //validate TransactionId

    const isTransAlreadyExists = await transactionModel.findOne({
        transactionId: transactionId
    })

    if (isTransAlreadyExists) {

        if (isTransAlreadyExists.status === "COMPLETED") {

            return res.status(400).json({
                message: "Transaction already processed",
                transaction: isTransAlreadyExists,
            })

        }
        if (isTransAlreadyExists.status === "PENDING") {
            return res.status(400).json({
                message: "please wait while we processed the transaction"
            })
        }
        if (isTransAlreadyExists.status == "FAILED") {
            return res.status(400).json({
                message: "transaction processing faild , please retry"
            }
            )
        }
        if (isTransAlreadyExists.status == "REVERSED") {
            return res.status(400).json({
                message: "transaction reversed , please try again"

            })
        }

    }


    //check Account Status

    if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
        return res.status(400).json({
            message: "INACTIVE ACCOUNTS"
        })
    }

    // Checking the sender balance Sufficient or Unsufficient

    const balance = await fromUserAccount.getbalance();

    if (balance < amount) {
        return res.status(400).json({
            message: `Insufficient amount . current balance is ${balance} & requested amount is ${amount}`

        })
    }

    if (fromUserAccount._id.toString() === toUserAccount._id.toString()) {
        return res.status(400).json({
            message: "You cannot send money to yourself"
        });
    }

    /*
    session understanding (new Topic)
    */
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const [transaction] = await transactionModel.create([{
            fromAccount: fromUserAccount._id,
            toAccount,
            amount,
            transactionId,
            status: "PENDING"
        }], { session });

        await ledgerModel.create([{
            account: fromUserAccount._id,
            amount,
            transaction: transaction._id,
            type: "DEBIT"
        }], { session });


        await ledgerModel.create([{
            account: toAccount,
            amount,
            transaction: transaction._id,
            type: "CREDIT"
        }], { session });

        await transactionModel.findByIdAndUpdate(
            { _id: transaction._id },
            { status: "COMPLETED" },
            { session }
        )


        await session.commitTransaction();
        session.endSession();

        try {
            await Promise.all([
                emailService.sendTransactionMail(fromUserEmail.email, amount, balance),
                emailService.sendToTransactionMail(receiverEmail, amount)
            ]);
        } catch (mailError) {
            console.error("Email failed:", mailError.message);
        }
        return res.status(201).json({
            message: "Transaction successful",
            transaction
        });


    } catch (error) {

        await session.abortTransaction();
        session.endSession();

        return res.status(500).json({
            message: "Transaction failed",
            error: error.message
        });


    }


}


async function createInitialTransaction(req, res) {

    const { toAccount, amount, transactionId } = req.body;

    if (!toAccount || !amount || !transactionId) {
        return res.status(400).json({

            msg: "we cant find toaccount or amount or transaction id"
        })
    }

    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    })


    if (!toUserAccount) {
        return res.status(400).json({
            msg: "invaild toAccount"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        user: req.userId
    })

    if (!fromUserAccount) {
        return res.status(400).json({
            msg: "from user account not found !!!"
        })
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const transaction = new transactionModel({
            fromAccount: fromUserAccount._id,
            toAccount,
            amount,
            transactionId,
            status: "PENDING"
        });

        await transaction.save({ session });

        await ledgerModel.create([{
            account: fromUserAccount._id,
            amount: amount,
            transaction: transaction._id,
            type: "DEBIT"
        }], { session });

        await ledgerModel.create([{
            account: toAccount,
            amount: amount,
            transaction: transaction._id,
            type: "CREDIT"
        }], { session });

        await session.commitTransaction();
        session.endSession();


        res.status(200).json({
            msg: "completed the initiated funds to the account",
            transaction
        });

    } catch (error) {

        await session.abortTransaction();
        session.endSession();

        res.status(500).json({
            error: error.message
        });
    }

}




async function getTransactionHistory(req, res) {
    try {
        const account = await accountModel.findOne({ user: req.userId });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        const transactions = await transactionModel
            .find({
                $or: [
                    { fromAccount: account._id },
                    { toAccount: account._id }
                ]
            })
            .sort({ createdAt: -1 })
           



        const formattedTransactions = transactions.map((txn) => {



            let type;

            if (txn.fromAccount.toString() === account._id.toString()) {
                type = "DEBIT";
            } else {
                type = "CREDIT";
            }

            return {
                _id: txn._id,
                transactionId: txn.transactionId,
                amount: txn.amount,
                status: txn.status,
                createdAt: txn.createdAt,
                type: type
            };
        });


        res.status(200).json({
            transactions: formattedTransactions
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}





module.exports = { createTransaction, createInitialTransaction, getTransactionHistory }