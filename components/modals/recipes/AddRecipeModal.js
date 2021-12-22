import modalClasses from "../../../styles/modalClasses.module.css";
import { FindUser } from "../../utils/helpers";
import { useDispatch } from "react-redux";
import { fridgeActions } from "../../../store/index";
import { useEffect } from "react";
import { Modal, Fade } from "@material-ui/core";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { recipeValidationSchema } from "../../control/input validation/recipeValidationSchema";
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
  const foundUser = FindUser();
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

  const submitAddRecipeHandler = (data) => {
    dispatch(
      fridgeActions.addRecipe({
        user: foundUser,
        recipe: data,
      })
    );

    props.setShowAddRecipeModal(false);
    reset();
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
