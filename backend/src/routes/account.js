const express = require("express");
const { authMiddleware } = require("../middlewares/middleware");
const bankAccount = require("../models/bankaccountSchema.model");
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

module.exports = router;