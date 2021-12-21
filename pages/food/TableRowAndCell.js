import { TableCell, TableRow, Fade } from "@material-ui/core";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { fridgeActions } from "../../store/index";
import classes from "./TableRowAndCell.module.css";
import { COLOR_ABOUT_TO_EXPIRE } from "../../components/control/config";
import {
  findUser,
  checkExpDateStyle,
  showCorrectDate,
} from "../../components/utils/helpers";
import {
  EditFoodIcon,
  AddtoListIcon,
  RemoveFoodIcon,
} from "../../components/utils/icons";
import EditFoodModal from "../../components/modals/food/EditFoodModal";
import AddFoodToShopListModal from "../../components/modals/food/AddFoodToShopListModal";
import useMatchMedia from "react-use-match-media";
import {
  table_row_mui,
  table_cell_mui,
  table_cell_mui_MQ,
} from "../../styles/materialUI";

function TableRowAndCell(props) {
  const [showEditFoodModal, setShowEditFoodModal] = useState(false);
  const [showAddFoodToShopListModal, setShowAddFoodToShopListModal] =
    useState(false);
  const dispatch = useDispatch();
  const foundUser = findUser();
  const phoneWidth = useMatchMedia("(max-width: 480px)");

  const removeFoodHandler = (e) => {
    e.preventDefault();

    dispatch(
      fridgeActions.removeFood({
        user: foundUser,
        food: props.row,
      })
    );
  };

  const editFoodIconClickHandler = () => {
    setShowEditFoodModal(true);
  };

  const addFoodToShopListHandler = () => {
    setShowAddFoodToShopListModal(true);
  };

  return (
    <Fade in={!!foundUser}>
      <TableRow tabIndex={-1} style={table_row_mui(props?.row?.type)}>
        {props?.columns?.map((column) => {
          const value = props.row[column.id];

          return (
            <TableCell
              key={column.id}
              style={
                phoneWidth
                  ? table_cell_mui_MQ(column, value)
                  : table_cell_mui(column, value)
              }
            >
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
                      <AddtoListIcon onClick={addFoodToShopListHandler} />
                    </div>
                    <div className={classes.icon}>
                      <EditFoodIcon
                        editFoodModalOpen={editFoodIconClickHandler}
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
        <AddFoodToShopListModal
          showAddFoodToShopListModal={showAddFoodToShopListModal}
          setShowAddFoodToShopListModal={setShowAddFoodToShopListModal}
          row={props.row}
        />
      </TableRow>
    </Fade>
  );
}

export default TableRowAndCell;
