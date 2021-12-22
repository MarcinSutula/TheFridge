import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@material-ui/core";
import { useState, useEffect } from "react";
import { fridgeActions } from "../../store/index";
import { useDispatch } from "react-redux";
import classes from "./food.module.css";
import TableRowAndCell from "../../components/food/TableRowAndCell";
import TableHeadRowCells from "../../components/food/TableHeadRowCells";
import withAuth from "../../components/control/withAuth";
import Spinner from "../../components/utils/Spinner";
import { FindUser } from "../../components/utils/helpers";
import {
  COLUMNS,
  INITIAL_ROWS_PER_PAGE,
  INITIAL_ROWS_PER_PAGE_PHONE,
} from "../../components/control/config";
import AddFoodModal from "../../components/modals/food/addFoodModal";
import SummaryModal from "../../components/modals/food/SummaryModal";
import useMatchMedia from "react-use-match-media";
import {
  table_container_mui,
  table_container_mui_MQ,
  table_paper_mui,
  table_paper_mui_MQ,
} from "../../styles/materialUI";

function MainTable() {
  const phoneWidth = useMatchMedia("(max-width: 480px)");
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(INITIAL_ROWS_PER_PAGE);
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const dispatch = useDispatch();
  const foundUser = FindUser();
  let rows;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setRowsPerPage(
      phoneWidth ? INITIAL_ROWS_PER_PAGE_PHONE : INITIAL_ROWS_PER_PAGE
    );
  }, [phoneWidth]);

  if (foundUser) {
    rows = foundUser.food;
    if (!mounted) return <Spinner big={true} />;
  } else {
    rows = [];
    return <Spinner big={true} />;
  }

  const sortByColumnHandler = (e) => {
    const clickedColumn = e.target.id;

    dispatch(
      fridgeActions.sortByColumn({
        user: foundUser,
        columnId: clickedColumn,
      })
    );
  };

  const addFoodBtnHandler = () => {
    setShowAddFoodModal(true);
  };

  const summaryBtnHandler = () => {
    setShowSummaryModal(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    mounted && (
      <div className={classes.background}>
        <div>
          <Paper style={phoneWidth ? table_paper_mui_MQ : table_paper_mui}>
            <TableContainer
              style={phoneWidth ? table_container_mui_MQ : table_container_mui}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    {COLUMNS.map((column) => (
                      <TableHeadRowCells
                        sortByColumnHandler={sortByColumnHandler}
                        column={column}
                        key={column.id}
                      />
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    .map((row) => {
                      return (
                        <TableRowAndCell
                          columns={COLUMNS}
                          row={row}
                          key={row.id}
                        />
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <div className={classes.btn_container}>
              <div>
                <button
                  className={classes.food_btn}
                  onClick={addFoodBtnHandler}
                >
                  Add Food
                </button>
                <button
                  className={classes.food_btn}
                  onClick={summaryBtnHandler}
                >
                  Summary
                </button>
              </div>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={rows ? rows.length : 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
            <AddFoodModal
              showAddFoodModal={showAddFoodModal}
              setShowAddFoodModal={setShowAddFoodModal}
            />
            <SummaryModal
              rows={rows}
              showSummaryModal={showSummaryModal}
              setShowSummaryModal={setShowSummaryModal}
            />
          </Paper>
        </div>
      </div>
    )
  );
}

export default withAuth(MainTable);
