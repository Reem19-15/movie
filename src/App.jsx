import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MobileNavigation from "./components/MobileNavigation";
import axios from "axios"; // Keep this import
import { useEffect, useState } from "react"; // Import useState
import { useDispatch, useSelector } from "react-redux"; // Import useSelector
import { setBannerData, setImageURL } from "./store/movieoSlice";
import { setFirebaseUser } from "./store/userSlice";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "./utils/firebase-config"; // Ensure this path is correct

import Home from "./pages/Home.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import ExplorePage from "./pages/ExplorePage.jsx";
import DetailsPage from "./pages/DetailsPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import Profile from "./pages/ProfilePage.jsx";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const firebaseUser = useSelector((state) => state.user.firebaseUser); // Get user from Redux
  const [loadingAuthCheck, setLoadingAuthCheck] = useState(true); // State for initial auth check

  // Define BASE_URL and ACCESS_TOKEN directly in this file
  const BASE_URL = "https://api.themoviedb.org/3";
  const ACCESS_TOKEN = import.meta.env.VITE_REACT_APP_ACCESS_TOKEN;

  const fetchTrendingData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/trending/all/week`, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      dispatch(setBannerData(response.data.results));
    } catch (error) {
      console.log("error App.jsx fetchTrendingData:", error); // More specific error message
    }
  };

  const fetchConfiguration = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/configuration`, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      dispatch(setImageURL(response.data.images.secure_base_url + "original"));
    } catch (error) {
      console.log("error App.jsx fetchConfiguration:", error); // More specific error message
    }
  };

  useEffect(() => {
    fetchTrendingData();
    fetchConfiguration();

    // Global authentication listener
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      dispatch(setFirebaseUser(currentUser));
      setLoadingAuthCheck(false); // Authentication check is complete
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [dispatch]); // Removed navigate from dependency array as it's only used conditionally

  // Component to protect routes
  const ProtectedRoute = ({ children }) => {
    if (loadingAuthCheck) {
      return <div>Loading...</div>; // Or a spinner
    }
    if (!firebaseUser) {
      return navigate("/login", { replace: true }); // Redirect if not logged in
    }
    return children;
  };

  return (
    <main>
      <Header />
      <div className="min-h-[90vh]">
        <Routes>
          {/* Public Routes - Accessible to all */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes - Only accessible if logged in */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/:mediaType"
            element={
              <ProtectedRoute>
                <ExplorePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/:mediaType/:id"
            element={
              <ProtectedRoute>
                <DetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <div>404 Not Found</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
      <MobileNavigation />
    </main>
  );
}

export default App;
