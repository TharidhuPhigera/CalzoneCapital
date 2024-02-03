import { connect } from "/app/utils/db";
import User from "/app/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password, firstName, lastName, dob, phoneNumber } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    await connect();

    await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      dob,
      phoneNumber,
    });

    if (!req.session) {
      req.session = {};
    }
    req.session.user = { email, firstName, lastName, dob, phoneNumber };
    console.log('User session:', req.session.user);

    return NextResponse.json({ message: "User registered." }, { status: 201 });
  } catch (error) {
    console.error('Error during registration:', error);
    
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}
