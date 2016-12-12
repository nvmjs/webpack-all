let tpl = require('../tmpl/foot.tpl');

exports.render= function() {
    var data = {order:'dd'};
    return tpl(data);
}