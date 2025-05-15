import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import { getUsersLikedMovies } from "../store/movieoSlice";

export default function ProfilePage() {
  const movies = useSelector((state) => state.movieoData.movies);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const firebaseUser = useSelector((state) => state.user.firebaseUser);

  useEffect(() => {
    // This listener handles redirection if the user logs out
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (firebaseUser) {
      dispatch(getUsersLikedMovies());
    }
  }, [firebaseUser, dispatch]);

  return (
    <div className="min-h-screen bg-black text-white py-16">
      {" "}
      <div className="container mx-auto px-4">
        {" "}
        <h1 className="text-3xl lg:text-4xl font-semibold mb-8">
          My List
        </h1>{" "}
        <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
          {" "}
          {movies && movies.length > 0 ? (
            movies.map((movie) => {
              const cardData = {
                id: movie.movieId,
                title: movie.title,
                name: movie.title,
                poster_path: movie.poster_path,
                release_date: movie.release_date,
              };

              return (
                <Card
                  key={movie.movieId + "-" + movie.mediaType}
                  data={cardData}
                  media_type={movie.mediaType}
                  isLiked={true}
                />
              );
            })
          ) : (
            <p className="text-xl text-neutral-400 text-center w-full">
              No movies in your list yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
