import classes from "./ShoppingListItem.module.css";
import { useState } from "react";
import { findUser } from "../../components/utils/helpers";
import { fridgeActions } from "../../store";
import { useDispatch } from "react-redux";

function ShoppingListItem(props) {
  const [listItemClick, setListItemClick] = useState(false);
  const dispatch = useDispatch();
  const foundUser = findUser();

  const listItemOnClickHandler = (e) => {
    if (e.target.id === "shop-item")
      listItemClick ? setListItemClick(false) : setListItemClick(true);
  };

  const removeShoppingListItemHandler = () => {
    dispatch(
      fridgeActions.removeShoppingListItem({
        user: foundUser,
        listItem: props.item,
      })
    );
  };

  return (
    <li
      key={props.item.id}
      onClick={listItemOnClickHandler}
      className={`${classes.list_item} ${
        listItemClick ? classes.list_item_clicked : ""
      }`}
      id="shop-item"
    >
      {props.item.name}
      <button onClick={removeShoppingListItemHandler}>✖</button>
    </li>
  );
}

export default ShoppingListItem;
