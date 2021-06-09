import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";
import classNames from "classnames";

import styles from "../styles/FooterStyles.js";

class Footer extends Component {
  render() {
    const { classes } = this.props;
    return (
      <footer className={classes.footer}>
        <a
          href="https://selfregistration.cowin.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
          className={classNames(classes.btn, classes.github)}
        >
          Register for Vaccination
        </a>
        <a
          href="https://www.google.com/search?tbs=lf:1&tbm=lcl&sxsrf=ALeKk03Rahyt9PiLC-YP8POWIMTpx485Qg:1620742282739&q=covid+19+vaccination&rflfq=1&num=10&ved=2ahUKEwi0yqPA58HwAhUDX30KHe3BCCEQtgN6BAh8EAw#rlfi=hd:;si:;mv:[[22.654711333242787,88.51744795434568],[22.564067235609215,88.35505629174803],null,[22.6093967494572,88.43625212304686],13]"
          target="_blank"
          rel="noopener noreferrer"
          className={classNames(classes.btn, classes.twitter)}
        >
          Where to get it
        </a>
      </footer>
    );
  }
}
export default withStyles(styles)(Footer);
