import withAuth from "../../components/control/withAuth";
import classes from "./shoppingList.module.css";
import { useEffect, useState } from "react";
import ShoppingForm from "../../components/shoppinglist/ShoppingForm";
import ShoppingListItem from "../../components/shoppinglist/ShoppingListItem";
import { FindUser } from "../../components/utils/helpers";
import Spinner from "../../components/utils/Spinner";

function ShoppingList() {
  const [mounted, setMounted] = useState(false);
  const foundUser = FindUser();
  let shoppingList;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (foundUser) {
    shoppingList = foundUser.shoppingList;
    if (!mounted) return <Spinner big={true} />;
  } else {
    shoppingList = [];
    return <Spinner big={true} />;
  }

  return (
    mounted && foundUser &&(
      <div className={classes.background}>
        <div className={classes.container}>
          <ShoppingForm />
          <div className={classes.shopping_list}>
            <ul>
              {shoppingList.map((ele) => (
                <ShoppingListItem item={ele} key={ele.id} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  );
}

export default withAuth(ShoppingList);
