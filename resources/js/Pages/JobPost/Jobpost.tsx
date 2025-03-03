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
import ActionModal from "@/Components/Modal/ActionModal";
import TableTH from "@/Components/Table/TableTH";
import TableTD from "@/Components/Table/TableTD";
import ModalSearch from "@/Components/Modal/ModalSearch";
// import ModalDetailGroup from "./DetailGroup";
import Swal from "sweetalert2";
import SelectTailwind from "react-tailwindcss-select";
import AGGrid from "@/Components/AgGrid";
import { set } from "react-datepicker/dist/date_utils";
import { get } from "jquery";
import { log } from "node:console";
import Loader from "@/Components/Loader";

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

  const [data, setData] = useState<any>(InitalData);
  const [isSuccess, setIsSuccess] = useState<any>("");
  const [devJobpost, setDevJobpost] = useState<any>([]);
  const [company, setCompany] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const [searchJobpost, setSearchJobpost] = useState<any>({
    jobpost_search: [
      {
        jobpost_title: "",
        jobpost_id: "",
        flag: "flag",
      },
    ],
  });
  // console.log(data ,'inputttt');

  const [modal, setModal] = useState<any>({
    add: false,
    addJob: false,
    edit: false,
    delete: false,
    view: false,
    detail: false
  });

  // function get

  //get jobpost with division
  const getJobpostDev = async () => {
    try {
      const res = await axios.get("/getJobpostByDiv");
      const data = res.data;
      // console.log('dataaaaaa', data);
      // setDevJobpost(data);
    } catch (error) {
      console.log(error, 'ini erorr');
    }
  }

  //get jobpost with division by id
  const [jobpostDevId, setJobpostDevId] = useState<any>({});
  const getJobpostDevId = async (id: number) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/JobpostByDiv/${id}`);
      const data = res.data;
      // console.log(data,'<<<<<<<<<');
      setDevJobpost(data);
      // setJobpostDevId(data[0]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }


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
    getJobpostDev();
    setModal({ ...modal, view: true });
    getJobpostDevId(data.COMPANY_ID)
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
                  setModal({ ...modal, addJob: true });
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
    // console.log(data);

    return (
      <>
        <li className="mb-2">
          {/* Parent/Child Node */}
          <div
            className="flex items-center shadow-md p-2 rounded-md hover:bg-gray-300 cursor-pointer "
            onClick={() => onJobpostClick(jobpost.jobpost_id)}
          >
            <span className="w-3 h-3 bg-red-400 rounded-full inline-block mr-2"></span>
            {/* Teks Jobpost Name dengan conditional rendering */}
            <span className={jobpost.jobpost_status === 0 ? "line-through" : ""}>
              {jobpost?.jobpost_name}
            </span>

            <div className='text-sm text-gray-500'>
              / Job Post
            </div>
          </div>

          {/* action button */}
          {isSelected && (
            <div className="ml-6 mt-2 flex gap-2">

              <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                onClick={
                  () => {
                    setModal({ ...modal, edit: true });
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
                    setModal({ ...modal, detail: true });
                    setData({
                      ...data,
                      company_division_id: jobpost.company_division_id,
                      jobpost_parent: jobpost.jobpost_parent,
                      jobpost_name: jobpost.jobpost_name,
                      jobpost_description: jobpost.jobpost_description,
                    })
                    // getJobpostDevId(jobpost.jobpost_id);
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
      <ActionModal
        headers={'Content-Type: application/json'}
        submitButtonName={'Confirm'}
        method="POST"
        show={modal.status}
        onClose={() => {
          setModal({ ...modal, status: false, view: true });
          setData(InitalData);
          getJobpostDevId(company.COMPANY_ID)
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



      {

        isLoading ? (
          <Loader />) : (
          <>
            {/* Modal Show Jobpost Company */}
            <ActionModal
              submitButtonName={''}
              show={modal.view}
              onClose={() => {
                setModal({ ...modal, view: false });
                // setDevJobpost([]);
              }}
              title={company.COMPANY_NAME}
              url=""
              data={null}
              method="POST"
              onSuccess={handleSuccess}
              headers={{ 'Content-Type': 'application/json' }}
              classPanel="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-2xl"
              body={
                <>
                  {/* Modal Edit */}
                  <ActionModal
                    headers={'Content-Type: application/json'}
                    submitButtonName={'Submit'}
                    method="POST"
                    show={modal.edit}
                    onClose={() => {
                      setModal({ ...modal, edit: false })
                      setData(InitalData)
                      getJobpostDevId(company.COMPANY_ID)
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
                          <TextArea
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
                            placeholder="Description"
                          />
                        </div>
                      </>
                    }
                  />
                  {/* End Modal Edit */}

                  {/* Modal Detail */}
                  <ActionModal
                    headers={''}
                    submitButtonName={''}
                    method=""
                    show={modal.detail}
                    onClose={() => {
                      setModal({ ...modal, detail: false })
                      // setData(InitalData)
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
                            className="font-bold italic"
                            value="Company Division"
                          />
                          <span>{jobpostDevId?.company_division?.COMPANY_DIVISION_NAME}</span>
                        </div>
                        {/* jobpost_name */}
                        <div className="mt-4">
                          <InputLabel
                            className="font-bold italic"
                            value="Job Post Name"
                          />
                          <span>{data.jobpost_name}</span>
                        </div>
                        <div className="mt-4">
                          <InputLabel
                            htmlFor="Job Post Detail"
                            value="Job Post Description"
                            className="font-bold italic"
                          />
                          <span>{data.jobpost_description}</span>
                        </div>
                      </>
                    }
                  />
                  {/* End Modal Detail */}

                  {/* Modal Add Job Post */}
                  <ActionModal
                    method="post"
                    headers={"Add Job"}
                    show={modal.addJob}
                    onClose={() => {
                      setModal({ ...modal, addJob: false, view: true });
                      setData(InitalData)
                      getJobpostDevId(company.COMPANY_ID)
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
                          <TextArea
                            className="mt-2"
                            type="text"
                            id="Job Post Detail"
                            name="Job Post Detail"
                            value={data.jobpost_description || ''}
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


                  <div className="mb-3">
                    <ul>
                      {devJobpost.length > 0 ? (
                        Array.from(
                          new Set(
                            devJobpost
                              .filter((jobpost: any) => jobpost.COMPANY_DIVISION_NAME)
                              .map((jobpost: any) => jobpost.COMPANY_DIVISION_NAME)
                          )
                        ).map((divisionName: any, index: number) => (
                          // Ganti <li> dengan <div> untuk menghindari nested <li>
                          <div key={divisionName + index} className="mb-2 border-l-4 border-red-500 pl-2">
                            <TreeDivision
                              divisionName={divisionName}
                              jobposts={devJobpost.filter(
                                (jobpost: any) => jobpost.COMPANY_DIVISION_NAME === divisionName
                              )}
                            />
                          </div>
                        ))
                      ) : (
                        <div className="text-center"></div>
                      )}
                    </ul>
                  </div>
                </>
              }
            />
            {/* EndModal Show Jobpost Company */}

          </>
        )
      }



      <div className="grid grid-cols-4 py-4 xs:grid xs:grid-cols-1 xs:gap-0 lg:grid lg:grid-cols-4 lg:gap-4">
        <div className="flex flex-col">
          <div className="bg-white mb-4 rounded-md p-4 hidden">
            <div
              className="bg-red-600 w-fit p-2 rounded-md text-white hover:bg-red-500 hover:cursor-pointer hidden"
              onClick={() => {
                setModal({ ...modal, add: true });
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
              searchParam={null}
              // loading={isLoading.get_policy}
              url={"getJobpostByCompany"}
              doubleClickEvent={handleDetailJobpost}
              triggeringRefreshData={''}
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
