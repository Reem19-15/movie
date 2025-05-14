// signup.jsx
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

      <div className="absolute top-0 left-0 bg-opacity-35 w-full h-full flex items-center justify-center text-white z-10 p-4">
        <div className="container mx-auto max-w-3xl flex flex-col items-center justify-center text-center">
          <div className="flex flex-col gap-4 text-2xl">
            <h1 className="px-6">Unlimited Movies, TV shows and more</h1>
            <h4>Watch anytime. Cancel anytime.</h4>
            <h6>
              Ready to watch? Enter your email to create or restart your
              membership.
            </h6>
          </div>

          <div className="w-full mt-8">
            <div className="grid gap-4">
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
                className="p-6 text-white text-xl border border-white focus:outline-none bg-transparent"
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
                  className="p-6 text-white text-xl border border-white focus:outline-none bg-transparent"
                />
              )}
              {!showPassword && (
                <button
                  onClick={() => setShowPassword(true)}
                  className="p-2 bg-[#ff0101] text-white font-bold text-lg"
                >
                  Get Started
                </button>
              )}
            </div>

            {showPassword && (
              <button
                onClick={handleSignIn}
                className="mt-4 p-2 bg-[#ff0101] text-white font-bold text-lg rounded"
              >
                Signup
              </button>
            )}
          </div>

          {error && <div className="text-red-500 text-sm mt-4">{error}</div>}

          <div className="mt-6 text-lg">
            <span>Already have an account? </span>
            <span
              className="text-[#ff0101] hover:underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
