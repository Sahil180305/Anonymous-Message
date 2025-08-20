import dbConnect from "@/lib/dbConnection";
import UserModel from "@/models/User.model";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest } from "next/server";


export async function GET(request:NextRequest,{searchParams}:{searchParams:Promise<{ [key: string]: string | string[] | undefined }>}){
    await dbConnect();
    try {
        const username = (await searchParams).username;
        const queryParam = {username}
        const result = usernameValidation.safeParse(queryParam);
        if(!result.success){
            const usernameErrors = result.error.format().username?._error || [];
            return Response.json({
                success:false,
                message:usernameErrors?.length >0 ? usernameErrors.join(', '):"Invalid query parameter"
            },{status:401});
        }
        // const {username} = result.data;
        const existingVerifiedUser = await UserModel.findOne({username,isVerified:true});
        if(existingVerifiedUser){
            return Response.json({
                success:true,
                message:"Username already taken"
            },{status:400});
        }
        return Response.json({
            success:true,
            message:"Username is unique"
        },{status:200});
    } catch (error) {
        console.log("Error checking Username", error);
        return Response.json({
            success:false,
            message:"Error checking Username"
        },{status:500});
    }
}