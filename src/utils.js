export const bindSelectorName = (selector, name) => {
    const wrap = {
        [name](row) {
            return selector(row);
        }
    };

    return wrap[name];
};

export const nameOf = selector => selector.name;