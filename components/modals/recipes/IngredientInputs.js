import { Fragment } from "react";
import { RECIPEINGREDIENTS_MAX_AMOUNT_OF_INPUTS } from "../../control/config";
import InputError from "../../InputError";

function IngredientInputs(props) {
  return (
    <Fragment>
      <div>
        <h2>Ingredients</h2>
        <h4>format: amount,name (i.e: 5g,salt) </h4>
      </div>
      <label>How many ?</label>
      <select
        name="numberOfIngredients"
        {...props.register("numberOfIngredients")}
        defaultValue={"DEFAULT"}
      >
        <option value="DEFAULT" disabled hidden></option>
        {[...Array(RECIPEINGREDIENTS_MAX_AMOUNT_OF_INPUTS)].map((item, i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>
      {props.errors.ingredients && (
        <InputError
          errorMessage={props.errors.ingredients?.find((err) => !!err?.ingName)}
          ingredients={true}
        />
      )}
      {props.errors.numberOfIngredients && (
        <InputError errorMessage={props.errors.numberOfIngredients?.message} />
      )}
      {props.fields.map((item, i) => (
        <div key={i}>
          <label>Ingredient {i + 1}</label>
          <input
            name={`ingredients[${i}]ingName`}
            {...props.register(`ingredients[${i}].ingName`)}
          />
        </div>
      ))}
    </Fragment>
  );
}

export default IngredientInputs;
