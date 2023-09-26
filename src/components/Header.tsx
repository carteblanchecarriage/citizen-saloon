import { ConnectWallet } from '@thirdweb-dev/react';
import Image from 'next/image';
import styles from '../styles/Header.module.css';
import Link from 'next/link';

export const Header = () => {
  return (
    <nav className={styles.header}>
      <h1 className='text-4xl'>🐎</h1>
      <ConnectWallet theme='dark' />
    </nav>
  );
};
