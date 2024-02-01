const express = require("express");
const router = express.Router();
const { z, Schema } = require("zod");
const jwt = require('jsonwebtoken')
const argon2 = require("argon2");
const User = require("../models/userSchema.model");
const {authMiddleware} = require("../middlewares/middleware");
const { trusted } = require("mongoose");
const bankAccount = require('../models/bankaccountSchema.model')

const signupBody = z.object({
    username: z.string().email(),
    firstname: z.string().min(1),
    lastname: z.string().min(1),
    password: z.string().min(6),
});

router.post("/signup", async (req, res) => {
    const userObj = req.body;
    const objd = signupBody.safeParse(userObj);
	
	if(objd.success){
		const validatedData = objd.data;
		const username = validatedData.username;
		const password = await argon2.hash(validatedData.password);
		const firstname = validatedData.firstname;
		const lastname = validatedData.lastname;

		const existinguser = await User.findOne({username:username});
		if(!existinguser){
			const user = await User.create({username,password,firstname,lastname});
			const balance = parseInt(Math.random()*100000);
			const userbankAccout = await bankAccount.create({id:user._id,balance:balance});
			const token = jwt.sign({"userid":user._id},process.env.JWT_SECRET);
			return res.send({"token":token});
		}
		else{
			return res.status(411).send("Email already used");
		}
	}
	else{
		return res.status(411).send("Invalid inputs");
	}

});
const signinBody = z.object({
	username:z.string().email(),
	password:z.string().min(6)
})
router.post("/signin",async (req, res) => {
	const{success} = signinBody.safeParse(req.body);
	if(!success)return res.send("incorrect inputs");

	const username = req.body.username;
	const password = req.body.password;
	const user = await User.findOne({username});
	if(user){
		const match = await argon2.verify(user.password, password);
		if(match){
			const token = jwt.sign({userid:user._id},process.env.JWT_SECRET);
			return res.json({
				message:"login successfully",
				token:token
			});
		}
		else return res.send("Incorrect password");
	}
	else return res.send("Username dosent exist");
})
const updateBody = z.object({
	password:z.string().min(6).optional(),
	firstname:z.string().optional(),
	lastname:z.string().optional()
})
router.put("/",authMiddleware,async (req, res)=>{
	try{
		const validatedData = updateBody.parse(req.body);
		if(validatedData.password){
			validatedData.password = await argon2.hash(validatedData.password);
		}
		const user = await User.findOneAndUpdate({_id:req.headers.userId},validatedData,{new: true});
		return res.json({message:"Updated successfully"});
	}
	catch(e){
		res.status(411).json({message:"Error while updating information"})
	}
})

router.get("/bulk",async (req,res)=>{
	const filter = req.query.filter;
	const users = await User.find({
		$or: [{firstname:{"$regex":filter}},{lastname:{"$regex":filter}}]
	})
	res.status(200).json({
		users: users.map(
			user => ({
				username:user.username,
				firstname:user.firstname,
				lastname:user.lastname,
				_id:user._id
			})
		)
	});
})

module.exports = router;
