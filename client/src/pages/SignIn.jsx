import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // FontAwesome icons for eye toggle
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import Logolight from "../assets/logolight.png";
import Logodark from "../assets/logodark.png";
import { motion } from "framer-motion";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility

  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const theme = useSelector((state) => state.theme.theme);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible); // Toggle visibility on click
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      dispatch(signInFailure("Please fill all the fields"));
      return;
    }

    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
      } else if (res.ok) {
        // Only dispatch success if response is ok
        dispatch(signInSuccess(data));

        navigate("/dashboard?tab=dash");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen mt-20"
      >
        <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-10">
          {/* Left side */}
          <div className="flex-1">
            <Link to="/" className="">
              {theme === "light" ? (
                <img src={Logolight} className="h-16" alt="Flowbite Logo" />
              ) : (
                <img src={Logodark} className="h-16" alt="Flowbite Logo" />
              )}
            </Link>
            <p className="text-sm mt-5">
              SABARAGAMU ATHSALU, a government business, specializes in selling
              finishing textiles.
            </p>
          </div>

          {/* Right side */}
          <div className="flex-1">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <h3 className="text-2xl font-bold dark:text-white">Log In</h3>
              <div>
                <Label value="Your User Name" />
                <TextInput
                  type="text"
                  placeholder="user name"
                  id="username"
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center">
                <div className="flex-grow">
                  <Label value="Your Password" />
                  <TextInput
                    type={passwordVisible ? "text" : "password"} // Toggle based on visibility state
                    placeholder="password"
                    id="password"
                    onChange={handleChange}
                  />
                  <div className="flex items-center mt-2">
                    <button
                      type="button"
                      className="mr-2" // Margin for eye button
                      onClick={togglePasswordVisibility} // Toggle on click
                      aria-label="Toggle password visibility"
                    >
                      {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                    </button>

                    <Label value="Show Password" />
                  </div>
                </div>
              </div>

              <Button color="blue" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  "Log In"
                )}
              </Button>
            </form>

            {errorMessage && (
              <Alert className="mt-5" color="failure">
                {errorMessage}
              </Alert>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
