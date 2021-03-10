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

export default Query;

export const select = (...selectors) => {
    const q = new Query();

    return q.select(...selectors);
};
