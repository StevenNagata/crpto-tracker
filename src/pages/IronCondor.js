import React, { Component } from "react";
import "./Calculator.css";
import {
  Container,
  Grid,
  Icon,
  Card,
  Statistic,
  Input,
  Button,
  Select,
  Form,
  Table,
  Segment,
  Dimmer,
  Loader,
  Image,
} from "semantic-ui-react";
import NumberFormat from "react-number-format";
import { DateInput } from "semantic-ui-calendar-react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import LineGraph from "../components/LineGraph";

import TableMU from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import Paper from "@material-ui/core/Paper";

const unirest = require("unirest");

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

class IronCondor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stock: "",
      p1: "",
      p2: "",
      strike1: "",
      strike2: "",
      sentiment: null,
      gettingOptions: false,
      expiringDates: [],
      stockOptionData: null,
      calls: [],
      puts: [],
      putObj: {},
      options: [],
      currentPrice: 0,

      selectedOption: null,

      selectedStrike: "",
      selectedStrikePremium: "",

      currentSpreadOutcomes: [],

      experationDate: null,
      isCalc: false,

      currentStep: 1,

      maxProfit: null,
      maxLoss: null,
      breakeven: null,
    };
  }
  readUrl = (callback) => {
    window.location.search
      .split("?")[1]
      .split("&")
      .forEach((item) => {
        let param = item.split("=")[0];
        let value = item.split("=")[1];
        this.setState({ [param]: value });
      });
  };
  componentDidMount() {
    window.location.search
      .split("?")[1]
      .split("&")
      .forEach((item) => {
        let param = item.split("=")[0];
        let value = item.split("=")[1];
        this.setState({ [param]: value }, () => {
          this.fetchExperationDates();
        });
      });
  }
  fetchExperationDates = () => {
    let self = this;

    var req = unirest(
      "GET",
      "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-options"
    );

    req.query({
      symbol: this.state.stock,
      date: "1",
    });

    req.headers({
      "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
      "x-rapidapi-key": "c5e9119c84msh6c5eb83ff319aa0p164365jsn340d3ca81561",
    });

    req.end(function (res) {
      if (res.error) throw new Error(res.error);

      let expiringDates = res.body.meta.expirationDates.map((time) => {
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

      self.setState({
        expiringDates,
        currentPrice: res.body.meta.quote.regularMarketPrice,
      });
    });

    // let expiringDates = intialDatesData.meta.expirationDates.map((time) => {
    //   let remainingDays = Math.round(
    //     (time * 1000 - new Date().getTime()) / (1000 * 60 * 60 * 24)
    //   );
    //   let d = new Date(time * 1000);
    //   return {
    //     key: time,
    //     value: time,
    //     text: `${
    //       d.getMonth() + 1
    //     }/${d.getDate()}/${d.getFullYear()} - ${remainingDays} ${
    //       remainingDays === 1 ? "Day Away" : "Days Away"
    //     }`,
    //   };
    // });

    // this.setState({
    //   expiringDates,
    //   currentPrice: intialDatesData.meta.quote.regularMarketPrice,
    // });
  };
  handleChange = (event, { name, value }) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  };
  getOptions = (e) => {
    e.preventDefault();
    if (!this.state.experationDate) return null;

    this.setState({ gettingOptions: true });

    let self = this;

    var req = unirest(
      "GET",
      "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-options"
    );

    req.query({
      symbol: this.state.stock,
      date: this.state.experationDate,
    });

    req.headers({
      "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
      "x-rapidapi-key": "c5e9119c84msh6c5eb83ff319aa0p164365jsn340d3ca81561",
    });

    req.end(function (res) {
      if (res.error) throw new Error(res.error);

      let putObj = res.body.contracts.puts.reduce((acc, put) => {
        acc[put.strike.raw] = put.lastPrice.raw;
        return acc;
      }, {});

      const optionCalls = res.body.contracts.calls.map((call) => {
        return {
          strike: call.strike.raw,
          callPremium: call.lastPrice.raw,
          putPremium: putObj[call.strike.raw] ? putObj[call.strike.raw] : "",
        };
      });

      console.log(res.body.contracts.puts);
      console.log(res.body.contracts.calls);

      self.setState({
        gettingOptions: false,
        stockOptionData: res.body.contracts,
        step: 2,
        calls: res.body.contracts.calls,
        puts: res.body.contracts.puts,
        options: optionCalls,
      });
    });

    // this.setState({ step: 2, calls: res.body.contracts.calls, puts: res.body.contracts.puts });
  };
  calculate = (type, s1, s2, p1, p2) => {
    if (type === "call") {
      let maxProfit = Math.round((p2 - p1) * 100 * 100) / 100;
      let maxLoss = Math.round((s1 - s2 - (p2 - p1)) * 100 * 100) / 100;
      let breakeven = Math.round((s2 + (p2 - p1)) * 100) / 100;

      return {
        s1,
        s2,
        p1,
        p2,
        maxLoss,
        maxProfit,
        breakeven,
      };
    } else if (type === "put") {
      let maxProfit = Math.round((p2 - p1) * 100 * 100) / 100;
      let maxLoss = Math.round((s1 - s2 - (p2 - p1)) * 100 * 100) / 100;
      let breakeven = Math.round((s1 + (p2 - p1)) * 100) / 100;

      return {
        s1,
        s2,
        p1,
        p2,
        maxLoss,
        maxProfit,
        breakeven,
      };
    }
  };
  calculateSpreadsPuts = (type) => {
    const verticalOptions = this.state.puts
      .slice()
      .filter((c) => c.strike.raw < this.state.selectedOption.strike)
      .map((c) => {
        console.log(c)
        return this.calculate(
          "put",
          c.strike.raw,
          this.state.selectedOption.strike,
          c.lastPrice.raw,
          this.state.selectedOption.putPremium
        );
      });

      console.log(verticalOptions)
    this.setState({ currentSpreadOutcomes: verticalOptions, step: 4 });
  };
  calculateSpreads = (type) => {
    const verticalOptions = this.state.calls
      .slice()
      .reverse()
      .filter((c) => c.strike.raw > this.state.selectedOption.strike)
      .map((c) => {
        return this.calculate(
          "call",
          c.strike.raw,
          this.state.selectedOption.strike,
          c.lastPrice.raw,
          this.state.selectedOption.callPremium
        );
      });
    this.setState({ currentSpreadOutcomes: verticalOptions, step: 4 });
  };
  render() {
    if (this.state.expiringDates.length < 1) {
      return (
        <Segment style={{ height: "100vh" }}>
          <Dimmer active inverted>
            <Loader size="large">Loading</Loader>
          </Dimmer>
        </Segment>
      );
    }

    let d = this.state.experationDate
      ? new Date(this.state.experationDate * 1000)
      : new Date();
    let formattedExpiringDate = `${
      d.getMonth() + 1
    }/${d.getDate()}/${d.getFullYear()}`;

    const reversedOptions = this.state.options.slice().reverse();
    return (
      <div style={{ margin: "3rem auto" }}>
        <Container style={{ margin: "2rem" }}>
          <Card fluid>
            <Card.Header style={{ margin: "1rem" }} as="h2" textAlign="center">
              <Icon
                className="editLink"
                onClick={() =>
                  this.setState({
                    sentiment:
                      this.state.sentiment === "bullish"
                        ? "bearish"
                        : "bullish",
                  })
                }
                color={this.state.sentiment === "bullish" ? "green" : "red"}
                name={
                  this.state.sentiment === "bullish" ? "arrow up" : "arrow down"
                }
              />
              {`I Think The Price Of ${this.state.stock} Will Go
                ${this.state.sentiment === "bullish" ? "Up" : "Down"}...`}
            </Card.Header>
            <Card.Content>
              <Form onSubmit={this.getOptions}>
                <div style={{ margin: "1rem 0" }}>
                  <Form.Group widths="equal">
                    <Form.Field
                      id="date"
                      required
                      control={Select}
                      label="Choose an Experation Date"
                      options={this.state.expiringDates}
                      onChange={(event, { name, value }) => {
                        this.setState({ experationDate: value });
                      }}
                    />
                  </Form.Group>
                </div>
                <Button
                  loading={this.state.gettingOptions}
                  type="submit"
                  color="blue"
                  size="huge"
                  fluid
                >
                  Get Options
                </Button>
              </Form>
            </Card.Content>
          </Card>
          {this.state.step > 1 && this.state.calls && (
            <Container style={{ margin: "2rem" }}>
              <Card style={{ width: "100%" }}>
                <Card.Header
                  style={{ margin: "1rem" }}
                  as="h2"
                  textAlign="center"
                >
                  {`Choose a strike you dont think ${this.state.stock} will hit by ${formattedExpiringDate}...`}
                </Card.Header>

                <Grid columns="equal" padded>
                  <Grid.Column
                    className={
                      this.state.step > 2 ? "transition" : "centered transition"
                    }
                    width={this.state.step > 2 ? 4 : 16}
                  >
                    <TableMU
                      style={{
                        border: "solid rgba(0,0,0,0.1) 1px",
                        borderRadius: "5px",
                        zIndex: 200,
                      }}
                      stickyHeader
                      size="small"
                      aria-label="a dense table"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">Call Premium</TableCell>
                          <TableCell align="center">Strike</TableCell>
                          <TableCell align="center">Put Premium</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {reversedOptions
                          .filter((c) => c.strike > this.state.currentPrice)
                          .map((c) => {
                            return (
                              <TableRow
                                key={c.strike.raw}
                                style={{ textAlign: "center" }}
                                onClick={() => {
                                  this.setState({
                                    step: 3,
                                    selectedOption: c,
                                    // selectedStrike: c.strike.raw,
                                    // selectedStrikePremium: c.lastPrice.raw,
                                  });
                                }}
                              >
                                <TableCell
                                  style={{
                                    backgroundColor: "#fff6f6",
                                    boxShadow: "0 0 0 #e0b4b4 inset",
                                  }}
                                  align="center"
                                >
                                  {NF(c.callPremium)}
                                </TableCell>
                                <TableCell align="center">
                                  {NF(c.strike)}
                                </TableCell>
                                <TableCell
                                  style={{
                                    backgroundColor: "#fcfff5",
                                    boxShadow: "0 0 0 #e0b4b4 inset",
                                  }}
                                  align="center"
                                >
                                  {NF(c.putPremium)}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        <TableRow>
                          <TableCell
                            style={{
                              textAlign: "center",
                              color: "white",
                              backgroundColor: "#2185d0",
                              fontSize: "1.1rem",
                            }}
                            colSpan={3}
                          >
                            <b>{`Current Price: $${this.state.currentPrice}`}</b>
                          </TableCell>
                        </TableRow>
                        {reversedOptions
                          .filter((c) => c.strike <= this.state.currentPrice)
                          .map((c) => {
                            return (
                              <TableRow
                                key={c.strike.raw}
                                style={{ textAlign: "center" }}
                                onClick={() => {
                                  this.setState({
                                    step: 3,
                                    selectedOption: c,
                                    // selectedStrike: c.strike.raw,
                                    // selectedStrikePremium: c.lastPrice.raw,
                                  });
                                }}
                              >
                                <TableCell
                                  style={{
                                    backgroundColor: "#fcfff5",
                                    boxShadow: "0 0 0 #e0b4b4 inset",
                                  }}
                                  align="center"
                                >
                                  {NF(c.callPremium)}
                                </TableCell>
                                <TableCell align="center">
                                  {NF(c.strike)}
                                </TableCell>
                                <TableCell
                                  style={{
                                    backgroundColor: "#fff6f6",
                                    boxShadow: "0 0 0 #e0b4b4 inset",
                                  }}
                                  align="center"
                                >
                                  {NF(c.putPremium)}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </TableMU>
                  </Grid.Column>

                  {this.state.step > 2 && (
                    <Grid.Column width={12}>
                      <Card className="transition2" style={{ width: "100%" }}>
                        <Card.Content>
                          <Grid columns="equal" padded>
                            <Grid.Row>
                              <Grid.Column textAlign="center">
                                <Statistic size="mini">
                                  <Statistic.Label>
                                    Call Premium
                                  </Statistic.Label>

                                  <Statistic.Value
                                    style={{ marginTop: "1rem" }}
                                  >
                                    {NF(this.state.selectedOption.callPremium)}
                                  </Statistic.Value>
                                </Statistic>
                                <div>
                                  <Button
                                    onClick={() =>
                                      this.calculateSpreads("call")
                                    }
                                    disabled={!this.state.selectedOption}
                                    color="blue"
                                  >
                                    Calculate Call Spreads
                                  </Button>
                                </div>
                              </Grid.Column>

                              <Grid.Column textAlign="center">
                                <Statistic size="small">
                                  <Statistic.Label>
                                    Selected Strike
                                  </Statistic.Label>

                                  <Statistic.Value>
                                    {NF(this.state.selectedOption.strike)}
                                  </Statistic.Value>
                                </Statistic>
                              </Grid.Column>

                              <Grid.Column textAlign="center">
                                <Statistic size="mini">
                                  <Statistic.Label>Put Premium</Statistic.Label>

                                  <Statistic.Value
                                    style={{ marginTop: "1rem" }}
                                  >
                                    {NF(this.state.selectedOption.putPremium)}
                                  </Statistic.Value>
                                </Statistic>
                                <div>
                                  <Button
                                    onClick={() => this.calculateSpreadsPuts("put")}
                                    disabled={!this.state.selectedOption}
                                    color="blue"
                                  >
                                    Calculate Put Spreads
                                  </Button>
                                </div>
                              </Grid.Column>
                            </Grid.Row>
                          </Grid>
                        </Card.Content>
                      </Card>
                      {this.state.step > 3 && (
                        <Card style={{ width: "100%" }}>
                          <Card.Header
                            style={{ marginTop: "1rem" }}
                            as="h3"
                            textAlign="center"
                          >
                            Possible Bear Call Options
                          </Card.Header>

                          <Paper>
                            <TableMU
                              stickyHeader
                              dense="true"
                              size="small"
                              aria-label="a dense table"
                            >
                              <TableHead>
                                <TableRow>
                                  <TableCell>Buy Strike</TableCell>
                                  <TableCell>Sell Strike</TableCell>
                                  <TableCell>Net Premium</TableCell>
                                  <TableCell>Max Gain</TableCell>
                                  <TableCell>Max Loss</TableCell>
                                  <TableCell>Breakeven</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {this.state.currentSpreadOutcomes.map(
                                  (o, index) => {
                                    return (
                                      <TableRow
                                        key={index}
                                        className="animated bounceInUp editLink"
                                        onClick={() => {
                                          this.setState({
                                            s1: o.s1,
                                            s2: o.s2,
                                            maxProfit: o.maxProfit,
                                            maxLoss: o.maxLoss,
                                            breakeven: o.breakeven,
                                            step: 5,
                                          });
                                        }}
                                      >
                                        <TableCell>${o.s2}</TableCell>
                                        <TableCell>${o.s1}</TableCell>
                                        <TableCell>
                                          $
                                          {Math.round((o.p2 - o.p1) * 100) /
                                            100}
                                        </TableCell>
                                        <TableCell style={{ color: "green" }}>
                                          ${o.maxProfit}
                                        </TableCell>
                                        <TableCell style={{ color: "red" }}>
                                          ${o.maxLoss}
                                        </TableCell>
                                        <TableCell>${o.breakeven}</TableCell>
                                      </TableRow>
                                    );
                                  }
                                )}
                              </TableBody>
                            </TableMU>
                          </Paper>
                        </Card>
                      )}

                      {this.state.step > 4 && (
                        <Container style={{ margin: "2rem" }}>
                          <Card fluid>
                            <Grid columns={3} divided padded>
                              <Grid.Row>
                                <Grid.Column textAlign="center">
                                  <Statistic
                                    style={{ color: "green" }}
                                    size="small"
                                  >
                                    <Statistic.Label>
                                      Max Profit
                                    </Statistic.Label>

                                    <Statistic.Value>
                                      <NumberFormat
                                        style={{ color: "green" }}
                                        value={this.state.maxProfit}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        prefix={"$"}
                                      />
                                    </Statistic.Value>
                                  </Statistic>
                                </Grid.Column>

                                <Grid.Column textAlign="center">
                                  <Statistic size="small">
                                    <Statistic.Label>Max Loss</Statistic.Label>

                                    <Statistic.Value>
                                      <NumberFormat
                                        style={{ color: "red" }}
                                        value={this.state.maxLoss}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        prefix={"$"}
                                      />
                                    </Statistic.Value>
                                  </Statistic>
                                </Grid.Column>
                                <Grid.Column textAlign="center">
                                  <Statistic size="small">
                                    <Statistic.Label>
                                      Breakeven Point
                                    </Statistic.Label>

                                    <Statistic.Value>
                                      <NumberFormat
                                        style={{ color: "orange" }}
                                        value={this.state.breakeven}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        prefix={"$"}
                                      />
                                    </Statistic.Value>
                                  </Statistic>
                                </Grid.Column>
                              </Grid.Row>
                            </Grid>
                          </Card>
                          <div style={{ width: "100%" }}>
                            <div
                              style={{
                                textAlign: "center",
                                maxWidth: "1000px",
                                margin: "auto",
                              }}
                            >
                              <LineGraph
                                s1={this.state.s1}
                                s2={this.state.s2}
                                maxProfit={this.state.maxProfit}
                                maxLoss={this.state.maxLoss}
                              />
                            </div>
                          </div>
                        </Container>
                      )}
                    </Grid.Column>
                  )}
                </Grid>
              </Card>
            </Container>
          )}
        </Container>
      </div>
    );
  }
}

export default IronCondor;

function NF(value, style) {
  return (
    <NumberFormat
      style={style}
      value={value}
      displayType={"text"}
      decimalScale={2}
      fixedDecimalScale={true}
      thousandSeparator={true}
      prefix={"$"}
    />
  );
}
