import { onAuthenticateUser } from '@/actions/user'
import { redirect } from 'next/navigation'

const AuthCallbackPage = async () => {
  const authResponse = await onAuthenticateUser();
  
  // Check karein ki user aur workspace dono maujood hain
  if (authResponse.user && authResponse.user.workspace && authResponse.user.workspace.length > 0) {
    // Pehle workspace par redirect karein
    return redirect(`/dashboard/${authResponse.user.workspace[0].id}`);
  }
  
  // Agar user naya hai ya workspace nahi hai, to /dashboard par bhejein
  if (authResponse.status === 201 || authResponse.status === 200) {
    return redirect('/dashboard');
  }

  // Agar authentication fail ho, to sign-in par wapas bhejein
  return redirect("/auth/sign-in");
}

export default AuthCallbackPage;