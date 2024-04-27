import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, TextInput } from "flowbite-react";
import { useSelector } from "react-redux";

export default function DashSalesReport() {
    const { currentUser } = useSelector((state) => state.user);
    const [sales, setSales] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedBill, setSelectedBill] = useState(null);
  
    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle date input change
    const handleDateChange = (e) => {
        const dateString = e.target.value;
        const date = dateString ? new Date(dateString) : null;
        setSelectedDate(date);
    };

    // Handle row click to show bill details
    const handleRowClick = (bill) => {
        setSelectedBill(bill);
    };

    // Filter sales based on search query and selected date
    // Filter sales based on search query and selected date
    const filterSales = sales.filter((sale, index, self) => {
        const saleDate = new Date(sale.buyDateTime).toLocaleDateString('en-CA');
        const matchesSearch = (
            sale.Customer.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sale.Product.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sale.Shop.shopName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const matchesDate = !selectedDate || saleDate === selectedDate.toLocaleDateString('en-CA');

        // Check if the current sale has the same customer ID, shop ID, and datetime as any previous sale
        const isUnique = self.findIndex((s) => 
            s.Customer.id === sale.Customer.id && 
            s.Shop.id === sale.Shop.id && 
            new Date(s.buyDateTime).toLocaleString() === new Date(sale.buyDateTime).toLocaleString()
        ) === index;

        return matchesSearch && matchesDate && isUnique;
    });


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

    return (
        <div className="p-3 w-full">
            <Link to="/dashboard?tab=dash">Home</Link>
            <h1 className="mt-3 mb-3 text-left font-semibold text-xl">All Sales</h1>
            <div className="flex items-center justify-end">
                <div className="flex items-center">
                    <TextInput
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search"
                        className="w-72 h-10"
                    />
                    <TextInput
                        type="date"
                        placeholder="Select Date"
                        onChange={handleDateChange}
                        className="w-72 h-10 ml-3"
                    />
                </div>
            </div>
            <div className="mt-4">
                {filterSales.length > 0 ? (
                    <Table hoverable className="shadow-md w-full">
                        <TableHead>
                            <TableHeadCell>Customer Name</TableHeadCell>
                            {/* <TableHeadCell>Item Name</TableHeadCell> */}
                            <TableHeadCell>Shop Name</TableHeadCell>
                            <TableHeadCell>Buy Date Time</TableHeadCell>
                            {/* <TableHeadCell>Unit Price</TableHeadCell>
                            <TableHeadCell>Type</TableHeadCell>
                            <TableHeadCell>Quantity</TableHeadCell> */}
                            <TableHeadCell>Amount Paid</TableHeadCell>
                        </TableHead>
                        <TableBody>
                            {filterSales.map((sale) => (
                                <TableRow key={sale.id} className="bg-white dark:border-gray-700 dark:bg-gray-800" onClick={() => handleRowClick(sale)}>
                                    <TableCell>{sale.Customer.firstname}</TableCell>
                                    {/* <TableCell>{sale.Product.itemName}</TableCell> */}
                                    <TableCell>{sale.Shop.shopName}</TableCell>
                                    <TableCell>{new Date(sale.buyDateTime).toLocaleString()}</TableCell>
                                    {/* <TableCell>Rs. {sale.unitPrice}</TableCell>
                                    <TableCell>{sale.type}</TableCell>
                                    <TableCell>{sale.quantity}</TableCell> */}
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
