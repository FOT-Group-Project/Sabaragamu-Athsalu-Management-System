import { React, useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Avatar,
  Button,
  Breadcrumb,
  Modal,
  Checkbox,
  Label,
  Alert,
  TextInput,
  Select,
  Spinner,
} from "flowbite-react";
import { FaUserEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { HiHome } from "react-icons/hi";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Profile from "../assets/add-pic.png";
import {
  HiOutlineExclamationCircle,
  HiPlusCircle,
  HiUserAdd,
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

export default function DashSalesReport() {
    const { currentUser } = useSelector((state) => state.user);
    const [sales, setSales] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [openModal, setOpenModal] = useState(false);
    
    const [formData, setFormData] = useState({});

    const [createLoding, setCreateLoding] = useState(null);

    const [errorMessage, setErrorMessage] = useState(null);

    const fetchSales = async () => {
        try{
            const res = await fetch("api/sales-report/getsales");
            const data = await res.json();
            if(res.ok){
                setSales(data.sales);
            }
        }catch (error){
            console.log(error.message);
        }
    };

    useEffect(() => {
        if(currentUser.role == "Admin"){
            fetchSales();
        }
    }, [sales.id]);

    return(
        <div className="p-3 w-full">
            <AnimatePresence>
                
            </AnimatePresence>
        </div>
    );
}