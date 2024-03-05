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

export default function DashUsers() {
  const [openModal, setOpenModal] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);

  const filePickerRef = useRef();

  const handelImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

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
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
        });
      }
    );
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
            <form className="flex flex-col flex-grow gap-4">
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
                  src={imageFileUrl || currentUser.profilepicurl}
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
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="email2" value="Phone number" />
                  </div>
                  <TextInput
                    id="phonenumber"
                    type="text"
                    placeholder="+94 xx xxx xxxx"
                    required
                    shadow
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
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="email2" value="Role" />
                  </div>
                  <TextInput
                    id="email2"
                    type="email"
                    placeholder="name@flowbite.com"
                    required
                    shadow
                  />
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
                  />
                </div>
                <div>
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="email2" value="Confirm password" />
                    </div>
                    <TextInput
                      id="password"
                      type="password"
                      placeholder="**********"
                      required
                      shadow
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="blue" size="sm" onClick={() => setOpenModal(true)}>
            Add User
          </Button>
          <Button size="sm" color="gray" onClick={() => setOpenModal(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="overflow-x-auto rounded-lg">
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
          <TableBody className="divide-y">
            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white flex items-center">
                <Avatar
                  alt="user"
                  img="https://avatars.githubusercontent.com/u/91375598?v=4"
                  rounded
                  className="mr-3"
                />

                {"Maleesha Herath"}
              </TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>Rathnapura</TableCell>
              <TableCell>malisha27t@gmail.com</TableCell>
              <TableCell>077-148 9635</TableCell>
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
            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white flex items-center">
                <Avatar
                  alt="user"
                  img="https://avatars.githubusercontent.com/u/91375598?v=4"
                  rounded
                  className="mr-3"
                />

                {"Maleesha Herath"}
              </TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>Rathnapura</TableCell>
              <TableCell>malisha27t@gmail.com</TableCell>
              <TableCell>077-148 9635</TableCell>
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

            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white flex items-center">
                <Avatar
                  alt="user"
                  img="https://avatars.githubusercontent.com/u/91375598?v=4"
                  rounded
                  className="mr-3"
                />

                {"Maleesha Herath"}
              </TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>Rathnapura</TableCell>
              <TableCell>malisha27t@gmail.com</TableCell>
              <TableCell>077-148 9635</TableCell>
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
            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white flex items-center">
                <Avatar
                  alt="user"
                  img="https://avatars.githubusercontent.com/u/91375598?v=4"
                  rounded
                  className="mr-3"
                />

                {"Maleesha Herath"}
              </TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>Rathnapura</TableCell>
              <TableCell>malisha27t@gmail.com</TableCell>
              <TableCell>077-148 9635</TableCell>
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
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
