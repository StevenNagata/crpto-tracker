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
  Card,
  Table,
  Radio,
} from "semantic-ui-react";
import MyModal from "../components/MyModal";
import CandleStick from "../components/CandleStick";
import { withSnackbar } from 'notistack';

const moment = require('moment')

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stonk: window.location.hash.slice(1),
      isDeleting: false
    };
  }
  createCandle(topWick, body, bottomWick, color, marginTop) {
    return (
      <div
        style={{
          marginTop: marginTop,
          marginRight: "0.15rem",
          marginLeft: "0.15rem",
        }}
      >
        <div
          style={{
            width: "2px",
            height: topWick,
            backgroundColor: color,
            margin: "0 6px",
          }}
        />
        <div style={{ width: "15px", height: body, backgroundColor: color }} />
        <div
          style={{
            width: "2px",
            height: bottomWick,
            backgroundColor: color,
            margin: "0 6px",
          }}
        />
      </div>
    );
  }
  toggleNotification = (type) => {
let updatedStatus = !this.props.userInfo.watchList[window.location.hash.slice(1)].notifications[type]
let updatedUserInfo = Object.assign({}, this.props.userInfo)
updatedUserInfo.watchList[window.location.hash.slice(1)].notifications[type] = updatedStatus
this.props.updateAppState('users', updatedUserInfo, updatedUserInfo.id, 'user')
  }
  removeFromWatchlist = () => {
    this.setState({isDeleting: true})
    this.props.removeFromWatchlist(status => {
      console.log(status)
      if(status === 200) {
        this.setState({isDeleting: true})
        this.props.enqueueSnackbar('Successfully removed from watchlist.', { 
          variant: 'success',
      });
        this.props.history.push('/')
      } else {
        this.setState({isDeleting: true})
        this.props.enqueueSnackbar('There was an error', { 
          variant: 'error',
      });
        this.setState({isDeleting: false})
      }
    }, this.state.stonk)
  }
  render() {
    if(!this.props.userInfo) {
      return null
    }
    if(!this.props.userInfo.watchList[this.state.stonk]){ 
      return null
    }
    let stock = this.props.userInfo.watchList[window.location.hash.slice(1)]
      return (
      <div
        style={{
          height: "100vh",
          width: "100%",
          position: "relative",
        }}
      >
                <Icon className="hoverLink" onClick={() => this.props.history.push('/')} size="large" style={{color: 'white'}} name='arrow alternate circle left outline' />

        <Segment>

          <h1 style={{marginBottom: '2rem', textAlign: 'center'}}>{this.state.stonk}</h1>
        
          <Grid>
            <Grid.Column mobile={16} tablet={8} computer={4}>
              <Card fluid>
                <Card.Content>
                  <Card.Header>Doji</Card.Header>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      margin: "1rem 0",
                    }}
                  >
                    {this.createCandle(20, 5, 20, "green")}
                    {this.createCandle(20, 5, 20, "red")}
                  </div>
                  <Card.Description>
                    This happens when a stock's price opens and closes are
                    almost at the same price point, the candlestick resembles a
                    cross or plus sign.
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                <span style={{color: 'black', margin: 'auto 0'}}>{`Notifcation ${stock.notifications.doji ? 'On' : 'Off'}`}</span>
                <Radio style={{float: 'right'}} onChange={() => this.toggleNotification('doji')} checked={stock.notifications.doji} toggle/> 
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={8} computer={4}>
              <Card fluid>
                <Card.Content>
                  <Card.Header>Hammer</Card.Header>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      margin: "1rem 0",
                    }}
                  >
                    {this.createCandle(20, 40, 10, "red", 0)}
                    {this.createCandle(5, 30, 0, "red", 50)}
                    <div
                      style={{
                        width: "35px",
                        height: "70px",
                        border: "dotted black 2px",
                        position: "absolute",
                        top: "120px",
                        borderRadius: "50%",
                      }}
                    ></div>
                    {this.createCandle(0, 20, 30, "green", 85)}
                    {this.createCandle(5, 20, 5, "green", 55)}
                    {this.createCandle(10, 35, 15, "green", 25)}
                  </div>
                  <Card.Description>
                    The upper wick is long, while the lower wick is short
                  </Card.Description>
                </Card.Content>

                <Card.Content extra>
                <span style={{color: 'black', margin: 'auto 0'}}>{`Notifcation ${stock.notifications.hammer ? 'On' : 'Off'}`}</span>
                <Radio style={{float: 'right'}} onChange={() => this.toggleNotification('hammer')} checked={stock.notifications.hammer} toggle/> 
                </Card.Content>
              </Card>
            </Grid.Column>

            <Grid.Column mobile={16} tablet={8} computer={4}>
              <Card fluid>
                <Card.Content>
                  <Card.Header>Inverse Hammer</Card.Header>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      margin: "1rem 0",
                    }}
                  >
                    {this.createCandle(20, 40, 10, "red", 0)}
                    {this.createCandle(5, 30, 0, "red", 50)}
                    <div
                      style={{
                        width: "35px",
                        height: "80px",
                        border: "dotted black 2px",
                        position: "absolute",
                        top: "85px",
                        borderRadius: "50%",
                      }}
                    ></div>
                    {this.createCandle(40, 20, 3, "green", 45)}

                    {this.createCandle(5, 20, 5, "green", 60)}
                    {this.createCandle(10, 35, 15, "green", 25)}
                  </div>
                  <Card.Description>
                    The upper wick is long, while the lower wick is short
                  </Card.Description>
                </Card.Content>

                <Card.Content extra>
                  <span style={{color: 'black', margin: 'auto 0'}}>{`Notifcation ${stock.notifications.inverseHammer ? 'On' : 'Off'}`}</span>
                <Radio style={{float: 'right'}} onChange={() => this.toggleNotification('inverseHammer')} checked={stock.notifications.inverseHammer} toggle/> 
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={8} computer={4}>
              <Card fluid>
                <Card.Content>
                  <Card.Header>Bullish Engulfing</Card.Header>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      margin: "1rem 0",
                    }}
                  >
                    {this.createCandle(5, 35, 0, "red", 55)}
                    {this.createCandle(15, 25, 10, "red", 65)}
                    {this.createCandle(10, 15, 5, "red", 85)}
                    {this.createCandle(5, 40, 3, "green", 65)}

                    {this.createCandle(5, 20, 5, "green", 60)}
                    <div
                      style={{
                        width: "45px",
                        height: "75px",
                        border: "dotted black 2px",
                        position: "absolute",
                   
                        top: "100px",
                        borderRadius: "50%",
                      }}
                    ></div>

                    {this.createCandle(10, 35, 15, "green", 25)}
                  </div>
                  <Card.Description>
                    The bullish engulfing pattern is formed of two candlesticks.
                    The first candle is a short red body that is completely
                    engulfed by a larger green candle.
                  </Card.Description>
                </Card.Content>

                <Card.Content extra>
                <span style={{color: 'black', margin: 'auto 0'}}>{`Notifcation ${stock.notifications.bullishEngulfing ? 'On' : 'Off'}`}</span>
                <Radio style={{float: 'right'}} onChange={() => this.toggleNotification('bullishEngulfing')} checked={stock.notifications.bullishEngulfing} toggle/> 
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid>

          <h3>Alert History</h3>

          <Table striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Interval</Table.HeaderCell>

              </Table.Row>
            </Table.Header>
            <Table.Body>
              {stock.history.map((alert) => {
                return (
                  <Table.Row>
                    <Table.Cell>{moment(new Date(alert.date)).format("MM/DD/YYYY HH:mm:ss")}</Table.Cell>
                    <Table.Cell>{alert.type}</Table.Cell>
                    <Table.Cell>{alert.interval}</Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>

        </Segment>
        <MyModal 
        isLoading={this.state.isDeleting}
        buttonLabel="Remove from Watchlist" 
        modalMessage={`Are you sure you want to remove ${this.state.stonk} from your watchlist?`}
        handleAccept={this.removeFromWatchlist}/>

      </div>
    );
  }
}

export default withSnackbar(Detail);

let data = [
  {
    date: "6/11/20",
    type: "Doji",
    open: 220,
    high: 230.5,
    low: 213.45,
    close: 221.5,
  },
  {
    date: "6/9/20",
    type: "Bullish Engufing",
    open: 210,
    high: 245.5,
    low: 208,
    close: 242.35,
  },
  {
    date: "6/5/20",
    type: "Hammer",
    open: 192,
    high: 195.5,
    low: 189.32,
    close: 195,
  },
];
