import {
  Alert,
  Breadcrumb,
  Button,
  Label,
  Modal,
  Select,
  Spinner,
  Table,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
} from "flowbite-react";
import { AnimatePresence, motion } from "framer-motion";
import { React, useEffect, useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import { FaUserEdit } from "react-icons/fa";
import {
  HiHome,
  HiOutlineExclamationCircle,
  HiPlusCircle,
} from "react-icons/hi";
import { MdDeleteForever } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashStoreKeeperProducts() {
  const { currentUser } = useSelector((state) => state.user);
  const [products, setProducts] = useState([]);
  const [storeProducts, setStoreProducts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [productIdToDelete, setproductIdToDelete] = useState("");
  const [storeNames, setStoreNames] = useState([]);
  const [itemNames, setItemNames] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);

  const [formData, setFormData] = useState({});

  const [createUserError, setCreateUserError] = useState(null);
  const [createLoding, setCreateLoding] = useState(null);

  const [stores, setStores] = useState([]);

  const fetchStoreProducts = async () => {
    try {
      const storeRes = await fetch(
        `/api/storekeepermanagestore/getstoresbystorekeeperid/${currentUser.id}`
      );

      const storeData = await storeRes.json();

      if (storeRes.ok) {
        const productsRes = await fetch(
          `/api/store-item/getstoreitems/${storeData.stores[0].storeId}`
        );

        const productsData = await productsRes.json();
        
        if (productsRes.ok) {
          setProducts(productsData.storeItems);
          if (productsData.storeItems.length < 9) {
            setShowMore(false);
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchStores = async () => {
    try {
      const storeRes = await fetch(`/api/store/getstores`);
      const storeData = await storeRes.json();

      if (storeRes.ok) {
        setStores(storeData.stores);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //Fetch all products from products table
  const fetchProducts = async () => {
    try {
      // Fetch all products using the API endpoint
      const productsRes = await fetch(`/api/product/getallproducts`);
      const productsData = await productsRes.json();
      if (productsRes.ok) {
        // Set the products state with the products array from the response
        setStoreProducts(productsData.products);

        if (productsData.products.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    //fetchCurrentUserStore();
    fetchStoreProducts();
    fetchProducts();
    fetchStores();
  }, [currentUser.id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreateLoding(true);
    try {
      const res = await fetch("/api/store-item/addstoreitem", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log(res);
      const data = await res.json();
      if (!res.ok) {
        setCreateUserError(data.message);
        setCrefateLoding(false);
        return;
      }

      if (res.ok) {
        setCreateUserError(null);
        setCreateLoding(false);
        setOpenModal(false);
        fetchProducts();
        window.location.reload();
      }
    } catch (error) {
      // setCreateUserError("Something went wrong");
      setCreateLoding(false);
    }
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    setCreateLoding(true);
    
    try {
      const res = await fetch(
        `/api/store-item/updatestoreitem`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
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
        fetchProducts();
        // navigate("/dashboard?tab=products");
        window.location.reload();
      }
    } catch (error) {
      // setCreateUserError("Something went wrong");
      setCreateLoding(false);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      const res = await fetch(
        `/api/store-item/deletestoreitem`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setProducts((prev) =>
          prev.filter((store) => store.id !== productIdToDelete)
        );
        setShowModal(false);
        fetchProducts();
        window.location.reload();
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
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
            <Breadcrumb.Item>Store Products</Breadcrumb.Item>
          </Breadcrumb>

          <div className="flex items-center justify-between">
            <h1 className="mt-3 mb-5 text-left font-semibold text-xl">
              Store Products
            </h1>
            <div className="flex gap-3 justify-end">
              <Button
                className="mb-3"
                color="blue"
                size="sm"
                onClick={() => setOpenModal(true)}
              >
                <HiPlusCircle className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          </div>

          <Modal show={openModalEdit} onClose={() => setOpenModalEdit(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Modal.Header>Edit Product</Modal.Header>
              <Modal.Body>
                <div className="space-y-6">
                  <form
                    onSubmit={handleSubmitUpdate}
                    className="flex flex-col flex-grow gap-4"
                  >
                    {createUserError && (
                      <Alert color="failure">{createUserError}</Alert>
                    )}
                    <div className="flex gap-5">
                      <div>
                        <div className="mb-2 block">
                          <Label value="Store Name" />
                        </div>
                          <TextInput
                            id="storeId"
                            type="text"
                            required
                            shadow
                            onChange={handleChange}
                            defaultValue={formData.storeName}
                          />
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <Label value="Product Name" />
                        </div>
                        
                          <TextInput
                            id="itemId"
                            type="text"
                            required
                            shadow
                            onChange={handleChange}
                            defaultValue={formData.itemName}
                          />
                        
                      </div>
                      {/* Quantity */}
                      <div>
                        <div className="mb-2 block">
                          <Label value="Quantity" />
                        </div>
                        <TextInput
                          id="quantity"
                          type="number"
                          placeholder="10"
                          required
                          shadow
                          onChange={handleChange}
                          defaultValue={formData.quantity}
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
                          "Update Product"
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

          <Modal show={openModal} onClose={() => setOpenModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Modal.Header>Add Product</Modal.Header>
              <Modal.Body>
                <div className="space-y-6">
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col flex-grow gap-4"
                  >
                    {createUserError && (
                      <Alert color="failure">{createUserError}</Alert>
                    )}
                    <div className="flex gap-5">
                      <div>
                        <div className="mb-2 block">
                          <Label value="Store Name" />
                        </div>
                        <Select
                          id="storeId"
                          onChange={handleChange}
                          required
                          shadow
                        >
                          <option value="">Select a store</option>
                          {stores.map((store) => (
                            <option key={store.id} value={store.id}>
                              {store.storeName}
                            </option>
                          ))}
                        </Select>
                      </div>
                      {/* Select option for choose a product */}
                      <div>
                        <div className="mb-2 block">
                          <Label value="Product" />
                        </div>
                        <Select
                          id="itemId"
                          onChange={handleChange}
                          required
                          shadow
                        >
                          <option value="">Select a product</option>
                          {storeProducts.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.itemName}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <Label value="Quantity" />
                        </div>
                        <TextInput
                          id="quantity"
                          type="number"
                          placeholder="10"
                          required
                          shadow
                          onChange={handleChange}
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
                          "Add Products"
                        )}
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

          {products.length > 0 ? (
            <>
              <Table hoverable className="shadow-md w-full">
                <TableHead>
                  <TableHeadCell>Product Name</TableHeadCell>
                  <TableHeadCell>SKU</TableHeadCell>
                  <TableHeadCell>Type</TableHeadCell>
                  <TableHeadCell>Manufacturer</TableHeadCell>
                  <TableHeadCell>Quantity</TableHeadCell>
                  <TableHeadCell>Price</TableHeadCell>
                  <TableHeadCell></TableHeadCell>
                </TableHead>
                {products.map((product) => (
                  <Table.Body className="divide-y" key={product.id}>
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <TableCell>
                        <b>{product.item.itemName}</b>
                      </TableCell>
                      <TableCell>{product.item.sku}</TableCell>
                      <TableCell>{product.item.itemType}</TableCell>
                      <TableCell>{product.item.manufacturer}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>Rs. {product.item.itemPrice}</TableCell>
                      <TableCell>
                        <Button.Group>
                          <Button
                            onClick={() => {
                              setOpenModalEdit(true);
                              setFormData({
                                storeId: product.storeId,
                                itemId: product.itemId,
                                quantity: product.quantity,
                                storeName: product.store.storeName,
                                itemName: product.item.itemName,
                              
                              });
                            }}
                            color="gray"
                          >
                            <FaUserEdit className="mr-3 h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => {
                              setShowModal(true);
                              setFormData({
                                storeId: product.storeId,
                                itemId: product.itemId
                              });
                            }}
                            color="gray"
                          >
                            <MdDeleteForever className="mr-3 h-4 w-4" />
                            Delete
                          </Button>
                        </Button.Group>
                      </TableCell>
                    </TableRow>
                  </Table.Body>
                ))}
              </Table>
            </>
          ) : (
            <p>You have no store yet!</p>
          )}

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
                    Are you sure you want to delete this store-item?
                  </h3>
                  <div className="flex justify-center gap-4">
                    {/* Delete Function */}
                    <Button color="failure" onClick={handleDeleteProduct}>
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
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
