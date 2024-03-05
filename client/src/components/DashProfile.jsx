import { Alert, Button, TextInput, Label } from "flowbite-react";
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

export default function DashProfile() {
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
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
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
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label value="Role" />
          </div>
          <TextInput
            id="role"
            type="text"
            placeholder="Role"
            defaultValue={currentUser.role}
            required
            shadow
          />
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
          />
        </div>

        <Button className="mt-2" type="submit" color="blue">
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-end mt-5">
        <p className="cursor-pointer">Sign Out</p>
      </div>
    </div>
  );
}
