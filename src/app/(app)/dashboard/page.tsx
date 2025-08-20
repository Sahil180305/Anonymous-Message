'use client'
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import axios, { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { User } from 'next-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { toast } from 'sonner';
import { ApiResponse } from '@/types/ApiResponse';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, RefreshCcw } from 'lucide-react';
import MessageCard from '@/components/MessageCard';

export default function Page(){
    const [messages,setMessages] = useState([]);
    const [isLoading,setIsLoading] = useState(false);
    const [isSwitchLoading,setIsSwitchLoading] = useState(false);
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const {data:session} = useSession()
    const user :User= session?.user as User;
    if(!session || !session?.user){
        return(
            <div className='text-center mt-6'>
                <p>Please login to see your messages</p>
            </div>
        )
    }
    const profileUrl = `${baseUrl}/u/${user.username}`;

    const {register,setValue,getValues,watch} = useForm({
        resolver:zodResolver(acceptMessageSchema)
    });
    const acceptMessages=watch('acceptMessages');

    const fetchAcceptMessage=useCallback(async ()=>{
        setIsSwitchLoading(true);
        try {
            const response = await axios.get('/api/accept-messages');
            if(response?.data?.success){
                setValue("acceptMessages",response.data.isAcceptingMessage);
            }else{
                toast("Failed to get user info", {
                    description:response.data.message,
                    action: {
                        label: "ok",
                        onClick: () =>{}
                    },
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast("Error", {
                description:axiosError?.response?.data.message || 'Failed to retrive user Info',
                action: {
                    label: "ok",
                    onClick: () =>{}
                },
            })
        }
        finally{
            setIsSwitchLoading(false);
        }
    },[setIsSwitchLoading,setValue,toast]);

    const fetchMessages=useCallback(async (refresh:boolean=false)=>{
        setIsLoading(true);
        try {
            const response = await axios.get('/api/get-messages');
            if(response?.data?.success){
                setMessages(response.data.messages || []);
                if(refresh){
                    toast("Refrshed Messages", {
                    description:"Showing latest messages",
                    action: {
                        label: "ok",
                        onClick: () =>{}
                    },
                })
                }
            }else{
                toast("Failed", {
                    description:response.data.message,
                    action: {
                        label: "ok",
                        onClick: () =>{}
                    },
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast("Error", {
                description:axiosError?.response?.data.message || 'Failed to retrive messages',
                action: {
                    label: "ok",
                    onClick: () =>{}
                },
            })
        }
        finally{
            setIsLoading(false);
        }
    },[setIsLoading,setMessages,toast]);

    useEffect(()=>{
        if(session && session.user){
            fetchMessages();
            fetchAcceptMessage();
        }
    },[session,fetchMessages,fetchAcceptMessage,setValue,toast]);

    const handleSwitchChange=async()=>{
        try {
            const response = await axios.post(`/api/accept-messages`,{acceptMessages:!acceptMessages});
            if(response?.data?.success){
                setValue("acceptMessages",!acceptMessages);
            }
            toast("", {
                description:response.data.message,
                action: {
                    label: "ok",
                    onClick: () =>{}
                },
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast("", {
                description:axiosError?.response?.data.message || 'Failed to update message settings',
                action: {
                    label: "ok",
                    onClick: () =>{}
                },
            })
        }
    }

    const copyToClipBoard=()=>{
        navigator.clipboard.writeText(profileUrl);
        toast("URL copied", {
            description:"Profile URL has been copied to clipboard",
            action: {
                label: "ok",
                onClick: () =>{}
            },
        })
    }

    const onMessageDelete=(messageId:string)=>{
        setMessages(messages.filter((message)=>(message._id !== messsageId)));
    }

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl" >
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
            
            <div  className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
                <div className="flex items-center">
                    <input readOnly value={profileUrl} type="text" className='input input-bordered w-full p-2 mr-2' />
                    <Button onClick={copyToClipBoard}>Copy</Button>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <Switch 
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                {...register("acceptMessages")}
                disabled={isSwitchLoading}
                />
                <span className="ml-2" >Accept Message : {acceptMessages?"On":"Off"}</span>
            </div>
            <Separator className="my-4" />
            <div>
                <Button 
                onClick={(e)=>{
                    e.preventDefault;
                    fetchMessages(true);
                }}
                disabled={isLoading}
                className="mt-4"
                variant="outline"
                >
                    {isLoading?(
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ):(
                        <RefreshCcw className="h-4 w-4"/>
                    )}
                </Button>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {
                    messages.length > 0 ?
                    (messages.map((message)=>{
                            return <MessageCard
                            key={message._id}
                             message={message} onMessageDelete={onMessageDelete}></MessageCard>
                    })):(
                        <p>No messages to display</p>
                    )
                }
                </div>
            </div>
        </div>
    )
}