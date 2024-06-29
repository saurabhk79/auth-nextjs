"use client";

import { useState } from "react";
import { setToken } from "@/redux/auth/auth.slice";
import useAuthSession from "../hooks/useAuthSession";
import { useAppDispatch } from "@/redux/store";
import { enqueueSnackbar, SnackbarProvider } from "notistack";

const HomePage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const user = useAuthSession();

  const handleLogin = async () => {
    // Implement the logic to authenticate the user
    if (validateUser()) {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        if (res.ok) {
          const data = await res.json();
          const { token, user } = data;

          dispatch(setToken(token));
          // dispatch(setUser(user));
          console.log("Login successful");

          enqueueSnackbar("Successfully Logged In!", {
            variant: "success",
          });
          setUsername("");
          setPassword("");
        } else {
          const errorData = await res.json();
          console.error("Login failed:", errorData);
          enqueueSnackbar("Failed to log in!", {
            variant: "error",
          });
        }
      } catch (error) {
        if (error instanceof Error)
          console.error("Login failed:", error.message);
        else console.error("Login failed:", error);

        enqueueSnackbar("Something went wrong!", {
          variant: "error", // Changed to "error" as "success" is not appropriate for an error message
        });
      }
    }
  };

  const validateUser = () => {
    if (username.length === 0) {
      console.log("User name must not be empty");
      enqueueSnackbar("User name must not be empty", {
        variant: "warning",
      });
      return false;
    }

    if (password.length < 6) {
      console.log("User name must be of length more than 6");
      enqueueSnackbar("Password must be of length more than 6", {
        variant: "warning",
      });
      return false;
    }

    return true;
  };

  if (user) {
    console.log(user);
  }

  return (
    <div>
      <SnackbarProvider transitionDuration={3}>
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            {user ? (
              <div>
                <h2 className="text-xl font-bold text-black">
                  Welcome, {user.username}
                </h2>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-center text-blue-500">
                  Login
                </h2>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full px-4 py-2 mt-4 border rounded-md text-black"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-2 mt-4 border rounded-md text-black"
                />
                <button
                  onClick={handleLogin}
                  className="w-full px-4 py-2 mt-6 font-bold text-white bg-blue-500 rounded-md"
                >
                  Login
                </button>
              </div>
            )}
            <div className="mt-6 p-4 border rounded-md text-black bg-gray-50">
              <h3 className="text-lg font-semibold">
                The hook should be usable like this:{" "}
              </h3>
              <pre className="mt-2 p-2 text-gray-500 bg-gray-100 rounded-md">
                <code>
                  {`const { user } = useAuthSession();
if (user) {
  console.log('User:', user.username);
}`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </SnackbarProvider>
    </div>
  );
};

export default HomePage;
