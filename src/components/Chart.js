import React from 'react';

import {
  XAxis,
  YAxis,
  HorizontalGridLines,
  XYPlot,
  LineSeries,
  Highlight,
  GradientDefs,
} from 'react-vis';
var dateFormat = require('dateformat');

const seededRandom = function(){
    return Math.random() *90
};
const totalValues = 20;


function getRandomSeriesData(total) {
    const result = [];
    let lastY = seededRandom();
    let y;
    const firstY = lastY;
    for (let i = 0; i < total; i++) {
      y = seededRandom() * firstY - firstY / 2 + lastY;
      result.push({
        x: i,
        y
      });
      lastY = y;
    }
    return result;
  }

class Chart extends React.Component {
	constructor(props) {
		super(props);
        this.state = {
            appWidth: 1000,
            lastDrawLocation: null
          };
		// this.addStock = this.addStock.bind(this);
	}
componentWillMount() {
    this.setState({appWidth: window.innerWidth})
    window.addEventListener('resize', () => {
        this.setState({appWidth: window.innerWidth})
    })
}
gradient() {
    return (
        <GradientDefs>
            <linearGradient id="borderGradient" gradientUnits="userSpaceOnUse">
                <stop offset="10%" stopColor="#c5cae9" stopOpacity={0.3} />
                <stop offset="33%" stopColor="#9fa8da" stopOpacity={0.3} />
                <stop offset="66%" stopColor="#7986cb" stopOpacity={0.3} />
                <stop offset="90%" stopColor="#3f51b5" stopOpacity={0.3} />
            </linearGradient>
        </GradientDefs>
    );
}
	render() {
        console.log(this.props)
        const {lastDrawLocation, series} = this.state
		return (
            <div>
            <div>
              <XYPlot
              margin={50} 
                animation
                xDomain={
                  lastDrawLocation && [
                    lastDrawLocation.left,
                    lastDrawLocation.right
                  ]
                }
                yDomain={
                  lastDrawLocation && [
                    lastDrawLocation.bottom,
                    lastDrawLocation.top
                  ]
                }
                width={this.state.appWidth}
                height={500}
              >
                  				{this.gradient()}

                <HorizontalGridLines color="green" style={{color: 'red'}}/>

                <YAxis 
                tickFormat={function tickFormat(d){
                    return `$${d}`
                }}
                />

                <XAxis
            attr="x"
            attrAxis="y"
            tickTotal={Math.floor(this.state.appWidth / 90)}
            orientation="bottom"
            tickFormat={function tickFormat(d){
                return dateFormat(new Date(d), "h:MM TT")
            }}
            tickLabelAngle={0}
         />
              
                  <LineSeries  color="green" strokeWidth={2} data={this.props.data}/>
           
                <Highlight
                  onBrushEnd={area => this.setState({lastDrawLocation: area})}
                  onDrag={area => {
                    this.setState({
                      lastDrawLocation: {
                        bottom: lastDrawLocation.bottom + (area.top - area.bottom),
                        left: lastDrawLocation.left - (area.right - area.left),
                        right: lastDrawLocation.right - (area.right - area.left),
                        top: lastDrawLocation.top + (area.top - area.bottom)
                      }
                    });
                  }}
                />
              </XYPlot>
            </div>
    
            <button
              className="showcase-button"
              onClick={() => this.setState({lastDrawLocation: null})}
            >
              Reset Zoom
            </button>
    
            <div>
              <h4>
                <b>Last Draw Area</b>
              </h4>
              {lastDrawLocation ? (
                <ul style={{listStyle: 'none'}}>
                  <li>
                    <b>Top:</b> {lastDrawLocation.top}
                  </li>
                  <li>
                    <b>Right:</b> {lastDrawLocation.right}
                  </li>
                  <li>
                    <b>Bottom:</b> {lastDrawLocation.bottom}
                  </li>
                  <li>
                    <b>Left:</b> {lastDrawLocation.left}
                  </li>
                </ul>
              ) : (
                <span>N/A</span>
              )}
            </div>
          </div>
		);
    }
}




export default Chart;


