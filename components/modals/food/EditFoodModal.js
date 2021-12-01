import modalClasses from "../../../styles/modalClasses.module.css";
import {
  getNumberFromStr,
  maxLengthCheck,
  findUser,
} from "../../utils/helpers";
import {
  QUANTITY_MAX_LENGTH,
  WEIGHT_MAX_LENGTH,
  FOODNAME_MAX_LENGTH,
  TYPES,
  WEIGHT_REGEX,
} from "../../control/config";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../control/initFirebase";
import { useDispatch } from "react-redux";
import { fridgeActions } from "../../../store/index";
import { useRef } from "react";
import { Modal, Fade } from "@material-ui/core";

function EditFoodModal(props) {
  const dispatch = useDispatch();
  const editFoodName = useRef();
  const editFoodType = useRef();
  const editFoodQuantity = useRef();
  const editFoodWeight = useRef();
  const editFoodExpDate = useRef();
  const foundUser = findUser();

  const editFoodModalOnCloseHandler = () => {
    props.setShowEditFoodModal(false);
  };

  const submitEditFoodHandler = async (e) => {
    e.preventDefault();

    try {
      const foodObj = {
        username: foundUser.username,
        id: props.row.id,
        foodId: foundUser.foodId,
        name: editFoodName.current.value,
        type: editFoodType.current.value,
        quantity: editFoodQuantity.current.value,
        weight: editFoodWeight.current.value,
        expDate: editFoodExpDate.current.value,
        key: props.row.key,
      };

      const foodCopy = [...foundUser.food];
      const foundUserFoodIndex = foodCopy.findIndex(
        (ele) => +ele.id === +props.row.id
      );

      foodCopy[foundUserFoodIndex] = {
        name: editFoodName.current.value,
        type: editFoodType.current.value,
        quantity: editFoodQuantity.current.value,
        weight: editFoodWeight.current.value,
        expDate: editFoodExpDate.current.value,
        id: props.row.id,
        key: props.row.key,
      };

      const payload = {
        username: foundUser.username,
        recipesId: foundUser.recipesId,
        foodId: foundUser.foodId,
        totalWeight:
          foundUser.totalWeight -
          getNumberFromStr(props.row.weight) +
          getNumberFromStr(editFoodWeight.current.value),
        totalQuantity:
          foundUser.totalQuantity -
          props.row.quantity +
          +editFoodQuantity.current.value,
        food: foodCopy,
        recipes: foundUser.recipes,
      };

      if (
        editFoodName.current.value.trim().length < 1 ||
        editFoodType.current.value === "DEFAULT" ||
        +editFoodQuantity.current.value < 0 ||
        editFoodQuantity.current.value.trim().length < 1
      ) {
        alert("Values other than Expiration Date must not be empty");
        return;
      } else if (!foodCopy[foundUserFoodIndex].weight.match(WEIGHT_REGEX)) {
        alert("Weight must be inserted as: amount,measure   i.e: 100ml,water");
        return;
      }

      const docRef = doc(db, "users", foundUser.id);
      await setDoc(docRef, payload);
      dispatch(fridgeActions.editFood(foodObj));

      editFoodName.current.value = "";
      editFoodType.current.value = "";
      editFoodQuantity.current.value = "";
      editFoodWeight.current.value = "";
      editFoodExpDate.current.value = "";
      props.setShowEditFoodModal(false);
    } catch (err) {
      alert("Something went wrong ! Please try again");
      console.error(err);
    }
  };
  const editFoodModal = (
    <form className={modalClasses.main} onSubmit={submitEditFoodHandler}>
      <div>
        <div key={props?.row?.name}>
          <label>Name</label>
          <input
            defaultValue={props?.row?.name}
            ref={editFoodName}
            type="text"
            autoFocus={true}
            maxLength={FOODNAME_MAX_LENGTH}
            required
          />
        </div>
        <div key={props?.row?.type}>
          <label>Type</label>
          <select
            name="typelistEditFood"
            id="typelistEditFood"
            ref={editFoodType}
            defaultValue={props?.row?.type}
            required
          >
            {TYPES.map((type) => {
              return (
                <option key={type} value={type}>
                  {type}
                </option>
              );
            })}
          </select>
        </div>
        <div key={props?.row?.quantity * Math.random()}>
          <label>Quantity</label>
          <input
            defaultValue={props?.row?.quantity}
            ref={editFoodQuantity}
            type="number"
            min="0"
            maxLength={QUANTITY_MAX_LENGTH}
            onInput={maxLengthCheck}
            required
          />
        </div>
        <div key={props?.row?.weight}>
          <label>Weight</label>
          <input
            defaultValue={props?.row?.weight}
            ref={editFoodWeight}
            type="text"
            maxLength={WEIGHT_MAX_LENGTH}
            placeholder="100ml, 50g, 5ts, 2kg etc."
            required
          />
        </div>
        <div key={props?.row?.expDate * Math.random()}>
          <label>Expiration Date</label>
          <input
            type="date"
            defaultValue={props?.row?.expDate}
            ref={editFoodExpDate}
          />
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
