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
    icon: new URL(
      "/https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLjRzgecAbQoFNztoEi8G5fmZJHwoE2FhPig&s"
    ).toString(),
    label: "Enter Raffle",
    description: "This is a super simple action",
    title: "Rafflinks Demo #1",
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
        status: 40,
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
        data: Buffer.from("This is a simple memo message", "utf8"),
        keys: [],
      })
    );

    transaction.feePayer = account;
    const connection = new Connection(clusterApiUrl("devnet"));
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    const payload: ActionPostResponse = await createPostResponse({
      fields: { transaction },
    });

    return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });
  } catch (error) {
    Response.json({
      msg: error,
      status: 400,
    });
  }
};
