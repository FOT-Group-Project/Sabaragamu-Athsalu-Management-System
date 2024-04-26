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

export default function DashStores() {
  const { currentUser } = useSelector((state) => state.user);
  const [stores, setStores] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [storeIdToDelete, setStoreIdToDelete] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);

  const [formData, setFormData] = useState({});

  const [createUserError, setCreateUserError] = useState(null);
  const [createLoding, setCreateLoding] = useState(null);

  const [storeKeeper, setStoreKeeper] = useState([]);

  const fetchStoreKeeper = async () => {
    try {
      const res = await fetch(`/api/user/getstorekeepers`);
      const data = await res.json();
      if (res.ok) {
        setStoreKeeper(data.storekeepers);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchStores = async () => {
    try {
      const res = await fetch(`/api/associations/getStoreKeeperInfoStore`);
      const data = await res.json();
      if (res.ok) {
        setStores(data.stores);
        if (data.store.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (currentUser.role == "Admin") {
      fetchStores();
      fetchStoreKeeper();
    }
  }, [stores.id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreateLoding(true);
    try {
      const res = await fetch("/api/store/create", {
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

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    setCreateLoding(true);
    console.log(formData.id);
    try {
      const res = await fetch(`/api/store/updatestore/${formData.id}`, {
        method: "PUT",
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
        fetchStores();
        navigate("/dashboard?tab=store");
      }
    } catch (error) {
      // setCreateUserError("Something went wrong");
      setCreateLoding(false);
    }
  };

  const handleDeleteStore = async () => {
    try {
      const res = await fetch(`/api/store/deletestore/${storeIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setStores((prev) =>
          prev.filter((store) => store.id !== storeIdToDelete)
        );
        setShowModal(false);
        fetchStores();
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
            <Breadcrumb.Item>Stores</Breadcrumb.Item>
          </Breadcrumb>

          <h1 className="mt-3 mb-3 text-left font-semibold text-xl">
            All Stores
          </h1>
          <div className="flex gap-3 justify-end">
            <Button
              className="mb-3"
              color="blue"
              size="sm"
              onClick={() => setOpenModal(true)}
            >
              <HiPlusCircle className="mr-2 h-4 w-4" />
              Add Stores
            </Button>
           
          </div>

          <Modal show={openModal} onClose={() => setOpenModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Modal.Header>Create New Store</Modal.Header>
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
                          <Label value="Store Name" />
                        </div>
                        <TextInput
                          id="storeName"
                          type="text"
                          placeholder="Main Store"
                          required
                          shadow
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <Label value="Store Address" />
                        </div>
                        <TextInput
                          id="address"
                          type="text"
                          placeholder="Raathnapura"
                          required
                          shadow
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <Label value="Phone Number" />
                        </div>
                        <TextInput
                          id="phone"
                          type="text"
                          placeholder="+94XX XXX XXXX"
                          required
                          shadow
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <Label value="Select Store Keeper" />
                        </div>                        
                      
                      <Select
                        id="storeKeeperId"
                        onChange={handleChange}
                        required
                        shadow
                      >
                        <option value="">Select Store Keeper</option>
                        {storeKeeper.map((storeKeeper) => (
                          <option value={storeKeeper.id}>
                            {storeKeeper.firstname}
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
                          "Create Stores"
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
              <Modal.Header>Edit Store</Modal.Header>
              <Modal.Body>
                <div className="space-y-6">
                  <form
                    onSubmit={handleSubmitUpdate}
                    className="flex flex-col flex-grow gap-4"
                  >
                    {createUserError && (
                      <Alert color="failure">{createUserError}</Alert>
                    )}
                    <div className="flex gap-2 mb-4">
                      <div>
                        <div className="mb-2 block">
                          <Label value="Store Name" />
                        </div>
                        <TextInput
                          id="storeName"
                          type="text"
                          placeholder="Main Store"
                          required
                          shadow
                          onChange={handleChange}
                          value={formData.storeName}
                        />
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <Label value="Store Address" />
                        </div>
                        <TextInput
                          id="address"
                          type="text"
                          placeholder="Raathnapura"
                          required
                          shadow
                          onChange={handleChange}
                          value={formData.address}
                        />
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <Label value="Store Phone Number" />
                        </div>
                        <TextInput
                          id="phone"
                          type="text"
                          placeholder="+94XX XXX XXXX"
                          required
                          shadow
                          onChange={handleChange}
                          value={formData.phone}
                        />
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <Label value="Select Store Keeper" />
                        </div>                        
                      
                      <Select
                        id="storeKeeperId"
                        onChange={handleChange}
                        required
                        shadow
                        defaultValue={formData.storeKeeperId}
                        
                      >
                        <option value="">Select Store Keeper</option>
                        {storeKeeper.map((storeKeeper) => (
                          <option value={storeKeeper.id}>
                            {storeKeeper.firstname}
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
                          "Update Store"
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

          {currentUser.role == "Admin" && stores.length > 0 ? (
            <>
              <Table hoverable className="shadow-md w-full">
                <TableHead>
                  <TableHeadCell>Store ID</TableHeadCell>
                  <TableHeadCell>Store Name</TableHeadCell>
                  <TableHeadCell>Address</TableHeadCell>
                  <TableHeadCell>Phone Number</TableHeadCell>
                  <TableHeadCell>Store Keeper Name</TableHeadCell>
                  <TableHeadCell>
                    <span className="sr-only">Edit</span>
                  </TableHeadCell>
                </TableHead>
                {stores.map((store) => (
                  <Table.Body className="divide-y" key={store.id}>
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <TableCell>ST:{store.id}</TableCell>
                      <TableCell>{store.storeName}</TableCell>
                      <TableCell>{store.address}</TableCell>
                      <TableCell>{store.phone}</TableCell>
                      <TableCell>{store.storeKeeper.firstname}</TableCell>
                      <TableCell>
                        <Button.Group>
                          <Button
                            onClick={() => {
                              setOpenModalEdit(true);
                              setFormData(store);
                            }}
                            color="gray"
                          >
                            <FaUserEdit className="mr-3 h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => {
                              setShowModal(true);
                              setStoreIdToDelete(store.id);
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
                    Are you sure you want to delete this user?
                  </h3>
                  <div className="flex justify-center gap-4">
                    <Button color="failure" onClick={handleDeleteStore}>
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
