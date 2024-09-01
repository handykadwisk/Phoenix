import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import defaultImage from "../../Images/user/default.jpg";
import BreadcrumbPage from "@/Components/Breadcrumbs/BreadcrumbPage";
import { PageProps } from "@/types";
import {
    FormEvent,
    PropsWithChildren,
    useEffect,
    useRef,
    useState,
} from "react";
import { spawn } from "child_process";
import axios from "axios";
import {
    BuildingLibraryIcon,
    BuildingOffice2Icon,
    CreditCardIcon,
    EnvelopeIcon,
    IdentificationIcon,
    MapIcon,
    PencilIcon,
    PencilSquareIcon,
    PhoneIcon,
    UserGroupIcon,
    UserIcon,
    UsersIcon,
} from "@heroicons/react/20/solid";
import ModalToAction from "@/Components/Modal/ModalToAction";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import Switch from "@/Components/Switch";
import Checkbox from "@/Components/Checkbox";
import TextArea from "@/Components/TextArea";
import Swal from "sweetalert2";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import { Datepicker } from "flowbite-react";

export default function DetailPerson({
    idPerson,
    taxStatus,
}: PropsWithChildren<{
    idPerson: any;
    taxStatus: any;
}>) {
    // console.log(dataById);
    return (
        <>
            <div className="mt-4">
                <div className="bg-white rounded-md shadow-md px-4 py-5">
                    {/* <div className="flex justify-between">
                        <div className="text-red-600 font-semibold">
                            <span>Division and Location</span>
                        </div>
                    </div> */}
                    <div className="grid grid-cols-4 gap-4 mt-1">
                        <div className="p-2 grid grid-cols-3 gap-2">
                            <div className="flex justify-center">
                                <BuildingOffice2Icon className="w-12 text-red-600" />
                            </div>
                            <div className="col-span-2 text-sm font-semibold flex">
                                <span className="my-auto">
                                    PT Fresnel Perdana Mandiri
                                </span>
                            </div>
                        </div>
                        <div className="p-2 grid grid-cols-3 gap-2">
                            <div className="flex justify-center">
                                <UserGroupIcon className="w-12 text-red-600" />
                            </div>
                            <div className="col-span-2 text-sm font-semibold flex">
                                <span className="my-auto">STAFF</span>
                            </div>
                        </div>
                        <div className="p-2 grid grid-cols-3 gap-2">
                            <div className="flex justify-center">
                                <IdentificationIcon className="w-12 text-red-600" />
                            </div>
                            <div className="col-span-2 text-sm font-semibold flex">
                                <span className="my-auto">IT</span>
                            </div>
                        </div>
                        <div className="p-2 grid grid-cols-3 gap-2">
                            <div className="flex justify-center">
                                <MapIcon className="w-12 text-red-600" />
                            </div>
                            <div className="col-span-2 text-sm font-semibold flex">
                                <span className="my-auto">Kantor Pusat</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
        // <>
        //     {/* Edit Employment */}
        //     <ModalToAdd
        //         show={modal.edit}
        //         onClose={() => {
        //             setModal({
        //                 add: false,
        //                 delete: false,
        //                 edit: false,
        //                 view: false,
        //                 document: false,
        //                 search: false,
        //             });
        //         }}
        //         title={"Add Employment Information"}
        //         url={`/personEmployment`}
        //         data={dataById}
        //         classPanel={
        //             "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-3xl"
        //         }
        //         onSuccess={handleSuccessEmployment}
        //         body={
        //             <>
        //                 <div className="mt-4">
        //                     <div className="grid grid-cols-3 gap-4">
        //                         <div>
        //                             <InputLabel
        //                                 htmlFor="PERSONE_ID"
        //                                 value={"Employee Id"}
        //                             />
        //                             <TextInput
        //                                 id="PERSONE_ID"
        //                                 type="text"
        //                                 name="PERSONE_ID"
        //                                 value={dataById.PERSONE_ID}
        //                                 className="mt-1"
        //                                 onChange={(e) =>
        //                                     setDataById({
        //                                         ...dataById,
        //                                         PERSONE_ID: e.target.value,
        //                                     })
        //                                 }
        //                                 required
        //                                 placeholder="Employee Id"
        //                             />
        //                         </div>
        //                         <div>
        //                             <InputLabel
        //                                 htmlFor="PERSON_CATEGORY"
        //                                 value={"Category"}
        //                             />
        //                             <select
        //                                 className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
        //                                 value={dataById.PERSON_CATEGORY}
        //                                 onChange={(e) => {
        //                                     setDataById({
        //                                         ...dataById,
        //                                         PERSON_CATEGORY: e.target.value,
        //                                     });
        //                                 }}
        //                             >
        //                                 <option value={""}>
        //                                     -- Choose Category --
        //                                 </option>
        //                                 <option value={1}>Full-time</option>
        //                                 <option value={2}>Contract</option>
        //                                 <option value={3}>Intern</option>
        //                             </select>
        //                         </div>
        //                         <div>
        //                             <InputLabel
        //                                 htmlFor="PERSON_IS_DELETED"
        //                                 value={"Status"}
        //                             />
        //                             <select
        //                                 className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
        //                                 value={dataById.PERSON_IS_DELETED}
        //                                 onChange={(e) => {
        //                                     setDataById({
        //                                         ...dataById,
        //                                         PERSON_IS_DELETED:
        //                                             e.target.value,
        //                                     });
        //                                 }}
        //                             >
        //                                 <option value={""}>
        //                                     -- Choose Status --
        //                                 </option>
        //                                 <option value={"0"}>Active</option>
        //                                 <option value={"1"}>Inactive</option>
        //                             </select>
        //                         </div>
        //                     </div>
        //                     <div
        //                         className={
        //                             dataById.PERSON_CATEGORY === "2" ||
        //                             dataById.PERSON_CATEGORY === "3"
        //                                 ? "grid grid-cols-3 gap-4 mt-2"
        //                                 : "grid grid-cols-2 gap-4 mt-2"
        //                         }
        //                     >
        //                         <div>
        //                             <InputLabel
        //                                 htmlFor="TAX_STATUS_ID"
        //                                 value={"Tax Status"}
        //                             />
        //                             <select
        //                                 className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
        //                                 value={dataById.TAX_STATUS_ID}
        //                                 onChange={(e) => {
        //                                     setDataById({
        //                                         ...dataById,
        //                                         TAX_STATUS_ID: e.target.value,
        //                                     });
        //                                 }}
        //                             >
        //                                 <option value={""}>
        //                                     -- Choose Tax Status --
        //                                 </option>
        //                                 {taxStatus.map((tS: any, i: number) => {
        //                                     return (
        //                                         <option
        //                                             key={i}
        //                                             value={tS.TAX_STATUS_ID}
        //                                         >
        //                                             {tS.TAX_STATUS_NAME}
        //                                         </option>
        //                                     );
        //                                 })}
        //                             </select>
        //                         </div>
        //                         <div>
        //                             <InputLabel
        //                                 htmlFor="PERSON_HIRE_DATE"
        //                                 value={"Hire Date "}
        //                             />
        //                             <TextInput
        //                                 id="PERSON_HIRE_DATE"
        //                                 type="date"
        //                                 name="PERSON_HIRE_DATE"
        //                                 value={dataById.PERSON_HIRE_DATE}
        //                                 className="mt-2"
        //                                 onChange={(e) =>
        //                                     setDataById({
        //                                         ...dataById,
        //                                         PERSON_HIRE_DATE:
        //                                             e.target.value,
        //                                     })
        //                                 }
        //                                 required
        //                                 placeholder="Hire Date"
        //                             />
        //                         </div>
        //                         <div
        //                             className={
        //                                 dataById.PERSON_CATEGORY === "2" ||
        //                                 dataById.PERSON_CATEGORY === "3"
        //                                     ? ""
        //                                     : "hidden"
        //                             }
        //                         >
        //                             {dataById.PERSON_CATEGORY === "2" ||
        //                             dataById.PERSON_CATEGORY === "3" ? (
        //                                 <>
        //                                     <InputLabel
        //                                         htmlFor="PERSON_END_DATE"
        //                                         value={"End Date "}
        //                                     />
        //                                     <TextInput
        //                                         id="PERSON_END_DATE"
        //                                         type="date"
        //                                         name="PERSON_END_DATE"
        //                                         value={dataById.PERSON_END_DATE}
        //                                         className="mt-2"
        //                                         onChange={(e) =>
        //                                             setDataById({
        //                                                 ...dataById,
        //                                                 PERSON_END_DATE:
        //                                                     e.target.value,
        //                                             })
        //                                         }
        //                                         required
        //                                         placeholder="End Date"
        //                                     />
        //                                 </>
        //                             ) : null}
        //                         </div>
        //                     </div>
        //                     <div className="grid grid-cols-2 gap-4 mt-3">
        //                         <div>
        //                             <InputLabel
        //                                 htmlFor="PERSON_SALARY_ADJUSTMENT1"
        //                                 value={"First Salary Adjustment "}
        //                             />
        //                             <TextInput
        //                                 id="PERSON_SALARY_ADJUSTMENT1"
        //                                 type="date"
        //                                 name="PERSON_SALARY_ADJUSTMENT1"
        //                                 value={
        //                                     dataById.PERSON_SALARY_ADJUSTMENT1
        //                                 }
        //                                 className="mt-2"
        //                                 onChange={(e) =>
        //                                     setDataById({
        //                                         ...dataById,
        //                                         PERSON_SALARY_ADJUSTMENT1:
        //                                             e.target.value,
        //                                     })
        //                                 }
        //                                 required
        //                                 placeholder="First Salary Adjustment"
        //                             />
        //                         </div>
        //                         <div>
        //                             <InputLabel
        //                                 htmlFor="PERSON_SALARY_ADJUSTMENT2"
        //                                 value={"Secondary Salary Adjustment "}
        //                             />
        //                             <TextInput
        //                                 id="PERSON_SALARY_ADJUSTMENT2"
        //                                 type="date"
        //                                 name="PERSON_SALARY_ADJUSTMENT2"
        //                                 value={
        //                                     dataById.PERSON_SALARY_ADJUSTMENT2
        //                                 }
        //                                 className="mt-2"
        //                                 onChange={(e) =>
        //                                     setDataById({
        //                                         ...dataById,
        //                                         PERSON_SALARY_ADJUSTMENT2:
        //                                             e.target.value,
        //                                     })
        //                                 }
        //                                 required
        //                                 placeholder="Secondary Salary Adjustment"
        //                             />
        //                         </div>
        //                     </div>
        //                     <div>
        //                         <InputLabel
        //                             htmlFor="PERSON_RECRUITMENT_LOCATION"
        //                             value="Recruitment Location"
        //                         />
        //                         <TextArea
        //                             className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-md focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6"
        //                             id="PERSON_RECRUITMENT_LOCATION"
        //                             name="PERSON_RECRUITMENT_LOCATION"
        //                             defaultValue={
        //                                 dataById.PERSON_RECRUITMENT_LOCATION
        //                             }
        //                             onChange={(e: any) =>
        //                                 setDataById({
        //                                     ...dataById,
        //                                     PERSON_RECRUITMENT_LOCATION:
        //                                         e.target.value,
        //                                 })
        //                             }
        //                         />
        //                     </div>
        //                 </div>
        //             </>
        //         }
        //     />
        //     {/* End Edit Employment */}
        //     <div className="grid grid-cols-4 gap-4 divide-x">
        //         <div className="px-2">
        //             <div className="text-red-700">Employee Id</div>
        //             <div className="text-gray-600 text-sm">
        //                 {detailPerson.PERSONE_ID}
        //             </div>
        //             <div className="text-red-700 mt-2">Tax Status</div>
        //             <div className="text-gray-600 text-sm">
        //                 {detailPerson.TAX_STATUS_ID === null
        //                     ? "-"
        //                     : detailPerson.tax_status?.TAX_STATUS_NAME}
        //             </div>
        //             <div className="text-red-700 mt-2">
        //                 Location Recruitment
        //             </div>
        //             <div className="text-gray-600 text-sm">
        //                 {detailPerson.PERSON_RECRUITMENT_LOCATION}
        //             </div>
        //         </div>
        //         <div className="px-2">
        //             <div className="text-red-700">Category</div>
        //             <div className="text-gray-600 text-sm">
        //                 {detailPerson.PERSON_CATEGORY === 1
        //                     ? "Full-time"
        //                     : detailPerson.PERSON_CATEGORY === 2
        //                     ? "Contract"
        //                     : "Intern"}
        //             </div>
        //             <div className="text-red-700 mt-2">Hire date</div>
        //             <div className="text-gray-600 text-sm">
        //                 {detailPerson.PERSON_HIRE_DATE}
        //             </div>
        //         </div>
        //         <div className="px-2">
        //             <div className="text-red-700">Status</div>
        //             <div className="text-gray-600 text-sm">
        //                 {detailPerson.PERSON_IS_DELETED === 0
        //                     ? "Active"
        //                     : "Inactive"}
        //             </div>
        //             {detailPerson.PERSON_CATEGORY === 2 ||
        //             detailPerson.PERSON_CATEGORY === 3 ? (
        //                 <>
        //                     <div className="text-red-700 mt-2">End date</div>
        //                     <div className="text-gray-600 text-sm">
        //                         {detailPerson.PERSON_END_DATE}
        //                     </div>
        //                 </>
        //             ) : null}
        //         </div>
        //         <div className="px-2">
        //             <div className="flex justify-between">
        //                 <div className="text-red-700">
        //                     Company Facilities
        //                     <div className="text-gray-600">-</div>
        //                 </div>
        //                 <div className="text-gray-600 text-sm">
        //                     <a
        //                         className="hover:text-red-500"
        //                         onClick={(e) => handleEditEmployment(e)}
        //                     >
        //                         <PencilSquareIcon
        //                             className="w-5"
        //                             title="Edit Profile"
        //                         />
        //                     </a>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </>
    );
}
