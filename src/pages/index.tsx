import {
  ConnectWallet,
  useContract,
  useContractMetadata,
  useUser,
  useAddress,
} from '@thirdweb-dev/react';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getUser } from '../../auth.config';
import { contractAddress } from '../../const/yourDetails';
import { Header } from '../components/Header';
import styles from '../styles/Home.module.css';
import checkBalance from '@/util/checkBalance';
import { useState } from 'react';
import Image from 'next/image';

export default function Home({ hasNft }) {
  const { isLoggedIn, isLoading } = useUser();
  const router = useRouter();
  const address = useAddress();

  if (isLoggedIn) {
    console.log('logged in');
    router.push('/saloon');
  } else {
    return (
      <>
        <div className={styles.container}>
          <Header />
          <h2 className={styles.heading}>Howdy there</h2>
          <h1 className='text-6xl'>Welcome to the Saloon</h1>
        </div>
        <Image
          src='/exterior-1.jpg'
          width={724}
          height={483}
          alt='Saloon Interior'
          className='mx-auto my-12'
        />
      </>
    );
  }
}

export async function getServerSideProps(context) {
  const user = await getUser(context.req);
  if (!user) {
    return {
      props: {},
    };
  }

  const secretKey = process.env.TW_SECRET_KEY;

  if (!secretKey) {
    console.log('Missing env var: TW_SECRET_KEY');
    throw new Error('Missing env var: TW_SECRET_KEY');
  }

  // Ensure we are able to generate an auth token using our private key instantiated SDK
  const PRIVATE_KEY = process.env.THIRDWEB_AUTH_PRIVATE_KEY;
  if (!PRIVATE_KEY) {
    throw new Error('You need to add an PRIVATE_KEY environment variable.');
  }

  // Instantiate our SDK
  const sdk = ThirdwebSDK.fromPrivateKey(
    process.env.THIRDWEB_AUTH_PRIVATE_KEY,
    'ethereum',
    { secretKey }
  );
  console.log(user);
  // Check to see if the user has an NFT
  const hasNft = await checkBalance(sdk, user.address);

  // If they have an NFT, redirect them to the home page
  if (hasNft.hasNft) {
    return {
      redirect: {
        destination: '/saloon',
        permanent: false,
      },
    };
  }

  // Finally, return the props
  return {
    props: { hasNft },
  };
}
