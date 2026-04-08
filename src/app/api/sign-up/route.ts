import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const existingUserVerificationByUsername = await User.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerificationByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already in use.",
        },
        {
          status: 400,
        },
      );
    }

    const existingUserByEmail = await User.findOne({ email });
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exist with this email",
          },
          {
            status: 400,
          },
        );
      } else {
        existingUserByEmail.password = await bcrypt.hash(password, 10);
        existingUserByEmail.verifyCode = verificationCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new User({
        email,
        username,
        password: hashedPassword,
        verifyCode: verificationCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        message: [],
      });

      await newUser.save();
    }

    // send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verificationCode,
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        },
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email.",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.log("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Failed to register user",
      },
      {
        status: 500,
      },
    );
  }
}
