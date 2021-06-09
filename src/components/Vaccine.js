import {responsiveFontSizes} from '@material-ui/core';
import { withStyles } from "@material-ui/styles";
import React, {Component} from 'react';
import styles from "../styles/VaccineStyles";
import Footer from "../components/VaccineFooter";
import {
  Legend,
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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



const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
    return (
      <div className="custom-tooltip" style={tooltip}>
        <p className="label" style={tooltipTitle}>{`${label}`}</p>
        <p className="label" style={{color: "rgb(124, 88, 214)", fontWeight: 'bold'}}>{`Atleast 1 Dose given to ${payload[0].value.toLocaleString('en-IN')} people`}</p> 
        <p className="label" style={{color: "#34a853", fontWeight: 'bold'}}>{`Fully Vaccinated : ${payload[1].value.toLocaleString('en-IN')} people`}</p>
      </div>
    );
  }
  return null;
}

class Vaccine extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      user_data: 'India',
      options: {},
      administered: 0
      // mutable: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    
  }

  handleChange(event) {
    this.setState({
      user_data: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.componentDidMount();
  }

  async componentDidMount() {
    const apiUrl = 'http://api.covid19india.org/csv/latest/cowin_vaccine_data_statewise.csv';
    const response = await fetch(apiUrl);
    const data = await response.text();
    

    let totalVaccinations = [];
    let totalFirstDose = [];
    let totalSecondDose = [];
    let totalAdministered = [];

    const table = data.split('\n').slice(1);

    //Find today's date to get the new Total Vaccinations Administered data daily

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0') - 2;
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var todayString = String(dd) + '/' + String(mm) + '/' + String(yyyy);

    console.log(todayString);

    table.forEach(row => {
      const columns = row.split(',');
      const parts = columns[0].split('/');
      const updatedOn = new Date(parts[2], parts[1] - 1, parts[0]);
      const date = columns[0];
      const state = columns[1];
      const totalIndv = Number(columns[2]);
      const totalFirst  = Number(columns[5]);
      const totalSecond  = Number(columns[6]);
      const totalAdmi = Number(columns[17]);

      if (date == todayString && state == this.state.user_data) {
        
        console.log(date, todayString, totalAdmi);
        totalAdministered = totalAdmi;
      }

      if (state == this.state.user_data) {
        totalFirstDose.push({"Date": date, "Atleast 1 Dose": totalFirst, "Fully Vaccinated": totalSecond});
        totalVaccinations.push({x: date, y: totalAdmi});
      }

    });

    totalFirstDose.pop();

    let number = 500000000;
    console.log(number.toLocaleString('en-IN'));
    
    // console.log(totalVaccinations);
    // console.log(totalAdministered);



    if (totalVaccinations.length == 0) {
      alert("Something is wrong with the input, please try again.")
    }

    console.log(totalFirstDose);

    this.setState({
      data: totalFirstDose,
      administered: totalAdministered
    });

  };

  render() {
    const { classes } = this.props;
    const {
      data,
      user_data,
      options,
      administered
    } = this.state;


    return (

      <div className={classes.root}>
        <div >
          <h1 className={classes.mainHeading}> Vaccine Updates </h1>
        </div>

        <div className={classes.vaccineBody}>

          <h2 className={classes.warning}> ⚠ Everyone 18 and older is eligible to get the vaccine against Covid - 19. Availability may vary by state. </h2>
          <br></br>
          
          <div>
            <form onSubmit = {this.handleSubmit} >
            <label > <h3>Search your State:</h3>
              <input className={classes.input} type = "text" value = {this.state.user_data} onChange = {this.handleChange} placeholder = "" / >
            </label>
              <button className={classes.btn} type="submit" value="Submit">Submit</button>
            </form>
          </div>

          <div className={classes.goodnews}>
            <h3> 💉 <b>{this.state.administered.toLocaleString("en-IN")}</b>  vaccine doses administered</h3>
          </div>

          <div className={classes.chartArea}>
            <h3>Vaccinations</h3>
            <ResponsiveContainer width="100%" height={360}>
              <AreaChart
                width={1000}
                height={400}
                data={this.state.data}
                margin={{
                  top: 10, right: 40, left: 40, bottom: 0,
                }}
              >
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis dataKey="Date" />
                <YAxis orientation="right" tickFormatter={tick => {return tick.toLocaleString();}}/>
                <Legend verticalAlign="top" height={36}/>
                <Tooltip 
                />
                <Area type="monotone" dataKey="Atleast 1 Dose" stroke="rgb(124, 88, 214)" fill="rgb(124, 88, 214, 0.15)" />
                <Area type="monotone" dataKey="Fully Vaccinated" stroke="#34a853" fill="rgb(52, 168, 83, 0.3)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

        </div>
        
        <h2 className={classes.facts}> ⚠ Getting the vaccine </h2>

        <Footer />

      </div>

    )
  }
}

export default withStyles(styles) (Vaccine);
