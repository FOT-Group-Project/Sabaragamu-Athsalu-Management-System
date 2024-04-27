import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  Button,
  Breadcrumb,
  Modal,
  Label,
  Alert,
  TextInput,
  Select,
  Spinner,
} from "flowbite-react";

import { FaUserEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { HiHome, HiEye, HiEyeOff, HiOutlineExclamationCircle, HiUserAdd, HiPlusCircle } from "react-icons/hi";
import { CircularProgressbar } from "react-circular-progressbar";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import Profile from "../assets/add-pic.png";




// Main component
export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);

  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [formData, setFormData] = useState({});
  const [createUserError, setCreateUserError] = useState(null);
  const [createLoding, setCreateLoding] = useState(null);

  const filePickerRef = useRef();
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/getusers");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Filtered users based on search query
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery)
  );

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/deleteuser/${userIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
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
          <Breadcrumb aria-label="Breadcrumb for Users">
            <Link to="/dashboard">
              <Breadcrumb.Item icon={HiHome}>Home</Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item>Users</Breadcrumb.Item>
          </Breadcrumb>

          <h1 className="mt-3 mb-3 text-left font-semibold text-xl">
            All Users
          </h1>

          <div className="flex justify-between items-center">
            <TextInput
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by username..."
              className="w-72 h-10"
            />
            <Button
              color="blue"
              size="sm"
              onClick={() => setOpenModal(true)}
            >
              <HiPlusCircle className="mr-2 h-4 w-4" />
              Add Users
            </Button>
          </div>

          {/* Table for displaying users */}
          <Table hoverable className="shadow-md w-full">
            {/* <TableHead >
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell>Username</TableHeadCell>
              <TableHeadCell>Role</TableHeadCell>
              <TableHeadCell>Email</TableHeadCell>
              <TableHeadCell>Phone</TableHeadCell>
              <TableHeadCell>Actions</TableHeadCell>
            </TableHead> */}
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar
                        alt={user.username}
                        img={user.profilepicurl}
                        rounded
                        className="mr-3"
                      />
                      {user.firstname + " " + user.lastname}
                    </div>
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Button.Group>
                      <Button
                        onClick={() => {
                          setOpenModalEdit(true);
                          setFormData(user);
                        }}
                        color="gray"
                      >
                        <FaUserEdit className="mr-3 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => {
                          setShowModal(true);
                          setUserIdToDelete(user.id);
                        }}
                        color="gray"
                      >
                        <MdDeleteForever className="mr-3 h-4 w-4" />
                        Delete
                      </Button>
                    </Button.Group>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            popup
            size="md"
          >
            <Modal.Body>
              <div className="text-center">
                <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400" />
                <h3>Are you sure you want to delete this user?</h3>
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
          </Modal>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
