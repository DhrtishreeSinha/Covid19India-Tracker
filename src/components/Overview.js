import React from "react";
import { withStyles } from "@material-ui/styles";

import DisplayPanels from "./DisplayPanels";

import styles from "../styles/OverviewStyles";

function Overview(props) {
  const { classes, isDarkMode } = props;
  const {
    active,
    confirmed,
    deaths,
    recovered,
    deltaconfirmed,
    deltadeaths,
    deltarecovered,
  } = props.data;

  const deltaActive =
    Number(deltaconfirmed) - (Number(deltadeaths) + Number(deltarecovered));

  return (
    <div className={classes.root}>
      <div className={classes.panels}>
        <div className={classes.panelContainer}>
          <DisplayPanels
            title="Confirmed"
            number={Number(confirmed).toLocaleString("en-IN")}
            isDarkMode={isDarkMode}
            dataChange={deltaconfirmed > 0 ? deltaconfirmed : "-"}
          />
        </div>
        <div className={classes.panelContainer}>
          <DisplayPanels
            title="Active"
            number={Number(active).toLocaleString("en-IN")}
            isDarkMode={isDarkMode}
            dataChange={deltaActive}
          />
        </div>
        <div className={classes.panelContainer}>
          <DisplayPanels
            title="Recovered"
            number={Number(recovered).toLocaleString("en-IN")}
            isDarkMode={isDarkMode}
            dataChange={deltarecovered}
          />
        </div>
        <div className={classes.panelContainer}>
          <DisplayPanels
            title="Deceased"
            number={Number(deaths).toLocaleString("en-IN")}
            isDarkMode={isDarkMode}
            dataChange={deltadeaths}
          />
        </div>
      </div>
      <div>
        
      </div>
    </div>
  );
}

export default withStyles(styles)(Overview);
