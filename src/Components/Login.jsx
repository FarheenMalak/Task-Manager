// src/Components/Login.jsx

import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire("Error", "Please fill out all fields", "error");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        Swal.fire("Success", "User signed in successfully!", "success").then(() => {
          navigate("/home"); // After login, redirect to Home page
        });
      })
      .catch((error) => {
        Swal.fire("Error", error.message, "error");
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f1ecf3] text-white">
      <div className="flex border border-[#3daece] shadow-lg min-h-[30rem]">
        
        <div
          className="hidden md:flex w-90 bg-cover bg-center flex-col items-center justify-center"
           
        >
           <img className="w-full h-full" src="form-img.png" alt="form-img" />
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-lg shadow-md w-96 flex flex-col items-center justify-center min-h-[30rem] text-gray-800"
        >
          <h1 className="text-3xl font-bold text-[#3daece] mb-4">Login</h1>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-2 border border-gray-300 rounded focus:outline-none focus:border-[#3daece]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-[#3daece]"
          />

          <button
            type="submit"
            className="w-full p-3 bg-gradient-to-r from-[#3daece] to-blue-600 text-white rounded hover:bg-white hover:border hover:border-[#5f067a] transition-all duration-300"
          >
            Login
          </button>

          <p className="mt-4 text-sm text-center">
  Don't have an account?{" "}
  <Link to="/" className="text-[#3daece] hover:underline">
    Sign Up
  </Link>
</p>
        </form>
      </div>
    </div>
  );
};

export default Login;
