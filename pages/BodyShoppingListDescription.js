import classes from "./BodyShoppingListDescription.module.css";
import Image from "next/image";
import { checkIcon } from "../components/utils/icons";


function BodyShoppingListDescription() {
  const goToTopHandler = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div id="shopping_list_desc" className={classes.container}>
      <div className={classes.description_list}>
        <h1>Shopping List</h1>
        <ul>
          <li>
            {checkIcon}
            <p>Add shopping list items</p>
          </li>
          <li>
            {checkIcon}
            <p>Click to mark them</p>
          </li>
          <li>
            {checkIcon} <p>Remove after shopping</p>
          </li>
        </ul>
      </div>
      <div className={classes.img_container}>
        <Image
          className={classes.next_img}
          src="/shoppinglistprintscreen.jpg"
          alt="An example of fridge in table"
          layout="fill"
          priority="true"
        />
        <a onClick={goToTopHandler}>Go to the top</a>
      </div>
    </div>
  );
}

export default BodyShoppingListDescription;
