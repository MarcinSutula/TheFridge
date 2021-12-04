import * as Yup from "yup";
import {
  RECIPEINGREDIENTS_REGEX,
  RECIPENAME_MAX_LENGTH,
  RECIPESERVINGS_MAX_LENGTH,
  RECIPETIME_MAX_LENGTH,
  ERROR_RECIPENAME_LENGTH,
  ERROR_SERVINGS_LENGTH,
  ERROR_TIME_LENGTH,
  ERROR_ING_LENGTH,
  RECIPEINGREDIENTS_MAX_LENGTH,
  QUANTITY_MAX_LENGTH,
  FOODNAME_MAX_LENGTH,
  WEIGHT_REGEX,
  ERROR_FOOD_EMPTY,
  ERROR_WEIGHT_FORMAT,
  ERROR_QUANTITY_LENGTH,
  ERROR_FOODNAME_LENGTH,
  ALERT_ING_FORMAT,
} from "./config";

export const foodValidationSchema = Yup.object().shape({
  foodName: Yup.string()
    .required(ERROR_FOOD_EMPTY)
    .max(FOODNAME_MAX_LENGTH, ERROR_FOODNAME_LENGTH),
  foodType: Yup.string()
    .required(ERROR_FOOD_EMPTY)
    .notOneOf(["DEFAULT"], ERROR_FOOD_EMPTY),
  foodQuantity: Yup.string()
    .required(ERROR_FOOD_EMPTY)
    .max(QUANTITY_MAX_LENGTH, ERROR_QUANTITY_LENGTH),
  foodWeight: Yup.string()
    .required(ERROR_FOOD_EMPTY)
    .matches(WEIGHT_REGEX, ERROR_WEIGHT_FORMAT),
});

export const recipeValidationSchema = Yup.object().shape({
  recipeName: Yup.string()
    .required(ERROR_FOOD_EMPTY)
    .max(RECIPENAME_MAX_LENGTH, ERROR_RECIPENAME_LENGTH),
  recipeServings: Yup.string()
    .required(ERROR_FOOD_EMPTY)
    .max(RECIPESERVINGS_MAX_LENGTH, ERROR_SERVINGS_LENGTH),
  recipeTime: Yup.string()
    .required(ERROR_FOOD_EMPTY)
    .max(RECIPETIME_MAX_LENGTH, ERROR_TIME_LENGTH),
  recipeDifficulty: Yup.string()
    .required(ERROR_FOOD_EMPTY)
    .notOneOf(["DEFAULT"], ERROR_FOOD_EMPTY),
  ingredients: Yup.array().of(
    Yup.object().shape({
      ingName: Yup.string()
        .max(RECIPEINGREDIENTS_MAX_LENGTH, ERROR_ING_LENGTH)
        .matches(RECIPEINGREDIENTS_REGEX, ALERT_ING_FORMAT),
    })
  ),
  numberOfIngredients: Yup.string().notOneOf(["DEFAULT"], ERROR_FOOD_EMPTY),
});
