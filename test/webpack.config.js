const webpack = require('webpack');
const path = require('path');
let webpackMainVersion = 0;
if(webpack.version){
	webpackMainVersion = parseInt(webpack.version);
}

const config = {
	entry:{
		'index':'./index',
	},
	module:{
	},
	output:{
		library:'bundle',
		libraryTarget:'commonjs2',
		path: path.join(__dirname, '.'),
		filename:'[name].js'
	}
};

if(webpackMainVersion < 4){
	config.module.loaders = [{
        test: /\.vue$/,
		loader: 'vue-loader',
		options: {
			exposeRoot: true
		}
       }];
}else{
	config.mode = 'development';
	config.resolveLoader = {
		alias: {
			'webpack-in-loader': path.join(__dirname, '../index.js')
		}
	},
	config.module.rules = [
		 {
        test: /\.vue$/,
		loader: 'vue-loader',
		options: {
			exposeRoot: true
		}
       },];
}


module.exports = config;
