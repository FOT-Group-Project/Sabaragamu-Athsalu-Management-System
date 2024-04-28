import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
  Button,
  Breadcrumb,
  Datepicker,
  Modal,
} from "flowbite-react";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Label, Select } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { CiViewList } from "react-icons/ci";

export default function DashSellerInvetory() {
  const { currentUser } = useSelector((state) => state.user);
  const [sales, setSales] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSales = async () => {
    try {
      const res = await fetch("api/sales-report/getsales");
      const data = await res.json();
      if (res.ok) {
        // Group sales by customerId, shopId, and buyDateTime
        const groupedSales = groupSales(data.sales);
        setSales(groupedSales);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Function to group sales by customerId, shopId, and buyDateTime
  const groupSales = (sales) => {
    const groupedSales = {};
    sales.forEach((sale) => {
      const key = `${sale.customerId}-${sale.shopId}-${sale.buyDateTime}`;
      if (!groupedSales[key]) {
        groupedSales[key] = [sale];
      } else {
        groupedSales[key].push(sale);
      }
    });
    return Object.values(groupedSales);
  };

  // Function to calculate total amount for a bill
  const calculateTotalAmount = (bill) => {
    return bill.reduce(
      (total, sale) => total + sale.quantity * sale.unitPrice,
      0
    );
  };

  // Function to generate bill ID
  const generateBillId = (bill) => {
    const { customerId, shopId, buyDateTime } = bill[0];
    const formattedDate = new Date(buyDateTime).toLocaleDateString().replace(/\//g, "-");
    const formattedTime = new Date(buyDateTime).toLocaleTimeString().replace(/:/g, "");
    return `BILL-${customerId}-${shopId}-${formattedDate}-${formattedTime}`;
  };

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
            <Breadcrumb.Item>Sales History</Breadcrumb.Item>
          </Breadcrumb>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Sales History</h2>
            <div className="flex items-center space-x-2">
              <Label>Filter by Date</Label>
              <TextInput
                id="date"
                type="date"
                placeholder="Date"
                defaultValue={"2022-01-01"}
                onChange={(e) => console.log(e.target.value)}
                className="w-full md:w-48 h-10 mb-2 md:mb-0 md:mr-2"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-cente">
              <TextInput
                //value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full md:w-52 h-10 mb-2 md:mb-0 md:mr-2"
              />
            </div>
          </div>
          <div className="mt-4">
            {sales.length > 0 ? (
              <Table hoverable className="shadow-md w-full">
                <TableHead>
                  <TableHeadCell>Bill ID</TableHeadCell>
                  <TableHeadCell>Customer Name</TableHeadCell>
                  <TableHeadCell>Shop Name</TableHeadCell>
                  <TableHeadCell>Buy Date</TableHeadCell>
                  <TableHeadCell>Buy Time</TableHeadCell>
                  {/* <TableHeadCell>Item IDs</TableHeadCell> */}
                  <TableHeadCell>Total Amount</TableHeadCell>
                  <TableHeadCell></TableHeadCell>
                </TableHead>
                <TableBody>
                  {sales.map((bill, index) => (
                    <TableRow
                      key={index}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <TableCell>{generateBillId(bill)}</TableCell>
                      <TableCell>
                        {bill[0].Customer
                          ? bill[0].Customer.firstname +
                            " " +
                            bill[0].Customer.lastname
                          : "Unknown"}
                      </TableCell>
                      {bill[0].Shop ? (
                        <TableCell>{bill[0].Shop.shopName}</TableCell>
                      ) : (
                        <TableCell>Unknown</TableCell>
                      )}
                      <TableCell>
                        {new Date(bill[0].buyDateTime).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(bill[0].buyDateTime).toLocaleTimeString()}
                      </TableCell>
                      {/* <TableCell>
                        {bill.map((sale) => (
                          <span key={sale.id}>{sale.itemId}, </span>
                        ))}
                      </TableCell> */}
                      <TableCell>{calculateTotalAmount(bill)}</TableCell>
                      <TableCell>
                        <Button.Group>
                          <Button color="gray">
                            <CiViewList className="mr-3 h-4 w-4" />
                            View
                          </Button>
                        </Button.Group>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>No sales found</p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
