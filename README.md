[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/BeAnMo/arrql)

# arrql
SQL for arrays.

```js
import { select, avg } from 'arrql';

const name = row => row.name;
const age = row => row.age;
const favoriteColor = row => row.color;

const table = [
    // ...
];

select(favoriteColor, avg(avg))
    .from(table)
    .groupBy(favoriteColor)
    .exec();
```