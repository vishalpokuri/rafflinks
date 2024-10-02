'use client';
import { checkUserExist } from '@/lib/actions';
import LandingPage from '@/components/LandingPage';
import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/navigation';
import { useEffect, useState,  } from 'react';
import { toast } from 'sonner';

export default function Home() {
  const {publicKey, connected} = useWallet();
  const [domLoaded, setDomLoaded] = useState(false);
  const router= useRouter();
  const fetchUsername = async (publicKey: string) => {
    const data = await checkUserExist(publicKey);
    return data;
  };
  useEffect(()=>{
    setDomLoaded(true);
    const fetchData = async ()=>{
      if(connected && publicKey){
        const data = await fetchUsername(publicKey.toString());
        console.log(data);
        if(!data.err && !data.user){ //error = false, and user doesnt exist
          localStorage.setItem('username', "");
          router.push('/username');
          toast.info("Create a username");
          return;
        }
        if(!data.err && data.user){ //no error and user exist
          const username = data.user.username;
          localStorage.setItem("username", username);
          router.push('/dashboard');
          toast.info('Logged in successfully');
          return;
        }
      }
    }
    if (typeof window !== "undefined") {
      fetchData();
    }
  }, [publicKey, connected])

return (
      domLoaded && (
        <LandingPage/>
      )
  );
}
