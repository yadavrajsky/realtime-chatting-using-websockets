import React, { useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader/Loader";
import { searchUsers } from "../../reducers/userSlice";
import { Link } from "react-router-dom";

const SearchPageContainer = () => {
  const { loading, user:loggedInUser,users } = useSelector((state) => state.user);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    const keyword = e.target.value;
    if (keyword.length < 1) {
      return setShow(false);
    }

    setShow(true);
    dispatch(searchUsers(keyword));
  };

  return (
    <div>
      <section>
        <div className="items-center justify-center p-2 md:p-12 lg:px-20 py-20 lg:py-36">
          <div className="max-w-xl mx-auto transition-all transform rounded-xl bg-white shadow-lg">
            <div className="relative">
              <IoMdSearch className="pointer-events-none text-gray-800 absolute top-3.5 left-4 h-6 w-6" />
              <input
                type="text"
                className="input input-bordered w-full h-12 pr-4 placeholder-gray-700 text-gray-800 pl-11 sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type to Search"
                role="combobox"
                aria-expanded="false"
                aria-controls="options"
                onChange={handleSearch}
              />
            </div>
            {show && (
              <ul
                className="p-3 space-y-3 overflow-y-auto max-h-96 scroll-py-3 bg-white shadow-md rounded-lg"
                id="options"
                role="listbox"
              >
                {loading ? (
                  <div className="flex justify-center items-center py-4">
                    <Loader />
                  </div>
                ) : users?.length > 0 ? (
                  users.map((user) => (
                    <li
                      key={user.id}
                      className="flex justify-between items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      <span className="text-gray-800 font-medium">{user.name}</span>
                      <Link  to={`/dashboard/invite/${user?.id}`} className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                        Send Message
                      </Link>
                    </li>
                  ))
                ) : (
                  <p className="text-center text-gray-700">No results found</p>
                )}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SearchPageContainer;
