import { useState } from "react";
import classes from "./BodyColumns.module.css";
import { tableIcon, bookIcon, listIcon } from "../components/utils/icons";
import VizSensor from "react-visibility-sensor";
import { Grow } from "@material-ui/core";

function BodySecond() {
  const [active, setActive] = useState(false);
  const scrollToHandler = (id) => {
    const element = document.getElementById(id);
    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start",
    });
  };

  const scrollToFridgeHandler = () => {
    scrollToHandler("fridge_desc");
  };

  const scrollToRecipesHandler = () => {
    scrollToHandler("recipes_desc");
  };

  const scrollToShoppinglistHandler = () => {
    scrollToHandler("shopping_list_desc");
  };

  return (
    <div id="body_columns" className={classes.section_container}>
      <h1>Digitalized Fridge</h1>
      <VizSensor
        delayedCall={true}
        partialVisibility={true}
        offset={{ top: 150 }}
        onChange={(isVisible) => {
          if (active || !isVisible) return;
          setActive(true);
        }}
      >
        <Grow in={active} timeout={1000}>
          <div className={classes.options_container}>
            <div className={classes.option}>
              {tableIcon}
              <p>Easily manage your contents whenever, wherever you want.</p>
              <button onClick={scrollToFridgeHandler}>Learn more</button>
            </div>
            <div className={classes.option}>
              {bookIcon}
              <p>
                Add your recipes and check if you have all the required
                ingredients.
              </p>
              <button onClick={scrollToRecipesHandler}>Learn more</button>
            </div>
            <div className={classes.option}>
              {listIcon}
              <p>
                Create your shopping list by adding items manually or
                automatically.
              </p>
              <button onClick={scrollToShoppinglistHandler}>Learn more</button>
            </div>
          </div>
        </Grow>
      </VizSensor>
    </div>
  );
}

export default BodySecond;
