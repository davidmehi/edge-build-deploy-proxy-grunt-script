/*jslint node: true */

/************************************************************************
The MIT License (MIT)

Copyright (c) 2014

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
**************************************************************************/

module.exports = function(grunt) {
    "use strict";
    var folderPath = grunt.option('folderPath');
    grunt.log.debug("folderPath: " + folderPath + "/config/apigee-config.js");
    var apigee_conf = require(folderPath + "/config/apigee-config.js")
    var helper = require('./grunt/lib/helper-functions.js');
    var searchNReplace = require('./grunt/search-and-replace-files.js');
    require('time-grunt')(grunt);

    /** Gets the apigee profile settings **/
    var apigee_profiles = apigee_conf.profiles(grunt);
    //grunt.log.debug("apigee_profiles: \n" + JSON.stringify(apigee_profiles));
    var apigee_profiles_env = apigee_profiles[grunt.option('env')];
    //grunt.log.debug("apigee_profiles_env: " + JSON.stringify(apigee_profiles_env));
    grunt.config.set('apigee_profiles', apigee_profiles_env);

    // Loads apigee config data (holds non-proxy config data like products, kvms, caches, etc)
    var artifactConfig = grunt.file.readJSON(folderPath + "/config/apigee-config-data.json");
    grunt.log.debug(JSON.stringify(artifactConfig));

    

    //grunt.config.set('apigee_profiles', apigee_conf);


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        apigee_profiles: apigee_conf.profiles(grunt), //{
        artifactConfig: artifactConfig,
        availabletasks: {
            tasks: {
            	
            }
        },
        /*connect:{
        	server: {
                options: {
                    port: 443,
                    hostname: 'api.enterprise.apigee.com',
                    https: true
                },
        	proxies:[
                {
                    
                    host: 'https://api.developer.com',
                    port: 8080,
                    https: true
                
                }
            ]
        	}
        },*/
        clean: ["target/<%= apigee_profiles[grunt.option('env')].apiproxy %>",
                "target/<%= apigee_profiles[grunt.option('env')].sharedflowbundle %>"],
        mkdir: {
            all: {
                options: {
                    create: ["target", 
                             "target/<%= apigee_profiles[grunt.option('env')].apiproxy %>", 
                             "target/<%= apigee_profiles[grunt.option('env')].apiproxy %>/apiproxy", 
                             "target/<%= apigee_profiles[grunt.option('env')].sharedflowbundle %>/sharedflowbundle"]
                },
            },
        },
        copy: {
            apiproxy: {
                expand: true,
                cwd: grunt.option('folderPath') + '/apiproxy',
                src: "**",
                dest: "target/<%= apigee_profiles[grunt.option('env')].apiproxy %>/apiproxy/"  // needs the post-trailing /
            },
            sharedflowbundle: {
                expand: true,
                cwd: grunt.option('folderPath') + '/sharedflowbundle',
                src: "**",
                dest: "target/<%= apigee_profiles[grunt.option('env')].sharedflowbundle %>/sharedflowbundle/"  // needs the post-trailing /
            }
        },
        // make a zipfile
        compress: {
            main: {
                options: {
                    mode: 'zip',
                    archive: "target/<%= apigee_profiles[grunt.option('env')].apiproxy %>.zip"
                },
                files: [{
                        expand: true,
                        cwd: "target/<%= apigee_profiles[grunt.option('env')].apiproxy %>/apiproxy/",
                        src: ['**'],
                        dest: 'apiproxy/'
                    }, // makes all src relative to cwd
                ]
            },
            main_sharedflow: {
                options: {
                    mode: 'zip',
                    archive: "target/<%= apigee_profiles[grunt.option('env')].sharedflowbundle %>.zip"
                },
                files: [{
                        expand: true,
                        cwd: "target/<%= apigee_profiles[grunt.option('env')].sharedflowbundle %>/sharedflowbundle/",
                        src: ['**'],
                        dest: 'sharedflowbundle/'
                    }, // makes all src relative to cwd
                ]
            }
        },
        // task for configuration management: search and replace elements within XML files
        xmlpoke: apigee_conf.xmlconfig(grunt.option('env'), grunt),
        jshint: {
            options: { //see options reference http://www.jshint.com/docs/options/
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                asi: true,
                debug: true,
                undef: true,
                unused: true,
                maxcomplexity: 5,
                reporter: require('jshint-stylish')
            },
            all: ['Gruntfile.js', 'apiproxy/**/*.js', 'tests/**/*.js', 'tasks/*.js']
        },
        eslint: { // task
            options: {
                config: 'grunt/conf/eslint.json', // custom config
                rulesdir: ['grunt/conf/rules'] // custom rules
            },
            target: ['Gruntfile.js', 'target/apiproxy/**/*.js', 'tests/**/*.js', 'tasks/*.js'] // array of files
        },
        'string-replace': {
            dist: searchNReplace.searchAndReplaceFiles(grunt.option('env'), grunt)
        },
        shell: {
            options: {
                stderr: false,
                failOnError: true
            }
        },
        notify: {
            task_name: {
                options: {
                    // Task-specific options go here.
                }
            },
            ApiDeployed: {
                options: {
                    message: 'Deployment is ready!'
                }
            }
        },
        complexity: {
            generic: {
                src: ['target/apiproxy/**/*.js', 'tests/**/*.js', 'tasks/*.js'],
                exclude: ['doNotTest.js'],
                options: {
                    breakOnErrors: true,
                    jsLintXML: 'report.xml', // create XML JSLint-like report
                    checkstyleXML: 'checkstyle.xml', // create checkstyle report
                    errorsOnly: false, // show only maintainability errors
                    cyclomatic: [3, 7, 12], // or optionally a single value, like 3
                    halstead: [8, 13, 20], // or optionally a single value, like 8
                    maintainability: 100,
                    hideComplexFunctions: false, // only display maintainability
                    broadcast: false // broadcast data over event-bus
                }
            },
        },
        prompt: helper.prompts(grunt),
        apigee_npm_node_modules : {
            command: "npm install --prefix './node'",
       },
       shell: {
	       options: {
	           stderr: false,
	           failOnError : true
	       }
	   }

    })

    require('load-grunt-tasks')(grunt);
    
    //Load and Register tasks for Apickli grunt
    //grunt.loadNpmTasks('grunt-cucumber');
	//grunt.registerTask('tests', ['cucumberjs']);


    // Download tasks
    /*
    grunt.registerTask('downloadProxy', [ "clean:downloadProxy", "mkdir:dl_apiproxy", "setApigeeProfileFromCmdArg", "exportProxyBundle", "unzip:unzip_dl_apiproxy", "apigee_create_config", "apigee_save_config" ]);

    grunt.registerTask('downloadProxyAndConfig', [ "clean:downloadProxy", "mkdir:dl_apiproxy", "setApigeeProfileFromCmdArg", "exportProxyBundle", "unzip:unzip_dl_apiproxy", "search:kvm_config", "search:cache_config", "search:targetserver_config", "search:ldapresource_config", "apigee_create_config", "apigee_get_kvm", "apigee_get_cache", "apigee_get_targetserver", "apigee_get_ldapresource", "apigee_save_config" ]);

    grunt.registerTask('downloadApiProductConfig', [ "clean:downloadProxy", "mkdir:dl_apiproxy", "setApigeeProfileFromCmdArg", "apigee_create_config", "apigee_get_apiproducts", "apigee_save_config" ]);

    grunt.registerTask('downloadAppConfig', [ "clean:downloadProxy", "mkdir:dl_apiproxy", "setApigeeProfileFromCmdArg", "apigee_create_config", "apigee_get_companies", "apigee_get_company_apps", "apigee_get_company_developers", "apigee_get_developers", "apigee_get_developer_apps", "apigee_save_config" ]);
    */


    // Import Cache data
    grunt.registerTask('importCaches', [ "apigee_caches" ]);

    // Import KVM data
    grunt.registerTask('importKVMs', [ 'apigee_kvms' ]);

    // Import Target Servers data
    grunt.registerTask('importTargetServers', [ "apigee_targetservers" ]);
    // Import Target Servers data
    grunt.registerTask('importAPIProducts', [ "apigee_apiproducts" ]);
    grunt.registerTask('deployApiProductConfig', 'Deploy API Product Config to Edge', ['apigeeGruntPluginBanner',  "apigee_apiproducts" ]);

    // Deploy Config and Artifact
    grunt.registerTask('deployCompanyConfig', 'Deploy Company Config to Edge', ['apigeeGruntPluginBanner',  "apigee_developers", "apigee_companies" ]);

    // Deploy Config and Artifact
    grunt.registerTask('deployAppConfig', 'Deploy App Config to Edge', ["apigee_developers", "apigee_developer_apps" ]);

    // importKVM at Organization and Environment level. See apigee_kvm task above
    //grunt.registerTask('importKVMs', ['apigee_kvm:' + grunt.config.get("apigee_profiles")[grunt.option('env')].org + '-' + grunt.option("env"), 'apigee_kvm:' + grunt.config.get("apigee_profiles")[grunt.option('env')].org]);

    grunt.registerTask('buildApiBundle', 'Build zip without importing it to Edge', ['apigeeGruntPluginBanner', 'prompt', 'clean', 'saveGitRevision', 'mkdir', 'copy:apiproxy', /* 'xmlpoke', 'string-replace', 'jshint', 'eslint', 'complexity', 'shell'*/ 'compressAlias']);
    //1. import revision bumping revision id
    grunt.registerTask('IMPORT_DEPLOY_BUMP_REVISION', ['validateSwaggerDoc', 'buildApiBundle', 'getDeployedApiRevisions', 'undeployApiRevision',
        'apigee_import_api_bundle', 'installNpmRevisionAlias', 'deployApiRevisionAlias', 'notify:ApiDeployed'
    ]);

    //2. update revision keeping same id
    grunt.registerTask('UPDATE_CURRENT_REVISION', ['validateSwaggerDoc', 'buildApiBundle', 'getDeployedApiRevisions', 'undeployApiRevision',
        'updateApiRevision', 'installNpmRevisionAlias', 'deployApiRevisionAlias','notify:ApiDeployed'
    ]);

    //3. import revision and run seamless deployment
    grunt.registerTask('DEPLOY_IMPORT_BUMP_SEAMLESS_REVISION', [/*'validateSwaggerDoc', */ 'buildApiBundle','getDeployedApiRevisions','apigee_import_api_bundle',
        'deployApiRevisionAlias',/* 'notify:ApiDeployed' */
    ]);

    /** Shared Flow Bundles **/
    grunt.registerTask('buildSharedFlowBundle', 'Build zip without importing it to Edge', ['apigeeGruntPluginBanner', 'prompt', 'clean', 'saveGitRevision', 'mkdir', 'copy:sharedflowbundle', /* 'xmlpoke', 'string-replace', 'jshint', 'eslint', 'complexity', 'shell'*/ 'compress:main_sharedflow' ]);
    
    grunt.registerTask('deploySharedFlowBundle', [ 'buildSharedFlowBundle', 'getDeployedSharedFlowRevisions','apigee_import_sharedflow_bundle',
        'deploySharedFlowRevision'
    ]);

    //**

    //set to DEPLOY_IMPORT_BUMP_SEAMLESS_REVISION by default. This is critical for production for seamless deployment and not lose traffic
    grunt.registerTask('default', [ /*'importKVMs',*/ 'DEPLOY_IMPORT_BUMP_SEAMLESS_REVISION']);

    grunt.loadTasks('grunt/tasks');
    if (grunt.option.flags().indexOf('--help') === -1 && !grunt.option('env')) {
        grunt.fail.fatal('Invalid environment --env={env}.')
    }
};