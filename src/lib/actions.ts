"use server";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const checkUserExist = async (publicKey: string) => {
  try {
    console.log(publicKey);

    if (!publicKey) {
      return {
        err: true,
        msg: "Enter valid address",
        user: null,
      };
    }
    const data = await prisma.user.findUnique({
      where: {
        walletAddress: publicKey,
      },
    });

    if (!data) {
      return {
        msg: "User doesn't exist",
        err: false,
        user: null,
      };
    }
    return {
      msg: "User present",
      err: false,
      user: data,
    };
  } catch (err) {
    return {
      msg: "Something went wrong",
      err: true,
    };
  }
};
