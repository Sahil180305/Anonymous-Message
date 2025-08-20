import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/User.model";
import mongoose from "mongoose";
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
        const _user = session.user;
        const userId = new mongoose.Types.ObjectId(_user._id);
    
        const user = await UserModel.aggregate([
            {$match:{_id:userId}},
            {$unwind:'$messages'},
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id:'$id',messages:{$push:'$messages'}}}
        ]).exec();
    
        if(!user || user.length === 0){
            return Response.json(
                {message:'User not found',success:false}
                ,{status:404}
            )
        }
        return Response.json({
            success:true,
            messages:user[0].messgaes,
        },{status:200});
    } catch (error) {
        console.log("Error occured while fetching the messages from database", error);
        return Response.json({
            success:false,
            message:"Error in fetching messages"
        },{status:500});
    }
}