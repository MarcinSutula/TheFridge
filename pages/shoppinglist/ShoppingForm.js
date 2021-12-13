import classes from "./ShoppingForm.module.css";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { fridgeActions } from "../../store/index";
import { findUser } from "../../components/utils/helpers";
import { SHOPPINGLISTNAME_MAX_LENGTH } from "../../components/control/config";
import { shoppingListValidationSchema } from "../../components/control/input validation/shoppingListValidationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import InputError from "../../components/InputError";
import { Fragment } from "react";

function ShoppingForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(shoppingListValidationSchema),
  });
  const dispatch = useDispatch();
  const foundUser = findUser();

  const submitAddShoppingListItemHandler = (data) => {
    dispatch(
      fridgeActions.addShoppingListItem({
        user: foundUser,
        listItem: data.shoppingListItem,
      })
    );
    reset();
  };

  return (
    <Fragment>
      {errors.shoppingListItem && (
        <InputError errorMessage={errors.shoppingListItem?.message} />
      )}
      <div className={classes.shopping_form}>
        <form onSubmit={handleSubmit(submitAddShoppingListItemHandler)}>
          <input {...register("shoppingListItem")} />
          <button>✔</button>
        </form>
      </div>
    </Fragment>
  );
}

export default ShoppingForm;
