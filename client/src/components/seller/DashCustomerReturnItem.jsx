import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Button,
  Breadcrumb,
  TextInput,
} from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Label } from "flowbite-react";

export default function DashCustomerReturnItem() {
  const { currentUser } = useSelector((state) => state.user);
  const [returnItems, setReturnItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredReturnItems, setFilteredReturnItems] = useState([]);
  const [returnDateTime, setReturnDateTime] = useState(null);

  // Determine if the filter is active
  const isFilterActive = searchQuery.length > 0 || returnDateTime !== null;

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle date input change
  const handleDateChange = (e) => {
    setReturnDateTime(e.target.value);
  };

  // Fetch return items
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

  // Fetch return items by shop ID
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

  // Filter return items based on search query and return date
  useEffect(() => {
    if (isFilterActive) {
      setFilteredReturnItems(
        returnItems.filter((item) => {
          const matchesSearchQuery =
            item.Customer.firstname
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            item.Customer.lastname
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            item.Product.itemName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            item.quantity.toString().includes(searchQuery.toLowerCase()) ||
            item.BuyItem.unitPrice
              .toString()
              .includes(searchQuery.toLowerCase()) ||
            item.buyDateTime
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            item.returnDateTime
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            item.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.BuyItem.unitPrice * item.quantity)
              .toString()
              .includes(searchQuery.toLowerCase());
          // Check if return date matches
          const matchesReturnDate = returnDateTime
            ? new Date(item.returnDateTime).toISOString().split("T")[0] ===
              returnDateTime
            : true;

          return matchesSearchQuery && matchesReturnDate;
        })
      );
    } else {
      setFilteredReturnItems(returnItems);
    }
  }, [searchQuery, returnDateTime, returnItems]);

  // Fetch return items based on user role
  useEffect(() => {
    if (currentUser.role === "Admin") {
      fetchReturnItems();
    } else if (currentUser.role === "Seller") {
      const fetchShopId = async () => {
        try {
          const res = await fetch(`/api/shop/getshop/${currentUser.id}`);
          const data = await res.json();
          if (res.ok) {
            if (Array.isArray(data.shops) && data.shops.length > 0) {
              const shopId = data.shops[0].id;
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
  }, [currentUser]);

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

            <Button color="blue" className="h-10  ml-2">
              Export to Excel
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center">
              <TextInput
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search"
                className="w-full md:w-52 h-10 mb-2 md:mb-0 md:mr-2"
              />
              <div className="flex items-center space-x-2">
                <Label>Filter by Return Date</Label>
                <TextInput
                  id="date"
                  type="date"
                  value={returnDateTime || ""}
                  onChange={handleDateChange}
                  className="w-full md:w-48 h-10 mb-2 md:mb-0 md:mr-2"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button style={{ backgroundColor: "red" }} className="h-10 w-32 ml-2">
                Add Retuns
              </Button>
            </div>
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
                {(isFilterActive ? filteredReturnItems : returnItems).map(
                  (sale) => (
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
                      <TableCell>
                        {new Date(sale.returnDateTime).toLocaleString()}
                      </TableCell>
                      <TableCell>{sale.reason}</TableCell>
                      <TableCell>
                        {sale.BuyItem.unitPrice * sale.quantity}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
