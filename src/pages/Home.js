import React, { Component } from "react";
import {
    Button
  } from "semantic-ui-react";


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div style={{height: '100vh', width: '100%', position: 'relative'}}>
        <Button 
        style={{position: 'absolute', top: '50%', left:'50%', marginRight: '-50%', transform: 'translate(-50%, -50%)'}} 
        size="massive" 
        color="blue"
        onClick={() => this.props.history.push('/tickerpick')}>GET STARTED</Button>
      </div>
    );
  }
}

export default Home;
