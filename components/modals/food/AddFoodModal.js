import modalClasses from "../../../styles/modalClasses.module.css";
import { fridgeActions } from "../../../store/index";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../control/initFirebase";
import {
  getNumberFromStr,
  maxLengthCheck,
  findUser,
} from "../../utils/helpers";
import { Modal, Fade } from "@material-ui/core";
import {
  QUANTITY_MAX_LENGTH,
  WEIGHT_MAX_LENGTH,
  FOODNAME_MAX_LENGTH,
  TYPES,
  WEIGHT_REGEX,
  ALERT_FOOD_EMPTY,
  ALERT_WEIGHT_FORMAT,
  ALERT_OTHER,
} from "../../control/config";
import { useRef } from "react";
import { useDispatch } from "react-redux";

function AddFoodModal(props) {
  const addFoodName = useRef();
  const addFoodType = useRef();
  const addFoodQuantity = useRef();
  const addFoodWeight = useRef();
  const addFoodExpDate = useRef();
  const foundUser = findUser();
  const dispatch = useDispatch();

  const addFoodModalOnCloseHandler = () => {
    props.setShowAddFoodModal(false);
  };

  const submitAddFoodHandler = async (e) => {
    try {
      e.preventDefault();
      if (
        addFoodName.current.value.trim().length < 1 ||
        addFoodType.current.value === "DEFAULT" ||
        +addFoodQuantity.current.value < 0 ||
        addFoodQuantity.current.value.trim().length < 1
      ) {
        alert(ALERT_FOOD_EMPTY);
        return;
      } else if (!addFoodWeight.current.value.match(WEIGHT_REGEX)) {
        alert(ALERT_WEIGHT_FORMAT);
        return;
      }

      const docRef = doc(db, "users", foundUser.id);
      const foodObj = {
        id: foundUser.id,
        foodId: foundUser.foodId,
        username: foundUser.username,
        name: addFoodName.current.value,
        type: addFoodType.current.value,
        quantity: addFoodQuantity.current.value,
        weight: addFoodWeight.current.value,
        expDate: addFoodExpDate.current.value,
        key: foundUser.foodId,
      };

      const payload = {
        username: foundUser.username,
        recipesId: foundUser.recipesId,
        foodId: foundUser.foodId + 1,
        totalQuantity: foundUser.totalQuantity + +addFoodQuantity.current.value,
        totalWeight:
          foundUser.totalWeight + getNumberFromStr(addFoodWeight.current.value),
        recipes: foundUser.recipes,
        food: [
          ...foundUser.food,
          {
            name: addFoodName.current.value,
            type: addFoodType.current.value,
            quantity: addFoodQuantity.current.value,
            weight: addFoodWeight.current.value,
            expDate: addFoodExpDate.current.value,
            key: foundUser.foodId,
            id: foundUser.foodId,
          },
        ],
      };

      await setDoc(docRef, payload);

      dispatch(fridgeActions.addFood(foodObj));
      addFoodName.current.value = "";
      addFoodType.current.value = "";
      addFoodQuantity.current.value = "";
      addFoodWeight.current.value = "";
      addFoodExpDate.current.value = "";
      props.setShowAddFoodModal(false);
    } catch (err) {
      alert(ALERT_OTHER);
      console.error(err);
    }
  };
  const addFoodModal = (
    <form className={modalClasses.main} onSubmit={submitAddFoodHandler}>
      <div>
        <label>Name </label>
        <input
          type="text"
          ref={addFoodName}
          autoFocus={true}
          maxLength={FOODNAME_MAX_LENGTH}
          required
        />
      </div>
      <div>
        <label>Type </label>
        <select
          name="typelistAddFood"
          id="typelistAddFood"
          defaultValue={"DEFAULT"}
          ref={addFoodType}
          required
        >
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
      </div>
      <div>
        <label>Quantity </label>
        <input
          type="number"
          ref={addFoodQuantity}
          maxLength={QUANTITY_MAX_LENGTH}
          min="0"
          onInput={maxLengthCheck}
          required
        />
      </div>
      <div>
        <label>Weight</label>
        <input
          type="text"
          ref={addFoodWeight}
          maxLength={WEIGHT_MAX_LENGTH}
          placeholder="100ml, 50g, 5ts, 2kg etc."
          required
        />
      </div>
      <div>
        <label>Expiration Date </label>
        <input type="date" ref={addFoodExpDate} />
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