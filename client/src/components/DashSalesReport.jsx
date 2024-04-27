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
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
            >
                <Breadcrumb aria-label="Default breadcrumb example">
                    <Breadcrumb.Item href="#" icon={HiHome}>
                    Home
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Shops</Breadcrumb.Item>
                </Breadcrumb>
                <h1 className="mt-3 mb-3 text-left font-semibold text-xl">
                    All Sales
                </h1>

                {currentUser.role == "Admin" && sales.length > 0 ? (
                    <>
                        <Table hoverable className="shadow-md w-full">
                            <TableHead>
                                <TableHeadCell>Customer</TableHeadCell>
                                <TableHeadCell>Product</TableHeadCell>
                                <TableHeadCell>Shop</TableHeadCell>
                                <TableHeadCell>Quantity</TableHeadCell>
                                <TableHeadCell>Amount</TableHeadCell>
                                <TableHeadCell>Date</TableHeadCell>
                            </TableHead>
                            {sales.map((sale)=>(
                                <Table.Body className="divide-y" key={sale.id}>
                                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <TableCell>{sale.Product.itemName}</TableCell>
                                        <TableCell>{sale.Shop.shopName}</TableCell>
                                        <TableCell>{sale.quantity}</TableCell>
                                        <TableCell>{sale.amount}</TableCell>
                                        <TableCell>{sale.createdAt}</TableCell>
                                    </TableRow>
                                </Table.Body>
                            ))} 
                        </Table>
                    </>
                ) : (
                    <p>You have no Sales yet!</p>
                )}
            </motion.div>
            </AnimatePresence>
        </div>
    );
}