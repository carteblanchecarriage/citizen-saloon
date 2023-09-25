import { Header } from '@/components/Header';
import { useUser } from '@thirdweb-dev/react';
import { useRouter } from 'next/router';

export default function SorryPartner() {
  const { isLoggedIn, isLoading, user } = useUser();
  const router = useRouter();

  if (!isLoggedIn) {
    router.push('/');
  }

  return (
    <>
      <Header />
      <div className='w-screen'>
        <h1 className='mx-auto mt-48'>
          Sorry partner, why don't you come back after spending some time in
          town
        </h1>
      </div>
    </>
  );
}
