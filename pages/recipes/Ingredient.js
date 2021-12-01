import { useSelector, useDispatch } from "react-redux";
import { fridgeActions } from "../../store/index";
import { Fragment } from "react";
import { getNumberFromStr } from "../../components/utils/helpers";

function Ingredient(props) {
  const users = useSelector((state) => state.users);
  const foundUser = users.find((user) => user.id !== '');
  const foundRecipe = foundUser?.recipes.find(
    (recipe) => recipe.id === +props.recipeId
  );
  const ingredientStyleHandler = () => {
    const [ingAmount, ingName] = props.ing.split(",");
    let ingColor;

    const strCorrector = (str) => {
      const strCorrected = str.trim().toLowerCase();
      return strCorrected;
    };

    const matchedFood = foundUser.food.find(
      (ele) => strCorrector(ele.name) === strCorrector(ingName)
    );

    if (
      matchedFood &&
      getNumberFromStr(ingAmount) <= getNumberFromStr(matchedFood.weight)
    ) {
      ingColor = "#050f16d8";
      //black
    } else {
      ingColor = "#e16464";
      //red
    }

    return { color: ingColor };
  };

  return <li style={ingredientStyleHandler()}>✔ {props.ing}</li>;
}

export default Ingredient;
