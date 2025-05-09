import { Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MobileNavigation from "./components/MobileNavigation";
import axios from "axios"; // Keep this import
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBannerData, setImageURL } from "./store/movieoSlice";

import Home from "./pages/Home.jsx";
import ExplorePage from "./pages/ExplorePage.jsx";
import DetailsPage from "./pages/DetailsPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";

function App() {
  const dispatch = useDispatch();

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
  }, []);

  return (
    <main>
      <Header />
      <div className="min-h-[90vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:mediaType" element={<ExplorePage />} />
          <Route path="/:mediaType/:id" element={<DetailsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </div>
      <Footer />
      <MobileNavigation />
    </main>
  );
}

export default App;
