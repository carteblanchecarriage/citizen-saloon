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

export default function Home({ hasNft }) {
  const { isLoggedIn, isLoading } = useUser();
  const [sorryPartner, setSorryPartner] = useState(false);
  const router = useRouter();
  const address = useAddress();

  useEffect(() => {
    if (!isLoggedIn) {
      setSorryPartner(false);
      return; // Exit the function early if not logged in
    }

    if (hasNft?.hasNfts) {
      router.push('/saloon');
    } else {
      console.log('Looks like you&apos;re not from around here');
      setSorryPartner(true);
    }
  }, [hasNft, router, isLoggedIn]);

  return (
    <>
      <div className={styles.container}>
        <Header />
        <h2 className={styles.heading}>Howdy there</h2>
      </div>
      {sorryPartner ? (
        <div>
          Sorry Partner, looks like you&apos;re not from around here. Come on
          back with the proper papers.
        </div>
      ) : (
        <h1 className={styles.h1}>Welcome to the Saloon</h1>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const user = await getUser(context.req);
  console.log('this is the user object');
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
