import { Button, Navbar, TextInput, Dropdown, Avatar } from "flowbite-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import Logolight from "../assets/logolight.png";
import Logodark from "../assets/logodark.png";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";

export default function Header() {
  const path = useLocation().pathname;
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);
  const theme = useSelector((state) => state.theme.theme);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Navbar className="border-b-2 sticky top-0 z-50">
      <Link
        to="/dashboard?tab=dash"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        {theme === "light" ? (
          <img src={Logolight} class="h-10" alt="Flowbite Logo" />
        ) : (
          <img src={Logodark} class="h-10" alt="Flowbite Logo" />
        )}
      </Link>

      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </Button>

        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentUser.profilepicurl} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item>
                <span className="block text-sm">Profile</span>
              </Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Link onClick={handleSignout}>
              <Dropdown.Item>
                <span className="block text-sm">Sign out</span>
              </Dropdown.Item>
            </Link>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button color="blue" outline size="sm">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </Navbar>
  );
}
