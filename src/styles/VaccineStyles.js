import sizes from "./sizes";
import colors from "../constants/colors";


export default {
  root: {
    textAlign: "center",
  },
  mainHeading: {
    marginBottom: "2rem",

    [sizes.down("md")]: {
      margin: "2rem",
    },
    [sizes.down("sm")]: {
      fontSize: "2rem",
    },
  },

  vaccineBody: {
    borderRadius: "4px",
  },

  goodnews: {
    backgroundColor: "rgb(219,85,129,.12549019607843137)",
    color: "#db5581",
    borderRadius: "2rem",
    padding: "1rem",
    maxWidth: "40%",
    justifyContent: "center",
    margin: "auto",
    fontSize: "1.5rem"
  },

  lmao: {
    backgroundColor: "white"
  },

  
  warning: {
    color: "rgb(249, 52, 94)",
    backgroundColor: "rgb(249, 52, 94,.15)",
    borderRadius: "10px"
  },

  facts: {
    color: "rgb(85, 181, 111)",
    backgroundColor: "rgb(85, 181, 111,.15)",
    borderRadius: "10px"
  },

  input: {
    fontFamily: "inherit",
    fontSize: "1.6rem",
    border: "none",
    padding: "1.5rem 3rem",
    width: "20%",
    borderRadius: "2.5rem",
    margin: "1.5rem",
    transition: "all .4s",


    [sizes.down("md")]: {
      width: "35%",
      fontSize: "1.4rem",
      padding: "1rem 2rem",
    },

    [sizes.down("xs")]: {},

    "&:focus": {
      width: "22%",
      outline: "none",

      [sizes.down("md")]: {
        width: "45%",
      },
    },

    "&::placeholder": {
      color: "#bbb",
    },
  },

  btn: {
    "&, &:active": {
      fontFamily: "inherit",
      fontSize: "1.4rem",
      padding: "1.5rem 2rem",
      backgroundColor: "#1A1053",
      color: "#fff",
      borderRadius: "2.5rem",
      border: "none",
      outline: "none",
      transition: "all .4s",
      transform: "translateY(-2px)",
      boxShadow: "0 .5rem 1rem rgba(0,0,0,0.2)",

      [sizes.down("md")]: {
        fontSize: "1.4rem",
        padding: "1rem 1.5rem",
      },
    },

    "&:hover": {
      backgroundColor: "#000",
      cursor: "pointer",
      transform: "translateY(0)",
      outline: "none",
    },
  },

  chartArea: {
    padding: "4rem",
    maxWidth: "100%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    // backgroundColor: "white",
    borderRadius: "2rem",
    margin: "4rem"
  },

};