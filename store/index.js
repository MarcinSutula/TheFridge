import { createSlice, configureStore } from "@reduxjs/toolkit";
import { login } from "./User actions/login";
import { logout } from "./User actions/logout";
import { createUser } from "./User actions/createUser";
import { addFood } from "./Food actions/addFood";
import { editFood } from "./Food actions/editFood";
import { removeFood } from "./Food actions/removeFood";
import { sortByColumn } from "./Food actions/sortByColumn";
import { addRecipe } from "./Recipe actions/addRecipe";
import { editRecipe } from "./Recipe actions/editRecipe";
import { removeRecipe } from "./Recipe actions/removeRecipe";
import { addDescription } from "./Recipe actions/addDescription";
import { removeDescription } from "./Recipe actions/removeDescription";
import { authMiddleware } from "./authMiddleware";
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
    getDefaultMiddleware().concat(authMiddleware),
});

export const fridgeActions = fridgeSlice.actions;

export default store;
