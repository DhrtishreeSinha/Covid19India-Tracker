import React, { Component } from "react";
import { AreaChart, Bar, BarChart, Tooltip, XAxis, YAxis, Area } from "recharts";
import colors from "../constants/colors";

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
  color: "black"
}

const CustomTooltiptiny = ({ active, payload, label }) => {
  if (active) {
    return (
      <div className="custom-tooltip" style={tooltip}>
        <p className="label" style={tooltipTitle}>{`${label}`}</p>
        <p className="label" style={{color: "rgb(124, 88, 214)", fontWeight: 'bold'}}>{`${payload[0].name} : ${payload[0].value.toLocaleString('en-IN')}`}</p> 
      </div>
    );
  }
  return null;
}

export default class Barchart extends Component {
  render() {
    const { data, isLoading, dataKey, stroke } = this.props;
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
    } catch (err) { }

    return (
      <div className="barcharts">
        {!isLoading && (
          <AreaChart
            width={350}
            height={150}
            data={result}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="date" />
            <YAxis orientation="right"/>
            <Tooltip content={<CustomTooltiptiny />}/>
            <Area dataKey={dataKey} fill={stroke} />
          </AreaChart>
        )}
      </div>
    );
  }
}
