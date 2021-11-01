import { Fragment } from "react";
import Body from "./Body";
import BodyColumns from "./BodyColums";
import BodyFridgeDescription from "./BodyFridgeDescription";
import BodyRecipesDescription from "./BodyRecipesDescription";
import BodyShoppingListDescription from "./BodyShoppingListDescription";

function Home() {
  return (
    <Fragment>
      <Body />
      <BodyColumns />
      <BodyFridgeDescription />
      <BodyRecipesDescription />
      <BodyShoppingListDescription />
    </Fragment>
  );
}

export default Home;
