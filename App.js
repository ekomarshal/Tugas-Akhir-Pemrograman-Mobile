import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList
} from 'react-native';

export default class Stopwatch extends React.Component {
  state = {
    time: 0,
    laps: [],
    leftButton: 'Lap',
    rightButton: 'Start'
  }
  
  timer = null
  startTime = 0
  pauseTime = 0
  
  render() {
  	let { time, leftButton, rightButton, laps } = this.state;
    return (
    	<View style={[f, b]}>
	    	<View style={[f, b, xy]}>
        	<Text style={{ fontSize: 60 }}>{this.formatTime(time)}</Text>
	    	</View>
	    	<View style={[f, b]}>
					<View style={[b, row, { justifyContent: 'space-around', padding: 10, borderBottomWidth: 1, borderTopWidth: 1 }]}>
            <TouchableOpacity
            	disabled={time === 0}
            	onPress={this.onLeftButtonPress}
            	>
              <View style={[xy, circle]}>
                <Text style={text}>{leftButton}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
            	onPress={this.onRightButonPress}
            	>
              <View style={[xy, circle]}>
                <Text style={text}>{rightButton}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <FlatList
            data={laps}
            style={[f, b]}
						ListHeaderComponent={this.ListHeaderComponent}
						renderItem={this.renderLap}
            keyExtractor={time => time}
          />
	    	</View>
    	</View>
  	);
  }
  
  ListHeaderComponent = () => {
    let { time, laps } = this.state;
    if (!time) {
      return null;
    }
    return (
      <View
        style={lapCell}
        >
        <Text style={text}>{`Lap ${laps.length + 1}`}</Text>
        <Text style={text}>{this.formatTime(time - (laps[0] || 0))}</Text>
      </View>
    );
  }
  
  renderLap = ({ item, index }) => {
    let { laps } = this.state;
    return (
      <View
        style={lapCell}
        >
        <Text style={text}>{`Lap ${this.state.laps.length - index}`}</Text>
        <Text style={text}>{this.formatTime(item - (laps[index + 1] || 0))}</Text>
      </View>
    );
  }
  
  formatTime = time => {
    let date = new Date(time);
    let minutes = this.formatNumbers(date.getMinutes());
    let seconds = this.formatNumbers(date.getSeconds());
    let milliseconds = `${time % 1000}`;
    milliseconds = milliseconds[0] + (milliseconds[1] || '0');

    return `${minutes}:${seconds}.${milliseconds}`;
  }

  formatNumbers = number => {
    return number < 10 ? `0${number}` : number;
  }
  
  onLeftButtonPress = () => {
    let { leftButton, time, laps } = this.state;
    if (leftButton === 'Lap') {
      this.setState({ laps: [time, ...laps] });
    } else {
      this.setState({ time: 0, laps: [], leftButton: 'Lap' });
    }
  }

  onRightButonPress = () => {
    let { time, leftButton, rightButton }= this.state;
    if (rightButton === 'Start') {
      if (time === 0) {
        this.startTime = Date.now();
      } else {
        this.startTime = this.startTime + (Date.now() - this.pauseTime)
        leftButton = 'Lap';
      }

      this.timer = setInterval(() => {
        this.setState({ time: Date.now() - this.startTime });
      }, 42);

      rightButton = 'Stop';
    } else {
    	clearTimeout(this.timer);
      this.pauseTime = Date.now();
      leftButton = 'Reset';
      rightButton = 'Start';
    }

    this.setState({ leftButton, rightButton });
  }
}

// style objects
// let b = { borderWidth: 1, borderColor: 'red' };
let b = {}; // this is here just to remove the borders and not cause any errors
let f = { flex: 1 };
let xy = { justifyContent: 'center', alignItems: 'center' };
let row = { flexDirection: 'row' };
let circle = { height: 80, width: 80, borderRadius: 40, borderWidth: 2 };
let text = { fontSize: 20 };
let lapCell = [row, { justifyContent: 'space-between', padding: 10, borderBottomWidth: 1 }];