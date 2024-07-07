import { Head, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { FormEvent, PropsWithChildren, useEffect, useState } from "react";
import Button from "@/Components/Button/Button";
import TableTD from "@/Components/Table/TableTD";
import TableTH from "@/Components/Table/TableTH";
import axios from "axios";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import Pagination from "@/Components/Pagination";
import Swal from "sweetalert2";
import ModalToAction from "@/Components/Modal/ModalToAction";
import TextInput from "@/Components/TextInput";
import ModalToAdd from "@/Components/Modal/ModalToAdd";
import InputLabel from "@/Components/InputLabel";
import TextArea from "@/Components/TextArea";

export default function DetailAgent({
    auth,
    idAgent,
}: PropsWithChildren<{ auth: any; idAgent: any }>) {
    const [detailAgentNew, setDetailAgentNew] = useState<any>([]);

    useEffect(() => {
        getAgentDetail(idAgent);
    }, [idAgent]);

    // get detail agent
    const getAgentDetail = async (id: string) => {
        await axios
            .post(`/getAgentDetail`, { id })
            .then((res) => {
                setDetailAgentNew(res.data);
                // setDataById(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <span>{detailAgentNew.RELATION_AGENT_NAME}</span>
        </>
    );
}
