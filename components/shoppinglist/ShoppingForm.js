import classes from "./ShoppingForm.module.css";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { fridgeActions } from "../../store/index";
import { FindUser } from "../utils/helpers";
import { SHOPPINGLISTNAME_MAX_LENGTH } from "../control/config";

function ShoppingForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const foundUser = FindUser();

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
    <div className={classes.shopping_form}>
      <form onSubmit={handleSubmit(submitAddShoppingListItemHandler)}>
        <input
          {...register("shoppingListItem")}
          type="text"
          maxLength={SHOPPINGLISTNAME_MAX_LENGTH}
          required
          autoFocus
        />
        <button>✔</button>
      </form>
    </div>
  );
}

export default ShoppingForm;
