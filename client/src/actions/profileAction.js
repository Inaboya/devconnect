import axios from "axios";
import { PROFIlE_LOADING, GET_PROFILE, GET_ERRORS } from "./types";

//get current profile

export const getCurrentProfile = () => (dispatch) => {
  dispatch(setProfileLoading());

  axios
    .get("/api/profile")
    .then((res) =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_PROFILE,
        payload: {},
      })
    );
};

//set Profile Loading

export const setProfileLoading = () => {
  return {
    type: PROFIlE_LOADING,
  };
};
