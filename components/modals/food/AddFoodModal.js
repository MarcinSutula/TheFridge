import modalClasses from "../../../styles/modalClasses.module.css";
import { fridgeActions } from "../../../store/index";
import { fetchFirestoreData, getFoodPayload } from "../../control/initFirebase";
import { getNumberFromStr, findUser } from "../../utils/helpers";
import { Modal, Fade } from "@material-ui/core";
import { TYPES, ALERT_OTHER } from "../../control/config";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { foodValidationSchema } from "../../control/validationSchema";
import InputError from "../../InputError";

function AddFoodModal(props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(foodValidationSchema) });
  const foundUser = findUser();
  const dispatch = useDispatch();

  const addFoodModalOnCloseHandler = () => {
    props.setShowAddFoodModal(false);
    reset();
  };

  const submitAddFoodHandler = async (data) => {
    try {
      const foodObj = {
        id: foundUser.id,
        foodId: foundUser.foodId,
        username: foundUser.username,
        name: data.foodName,
        type: data.foodType,
        quantity: data.foodQuantity,
        weight: data.foodWeight,
        expDate: data.foodExpDate,
        key: foundUser.foodId,
      };

      // const payload = {
      //   username: foundUser.username,
      //   recipesId: foundUser.recipesId,
      //   foodId: foundUser.foodId + 1,
      //   totalQuantity: foundUser.totalQuantity + +data.foodQuantity,
      //   totalWeight: foundUser.totalWeight + getNumberFromStr(data.foodWeight),
      //   recipes: foundUser.recipes,
      //   food: [
      //     ...foundUser.food,
      //     {
      //       name: data.foodName,
      //       type: data.foodType,
      //       quantity: data.foodQuantity,
      //       weight: data.foodWeight,
      //       expDate: data.foodExpDate,
      //       key: foundUser.foodId,
      //       id: foundUser.foodId,
      //     },
      //   ],
      // };
      // const payload = {
      //   name: data.foodName,
      //   type: data.foodType,
      //   quantity: data.foodQuantity,
      //   weight: data.foodWeight,
      //   expDate: data.foodExpDate,
      //   key: foundUser.foodId,
      //   id: foundUser.foodId,
      // };

      await fetchFirestoreData(
        foundUser.id,
        "uptade",
        getFoodPayload("add", foundUser, data)
      );

      dispatch(fridgeActions.addFood(foodObj));
      props.setShowAddFoodModal(false);
      reset();
    } catch (err) {
      alert(ALERT_OTHER);
      console.error(err);
    }
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
