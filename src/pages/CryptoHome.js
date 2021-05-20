import React, { Component } from 'react';
import {
  Button,
  Grid,
  Image,
  Segment,
  List,
  Input,
  Icon,
  Table,
  Header,
  Statistic,
} from 'semantic-ui-react';
const numeral = require('numeral');

class CryptoHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coinData: [],
    };
  }
  componentDidMount = async () => {
    const coins = await fetch(
      `${process.env.REACT_APP_API_URL}/v2/coins`
    ).then((resp) => resp.json());
    Promise.all(
      coins.map((c) =>
        fetch(
          `https://api.binance.com/api/v3/ticker/24hr?symbol=${c.lookup}`
        ).then((resp) => resp.json())
      )
    ).then((data) => {
      console.log(data)
      let coinData = coins.map((c, index) => {
        return { ...c, ...data[index] };
      });
      this.setState({ coinData });
    });
  };
  render() {
    if (!this.props.userInfo) {
      return null;
    }
    return (
      <div
        style={{
          height: '100vh',
          width: '100%',
          position: 'relative',
        }}
      >
        <Grid>
          <Grid.Column mobile={16} tablet={16} computer={16}>
            <Segment>
              <Header as="h3" textAlign="center">
                Crypto
              </Header>

              <Table selectable>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Coin</Table.HeaderCell>
                    <Table.HeaderCell>24 hr Change</Table.HeaderCell>
                    <Table.HeaderCell>Price</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {this.state.coinData.map((c) => {
                    let color = parseFloat(c.priceChange) < 0 ? 'red' : 'green';
                    return (
                      <Table.Row
                        key={c._id}
                        onClick={() =>
                          this.props.history.push(
                            `/crypto-detail#${c._id}`
                          )
                        }
                      >
                        <Table.Cell>
                          <Image avatar src={`/images/${c.symbol}.jpg`} />
                          {c.symbol.slice(0, -4)}
                        </Table.Cell>
                        <Table.Cell
                          style={{ fontSize: '0.85rem', lineHeight: '1rem' }}
                        >
                          <div style={{ color: color }}>
                            {numeral(parseFloat(c.priceChange)).format(
                              Math.abs(parseFloat(c.priceChange)) < 0.1
                                ? '$0,0.0000'
                                : '$0,0.00'
                            )}
                          </div>

                          <div style={{ color: color }}>
                            {numeral(
                              parseFloat(c.priceChangePercent) / 100
                            ).format(
                              Math.abs(parseFloat(c.priceChangePercent) / 100) <
                                0.001
                                ? '0.00000%'
                                : '0.00%'
                            )}
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <Statistic size="mini">
                            <Statistic.Value style={{ color: color }}>
                              {numeral(c.lastPrice).format(
                                parseFloat(c.lastPrice) > 1
                                  ? '$0,0.00'
                                  : '$0,0.0000'
                              )}
                            </Statistic.Value>
                          </Statistic>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default CryptoHome;
