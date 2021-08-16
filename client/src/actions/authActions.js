import { GET_ERRORS } from "./types";
import axios from "axios";

//Register user

export const registerUser = (userData, history) => (dispatch) => {
  axios
    .post("/api/user/register", userData)
    .then((res) => history.push("/login"))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

//Login GET user Token

export const loginUser = (userData) => (dispatch) => {
  axios
    .post("/api/user/login", userData)
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
};
