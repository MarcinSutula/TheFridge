import modalClasses from "../../../styles/modalClasses.module.css";
import { findUser } from "../../utils/helpers";
import { ALERT_OTHER } from "../../control/config";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../control/initFirebase";
import { useDispatch } from "react-redux";
import { fridgeActions } from "../../../store/index";
import { useEffect } from "react";
import { Modal, Fade } from "@material-ui/core";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { recipeValidationSchema } from "../../control/validationSchema";
import InputError from "../../InputError";
import IngredientInputs from "./IngredientInputs";

function AddRecipeModal(props) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(recipeValidationSchema),
  });
  const { fields, append, remove } = useFieldArray({
    name: "ingredients",
    control,
  });
  const numberOfIngredients = watch("numberOfIngredients");
  const foundUser = findUser();
  const dispatch = useDispatch();

  useEffect(() => {
    const newVal = parseInt(numberOfIngredients || 0);
    const oldVal = fields.length;
    if (newVal > oldVal) {
      for (let i = oldVal; i < newVal; i++) {
        append({ ingName: "" });
      }
    } else {
      for (let i = oldVal; i > newVal; i--) {
        remove(i - 1);
      }
    }
  }, [numberOfIngredients]);

  const addRecipeModalOnCloseHandler = () => {
    props.setShowAddRecipeModal(false);
    reset();
  };

  const submitAddRecipeHandler = async (data) => {
    try {
      const docRef = doc(db, "users", foundUser.id);
      const ingredientsArray = data.ingredients.map((ing) => ing.ingName);

      const recipeObj = {
        name: data.recipeName,
        servings: data.recipeServings,
        time: data.recipeTime,
        difficulty: data.recipeDifficulty,
        url: data.recipeImgURL,
        ingredients: ingredientsArray,
        id: foundUser.recipesId,
        description: "",
      };

      const payload = {
        username: foundUser.username,
        recipesId: foundUser.recipesId + 1,
        foodId: foundUser.foodId,
        totalQuantity: foundUser.totalQuantity,
        totalWeight: foundUser.totalWeight,
        recipes: [...foundUser.recipes, recipeObj],
        food: foundUser.food,
      };

      await setDoc(docRef, payload);

      dispatch(
        fridgeActions.addRecipe({ username: foundUser.username, ...recipeObj })
      );

      props.setShowAddRecipeModal(false);
      reset();
    } catch (err) {
      alert(ALERT_OTHER);
      console.error(err);
    }
  };

  const addRecipeModal = (
    <form
      className={modalClasses.main}
      onSubmit={handleSubmit(submitAddRecipeHandler)}
    >
      <div>
        <label>Name </label>
        <input {...register("recipeName")} />
        {errors.recipeName && (
          <InputError errorMessage={errors.recipeName?.message} />
        )}
      </div>
      <div>
        <label>Servings </label>
        <input {...register("recipeServings")} type="number" min="1" />
        {errors.recipeServings && (
          <InputError errorMessage={errors.recipeServings?.message} />
        )}
      </div>
      <div>
        <label>Time(min) </label>
        <input {...register("recipeTime")} type="number" min="0" />
        {errors.recipeTime && (
          <InputError errorMessage={errors.recipeTime?.message} />
        )}
      </div>
      <div>
        <label>Difficulty </label>
        <select {...register("recipeDifficulty")} defaultValue={"DEFAULT"}>
          <option value="DEFAULT" disabled hidden>
            Choose here
          </option>
          <option>easy</option>
          <option>medium</option>
          <option>hard</option>
        </select>
        {errors.recipeDifficulty && (
          <InputError errorMessage={errors.recipeDifficulty?.message} />
        )}
      </div>
      <div>
        <label>Image URL </label>
        <input type="url" {...register("recipeImgURL")} />
      </div>
      <IngredientInputs register={register} errors={errors} fields={fields} />
      <div className={modalClasses.btn_container}>
        <button>Confirm</button>
      </div>
    </form>
  );
  return (
    <Modal
      open={props.showAddRecipeModal}
      onClose={addRecipeModalOnCloseHandler}
    >
      <Fade in={props.showAddRecipeModal}>{addRecipeModal}</Fade>
    </Modal>
  );
}

export default AddRecipeModal;
