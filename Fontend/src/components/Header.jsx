import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import userIcon from "../assets/user.png";
import { IoSearchOutline } from "react-icons/io5";
import { navigation } from "./Navigation";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import { setUser } from "../store/userSlice";

const Header = () => {
  const location = useLocation();
  const removeSpace = location?.search?.slice(3)?.split("%20")?.join(" ");
  const [searchInput, setSearchInput] = useState(removeSpace);
  const navigate = useNavigate();
  const firebaseUser = useSelector((state) => state.user.firebaseUser);
  const dispatch = useDispatch();

  useEffect(() => {
    // Only navigate if searchInput is not empty, to avoid redirecting on initial load
    if (searchInput && searchInput.trim() !== "") {
      navigate(`/search?q=${searchInput}`);
    } else if (location.pathname === "/search" && searchInput.trim() === "") {
    }
  }, [searchInput, navigate, location.pathname]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleLogout = async () => {
    try {
      await signOut(firebaseAuth);
      dispatch(setUser(null));
      navigate("/login"); // Redirect to login page after logout
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <header className="fixed top-0 w-full h-16 bg-black bg-opacity-50 z-40">
      <div className="container mx-auto px-3 flex items-center h-full">
        <Link to={"/"}>
          <img src={logo} alt="logo" width={120} />
        </Link>

        <nav className="hidden lg:flex items-center gap-1 ml-5">
          {navigation.map((nav, index) => {
            return (
              <div key={nav.label + "header" + index}>
                <NavLink
                  to={nav.href}
                  className={({ isActive }) =>
                    `px-2 hover:text-neutral-100 ${
                      isActive && "text-neutral-100"
                    }`
                  }
                >
                  {nav.label}
                </NavLink>
              </div>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-5">
          <form className="flex items-center gap-2" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Search here..."
              className="bg-transparent px-4 py-1 outline-none border-none hidden lg:block"
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
            />
            <button className="text-2xl text-white">
              <IoSearchOutline />
            </button>
          </form>

          {firebaseUser ? (
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-semibold"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="w-8 h-8 rounded-full overflow-hidden cursor-pointer active:scale-50 transition-all"
            >
              <img src={userIcon} className="w-full h-full" alt="User Icon" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
