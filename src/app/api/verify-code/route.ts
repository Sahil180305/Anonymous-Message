import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/User.model";
import { NextRequest } from "next/server";


export async function POST(request:NextRequest){
    await dbConnect();
    try {
        const {username , code} = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user =await UserModel.findOne({username:decodedUsername});
        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404});
        }
        const isCodeValid = code === user.verifyCode;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeValid && isCodeNotExpired){
            user.isVerified=true;
            await user.save();
            return  Response.json({
                success:true,
                message:"User verified successfully"
            },{status:200});
        }else if(!isCodeNotExpired){
            return Response.json({
                success:false,
                message:"Verification code has expired please sign-up again to get new code"
            },{status:401});
        }
        return Response.json({
            success:false,
            message:"Incorrect verification code"
        },{status:401});

        
    } catch (error) {
        console.log("Error verifying user",error);
        return Response.json({
            success:false,
            message:"Error verifying user"
        },{status:500});
    }
}