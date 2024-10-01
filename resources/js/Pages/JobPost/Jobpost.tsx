import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import Button from "@/Components/Button/Button";
import defaultImage from "../../Images/user/default.jpg";
import {
  EllipsisHorizontalIcon,
  EnvelopeIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  PencilSquareIcon,
  PhoneIcon,
} from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import Pagination from "@/Components/Pagination";
import ToastMessage from "@/Components/ToastMessage";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import ModalToAction from "@/Components/Modal/ModalToAction";
import TableTH from "@/Components/Table/TableTH";
import TableTD from "@/Components/Table/TableTD";
import ModalSearch from "@/Components/Modal/ModalSearch";
// import ModalDetailGroup from "./DetailGroup";
import Swal from "sweetalert2";
import SelectTailwind from "react-tailwindcss-select";
import AGGrid from "@/Components/AgGrid";
import { set } from "react-datepicker/dist/date_utils";
import { get } from "jquery";

export default function Jobpost({ auth }: PageProps) {

  const InitalData = {
    jobpost_id: 0,
    company_division_id: 0,
    jobpost_name: "",
    jobpost_description: "",
    jobpost_parent: null,
  }

  const DetailJobpost = {
    jobpost_id: "",
    division_name: "",
    jobpost_title: "",
    jobpost_description: "",
  }

  const [division, setDivision] = useState<any>([]);
  const [detailJobpost, setDetailJobpost] = useState<any>([InitalData]);
  const [data, setData] = useState<any>(InitalData);
  const [dataEdit, setDataEdit] = useState<any>(InitalData);
  const [isSuccess, setIsSuccess] = useState<any>("");
  const [parentJobpost, setParentJobpost] = useState<any>([]);
  const [devJobpost, setDevJobpost] = useState<any>([]);
  const [company, setCompany] = useState<any>([]);


  const [searchJobpost, setSearchJobpost] = useState<any>({
    jobpost_search: [
      {
        jobpost_title: "",
        jobpost_id: "",
        flag: "flag",
      },
    ],
  });

  const [modal, setModal] = useState<any>({
    add: false,
    addJob: false,
    edit: false,
    delete: false,
    view: false,
    detail: false
  });

  // function get

  const getDivision = async () => {
    try {
      const res = await axios.get("/getAllDivisionCompany");
      const data = res.data;
      // console.log('dataDevision', data);

    } catch (error) {
      console.log(error);
    }
  }

  const jobpostId = async (id: any) => {
    try {
      const res = await axios.get(`getjobpost/${id}`);
      const data = res.data;
      setDetailJobpost(data);
    } catch (error) {
      console.log(error);
    }
  }
  const jobByCom = async (id: any) => {
    try {
      const res = await axios.get(`getJobpostByCom/${id}`);
      const data = res.data;
      setDetailJobpost(data);
    } catch (error) {
      console.log(error);
    }
  }

  const getParentJobpost = async () => {
    try {
      const res = await axios.get("/getAllJobpost");
      const data = res.data;
      setParentJobpost(data);
    } catch (error) {
      console.log(error);
    }
  }

  //get jobpost with division
  const getJobpostDev = async () => {
    try {
      const res = await axios.get("/getJobpostByDiv");
      const data = res.data;
      setDevJobpost(data);
    } catch (error) {
      console.log(error);
    }
  }
  //get jobpost with division by id
  const [jobpostDevId, setJobpostDevId] = useState<any>({});
  const getJobpostDevId = async (id: number) => {
    try {
      const res = await axios.get(`/JobpostByDiv/${id}`);
      const data = res.data;
      setJobpostDevId(data[0]);
    } catch (error) {
      console.log(error);
    }
  }
  

  // end function get

  const mappingDivision = division?.map((item: any) => {
    if (item.COMPANY_DIVISION_NAME !== undefined) {
      return {
        label: item.COMPANY_DIVISION_NAME,
        value: item.COMPANY_DIVISION_ID
      }
    } else {
      return {
        label: item.label,
        value: item.value
      }
    }
  })

  const mappingParentJobpost = parentJobpost?.map((item: any) => {
    if (item.jobpost_parent !== undefined) {
      return {
        label: item.jobpost_name,
        value: item.jobpost_id
      }
    } else {
      return {
        label: item.label,
        value: item.value
      }
    }
  });

  const inputDataSearch = (
    name: string,
    value: string | undefined,
    i: number
  ) => {
    const changeVal: any = [...searchJobpost.jobpost_search];
    changeVal[i][name] = value;
    setSearchJobpost({ ...searchJobpost, jobpost_search: changeVal });
  };

  const handleSuccess = (message: string) => {

    setIsSuccess('')
    if (message !== '') {
      setIsSuccess(message[0])
      setTimeout(() => {
        setIsSuccess('')
      }, 5000)
    }
    getJobpostDev()
  }
  // Fungsi yang dijalankan saat tombol Search ditekan atau Enter
  const handleSearch = () => {
    if (searchJobpost.jobpost_search[0].jobpost_title === "") {
      // Jika input kosong, tampilkan semua data
      inputDataSearch("flag", "", 0);
    } else {
      // Lakukan pencarian berdasarkan teks input
      inputDataSearch("flag", searchJobpost.jobpost_search[0].jobpost_title, 0);
      setIsSuccess("Search");

    }
    setIsSuccess("Search");
  };

  // Fungsi untuk menghapus input pencarian dan menampilkan semua data
  const clearSearch = (e: React.MouseEvent) => {
    // Kosongkan input pencarian
    inputDataSearch("jobpost_title", "", 0);
    // Reset flag untuk menampilkan semua data
    inputDataSearch("flag", "", 0);
    setIsSuccess("Cleared");
  };


  const handleDetailJobpost = (data: any) => {
    setCompany(data);
    // jobpostById(data.company_division.COMPANY_DIVISION_ID);
    // setDetailJobpost(data.company_division);
    jobByCom(data.COMPANY_ID);
    setModal({ ...modal, view: true });
    getJobpostDev()
  }


  const [jobpost, setJobpost] = useState<any>([]);
  const jobpostById = async (id: any) => {
    try {
      const res = await axios.get(`getjobpost/${id}`);
      const data = res.data;
      // console.log('data', data);
      setJobpost(data);
      // setDetailJobpost(response.data.data);
    } catch (error) {
      console.log(error);

    }
  }

  const editJobpost = async (data: any) => {
    // console.log('data', data);

    // try {
    //   const res = await axios.get(`getjobpost/${data}`);
    //   const response = res.data;
    //   setDetailJobpost(response.data);
    // } catch (error) {
    //   console.log(error);
    // }
  }

  const handleStatusChange = async (id: number, status: number) => {
    try {
      const res = await axios.post(`/setJobpostStatus/${id}/${status}`);
      const data = res.data;
      if (data.message !== '') {
        setIsSuccess(data.message)
        setTimeout(() => {
          setIsSuccess('')
        }, 5000)
      }
      getJobpostDev()
    } catch (error) {
      console.log(error);
    }
  }


  // Komponen utama yang menampilkan divisi dan jobpost-nya
  const TreeDivision: React.FC<{ divisionName: string; jobposts: any[] }> = ({ divisionName, jobposts }) => {

    const [expanded, setExpanded] = useState<boolean>(false); // Melacak apakah divisi di-expand
    const [selectedJobpost, setSelectedJobpost] = useState<number | null>(null); // Melacak jobpost yang dipilih

    const toggleExpand = () => {
      setExpanded(!expanded);
    };

    const handleJobpostClick = (jobpostId: number) => {
      setSelectedJobpost(selectedJobpost === jobpostId ? null : jobpostId); // Toggle selection
    };
    const dataJobpost = jobposts.flatMap((item: any) => item.jobposts);
    // console.log('dataJobpost', jobposts);


    return (
      <li className="mb-4">
        {/* Divisi */}
        <div
          className="flex items-center cursor-pointer shadow-md p-2 rounded-md hover:bg-gray-300"
          onClick={toggleExpand}
        >
          <span className="w-3 h-3 bg-red-500 rounded-full inline-block mr-2"></span>
          <span>{divisionName} </span>
          <div className="text-sm text-gray-500">
            / Division
          </div>
        </div>

        {/* Tombol "Add Jobpost" di bawah divisi */}
        {expanded && (
          <div className="ml-6 mt-2">
            <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
              onClick={
                () => {
                  setModal({ ...modal, addJob: true, view: false });
                  setData({
                    ...data,
                    company_division_id: jobposts[0].COMPANY_DIVISION_ID,
                  })
                }
              }>Add Jobpost</button>
          </div>
        )}

        {/* mapping component jobpost */}
        {jobposts.length > 0 && (
          <ul className="ml-6 mt-2">
            {dataJobpost.map((jobpost: any) => (
              <TreeItem
                key={jobpost.jobpost_id}
                jobpost={jobpost}
                isSelected={selectedJobpost === jobpost.jobpost_id}
                onJobpostClick={handleJobpostClick}
              />
            ))}
          </ul>
        )}
      </li>
    );
  };


  // show jobpost
  const TreeItem: React.FC<{ jobpost: any; isSelected: boolean; onJobpostClick: (jobpostId: number) => void }> = ({
    jobpost,
    isSelected,
    onJobpostClick,
  }) => {
    console.log(data);

    return (
      <>
      <li className="mb-2">
        {/* Parent/Child Node */}
        <div
          className="flex items-center shadow-md p-2 rounded-md hover:bg-gray-300 cursor-pointer"
          onClick={() => onJobpostClick(jobpost.jobpost_id)}
        >
          <span className="w-3 h-3 bg-red-400 rounded-full inline-block mr-2"></span>
          <span>{jobpost?.jobpost_name}</span>
          <div className="text-sm text-gray-500">
            / Job Post
          </div>
        </div>

        {/* action button */}
        {isSelected && (
            <div className="ml-6 mt-2 flex gap-2">

            <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
              onClick={
              () => {
              setModal({ ...modal, edit: true, view: false });
              setData({
              ...data,
              jobpost_id: jobpost.jobpost_id,
              company_division_id: jobpost.company_division_id,
              jobpost_parent: jobpost.jobpost_parent,
              jobpost_name: jobpost.jobpost_name,
              jobpost_description: jobpost.jobpost_description,
              })
              }
              }>Edit</button>

            <button className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-700"
              onClick={
              () => {
              setModal({ ...modal, detail: true, view: false });
              setData({
              ...data,
              company_division_id: jobpost.company_division_id,
              jobpost_parent: jobpost.jobpost_parent,
              jobpost_name: jobpost.jobpost_name,
              jobpost_description: jobpost.jobpost_description,
              })
              getJobpostDevId(jobpost.jobpost_id);
              }
              }>Detail</button>

            {
              jobpost.jobpost_status === 1 ? (
              <button className=" bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-700" onClick={
              () => {
                setModal({ ...modal, status: true, view: false });
                setData({
                ...data,
                jobpost_id: jobpost.jobpost_id,
                jobpost_status: 0,
                jobpost_name: jobpost.jobpost_name,
                });
              }
              }>Set Inactive</button>
              ) : (
              <button className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700"
              onClick={
              () => {
                setModal({ ...modal, status: true, view: false });
                setData({
                ...data,
                jobpost_id: jobpost.jobpost_id,
                jobpost_status: 1,
                jobpost_name: jobpost.jobpost_name,
                });
              }
              }>Set Active</button>
              )
            }

            </div>

         
        )}
      </li>
          
    </>
    );
  };
  // show jobpost


  return (
    <AuthenticatedLayout user={auth.user} header={"Job Post"}>
      <Head title="Job Post" />

      {isSuccess && (
        <ToastMessage
          message={isSuccess}
          isShow={true}
          type={"success"}
        />
      )}

       {/* Modal for status change confirmation */}
       <ModalToAction
              headers={'Content-Type: application/json'}
              submitButtonName={'Confirm'}
              method="POST"
              show={modal.status}
              onClose={() => {
              setModal({ ...modal, status: false, view: true });
              setData(InitalData);
              }}
              title={"Confirm Status Change"}
              url={`/setJobpostStatus/${data.jobpost_id}/${data.jobpost_status}`}
              onSuccess={handleSuccess}
              classPanel={
              "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-2xl"
              }
              data={data}
              body={
              <div className="mt-4">
                <p>Are you sure you want to {data.jobpost_status === 1 ? 'activate' : 'deactivate'} <b>{data.jobpost_name}</b>?</p>
              </div>
              }
            />

      {/* Modal Add Job Post */}
      <ModalToAction
        method="POST"
        headers={'Content-Type: application/json'}
        show={modal.addJob}
        onClose={() => {
          setModal({ ...modal, addJob: false, view: true })
          setData(InitalData)
        }}
        title={"Add Job Post"}
        url={"/addJobpost"}
        onSuccess={handleSuccess}
        classPanel={
          "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-2xl"
        }
        submitButtonName={'Submit'}
        data={data}
        body={
          <>
            {/* jobpost_name */}
            <div className="mt-4">
              <InputLabel
                className="absolute"
                value="Job Post Name"
              />
              <div className="ml-[6.7rem] text-red-600">
                *
              </div>
              <TextInput
                type="text"
                value={data.jobpost_name}
                className="mt-2"
                onChange={(e) => setData({ ...data, jobpost_name: e.target.value })}
                required
                placeholder="Job Post Name"
              />
            </div>
            <div className="mt-4">
              <InputLabel
                htmlFor="Job Post Detail"
                value="Job Post Detail"
              />
              <TextInput
                className="mt-2"
                type="text"
                id="Job Post Detail"
                name="Job Post Detail"
                value={data.jobpost_description}
                onChange={(e: any) =>
                  setData({
                    ...data,
                    jobpost_description: e.target.value,
                  })
                }
                placeholder="Description"
              />
            </div>


          </>
        }
      />
      {/* End Modal Add Job Post */}


      {/* Modal Edit */}
      <ModalToAction
        headers={'Content-Type: application/json'}
        submitButtonName={'Submit'}
        method="POST"
        show={modal.edit}
        onClose={() => {
          setModal({ ...modal, edit: false, view: true })
          setData(InitalData)
        }}
        title={"Edit Job Post"}
        url={`/editJobpost`}
        onSuccess={handleSuccess}
        classPanel={
          "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-2xl"
        }
        data={data}
        body={
          <>
            {/* <div className="mt-4">
              <InputLabel
                className=""
                htmlFor="company_division_id"
                value="Company Division"
              />

              <SelectTailwind
                classNames={{
                  menuButton: () =>
                    `flex text-sm text-gray-500 mt-1 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                  menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                  listItem: ({ isSelected }: any) =>
                    `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${isSelected
                      ? `text-white bg-red-500`
                      : `text-gray-500 hover:bg-red-500 hover:text-white`
                    }`,
                }}
                options={mappingDivision}
                isSearchable={true}
                placeholder={"--Select Parent--"}
                value={mappingDivision.find((option: { label: string; value: number }) => option.value === data.company_division_id) || null}
                onChange={(option: any) =>
                  setData({
                    ...data,
                    company_division_id: option.value,
                  })
                }
                primaryColor={"bg-red-500"}
              />

            </div>
            <div className="mt-4">
              <InputLabel
                className=""
                htmlFor="jobpost_parent"
                value="Parent Job Post"
              />
              <SelectTailwind
                classNames={{
                  menuButton: () =>
                    `flex text-sm text-gray-500 mt-1 rounded-md shadow-sm transition-all duration-300 focus:outline-none bg-white hover:border-gray-400`,
                  menu: "absolute text-left z-20 w-full bg-white shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 h-50 overflow-y-auto custom-scrollbar",
                  listItem: ({ isSelected }: any) =>
                    `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${isSelected
                      ? `text-white bg-red-500`
                      : `text-gray-500 hover:bg-red-500 hover:text-white`
                    }`,
                }}
                options={mappingParentJobpost}
                isSearchable={true}
                placeholder={"--Select Parent--"}
                value={mappingParentJobpost?.find((option: { label: string; value: number }) => option.value === data.jobpost_parent) || null}
                onChange={(option: any) =>
                  setData({
                    ...data,
                    jobpost_parent: option.value,
                  })
                }
                primaryColor={"bg-red-500"}
              />
            </div> */}
            {/* jobpost_name */}
            <div className="mt-4">
              <InputLabel
                className="absolute"
                value="Job Post Name"
              />
              <div className="ml-[6.7rem] text-red-600">
                *
              </div>
              <TextInput
                type="text"
                value={data.jobpost_name}
                className="mt-2"
                onChange={(e) => setData({ ...data, jobpost_name: e.target.value })}
                required
                placeholder="Job Post Name"
              />
            </div>
            <div className="mt-4">
              <InputLabel
                htmlFor="Job Post Detail"
                value="Job Post Description"
              />
              <TextInput
                className="mt-2"
                id="Job Post Detail"
                name="Job Post Description"
                value={data.jobpost_description}
                onChange={(e: any) =>
                  setData({
                    ...data,
                    jobpost_description: e.target.value,
                  })
                }
                // defaultValue={
                //     data.RELATION_GROUP_DESCRIPTION
                // }
                // onChange={(e: any) =>
                //     setData({
                //         ...data,
                //         RELATION_GROUP_DESCRIPTION:
                //             e.target.value,
                //     })
                // }
                placeholder="Description"
              />
            </div>


          </>
        }
      />
      {/* End Modal Edit */}

      {/* Modal Detail */}
      <ModalToAction
        headers={''}
        submitButtonName={''}
        method=""
        show={modal.detail}
        onClose={() => {
          setModal({ ...modal, detail: false, view: true })
          setData(InitalData)
        }}
        title={"Detail Job Post"}
        url={"/addJobpost"}
        onSuccess={handleSuccess}
        classPanel={
          "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-2xl"
        }
        data={data}
        body={
          <>
            <div className="mt-4">
              <InputLabel
                className=""
                value="Company Division"
              />
              <TextInput
                type="text"
                value={jobpostDevId.company_division?.COMPANY_DIVISION_NAME}
                className="mt-2"
                onChange={(e) => setData({ ...data, company_division_id: e.target.value })}
                disabled
                placeholder="Company Division"

              />
            </div>
            {/* jobpost_name */}
            <div className="mt-4">
              <InputLabel
                className="absolute"
                value="Job Post Name"
              />
              <div className="ml-[6.7rem] text-red-600">
                *
              </div>
              <TextInput
                type="text"
                value={data.jobpost_name}
                className="mt-2"
                onChange={(e) => setData({ ...data, jobpost_name: e.target.value })}
                disabled
                placeholder="Job Post Name"
              />
            </div>
            <div className="mt-4">
              <InputLabel
                htmlFor="Job Post Detail"
                value="Job Post Description"

              />
              <TextInput
                className="mt-2"
                id="Job Post Detail"
                name="Job Post Description"
                value={data.jobpost_description}
                onChange={(e: any) =>
                  setData({
                    ...data,
                    jobpost_description: e.target.value,
                  })
                }
                disabled
                // defaultValue={
                //     data.RELATION_GROUP_DESCRIPTION
                // }
                // onChange={(e: any) =>
                //     setData({
                //         ...data,
                //         RELATION_GROUP_DESCRIPTION:
                //             e.target.value,
                //     })
                // }
                placeholder="Description"
              />
            </div>


          </>
        }
      />
      {/* End Modal Detail */}


      {/* Modal Show Jobpost Company */}
      <ModalToAction
        submitButtonName={''}
        show={modal.view}
        onClose={() => setModal({ ...modal, view: false })}
        title={company.COMPANY_NAME}
        url=""
        data={null}
        method="POST"
        onSuccess={handleSuccess}
        headers={{ 'Content-Type': 'application/json' }}
        classPanel="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-2xl"
        body={
          <>
            <div className="mb-3">
              <ul>
                {/* {detailJobpost.length > 0 ? (
                  Array.from(
                    new Set(
                      detailJobpost
                        .filter((jobpost: any) => jobpost.company_division?.COMPANY_DIVISION_NAME)
                        .map((jobpost: any) => jobpost.company_division.COMPANY_DIVISION_NAME)
                    )
                  ).map((divisionName: any) => (
                    <TreeDivision
                      key={divisionName}
                      divisionName={divisionName}
                      jobposts={detailJobpost.filter(
                        (jobpost: any) => jobpost.company_division?.COMPANY_DIVISION_NAME === divisionName
                      )}
                    />
                  ))
                ) : (
                  <li>Tidak ada jobpost yang ditemukan.</li>
                )} */}
                {devJobpost.length > 0 ? (
                  Array.from(
                    new Set(
                      devJobpost
                        .filter((jobpost: any) => jobpost.COMPANY_DIVISION_NAME)
                        .map((jobpost: any) => jobpost.COMPANY_DIVISION_NAME)
                    )
                  ).map((divisionName: any) => (
                    <TreeDivision
                      key={divisionName}
                      divisionName={divisionName}
                      jobposts={devJobpost.filter(
                        (jobpost: any) => jobpost.COMPANY_DIVISION_NAME === divisionName
                      )}
                    />
                  ))
                ) : (
                  <li>No job posts found.</li>
                )}


              </ul>
            </div>
          </>
        }
      />
      {/* EndModal Show Jobpost Company */}


      <div className="grid grid-cols-4 py-4 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4">
        <div className="flex flex-col">
          <div className="bg-white mb-4 rounded-md p-4">
            <div
              className="bg-red-600 w-fit p-2 rounded-md text-white hover:bg-red-500 hover:cursor-pointer hidden"
              onClick={() => {
                setModal({ ...modal, add: true });
                getDivision();
                getParentJobpost();
              }}
            >
              <span>Add Job Post</span>
            </div>
          </div>
          <div className="bg-white rounded-md shadow-md p-4 max-h-[80rem] h-[100%]">
            <TextInput
              id="role_name"
              type="text"
              name="role_name"
              value={searchJobpost.jobpost_search[0].jobpost_title}
              onChange={(e) => {
                inputDataSearch("jobpost_title", e.target.value, 0);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const title = searchJobpost.jobpost_search[0].jobpost_title;
                  const id = searchJobpost.jobpost_search[0].jobpost_id;
                  if (title || id) {
                    inputDataSearch("flag", title || id, 0);
                    setIsSuccess("success");
                  } else {
                    inputDataSearch("flag", "", 0);
                    setIsSuccess("Get All Job Post");
                  }
                }
              }}
              placeholder="Search Job Post"
            />

            <div className="mt-4 flex justify-end gap-2">
              <div
                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                onClick={
                  // () => handleSearch()
                  () => {
                    if (
                      searchJobpost.jobpost_search[0]
                        .jobpost_id === "" &&
                      searchJobpost.jobpost_search[0]
                        .jobpost_title === ""
                    ) {
                      inputDataSearch("flag", "", 0);
                    } else {
                      inputDataSearch("flag", "", 0);
                    }
                    setIsSuccess("Search");
                  }
                }
              >
                Search
              </div>

              <div
                className="bg-red-600 text-white p-2 w-fit rounded-md text-center hover:bg-red-500 cursor-pointer"
                onClick={(e) => clearSearch(e)}
              >
                Clear Search
              </div>
            </div>

          </div>
        </div>
        <div className="col-span-3 bg-white shadow-md rounded-md p-5 xs:mt-4 lg:mt-0">
          <div className="ag-grid-layouts rounded-md shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-2.5">
            <AGGrid
              addButtonLabel={null}
              addButtonModalState={undefined}
              withParam={null}
              searchParam={searchJobpost.jobpost_search}
              // loading={isLoading.get_policy}
              url={"getjobpost"}
              doubleClickEvent={handleDetailJobpost}
              triggeringRefreshData={isSuccess}
              colDefs={[
                {
                  headerName: "No.",
                  valueGetter: "node.rowIndex + 1",
                  flex: 0.5,
                },
                {
                  headerName: "Company",
                  field: "COMPANY_NAME",
                  flex: 7,

                },
              ]}
            />
          </div>
        </div>
      </div>

    </AuthenticatedLayout>

  )
}
