import { resend } from "@/lib/resend";
import VerificationEmail from "@/../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verificationCode: string,
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: " Anonymous message | Verification code",
      react: VerificationEmail({ username, otp: verificationCode }),
    });

    return {
      success: true,
      message: "Verification email has been sent.",
    };
  } catch (emailError) {
    console.error("Error sending verification email : ", emailError);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
