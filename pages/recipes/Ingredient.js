import {
  COLOR_ISINFRIDGE,
  COLOR_ISNOTINFRIDGE,
} from "../../components/control/config";
import {
  getNumberFromStr,
  findUser,
  strCorrector,
} from "../../components/utils/helpers";

function Ingredient(props) {
  const foundUser = findUser();

  const ingredientStyleHandler = () => {
    const [ingAmount, ingName] = props.ing.split(",");
    let ingColor;

    const matchedFood = foundUser.food.find(
      (ele) => strCorrector(ele.name) === strCorrector(ingName)
    );

    if (
      matchedFood &&
      getNumberFromStr(ingAmount) <= getNumberFromStr(matchedFood.weight)
    ) {
      ingColor = COLOR_ISINFRIDGE;
    } else {
      ingColor = COLOR_ISNOTINFRIDGE;
    }

    return { color: ingColor };
  };

  return <li style={ingredientStyleHandler()}>✔ {props.ing}</li>;
}

export default Ingredient;
