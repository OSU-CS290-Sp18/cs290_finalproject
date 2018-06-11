(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['books'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.book,depth0,{"name":"book","data":data,"indent":"\t\t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<script src=\"books.js\" charset=\"utf-8\" defer> </script>\n<main class=\"shelf\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.books : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</main>\n";
},"usePartial":true,"useData":true});
<<<<<<< HEAD
=======
templates['quote'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<span>\n	<p>"
    + alias4(((helper = (helper = helpers.quote || (depth0 != null ? depth0.quote : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"quote","hash":{},"data":data}) : helper)))
    + " ~ "
    + alias4(((helper = (helper = helpers.person || (depth0 != null ? depth0.person : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"person","hash":{},"data":data}) : helper)))
    + " </p>\n</span>\n";
},"useData":true});
templates['search'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<span>\n	<img src=\""
    + alias4(((helper = (helper = helpers.smallThumbnail || (depth0 != null ? depth0.smallThumbnail : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"smallThumbnail","hash":{},"data":data}) : helper)))
    + "\"/>\n	<p>"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + " Written by "
    + alias4(((helper = (helper = helpers.authors || (depth0 != null ? depth0.authors : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"authors","hash":{},"data":data}) : helper)))
    + "</p>\n</span>\n";
},"useData":true});
>>>>>>> da8339f2ea39a9c31564a23f40c98c7c40543962
})();