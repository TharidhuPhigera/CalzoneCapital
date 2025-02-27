import { connect } from "/app/utils/db";
import User from "/app/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connect();
    const { email } = await req.json();
    const user = await User.findOne({ email }).select("_id");
    console.log("user: ", user);
    return NextResponse.json({ user });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
