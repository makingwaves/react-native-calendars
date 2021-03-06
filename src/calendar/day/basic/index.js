import React, {Component} from 'react';
import {
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import PropTypes from 'prop-types';

import styleConstructor from './style';

class Day extends Component {
  static propTypes = {
    // TODO: disabled props should be removed
    state: PropTypes.oneOf(['disabled', 'today', '']),

    // Specify theme properties to override specific styles for calendar parts. Default = {}
    theme: PropTypes.object,
    marking: PropTypes.any,
    onPress: PropTypes.func,
    date: PropTypes.object,
    icon: PropTypes.any,
    lastDayOfTheWeek: PropTypes.any
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.onDayPress = this.onDayPress.bind(this);
  }

  onDayPress() {
    this.props.onPress(this.props.date);
  }

  styleIcon() {
    const {icon} = this.props;
    return (<View style={this.style.iconView}><Text style={this.style.iconText}>{icon}</Text></View>);
  }

  shouldComponentUpdate(nextProps) {
    const changed = ['state', 'children', 'marking', 'onPress'].reduce((prev, next) => {
      if (prev) {
        return prev;
      } else if (nextProps[next] !== this.props[next]) {
        return next;
      }
      return prev;
    }, false);
    if (changed === 'marking') {
      let markingChanged = false;
      if (this.props.marking && nextProps.marking) {
        markingChanged = (!(
          this.props.marking.marked === nextProps.marking.marked
          && this.props.marking.selected === nextProps.marking.selected
          && this.props.marking.dotColor === nextProps.marking.dotColor
          && this.props.marking.disabled === nextProps.marking.disabled));
      } else {
        markingChanged = true;
      }
      // console.log('marking changed', markingChanged);
      return markingChanged;
    } else {
      // console.log('changed', changed);
      return !!changed;
    }
  }

  render() {
    const containerStyle = [this.style.base];
    const textStyle = [this.style.text];
    const dotStyle = [this.style.dot];
    const dayView = [this.style.dayView];

    let marking = this.props.marking || {};
    if (marking && marking.constructor === Array && marking.length) {
      marking = {
        marking: true
      };
    }
    let dot;
    if (!marking.disabled) {
      dotStyle.push(this.style.visibleDot);
      if (marking.selected) {
        dotStyle.push(this.style.selected);
      }
      dot = (<View style={dotStyle}><View style={this.style.dotText}></View></View>);
    }

    if (marking.selected) {
      containerStyle.push(this.style.selected);
      textStyle.push(this.style.selectedText);
    } else if (typeof marking.disabled !== 'undefined' ? marking.disabled : this.props.state === 'disabled') {
      textStyle.push(this.style.disabledText);
    } else if (this.props.state === 'today') {
      textStyle.push(this.style.todayText);
    }
    
    if(this.props.lastDayOfTheWeek) {
      dayView.push({borderRightWidth: 1});
    }
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={this.onDayPress}
        disabled={
          typeof marking.disabled !== 'undefined'
            ? marking.disabled
            : this.props.state === 'disabled'
        }
      >
       <View style={dayView}>
          {!this.props.icon ? dot : this.styleIcon()}
          <Text allowFontScaling={false} style={textStyle}>
              {String(this.props.children)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default Day;
