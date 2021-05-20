import React, { Component } from "react";
import { Menu, Segment, List, Card, Grid } from "semantic-ui-react";
import NumberFormat from "react-number-format";
import { Sparklines, SparklinesLine } from "react-sparklines";
var unirest = require("unirest");

class TickerPick extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "home",
      myStocks: stockList,
    };
  }
  componentDidMount() {
    let self = this;
    var req = unirest(
      "GET",
      "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-spark"
    );

    req.query({
      interval: "15m",
      range: "1d",
      symbols: "AAPL,AMZN,DIS,TSLA,SPY",
    });

    req.headers({
      "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
      "x-rapidapi-key": "c5e9119c84msh6c5eb83ff319aa0p164365jsn340d3ca81561",
    });

    req.end(function (res) {
      if (res.error) throw new Error(res.error);

      console.log(res.body);
      let myStocks = self.state.myStocks.map((s) => {
        return Object.assign({}, s, { data: res.body[s.ticker].close });
      });
      self.setState({ myStocks });
    });
  }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;
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

{/* 
        <Segment inverted>

        <Grid >
    {this.state.myStocks.map((stock,index) => {
      return (
<Grid.Column  key={index} mobile={16} tablet={8} computer={4}>      
<Segment inverted>

  <Card centered>
      <Card.Content>
        <Card.Header>{stock.ticker}
        <div style={{float: 'right', fontWeight: 300}}>{NF(stock.currentCost)}</div>
        </Card.Header>
        
        <Card.Description>
        <Sparklines data={stock.data}>
                        <SparklinesLine color={stock.isUp ? "green" : "red"} />
                      </Sparklines>
                              </Card.Description>

      </Card.Content>
    </Card>
    </Segment>
    </Grid.Column>
      )
    })}
    
</Grid>


</Segment> */}


        <Segment inverted>
          <List divided inverted>
            {this.state.myStocks.map((stock) => {
              return (
                <List.Item
                onClick={() => this.props.history.push(`/stock#${stock.ticker}`)}
                  style={{ position: "relative", height: "60px", zIndex: 0 }}
                >
                  <div
                    style={{
                      backgroundColor: stock.isUp ? "#00B338" : "#FF4340",
                    }}
                    className="priceBox"
                  >
                    {NF(stock.currentCost)}
                  </div>
                  <List.Content>
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: "125px",
                        width: "200px",
                        height: "100px",
                        zIndex: -1,
                      }}
                    >
                      <Sparklines data={stock.data}>
                        <SparklinesLine color={stock.isUp ? "green" : "red"} />
                      </Sparklines>
                    </div>
                    <List.Header>
                      <span className="mainBox">{stock.ticker}</span>
                    </List.Header>
                    <List.Description
                      style={{ marginTop: "0.5rem", fontSize: "0.8rem" }}
                    >
                      <span className="mainBox">{stock.name} </span>
                    </List.Description>
                  </List.Content>
                </List.Item>
              );
            })}
          </List>
        </Segment>
      </div>
    );
  }
}

export default TickerPick;

let stockList = [
  {
    ticker: "AAPL",
    name: "Apple",
    isUp: true,
    currentCost: 300.12,
  },
  {
    ticker: "AMZN",
    name: "Amazon",
    isUp: true,
    currentCost: 2324.21,
  },
  {
    ticker: "DIS",
    name: "Disney",
    isUp: false,
    currentCost: 102.95,
  },
  {
    ticker: "TSLA",
    name: "Tesla",
    isUp: true,
    currentCost: 798.43,
  },
  {
    ticker: "SPY",
    name: "SPDR@ S&P 500 ETF Trust",
    isUp: false,
    currentCost: 284.81,
  },
  {
    ticker: "AAPL",
    name: "Apple",
    isUp: true,
    currentCost: 300.12,
  },
  {
    ticker: "AMZN",
    name: "Amazon",
    isUp: true,
    currentCost: 2324.21,
  },
  {
    ticker: "DIS",
    name: "Disney",
    isUp: false,
    currentCost: 102.95,
  },
  {
    ticker: "TSLA",
    name: "Tesla",
    isUp: true,
    currentCost: 798.43,
  },
  {
    ticker: "SPY",
    name: "SPDR@ S&P 500 ETF Trust",
    isUp: false,
    currentCost: 284.81,
  },
  {
    ticker: "AAPL",
    name: "Apple",
    isUp: true,
    currentCost: 300.12,
  },
  {
    ticker: "AMZN",
    name: "Amazon",
    isUp: true,
    currentCost: 2324.21,
  },
  {
    ticker: "DIS",
    name: "Disney",
    isUp: false,
    currentCost: 102.95,
  },
  {
    ticker: "TSLA",
    name: "Tesla",
    isUp: true,
    currentCost: 798.43,
  },
  {
    ticker: "SPY",
    name: "SPDR@ S&P 500 ETF Trust",
    isUp: false,
    currentCost: 284.81,
  },
  {
    ticker: "AAPL",
    name: "Apple",
    isUp: true,
    currentCost: 300.12,
  },
  {
    ticker: "AMZN",
    name: "Amazon",
    isUp: true,
    currentCost: 2324.21,
  },
  {
    ticker: "DIS",
    name: "Disney",
    isUp: false,
    currentCost: 102.95,
  },
  {
    ticker: "TSLA",
    name: "Tesla",
    isUp: true,
    currentCost: 798.43,
  },
  {
    ticker: "SPY",
    name: "SPDR@ S&P 500 ETF Trust",
    isUp: false,
    currentCost: 284.81,
  },
];

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
