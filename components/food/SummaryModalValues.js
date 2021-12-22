import { Fragment } from "react";
import { TYPES } from "../control/config";

function SummaryModalValues(props) {
  const countTypeValues = (type) => {
    let quantity = 0;
    let weight = 0;

    const filteredArr = props.rows?.filter((ele) => {
      return ele.type === type;
    });
    
    filteredArr?.forEach((arr) => {
      quantity += +arr.quantity;
      weight += +arr.weight.match(/\d+/)[0];
    });

    return `Quantity: ${quantity}, Weight: ${weight}`;
  };

  return TYPES.map((type) => {
    return (
      <Fragment key={type}>
        <h4>{type}</h4>
        <p>{countTypeValues(type)}</p>
      </Fragment>
    );
  });
}

export default SummaryModalValues;
