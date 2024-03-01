import { Button, Navbar, TextInput } from 'flowbite-react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa'
import Logolight from '../assets/logolight.png'
import Logodark from '../assets/logodark.png'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '../redux/theme/themeSlice'

export default function Header() {
  const path = useLocation().pathname;
  const dispatch = useDispatch();

  const theme = useSelector((state) => state.theme.theme);
  
  return (
    <Navbar className='border-b-2'>
      <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
      {theme === 'light' ? 
        <img src={Logolight} class="h-10" alt="Flowbite Logo" />
      : <img src={Logodark} class="h-10" alt="Flowbite Logo" />
      }
      
      </Link>

      <Button className='w-12 h-10 lg:hidden' color='gray' pill>
        <AiOutlineSearch/>
      </Button>

      <div className='flex gap-2 md:order-2' >
        <Button className='w-12 h-10 hidden sm:inline' color='gray' pill onClick={ () => dispatch(toggleTheme())}>
          {theme === 'light' ? <FaMoon/> : <FaSun/>}
        </Button>
        <Link to="/sign-in">
          <Button color='blue' outline size="sm">
            Sign In
          </Button>
        </Link>
        <Navbar.Toggle/>
      </div>

      <Navbar.Collapse>
          <Navbar.Link active={path === "/"} as={'div'}>
            <Link to='/'>
              Home
            </Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/dashboard"} as={'div'}>
            <Link to='/dashboard'>
              Dashboard
            </Link>
          </Navbar.Link>
        </Navbar.Collapse>

    </Navbar>
  )
}

