import {
  Breadcrumb,
  Button,
  Label,
  Modal,
  Pagination,
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
import { CiViewList } from "react-icons/ci";
import { FiPrinter } from "react-icons/fi";
import { HiHome } from "react-icons/hi";
import { PiExportBold } from "react-icons/pi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Logolight from "../assets/logolight.png";
// import Logodark from "../assets/logodark.png";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { IoMdClose } from "react-icons/io";

export default function DashSellerInvetory() {
  const { currentUser } = useSelector((state) => state.user);
  const [sales, setSales] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectBillPrint, setSelectBillPrint] = useState(null);
  const [selectedBillExport, setSelectedBillExport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const theme = useSelector((state) => state.theme.theme);
  const [searchQuery, setSearchQuery] = useState("");
  const [salesDate, setSalesDate] = useState(null);
  const [filteredSales, setFilteredSales] = useState([]);

  const isFilterActive =
    searchQuery !== "" || salesDate !== null || salesDate !== "";

  // Pagiation
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

  const onPageChange = (page) => setCurrentPage(page);

  const currentData = filteredSales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Function to handle search by query
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Function to handle search by date
  const handleDateChange = (e) => {
    // const dateString = e.target.value;
    // const date = dateString ? new Date(dateString) : null;
    setSalesDate(e.target.value);
  };

  //fetch sales
  const fetchSales = async () => {
    try {
      const res = await fetch("api/sales-report/getsales");
      const data = await res.json();
      if (res.ok) {
        // Group sales by customerId, shopId, and buyDateTime
        const groupedSales = groupSales(data.sales);
        setSales(groupedSales);
        setFilteredSales(groupedSales);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

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

  // Function to filter sales based on search query and date change
  // const filteredSales = sales.filter((bill) => {
  //   const customerName = bill[0].Customer
  //     ? `${bill[0].Customer.firstname} ${bill[0].Customer.lastname}`
  //     : "Unknown";
  //   const shopName = bill[0].Shop ? bill[0].Shop.shopName : "Unknown";
  //   const buyDate = new Date(bill[0].buyDateTime).toLocaleDateString();
  //   const buyTime = new Date(bill[0].buyDateTime).toLocaleTimeString();
  //   const totalAmount = calculateTotalAmount(bill);
  //   const searchValues = `${customerName} ${shopName} ${buyDate} ${buyTime} ${totalAmount}`;
  //   return searchValues.toLowerCase().includes(searchQuery.toLowerCase());
  // });

  // //function to print selected bill
  // const printBill = () => {
  //   const doc = new jsPDF();
  //   doc.setFontSize(12);
  //   doc.text("Invoice", 10, 10);
  //   doc.text(
  //     "Date : " + new Date(selectBillPrint[0].buyDateTime).toLocaleDateString(),
  //     10,
  //     20
  //   );
  //   doc.text("INV# : " + generateBillId(selectBillPrint), 10, 30);
  //   doc.text("Bill To:", 10, 40);
  //   doc.text(
  //     selectBillPrint[0].Customer.firstname +
  //       " " +
  //       selectBillPrint[0].Customer.lastname,
  //     10,
  //     50
  //   );
  //   doc.text(selectBillPrint[0].Customer.phone, 10, 60);
  //   doc.text(selectBillPrint[0].Customer.email, 10, 70);
  //   doc.text("Description", 10, 80);
  //   doc.text("Quantity", 60, 80);
  //   doc.text("Unit Price", 100, 80);
  //   doc.text("Total Price", 150, 80);
  //   let y = 90;
  //   selectBillPrint.forEach((sale) => {
  //     doc.text(sale.Product.itemName, 10, y);
  //     doc.text(sale.quantity.toString(), 60, y);
  //     doc.text("Rs." + sale.unitPrice.toFixed(2), 100, y);
  //     doc.text("Rs." + (sale.quantity * sale.unitPrice).toFixed(2), 150, y);
  //     y += 10;
  //   });
  //   doc.text("Total", 10, y);
  //   doc.text("Rs." + calculateTotalAmount(selectBillPrint).toFixed(2), 150, y);
  //   doc.text("Thank you for your business!", 10, y + 10);
  //   doc.save(generateBillId(selectBillPrint) + ".pdf");
  // };

  const exportBill = () => {
    const doc = new jsPDF();
    const invoice = selectedBillExport[0];
    const date = new Date(invoice.buyDateTime);

    // Add Logo
    doc.addImage(Logolight, "PNG", 10, 10, 35, 10); // Adjust position and size as necessary

    // Invoice title and details
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Invoice", 200, 15, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Date: ${date.toLocaleDateString()}`, 200, 20, { align: "right" });
    doc.text(`INV#: ${generateBillId(selectedBillExport)}`, 200, 25, {
      align: "right",
    });

    // Bill to section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 10, 40);
    doc.setFont("helvetica", "normal");
    doc.text(
      `${invoice.Customer.firstname} ${invoice.Customer.lastname}`,
      10,
      50
    );
    doc.text(invoice.Customer.phone, 10, 60);
    doc.text(invoice.Customer.email, 10, 70);

    // Add a horizontal line separator
    doc.setDrawColor(0, 0, 0); // black color
    doc.line(10, 75, 200, 75); // horizontal line (x1, y1, x2, y2)

    // Add table with sales details
    doc.autoTable({
      startY: 80,
      head: [["Description", "Quantity", "Unit Price", "Total Price"]],
      body: selectedBillExport.map((sale) => [
        sale.Product.itemName,
        sale.quantity,
        `Rs.${sale.unitPrice.toFixed(2)}`,
        `Rs.${(sale.quantity * sale.unitPrice).toFixed(2)}`,
      ]),
      theme: "striped",
      headStyles: { fillColor: [60, 141, 188] },
      styles: { cellPadding: 3, fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 60 }, // Description column width
        1: { cellWidth: 20 }, // Quantity column width
        2: { cellWidth: 30 }, // Unit Price column width
        3: { cellWidth: 30 }, // Total Price column width
      },
    });

    // Calculate and add total amount
    const totalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Total", 10, totalY);
    doc.text(
      `Rs.${calculateTotalAmount(selectedBillExport).toFixed(2)}`,
      200,
      totalY,
      { align: "right" }
    );
    doc.setFont("helvetica", "normal");

    // Add a horizontal line separator above the footer
    doc.line(10, totalY + 5, 200, totalY + 5);

    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    const pageWidth = doc.internal.pageSize.getWidth();
    const text = "Thank you for your business!";
    const textWidth = doc.getTextWidth(text);
    const xCenter = (pageWidth - textWidth) / 2;
    doc.text(text, xCenter, totalY + 15);

    // Save the PDF with a meaningful file name
    doc.save(`${generateBillId(selectedBillExport)}.pdf`);
  };

  const printBill = () => {
    // Define a custom page size for a 58mm wide paper
    const doc = new jsPDF({
      unit: "mm",
      format: [58, 100], // Width: 58mm, Height: 100mm
    });

    const invoice = selectBillPrint[0];
    const date = new Date(invoice.buyDateTime);

    // Add Logo - Adjust the size and position for narrow paper
    doc.addImage(Logolight, "PNG", 5, 5, 20, 5); // Adjust position and size

    // Invoice title and details
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Invoice", 55, 7, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`Date: ${date.toLocaleDateString()}`, 55, 10.5, {
      align: "right",
    });
    doc.text(`INV#: ${generateBillId(selectBillPrint)}`, 55, 14, {
      align: "right",
    });

    // Bill to section
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 5, 25);
    doc.setFont("helvetica", "normal");
    doc.text(
      `${invoice.Customer.firstname} ${invoice.Customer.lastname}`,
      5,
      30
    );
    doc.text(invoice.Customer.phone, 5, 35);
    doc.text(invoice.Customer.email, 5, 40);

    // Add a horizontal line separator
    doc.setDrawColor(0, 0, 0); // black color
    doc.line(5, 45, 55, 45); // horizontal line (x1, y1, x2, y2)

    // Add table with sales details
    const tableOptions = {
      startY: 47, // Adjust startY to align the table properly with preceding content
      head: [["Description", "Qty", "Unit", "Total"]],
      body: selectBillPrint.map((sale) => [
        sale.Product.itemName,
        sale.quantity,
        `Rs.${sale.unitPrice.toFixed(2)}`,
        `Rs.${(sale.quantity * sale.unitPrice).toFixed(2)}`,
      ]),
      theme: "striped",
      headStyles: { fillColor: [60, 141, 188] },
      styles: { cellPadding: 1, fontSize: 5 }, // Smaller font and padding for narrow paper
      columnStyles: {
        0: { cellWidth: 15 }, // Description column width
        1: { cellWidth: 8 }, // Quantity column width
        2: { cellWidth: 15 }, // Unit Price column width
        3: { cellWidth: 15 }, // Total Price column width
      },
      tableWidth: "auto", // Align content to the left by not wrapping it to fit the entire width
      margin: { left: 3 }, // Set the left margin to 3 units
    };

    doc.autoTable(tableOptions);

    // Calculate and add total amount
    const totalY = doc.lastAutoTable.finalY + 5;
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Total", 5, totalY);
    doc.text(
      `Rs.${calculateTotalAmount(selectBillPrint).toFixed(2)}`,
      55,
      totalY,
      { align: "right" }
    );
    doc.setFont("helvetica", "normal");

    // Add a horizontal line separator above the footer
    doc.line(5, totalY + 3, 55, totalY + 3);

    // Footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");

    // Calculate the page width
    const pageWidth = doc.internal.pageSize.getWidth();

    // Get the text width in the current font and size
    const text = "Thank you for your business!";
    const textWidth = doc.getTextWidth(text);

    // Calculate the x position for centered text
    const xCenter = (pageWidth - textWidth) / 2;

    // Add the centered text at the calculated position
    doc.text(text, xCenter, totalY + 8);

    // Generate the PDF as a Blob
    const pdfBlob = doc.output("blob");

    // Create a URL for the Blob
    const url = URL.createObjectURL(pdfBlob);

    // Open the URL in a new window/tab
    const printWindow = window.open(url);

    // If successfully opened the new window/tab, call print
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    } else {
      console.warn(
        "Unable to open the print window. Please check your browser settings."
      );
    }
  };

  // Function to generate bill ID
  const generateBillId = (bill) => {
    const { customerId, shopId, buyDateTime } = bill[0];
    const formattedDate = new Date(buyDateTime)
      .toLocaleDateString()
      .replace(/\//g, "-");
    const formattedTime = new Date(buyDateTime)
      .toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(/:/g, "");
    return `BILL-${customerId}-${shopId}-${formattedDate}-${formattedTime}`;
  };

  const filterSales = () => {
    const filtered = sales.filter((bill) => {
      const customerName = bill[0].Customer
        ? `${bill[0].Customer.firstname} ${bill[0].Customer.lastname}`
        : "Unknown";
      const shopName = bill[0].Shop ? bill[0].Shop.shopName : "Unknown";
      const buyDate = new Date(bill[0].buyDateTime).toLocaleDateString();
      const buyTime = new Date(bill[0].buyDateTime).toLocaleTimeString();
      const totalAmount = calculateTotalAmount(bill);
      const searchValues = `${customerName} ${shopName} ${buyDate} ${buyTime} ${totalAmount}`;

      const matchesQuery = searchValues
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesDate = salesDate
        ? new Date(bill[0].buyDateTime).toISOString().split("T")[0] ===
          salesDate
        : true;

      return matchesQuery && matchesDate;
    });

    setFilteredSales(filtered);
  };

  const fetchSalesByShopId = async (shopId) => {
    try {
      const res = await fetch(`api/sales-report/getsales/${shopId}`);
      const data = await res.json();
      if (res.ok) {
        // Group sales by customerId, shopId, and buyDateTime
        const groupedSales = groupSales(data.sales);
        setSales(groupedSales);
        setFilteredSales(groupedSales);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (
      currentUser.role === "Accountant" ||
      currentUser.role === "Admin" ||
      currentUser.role === "Director"
    ) {
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

  useEffect(() => {
    if (isFilterActive) {
      filterSales();
    } else {
      setFilteredSales(sales); // Reset to all sales when no filters are active
    }
  }, [searchQuery, salesDate]);

  // Effect to handle printing after selecting a bill
  useEffect(() => {
    if (selectBillPrint) {
      printBill();
    }
  }, [selectBillPrint]);

  //effect to handle export after selecting a bill
  useEffect(() => {
    if (selectedBillExport) {
      exportBill();
    }
  }, [selectedBillExport]);

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
                onChange={handleDateChange}
                className="w-full md:w-48 h-10 mb-2 md:mb-0 md:mr-2"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-cente">
              <TextInput
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search"
                className="w-full md:w-52 h-10 mb-2 md:mb-0 md:mr-2"
              />
            </div>
          </div>

          <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
              <div className="relative w-full max-w-lg mx-auto my-6">
                <div className="relative flex flex-col w-full bg-white border rounded-lg shadow-lg outline-none focus:outline-none">
                  <div className="flex items-center justify-between p-5 border-b border-solid rounded-t border-gray-300">
                    <h3 className="text-2xl font-semibold">
                      {theme === "light" ? (
                        <img
                          src={Logolight}
                          className="h-10"
                          alt="Flowbite Logo"
                        />
                      ) : (
                        <img
                          src={Logolight}
                          className="h-10"
                          alt="Flowbite Logo"
                        />
                      )}
                    </h3>
                    <div className="ml-4">
                      <h1 className="text-xl font-bold">Invoice</h1>
                      <div>
                        Date :{" "}
                        {selectedBill
                          ? new Date(
                              selectedBill[0].buyDateTime
                            ).toLocaleDateString()
                          : ""}
                      </div>
                      <div>
                        INV# :{" "}
                        {selectedBill ? generateBillId(selectedBill) : ""}
                      </div>
                    </div>
                    {/* <button
                      className="p-1 ml-auto bg-transparent border-0 text-gray-700 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setIsModalOpen(false)}
                    >
                      <span className="bg-transparent text-gray-700 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        X
                      </span>
                    </button> */}
                  </div>

                  <div className="relative p-6 flex-auto">
                    <div className="mb-8">
                      <h2 className="text-lg font-bold mb-4">Bill To:</h2>
                      <div className="text-gray-700 mb-2">
                        {selectedBill && selectedBill[0].Customer
                          ? `${selectedBill[0].Customer.firstname} ${selectedBill[0].Customer.lastname}`
                          : ""}
                      </div>
                      <div className="text-gray-700 mb-2">
                        {selectedBill && selectedBill[0].Customer
                          ? selectedBill[0].Customer.phone
                          : ""}
                      </div>
                      {/* <div className="text-gray-700 mb-2">
                        {selectedBill && selectedBill[0].Customer
                          ? `${selectedBill[0].Customer.city}, ${selectedBill[0].Customer.country} ${selectedBill[0].Customer.postalCode}`
                          : ""}
                      </div> */}
                      <div className="text-gray-700">
                        {selectedBill && selectedBill[0].Customer
                          ? selectedBill[0].Customer.email
                          : ""}
                      </div>
                    </div>
                    <hr className="mb-2" />
                    <br></br>
                    <table className="w-full mb-8">
                      <thead>
                        <tr>
                          <th className="text-left font-bold text-gray-700">
                            Description
                          </th>
                          <th className="text-right font-bold text-gray-700">
                            Quantity
                          </th>
                          <th className="text-right font-bold text-gray-700">
                            Unit Price
                          </th>
                          <th className="text-right font-bold text-gray-700">
                            Total Price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedBill &&
                          selectedBill.map((sale) => (
                            <tr key={sale.id}>
                              <td className="text-left text-gray-700">
                                {sale.Product.itemName}
                              </td>
                              <td className="text-right text-gray-700">
                                {sale.quantity}
                              </td>
                              <td className="text-right text-gray-700">
                                Rs.{sale.unitPrice.toFixed(2)}
                              </td>
                              <td className="text-right text-gray-700">
                                Rs.{(sale.quantity * sale.unitPrice).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td className="text-left font-bold text-gray-700">
                            Total
                          </td>
                          <td className="text-right font-bold text-gray-700"></td>
                          <td className="text-right font-bold text-gray-700"></td>
                          <td className="text-right font-bold text-gray-700">
                            Rs.
                            {selectedBill
                              ? calculateTotalAmount(selectedBill).toFixed(2)
                              : ""}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                    <div className="text-gray-700 mb-2">
                      Thank you for your business!
                    </div>
                    {/* <div className="text-gray-700 text-sm">
                      Please remit payment within 30 days.
                    </div> */}
                    <div className="flex items-center justify-between p-6 border-t border-solid rounded-tl-lg rounded-tr-lg rounded-b border-gray-300">
                      <Button.Group>
                        <Button
                          onClick={() => setIsModalOpen(false)}
                          color="gray"
                          className="rounded-lg"
                        >
                          <IoMdClose className="mr-3 h-4 w-4" />
                          Close
                        </Button>
                      </Button.Group>
                      <Button.Group>
                        <Button
                          color="gray"
                          onClick={() => {
                            setSelectedBillExport(selectedBill);
                          }}
                        >
                          <PiExportBold className="mr-3 h-4 w-4" />
                          Export
                        </Button>
                        <Button
                          color="gray"
                          onClick={() => {
                            setSelectBillPrint(selectedBill);
                          }}
                        >
                          <FiPrinter className="mr-3 h-4 w-4" />
                          Print
                        </Button>
                      </Button.Group>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>

          <div className="mt-4">
            {currentData.length > 0 ? (
              <>
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
                    {currentData.map((bill, index) => (
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
                        <TableCell>Rs. {calculateTotalAmount(bill)}</TableCell>
                        <TableCell>
                          <Button.Group>
                            <Button
                              onClick={() => {
                                setSelectedBill(bill);
                                setIsModalOpen(true);
                              }}
                              color="gray"
                            >
                              <CiViewList className="mr-3 h-4 w-4" />
                              View
                            </Button>
                            <Button
                              color="gray"
                              onClick={() => {
                                setSelectedBillExport(bill);
                              }}
                            >
                              <PiExportBold className="mr-3 h-4 w-4" />
                              Export
                            </Button>
                            <Button
                              color="gray"
                              onClick={() => {
                                setSelectBillPrint(bill);
                              }}
                            >
                              <FiPrinter className="mr-3 h-4 w-4" />
                              Print
                            </Button>
                          </Button.Group>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

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
              <p>No sales found</p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
