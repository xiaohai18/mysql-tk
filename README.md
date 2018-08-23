##A simple and easy to use NPM package based on MySQL's NPM package.


##install mysql-tk
    npm install --save mysql-tk


## example
    var MysqlTK = require('./index');

    //Setting configuration
	MysqlTK.CONFIG = {
		host     : 'localhost',
		user     : 'root',
		password : '',
		database : 'dbName'
	};


	MysqlTK('tableName')
		.count((count)=>{
			console.log(count);
		});

	MysqlTK('tableName')
		.where({id:1,type:2})
		.find((data)=>{
			console.log(data);
		});

	MysqlTK('tableName')
		.fields(['id','name'])
		.where({id:1,type:2})
		.select((data)=>{
			console.log(data);
		});

	MysqlTK('tableName')
		.fields(['id','name'])
		.where({id:1,type:2})
		.limit([1,10], (data)=>{
			console.log(data);
		});

	MysqlTK('tableName')
		.query('select * from tableName', (data)=>{
			console.log(data);
		});


	MysqlTK('tableName')
		.add({field1: 'value1', field2: 'value2'}, (res)=>{
			console.log(res);
		});

	//----update
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


