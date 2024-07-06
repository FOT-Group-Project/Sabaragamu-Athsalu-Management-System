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

/**
 * Renders the dashboard component for displaying customer return items.
 * Fetches return items from the API based on the user's role and shop ID.
 * Displays a table with customer return item details.
 *
 * @returns {JSX.Element} The rendered component.
 */
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
    } catch (error) {
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
    } catch (error) {
      console.error(error.message);
    }
  };

  //fetch return items by customer id
  useEffect(() => {
    if (currentUser.role === "Admin") {
      fetchReturnItems();
    } else if (currentUser.role === "Seller") {
      //get user's shop id
      const fetchShopId = async () => {
        try {
          const res = await fetch(`/api/shop/getshop/${currentUser.id}`);
          const data = await res.json();
          console.log("Shop ID Response:", data); // Log the response for debugging
          if (res.ok) {
            if (Array.isArray(data.shops) && data.shops.length > 0) {
              const shopId = data.shops[0].id; // Access the first shop's ID
              fetchReturnItemsbyShopId(shopId);
            } else {
              console.error("No shops found for the current user.");
            }
          } else {
            console.error("API response error:", data);
          }
        } catch (error) {
          console.error("Error fetching shop ID:", error);
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
          <div className="flex items-center justify-between">
            <h1 className="mt-3 mb-3 text-left font-semibold text-xl">
              Return Items : Report
            </h1>
            <Button color="blue" className="h-10 ml-2">
              Export to Excel
            </Button>
          </div>
          <div className="mt-4">
            <Table hoverable className="shadow-md w-full">
              <TableHead>
                <TableHeadCell>Customer Name</TableHeadCell>
                <TableHeadCell>Product Name</TableHeadCell>
                <TableHeadCell>Quantity</TableHeadCell>
                <TableHeadCell>Unit Price</TableHeadCell>
                <TableHeadCell>Buy Date Time</TableHeadCell>
                <TableHeadCell>Return Date Time</TableHeadCell>
                <TableHeadCell>Reason</TableHeadCell>
                <TableHeadCell>Amount Paid</TableHeadCell>
              </TableHead>
              <TableBody>

                {returnItems.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                      {`${sale.Customer.firstname} ${sale.Customer.lastname}`}
                    </TableCell>
                    <TableCell>{sale.Product.itemName}</TableCell>
                    <TableCell>{sale.quantity}</TableCell>
                    <TableCell>{sale.BuyItem.unitPrice}</TableCell>
                    <TableCell>
                      {new Date(sale.buyDateTime).toLocaleString()}
                    </TableCell>
                    <TableCell>{new Date(sale.returnDateTime).toLocaleString()}</TableCell>
                    <TableCell>{sale.reason}</TableCell>
                    <TableCell>
                      {sale.BuyItem.unitPrice * sale.quantity}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
