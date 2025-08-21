'use client' // Step 1: Isse client component banayein

import { onAuthenticateUser } from '@/actions/user'
import { useRouter } from 'next/navigation' // Step 2: useRouter ko import karein
import React, { useEffect } from 'react'
import { Spinner } from '@/components/global/loader/spinner' // Spinner import karein

const DashboardPage = () => {
  const router = useRouter()

  // Step 3: useEffect ka istemaal karein taaki yeh logic browser mein chale
  useEffect(() => {
    const checkUserAndRedirect = async () => {
      const authResponse = await onAuthenticateUser();

      // Agar user milta hai aur uske paas workspace hai
      if (authResponse.user && authResponse.user.workspace && authResponse.user.workspace.length > 0) {
        // Sahi dashboard par redirect karein
        router.push(`/dashboard/${authResponse.user.workspace[0].id}`);
      } else if (authResponse.user) {
        // User hai par workspace abhi tak load nahi hua, 1 second baad dobara try karein
        console.log("Workspace not found yet, retrying in 1 second...");
        setTimeout(checkUserAndRedirect, 1000);
      } else {
        // Agar user hi nahi mila, to sign-in par bhejein
        router.push('/auth/sign-in');
      }
    };

    checkUserAndRedirect();
  }, [router]); // dependency array mein router add karein

  // Step 4: Jab tak redirection ho raha hai, ek loading spinner dikhayein
  return (
    <div className="flex h-screen w-full flex-col justify-center items-center text-white">
        <Spinner />
        <p className="mt-4">Loading your dashboard...</p>
    </div>
  )
}

export default DashboardPage;