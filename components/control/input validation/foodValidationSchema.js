import * as Yup from "yup";
import {
  QUANTITY_MAX_LENGTH,
  FOODNAME_MAX_LENGTH,
  WEIGHT_REGEX,
  ERROR_EMPTY,
  ERROR_WEIGHT_FORMAT,
  ERROR_QUANTITY_LENGTH,
  ERROR_FOODNAME_LENGTH,
} from "../config";

export const foodValidationSchema = Yup.object().shape({
  foodName: Yup.string()
    .required(ERROR_EMPTY)
    .max(FOODNAME_MAX_LENGTH, ERROR_FOODNAME_LENGTH),
  foodType: Yup.string()
    .required(ERROR_EMPTY)
    .notOneOf(["DEFAULT"], ERROR_EMPTY),
  foodQuantity: Yup.string()
    .required(ERROR_EMPTY)
    .max(QUANTITY_MAX_LENGTH, ERROR_QUANTITY_LENGTH),
  foodWeight: Yup.string()
    .required(ERROR_EMPTY)
    .matches(WEIGHT_REGEX, ERROR_WEIGHT_FORMAT),
});

