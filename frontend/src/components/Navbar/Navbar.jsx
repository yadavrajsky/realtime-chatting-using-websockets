/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Import useSelector

import { TbLayoutDashboard } from "react-icons/tb";
import { HiTemplate } from "react-icons/hi";

const navLinks = [
  {
    title: "Home",
    link: "/",
    icon: <TbLayoutDashboard />,
  },
  {
    title: "About",
    link: "/about",
    icon: <HiTemplate />,
  },
  // {
  //   title: "Link3",
  //   link: "/",
  //   icon: <AiFillCrown />,
  // },
  // {
  //   title: "Link4",
  //   link: "/",
  //   icon: <GiSellCard />,
  // },
];
import { AiOutlineMenuUnfold, AiOutlineMenuFold } from "react-icons/ai";
import { logoutUser, searchLoggedInUser } from "../../reducers/userSlice";
export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const location = useLocation();
  const [isMobileNavOpen, setisMobileNavOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isSignupRoute = location.pathname === "/signup";
  const isLoginRoute = location.pathname === "/login";

  //   If button is there
  const handleClick = () => {
    if (isMobileNavOpen) {
      setisMobileNavOpen(false);
    }
  };
  // const toggleMobileNav = () => {
  //   setisMobileNavOpen(!isMobileNavOpen);
  // };
  const handleLogout = (e) => {
    e.preventDefault();
    // Dispatch the logoutUser async thunk
    dispatch(logoutUser());
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => { 
    dispatch(searchLoggedInUser())
  }, [dispatch]);

  return (
    <div style={{ height: "10vh" }}>
      <div className="flex flex-wrap sys-app-notCollapsed ">
        <div className="w-full ">
          <div className="pb-0 py-2 px-2 mx-auto ">
            <div className="w-full flex justify-between items-center p-2 text-gray-900 bg-white rounded-lg shadow-lg font-medium ">
              {/* Logo */}
              <div>
                <span className="px-2">
                  <img
                    src="https://www.freepnglogos.com/uploads/spotify-logo-png/file-spotify-logo-png-4.png"
                    alt="alt placeholder"
                    className="w-8 h-8 -mt-1 inline mx-auto"
                  />
                  <Link className="ml-3" to={"/"}>
                    Brand
                  </Link>
                </span>
              </div>

              <div className="flex items-center order-2">
                {isAuthenticated ? (
                  <>
                    <button
                      type="button"
                      className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300"
                      id="user-menu-button"
                      aria-expanded="false"
                      data-dropdown-toggle="user-dropdown"
                      data-dropdown-placement="bottom"
                      onClick={() => toggleDropdown()}
                    >
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="w-8 h-8 rounded-full"
                        src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1721645674~exp=1721649274~hmac=6f69daff200b044c280e52737cfe54641a252b373fe818816221ed81ea78d4e6&w=740"
                        alt="user photo"
                      />
                    </button>
                    {/* Dropdown menu */}
                    {isDropdownOpen && (
                      <div className="absolute top-12 right-1 mt-2 py-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md">
                        <div className="px-4 py-3">
                          {/* <span className="block text-sm text-gray-900 dark:text-white">
                            Bonnie Green
                          </span> */}
                          <span className="block text-lg text-gray-500 truncate ">
                            {user?.name}
                          </span>
                            ({user?.email})
                        </div>
                        <ul className=" text-center">
                          <li>
                            <Link
                              to="/dashboard"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Dashboard
                            </Link>
                          </li>
            
                          <li>
                            <button
                              onClick={handleLogout}
                              className="block w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                            >
                              Sign out
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <ul className="flex items-center md:order-2 gap-3">
                    {/* <li className="hover:bg-gray-500 p-2 rounded-md">
                      <Link to="/">Home</Link>
                    </li> */}

                    {!isAuthenticated && !isSignupRoute && (
                      <li className=" p-2 bg-gray-300 rounded-lg">
                        <Link to="/signup">Signup</Link>
                      </li>
                    )}
                    {!isAuthenticated && !isLoginRoute && (
                      <li className=" p-2 bg-gray-300 rounded-lg">
                        <Link to="/login">Login</Link>
                      </li>
                    )}
                  </ul>
                )}

                {/* Hamberger Menu  */}
                <div className="md:hidden transition-all mr-3 my-3 cursor-pointer hover:text-gray-700">
                  {isMobileNavOpen ? (
                    <AiOutlineMenuFold
                      onClick={() => setisMobileNavOpen(false)}
                      className="rounded text-2xl"
                    />
                  ) : (
                    <AiOutlineMenuUnfold
                      onClick={() => setisMobileNavOpen(true)}
                      className="rounded text-2xl"
                    />
                  )}
                </div>
              </div>
              <div className="px-2 md:flex gap-x-5 items-center justify-center flex-1 text-gray-900 bg-white font-medium  hidden">
                {/* Links */}
                {navLinks?.map(({ title, link, icon }, id) => (
                  <Link key={id} to={link}>
                    <span
                      id={id}
                      className={`px-2 py-1 flex items-center cursor-pointer hover:bg-gray-200 hover:text-gray-700 text-sm rounded ${
                        location.pathname == link
                          ? "text-gray-700 font-semibold"
                          : ""
                      }`}
                    >
                      <span className="p-2 bg-gray-200 rounded-full">
                        {icon}
                      </span>
                      <span className="mx-1">{title}</span>
                    </span>
                  </Link>
                ))}
              </div>

              {/* After all nav links if you want any button in right then it will come here */}
              <div></div>
            </div>
          </div>

          {/* Mobile Navbar */}
          <div
            id="navbar"
            className={`pt-0 absolute top-2 z-100 mx-auto ${
              isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
            } transition-all flex-wrap md:hidden`}
            onClick={handleClick}
          >
            <div className="py-[.5px] w-64">
              <div className="w-full py-4 space-y-6 px-2 text-gray-900 bg-white rounded-lg min-h-screen  text-right  font-medium shadow-lg">
                {/* Logo */}
                <img
                  src="https://www.freepnglogos.com/uploads/spotify-logo-png/file-spotify-logo-png-4.png"
                  alt="alt placeholder"
                  className="w-8 h-8 mx-auto mb-5 "
                />

                {/* Links */}
                {navLinks?.map(({ title, link, icon }, id) => (
                  <Link key={id} href={link}>
                    <span
                      id={id}
                      className={`px-2 flex items-center cursor-pointer my-2 py-2 hover:bg-gray-200 hover:text-gray-700 text-sm rounded ${
                        location.pathname == link
                          ? "text-gray-700 font-semibold"
                          : ""
                      }`}
                    >
                      <span className="p-2 bg-gray-200 rounded-full">
                        {icon}
                      </span>
                      <span className="mx-1">{title}</span>
                    </span>
                  </Link>
                ))}

                {/* After all nav links if you want any button or link then it will come here */}
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
