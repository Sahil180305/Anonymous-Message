import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/User.model";
import { NextRequest } from "next/server";


export async function GET(request:NextRequest){
    dbConnect()
    try {
        const session = await auth();
        if(!session || !session.user){
            return Response.json({
                success:false,
                message:"Not Authenticated"
            },{status:401});
        }
        const user = session?.user;
        const foundUser = await UserModel.findById(user._id);
        if(!foundUser){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404});
        }
        return Response.json({
            success:true,
            isAcceptingMessage:foundUser.isAcceptingMessage,
        },{status:200});
    } catch (error) {
        console.log("Failed to get user status of get mesages", error);
        return Response.json({
            success:false,
            message:"Failed to get user status of get mesages"
        },{status:500});
    }
}

export async function POST(request:NextRequest){
    dbConnect()
    try {
        const session = await auth();
        if(!session || !session.user){
            return Response.json({
                success:false,
                message:"Not Authenticated"
            },{status:401});
        }
        const user = session?.user;
        const {acceptMessages} = await request.json();
        const updatedUser = await UserModel.findByIdAndUpdate(user._id,{isAcceptingMessage:acceptMessages},{new:true});
        if(!updatedUser){
            return Response.json({
                success:false,
                message:"Failed to update user status to accept messages"
            },{status:401});
        }
        return Response.json({
            success:true,
            message:"Message acceptance status updated successfully",
            updatedUser
        },{status:200});
    } catch (error) {
        console.log("Failed to get user status of get mesages", error);
        return Response.json({
            success:false,
            message:"Failed to update user status to accept mesages"
        },{status:500});
    }
}