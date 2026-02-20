const accountModel = require('../models/account.model.js')
const transactionModel = require('../models/transaction.model.js')
const userModel = require('../models/user.model.js')
const ledgerModel = require('../models/ledger.model.js')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')


async function createAccount(req, res) {


  try {
    const { phoneno, address, documentid } = req.body
    const user = req.userId

    const isHavingAccount = await accountModel.findOne({ user: req.userId })

    if (isHavingAccount) {
      return res.status(400).json({
        message: "Cannot create account more than once"
      })
    }
    const account = await accountModel.create({
      user,
      phoneno,
      address, documentid

    })
    res.status(200).json({
      account,
      phoneno, address,
      documentid
    })
  } catch (err) {

    res.status(400).json(
      {
        message: err.message
      }
    )
  }


}

async function myAccount(req, res) {
  try {

    const account = await accountModel
      .findOne({ user: req.userId })
      .populate("user");   // ← yahi magic hai

    if (!account) {
      return res.status(404).json({ msg: "Account not found" });
    }

    const balance = await account.getbalance();

    res.status(200).json({
      account,
      balance
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}



async function findAccounts(req, res) {

  // URL se accountId lo
  // GET /api/account/getaccount/6996cf3f...
  const { accountId } = req.params;

  try {
    // DB me dhundho aur user ka naam email bhi saath lao
    const account = await accountModel.findById(accountId).populate("user", "name email");

    // Agar account mila hi nahi
    if (!account) {
      return res.status(404).json({
        message: "Account not found"
      });
    }

    // Mila toh bhej do
    res.status(200).json({
      account
    });

  } catch (err) {
    // Agar accountId ka format hi galat tha (invalid MongoDB ID)
    res.status(400).json({
      message: "Invalid account ID"
    });
  }
}


async function deleteAccount(req, res) {

  const userId = req.userId;
  const session = await mongoose.startSession();

  try {

    session.startTransaction();

    const account = await accountModel
      .findOne({ user: userId })
      .session(session);

    if (!account) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        message: "Account not found"
      });
    }

    if (account.status === "CLOSED") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Account already closed"
      });
    }



    await accountModel.updateOne(
      { _id: account._id },
      { $set: { status: "CLOSED", isDeleted: true } }
    ).session(session);

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Account closed successfully"
    });

  } catch (err) {

    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      message: "Something went wrong"
    });
  }
}

async function freezeAccount(req, res) {

  const userId = req.userId;

  try {

    const account = await accountModel.findOne({ user: userId });

    if (!account) {
      return res.status(404).json({
        message: "Account not found"
      });
    }

    if (account.status === "CLOSED") {
      return res.status(400).json({
        message: "Closed account cannot be frozen"
      });
    }

    if (account.status === "FROZEN") {
      return res.status(400).json({
        message: "Account already frozen"
      });
    }

    account.status = "FROZEN";
    await account.save();

    return res.status(200).json({
      message: "Account frozen successfully"
    });

  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong"
    });
  }
}

async function unfreezeAccount(req, res) {

  const userId = req.userId;

  try {

    const account = await accountModel.findOne({ user: userId });

    if (!account) {
      return res.status(404).json({
        message: "Account not found"
      });
    }

    if (account.status === "CLOSED") {
      return res.status(400).json({
        message: "Closed account cannot be reactivated"
      });
    }

    if (account.status === "ACTIVE") {
      return res.status(400).json({
        message: "Account is already active"
      });
    }

    if (account.status !== "FROZEN") {
      return res.status(400).json({
        message: "Invalid account state"
      });
    }

    account.status = "ACTIVE";
    await account.save();

    return res.status(200).json({
      message: "Account unfrozen successfully"
    });

  } catch (err) {

    return res.status(500).json({
      message: "Something went wrong"
    });
  }
}

async function deleteAccountPermanent(req, res) {

  const session = await mongoose.startSession();

  try {

    session.startTransaction();

    const account = await accountModel
      .findOne({ user: req.userId })
      .session(session);

    const balance = await account.getbalance();

    if (!account) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        message: "Account not found"
      });
    }

    if (balance > 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Balance must be 0 before deletion"
      });
    }

    // Delete account
    await accountModel.deleteOne({ _id: account._id }).session(session);

    // Delete transactions (if allowed)
    await transactionModel.deleteMany({
      $or: [
        { fromAccount: account._id },
        { toAccount: account._id }
      ]
    }).session(session);

    // Delete user
    await userModel.deleteOne({ _id: req.userId }).session(session);

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Account permanently deleted"
    });

  } catch (err) {

    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      message: "Something went wrong"
    });
  }
}




module.exports = { createAccount, myAccount, findAccounts, freezeAccount, deleteAccount, unfreezeAccount, deleteAccountPermanent }