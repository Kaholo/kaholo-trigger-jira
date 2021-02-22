const config = require("./config");
const mapExecutionService = require("../../../api/services/map-execution.service");
const Trigger = require("../../../api/models/map-trigger.model");

function findTriggers(req, res, execFunc, method){
    let body = req.body;
    Trigger.find({ plugin: config.name, method: method }).then((triggers) => {
        console.log(`Found ${triggers.length} triggers`);
        res.send('OK');
        triggers.forEach(trigger=>execFunc(trigger,body,req.io))
    }).catch((error) => res.send(error))
}

function execMap(trigger, body, io) {
    console.log(trigger.map);
    let message = trigger.name + ' started by Jira trigger'
    console.log(`********** Jira: executing map ${trigger.map} **********`);
    mapExecutionService.execute(trigger.map,null,io,{config: trigger.configuration},message,body);
}

function issueUpdateWebhook(req,res) {
    findTriggers(req, res, 
        execTriggerUpdateIssue,
        "issueUpdateWebhook");
}

function newIssueWebhook (req,res) {
    findTriggers(req, res, 
        execTriggerNewIssue,
        "newIssueWebhook");
}

function execTriggerUpdateIssue (trigger, body, io) {
    new Promise ((resolve,reject) => {
        const statusName = body.issue.fields.status.name;
        const projectName = body.issue.fields.project.name;
        const triggerStatusName = trigger.params.find(o => o.name === 'statusName');
        const triggerProjectName = trigger.params.find(o => o.name === 'projectName');
        if (triggerStatusName.value != statusName) {
            console.log(statusName);
            return reject("Not matching status name");
        } else if (triggerProjectName.value != projectName) {
            console.log(projectName);
            return reject("Not matching project name");
        } else {
            return resolve()
        }
    }).then(() => {
        execMap(trigger, body, io);
    }).catch(err=>{
        console.error(err);
    })
}

function execTriggerNewIssue (trigger, body,io) {
    new Promise ((resolve,reject) => {
        const projectKey = body.issue.fields.project.key;
        const triggerProjectKey = trigger.params.find(o => o.name === 'projectKey');
        if (triggerProjectKey.value != projectKey) {
            console.log(projectName);
            return reject("Not matching project name");
        } else {
            return resolve()
        }
    }).then(() => {
        execMap(trigger, body, io);
    }).catch(err=>{
        console.error(err);
    })
}

module.exports = {
    issueUpdateWebhook,
    newIssueWebhook
}
