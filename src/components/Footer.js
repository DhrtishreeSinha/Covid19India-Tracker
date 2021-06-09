import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";
import classNames from "classnames";

import styles from "../styles/FooterStyles.js";

class Footer extends Component {
  render() {
    const { classes } = this.props;
    return (
      <footer className={classes.footer}>
        <h3>Made by Dhritishree Sinha and Vedansh Choudhary</h3>
        {/* <a
          href="https://selfregistration.cowin.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
          className={classNames(classes.btn, classes.github)}
        >
          Register for Vaccination
        </a> */}
        {/* <a
          href="https://www.wbhealth.gov.in/pages/corona/vaccination_for_aged_and_comorbid"
          target="_blank"
          rel="noopener noreferrer"
          className={classNames(classes.btn, classes.github)}
        >
          Where to get it
        </a> */}
        {/* <a
          href="https://twitter.com/intent/tweet?text=Get the latest Covid-19 updates with Covid-19 India Tracker!&url=https://covidindiatracker.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className={classNames(classes.btn, classes.twitter)}
        >
          Share on Twitter
        </a>
        <a
          href="https://github.com/PrinceSumberia/covid-19-tracker/issues/new"
          target="_blank"
          rel="noopener noreferrer"
          className={classNames(classes.btn, classes.issue)}
        >
          Report an Issue
        </a> */}
      </footer>
    );
  }
}
export default withStyles(styles)(Footer);
