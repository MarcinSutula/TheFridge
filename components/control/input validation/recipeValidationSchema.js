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
  ERROR_EMPTY,
  ERROR_ING_FORMAT,
} from "../config";


export const recipeValidationSchema = Yup.object().shape({
    recipeName: Yup.string()
      .required(ERROR_EMPTY)
      .max(RECIPENAME_MAX_LENGTH, ERROR_RECIPENAME_LENGTH),
    recipeServings: Yup.string()
      .required(ERROR_EMPTY)
      .max(RECIPESERVINGS_MAX_LENGTH, ERROR_SERVINGS_LENGTH),
    recipeTime: Yup.string()
      .required(ERROR_EMPTY)
      .max(RECIPETIME_MAX_LENGTH, ERROR_TIME_LENGTH),
    recipeDifficulty: Yup.string()
      .required(ERROR_EMPTY)
      .notOneOf(["DEFAULT"], ERROR_EMPTY),
    ingredients: Yup.array().of(
      Yup.object().shape({
        ingName: Yup.string()
          .max(RECIPEINGREDIENTS_MAX_LENGTH, ERROR_ING_LENGTH)
          .matches(RECIPEINGREDIENTS_REGEX, ERROR_ING_FORMAT),
      })
    ),
    numberOfIngredients: Yup.string().notOneOf(["DEFAULT"], ERROR_EMPTY),
  });