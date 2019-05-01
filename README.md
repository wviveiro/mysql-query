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

## INSERT

`db.insert(table, objectToInsert);`

```javascript
var result = await db.insert('mytable', {
    field1: 'foo',
    field2: 'bar'
});

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


