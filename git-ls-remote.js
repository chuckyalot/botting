var bot = require('./bot.js')
var execProcess = require("./exec_command.js");
var shellParser = require('node-shell-parser');
var cron = require('node-schedule');

var gitOutputMap = {};
var mapInitialized = false;

cron.scheduleJob('*/10 * * * * *', function() {
    console.log('Cronjob started');
    runLsRemote();
});

function runLsRemote() {
    execProcess.result("\"C:\\Program Files\\Git\\bin\\git.exe\" ls-remote --refs file:///d/prova", function(err, response){
        if(!err){
            var r = 'commit                                 \tbranch\n' + response;
            var gitOutputJson = shellParser(r, {separator: '\t'});
            console.log(JSON.stringify(gitOutputJson));
            
            for(var i = 0; i < gitOutputJson.length; i++) {
                var elem = gitOutputJson[i];
                if (elem.branch in gitOutputMap) {
                    var tempCommit = gitOutputMap[elem.branch]
                    if (tempCommit != elem.commit) {
                        notifyCommitBot(elem.branch, tempCommit)
                    }
                } else {
                    notifyBranchBot(elem.branch)
                }
                gitOutputMap[elem.branch] = elem.commit;
                //console.log(elem.branch + ': ' + elem.commit);
            }

            if (mapInitialized == false) {
                mapInitialized = true;
                bot.sendMessage("parlone init");
            }
            //console.log(gitOutputMap);
        }else {
            console.log(err);
        }
    });
}

function notifyBranchBot(branch) {
    if (mapInitialized) {
        console.log("notify new branch:" + branch);
        bot.sendMessage("Created new branch with name: " + branch);
    }
}

function notifyCommitBot(branch, commit) {
    if (mapInitialized) {
        console.log("notify new commit:" + commit);
        bot.sendMessage("Branch " + branch + " contains a new commit");
    }
}

