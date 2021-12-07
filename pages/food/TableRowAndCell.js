import { TableCell, TableRow, Fade } from "@material-ui/core";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { fridgeActions } from "../../store/index";
import classes from "./TableRowAndCell.module.css";
import {
  COLOR_EXPIRED,
  COLOR_ABOUT_TO_EXPIRE,
  COLOR_VALID,
  MINDAYS_TO_SHOW_RED_EXPDATE,
} from "../../components/control/config";
import { setBackgroundColor, findUser } from "../../components/utils/helpers";
import {
  EditFoodIcon,
  AddtoListIcon,
  RemoveFoodIcon,
} from "../../components/utils/icons";
import EditFoodModal from "../../components/modals/food/EditFoodModal";

function TableRowAndCell(props) {
  const [showEditFoodModal, setShowEditFoodModal] = useState(false);
  const dispatch = useDispatch();
  const foundUser = findUser();

  const checkExpDateStyle = (date) => {
    const formattedDate = new Date(date);
    const now = new Date();
    const dayInMs = 86400000;
    const daysToExpire = (formattedDate - now) / dayInMs;
    let expDateStyle;

    if (daysToExpire < 0) {
      expDateStyle = [COLOR_EXPIRED, "700"];
    } else if (
      daysToExpire >= 0 &&
      daysToExpire <= MINDAYS_TO_SHOW_RED_EXPDATE
    ) {
      expDateStyle = [COLOR_ABOUT_TO_EXPIRE, "700"];
    } else {
      expDateStyle = [COLOR_VALID, "500"];
    }

    return expDateStyle;
  };

  const showCorrectDate = (date) => {
    if (!date) return "";
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  };

  const removeFoodHandler = async (e) => {
    e.preventDefault();

    dispatch(
      fridgeActions.removeFood({
        user: foundUser,
        food: props.row,
      })
    );
  };

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
                        editFoodModalOpen={() => setShowEditFoodModal(true)}
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
        <EditFoodModal
          showEditFoodModal={showEditFoodModal}
          setShowEditFoodModal={setShowEditFoodModal}
          row={props.row}
        />
      </TableRow>
    </Fade>
  );
}

export default TableRowAndCell;
