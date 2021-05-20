import invert from './functions/invertObj';

const map = {
  1: 'BTC',
  2: 'ETH',
  3: 'XRP',
  4: 'LINK',
  5: 'VET',
};

const reverseMap = invert(map);

export const NamesToId = (name) => {
  return reverseMap[name];
};

export const IdsToName = (name) => {
  return map[name];
};
