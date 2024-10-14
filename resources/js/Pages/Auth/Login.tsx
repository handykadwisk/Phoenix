import { useEffect, FormEventHandler } from "react";
import Checkbox from "@/Components/Checkbox";
import GuestLayout from "@/Layouts/GuestLayout";
import KillianLogo from "@/Images/phoenix.png";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/Button/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        user_login: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"));
    };
    // console.log(errors);
    

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {status}
                </div>
            )}

            <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div>
                        <img
                            className="h-10 w-auto xl:hidden"
                            src={KillianLogo}
                            alt="Your Company"
                        />
                        <h2 className="mt-2 text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Sign in to your account
                        </h2>
                    </div>

                    <div className="mt-7">
                        <div>
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label
                                        htmlFor="user_login"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        User Login
                                    </label>
                                    <div className="mt-2">
                                        <TextInput
                                            id="user_login"
                                            type="text"
                                            name="user_login"
                                            value={data.user_login}
                                            className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            isFocused={true}
                                            onChange={(e) =>
                                                setData("user_login", e.target.value)
                                            }
                                        />
                                        <InputError
                                            message={errors.user_login}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Password
                                    </label>
                                    <div className="mt-2">
                                        <TextInput
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.password}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                {/* <div className="flex items-center justify-between">

                                <div className="text-sm leading-6">
                                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Forgot password?
                                </a>
                                </div>
                            </div> */}

                                <div>
                                    <PrimaryButton
                                        className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                        disabled={processing}
                                    >
                                        Sign In
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
