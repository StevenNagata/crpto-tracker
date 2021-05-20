import React, { Component } from "react";
import { Button, Image, Grid, Header } from "semantic-ui-react";
import bearish from "../images/bearish.jpg";
import bullish from "../images/bullish.jpg";
import "../App.css";

class Spreads extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: null,
      stock: null,
      sentiment: null,
      p1: '',
    p2: '',
    strike1: '',
    strike2: '',
    };
  }
  componentDidMount() {
    window.location.search.split('?')[1].split('&').forEach(item=> {
      let param = item.split("=")[0]
      let value = item.split("=")[1]
      this.setState({[param]: value})
    })
}
  render() {
    return (
      <div style={{ height: "100vh", width: "100%", position: "relative" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "450px",
            position: "absolute",
            top: "45%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            style={{
              margin: "2rem auto",
              textAlign: "center",
              fontSize: "1.5rem",
              fontWeight: 500,
            }}
          >
            <span>Are You Feeling </span>
            <span style={{ color: this.state.focused === "bear" ? "red" : "" }}>
              Bearish{" "}
            </span>
            <span>or </span>
            <span
              style={{ color: this.state.focused === "bull" ? "green" : "" }}
            >
              Bullish
            </span>
            <span>?</span>
          </div>
          <Grid>
            <Grid.Row columns={2} centered>
              <Grid.Column centered>
                
                  <Image 
                  className={
                    this.state.focused === "bear"
                      ? "animated pulse infinite editLink"
                      : ""
                  }
                  onClick={() => this.props.history.push(`/calculator?stock=${this.state.stock}&sentiment=bearish`)}
                  onMouseEnter={() => this.setState({ focused: "bear" })}
                  onMouseLeave={() => this.setState({ focused: null })}
                  style={{ margin: "auto" }} src={bearish} size="tiny" />
               
              </Grid.Column>
              <Grid.Column centered>
               
                  <Image 
                  className={
                    this.state.focused === "bull"
                      ? "animated pulse infinite editLink"
                      : ""
                  }
                  onClick={() => this.props.history.push(`/calculator?stock=${this.state.stock}&sentiment=bullish`)}
                  onMouseEnter={() => this.setState({ focused: "bull" })}
                  onMouseLeave={() => this.setState({ focused: null })}
                  style={{ margin: "auto" }} src={bullish} size="tiny" />
              
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    );
  }
}

export default Spreads;
