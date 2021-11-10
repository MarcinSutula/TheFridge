export const COLUMNS = [
  { id: "id", label: "Id" },
  { id: "name", label: "Name" },
  { id: "type", label: "Type" },
  {
    id: "quantity",
    label: "Quantity",
    numeric: "true",
  },
  {
    id: "weight",
    label: "Weight(g)",
    numeric: "true",
  },
  {
    id: "expDate",
    label: "Expiration Date",
    numeric: "true",
  },
  {
    id: "action",
    label: "Action",
  },
];

export const TYPES = [
  "Protein",
  "Dairy",
  "Vegetables",
  "Fruits",
  "Drinks",
  "Other",
];

// Add/edit food config 

export const QUANTITY_MAX_LENGTH = 3;
export const WEIGHT_MAX_LENGTH = 4;
export const FOODNAME_MAX_LENGTH = 15;
export const INITIAL_ROWS_PER_PAGE = 10;
export const SIGNUP_TIMEOUT_TIME = 1500;
export const MINDAYS_TO_SHOW_RED_EXPDATE = 3;

// Add/edit recipe config

export const RECIPENAME_MAX_LENGTH = 25;
export const RECIPESERVINGS_MAX_LENGTH = 1;
export const RECIPETIME_MAX_LENGTH = 3;
export const RECIPEINGREDIENTS_MAX_LENGTH = 15;
export const RECIPEINGREDIENTS_MAX_AMOUNT_OF_INPUTS = 10;


//Row background colors

export const PROTEIN_COLOR = "#e16464"; //red
export const DAIRY_COLOR = "#ffe45e"; //yellow
export const VEGETABLES_COLOR = "#01c09af8"; //green
export const FRUITS_COLOR = "#c19a01"; //orange
export const DRINKS_COLOR = "#5a75e4"; //blue
export const OTHER_COLOR = "#f7f7f7"; //white

//Expiration date colors

export const COLOR_EXPIRED = "#5e0087"; //dark violet
export const COLOR_ABOUT_TO_EXPIRE = "#ff0000"; //red
export const COLOR_VALID = "#050f16d8"; //standard black
