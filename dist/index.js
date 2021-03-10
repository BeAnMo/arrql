(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ArrQL = {}));
}(this, (function (exports) { 'use strict';

    const getKeys = (selectors) => (p) =>
        selectors.map((sel) => ({ _name: sel.name, key: sel(p) }));

    const unwindGrouping = (groups, headers) => {
        const results = [];

        const unwind = (current, [first, ...rest], acc) => {
            if (Array.isArray(current)) {
                results.push({ ...acc, _values: current });
            } else {
                Object.keys(current).forEach((key) => {
                    unwind(current[key], rest, { ...acc, [first]: key });
                });
            }
        };

        unwind(groups, headers, {});

        return results;
    };

    function Query(table) {
        if (table) {
            this.table = table;
        }
    }

    Query.prototype.select = function (...selectors) {
        this.selector = (p) =>
            selectors.reduce((acc, sel) => {
                acc[sel.name] = sel(p);

                return acc;
            }, {});

        return this;
    };

    Query.prototype.from = function (table) {
        this.table = table;

        return this;
    };

    Query.prototype.where = function (predicate) {
        this.predicate = predicate;

        return this;
    };

    Query.prototype.groupBy = function (...selectors) {
        this.groupKeys = getKeys(selectors);
        this.grouping = (acc, p) => {
            const keys = this.groupKeys(p);

            let cursor = acc;
            let i = 0;

            while (i < keys.length - 1) {
                const { key } = keys[i];

                if (!cursor[key]) {
                    cursor[key] = {};
                }

                cursor = cursor[key];
                i++;
            }

            if (!cursor[keys[i].key]) {
                cursor[keys[i].key] = [];
            }

            cursor[keys[i].key].push(p);

            return acc;
        };

        return this;
    };

    Query.prototype.exec = function () {
        const mapper = this.selector || ((x) => x);
        const filter = this.predicate || ((x) => true);

        const current = this.table.filter(filter);

        if (!this.grouping) {
            return current.map(mapper);
        } else {
            const headers = this.groupKeys(this.table[0]).map(
                ({ _name }) => _name
            );
            const grouped = current.reduce(this.grouping, {});

            return unwindGrouping(grouped, headers).map(mapper);
        }
    };

    const select = (...selectors) => {
        const q = new Query();

        return q.select(...selectors);
    };

    const sum = (selector) => {
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

    const avg = selector => {
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

    const equal = (selector, value) => (p) => selector(p) === value;

    const gt = (selector, value) => (p) => selector(p) > value;
    const gte = (selector, value) => (p) => selector(p) >= value;
    const lt = (selector, value) => (p) => selector(p) < value;
    const lte = (selector, value) => (p) => selector(p) <= value;

    const and = (...predicates) => (p) =>
        predicates.reduce((acc, pred) => acc && pred(p), true);
    const or = (...predicates) => (p) =>
        predicates.reduce((acc, pred) => acc || pred(p), false);

    const like = (selector, match) => p => {
        if (typeof match === 'string') {
            return selector(p).includes(match);
        }
    };

    exports.Query = Query;
    exports.and = and;
    exports.avg = avg;
    exports.equal = equal;
    exports.gt = gt;
    exports.gte = gte;
    exports.like = like;
    exports.lt = lt;
    exports.lte = lte;
    exports.or = or;
    exports.select = select;
    exports.sum = sum;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
