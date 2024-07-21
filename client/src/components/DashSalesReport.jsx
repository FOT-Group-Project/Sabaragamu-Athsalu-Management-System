import { saveAs } from "file-saver";
import {
  Breadcrumb,
  Button,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
} from "flowbite-react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { HiHome } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

export default function DashSalesReport() {
  const { currentUser } = useSelector((state) => state.user);
  const [sales, setSales] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredSales, setFilteredSales] = useState([]);
  const [totalSaleAmount, setTotalSaleAmount] = useState(0);
  const [selectedSaleType, setSelectedSaleType] = useState("");
  const saleTypes = ["Cash", "Credit"];

  const isFilterActive =
    searchQuery !== "" || startDate !== null || endDate !== null;

  // Pagiation
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

  const onPageChange = (page) => setCurrentPage(page);

  const currentData = filteredSales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination

  // Handle sale type change
  const handleSaleTypeChange = (e) => {
    setSelectedSaleType(e.target.value);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle start date change
  const handleStartDateChange = (e) => {
    const dateString = e.target.value;
    const date = dateString ? new Date(dateString) : null;
    setStartDate(date);
  };

  // Handle end date change
  const handleEndDateChange = (e) => {
    const dateString = e.target.value;
    const date = dateString ? new Date(dateString) : null;
    setEndDate(date);
  };

  // Filter sales based on search query, selected date, and sale type
  const filterSales = () => {
    const aggregatedSales = {};
    const filtered = sales.filter((sale) => {
      const saleDate = new Date(sale.buyDateTime).toLocaleDateString("en-CA");
      const matchesSearch = sale.Product.itemName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const isInDateRange =
        (!startDate || saleDate >= startDate.toLocaleDateString("en-CA")) &&
        (!endDate || saleDate <= endDate.toLocaleDateString("en-CA"));
      const matchesSaleType =
        sale.type === selectedSaleType || selectedSaleType === "";
      return matchesSearch && isInDateRange && matchesSaleType;
    });

    // Aggregate sales by itemId
    filtered.forEach((sale) => {
      const { itemId, quantity, unitPrice } = sale;
      if (aggregatedSales[itemId]) {
        aggregatedSales[itemId].quantity += quantity;
        aggregatedSales[itemId].amountPaid += quantity * unitPrice;
      } else {
        aggregatedSales[itemId] = {
          itemId,
          productName: sale.Product.itemName,
          type: sale.type,
          quantity,
          unitPrice,
          amountPaid: quantity * unitPrice,
        };
      }
    });

    // Calculate the total sale amount
    const totalAmount = Object.values(aggregatedSales).reduce(
      (acc, sale) => acc + sale.amountPaid,
      0
    );
    setTotalSaleAmount(Number(totalAmount.toFixed(2)));

    setFilteredSales(Object.values(aggregatedSales));
  };

  // Clear filters
  const clearFilters = () => {
    //end and start date clear
    document.getElementById("start-date").value = "";
    document.getElementById("end-date").value = "";
    setSearchQuery("");
    setStartDate(null);
    setEndDate(null);
    setFilteredSales([]);
    setTotalSaleAmount(0);
  };

  const fetchSales = async () => {
    try {
      const res = await fetch("api/sales-report/getsales");
      const data = await res.json();
      if (res.ok) {
        setSales(data.sales);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Fetch sales by shopId
  const fetchSalesByShopId = async (shopId) => {
    try {
      const res = await fetch(`api/sales-report/getsales/${shopId}`);
      const data = await res.json();
      if (res.ok) {
        setSales(data.sales);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (currentUser.role === "Accountant" || currentUser.role === "Admin" || currentUser.role === "Director") {
      fetchSales();
    } else if (currentUser.role === "Seller") {
      //get user's shopId from shop table
      const fetchShopId = async () => {
        try {
          const res = await fetch(`api/shop/getshop/${currentUser.id}`);
          const data = await res.json();
          if (res.ok) {
            fetchSalesByShopId(data.shops[0].id);
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      fetchShopId();
    }
  }, []);

  // Call filterSales whenever selectedSaleType changes
  useEffect(() => {
    filterSales();
  }, [selectedSaleType]);

  useEffect(() => {
    if (sales.length > 0) {
      filterSales();
    }
  }, [sales, searchQuery, startDate, endDate]);

  // Export sales report to xlsx
  const exportToExcel = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const exportData = filteredSales.map((sale) => ({
      "Product ID": sale.itemId,
      "Product Name": sale.productName,
      Type: sale.type,
      Quantity: sale.quantity,
      "Unit Price": sale.unitPrice,
      "Amount Paid": sale.unitPrice * sale.quantity,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Get current date and time
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().replace(/[-T:\.Z]/g, "");

    const fileName = `SalesReport_${formattedDate}${fileExtension}`;
    const data = new Blob([excelBuffer], { type: fileType });

    saveAs(data, fileName); // Use saveAs function from file-saver
  };

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // Add leading zero if month or day is less than 10
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;

    // Format: YYYY-MM-DD (required for type="date")
    return `${year}-${month}-${day}`;
  }

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
            <Breadcrumb.Item>Sales Report</Breadcrumb.Item>
          </Breadcrumb>

          <div className="flex items-center justify-between">
            <h1 className="mt-3 mb-3 text-left font-semibold text-xl">
              Sales Report
            </h1>
            <Button color="blue" onClick={exportToExcel} className="h-10 ml-2">
              Export to Excel
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-cente">
              <TextInput
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search By Product"
                className="w-full md:w-52 h-10 mb-2 md:mb-0 md:mr-2"
              />
              <div className="w-full md:w-40 h-10 mb-0 md:mb-0 md:mr-2">
                {/* <Label value="Sale Type" /> */}
                <Select
                  id="saleType"
                  required
                  shadow
                  value={selectedSaleType}
                  onChange={handleSaleTypeChange}
                >
                  <option value="">Select Sale Type</option>
                  {saleTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </div>

              <TextInput
                id="start-date"
                type="date"
                placeholder="Start Date"
                defaultValue={"2022-01-01"}
                onChange={handleStartDateChange}
                className="w-full md:w-48 h-10 mb-2 md:mb-0 md:mr-2"
              />

              <TextInput
                id="end-date"
                type="date"
                placeholder="End Date"
                defaultValue={getCurrentDate()}
                onChange={handleEndDateChange}
                className="w-full md:w-48 h-10 mb-2 md:mb-0 md:mr-2"
              />
              <Button
                onClick={clearFilters}
                className="h-10"
                disabled={!isFilterActive}
                color="blue"
              >
                Clear Filters
              </Button>

              {/* <Button onClick={filterSales} className="h-10 mr-2">Filter</Button> */}
            </div>
            <div className="ml-6 text-lg">
              <p className="text-600 font-bold">
                Total Sale Amount:{" "}
                <span className="text-green-600 font-bold">
                  Rs. {totalSaleAmount}
                </span>
              </p>
            </div>
          </div>
          <div className="mt-4">
            {currentData.length > 0 ? (
              <>
                <Table hoverable className="shadow-md w-full">
                  <TableHead>
                    <TableHeadCell>Product ID</TableHeadCell>
                    <TableHeadCell>Product Name</TableHeadCell>
                    <TableHeadCell>Type</TableHeadCell>
                    <TableHeadCell>Quantity</TableHeadCell>
                    <TableHeadCell>Unit Price</TableHeadCell>
                    <TableHeadCell>Amount Paid</TableHeadCell>
                  </TableHead>
                  <TableBody>
                    {currentData.map((sale) => (
                      <TableRow
                        key={sale.id}
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      >
                        <TableCell>Item :{sale.itemId}</TableCell>
                        <TableCell>{sale.productName}</TableCell>
                        <TableCell>{sale.type}</TableCell>
                        <TableCell>{sale.quantity}</TableCell>
                        <TableCell>Rs. {sale.unitPrice}</TableCell>
                        <TableCell>
                          Rs. {sale.unitPrice * sale.quantity}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex overflow-x-auto sm:justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    showIcons
                  />
                </div>
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
