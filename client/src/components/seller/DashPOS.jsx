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
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

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

export default function DashPOS() {
  const { currentUser } = useSelector((state) => state.user);

  const [allProducts, setAllProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [createUserError, setCreateUserError] = useState(null);
  const [createLoding, setCreateLoding] = useState(false);
  const [selectedValue, setSelectedValue] = useState("cash");
  const [orderDetails, setOrderDetails] = useState({});
  const [advancePayment, setAdvancePayment] = useState(0);

  // Handler to update the selected value
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
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

  const handelRemoveCustomer = (customerId) => {};

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
    const totalPrice = calculateTotalPrice();
    const dueAmount = totalPrice - advancePayment;
    return dueAmount;
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
            setSelectedProducts([]);
            setSelectedCustomer([]);
            Toast.success("Order placed successfully!");
            fetchProducts();
          }
        });
      } catch (error) {
        console.log(error.message);
      }
      fetchProducts();
    });

    fetchProducts();
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
                                        <Button color="blue" className="">
                                          <MdAdd className="h-4 w-4 mr-2" />
                                          Add Customer
                                        </Button>
                                      ) : (
                                        <Button
                                          color="red"
                                          className=""
                                          onClick={handelRemoveCustomer(
                                            customers.id
                                          )}
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
                        onClick={handelBuyItems}
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
