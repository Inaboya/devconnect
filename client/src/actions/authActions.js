import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import axios from "axios";
import setAuthToken from "../utilities/setAuthToken";
import jwt_decode from "jwt-decode";
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
    .then((res) => {
      //Save to Local storage
      const { token } = res.data;

      //Set to local storage
      localStorage.setItem("jwtToken", token);

      //Set token to Auth Header
      setAuthToken(token);

      //Decode token

      const decoded = jwt_decode(token);

      //Set Current User
      dispatch(setCurrentUser(decoded));
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

//Set Logged In User

export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

//log out user

export const logoutUser = () => (dispatch) => {
  //Remove token form localStorage
  localStorage.removeItem("jwtToken");

  //Remove auth header for future requests
  setAuthToken(false);

  //set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
