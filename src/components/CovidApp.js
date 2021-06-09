import React, { Component } from 'react';
import axios from 'axios';
import Lottie from 'react-lottie';
import { formatDistance } from 'date-fns';
import { withStyles } from '@material-ui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faBellSlash,
  faSyncAlt,
} from '@fortawesome/free-solid-svg-icons';

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
// import styles from "../styles/VaccineStyles";

import Barchart from './Barchart';
import Charts from './Charts';
import DisplayTable from './DisplayTable';
import Footer from './Footer';
import MapSection from './MapSection';
import Overview from './Overview';

import colors from '../constants/colors';
import stateCodes from '../constants/stateCodes';
import * as animationData from '../assets/loading.json';

import styles from '../styles/CovidAppStyles';
import '../styles/DarkModeButton.css';

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
        <p className="label" style={{color: "rgb(124, 88, 214)", fontWeight: 'bold'}}>{`${payload[0].value.toLocaleString('en-IN')} confirmed cases detected`}</p> 
      </div>
    );
  }
  return null;
}



const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData.default,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const months = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec',
};

class CovidApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      todayData: {},
      isLoading: false,
      mapData: [],
      tableData: [],
      options: {},
      tested: 0,
      lastmodifiedDate: "",
      rawData: []
    };

    this.fetchData = this.fetchData.bind(this);
    this.formatData = this.formatData.bind(this);
    this.findId = this.findId.bind(this);
    this.handleFormat = this.handleFormat.bind(this);
    this.handleNotification = this.handleNotification.bind(this);
  }

  componentDidMount() {
    this.fetchData();
    this.fetchRawData();
    this.fetchTestedData();
  }

  async fetchData() {
    this.setState({ isLoading: !this.state.isLoading });
    const countryData = axios.get('https://api.covid19india.org/data.json');
    const districtLevel = axios.get(
      'https://api.covid19india.org/v2/state_district_wise.json'
    );
    const stateChanges = axios.get(
      'https://api.covid19india.org/states_daily.json'
    );
    const updates = axios.get(
      'https://api.covid19india.org/updatelog/log.json'
    );

    axios.all([countryData, districtLevel, stateChanges, updates]).then(
      axios.spread((...responses) => {
        const countryData = responses[0].data;
        const districtLevel = responses[1].data;
        const updates = responses[3].data;

        const [todayData] = countryData.statewise.slice(0, 1);
        console.log(todayData);
        const casesTimeline = countryData.cases_time_series;

        const data = countryData.statewise.slice(1, -1);

        this.setState(
          {
            data: data,
            todayData: todayData,
            casesTimeline: casesTimeline,
            districtLevel: districtLevel,
            updates: updates,
            expanded: false,
          },
          this.handleFormat
        );
      })
    );
  }

  async fetchRawData() {
    const apiUrl = '	https://api.covid19india.org/csv/latest/case_time_series.csv';
    const response = await fetch(apiUrl);
    const data = await response.text();

    let totalConfirmed = [];

    const table = data.split('\n').slice(1);

    table.forEach(row => {
      const columns = row.split(',');
      // const parts = columns[0].split('/');
      // const updatedOn = new Date(parts[2], parts[1] - 1, parts[0]);
      const updatedOn = columns[0];
      const confirmed = Number(columns[2]);

      totalConfirmed.push({x: updatedOn, y: confirmed});
    });

    // console.log(totalConfirmed);

    this.setState({
      rawData: totalConfirmed
    })

  }

  async fetchTestedData() {
    const apiUrl = 'https://api.covid19india.org/csv/latest/tested_numbers_icmr_data.csv';
    const response = await fetch(apiUrl);
    const data = await response.text();

    let totalTested = [];

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0') - 1;
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;

    // console.log(today);

    const table = data.split('\n').slice(1);

    table.forEach(row => {
      const columns = row.split(',');
      const parts = columns[0].split(' ');
      const justDate = parts[0].split('/');
      // const updatedOn = new Date(justDate[2], justDate[1] - 1, justDate[0]);
      const updatedOn = String(justDate[0]) + '/' + String(justDate[1]) + '/' + String(justDate[2]);
      const indvTested = Number(columns[4]);

      // console.log(updatedOn);

      if (updatedOn == today) {
        totalTested.push(indvTested);
      }
      
    });
     
    // console.log(totalTested);

    var parts =today.split('/');
    // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
    // January - 0, February - 1, etc.
    var mydate = new Date(parts[2], parts[1] - 1, parts[0]); 
    // console.log(mydate.toDateString());
    
    this.setState({
      tested: totalTested[0].toLocaleString("en-IN"),
      lastmodifiedDate: mydate.toDateString().slice(4,15)
    });

  }

  formatData(data) {
    const formatedData = data.map((state, i) => {
      return {
        id: this.findId(state.state),
        state: state.state.replace(' and ', ' & '),
        value: state.confirmed,
      };
    });
    return formatedData;
  }

  findId(location) {
    for (let [key, value] of Object.entries(stateCodes)) {
      if (location === key) {
        return value;
      }
    }
  }

  handleFormat() {
    const newdata = this.formatData(this.state.data);
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 1000);
    this.setState({ mapData: newdata });
  }

  handleNotification() {
    this.setState({ expanded: !this.state.expanded });
  }

  formatDate(timestamp) {
    try {
      const [date, time] = timestamp.split(' ');
      const formattedDate = date.split('/');
      console.log(time);
      return `${formattedDate[0]} ${months[formattedDate[1]]}, ${time.slice(
        0,
        5
      )} IST`;
    } catch (err) {}
  }

  render() {
    const { classes, setDarkMode, isDarkMode } = this.props;
    const {
      mapData,
      isLoading,
      data,
      districtLevel,
      expanded,
      updates,
    } = this.state;

    if (isLoading) {
      return (
        <div className={classes.loadingIcon}>
          <Lottie options={defaultOptions} height={500} width={500} />
        </div>
      );
    }
    let displayUpdates;
    try {
      displayUpdates = updates
        .slice(-5)
        .reverse()
        .map(({ update, timestamp }, i) => {
          update = update.replace('\n', '<br/>');
          return (
            <div className={classes.updateBox} key={i}>
              <h5 className={classes.updateHeading}>
                {`${formatDistance(
                  new Date(timestamp * 1000),
                  new Date()
                )} ago`}
              </h5>
              <h4
                className={classes.updateText}
                dangerouslySetInnerHTML={{
                  __html: update,
                }}
              ></h4>
            </div>
          );
        });
    } catch (err) {}

    return (
      <>
        <div className={classes.header}>
          <h1 className={classes.heading}>
            <span>Covid-19</span> Tracker
          </h1>
          <div className={classes.btnBox}>
            <FontAwesomeIcon
              icon={faSyncAlt}
              className={classes.button}
              onClick={this.fetchData}
            />
          </div>
          <div className={classes.lastUpdatedTime}>
            Last Updated:{' '}
            {this.formatDate(this.state.todayData.lastupdatedtime)}
          </div>

          <div className={classes.country}>
            <p><b>India</b></p>
          </div>

          <div className={classes.updates}>
            <div className={classes.notification}>
              {expanded ? (
                <FontAwesomeIcon
                  icon={faBellSlash}
                  onClick={this.handleNotification}
                />
              ) : (
                <div className={classes.notificationBell}>
                  <FontAwesomeIcon
                    icon={faBell}
                    onClick={this.handleNotification}
                  />
                </div>
              )}
            </div>
            {expanded && <div className={classes.update}>{displayUpdates}</div>}
          </div>
          <div className="darkModeButton">
            <label className="switch">
              <input
                type="checkbox"
                onChange={setDarkMode}
                checked={isDarkMode}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
        <div>
          <Overview
            isDarkMode={isDarkMode}
            data={this.state.todayData}
            loadingStatus={this.loadingStatus}
          />
        </div>

        <div className={classes.goodnews}>
            <p> ✅ <b>{this.state.tested}</b> Tested as of {this.state.lastmodifiedDate}</p>
        </div>

        <div className={classes.content}>
          <div className={classes.contentArea}>
            <div className={classes.mapArea}>
              <MapSection
                data={data}
                mapData={mapData}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
          <div className={classes.chartArea}>
            <div className={classes.chartRes}>
              <Charts
                data={this.state.casesTimeline}
                isLoading={this.state.isLoading}
              />
            </div>
            <div className={classes.tinyChartArea}>
              <div className={classes.tinyChart}>
                <div
                  className={classes.tinych}
                  style={{ background: 'rgba(249, 52, 94,.1)' }}
                >
                  <h3 style={{ color: colors.red }}>confirmed</h3>
                  <Barchart
                    data={this.state.casesTimeline}
                    isLoading={this.state.isLoading}
                    dataKey="totalconfirmed"
                    stroke={colors.red}
                  />
                </div>
              </div>
              <div className={classes.tinyChart}>
                <div
                  className={classes.tinych}
                  style={{ background: 'rgba(250, 100, 0,.1)' }}
                >
                  <h3 style={{ color: colors.orange }}>active</h3>
                  <Barchart
                    data={this.state.casesTimeline}
                    isLoading={this.state.isLoading}
                    
                    dataKey="totalactive"
                    stroke={colors.orange}
                  />
                </div>
              </div>
              <div className={classes.tinyChart}>
                <div
                  className={classes.tinych}
                  style={{ background: 'rgba(28, 177, 66,.1)' }}
                >
                  <h3 style={{ color: colors.green }}>Recovered</h3>
                  <Barchart
                    data={this.state.casesTimeline}
                    isLoading={this.state.isLoading}
                    dataKey="totalrecovered"
                    stroke={colors.green}
                  />
                </div>
              </div>
              <div className={classes.tinyChart}>
                <div
                  className={classes.tinych}
                  style={{ background: "rgb(201, 201, 201, 0.3)" }}
                >
                  <h3 style={{ color: "black" }}>Deceased</h3>
                  <Barchart
                    data={this.state.casesTimeline}
                    isLoading={this.state.isLoading}
                    dataKey="totaldeceased"
                    stroke="rgb(71, 71, 71)"
                  />
                </div>
              </div>
            </div>
          </div>

          
          <div className={classes.chartArea2}>
            <h3 className={classes.warning}> Unfolding of the Pandemic </h3>
            <ResponsiveContainer width="100%" height={360}>
              <AreaChart
                width={1000}
                height={400}
                data={this.state.rawData}
                margin={{
                  top: 10, right: 40, left: 40, bottom: 0,
                }}
              >
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis dataKey="x" />
                <YAxis orientation="right" tickFormatter={tick => {return tick.toLocaleString("en-IN");}} name="Confirmed cases daily"/>
                {/* <Legend verticalAlign="top" height={36}/> */}
                <Tooltip content={<CustomTooltip />}/>
                <Area type="monotone" dataKey="y" stroke="rgb(219,85,129)" fill="rgb(219,85,129)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>


          <div className={classes.tableContainer}>
            <h2 className={classes.tableHeading}>
              State/UT Wise Data (Sortable){' '}
            </h2>
            <DisplayTable
              tableData={data}
              districtLevel={districtLevel}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
        <Footer />
      </>
    );
  }
}

export default withStyles(styles)(CovidApp);
