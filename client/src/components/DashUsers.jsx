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

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [formData, setFormData] = useState({});

  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [imageFileUploadingComplete, setImageFileUploadingComplete] =
    useState(false);

  const [createUserError, setCreateUserError] = useState(null);
  const [createLoding, setCreateLoding] = useState(null);

  const filePickerRef = useRef();

  const handelImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/user/getusers`);
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(
    () => {
      if (currentUser.role == "Admin") {
        fetchUsers();
      }

      if (imageFile) {
        uploadImage();
      }
    },
    [imageFile],
    [users.id]
  );

  const uploadImage = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }

    setCreateLoding(true);
    setImageFileUploadingComplete(false);

    setImageFileUploadError(null);
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
        setCreateLoding(false);
        setImageFileUploadingComplete(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilepicurl: downloadURL });
          setImageFileUploading(false);
          setCreateLoding(false);
          setImageFileUploadingComplete(true);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
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
        setOpenModal(false);
        fetchUsers();
      }
    } catch (error) {
      setCreateUserError("Something went wrong");
      setCreateLoding(false);
    }
  };

  return (
    <div className="p-3 w-full">
      <Breadcrumb aria-label="Default breadcrumb example">
        <Breadcrumb.Item href="#" icon={HiHome}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item>Users</Breadcrumb.Item>
      </Breadcrumb>

      <h1 className="mt-3 mb-3 text-left font-semibold text-xl">All Users</h1>

      <Button
        className="mb-3"
        color="blue"
        size="sm"
        onClick={() => setOpenModal(true)}
      >
        Add User
      </Button>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Create New User</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col flex-grow gap-4"
              disabled={imageFileUploading}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handelImageChange}
                ref={filePickerRef}
                hidden
              />
              <div
                className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
                onClick={() => filePickerRef.current.click()}
              >
                {imageFileUploadProgress && (
                  <CircularProgressbar
                    value={imageFileUploadProgress || 0}
                    text={`${imageFileUploadProgress}%`}
                    strokeWidth={5}
                    styles={{
                      root: {
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        top: 0,
                        left: 0,
                      },
                      path: {
                        stroke: `rgba(62, 152, 199, ${
                          imageFileUploadProgress / 100
                        })`,
                      },
                    }}
                  />
                )}
                <img
                  src={imageFileUrl || Profile}
                  alt="user"
                  className={`rounded-full w-full h-full object-cover border-4 border-[lightgray] ${
                    imageFileUploadProgress &&
                    imageFileUploadProgress < 100 &&
                    "opacity-60"
                  }`}
                />
              </div>
              {imageFileUploadError && (
                <Alert color="failure">{imageFileUploadError}</Alert>
              )}
              {imageFileUploadingComplete && (
                <Alert color="success">Image uploaded successfully</Alert>
              )}

              {createUserError && (
                <Alert color="failure">{createUserError}</Alert>
              )}
              <div className="flex gap-2">
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
                    onChange={handleChange}
                    disabled={imageFileUploading}
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
                    onChange={handleChange}
                    disabled={imageFileUploading}
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
                    onChange={handleChange}
                    disabled={imageFileUploading}
                  />
                </div>
              </div>
              <div className="flex gap-2">
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
                    onChange={handleChange}
                    disabled={imageFileUploading}
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
                    onChange={handleChange}
                    disabled={imageFileUploading}
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="email2" value="Role" />
                  </div>
                  <Select
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    id="role"
                    required
                    shadow
                    disabled={imageFileUploading}
                  >
                    <option value="SelectRole">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Director">Director</option>
                    <option value="Seller">Seller</option>
                    <option value="StoreKeeper">Store Keeper</option>
                    <option value="StockQA">StockQA</option>
                    <option value="Accountant">Accountant</option>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="email2" value="Password" />
                  </div>
                  <TextInput
                    id="password"
                    type="password"
                    placeholder="**********"
                    required
                    shadow
                    onChange={handleChange}
                    disabled={imageFileUploading}
                  />
                </div>
                <div>
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="email2" value="Confirm password" />
                    </div>
                    <TextInput
                      id="confirmPassword"
                      type="password"
                      placeholder="**********"
                      required
                      shadow
                      onChange={handleChange}
                      disabled={imageFileUploading}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button color="blue" type="submit" disabled={createLoding}>
                  {createLoding ? (
                    <>
                      <Spinner size="sm" />
                      <span className="pl-3">Loading...</span>
                    </>
                  ) : (
                    "Create User"
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
      </Modal>

      {currentUser.role == "Admin" && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md w-full">
            <TableHead>
              <TableHeadCell>name</TableHeadCell>
              <TableHeadCell>position</TableHeadCell>
              <TableHeadCell>location</TableHeadCell>
              <TableHeadCell>email</TableHeadCell>
              <TableHeadCell>phone number</TableHeadCell>
              <TableHeadCell>
                <span className="sr-only">Edit</span>
              </TableHeadCell>
            </TableHead>
            {users.map((user) => (
              <Table.Body className="divide-y" key={user.id}>
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white flex items-center">
                    <Avatar
                      alt={user.username}
                      img={user.profilepicurl}
                      rounded
                      className="mr-3"
                    />

                    {user.firstname + " " + user.lastname}
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>Rathnapura</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Button.Group>
                      <Button color="gray">
                        <FaUserEdit className="mr-3 h-4 w-4" />
                        Edit
                      </Button>
                      <Button color="gray">
                        <MdDeleteForever className="mr-3 h-4 w-4" />
                        Delete
                      </Button>
                    </Button.Group>
                  </TableCell>
                </TableRow>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no users yet!</p>
      )}
    </div>
  );
}
