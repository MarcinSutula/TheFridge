import {
  getNumberFromStr,
  sortDateHelper,
  strTrimToLwrCase,
} from "../../components/utils/helpers";
import { COLUMNS } from "../../components/control/config";
import { findUserRdx, sortingReturn } from "../../components/utils/helpers";
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
 

  state.sortDirection =
    state.sortedField === clickedColumn.id
      ? invertDirection[state.sortDirection]
      : "asc";
  state.sortedField = clickedColumn.id;

  foundUser.food.sort((a, b) => {
    switch (state.sortedField) {
      case "quantity":
        if (+a[state.sortedField] > +b[state.sortedField]) {
          return sortingReturn(state.sortDirection);
        } else if (+a[state.sortedField] < +b[state.sortedField]) {
          return sortingReturn(state.sortDirection, true);
        } else {
          return 0;
        }
      case "weight":
        if (
          getNumberFromStr(a[state.sortedField]) >
          getNumberFromStr(b[state.sortedField])
        ) {
          return sortingReturn(state.sortDirection);
        } else if (
          getNumberFromStr(a[state.sortedField]) <
          getNumberFromStr(b[state.sortedField])
        ) {
          return sortingReturn(state.sortDirection, true);
        } else {
          return 0;
        }
      case "expDate":
        if (
          sortDateHelper(a[state.sortedField]) >
          sortDateHelper(b[state.sortedField])
        ) {
          return sortingReturn(state.sortDirection);
        } else if (
          sortDateHelper(a[state.sortedField]) <
          sortDateHelper(b[state.sortedField])
        ) {
          return sortingReturn(state.sortDirection, true);
        } else {
          return 0;
        }
      default:
        if (
          strTrimToLwrCase(a[state.sortedField]) >
          strTrimToLwrCase(b[state.sortedField])
        ) {
          return sortingReturn(state.sortDirection);
        } else if (
          strTrimToLwrCase(a[state.sortedField]) <
          strTrimToLwrCase(b[state.sortedField])
        ) {
          return sortingReturn(state.sortDirection, true);
        } else {
          return 0;
        }
    }
  });
}
