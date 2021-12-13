import * as Yup from "yup";
import { SHOPPINGLISTNAME_MAX_LENGTH, ERROR_EMPTY } from "../config";

export const shoppingListValidationSchema = Yup.object().shape({
  shoppingListItem: Yup.string()
    .required(ERROR_EMPTY)
    .max(SHOPPINGLISTNAME_MAX_LENGTH),
});
