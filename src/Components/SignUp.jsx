// src/Components/SignUp.jsx

import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();

    if (!email || !password || !repeatPassword) {
      Swal.fire("Error", "Please fill out all fields", "error");
      return;
    }

    if (password !== repeatPassword) {
      Swal.fire("Error", "Passwords do not match", "error");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        Swal.fire("Success", "User signed up successfully!", "success").then(() => {
          navigate("/login");
        });
      })
      .catch((error) => {
        Swal.fire("Error", error.message, "error");
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f1ecf3] text-white">
      <div className="flex border border-[#3daece] shadow-lg min-h-[30rem]">
        
        {/* Left Side (Background image part) */}
        <div
          className="hidden md:flex w-90 bg-cover bg-center flex-col items-center justify-center"
        >
           <img className="h-full w-full" src="form-img.png" alt="form-img" />
        </div>

        {/* Right Side (Form) */}
        <form
          onSubmit={handleSignUp}
          className="bg-white p-8 rounded-lg shadow-md w-96 flex flex-col items-center justify-center min-h-[30rem] text-gray-800"
        >
          <h1 className="text-3xl font-bold text-[#3daece] mb-4">Sign Up</h1>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-2 border border-gray-300 rounded focus:outline-none focus:border-[#5f067a]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-2 border border-gray-300 rounded focus:outline-none focus:border-[#5f067a]"
          />
          <input
            type="password"
            placeholder="Repeat Password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-[#5f067a]"
          />

          <button
            type="submit"
            className="w-full p-3 bg-gradient-to-r from-[#3daece] to-blue-200 text-white rounded hover:bg-white hover:border hover:border-[#5f067a] transition-all duration-300"
          >
            Sign Up
          </button>

          <p className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <a href="/login" className="text-[#3daece] hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
