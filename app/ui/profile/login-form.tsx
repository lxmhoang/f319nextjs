'use client';

import { Button } from '@/app/ui/button';
import { TextInput } from 'flowbite-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/lib/context';
import { emailLogin, emailSignUp } from '@/app/lib/client';


export default function LoginForm() {


    const { firebaseUser } = useAppContext()
    const router = useRouter()

    const [email, setEmail] = useState<string>('')
    const [pass, setPass] = useState<string>('')
    const [name, setName] = useState<string>('')


    return (
        <>
            {!firebaseUser ? (



                <div className="rounded-md bg-black-50 max-w-sm">
                    {/* Name */}
                    <div className="">
                    <div className="mb-4">
                        <label htmlFor="displayName" className="mb-2 block text-sm font-medium">
                            Ten
                        </label>
                        <TextInput name="displayName" type="text" placeholder="Ten goi" className='max-w-sm'
                            onChange={(e) => {
                                setName(e.target.value)
                            }} />

                    </div>
                        <label htmlFor="amount" className="mb-2 block text-sm font-medium w-max-sm">
                            Email <br />
                        </label>

                        <div className="mb-4">
                            <TextInput
                                name="email"
                                type="text"
                                placeholder='Email'
                                className="peer block max-w-sm rounded-md boreder border-gray-200 py-2 text-sm outline-2 placeholder:grey-sky-400 text-sky-400"
                                required
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                }}
                            />
                            {/* <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" /> */}
                        </div>

                    </div>
                    <div className="mb-4">
                        <label htmlFor="notebankacc" className="mb-2 block text-sm font-medium">
                            Password
                        </label>
                        <TextInput name="password" type="password" placeholder="Pass" className='max-w-sm'
                            onChange={(e) => {
                                setPass(e.target.value)
                            }} />

                    </div>
                    {name}
                    {email}
                    {pass}
                    <div className="mt-6 flex justify-between gap-4">
                        <Button type="submit" onClick={() => {
                            emailLogin(email, pass)
                        }} > Sign in </Button>

                        <Button type="submit" onClick={() => {
                            emailSignUp(email, pass, name)
                        }} > Sign up </Button>
                    </div>
                </div>


            ) : (<div>Da dang nhap</div>)
            }
        </>
    );

}
