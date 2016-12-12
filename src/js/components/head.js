let tpl = require('../tmpl/head.tpl');
exports.render=function() {
    var data = {userInfo:{comname:'永达理保险经纪有限公1',name:'1小勇',mobile:'1334567895'}};
    return tpl(data);
}