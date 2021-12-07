import { createSlice, configureStore } from "@reduxjs/toolkit";
import { login } from "./user actions/login";
import { logout } from "./user actions/logout";
import { createUser } from "./user actions/createUser";
import { addFood } from "./food actions/addFood";
import { editFood } from "./food actions/editFood";
import { removeFood } from "./food actions/removeFood";
import { sortByColumn } from "./food actions/sortByColumn";
import { addRecipe } from "./recipe actions/addRecipe";
import { editRecipe } from "./recipe actions/editRecipe";
import { removeRecipe } from "./recipe actions/removeRecipe";
import { addDescription } from "./recipe actions/addDescription";
import { removeDescription } from "./recipe actions/removeDescription";
import { authMiddleware } from "./authMiddleware";
import { foodMiddleware } from "./foodMiddleware";

const initialState = {
  sortedField: "",
  sortDirection: "desc",
  users: [],
};

const fridgeSlice = createSlice({
  name: "fridge",
  initialState,
  reducers: {
    login,
    logout,
    createUser,
    addFood,
    editFood,
    removeFood,
    sortByColumn,
    addRecipe,
    editRecipe,
    removeRecipe,
    addDescription,
    removeDescription,
  },
});

const store = configureStore({
  reducer: fridgeSlice.reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware, foodMiddleware),
});

export const fridgeActions = fridgeSlice.actions;

export default store;
