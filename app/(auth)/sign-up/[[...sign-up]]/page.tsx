import Image from "next/image"
import { Loader2 } from 'lucide-react';
import { SignUp, ClerkLoaded, ClerkLoading } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <div className="h-full lg: flex-col items-center justify-center px-4">
            <div className="text-center space-y-4 pt-16">
                <h1 className="font-bold text-3xl text-[#1E3B3D]">
                    Bem vindo de volta!
                </h1>
                <p className='text-base text-[#1E3B3D]'>
                    Entre ou crie uma conta para acessar seu painel!
                </p>
            </div>
            <div className='flex items-center justify-center mt-8'>
                <ClerkLoaded>
                    <SignUp path='/sign-up'/>
                </ClerkLoaded>
                <ClerkLoading>
                    <Loader2 className='animate-spin text-muted-foreground'/>
                </ClerkLoading>
            </div>
        </div>

        <div className='h-full bg-[#1E3B3D] hidden lg:flex items-center justify-center'>
            <Image src = "/1.svg" height={500} width={500} alt="logo" />
        </div>
    </div>
  )
}