import { TableCell } from "@material-ui/core";
import { useSelector } from "react-redux";
import classes from "./TableHeadRowCells.module.css";
import {
  sortArrowDownIcon,
  sortArrowUpIcon,
} from "../../components/utils/icons";
import { findUser } from "../../components/utils/helpers";
import useMatchMedia from "react-use-match-media";
import {
  table_head_cell_mui,
  table_head_cell_mui_MQ,
} from "../../styles/materialUI";

function TableHeadRowCells(props) {
  const fridgeSortedField = useSelector((state) => state.sortedField);
  const fridgeSortDirection = useSelector((state) => state.sortDirection);
  const foundUser = findUser();
  const phoneWidth = useMatchMedia("(max-width: 480px)");

  const sortIcon =
    foundUser?.food?.length > 0 &&
    fridgeSortedField === props?.column?.id &&
    (fridgeSortDirection === "asc" ? sortArrowDownIcon : sortArrowUpIcon);

  return (
    <TableCell
      onClick={props.sortByColumnHandler}
      key={props?.column?.id}
      style={
        phoneWidth
          ? table_head_cell_mui_MQ(props?.column?.id)
          : table_head_cell_mui(props?.column?.id)
      }
    >
      <div className={classes.icon_container}>{sortIcon}</div>
      <div id={props?.column?.id}>{props?.column?.label}</div>
    </TableCell>
  );
}

export default TableHeadRowCells;
