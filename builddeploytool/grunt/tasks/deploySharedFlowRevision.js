/*jslint node: true */

var apigeeSdk = require('../lib/apigee-sdk-mgmt-api-addtl.js');

module.exports = function(grunt) {
	'use strict';
	grunt.registerTask('deploySharedFlowRevision', 'Deploy a Shared Flow revision. deploySharedFlowRevision:{revision_id}', function(revision) {
		var deployedRevision = function(error, response, body) {
			/*eslint no-empty:0 */
			if (!error && response.statusCode === 200) {
				//var undeployResult = JSON.parse(body);
			}
			else{
				done(false)
			}
			grunt.log.debug(response.statusCode)
			grunt.log.debug(body);
			done(error);
		}
		//core logic
		grunt.log.debug("Revision Option:" + grunt.option('revision'));
		revision = grunt.option('revision');
		if(!revision) {
			grunt.fail.fatal('invalid revision id. provide either argument as deploySharedFlowRevision:{revision_id}');
		}else{
			var done = this.async();
			apigeeSdk.deploySharedFlowRevision(grunt.config.get('apigee_profiles'), revision, deployedRevision, grunt.option.flags().indexOf('--curl') !== -1)
		}
	});
};
