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
import { FaUserEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { HiHome } from "react-icons/hi";
import { useSelector } from "react-redux";
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
  HiPaperAirplane,
} from "react-icons/hi";
import { MdAdd, MdRemove } from "react-icons/md";

export default function DashSellerSendStock() {
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShop, setSelectedShop] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [discountPercentage, setDiscountPercentage] = useState(0);

  // Calculate total quantity
  const totalQuantity = selectedProducts.reduce(
    (total, product) => total + product.quantity,
    0
  );

  // Calculate total price
  const totalPrice = selectedProducts.reduce((total, product) => {
    return total + product.item.itemPrice * product.quantity;
  }, 0);

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
    fetchShop();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/shop-item/getshopitems`);
      const data = await res.json();
      if (res.ok) {
        setAllProducts(data.shopItems);
        if (data.product.length < 9) {
          setShowMore(false);
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

  const fetchShop = async () => {
    try {
      const res = await fetch(`/api/shop/getshops`);
      const data = await res.json();
      if (res.ok) {
        setShops(data.shops);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Function to handle shopselection
  const handleShopChange = (e) => {
    setSelectedShop(e.target.value);
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

  // Function to clear the selected products array
  const handleClearCart = () => {
    setSelectedProducts([]);
    setShowModal(false);
  };

  const handeleClearShop = () => {
    setSelectedShop([]);
    handleClearCart();
    setShowModal1(false);
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
            <Breadcrumb.Item>Send Stock</Breadcrumb.Item>
          </Breadcrumb>

          <div className="mt-4 min-h-screen flex flex-col md:flex-row">
            <div className="md:w-2/3 mr-5">
              <div className="flex items-center justify-between">
                <h1 className="mt-3 mb-3 text-left font-semibold text-xl">
                  Send Stock
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
                        <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                          <TableCell>
                            <b>{product.item.itemName}</b>
                          </TableCell>
                          <TableCell>{product.item.sku}</TableCell>
                          <TableCell>{product.item.manufacturer}</TableCell>
                          <TableCell>Rs. {product.item.itemPrice}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell></TableCell>
                          <TableCell>
                            <Button
                              disabled={selectedShop <= 0}
                              onClick={() => handleAddToSelected(product.id)}
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
                          </TableCell>
                        </TableRow>
                      </Table.Body>
                    ))}
                  </Table>
                </>
              ) : (
                <p>You have no store yet!</p>
              )}
            </div>

            <div className="md:w-1/3">
              {selectedShop > 0 ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex gap-3 justify-between">
                      <div>
                        <p>
                          <b>Shop Name : </b> {selectedShop}
                        </p>
                        <p>
                          <b>Date & Time : </b>
                          {new Date().toLocaleString()}
                        </p>
                      </div>

                      <Button
                        className="mb-3"
                        color="gray"
                        size="sm"
                        onClick={() => setShowModal1(true)}
                      >
                        <MdDeleteForever className="h-4 w-4" />
                      </Button>
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
                                <Table.Body
                                  className="divide-y"
                                  key={product.id}
                                >
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
                                        <span>
                                          <b>{product.quantity}</b>{" "}
                                        </span>

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
                                      {product.item.itemPrice *
                                        product.quantity}
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
                              <p>Total Summary</p>
                            </b>

                            <hr className="md-2 mt-2" />
                          </div>

                          <div className="mt-5  text-center ">
                            <div className="mr-2 ml-2 mb-3 flex justify-between">
                              <p>
                                <b>Number of Products :</b>
                              </p>
                              <p>{selectedProducts.length}</p>
                            </div>

                            <div className="mr-2 ml-2 mb-3 flex justify-between">
                              <p>
                                <b>Total Price :</b>
                              </p>
                              <p>Rs {totalPrice}</p>
                            </div>

                            <div className="mr-2 ml-2 flex justify-between">
                              <p>
                                <b>Total Quantity :</b>
                              </p>
                              <p>
                                <b className=" text-red-600 text-xl">
                                  {totalQuantity}
                                </b>
                              </p>
                            </div>

                            <hr className="md-2 mt-2" />

                            <div className="mt-4 flex gap-4">
                              <Button color="blue" className="w-full">
                                <HiPaperAirplane className="h-4 w-4 mr-2" />
                                Sent Items
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
              ) : (
                <>
                  <div className="flex justify-center">
                    <motion.div
                      initial={{ opacity: 0, y: 0 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div>
                        <p>
                          Select customer to add products to the cart and
                          proceed
                        </p>

                        <div className="mt-4 flex gap-4 justify-center">
                          <Select
                            value={selectedShop}
                            onChange={handleShopChange}
                            className="w-full"
                          >
                            <option value="">Select a Shop</option>
                            {shops.map((shop) => (
                              <option key={shop.id} value={shop.id}>
                                {shop.shopName}
                              </option>
                            ))}
                          </Select>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </>
              )}
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
                    Are you sure you want to clear the shop?
                  </h3>
                  <div className="flex justify-center gap-4">
                    <Button color="failure" onClick={handeleClearShop}>
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
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
