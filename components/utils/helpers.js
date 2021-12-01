import {
  PROTEIN_COLOR,
  DAIRY_COLOR,
  VEGETABLES_COLOR,
  FRUITS_COLOR,
  DRINKS_COLOR,
  OTHER_COLOR,
} from "../control/config";
import { useSelector } from "react-redux";

export function welcomeName(username) {
  if (!username) return;
  const splittedName = username.split("@")[0];
  const correctName =
    splittedName.charAt(0).toUpperCase() + splittedName.slice(1);
  return `Welcome, ${correctName}!`;
}

export function setBackgroundColor(type) {
  if (type === "Protein") {
    return PROTEIN_COLOR;
  } else if (type === "Dairy") {
    return DAIRY_COLOR;
  } else if (type === "Vegetables") {
    return VEGETABLES_COLOR;
  } else if (type === "Fruits") {
    return FRUITS_COLOR;
  } else if (type === "Drinks") {
    return DRINKS_COLOR;
  } else if (type === "Other") {
    return OTHER_COLOR;
  }
}
//Limiting max characters in number inputs (Weight and Quantity) according to given maxLength prop
export function maxLengthCheck(e) {
  if (e.target.value.length > e.target.maxLength) {
    e.target.value = e.target.value.slice(0, e.target.maxLength);
  }
}
//For table sorting in Redux
export function sortDateHelper(date) {
  if (!date) return "";
  const dateObj = new Date(date).getTime();
  return dateObj;
}

//For correctly counting weight (i.e separates 100 from ml)
export function getNumberFromStr(str) {
  const toStr = str.toString();
  const num = +toStr.match(/\d+/)[0];
  return num;
}

//For getting the logged in user

export function findUser() {
  const users = useSelector((state) => state.users);
  return users?.find((user) => user.id !== "");
}

//For getting the matched recipe

export function findRecipe(recipeId) {
  return findUser()?.recipes.find((recipe) => recipe.id === +recipeId);
}

//For getting the user from store

export function findUserRdx(state, action) {
  return state.users.find((user) => user.username === action.payload.username);
}

//For getting the recipe from store

export function findRecipeRdx(foundUser, action) {
  return foundUser?.recipes.find((recipe) => recipe.id === +action.payload.id);
}
