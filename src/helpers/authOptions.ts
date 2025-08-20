import dbConnect from "@/lib/dbConnection"
import UserModel from "@/models/User.model"
import bcrypt from "bcryptjs"
import { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"


export const authOptions:NextAuthConfig  ={
    providers:[
        Credentials({
            credentials:{
                email:{},
                password:{}
            },

            async authorize(credentials :any):Promise<any>{
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email:credentials.email},
                            {username:credentials.email}
                        ]
                    })
                    if(!user){
                        throw new Error("No user found with this email or username")
                    }
                    if(!user.isVerified){
                        throw new Error("Please verify your account before login")
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password,user.password);
                    if(!isPasswordCorrect){
                        throw new Error("Incorrect Password")
                    }else{
                        return user;
                    }  
                } catch (error:any) {
                    throw new Error(error);
                }         
            }
        })
    ],
    secret:process.env.AUTH_SECRET,
    session:{
        strategy:"jwt"
    },
    pages:{
        signIn:'/sign-in'
    },
    callbacks:{
        async jwt({token,user}){
            if(user){
                token._id=user._id?.toString();
                token.isVerified = user.isVerified;
                token.username = user.username;
                token.isAcceptingMessages = user.isAcceptingMessages
            }
            return token;
        },
        async session({session,token}){
            if(token){
                session.user._id=token._id as string 
                session.user.isVerified=token.isVerified as string 
                session.user.isAcceptingMessages=token.isAcceptingMessages as string 
                session.user.username=token.username as string 
            }
            return session;
        }
    }
}