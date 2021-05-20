import React, { Component } from "react";
import { Button } from 'semantic-ui-react'
import { Slider } from 'antd';
import 'antd/dist/antd.css'

const style = {
    display: 'inline-block',
  height: 300,
};

const candleMutiple = 2

export default class CandleStick extends Component {
  constructor(props) {
    super(props);
    this.state = { 
        topWickHeight: 30, 
        bodyHeight: 30, 
        bottomWickHeight: 30,
        sliderValue: [30,70],
        candleHeightMutiple: .5,
        position: 50
    };
  }
  handleSliderChange = (value) => {
    this.setState({candleHeightMutiple: value / 100})
  }
  handleHeightChange = (type, add) => {
      let currVal = this.state[type]

      this.setState({[type]: currVal += add})
  }
  handlePositionChange = (value) => {
    this.setState({position: value})
  }
  handleRangeChange = (value) => {
      console.log(value)

      let topWick = 100 - Math.max(value[0], value[1])
      let body = Math.abs(value[1] - value[0])
      let bottomWick = 100 - topWick - body
      this.setState({topWickHeight: topWick, bodyHeight: body, bottomWickHeight: bottomWick})
  }
  render() {
    return (
        <div>
    

 

      <div style={{display: 'flex', justifyContent: 'space-around', textAlign: 'center'}}>      
          <div>
      <h5 style={{marginBottom: '0.25rem'}}>Top Wick Height</h5>
    <Button onClick={() => this.handleHeightChange('topWickHeight', -1)} size="mini" attached='left'>Down</Button>
    <Button onClick={() => this.handleHeightChange('topWickHeight', +1)} size="mini" attached='right'>Up</Button>
  </div>
  <div>
      <h5 style={{marginBottom: '0.25rem'}}>Body Height</h5>
    <Button onClick={() => this.handleHeightChange('bodyHeight', -1)} size="mini" attached='left'>Down</Button>
    <Button onClick={() => this.handleHeightChange('bodyHeight', +1)} size="mini" attached='right'>Up</Button>
  </div>
  <div>
      <h5 style={{marginBottom: '0.25rem'}}>Bottom Wick Height</h5>
    <Button onClick={() => this.handleHeightChange('bottomWickHeight', -1)} size="mini" attached='left'>Down</Button>
    <Button onClick={() => this.handleHeightChange('bottomWickHeight', +1)} size="mini" attached='right'>Up</Button>
  </div>
      </div>



  <div style={{display: 'flex'}}>
      <div style={style}>
      <Slider vertical range step={1} defaultValue={[20, 50]}
      onChange={(value) => this.handleRangeChange(value)} />
      </div>
       <div style={{display: 'flex'}}>
      <Slider vertical  step={1} defaultValue={[50]}
      onChange={(value) => this.handleSliderChange(value)} />
    </div>
    <div style={{display: 'flex'}}>
      <Slider vertical  step={1} defaultValue={[50]}
      onChange={(value) => this.handlePositionChange(value)} />
    </div>

      <div className="candleContianer" style={{position: 'relative', marginTop:`${110 - (this.state.position)}px` }}>
<div className="topWick" style={{height: `${this.state.topWickHeight * this.state.candleHeightMutiple * candleMutiple}px`}}></div>
<div className="candleBody" style={{height: `${this.state.bodyHeight * this.state.candleHeightMutiple * candleMutiple}px`}}></div>
<div className="bottomWick" style={{height: `${this.state.bottomWickHeight * this.state.candleHeightMutiple * candleMutiple}px`}}></div>
      </div>

      <div className="candleContianer">
<div className="topWick" style={{height: `${this.state.topWickHeight * this.state.candleHeightMutiple * candleMutiple}px`}}></div>
<div className="candleBody" style={{height: `${this.state.bodyHeight * this.state.candleHeightMutiple * candleMutiple}px`}}></div>
<div className="bottomWick" style={{height: `${this.state.bottomWickHeight * this.state.candleHeightMutiple * candleMutiple}px`}}></div>
      </div>
      <div className="candleContianer">
<div className="topWick" style={{height: `${this.state.topWickHeight * this.state.candleHeightMutiple * candleMutiple}px`}}></div>
<div className="candleBody" style={{height: `${this.state.bodyHeight * this.state.candleHeightMutiple * candleMutiple}px`}}></div>
<div className="bottomWick" style={{height: `${this.state.bottomWickHeight * this.state.candleHeightMutiple * candleMutiple}px`}}></div>
      </div>
</div>

      

      </div>
    );
  }
}
