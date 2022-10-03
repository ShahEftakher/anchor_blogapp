import { PublicKey } from '@solana/web3.js';

export interface accountType {
  userAddress: PublicKey | undefined;
  postCount: number;
}
