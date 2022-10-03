import { useAnchorWallet } from '@solana/wallet-adapter-react';
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { DEV_NET, LOCAL_NET } from '../constants';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider, Program, web3 } from '@project-serum/anchor';
import idl from '../public/idl.json';
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { accountType } from '../interfaces/accountInterface';

const Home: NextPage = () => {
  const [post, setPost] = useState('');
  const [user, setUser] = useState<accountType>({
    userAddress: undefined,
    postCount: 0,
  });
  const anchorWallet = useAnchorWallet();

  const stringIDL = JSON.stringify(idl);
  const IDL = JSON.parse(stringIDL);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // createPost();
  };

  const handleChange = (e: any) => {
    setPost(e.target.value);
    console.log(e.target.value);
  };

  const checkAccount = async () => {
    if (!anchorWallet) {
      throw new Error('No wallet found');
    }
    const connection = new Connection(LOCAL_NET, 'confirmed');
    const provider = new AnchorProvider(connection, anchorWallet, {
      preflightCommitment: 'confirmed',
    });

    const accounts = await connection.getProgramAccounts(
      new PublicKey(IDL.metadata.address)
    );

    const program = new Program(IDL, IDL.metadata.address, provider);
    const [userAccount, bump] = web3.PublicKey.findProgramAddressSync(
      [utf8.encode('userProfile'), anchorWallet.publicKey.toBuffer()],
      program.programId
    );

    accounts.map(async (account) => {
      console.log(account.pubkey.toString());
      if (account.pubkey.toString() === userAccount.toString()) {
        const foundProfile = await program.account.userProfile.fetch(
          userAccount
        );
        if (foundProfile) {
          setUser({
            userAddress: foundProfile.userAddress,
            postCount: foundProfile.postCount,
          });
          console.log(foundProfile);
        }
      }
    });
    console.log(userAccount.toString());
  };

  const createUser = async () => {
    if (!anchorWallet) {
      throw new Error('No wallet found');
    }
    const connection = new Connection(LOCAL_NET, 'confirmed');
    const provider = new AnchorProvider(connection, anchorWallet, {
      preflightCommitment: 'confirmed',
    });
    const program = new Program(IDL, IDL.metadata.address, provider);

    try {
      const [userAccount, bump] = web3.PublicKey.findProgramAddressSync(
        [utf8.encode('userProfile'), anchorWallet.publicKey.toBuffer()],
        program.programId
      );
      console.log(userAccount.toString());
      const tx = await program.methods
        .createAccount()
        .accounts({
          userProfile: userAccount,
          user: anchorWallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();
      console.log(tx);
    } catch (err) {
      console.log(err);
    }
  };

  // const createPost = async () => {
  //   if (!anchorWallet) {
  //     throw new Error('No wallet found');
  //   }
  //   const connection = new Connection(LOCAL_NET, 'confirmed');
  //   const provider = new AnchorProvider(connection, anchorWallet, {
  //     preflightCommitment: 'confirmed',
  //   });
  //   const program = new Program(IDL, IDL.metadata.address, provider);

  //   try {
  //     const [postAccount, bump] = web3.PublicKey.findProgramAddressSync(
  //       [utf8.encode('userPost'), Uint8Array.from([user.postCount])],
  //       program.programId
  //     );
  //     console.log(postAccount.toString());
  //     const tx = await program.methods
  //       .createPost(post)
  //       .accounts({
  //         blogPost: postAccount,
  //         userProfile: anchorWallet.publicKey,
  //         user: anchorWallet.publicKey,
  //         systemProgram: web3.SystemProgram.programId,
  //       })
  //       .rpc();
  //     console.log(tx);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  //state not changing
  useEffect(() => {
    if (anchorWallet) {
      console.log('called');
      checkAccount();
    }
  }, [anchorWallet, user]);

  return (
    <div>
      <div className="flex justify-around mt-2 p-2">
        {/* <button className="bg-green-400 p-2 rounded-lg">Create Account</button> */}
        {!user.userAddress ? (
          <button className="bg-green-400 p-2 rounded-lg" onClick={createUser}>
            Create Account
          </button>
        ) : (
          ''
        )}
        <div className="flex p-2">
          <WalletMultiButton />
          <WalletDisconnectButton />
        </div>
      </div>

      <main className="center">
        <div className="mb-4">
          <form className="flex justify-around" onSubmit={handleSubmit}>
            <input
              className="border-2 border-cyan-200 rounded-lg p-2 mx-2"
              onChange={handleChange}
            />
            <button className="bg-green-400 p-2 rounded-lg">Add post</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Home;
