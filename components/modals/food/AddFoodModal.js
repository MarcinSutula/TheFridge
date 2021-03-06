import modalClasses from "../../../styles/modalClasses.module.css";
import { fridgeActions } from "../../../store/index";
import { FindUser } from "../../utils/helpers";
import { Modal, Fade } from "@material-ui/core";
import { TYPES } from "../../control/config";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { foodValidationSchema } from "../../control/input validation/foodValidationSchema";
import InputError from "../../InputError";

function AddFoodModal(props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(foodValidationSchema) });
  const foundUser = FindUser();
  const dispatch = useDispatch();

  const addFoodModalOnCloseHandler = () => {
    props.setShowAddFoodModal(false);
    reset();
  };

  const submitAddFoodHandler = (data) => {
    dispatch(fridgeActions.addFood({ user: foundUser, food: data }));
    props.setShowAddFoodModal(false);
    reset();
  };

  const addFoodModal = (
    <form
      className={modalClasses.main}
      onSubmit={handleSubmit(submitAddFoodHandler)}
    >
      <div>
        <label>Name </label>
        <input {...register("foodName")} />
        {errors.foodName && (
          <InputError errorMessage={errors.foodName?.message} />
        )}
      </div>
      <div>
        <label>Type </label>
        <select {...register("foodType")} defaultValue={"DEFAULT"}>
          <option value="DEFAULT" disabled hidden>
            Choose here
          </option>
          {TYPES.map((type) => {
            return (
              <option key={type} value={type}>
                {type}
              </option>
            );
          })}
        </select>
        {errors.foodType && (
          <InputError errorMessage={errors.foodType?.message} />
        )}
      </div>
      <div>
        <label>Quantity </label>
        <input type="number" min="0" {...register("foodQuantity")} />
        {errors.foodQuantity && (
          <InputError errorMessage={errors.foodQuantity?.message} />
        )}
      </div>
      <div>
        <label>Weight</label>
        <input
          {...register("foodWeight")}
          placeholder="100ml, 50g, 5ts, 2kg etc."
        />
        {errors.foodWeight && (
          <InputError errorMessage={errors.foodWeight?.message} />
        )}
      </div>
      <div>
        <label>Expiration Date </label>
        <input type="date" {...register("foodExpDate")} />
      </div>
      <div className={modalClasses.btn_container}>
        <button>Confirm</button>
      </div>
    </form>
  );

  return (
    <Modal open={props.showAddFoodModal} onClose={addFoodModalOnCloseHandler}>
      <Fade in={props.showAddFoodModal}>{addFoodModal}</Fade>
    </Modal>
  );
}

export default AddFoodModal;
