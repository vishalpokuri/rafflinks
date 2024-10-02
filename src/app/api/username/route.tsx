import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
//Not checking the uniqueness of the username here, will check later.
export const POST = async (req: NextRequest) => {
  try {
    const { username, walletAddress } = await req.json();
    //add user to db
    const user = await prisma.user.create({
      data: {
        username,
        walletAddress,
      },
    });
    return NextResponse.json({
      msg: "User created successfully",
      user,
    });
  } catch (err) {
    return NextResponse.json({
      msg: "Something unexpected happened",
      err: true,
      status: 500,
    });
  }
};
