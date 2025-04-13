import * as web3 from "@solana/web3.js";
import "dotenv/config";
import {
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";

// Challenge
// Go ahead and create a script from scratch that will allow you to transfer SOL from one account to another on Devnet. Be sure to print out the transaction signature so you can look at it on Solana Explorer.

// destiny address
const toPubkeyString = "BzwDWDRHXng8JcBDE8UhmJGnQ4mg6kgDoSKokLbatbpr";

if (!toPubkeyString) {
  console.error("❌ Please provide a recipient public key as an argument");
  process.exit(1);
}


const toPubkey = new web3.PublicKey(toPubkeyString);
const payer = getKeypairFromEnvironment("SECRET_KEY");
const connection = new web3.Connection("https://api.devnet.solana.com", "confirmed");

const lamportsToSend = 0.01 * web3.LAMPORTS_PER_SOL; // send 0.01 SOL

// check whether destiny account is a executable account
const accountInfo = await connection.getAccountInfo(toPubkey);
if (accountInfo?.executable) {
  throw new Error("❌ Cannot transfer SOL to an executable account (program). Choose a regular wallet address.");
}


// create transfer instruction
const transferIx = web3.SystemProgram.transfer({
  fromPubkey: payer.publicKey,
  toPubkey,
  lamports: lamportsToSend,
});

// add instruction to Tx
const transaction = new web3.Transaction().add(transferIx);

// send and confirm Tx
const signature = await web3.sendAndConfirmTransaction(connection, transaction, [payer]);

console.log(`💸 Sent 0.01 SOL to ${toPubkey.toBase58()}`);
console.log(`🔗 Explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet`);