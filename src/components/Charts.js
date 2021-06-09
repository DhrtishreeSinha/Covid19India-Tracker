import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import colors from "../constants/colors";

import styles from "../styles/ChartsStyles";

const tooltip = {
  backgroundColor: 'white',
  opacity: '0.8',
  borderRadius: '15px',			
  paddingLeft:'10px',
  paddingRight:'10px',
  }

const tooltipTitle = {
  fontWeight: "bold",
  fontSize: "1.8rem",
  color: colors.purple
}

const CustomTooltiptiny = ({ active, payload, label }) => {
  if (active) {
    return (
      <div className="custom-tooltip" style={tooltip}>
        <p className="label" style={tooltipTitle}>{`${label}`}</p>
        <p className="label" style={{color: colors.red, fontWeight: 'bold'}}>{`${payload[0].name} : ${payload[0].value.toLocaleString('en-IN')}`}</p>
        <p className="label" style={{color: colors.orange, fontWeight: 'bold'}}>{`${payload[1].name} : ${payload[1].value.toLocaleString('en-IN')}`}</p> 
        <p className="label" style={{color: colors.green, fontWeight: 'bold'}}>{`${payload[2].name} : ${payload[2].value.toLocaleString('en-IN')}`}</p>
        <p className="label" style={{color: "black", fontWeight: 'bold'}}>{`${payload[3].name} : ${payload[3].value.toLocaleString('en-IN')}`}</p>
      </div>
    );
  }
  return null;
}

class Charts extends Component {
  render() {
    const { data, classes } = this.props;
    let result;
    try {
      const updatedData = data.slice(1).slice(-50);
      result = updatedData.map((dataItem) => {
        let newObject = {};
        for (let [key, value] of Object.entries(dataItem)) {
          if (key === "date") {
            newObject[key] = value;
          } else {
            newObject[key] = Number(value);
          }
        }
        return {
          ...newObject,
          totalactive:
            newObject.totalconfirmed -
            (newObject.totalrecovered + newObject.totaldeceased),
        };
      });
    } catch (err) {}

    return (
      <div className={classes.charts}>
        <ResponsiveContainer>
          <LineChart
            width={600}
            height={300}
            data={result}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis dataKey="date" />
            <YAxis orientation="right" tickFormatter={tick => {return tick.toLocaleString("en-IN");}}/>
            <Tooltip content={<CustomTooltiptiny />}/>
            <Legend
              wrapperStyle={{
                margin: "-3rem 1rem",
              }}
            />
            <Line
              type="monotone"
              dataKey="totalconfirmed"
              stroke={colors.red}
              dot={false}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="totalactive"
              stroke={colors.orange}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="totalrecovered"
              stroke={colors.green}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="totaldeceased"
              stroke={colors.black}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default withStyles(styles)(Charts);
