import { useAddress, useContract } from '@thirdweb-dev/react';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getUser } from '../../auth.config';
import { contractAddress } from '../../const/yourDetails';
import { Header } from '../components/Header';
import styles from '../styles/Home.module.css';
import checkBalance from '../util/checkBalance';
import { useUser } from '@thirdweb-dev/react';
import supabase from '../util/supabaseClient';
import Image from 'next/image';

export default function Saloon({ hasNft }) {
  const { isLoggedIn, isLoading, user } = useUser();

  const { contract } = useContract(contractAddress);

  const address = useAddress();
  const router = useRouter();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [dateCreated, setDateCreated] = useState('');

  if (isLoading) {
    return <div>looking for whiskey</div>;
  }

  if (!hasNft.hasNft) {
    router.push('/sorry-partner');
  }

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase.from('messages').select();
      const reversedList = data.reverse();
      setMessages(reversedList);
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error fetching messages:', error.message);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (!user?.address) {
      router.push('/');
    }
  }, [isLoggedIn]);

  const prepareNewMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
  };

  const sendMessage = async () => {
    const { data, error } = await supabase
      .from('messages')
      .insert([{ content: newMessage }])
      .select();
    fetchMessages();
    setNewMessage('');
  };

  if (hasNft.hasNft) {
    return (
      <>
        <Image
          src='/interior-1.jpg'
          width={500}
          height={500}
          alt='Saloon Interior'
          className='-z-10 fixed top-0 w-full'
        />
        <div className={styles.container}>
          <Header />
          <h1>Looks like you have {hasNft?.quantityCitizen} pistols</h1>
          <h1>Looks like you have {hasNft?.quantityFounding} horse</h1>
          <h1>Looks like you have {hasNft?.quantityFirst} gold mine</h1>
          <h1 className={styles.heading}>What can I get ya?</h1>
        </div>
        <div className='flex items-center justify-center'>
          <textarea
            onChange={(e) => prepareNewMessage(e)}
            className='text-black w-96 p-2'
            value={newMessage}
          ></textarea>
          <button onClick={sendMessage} className='text-2xl border m-2 p-2'>
            submit
          </button>
        </div>

        <div className='flex flex-col items-center'>
          {messages &&
            messages.map((message) => (
              <div key={message.id} className='w-1/2'>
                <div className='bg-black text-gray-200 p-2 m-2 bg-opacity-90'>
                  {message.content}
                  <div className='text-xs text-gray-500'>
                    {new Date(message.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </>
    );
  }
}

export async function getServerSideProps(context) {
  const user = await getUser(context.req);
  console.log('is this running over and over?');
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

  // Finally, return the props
  return {
    props: { hasNft },
  };
}
