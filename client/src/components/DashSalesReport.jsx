import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, TextInput, Button } from "flowbite-react";
import { useSelector } from "react-redux";

export default function DashSalesReport() {
    const { currentUser } = useSelector((state) => state.user);
    const [sales, setSales] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [filteredSales, setFilteredSales] = useState([]);
    const [totalSaleAmount, setTotalSaleAmount] = useState(0);

    const isFilterActive = searchQuery !== "" || startDate !== null || endDate !== null;

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

    // Filter sales based on search query and selected date
    const filterSales = () => {
        const filtered = sales.filter((sale) => {
            const saleDate = new Date(sale.buyDateTime).toLocaleDateString('en-CA');
            const matchesSearch = sale.Product.itemName.toLowerCase().includes(searchQuery.toLowerCase());
            const isInDateRange = (!startDate || saleDate >= startDate.toLocaleDateString('en-CA')) && (!endDate || saleDate <= endDate.toLocaleDateString('en-CA'));
            return matchesSearch && isInDateRange;
        });

        // Calculate the total sale amount
        const totalAmount = filtered.reduce((acc, sale) => acc + sale.unitPrice * sale.quantity, 0);
        setTotalSaleAmount(Number(totalAmount.toFixed(2)));
        
        setFilteredSales(filtered);
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

    useEffect(() => {
        if (currentUser.role === "Admin") {
            fetchSales();
        }
    }, []);

    useEffect(() => {
        if (sales.length > 0) {
            filterSales();
        }
    }, [sales, searchQuery, startDate, endDate]);

    return (
        <div className="p-3 w-full">
            <Link to="/dashboard?tab=dash">Home</Link>
            <h1 className="mt-3 mb-3 text-left font-semibold text-xl">Sales Report</h1>
            <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center">
                    <TextInput
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search By Product"
                        className="w-full md:w-72 h-10 mb-2 md:mb-0 md:mr-2"
                    />

                    <TextInput
                        id="start-date"
                        type="date"
                        placeholder="Start Date"
                        onChange={handleStartDateChange}
                        className="w-full md:w-48 h-10 mb-2 md:mb-0 md:mr-2"
                    />

                    <TextInput
                        id="end-date"
                        type="date"
                        placeholder="End Date"
                        onChange={handleEndDateChange}
                        className="w-full md:w-48 h-10 mb-2 md:mb-0 md:mr-2"
                    />

                    {/* <Button onClick={filterSales} className="h-10 mr-2">Filter</Button> */}
                    <Button onClick={clearFilters} className="h-10" disabled={!isFilterActive}>Clear Filters</Button>
                </div>
                <div className="ml-6 text-lg">
                    <p className="text-600 font-bold">Total Sale Amount: <span className="text-green-600 font-bold">Rs. {totalSaleAmount}</span></p>
                </div>
            </div>
            <div className="mt-4">
                {filteredSales.length > 0 ? (
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
                            {filteredSales.map((sale) => (
                                <TableRow key={sale.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <TableCell>{sale.itemId}</TableCell>
                                    <TableCell>{sale.Product.itemName}</TableCell>
                                    <TableCell>{sale.type}</TableCell>
                                    <TableCell>{sale.quantity}</TableCell>
                                    <TableCell>Rs. {sale.unitPrice}</TableCell>
                                    <TableCell>Rs. {sale.unitPrice * sale.quantity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p>No sales match your search criteria!</p>
                )}
            </div>
        </div>
    );
}
