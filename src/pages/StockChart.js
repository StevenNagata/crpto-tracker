import React, { Component } from "react";
import {
  Container,
  Menu,
  Divider,
  Grid,
  Header,
  Icon,
  Card,
  Statistic,
  Form,
  Select,
  Segment,
  Input,
  List,
  Label,
  Button,
} from "semantic-ui-react";
import Options from '../components/Options';
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "../App.css";

import Chart from "../components/Chart";

var dateFormat = require('dateformat');


const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

var unirest = require("unirest");

class StockChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "home",
      activeSubItem: "options",
      expiringDates: [],
      chartData: []
    }
  }

  componentDidMount() {
    let self = this
      var req = unirest("GET", "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-chart");

  req.query({
  	"interval": "1m",
  	"region": "US",
  	"symbol": window.location.hash.slice(1),
  	"lang": "en",
  	"range": "1d"
  });

  req.headers({
  	"x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
  	"x-rapidapi-key": "c5e9119c84msh6c5eb83ff319aa0p164365jsn340d3ca81561"
  });

  req.end(function (res) {
  	if (res.error) throw new Error(res.error);
self.makeData(res.body.chart.result[0].timestamp, res.body.chart.result[0].indicators.quote[0].high)
  })

    let expiringDates = expDates.map((time) => {
      let remainingDays = Math.round(
        (time * 1000 - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      let d = new Date(time * 1000);
      return {
        key: time,
        value: time,
        text: `${
          d.getMonth() + 1
        }/${d.getDate()}/${d.getFullYear()} - ${remainingDays} ${
          remainingDays === 1 ? "Day Away" : "Days Away"
        }`,
      };
    });

    this.setState({
      expiringDates
    });
  }
makeData = (timeStamps, data) => {
  let chartData = timeStamps.map((t, index) => {
    return { x: t ? new Date(t * 1000) : 0 , y: data[index]}
  })
  this.setState({chartData})
}
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  

  render() {
    const { activeItem , activeSubItem} = this.state;
let data = []
for(let i = 1; i <= 100; i++) {
  data.push({x: i, y: Math.random() * 10})
}
    const styles = {
      currentPrice: {
        fontSize: "2em",
        fontWeight: 600,
      },
      secondaryText: {
        fontSize: "0.875em",
      },
      subHeader: {
        fontSize: "0.65em",
        lineHeight: "5px",
      },
      subText: {
        fontSize: "0.65em",
      },
    };

    const {
      regularMarketOpen,
      regularMarketPreviousClose,
      regularMarketPrice,
      regularMarketDayLow,
      regularMarketDayHigh,
      regularMarketVolume,
      regularMarketChangePercent,
    } = AAPLData.price;
    return (
      <div>
        <div>
          <Menu inverted pointing secondary>
            <Menu.Item
              name="home"
              active={activeItem === "home"}
              onClick={this.handleItemClick}
            />

            <Menu.Menu position="right">
              <Menu.Item
                name="logout"
                active={activeItem === "logout"}
                onClick={this.handleItemClick}
              />
            </Menu.Menu>
          </Menu>
        </div>
        <Segment style={{ borderRadius: "10px" }} inverted>
          <Grid inverted relaxed columns="equal">
            <Grid.Row style={{ paddingBottom: 0 }}>
              <Grid.Column>
                <div
                  style={{
                    color:
                      regularMarketOpen.raw > regularMarketPrice.raw
                        ? "#FF4340"
                        : "#00B338",
                    display: "inline-block",
                    ...styles.currentPrice,
                  }}
                >
                  {regularMarketPrice.raw}
                </div>

                <div
                  style={{
                    marginLeft: "0.5rem",
                    lineHeight: 1,
                    color:
                      regularMarketOpen.raw > regularMarketPrice.raw
                        ? "#FF4340"
                        : "#00B338",
                    display: "inline-block",
                  }}
                >
                  <div style={{ ...styles.secondaryText }}>
                    {Math.round(
                      (regularMarketPrice.raw -
                        regularMarketPreviousClose.raw) *
                        100
                    ) / 100}
                  </div>
                  <div style={styles.secondaryText}>
                    {regularMarketChangePercent.fmt}
                  </div>
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <div style={styles.subHeader}>DAILY RANGE</div>
                <div
                  style={styles.subText}
                >{`${regularMarketDayLow.raw}-${regularMarketDayHigh.raw}`}</div>
              </Grid.Column>
              <Grid.Column>
                <div style={styles.subHeader}>PREV CLOSE/OPEN</div>
                <div
                  style={styles.subText}
                >{`${regularMarketPreviousClose.raw}/${regularMarketOpen.raw}`}</div>
              </Grid.Column>
              <Grid.Column>
                <div style={{ float: "right" }}>
                  <div style={styles.subHeader}>VOLUME</div>
                  <div style={styles.subText}>{regularMarketVolume.fmt}</div>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>

        <Segment style={{ borderRadius: "10px" }} inverted>
        <Chart data={this.state.chartData}/>

        </Segment>

        <Segment style={{ borderRadius: "10px" }} inverted>
        <Menu inverted size='mini' pointing secondary fluid widths={2}>
        <Menu.Item
          name='OPTIONS'
          active={activeSubItem === 'options'}
          onClick={() => this.setState({activeSubItem: 'options'})}
        />
        <Menu.Item
          name='NEWS'
          active={activeSubItem === 'news'}
          onClick={() => this.setState({activeSubItem: 'news'})}
        />
      </Menu>
      
      {this.state.activeSubItem === 'options' && (
        <Options stock={window.location.hash.slice(1)}
        currentPrice={regularMarketPrice.raw}/>
      //   <Form inverted onSubmit={this.getOptions}>
      //   <div style={{ margin: "1rem 0" }}>
      //     <Form.Group widths="equal">
      //       <Form.Field
      //         id="date"
      //         required
      //         control={Select}
      //         label="Choose an Experation Date"
      //         options={this.state.expiringDates}
      //         onChange={(event, { name, value }) => {
      //           this.setState({ experationDate: value });
      //         }}
      //       />
      //     </Form.Group>
      //   </div>
       
      //     <Button basic inverted fluid={true}>
      //     Get Options
      // </Button>
      
      // </Form>
      )}
{this.state.activeSubItem === 'news' && (
  <List divided inverted fluid={true} relaxed>
    {newsData.items.result.map(article => {
      let d = new Date(article.published_at * 1000)
      return (
        <List.Item>
        <List.Content>
          <List.Header>
            <div className="newsTitle"><a href={article.link}>{article.title}</a></div>
          </List.Header>
          <List.Description>
          <div className="newsDate">{`${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`}</div>
            <p className="newsSummary">{article.summary}</p>
            </List.Description>
        </List.Content>
      </List.Item>
      )
    })}
 </List>
)}
      

</Segment>
      </div>
    );
  }
}

export default StockChart;

const AAPLData = {
  financialsTemplate: {
    code: "N",
    maxAge: 1,
  },
  cashflowStatementHistory: {
    cashflowStatements: [
      {
        investments: {
          raw: 58093000000,
          fmt: "58.09B",
          longFmt: "58,093,000,000",
        },
        changeToLiabilities: {
          raw: -2548000000,
          fmt: "-2.55B",
          longFmt: "-2,548,000,000",
        },
        totalCashflowsFromInvestingActivities: {
          raw: 45896000000,
          fmt: "45.9B",
          longFmt: "45,896,000,000",
        },
        netBorrowings: {
          raw: -7819000000,
          fmt: "-7.82B",
          longFmt: "-7,819,000,000",
        },
        totalCashFromFinancingActivities: {
          raw: -90976000000,
          fmt: "-90.98B",
          longFmt: "-90,976,000,000",
        },
        changeToOperatingActivities: {
          raw: -896000000,
          fmt: "-896M",
          longFmt: "-896,000,000",
        },
        issuanceOfStock: {
          raw: 781000000,
          fmt: "781M",
          longFmt: "781,000,000",
        },
        netIncome: {
          raw: 55256000000,
          fmt: "55.26B",
          longFmt: "55,256,000,000",
        },
        changeInCash: {
          raw: 24311000000,
          fmt: "24.31B",
          longFmt: "24,311,000,000",
        },
        endDate: {
          raw: 1569628800,
          fmt: "2019-09-28",
        },
        repurchaseOfStock: {
          raw: -69714000000,
          fmt: "-69.71B",
          longFmt: "-69,714,000,000",
        },
        totalCashFromOperatingActivities: {
          raw: 69391000000,
          fmt: "69.39B",
          longFmt: "69,391,000,000",
        },
        depreciation: {
          raw: 12547000000,
          fmt: "12.55B",
          longFmt: "12,547,000,000",
        },
        otherCashflowsFromInvestingActivities: {
          raw: -1078000000,
          fmt: "-1.08B",
          longFmt: "-1,078,000,000",
        },
        dividendsPaid: {
          raw: -14119000000,
          fmt: "-14.12B",
          longFmt: "-14,119,000,000",
        },
        changeToInventory: {
          raw: -289000000,
          fmt: "-289M",
          longFmt: "-289,000,000",
        },
        changeToAccountReceivables: {
          raw: 245000000,
          fmt: "245M",
          longFmt: "245,000,000",
        },
        otherCashflowsFromFinancingActivities: {
          raw: -105000000,
          fmt: "-105M",
          longFmt: "-105,000,000",
        },
        maxAge: 1,
        changeToNetincome: {
          raw: 5076000000,
          fmt: "5.08B",
          longFmt: "5,076,000,000",
        },
        capitalExpenditures: {
          raw: -10495000000,
          fmt: "-10.49B",
          longFmt: "-10,495,000,000",
        },
      },
      {
        investments: {
          raw: 30845000000,
          fmt: "30.84B",
          longFmt: "30,845,000,000",
        },
        changeToLiabilities: {
          raw: 9172000000,
          fmt: "9.17B",
          longFmt: "9,172,000,000",
        },
        totalCashflowsFromInvestingActivities: {
          raw: 16066000000,
          fmt: "16.07B",
          longFmt: "16,066,000,000",
        },
        netBorrowings: {
          raw: 432000000,
          fmt: "432M",
          longFmt: "432,000,000",
        },
        totalCashFromFinancingActivities: {
          raw: -87876000000,
          fmt: "-87.88B",
          longFmt: "-87,876,000,000",
        },
        changeToOperatingActivities: {
          raw: 30016000000,
          fmt: "30.02B",
          longFmt: "30,016,000,000",
        },
        issuanceOfStock: {
          raw: 669000000,
          fmt: "669M",
          longFmt: "669,000,000",
        },
        netIncome: {
          raw: 59531000000,
          fmt: "59.53B",
          longFmt: "59,531,000,000",
        },
        changeInCash: {
          raw: 5624000000,
          fmt: "5.62B",
          longFmt: "5,624,000,000",
        },
        endDate: {
          raw: 1538179200,
          fmt: "2018-09-29",
        },
        repurchaseOfStock: {
          raw: -75265000000,
          fmt: "-75.27B",
          longFmt: "-75,265,000,000",
        },
        totalCashFromOperatingActivities: {
          raw: 77434000000,
          fmt: "77.43B",
          longFmt: "77,434,000,000",
        },
        depreciation: {
          raw: 10903000000,
          fmt: "10.9B",
          longFmt: "10,903,000,000",
        },
        otherCashflowsFromInvestingActivities: {
          raw: -745000000,
          fmt: "-745M",
          longFmt: "-745,000,000",
        },
        dividendsPaid: {
          raw: -13712000000,
          fmt: "-13.71B",
          longFmt: "-13,712,000,000",
        },
        changeToInventory: {
          raw: 828000000,
          fmt: "828M",
          longFmt: "828,000,000",
        },
        changeToAccountReceivables: {
          raw: -5322000000,
          fmt: "-5.32B",
          longFmt: "-5,322,000,000",
        },
        otherCashflowsFromFinancingActivities: {
          raw: -105000000,
          fmt: "-105M",
          longFmt: "-105,000,000",
        },
        maxAge: 1,
        changeToNetincome: {
          raw: -27694000000,
          fmt: "-27.69B",
          longFmt: "-27,694,000,000",
        },
        capitalExpenditures: {
          raw: -13313000000,
          fmt: "-13.31B",
          longFmt: "-13,313,000,000",
        },
      },
      {
        investments: {
          raw: -33542000000,
          fmt: "-33.54B",
          longFmt: "-33,542,000,000",
        },
        changeToLiabilities: {
          raw: 8373000000,
          fmt: "8.37B",
          longFmt: "8,373,000,000",
        },
        totalCashflowsFromInvestingActivities: {
          raw: -46446000000,
          fmt: "-46.45B",
          longFmt: "-46,446,000,000",
        },
        netBorrowings: {
          raw: 29014000000,
          fmt: "29.01B",
          longFmt: "29,014,000,000",
        },
        totalCashFromFinancingActivities: {
          raw: -17974000000,
          fmt: "-17.97B",
          longFmt: "-17,974,000,000",
        },
        changeToOperatingActivities: {
          raw: -8480000000,
          fmt: "-8.48B",
          longFmt: "-8,480,000,000",
        },
        issuanceOfStock: {
          raw: 555000000,
          fmt: "555M",
          longFmt: "555,000,000",
        },
        netIncome: {
          raw: 48351000000,
          fmt: "48.35B",
          longFmt: "48,351,000,000",
        },
        changeInCash: {
          raw: -195000000,
          fmt: "-195M",
          longFmt: "-195,000,000",
        },
        endDate: {
          raw: 1506729600,
          fmt: "2017-09-30",
        },
        repurchaseOfStock: {
          raw: -34774000000,
          fmt: "-34.77B",
          longFmt: "-34,774,000,000",
        },
        totalCashFromOperatingActivities: {
          raw: 64225000000,
          fmt: "64.22B",
          longFmt: "64,225,000,000",
        },
        depreciation: {
          raw: 10157000000,
          fmt: "10.16B",
          longFmt: "10,157,000,000",
        },
        otherCashflowsFromInvestingActivities: {
          raw: -124000000,
          fmt: "-124M",
          longFmt: "-124,000,000",
        },
        dividendsPaid: {
          raw: -12769000000,
          fmt: "-12.77B",
          longFmt: "-12,769,000,000",
        },
        changeToInventory: {
          raw: -2723000000,
          fmt: "-2.72B",
          longFmt: "-2,723,000,000",
        },
        changeToAccountReceivables: {
          raw: -2093000000,
          fmt: "-2.09B",
          longFmt: "-2,093,000,000",
        },
        otherCashflowsFromFinancingActivities: {
          raw: -105000000,
          fmt: "-105M",
          longFmt: "-105,000,000",
        },
        maxAge: 1,
        changeToNetincome: {
          raw: 10640000000,
          fmt: "10.64B",
          longFmt: "10,640,000,000",
        },
        capitalExpenditures: {
          raw: -12451000000,
          fmt: "-12.45B",
          longFmt: "-12,451,000,000",
        },
      },
      {
        investments: {
          raw: -32022000000,
          fmt: "-32.02B",
          longFmt: "-32,022,000,000",
        },
        changeToLiabilities: {
          raw: 563000000,
          fmt: "563M",
          longFmt: "563,000,000",
        },
        totalCashflowsFromInvestingActivities: {
          raw: -45977000000,
          fmt: "-45.98B",
          longFmt: "-45,977,000,000",
        },
        netBorrowings: {
          raw: 22057000000,
          fmt: "22.06B",
          longFmt: "22,057,000,000",
        },
        totalCashFromFinancingActivities: {
          raw: -20890000000,
          fmt: "-20.89B",
          longFmt: "-20,890,000,000",
        },
        changeToOperatingActivities: {
          raw: -902000000,
          fmt: "-902M",
          longFmt: "-902,000,000",
        },
        issuanceOfStock: {
          raw: 495000000,
          fmt: "495M",
          longFmt: "495,000,000",
        },
        netIncome: {
          raw: 45687000000,
          fmt: "45.69B",
          longFmt: "45,687,000,000",
        },
        changeInCash: {
          raw: -636000000,
          fmt: "-636M",
          longFmt: "-636,000,000",
        },
        endDate: {
          raw: 1474675200,
          fmt: "2016-09-24",
        },
        repurchaseOfStock: {
          raw: -31292000000,
          fmt: "-31.29B",
          longFmt: "-31,292,000,000",
        },
        totalCashFromOperatingActivities: {
          raw: 66231000000,
          fmt: "66.23B",
          longFmt: "66,231,000,000",
        },
        depreciation: {
          raw: 10505000000,
          fmt: "10.51B",
          longFmt: "10,505,000,000",
        },
        otherCashflowsFromInvestingActivities: {
          raw: -924000000,
          fmt: "-924M",
          longFmt: "-924,000,000",
        },
        dividendsPaid: {
          raw: -12150000000,
          fmt: "-12.15B",
          longFmt: "-12,150,000,000",
        },
        changeToInventory: {
          raw: 217000000,
          fmt: "217M",
          longFmt: "217,000,000",
        },
        changeToAccountReceivables: {
          raw: 527000000,
          fmt: "527M",
          longFmt: "527,000,000",
        },
        otherCashflowsFromFinancingActivities: {
          raw: -105000000,
          fmt: "-105M",
          longFmt: "-105,000,000",
        },
        maxAge: 1,
        changeToNetincome: {
          raw: 9634000000,
          fmt: "9.63B",
          longFmt: "9,634,000,000",
        },
        capitalExpenditures: {
          raw: -12734000000,
          fmt: "-12.73B",
          longFmt: "-12,734,000,000",
        },
      },
    ],
    maxAge: 86400,
  },
  balanceSheetHistoryQuarterly: {
    balanceSheetStatements: [
      {
        totalLiab: {
          raw: 241975000000,
          fmt: "241.97B",
          longFmt: "241,975,000,000",
        },
        totalStockholderEquity: {
          raw: 78425000000,
          fmt: "78.42B",
          longFmt: "78,425,000,000",
        },
        otherCurrentLiab: {
          raw: 42048000000,
          fmt: "42.05B",
          longFmt: "42,048,000,000",
        },
        totalAssets: {
          raw: 320400000000,
          fmt: "320.4B",
          longFmt: "320,400,000,000",
        },
        endDate: {
          raw: 1585353600,
          fmt: "2020-03-28",
        },
        commonStock: {
          raw: 48032000000,
          fmt: "48.03B",
          longFmt: "48,032,000,000",
        },
        otherCurrentAssets: {
          raw: 15691000000,
          fmt: "15.69B",
          longFmt: "15,691,000,000",
        },
        retainedEarnings: {
          raw: 33182000000,
          fmt: "33.18B",
          longFmt: "33,182,000,000",
        },
        otherLiab: {
          raw: 48745000000,
          fmt: "48.74B",
          longFmt: "48,745,000,000",
        },
        treasuryStock: {
          raw: -2789000000,
          fmt: "-2.79B",
          longFmt: "-2,789,000,000",
        },
        otherAssets: {
          raw: 33868000000,
          fmt: "33.87B",
          longFmt: "33,868,000,000",
        },
        cash: {
          raw: 40174000000,
          fmt: "40.17B",
          longFmt: "40,174,000,000",
        },
        totalCurrentLiabilities: {
          raw: 96094000000,
          fmt: "96.09B",
          longFmt: "96,094,000,000",
        },
        shortLongTermDebt: {
          raw: 10392000000,
          fmt: "10.39B",
          longFmt: "10,392,000,000",
        },
        otherStockholderEquity: {
          raw: -2789000000,
          fmt: "-2.79B",
          longFmt: "-2,789,000,000",
        },
        propertyPlantEquipment: {
          raw: 43986000000,
          fmt: "43.99B",
          longFmt: "43,986,000,000",
        },
        totalCurrentAssets: {
          raw: 143753000000,
          fmt: "143.75B",
          longFmt: "143,753,000,000",
        },
        longTermInvestments: {
          raw: 98793000000,
          fmt: "98.79B",
          longFmt: "98,793,000,000",
        },
        netTangibleAssets: {
          raw: 78425000000,
          fmt: "78.42B",
          longFmt: "78,425,000,000",
        },
        shortTermInvestments: {
          raw: 53877000000,
          fmt: "53.88B",
          longFmt: "53,877,000,000",
        },
        netReceivables: {
          raw: 30677000000,
          fmt: "30.68B",
          longFmt: "30,677,000,000",
        },
        maxAge: 1,
        longTermDebt: {
          raw: 89086000000,
          fmt: "89.09B",
          longFmt: "89,086,000,000",
        },
        inventory: {
          raw: 3334000000,
          fmt: "3.33B",
          longFmt: "3,334,000,000",
        },
        accountsPayable: {
          raw: 32421000000,
          fmt: "32.42B",
          longFmt: "32,421,000,000",
        },
      },
      {
        totalLiab: {
          raw: 251087000000,
          fmt: "251.09B",
          longFmt: "251,087,000,000",
        },
        totalStockholderEquity: {
          raw: 89531000000,
          fmt: "89.53B",
          longFmt: "89,531,000,000",
        },
        otherCurrentLiab: {
          raw: 40577000000,
          fmt: "40.58B",
          longFmt: "40,577,000,000",
        },
        totalAssets: {
          raw: 340618000000,
          fmt: "340.62B",
          longFmt: "340,618,000,000",
        },
        endDate: {
          raw: 1577491200,
          fmt: "2019-12-28",
        },
        commonStock: {
          raw: 45972000000,
          fmt: "45.97B",
          longFmt: "45,972,000,000",
        },
        otherCurrentAssets: {
          raw: 12026000000,
          fmt: "12.03B",
          longFmt: "12,026,000,000",
        },
        retainedEarnings: {
          raw: 43977000000,
          fmt: "43.98B",
          longFmt: "43,977,000,000",
        },
        otherLiab: {
          raw: 48648000000,
          fmt: "48.65B",
          longFmt: "48,648,000,000",
        },
        treasuryStock: {
          raw: -418000000,
          fmt: "-418M",
          longFmt: "-418,000,000",
        },
        otherAssets: {
          raw: 33195000000,
          fmt: "33.2B",
          longFmt: "33,195,000,000",
        },
        cash: {
          raw: 39771000000,
          fmt: "39.77B",
          longFmt: "39,771,000,000",
        },
        totalCurrentLiabilities: {
          raw: 102161000000,
          fmt: "102.16B",
          longFmt: "102,161,000,000",
        },
        shortLongTermDebt: {
          raw: 10224000000,
          fmt: "10.22B",
          longFmt: "10,224,000,000",
        },
        otherStockholderEquity: {
          raw: -418000000,
          fmt: "-418M",
          longFmt: "-418,000,000",
        },
        propertyPlantEquipment: {
          raw: 44293000000,
          fmt: "44.29B",
          longFmt: "44,293,000,000",
        },
        totalCurrentAssets: {
          raw: 163231000000,
          fmt: "163.23B",
          longFmt: "163,231,000,000",
        },
        longTermInvestments: {
          raw: 99899000000,
          fmt: "99.9B",
          longFmt: "99,899,000,000",
        },
        netTangibleAssets: {
          raw: 89531000000,
          fmt: "89.53B",
          longFmt: "89,531,000,000",
        },
        shortTermInvestments: {
          raw: 67391000000,
          fmt: "67.39B",
          longFmt: "67,391,000,000",
        },
        netReceivables: {
          raw: 39946000000,
          fmt: "39.95B",
          longFmt: "39,946,000,000",
        },
        maxAge: 1,
        longTermDebt: {
          raw: 93078000000,
          fmt: "93.08B",
          longFmt: "93,078,000,000",
        },
        inventory: {
          raw: 4097000000,
          fmt: "4.1B",
          longFmt: "4,097,000,000",
        },
        accountsPayable: {
          raw: 45111000000,
          fmt: "45.11B",
          longFmt: "45,111,000,000",
        },
      },
      {
        totalLiab: {
          raw: 248028000000,
          fmt: "248.03B",
          longFmt: "248,028,000,000",
        },
        totalStockholderEquity: {
          raw: 90488000000,
          fmt: "90.49B",
          longFmt: "90,488,000,000",
        },
        otherCurrentLiab: {
          raw: 43242000000,
          fmt: "43.24B",
          longFmt: "43,242,000,000",
        },
        totalAssets: {
          raw: 338516000000,
          fmt: "338.52B",
          longFmt: "338,516,000,000",
        },
        endDate: {
          raw: 1569628800,
          fmt: "2019-09-28",
        },
        commonStock: {
          raw: 45174000000,
          fmt: "45.17B",
          longFmt: "45,174,000,000",
        },
        otherCurrentAssets: {
          raw: 12352000000,
          fmt: "12.35B",
          longFmt: "12,352,000,000",
        },
        retainedEarnings: {
          raw: 45898000000,
          fmt: "45.9B",
          longFmt: "45,898,000,000",
        },
        otherLiab: {
          raw: 50503000000,
          fmt: "50.5B",
          longFmt: "50,503,000,000",
        },
        treasuryStock: {
          raw: -584000000,
          fmt: "-584M",
          longFmt: "-584,000,000",
        },
        otherAssets: {
          raw: 32978000000,
          fmt: "32.98B",
          longFmt: "32,978,000,000",
        },
        cash: {
          raw: 48844000000,
          fmt: "48.84B",
          longFmt: "48,844,000,000",
        },
        totalCurrentLiabilities: {
          raw: 105718000000,
          fmt: "105.72B",
          longFmt: "105,718,000,000",
        },
        shortLongTermDebt: {
          raw: 10260000000,
          fmt: "10.26B",
          longFmt: "10,260,000,000",
        },
        otherStockholderEquity: {
          raw: -584000000,
          fmt: "-584M",
          longFmt: "-584,000,000",
        },
        propertyPlantEquipment: {
          raw: 37378000000,
          fmt: "37.38B",
          longFmt: "37,378,000,000",
        },
        totalCurrentAssets: {
          raw: 162819000000,
          fmt: "162.82B",
          longFmt: "162,819,000,000",
        },
        longTermInvestments: {
          raw: 105341000000,
          fmt: "105.34B",
          longFmt: "105,341,000,000",
        },
        netTangibleAssets: {
          raw: 90488000000,
          fmt: "90.49B",
          longFmt: "90,488,000,000",
        },
        shortTermInvestments: {
          raw: 51713000000,
          fmt: "51.71B",
          longFmt: "51,713,000,000",
        },
        netReceivables: {
          raw: 45804000000,
          fmt: "45.8B",
          longFmt: "45,804,000,000",
        },
        maxAge: 1,
        longTermDebt: {
          raw: 91807000000,
          fmt: "91.81B",
          longFmt: "91,807,000,000",
        },
        inventory: {
          raw: 4106000000,
          fmt: "4.11B",
          longFmt: "4,106,000,000",
        },
        accountsPayable: {
          raw: 46236000000,
          fmt: "46.24B",
          longFmt: "46,236,000,000",
        },
      },
      {
        totalLiab: {
          raw: 225783000000,
          fmt: "225.78B",
          longFmt: "225,783,000,000",
        },
        totalStockholderEquity: {
          raw: 96456000000,
          fmt: "96.46B",
          longFmt: "96,456,000,000",
        },
        otherCurrentLiab: {
          raw: 37107000000,
          fmt: "37.11B",
          longFmt: "37,107,000,000",
        },
        totalAssets: {
          raw: 322239000000,
          fmt: "322.24B",
          longFmt: "322,239,000,000",
        },
        endDate: {
          raw: 1561766400,
          fmt: "2019-06-29",
        },
        commonStock: {
          raw: 43371000000,
          fmt: "43.37B",
          longFmt: "43,371,000,000",
        },
        otherCurrentAssets: {
          raw: 10530000000,
          fmt: "10.53B",
          longFmt: "10,530,000,000",
        },
        retainedEarnings: {
          raw: 53724000000,
          fmt: "53.72B",
          longFmt: "53,724,000,000",
        },
        otherLiab: {
          raw: 51143000000,
          fmt: "51.14B",
          longFmt: "51,143,000,000",
        },
        treasuryStock: {
          raw: -639000000,
          fmt: "-639M",
          longFmt: "-639,000,000",
        },
        otherAssets: {
          raw: 33634000000,
          fmt: "33.63B",
          longFmt: "33,634,000,000",
        },
        cash: {
          raw: 50530000000,
          fmt: "50.53B",
          longFmt: "50,530,000,000",
        },
        totalCurrentLiabilities: {
          raw: 89704000000,
          fmt: "89.7B",
          longFmt: "89,704,000,000",
        },
        shortLongTermDebt: {
          raw: 13529000000,
          fmt: "13.53B",
          longFmt: "13,529,000,000",
        },
        otherStockholderEquity: {
          raw: -639000000,
          fmt: "-639M",
          longFmt: "-639,000,000",
        },
        propertyPlantEquipment: {
          raw: 37636000000,
          fmt: "37.64B",
          longFmt: "37,636,000,000",
        },
        totalCurrentAssets: {
          raw: 134973000000,
          fmt: "134.97B",
          longFmt: "134,973,000,000",
        },
        longTermInvestments: {
          raw: 115996000000,
          fmt: "116B",
          longFmt: "115,996,000,000",
        },
        netTangibleAssets: {
          raw: 96456000000,
          fmt: "96.46B",
          longFmt: "96,456,000,000",
        },
        shortTermInvestments: {
          raw: 44084000000,
          fmt: "44.08B",
          longFmt: "44,084,000,000",
        },
        netReceivables: {
          raw: 26474000000,
          fmt: "26.47B",
          longFmt: "26,474,000,000",
        },
        maxAge: 1,
        longTermDebt: {
          raw: 84936000000,
          fmt: "84.94B",
          longFmt: "84,936,000,000",
        },
        inventory: {
          raw: 3355000000,
          fmt: "3.35B",
          longFmt: "3,355,000,000",
        },
        accountsPayable: {
          raw: 29115000000,
          fmt: "29.11B",
          longFmt: "29,115,000,000",
        },
      },
    ],
    maxAge: 86400,
  },
  earnings: {
    maxAge: 86400,
    earningsChart: {
      quarterly: [
        {
          date: "2Q2019",
          actual: {
            raw: 2.18,
            fmt: "2.18",
          },
          estimate: {
            raw: 2.1,
            fmt: "2.10",
          },
        },
        {
          date: "3Q2019",
          actual: {
            raw: 3.03,
            fmt: "3.03",
          },
          estimate: {
            raw: 2.84,
            fmt: "2.84",
          },
        },
        {
          date: "4Q2019",
          actual: {
            raw: 4.99,
            fmt: "4.99",
          },
          estimate: {
            raw: 4.55,
            fmt: "4.55",
          },
        },
        {
          date: "1Q2020",
          actual: {
            raw: 2.55,
            fmt: "2.55",
          },
          estimate: {
            raw: 2.26,
            fmt: "2.26",
          },
        },
      ],
      currentQuarterEstimate: {
        raw: 2,
        fmt: "2.00",
      },
      currentQuarterEstimateDate: "2Q",
      currentQuarterEstimateYear: 2020,
      earningsDate: [
        {
          raw: 1595894400,
          fmt: "2020-07-28",
        },
        {
          raw: 1596412800,
          fmt: "2020-08-03",
        },
      ],
    },
    financialsChart: {
      yearly: [
        {
          date: 2016,
          revenue: {
            raw: 215639000000,
            fmt: "215.64B",
            longFmt: "215,639,000,000",
          },
          earnings: {
            raw: 45687000000,
            fmt: "45.69B",
            longFmt: "45,687,000,000",
          },
        },
        {
          date: 2017,
          revenue: {
            raw: 229234000000,
            fmt: "229.23B",
            longFmt: "229,234,000,000",
          },
          earnings: {
            raw: 48351000000,
            fmt: "48.35B",
            longFmt: "48,351,000,000",
          },
        },
        {
          date: 2018,
          revenue: {
            raw: 265595000000,
            fmt: "265.6B",
            longFmt: "265,595,000,000",
          },
          earnings: {
            raw: 59531000000,
            fmt: "59.53B",
            longFmt: "59,531,000,000",
          },
        },
        {
          date: 2019,
          revenue: {
            raw: 260174000000,
            fmt: "260.17B",
            longFmt: "260,174,000,000",
          },
          earnings: {
            raw: 55256000000,
            fmt: "55.26B",
            longFmt: "55,256,000,000",
          },
        },
      ],
      quarterly: [
        {
          date: "2Q2019",
          revenue: {
            raw: 53809000000,
            fmt: "53.81B",
            longFmt: "53,809,000,000",
          },
          earnings: {
            raw: 10044000000,
            fmt: "10.04B",
            longFmt: "10,044,000,000",
          },
        },
        {
          date: "3Q2019",
          revenue: {
            raw: 64040000000,
            fmt: "64.04B",
            longFmt: "64,040,000,000",
          },
          earnings: {
            raw: 13686000000,
            fmt: "13.69B",
            longFmt: "13,686,000,000",
          },
        },
        {
          date: "4Q2019",
          revenue: {
            raw: 91819000000,
            fmt: "91.82B",
            longFmt: "91,819,000,000",
          },
          earnings: {
            raw: 22236000000,
            fmt: "22.24B",
            longFmt: "22,236,000,000",
          },
        },
        {
          date: "1Q2020",
          revenue: {
            raw: 58313000000,
            fmt: "58.31B",
            longFmt: "58,313,000,000",
          },
          earnings: {
            raw: 11249000000,
            fmt: "11.25B",
            longFmt: "11,249,000,000",
          },
        },
      ],
    },
    financialCurrency: "USD",
  },
  price: {
    quoteSourceName: "Nasdaq Real Time Price",
    regularMarketOpen: {
      raw: 303.22,
      fmt: "303.22",
    },
    averageDailyVolume3Month: {
      raw: 51191379,
      fmt: "51.19M",
      longFmt: "51,191,379",
    },
    exchange: "NMS",
    regularMarketTime: 1588881602,
    volume24Hr: {},
    regularMarketDayHigh: {
      raw: 305.17,
      fmt: "305.17",
    },
    shortName: "Apple Inc.",
    averageDailyVolume10Day: {
      raw: 37928337,
      fmt: "37.93M",
      longFmt: "37,928,337",
    },
    longName: "Apple Inc.",
    regularMarketChange: {
      raw: 3.1099854,
      fmt: "3.11",
    },
    currencySymbol: "$",
    regularMarketPreviousClose: {
      raw: 300.63,
      fmt: "300.63",
    },
    postMarketTime: 1588895990,
    preMarketPrice: {},
    exchangeDataDelayedBy: 0,
    toCurrency: null,
    postMarketChange: {
      raw: 1.7600098,
      fmt: "1.76",
    },
    postMarketPrice: {
      raw: 305.5,
      fmt: "305.50",
    },
    exchangeName: "NasdaqGS",
    preMarketChange: {},
    circulatingSupply: {},
    regularMarketDayLow: {
      raw: 301.97,
      fmt: "301.97",
    },
    priceHint: {
      raw: 2,
      fmt: "2",
      longFmt: "2",
    },
    currency: "USD",
    regularMarketPrice: {
      raw: 303.74,
      fmt: "303.74",
    },
    regularMarketVolume: {
      raw: 28803764,
      fmt: "28.80M",
      longFmt: "28,803,764.00",
    },
    lastMarket: null,
    regularMarketSource: "FREE_REALTIME",
    openInterest: {},
    marketState: "PREPRE",
    underlyingSymbol: null,
    marketCap: {
      raw: 1316509319168,
      fmt: "1.32T",
      longFmt: "1,316,509,319,168.00",
    },
    quoteType: "EQUITY",
    volumeAllCurrencies: {},
    postMarketSource: "FREE_REALTIME",
    strikePrice: {},
    symbol: "AAPL",
    postMarketChangePercent: {
      raw: 0.005794462,
      fmt: "0.58%",
    },
    preMarketSource: "FREE_REALTIME",
    maxAge: 1,
    fromCurrency: null,
    regularMarketChangePercent: {
      raw: 0.010344894,
      fmt: "1.03%",
    },
  },
  incomeStatementHistoryQuarterly: {
    incomeStatementHistory: [
      {
        researchDevelopment: {
          raw: 4565000000,
          fmt: "4.57B",
          longFmt: "4,565,000,000",
        },
        effectOfAccountingCharges: {},
        incomeBeforeTax: {
          raw: 13135000000,
          fmt: "13.13B",
          longFmt: "13,135,000,000",
        },
        minorityInterest: {},
        netIncome: {
          raw: 11249000000,
          fmt: "11.25B",
          longFmt: "11,249,000,000",
        },
        sellingGeneralAdministrative: {
          raw: 4952000000,
          fmt: "4.95B",
          longFmt: "4,952,000,000",
        },
        grossProfit: {
          raw: 22370000000,
          fmt: "22.37B",
          longFmt: "22,370,000,000",
        },
        ebit: {
          raw: 12853000000,
          fmt: "12.85B",
          longFmt: "12,853,000,000",
        },
        endDate: {
          raw: 1585353600,
          fmt: "2020-03-28",
        },
        operatingIncome: {
          raw: 12853000000,
          fmt: "12.85B",
          longFmt: "12,853,000,000",
        },
        otherOperatingExpenses: {},
        interestExpense: {
          raw: -757000000,
          fmt: "-757M",
          longFmt: "-757,000,000",
        },
        extraordinaryItems: {},
        nonRecurring: {},
        otherItems: {},
        incomeTaxExpense: {
          raw: 1886000000,
          fmt: "1.89B",
          longFmt: "1,886,000,000",
        },
        totalRevenue: {
          raw: 58313000000,
          fmt: "58.31B",
          longFmt: "58,313,000,000",
        },
        totalOperatingExpenses: {
          raw: 45460000000,
          fmt: "45.46B",
          longFmt: "45,460,000,000",
        },
        costOfRevenue: {
          raw: 35943000000,
          fmt: "35.94B",
          longFmt: "35,943,000,000",
        },
        totalOtherIncomeExpenseNet: {
          raw: 282000000,
          fmt: "282M",
          longFmt: "282,000,000",
        },
        maxAge: 1,
        discontinuedOperations: {},
        netIncomeFromContinuingOps: {
          raw: 11249000000,
          fmt: "11.25B",
          longFmt: "11,249,000,000",
        },
        netIncomeApplicableToCommonShares: {
          raw: 11249000000,
          fmt: "11.25B",
          longFmt: "11,249,000,000",
        },
      },
      {
        researchDevelopment: {
          raw: 4451000000,
          fmt: "4.45B",
          longFmt: "4,451,000,000",
        },
        effectOfAccountingCharges: {},
        incomeBeforeTax: {
          raw: 25918000000,
          fmt: "25.92B",
          longFmt: "25,918,000,000",
        },
        minorityInterest: {},
        netIncome: {
          raw: 22236000000,
          fmt: "22.24B",
          longFmt: "22,236,000,000",
        },
        sellingGeneralAdministrative: {
          raw: 5197000000,
          fmt: "5.2B",
          longFmt: "5,197,000,000",
        },
        grossProfit: {
          raw: 35217000000,
          fmt: "35.22B",
          longFmt: "35,217,000,000",
        },
        ebit: {
          raw: 25569000000,
          fmt: "25.57B",
          longFmt: "25,569,000,000",
        },
        endDate: {
          raw: 1577491200,
          fmt: "2019-12-28",
        },
        operatingIncome: {
          raw: 25569000000,
          fmt: "25.57B",
          longFmt: "25,569,000,000",
        },
        otherOperatingExpenses: {},
        interestExpense: {
          raw: -785000000,
          fmt: "-785M",
          longFmt: "-785,000,000",
        },
        extraordinaryItems: {},
        nonRecurring: {},
        otherItems: {},
        incomeTaxExpense: {
          raw: 3682000000,
          fmt: "3.68B",
          longFmt: "3,682,000,000",
        },
        totalRevenue: {
          raw: 91819000000,
          fmt: "91.82B",
          longFmt: "91,819,000,000",
        },
        totalOperatingExpenses: {
          raw: 66250000000,
          fmt: "66.25B",
          longFmt: "66,250,000,000",
        },
        costOfRevenue: {
          raw: 56602000000,
          fmt: "56.6B",
          longFmt: "56,602,000,000",
        },
        totalOtherIncomeExpenseNet: {
          raw: 349000000,
          fmt: "349M",
          longFmt: "349,000,000",
        },
        maxAge: 1,
        discontinuedOperations: {},
        netIncomeFromContinuingOps: {
          raw: 22236000000,
          fmt: "22.24B",
          longFmt: "22,236,000,000",
        },
        netIncomeApplicableToCommonShares: {
          raw: 22236000000,
          fmt: "22.24B",
          longFmt: "22,236,000,000",
        },
      },
      {
        researchDevelopment: {
          raw: 4110000000,
          fmt: "4.11B",
          longFmt: "4,110,000,000",
        },
        effectOfAccountingCharges: {},
        incomeBeforeTax: {
          raw: 16127000000,
          fmt: "16.13B",
          longFmt: "16,127,000,000",
        },
        minorityInterest: {},
        netIncome: {
          raw: 13686000000,
          fmt: "13.69B",
          longFmt: "13,686,000,000",
        },
        sellingGeneralAdministrative: {
          raw: 4578000000,
          fmt: "4.58B",
          longFmt: "4,578,000,000",
        },
        grossProfit: {
          raw: 24313000000,
          fmt: "24.31B",
          longFmt: "24,313,000,000",
        },
        ebit: {
          raw: 15625000000,
          fmt: "15.62B",
          longFmt: "15,625,000,000",
        },
        endDate: {
          raw: 1569628800,
          fmt: "2019-09-28",
        },
        operatingIncome: {
          raw: 15625000000,
          fmt: "15.62B",
          longFmt: "15,625,000,000",
        },
        otherOperatingExpenses: {},
        interestExpense: {
          raw: -810000000,
          fmt: "-810M",
          longFmt: "-810,000,000",
        },
        extraordinaryItems: {},
        nonRecurring: {},
        otherItems: {},
        incomeTaxExpense: {
          raw: 2441000000,
          fmt: "2.44B",
          longFmt: "2,441,000,000",
        },
        totalRevenue: {
          raw: 64040000000,
          fmt: "64.04B",
          longFmt: "64,040,000,000",
        },
        totalOperatingExpenses: {
          raw: 48415000000,
          fmt: "48.41B",
          longFmt: "48,415,000,000",
        },
        costOfRevenue: {
          raw: 39727000000,
          fmt: "39.73B",
          longFmt: "39,727,000,000",
        },
        totalOtherIncomeExpenseNet: {
          raw: 502000000,
          fmt: "502M",
          longFmt: "502,000,000",
        },
        maxAge: 1,
        discontinuedOperations: {},
        netIncomeFromContinuingOps: {
          raw: 13686000000,
          fmt: "13.69B",
          longFmt: "13,686,000,000",
        },
        netIncomeApplicableToCommonShares: {
          raw: 13686000000,
          fmt: "13.69B",
          longFmt: "13,686,000,000",
        },
      },
      {
        researchDevelopment: {
          raw: 4257000000,
          fmt: "4.26B",
          longFmt: "4,257,000,000",
        },
        effectOfAccountingCharges: {},
        incomeBeforeTax: {
          raw: 11911000000,
          fmt: "11.91B",
          longFmt: "11,911,000,000",
        },
        minorityInterest: {},
        netIncome: {
          raw: 10044000000,
          fmt: "10.04B",
          longFmt: "10,044,000,000",
        },
        sellingGeneralAdministrative: {
          raw: 4426000000,
          fmt: "4.43B",
          longFmt: "4,426,000,000",
        },
        grossProfit: {
          raw: 20227000000,
          fmt: "20.23B",
          longFmt: "20,227,000,000",
        },
        ebit: {
          raw: 11544000000,
          fmt: "11.54B",
          longFmt: "11,544,000,000",
        },
        endDate: {
          raw: 1561766400,
          fmt: "2019-06-29",
        },
        operatingIncome: {
          raw: 11544000000,
          fmt: "11.54B",
          longFmt: "11,544,000,000",
        },
        otherOperatingExpenses: {},
        interestExpense: {
          raw: -866000000,
          fmt: "-866M",
          longFmt: "-866,000,000",
        },
        extraordinaryItems: {},
        nonRecurring: {},
        otherItems: {},
        incomeTaxExpense: {
          raw: 1867000000,
          fmt: "1.87B",
          longFmt: "1,867,000,000",
        },
        totalRevenue: {
          raw: 53809000000,
          fmt: "53.81B",
          longFmt: "53,809,000,000",
        },
        totalOperatingExpenses: {
          raw: 42265000000,
          fmt: "42.27B",
          longFmt: "42,265,000,000",
        },
        costOfRevenue: {
          raw: 33582000000,
          fmt: "33.58B",
          longFmt: "33,582,000,000",
        },
        totalOtherIncomeExpenseNet: {
          raw: 367000000,
          fmt: "367M",
          longFmt: "367,000,000",
        },
        maxAge: 1,
        discontinuedOperations: {},
        netIncomeFromContinuingOps: {
          raw: 10044000000,
          fmt: "10.04B",
          longFmt: "10,044,000,000",
        },
        netIncomeApplicableToCommonShares: {
          raw: 10044000000,
          fmt: "10.04B",
          longFmt: "10,044,000,000",
        },
      },
    ],
    maxAge: 86400,
  },
  incomeStatementHistory: {
    incomeStatementHistory: [
      {
        researchDevelopment: {
          raw: 16217000000,
          fmt: "16.22B",
          longFmt: "16,217,000,000",
        },
        effectOfAccountingCharges: {},
        incomeBeforeTax: {
          raw: 65737000000,
          fmt: "65.74B",
          longFmt: "65,737,000,000",
        },
        minorityInterest: {},
        netIncome: {
          raw: 55256000000,
          fmt: "55.26B",
          longFmt: "55,256,000,000",
        },
        sellingGeneralAdministrative: {
          raw: 18245000000,
          fmt: "18.25B",
          longFmt: "18,245,000,000",
        },
        grossProfit: {
          raw: 98392000000,
          fmt: "98.39B",
          longFmt: "98,392,000,000",
        },
        ebit: {
          raw: 63930000000,
          fmt: "63.93B",
          longFmt: "63,930,000,000",
        },
        endDate: {
          raw: 1569628800,
          fmt: "2019-09-28",
        },
        operatingIncome: {
          raw: 63930000000,
          fmt: "63.93B",
          longFmt: "63,930,000,000",
        },
        otherOperatingExpenses: {},
        interestExpense: {
          raw: -3576000000,
          fmt: "-3.58B",
          longFmt: "-3,576,000,000",
        },
        extraordinaryItems: {},
        nonRecurring: {},
        otherItems: {},
        incomeTaxExpense: {
          raw: 10481000000,
          fmt: "10.48B",
          longFmt: "10,481,000,000",
        },
        totalRevenue: {
          raw: 260174000000,
          fmt: "260.17B",
          longFmt: "260,174,000,000",
        },
        totalOperatingExpenses: {
          raw: 196244000000,
          fmt: "196.24B",
          longFmt: "196,244,000,000",
        },
        costOfRevenue: {
          raw: 161782000000,
          fmt: "161.78B",
          longFmt: "161,782,000,000",
        },
        totalOtherIncomeExpenseNet: {
          raw: 1807000000,
          fmt: "1.81B",
          longFmt: "1,807,000,000",
        },
        maxAge: 1,
        discontinuedOperations: {},
        netIncomeFromContinuingOps: {
          raw: 55256000000,
          fmt: "55.26B",
          longFmt: "55,256,000,000",
        },
        netIncomeApplicableToCommonShares: {
          raw: 55256000000,
          fmt: "55.26B",
          longFmt: "55,256,000,000",
        },
      },
      {
        researchDevelopment: {
          raw: 14236000000,
          fmt: "14.24B",
          longFmt: "14,236,000,000",
        },
        effectOfAccountingCharges: {},
        incomeBeforeTax: {
          raw: 72903000000,
          fmt: "72.9B",
          longFmt: "72,903,000,000",
        },
        minorityInterest: {},
        netIncome: {
          raw: 59531000000,
          fmt: "59.53B",
          longFmt: "59,531,000,000",
        },
        sellingGeneralAdministrative: {
          raw: 16705000000,
          fmt: "16.7B",
          longFmt: "16,705,000,000",
        },
        grossProfit: {
          raw: 101839000000,
          fmt: "101.84B",
          longFmt: "101,839,000,000",
        },
        ebit: {
          raw: 70898000000,
          fmt: "70.9B",
          longFmt: "70,898,000,000",
        },
        endDate: {
          raw: 1538179200,
          fmt: "2018-09-29",
        },
        operatingIncome: {
          raw: 70898000000,
          fmt: "70.9B",
          longFmt: "70,898,000,000",
        },
        otherOperatingExpenses: {},
        interestExpense: {
          raw: -3240000000,
          fmt: "-3.24B",
          longFmt: "-3,240,000,000",
        },
        extraordinaryItems: {},
        nonRecurring: {},
        otherItems: {},
        incomeTaxExpense: {
          raw: 13372000000,
          fmt: "13.37B",
          longFmt: "13,372,000,000",
        },
        totalRevenue: {
          raw: 265595000000,
          fmt: "265.6B",
          longFmt: "265,595,000,000",
        },
        totalOperatingExpenses: {
          raw: 194697000000,
          fmt: "194.7B",
          longFmt: "194,697,000,000",
        },
        costOfRevenue: {
          raw: 163756000000,
          fmt: "163.76B",
          longFmt: "163,756,000,000",
        },
        totalOtherIncomeExpenseNet: {
          raw: 2005000000,
          fmt: "2B",
          longFmt: "2,005,000,000",
        },
        maxAge: 1,
        discontinuedOperations: {},
        netIncomeFromContinuingOps: {
          raw: 59531000000,
          fmt: "59.53B",
          longFmt: "59,531,000,000",
        },
        netIncomeApplicableToCommonShares: {
          raw: 59531000000,
          fmt: "59.53B",
          longFmt: "59,531,000,000",
        },
      },
      {
        researchDevelopment: {
          raw: 11581000000,
          fmt: "11.58B",
          longFmt: "11,581,000,000",
        },
        effectOfAccountingCharges: {},
        incomeBeforeTax: {
          raw: 64089000000,
          fmt: "64.09B",
          longFmt: "64,089,000,000",
        },
        minorityInterest: {},
        netIncome: {
          raw: 48351000000,
          fmt: "48.35B",
          longFmt: "48,351,000,000",
        },
        sellingGeneralAdministrative: {
          raw: 15261000000,
          fmt: "15.26B",
          longFmt: "15,261,000,000",
        },
        grossProfit: {
          raw: 88186000000,
          fmt: "88.19B",
          longFmt: "88,186,000,000",
        },
        ebit: {
          raw: 61344000000,
          fmt: "61.34B",
          longFmt: "61,344,000,000",
        },
        endDate: {
          raw: 1506729600,
          fmt: "2017-09-30",
        },
        operatingIncome: {
          raw: 61344000000,
          fmt: "61.34B",
          longFmt: "61,344,000,000",
        },
        otherOperatingExpenses: {},
        interestExpense: {
          raw: -2323000000,
          fmt: "-2.32B",
          longFmt: "-2,323,000,000",
        },
        extraordinaryItems: {},
        nonRecurring: {},
        otherItems: {},
        incomeTaxExpense: {
          raw: 15738000000,
          fmt: "15.74B",
          longFmt: "15,738,000,000",
        },
        totalRevenue: {
          raw: 229234000000,
          fmt: "229.23B",
          longFmt: "229,234,000,000",
        },
        totalOperatingExpenses: {
          raw: 167890000000,
          fmt: "167.89B",
          longFmt: "167,890,000,000",
        },
        costOfRevenue: {
          raw: 141048000000,
          fmt: "141.05B",
          longFmt: "141,048,000,000",
        },
        totalOtherIncomeExpenseNet: {
          raw: 2745000000,
          fmt: "2.75B",
          longFmt: "2,745,000,000",
        },
        maxAge: 1,
        discontinuedOperations: {},
        netIncomeFromContinuingOps: {
          raw: 48351000000,
          fmt: "48.35B",
          longFmt: "48,351,000,000",
        },
        netIncomeApplicableToCommonShares: {
          raw: 48351000000,
          fmt: "48.35B",
          longFmt: "48,351,000,000",
        },
      },
      {
        researchDevelopment: {
          raw: 10045000000,
          fmt: "10.04B",
          longFmt: "10,045,000,000",
        },
        effectOfAccountingCharges: {},
        incomeBeforeTax: {
          raw: 61372000000,
          fmt: "61.37B",
          longFmt: "61,372,000,000",
        },
        minorityInterest: {},
        netIncome: {
          raw: 45687000000,
          fmt: "45.69B",
          longFmt: "45,687,000,000",
        },
        sellingGeneralAdministrative: {
          raw: 14194000000,
          fmt: "14.19B",
          longFmt: "14,194,000,000",
        },
        grossProfit: {
          raw: 84263000000,
          fmt: "84.26B",
          longFmt: "84,263,000,000",
        },
        ebit: {
          raw: 60024000000,
          fmt: "60.02B",
          longFmt: "60,024,000,000",
        },
        endDate: {
          raw: 1474675200,
          fmt: "2016-09-24",
        },
        operatingIncome: {
          raw: 60024000000,
          fmt: "60.02B",
          longFmt: "60,024,000,000",
        },
        otherOperatingExpenses: {},
        interestExpense: {
          raw: -1456000000,
          fmt: "-1.46B",
          longFmt: "-1,456,000,000",
        },
        extraordinaryItems: {},
        nonRecurring: {},
        otherItems: {},
        incomeTaxExpense: {
          raw: 15685000000,
          fmt: "15.69B",
          longFmt: "15,685,000,000",
        },
        totalRevenue: {
          raw: 215639000000,
          fmt: "215.64B",
          longFmt: "215,639,000,000",
        },
        totalOperatingExpenses: {
          raw: 155615000000,
          fmt: "155.62B",
          longFmt: "155,615,000,000",
        },
        costOfRevenue: {
          raw: 131376000000,
          fmt: "131.38B",
          longFmt: "131,376,000,000",
        },
        totalOtherIncomeExpenseNet: {
          raw: 1348000000,
          fmt: "1.35B",
          longFmt: "1,348,000,000",
        },
        maxAge: 1,
        discontinuedOperations: {},
        netIncomeFromContinuingOps: {
          raw: 45687000000,
          fmt: "45.69B",
          longFmt: "45,687,000,000",
        },
        netIncomeApplicableToCommonShares: {
          raw: 45687000000,
          fmt: "45.69B",
          longFmt: "45,687,000,000",
        },
      },
    ],
    maxAge: 86400,
  },
  balanceSheetHistory: {
    balanceSheetStatements: [
      {
        totalLiab: {
          raw: 248028000000,
          fmt: "248.03B",
          longFmt: "248,028,000,000",
        },
        totalStockholderEquity: {
          raw: 90488000000,
          fmt: "90.49B",
          longFmt: "90,488,000,000",
        },
        otherCurrentLiab: {
          raw: 43242000000,
          fmt: "43.24B",
          longFmt: "43,242,000,000",
        },
        totalAssets: {
          raw: 338516000000,
          fmt: "338.52B",
          longFmt: "338,516,000,000",
        },
        endDate: {
          raw: 1569628800,
          fmt: "2019-09-28",
        },
        commonStock: {
          raw: 45174000000,
          fmt: "45.17B",
          longFmt: "45,174,000,000",
        },
        otherCurrentAssets: {
          raw: 12352000000,
          fmt: "12.35B",
          longFmt: "12,352,000,000",
        },
        retainedEarnings: {
          raw: 45898000000,
          fmt: "45.9B",
          longFmt: "45,898,000,000",
        },
        otherLiab: {
          raw: 50503000000,
          fmt: "50.5B",
          longFmt: "50,503,000,000",
        },
        treasuryStock: {
          raw: -584000000,
          fmt: "-584M",
          longFmt: "-584,000,000",
        },
        otherAssets: {
          raw: 32978000000,
          fmt: "32.98B",
          longFmt: "32,978,000,000",
        },
        cash: {
          raw: 48844000000,
          fmt: "48.84B",
          longFmt: "48,844,000,000",
        },
        totalCurrentLiabilities: {
          raw: 105718000000,
          fmt: "105.72B",
          longFmt: "105,718,000,000",
        },
        shortLongTermDebt: {
          raw: 10260000000,
          fmt: "10.26B",
          longFmt: "10,260,000,000",
        },
        otherStockholderEquity: {
          raw: -584000000,
          fmt: "-584M",
          longFmt: "-584,000,000",
        },
        propertyPlantEquipment: {
          raw: 37378000000,
          fmt: "37.38B",
          longFmt: "37,378,000,000",
        },
        totalCurrentAssets: {
          raw: 162819000000,
          fmt: "162.82B",
          longFmt: "162,819,000,000",
        },
        longTermInvestments: {
          raw: 105341000000,
          fmt: "105.34B",
          longFmt: "105,341,000,000",
        },
        netTangibleAssets: {
          raw: 90488000000,
          fmt: "90.49B",
          longFmt: "90,488,000,000",
        },
        shortTermInvestments: {
          raw: 51713000000,
          fmt: "51.71B",
          longFmt: "51,713,000,000",
        },
        netReceivables: {
          raw: 45804000000,
          fmt: "45.8B",
          longFmt: "45,804,000,000",
        },
        maxAge: 1,
        longTermDebt: {
          raw: 91807000000,
          fmt: "91.81B",
          longFmt: "91,807,000,000",
        },
        inventory: {
          raw: 4106000000,
          fmt: "4.11B",
          longFmt: "4,106,000,000",
        },
        accountsPayable: {
          raw: 46236000000,
          fmt: "46.24B",
          longFmt: "46,236,000,000",
        },
      },
      {
        totalLiab: {
          raw: 258578000000,
          fmt: "258.58B",
          longFmt: "258,578,000,000",
        },
        totalStockholderEquity: {
          raw: 107147000000,
          fmt: "107.15B",
          longFmt: "107,147,000,000",
        },
        otherCurrentLiab: {
          raw: 39293000000,
          fmt: "39.29B",
          longFmt: "39,293,000,000",
        },
        totalAssets: {
          raw: 365725000000,
          fmt: "365.73B",
          longFmt: "365,725,000,000",
        },
        endDate: {
          raw: 1538179200,
          fmt: "2018-09-29",
        },
        commonStock: {
          raw: 40201000000,
          fmt: "40.2B",
          longFmt: "40,201,000,000",
        },
        otherCurrentAssets: {
          raw: 12087000000,
          fmt: "12.09B",
          longFmt: "12,087,000,000",
        },
        retainedEarnings: {
          raw: 70400000000,
          fmt: "70.4B",
          longFmt: "70,400,000,000",
        },
        otherLiab: {
          raw: 48914000000,
          fmt: "48.91B",
          longFmt: "48,914,000,000",
        },
        treasuryStock: {
          raw: -3454000000,
          fmt: "-3.45B",
          longFmt: "-3,454,000,000",
        },
        otherAssets: {
          raw: 22283000000,
          fmt: "22.28B",
          longFmt: "22,283,000,000",
        },
        cash: {
          raw: 25913000000,
          fmt: "25.91B",
          longFmt: "25,913,000,000",
        },
        totalCurrentLiabilities: {
          raw: 115929000000,
          fmt: "115.93B",
          longFmt: "115,929,000,000",
        },
        shortLongTermDebt: {
          raw: 8784000000,
          fmt: "8.78B",
          longFmt: "8,784,000,000",
        },
        otherStockholderEquity: {
          raw: -3454000000,
          fmt: "-3.45B",
          longFmt: "-3,454,000,000",
        },
        propertyPlantEquipment: {
          raw: 41304000000,
          fmt: "41.3B",
          longFmt: "41,304,000,000",
        },
        totalCurrentAssets: {
          raw: 131339000000,
          fmt: "131.34B",
          longFmt: "131,339,000,000",
        },
        longTermInvestments: {
          raw: 170799000000,
          fmt: "170.8B",
          longFmt: "170,799,000,000",
        },
        netTangibleAssets: {
          raw: 107147000000,
          fmt: "107.15B",
          longFmt: "107,147,000,000",
        },
        shortTermInvestments: {
          raw: 40388000000,
          fmt: "40.39B",
          longFmt: "40,388,000,000",
        },
        netReceivables: {
          raw: 48995000000,
          fmt: "48.99B",
          longFmt: "48,995,000,000",
        },
        maxAge: 1,
        longTermDebt: {
          raw: 93735000000,
          fmt: "93.73B",
          longFmt: "93,735,000,000",
        },
        inventory: {
          raw: 3956000000,
          fmt: "3.96B",
          longFmt: "3,956,000,000",
        },
        accountsPayable: {
          raw: 55888000000,
          fmt: "55.89B",
          longFmt: "55,888,000,000",
        },
      },
      {
        totalLiab: {
          raw: 241272000000,
          fmt: "241.27B",
          longFmt: "241,272,000,000",
        },
        totalStockholderEquity: {
          raw: 134047000000,
          fmt: "134.05B",
          longFmt: "134,047,000,000",
        },
        otherCurrentLiab: {
          raw: 38099000000,
          fmt: "38.1B",
          longFmt: "38,099,000,000",
        },
        totalAssets: {
          raw: 375319000000,
          fmt: "375.32B",
          longFmt: "375,319,000,000",
        },
        endDate: {
          raw: 1506729600,
          fmt: "2017-09-30",
        },
        commonStock: {
          raw: 35867000000,
          fmt: "35.87B",
          longFmt: "35,867,000,000",
        },
        otherCurrentAssets: {
          raw: 13936000000,
          fmt: "13.94B",
          longFmt: "13,936,000,000",
        },
        retainedEarnings: {
          raw: 98330000000,
          fmt: "98.33B",
          longFmt: "98,330,000,000",
        },
        otherLiab: {
          raw: 43251000000,
          fmt: "43.25B",
          longFmt: "43,251,000,000",
        },
        treasuryStock: {
          raw: -150000000,
          fmt: "-150M",
          longFmt: "-150,000,000",
        },
        otherAssets: {
          raw: 18177000000,
          fmt: "18.18B",
          longFmt: "18,177,000,000",
        },
        cash: {
          raw: 20289000000,
          fmt: "20.29B",
          longFmt: "20,289,000,000",
        },
        totalCurrentLiabilities: {
          raw: 100814000000,
          fmt: "100.81B",
          longFmt: "100,814,000,000",
        },
        shortLongTermDebt: {
          raw: 6496000000,
          fmt: "6.5B",
          longFmt: "6,496,000,000",
        },
        otherStockholderEquity: {
          raw: -150000000,
          fmt: "-150M",
          longFmt: "-150,000,000",
        },
        propertyPlantEquipment: {
          raw: 33783000000,
          fmt: "33.78B",
          longFmt: "33,783,000,000",
        },
        totalCurrentAssets: {
          raw: 128645000000,
          fmt: "128.65B",
          longFmt: "128,645,000,000",
        },
        longTermInvestments: {
          raw: 194714000000,
          fmt: "194.71B",
          longFmt: "194,714,000,000",
        },
        netTangibleAssets: {
          raw: 134047000000,
          fmt: "134.05B",
          longFmt: "134,047,000,000",
        },
        shortTermInvestments: {
          raw: 53892000000,
          fmt: "53.89B",
          longFmt: "53,892,000,000",
        },
        netReceivables: {
          raw: 35673000000,
          fmt: "35.67B",
          longFmt: "35,673,000,000",
        },
        maxAge: 1,
        longTermDebt: {
          raw: 97207000000,
          fmt: "97.21B",
          longFmt: "97,207,000,000",
        },
        inventory: {
          raw: 4855000000,
          fmt: "4.86B",
          longFmt: "4,855,000,000",
        },
        accountsPayable: {
          raw: 44242000000,
          fmt: "44.24B",
          longFmt: "44,242,000,000",
        },
      },
      {
        intangibleAssets: {
          raw: 3206000000,
          fmt: "3.21B",
          longFmt: "3,206,000,000",
        },
        totalLiab: {
          raw: 193437000000,
          fmt: "193.44B",
          longFmt: "193,437,000,000",
        },
        totalStockholderEquity: {
          raw: 128249000000,
          fmt: "128.25B",
          longFmt: "128,249,000,000",
        },
        otherCurrentLiab: {
          raw: 8243000000,
          fmt: "8.24B",
          longFmt: "8,243,000,000",
        },
        totalAssets: {
          raw: 321686000000,
          fmt: "321.69B",
          longFmt: "321,686,000,000",
        },
        endDate: {
          raw: 1474675200,
          fmt: "2016-09-24",
        },
        commonStock: {
          raw: 31251000000,
          fmt: "31.25B",
          longFmt: "31,251,000,000",
        },
        otherCurrentAssets: {
          raw: 8283000000,
          fmt: "8.28B",
          longFmt: "8,283,000,000",
        },
        retainedEarnings: {
          raw: 96364000000,
          fmt: "96.36B",
          longFmt: "96,364,000,000",
        },
        otherLiab: {
          raw: 39004000000,
          fmt: "39B",
          longFmt: "39,004,000,000",
        },
        goodWill: {
          raw: 5414000000,
          fmt: "5.41B",
          longFmt: "5,414,000,000",
        },
        treasuryStock: {
          raw: 634000000,
          fmt: "634M",
          longFmt: "634,000,000",
        },
        otherAssets: {
          raw: 8757000000,
          fmt: "8.76B",
          longFmt: "8,757,000,000",
        },
        cash: {
          raw: 20484000000,
          fmt: "20.48B",
          longFmt: "20,484,000,000",
        },
        totalCurrentLiabilities: {
          raw: 79006000000,
          fmt: "79.01B",
          longFmt: "79,006,000,000",
        },
        shortLongTermDebt: {
          raw: 3500000000,
          fmt: "3.5B",
          longFmt: "3,500,000,000",
        },
        otherStockholderEquity: {
          raw: 634000000,
          fmt: "634M",
          longFmt: "634,000,000",
        },
        propertyPlantEquipment: {
          raw: 27010000000,
          fmt: "27.01B",
          longFmt: "27,010,000,000",
        },
        totalCurrentAssets: {
          raw: 106869000000,
          fmt: "106.87B",
          longFmt: "106,869,000,000",
        },
        longTermInvestments: {
          raw: 170430000000,
          fmt: "170.43B",
          longFmt: "170,430,000,000",
        },
        netTangibleAssets: {
          raw: 119629000000,
          fmt: "119.63B",
          longFmt: "119,629,000,000",
        },
        shortTermInvestments: {
          raw: 46671000000,
          fmt: "46.67B",
          longFmt: "46,671,000,000",
        },
        netReceivables: {
          raw: 29299000000,
          fmt: "29.3B",
          longFmt: "29,299,000,000",
        },
        maxAge: 1,
        longTermDebt: {
          raw: 75427000000,
          fmt: "75.43B",
          longFmt: "75,427,000,000",
        },
        inventory: {
          raw: 2132000000,
          fmt: "2.13B",
          longFmt: "2,132,000,000",
        },
        accountsPayable: {
          raw: 37294000000,
          fmt: "37.29B",
          longFmt: "37,294,000,000",
        },
      },
    ],
    maxAge: 86400,
  },
  cashflowStatementHistoryQuarterly: {
    cashflowStatements: [
      {
        investments: {
          raw: 11338000000,
          fmt: "11.34B",
          longFmt: "11,338,000,000",
        },
        changeToLiabilities: {
          raw: -12193000000,
          fmt: "-12.19B",
          longFmt: "-12,193,000,000",
        },
        totalCashflowsFromInvestingActivities: {
          raw: 9013000000,
          fmt: "9.01B",
          longFmt: "9,013,000,000",
        },
        netBorrowings: {
          raw: 803000000,
          fmt: "803M",
          longFmt: "803,000,000",
        },
        totalCashFromFinancingActivities: {
          raw: -20940000000,
          fmt: "-20.94B",
          longFmt: "-20,940,000,000",
        },
        changeToOperatingActivities: {
          raw: 4195000000,
          fmt: "4.2B",
          longFmt: "4,195,000,000",
        },
        issuanceOfStock: {
          raw: 428000000,
          fmt: "428M",
          longFmt: "428,000,000",
        },
        netIncome: {
          raw: 11249000000,
          fmt: "11.25B",
          longFmt: "11,249,000,000",
        },
        changeInCash: {
          raw: 1384000000,
          fmt: "1.38B",
          longFmt: "1,384,000,000",
        },
        endDate: {
          raw: 1585353600,
          fmt: "2020-03-28",
        },
        repurchaseOfStock: {
          raw: -18761000000,
          fmt: "-18.76B",
          longFmt: "-18,761,000,000",
        },
        totalCashFromOperatingActivities: {
          raw: 13311000000,
          fmt: "13.31B",
          longFmt: "13,311,000,000",
        },
        depreciation: {
          raw: 2786000000,
          fmt: "2.79B",
          longFmt: "2,786,000,000",
        },
        otherCashflowsFromInvestingActivities: {
          raw: -296000000,
          fmt: "-296M",
          longFmt: "-296,000,000",
        },
        dividendsPaid: {
          raw: -3375000000,
          fmt: "-3.38B",
          longFmt: "-3,375,000,000",
        },
        changeToInventory: {
          raw: 727000000,
          fmt: "727M",
          longFmt: "727,000,000",
        },
        changeToAccountReceivables: {
          raw: 5269000000,
          fmt: "5.27B",
          longFmt: "5,269,000,000",
        },
        otherCashflowsFromFinancingActivities: {
          raw: -35000000,
          fmt: "-35M",
          longFmt: "-35,000,000",
        },
        maxAge: 1,
        changeToNetincome: {
          raw: 1278000000,
          fmt: "1.28B",
          longFmt: "1,278,000,000",
        },
        capitalExpenditures: {
          raw: -1853000000,
          fmt: "-1.85B",
          longFmt: "-1,853,000,000",
        },
      },
      {
        investments: {
          raw: -10473000000,
          fmt: "-10.47B",
          longFmt: "-10,473,000,000",
        },
        changeToLiabilities: {
          raw: -104000000,
          fmt: "-104M",
          longFmt: "-104,000,000",
        },
        totalCashflowsFromInvestingActivities: {
          raw: -13668000000,
          fmt: "-13.67B",
          longFmt: "-13,668,000,000",
        },
        netBorrowings: {
          raw: 231000000,
          fmt: "231M",
          longFmt: "231,000,000",
        },
        totalCashFromFinancingActivities: {
          raw: -25407000000,
          fmt: "-25.41B",
          longFmt: "-25,407,000,000",
        },
        changeToOperatingActivities: {
          raw: 2362000000,
          fmt: "2.36B",
          longFmt: "2,362,000,000",
        },
        issuanceOfStock: {
          raw: 2000000,
          fmt: "2M",
          longFmt: "2,000,000",
        },
        netIncome: {
          raw: 22236000000,
          fmt: "22.24B",
          longFmt: "22,236,000,000",
        },
        changeInCash: {
          raw: -8559000000,
          fmt: "-8.56B",
          longFmt: "-8,559,000,000",
        },
        endDate: {
          raw: 1577491200,
          fmt: "2019-12-28",
        },
        repurchaseOfStock: {
          raw: -22085000000,
          fmt: "-22.09B",
          longFmt: "-22,085,000,000",
        },
        totalCashFromOperatingActivities: {
          raw: 30516000000,
          fmt: "30.52B",
          longFmt: "30,516,000,000",
        },
        depreciation: {
          raw: 2816000000,
          fmt: "2.82B",
          longFmt: "2,816,000,000",
        },
        otherCashflowsFromInvestingActivities: {
          raw: -130000000,
          fmt: "-130M",
          longFmt: "-130,000,000",
        },
        dividendsPaid: {
          raw: -3539000000,
          fmt: "-3.54B",
          longFmt: "-3,539,000,000",
        },
        changeToInventory: {
          raw: -28000000,
          fmt: "-28M",
          longFmt: "-28,000,000",
        },
        changeToAccountReceivables: {
          raw: 2015000000,
          fmt: "2.02B",
          longFmt: "2,015,000,000",
        },
        otherCashflowsFromFinancingActivities: {
          raw: -16000000,
          fmt: "-16M",
          longFmt: "-16,000,000",
        },
        maxAge: 1,
        changeToNetincome: {
          raw: 1219000000,
          fmt: "1.22B",
          longFmt: "1,219,000,000",
        },
        capitalExpenditures: {
          raw: -2107000000,
          fmt: "-2.11B",
          longFmt: "-2,107,000,000",
        },
      },
      {
        investments: {
          raw: 2802000000,
          fmt: "2.8B",
          longFmt: "2,802,000,000",
        },
        changeToLiabilities: {
          raw: 18032000000,
          fmt: "18.03B",
          longFmt: "18,032,000,000",
        },
        totalCashflowsFromInvestingActivities: {
          raw: -798000000,
          fmt: "-798M",
          longFmt: "-798,000,000",
        },
        netBorrowings: {
          raw: -293000000,
          fmt: "-293M",
          longFmt: "-293,000,000",
        },
        totalCashFromFinancingActivities: {
          raw: -21039000000,
          fmt: "-21.04B",
          longFmt: "-21,039,000,000",
        },
        changeToOperatingActivities: {
          raw: -6319000000,
          fmt: "-6.32B",
          longFmt: "-6,319,000,000",
        },
        issuanceOfStock: {
          raw: 390000000,
          fmt: "390M",
          longFmt: "390,000,000",
        },
        netIncome: {
          raw: 13686000000,
          fmt: "13.69B",
          longFmt: "13,686,000,000",
        },
        changeInCash: {
          raw: -1927000000,
          fmt: "-1.93B",
          longFmt: "-1,927,000,000",
        },
        endDate: {
          raw: 1569628800,
          fmt: "2019-09-28",
        },
        repurchaseOfStock: {
          raw: -17635000000,
          fmt: "-17.64B",
          longFmt: "-17,635,000,000",
        },
        totalCashFromOperatingActivities: {
          raw: 19910000000,
          fmt: "19.91B",
          longFmt: "19,910,000,000",
        },
        depreciation: {
          raw: 3179000000,
          fmt: "3.18B",
          longFmt: "3,179,000,000",
        },
        otherCashflowsFromInvestingActivities: {
          raw: -810000000,
          fmt: "-810M",
          longFmt: "-810,000,000",
        },
        dividendsPaid: {
          raw: -3479000000,
          fmt: "-3.48B",
          longFmt: "-3,479,000,000",
        },
        changeToInventory: {
          raw: -785000000,
          fmt: "-785M",
          longFmt: "-785,000,000",
        },
        changeToAccountReceivables: {
          raw: -8768000000,
          fmt: "-8.77B",
          longFmt: "-8,768,000,000",
        },
        otherCashflowsFromFinancingActivities: {
          raw: -22000000,
          fmt: "-22M",
          longFmt: "-22,000,000",
        },
        maxAge: 1,
        changeToNetincome: {
          raw: 885000000,
          fmt: "885M",
          longFmt: "885,000,000",
        },
        capitalExpenditures: {
          raw: -2777000000,
          fmt: "-2.78B",
          longFmt: "-2,777,000,000",
        },
      },
      {
        investments: {
          raw: 30120000000,
          fmt: "30.12B",
          longFmt: "30,120,000,000",
        },
        changeToLiabilities: {
          raw: -16000000,
          fmt: "-16M",
          longFmt: "-16,000,000",
        },
        totalCashflowsFromInvestingActivities: {
          raw: 27502000000,
          fmt: "27.5B",
          longFmt: "27,502,000,000",
        },
        netBorrowings: {
          raw: -5026000000,
          fmt: "-5.03B",
          longFmt: "-5,026,000,000",
        },
        totalCashFromFinancingActivities: {
          raw: -26804000000,
          fmt: "-26.8B",
          longFmt: "-26,804,000,000",
        },
        changeToOperatingActivities: {
          raw: -5203000000,
          fmt: "-5.2B",
          longFmt: "-5,203,000,000",
        },
        issuanceOfStock: {
          raw: 1000000,
          fmt: "1M",
          longFmt: "1,000,000",
        },
        netIncome: {
          raw: 10044000000,
          fmt: "10.04B",
          longFmt: "10,044,000,000",
        },
        changeInCash: {
          raw: 12334000000,
          fmt: "12.33B",
          longFmt: "12,334,000,000",
        },
        endDate: {
          raw: 1561766400,
          fmt: "2019-06-29",
        },
        repurchaseOfStock: {
          raw: -18154000000,
          fmt: "-18.15B",
          longFmt: "-18,154,000,000",
        },
        totalCashFromOperatingActivities: {
          raw: 11636000000,
          fmt: "11.64B",
          longFmt: "11,636,000,000",
        },
        depreciation: {
          raw: 2933000000,
          fmt: "2.93B",
          longFmt: "2,933,000,000",
        },
        otherCashflowsFromInvestingActivities: {
          raw: -298000000,
          fmt: "-298M",
          longFmt: "-298,000,000",
        },
        dividendsPaid: {
          raw: -3629000000,
          fmt: "-3.63B",
          longFmt: "-3,629,000,000",
        },
        changeToInventory: {
          raw: 1502000000,
          fmt: "1.5B",
          longFmt: "1,502,000,000",
        },
        changeToAccountReceivables: {
          raw: 919000000,
          fmt: "919M",
          longFmt: "919,000,000",
        },
        otherCashflowsFromFinancingActivities: {
          raw: 4000000,
          fmt: "4M",
          longFmt: "4,000,000",
        },
        maxAge: 1,
        changeToNetincome: {
          raw: 1457000000,
          fmt: "1.46B",
          longFmt: "1,457,000,000",
        },
        capitalExpenditures: {
          raw: -2000000000,
          fmt: "-2B",
          longFmt: "-2,000,000,000",
        },
      },
    ],
    maxAge: 86400,
  },
  quoteType: {
    exchange: "NMS",
    shortName: "Apple Inc.",
    longName: "Apple Inc.",
    exchangeTimezoneName: "America/New_York",
    exchangeTimezoneShortName: "EDT",
    isEsgPopulated: false,
    gmtOffSetMilliseconds: "-14400000",
    quoteType: "EQUITY",
    symbol: "AAPL",
    messageBoardId: "finmb_24937",
    market: "us_market",
  },
  summaryDetail: {
    previousClose: {
      raw: 300.63,
      fmt: "300.63",
    },
    regularMarketOpen: {
      raw: 303.22,
      fmt: "303.22",
    },
    twoHundredDayAverage: {
      raw: 280.25037,
      fmt: "280.25",
    },
    trailingAnnualDividendYield: {
      raw: 0.010245152,
      fmt: "1.02%",
    },
    payoutRatio: {
      raw: 0.2408,
      fmt: "24.08%",
    },
    volume24Hr: {},
    regularMarketDayHigh: {
      raw: 305.17,
      fmt: "305.17",
    },
    navPrice: {},
    averageDailyVolume10Day: {
      raw: 37928337,
      fmt: "37.93M",
      longFmt: "37,928,337",
    },
    totalAssets: {},
    regularMarketPreviousClose: {
      raw: 300.63,
      fmt: "300.63",
    },
    fiftyDayAverage: {
      raw: 267.2363,
      fmt: "267.24",
    },
    trailingAnnualDividendRate: {
      raw: 3.08,
      fmt: "3.08",
    },
    open: {
      raw: 303.22,
      fmt: "303.22",
    },
    toCurrency: null,
    averageVolume10days: {
      raw: 37928337,
      fmt: "37.93M",
      longFmt: "37,928,337",
    },
    expireDate: {},
    yield: {},
    algorithm: null,
    dividendRate: {
      raw: 3.28,
      fmt: "3.28",
    },
    exDividendDate: {
      raw: 1588896000,
      fmt: "2020-05-08",
    },
    beta: {
      raw: 1.170428,
      fmt: "1.17",
    },
    circulatingSupply: {},
    startDate: {},
    regularMarketDayLow: {
      raw: 301.97,
      fmt: "301.97",
    },
    priceHint: {
      raw: 2,
      fmt: "2",
      longFmt: "2",
    },
    currency: "USD",
    trailingPE: {
      raw: 23.863922,
      fmt: "23.86",
    },
    regularMarketVolume: {
      raw: 28803764,
      fmt: "28.8M",
      longFmt: "28,803,764",
    },
    lastMarket: null,
    maxSupply: {},
    openInterest: {},
    marketCap: {
      raw: 1316509319168,
      fmt: "1.32T",
      longFmt: "1,316,509,319,168",
    },
    volumeAllCurrencies: {},
    strikePrice: {},
    averageVolume: {
      raw: 51191379,
      fmt: "51.19M",
      longFmt: "51,191,379",
    },
    priceToSalesTrailing12Months: {
      raw: 4.9126964,
      fmt: "4.91",
    },
    dayLow: {
      raw: 301.97,
      fmt: "301.97",
    },
    ask: {
      raw: 0,
      fmt: "0.00",
    },
    ytdReturn: {},
    askSize: {
      raw: 3100,
      fmt: "3.1k",
      longFmt: "3,100",
    },
    volume: {
      raw: 28803764,
      fmt: "28.8M",
      longFmt: "28,803,764",
    },
    fiftyTwoWeekHigh: {
      raw: 327.85,
      fmt: "327.85",
    },
    forwardPE: {
      raw: 20.620502,
      fmt: "20.62",
    },
    maxAge: 1,
    fromCurrency: null,
    fiveYearAvgDividendYield: {
      raw: 1.59,
      fmt: "1.59",
    },
    fiftyTwoWeekLow: {
      raw: 170.27,
      fmt: "170.27",
    },
    bid: {
      raw: 0,
      fmt: "0.00",
    },
    tradeable: false,
    dividendYield: {
      raw: 0.0109,
      fmt: "1.09%",
    },
    bidSize: {
      raw: 900,
      fmt: "900",
      longFmt: "900",
    },
    dayHigh: {
      raw: 305.17,
      fmt: "305.17",
    },
  },
  symbol: "AAPL",
  pageViews: {
    shortTermTrend: "UP",
    midTermTrend: "UP",
    longTermTrend: "UP",
    maxAge: 1,
  },
  timeSeries: {
    annualNetIncomeContinuousOperations: [
      {
        dataId: 20094,
        asOfDate: "2016-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 45687000000,
          fmt: "45.69B",
        },
      },
      {
        dataId: 20094,
        asOfDate: "2017-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 48351000000,
          fmt: "48.35B",
        },
      },
      {
        dataId: 20094,
        asOfDate: "2018-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 59531000000,
          fmt: "59.53B",
        },
      },
      {
        dataId: 20094,
        asOfDate: "2019-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 55256000000,
          fmt: "55.26B",
        },
      },
    ],
    annualTotalRevenue: [
      {
        dataId: 20100,
        asOfDate: "2016-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 215639000000,
          fmt: "215.64B",
        },
      },
      {
        dataId: 20100,
        asOfDate: "2017-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 229234000000,
          fmt: "229.23B",
        },
      },
      {
        dataId: 20100,
        asOfDate: "2018-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 265595000000,
          fmt: "265.60B",
        },
      },
      {
        dataId: 20100,
        asOfDate: "2019-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 260174000000,
          fmt: "260.17B",
        },
      },
    ],
    trailingNetIncomeCommonStockholders: [
      {
        dataId: 20093,
        asOfDate: "2020-03-31",
        periodType: "TTM",
        currencyCode: "USD",
        reportedValue: {
          raw: 57215000000,
          fmt: "57.22B",
        },
      },
    ],
    trailingResearchAndDevelopment: [
      {
        dataId: 20151,
        asOfDate: "2020-03-31",
        periodType: "TTM",
        currencyCode: "USD",
        reportedValue: {
          raw: 17383000000,
          fmt: "17.38B",
        },
      },
    ],
    annualResearchAndDevelopment: [
      {
        dataId: 20151,
        asOfDate: "2016-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 10045000000,
          fmt: "10.04B",
        },
      },
      {
        dataId: 20151,
        asOfDate: "2017-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 11581000000,
          fmt: "11.58B",
        },
      },
      {
        dataId: 20151,
        asOfDate: "2018-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 14236000000,
          fmt: "14.24B",
        },
      },
      {
        dataId: 20151,
        asOfDate: "2019-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 16217000000,
          fmt: "16.22B",
        },
      },
    ],
    annualCostOfRevenue: [
      {
        dataId: 20013,
        asOfDate: "2016-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 131376000000,
          fmt: "131.38B",
        },
      },
      {
        dataId: 20013,
        asOfDate: "2017-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 141048000000,
          fmt: "141.05B",
        },
      },
      {
        dataId: 20013,
        asOfDate: "2018-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 163756000000,
          fmt: "163.76B",
        },
      },
      {
        dataId: 20013,
        asOfDate: "2019-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 161782000000,
          fmt: "161.78B",
        },
      },
    ],
    trailingOperatingIncome: [
      {
        dataId: 20109,
        asOfDate: "2020-03-31",
        periodType: "TTM",
        currencyCode: "USD",
        reportedValue: {
          raw: 65591000000,
          fmt: "65.59B",
        },
      },
    ],
    trailingCostOfRevenue: [
      {
        dataId: 20013,
        asOfDate: "2020-03-31",
        periodType: "TTM",
        currencyCode: "USD",
        reportedValue: {
          raw: 165854000000,
          fmt: "165.85B",
        },
      },
    ],
    trailingOtherIncomeExpense: [
      {
        dataId: 20117,
        asOfDate: "2020-03-31",
        periodType: "TTM",
        currencyCode: "USD",
        reportedValue: {
          raw: 328000000,
          fmt: "328.00M",
        },
      },
    ],
    annualBasicAverageShares: [
      {
        dataId: 29010,
        asOfDate: "2016-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 5470820000,
          fmt: "5.47B",
        },
      },
      {
        dataId: 29010,
        asOfDate: "2017-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 5217242000,
          fmt: "5.22B",
        },
      },
      {
        dataId: 29010,
        asOfDate: "2018-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 4955377000,
          fmt: "4.96B",
        },
      },
      {
        dataId: 29010,
        asOfDate: "2019-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 4617834000,
          fmt: "4.62B",
        },
      },
    ],
    trailingTotalRevenue: [
      {
        dataId: 20100,
        asOfDate: "2020-03-31",
        periodType: "TTM",
        currencyCode: "USD",
        reportedValue: {
          raw: 267981000000,
          fmt: "267.98B",
        },
      },
    ],
    annualPretaxIncome: [
      {
        dataId: 20136,
        asOfDate: "2016-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 61372000000,
          fmt: "61.37B",
        },
      },
      {
        dataId: 20136,
        asOfDate: "2017-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 64089000000,
          fmt: "64.09B",
        },
      },
      {
        dataId: 20136,
        asOfDate: "2018-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 72903000000,
          fmt: "72.90B",
        },
      },
      {
        dataId: 20136,
        asOfDate: "2019-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 65737000000,
          fmt: "65.74B",
        },
      },
    ],
    annualNetIncomeCommonStockholders: [
      {
        dataId: 20093,
        asOfDate: "2016-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 45687000000,
          fmt: "45.69B",
        },
      },
      {
        dataId: 20093,
        asOfDate: "2017-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 48351000000,
          fmt: "48.35B",
        },
      },
      {
        dataId: 20093,
        asOfDate: "2018-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 59531000000,
          fmt: "59.53B",
        },
      },
      {
        dataId: 20093,
        asOfDate: "2019-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 55256000000,
          fmt: "55.26B",
        },
      },
    ],
    annualInterestExpense: [
      {
        dataId: 20057,
        asOfDate: "2016-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 1456000000,
          fmt: "1.46B",
        },
      },
      {
        dataId: 20057,
        asOfDate: "2017-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 2323000000,
          fmt: "2.32B",
        },
      },
      {
        dataId: 20057,
        asOfDate: "2018-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 3240000000,
          fmt: "3.24B",
        },
      },
      {
        dataId: 20057,
        asOfDate: "2019-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 3576000000,
          fmt: "3.58B",
        },
      },
    ],
    annualDilutedAverageShares: [
      {
        dataId: 29011,
        asOfDate: "2016-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 5500281000,
          fmt: "5.50B",
        },
      },
      {
        dataId: 29011,
        asOfDate: "2017-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 5251692000,
          fmt: "5.25B",
        },
      },
      {
        dataId: 29011,
        asOfDate: "2018-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 5000109000,
          fmt: "5.00B",
        },
      },
      {
        dataId: 29011,
        asOfDate: "2019-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 4648913000,
          fmt: "4.65B",
        },
      },
    ],
    annualTaxProvision: [
      {
        dataId: 20145,
        asOfDate: "2016-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 15685000000,
          fmt: "15.69B",
        },
      },
      {
        dataId: 20145,
        asOfDate: "2017-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 15738000000,
          fmt: "15.74B",
        },
      },
      {
        dataId: 20145,
        asOfDate: "2018-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 13372000000,
          fmt: "13.37B",
        },
      },
      {
        dataId: 20145,
        asOfDate: "2019-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 10481000000,
          fmt: "10.48B",
        },
      },
    ],
    trailingInterestExpense: [
      {
        dataId: 20057,
        asOfDate: "2020-03-31",
        periodType: "TTM",
        currencyCode: "USD",
        reportedValue: {
          raw: 3218000000,
          fmt: "3.22B",
        },
      },
    ],
    trailingNetIncome: [
      {
        dataId: 20091,
        asOfDate: "2020-03-31",
        periodType: "TTM",
        currencyCode: "USD",
        reportedValue: {
          raw: 57215000000,
          fmt: "57.22B",
        },
      },
    ],
    trailingPretaxIncome: [
      {
        dataId: 20136,
        asOfDate: "2020-03-31",
        periodType: "TTM",
        currencyCode: "USD",
        reportedValue: {
          raw: 67091000000,
          fmt: "67.09B",
        },
      },
    ],
    annualNetIncome: [
      {
        dataId: 20091,
        asOfDate: "2016-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 45687000000,
          fmt: "45.69B",
        },
      },
      {
        dataId: 20091,
        asOfDate: "2017-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 48351000000,
          fmt: "48.35B",
        },
      },
      {
        dataId: 20091,
        asOfDate: "2018-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 59531000000,
          fmt: "59.53B",
        },
      },
      {
        dataId: 20091,
        asOfDate: "2019-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 55256000000,
          fmt: "55.26B",
        },
      },
    ],
    annualBasicEPS: [
      {
        dataId: 29004,
        asOfDate: "2016-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 8.35,
          fmt: "8.35",
        },
      },
      {
        dataId: 29004,
        asOfDate: "2017-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 9.27,
          fmt: "9.27",
        },
      },
      {
        dataId: 29004,
        asOfDate: "2018-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 12.01,
          fmt: "12.01",
        },
      },
      {
        dataId: 29004,
        asOfDate: "2019-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 11.97,
          fmt: "11.97",
        },
      },
    ],
    annualGrossProfit: [
      {
        dataId: 20046,
        asOfDate: "2016-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 84263000000,
          fmt: "84.26B",
        },
      },
      {
        dataId: 20046,
        asOfDate: "2017-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 88186000000,
          fmt: "88.19B",
        },
      },
      {
        dataId: 20046,
        asOfDate: "2018-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 101839000000,
          fmt: "101.84B",
        },
      },
      {
        dataId: 20046,
        asOfDate: "2019-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 98392000000,
          fmt: "98.39B",
        },
      },
    ],
    annualSellingGeneralAndAdministration: [
      {
        dataId: 20159,
        asOfDate: "2016-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 14194000000,
          fmt: "14.19B",
        },
      },
      {
        dataId: 20159,
        asOfDate: "2017-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 15261000000,
          fmt: "15.26B",
        },
      },
      {
        dataId: 20159,
        asOfDate: "2018-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 16705000000,
          fmt: "16.70B",
        },
      },
      {
        dataId: 20159,
        asOfDate: "2019-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 18245000000,
          fmt: "18.25B",
        },
      },
    ],
    trailingTaxProvision: [
      {
        dataId: 20145,
        asOfDate: "2020-03-31",
        periodType: "TTM",
        currencyCode: "USD",
        reportedValue: {
          raw: 9876000000,
          fmt: "9.88B",
        },
      },
    ],
    annualOtherIncomeExpense: [
      {
        dataId: 20117,
        asOfDate: "2016-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: -1195000000,
          fmt: "-1.20B",
        },
      },
      {
        dataId: 20117,
        asOfDate: "2017-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: -133000000,
          fmt: "-133.00M",
        },
      },
      {
        dataId: 20117,
        asOfDate: "2018-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: -441000000,
          fmt: "-441.00M",
        },
      },
      {
        dataId: 20117,
        asOfDate: "2019-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 422000000,
          fmt: "422.00M",
        },
      },
    ],
    trailingGrossProfit: [
      {
        dataId: 20046,
        asOfDate: "2020-03-31",
        periodType: "TTM",
        currencyCode: "USD",
        reportedValue: {
          raw: 102127000000,
          fmt: "102.13B",
        },
      },
    ],
    annualOperatingIncome: [
      {
        dataId: 20109,
        asOfDate: "2016-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 60024000000,
          fmt: "60.02B",
        },
      },
      {
        dataId: 20109,
        asOfDate: "2017-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 61344000000,
          fmt: "61.34B",
        },
      },
      {
        dataId: 20109,
        asOfDate: "2018-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 70898000000,
          fmt: "70.90B",
        },
      },
      {
        dataId: 20109,
        asOfDate: "2019-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 63930000000,
          fmt: "63.93B",
        },
      },
    ],
    trailingOperatingExpense: [
      {
        dataId: 20108,
        asOfDate: "2020-03-31",
        periodType: "TTM",
        currencyCode: "USD",
        reportedValue: {
          raw: 36536000000,
          fmt: "36.54B",
        },
      },
    ],
    annualEbitda: [
      {
        dataId: 20190,
        asOfDate: "2016-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 73333000000,
          fmt: "73.33B",
        },
      },
      {
        dataId: 20190,
        asOfDate: "2017-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 76569000000,
          fmt: "76.57B",
        },
      },
      {
        dataId: 20190,
        asOfDate: "2018-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 87046000000,
          fmt: "87.05B",
        },
      },
      {
        dataId: 20190,
        asOfDate: "2019-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 81860000000,
          fmt: "81.86B",
        },
      },
    ],
    trailingNetIncomeContinuousOperations: [
      {
        dataId: 20094,
        asOfDate: "2020-03-31",
        periodType: "TTM",
        currencyCode: "USD",
        reportedValue: {
          raw: 57215000000,
          fmt: "57.22B",
        },
      },
    ],
    annualOperatingExpense: [
      {
        dataId: 20108,
        asOfDate: "2016-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 24239000000,
          fmt: "24.24B",
        },
      },
      {
        dataId: 20108,
        asOfDate: "2017-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 26842000000,
          fmt: "26.84B",
        },
      },
      {
        dataId: 20108,
        asOfDate: "2018-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 30941000000,
          fmt: "30.94B",
        },
      },
      {
        dataId: 20108,
        asOfDate: "2019-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 34462000000,
          fmt: "34.46B",
        },
      },
    ],
    annualDilutedEPS: [
      {
        dataId: 29009,
        asOfDate: "2016-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 8.31,
          fmt: "8.31",
        },
      },
      {
        dataId: 29009,
        asOfDate: "2017-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 9.21,
          fmt: "9.21",
        },
      },
      {
        dataId: 29009,
        asOfDate: "2018-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 11.91,
          fmt: "11.91",
        },
      },
      {
        dataId: 29009,
        asOfDate: "2019-09-30",
        periodType: "12M",
        currencyCode: "USD",
        reportedValue: {
          raw: 11.89,
          fmt: "11.89",
        },
      },
    ],
    trailingSellingGeneralAndAdministration: [
      {
        dataId: 20159,
        asOfDate: "2020-03-31",
        periodType: "TTM",
        currencyCode: "USD",
        reportedValue: {
          raw: 19153000000,
          fmt: "19.15B",
        },
      },
    ],
    trailingDilutedEPS: [],
    trailingBasicEPS: [],
    trailingDilutedAverageShares: [],
    trailingBasicAverageShares: [],
    timestamp: [1475193600, 1506729600, 1538265600, 1569801600],
  },
  meta: {
    symbol: "AAPL",
    start: 493590046,
    end: 1588913154,
    timeUnit: "annual",
  },
  loading: false,
  errorList: [],
};

