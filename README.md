## A simple and easy to use NPM package based on MySQL's NPM package.


## install mysql-tk
    npm install --save mysql-tk


## example
	var MysqlTK = require('mysql-tk');

	//Setting configuration
	MysqlTK.CONFIG = {
		host     : 'localhost',
		user     : 'root',
		password : '',
		database : 'dbName'
	};

	//example
	MysqlTK('tableName')
		.count((count)=>{
			console.log(count);
		});
	
	//query a data
	MysqlTK('tableName')
		.where('type', 1)
		.find((data)=>{
			console.log(data);
		});

	//query all data
	MysqlTK('tableName')
		.select((data)=>{
			console.log(data);
		});

	//query specified number of data
	MysqlTK('tableName')
		.limit(5, (data)=>{
			console.log(data);
		});

	//query specified number of data
	MysqlTK('tableName')
		.limit([10, 5], (data)=>{
			console.log(data);
		});

	//Using the `where` method
	MysqlTK('tableName')
		.where({id:1, type:2})
		.find((data)=>{
			console.log(data);
		});
	
	//Using the `where` method
	MysqlTK('tableName')
		.where('type', 1)
		.find((data)=>{
			console.log(data);
		});

	//Using the `fields` method
	MysqlTK('tableName')
		.fields(['id', 'name', 'type'])
		.where('type', 1)
		.limit([1,10], (data)=>{
			console.log(data);
		});

	//Using the `fields` method
	MysqlTK('tableName')
		.fields('id, type')
		.where('type', 1)
		.limit([1,10], (data)=>{
			console.log(data);
		});
	
	//Using the `order` method
	MysqlTK('tableName')
		.fields('id, type')
		.where('type', 1)
		.order('id desc') // or `id asc`
		.select((data)=>{
			console.log(data);
		});
	
	//Using the `query` method
	MysqlTK('tableName')
		.query('select * from tableName', (data)=>{
			console.log(data);
		});

	//---add a data
	MysqlTK('tableName')
		.add({field1: 'value1', field2: 'value2'}, (res)=>{
			console.log(res);
		});

	//----update a data
	MysqlTK('tableName')
		.where('id', 1)
		.update({field1: 'value1', field2: 'value2'}, (res)=>{
			console.log(res);
		});

	//----delete
	MysqlTK('tableName')
		.where('id', 1)
		.delete((res)=>{
			console.log(res);
		});




