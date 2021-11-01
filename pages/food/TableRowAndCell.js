import { TableCell, TableRow, Modal, Fade } from "@material-ui/core";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fridgeActions } from "../../store/index";
import modalClasses from "../../styles/modalClasses.module.css";
import classes from "./TableRowAndCell.module.css";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../components/control/initFirebase";
import {
  QUANTITY_MAX_LENGTH,
  WEIGHT_MAX_LENGTH,
  FOODNAME_MAX_LENGTH,
  COLOR_EXPIRED,
  COLOR_ABOUT_TO_EXPIRE,
  COLOR_VALID,
  TYPES,
  MINDAYS_TO_SHOW_RED_EXPDATE,
} from "../../components/control/config";
import {
  maxLengthCheck,
  setBackgroundColor,
} from "../../components/utils/helpers";
import {
  EditFoodIcon,
  AddtoListIcon,
  RemoveFoodIcon,
} from "../../components/utils/icons";

function TableRowAndCell(props) {
  const [showEditModal, setShowEditModal] = useState(false);
  const editFoodName = useRef();
  const editFoodType = useRef();
  const editFoodQuantity = useRef();
  const editFoodWeight = useRef();
  const editFoodExpDate = useRef();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const foundUser = users.find((user) => user.id !== null);

  const checkExpDateStyle = (date) => {
    const formattedDate = new Date(date);
    const now = new Date();
    const dayInMs = 86400000;
    const daysToExpire = (formattedDate - now) / dayInMs;

    if (daysToExpire < 0) {
      return [COLOR_EXPIRED, "700"];
    } else if (
      daysToExpire >= 0 &&
      daysToExpire <= MINDAYS_TO_SHOW_RED_EXPDATE
    ) {
      return [COLOR_ABOUT_TO_EXPIRE, "700"];
    } else {
      return [COLOR_VALID, "500"];
    }
  };

  const showCorrectDate = (date) => {
    if (!date) return "";
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  };

  //HANDLERS

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
        foodId: foundUser.foodId,
        totalWeight:
          foundUser.totalWeight -
          props.row.weight +
          +editFoodWeight.current.value,
        totalQuantity:
          foundUser.totalQuantity -
          props.row.quantity +
          +editFoodQuantity.current.value,
        food: foodCopy,
      };

      const docRef = doc(db, "users", foundUser.id);
      await setDoc(docRef, payload);
      dispatch(fridgeActions.editFood(foodObj));

      editFoodName.current.value = "";
      editFoodType.current.value = "";
      editFoodQuantity.current.value = "";
      editFoodWeight.current.value = "";
      editFoodExpDate.current.value = "";
      setShowEditModal(false);
    } catch (err) {
      alert("Something went wrong ! Please try again");
      console.error(err);
    }
  };

  const removeFoodHandler = async (e) => {
    e.preventDefault();

    try {
      const foodFiltered = foundUser.food.filter(
        (ele) => ele.id !== props.row.id
      );
      const payload = {
        username: foundUser.username,
        foodId: foundUser.foodId,
        totalWeight: foundUser.totalWeight - props.row.weight,
        totalQuantity: foundUser.totalQuantity - props.row.quantity,
        food: foodFiltered,
      };

      const docRef = doc(db, "users", foundUser.id);
      await setDoc(docRef, payload);

      dispatch(
        fridgeActions.removeFood({
          username: foundUser.username,
          foodToRemove: props.row,
        })
      );
    } catch (err) {
      alert("Something went wrong ! Please try again");
      console.error(err);
    }
  };

  ///MODALS (DO NOT CREATE THEM AS ANOTHER COMPONENT)

  const editModal = (
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
        <div key={props?.row?.weight * Math.random()}>
          <label>Weight(g)</label>
          <input
            defaultValue={props?.row?.weight}
            ref={editFoodWeight}
            type="number"
            min="0"
            maxLength={WEIGHT_MAX_LENGTH}
            onInput={maxLengthCheck}
            required
          />
        </div>
        <div key={props?.row?.expDate * Math.random()}>
          <label>Expiration Date</label>
          <input
            type="date"
            defaultValue={props?.row?.expDate}
            ref={editFoodExpDate}
            required
          />
        </div>
      </div>
      <div className={modalClasses.btn_container}>
        <button>Confirm</button>
      </div>
    </form>
  );

  //MUI STYLES
  const tableRowStyleMUI = {
    backgroundColor: setBackgroundColor(props?.row?.type),
  };

  const tableCellStyleMUI = (column, value) => {
    return {
      fontSize: column.id === "name" ? 22 : 20,
      color:
        column.id === "expDate" ? checkExpDateStyle(value)[0] : "#050f16d8",
      fontFamily: "Open Sans",
      fontWeight: column.id === "expDate" ? checkExpDateStyle(value)[1] : "500",
    };
  };

  return (
    <Fade in={!!foundUser}>
      <TableRow tabIndex={-1} style={tableRowStyleMUI}>
        {props?.columns?.map((column) => {
          const value = props.row[column.id];

          return (
            <TableCell key={column.id} style={tableCellStyleMUI(column, value)}>
              {
                //IF ITS EXPIRATION DATE COLUMN, SHOW CORRECTED DATE WITH CORRECTED STYLE
                column.id === "expDate" ? (
                  checkExpDateStyle(value)[0] === COLOR_ABOUT_TO_EXPIRE ? (
                    `! ${showCorrectDate(value)} !`
                  ) : (
                    showCorrectDate(value)
                  )
                ) : //IF ITS ACTION COLUMN, SHOW ACTION ICONS
                column.id === "action" ? (
                  <div className={classes.icon_container}>
                    <div className={classes.icon}>
                      <AddtoListIcon />
                    </div>
                    <div className={classes.icon}>
                      <EditFoodIcon
                        editModalOpen={() => setShowEditModal(true)}
                      />
                    </div>
                    <div className={classes.icon}>
                      <RemoveFoodIcon removeFoodHandler={removeFoodHandler} />
                    </div>
                  </div>
                ) : (
                  //ELSE SHOW VALUE
                  value
                )
              }
            </TableCell>
          );
        })}
        <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
          <Fade in={showEditModal}>{editModal}</Fade>
        </Modal>
      </TableRow>
    </Fade>
  );
}

export default TableRowAndCell;
