export const equal = (selector, value) => (p) => selector(p) === value;

export const gt = (selector, value) => (p) => selector(p) > value;
export const gte = (selector, value) => (p) => selector(p) >= value;
export const lt = (selector, value) => (p) => selector(p) < value;
export const lte = (selector, value) => (p) => selector(p) <= value;

export const and = (...predicates) => (p) =>
    predicates.reduce((acc, pred) => acc && pred(p), true);
export const or = (...predicates) => (p) =>
    predicates.reduce((acc, pred) => acc || pred(p), false);

export const like = (selector, match) => p => {
    if (typeof match === 'string') {
        return selector(p).includes(match);
    }
};