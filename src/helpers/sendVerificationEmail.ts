import VerificationEmail from '../../emails/verificationEmail';
import { ApiResponse } from '@/types/ApiResponse';
import { resend } from '@/lib/resend';


export  async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
): Promise<ApiResponse>{
  try {
    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Anonymous Feedback || Verification code',
      react: VerificationEmail({username,otp:verifyCode}),
    });
    return {success:true,message:"Successfully sent verification email"}
  } catch (emailError) {
    console.error("Error in sending verification email ",emailError);
    return {success:false,message:"Failed to send verification email"}
  }
};