import { ConnectWallet } from '@thirdweb-dev/react';
import Image from 'next/image';
import styles from '../styles/Header.module.css';
import Link from 'next/link';

export const Header = () => {
  return (
    <nav className={styles.header}>
      <Link href='/' className='text-4xl'>
        🐎
      </Link>
      <ConnectWallet theme='dark' />
    </nav>
  );
};
