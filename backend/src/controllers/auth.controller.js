import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"



export const signup=async(req,res)=>{
   const {fullName,email,password}=req.body
  
   try {
    if(!fullName||!email||!password){
        return res.status(400).json({message:"All fields are required "})  
    }
    if(password.length<6){
      return res.status(400).json({message:"password must be at least 6 characters"})  
    }
    const user=await User.findOne({email})
    if(user){
        return res.status(400).json({ message:"Email  already exists"}) 
    }
    const salt= await bcrypt.genSalt(10);

    const hashedPassword=await bcrypt.hash(password,salt);
   
    const newUser= new User({
        fullName,
        email,
        password:hashedPassword
    })
   
    if(newUser){
    generateToken(newUser._id,res)
      await newUser.save()
      return res.status(201).json({
        _id:newUser._id,
        fullName:newUser.fullName,
        email:newUser.email,
        ProfilePic:newUser.ProfilePic
      })
    }else{
        return res.status(400).json({ message:"Invalid user data"}) 
    }
   } catch (error) {
    console.log("error in signup controllers"+error.message)
    res.status(500).json({message:"Internal server error"})
   }
}



export const login=async(req,res)=>{
    const {email,password}=req.body
  
   try {
    if(!email||!password){
        return res.status(400).json({message:"All fields are required "})  
    }
   
    const user=await User.findOne({email})
    if(!user){
        return res.status(400).json({ message:"Invalid credentials"}) 
    }
  
    const ispasswordCorrect=await bcrypt.compare(password,user.password)
   
    if(ispasswordCorrect){
    generateToken(user._id,res)
     
      return res.status(201).json({
        _id:user._id,
        fullName:user.fullName,
        email:user.email,
        ProfilePic:user.ProfilePic
      })
    }else{
        return res.status(400).json({ message:"Invalid credentials"}) 
    }
   } catch (error) {
    console.log("error in login controllers"+error.message)
    res.status(500).json({message:"Internal server error"})
   }
}


export const logout=(req,res)=>{
  try {
    res.cookie("jwt","",{maxAge:0})
    res.status(200).json({message:"logged out successfully"})
  } catch (error) {
    console.log("error in logout controllers"+error.message)
    res.status(500).json({message:"Internal server error"})
  }
    
}

export const updateProfile=async(req ,res)=>{
try {
  const {ProfilePic}=req.body
  const userId=req.user._id

  if(!ProfilePic){
    res.status(400).json({message:"Profile Picture is required"})
  }
  const uploadResponse=await cloudinary.uploader.upload(ProfilePic);
  const updatedUser= await User.findByIdAndUpdate(
    userId,
    {ProfilePic:uploadResponse.secure_url},
    {new:true}
  )

 return res.status(200).json(updatedUser);
} catch (error) {
  console.log('error in update profile : '+ error.message);
  res.status(500).json({message:"Internal server error"})
}
}

export const checkAuth=(req, res)=>{
  try {
    res.status(200).json(req.user)
  } catch (error) {
    console.log("error in checkAuth controllers"+error.message)
    res.status(500).json({message:"Internal server error"})
  }
}