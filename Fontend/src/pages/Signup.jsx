import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import BackGround from "../components/BackGround";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    try {
      const { email, password } = formValues;
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
      navigate("/");
      setError("");
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <BackGround />

      <div className="absolute top-0 left-0 bg- bg-opacity-35 w-full h-full flex flex-col items-center justify-center text-white z-10 p-4">
        <div className="p-8 bg-black bg-opacity-70 w-fit flex flex-col items-center justify-center gap-8 text-white rounded-lg max-w-lg mx-auto">
          {" "}
          <div className="flex flex-col items-center gap-4 text-center text-2xl">
            <h1 className="px-4 text-4xl font-bold">
              Unlimited Movies, TV shows and more
            </h1>{" "}
            <h4 className="text-xl">Watch anytime. Cancel anytime.</h4>{" "}
            <h6 className="text-lg">
              {" "}
              Ready to watch? Enter your email to create or restart your
              membership.
            </h6>
          </div>
          {/* Input and button section */}
          <div className="flex flex-col gap-8 w-full max-w-sm">
            <input
              type="email"
              placeholder="Your email address"
              name="email"
              value={formValues.email}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  [e.target.name]: e.target.value,
                })
              }
              className="p-4 text-lg bg-black border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-[#ff0101] text-white"
            />
            {showPassword && (
              <input
                type="password"
                placeholder="Your Password"
                name="password"
                value={formValues.password}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    [e.target.name]: e.target.value,
                  })
                }
                className="p-4 text-lg bg-black border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-[#ff0101] text-white"
              />
            )}
            {!showPassword && (
              <button
                onClick={() => setShowPassword(true)}
                className="p-3 bg-[#ff0101] text-white font-bold text-xl rounded cursor-pointer hover:bg-red-700 transition-colors"
              >
                Get Started
              </button>
            )}
            {showPassword && (
              <button
                onClick={handleSignIn}
                className="p-3 bg-[#ff0101] text-white font-bold text-xl rounded cursor-pointer hover:bg-red-700 transition-colors"
              >
                Signup
              </button>
            )}
          </div>
          {error && (
            <div className="text-red-500 text-sm mt-4 text-center">{error}</div>
          )}
          <div className="mt-6 text-lg">
            <span>Already have an account? </span>
            <span
              className="text-[#ff0101] hover:underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </div>
        </div>{" "}
      </div>
    </div>
  );
}
