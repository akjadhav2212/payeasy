const express = require("express");
const { authMiddleware } = require("../middlewares/middleware");
const bankAccount = require("../models/bankaccountSchema.model");
const { default: mongoose } = require("mongoose");
const router = express.Router();

router.get("/balance",authMiddleware,async (req,res)=>{
    const userid = req.headers.userId;
    const account =await bankAccount.findOne({id:userid});
    if(account){
        return res.json({
            "balance":account.balance
        })
    }
    return res.send("no bank account");
})
router.post("/transfer",authMiddleware,async (req, res)=>{
    const session = await mongoose.startSession();
    session.startTransaction();
    const {amount, to} = req.body;
    const userId = req.headers.userId;
    const account = await bankAccount.findOne({id:userId}).session(session);
    if(account.balance < amount){
        await session.abortTransaction();
        return res.json({
            "message":"Insufficient balance"
        });
    }
    const toaccount = await bankAccount.findOne({id:to}).session(session);
    if(!toaccount){
        await session.abortTransaction();
        return res.json({
            "message":"Incorrect account"
        })
    }
    await bankAccount.updateOne({id:userId},{$inc:{balance:-amount}}).session(session);
    await bankAccount.updateOne({id:to},{$inc:{balance:amount}}).session(session);
    session.commitTransaction();
    res.json({
        "message":"Transfer successfully"
    })
})
module.exports = router;