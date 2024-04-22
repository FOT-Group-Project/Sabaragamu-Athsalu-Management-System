import { React, useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Profile from "../assets/add-pic.png";
import {
  HiOutlineExclamationCircle,
  HiPlusCircle,
  HiUserAdd,
  HiOutlineArrowCircleRight,
  HiInformationCircle,
  HiOutlineCheckCircle,
  HiXCircle,
  HiCurrencyDollar,
} from "react-icons/hi";
import { MdAdd, MdRemove } from "react-icons/md";

export default function DashPOS() {
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  // Function to handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter products based on search query
  const filteredProducts = allProducts.filter((product) =>
    product.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/product/getallproducts`);
      const data = await res.json();
      if (res.ok) {
        setAllProducts(data.products);
        if (data.product.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
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
      totalPrice += product.itemPrice * product.quantity;
    });
    return totalPrice;
  };

  // Function to clear the selected products array
  const handleClearCart = () => {
    setSelectedProducts([]);
    setShowModal(false);
  };

  return (
    <div className="p-3 w-full">
      <Breadcrumb aria-label="Default breadcrumb example">
        <Link to="/dashboard?tab=dash">
          <Breadcrumb.Item href="" icon={HiHome}>
            Home
          </Breadcrumb.Item>
        </Link>
        <Breadcrumb.Item>POS</Breadcrumb.Item>
      </Breadcrumb>

      <h1 className="mt-3 mb-3 text-left font-semibold text-xl">
        Point of Sale
      </h1>

      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="md:w-2/3 mr-5">
          <TextInput
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search products..."
            className="w-1/3 mb-3"
            size="sm"
          />
          {showAlert && (
            <Alert color="failure" icon={HiInformationCircle}>
              <span className="font-medium">Info alert!</span> Product already
              in the cart !
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
                        <b>{product.itemName}</b>
                      </TableCell>
                      <TableCell>PD{product.id}</TableCell>
                      <TableCell>{product.manufacturer}</TableCell>
                      <TableCell>Rs. {product.itemPrice}</TableCell>
                      <TableCell>86 </TableCell>
                      <TableCell></TableCell>
                      <TableCell>
                        {/* <Button
                          onClick={() => handleAddToSelected(product.id)}
                          color="gray"
                        >
                          Add
                          <HiOutlineArrowCircleRight className="ml-3 h-4 w-4" />
                        </Button> */}
                        <Button
                          onClick={() => handleAddToSelected(product.id)}
                          color={
                            selectedProducts.some((p) => p.id === product.id)
                              ? "green"
                              : "gray"
                          }
                        >
                          {selectedProducts.some((p) => p.id === product.id) ? (
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
          <div className="flex gap-3 justify-between">
            <div>
              <p>
                <b>Customer Name : </b>Lahiru Prasad
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
              onClick={() => setOpenModal(true)}
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
                          <b>{product.itemName}</b>
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
                              onClick={() => handleDecreaseQuantity(product.id)}
                              style={{ cursor: "pointer" }}
                            />
                            <span>{product.quantity}</span>

                            <MdAdd
                              onClick={() => handleIncreaseQuantity(product.id)}
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          Rs.{product.itemPrice * product.quantity}
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleRemoveFromSelected(product.id)}
                            color="gray"
                          >
                            <MdDeleteForever className=" h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </Table.Body>
                  ))}
                </Table>
              </>
            ) : (
              <div className="mt-5 justify-between text-center text-gray-400 text-sm">
                <p>You have not selected items yet!</p>
              </div>
            )}
          </div>

          {selectedProducts.length > 0 ? (
            <>
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
                  <p>Rs. {calculateTotalPrice()}</p>
                </div>

                <div className="mr-2 ml-2 flex justify-between">
                  <p>
                    <b>Paybale Amount :</b>
                  </p>
                  <p>
                    <b>Rs. {calculateTotalPrice()}</b>
                  </p>
                </div>

                <hr className="md-2 mt-2" />

                <div className="mt-4 flex gap-4">
                  <Button color="blue" className="w-full">
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
            </>
          ) : (
            <div className="mt-5 justify-between text-center "></div>
          )}
        </div>
      </div>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
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
      </Modal>
    </div>
  );
}
