// npm install @solana/web3.js @bonfida/spl-name-service

import {
  Connection,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
  PublicKey,
} from "@solana/web3.js";
import { resolve } from "@bonfida/spl-name-service";

const input = process.argv[2];
if (!input) {
  throw new Error("❌ Please provide a wallet address or .sol domain");
}

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

async function getResolvedPublicKey(input: string): Promise<PublicKey> {
  if (input.endsWith(".sol")) {
    try {
      const resolved = await resolve(connection, input);
      return resolved;
    } catch (err) {
      throw new Error(`❌ Failed to resolve domain "${input}": ${(err as Error).message}`);
    }
  } else {
    return new PublicKey(input);
  }
}

(async () => {
  try {
    const publicKey = await getResolvedPublicKey(input);
    const balance = await connection.getBalance(publicKey);
    const sol = balance / LAMPORTS_PER_SOL;

    console.log(`✅ Resolved Address: ${publicKey.toBase58()}`);
    console.log(`💰 Balance: ${sol} SOL`);
  } catch (err: any) {
    console.error(err.message);
  }
})();
