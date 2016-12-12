// let $ = require("jquery")
// let helpers = require('./helpers/template-help');
// let $ajax = require('./helpers/ajax').request;
// let tpl = require('./templates/head.tpl');

//document.getElementById('container').innerHTML = tpl({userInfo:{comname:'永达理保险经纪有限公司',name:'小勇',mobile:'1334567895'}});

// $ajax({
//   url: "/api/getData",
//   data: {
//     userName: 'yangpeng',
//     passWord:'123456'
//   }
// })
// .done(function( result ) {
// 	var data={list:result};
// 	document.getElementById('list').innerHTML = tpl(data);
// })
// .fail(function( result ) {
//     alert(result);
// });


let $ = require('jquery');
let head = require('./components/head.js');
let foot = require('./components/foot.js');
require('./lib/flexible.js');
require('../css/common.css');
require('../css/applicantsignature.css');

document.write(head.render());
$('#container').html(head.render());
document.write(foot.render());
