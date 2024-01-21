import User from "/app/models/User";
import connect from "/app/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request: any) => {
  try {
    const { email, password } = await request.json();

    await connect();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return new NextResponse("Email is already in use", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return new NextResponse("User is registered", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Error registering user", { status: 500 });
  }
};
