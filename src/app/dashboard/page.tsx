import { onAuthenticateUser } from '@/actions/user'
import{ redirect } from 'next/navigation'


type Props = {}



const Dashboardpage = async () => {
     //Authentication
  const auth = await onAuthenticateUser()
  if (auth.status === 200 || auth.status === 201)
    return redirect(`/dashboard/${auth.user?.workspace[0].id}`)

  if (auth.status === 400 || auth.status === 500 || auth.status === 404) {
    return redirect('/auth/sign-in')
  }
  return null // This ensures the function does not return anything visible
}

export default Dashboardpage