import {
  getNumberFromStr,
  sortDateHelper,
} from "../../components/utils/helpers";
import { COLUMNS } from "../../components/control/config";
import { findUserRdx } from "../../components/utils/helpers";
const invertDirection = {
  asc: "desc",
  desc: "asc",
};

export function sortByColumn(state, action) {
  const clickedColumn = COLUMNS.find(
    (column) => column.id === action.payload.columnId
  );

  if (!clickedColumn?.id || clickedColumn?.id === "action") {
    return;
  }
  const foundUser = findUserRdx(state, action);
  if (!foundUser) return;
  
  state.sortDirection =
    state.sortedField === clickedColumn.id
      ? invertDirection[state.sortDirection]
      : "asc";
  state.sortedField = clickedColumn.id;

  foundUser.food.sort((a, b) => {
    if (state.sortedField === "quantity") {
      if (+a[state.sortedField] > +b[state.sortedField]) {
        return state.sortDirection === "asc" ? 1 : -1;
      } else if (+a[state.sortedField] < +b[state.sortedField]) {
        return state.sortDirection === "asc" ? -1 : 1;
      } else {
        return 0;
      }
    } else if (state.sortedField === "weight") {
      if (
        getNumberFromStr(a[state.sortedField]) >
        getNumberFromStr(b[state.sortedField])
      ) {
        return state.sortDirection === "asc" ? 1 : -1;
      } else if (
        getNumberFromStr(a[state.sortedField]) <
        getNumberFromStr(b[state.sortedField])
      ) {
        return state.sortDirection === "asc" ? -1 : 1;
      } else {
        return 0;
      }
    } else if (state.sortedField === "expDate") {
      if (
        sortDateHelper(a[state.sortedField]) >
        sortDateHelper(b[state.sortedField])
      ) {
        return state.sortDirection === "asc" ? 1 : -1;
      } else if (
        sortDateHelper(a[state.sortedField]) <
        sortDateHelper(b[state.sortedField])
      ) {
        return state.sortDirection === "asc" ? -1 : 1;
      } else {
        return 0;
      }
    } else {
      if (a[state.sortedField] > b[state.sortedField]) {
        return state.sortDirection === "asc" ? 1 : -1;
      } else if (a[state.sortedField] < b[state.sortedField]) {
        return state.sortDirection === "asc" ? -1 : 1;
      } else {
        return 0;
      }
    }
  });
}
