(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['resumePage'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "            <li>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<main id=\"resume\">\n    <table>\n        <tr class=\"resume-category\">\n    <th colspan=\"2\">Experience</th>\n</tr>\n<tr>\n    <td>"
    + alias4(((helper = (helper = helpers.yearBegin || (depth0 != null ? depth0.yearBegin : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"yearBegin","hash":{},"data":data}) : helper)))
    + " - "
    + alias4(((helper = (helper = helpers.yearEnd || (depth0 != null ? depth0.yearEnd : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"yearEnd","hash":{},"data":data}) : helper)))
    + "</td>\n    <td>\n        "
    + alias4(((helper = (helper = helpers.job || (depth0 != null ? depth0.job : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"job","hash":{},"data":data}) : helper)))
    + "\n        <ul>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.jobDuties : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </ul>\n    </td>\n</tr>\n\n<tr class=\"resume-category\">\n    <th colspan=\"2\">Education</th>\n</tr>\n<tr>\n    <td>"
    + alias4(((helper = (helper = helpers.yearGraduated || (depth0 != null ? depth0.yearGraduated : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"yearGraduated","hash":{},"data":data}) : helper)))
    + "</td>\n    <td>\n        <dl>\n            <dt>"
    + alias4(((helper = (helper = helpers.degree || (depth0 != null ? depth0.degree : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"degree","hash":{},"data":data}) : helper)))
    + ", "
    + alias4(((helper = (helper = helpers.major || (depth0 != null ? depth0.major : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"major","hash":{},"data":data}) : helper)))
    + "</dt>\n            <dd>"
    + alias4(((helper = (helper = helpers.school || (depth0 != null ? depth0.school : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"school","hash":{},"data":data}) : helper)))
    + ", "
    + alias4(((helper = (helper = helpers.schoolCity || (depth0 != null ? depth0.schoolCity : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"schoolCity","hash":{},"data":data}) : helper)))
    + ", "
    + alias4(((helper = (helper = helpers.schoolState || (depth0 != null ? depth0.schoolState : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"schoolState","hash":{},"data":data}) : helper)))
    + "</dd>\n        </dl>\n    </td>\n</tr>\n\n<tr class=\"resume-category\">\n    <th>Skills</th>\n    <td>\n        <ul>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.skills : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </ul>\n    </td>\n</tr>\n    </table>\n</main>\n\n<button type=\"button\" id=\"edit-resume-button\"><i class=\"far fa-image\"></i></button>\n\n    <div id=\"modal-backdrop\" class=\"hidden\"></div>\n    <div id=\"edit-resume-modal\" class=\"hidden\">\n\n        <div class=\"modal-dialog\">\n\n            <div class=\"modal-header\">\n                <h3>Add a Picture</h3>\n                <button type=\"button\" id=\"modal-close-button\">&times;</button>\n            </div>\n\n            <div class=\"modal-body\">\n                <h2>Experience: </h2>\n                <label for=\"year-begin\">From</label>\n                <input type=\"text\" id=\"year-begin\">\n                <label for=\"year-end\">To</label>\n                <input type=\"text\" id=\"year-end\">\n                <label for=\"job\">Job title</label>\n                <input type=\"text\" id=\"job\">\n                <h3>Job duties</h3>\n                <input type=\"text\" class=\"duty\">\n                <input type=\"text\" class=\"duty\">\n                <input type=\"text\" class=\"duty\">\n\n                <h2>Education</h2>\n                <label for=\"year-graduated\">Year obtained degree</label>\n                <input type=\"text\" id=\"year-graduated\">\n                <label for=\"degree\">Degree</label>\n                <input type=\"text\" id=\"degree\">\n                <label for=\"major\">Major</label>\n                <input type=\"text\" id=\"major\">\n                <label for=\"school\">School</label>\n                <input type=\"text\" id=\"school\">\n                <label for=\"school-city\">City</label>\n                <input type=\"text\" id=\"school-city\">\n                <label for=\"school-state\">State</label>\n                <input type=\"text\" id=\"school-state\">\n\n                <h2>Skills</h2>\n                <input type=\"text\" class=\"skills\">\n                <input type=\"text\" class=\"skills\">\n                <input type=\"text\" class=\"skills\">\n                <input type=\"text\" class=\"skills\">\n                <input type=\"text\" class=\"skills\">\n            </div>\n\n            <div class=\"modal-footer\">\n                <button type=\"button\" id=\"modal-accept-button\">Add Picture</button>\n            </div>\n\n        </div>\n\n    </div>";
},"useData":true});
})();