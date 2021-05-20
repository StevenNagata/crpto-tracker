import invert from './functions/invertObj';
import { InputNumber } from 'antd';

const intervals = {
    24: 'Daily'
}

const types = {
    1: 'Doji',
    2: 'Hammer',
    3: 'Inverse Hammer',
    4: 'Bullish Engulfing'
}

export const intervalIdToName = (id) => {
  return intervals[id]
};

export const intervalNameToId = invert(intervalIdToName);


export const typeIdToName = (id) => {
    return types[id]
}