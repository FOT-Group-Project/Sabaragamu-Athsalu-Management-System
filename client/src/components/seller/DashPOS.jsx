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
  Badge,
} from "flowbite-react";
import { FaUserEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { HiHome } from "react-icons/hi";
import { useSelector } from "react-redux";
import Confirm from "../../assets/coms.gif";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Logolight from "../../assets/logolight.png";


import {
  HiOutlineExclamationCircle,
  HiPlusCircle,
  HiUserAdd,
  HiOutlineArrowCircleRight,
  HiInformationCircle,
  HiOutlineCheckCircle,
  HiXCircle,
  HiCurrencyDollar,
  HiCheck,
  HiCheckCircle,
  HiPaperAirplane,
} from "react-icons/hi";
import { MdAdd, MdRemove } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";

export default function DashPOS() {
  const { currentUser } = useSelector((state) => state.user);

  const [allProducts, setAllProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [showModal4, setShowModal4] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [createUserError, setCreateUserError] = useState(null);
  const [createLoding, setCreateLoding] = useState(false);
  const [selectedValue, setSelectedValue] = useState("cash");
  const [orderDetails, setOrderDetails] = useState({});
  const [advancePayment, setAdvancePayment] = useState(0);
  const [selectBillPrint, setSelectBillPrint] = useState(false);

  const [formData, setFormData] = useState({});

  // Handler to update the selected value
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleChange1 = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };

  // Function to handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter products based on search query
  const filteredProducts = allProducts.filter((product) =>
    product.item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, [currentUser.id]);

  const fetchProducts = async () => {
    try {
      const shopIdRes = await fetch(`/api/shop/getshop/${currentUser.id}`);
      const shopIdData = await shopIdRes.json();
      if (shopIdRes.ok) {
        const productsRes = await fetch(
          `/api/shop-item/getshopitems/${shopIdData.shops[0].id}`
        );
        const productsData = await productsRes.json();
        if (productsRes.ok) {
          setAllProducts(productsData.shopItems);
          if (productsData.shopItems.length < 9) {
            setShowMore(false);
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchCustomers = async () => {
    try {
      // Fetch customers from API
      const res = await fetch(`/api/user/getusers`);
      const data = await res.json();
      if (res.ok) {
        setCustomers(data.users);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Function to handle customer selection
  const handleCustomerChange = (e) => {
    setSelectedCustomer(e.target.value);
  };

  const handleAddToSelected = (productId) => {
    setShowAlert(false);
    const productToAdd = allProducts.find(
      (product) => product.id === productId
    );
    if (productToAdd) {
      const existingProductIndex = selectedProducts.findIndex(
        (product) => product.id === productId
      );
      if (existingProductIndex !== -1) {
        setShowAlert(true); // Show alert if product already exists
      } else {
        setSelectedProducts([
          ...selectedProducts,
          { ...productToAdd, quantity: 1 },
        ]);
      }
    }
  };

  const handleIncreaseQuantity = (productId) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, quantity: product.quantity + 1 }
          : product
      )
    );
  };

  const handleDecreaseQuantity = (productId) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId && product.quantity > 1
          ? { ...product, quantity: product.quantity - 1 }
          : product
      )
    );
  };

  const handleRemoveFromSelected = (productId) => {
    setShowAlert(false);
    setSelectedProducts(
      selectedProducts.filter((product) => product.id !== productId)
    );
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    selectedProducts.forEach((product) => {
      totalPrice += product.item.itemPrice * product.quantity;
    });

    // Calculate discount amount
    const discountAmount = (totalPrice * discountPercentage) / 100;

    // Apply discount to total price
    const discountedPrice = totalPrice - discountAmount;

    return discountedPrice;
  };

  const calculateDueAmount = () => {
    const dueAmount = calculateTotalPrice() - advancePayment;
    return dueAmount > 0 ? dueAmount : 0;
  };

  // Function to calculate the subtotal
  const calculateSubtotal = () => {
    let subtotal = 0;
    selectedProducts.forEach((product) => {
      subtotal += product.item.itemPrice * product.quantity;
    });
    return subtotal;
  };

  // Function to calculate the discounted price
  const calculateDiscountedPrice = () => {
    const totalPrice = calculateTotalPrice(); // Calculate total price of selected products
    const discountedPrice =
      totalPrice - totalPrice * (discountPercentage / 100);
    return discountedPrice;
  };

  // Function to clear the selected products array
  const handleClearCart = () => {
    setSelectedProducts([]);
    setShowModal(false);
  };

  const handeleClearCustomer = () => {
    setSelectedCustomer([]);
    handleClearCart();
    setShowModal1(false);
  };

  const handelRemoveCustomer = () => {
    setSelectedCustomer([]);
    setAdvancePayment(0);
  };

  const handelBuyItems = () => {
    if (selectedValue == "cash") {
      orderDetails.type = "Cash";
      orderDetails.customerId = 7;
      orderDetails.dueAmount = 0;
    }
    if (selectedValue == "credit") {
      orderDetails.type = "Credit";
      orderDetails.customerId = selectedCustomer;
      orderDetails.dueAmount = calculateDueAmount();
    }

    selectedProducts.forEach((product) => {
      orderDetails.itemId = product.id;
      orderDetails.shopId = currentUser.id;
      orderDetails.buyDateTime = new Date().toLocaleString();
      orderDetails.unitPrice = product.item.itemPrice;
      orderDetails.quantity = product.quantity;

      try {
        setCreateLoding(true);

        const res = fetch(`/api/shop-item/buyitems`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderDetails),
        });

        res.then((res) => {
          if (res.ok) {
            setCreateLoding(false);
            setShowModal2(false);
            // setSelectedProducts([]);
            // setSelectedCustomer([]);
            Toast.success("Order placed successfully!");
            //fetchProducts();
          }
        });
      } catch (error) {
        console.log(error.message);
      }
      fetchProducts();

      setOrderDetails(orderDetails);
    });

    fetchProducts();

    setSelectedValue("cash");
    setAdvancePayment(0);
    setDiscountPercentage(0);
    setShowModal3(false);
    setShowModal4(true);
  };

  const handleSubmit = async (e) => {
    setFormData({ ...formData, role: "Customer" });
    e.preventDefault();
    setCreateLoding(true);
    try {
      const res = await fetch("/api/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateUserError(data.message);
        setCreateLoding(false);
        return;
      }

      if (res.ok) {
        setCreateUserError(null);
        setCreateLoding(false);
        setOpenModalEdit(false);
        setShowModal2(false);
        setShowModal2(true);
        fetchCustomers();
        fetchUsers();
      }
    } catch (error) {
      // setCreateUserError("Something went wrong");
      setCreateLoding(false);
    }
  };

  const printBill = async () => {
    // Define a custom page size for a 58mm wide paper
    const doc = new jsPDF({
      unit: "mm",
      format: [58, 100], // Width: 58mm, Height: 100mm
    });

    // Add Logo - Adjust the size and position for narrow paper
    doc.addImage(Logolight, "PNG", 5, 5, 20, 5);

    const date = new Date();

    // Invoice title and details
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Invoice", 55, 7, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`Date: ${date.toLocaleDateString()}`, 55, 10.5, {
      align: "right",
    });

    doc.text(`INV#: ${generateBillId()}`, 55, 14, {
      align: "right",
    });

    // Bill to section
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 5, 25);
    doc.setFont("helvetica", "normal");

    try {
      // Fetch customer details by customer id
      const res = await fetch(`/api/user/getuser/${orderDetails.customerId}`);
      if (res.ok) {
        const data = await res.json();
        doc.text(`${data.user.firstname} ${data.user.lastname}`, 5, 30);
        doc.text(data.user.phone, 5, 35);
        doc.text(data.user.email, 5, 40);
      } else {
        console.log("Failed to fetch user details");
      }
    } catch (error) {
      console.log(error.message);
    }

    // Add a horizontal line separator
    doc.setDrawColor(0, 0, 0); // black color
    doc.line(5, 45, 55, 45); // horizontal line (x1, y1, x2, y2)

    // Add table with sales details
    const tableOptions = {
      startY: 47, // Adjust startY to align the table properly with preceding content
      head: [["Description", "Qty", "Unit", "Total"]],
      body: selectedProducts.map((product) => [
        product.item.itemName,
        product.quantity,
        `Rs.${product.item.itemPrice}`,
        `Rs${product.quantity * product.item.itemPrice}`,
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
      `Rs.${(calculateTotalPrice().toFixed(2))}`,
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
    // setSelectBillPrint(false);
    // setSelectedProducts([]);
    // setSelectedCustomer([]);
    // setOrderDetails({});
    // fetchProducts();
  };

  // Function to generate bill ID
  const generateBillId = () => {
    const customerId = orderDetails.customerId;
    const shopId = orderDetails.shopId;
    const buyDateTime = orderDetails.buyDateTime;
    
    const formattedDate = new Date(buyDateTime)
      .toLocaleDateString()
      .replace(/\//g, "-");
    const formattedTime = new Date(buyDateTime)
      .toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(/:/g, "");
    return `BILL-${customerId}-${shopId}-${formattedDate}-${formattedTime}`;
  };

  // Effect to handle printing after selecting a bill
  useEffect(() => {
    if (selectBillPrint) {
      printBill();
    }
  }, [selectBillPrint]);

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
            <Breadcrumb.Item>POS</Breadcrumb.Item>
          </Breadcrumb>

          <div className="mt-4 min-h-screen flex flex-col md:flex-row">
            <div className="md:w-2/3 mr-5">
              <div className="flex items-center justify-between">
                <h1 className="mt-3 mb-3 text-left font-semibold text-xl">
                  Point of Sale
                </h1>
                <div className="flex items-center">
                  <TextInput
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search products"
                    className="w-72 h-10"
                  />
                </div>
              </div>

              {showAlert && (
                <Alert color="failure" icon={HiInformationCircle}>
                  <span className="font-medium">Info alert!</span> Product
                  already in the cart !
                </Alert>
              )}

              {filteredProducts.length > 0 ? (
                <>
                  <Table hoverable className="mt-2 shadow-md w-full">
                    <TableHead>
                      <TableHeadCell>Product Name</TableHeadCell>
                      <TableHeadCell>SKU</TableHeadCell>
                      <TableHeadCell>Manufacturer</TableHeadCell>
                      <TableHeadCell>Price</TableHeadCell>
                      <TableHeadCell>Quantity</TableHeadCell>
                      <TableHeadCell></TableHeadCell>
                      <TableHeadCell>
                        <span className="sr-only">Edit</span>
                      </TableHeadCell>
                    </TableHead>
                    {filteredProducts.map((product) => (
                      <Table.Body className="divide-y" key={product.id}>
                        {product.quantity > 0 && (
                          <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <TableCell>
                              <b>{product.item.itemName}</b>
                            </TableCell>
                            <TableCell>{product.item.sku}</TableCell>
                            <TableCell>{product.item.manufacturer}</TableCell>
                            <TableCell>Rs. {product.item.itemPrice}</TableCell>
                            <TableCell>
                              <Badge
                                className="pl-3 pr-3"
                                color={product.quantity > 0 ? "green" : "red"}
                                icon={
                                  product.quantity > 0
                                    ? HiCheckCircle
                                    : HiXCircle
                                }
                              >
                                {product.quantity} in stock
                              </Badge>
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell>
                              {product.quantity > 0 ? (
                                <Button
                                  //disabled={selectedCustomer <= 0}
                                  onClick={() =>
                                    handleAddToSelected(product.id)
                                  }
                                  color={
                                    selectedProducts.some(
                                      (p) => p.id === product.id
                                    )
                                      ? "green"
                                      : "gray"
                                  }
                                >
                                  {selectedProducts.some(
                                    (p) => p.id === product.id
                                  ) ? (
                                    <>
                                      Added
                                      <HiOutlineCheckCircle className="ml-3 h-4 w-4" />
                                    </>
                                  ) : (
                                    <>
                                      Add
                                      <HiOutlineArrowCircleRight className="ml-3 h-4 w-4" />
                                    </>
                                  )}
                                </Button>
                              ) : (
                                <Button color="gray" disabled>
                                  Out of stock
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        )}
                      </Table.Body>
                    ))}
                  </Table>
                </>
              ) : (
                <p>You have no store yet!</p>
              )}
            </div>

            <div className="md:w-1/3">
              <>
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex gap-3 justify-between">
                    <div>
                      <p>
                        <b>Date & Time : </b>
                        {new Date().toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 justify-between text-center ">
                    <b>
                      <p>Product List</p>
                    </b>

                    <hr className="md-2 mt-2" />
                  </div>
                  <div>
                    {selectedProducts.length > 0 ? (
                      <>
                        <motion.div
                          initial={{ opacity: 0, y: -50 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -50 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Table hoverable className="shadow-md w-full mt-2">
                            <TableHead>
                              <TableHeadCell>Product Name</TableHeadCell>
                              <TableHeadCell>QTY</TableHeadCell>
                              <TableHeadCell>Price</TableHeadCell>
                              <TableHeadCell></TableHeadCell>
                            </TableHead>
                            {selectedProducts.map((product) => (
                              <Table.Body className="divide-y" key={product.id}>
                                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                  <TableCell>
                                    <b>{product.item.itemName}</b>
                                  </TableCell>
                                  <TableCell>
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                      }}
                                    >
                                      <MdRemove
                                        onClick={() =>
                                          handleDecreaseQuantity(product.id)
                                        }
                                        style={{ cursor: "pointer" }}
                                      />
                                      <span>{product.quantity}</span>

                                      <MdAdd
                                        onClick={() =>
                                          handleIncreaseQuantity(product.id)
                                        }
                                        style={{ cursor: "pointer" }}
                                      />
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    Rs.
                                    {product.item.itemPrice * product.quantity}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      onClick={() =>
                                        handleRemoveFromSelected(product.id)
                                      }
                                      color="gray"
                                    >
                                      <MdDeleteForever className=" h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              </Table.Body>
                            ))}
                          </Table>
                        </motion.div>
                      </>
                    ) : (
                      <div className="mt-5 justify-between text-center text-gray-400 text-sm">
                        <p>You have not selected items yet!</p>
                      </div>
                    )}
                  </div>

                  {selectedProducts.length > 0 ? (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="mt-5 justify-between text-center ">
                          <b>
                            <p>Totale Price</p>
                          </b>

                          <hr className="md-2 mt-2" />
                        </div>

                        <div className="mt-5  text-center ">
                          <div className="mr-2 ml-2 mb-3 flex justify-between">
                            <p>
                              <b>Sub Total :</b>
                            </p>
                            <p>Rs. {calculateSubtotal()}</p>
                          </div>
                          <div className="mr-2 ml-2 mb-3 flex justify-between">
                            <p>
                              <b>Discont % :</b>
                            </p>
                            <TextInput
                              type="number"
                              value={discountPercentage}
                              onChange={(e) =>
                                setDiscountPercentage(
                                  Math.max(0, e.target.value)
                                )
                              }
                              placeholder="Enter discount percentage"
                              className=" w-20 h-8 mb-3"
                              size="sm"
                            />
                          </div>

                          {discountPercentage > 0 && (
                            <div className="mr-2 ml-2 mb-3 flex justify-between">
                              <p>
                                <b>Discounte Price : </b>
                              </p>
                              <p>
                                Rs.{" "}
                                {(
                                  calculateTotalPrice() - calculateSubtotal()
                                ).toFixed(2)}
                              </p>
                            </div>
                          )}

                          <div className="mr-2 ml-2 flex justify-between">
                            <p>
                              <b>Paybale Amount :</b>
                            </p>
                            <p>
                              <b className=" text-red-600 text-xl">
                                Rs. {calculateTotalPrice()}
                              </b>
                            </p>
                          </div>

                          <hr className="md-2 mt-2" />

                          <div className="mt-4 flex gap-4">
                            <Button
                              color="blue"
                              className="w-full"
                              onClick={() => setShowModal2(true)}
                            >
                              <HiCurrencyDollar className="h-4 w-4 mr-2" />
                              Pay - Rs. {calculateTotalPrice()}
                            </Button>
                            <Button
                              onClick={() => setShowModal(true)}
                              color="red"
                              className="w-full"
                            >
                              <HiXCircle className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                          </div>

                          <hr className="md-2 mt-2" />
                        </div>
                      </motion.div>
                    </>
                  ) : (
                    <div className="mt-5 justify-between text-center "></div>
                  )}
                </motion.div>
              </>
            </div>
          </div>

          <Modal show={openModalEdit} onClose={() => setOpenModalEdit(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Modal.Header>Add New Customer</Modal.Header>
              <Modal.Body>
                <div className="space-y-6">
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col flex-grow gap-4"
                  >
                    {createUserError && (
                      <Alert color="failure">{createUserError}</Alert>
                    )}
                    <div className="flex gap-2 justify-between">
                      <div>
                        <div className="mb-2 block">
                          <Label value="User name" />
                        </div>
                        <TextInput
                          id="username"
                          type="text"
                          placeholder="@username"
                          required
                          shadow
                          onChange={handleChange1}
                          value={formData.username}
                        />
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <Label value="First name" />
                        </div>
                        <TextInput
                          id="firstname"
                          type="text"
                          placeholder="First name"
                          required
                          shadow
                          onChange={handleChange1}
                          value={formData.firstname}
                        />
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <Label value="Last Name" />
                        </div>
                        <TextInput
                          id="lastname"
                          type="text"
                          placeholder="Last name"
                          required
                          shadow
                          onChange={handleChange1}
                          value={formData.lastname}
                        />
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div>
                        <div className="mb-2 block">
                          <Label htmlFor="email2" value="Phone number" />
                        </div>
                        <TextInput
                          id="phone"
                          type="text"
                          placeholder="+94 xx xxx xxxx"
                          required
                          shadow
                          onChange={handleChange1}
                          value={formData.phone}
                        />
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <Label htmlFor="email2" value="Email address" />
                        </div>
                        <TextInput
                          id="email"
                          type="email"
                          placeholder="name@gmail.com"
                          required
                          shadow
                          onChange={handleChange1}
                          value={formData.email}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button
                        color="blue"
                        type="submit"
                        disabled={createLoding}
                      >
                        {createLoding ? (
                          <>
                            <Spinner size="sm" />
                            <span className="pl-3">Loading...</span>
                          </>
                        ) : (
                          "Add Customer"
                        )}
                      </Button>
                      <Button
                        size="sm"
                        color="gray"
                        onClick={() => setOpenModalEdit(false)}
                      >
                        Decline
                      </Button>
                    </div>
                  </form>
                </div>
              </Modal.Body>
            </motion.div>
          </Modal>

          <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            popup
            size="md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Modal.Header />
              <Modal.Body>
                <div className="text-center">
                  <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                  <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                    Are you sure you want to clear the cart?
                  </h3>
                  <div className="flex justify-center gap-4">
                    <Button color="failure" onClick={handleClearCart}>
                      Yes, I'm sure
                    </Button>
                    <Button color="gray" onClick={() => setShowModal(false)}>
                      No, cancel
                    </Button>
                  </div>
                </div>
              </Modal.Body>
            </motion.div>
          </Modal>

          <Modal
            show={showModal3}
            onClose={() => setShowModal3(false)}
            popup
            size="md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Modal.Header />
              <Modal.Body>
                <div className="text-center">
                  <GiConfirmed className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                  <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                    Are you sure you want to complete the order?
                  </h3>
                  <div className="flex justify-center gap-4">
                    <Button color="blue" onClick={handelBuyItems}>
                      Yes, I'm sure
                    </Button>
                    <Button color="gray" onClick={() => setShowModal3(false)}>
                      No, cancel
                    </Button>
                  </div>
                </div>
              </Modal.Body>
            </motion.div>
          </Modal>

          <Modal
            show={showModal4}
            onClose={() => {
              setShowModal4(false);
              setSelectBillPrint(false);
              setSelectedProducts([]);
              setSelectedCustomer([]);
              fetchProducts();
            }}
            popup
            size="xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Modal.Header />
              <Modal.Body>
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <img src={Confirm} className="h-20" alt="Flowbite Logo" />
                  </div>

                  <h3 className="mb-5 text-lg text-gray-600 dark:text-gray-400">
                    Your order has been placed successfully!
                  </h3>
                  <div className="flex justify-center gap-4">
                    <Button
                      color="blue"
                      onClick={() => {
                        setSelectBillPrint(true);
                      }}
                    >
                      Print Bill
                    </Button>
                    <Button
                      color="gray"
                      onClick={() => {
                        setShowModal4(false);
                        setSelectBillPrint(false);
                        setSelectedProducts([]);
                        setSelectedCustomer([]);
                        fetchProducts();
                      }}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </Modal.Body>
            </motion.div>
          </Modal>

          <Modal
            show={showModal1}
            onClose={() => setShowModal1(false)}
            popup
            size="md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Modal.Header />
              <Modal.Body>
                <div className="text-center">
                  <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                  <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                    Are you sure you want to clear the customer?
                  </h3>
                  <div className="flex justify-center gap-4">
                    <Button color="failure" onClick={handeleClearCustomer}>
                      Yes, I'm sure
                    </Button>
                    <Button color="gray" onClick={() => setShowModal1(false)}>
                      No, cancel
                    </Button>
                  </div>
                </div>
              </Modal.Body>
            </motion.div>
          </Modal>

          <Modal
            show={showModal2}
            onClose={() => setShowModal2(false)}
            size="3xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Modal.Header>Order Details</Modal.Header>
              <Modal.Body>
                <div className="space-y-6">
                  <form className="flex flex-col flex-grow gap-4">
                    {createUserError && (
                      <Alert color="failure">{createUserError}</Alert>
                    )}
                    <div className="flex gap-5 mb-4">
                      <div className="w-full flex gap-10">
                        {showModal2 ? (
                          <>
                            <div className="">
                              <h1 className="text-lg text-gray-700">
                                <b>Product List</b>
                              </h1>
                              <Table>
                                <TableHead>
                                  <TableHeadCell>Product Name</TableHeadCell>
                                  <TableHeadCell>QTY</TableHeadCell>
                                  <TableHeadCell>Price</TableHeadCell>
                                </TableHead>
                                {selectedProducts.map((product) => (
                                  <Table.Body
                                    className="divide-y"
                                    key={product.id}
                                  >
                                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                      <TableCell>
                                        <b>{product.item.itemName}</b>
                                      </TableCell>
                                      <TableCell>
                                        <span>{product.quantity}</span>
                                      </TableCell>
                                      <TableCell>
                                        Rs.
                                        {product.item.itemPrice *
                                          product.quantity}
                                      </TableCell>
                                    </TableRow>
                                  </Table.Body>
                                ))}
                              </Table>

                              <div className="mt-5  text-center ">
                                <hr className="md-2 mt-2" />
                              </div>
                            </div>

                            <div className="w-full ">
                              <h1 className="text-lg text-gray-700 mb-5">
                                <b>Select Payment Type</b>
                              </h1>

                              <div class="flex items-center mb-2">
                                <input
                                  type="radio"
                                  value="cash"
                                  checked={selectedValue === "cash"}
                                  onChange={handleChange}
                                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                ></input>
                                <label
                                  for="default-radio-1"
                                  class="ms-2 text-lg font-medium text-gray-900 dark:text-gray-300"
                                >
                                  Cash
                                </label>
                              </div>
                              <div class="flex items-center">
                                <input
                                  type="radio"
                                  value="credit"
                                  checked={selectedValue === "credit"}
                                  onChange={handleChange}
                                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                ></input>
                                <label
                                  for="default-radio-2"
                                  class="ms-2 text-lg font-medium text-gray-900 dark:text-gray-300"
                                >
                                  Credit
                                </label>
                              </div>

                              {selectedValue == "cash" ? (
                                <>
                                  <hr className="md-2 mt-10" />
                                  <h1 className="text-lg text-gray-700 mt-5">
                                    <b>Totale Price</b>
                                  </h1>
                                  <div className="mr-2 ml-2 mb-3 flex justify-between">
                                    <p>
                                      <b>Sub Total :</b>
                                    </p>
                                    <p>Rs. {calculateSubtotal()}</p>
                                  </div>

                                  {discountPercentage > 0 && (
                                    <div className="mr-2 ml-2 mb-3 flex justify-between">
                                      <p>
                                        <b>Discounte Price : </b>
                                      </p>
                                      <p>
                                        Rs.{" "}
                                        {(
                                          calculateTotalPrice() -
                                          calculateSubtotal()
                                        ).toFixed(2)}
                                      </p>
                                    </div>
                                  )}

                                  <div className="mr-2 ml-2 flex justify-between">
                                    <p>
                                      <b>Paybale Amount :</b>
                                    </p>
                                    <p>
                                      <b className=" text-red-600 text-xl">
                                        Rs. {calculateTotalPrice()}
                                      </b>
                                    </p>
                                  </div>
                                </>
                              ) : (
                                <div className="flex w-full justify-between">
                                  <div>
                                    <p className="text-sm mt-4">
                                      Select already existing customer or add
                                      new customer
                                    </p>

                                    <div className="mt-4 flex gap-4">
                                      <Select
                                        value={selectedCustomer}
                                        onChange={handleCustomerChange}
                                      >
                                        <option value="">
                                          Select a customer
                                        </option>
                                        {customers.map((customer) => (
                                          <>
                                            {customer.role === "Customer" ? (
                                              <>
                                                {customer.id !== 7 ? (
                                                  <>
                                                    <option
                                                      key={customer.id}
                                                      value={customer.id}
                                                    >
                                                      {customer.firstname +
                                                        " " +
                                                        customer.lastname}
                                                    </option>
                                                  </>
                                                ) : (
                                                  <></>
                                                )}
                                              </>
                                            ) : (
                                              <></>
                                            )}
                                          </>
                                        ))}
                                      </Select>

                                      {selectedCustomer <= 0 ? (
                                        <Button
                                          color="blue"
                                          className=""
                                          onClick={() => setOpenModalEdit(true)}
                                        >
                                          <MdAdd className="h-4 w-4 mr-2" />
                                          Add Customer
                                        </Button>
                                      ) : (
                                        <Button
                                          color="red"
                                          className=""
                                          onClick={handelRemoveCustomer}
                                        >
                                          <MdAdd className="h-4 w-4 mr-2" />
                                          Remove Customer
                                        </Button>
                                      )}
                                    </div>

                                    {selectedCustomer > 0 ? (
                                      <>
                                        <hr className="md-2 mt-5" />
                                        <h1 className="text-lg text-gray-700 mt-5">
                                          <b>Totale Price</b>
                                        </h1>
                                        <div className="mr-2 ml-2 mb-3 flex justify-between">
                                          <p>
                                            <b>Sub Total :</b>
                                          </p>
                                          <p>Rs. {calculateSubtotal()}</p>
                                        </div>

                                        {discountPercentage > 0 && (
                                          <div className="mr-2 ml-2 mb-3 flex justify-between">
                                            <p>
                                              <b>Discounte Price : </b>
                                            </p>
                                            <p>
                                              Rs.{" "}
                                              {(
                                                calculateTotalPrice() -
                                                calculateSubtotal()
                                              ).toFixed(2)}
                                            </p>
                                          </div>
                                        )}

                                        <div className="mr-2 ml-2 flex justify-between">
                                          <p>
                                            <b>Paybale Amount :</b>
                                          </p>
                                          <p>
                                            <b className=" text-gray-600 text-xl">
                                              Rs. {calculateTotalPrice()}
                                            </b>
                                          </p>
                                        </div>
                                        <div className="mr-2 ml-2 mb-3 mt-3 flex justify-between">
                                          <p>
                                            <b>Advance Amount :</b>
                                          </p>
                                          <TextInput
                                            type="number"
                                            value={advancePayment}
                                            onChange={(e) =>
                                              setAdvancePayment(
                                                Math.max(0, e.target.value)
                                              )
                                            }
                                            placeholder="Enter Advance Amount"
                                            className=" w-20 h-8 mb-3"
                                            size="sm"
                                          />
                                        </div>
                                        <div className="mr-2 ml-2 flex justify-between">
                                          <p>
                                            <b>Due Amount :</b>
                                          </p>
                                          <p>
                                            <b className=" text-red-600 text-xl">
                                              Rs. {calculateDueAmount()}
                                            </b>
                                          </p>
                                        </div>
                                      </>
                                    ) : null}
                                  </div>
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button
                        color="blue"
                        disabled={
                          (createLoding ||
                            selectedCustomer.length <= 0 ||
                            (selectedValue == "credit" &&
                              advancePayment <= 0)) &&
                          selectedValue != "cash"
                        }
                        onClick={() => setShowModal3(true)}
                      >
                        {createLoding ? (
                          <>
                            <Spinner size="sm" />
                            <span className="pl-3">Loading...</span>
                          </>
                        ) : (
                          "Confirm Order"
                        )}
                        <HiCheckCircle className="ml-2 h-4 w-4 " />
                      </Button>
                      <Button
                        size="sm"
                        color="gray"
                        onClick={() => setShowModal2(false)}
                      >
                        Decline
                      </Button>
                    </div>
                  </form>
                </div>
              </Modal.Body>
            </motion.div>
          </Modal>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
