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
  const [storekeepdamageitemsIdToDelete, setstorekeepdamageitemsIdToDelete] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);

  const [formData, setFormData] = useState({});
  const [storekeepdamageitems, setStoreKeepDamageItems] = useState([]);
  const [createUserError, setCreateUserError] = useState(null);
  const [createLoding, setCreateLoding] = useState(false);

  

  
//call the api to send the data to the database shopreturndamageitems table
  const fetchdamageitems = async () => {
    try {
      const res = await fetch("/api/storekeepdamageitems");
      const data = await res.json();
      if (res.ok) {
        setStoreKeepDamageItems(data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  //affter sending the data to the database table refresh the page
  useEffect(() => {
    if (currentUser.role === "StoreKeeper") {
      fetchdamageitems();
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };

 
  //add the data to the database table
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreateLoding(true);
    try {
      const res = await fetch("/api/storekeepdamageitems", {
        method: "POST",
        headers: {
         
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
        fetchShops();
      }
    } catch (error) {
      // setCreateUserError("Something went wrong");
      setCreateLoding(false);
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
                          <Label value="id" />
                        </div>
                        <TextInput
                          id="id"
                          type="text"
                          placeholder="id"
                          required
                          shadow
                          onChange={handleChange}
                        />
                      </div>
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
                        <TextInput
                          id="storeId"
                          type="text"
                          placeholder="2536f"
                          required
                          shadow
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <Label value="ItemId" />
                        </div>
                        <TextInput
                          id="ItemId"
                          type="text"
                          placeholder="2536f"
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
                    onSubmit={handleSubmit}
                    className="flex flex-col flex-grow gap-4"
                  >
                    {createUserError && (
                      <Alert color="failure">{createUserError}</Alert>
                    )}
                    <div className="flex gap-2 mb-4">
                      <div>
                        <div className="mb-2 block">
                          <Label value="id" />
                        </div>
                        <TextInput
                          id="id"
                          type="text"
                          placeholder="id"
                          required
                          shadow
                          onChange={handleChange}
                          value={formData.id}
                        />
                      </div>
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
                        <TextInput
                          id="store id"
                          type="text"
                          placeholder="2536f"
                          required
                          shadow
                          onChange={handleChange}
                          value={formData.storeId}
                        />
                      </div>

                      <div>
                        <div className="mb-2 block">
                          <Label value="item id" />
                        </div>
                        <TextInput
                          id="item id"
                          type="text"
                          placeholder="2536f"
                          required
                          shadow
                          onChange={handleChange}
                          value={formData.itemId}
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

          {currentUser.role === "StoreKeeper" ? ( 
            <>
              <Table hoverable className="shadow-md w-full">
                <TableHead>
                  <TableHeadCell> ID</TableHeadCell>
                  <TableHeadCell>newUnitPrice</TableHeadCell>
                  <TableHeadCell>itemId	</TableHeadCell>
                  <TableHeadCell>quantity </TableHeadCell>
                  <TableHeadCell>storeId </TableHeadCell>
                  <TableHeadCell>itemId </TableHeadCell>
                  <TableHeadCell>
                    <span className="sr-only">Edit</span>
                  </TableHeadCell>
                </TableHead>
                {storekeepdamageitems.map((shop) => (
                  <Table.Body className="divide-y" key={shop.id}>
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <TableCell>ST:{storekeepdamageitems.id}</TableCell>
                      <TableCell>{storekeepdamageitems.date}</TableCell>
                      <TableCell>{storekeepdamageitems.quantity}</TableCell>
                      <TableCell>{storekeepdamageitems.storeId}</TableCell>
                      <TableCell>{storekeepdamageitems.itemId}</TableCell>
                      
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
                              setShopIdToDelete(damageitems.id);
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
                    <Button
                      color="red"
                      onClick={() => {
                        handleDeleteShop(shopIdToDelete);
                      }}
                    >

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
  