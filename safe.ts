import {
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  MEMO_PROGRAM_ID,
} from "@solana/actions";
import {
  clusterApiUrl,
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

export const GET = async (req: Request) => {
  console.log(req);
  const payload: ActionGetResponse = {
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLjRzgecAbQoFNztoEi8G5fmZJHwoE2FhPig&s",
    label: "Enter Raffle",
    description: "This is a super simple action",
    title: "Rafflinks Demo #1",
    disabled: false,
    error: {
      message: "Unable to fetch data",
    },
  };
  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  });
};

export const OPTIONS = GET;

export const POST = async (req: Request) => {
  try {
    const body: ActionPostRequest = await req.json();

    //check if its a correct pubkey or not
    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (error) {
      return new Response("Invalid account provided", {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const transaction = new Transaction();
    transaction.add(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 1000,
      }),
      new TransactionInstruction({
        programId: new PublicKey(MEMO_PROGRAM_ID),
        data: Buffer.from("Successfully entered raffle", "utf8"),
        keys: [],
      })
    );

    transaction.feePayer = account;
    const connection = new Connection(clusterApiUrl("devnet"));
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash({ commitment: "finalized" })
    ).blockhash;

    const payload: ActionPostResponse = await createPostResponse({
      fields: { transaction, message: "Successfully implemented!" },
    });

    return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });
  } catch (error) {
    Response.json({
      msg: error,
      status: 400,
    });
  }
};

/////////////////////////
import {
  ActionError,
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createActionHeaders,
  createPostResponse,
  MEMO_PROGRAM_ID,
} from "@solana/actions";
import {
  clusterApiUrl,
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
const headers = createActionHeaders();
import axios, { AxiosResponse } from "axios";
export const GET = async (req: Request) => {
  try {
    const payload: ActionGetResponse = {
      icon: new URL("/img/cat.webp", new URL(req.url).origin).toString(),
      description: "Buy me a coffee",
      title: "My demo blink",
      label: "Pay",
    };
    return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });
  } catch (err) {
    Response.json(
      { message: err, status: 400 },
      { headers: ACTIONS_CORS_HEADERS }
    );
  }
};

export const OPTIONS = async () => Response.json(null, { headers });

export const POST = async (req: Request) => {
  try {
    const body: ActionPostRequest = await req.json();

    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      throw 'Invalid "account" provided';
    }

    const connection = new Connection(
      process.env.SOLANA_RPC! || clusterApiUrl("devnet")
    );

    const transaction = new Transaction().add(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 1000,
      }),
      new TransactionInstruction({
        programId: new PublicKey(MEMO_PROGRAM_ID),
        data: Buffer.from(
          `Its a sign message to confirm your entry for the raffle for the account: ${account}`
        ),
        keys: [],
      })
    );

    // set the end user as the fee payer
    transaction.feePayer = account;

    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: "You've successfully entered the raffle",
      },
    });
    //Putting it to database

    //We get the timestamp of request

    try {
      const resp: AxiosResponse = await axios.post("/api/actions/memo", {
        method: "POST",
        data: {
          address: account,
          timestamp: Date.now(),
        },
        headers: ACTIONS_CORS_HEADERS,
      });
      if (resp.status === 500) {
        throw new Error("Failed to save eligible address");
      }
    } catch (err) {
      Response.json({
        msg: "Unable to put it in DB",
      });
    }

    return Response.json(payload, {
      headers,
    });
  } catch (err) {
    console.log(err);
    const actionError: ActionError = { message: "An unknown error occurred" };
    if (typeof err == "string") actionError.message = err;
    return Response.json(actionError, {
      status: 400,
      headers,
    });
  }
};
