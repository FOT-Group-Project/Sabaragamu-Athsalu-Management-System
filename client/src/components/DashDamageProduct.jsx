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
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

export default function fetchdamageitems() {
  const { currentUser } = useSelector((state) => state.user);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [storekeepdamageitemsIdToDelete, setstorekeepdamageitemsIdToDelete] =
    useState("");

  const [openModal, setOpenModal] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [stordamageIdToDelete, setStordamageIdToDelete] = useState("");
  const [formData, setFormData] = useState({});
  const [storekeepdamageitems, setStoreKeepDamageItems] = useState([]);
  const [createUserError, setCreateUserError] = useState(null);
  const [createLoding, setCreateLoding] = useState(false);
  const [storeitems, setStoreItems] = useState([]);

  const [products, setProducts] = useState([]);
  const [StoredamageItem, setStoredamageItems] = useState([]);

  //sed data to afer click submit buttern the storekeeperdamageitem table
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreateLoding(true);
    try {
      const res = await fetch("/api/stordamageproduct/addStoredamageItem", {
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
        setOpenModal(false);
        fetchStores();
      }
    } catch (error) {
      // setCreateUserError("Something went wrong");
      setCreateLoding(false);
    }
  };

  //fetch storitem data from storeitem table

  const fetchStoreItems = async () => {
    try {
      const response = await fetch("/api/stordamageproduct/getstoritem");
      const data = await response.json();
      setStoredamageItems(data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (currentUser.role === "StoreKeeper") {
      fetchStoreItems();
    }
  }, []);

  //fetch storedamadeitem data from StoredamageItem table
  const fetchStoredamageItems = async () => {
    try {
      const response = await fetch("/api/stordamageproduct/getStoredamageItem");
      const data = await response.json();
      setStoreItems(data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };



  //get data product data from product table
  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/stordamageproduct/getproduct");
      const data = await response.json();
      setProducts(data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  




  //affter sending the data to the database table refresh the page
  useEffect(() => {
    if (currentUser.role === "StoreKeeper") {
      fetchStoredamageItems();
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(
        `/api/stordamageproduct/deleteStoredamageItem/${stordamageIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.status == 400) {
        setShowModalDeletelock(true);
        setErrorMessage(data.message);
        setShowModal(false);
      }
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModal(false);
        fetchUsers();
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
            <Breadcrumb.Item href="#" icon={HiHome}>
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item>Damage</Breadcrumb.Item>
          </Breadcrumb>

          <h1 className="mt-3 mb-3 text-left font-semibold text-xl">
            Dmage Items
          </h1>
          <div className="flex gap-3 justify-end">
            <Button
              className="mb-3"
              color="blue"
              size="sm"
              onClick={() => setOpenModal(true)}
            >
              <HiPlusCircle className="mr-2 h-4 w-4" />
              Add Damage Items
            </Button>
          </div>

          <Modal show={openModal} onClose={() => setOpenModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Modal.Header>Add Dmage Items</Modal.Header>
              <Modal.Body>
                <div className="space-y-6">
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col flex-grow gap-4"
                  >
                    {createUserError && (
                      <Alert color="failure">{createUserError}</Alert>
                    )}
                    <div className="flex gap-2 mb-4">
                      <div>
                        <div className="mb-2 block">
                          <Label value="Date" />
                        </div>
                        <TextInput
                          id="date"
                          type="date"
                          placeholder="2021-09-05"
                          required
                          shadow
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <Label value="quantity" />
                        </div>
                        <TextInput
                          id="quantity"
                          type="number"
                          placeholder="2"
                          required
                          shadow
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <Label value="storeId" />
                        </div>
                        <Select
                          id="storId"
                          type="text"
                          placeholder="2536f"
                          required
                          shadow
                          onChange={handleChange}
                        >
                          {storeitems.map((storeitem) => (
                            <option key={storeitem.id} value={storeitem.id}>
                              {storeitem.itemId}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <Label value="ItemId" />
                        </div>
                      
                      
                        <Select

                          id="itemId"
                          type="text"
                          placeholder="2536f"
                          required
                          shadow
                          onChange={handleChange}
                        >
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.itemId}
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
                          " Add Dmage Items"
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

          <Modal show={openModalEdit} onClose={() => setOpenModalEdit(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Modal.Header>Edit</Modal.Header>
              <Modal.Body>
                <div className="space-y-6">
                  <form
                    onSubmit={"handleSubmit"}
                    className="flex flex-col flex-grow gap-4"
                  >
                    {createUserError && (
                      <Alert color="failure">{createUserError}</Alert>
                    )}
                    <div className="flex gap-2 mb-4">
                      <div>
                        <div className="mb-2 block">
                          <Label value="date" />
                        </div>
                        <TextInput
                          id="date"
                          type="date"
                          placeholder="2021-09-05"
                          required
                          shadow
                          onChange={handleChange}
                          value={formData.date}
                        />
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <Label value="quantity" />
                        </div>
                        <TextInput
                          id="quantitity"
                          type="number"
                          placeholder="10"
                          required
                          shadow
                          onChange={handleChange}
                          value={formData.quantity}
                        />
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <Label value="Store id" />
                        </div>
                        <Select
                          id="itemId"
                          type="text"
                          placeholder="2536f"
                          required
                          shadow
                          onChange={handleChange}
                          value={formData.storeId}
                        >
                          {storeitems.map((storeitem) => (
                            <option key={storeitem.id} value={storeitem.id}>
                              {storeitem.storeId}
                            </option>
                          ))}
                        </Select>
                      </div>

                      <div>
                        <div className="mb-2 block">
                          <Label value="item Name" />
                        </div>
                        <Select
                          id="itemId"
                          type="text"
                          placeholder="2536f"
                          required
                          shadow
                          onChange={handleChange}
                          value={formData.itemId}
                        >
                          {StoredamageItem.map((storeitem) => (
                            <option key={storeitem.id} value={storeitem.id}>
                              {storeitem.itemId}
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
                          "Edit Dmage Items"
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

          {currentUser.role === "StoreKeeper" && storeitems.length > 0 ? (
            <>
              <Table hoverable className="shadow-md w-full">
                <TableHead>
                  <TableHeadCell> ID</TableHeadCell>
                  <TableHeadCell>Date</TableHeadCell>
                  <TableHeadCell>itemId </TableHeadCell>
                  <TableHeadCell>storeId </TableHeadCell>
                  <TableHeadCell>quantity </TableHeadCell>
                  <TableHeadCell>
                    <span className="sr-only">Edit</span>
                  </TableHeadCell>
                </TableHead>

                {storeitems.map((shop) => (
                  <Table.Body className="divide-y" key={shop.id}>
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <TableCell>ST:{shop.id}</TableCell>
                      <TableCell>{shop.date}</TableCell>
                      <TableCell>{shop.itemId}</TableCell>
                      <TableCell>{shop.storeId}</TableCell>

                      <TableCell>{shop.quantity}</TableCell>

                      <TableCell>
                        <Button.Group>
                          <Button
                            onClick={() => {
                              setOpenModalEdit(true);
                              setFormData(damageitems);
                            }}
                            color="gray"
                          >
                            <FaUserEdit className="mr-3 h-4 w-4" />
                            Edit
                          </Button>

                          <Button
                            onClick={() => {
                              setShowModal(true);
                              setStordamageIdToDelete(shop.id);
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
              {/* {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )} */}
            </>
          ) : (
            <p>You have no Dmage yet!</p>
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
                    Are you sure you want to delete this user?
                  </h3>
                  <div className="flex justify-center gap-4">
                    <Button color="failure" onClick={handleDeleteUser}>
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
