import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import ModalToAdd from '@/Components/Modal/ModalToAdd';
import ToastMessage from '@/Components/ToastMessage';
import Button from '@/Components/Button/Button';
import InputLabel from '@/Components/InputLabel';
import TextArea from '@/Components/TextArea';
import Checkbox from '@/Components/Checkbox';
import TextInput from '@/Components/TextInput';
import { useState } from 'react';
import { InertiaFormProps } from '@inertiajs/react/types/useForm';
import axios from 'axios';

export default function Relation({ auth }: PageProps) {

    interface FormInterface {
        group_id: string,
        name_relation: string,
        parent_id: string,
        abbreviation: string,
        relation_aka: string,
        relation_email: string,
        relation_description: string,
        relation_type_id: any
    }
    
    const [mappingParent, setMappingParent] = useState<any>({
        mapping_parent: [],
    })

    const {
        flash, 
        relation, 
        relationGroup, 
        salutation, 
        relationType, 
        relationStatus, 
        relationLOB, 
        custom_menu}: any = usePage().props

    const group = [
        { id: '1', stat: 'FRESNEL' },
        { id: '2', stat: 'FRESNEL 1' },
        { id: '3', stat: 'FRESNEL 2' },
    ];

    const parent = [
        { id: '1', stat: 'KILLAN' },
        { id: '2', stat: 'FRENSEL' },
        { id: '3', stat: 'TEKNOLOGI' },
    ];

    const projects = [
        { name: 'Insurance', initials: 'GA', href: '#', members: 16, bgColor: 'bg-pink-600' },
        { name: 'Agent', initials: 'CD', href: '#', members: 12, bgColor: 'bg-purple-600' },
        { name: 'Broker', initials: 'T', href: '#', members: 16, bgColor: 'bg-yellow-500' },
        { name: 'Autoworkshop', initials: 'RC', href: '#', members: 8, bgColor: 'bg-green-500' },
        { name: 'Other', initials: 'RCS', href: '#', members: 1, bgColor: 'bg-red-500' },
    ]

    const [isSuccess, setIsSuccess] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const getMappingParent = async (name: string, column: string) => {

        // setIsLoading(true)
        
        if (name) {
            await axios.post(`/getMappingParent`, {name, column})
            .then((res:any) => {
                setMappingParent({
                    mapping_parent: res.data,
                })
            })
            .catch((err) => {
                console.log(err)
            })
        }

        // setIsLoading(false)

    }

    const {data, setData, errors, reset} = useForm({
        group_id: '',
        name_relation: '',
        parent_id: '',
        abbreviation: '',
        relation_aka:'',
        relation_email:'',
        relation_description:'',
        relation_lob_id:'',
        salutation_id:'',
        relation_status_id:'',
        relation_type_id: []
    });

    const handleSuccess = (message: string) => {
        setIsSuccess('')
        reset()
        setData({
            group_id: '',
            name_relation: '',
            parent_id: '',
            abbreviation: '',
            relation_aka:'',
            relation_email:'',
            relation_description:'',
            relation_lob_id:'',
            salutation_id:'',
            relation_status_id:'',
            relation_type_id: []
        })
        setIsSuccess(message)
    }

    const handleCheckbox = (e: any) => {
        const {value, checked} = e.target

        if (checked) {
            setData('relation_type_id', [
                ...data.relation_type_id,
                {
                    id: value
                }
            ])
        } else {
            const updatedData = data.relation_type_id.filter((d: any) => d.id !== value)
            setData('relation_type_id', updatedData)
        }

    };
    
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    const [modal, setModal] = useState({
        add: false,
        delete: false,
        edit: false,
        view: false,
        document: false
    })
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={"Relation"}
        >
            <Head title="Relation" />

            {
                isSuccess &&
                <ToastMessage
                    message={isSuccess}
                    isShow={true}
                    isSuccess={true}
                />
            }

            <div>
                <div className="max-w-0xl mx-auto sm:px-6 lg:px-0">
                    <div className="bg-white overflow-hidden shadow-lg sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                        {/* button add relation */}
                        <Button
                            className="text-sm font-semibold px-3 py-2 mb-5"
                            onClick={() => setModal({add: true, delete: false, edit: false, view: false, document: false})}
                        >
                            Add Relation
                        </Button>
                        {/* modal add relation */}
                        <ModalToAdd
                            show={modal.add}
                            onClose={() => setModal({add: false, delete: false, edit: false, view: false, document: false})}
                            title={"Add Relation"}
                            url={`/relation`}
                            data={data}
                            onSuccess={handleSuccess}
                            body={
                            <>
                                <div className="mb-4">
                                <InputLabel htmlFor="group_id" value="Group" />
                                    <select
                                        className='mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6'
                                        value={data.group_id}
                                        onChange={(e) => {
                                            setData('group_id', e.target.value)
                                            getMappingParent(e.target.value, 'group_id')
                                        }}
                                    >
                                        <option>-- Choose Group --</option>
                                        {
                                            group.map((groups: any, i: number) => {
                                                return (
                                                    <option key={i} value={groups.id}>{groups.stat}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="mb-4">
                                <InputLabel htmlFor="relation_status_id" value="Relation Status" />
                                    <select
                                        className='mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6'
                                        value={data.relation_status_id}
                                        onChange={(e) => {
                                            setData('relation_status_id', e.target.value)
                                        }}
                                    >
                                        <option>-- Choose Relation Status --</option>
                                        {
                                            relationStatus.map((relationStatus: any, i: number) => {
                                                return (
                                                    <option key={i} value={relationStatus.relation_status_id}>{relationStatus.relation_status_name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <InputLabel htmlFor="name_relation" value="Name Relation" />
                                    <TextInput
                                        id="name_relation"
                                        type="text"
                                        name="name_relation"
                                        value={data.name_relation}
                                        className=""
                                        autoComplete="name_relation"
                                        onChange={(e) => setData('name_relation', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                <InputLabel htmlFor="salutation_id" value="Salutation" />
                                    <select
                                        className='mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6'
                                        value={data.salutation_id}
                                        onChange={(e) => {
                                            setData('salutation_id', e.target.value)
                                        }}
                                    >
                                        <option>-- Choose Salutation --</option>
                                        {
                                            salutation.map((salutations: any, i: number) => {
                                                return (
                                                    <option key={i} value={salutations.salutation_id}>{salutations.salutation_name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <InputLabel htmlFor="parent_id" value="Parent" />
                                    <select
                                        className='mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6'
                                        value={data.parent_id}
                                        onChange={(e) => setData('parent_id', e.target.value)}
                                    >
                                        <option>-- Choose Parent --</option>
                                        {
                                            mappingParent.mapping_parent.map((parents: any, i: number) => {
                                                return (
                                                    <option key={i} value={parents.RELATION_ORGANIZATION_ID}>{parents.text_combo}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <InputLabel htmlFor="abbreviation" value="Abbreviation" />
                                    <TextInput
                                        id="abbreviation"
                                        type="text"
                                        name="abbreviation"
                                        value={data.abbreviation}
                                        className=""
                                        autoComplete="abbreviation"
                                        onChange={(e) => setData('abbreviation', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <InputLabel htmlFor="relation_aka" value="AKA" />
                                    <TextInput
                                        id="relation_aka"
                                        type="text"
                                        name="relation_aka"
                                        value={data.relation_aka}
                                        className=""
                                        autoComplete="relation_aka"
                                        onChange={(e) => setData('relation_aka', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <InputLabel htmlFor="relation_email" value="Email" />
                                    <TextInput
                                        id="relation_email"
                                        type="email"
                                        name="relation_email"
                                        value={data.relation_email}
                                        className=""
                                        autoComplete="relation_email"
                                        onChange={(e) => setData('relation_email', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <InputLabel htmlFor="relation_type_id" value="Relation Type" />
                                    <div>
                                    <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                                        {
                                            relationType.map((typeRelation:any, i:number) => {
                                                return (
                                                    <li key={typeRelation.RELATION_TYPE_ID} className="col-span-1 flex rounded-md shadow-sm">
                                                        <div
                                                        className='flex w-10 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium shadow-md text-white'
                                                        >
                                                        <Checkbox 
                                                            name="relation_type_id[]" 
                                                            id={typeRelation.RELATION_TYPE_ID} 
                                                            value={typeRelation.RELATION_TYPE_ID} 
                                                            onChange={(e) => handleCheckbox(e)} 
                                                            />
                                                        </div>
                                                        <div className="flex flex-1 items-center justify-between truncate rounded-r-md shadow-md bg-white">
                                                            <div className="flex-1 truncate px-1 py-2 text-xs">
                                                                <span className="text-gray-900">
                                                                {typeRelation.RELATION_TYPE_NAME}
                                                                </span>
                                                            </div>
                                                        
                                                        </div>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <InputLabel htmlFor="relation_lob_id" value="Relation Lob" />
                                    <select
                                        className='mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-red-600 sm:text-sm sm:leading-6'
                                        value={data.relation_lob_id}
                                        onChange={(e) => setData('relation_lob_id', e.target.value)}
                                    >
                                        <option>-- Choose Relation Lob --</option>
                                        {
                                            relationLOB.map((rLob: any, i: number) => {
                                                return (
                                                    <option key={i} value={rLob.RELATION_LOB_ID}>{rLob.RELATION_LOB_NAME}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <InputLabel htmlFor="relation_description" value="Relation Description" />
                                    <TextArea
                                    id="relation_description"
                                    name="relation_description"
                                    defaultValue={data.relation_description}
                                    onChange={(e:any) => setData('relation_description', e.target.value)}
                                    required
                                    />
                                </div>
                            </>
                            }
                        />

                        <div>
                            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                                {relationGroup.map((item:any) => (
                                <div key={item.RELATION_GROUP_ID} className="overflow-hidden rounded-lg bg-white shadow sm:p-6">
                                    <dd className="text-2xl font-semibold tracking-tight text-gray-900">{item.RELATION_GROUP_NAME}</dd>
                                </div>
                                ))}
                            </dl>
                        </div>
                        {/* end Modal add Relation */}
                        {/* table relation in here */}
                        {/* <div className="mt-8 flow-root">
                            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                                        Name
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Abbreviation
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        AKA
                                    </th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {relation?.map((d: any, i: number) => (
                                    <tr key={i} className="even:bg-gray-50">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                                        {d.RELATION_ORGANIZATION_NAME}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{d.RELATION_ORGANIZATION_ABBREVIATION}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{d.RELATION_ORGANIZATION_AKA}</td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                                        <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                            Action<span className="sr-only">, {d.name}</span>
                                        </a>
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                                </table>
                            </div>
                            </div>
                        </div> */}
                        {/* end table relaton in here */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
