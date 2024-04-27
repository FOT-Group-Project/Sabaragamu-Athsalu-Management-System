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
        setFilteredSales(filtered);
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
            <h1 className="mt-3 mb-3 text-left font-semibold text-xl">Sales Report Dashboard</h1>
            <div className="flex items-center justify-end">
                <div className="flex items-center">
                    <TextInput
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search By Product"
                        className="w-72 h-10"
                    />
                    <label htmlFor="startDate"  className="ml-3">Start Date:</label>
                    <TextInput
                        type="date"
                        placeholder="Start Date"
                        onChange={handleStartDateChange}
                        className="w-72 h-10 ml-3"
                    />

                    <label htmlFor="endDate" className="ml-3">End Date:</label>
                    <TextInput
                        type="date"
                        placeholder="End Date"
                        onChange={handleEndDateChange}
                        className="w-72 h-10 ml-3"
                    />
                    {/* <Button onClick={filterSales} className="ml-3">Filter</Button> */}
                </div>
            </div>
            <div className="mt-4">
                {filteredSales.length > 0 ? (
                    <Table hoverable className="shadow-md w-full">
                        <TableHead>
                            <TableHeadCell>Product ID</TableHeadCell>
                            <TableHeadCell>Product Name</TableHeadCell>
                            <TableHeadCell>Type</TableHeadCell>
                            <TableHeadCell>Buy Date Time</TableHeadCell>
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
                                    <TableCell>{new Date(sale.buyDateTime).toLocaleString()}</TableCell>
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
