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
    const [searchQuery, setSearchQuery] = useState("");
  
    //function to handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    //filter sales by customer name,product name,shop name
    const filterSales = sales.filter((sale) =>
        sale.Customer.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.Product.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.Shop.shopName.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
    }, []);

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
                    <Link to="/dashboard?tab=dash">
                        <Breadcrumb.Item href="" icon={HiHome}>
                            Home
                        </Breadcrumb.Item>
                    </Link>
                    <Breadcrumb.Item>Shops</Breadcrumb.Item>
                </Breadcrumb>
                <h1 className="mt-3 mb-3 text-left font-semibold text-xl">
                    All Sales
                </h1>
                <div className="flex items-center justify-end">
                    <div className="flex items-center">
                            <TextInput
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Search"
                                className="w-72 h-10"
                            />
                    </div>
                </div>
                <div className="mt-4">
                {filterSales.length > 0 ? (
                        <>
                            <Table hoverable className="shadow-md w-full">
                                <TableHead>
                                    <TableHeadCell>Customer Name</TableHeadCell>
                                    <TableHeadCell>Item Name</TableHeadCell>
                                    <TableHeadCell>Shop Name</TableHeadCell>
                                    <TableHeadCell>Buy Date Time</TableHeadCell>
                                    <TableHeadCell>Unit Price</TableHeadCell>
                                    <TableHeadCell>Type</TableHeadCell>
                                    <TableHeadCell>Quantity</TableHeadCell>
                                    <TableHeadCell>Amount Paid</TableHeadCell>
                                </TableHead>
                                {filterSales.map((sale) => (
                                    <Table.Body key={sale.id} className="divide-y">
                                        <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <TableCell>{sale.Customer.firstname}</TableCell>
                                            <TableCell>{sale.Product.itemName}</TableCell>
                                            <TableCell>{sale.Shop.shopName}</TableCell>
                                            <TableCell>{sale.buyDateTime}</TableCell>
                                            <TableCell>Rs. {sale.unitPrice}</TableCell>
                                            <TableCell>{sale.type}</TableCell>
                                            <TableCell>{sale.quantity}</TableCell>
                                            <TableCell>
                                                {sale.unitPrice * sale.quantity}
                                            </TableCell>
                                        </TableRow>
                                    </Table.Body>
                                ))}
                            </Table>
                        </>
                        ) : (
                            <p>No sales match your search criteria!</p>
                        )}
                </div> 
            </motion.div>
            </AnimatePresence>
        </div>
    );
}