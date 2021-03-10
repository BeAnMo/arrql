import { bindSelectorName } from './utils';

export const as = (selector, asName) => bindSelectorName(selector, asName);

const toFixed = (n, places) => parseFloat(n.toFixed(places));

export const round = (selector, places) => bindSelectorName(
    row => toFixed(selector(row)),
    `ROUND(${selector.name})`
);

