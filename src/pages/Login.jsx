import React, { useState } from "react";
import BackGround from "../components/BackGround";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";

export default function Login() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleLogIn = async () => {
    try {
      const { email, password } = formValues;
      await signInWithEmailAndPassword(firebaseAuth, email, password);
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

      <div className="absolute top-0 left-0 bg-black bg-opacity-35 w-full h-full flex flex-col items-center justify-center text-white z-10">
        <div className="flex flex-col items-center justify-center">
          <div className="p-8 bg-black bg-opacity-70 w-fit flex flex-col items-center justify-center gap-8 text-white rounded-lg">
            <div className="text-3xl font-bold">
              <h3>Login</h3>
            </div>
            <div className="flex flex-col gap-8">
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
                className="p-2 w-60 text-lg text-black"
              />
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
                className="p-2 w-60 text-lg text-black"
              />
              <button
                onClick={handleLogIn}
                className="p-2 bg-[#ff0101] border-none cursor-pointer text-white rounded font-bold text-lg"
              >
                Login
              </button>{" "}
            </div>
          </div>
        </div>
        {error && (
          <div className="text-red-500 text-sm text-center mt-4">{error}</div>
        )}

        <div className="mt-6 text-lg">
          <span>New to here? Join us now! </span>
          <span
            className="text-[#ff0101] hover:underline cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign up now
          </span>
        </div>
      </div>
    </div>
  );
}
