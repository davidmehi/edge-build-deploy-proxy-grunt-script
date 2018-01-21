/*jslint node: true */

var apigeeSdk = require('../lib/apigee-sdk-mgmt-api-addtl.js');

module.exports = function(grunt) {
    'use strict';
	grunt.registerTask('getDeployedSharedFlowRevisions', 'Retrieve Last SharedFlow revision deployed', function() {
    var sharedFlowRevisions = function(error, response, body) {
        
        if (!error && (response.statusCode === 200 || response.statusCode === 400)) {
            var sharedFlowDeployedrevisions = JSON.parse(body);
            grunt.option('revisions_deployed', sharedFlowDeployedrevisions);
        } 
        grunt.log.debug(response.statusCode)
        grunt.log.debug(JSON.stringify(response.headers))
        grunt.log.debug(body);
        done();
    }
	var done = this.async();
    apigeeSdk.getDeployedSharedFlowRevisions(grunt.config.get('apigee_profiles'), sharedFlowRevisions, grunt.option.flags().indexOf('--curl') !== -1)
	});
};
