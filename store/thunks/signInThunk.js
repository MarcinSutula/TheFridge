import {
  ALERT_OTHER,
  ALERT_EMAIL_NOTFOUND,
  ALERT_INVALID_PASSWORD,
  ALERT_USER_DISABLED,
  ALERT_AUTH_FAIL,
} from "../../components/control/config";
import {
  fetchAuthData,
  fetchFirestoreData,
} from "../../components/control/initFirebase";
import { findUserRdx } from "../../components/utils/helpers";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const signInThunk = createAsyncThunk(
  "fridge/signInThunk",
  async (thunkPayload, { dispatch, getState }) => {
    return fetchAuthData("signInWithPassword", thunkPayload)
      .then((res) => {
        if (res.ok) {
          try {
            return res.json().then(async (resData) => {
              localStorage.setItem("userId", resData.localId);
              const userData = await fetchFirestoreData(resData.localId, "get");
              return { user: userData, id: resData.localId };
            });
          } catch (err) {
            console.error(err);
            alert(ALERT_OTHER);
          }
        } else {
          return res.json().then((resData) => {
            let authFailMsg;
            switch (resData.error.message) {
              case "EMAIL_NOT_FOUND":
                authFailMsg = ALERT_EMAIL_NOTFOUND;
                return authFailMsg;
              case "INVALID_PASSWORD":
                authFailMsg = ALERT_INVALID_PASSWORD;
                return authFailMsg;
              case "USER_DISABLED":
                authFailMsg = ALERT_USER_DISABLED;
                return authFailMsg;
              default:
                authFailMsg = ALERT_AUTH_FAIL;
                return authFailMsg;
            }
          });
        }
      })
      .catch((err) => {
        console.error(err);
        alert(ALERT_OTHER);
      });
  }
);

export function signInPendingReducer(state) {
  state.signInStatus = "loading";
}

export function signInFulfilledReducer(state, action) {
  if (action.payload.user) {
    state.signInStatus = "success";
    const foundUser = findUserRdx(state, action);
    if (foundUser) {
      foundUser.id = action.payload.id;
    } else {
      state.users.push({ ...action.payload.user, id: action.payload.id });
    }
  } else {
    state.signInStatus = "failed";
    alert(action.payload);
  }
}

export function signInRejectedReducer(state) {
  state.signInStatus = "failed";
  alert(ALERT_OTHER);
}
