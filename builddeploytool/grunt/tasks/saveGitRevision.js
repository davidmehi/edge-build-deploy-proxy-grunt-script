module.exports = function(grunt) {
    'use strict';
    grunt.registerTask('saveGitRevision', function() {
        var git = require('gift');
        var repo = git(".")
        var done = this.async();
        var os = require("os");
        repo.current_commit(function(err, commit) {
            var gitRevision = "";
            if (commit) {
                gitRevision = "git commit: " + commit.id.substring(0, 7) + " by " + commit.author.name + " committed by " + commit.committer.name + " on " + os.hostname() + " Built for " + grunt.option('env');
                grunt.option('gitRevision', gitRevision);
            }
            done();
        })
    });
};