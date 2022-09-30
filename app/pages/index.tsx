import { useAnchorWallet } from '@solana/wallet-adapter-react';
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { DEV_NET, LOCAL_NET } from '../constants';
import { Connection } from '@solana/web3.js';
import { AnchorProvider, Program, web3 } from '@project-serum/anchor';
import idl from '../public/idl.json';
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes';

const Home: NextPage = () => {
  const [post, setPost] = useState('');
  const anchorWallet = useAnchorWallet();

  const stringIDL = JSON.stringify(idl);
  const IDL = JSON.parse(stringIDL);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    createUser();
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

    const program = new Program(IDL, IDL.metadata.address, provider);
    const [userAccount] = await web3.PublicKey.findProgramAddress(
      [utf8.encode('userProfile'), anchorWallet.publicKey.toBuffer()],
      program.programId
    );
    const foundProfile = await program.account.userProfile.fetch(userAccount);
    if (foundProfile) {
      console.log(foundProfile);
    }
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
      const [userAccount] = await web3.PublicKey.findProgramAddress(
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

  useEffect(() => {
    if (anchorWallet) {
      // checkAccount();
    }
  }, [anchorWallet]);

  return (
    <div className="container">
      <main>
        <div className="container">
          <form onSubmit={handleSubmit}>
            <input onChange={handleChange} />
            <button>Submit</button>
          </form>
        </div>
        <div className="container">
          <WalletMultiButton />
          <WalletDisconnectButton />
        </div>
      </main>
    </div>
  );
};

export default Home;
