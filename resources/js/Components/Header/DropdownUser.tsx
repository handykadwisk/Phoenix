import { useEffect, useRef, useState, Fragment } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';

import defaultImage from '../../Images/user/default.jpg';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import ModalToAction from '../Modal/ModalToAction';
import ModalToResetPassword from '../Modal/ModalToResetPassword';
import Swal from 'sweetalert2';
import InputLabel from '../InputLabel';
import TextInput from '../TextInput';
import { log } from 'console';

const DropdownUser = () => {

  const { auth }: any = usePage().props

  const [modal, setModal] = useState({
    reset: false
  });
  const id = auth.user.id
  // console.log("id",id);

  const [password, setPassword] = useState<any>({
    password: ''
  });
  const [confirmPassword, setConfirmPassword] = useState<any>({
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState<string>('');

  // console.log(confirmPassword,'<<<<<<');

  useEffect(() => {
    if (password.password !== confirmPassword.password) {
      setErrorMessage("Passwords do not match");
    } else {
      setErrorMessage(""); // Clear error message if passwords match
    }
  }, [password, confirmPassword]);

  const handleSuccess = (message: string) => {
    if (modal.reset) {
      Swal.fire({
        title: "Success",
        text: "Reset Password",
        icon: "success",
      }).then((result: any) => {
        if (result.value) {
          // getUser();
          setPassword({
            password: ''
          })
          setConfirmPassword({
            password: ''
          })
        }
      });
    }
  }
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });
  // console.log("password", password);

  return (
    <>
      <Menu as="div" className="relative">
        <Menu.Button className="-m-1.5 flex items-center p-1.5">
          <span className="sr-only">Open user menu</span>
          <img
            className="h-8 w-8 rounded-full bg-gray-50"
            src={defaultImage}
            alt=""
          />
          <span className="hidden lg:flex lg:items-center">
            <span className="ml-4 text-sm font-semibold leading-6 text-gray-900 capitalize" aria-hidden="true">
              {auth.user.name}
            </span>
            <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2.5 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none z-50">
            <Menu.Item >
              <div
                className="flex items-center w-full pl-2 gap-3.5 mb-2 text-sm ease-in-out hover:bg-gray-200 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                </svg>

                <span className='text-sm'
                  onClick={() => setModal({ reset: true })}
                >Change Password</span>

              </div>
            </Menu.Item>
            <Menu.Item>
              <Link
                className="flex items-center w-full pl-2 gap-3.5 text-sm ease-in-out hover:bg-gray-200"
                href={route('logout')} method="post" as='button'
              >
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.5375 0.618744H11.6531C10.7594 0.618744 10.0031 1.37499 10.0031 2.26874V4.64062C10.0031 5.05312 10.3469 5.39687 10.7594 5.39687C11.1719 5.39687 11.55 5.05312 11.55 4.64062V2.23437C11.55 2.16562 11.5844 2.13124 11.6531 2.13124H15.5375C16.3625 2.13124 17.0156 2.78437 17.0156 3.60937V18.3562C17.0156 19.1812 16.3625 19.8344 15.5375 19.8344H11.6531C11.5844 19.8344 11.55 19.8 11.55 19.7312V17.3594C11.55 16.9469 11.2062 16.6031 10.7594 16.6031C10.3125 16.6031 10.0031 16.9469 10.0031 17.3594V19.7312C10.0031 20.625 10.7594 21.3812 11.6531 21.3812H15.5375C17.2219 21.3812 18.5625 20.0062 18.5625 18.3562V3.64374C18.5625 1.95937 17.1875 0.618744 15.5375 0.618744Z"
                    fill=""
                  />
                  <path
                    d="M6.05001 11.7563H12.2031C12.6156 11.7563 12.9594 11.4125 12.9594 11C12.9594 10.5875 12.6156 10.2438 12.2031 10.2438H6.08439L8.21564 8.07813C8.52501 7.76875 8.52501 7.2875 8.21564 6.97812C7.90626 6.66875 7.42501 6.66875 7.11564 6.97812L3.67814 10.4844C3.36876 10.7938 3.36876 11.275 3.67814 11.5844L7.11564 15.0906C7.25314 15.2281 7.45939 15.3312 7.66564 15.3312C7.87189 15.3312 8.04376 15.2625 8.21564 15.125C8.52501 14.8156 8.52501 14.3344 8.21564 14.025L6.05001 11.7563Z"
                    fill=""
                  />
                </svg>
                <div className=''>
                  Sign Out
                </div>
              </Link>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu >
      {/* modal reset password */}
      < ModalToResetPassword
        submitButtonName={''}
        headers={null}
        closeAllModal={() => { }}
        show={modal.reset}
        onClose={() => setModal({
          reset: false
        })
        }
        method="patch"
        title={'Change Password'}
        url={`/settings/userResetPassword/${id}`}
        data={password}
        onSuccess={handleSuccess}
        classPanel={
          "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-1xl"
        }
        body={
          <>
            <div>
              <div className="relative">
                <div className="mb-2">
                  <div className="relative">
                    <InputLabel
                      className="absolute"
                      htmlFor="password"
                      value={'New Password'}
                    />
                    <div className="ml-[6.8rem] text-red-600">*</div>
                  </div>
                  <TextInput
                    id="password"
                    type="password"
                    name="password"
                    value={password.password}
                    className="mt-2"
                    onChange={(e) => setPassword({ ...password, password: e.target.value })}
                    required
                    placeholder="Password"
                  />
                  <div className="relative mt-4">
                    <div className="mb-2">
                      <div className="relative">
                        <InputLabel
                          className="absolute"
                          htmlFor="confirmPassword"
                          value={'Confirm New Password'}
                        />
                        <div className="ml-[10.5rem] text-red-600">*</div>
                      </div>
                      <TextInput
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword.password}
                        className="mt-2"
                        onChange={(e) => setConfirmPassword({ ...confirmPassword, password: e.target.value })}
                        required
                        placeholder="Confirm Password"
                      />
                    </div>
                  </div>
                  {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
                </div>
              </div>
            </div>
          </>
        }
      />
    </>
  );
};


export default DropdownUser;