const chartData = {
  chart: {
    result: [
      {
        meta: {
          currency: "USD",
          symbol: "AAPL",
          exchangeName: "NMS",
          instrumentType: "EQUITY",
          firstTradeDate: 345479400,
          regularMarketTime: 1588968001,
          gmtoffset: -14400,
          timezone: "EDT",
          exchangeTimezoneName: "America/New_York",
          regularMarketPrice: 310.13,
          chartPreviousClose: 302.92,
          previousClose: 302.92,
          scale: 3,
          priceHint: 2,
          currentTradingPeriod: {
            pre: {
              timezone: "EDT",
              end: 1588944600,
              start: 1588924800,
              gmtoffset: -14400,
            },
            regular: {
              timezone: "EDT",
              end: 1588968000,
              start: 1588944600,
              gmtoffset: -14400,
            },
            post: {
              timezone: "EDT",
              end: 1588982400,
              start: 1588968000,
              gmtoffset: -14400,
            },
          },
          tradingPeriods: [
            [
              {
                timezone: "EDT",
                end: 1588968000,
                start: 1588944600,
                gmtoffset: -14400,
              },
            ],
          ],
          dataGranularity: "5m",
          range: "1d",
          validRanges: [
            "1d",
            "5d",
            "1mo",
            "3mo",
            "6mo",
            "1y",
            "2y",
            "5y",
            "10y",
            "ytd",
            "max",
          ],
        },
        timestamp: [
          1588944600,
          1588944900,
          1588945200,
          1588945500,
          1588945800,
          1588946100,
          1588946400,
          1588946700,
          1588947000,
          1588947300,
          1588947600,
          1588947900,
          1588948200,
          1588948500,
          1588948800,
          1588949100,
          1588949400,
          1588949700,
          1588950000,
          1588950300,
          1588950600,
          1588950900,
          1588951200,
          1588951500,
          1588951800,
          1588952100,
          1588952400,
          1588952700,
          1588953000,
          1588953300,
          1588953600,
          1588953900,
          1588954200,
          1588954500,
          1588954800,
          1588955100,
          1588955400,
          1588955700,
          1588956000,
          1588956300,
          1588956600,
          1588956900,
          1588957200,
          1588957500,
          1588957800,
          1588958100,
          1588958400,
          1588958700,
          1588959000,
          1588959300,
          1588959600,
          1588959900,
          1588960200,
          1588960500,
          1588960800,
          1588961100,
          1588961400,
          1588961700,
          1588962000,
          1588962300,
          1588962600,
          1588962900,
          1588963200,
          1588963500,
          1588963800,
          1588964100,
          1588964400,
          1588964700,
          1588965000,
          1588965300,
          1588965600,
          1588965900,
          1588966200,
          1588966500,
          1588966800,
          1588967100,
          1588967400,
          1588967700,
        ],
        indicators: {
          quote: [
            {
              open: [
                305.6400146484375,
                304.760009765625,
                305.2099914550781,
                305.0899963378906,
                305.2200012207031,
                304.79998779296875,
                304.8999938964844,
                305.3500061035156,
                305.32000732421875,
                305.4700012207031,
                306.0350036621094,
                305.92999267578125,
                306.260009765625,
                306.1600036621094,
                306.6689147949219,
                306.45001220703125,
                306.3999938964844,
                306.489990234375,
                306.3800048828125,
                306.260009765625,
                306.38330078125,
                306.3500061035156,
                306.19000244140625,
                306.4200134277344,
                306.3299865722656,
                306.69000244140625,
                306.95001220703125,
                307.3999938964844,
                307.4100036621094,
                307.57879638671875,
                307.9700012207031,
                307.98760986328125,
                308.2300109863281,
                308.1000061035156,
                307.9200134277344,
                308.1426086425781,
                308.0799865722656,
                308.19000244140625,
                308.17999267578125,
                308.4200134277344,
                308.25,
                308.0600891113281,
                308.239990234375,
                308.44000244140625,
                308.239990234375,
                308.2099914550781,
                307.8976135253906,
                307.760009765625,
                307.6050109863281,
                307.9092102050781,
                307.71990966796875,
                307.30999755859375,
                307.07000732421875,
                306.8915100097656,
                307.07000732421875,
                306.9800109863281,
                306.79998779296875,
                307.44000244140625,
                307.3900146484375,
                307.6300048828125,
                307.69000244140625,
                307.8731994628906,
                307.4200134277344,
                307.7040100097656,
                307.79998779296875,
                307.739990234375,
                307.7200012207031,
                309.4555969238281,
                309.3299865722656,
                308.989990234375,
                309.2770080566406,
                309.1162109375,
                309.5799865722656,
                309.8999938964844,
                309.95001220703125,
                310.010009765625,
                309.8599853515625,
                310.2200012207031,
              ],
              close: [
                304.7699890136719,
                305.2449951171875,
                305.1199951171875,
                305.2101135253906,
                304.7900085449219,
                304.8601989746094,
                305.3580017089844,
                305.30999755859375,
                305.4818115234375,
                306.0299072265625,
                305.92999267578125,
                306.2799987792969,
                306.1300964355469,
                306.662109375,
                306.4849853515625,
                306.360107421875,
                306.4800109863281,
                306.3299865722656,
                306.2372131347656,
                306.3900146484375,
                306.3399963378906,
                306.2200012207031,
                306.45001220703125,
                306.3369140625,
                306.6700134277344,
                306.93499755859375,
                307.4100036621094,
                307.4100036621094,
                307.57000732421875,
                307.98980712890625,
                307.989990234375,
                308.239990234375,
                308.1000061035156,
                307.9100036621094,
                308.1300048828125,
                308.1000061035156,
                308.19000244140625,
                308.172607421875,
                308.42889404296875,
                308.239990234375,
                308.0799865722656,
                308.25,
                308.44000244140625,
                308.239990234375,
                308.20001220703125,
                307.8900146484375,
                307.739990234375,
                307.6050109863281,
                307.8999938964844,
                307.7200012207031,
                307.30279541015625,
                307.0581970214844,
                306.8800048828125,
                307.0799865722656,
                306.95001220703125,
                306.7799987792969,
                307.4200134277344,
                307.3999938964844,
                307.625,
                307.6600036621094,
                307.8800048828125,
                307.4049987792969,
                307.69000244140625,
                307.7901916503906,
                307.75,
                307.72698974609375,
                309.4949951171875,
                309.3399963378906,
                308.98419189453125,
                309.2749938964844,
                309.1199951171875,
                309.5946960449219,
                309.9049987792969,
                309.94781494140625,
                310.010009765625,
                309.8599853515625,
                310.2349853515625,
                310.1484069824219,
              ],
              high: [
                306.1400146484375,
                305.3299865722656,
                305.5299987792969,
                305.2799987792969,
                305.4100036621094,
                305.2300109863281,
                305.4700012207031,
                305.82989501953125,
                305.55999755859375,
                306.0400085449219,
                306.17999267578125,
                306.2799987792969,
                306.3399963378906,
                306.6700134277344,
                306.7300109863281,
                306.7300109863281,
                306.5899963378906,
                306.69000244140625,
                306.56549072265625,
                306.6199951171875,
                306.489990234375,
                306.5199890136719,
                306.4700012207031,
                306.5199890136719,
                306.69000244140625,
                307.010009765625,
                307.44000244140625,
                307.6400146484375,
                307.6000061035156,
                308,
                308.1099853515625,
                308.3500061035156,
                308.3800048828125,
                308.1600036621094,
                308.1400146484375,
                308.2300109863281,
                308.239990234375,
                308.239990234375,
                308.4700012207031,
                308.4200134277344,
                308.3699951171875,
                308.260009765625,
                308.5,
                308.45001220703125,
                308.32000732421875,
                308.2099914550781,
                307.989990234375,
                307.8418884277344,
                307.94000244140625,
                307.9700012207031,
                307.7900085449219,
                307.4100036621094,
                307.1499938964844,
                307.1000061035156,
                307.2099914550781,
                307.1199951171875,
                307.44000244140625,
                307.55999755859375,
                307.67999267578125,
                307.8299865722656,
                307.92999267578125,
                307.9200134277344,
                307.7142028808594,
                307.8999938964844,
                307.8500061035156,
                307.8599853515625,
                309.8500061035156,
                309.48480224609375,
                309.3349914550781,
                309.3900146484375,
                309.3900146484375,
                309.6499938964844,
                310.07000732421875,
                310,
                310.2900085449219,
                310.3500061035156,
                310.2900085449219,
                310.260009765625,
              ],
              low: [
                304.364990234375,
                304.2900085449219,
                304.80999755859375,
                304.8699951171875,
                304.70001220703125,
                304.6600036621094,
                304.8599853515625,
                305.05999755859375,
                305.0299987792969,
                305.20001220703125,
                305.8599853515625,
                305.8599853515625,
                306.0299987792969,
                306.0299987792969,
                306.3599853515625,
                306.2099914550781,
                306.25,
                306.05999755859375,
                305.8999938964844,
                306.260009765625,
                306.26019287109375,
                306.1499938964844,
                305.95001220703125,
                306.20001220703125,
                306.30999755859375,
                306.67999267578125,
                306.80499267578125,
                307.32000732421875,
                307.3710021972656,
                307.45001220703125,
                307.739990234375,
                307.82000732421875,
                308.05999755859375,
                307.7900085449219,
                307.8299865722656,
                307.9800109863281,
                307.9800109863281,
                308.04998779296875,
                308.1199951171875,
                308.20001220703125,
                307.9200134277344,
                307.94000244140625,
                308.1499938964844,
                308.1000061035156,
                308.1200866699219,
                307.8399963378906,
                307.7099914550781,
                307.3528137207031,
                307.4599914550781,
                307.6499938964844,
                307.1000061035156,
                306.760009765625,
                306.8599853515625,
                306.7699890136719,
                306.8699951171875,
                306.6400146484375,
                306.7300109863281,
                307.27978515625,
                307.3599853515625,
                307.45001220703125,
                307.69000244140625,
                307.3399963378906,
                307.3800048828125,
                307.69000244140625,
                307.6449890136719,
                307.6400146484375,
                307.67999267578125,
                308.8599853515625,
                308.6400146484375,
                308.9100036621094,
                308.989990234375,
                309.1099853515625,
                309.44000244140625,
                309.7099914550781,
                309.9200134277344,
                309.8500061035156,
                309.6099853515625,
                309.8500061035156,
              ],
              volume: [
                1890062,
                813556,
                524926,
                369226,
                413632,
                376331,
                465306,
                537638,
                351699,
                551641,
                498297,
                416313,
                388020,
                376425,
                379129,
                352382,
                272558,
                354275,
                243894,
                261769,
                198322,
                188565,
                278445,
                193738,
                232036,
                427026,
                365351,
                394733,
                260989,
                487515,
                390870,
                406198,
                401819,
                300129,
                223914,
                193180,
                181692,
                133326,
                234234,
                224390,
                238723,
                174409,
                187141,
                212130,
                190832,
                235665,
                180552,
                337994,
                246636,
                147312,
                231250,
                275382,
                217199,
                189143,
                226374,
                217467,
                254924,
                199013,
                172486,
                234940,
                185571,
                200776,
                139214,
                190788,
                134673,
                191647,
                2044419,
                875970,
                600791,
                559413,
                472329,
                476840,
                701798,
                583148,
                987475,
                732425,
                879019,
                1196698,
              ],
            },
          ],
        },
      },
    ],
    error: null,
  },
};

