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
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
const headers = createActionHeaders();
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
      SystemProgram.transfer({
        fromPubkey: account,
        toPubkey: new PublicKey("BmxKXa8E6of2kDJMDnrs4NNdiZ6fbtGTYhvN4EyJcHme"),
        lamports: 0.001 * LAMPORTS_PER_SOL,
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
        message: "Successfully sent the amount",
      },
    });

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

// const connection = new Connection(clusterApiUrl("devnet"));
// const SendSolinstruction = SystemProgram.transfer({
//   fromPubkey: account,
//   toPubkey: new PublicKey("BmxKXa8E6of2kDJMDnrs4NNdiZ6fbtGTYhvN4EyJcHme"),
//   lamports: 0.001 * LAMPORTS_PER_SOL,
// });
// const { blockhash, lastValidBlockHeight } =
//   await connection.getLatestBlockhash();
// console.log(
//   `Our blockhash is ${blockhash} and the last Valid BlockHeight is ${lastValidBlockHeight}`
// );
// const transaction = new Transaction({
//   feePayer: account,
//   blockhash,
//   lastValidBlockHeight,
// });
// transaction.add(SendSolinstruction);

// const payload: ActionPostResponse = await createPostResponse({
//   fields: {
//     transaction,
//     message: "Raffle successfully entered",
//   },
// });
