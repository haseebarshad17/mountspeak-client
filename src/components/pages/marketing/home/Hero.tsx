'use client';

import React from 'react'
import HeroFilters from '@/components/pages/marketing/home/HeroFilters'
// import { useLogin, useLogout, useSignup, useUser, useUserProfile } from '@/services/auth/auth.queries';
// import { usePlans } from '@/services/plans/plan.queries';

type HeroProps = {
    tourLocations?: string[]
}

const Hero = ({ tourLocations = [] }: HeroProps) => {

    // const { refetch: refetchUser } = useUser();
    // const { refetch: refetchUserProfile } = useUserProfile();
    // const { refetch: refetchPlans } = usePlans();
    // const { mutateAsync: signup } = useSignup();
    // const { mutateAsync: login } = useLogin();
    // const { mutateAsync: logout } = useLogout();

    // const handleSignup = async () => {
    //     await signup({
    //         email: "haseebarshad1712@gmail.com",
    //         password: "Abcd123!",
    //         full_name: "Haseeb Arshad",
    //         role: "super_admin",
    //         avatar_url: "https://api.dicebear.com/9.x/toon-head/svg?seed=Katherine",
    //     });
    // }

    // const handleLogin = async () => {
    //     await login({
    //         email: "haseebarshad1712@gmail.com",
    //         password: "Abcd123!",
    //     });
    // }

    // const handleGetUser = async () => {
    //     const result = await refetchUser();
    //     console.log(result.data);
    // }

    // const handleGetProfile = async () => {
    //     const result = await refetchUserProfile();
    //     console.log(result.data);
    // }

    // const handleLogout = async () => {
    //     await logout();
    // }

    // const getPlans = async () => {
    //     const result = await refetchPlans();
    //     console.log(result.data);
    // }


    return (
        <>
            {/* <div>
                <button onClick={handleLogin}>Login</button>
                <button onClick={handleLogout}>Logout</button>
                <button onClick={handleSignup}>Signup</button>
                <button onClick={getPlans}>get plans</button>
                <button onClick={handleGetProfile}>get profile</button>
                <button onClick={handleGetUser}>get user</button>
            </div> */}

            <section className='p-2 pb-14 sm:p-3 sm:pb-16 md:p-4 lg:p-5 lg:pb-20 xl:p-[30px] xl:pb-[112px]'>
                <div className='
            rounded-[16px] bg-[url("/images/pages/home/tour-list.png")] 
            bg-cover bg-center bg-no-repeat'
                >
                    <main className='pb-8 pt-[150px] sm:pb-10 sm:pt-40 md:pb-12 md:pt-48 lg:pb-16 lg:pt-56 xl:pb-[100px] xl:pt-[257px]'>
                        <div className='agency-container'>
                            <div className='w-full max-w-[828px] mx-auto text-center text-white'>
                                <h1 className='text-3xl font-semibold leading-[0.95] sm:text-4xl md:text-5xl xl:text-[45px]'>Don’t call it a dream. Call it a plan</h1>
                                <p className='pt-3 text-sm font-normal sm:pt-4 sm:text-base xl:text-lg'>
                                    Travel the way you wish to go with Phnes Travels helping you discover,
                                    live and travel at your own pace.
                                </p>
                            </div>

                            <div className='mx-auto w-full max-w-[867px] pt-10 sm:pt-14 md:pt-20 lg:pt-24 xl:pt-[180px]'>
                                <HeroFilters tourLocations={tourLocations} />
                            </div>
                        </div>
                    </main>
                </div>
            </section>
        </>
    )
}

export default Hero