const newsData = {
  "more": {
      "result": [
          {
              "uuid": "0cf37733-e010-325b-99cb-a8ac1152ef4d"
          },
          {
              "uuid": "65b53896-faf4-3a06-9d0d-a63cf3c83192"
          },
          {
              "uuid": "ae7e60c7-1788-3a2b-8382-7c2648f20089"
          },
          {
              "uuid": "4a47629d-6812-3c42-86fd-af7b2492044d"
          },
          {
              "uuid": "5d1ded48-984e-3b85-bcc7-f3599f4589ac"
          },
          {
              "uuid": "33ba85bd-663e-304b-97f4-58b0350de8c1"
          },
          {
              "uuid": "6cfa1490-c0b6-35cf-b4e3-952157270e09"
          },
          {
              "uuid": "8b89b174-8642-33b5-9865-8ea1b523e646"
          },
          {
              "uuid": "c2a025b0-e919-36c0-9d50-9c245ee356ae"
          },
          {
              "uuid": "7a05ec31-f107-3967-98dc-874b89efb738"
          }
      ]
  },
  "items": {
      "result": [
          {
              "uuid": "3b9935f9-2d72-31b1-8aa3-8a39d00d7328",
              "title": "Frédéric Arnault takes a bite out of Apple’s smartwatch market",
              "link": "http://www.ft.com/cms/s/26756f24-884d-11ea-a109-483c62d17528,s01=1.html?ftcamp=traffic/partner/feed_headline/us_yahoo/auddev&yptr=yahoo",
              "summary": "When Frédéric Arnault took to the stage in March to launch the third generation of Tag Heuer’s Connected watch, he carried the baton for the first Swiss watchmaker to develop its own smartwatch.  The original Connected model was launched in 2015, the same year as the Apple Watch and two years before Mr Arnault joined Tag Heuer, at the age of 22.  Mr Arnault’s father, Bernard, the world’s third-richest person, sits at the top of the LVMH empire of which Tag is a part.",
              "publisher": "Financial Times",
              "author": "Nicholas Foulkes",
              "ignore_main_image": false,
              "type": "story",
              "published_at": 1588993245,
              "main_image": null,
              "entities": [
                  {
                      "term": "TICKER:AAPL",
                      "label": "Apple Inc.",
                      "score": 1
                  }
              ],
              "is_magazine": false,
              "reference_id": "3b9935f9-2d72-31b1-8aa3-8a39d00d7328",
              "offnet": true,
              "content": null,
              "streams": []
          },
          {
              "uuid": "1003d64c-f418-3531-afea-687cb7dc0bb6",
              "title": "Billionaire Ken Fisher Finds Comfort In These 5 Stocks",
              "link": "https://finance.yahoo.com/news/billionaire-ken-fisher-finds-comfort-023819665.html",
              "summary": "Billionaire Ken Fisher is one of the 800+ fund managers actively tracked by Insider Monkey. A few months ago we asked the question whether Ken Fisher is a \"legendary investor or a marketing genius\". One thing is certain that Ken Fisher isn't an investor who tries to time the market. As the stocks fell all […]",
              "publisher": "Insider Monkey",
              "author": "Insider Monkey Staff",
              "ignore_main_image": true,
              "type": "story",
              "published_at": 1588991899,
              "main_image": {
                  "original_height": 448,
                  "original_width": 359,
                  "original_url": "https://s.yimg.com/lo/api/res/1.2/GqdzTjXZfkCAathiFRFX8w--/YXBwaWQ9eXZpZGVvZmVlZHM7dz0zNTk7aD00NDg-/https://media.zenfs.com/en-us/insidermonkey.com/5828ef49953f6edbbffb155abbf20023",
                  "resolutions": [
                      {
                          "tag": "original",
                          "width": 359,
                          "url": "https://s.yimg.com/lo/api/res/1.2/GqdzTjXZfkCAathiFRFX8w--/YXBwaWQ9eXZpZGVvZmVlZHM7dz0zNTk7aD00NDg-/https://media.zenfs.com/en-us/insidermonkey.com/5828ef49953f6edbbffb155abbf20023",
                          "tags": [
                              "size=original",
                              ""
                          ],
                          "height": 448
                      },
                      {
                          "height": 140,
                          "width": 140,
                          "tag": "square-140x140",
                          "url": "https://s.yimg.com/lo/api/res/1.2/.K3FiEa4PzdW6KSOS8IaRw--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtoPTE0MDt3PTE0MA--/https://s.yimg.com/lo/api/res/1.2/GqdzTjXZfkCAathiFRFX8w--/YXBwaWQ9eXZpZGVvZmVlZHM7dz0zNTk7aD00NDg-/https://media.zenfs.com/en-us/insidermonkey.com/5828ef49953f6edbbffb155abbf20023"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/U78.iPtxJcrfLPVbz4qqkw--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtweW9mZj0wO2g9MTQwO3c9MTQw/https://media.zenfs.com/en-us/insidermonkey.com/5828ef49953f6edbbffb155abbf20023",
                          "height": 140,
                          "width": 140,
                          "tag": "ios:size=square_large"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/0U2k8kTqcqKWtkicwWf1zA--/YXBwaWQ9eXZpZGVvZmVlZHM7aD0xNjA7dz0xMjg-/https://media.zenfs.com/en-us/insidermonkey.com/5828ef49953f6edbbffb155abbf20023",
                          "height": 160,
                          "width": 128,
                          "tag": "ios:size=small"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/c195TLvS.CnRWIbSK3DDMQ--/YXBwaWQ9eXZpZGVvZmVlZHM7aD0zMjA7dz0yNTY-/https://media.zenfs.com/en-us/insidermonkey.com/5828ef49953f6edbbffb155abbf20023",
                          "height": 320,
                          "width": 256,
                          "tag": "ios:size=medium"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/LWUwDxs1nN8EfNx6z1E_qA--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtweW9mZj0wO2g9NTMwO3c9MzIw/https://media.zenfs.com/en-us/insidermonkey.com/5828ef49953f6edbbffb155abbf20023",
                          "height": 530,
                          "width": 320,
                          "tag": "ios:size=card_small_fixed"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/kRxtO7.CzNGcvFb14al46A--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtweW9mZj0wO2g9MTA2MDt3PTY0MA--/https://media.zenfs.com/en-us/insidermonkey.com/5828ef49953f6edbbffb155abbf20023",
                          "height": 1060,
                          "width": 640,
                          "tag": "ios:size=card_large_fixed"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/.JM5SCaQf6Rioc2JwIIbRA--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtweW9mZj0wO2g9NTMwO3c9NjQw/https://media.zenfs.com/en-us/insidermonkey.com/5828ef49953f6edbbffb155abbf20023",
                          "height": 530,
                          "width": 640,
                          "tag": "ios:size=large_new_fixed"
                      }
                  ]
              },
              "entities": [
                  {
                      "term": "TICKER:0HCI.IL",
                      "label": "ALIBABA GROUP HOLDING LTD ALIBA",
                      "score": 1
                  },
                  {
                      "term": "TICKER:9988.HK",
                      "label": "BABA-SW",
                      "score": 1
                  },
                  {
                      "term": "TICKER:AAPL",
                      "label": "Apple Inc.",
                      "score": 1
                  },
                  {
                      "term": "TICKER:AAPL.BA",
                      "label": "APPLE INC",
                      "score": 1
                  },
                  {
                      "term": "TICKER:AAPL34.SA",
                      "label": "APPLE       DRN",
                      "score": 1
                  },
                  {
                      "term": "TICKER:AHLA.BE",
                      "label": "ALIBABA GR.HLDG SP.ADR 1",
                      "score": 1
                  },
                  {
                      "term": "TICKER:AMZN",
                      "label": "Amazon.com, Inc.",
                      "score": 1
                  },
                  {
                      "term": "TICKER:AMZN.BA",
                      "label": "AMAZON COM INC",
                      "score": 1
                  },
                  {
                      "term": "TICKER:AMZO34.SA",
                      "label": "AMAZON      DRN",
                      "score": 1
                  },
                  {
                      "term": "TICKER:BABA",
                      "label": "Alibaba Group Holding Limited",
                      "score": 1
                  },
                  {
                      "term": "TICKER:MSFT",
                      "label": "Microsoft Corporation",
                      "score": 1
                  },
                  {
                      "term": "TICKER:MSFT.BA",
                      "label": "MICROSOFT CORP",
                      "score": 1
                  },
                  {
                      "term": "TICKER:MSFT34.SA",
                      "label": "MICROSOFT   DRN",
                      "score": 1
                  },
                  {
                      "term": "TICKER:V",
                      "label": "Visa Inc.",
                      "score": 1
                  },
                  {
                      "term": "TICKER:V.BA",
                      "label": "VISA INC",
                      "score": 1
                  },
                  {
                      "term": "TICKER:VISA34.SA",
                      "label": "VISA INC    DRN",
                      "score": 1
                  }
              ],
              "is_magazine": false,
              "reference_id": "1003d64c-f418-3531-afea-687cb7dc0bb6",
              "offnet": false,
              "content": "<p style=\"text-align:justify;\">Billionaire <a href=\"https://www.insidermonkey.com/hedge-fund/fisher+asset+management/11\">Ken Fisher</a> is one of the 800+ fund managers actively tracked by Insider Monkey. A few months ago we <a href=\"https://www.insidermonkey.com/blog/billionaire-ken-fisher-legendary-investor-or-marketing-genius-799461/\">asked the question</a> whether Ken Fisher is a \"legendary investor or a marketing genius\". One thing is certain that Ken Fisher isn't an investor who tries to time the market. As the stocks fell all over the world during the first quarter, Ken Fisher's 13F portfolio also fell from $99 billion to $80 billion. We assume that most of this decline was due to the losses in stock prices rather than investor redemptions.</p> \n<p style=\"text-align:justify;\">Wall Street analysts and investors don't respect Ken Fisher much. We have never heard of Ken Fisher's stock pitches move stocks the way Bill Ackman or David Tepper moves the markets. Nevertheless Ken Fisher has been able to deliver decent returns to grow his fund's AUM to nearly $100 billion. That's nothing to sneeze at.</p> [caption id=\"attachment_26357\" align=\"aligncenter\" width=\"359\"]\n<img class=\"size-full wp-image-26357\" src=\"https://s.yimg.com/uu/api/res/1.2/05zFlgZ1fKLjHczua.6NQw--/YXBwaWQ9eXRhY2h5b247cT03NTs-/https://media.zenfs.com/en-us/insidermonkey.com/5828ef49953f6edbbffb155abbf20023\" alt=\"FISHER ASSET MANAGEMENT\" width=\"359\" height=\"448\"> Ken Fisher of Fisher Asset Management[/caption] \n<p style=\"text-align:justify;\">In this article we are going to take a look at Ken Fisher's top 5 stock picks. During the first quarter Ken Fisher's top 5 stock picks delivered an average loss of only 6%, vs. a loss of nearly 20% for the S&amp;P 500 Index. That return was even better than the average return of <a href=\"https://www.insidermonkey.com/blog/30-most-popular-stocks-among-hedge-funds-2019-q4-rankings-817664/\">top 5 hedge fund stocks</a> which lost an average of 6.9% during the first quarter. As you can guess top hedge fund stock picks is a very fertile area to look for good stocks to beat the market.</p> \n<p style=\"text-align:justify;\">Insider Monkey leaves no stone unturned when looking for the next great investment idea. For example, this investor can predict short term winners following earnings announcements with 77% accuracy, so we check out <strong><a href=\"http://track.ic3trk.com/aff_c?offer_id=634&amp;aff_id=1198\">his stock picks</a>.</strong> A former hedge fund manager is pitching the \"next Amazon\" <a href=\"http://track.ic3trk.com/aff_c?offer_id=630&amp;aff_id=1198\"><strong>in this video</strong>;</a> again we are listening. We read hedge fund investor letters and listen to stock pitches at hedge fund conferences. Our <a href=\"https://www.insidermonkey.com/blog/30-most-popular-stocks-among-hedge-funds-2019-q4-rankings-817664/\">best call in 2020</a> was shorting the market when S&amp;P 500 was trading at 3150 after realizing the coronavirus pandemic’s significance before most investors. Insider Monkey's monthly newsletter beat the S&amp;P 500 Index by 44 percentage points over the last 3 years.</p> \n<p style=\"text-align:justify;\">Keeping this in mind, let's now take a look at Ken Fisher's top 5 stock picks at the end of March.</p> \n<p style=\"text-align:justify;\">The fifth largest position in billionaire Ken Fisher's 13F portfolio was <strong>Alibaba Group Holding Limited (NYSE:<a href=\"https://www.insidermonkey.com/insider-trading/company/alibaba%20group%20holding%20limited/1577552/\">BABA</a>)</strong>. Ken Fisher had nearly $2.6 billion invested in the Chinese giant. Alibaba Group Holding was also the fourth most popular stock among all hedge funds at the end of December. We believe Alibaba shares can reach $400 over the next 3-5 years.</p> \n<p style=\"text-align:justify;\">The fourth largest position in Fisher's portfolio was <strong>Amazon.com, Inc. (NASDAQ:<a href=\"https://www.insidermonkey.com/insider-trading/company/amazon%20com%20inc/1018724/\">AMZN</a>)</strong>. Fisher had nearly $3.2 billion invested in Amazon.com Inc shares at the end of March. Amazon shares delivered total gains of 22% since then, potentially giving Fisher total gains of more than $650 million. Legendary investor Bill Miller doesn't think Amazon.com is a good stock to be invested in after its strong 2020 gains. In the following video you can watch why&nbsp;<a href=\"https://www.insidermonkey.com/hedge-fund/miller-value-partners/1101/\">Bill Miller</a>&nbsp;thinks it doesn’t make sense today to invest in Amazon.com Inc (NASDAQ:<a href=\"https://www.insidermonkey.com/insider-trading/company/amazon%20com%20inc/1018724/\">AMZN</a>) and 6 other recession stocks that performed well so far this year.</p> \n<p style=\"text-align:justify;\"></p> \n<p style=\"text-align:justify;\">Bill Miller's hedge fund returned 120% in 2019. So, investors shouldn't hastily dismiss his point.</p> \n<p style=\"text-align:justify;\">The third biggest position in Ken Fisher's portfolio at the end of March was <strong>Visa Inc. (NYSE:<a href=\"https://www.insidermonkey.com/insider-trading/company/visa%20inc/1403161/\">V</a>)</strong>, valued at $3.3 billion. Visa Inc. was the worst performing top 5 stock in Ken Fisher's portfolio in Q1, losing 14.1%. However, Visa shares recovered most of their Q1 losses so far in the second quarter. Visa has been a hedge fund favorite for a long time but it really never got too cheap for us to recommend it to our subscribers.</p> \n<p style=\"text-align:justify;\"><strong>Microsoft Corporation (NASDAQ:<a href=\"https://www.insidermonkey.com/insider-trading/company/microsoft%20corp/789019/\">MSFT</a>)</strong> was the second biggest position in Fisher's 13F portfolio. Fisher had $3.4 billion invested in Microsoft Corporation at the end of March and those shares are worth 17% more today. Microsoft Corporation is one of the most valuable companies in the world today, so it isn't a surprise for us to see this stock near the top of Fisher's portfolio.</p> \n<p style=\"text-align:justify;\">Finally, Ken Fisher's #1 choice in this coronavirus recession is <strong>Apple Inc. (NASDAQ:<a href=\"https://www.insidermonkey.com/insider-trading/company/apple%20inc/320193/\">AAPL</a>)</strong>. Fisher had nearly $3.6 billion invested in this $1.34 trillion company. Apple Inc. shares returned 22.3% so far in the second quarter, even better than the 22% gains delivered by Amazon.com Inc. Most investors consider Apple an easy stock pick, but it isn't so. World's most bearish hedge fund hated Apple in January and we <a href=\"https://www.insidermonkey.com/blog/worlds-most-bearish-fund-hates-tesla-apple-but-likes-this-stock-816599/\">published an article</a> about that. That hedge fund was wrong about Apple and it was also wrong about its long stock picks. This is probably how billionaire Ken Fisher managed to become a billionaire: by identifying winners and staying invested during tough times.</p> \n<p style=\"text-align:justify;\">Disclosure: None. This article is originally published at <a href=\"https://www.insidermonkey.com/blog/billionaire-ken-fisher-finds-comfort-in-these-5-stocks-832261/\">Insider Monkey</a>.</p> \n<p style=\"text-align:justify;\"></p> \n<p> <strong>Related Content</strong> </p>\n<ul> \n <li><a href=\"https://www.insidermonkey.com/blog/hedge-fund-interview-series-michael-castor-of-sio-capital-830360/\">Hedge Fund Interview Series: Michael Castor of Sio Capital</a></li> \n</ul> \n<p></p></img>",
              "streams": []
          },
          {
              "uuid": "79206ff4-3379-346c-80e6-0666767bef44",
              "title": "Stock Valuations Are Near Dot-Com-Era Levels. Don’t Expect a Bust This Time.",
              "link": "https://www.barrons.com/articles/stock-valuations-are-near-dot-com-era-valuations-dont-expect-a-bust-this-time-51588982780?siteid=yhoof2&yptr=yahoo",
              "summary": "This past week was full of bad economic data and mediocre earnings—and the stock market just kept going higher.  The S&P 500 index rose 3.5%, to 2930.  The Nasdaq Composite beat both its peers, rising 6% to close at 9121, cracking the 9000 barrier again.",
              "publisher": "Barrons.com",
              "author": "Al Root",
              "ignore_main_image": false,
              "type": "story",
              "published_at": 1588982760,
              "main_image": null,
              "entities": [
                  {
                      "term": "TICKER:AAPL",
                      "label": "Apple Inc.",
                      "score": 1
                  },
                  {
                      "term": "TICKER:^DJI",
                      "label": "Dow Jones Industrial Average",
                      "score": 1
                  },
                  {
                      "term": "TICKER:^GSPC",
                      "label": "S&P 500",
                      "score": 1
                  },
                  {
                      "term": "TICKER:^IXIC",
                      "label": "NASDAQ Composite",
                      "score": 1
                  }
              ],
              "is_magazine": false,
              "reference_id": "79206ff4-3379-346c-80e6-0666767bef44",
              "offnet": true,
              "content": null,
              "streams": []
          },
          {
              "uuid": "f535710d-92d1-3a06-a265-264f4f69b00f",
              "title": "Value Screeners Identify Opportunities as Markets Rebound From March Lows",
              "link": "https://finance.yahoo.com/news/value-screeners-identify-opportunities-markets-230004685.html",
              "summary": "GuruFocus value screens apply teachings from legends like Graham, Buffett and Lynch Continue reading...",
              "publisher": "GuruFocus.com",
              "author": "GuruFocus.com",
              "ignore_main_image": true,
              "type": "story",
              "published_at": 1588978804,
              "main_image": {
                  "original_height": 400,
                  "original_width": 600,
                  "original_url": "https://s.yimg.com/lo/api/res/1.2/0PbptSzr2uiFvI7elmk2nA--/YXBwaWQ9eXZpZGVvZmVlZHM7dz02MDA7aD00MDA-/https://media.zenfs.com/en-us/us.finance.gurufocus/d6975ca949028745abddcc427631f2dd",
                  "resolutions": [
                      {
                          "tag": "original",
                          "width": 600,
                          "url": "https://s.yimg.com/lo/api/res/1.2/0PbptSzr2uiFvI7elmk2nA--/YXBwaWQ9eXZpZGVvZmVlZHM7dz02MDA7aD00MDA-/https://media.zenfs.com/en-us/us.finance.gurufocus/d6975ca949028745abddcc427631f2dd",
                          "tags": [
                              "size=original",
                              ""
                          ],
                          "height": 400
                      },
                      {
                          "height": 140,
                          "width": 140,
                          "tag": "square-140x140",
                          "url": "https://s.yimg.com/lo/api/res/1.2/dMd3F10JANAdUam4daJLCg--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtoPTE0MDt3PTE0MA--/https://s.yimg.com/lo/api/res/1.2/0PbptSzr2uiFvI7elmk2nA--/YXBwaWQ9eXZpZGVvZmVlZHM7dz02MDA7aD00MDA-/https://media.zenfs.com/en-us/us.finance.gurufocus/d6975ca949028745abddcc427631f2dd"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/BiakVgCnlYbEyAOnQzLTpQ--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtweW9mZj0wO2g9MTQwO3c9MTQw/https://media.zenfs.com/en-us/us.finance.gurufocus/d6975ca949028745abddcc427631f2dd",
                          "height": 140,
                          "width": 140,
                          "tag": "ios:size=square_large"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/gmdx4hwDtyLyj4zcDT572w--/YXBwaWQ9eXZpZGVvZmVlZHM7aD0xMDY7dz0xNjA-/https://media.zenfs.com/en-us/us.finance.gurufocus/d6975ca949028745abddcc427631f2dd",
                          "height": 106,
                          "width": 160,
                          "tag": "ios:size=small"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/.je77yPVPuZdjS4KSspCzQ--/YXBwaWQ9eXZpZGVvZmVlZHM7aD0yMTM7dz0zMjA-/https://media.zenfs.com/en-us/us.finance.gurufocus/d6975ca949028745abddcc427631f2dd",
                          "height": 213,
                          "width": 320,
                          "tag": "ios:size=medium"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/pFERChCtoXg9gmLDMPfj_Q--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtweW9mZj0wO2g9NTMwO3c9MzIw/https://media.zenfs.com/en-us/us.finance.gurufocus/d6975ca949028745abddcc427631f2dd",
                          "height": 530,
                          "width": 320,
                          "tag": "ios:size=card_small_fixed"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/WPCxhAiPsPP8YLxxf7h3pQ--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtweW9mZj0wO2g9MTA2MDt3PTY0MA--/https://media.zenfs.com/en-us/us.finance.gurufocus/d6975ca949028745abddcc427631f2dd",
                          "height": 1060,
                          "width": 640,
                          "tag": "ios:size=card_large_fixed"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/ak03sSKGmt5shm5GPZ7Bcw--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtweW9mZj0wO2g9NTMwO3c9NjQw/https://media.zenfs.com/en-us/us.finance.gurufocus/d6975ca949028745abddcc427631f2dd",
                          "height": 530,
                          "width": 640,
                          "tag": "ios:size=large_new_fixed"
                      }
                  ]
              },
              "entities": [
                  {
                      "term": "TICKER:AAPL",
                      "label": "Apple Inc.",
                      "score": 1
                  },
                  {
                      "term": "TICKER:BERK34.SA",
                      "label": "BERKSHIRE   DRN",
                      "score": 1
                  },
                  {
                      "term": "TICKER:BRH.BE",
                      "label": "BERKSHIRE HATHAWAY A DL 5",
                      "score": 1
                  },
                  {
                      "term": "TICKER:BRH.DE",
                      "label": "BERKSHIRE HATHAWAY A DL 5",
                      "score": 1
                  },
                  {
                      "term": "TICKER:BRH.DU",
                      "label": "BERKSHIRE HATHAWAY A DL 5",
                      "score": 1
                  },
                  {
                      "term": "TICKER:BRH.F",
                      "label": "BERKSHIRE HATHAWAY A DL 5",
                      "score": 1
                  },
                  {
                      "term": "TICKER:BRH.HM",
                      "label": "BERKSHIRE HATHAWAY A DL 5",
                      "score": 1
                  },
                  {
                      "term": "TICKER:BRH.MU",
                      "label": "BERKSHIRE HATHAWAY A DL 5",
                      "score": 1
                  },
                  {
                      "term": "TICKER:BRH.SG",
                      "label": "BERKSHIRE HATHAWAY INC. Registe",
                      "score": 1
                  },
                  {
                      "term": "TICKER:BRK-A",
                      "label": "Berkshire Hathaway Inc.",
                      "score": 1
                  },
                  {
                      "term": "TICKER:BRK-B",
                      "label": "Berkshire Hathaway Inc. New",
                      "score": 1
                  },
                  {
                      "term": "TICKER:BRKA.VI",
                      "label": "BERKSHIRE HATHAWAY INC",
                      "score": 1
                  },
                  {
                      "term": "TICKER:BRKB",
                      "label": "Berkshire Hathaway Inc. New",
                      "score": 1
                  }
              ],
              "is_magazine": false,
              "reference_id": "f535710d-92d1-3a06-a265-264f4f69b00f",
              "offnet": false,
              "content": "<p>As markets attempt to <a href=\"https://www.gurufocus.com/news/1123430\">rebound</a> from a <a href=\"https://www.gurufocus.com/news/1093274\">major tumble</a> during March and April, investors might wonder where to start looking for good investing opportunities.</p>\n<p>GuruFocus provides its Premium members with a wide range of value screens that apply teachings from several investing legends, including Benjamin Graham, <a href=\"https://www.gurufocus.com/StockBuy.php?GuruName=Warren+Buffett\">Warren Buffett</a> (<a href=\"https://www.gurufocus.com/StockBuy.php?GuruName=Warren+Buffett\">Trades</a>, <a href=\"https://www.gurufocus.com/holdings.php?GuruName=Warren+Buffett\">Portfolio</a>) and Peter Lynch.</p>\n<p></p>\n<ul>\n <li><a href=\"https://www.gurufocus.com/financials/AAPL?r=caf6fe0e0db70d936033da5461e60141\" style=\"color:red !important;\">Warning! GuruFocus has detected 8 Warning Sign with AAPL. Click here to check it out. </a></li> \n <li><a href=\"https://www.gurufocus.com/financials/AAPL?r=caf6fe0e0db70d936033da5461e60141\">AAPL 30-Year Financial Data</a></li>\n <li><a href=\"https://www.gurufocus.com/analysis/AAPL?subtab=val&amp;r=caf6fe0e0db70d936033da5461e60141\">The intrinsic value of AAPL</a></li>\n <li><a href=\"https://www.gurufocus.com/chart/AAPL#&amp;serie=,,id:price,s:AAPL,,id:custompe,s:AAPL&amp;log=0&amp;per=0&amp;r=caf6fe0e0db70d936033da5461e60141\">Peter Lynch Chart of AAPL</a></li>\n</ul>\n<br>\n<p></p>\n<p><strong>U.S. market surges despite \"historic\" job losses in April</strong></p>\n<p>On Friday, the <a href=\"https://www.gurufocus.com/economic_indicators/229/the-dow-jones-industrial-average-djia\">Dow Jones Industrial Average</a> closed at 24,331.32, up 455.43 points or 1.91% from Thursday's close of 23,875.89 and 607.63 points or 2.56% from last Friday's close of 23,723.69. Apple Inc. (NASDAQ:AAPL), the top holding of Buffett's Berkshire Hathaway Inc. (NYSE:BRK.A)(NYSE:BRK.B) as of the December 2019 13-F filing, closed at $310.13, up 2.38% from the previous close.</p>\n<p><img width=\"550\" height=\"400\" alt=\"a9d82ace2447e533cf352a89a0209136.png\" src=\"https://s.yimg.com/uu/api/res/1.2/FMsBids2WXhppf4e1pZf5Q--/YXBwaWQ9eXRhY2h5b247cT03NTs-/https://media.zenfs.com/en-us/us.finance.gurufocus/d6975ca949028745abddcc427631f2dd\"> </img></p>\n<p>Gains from Apple and other stocks like Facebook Inc. (NASDAQ:FB), Amazon.com Inc. (NASDAQ:AMZN) and Google parent Alphabet Inc. (NASDAQ:GOOGL)(NASDAQ:GOOG) propelled the Nasdaq Composite Index above 9,000 for the first time since Feb. 24.</p>\n<p><img width=\"550\" height=\"400\" alt=\"722deee77a870df5c8fb53bfb13531c2.png\" src=\"https://s1.yimg.com/uu/api/res/1.2/rQeMYXARR3HPBg8zWEutPg--/YXBwaWQ9eXRhY2h5b247cT03NTs-/https://media.zenfs.com/en-us/us.finance.gurufocus/16c7365c1e92556d920a74fc1dbb9fa8\"> </img></p>\n<p>Stocks rallied despite nonfarm payrolls tumbling 20.5 million in April and the unemployment rate soaring to 14.7%, according to data from the U.S. Bureau of Labor Statistics. Even though these numbers represent new post-World War II records, the reported numbers still topped estimates: CNBC said that economists expected nonfarm payrolls to decline 21.5 million and the unemployment rate to eclipse 16%. MUFG Union Bank Chief Financial Economist Chris Rupkey added that \"April might be it for job losses going forward\" as the U.S. begins reopen the economy and that a \"silver-lining\" in Friday's report might be included in the \"realization\" that the economy might not be this weak going forward.</p>\n<p><img width=\"550\" height=\"400\" alt=\"848d4d55714c2b84b3fb20507e9ecf03.png\" src=\"https://s.yimg.com/uu/api/res/1.2/RxHF.a4wjqiog39O88o_sw--/YXBwaWQ9eXRhY2h5b247cT03NTs-/https://media.zenfs.com/en-us/us.finance.gurufocus/44f2fe886049182a727fb022bbe2c869\"> </img></p>\n<p><strong>Value screeners seek opportunities</strong></p>\n<p>The following video discusses how to access our popular value screens, which include Ben Graham Net-Net, Undervalued-Predictable, Buffett-Munger and Peter Lynch.</p>\n<p></p>\n<p><strong>Ben Graham Net-Net</strong></p>\n<p>As Figure 1 illustrates, the Ben Graham Net-Net screen applies the legendary investor's idea of investing in companies that are trading below net current asset value. Graham defined the net-net working capital as the sum of cash, 75% of accounts receivable and 50% of inventory minus total liabilities.</p>\n<p><img width=\"550\" height=\"400\" alt=\"\" src=\"https://s.yimg.com/uu/api/res/1.2/avVs18DOy2Yb4WLAQ72XIw--/YXBwaWQ9eXRhY2h5b247cT03NTs-/https://media.zenfs.com/en-us/us.finance.gurufocus/a5d5cf31e0b69cf56d06cc557589594f\" /></p>\n<p><strong>Figure 1</strong></p>\n<p>Graham also required positive operating cash flows and no meaningful debt: The investor set an interest coverage ratio threshold of at least five.</p>\n<p>Table 1 lists the number of Ben Graham net-nets for each GuruFocus subscription region.</p>\n<table cellpadding=\"0\" cellspacing=\"0\">\n <tbody>\n  <tr>\n   <td><p>Region</p></td>\n   <td><p>U.S.</p></td>\n   <td><p>Asia</p></td>\n   <td><p>Europe</p></td>\n   <td><p>Canada</p></td>\n   <td><p>U.K. / Ireland</p></td>\n   <td><p>Oceania</p></td>\n   <td><p>Latin America</p></td>\n   <td><p>Africa</p></td>\n   <td><p>India</p></td>\n  </tr>\n  <tr>\n   <td><p>Ben Graham Net-Net</p></td>\n   <td><p>93</p></td>\n   <td><p>533</p></td>\n   <td><p>183</p></td>\n   <td><p>33</p></td>\n   <td><p>26</p></td>\n   <td><p>10</p></td>\n   <td><p>3</p></td>\n   <td><p>6</p></td>\n   <td><p>175</p></td>\n  </tr>\n </tbody>\n</table>\n<br>\n<br>\n<p><strong>Table 1</strong></p>\n<p><strong>Undervalued-Predictable and Buffett-Munger</strong></p>\n<p>As the name implies, the Undervalued-Predictable Screen seeks companies with high business predictability and are trading below intrinsic value based on the discounted cash flow and discounted earnings models. Figure 2 details the Undervalued-Predictable strategy.</p>\n<p><img width=\"550\" height=\"400\" alt=\"\" src=\"https://s1.yimg.com/uu/api/res/1.2/ZWg.wdBhlDVZ59uYaa0CjQ--/YXBwaWQ9eXRhY2h5b247cT03NTs-/https://media.zenfs.com/en-us/us.finance.gurufocus/379e8f841fcd6a0d5b4f48a2152dcee8\" /></p>\n<p><strong>Figure 2</strong></p>\n<p>Buffett and Berkshire co-manager Charlie Munger (Trades, Portfolio) take the undervalued-predictable strategy one notch further, requiring four key criteria: understandable business, favorable long-term prospects, competent management and attractive share price. Figure 3 further details the Buffett-Munger strategy.</p>\n<p><img width=\"550\" height=\"400\" alt=\"\" src=\"https://s1.yimg.com/uu/api/res/1.2/5iPWA3l7XffFVWOwhX8Fig--/YXBwaWQ9eXRhY2h5b247cT03NTs-/https://media.zenfs.com/en-us/us.finance.gurufocus/4056ecb045b720e921903f2f405b1e90\" /></p>\n<p><strong>Figure 3</strong></p>\n<p>Table 2 lists the number of undervalued-predictable and Buffett-Munger stocks for each GuruFocus subscription region.</p>\n<table cellpadding=\"0\" cellspacing=\"0\">\n <tbody>\n  <tr>\n   <td><p>Region</p></td>\n   <td><p>U.S.</p></td>\n   <td><p>Asia</p></td>\n   <td><p>Europe</p></td>\n   <td><p>Canada</p></td>\n   <td><p>U.K. / Ireland</p></td>\n   <td><p>Oceania</p></td>\n   <td><p>Latin America</p></td>\n   <td><p>Africa</p></td>\n   <td><p>India</p></td>\n  </tr>\n  <tr>\n   <td><p>Undervalued Predictable</p></td>\n   <td><p>64</p></td>\n   <td><p>190</p></td>\n   <td><p>214</p></td>\n   <td><p>7</p></td>\n   <td><p>88</p></td>\n   <td><p>10</p></td>\n   <td><p>67</p></td>\n   <td><p>5</p></td>\n   <td><p>43</p></td>\n  </tr>\n  <tr>\n   <td><p>Buffett-Munger</p></td>\n   <td><p>27</p></td>\n   <td><p>142</p></td>\n   <td><p>104</p></td>\n   <td><p>1</p></td>\n   <td><p>47</p></td>\n   <td><p>3</p></td>\n   <td><p>36</p></td>\n   <td><p>4</p></td>\n   <td><p>42</p></td>\n  </tr>\n </tbody>\n</table>\n<br>\n<br>\n<p><strong>Table 2</strong></p>\n<p><strong>Peter Lynch</strong></p>\n<p>Peter Lynch, manager of the Fidelity Magellan Fund during the 1980s, developed a \"quick\" way to determine if a stock is undervalued or overvalued. The manager compared the company's price line to an earnings line based on a price-earnings ratio of 15. Figure 4 illustrates a sample Peter Lynch chart for Walmart Inc. (WMT).</p>\n<p><img width=\"550\" height=\"400\" alt=\"c1471f65038cb6ac15099004b8fb5a0e.png\" src=\"https://s1.yimg.com/uu/api/res/1.2/X7Ik06qoOPn288Gh93hisg--/YXBwaWQ9eXRhY2h5b247cT03NTs-/https://media.zenfs.com/en-us/us.finance.gurufocus/9116691dbdf819890295947b08e4049f\"> </img></p>\n<p><strong>Figure 4</strong></p>\n<p>Table 3 lists the number of Peter Lynch stocks for each GuruFocus subscription region.</p>\n<table cellpadding=\"0\" cellspacing=\"0\">\n <tbody>\n  <tr>\n   <td><p>Region</p></td>\n   <td><p>U.S.</p></td>\n   <td><p>Asia</p></td>\n   <td><p>Europe</p></td>\n   <td><p>Canada</p></td>\n   <td><p>U.K. / Ireland</p></td>\n   <td><p>Oceania</p></td>\n   <td><p>Latin America</p></td>\n   <td><p>Africa</p></td>\n   <td><p>India</p></td>\n  </tr>\n  <tr>\n   <td><p>Peter Lynch Screen</p></td>\n   <td><p>50</p></td>\n   <td><p>91</p></td>\n   <td><p>71</p></td>\n   <td><p>0</p></td>\n   <td><p>25</p></td>\n   <td><p>0</p></td>\n   <td><p>12</p></td>\n   <td><p>5</p></td>\n   <td><p>14</p></td>\n  </tr>\n </tbody>\n</table>\n<br>\n<br>\n<p><strong>Table 3</strong></p>\n<p><strong>See also</strong></p>\n<p>Table 4 lists the screener record for the majority of the remaining value screens listed under the \"Screeners\" tab.</p>\n<table cellpadding=\"0\" cellspacing=\"0\">\n <tbody>\n  <tr>\n   <td><p>Region</p></td>\n   <td><p>U.S.</p></td>\n   <td><p>Asia</p></td>\n   <td><p>Europe</p></td>\n   <td><p>Canada</p></td>\n   <td><p>U.K. / Ireland</p></td>\n   <td><p>Oceania</p></td>\n   <td><p>Latin America</p></td>\n   <td><p>Africa</p></td>\n   <td><p>India</p></td>\n  </tr>\n  <tr>\n   <td><p>Magic Formula</p></td>\n   <td><p>4477</p></td>\n   <td><p>13398</p></td>\n   <td><p>8120</p></td>\n   <td><p>505</p></td>\n   <td><p>2568</p></td>\n   <td><p>531</p></td>\n   <td><p>1348</p></td>\n   <td><p>307</p></td>\n   <td><p>3494</p></td>\n  </tr>\n  <tr>\n   <td><p>Historical Low Price-Sales</p></td>\n   <td><p>86</p></td>\n   <td><p>167</p></td>\n   <td><p>112</p></td>\n   <td><p>10</p></td>\n   <td><p>49</p></td>\n   <td><p>1</p></td>\n   <td><p>43</p></td>\n   <td><p>9</p></td>\n   <td><p>67</p></td>\n  </tr>\n  <tr>\n   <td><p>Historical Low Price-Book</p></td>\n   <td><p>94</p></td>\n   <td><p>181</p></td>\n   <td><p>129</p></td>\n   <td><p>8</p></td>\n   <td><p>56</p></td>\n   <td><p>4</p></td>\n   <td><p>26</p></td>\n   <td><p>10</p></td>\n   <td><p>80</p></td>\n  </tr>\n  <tr>\n   <td><p>52-week Lows</p></td>\n   <td><p>452</p></td>\n   <td><p>2145</p></td>\n   <td><p>864</p></td>\n   <td><p>31</p></td>\n   <td><p>415</p></td>\n   <td><p>25</p></td>\n   <td><p>442</p></td>\n   <td><p>117</p></td>\n   <td><p>806</p></td>\n  </tr>\n  <tr>\n   <td><p>52-week Highs</p></td>\n   <td><p>701</p></td>\n   <td><p>1099</p></td>\n   <td><p>1236</p></td>\n   <td><p>77</p></td>\n   <td><p>438</p></td>\n   <td><p>42</p></td>\n   <td><p>557</p></td>\n   <td><p>46</p></td>\n   <td><p>249</p></td>\n  </tr>\n  <tr>\n   <td><p>High Dividend Yield</p></td>\n   <td><p>130</p></td>\n   <td><p>76</p></td>\n   <td><p>202</p></td>\n   <td><p>11</p></td>\n   <td><p>23</p></td>\n   <td><p>17</p></td>\n   <td><p>25</p></td>\n   <td><p>15</p></td>\n   <td><p>29</p></td>\n  </tr>\n </tbody>\n</table>\n<br>\n<br>\n<p><strong>Table 4</strong></p>\n<p>Disclosure: Author is long Apple.</p>\n<p>Read more here:</p>\n<ul>\n <br>\n <li>Video: Warren Buffett's Market Indicator Rises Above 130%</li>\n <li>Warren Buffett's Apple Falls as Company Skips June-Quarter Guidance</li>\n <li>Video: Tracking Warren Buffett's Trades Using GURUG</li>\n</br></ul>\n<br>\n<br>\n<p><span style=\"color:rgb(0, 0, 0);\">Not a Premium Member of GuruFocus? Sign up for a </span>free 7-day trial here<span style=\"color:rgb(0, 0, 0);\">.</span></p>This article first appeared on \n<a href=\"https://www.gurufocus.com/news/1131384/value-screeners-identify-opportunities-as-markets-rebound-from-march-lows/r/caf6fe0e0db70d936033da5461e60141\">GuruFocus</a>.\n<br>\n<p></p>\n<ul>\n <li><a href=\"https://www.gurufocus.com/financials/AAPL?r=caf6fe0e0db70d936033da5461e60141\" style=\"color:red !important;\">Warning! GuruFocus has detected 8 Warning Sign with AAPL. Click here to check it out. </a></li> \n <li><a href=\"https://www.gurufocus.com/financials/AAPL?r=caf6fe0e0db70d936033da5461e60141\">AAPL 30-Year Financial Data</a></li>\n <li><a href=\"https://www.gurufocus.com/analysis/AAPL?subtab=val&amp;r=caf6fe0e0db70d936033da5461e60141\">The intrinsic value of AAPL</a></li>\n <li><a href=\"https://www.gurufocus.com/chart/AAPL#&amp;serie=,,id:price,s:AAPL,,id:custompe,s:AAPL&amp;log=0&amp;per=0&amp;r=caf6fe0e0db70d936033da5461e60141\">Peter Lynch Chart of AAPL</a></li>\n</ul>\n<br>\n<p></p></br></br></br></br></br></br></br></br></br></br></br></br></br>",
              "streams": []
          },
          {
              "uuid": "81cf86ae-86dc-376e-99e6-d5433cbda068",
              "title": "U.S. Cases Rise 2.3%; Pence’s Aide Tests Positive: Virus Update",
              "link": "https://finance.yahoo.com/news/nyc-hires-10-000-tracing-171526365.html",
              "summary": "(Bloomberg) -- New York City will hire 10,000 people for an unprecedented effort to trace contacts by people infected with the virus. U.S. unemployment reached the highest rate since just after the Great Depression. U.S. cases rose 2.3%.Florida’s hardest-hit and most populous county plans to start reopening May 18. Vice President Mike Pence’s press secretary tested positive for the virus.The U.K. government dampened expectations the lockdown will be significantly rolled back as scientists warned the infection rate has crept higher in recent days.Key DevelopmentsVirus Tracker: cases pass 3.9 million; deaths top 273,000America’s hospitals pushed to brink of financial ruinA look at the most promising vaccine candidatesNext coronavirus health crisis could be a wave of suicidesWithout CDC guidelines, reopening rules are a patchworkChildren suspected of spreading disease as societies reopenSubscribe to a daily update on the virus from Bloomberg’s Prognosis team here. Click VRUS on the terminal for news and data on the coronavirus. See this week’s top stories from QuickTake here.Democratics Ask Five Companies to Repay Aid (6:08 a.m. HK)Democratic members of a new House panel created to oversee coronavirus relief spending demanded that five publicly owned companies immediately return taxpayer funds the lawmakers said were intended for smaller businesses. The Republican members of the panel didn’t sign the letters, and Representative Steve Scalise, the second-ranking House Republican and a member of the committee, blasted Democrats for making the panel’s first official act “blindly sending harassing letters to individual companies that followed the law.”The letters were sent to EVO Transportation & Energy Services Inc.; Gulf Island Fabrication Inc.; MiMedx Group Inc.; Universal Stainless & Alloy Products, Inc.; and Quantum Corp. The companies didn’t immediately return messages seeking comment. A statement by the panel, led by Chairman Jim Clyburn of South Carolina, said the companies all are publicly owned, have market capitalization of more than $25 million, have more than 600 employees, and sought and received loans through the Paycheck Protection Program for small business of at least $10 million.Pence Press Secretary Tests Positive (5:30 p.m. NY)Vice President Mike Pence’s press secretary, Katie Miller, tested positive for Covid-19 on Friday, President Donald Trump said, briefly delaying the vice president’s departure for a trip to Iowa.She is the second person working in the executive residence to test positive this week.Pence’s trip was delayed for more than an hour Friday amid concern over the test result, though Miller wasn’t aboard the flight and the staffers who had contact with her left the aircraft. They later tested negative. Miller hasn’t recently had direct contact with Trump, according to a senior administration official, but she is married to one of Trump’s closest aides, Stephen Miller.Honda Reopens U.S., Canada Plants Next Week (5:20 p.m. NY)Honda Motor Co. will resume operations at its vehicle and auto-parts factories in the U.S. and Canada starting Monday, joining a caravan of other carmakers restarting North American production this month for the first time since mid-March.The Japanese automaker said it will gradually ramp up output and stagger its reopening to allow workers to get used to new safety practices, including temperature checks and social-distancing measures. Honda closed plants on March 23 as the outbreak forced the shutdown of virtually all auto manufacturing on the continent.California Plans Mail-In Vote (4:41 p.m. NY)Every California voter will receive a mail-in ballot for the November election as a way to ensure public safety during the pandemic, state officials reported. Governor Gavin Newsom signed an executive order Friday directing counties to send ballots to all registered voters while also drafting plans to maintain physical polling places.Voting by mail has turned into a partisan issue, with Republicans claiming it can be subject to fraud. Newsom has cast it though as vital to protecting public health. California Secretary of State Alex Padilla called for young, healthy volunteers to staff polling sites for the Nov. 3 election, saying many people who have volunteered in the past are elderly and face greater risk from the coronavirus.Dash for U.S. Paycheck Loans Slows (4:30 p.m. NY)The pace of loan processing from a relief program for U.S. small businesses has slowed abruptly, allaying worries that funding for virus-related losses would be drained in days. The initial $349 billion for the Paycheck Protection Program ran out in 13 days, finishing at a clip of more than $30 billion a day. The initiative relaunched April 21 with an added $320 billion, with loans of $175.7 billion approved in five days. The Small Business Administration reported processing $10 billion since then -- a daily pace of $2.4 billion. At the current rate, it would take 10 weeks to exhaust the remaining funding.South Africa Reports Record New Cases (4:25 p.m. NY)A record 663 new infections have been detected in South Africa, bringing the total to 8,895, while the death toll has risen by 17 to 178, Health Minister Zweli Mkhize said. The Western Cape province, which includes Cape Town, the second-biggest city and main tourist attraction, has emerged as the epicenter of the disease in the country, accounting for about half the infections and fatalities.The number of cases has risen over the past 10 days, as screening and testing stepped up. About 5% of those diagnosed with Covid-19 have been hospitalized, with 77 currently in intensive care and 40 of them on ventilators, Mkhize said.Tesla Can’t Reopen California Plant (4:15 p.m. NY)Tesla Inc. was told by the California county that’s home to its lone U.S. auto-assembly plant that it can’t reopen the facility this afternoon, hours after Chief Executive Officer Elon Musk made plans to do so.“We have not said that it’s appropriate to move forward,” Erica Pan, Alameda County’s health officer, said of Tesla on Friday during a web conference. The county said in an emailed statement that it informed Tesla it didn’t meet criteria to reopen.U.S. Cases Rise 2.3%, Matching One-Week Average (4 p.m. NY)U.S. cases increased 2.3% over the past 24 hours to 1.27 million, according to data collected by Johns Hopkins University and Bloomberg News. That was slightly lower than Thursday’s rate of 2.4% and matched the average daily increase over the past week of 2.3%. Deaths rose 1.9% to 76,475.Cases in New York rose by 2,938, to 330,407, according to the state’s website.Florida infections rose 1% to 39,199 while deaths climbed 4.3% to 1,669, according to the state’s health department.California’s cases increased 3.1%, to 62,512 while deaths climbed 3.2% to 2,585, according to the state’s website.Texas deaths rose above 1,000 as the state reported the biggest daily increase in cases since its April 10 peak of 1,441. Cases rose by 1,219 to 36,609 Friday, with fatalities totaling 1,004, according to the state’s health department.Ousted Whistle-Blower Should Be Reinstated: Watchdog (3:19 p.m. NY)Rick Bright, the ousted former head of the U.S. agency in charge of developing medical countermeasures to crises such as the coronavirus, should return to his job for now, the Office of Special Counsel determined.The federal watchdog told Bright and his lawyers that it recommended to the Department of Health and Human Services that he be reinstated as the head of the Biomedical Advanced Research and Development Authority for 45 days while it investigates Bright’s complaint.The office determined that it’s possible Bright was moved to a lower position at the National Institutes of Health out of retaliation, his lawyers at Katz, Marshall & Banks said in a statement Friday.Bright filed a complaint with the special counsel Tuesday alleging instances where he clashed with his HHS bosses, most notably over his concern that malaria drugs pushed by the administration as Covid-19 treatments were unsafe.Apple Opening Some U.S. Stores (3:15 p.m. NY)Apple Inc. will start to reopen some stores next week in Idaho, South Carolina, Alabama and Alaska, the company said in a statement. The retail locations will add safety measures, including temperature checks, social distancing and face coverings. The company will limit the numbers of shoppers in a store.France Deaths Rise; Transit Limits Set (2:10 p.m. NY)France reported 243 deaths and 1,525 new infections on Friday, the public health agency said. Total deaths rose to 26,230 and total cases reached 210,969.Authorities outlined measures to sharply limit the number of passengers on public transportation starting Monday when the country is set to ease lockdown measures. About half of the Paris Metro’s stations will stay closed as the capital’s commuter network is considered a risk for a new wave of infections.N.J. Expands Testing to Asymptomatic People (2:06 p.m. NY)New Jersey will begin testing some residents not showing Covid-19 symptoms as the state seeks to broaden monitoring, Governor Phil Murphy said Friday. Health-care workers will still get priority, but including asymptomatic residents is part of “a step forward” as New Jersey looks to begin reopening its economy, Murphy said at a news briefing.Beaches stand a “good chance” of reopening by the Memorial Day holiday weekend, but with crowd limits, he said in an earlier “Good Day New York” interview on Fox 5 television.Texas Reports Most Cases in Month (2 p.m. NY)Texas reported 1,219 new cases, the most in almost a month, as the total reached 36,609 on Friday. Fatalities climbed to 1,004. State cases peaked at 1,441 on April 10.Governor Greg Abbott has said the data he reviews shows the pandemic is under control in Texas. A nonprofit research group, Texas 2036, built a website to track Covid-19 juxtaposed with its economic impact. The data shows cases on a rising trend on a 14-day basis.EU Keeps Border Shut Until Mid-June (1:23 p.m. NY)The European Union plans to prolong until June 15 a ban on most travel into the bloc, saying the pandemic situation “remains fragile both in Europe and worldwide.” Maintaining the restriction on non-essential travel into the EU for another 30 days is necessary to contain the spread of the coronavirus, said the European Commission, the bloc’s executive arm in Brussels. The measure was introduced in mid-March for 30 days and extended a first time last month until May 15.N.Y. ‘Finally Ahead’ of Virus: Cuomo (12:55 p.m. NY)Governor Andrew Cuomo declared New York is “finally ahead of the virus” after playing catch-up. Total hospitalizations are down to 8,196, from more than 18,000 at the peak. The daily death toll is at about 200, down from a high of nearly 800.“Finally, our destiny is in our hands. And it’s not subject to the whims of the virus. We are in control of the spread of the virus,” he said at his daily briefing.The state has 73 cases of children being affected with the virus with symptoms similar to Kawasaki disease, Cuomo said. New York has had at least one death of a child from the illness, and there may be others, he said.Italy Cases Decline Slightly (12:48 p.m. NY)Italy reported the fewest new cases and daily fatalities in three days on Friday, as the country debates how to pursue a gradual easing of a national lockdown.Deaths surpassed the 30,000 threshold, with a total of 30,201 since the start of the pandemic in late February. Civil protection authorities reported 1,327 cases for the 24-hour period, compared with 1,401 a day earlier. Confirmed cases now total 217,185.Regional leaders are urging Prime Minister Giuseppe Conte to allow businesses including shops to open earlier than May 18, as planned, but the government is insisting it must await data on the spread of the virus since an initial easing of a national lockdown on May 4.Euro Area Agrees on Credit Lines (12:45 p.m. NY)Euro-area finance ministers agreed to let the region’s bailout fund extend credit lines to member governments on concessionary terms, paving the way for countries including Italy to draw cheap liquidity amid an unprecedented spending spree.The deal reached Friday is a key part of the response to a crisis that’s put the European Union on track for the steepest recession in its history. The arrangement lets euro-area governments have access to cheap funds worth up to 2% of their output, without the onerous belt-tightening terms attached to the loans during the sovereign debt crisis.Read the full story.U.K. Deaths Exceed 31,000 (12:40 p.m. NY)The U.K. reported an additional 626 deaths on Friday, bringing its total to 31,241, Environment Secretary George Eustice said at the government’s daily briefing on the pandemic.Miami-Dade Eyes May 18 Reopening (11:55 a.m. NY)Miami-Dade Mayor Carlos Gimenez plans to start reopening Florida’s most populous county on May 18.“We’ll hopefully start opening up certain sectors of our economy on that date,” Gimenez told reporters Friday.Gimenez said he was hopeful that the reopening would include restaurants, but he said he was still working on the plan. He also stressed that the mid-May date was just a “target.”Florida Governor Ron DeSantis started opening the state on Monday, but he excluded three South Florida counties that have been coronavirus hot spots, including Miami-Dade. Florida reported 39,199 Covid-19 cases on Friday, up 1% from a day earlier. Deaths among Florida residents reached 1,669, an increase of 4.3%.NYC to Hire Thousands for Tracing (11:30 a.m. NY)New York Mayor Bill de Blasio said the city would embark on an unprecedented diagnostic-testing program, hiring as many as 10,000 public-health workers to trace contacts of people who are infected.The city, which is conducting about 14,000 daily tests, will need to increase its capability to 20,000 a day by May 25, with a goal of reaching 50,000 in the next few a months, the mayor said. Those who test positive will be placed in hotels if their homes are so crowded that they run the risk of infecting others, de Blasio said. Salesforce.com Inc. will help create a call center for tracing, he said.The city, which will use its sprawling Health and Hospitals Corp. to run the effort, has received about 7,000 applications for contact-tracing jobs, the mayor said.Amtrak to Restore Acela Service (10:55 a.m. NY)Amtrak said it will resume high-speed Acela service in the Northeast Corridor June 1 on a modified schedule of three weekday roundtrips to meet an anticipated increase in demand. Slower Northeast Regional service also will increase to 10 roundtrips from eight, the passenger railroad said Friday. Amtrak on Thursday said riders will need to cover their faces at stations and when walking through train cars. Amtrak has limited bookings to 50% of seats on Acela service.Portugal Has Big Case Rise for Third Day (10:50 a.m. NY)Portugal, which began easing confinement measures on Monday, reported a bigger increase in new cases for a third day on Friday while the number of patients in intensive-care units fell for a second day. There were 553 new cases, taking the total to 27,268, the government said. Total deaths rose by nine to 1,114. Deaths so far indicate a fatality rate of 4.1%, the health minister, Antonio Lacerda Sales, said in Lisbon on Friday.Swiss Plan to Track Restaurant Diners (10:20 a.m. NY)Swiss restaurant diners will be asked to provide their names and phone numbers before the meal in a move designed to track the spread of possible new infections as an eight-week lockdown continues to ease. Patrons will get a voluntary questionnaire on personal details so they an be contacted in case a fellow guest is later diagnosed with the virus, Swiss Interior Minister Alain Berset said in Bern on Friday.The data collected will be destroyed after two weeks. Restaurants will allow up to four people to share a table with at least two meters (6.5 feet) of separation, or a physical partition, from the next group of diners.U.K. Nations to Ease at Different Times (9:50 a.m. NY)England, Scotland, Wales and Northern Ireland could start easing U.K.-wide restrictions at different times if medical evidence shows it’s necessary, Scotland First Minister Nicola Sturgeon said Friday after speaking with Prime Minister Boris Johnson. Sturgeon, who has warned against lifting limits too soon, welcomed Johnson’s acknowledgment that parts of the country “may well need to move at different speeds” if the evidence dictates. Johnson is expected to announce plans to ease the lockdown on Sunday.Russia Mortality Remains Low: Minister (9:45 a.m. NY)Russia’s mortality rate is low even as infections surge toward 200,000, a sign the hospital system is coping with the outbreak, Health MinisterMikhail Murashko told the United Russia party Friday, according to the state-run Tass agency. Russia has averaged more than 10,000 daily cases in the past week, pushing its tally past Germany to rank sixth globally.Trump: WHO Is ‘Puppet for China’ (9:15 a.m. NY)President Donald Trump said the U.S. will soon announce plans on funding for the World Health Organization, which he says was complicit in the spread of the virus by accepting China’s claims about the severity of the outbreak.“They’re a puppet for China,” Trump said on “Fox & Friends” on Friday. “We’ve been paying so much more than anybody else. And I blame that on our politicians. To be honest with you, our politicians probably could’ve exerted a lot of force.”Trump last month temporarily suspended U.S. payments to the United Nations agency amid criticism from Democrats over his administration’s response to the virus crisis. The U.S. gives $450 million to WHO, the president said, while China pays $38 million.U.S. Jobless Rate Triples to 14.7% (8:30 a.m. NY)U.S. employers cut an unprecedented 20.5 million workers in April as the coronavirus-forced lockdown reversed a decade of labor-market gains in a single month.The Labor Department’s report showed the jobless rate more than tripled to 14.7% from 4.4% a month earlier, a far cry from the 3.5% rate in February that was the lowest in five decades.Canada, meantime, lost 2 million jobs last month, the biggest decline on record but only about half what economists had expected. The jobless rate jumped to 13%.Lagarde Says EU Must Stand Together (7:56 a.m. NY)The ECB president urged politicians to come up with a common response to the economic havoc created by the coronavirus, or risk fragmenting the euro zone. Speaking in a webcast about the pandemic, Lagarde said a “swift, sizable and symmetrical” European tool to fund the recovery is necessary, and that ECB will “play its part.”Officials in Brussels predict the worst recession in the EU’s history this year, and have warned that an uneven shock across the euro area threatens the stability of the bloc.Turkey Plans Half-Million Antibody Tests (7:50 a.m. NY)Turkey plans to conduct over half a million coronavirus antibody tests to help monitor and contain the spread of the outbreak, according to an official familiar with the matter.The nation’s state-run statistics agency has randomly selected 150,000 households -- or about one in every 165 -- for the tests, the official said, speaking on condition of anonymity.The one-month program begins in two weeks and will improve data on who has already been exposed, said Ates Kara, a member of Turkey’s Science Board, which advises the government on coronavirus measures.Spain Reports New Jump in Cases (6:48 a.m. NY)Spain reported 1,095 new cases in the last 24 hours, the biggest increase in nearly a week, as the country goes through the first phase of a plan to relax its lockdown after eight weeks of confinement.The total number of cases, adjusted to include changes in data for the Madrid region, rose to 222,857, according to Health Ministry data. Fatalities rose by 229 to 26,299. That compares with an increase of 213 on Thursday.Austria’s Kurz Optimistic on Lifting German Border Checks (6:18 a.m. NY)Austrian Chancellor Sebastian Kurz is “optimistic” that checks and restrictions at the country’s border with Germany can be lifted in coming weeks, he told journalists in Vienna. Keeping the checks, which currently impose a two-week quarantine for people entering Germany from Austria, would be a blow for Austria’s summer season, where German tourists are the most important group.Kurz said lifting the checks would also be crucial for commuters in regions close to the border and for business trips in the countries’ closely linked industries.Irish Unemployment Soars (6:17 a.m. NY)Ireland’s unemployment rate may have surged to 28.2% in April, by far the highest on record, the nation’s statistics office said. Joblessness jumped from 15.5% in March if all people receiving virus-related state payments are classed as unemployed. The rate stood at 4.8% in February.Intel Accused by Workers of Prioritizing Chip Output Over Safety (6 a.m. NY)Intel compromised worker safety at some of its factories to maintain chip production in the midst of the pandemic, according to complaints filed with government agencies and employees at one of the sites.At a plant in Chandler, Arizona, the world’s largest semiconductor maker did not isolate staff that worked closely with teammates who had tested positive and did not institute tests, people who work there said. Factory managers also dismissed concerns that social-distancing guidelines were not being followed properly, according to the people,The company said it responded with new policies to improve employee safety and kept factory output high because its products are essential.Sweden Starts Criminal Probe Into Care Home (2:30 pm HK)Swedish prosecutors have launched an investigation into an elderly care home in Stockholm where more than a third of residents have reportedly died after the novel coronavirus spread at the facility.Since the Covid-19 outbreak started, 35 residents at the home have passed away, according to a report from public broadcaster SVT. The facility came under scrutiny after a union safety representative filed a report with authorities, saying staff had moved between infected and healthy residents without changing protective gear.One Million in Johannesburg Need Food Aid (2:15 pm HK)Almost one million people in Johannesburg, South Africa’s commercial hub, are in need of food aid due to movement restrictions imposed to curb the coronavirus pandemic, according to its mayor. While South Africa has less than 9,000 infections, it’s still one of the highest numbers on the continent.Covid Is Type of Virus That Starts in Bats: WHO (2 pm HK)The novel coronavirus belongs to a group of viruses that begin in bats, and it’s still unclear what animal may have transmitted it to humans, Peter Ben Embarek, a WHO expert in animal diseases that jump to humans, said Friday in a briefing with reporters. The virus probably arrived in humans through contact with animals while raising food, though it’s unclear which species, he said.Cats and ferrets are susceptible to the virus, and dogs to a lesser extent, and it’s important to find which animals can get it to avoid creating a “reservoir” in another species, he said. The first human cases were detected in and around Wuhan, and most people had contact with the animal market, though not all, Ben Embarek said.Questions about the origin of Sars-CoV2, the virus that has caused the pandemic, have burned hotter since U.S. President Donald Trump suggested that it came from a lab in China. Scientists who have studied the issue maintain that the virus originated in an animal, and probably entered the human population in November.For more articles like this, please visit us at bloomberg.comSubscribe now to stay ahead with the most trusted business news source.©2020 Bloomberg L.P.",
              "publisher": "Bloomberg",
              "author": "Bloomberg News",
              "ignore_main_image": false,
              "type": "story",
              "published_at": 1588975687,
              "main_image": {
                  "original_height": 1467,
                  "original_width": 2200,
                  "original_url": "https://s.yimg.com/lo/api/res/1.2/mdvm0.stl1dwWV5OYHZJGg--/YXBwaWQ9eXZpZGVvZmVlZHM7dz0yMjAwO2g9MTQ2Nw--/https://media.zenfs.com/en/bloomberg_markets_842/a058c5f1c880aa12f19fa040820ff7bf",
                  "resolutions": [
                      {
                          "tag": "original",
                          "width": 2200,
                          "url": "https://s.yimg.com/lo/api/res/1.2/mdvm0.stl1dwWV5OYHZJGg--/YXBwaWQ9eXZpZGVvZmVlZHM7dz0yMjAwO2g9MTQ2Nw--/https://media.zenfs.com/en/bloomberg_markets_842/a058c5f1c880aa12f19fa040820ff7bf",
                          "tags": [
                              "size=original",
                              ""
                          ],
                          "height": 1467
                      },
                      {
                          "height": 140,
                          "width": 140,
                          "tag": "square-140x140",
                          "url": "https://s.yimg.com/lo/api/res/1.2/ypcZcUn1tgLnDpR189pq6A--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtoPTE0MDt3PTE0MA--/https://s.yimg.com/lo/api/res/1.2/mdvm0.stl1dwWV5OYHZJGg--/YXBwaWQ9eXZpZGVvZmVlZHM7dz0yMjAwO2g9MTQ2Nw--/https://media.zenfs.com/en/bloomberg_markets_842/a058c5f1c880aa12f19fa040820ff7bf"
                      },
                      {
                          "height": 427,
                          "width": 640,
                          "tag": "fit-width-640",
                          "url": "https://s.yimg.com/lo/api/res/1.2/nlkRMHjz9Nl2nSUxnwL.XA--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtoPTQyNi43NjM2MzYzNjM2MzY0O3c9NjQw/https://s.yimg.com/lo/api/res/1.2/mdvm0.stl1dwWV5OYHZJGg--/YXBwaWQ9eXZpZGVvZmVlZHM7dz0yMjAwO2g9MTQ2Nw--/https://media.zenfs.com/en/bloomberg_markets_842/a058c5f1c880aa12f19fa040820ff7bf"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/kcns7sx1lBvjahh8jOnsIA--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtweW9mZj0wO2g9MTQwO3c9MTQw/https://media.zenfs.com/en/bloomberg_markets_842/a058c5f1c880aa12f19fa040820ff7bf",
                          "height": 140,
                          "width": 140,
                          "tag": "ios:size=square_large"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/syIttt1uHM3gW7dIv0irig--/YXBwaWQ9eXZpZGVvZmVlZHM7aD0xMDY7dz0xNjA-/https://media.zenfs.com/en/bloomberg_markets_842/a058c5f1c880aa12f19fa040820ff7bf",
                          "height": 106,
                          "width": 160,
                          "tag": "ios:size=small"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/v3p6rR9pJV5O_wAedK2uEg--/YXBwaWQ9eXZpZGVvZmVlZHM7aD0yMTM7dz0zMjA-/https://media.zenfs.com/en/bloomberg_markets_842/a058c5f1c880aa12f19fa040820ff7bf",
                          "height": 213,
                          "width": 320,
                          "tag": "ios:size=medium"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/uJRMFK9Nc7_qeF_OcPrxAQ--/YXBwaWQ9eXZpZGVvZmVlZHM7aD00MjY7dz02NDA-/https://media.zenfs.com/en/bloomberg_markets_842/a058c5f1c880aa12f19fa040820ff7bf",
                          "height": 426,
                          "width": 640,
                          "tag": "ios:size=extra_large"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/YGq2PhGJ92h.5LrnaTfqvA--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtweW9mZj0wO2g9NTMwO3c9MzIw/https://media.zenfs.com/en/bloomberg_markets_842/a058c5f1c880aa12f19fa040820ff7bf",
                          "height": 530,
                          "width": 320,
                          "tag": "ios:size=card_small_fixed"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/mpUh_piMjQYT1BZOjDOWuQ--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtweW9mZj0wO2g9MTA2MDt3PTY0MA--/https://media.zenfs.com/en/bloomberg_markets_842/a058c5f1c880aa12f19fa040820ff7bf",
                          "height": 1060,
                          "width": 640,
                          "tag": "ios:size=card_large_fixed"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/Aq1bdNkyBLKovEfFnZ5UdQ--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtweW9mZj0wO2g9NTMwO3c9NjQw/https://media.zenfs.com/en/bloomberg_markets_842/a058c5f1c880aa12f19fa040820ff7bf",
                          "height": 530,
                          "width": 640,
                          "tag": "ios:size=large_new_fixed"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/a5t_2b8sFRSDqnHWbtL3fw--/YXBwaWQ9eXZpZGVvZmVlZHM7aD01MTI7dz03Njg-/https://media.zenfs.com/en/bloomberg_markets_842/a058c5f1c880aa12f19fa040820ff7bf",
                          "height": 512,
                          "width": 768,
                          "tag": "ios:size=ipad_portrait"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/cxZ..l9ukQVV6nmtTEMKyQ--/YXBwaWQ9eXZpZGVvZmVlZHM7aD0xMDI0O3c9MTUzNg--/https://media.zenfs.com/en/bloomberg_markets_842/a058c5f1c880aa12f19fa040820ff7bf",
                          "height": 1024,
                          "width": 1536,
                          "tag": "ios:size=ipad_portrait_retina"
                      }
                  ]
              },
              "entities": [
                  {
                      "term": "TICKER:7267.T",
                      "label": "HONDA MOTOR CO",
                      "score": 1
                  },
                  {
                      "term": "TICKER:AAPL",
                      "label": "Apple Inc.",
                      "score": 1
                  },
                  {
                      "term": "TICKER:AAPL.BA",
                      "label": "APPLE INC",
                      "score": 1
                  },
                  {
                      "term": "TICKER:AAPL34.SA",
                      "label": "APPLE       DRN",
                      "score": 1
                  },
                  {
                      "term": "TICKER:CRM.BA",
                      "label": "SALESFORCE.COM INC",
                      "score": 1
                  },
                  {
                      "term": "TICKER:GIFI",
                      "label": "Gulf Island Fabrication, Inc.",
                      "score": 1
                  },
                  {
                      "term": "TICKER:ITLC34.SA",
                      "label": "INTEL       DRN",
                      "score": 1
                  },
                  {
                      "term": "TICKER:MDXG",
                      "label": "MIMEDX GROUP INC",
                      "score": 1
                  },
                  {
                      "term": "TICKER:QMCO",
                      "label": "Quantum Corporation",
                      "score": 1
                  },
                  {
                      "term": "TICKER:TSLA",
                      "label": "Tesla, Inc.",
                      "score": 1
                  },
                  {
                      "term": "TICKER:TSLA.BA",
                      "label": "TESLA INC",
                      "score": 1
                  },
                  {
                      "term": "TICKER:TSLA34.SA",
                      "label": "TESLA INC   DRN",
                      "score": 1
                  }
              ],
              "is_magazine": false,
              "reference_id": "81cf86ae-86dc-376e-99e6-d5433cbda068",
              "offnet": false,
              "content": "<p>(Bloomberg) -- New York City will hire 10,000 people for an unprecedented effort to trace contacts by people infected with the virus. U.S. unemployment reached the highest rate since just after the Great Depression. U.S. cases rose 2.3%.</p>\n<p>Florida’s hardest-hit and most populous county plans to start reopening May 18. Vice President Mike Pence’s press secretary tested positive for the virus.</p>\n<p>The U.K. government dampened expectations the lockdown will be significantly rolled back as scientists warned the infection rate has crept higher in recent days.</p>\n<p>Key Developments</p>Virus Tracker: cases pass 3.9 million; deaths top 273,000America’s hospitals pushed to brink of financial ruinA look at the most promising vaccine candidatesNext coronavirus health crisis could be a wave of suicidesWithout CDC guidelines, reopening rules are a patchworkChildren suspected of spreading disease as societies reopen\n<p>Subscribe to a daily update on the virus from Bloomberg’s Prognosis team here. Click VRUS on the terminal for news and data on the coronavirus. See this week’s top stories from QuickTake here.</p>\n<p>Democratics Ask Five Companies to Repay Aid (6:08 a.m. HK)</p>\n<p>Democratic members of a new House panel created to oversee coronavirus relief spending demanded that five publicly owned companies immediately return taxpayer funds the lawmakers said were intended for smaller businesses. The Republican members of the panel didn’t sign the letters, and Representative Steve Scalise, the second-ranking House Republican and a member of the committee, blasted Democrats for making the panel’s first official act “blindly sending harassing letters to individual companies that followed the law.”</p>\n<p>The letters were sent to EVO Transportation &amp; Energy Services Inc.; Gulf Island Fabrication Inc.; MiMedx Group Inc.; Universal Stainless &amp; Alloy Products, Inc.; and Quantum Corp. The companies didn’t immediately return messages seeking comment. A statement by the panel, led by Chairman Jim Clyburn of South Carolina, said the companies all are publicly owned, have market capitalization of more than $25 million, have more than 600 employees, and sought and received loans through the Paycheck Protection Program for small business of at least $10 million.</p>\n<p>Pence Press Secretary Tests Positive (5:30 p.m. NY)</p>\n<p>Vice President Mike Pence’s press secretary, Katie Miller, tested positive for Covid-19 on Friday, President Donald Trump said, briefly delaying the vice president’s departure for a trip to Iowa.</p>\n<p>She is the second person working in the executive residence to test positive this week.</p>\n<p>Pence’s trip was delayed for more than an hour Friday amid concern over the test result, though Miller wasn’t aboard the flight and the staffers who had contact with her left the aircraft. They later tested negative. Miller hasn’t recently had direct contact with Trump, according to a senior administration official, but she is married to one of Trump’s closest aides, Stephen Miller.</p>\n<p>Honda Reopens U.S., Canada Plants Next Week (5:20 p.m. NY)</p>\n<p>Honda Motor Co. will resume operations at its vehicle and auto-parts factories in the U.S. and Canada starting Monday, joining a caravan of other carmakers restarting North American production this month for the first time since mid-March.</p>\n<p>The Japanese automaker said it will gradually ramp up output and stagger its reopening to allow workers to get used to new safety practices, including temperature checks and social-distancing measures. Honda closed plants on March 23 as the outbreak forced the shutdown of virtually all auto manufacturing on the continent.</p>\n<p>California Plans Mail-In Vote (4:41 p.m. NY)</p>\n<p>Every California voter will receive a mail-in ballot for the November election as a way to ensure public safety during the pandemic, state officials reported. Governor Gavin Newsom signed an executive order Friday directing counties to send ballots to all registered voters while also drafting plans to maintain physical polling places.</p>\n<p>Voting by mail has turned into a partisan issue, with Republicans claiming it can be subject to fraud. Newsom has cast it though as vital to protecting public health. California Secretary of State Alex Padilla called for young, healthy volunteers to staff polling sites for the Nov. 3 election, saying many people who have volunteered in the past are elderly and face greater risk from the coronavirus.</p>\n<p>Dash for U.S. Paycheck Loans Slows (4:30 p.m. NY)</p>\n<p>The pace of loan processing from a relief program for U.S. small businesses has slowed abruptly, allaying worries that funding for virus-related losses would be drained in days. The initial $349 billion for the Paycheck Protection Program ran out in 13 days, finishing at a clip of more than $30 billion a day. The initiative relaunched April 21 with an added $320 billion, with loans of $175.7 billion approved in five days. The Small Business Administration reported processing $10 billion since then -- a daily pace of $2.4 billion. At the current rate, it would take 10 weeks to exhaust the remaining funding.</p>\n<p>South Africa Reports Record New Cases (4:25 p.m. NY)</p>\n<p>A record 663 new infections have been detected in South Africa, bringing the total to 8,895, while the death toll has risen by 17 to 178, Health Minister Zweli Mkhize said. The Western Cape province, which includes Cape Town, the second-biggest city and main tourist attraction, has emerged as the epicenter of the disease in the country, accounting for about half the infections and fatalities.</p>\n<p>The number of cases has risen over the past 10 days, as screening and testing stepped up. About 5% of those diagnosed with Covid-19 have been hospitalized, with 77 currently in intensive care and 40 of them on ventilators, Mkhize said.</p>\n<p>Tesla Can’t Reopen California Plant (4:15 p.m. NY)</p>\n<p>Tesla Inc. was told by the California county that’s home to its lone U.S. auto-assembly plant that it can’t reopen the facility this afternoon, hours after Chief Executive Officer Elon Musk made plans to do so.</p>\n<p>“We have not said that it’s appropriate to move forward,” Erica Pan, Alameda County’s health officer, said of Tesla on Friday during a web conference. The county said in an emailed statement that it informed Tesla it didn’t meet criteria to reopen.</p>\n<p>U.S. Cases Rise 2.3%, Matching One-Week Average (4 p.m. NY)</p>\n<p>U.S. cases increased 2.3% over the past 24 hours to 1.27 million, according to data collected by Johns Hopkins University and Bloomberg News. That was slightly lower than Thursday’s rate of 2.4% and matched the average daily increase over the past week of 2.3%. Deaths rose 1.9% to 76,475.</p>Cases in New York rose by 2,938, to 330,407, according to the state’s website.Florida infections rose 1% to 39,199 while deaths climbed 4.3% to 1,669, according to the state’s health department.California’s cases increased 3.1%, to 62,512 while deaths climbed 3.2% to 2,585, according to the state’s website.Texas deaths rose above 1,000 as the state reported the biggest daily increase in cases since its April 10 peak of 1,441. Cases rose by 1,219 to 36,609 Friday, with fatalities totaling 1,004, according to the state’s health department.\n<p>Ousted Whistle-Blower Should Be Reinstated: Watchdog (3:19 p.m. NY)</p>\n<p>Rick Bright, the ousted former head of the U.S. agency in charge of developing medical countermeasures to crises such as the coronavirus, should return to his job for now, the Office of Special Counsel determined.</p>\n<p>The federal watchdog told Bright and his lawyers that it recommended to the Department of Health and Human Services that he be reinstated as the head of the Biomedical Advanced Research and Development Authority for 45 days while it investigates Bright’s complaint.The office determined that it’s possible Bright was moved to a lower position at the National Institutes of Health out of retaliation, his lawyers at Katz, Marshall &amp; Banks said in a statement Friday.Bright filed a complaint with the special counsel Tuesday alleging instances where he clashed with his HHS bosses, most notably over his concern that malaria drugs pushed by the administration as Covid-19 treatments were unsafe.</p>\n<p>Apple Opening Some U.S. Stores (3:15 p.m. NY)</p>\n<p>Apple Inc. will start to reopen some stores next week in Idaho, South Carolina, Alabama and Alaska, the company said in a statement. The retail locations will add safety measures, including temperature checks, social distancing and face coverings. The company will limit the numbers of shoppers in a store.</p>\n<p>France Deaths Rise; Transit Limits Set (2:10 p.m. NY)</p>\n<p>France reported 243 deaths and 1,525 new infections on Friday, the public health agency said. Total deaths rose to 26,230 and total cases reached 210,969.</p>\n<p>Authorities outlined measures to sharply limit the number of passengers on public transportation starting Monday when the country is set to ease lockdown measures. About half of the Paris Metro’s stations will stay closed as the capital’s commuter network is considered a risk for a new wave of infections.</p>\n<p>N.J. Expands Testing to Asymptomatic People (2:06 p.m. NY)</p>\n<p>New Jersey will begin testing some residents not showing Covid-19 symptoms as the state seeks to broaden monitoring, Governor Phil Murphy said Friday. Health-care workers will still get priority, but including asymptomatic residents is part of “a step forward” as New Jersey looks to begin reopening its economy, Murphy said at a news briefing.</p>\n<p>Beaches stand a “good chance” of reopening by the Memorial Day holiday weekend, but with crowd limits, he said in an earlier “Good Day New York” interview on Fox 5 television.</p>\n<p>Texas Reports Most Cases in Month (2 p.m. NY)</p>\n<p>Texas reported 1,219 new cases, the most in almost a month, as the total reached 36,609 on Friday. Fatalities climbed to 1,004. State cases peaked at 1,441 on April 10.</p>\n<p>Governor Greg Abbott has said the data he reviews shows the pandemic is under control in Texas. A nonprofit research group, Texas 2036, built a website to track Covid-19 juxtaposed with its economic impact. The data shows cases on a rising trend on a 14-day basis.</p>\n<p>EU Keeps Border Shut Until Mid-June (1:23 p.m. NY)</p>\n<p>The European Union plans to prolong until June 15 a ban on most travel into the bloc, saying the pandemic situation “remains fragile both in Europe and worldwide.” Maintaining the restriction on non-essential travel into the EU for another 30 days is necessary to contain the spread of the coronavirus, said the European Commission, the bloc’s executive arm in Brussels. The measure was introduced in mid-March for 30 days and extended a first time last month until May 15.</p>\n<p>N.Y. ‘Finally Ahead’ of Virus: Cuomo (12:55 p.m. NY)</p>\n<p>Governor Andrew Cuomo declared New York is “finally ahead of the virus” after playing catch-up. Total hospitalizations are down to 8,196, from more than 18,000 at the peak. The daily death toll is at about 200, down from a high of nearly 800.</p>\n<p>“Finally, our destiny is in our hands. And it’s not subject to the whims of the virus. We are in control of the spread of the virus,” he said at his daily briefing.</p>\n<p>The state has 73 cases of children being affected with the virus with symptoms similar to Kawasaki disease, Cuomo said. New York has had at least one death of a child from the illness, and there may be others, he said.</p>\n<p>Italy Cases Decline Slightly (12:48 p.m. NY)</p>\n<p>Italy reported the fewest new cases and daily fatalities in three days on Friday, as the country debates how to pursue a gradual easing of a national lockdown.</p>\n<p>Deaths surpassed the 30,000 threshold, with a total of 30,201 since the start of the pandemic in late February. Civil protection authorities reported 1,327 cases for the 24-hour period, compared with 1,401 a day earlier. Confirmed cases now total 217,185.</p>\n<p>Regional leaders are urging Prime Minister Giuseppe Conte to allow businesses including shops to open earlier than May 18, as planned, but the government is insisting it must await data on the spread of the virus since an initial easing of a national lockdown on May 4.</p>\n<p>Euro Area Agrees on Credit Lines (12:45 p.m. NY)</p>\n<p>Euro-area finance ministers agreed to let the region’s bailout fund extend credit lines to member governments on concessionary terms, paving the way for countries including Italy to draw cheap liquidity amid an unprecedented spending spree.</p>\n<p>The deal reached Friday is a key part of the response to a crisis that’s put the European Union on track for the steepest recession in its history. The arrangement lets euro-area governments have access to cheap funds worth up to 2% of their output, without the onerous belt-tightening terms attached to the loans during the sovereign debt crisis.</p>\n<p>Read the full story.</p>\n<p>U.K. Deaths Exceed 31,000 (12:40 p.m. NY)</p>\n<p>The U.K. reported an additional 626 deaths on Friday, bringing its total to 31,241, Environment Secretary George Eustice said at the government’s daily briefing on the pandemic.</p>\n<p>Miami-Dade Eyes May 18 Reopening (11:55 a.m. NY)</p>\n<p>Miami-Dade Mayor Carlos Gimenez plans to start reopening Florida’s most populous county on May 18.</p>\n<p>“We’ll hopefully start opening up certain sectors of our economy on that date,” Gimenez told reporters Friday.</p>\n<p>Gimenez said he was hopeful that the reopening would include restaurants, but he said he was still working on the plan. He also stressed that the mid-May date was just a “target.”</p>\n<p>Florida Governor Ron DeSantis started opening the state on Monday, but he excluded three South Florida counties that have been coronavirus hot spots, including Miami-Dade. Florida reported 39,199 Covid-19 cases on Friday, up 1% from a day earlier. Deaths among Florida residents reached 1,669, an increase of 4.3%.</p>\n<p>NYC to Hire Thousands for Tracing (11:30 a.m. NY)</p>\n<p>New York Mayor Bill de Blasio said the city would embark on an unprecedented diagnostic-testing program, hiring as many as 10,000 public-health workers to trace contacts of people who are infected.</p>\n<p>The city, which is conducting about 14,000 daily tests, will need to increase its capability to 20,000 a day by May 25, with a goal of reaching 50,000 in the next few a months, the mayor said. Those who test positive will be placed in hotels if their homes are so crowded that they run the risk of infecting others, de Blasio said. Salesforce.com Inc. will help create a call center for tracing, he said.</p>\n<p>The city, which will use its sprawling Health and Hospitals Corp. to run the effort, has received about 7,000 applications for contact-tracing jobs, the mayor said.</p>\n<p>Amtrak to Restore Acela Service (10:55 a.m. NY)</p>\n<p>Amtrak said it will resume high-speed Acela service in the Northeast Corridor June 1 on a modified schedule of three weekday roundtrips to meet an anticipated increase in demand. Slower Northeast Regional service also will increase to 10 roundtrips from eight, the passenger railroad said Friday. Amtrak on Thursday said riders will need to cover their faces at stations and when walking through train cars. Amtrak has limited bookings to 50% of seats on Acela service.</p>\n<p>Portugal Has Big Case Rise for Third Day (10:50 a.m. NY)</p>\n<p>Portugal, which began easing confinement measures on Monday, reported a bigger increase in new cases for a third day on Friday while the number of patients in intensive-care units fell for a second day. There were 553 new cases, taking the total to 27,268, the government said. Total deaths rose by nine to 1,114. Deaths so far indicate a fatality rate of 4.1%, the health minister, Antonio Lacerda Sales, said in Lisbon on Friday.</p>\n<p>Swiss Plan to Track Restaurant Diners (10:20 a.m. NY)</p>\n<p>Swiss restaurant diners will be asked to provide their names and phone numbers before the meal in a move designed to track the spread of possible new infections as an eight-week lockdown continues to ease. Patrons will get a voluntary questionnaire on personal details so they an be contacted in case a fellow guest is later diagnosed with the virus, Swiss Interior Minister Alain Berset said in Bern on Friday.</p>\n<p>The data collected will be destroyed after two weeks. Restaurants will allow up to four people to share a table with at least two meters (6.5 feet) of separation, or a physical partition, from the next group of diners.</p>\n<p>U.K. Nations to Ease at Different Times (9:50 a.m. NY)</p>\n<p>England, Scotland, Wales and Northern Ireland could start easing U.K.-wide restrictions at different times if medical evidence shows it’s necessary, Scotland First Minister Nicola Sturgeon said Friday after speaking with Prime Minister Boris Johnson. Sturgeon, who has warned against lifting limits too soon, welcomed Johnson’s acknowledgment that parts of the country “may well need to move at different speeds” if the evidence dictates. Johnson is expected to announce plans to ease the lockdown on Sunday.</p>\n<p>Russia Mortality Remains Low: Minister (9:45 a.m. NY)</p>\n<p>Russia’s mortality rate is low even as infections surge toward 200,000, a sign the hospital system is coping with the outbreak, Health MinisterMikhail Murashko told the United Russia party Friday, according to the state-run Tass agency. Russia has averaged more than 10,000 daily cases in the past week, pushing its tally past Germany to rank sixth globally.</p>\n<p>Trump: WHO Is ‘Puppet for China’ (9:15 a.m. NY)</p>\n<p>President Donald Trump said the U.S. will soon announce plans on funding for the World Health Organization, which he says was complicit in the spread of the virus by accepting China’s claims about the severity of the outbreak.</p>\n<p>“They’re a puppet for China,” Trump said on “Fox &amp; Friends” on Friday. “We’ve been paying so much more than anybody else. And I blame that on our politicians. To be honest with you, our politicians probably could’ve exerted a lot of force.”</p>\n<p>Trump last month temporarily suspended U.S. payments to the United Nations agency amid criticism from Democrats over his administration’s response to the virus crisis. The U.S. gives $450 million to WHO, the president said, while China pays $38 million.</p>\n<p>U.S. Jobless Rate Triples to 14.7% (8:30 a.m. NY)</p>\n<p>U.S. employers cut an unprecedented 20.5 million workers in April as the coronavirus-forced lockdown reversed a decade of labor-market gains in a single month.</p>\n<p>The Labor Department’s report showed the jobless rate more than tripled to 14.7% from 4.4% a month earlier, a far cry from the 3.5% rate in February that was the lowest in five decades.</p>\n<p>Canada, meantime, lost 2 million jobs last month, the biggest decline on record but only about half what economists had expected. The jobless rate jumped to 13%.</p>\n<p>Lagarde Says EU Must Stand Together (7:56 a.m. NY)</p>\n<p>The ECB president urged politicians to come up with a common response to the economic havoc created by the coronavirus, or risk fragmenting the euro zone. Speaking in a webcast about the pandemic, Lagarde said a “swift, sizable and symmetrical” European tool to fund the recovery is necessary, and that ECB will “play its part.”</p>\n<p>Officials in Brussels predict the worst recession in the EU’s history this year, and have warned that an uneven shock across the euro area threatens the stability of the bloc.</p>\n<p>Turkey Plans Half-Million Antibody Tests (7:50 a.m. NY)</p>\n<p>Turkey plans to conduct over half a million coronavirus antibody tests to help monitor and contain the spread of the outbreak, according to an official familiar with the matter.</p>\n<p>The nation’s state-run statistics agency has randomly selected 150,000 households -- or about one in every 165 -- for the tests, the official said, speaking on condition of anonymity.</p>\n<p>The one-month program begins in two weeks and will improve data on who has already been exposed, said Ates Kara, a member of Turkey’s Science Board, which advises the government on coronavirus measures.</p>\n<p>Spain Reports New Jump in Cases (6:48 a.m. NY)</p>\n<p>Spain reported 1,095 new cases in the last 24 hours, the biggest increase in nearly a week, as the country goes through the first phase of a plan to relax its lockdown after eight weeks of confinement.</p>\n<p>The total number of cases, adjusted to include changes in data for the Madrid region, rose to 222,857, according to Health Ministry data. Fatalities rose by 229 to 26,299. That compares with an increase of 213 on Thursday.</p>\n<p>Austria’s Kurz Optimistic on Lifting German Border Checks (6:18 a.m. NY)</p>\n<p>Austrian Chancellor Sebastian Kurz is “optimistic” that checks and restrictions at the country’s border with Germany can be lifted in coming weeks, he told journalists in Vienna. Keeping the checks, which currently impose a two-week quarantine for people entering Germany from Austria, would be a blow for Austria’s summer season, where German tourists are the most important group.</p>\n<p>Kurz said lifting the checks would also be crucial for commuters in regions close to the border and for business trips in the countries’ closely linked industries.</p>\n<p>Irish Unemployment Soars (6:17 a.m. NY)</p>\n<p>Ireland’s unemployment rate may have surged to 28.2% in April, by far the highest on record, the nation’s statistics office said. Joblessness jumped from 15.5% in March if all people receiving virus-related state payments are classed as unemployed. The rate stood at 4.8% in February.</p>\n<p>Intel Accused by Workers of Prioritizing Chip Output Over Safety (6 a.m. NY)</p>\n<p>Intel compromised worker safety at some of its factories to maintain chip production in the midst of the pandemic, according to complaints filed with government agencies and employees at one of the sites.At a plant in Chandler, Arizona, the world’s largest semiconductor maker did not isolate staff that worked closely with teammates who had tested positive and did not institute tests, people who work there said. Factory managers also dismissed concerns that social-distancing guidelines were not being followed properly, according to the people,</p>\n<p>The company said it responded with new policies to improve employee safety and kept factory output high because its products are essential.</p>\n<p>Sweden Starts Criminal Probe Into Care Home (2:30 pm HK)</p>\n<p>Swedish prosecutors have launched an investigation into an elderly care home in Stockholm where more than a third of residents have reportedly died after the novel coronavirus spread at the facility.</p>\n<p>Since the Covid-19 outbreak started, 35 residents at the home have passed away, according to a report from public broadcaster SVT. The facility came under scrutiny after a union safety representative filed a report with authorities, saying staff had moved between infected and healthy residents without changing protective gear.</p>\n<p>One Million in Johannesburg Need Food Aid (2:15 pm HK)</p>\n<p>Almost one million people in Johannesburg, South Africa’s commercial hub, are in need of food aid due to movement restrictions imposed to curb the coronavirus pandemic, according to its mayor. While South Africa has less than 9,000 infections, it’s still one of the highest numbers on the continent.</p>\n<p>Covid Is Type of Virus That Starts in Bats: WHO (2 pm HK)</p>\n<p>The novel coronavirus belongs to a group of viruses that begin in bats, and it’s still unclear what animal may have transmitted it to humans, Peter Ben Embarek, a WHO expert in animal diseases that jump to humans, said Friday in a briefing with reporters. The virus probably arrived in humans through contact with animals while raising food, though it’s unclear which species, he said.</p>\n<p>Cats and ferrets are susceptible to the virus, and dogs to a lesser extent, and it’s important to find which animals can get it to avoid creating a “reservoir” in another species, he said. The first human cases were detected in and around Wuhan, and most people had contact with the animal market, though not all, Ben Embarek said.</p>\n<p>Questions about the origin of Sars-CoV2, the virus that has caused the pandemic, have burned hotter since U.S. President Donald Trump suggested that it came from a lab in China. Scientists who have studied the issue maintain that the virus originated in an animal, and probably entered the human population in November.</p>\n<p>For more articles like this, please visit us at <a href=\"https://www.bloomberg.com\">bloomberg.com</a></p>\n<p><a href=\"https://www.bloomberg.com/subscriptions/67obqkd5zdp5lj8/?utm_source=yahoo_usn\">Subscribe now</a> to stay ahead with the most trusted business news source.</p>\n<p>©2020 Bloomberg L.P.</p>",
              "streams": []
          },
          {
              "uuid": "f374ef45-8e87-3af4-98b3-fdcc652885de",
              "title": "Tech Stocks Are Getting Pricey. Here Are 12 Stocks Still Worth Buying — and 1 to Short.",
              "link": "https://www.barrons.com/articles/tech-stocks-are-getting-pricey-here-are-12-stocks-still-worth-buyingand-1-to-short-51588972462?siteid=yhoof2&yptr=yahoo",
              "summary": "The Nasdaq Composite has soared more than 30% in the last six weeks, pushing some stocks into pricey territory. Here are tech names still worth buying, according to two portfolio managers.",
              "publisher": "Barrons.com",
              "author": "Eric J. Savitz",
              "ignore_main_image": false,
              "type": "story",
              "published_at": 1588972440,
              "main_image": null,
              "entities": [
                  {
                      "term": "TICKER:AAPL",
                      "label": "Apple Inc.",
                      "score": 1
                  },
                  {
                      "term": "TICKER:AMAT",
                      "label": "Applied Materials, Inc.",
                      "score": 1
                  },
                  {
                      "term": "TICKER:AMZN",
                      "label": "Amazon.com, Inc.",
                      "score": 1
                  },
                  {
                      "term": "TICKER:APRN",
                      "label": "Blue Apron Holdings, Inc.",
                      "score": 1
                  },
                  {
                      "term": "TICKER:HPQ",
                      "label": "HP Inc.",
                      "score": 1
                  },
                  {
                      "term": "TICKER:HPQ.BA",
                      "label": "HP INC",
                      "score": 1
                  },
                  {
                      "term": "TICKER:HPQB34.SA",
                      "label": "HP COMPANY  DRN",
                      "score": 1
                  }
              ],
              "is_magazine": false,
              "reference_id": "f374ef45-8e87-3af4-98b3-fdcc652885de",
              "offnet": true,
              "content": null,
              "streams": []
          },
          {
              "uuid": "93b02860-e7dd-3a05-98a6-e5705709a992",
              "title": "Stocks jump despite a record 20.5M jobs lost in April",
              "link": "https://finance.yahoo.com/video/stocks-jump-despite-record-20-205901750.html",
              "summary": "Managing Director & Chief U.S. Economist at NatWest Markets Michelle Girard joins Yahoo Finance’s Seana Smith to break down the April jobs report.",
              "publisher": "Yahoo Finance Video",
              "author": "",
              "type": "cavideo",
              "published_at": 1588971541,
              "main_image": {
                  "original_height": 1730,
                  "original_width": 3076,
                  "original_url": "https://s.yimg.com/lo/api/res/1.2/J.otgVSb4LOZyNzTE5H.HA--/YXBwaWQ9eXZpZGVvZmVlZHM7dz0zMDc2O2g9MTczMA--/https://s.yimg.com/hd/cp-video-transcode/prod/2020-05/08/5eb5c81790a80d675a63acce/5eb5cdcd5f6f656335c2c306_o_U_v3.jpg",
                  "resolutions": [
                      {
                          "tag": "original",
                          "width": 3076,
                          "url": "https://s.yimg.com/lo/api/res/1.2/J.otgVSb4LOZyNzTE5H.HA--/YXBwaWQ9eXZpZGVvZmVlZHM7dz0zMDc2O2g9MTczMA--/https://s.yimg.com/hd/cp-video-transcode/prod/2020-05/08/5eb5c81790a80d675a63acce/5eb5cdcd5f6f656335c2c306_o_U_v3.jpg",
                          "tags": [
                              "size=original",
                              ""
                          ],
                          "height": 1730
                      },
                      {
                          "height": 140,
                          "width": 140,
                          "tag": "square-140x140",
                          "url": "https://s.yimg.com/lo/api/res/1.2/vObkruiAzVedWCTQVCslhA--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtoPTE0MDt3PTE0MA--/https://s.yimg.com/lo/api/res/1.2/J.otgVSb4LOZyNzTE5H.HA--/YXBwaWQ9eXZpZGVvZmVlZHM7dz0zMDc2O2g9MTczMA--/https://s.yimg.com/hd/cp-video-transcode/prod/2020-05/08/5eb5c81790a80d675a63acce/5eb5cdcd5f6f656335c2c306_o_U_v3.jpg"
                      },
                      {
                          "height": 360,
                          "width": 640,
                          "tag": "fit-width-640",
                          "url": "https://s.yimg.com/lo/api/res/1.2/B5EhsUtHCNFLg1UqE0yoXg--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtoPTM1OS45NDc5ODQzOTUzMTg2O3c9NjQw/https://s.yimg.com/lo/api/res/1.2/J.otgVSb4LOZyNzTE5H.HA--/YXBwaWQ9eXZpZGVvZmVlZHM7dz0zMDc2O2g9MTczMA--/https://s.yimg.com/hd/cp-video-transcode/prod/2020-05/08/5eb5c81790a80d675a63acce/5eb5cdcd5f6f656335c2c306_o_U_v3.jpg"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/psCpqShXO8aa61LmAIb3SQ--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtweW9mZj0wO2g9MTQwO3c9MTQw/https://s.yimg.com/hd/cp-video-transcode/prod/2020-05/08/5eb5c81790a80d675a63acce/5eb5cdcd5f6f656335c2c306_o_U_v3.jpg",
                          "height": 140,
                          "width": 140,
                          "tag": "ios:size=square_large"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/9c195VsSr1NE0yi7rYTvcg--/YXBwaWQ9eXZpZGVvZmVlZHM7aD04OTt3PTE2MA--/https://s.yimg.com/hd/cp-video-transcode/prod/2020-05/08/5eb5c81790a80d675a63acce/5eb5cdcd5f6f656335c2c306_o_U_v3.jpg",
                          "height": 89,
                          "width": 160,
                          "tag": "ios:size=small"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/zP0EMk5HqjFuoUWBUuoClg--/YXBwaWQ9eXZpZGVvZmVlZHM7aD0xNzk7dz0zMjA-/https://s.yimg.com/hd/cp-video-transcode/prod/2020-05/08/5eb5c81790a80d675a63acce/5eb5cdcd5f6f656335c2c306_o_U_v3.jpg",
                          "height": 179,
                          "width": 320,
                          "tag": "ios:size=medium"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/Z2XyXndrzFxLV12FJ7HmGg--/YXBwaWQ9eXZpZGVvZmVlZHM7aD0zNTk7dz02NDA-/https://s.yimg.com/hd/cp-video-transcode/prod/2020-05/08/5eb5c81790a80d675a63acce/5eb5cdcd5f6f656335c2c306_o_U_v3.jpg",
                          "height": 359,
                          "width": 640,
                          "tag": "ios:size=extra_large"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/vuFmFMR5lU7u6k3w6ktKhQ--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtweW9mZj0wO2g9NTMwO3c9MzIw/https://s.yimg.com/hd/cp-video-transcode/prod/2020-05/08/5eb5c81790a80d675a63acce/5eb5cdcd5f6f656335c2c306_o_U_v3.jpg",
                          "height": 530,
                          "width": 320,
                          "tag": "ios:size=card_small_fixed"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/Q8pGj5oSAzb9UkU75BhI5g--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtweW9mZj0wO2g9MTA2MDt3PTY0MA--/https://s.yimg.com/hd/cp-video-transcode/prod/2020-05/08/5eb5c81790a80d675a63acce/5eb5cdcd5f6f656335c2c306_o_U_v3.jpg",
                          "height": 1060,
                          "width": 640,
                          "tag": "ios:size=card_large_fixed"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/V5tL1PUSMDHiOzTslihZdA--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtweW9mZj0wO2g9NTMwO3c9NjQw/https://s.yimg.com/hd/cp-video-transcode/prod/2020-05/08/5eb5c81790a80d675a63acce/5eb5cdcd5f6f656335c2c306_o_U_v3.jpg",
                          "height": 530,
                          "width": 640,
                          "tag": "ios:size=large_new_fixed"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/2cV1nWAXcjz6xecwa3jSOg--/YXBwaWQ9eXZpZGVvZmVlZHM7aD00MzE7dz03Njg-/https://s.yimg.com/hd/cp-video-transcode/prod/2020-05/08/5eb5c81790a80d675a63acce/5eb5cdcd5f6f656335c2c306_o_U_v3.jpg",
                          "height": 431,
                          "width": 768,
                          "tag": "ios:size=ipad_portrait"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/mVLZyIu3VayjgRFweKvNEA--/YXBwaWQ9eXZpZGVvZmVlZHM7aD04NjM7dz0xNTM2/https://s.yimg.com/hd/cp-video-transcode/prod/2020-05/08/5eb5c81790a80d675a63acce/5eb5cdcd5f6f656335c2c306_o_U_v3.jpg",
                          "height": 863,
                          "width": 1536,
                          "tag": "ios:size=ipad_portrait_retina"
                      }
                  ]
              },
              "entities": [
                  {
                      "term": "TICKER:0HD6.IL",
                      "label": "ALPHABET INC ALPHABET ORD  CLAS",
                      "score": 1
                  },
                  {
                      "term": "TICKER:AAPL",
                      "label": "Apple Inc.",
                      "score": 1
                  },
                  {
                      "term": "TICKER:AAPL.BA",
                      "label": "APPLE INC",
                      "score": 1
                  },
                  {
                      "term": "TICKER:AAPL34.SA",
                      "label": "APPLE       DRN",
                      "score": 1
                  },
                  {
                      "term": "TICKER:ABEC.BE",
                      "label": "ALPHABET INC.CL C DL-,001",
                      "score": 1
                  },
                  {
                      "term": "TICKER:ABEC.DE",
                      "label": "ALPHABET INC.CL C DL-,001",
                      "score": 1
                  },
                  {
                      "term": "TICKER:ABEC.DU",
                      "label": "ALPHABET INC.CL C DL-,001",
                      "score": 1
                  },
                  {
                      "term": "TICKER:ABEC.F",
                      "label": "ALPHABET INC.CL C DL-,001",
                      "score": 1
                  },
                  {
                      "term": "TICKER:ABEC.HA",
                      "label": "ALPHABET INC.CL C DL-,001",
                      "score": 1
                  },
                  {
                      "term": "TICKER:ABEC.HM",
                      "label": "ALPHABET INC.CL C DL-,001",
                      "score": 1
                  },
                  {
                      "term": "TICKER:ABEC.MU",
                      "label": "ALPHABET INC.CL C DL-,001",
                      "score": 1
                  },
                  {
                      "term": "TICKER:ABEC.SG",
                      "label": "Alphabet Inc. Reg. Shs Cap.Stk ",
                      "score": 1
                  },
                  {
                      "term": "TICKER:CTSH",
                      "label": "Cognizant Technology Solutions ",
                      "score": 1
                  },
                  {
                      "term": "TICKER:DLR",
                      "label": "Digital Realty Trust, Inc.",
                      "score": 1
                  },
                  {
                      "term": "TICKER:DLR-PC",
                      "label": "Digital Realty Trust, Inc. 6.62",
                      "score": 1
                  },
                  {
                      "term": "TICKER:DLR-PG",
                      "label": "Digital Realty Trust, Inc. Pref",
                      "score": 1
                  },
                  {
                      "term": "TICKER:DLR-PI",
                      "label": "Digital Realty Trust, Inc. 6.35",
                      "score": 1
                  },
                  {
                      "term": "TICKER:DLR-PJ",
                      "label": "Digital Realty Trust, Inc. 5.25",
                      "score": 1
                  },
                  {
                      "term": "TICKER:DLR-PK",
                      "label": "Digital Realty Trust, Inc. 5.85",
                      "score": 1
                  },
                  {
                      "term": "TICKER:DLR-PL",
                      "label": "Digital Realty Trust, Inc. 5.20",
                      "score": 1
                  },
                  {
                      "term": "TICKER:F",
                      "label": "Ford Motor Company",
                      "score": 1
                  },
                  {
                      "term": "TICKER:FCA.MI",
                      "label": "FIAT CHRYSLER AUTOMOBILES",
                      "score": 1
                  },
                  {
                      "term": "TICKER:FCAU",
                      "label": "Fiat Chrysler Automobiles N.V.",
                      "score": 1
                  },
                  {
                      "term": "TICKER:FDMO34.SA",
                      "label": "FORD MOTORS DRN",
                      "score": 1
                  },
                  {
                      "term": "TICKER:FLT",
                      "label": "FleetCor Technologies, Inc.",
                      "score": 1
                  },
                  {
                      "term": "TICKER:GM",
                      "label": "General Motors Company",
                      "score": 1
                  },
                  {
                      "term": "TICKER:GOOC.VI",
                      "label": "ALPHABET INC-CL C",
                      "score": 1
                  },
                  {
                      "term": "TICKER:GOOG",
                      "label": "Alphabet Inc.",
                      "score": 1
                  },
                  {
                      "term": "TICKER:GOOG.MX",
                      "label": "ALPHABET INC",
                      "score": 1
                  },
                  {
                      "term": "TICKER:GOOG.SN",
                      "label": "ALPHABET INC",
                      "score": 1
                  },
                  {
                      "term": "TICKER:GOOGL",
                      "label": "Alphabet Inc.",
                      "score": 1
                  },
                  {
                      "term": "TICKER:GOOGL.BA",
                      "label": "ALPHABET INC",
                      "score": 1
                  },
                  {
                      "term": "TICKER:HP",
                      "label": "Helmerich & Payne, Inc.",
                      "score": 1
                  },
                  {
                      "term": "TICKER:JNJ",
                      "label": "Johnson & Johnson",
                      "score": 1
                  },
                  {
                      "term": "TICKER:JNJ.BA",
                      "label": "JOHNSON & JOHNSON",
                      "score": 1
                  },
                  {
                      "term": "TICKER:JNJB34.SA",
                      "label": "JOHNSON     DRN",
                      "score": 1
                  },
                  {
                      "term": "TICKER:MRCK34.SA",
                      "label": "MERCK       DRN",
                      "score": 1
                  },
                  {
                      "term": "TICKER:MRK",
                      "label": "Merck & Company, Inc.",
                      "score": 1
                  },
                  {
                      "term": "TICKER:MRK.BA",
                      "label": "MERCK & CO INC",
                      "score": 1
                  },
                  {
                      "term": "TICKER:MSI",
                      "label": "Motorola Solutions, Inc.",
                      "score": 1
                  },
                  {
                      "term": "TICKER:NBL",
                      "label": "Noble Energy Inc.",
                      "score": 1
                  },
                  {
                      "term": "TICKER:NC0B.BE",
                      "label": "NEWS CORP. (NEW) B DL-,01",
                      "score": 1
                  },
                  {
                      "term": "TICKER:NC0B.F",
                      "label": "NEWS CORP. (NEW) B DL-,01",
                      "score": 1
                  },
                  {
                      "term": "TICKER:NC0B.MU",
                      "label": "NEWS CORP. (NEW) B DL-,01",
                      "score": 1
                  },
                  {
                      "term": "TICKER:NC0B.SG",
                      "label": "News Corp. Registered Shares B ",
                      "score": 1
                  },
                  {
                      "term": "TICKER:NFLX",
                      "label": "Netflix, Inc.",
                      "score": 1
                  },
                  {
                      "term": "TICKER:NFLX.BA",
                      "label": "NETFLIX INC",
                      "score": 1
                  },
                  {
                      "term": "TICKER:NFLX34.SA",
                      "label": "NETFLIX     DRN",
                      "score": 1
                  },
                  {
                      "term": "TICKER:NWS",
                      "label": "News Corporation",
                      "score": 1
                  },
                  {
                      "term": "TICKER:NWS.AX",
                      "label": "NEWS CORP B VOTING",
                      "score": 1
                  },
                  {
                      "term": "TICKER:NWSA",
                      "label": "News Corporation",
                      "score": 1
                  },
                  {
                      "term": "TICKER:NWSLV.AX",
                      "label": "NEWS CORP A NONVOTE",
                      "score": 1
                  },
                  {
                      "term": "TICKER:PFE",
                      "label": "Pfizer, Inc.",
                      "score": 1
                  },
                  {
                      "term": "TICKER:PFE.BA",
                      "label": "PFIZER INC",
                      "score": 1
                  },
                  {
                      "term": "TICKER:PFIZ34.SA",
                      "label": "PFIZER      DRN",
                      "score": 1
                  },
                  {
                      "term": "TICKER:ROKU",
                      "label": "Roku, Inc.",
                      "score": 1
                  },
                  {
                      "term": "TICKER:ZM",
                      "label": "Zoom Video Communications, Inc.",
                      "score": 1
                  },
                  {
                      "term": "TICKER:^DJI",
                      "label": "Dow Jones Industrial Average",
                      "score": 1
                  },
                  {
                      "term": "TICKER:^GSPC",
                      "label": "S&P 500",
                      "score": 1
                  },
                  {
                      "term": "TICKER:^IXIC",
                      "label": "NASDAQ Composite",
                      "score": 1
                  },
                  {
                      "term": "TICKER:^TNX",
                      "label": "CBOE Interest Rate 10 Year T No",
                      "score": 1
                  }
              ],
              "is_magazine": false,
              "reference_id": "93b02860-e7dd-3a05-98a6-e5705709a992",
              "offnet": false,
              "streams": [
                  {
                      "mime_type": "application/vnd.apple.mpegURL",
                      "url": "https://video.media.yql.yahoo.com/v1/hls/93b02860-e7dd-3a05-98a6-e5705709a992.m3u8?region=US&site=finance",
                      "uuid": "93b02860-e7dd-3a05-98a6-e5705709a992"
                  }
              ]
          },
          {
              "uuid": "cefb613b-0bd8-32db-a9db-a17cce9eb12a",
              "title": "Apple to Begin Reopening Its U.S. Stores",
              "link": "https://www.fool.com/investing/2020/05/08/apple-to-begin-reopening-its-stores.aspx?source=eptyholnk0000202&utm_source=yahoo-host&utm_medium=feed&utm_campaign=article&yptr=yahoo",
              "summary": "Apple (NASDAQ: AAPL) will begin to reopen some of its U.S. stores next week, the company announced Friday.  At about the time Apple reopened its stores in China in mid-March, the company closed most of its stores outside of the People's Republic.  Apple made this decision as the coronavirus pandemic led to lockdowns across the world.",
              "publisher": "Motley Fool",
              "author": "Will Healy, The Motley Fool",
              "ignore_main_image": true,
              "type": "story",
              "published_at": 1588970100,
              "main_image": {
                  "original_height": 980,
                  "original_width": 1400,
                  "original_url": "https://s.yimg.com/lo/api/res/1.2/PPMi_b6SAmZ43AIu3rMLTA--/YXBwaWQ9eXZpZGVvZmVlZHM7dz0xNDAwO2g9OTgw/https://media.zenfs.com/en-us/motleyfool.com/4530b41bb5cbefcd971e1de9522f37b0",
                  "resolutions": [
                      {
                          "tag": "original",
                          "width": 1400,
                          "url": "https://s.yimg.com/lo/api/res/1.2/PPMi_b6SAmZ43AIu3rMLTA--/YXBwaWQ9eXZpZGVvZmVlZHM7dz0xNDAwO2g9OTgw/https://media.zenfs.com/en-us/motleyfool.com/4530b41bb5cbefcd971e1de9522f37b0",
                          "tags": [
                              "size=original",
                              ""
                          ],
                          "height": 980
                      },
                      {
                          "height": 140,
                          "width": 140,
                          "tag": "square-140x140",
                          "url": "https://s.yimg.com/lo/api/res/1.2/ULSg5imdt995v.f1nkwmyw--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtoPTE0MDt3PTE0MA--/https://s.yimg.com/lo/api/res/1.2/PPMi_b6SAmZ43AIu3rMLTA--/YXBwaWQ9eXZpZGVvZmVlZHM7dz0xNDAwO2g9OTgw/https://media.zenfs.com/en-us/motleyfool.com/4530b41bb5cbefcd971e1de9522f37b0"
                      },
                      {
                          "height": 448,
                          "width": 640,
                          "tag": "fit-width-640",
                          "url": "https://s.yimg.com/lo/api/res/1.2/v.RCz8RizhPp1AkEtlmU5A--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtoPTQ0ODt3PTY0MA--/https://s.yimg.com/lo/api/res/1.2/PPMi_b6SAmZ43AIu3rMLTA--/YXBwaWQ9eXZpZGVvZmVlZHM7dz0xNDAwO2g9OTgw/https://media.zenfs.com/en-us/motleyfool.com/4530b41bb5cbefcd971e1de9522f37b0"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/W_6wptYCI3tQfCvsQwQ_nw--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtweW9mZj0wO2g9MTQwO3c9MTQw/https://media.zenfs.com/en-us/motleyfool.com/4530b41bb5cbefcd971e1de9522f37b0",
                          "height": 140,
                          "width": 140,
                          "tag": "ios:size=square_large"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/q_FXBbIvyvP.QI64DuzLXA--/YXBwaWQ9eXZpZGVvZmVlZHM7aD0xMTI7dz0xNjA-/https://media.zenfs.com/en-us/motleyfool.com/4530b41bb5cbefcd971e1de9522f37b0",
                          "height": 112,
                          "width": 160,
                          "tag": "ios:size=small"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/I0QVSuxR5bV_tVE1a__Dig--/YXBwaWQ9eXZpZGVvZmVlZHM7aD0yMjQ7dz0zMjA-/https://media.zenfs.com/en-us/motleyfool.com/4530b41bb5cbefcd971e1de9522f37b0",
                          "height": 224,
                          "width": 320,
                          "tag": "ios:size=medium"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/BF.jTgjHdhLyHoZ08MwGlQ--/YXBwaWQ9eXZpZGVvZmVlZHM7aD00NDg7dz02NDA-/https://media.zenfs.com/en-us/motleyfool.com/4530b41bb5cbefcd971e1de9522f37b0",
                          "height": 448,
                          "width": 640,
                          "tag": "ios:size=extra_large"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/v3WH0BG2qoURVZtCdz4qpw--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtweW9mZj0wO2g9NTMwO3c9MzIw/https://media.zenfs.com/en-us/motleyfool.com/4530b41bb5cbefcd971e1de9522f37b0",
                          "height": 530,
                          "width": 320,
                          "tag": "ios:size=card_small_fixed"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/5w8tYP7Ytkhz32QSWV895Q--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtweW9mZj0wO2g9MTA2MDt3PTY0MA--/https://media.zenfs.com/en-us/motleyfool.com/4530b41bb5cbefcd971e1de9522f37b0",
                          "height": 1060,
                          "width": 640,
                          "tag": "ios:size=card_large_fixed"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/hZePdZsc7I_ZNLo.IFbqww--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtweW9mZj0wO2g9NTMwO3c9NjQw/https://media.zenfs.com/en-us/motleyfool.com/4530b41bb5cbefcd971e1de9522f37b0",
                          "height": 530,
                          "width": 640,
                          "tag": "ios:size=large_new_fixed"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/aw.P1hR3.d4muyzMMF4AzQ--/YXBwaWQ9eXZpZGVvZmVlZHM7aD01Mzc7dz03Njg-/https://media.zenfs.com/en-us/motleyfool.com/4530b41bb5cbefcd971e1de9522f37b0",
                          "height": 537,
                          "width": 768,
                          "tag": "ios:size=ipad_portrait"
                      }
                  ]
              },
              "entities": [
                  {
                      "term": "TICKER:AAPL",
                      "label": "Apple Inc.",
                      "score": 1
                  }
              ],
              "is_magazine": false,
              "reference_id": "cefb613b-0bd8-32db-a9db-a17cce9eb12a",
              "offnet": true,
              "content": null,
              "streams": []
          },
          {
              "uuid": "7d145fa1-6216-3cce-95f0-3a0af04e5cd0",
              "title": "Porsche adds more functionality to Porsche Track Precision App",
              "link": "https://www.autoblog.com/2020/05/08/porsche-track-precision-app-update/",
              "summary": "Track telemetry functions are becoming more and more common with high-end sports cars, whether it's with the Mercedes-AMG Track Pace built-in system, or today's subject, the Porsche Track Precision App.  The latter is a free phone app compatible with select Porsche models, and the company is expanding its feature set with Apple CarPlay compatibility and additional race tracks.  The CarPlay part of the update now lets users operate the app within the Apple CarPlay phone mirroring system on the car's infotainment system.",
              "publisher": "Autoblog",
              "author": "Joel Stocksdale",
              "ignore_main_image": true,
              "type": "story",
              "published_at": 1588970040,
              "main_image": {
                  "original_height": 450,
                  "original_width": 800,
                  "original_url": "https://s.yimg.com/lo/api/res/1.2/RDbXKya3vu_ucr1_HLxVyw--/YXBwaWQ9eXZpZGVvZmVlZHM7dz04MDA7aD00NTA-/https://media.zenfs.com/en/autoblog_50/d851963518332552d04e4aaac80821f2",
                  "resolutions": [
                      {
                          "tag": "original",
                          "width": 800,
                          "url": "https://s.yimg.com/lo/api/res/1.2/RDbXKya3vu_ucr1_HLxVyw--/YXBwaWQ9eXZpZGVvZmVlZHM7dz04MDA7aD00NTA-/https://media.zenfs.com/en/autoblog_50/d851963518332552d04e4aaac80821f2",
                          "tags": [
                              "size=original",
                              ""
                          ],
                          "height": 450
                      },
                      {
                          "height": 140,
                          "width": 140,
                          "tag": "square-140x140",
                          "url": "https://s.yimg.com/lo/api/res/1.2/cZiSsKuLvPLIiJ3L3dl8Ag--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtoPTE0MDt3PTE0MA--/https://s.yimg.com/lo/api/res/1.2/RDbXKya3vu_ucr1_HLxVyw--/YXBwaWQ9eXZpZGVvZmVlZHM7dz04MDA7aD00NTA-/https://media.zenfs.com/en/autoblog_50/d851963518332552d04e4aaac80821f2"
                      },
                      {
                          "height": 360,
                          "width": 640,
                          "tag": "fit-width-640",
                          "url": "https://s.yimg.com/lo/api/res/1.2/cFAHVBPkyzcO7c9Rtb1a1A--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtoPTM2MDt3PTY0MA--/https://s.yimg.com/lo/api/res/1.2/RDbXKya3vu_ucr1_HLxVyw--/YXBwaWQ9eXZpZGVvZmVlZHM7dz04MDA7aD00NTA-/https://media.zenfs.com/en/autoblog_50/d851963518332552d04e4aaac80821f2"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/pQjnbcH7xsI4dYvpFy6djw--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtweW9mZj0wO2g9MTQwO3c9MTQw/https://media.zenfs.com/en/autoblog_50/d851963518332552d04e4aaac80821f2",
                          "height": 140,
                          "width": 140,
                          "tag": "ios:size=square_large"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/sDuBGkKEXriXkhMwSV._VA--/YXBwaWQ9eXZpZGVvZmVlZHM7aD05MDt3PTE2MA--/https://media.zenfs.com/en/autoblog_50/d851963518332552d04e4aaac80821f2",
                          "height": 90,
                          "width": 160,
                          "tag": "ios:size=small"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/nEy5G6lvc8cqViTL3IuIQQ--/YXBwaWQ9eXZpZGVvZmVlZHM7aD0xODA7dz0zMjA-/https://media.zenfs.com/en/autoblog_50/d851963518332552d04e4aaac80821f2",
                          "height": 180,
                          "width": 320,
                          "tag": "ios:size=medium"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/AJyN.hU9tzw9uBiSNbiWsA--/YXBwaWQ9eXZpZGVvZmVlZHM7aD0zNjA7dz02NDA-/https://media.zenfs.com/en/autoblog_50/d851963518332552d04e4aaac80821f2",
                          "height": 360,
                          "width": 640,
                          "tag": "ios:size=extra_large"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/wAzexJ5K_67QYd3y4B.0BA--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtweW9mZj0wO2g9NTMwO3c9MzIw/https://media.zenfs.com/en/autoblog_50/d851963518332552d04e4aaac80821f2",
                          "height": 530,
                          "width": 320,
                          "tag": "ios:size=card_small_fixed"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/Bd0nyF2ur8UWEJpYy.hzHg--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtweW9mZj0wO2g9MTA2MDt3PTY0MA--/https://media.zenfs.com/en/autoblog_50/d851963518332552d04e4aaac80821f2",
                          "height": 1060,
                          "width": 640,
                          "tag": "ios:size=card_large_fixed"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/dQmzHSl5RGt.nL7.zTjclQ--/YXBwaWQ9eXZpZGVvZmVlZHM7Zmk9ZmlsbDtweW9mZj0wO2g9NTMwO3c9NjQw/https://media.zenfs.com/en/autoblog_50/d851963518332552d04e4aaac80821f2",
                          "height": 530,
                          "width": 640,
                          "tag": "ios:size=large_new_fixed"
                      },
                      {
                          "url": "https://s.yimg.com/lo/api/res/1.2/SYcbUYixdHEZ4n8g8h.rqQ--/YXBwaWQ9eXZpZGVvZmVlZHM7aD00MzI7dz03Njg-/https://media.zenfs.com/en/autoblog_50/d851963518332552d04e4aaac80821f2",
                          "height": 432,
                          "width": 768,
                          "tag": "ios:size=ipad_portrait"
                      }
                  ]
              },
              "entities": [
                  {
                      "term": "TICKER:AAPL",
                      "label": "Apple Inc.",
                      "score": 1
                  }
              ],
              "is_magazine": false,
              "reference_id": "7d145fa1-6216-3cce-95f0-3a0af04e5cd0",
              "offnet": false,
              "content": "<img src=\"https://s.yimg.com/uu/api/res/1.2/EuAH6OzVM7C7gDDP_9k2hQ--/YXBwaWQ9eXRhY2h5b247cT03NTs-/https://media.zenfs.com/en/autoblog_50/d851963518332552d04e4aaac80821f2\"> \n<br> \n<br> \n<p>Track telemetry functions are becoming more and more common with high-end <a class=\"injectedLinkmain\" href=\"https://www.autoblog.com/performance/\">sports cars</a>, whether it's with <a href=\"https://www.autoblog.com/2018/09/19/2019-mercedes-amg-a-35-a-45/\">the Mercedes-AMG Track Pace built-in system</a>, or today's subject, <a href=\"https://www.autoblog.com/2020/01/15/2020-porsche-718-cayman-boxster-gts-flat-six/\">the Porsche Track Precision App</a>. The latter is a free phone app compatible with select <a class=\"injectedLinkmain\" href=\"https://www.autoblog.com/porsche/\">Porsche</a> models, and the company is expanding its feature set with Apple CarPlay compatibility and additional race tracks.</p> \n<p>The CarPlay part of the update now lets users operate the app within the Apple CarPlay phone mirroring system on the car's infotainment system. This way you won't have to have your phone placed somewhere so you can see recorded lap times and other information while driving on track. Porsche only specifically highlights Apple CarPlay compatibility, so it's unclear whether the same kind of functionality will be offered with the Android version of the app. One other unique Apple-specific feature Porsche mentioned is that Apple Watch users will also be able to record their heart rate on track, and the watch can vibrate to alert you when you've set a new personal lap record.</p> \n<p>What will likely be available on both apps is the expanded track list, which has increased by 100 for a total of over 300. Even if your favorite local race course isn't available in the app, you can always create a custom map using the phone's <a class=\"injectedLinkmain\" href=\"https://www.autoblog.com/tag/gps/\">GPS</a> system. Once your custom track or a preset one is selected, you can then record lap times, video, steering, throttle and brake usage and other details so you can analyze your performance.</p> \n<p> </p>\n<div id=\"best-deal-promo\"> \n <p style=\"text-align:center;\"><a href=\"https://www.autoblog.com/best-deal/?ncid=smartbuy\"><img src=\"https://s.yimg.com/uu/api/res/1.2/YDp6T3nXJR0iWbg0BNbb0A--/YXBwaWQ9eXRhY2h5b247cT03NTs-/https://media.zenfs.com/en/autoblog_50/35ff2fd6fd1fab91c0d38d1425b022d0\" width=\"300\" height=\"250\" /></a></p> \n</div>The app is currently available on the Apple App Store and Google Play Store. The app is free, but it only works with \n<a class=\"injectedLinkmain\" href=\"https://www.autoblog.com/porsche/911/\">Porsche 911</a>, 718 and GT models with Porsche Communication Management version 4.0 and with the Sport Chrono package. \n<p><strong>Related Video:</strong></p> \n<p> \n <!-- TAG START { player: &quot;Autoblog OFFICIAL (Click-To-Play) &quot;, owner: &quot;Autoblog&quot;, for: &quot;Autoblog&quot; } --> </p> \n<div class=\"video\"> \n <a href=\"https://www.autoblog.com/2020/05/08/porsche-track-precision-app-update/\"><img style=\"max-width:100%;\" src=\"https://s1.yimg.com/uu/api/res/1.2/3vpJWGurlomFiCob.6Oo8g--/YXBwaWQ9eXRhY2h5b247cT03NTs-/https://media.zenfs.com/en/autoblog_50/42094b0b811d1491ea973ec9c387becb\" /></a> \n <a href=\"https://www.autoblog.com/2020/05/08/porsche-track-precision-app-update/\"><br><b> Click here to See Video &gt;&gt;</b></br></a> \n</div> \n<p> \n <!-- TAG END { date: 05/08/20 } --> </p> \n<p>&nbsp;</p> \n<p>&nbsp;</p> \n<p style=\"text-align:center;\"><a href=\"https://www.autoblog.com/car-finder/?ncid=yahoo\"><img src=\"https://s1.yimg.com/uu/api/res/1.2/ALeFXW1t4.WzMHBUaFhXRg--/YXBwaWQ9eXRhY2h5b247cT03NTs-/https://media.zenfs.com/en/autoblog_50/a90a19ed701ee2a76d856565c615eb6b\" /></a></p> \n<p><strong>You Might Also Like</strong></p> \n<ul> \n <li><a href=\"https://www.autoblog.com/2020/05/08/podcast-jean-jennings-porsche-911-alfa-romeo-giulia-quadrifoglio-toyota-supra/\">Porsche 911 Carrera 4, Alfa Romeo Giulia Quadrifoglio and a chat with Jean Jennings | Autoblog Podcast #626</a></li> \n <li><a href=\"https://www.autoblog.com/2020/05/08/2020-porsche-macan-review/\">2020 Porsche Macan Review &amp; Buying Guide | The performance choice</a></li> \n <li><a href=\"https://www.autoblog.com/2020/05/05/2020-porsche-macan-turbo-exhaust-launch/\">The 2020 Porsche Macan Turbo launches with anger</a></li> \n</ul></br></br></img>",
              "streams": []
          },
          {
              "uuid": "c38d44c4-3dda-3897-a719-90c8a43c966b",
              "title": "US STOCKS-Wall Street jumps as historic job losses fewer than feared",
              "link": "https://finance.yahoo.com/news/us-stocks-wall-street-jumps-203114507.html",
              "summary": "Major U.S. stock indexes jumped on Friday and logged solid gains for the week after data on historic job losses due to the coronavirus crisis showed they were slightly fewer than feared.  All 11 S&P 500 sectors were positive, led by the beaten-up energy group, which gained 4.3%.  A 2.4% gain in Apple shares also lifted the indexes after the iPhone maker said it will reopen a handful of U.S. stores starting next week.",
              "publisher": "Reuters",
              "author": "Lewis Krauskopf",
              "ignore_main_image": false,
              "type": "story",
              "published_at": 1588969874,
              "main_image": null,
              "entities": [
                  {
                      "term": "TICKER:AAPL",
                      "label": "Apple Inc.",
                      "score": 1
                  }
              ],
              "is_magazine": false,
              "reference_id": "c38d44c4-3dda-3897-a719-90c8a43c966b",
              "offnet": false,
              "content": "<p>(For a live blog on the U.S. stock market, click or type LIVE/ in a news window.)</p> \n<p>* US economy suffers Great Depression-like job losses</p> \n<p>* Major indexes post weekly gains</p> \n<p>* Uber climbs as ride service bookings recover</p> \n<p>* Apple to reopen some US stores next week</p> \n<p>* Indexes up: Dow 1.91%, S&amp;P 500 1.69%, Nasdaq 1.58% (Adds VIX, Nasdaq milestones)</p> \n<p>By Lewis Krauskopf</p> \n<p>May 8 (Reuters) - Major U.S. stock indexes jumped on Friday and logged solid gains for the week after data on historic job losses due to the coronavirus crisis showed they were slightly fewer than feared.</p> \n<p>All 11 S&amp;P 500 sectors were positive, led by the beaten-up energy group, which gained 4.3%.</p> \n<p>A 2.4% gain in Apple shares also lifted the indexes after the iPhone maker said it will reopen a handful of U.S. stores starting next week.</p> \n<p>The U.S. economy lost 20.5 million jobs in April, the Labor Department reported. Economists polled by Reuters had forecast payrolls diving by 22 million, but the decline still marked the steepest plunge since the Great Depression.</p> \n<p>“It’s tough to call the jobs report, which is what everybody was waiting for, anything but a complete calamity, but relative to expectations you can see some silver linings in there,” said Brian Nick, chief investment strategist at Nuveen, pointing to the large number of temporary layoffs.</p> \n<p>“Except for the initial panic in the month of March, in general the markets are ignoring economic data for the most part and are looking more at data related to COVID-19,” Nick said.</p> \n<p>The Dow Jones Industrial Average rose 455.43 points, or 1.91%, to 24,331.32, the S&amp;P 500 gained 48.61 points, or 1.69%, to 2,929.8 and the Nasdaq Composite added 141.66 points, or 1.58%, to 9,121.32.</p> \n<p>The Nasdaq posted its fifth straight daily gain, its longest such streak since December 2019.</p> \n<p>The Cboe Volatility Index, known as Wall Street's fear gauge, fell 3.46 points to 27.98, its first close below 30 since Feb. 26.</p> \n<p>Financial markets on Thursday began pricing in a negative U.S. interest rate environment for the first time, as investors grappled with the economic consequences of the new coronavirus outbreak.</p> \n<p>Stocks have staged a sharp rebound since late March from the coronavirus-fueled sell-off, helped by massive monetary and fiscal stimulus. The tech-heavy Nasdaq on Thursday erased its 2020 declines and turned positive for the year.</p> \n<p>Investors are now watching efforts by a number of states to spark their economies by easing restrictions put in place to fight the outbreak.</p> \n<p>\"People are watching closely to just see how this reopening process works,\" said Keith Lerner, chief market strategist at Truist/SunTrust Advisory Services.</p> \n<p>\"On the margin, you are starting to hear businesses say that things are starting to look better from a depressed level.”</p> \n<p>Optimism for markets was also fed by news that U.S. and Chinese trade representatives discussed their Phase 1 trade deal, with China saying they agreed to improve the atmosphere for its implementation.</p> \n<p>In company news, Uber Technologies shares rose 6.0% after the company said ride service bookings slowly recovered in recent weeks.</p> \n<p>Noble Energy shares gained 13.5% after the company said on Friday it would curtail oil production and further cut its capital spending to cope with a plunge in oil prices.</p> \n<p>Advancing issues outnumbered declining ones on the NYSE by a 4.95-to-1 ratio; on Nasdaq, a 3.47-to-1 ratio favored advancers.</p> \n<p>The S&amp;P 500 posted 11 new 52-week highs and no new lows; the Nasdaq Composite recorded 64 new highs and three new lows.</p> \n<p>About 10.1 billion shares changed hands in U.S. exchanges, below the 11.4 billion daily average over the last 20 sessions. (Additional reporting by C Nivedita and Medha Singh in Bengaluru, Noel Randewich in San Francisco and Terence Gabriel and April Joyner in New York; Editing by Sagarika Jaisinghani, Saumyadeb Chakrabarty, Shinjini Ganguli and Cynthia Osterman)</p>",
              "streams": []
          }
      ]
  },
  "meta": {}
}

const expDates = [
1589500800,
1590105600,
1590710400,
1591315200,
1591920000,
1592524800,
1594944000,
1600387200,
1602806400,
1608249600,
1610668800,
1623974400,
1631836800,
1642723200,
1655424000
]