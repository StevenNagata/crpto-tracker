import React, { Component } from "react";
import {
  Button,
  Grid,
  Image,
  Segment,
  List,
  Input,
  Icon,
  Header,
} from "semantic-ui-react";
import MyModal from "../components/MyModal";
import CandleStick from "../components/CandleStick";

let stocks = require("../data/stocks.json");

class HomePortal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      watchList: [],
    };
  }
//  componentDidMount() {

//   let coins = ['BTCUSDT', 'ETHUSDT', 'XRPUSDT', 'LINKUSDT', 'VETUSDT']

// Promise.all(coins.map(c => fetch(`https://api.binance.com//api/v3/ticker/24hr?symbol=${c}`)
// .then(resp => resp.json())
// ))
// .then(data => {
//   console.log(data)
// })

//  }
  handleInputChange = (event, newVal) => {
    this.setState({ input: newVal.value });
  };
  addToWatchlist = (stock) => {
    let updatedUserInfo = Object.assign({}, this.props.userInfo)

    updatedUserInfo.watchList[stock.Symbol] = {
        "name": stock.Name,
        "notifications": {
          "doji": false,
          "hammer": false,
          "inverseHammer": false,
          "bullishEngulfing": false
        },
        "history": [
        ]
    }
    this.props.updateAppState('users', updatedUserInfo, updatedUserInfo.id, 'user')
  };
  removeFromWatchlist = (removedStock) => {
    let updatedWatchList = this.state.watchList.filter(
      (stock) => stock.Symbol !== removedStock.Symbol
    );
    this.setState({ watchList: updatedWatchList });
  };
  render() {
if(!this.props.userInfo) {
  return null
} 

 

    return (
      <div
        style={{
          height: "100vh",
          width: "100%",
          position: "relative",
        }}
      >
        hello
      </div>
    );
  }
}

export default HomePortal;

