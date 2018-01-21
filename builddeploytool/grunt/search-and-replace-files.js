exports.searchAndReplaceFiles = function(env, grunt) {
    var config = {
        dev: {
            files: [{
                cwd: 'target/',
                src: ['**/*.js', '**/*.xml', '!node/node_modules/**/*.js'],
                dest: 'target/',
                expand: true,
            }],
            options: {
                replacements: [{
                    pattern: '%%BACK-END-URL%%',
                    replacement: 'back-end1.company.com'
                }]
            }
        },
        test: {
            files: [{
                cwd: 'target/',
                src: ['**/*.js', '**/*.xml', '!node/node_modules/**/*.js'],
                dest: 'target/',
                expand: true,
            }],
            options: {
                replacements: [{
                    pattern: '%%BACK-END-URL%%',
                    replacement: 'back-end1.company.com'
                }]
            }
        },
        stage: {
            files: [{
                cwd: 'target/',
                src: ['**/*.js', '**/*.xml', '!node/node_modules/**/*.js'],
                dest: 'target/',
                expand: true,
            }],
            options: {
                replacements: [{
                    pattern: '%%BACK-END-URL%%',
                    replacement: 'back-end1.company.com'
                }]
            }
        },
        prod: {
            files: [{
                cwd: 'target/',
                src: ['**/*.js', '**/*.xml', '!node/node_modules/**/*.js'],
                dest: 'target/',
                expand: true,
            }],
            options: {
                replacements: [{
                    pattern: '%%BACK-END-URL%%',
                    replacement: 'back-end1.company.com'
                }]
            }
        }
    }
    if (!config[env]) grunt.fail.fatal('Environment ' + env + ' does not exist under grunt/search-and-replace-files.js')
    return (config[env])
}