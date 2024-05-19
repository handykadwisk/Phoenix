import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import defaultImage from '../../Images/user/default.jpg';
import { PageProps } from '@/types';

export default function DetailRelation({ auth }: PageProps) {
    const stats = [
        { name: 'Policy', stat: '71,897' },
      ]
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={"Detail Relation"}
        >
            <Head title="Detail Relation" />

            <div>
            <dl className="mt-5">

                <div className='grid grid-cols-3 gap-4 xs:grid-cols-1 md:grid-cols-3'>
                    <div className="rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                        {/* profile */}
                        <div className=''>
                            <div className="p-5">
                                <div className='flex justify-center items-center'>
                                    <img
                                    className="h-36 w-36 rounded-full border-2 bg-gray-50"
                                    src={defaultImage}
                                    alt=""
                                    />
                                </div>
                                <div className='flex justify-center items-center mt-5'>
                                    <span className='font-medium'>FRESNEL PERDANA MANDIRI</span>
                                </div>
                            </div>
                        </div>
                        {/* end profile */}
                    </div>
                    <div className="rounded-lg bg-white px-4 py-5 shadow col-span-2 sm:p-6 xs:col-span-1 md:col-span-2">
                        <div className='bg-red-600 w-44 p-2 text-center rounded-md text-white'>
                            <span>
                                Offical Information
                            </span>
                        </div>
                        <div className='grid gap-x-2 gap-y-2 grid-cols-3 mt-4 ml-3'>
                            <div className='bg-red-300'>
                                <span>Group</span><br></br>
                                <span className='font-normal text-gray-500'>FRESNEL</span>
                            </div>
                            <div className='bg-red-300'>
                                <span>Email</span><br></br>
                                <span className='font-normal text-gray-500'>fresnel@gmail.co.id</span>
                            </div>
                            <div className='bg-red-300'>
                                <span>Address</span><br></br>
                                <span className='font-normal text-gray-500'>Jl.Gatot Subroto, Kuningan, Mampang Perampatan, Jakarta Selatan</span>
                            </div>
                        </div>
                        <div className='bg-red-600 w-44 p-2 text-center rounded-md text-white mt-2'>
                            <span>
                                Tags
                            </span>
                        </div>
                        <div className='grid gap-x-2 gap-y-2 grid-cols-3 mt-4 ml-3'>
                            <div className='bg-red-300'>
                                <span>Group</span><br></br>
                                <span className='font-normal text-gray-500'>FRESNEL</span>
                            </div>
                            <div className='bg-red-300'>
                                <span>Email</span><br></br>
                                <span className='font-normal text-gray-500'>fresnel@gmail.co.id</span>
                            </div>
                            <div className='bg-red-300'>
                                <span>Address</span><br></br>
                                <span className='font-normal text-gray-500'>Jl.Gatot Subroto, Kuningan, Mampang Perampatan, Jakarta Selatan</span>
                            </div>
                        </div>
                    </div>
                </div>
                
            </dl>
            </div>
        </AuthenticatedLayout>
    );
}
