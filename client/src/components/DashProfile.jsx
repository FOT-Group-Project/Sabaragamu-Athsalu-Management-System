import {
  Alert,
  Button,
  TextInput,
  Spinner,
  Label,
  Select,
} from "flowbite-react";
import { React, useState, useRef, useEffect } from "react";
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
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();

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
          setFormData({ ...formData, profilepicurl: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data.user));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

        {updateUserSuccess && (
          <Alert color="success" className="mt-5">
            {updateUserSuccess}
          </Alert>
        )}
        {updateUserError && (
          <Alert color="failure" className="mt-5">
            {updateUserError}
          </Alert>
        )}
        {error && (
          <Alert color="failure" className="mt-5">
            {error}
          </Alert>
        )}
        <div>
          <div className="mb-2 block">
            <Label value="Username" />
          </div>
          <TextInput
            id="username"
            type="text"
            placeholder="@username"
            defaultValue={currentUser.username}
            required
            shadow
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label value="Email" />
          </div>
          <TextInput
            id="email"
            type="email"
            placeholder="email@gmail.com"
            defaultValue={currentUser.email}
            required
            shadow
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label value="First Name" />
          </div>
          <TextInput
            id="firstname"
            type="text"
            placeholder="First name"
            defaultValue={currentUser.firstname}
            required
            shadow
            onChange={handleChange}
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
            defaultValue={currentUser.lastname}
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
            type="phone"
            placeholder="Phone number"
            defaultValue={currentUser.phone}
            required
            shadow
            onChange={handleChange}
          />
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="email2" value="Role" />
          </div>

          <Select
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            id="role"
            required
            shadow
            disabled={imageFileUploading}
            value={currentUser.role}
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
        <div>
          <div className="mb-2 block">
            <Label value="Password" />
          </div>
          <TextInput
            id="password"
            type="password"
            placeholder="Password"
            defaultValue={currentUser.password}
            required
            shadow
            onChange={handleChange}
          />
        </div>
        <Button className="mt-3" color="blue" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm" />
              <span className="pl-3">Updating...</span>
            </>
          ) : (
            "Update"
          )}
        </Button>
      </form>
    </div>
  );
}
