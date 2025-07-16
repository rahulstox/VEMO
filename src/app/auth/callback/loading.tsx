import React from 'react'
import { Spinner } from '@/components/global/loader/spinner'
type Props = {}

const Authloading = (props: Props) => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spinner />
    </div>
  )
}

export default Authloading