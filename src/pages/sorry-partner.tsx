import { Header } from '@/components/Header';
import { useUser } from '@thirdweb-dev/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function SorryPartner() {
  const { isLoggedIn, isLoading, user } = useUser();
  const router = useRouter();

  console.log('here');

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  if (isLoading) {
    return <div>looking for whiskey</div>;
  }

  return (
    <>
      <Header />
      <div className='w-screen'>
        <h1 className='mx-auto mt-48'>
          Sorry partner, why don&apos;t you come back after spending some time
          in town
        </h1>
      </div>
    </>
  );
}
