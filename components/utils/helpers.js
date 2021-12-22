import {
  PROTEIN_COLOR,
  DAIRY_COLOR,
  VEGETABLES_COLOR,
  FRUITS_COLOR,
  DRINKS_COLOR,
  OTHER_COLOR,
  COLOR_EXPIRED,
  MINDAYS_TO_SHOW_RED_EXPDATE,
  COLOR_ABOUT_TO_EXPIRE,
  COLOR_VALID,
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
  switch (type) {
    case "Protein":
      return PROTEIN_COLOR;
    case "Dairy":
      return DAIRY_COLOR;
    case "Vegetables":
      return VEGETABLES_COLOR;
    case "Fruits":
      return FRUITS_COLOR;
    case "Drinks":
      return DRINKS_COLOR;
    case "Other":
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

//For standarazing string in table sorting

export const strTrimToLwrCase = (str) => {
  if (typeof str !== "string") return str;
  return str.trim().toLowerCase();
};

//For dynamic returns in sorting

export const sortingReturn = (sortDirection, reverse = false) => {
  if (!reverse) {
    return sortDirection === "asc" ? 1 : -1;
  } else {
    return sortDirection === "asc" ? -1 : 1;
  }
};

//For getting the logged in user

export function FindUser() {
  const users = useSelector((state) => state.users);
  return users?.find((user) => user.id !== "");
}

//For getting the matched recipe

export function findRecipe(recipeId) {
  return FindUser()?.recipes.find((recipe) => recipe.id === +recipeId);
}

//For getting the user from store

export function findUserRdx(state, action) {
  return state.users.find(
    (user) => user.username === action.payload.user.username
  );
}

//For getting the recipe from store

export function findRecipeRdx(foundUser, action) {
  return foundUser?.recipes.find(
    (recipe) =>
      recipe.id ===
      (action.payload.prevRecipe
        ? +action.payload.prevRecipe.id
        : +action.payload.recipeId)
  );
}

export function strCorrector(str) {
  const strCorrected = str.trim().toLowerCase();
  return strCorrected;
}

//To filter ingredients we already have in food array

export function filterIngsFromFood(ingredients, food) {
  const filteredIngs = ingredients
    .map((ing) => {
      const [ingAmount, ingName] = ing.split(",");
      // to find ing name in food, if not found, push to shop list
      const matchedFood = food.find(
        (ele) => strCorrector(ele.name) === strCorrector(ingName)
      );

      if (matchedFood) {
        const dayInMs = 86400000;
        // if ing in food is expired, push whole ing
        if (
          matchedFood.expDate &&
          (new Date(matchedFood.expDate) - new Date()) / dayInMs <= 0
        ) {
          return ing;
        }
        //count how much is missing
        const missingAmount =
          getNumberFromStr(ingAmount) - getNumberFromStr(matchedFood.weight);
        if (missingAmount > 0) {
          const missingIng = `${missingAmount}${ingAmount.slice(
            ("" + getNumberFromStr(ingAmount)).length - ingAmount.length
          )},${ingName}`;
          return missingIng;
        } else return;
      } else {
        return ing;
      }
    })
    .filter((ing) => ing !== undefined);

  return filteredIngs;
}

// to set correct Expiration Date styling (if close to expiration or expired) and if its within phone width

export const checkExpDateStyle = (date, phone = false) => {
  const formattedDate = new Date(date);
  const now = new Date();
  const dayInMs = 86400000;
  const daysToExpire = (formattedDate - now) / dayInMs;
  let expDateStyle;

  if (daysToExpire < 0) {
    expDateStyle = [COLOR_EXPIRED, phone ? "600" : "700"];
  } else if (daysToExpire >= 0 && daysToExpire <= MINDAYS_TO_SHOW_RED_EXPDATE) {
    expDateStyle = [COLOR_ABOUT_TO_EXPIRE, phone ? "600" : "700"];
  } else {
    expDateStyle = [COLOR_VALID, "500"];
  }

  return expDateStyle;
};

// show correct date format

export const showCorrectDate = (date) => {
  if (!date) return "";
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString();
};
