import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearAuth } from "@/redux/auth/auth.slice";
import { RootState } from "@/redux/store";

const useAuthSession = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  console.log("runs everytime")
  //  implement the logic here to check user session
  useEffect(() => {
    if (token) {
      console.log("running")
      fetch("/api/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          console.log("response", response);
          if (response.ok) return response.json();
          throw new Error("Unauthorized");
        })
        .then((data) => {
          console.log(data);
          dispatch(setUser(data.user));
        })
        .catch(() => {
          dispatch(clearAuth());
        });
    } else {
      dispatch(clearAuth());
    }

    // console.log(user, token);
  }, [dispatch, token]);

  console.log("hhok after:", user, token);

  return user;
};

export default useAuthSession;
