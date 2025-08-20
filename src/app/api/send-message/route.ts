import dbConnect from "@/lib/dbConnection";
import UserModel, { Message } from "@/models/User.model";
import { NextRequest } from "next/server";



export async function POST(request:NextRequest){
    dbConnect();
    try {
        const {username , content} = await request.json();
    
        const user =await  UserModel.findOne({username});
        
        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404});
        }
    
        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"User is not accepting the messages"
            },{status:403});
        }
    
        const newMessage = {content,createdAt:new Date()};
    
        user.messages.push(newMessage as Message);
        await user.save();
    
        return Response.json({
            success:true,
            message:"Meassage sent successfully"
        },{status:200});
    } catch (error) {
        console.log("Error adding messages", error);
        return Response.json({
            success:false,
            message:"Error adding messages"
        },{status:500});
    }
}