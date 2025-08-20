import { Message } from "@/models/User.model";

export interface ApiResponse{
    success : boolean;
    message: string;
    isAcceptingMeassage?:boolean;
    messages?:Array<Message>
}