import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Message } from '@/models/User.model'
import { Trash } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/ApiResponse'

type MessageCardProbs = {
    message:Message;
    onMessageDelete:(messageId:string)=>void;
}

export default function MessageCard({message,onMessageDelete}:MessageCardProbs){
    const handleDeleteConfirm=async ()=>{
        try {
            const response = await axios.delete(`/delete-message/${message._id}`);
            if(response?.data?.success){
                onMessageDelete(message._id as string);
                toast("Success", {
                    description:response.data.message,
                    action: {
                        label: "ok",
                        onClick: () =>{}
                    },
                })
            }else{
                toast("Failure", {
                    description:response.data.message,
                    action: {
                        label: "ok",
                        onClick: () =>{}
                    },
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast("Error", {
                description:axiosError.response?.data?.message ?? "Failed to delete message",
                action: {
                    label: "ok",
                    onClick: () =>{}
                },
            })
        }
        
    }
    return (
        <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
        <CardTitle>{message.content}</CardTitle>
        <CardAction>
            <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive"><Trash/></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your message.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
        </CardAction>
        
        </div>
        <div>
            {
                new Date(message.createdAt).toLocaleDateString('en-US',{
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            }
        </div>

      </CardHeader>
    </Card>
    )
}