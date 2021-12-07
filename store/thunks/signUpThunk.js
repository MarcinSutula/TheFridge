import {
  ALERT_OTHER,
  ALERT_EMAIL_EXISTS,
  ALERT_AUTH_FAIL,
  ALERT_WEAK_PASSWORD,
  ALERT_EMAIL_INVALID,
} from "../../components/control/config";
import {
  fetchAuthData,
  fetchFirestoreData,
} from "../../components/control/initFirebase";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const signUpThunk = createAsyncThunk(
  "fridge/signUpThunk",
  async (thunkPayload, { dispatch, getState }) => {
    return fetchAuthData("signUp", thunkPayload)
      .then((res) => {
        if (res.ok) {
          try {
            return res.json().then(async (resData) => {
              const payload = {
                username: thunkPayload.username,
                foodId: 0,
                recipesId: 0,
                totalQuantity: 0,
                totalWeight: 0,
                food: [],
                recipes: [],
              };
              await fetchFirestoreData(resData.localId, "set", payload);
              return payload;
            });
          } catch (err) {
            console.error(err);
            alert(ALERT_OTHER);
          }
        } else {
          // !res.ok
          return res.json().then((resData) => {
            let authFailMsg;
            switch (resData.error.message) {
              case "EMAIL_EXISTS":
                authFailMsg = ALERT_EMAIL_EXISTS;
                return authFailMsg;
              case "WEAK_PASSWORD : Password should be at least 6 characters":
                authFailMsg = ALERT_WEAK_PASSWORD;
                return authFailMsg;
              case "INVALID_EMAIL":
                authFailMsg = ALERT_EMAIL_INVALID;
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

export function signUpPendingReducer(state) {
  state.signUpStatus = "loading";
}

export function signUpFulfilledReducer(state, action) {
  if (action.payload.username) {
    state.signUpStatus = "success";
    state.users.push(action.payload);
  } else {
    state.signUpStatus = "failed";
    alert(action.payload);
  }
}

export function signUpRejectedReducer(state) {
  state.signUpStatus = "failed";
  alert(ALERT_OTHER);
}
