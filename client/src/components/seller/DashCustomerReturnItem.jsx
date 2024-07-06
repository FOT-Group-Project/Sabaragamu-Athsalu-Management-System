import { React, useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  Toast,
} from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { useSelector } from "react-redux";


export default function DashCustomerReturnItem() {
  const { currentUser } = useSelector((state) => state.user);
  const [returnItems, setReturnItems] = useState([]);

  //fetch return items
  const fetchReturnItems = async () => {
    try {
      const res = await fetch(`/api/customerreturnitem/getreturns`);
      const data = await res.json();
      if (res.ok) {
        setReturnItems(data.sales);
      }
    }catch (error) {
      console.error(error);
    }
  };


  //fetch return items by shop id
  const fetchReturnItemsbyShopId = async (shopId) => { 
    try {
      const res = await fetch(
        `/api/customerreturnitem/getreturnsbyshop/${shopId}`
      );
      const data = await res.json();
      if (res.ok) {
        setReturnItems(data.sales);
      }
    }catch (error) {
      console.error(error);
    }
  };


  //fetch return items by customer id
  useEffect(() => { 
    if (currentUser.role === "Admin") {
      fetchReturnItems();
    }else if (currentUser.role === "Seller") {
      //get user's shop id
      const fetchShopId = async () => {
        try {
          const res = await fetch(`/api/shop/getshop/${currentUser.id}`);
          const data = await res.json();
          if (res.ok) {
            fetchReturnItemsbyShopId(data.shop[0].id);
          }
        }catch (error) {
          console.error(error);
        }
      };
      fetchShopId();
    }
  }, []);

  return (
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
            <Breadcrumb.Item>Return Items</Breadcrumb.Item>
          </Breadcrumb>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
