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
  HiCheckCircle,
} from "react-icons/hi";
import { MdAdd, MdRemove } from "react-icons/md";

export default function DashSellerSendStock() {
  const { currentUser } = useSelector((state) => state.user);

  const [allProducts, setAllProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [shops, setShops] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShop, setSelectedShop] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [sendItemId, setSendItemId] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [createUserError, setCreateUserError] = useState(null);
  const [createLoding, setCreateLoding] = useState(false);
  const [seller, setSeller] = useState([]);
  const [formData, setFormData] = useState({});

  const [shopId, setShopId] = useState([]); // [1

  // Function to handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter products based on search query
  const filteredProducts = allProducts.filter((product) =>
    product.item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shopIdRes = await fetch(`/api/shop/getshop/${currentUser.id}`);
        const shopIdData = await shopIdRes.json();
        if (shopIdRes.ok) {
          setShopId(shopIdData.shops[0]);

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

          const shopsRes = await fetch(`/api/shop/getshops`);
          const shopsData = await shopsRes.json();
          if (shopsRes.ok) {
            setShops(shopsData.shops);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, [currentUser.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleChange(e);
    setCreateLoding(true);
    console.log(sendItemId, formData.shopId, selectedProduct.id);
    try {
      const res = await fetch(
        `/api/shop-item/senditem/${sendItemId}/${formData.shopId}/${selectedProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setCreateLoding(false);
        setOpenModal(false);
        setCreateUserError(null);

        // Update local state with updated stock data
        const updatedProducts = allProducts.map((product) => {
          if (product.id === sendItemId) {
            return {
              ...product,
              quantity: product.quantity - formData.quantity,
            };
          }
          return product;
        });
        setAllProducts(updatedProducts);

        Toast.success("Stock sent successfully!");
      } else {
        setCreateUserError(data.message);
        setCreateLoding(false);
      }
    } catch (error) {
      console.log(error.message);
      setCreateLoding(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    let updatedQuantity = value;

    if (id === "quantity" && selectedProduct) {
      const maxAvailableQuantity = selectedProduct.quantity;
      updatedQuantity = Math.min(parseInt(value), maxAvailableQuantity);
    }
    setFormData({ ...formData, [id]: updatedQuantity });
    console.log(formData);
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
            <div className="md:w-full mr-5">
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

              <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Modal.Header>Send Item Stock</Modal.Header>
                  <Modal.Body>
                    <div className="space-y-6">
                      <form
                        onSubmit={handleSubmit}
                        className="flex flex-col flex-grow gap-4"
                      >
                        {createUserError && (
                          <Alert color="failure">{createUserError}</Alert>
                        )}

                        <div className="flex gap-5 mb-4">
                          <div className="w-full ">
                            {openModal ? (
                              <>
                                <div className="flex gap-2 w-full">
                                  <div className="w-full">
                                    <div className="mb-2 block">
                                      <h1 className="text-lg text-gray-500">
                                        <b>Item Details</b>
                                      </h1>
                                    </div>

                                    <div className="mb-2 block">
                                      <h1 className="text-md text-gray-700">
                                        <b>Name : </b>{" "}
                                        {selectedProduct.item.itemName}
                                      </h1>
                                    </div>

                                    <div className="mb-2 block">
                                      <h1 className="text-md text-gray-700">
                                        <b>Price : </b> Rs.{" "}
                                        {selectedProduct.item.itemPrice}
                                      </h1>
                                    </div>

                                    <div className=" block">
                                      <h1 className="text-md text-gray-700">
                                        <div className="flex gap-3 ">
                                          <p>
                                            <b>Quantity : </b>{" "}
                                          </p>
                                          <Badge
                                            className="pl-3 pr-3"
                                            color="green"
                                            icon={HiCheckCircle}
                                          >
                                            {selectedProduct.quantity} in stock
                                          </Badge>
                                        </div>
                                      </h1>
                                    </div>
                                  </div>

                                  <div className="w-full">
                                    <div className="mb-2 block">
                                      <h1 className="text-lg text-gray-500">
                                        <b>Send Details</b>
                                      </h1>
                                    </div>

                                    <div className="mb-2 block">
                                      <h1 className="text-md text-gray-700">
                                        <b>Shop Name : </b>{" "}
                                        {shops.map((shop) => {
                                          if (shop.id == formData.shopId) {
                                            return shop.shopName;
                                          }
                                        })}
                                      </h1>
                                    </div>

                                    <div className="block">
                                      <h1 className="text-md text-gray-700">
                                        <div className="flex gap-3 ">
                                          <p>
                                            <b>Quantity : </b>{" "}
                                          </p>
                                          {formData.quantity > 0 ? (
                                            <Badge
                                              size="sm"
                                              className="pl-3 pr-3"
                                              color={
                                                formData.quantity ==
                                                selectedProduct.quantity
                                                  ? "red"
                                                  : "yellow"
                                              }
                                              icon={HiCheckCircle}
                                            >
                                              {formData.quantity} Items
                                            </Badge>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      </h1>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 mb-4">
                          <div className="w-1/2">
                            <div className="mb-2 block">
                              <Label value="Item Quantity" />
                            </div>

                            <TextInput
                              id="quantity"
                              type="number"
                              placeholder="10"
                              required
                              shadow
                              onChange={handleChange}
                              value={formData.quantity}
                              defaultValue={1}
                            />
                          </div>
                          <div className="w-1/2">
                            <div className="mb-2 block">
                              <Label value="Select Shop" />
                            </div>
                            <Select
                              id="shopId"
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  shopId: e.target.value,
                                })
                              }
                              required
                              shadow
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
                              "Send Stock"
                            )}
                            <HiPaperAirplane className="ml-2 h-4 w-4 rotate-90" />
                          </Button>
                          <Button
                            size="sm"
                            color="gray"
                            onClick={() => setOpenModal(false)}
                          >
                            Decline
                          </Button>
                        </div>
                      </form>
                    </div>
                  </Modal.Body>
                </motion.div>
              </Modal>

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
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              <Badge
                                className="pl-3 pr-3  w-28"
                                color={product.quantity > 0 ? "green" : "red"}
                                icon={
                                  product.quantity > 0
                                    ? HiCheckCircle
                                    : HiXCircle
                                }
                              >
                                {product.quantity} in stock
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell>
                            <Button
                              onClick={() => {
                                setOpenModal(true);
                                setSelectedProduct(product);
                                setSendItemId(product.id);
                              }}
                              disabled={product.quantity === 0}
                              color="blue"
                            >
                              Send Stock
                              <HiPaperAirplane className="ml-3 h-4 w-4 rotate-90" />
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
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
