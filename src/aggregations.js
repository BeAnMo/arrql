export const sum = (selector) => {
    const name = `sum(${selector.name})`;
    const wrap = {
        [name]({ _values }) {
            return _values.reduce((acc, p) => {
                const curr = selector(p);

                return acc + curr;
            }, 0);
        },
    };

    return wrap[name];
};

export const avg = selector => {
    const name = `avg(${selector.name})`;
    const wrap = {
        [name]({ _values }) {
            let total = 0;
            let avg = 0;

            _values.forEach((val, i) => {
                total += selector(p);

                avg = total / (i + 1);
            });

            return avg;
        },
    };

    return wrap[name];
};