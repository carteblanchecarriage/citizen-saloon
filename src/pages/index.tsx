import {
  ConnectWallet,
  useContract,
  useContractMetadata,
  useUser,
} from '@thirdweb-dev/react';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getUser } from '../../auth.config';
import { contractAddress } from '../../const/yourDetails';
import { Header } from '../components/Header';
import styles from '../styles/Home.module.css';

export default function Home() {
  const { isLoggedIn, isLoading } = useUser();
  const router = useRouter();
  const { contract } = useContract(contractAddress);

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/saloon');
    }
  }, [isLoading, isLoggedIn, router]);

  return (
    <div className={styles.container}>
      <Header />
      <h2 className={styles.heading}>Howdy there</h2>
      <h1 className={styles.h1}>Welcome to the Saloon</h1>
      <ConnectWallet theme='dark' className={styles.connect} />
    </div>
  );
}
