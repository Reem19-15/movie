import React, { useState } from "react";
import BackGround from "../components/BackGround";
import Header from "../components/logo.jsx";
import { useNavigate } from "react-router-dom";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({ email: "", password: "" });

  const handleSignIn = async () => {
    try {
      const { email, password } = formValues;
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
    } catch (err) {
      console.log(err);
    }
  };

  onAuthStateChanged(firebaseAuth, (currentUser) => {
    if (currentUser) navigate("/");
  });

  return (
    <div className="relative">
      <BackGround />
      <div className="absolute top-0 left-0 bg-[rgba(36,36,36,0.35)] h-screen w-screen grid grid-rows-[100vh_80vh] text-white">
        <Header login />

        <div className="flex flex-col items-center justify-center gap-4 max-w-7xl mx-auto p-8 w-full">
          <div className="flex flex-col gap-4 text-center text-2xl bg-[rgba(0,0,0,0.75)] p-8 rounded-lg mb-8">
            <h1 className="text-5xl mb-4 px-8">
              Unlimited Movies, TV shows and more
            </h1>
            <h4 className="text-2xl mb-4">Watch anytime. Cancel anytime.</h4>
            <h6 className="text-lg font-normal text-gray-200">
              Ready to watch? Enter your email to create or restart your
              membership.
            </h6>
          </div>

          <div
            className={`grid ${
              showPassword ? "grid-cols-2" : "grid-cols-[2fr_1fr]"
            } w-full max-w-3xl mx-auto bg-[rgba(0,0,0,0.75)] p-8 rounded-lg`}
          >
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
              className="text-black border border-black p-6 text-lg rounded focus:outline-none"
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
                className="text-black border border-black p-6 text-lg rounded focus:outline-none"
              />
            )}
            {!showPassword && (
              <button
                onClick={() => setShowPassword(true)}
                className="px-4 py-2 bg-[#8b44f7] hover:bg-[#7433e0] text-white font-bold text-lg rounded transition-colors duration-200"
              >
                Get Started
              </button>
            )}
          </div>

          {showPassword && (
            <button
              onClick={handleSignIn}
              className="mt-4 px-4 py-2 bg-[#8b44f7] hover:bg-[#7433e0] text-white font-bold text-lg rounded min-w-[200px] mx-auto transition-colors duration-200"
            >
              Signup
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
