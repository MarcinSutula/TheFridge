import modalClasses from "../../../styles/modalClasses.module.css";
import { useEffect } from "react";
import { findUser } from "../../utils/helpers";
import { TYPES } from "../../control/config";
import { useDispatch } from "react-redux";
import { fridgeActions } from "../../../store/index";
import { Modal, Fade } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { foodValidationSchema } from "../../control/validationSchema";
import InputError from "../../InputError";

function EditFoodModal(props) {
  const defaultValues = {
    foodName: props.row.name,
    foodType: props.row.type,
    foodQuantity: props.row.quantity,
    foodWeight: props.row.weight,
    foodExpDate: props.row.expDate,
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(foodValidationSchema), defaultValues });
  const dispatch = useDispatch();
  const foundUser = findUser();
  const foodToEdit = props.row;

  useEffect(() => {
    if (foodToEdit) {
      reset({
        foodName: props.row.name,
        foodType: props.row.type,
        foodQuantity: props.row.quantity,
        foodWeight: props.row.weight,
        foodExpDate: props.row.expDate,
      });
    }
  }, [foodToEdit]);

  const editFoodModalOnCloseHandler = () => {
    props.setShowEditFoodModal(false);
    reset();
  };

  const submitEditFoodHandler = async (data) => {
    dispatch(
      fridgeActions.editFood({
        user: foundUser,
        food: data,
        prevFood: props.row,
      })
    );

    props.setShowEditFoodModal(false);
    reset();
  };
  const editFoodModal = (
    <form
      className={modalClasses.main}
      onSubmit={handleSubmit(submitEditFoodHandler)}
    >
      <div>
        <div>
          <label>Name</label>
          <input {...register("foodName")} />
          {errors.foodName && (
            <InputError errorMessage={errors.foodName?.message} />
          )}
        </div>
        <div>
          <label>Type</label>
          <select {...register("foodType")}>
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
          <label>Quantity</label>
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
          <label>Expiration Date</label>
          <input type="date" {...register("foodExpDate")} />
        </div>
      </div>
      <div className={modalClasses.btn_container}>
        <button>Confirm</button>
      </div>
    </form>
  );

  return (
    <Modal open={props.showEditFoodModal} onClose={editFoodModalOnCloseHandler}>
      <Fade in={props.showEditFoodModal}>{editFoodModal}</Fade>
    </Modal>
  );
}

export default EditFoodModal;
