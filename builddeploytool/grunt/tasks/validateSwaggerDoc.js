/*jslint node: true */
module.exports = function(grunt) {
    'use strict';
    grunt.registerTask('validateSwaggerDoc', function() {
        var apiProxyName = grunt.template.process("<%= apigee_profiles[grunt.option('env')].apiproxy %>");

        var path = require('path');
        var swaggerParser = require("swagger-parser");

        var done = this.async();

        var yamlFileName = grunt.option('folderPath') + '/docs/' + apiProxyName + '.yaml';
        //var yamlFilePath = path.resolve() + yamlFileName;
        var yamlFilePath = yamlFileName;

        grunt.log.writeln("Validating swagger: ." + yamlFileName);

        swaggerParser.parse(yamlFilePath, function(err, api, metadata) {
            if (err) {
                grunt.log.error();
                grunt.log.error(err);
                done(false);
            }
            else {
                grunt.log.ok("swagger file passed validation");
                grunt.log.ok();                
            }
            done();
        });
    });
};