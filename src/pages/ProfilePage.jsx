import React from "react"; // Removed unused imports: axios, useEffect, useState
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { useDispatch, useSelector } from "react-redux";

export default function ProfilePage() {
  const movies = useSelector((state) => state.movieoData.movies);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Uncomment this section when implementing Firebase authentication.
  // import { onAuthStateChanged } from "firebase/auth";
  // import { firebaseAuth } from "../utils/firebase-config";
  // const [email, setEmail] = useState(undefined);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
  //     if (currentUser) {
  //       setEmail(currentUser.email);
  //     } else {
  //       navigate("/login");
  //     }
  //   });
  //   return () => unsubscribe();
  // }, [navigate]);

  // useEffect(() => {
  //   if (email) {
  //     dispatch(getUsersLikedMovies(email));
  //   }
  // }, [email, dispatch]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mt-16 mx-10 flex flex-col gap-12">
        <h1 className="ml-12 text-3xl font-semibold">My List</h1>
        <div className="flex flex-wrap gap-4">
          {movies && movies.length > 0 ? (
            movies.map((movie, index) => (
              <Card
                movieData={movie}
                index={index}
                key={movie.id}
                isLiked={true}
              />
            ))
          ) : (
            <p className="ml-12 text-xl">No movies in your list yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
