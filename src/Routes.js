import React from "react";
import { Route, Switch } from "react-router-dom";
import Calculator from "./pages/Calculator";
import Home from "./pages/Home";
import TickerPick from "./pages/TickerPick";
import BullvBear from "./pages/BullvBear";
import StockChart from "./pages/StockChart";
import { withRouter } from "react-router-dom";
import HomePortal from "./pages/HomePortal";
import Details from "./pages/Details";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import CryptoHome from "./pages/CryptoHome";
import CryptoDeatils from "./pages/Crypto-Details";

class Routes extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <Switch>
        <Route path="/detail">
          <Details 
          userInfo={this.props.userInfo} 
          updateAppState={this.props.updateAppState} 
          history={this.props.history} 
          removeFromWatchlist={this.props.removeFromWatchlist}/>
        </Route>
        <Route path="/tickerpick">
          <TickerPick history={this.props.history}/>
        </Route>
        <Route path="/bullvbear">
          <BullvBear history={this.props.history}/>
        </Route>
        <Route path="/calculator">
          <Calculator history={this.props.history}/>
        </Route>
        <Route path="/stock">
          <StockChart history={this.props.history}/>
        </Route>
        <Route path="/login">
          <Login handleLogin={this.props.handleLogin} updateAppState={this.props.updateAppState} history={this.props.history}/>
        </Route>
        <Route path="/profile">
          <Profile updateUserProfile ={this.props.updateUserProfile} userInfo={this.props.userInfo} history={this.props.history}/>
        </Route>
        <Route path="/crypto">
          <CryptoHome userInfo={this.props.userInfo} updateAppState={this.props.updateAppState} history={this.props.history} />
        </Route>
        <Route path="/crypto-detail">
          <CryptoDeatils userInfo={this.props.userInfo} updateAppState={this.props.updateAppState} history={this.props.history} />
        </Route>
        
        <Route path="/">
        <CryptoHome userInfo={this.props.userInfo} updateAppState={this.props.updateAppState} history={this.props.history} />

          {/* <HomePortal userInfo={this.props.userInfo} updateAppState={this.props.updateAppState} history={this.props.history} /> */}
        </Route>
        
      </Switch>
    );
  }
}
export default withRouter(Routes);
