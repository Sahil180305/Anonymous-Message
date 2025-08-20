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
export default function Page(){
    const [isSubmiting,setIsSubmiting] = useState(false);
    const [username,setUsername] = useState('');
    const [usernameMessage , setUsernameMessage] = useState('');
    const [isCheckingUsername,setIsCheckingUsername] = useState(false)

    const debounced = useDebounceCallback(setUsername,300);
    const router = useRouter();

    const form = useForm<z.infer<typeof signUpValidation>>({
        resolver:zodResolver(signUpValidation),
        defaultValues:{
            username:"",
            email:"",
            password:""
        }
    });

    useEffect(()=>{
        const checkUsernameUnique = async()=>{
            if(username){
                setIsCheckingUsername(true);
                setUsernameMessage('');
               try {
                 const response = await axios.get<ApiResponse>(`/api/check-username-unique`);
                 if(response.data.success){
                     setUsernameMessage(response.data.message);
                 }
               } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMessage(axiosError.response?.data.message ?? 'Error checking username')
                }
                finally{
                    setIsCheckingUsername(false);
                }
            }
        }
        checkUsernameUnique();
    },[username])

    const onSubmit = async (data : z.infer<typeof signUpValidation>)=>{
        setIsSubmiting(true);
        try {
            const response = await axios.post<ApiResponse>(`/api/sign-up`,data);
            if(response.data.success){
                toast("Success", {
                    description:response.data.message,
                    action: {
                        label: "ok",
                        onClick: () => router.replace(`/verify/${username}`)
                    },
                })
            }else{
                toast("Failure", {
                    description:response.data.message,
                })
            }
        } catch (error) {
            console.error('Error during sign-up',error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message || (`There was a problem with your sign-up. Please try again.`);
            toast("Failure", {
                description:errorMessage,
            })
        }
        finally{
            setIsSubmiting(false);
        }
    }

    
    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-gray-800">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                            Join Mystery Message
                        </h1>
                        <p className="mb-4">Sign up to start your anonymous adventure</p>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        {/* <> */}
                                            <Input {...field}
                                            onChange={(e)=>{
                                                field.onChange(e);
                                                debounced(e.target.value);
                                            }}
                                            />
                                            {/* {isCheckingUsername && <Loader2 className="animate-spin" />}
                                            {!isCheckingUsername && usernameMessage && <p className={`text-sm ${usernameMessage === 'Username is unique' ? 'text-green-500':`text-red-500`}`}>{usernameMessage}</p>} */}
                                        {/* </> */}
                                    </FormControl>
                                        {isCheckingUsername && <Loader2 className="animate-spin" />}
                                        {!isCheckingUsername && usernameMessage && <p className={`text-sm ${usernameMessage === 'Username is unique' ? 'text-green-500':`text-red-500`}`}>{usernameMessage}</p>}
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field}
                                        type="email"
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
                                </>):('Sign Up')}
                            </Button>
                        </form>
                    </Form>
                    <div className="text-center mt-4">
                        <p>
                            Already a member?{' '}
                            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                            Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}