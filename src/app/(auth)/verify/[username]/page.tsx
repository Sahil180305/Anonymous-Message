"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {toast} from "sonner"
import { Button } from "@/components/ui/button"
import axios,{AxiosError} from 'axios';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {Loader2} from 'lucide-react' 
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ApiResponse } from "@/types/ApiResponse"
import { verifyScheam } from "@/schemas/verifySchema"
export default function Page(){
    const [isSubmiting,setIsSubmiting] = useState(false);

    const router = useRouter();
    const form = useForm<z.infer<typeof verifyScheam>>({
        resolver:zodResolver(verifyScheam),
        defaultValues:{
            code:""
        }
    });
    const params = useParams<{username: string}>();



    const onSubmit = async (data : z.infer<typeof verifyScheam>)=>{
        setIsSubmiting(true);
        try {
            const response = await axios.post<ApiResponse>(`/api/verify-code`,{username:params.username,code:data});
            if(response.data.success){
                toast("Success", {
                    description:response.data.message,
                    action: {
                        label: "ok",
                        onClick: () => router.replace(`/sign-in`)
                    },
                })
            }else{
                toast("Verification  Failed", {
                    description:response.data.message,
                })
            }
        } catch (error) {
            console.error('Error during verify code',error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message || (`There was a problem with verifying. Please try again.`);
            toast("Failure", {
                description:errorMessage,
            })
        }
        finally{
            setIsSubmiting(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify your account
                    </h1>
                    <p className="mb-4">Enter the verification code sent to your email</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Verification Code</FormLabel>
                                <FormControl>
                                    <Input {...field}/>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isSubmiting}>{isSubmiting?(
                            <>
                                <Loader2 className="animate-spin"/>
                                Please wait
                            </>):('Verify Code')}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}