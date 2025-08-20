"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {useDebounceCallback} from 'usehooks-ts'
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
import { signUpValidation } from "@/schemas/signUpSchema"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ApiResponse } from "@/types/ApiResponse"
import Link from "next/link"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "@/auth"
export default function Page(){
    const [isSubmiting,setIsSubmiting] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver:zodResolver(signInSchema),
        defaultValues:{
            identifier:"",
            password:""
        }
    });

    const onSubmit = async (data : z.infer<typeof signInSchema>)=>{
        setIsSubmiting(true);
        const result =await signIn("credentials",{
            redirect:false,
            identifier:data.identifier,
            password:data.password
        })

        if(result?.error){
            if(result.error === 'CredentialsSignin'){
                toast("Login Failed", {
                    description:"Incorrect Username or Password",
                    action: {
                        label: "ok",
                        onClick: () => console.log("Login Failed")
                    },
                })
            }else{
                toast("Error", {
                    description:result.error,
                    action: {
                        label: "ok",
                        onClick: () => console.log("Login Failed")
                    },
                })
            }
        }
        if(result?.url){
            router.replace('/dashboard');
        }
    }

    
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Welcome Back to Anonymouse Feedback
                    </h1>
                    <p className="mb-4">Sign in to continue your secret conversations</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field}
                type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
                            )}
                        />
        <Button type="submit" className="w-full" disabled={isSubmiting}>{isSubmiting?(
            <>
            <Loader2 className="animate-spin"/>
            Please wait
    </>):('SignIn')}</Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
            </div>
        </div>
    )
}