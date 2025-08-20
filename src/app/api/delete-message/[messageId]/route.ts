import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/User.model";
import { User } from "next-auth";
import { NextRequest } from "next/server";



export async function DELETE(request:NextRequest,{params}:{params:Promise<{messageId:string}>}){
    await dbConnect();

    try {
        const session = await auth();
        const user : User = session?.user as User ;
        if(!session && !user){
            return Response.json({
                success:false,
                message:"Not Authenticated"
            },{status:401})
        }
    
        const {messageId} =await params;
    
        const updateResult=await UserModel.updateOne({_id:user._id},
            {$pull:{messages:{_id:messageId}}}
        );
    
        if(updateResult.modifiedCount===0){
            return Response.json({
                success:false,
                message:"Message not found or already deleted"
            },{status:401});
        }
        return Response.json({
            success:true,
            message:"Message deleted"
        },{status:200});
    
    } catch (error) {
        console.error("Error while deleting message ",error);
        return Response.json({
            success:false,
            message:"Error while deleting message"
        },{status:500});
    }
}