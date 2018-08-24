var mysql = require('mysql');
var fs = require('fs');

const db = function(sql, callback){
	//创建连接
	var connection = mysql.createConnection(MysqlTK.CONFIG);

	//执行创建连接 
	connection.connect(function(err){
		if(err){
			console.error('error connecting: ' + err.stack);
			return false;
		}
	});
	connection.query(sql, function(err, res, fields){
		if(err){
			console.log(err)
		}else{
			callback && callback(res);
		}
	});

	connection.end(function(err){
		if(err){
			console.log(err)
		}else{
			//console.log('连接关闭')
		}
	});
};


const MysqlTK = function(table){
	if(this instanceof MysqlTK){
		return this.init.call(this, table)
	}else{
		return new MysqlTK(table)
	}
}

MysqlTK.prototype = {
	init: function(table){
		this.table = table;
		if(!MysqlTK.CONFIG){
			console.error('Database configuration does not exist!');
		}
		this._createSql();
		this._createMaps();
	},
	_createMaps: function(){
		this.sqlMaps = {
			table: this.table,
			fields: '*',
			where: '',
			order: '',
			limit: '',
			values: '',
			update: '',
		};
	},
	_createSql: function(){
		this.sqlQuery  = 'SELECT {fields} FROM {table} {where} {order} {limit}';
		this.sqlInsert = 'INSERT INTO {table} ({fields}) VALUE ({values})';
		this.sqlUpdate = 'UPDATE {table} SET {update} {where}';
		this.sqlDelete = 'DELETE FROM {table} {where}';
		this.sqlCount  = 'SELECT COUNT(*) FROM {table} {where}';
	},
	//解析sql语句
	_parseSql: function(sql){
		if(!sql){
			return false;
		}
		var maps = this.sqlMaps;
		var nSql = sql.replace(/\{(\w+)\}/g, (a,key)=>{
			if(maps[key]){
				return maps[key];
			}else{
				return '';
			}
		});
		return this.trim(nSql);
	},

	//-----查询相关
	find: function(callback){
		this.limit(1);
		this.select(callback);
	},
	select: function(callback){
		this.query(this._parseSql(this.sqlQuery), callback)
	},
	// rang => [1, 10] | 10;
	limit: function(rang, callback){
		if(rang){
			if(!this.isArray(rang)){
				rang = [rang];
			}
			this.sqlMaps['limit'] = ' LIMIT ' + rang.join(', ');
		}
		this.select(callback);
	},
	//统计条数
	count: function(callback){
		var that = this;
		this.query(this._parseSql(this.sqlCount), function(res){
			if(that.isFunction(callback)){
				callback(res && res[0] ? res[0]['COUNT(*)'] : 0);
			}
		})
	},
	query: function(sql, callback){
		var that = this;
		db(sql, function(res){
			if(that.isFunction(callback)){
				callback(res);
			}
		})
	},
	//添加数据
	//data => {name1: value1, name2: value2}
	add: function(data, callback){
		if(!this.isPlainObject(data)){
			return false;
		}
		var fields = [];
		var values = [];

		for(var attr in data){
			fields.push(attr);
			values.push( this._format(data[attr]) );
		}
		this.sqlMaps['fields'] = fields.join(', ');
		this.sqlMaps['values'] = values.join(', ');
		this.query(this._parseSql(this.sqlInsert), callback);
	},


	//-更新数据
	//data => {name1: value1, name2: value2}
	update: function(data, callback){
		if(!this.isPlainObject(data)){
			return false;
		}
		var values = [];
		for(var attr in data){
			values.push( attr + '=' + this._format(data[attr]));
		}
		this.sqlMaps['update'] = values.join(', ');

		this.query(this._parseSql(this.sqlUpdate), callback);
	},
	//------删除相关
	delete: function(callback){
		this.query(this._parseSql(this.sqlDelete), callback);
	},
	
	trim: function(str){
		return str.trim().replace(/\s+/g, ' ');
	},
	types: function(arg){
		return Object.prototype.toString.call(arg);
	},
	isNumber: function(n){
		return this.types(n) === '[object Number]';
	},
	isFunction: function(fn){
		return this.types(fn) === '[object Function]';
	},
	isArray: function(arr){
		return this.types(arr) === '[object Array]';
	},
	isPlainObject: function(obj){
		return this.types(obj) === '[object Object]';
	},
	//一个参数必须为Object
	where: function(field, value){
		var arg = arguments;
		if(arg.length == 2){
			this.sqlMaps['where'] = 'WHERE ' + field + '="' + value + '"';
		}else if(arg.length == 1 && this.isPlainObject(arg[0])){
			var res = [], obj = arg[0];
			for(var attr in obj){
				res.push(attr + ' = "' + obj[attr] + '"');
			}
			this.sqlMaps['where'] = ' WHERE ' + res.join(' AND ');
		}
		return this;
	},
	// str => 'id desc'
	order: function(str){
		if(str && str.match(/\b(desc|asc)\b/i)){
			this.sqlMaps['order'] = ' ORDER BY ' + str;
		}
		return this;
	},
	// str => 'name, password' | ['name', 'password']
	fields: function(str){
		if(str){
			if(this.isArray(str)){
				str = str.join(', ');
			}
			this.sqlMaps['fields'] = str;
		}else{
			this.sqlMaps['fields'] = ' *';
		}
		return this;
	},
	getTable: function(){
		return this.table;
	},
	
	_format: function(v){
		if(this.isNumber(v)){
			return v;
		}else{
			return '"' + this._escape(v) + '"';
		}
	},

	_escape: function(str){
		if(!str){
			return '';
		}
		var escapeMap = {
		  "<": "&#60;",
		  ">": "&#62;",
		  '"': "&#34;",
		  "'": "&#39;"
		};
		return String(str).replace(/[<>'"]/g, function(a){
			return escapeMap[b];
		})
	}
};



module.exports = MysqlTK;
