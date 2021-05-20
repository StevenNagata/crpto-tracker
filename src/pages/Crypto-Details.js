import React, { Component } from 'react';
import {
  Grid,
  Segment,
  Icon,
  Card,
  Table,
  Radio,
  Image,
} from 'semantic-ui-react';
import { withSnackbar } from 'notistack';
import Chart from 'react-apexcharts'
import { typeIdToName } from '../utils/types';

const moment = require('moment');

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stonk: window.location.hash.slice(1),
      isDeleting: false,
      stock: null,
      coinData: null,
      alerts: [],
      notifications: null,
      graphData: [],
      width: 1000
    };
  }
  calcWidth = (width) => {
    this.setState({width: window.innerWidth})
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.calcWidth.bind(this));
  }
  componentDidMount = async () => {
    const data = await fetch(
      `${
        process.env.REACT_APP_API_URL
      }/v2/crypto-watch/${window.location.hash.slice(1)}/${
        this.props.userInfo._id
      }`
    ).then((resp) => resp.json());
    const alerts = await fetch(
      `${process.env.REACT_APP_API_URL}/v2/alerts/${window.location.hash.slice(
        1
      )}`
    ).then((resp) => resp.json());

    const priceData = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${data.coin.lookup}&interval=1d&limit=90`
    ).then((resp) => resp.json());

    console.log({ data, priceData, alerts });

    const graphData = priceData.map((p) => {
      return {
        x: new Date(p[6]),
        y: [p[1], p[2], p[3], p[4]] 
      }
    });
    this.setState({
      alerts,
      notifications: data.data,
      coinData: data.coin,
      graphData,
    });
    this.calcWidth();
    window.addEventListener('resize', this.calcWidth.bind(this));
  };
  createCandle(topWick, body, bottomWick, color, marginTop) {
    return (
      <div
        style={{
          marginTop: marginTop,
          marginRight: '0.15rem',
          marginLeft: '0.15rem',
        }}
      >
        <div
          style={{
            width: '2px',
            height: topWick,
            backgroundColor: color,
            margin: '0 6px',
          }}
        />
        <div style={{ width: '15px', height: body, backgroundColor: color }} />
        <div
          style={{
            width: '2px',
            height: bottomWick,
            backgroundColor: color,
            margin: '0 6px',
          }}
        />
      </div>
    );
  }
  toggleNotification = async (type) => {
    const userId = this.props.userInfo._id;
    const stockId = this.state.coinData._id;
    const updateNotification = {
      ...this.state.notifications.notifications,
      [type]: !this.state.notifications.notifications[type],
    };

    const udpated = await fetch(
      `https://vert-spread-backend.herokuapp.com/v2/crypto-watch/${stockId}/${userId}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ notifications: updateNotification }),
      }
    ).then((resp) => resp.json());

    console.log(udpated);
    this.setState({ notifications: udpated });
  };
  render() {

    console.log(this.state)
    if (!this.state.coinData) {
      return null;
    }
    const { alerts } = this.state;
    let notifications = null

    if(this.state.notifications) {
       notifications = this.state.notifications.notifications;
    }


  

      const options = {
        chart: {
          type: 'candlestick',
          height: 100
        },
        title: {
          text: '',
          align: 'left'
        },
        xaxis: {
          type: 'datetime'
        },
        yaxis: {
          tooltip: {
            enabled: false
          }
        }
      }

    
console.log(this.props)
    return (
      <div
        style={{
          height: '100vh',
          width: '100%',
          position: 'relative',
        }}
      >
        <Icon
          className="hoverLink"
          onClick={() => this.props.history.push('/crypto')}
          size="large"
          style={{ color: 'white' }}
          name="arrow alternate circle left outline"
        />

        <Segment>
          <div
            style={{
              marginBottom: '2rem',
              textAlign: 'center',
              fontSize: '2.5rem',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Image
              style={{ margin: 'auto 0.5rem' }}
              avatar
              size="mini"
              src={`../images/${this.state.coinData.lookup}.jpg`}
            />
            <h1>{this.state.coinData.name}</h1>
          </div>

          <div id="chart" style={{margin: 'auto'}}>
  <Chart options={options} style={{margin: 'auto'}} series={[{
    data: this.state.graphData
  }]} type="candlestick" width={this.state.width *.7} height={350} />
</div>

          {this.state.notifications && (
            <>
            <h2>Your Notifications</h2>
            <Grid>
              <Grid.Column mobile={16} tablet={8} computer={4}>
                <Card fluid>
                  <Card.Content>
                    <Card.Header>Doji</Card.Header>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-evenly',
                        margin: '1rem 0',
                      }}
                    >
                      {this.createCandle(20, 5, 20, 'green')}
                      {this.createCandle(20, 5, 20, 'red')}
                    </div>
                    <Card.Description>
                      This happens when a stock's price opens and closes are
                      almost at the same price point, the candlestick resembles
                      a cross or plus sign.
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <span
                      style={{ color: 'black', margin: 'auto 0' }}
                    >{`Notifcation ${notifications.doji ? 'On' : 'Off'}`}</span>
                    <Radio
                      style={{ float: 'right' }}
                      onChange={() => this.toggleNotification('doji')}
                      checked={notifications.doji}
                      toggle
                    />
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column mobile={16} tablet={8} computer={4}>
                <Card fluid>
                  <Card.Content>
                    <Card.Header>Hammer</Card.Header>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        margin: '1rem 0',
                      }}
                    >
                      {this.createCandle(20, 40, 10, 'red', 0)}
                      {this.createCandle(5, 30, 0, 'red', 50)}
                      <div
                        style={{
                          width: '35px',
                          height: '70px',
                          border: 'dotted black 2px',
                          position: 'absolute',
                          top: '120px',
                          borderRadius: '50%',
                        }}
                      ></div>
                      {this.createCandle(0, 20, 30, 'green', 85)}
                      {this.createCandle(5, 20, 5, 'green', 55)}
                      {this.createCandle(10, 35, 15, 'green', 25)}
                    </div>
                    <Card.Description>
                      The upper wick is long, while the lower wick is short
                    </Card.Description>
                  </Card.Content>

                  <Card.Content extra>
                    <span
                      style={{ color: 'black', margin: 'auto 0' }}
                    >{`Notifcation ${
                      notifications.hammer ? 'On' : 'Off'
                    }`}</span>
                    <Radio
                      style={{ float: 'right' }}
                      onChange={() => this.toggleNotification('hammer')}
                      checked={notifications.hammer}
                      toggle
                    />
                  </Card.Content>
                </Card>
              </Grid.Column>

              <Grid.Column mobile={16} tablet={8} computer={4}>
                <Card fluid>
                  <Card.Content>
                    <Card.Header>Inverse Hammer</Card.Header>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        margin: '1rem 0',
                      }}
                    >
                      {this.createCandle(20, 40, 10, 'red', 0)}
                      {this.createCandle(5, 30, 0, 'red', 50)}
                      <div
                        style={{
                          width: '35px',
                          height: '80px',
                          border: 'dotted black 2px',
                          position: 'absolute',
                          top: '85px',
                          borderRadius: '50%',
                        }}
                      ></div>
                      {this.createCandle(40, 20, 3, 'green', 45)}

                      {this.createCandle(5, 20, 5, 'green', 60)}
                      {this.createCandle(10, 35, 15, 'green', 25)}
                    </div>
                    <Card.Description>
                      The upper wick is long, while the lower wick is short
                    </Card.Description>
                  </Card.Content>

                  <Card.Content extra>
                    <span
                      style={{ color: 'black', margin: 'auto 0' }}
                    >{`Notifcation ${
                      notifications.inverseHammer ? 'On' : 'Off'
                    }`}</span>
                    <Radio
                      style={{ float: 'right' }}
                      onChange={() => this.toggleNotification('inverseHammer')}
                      checked={notifications.inverseHammer}
                      toggle
                    />
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column mobile={16} tablet={8} computer={4}>
                <Card fluid>
                  <Card.Content>
                    <Card.Header>Bullish Engulfing</Card.Header>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        margin: '1rem 0',
                      }}
                    >
                      {this.createCandle(5, 35, 0, 'red', 55)}
                      {this.createCandle(15, 25, 10, 'red', 65)}
                      {this.createCandle(10, 15, 5, 'red', 85)}
                      {this.createCandle(5, 40, 3, 'green', 65)}
                      {this.createCandle(5, 20, 5, 'green', 60)}
                      <div
                        style={{
                          width: '45px',
                          height: '75px',
                          border: 'dotted black 2px',
                          position: 'absolute',
                          top: '100px',
                          borderRadius: '50%',
                        }}
                      ></div>

                      {this.createCandle(10, 35, 15, 'green', 25)}
                    </div>
                    <Card.Description>
                      The bullish engulfing pattern is formed of two
                      candlesticks. The first candle is a short red body that is
                      completely engulfed by a larger green candle.
                    </Card.Description>
                  </Card.Content>

                  <Card.Content extra>
                    <span
                      style={{ color: 'black', margin: 'auto 0' }}
                    >{`Notifcation ${
                      notifications.bullishEngulfing ? 'On' : 'Off'
                    }`}</span>
                    <Radio
                      style={{ float: 'right' }}
                      onChange={() =>
                        this.toggleNotification('bullishEngulfing')
                      }
                      checked={notifications.bullishEngulfing}
                      toggle
                    />
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid>
            </>
          )}
          {!!alerts && (
            <>
              <h2>Alert History</h2>

              <Table striped>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Date</Table.HeaderCell>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Interval</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {alerts.map((alert, index) => {
                    return (
                      <Table.Row key={index}>
                        <Table.Cell>
                          {moment(new Date(parseInt(alert.dateTime))).format(
                            'MM/DD/YYYY HH:mm:ss'
                          )}
                        </Table.Cell>
                        <Table.Cell>{alert.type}</Table.Cell>
                        <Table.Cell>{alert.interval}</Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            </>
          )}
        </Segment>
      </div>
    );
  }
}

export default withSnackbar(Detail);

