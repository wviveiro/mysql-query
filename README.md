# MYSQL-QUERY

Function to build MYSQL queries in a more structure manner.

This function is based on codeigniter way to build queries.


## Usage with normal mysql module

```javascript
var mysql = require('mysql'); 
var Query = require('mysql-query');

var connection = mysql.createConnection(...);

var db = new Query(connection);
```

## Usage with serverless-mysql module

```javascript
var mysql = require('serverless-mysql'); 
var Query = require('mysql-query');

mysql.config(...);

var db = new Query(mysql);
```


## SELECT

```javascript
var result = await db.select('*').from('mytable').where('id', 1).get();

console.log(result);
```

## JOIN

`db.join(table, onstatement, [left])`

```javascript

var result = await db.select('*')
                    .join('tblb', 'tblb.id = tbla.fk')
                    .join('tblc', 'tblb.id = tblc.fk', 'left')
                    .where('tbla.id', 1).get('tbla');

console.log(result);
```

## GROUP BY

`db.group_by(groupstatement)`

```javascript

var result = await db.select('*')
                    .join('tblb', 'tblb.id = tbla.fk')
                    .join('tblc', 'tblb.id = tblc.fk', 'left')
                    .group_by('tbla.id, tblb.id')
                    .where('tbla.id', 1).get('tbla');

console.log(result);
```

## LIMIT

`db.limit(offset, total)` or `db.limit(total)`

```javascript

var result = await db.select('*')
                    .join('tblb', 'tblb.id = tbla.fk')
                    .join('tblc', 'tblb.id = tblc.fk', 'left')
                    .group_by('tbla.id, tblb.id')
                    .limit(10, 20)
                    .where('tbla.id', 1).get('tbla');

console.log(result);
```

## INSERT

`db.insert(table, objectToInsert);`

```javascript
var result = await db.insert('mytable', {
    field1: 'foo',
    field2: 'bar'
});

console.log(result);
```

## INSERT BATCH

`db.insert(table, [objectsToInsert]);`

```javascript
var objs = [
    {field1: 'foo', field2: 'bar'},
    {field1: 'foo2', field2: 'bar2'},
    {field1: 'foo3', field2: 'bar3'},
]

var result = await db.insert_batch('mytable', objs);

console.log(result);
```

## UPDATE
The update function only update the fields that are passed in the object
`db.uodate(table, objectToUpdate);`

```javascript
var result = await db.where('id', 1).where('name !=', 'My Name').update('mytable', {
    field1: 'foo',
    field2: 'bar'
});

console.log(result);
```


