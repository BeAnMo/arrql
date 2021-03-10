import { bindSelectorName } from './utils';

export const count = selector => bindSelectorName(
    ({ _values }) => {
        return _values.reduce((acc, p) => {
            const curr = selector(p);

            return acc + 1;
        }, 0);
    },
    `COUNT(${selector.name})`
);


export const sum = selector => bindSelectorName(
    ({ _values }) => {
        return _values.reduce((acc, p) => {
            const curr = selector(p);

            return acc + curr;
        }, 0);
    },
    `SUM(${selector.name})`
);

export const avg = selector => bindSelectorName(
    ({ _values }) => {
        let total = 0;
        let avg = 0;

        _values.forEach((val, i) => {
            total += selector(p);

            avg = total / (i + 1);
        });

        return avg;
    },
    `AVG(${selector.name})`
);

