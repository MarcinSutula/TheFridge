import { TableCell } from "@material-ui/core";
import { useSelector } from "react-redux";
import classes from "./TableHeadRowCells.module.css";
import {
  sortArrowDownIcon,
  sortArrowUpIcon,
} from "../../components/utils/icons";

function TableHeadRowCells(props) {
  const fridgeSortedField = useSelector((state) => state.sortedField);
  const fridgeSortDirection = useSelector((state) => state.sortDirection);
  const users = useSelector((state) => state.users);
  const foundUser = users.find((user) => user?.id !== '');

  const sortIcon =
    foundUser?.food?.length > 0 &&
    fridgeSortedField === props?.column?.id &&
    (fridgeSortDirection === "asc" ? sortArrowDownIcon : sortArrowUpIcon);

  //MUI STYLES

  const tableHeadCellStyleMUI = {
    userSelect: "none",
    backgroundColor: "#004d3e1f",
    borderBottom: "4px solid #01c09af8",
    fontSize: 22,
    fontWeight: 700,
    color: "#050f16d8",
    fontFamily: "Open Sans",
    cursor: props?.column?.id === "action" ? "inherit" : "pointer",
    borderTopLeftRadius: props?.column?.id === "id" ? "15px" : "0px",
    borderTopRightRadius: props?.column?.id === "action" ? "15px" : "0px",
  };

  return (
    <TableCell
      onClick={props.sortByColumnHandler}
      key={props?.column?.id}
      style={tableHeadCellStyleMUI}
      
    >
      <div className={classes.icon_container} >{sortIcon}</div>
      <div id={props?.column?.id}>{props?.column?.label}</div>
    </TableCell>
  );
}

export default TableHeadRowCells;
