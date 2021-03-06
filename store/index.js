import { createSlice, configureStore } from "@reduxjs/toolkit";
import { autoLogin } from "./user actions/autoLogin";
import { logout } from "./user actions/logout";
import { addFood } from "./food actions/addFood";
import { editFood } from "./food actions/editFood";
import { removeFood } from "./food actions/removeFood";
import { sortByColumn } from "./food actions/sortByColumn";
import { addRecipe } from "./recipe actions/addRecipe";
import { editRecipe } from "./recipe actions/editRecipe";
import { removeRecipe } from "./recipe actions/removeRecipe";
import { addDescription } from "./recipe actions/addDescription";
import { removeDescription } from "./recipe actions/removeDescription";
import { addShoppingListItem } from "./shopping list actions/addShoppingListItem";
import { removeShoppingListItem } from "./shopping list actions/removeShoppingListItem";
import { addMissingIngsToShopList } from "./recipe actions/addMissingIngsToShopList";
import { foodMiddleware } from "./middlewares/foodMiddleware";
import {
  signInThunk,
  signInPendingReducer,
  signInFulfilledReducer,
  signInRejectedReducer,
} from "./thunks/signInThunk";
import {
  signUpThunk,
  signUpPendingReducer,
  signUpFulfilledReducer,
  signUpRejectedReducer,
} from "./thunks/signUpThunk";
import { recipesMiddleware } from "./middlewares/recipesMiddleware";
import { shoppingListMiddleware } from "./middlewares/shoppingListMiddleware";

const initialState = {
  sortedField: "",
  sortDirection: "desc",
  users: [],
  signUpStatus: "",
  signInStatus: "",
};

const fridgeSlice = createSlice({
  name: "fridge",
  initialState,
  extraReducers: {
    [signUpThunk.pending]: signUpPendingReducer,
    [signUpThunk.fulfilled]: signUpFulfilledReducer,
    [signUpThunk.rejected]: signUpRejectedReducer,
    [signInThunk.pending]: signInPendingReducer,
    [signInThunk.fulfilled]: signInFulfilledReducer,
    [signInThunk.rejected]: signInRejectedReducer,
  },
  reducers: {
    autoLogin,
    logout,
    addFood,
    editFood,
    removeFood,
    sortByColumn,
    addRecipe,
    editRecipe,
    removeRecipe,
    addDescription,
    removeDescription,
    addMissingIngsToShopList,
    addShoppingListItem,
    removeShoppingListItem,
  },
});

const store = configureStore({
  reducer: fridgeSlice.reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      foodMiddleware,
      recipesMiddleware,
      shoppingListMiddleware
    ),
});

export const fridgeActions = fridgeSlice.actions;

export default store;
