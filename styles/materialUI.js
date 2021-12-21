import {
  setBackgroundColor,
  checkExpDateStyle,
} from "../components/utils/helpers";

//food/index.js

export const table_paper_mui = {
  position: "absolute",
  left: "2.5%",
  top: "10%",
  minWidth: "1000px",
  width: "95%",
  marginBottom: 0,
  boxShadow: "0 40px 60px 0 rgb(0, 0, 0, 0.35)",
  borderRadius: "15px",
  overflow: "hidden",
};

export const table_container_mui = {
  maxHeight: "760px",
};

export const table_paper_mui_MQ = {
  position: "absolute",
  left: "2.5%",
  top: "10%",
  minWidth: "250px",
  width: "95%",
  marginBottom: 0,
  boxShadow: "0 10px 20px 0 rgb(0, 0, 0, 0.35)",
  borderRadius: "15px",
  overflow: "hidden",
};

export const table_container_mui_MQ = {
  maxHeight: "640px",
};

//food/TableHeadRiwCells.js

export const table_head_cell_mui = (columnId) => {
  return {
    userSelect: "none",
    backgroundColor: "#004d3e1f",
    borderBottom: "3px solid #01c09af8",
    fontSize: 22,
    fontWeight: 700,
    color: "#050f16d8",
    fontFamily: "Open Sans",
    cursor: columnId === "action" ? "inherit" : "pointer",
  };
};

export const table_head_cell_mui_MQ = (columnId) => {
  return {
    userSelect: "none",
    backgroundColor: "#004d3e1f",
    borderBottom: "2px solid #01c09af8",
    fontSize: 18,
    fontWeight: 600,
    color: "#050f16d8",
    fontFamily: "Open Sans",
    cursor: columnId === "action" ? "inherit" : "pointer",
  };
};

//food/TableRowAndCell.js

export const table_row_mui = (type) => {
  return { backgroundColor: setBackgroundColor(type) };
};

export const table_cell_mui = (column, value) => {
  return {
    fontSize: column.id === "name" ? 22 : 20,
    color: column.id === "expDate" ? checkExpDateStyle(value)[0] : "#050f16d8",
    fontFamily: "Open Sans",
    fontWeight: column.id === "expDate" ? checkExpDateStyle(value)[1] : "500",
  };
};

export const table_cell_mui_MQ = (column, value) => {
  return {
    fontSize: column.id === "name" ? 16 : 14,
    color:
      column.id === "expDate" ? checkExpDateStyle(value, true)[0] : "#050f16d8",
    fontFamily: "Open Sans",
    fontWeight:
      column.id === "expDate" ? checkExpDateStyle(value, true)[1] : "500",
  };
};
