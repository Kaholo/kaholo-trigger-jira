const config = require(`./config`);
const mapExecutionService = require(`../../../api/services/map-execution.service`);
const Trigger = require(`../../../api/models/map-trigger.model`);

function findTriggers(req, res, execFunc, method){
    let body = req.body;
    Trigger.find({ plugin: config.name, method: method }).then((triggers) => {
        console.log(`Found ${triggers.length} triggers`);
        triggers.forEach(trigger=>execFunc(trigger,body,req.io));
        res.send('OK');
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
        `issueUpdateWebhook`);
}

function newIssueWebhook (req,res) {
    findTriggers(req, res, 
        execTriggerNewIssue,
        `newIssueWebhook`);
}

function execTriggerUpdateIssue (trigger, body, io) {
    const statusName = body.issue.fields.status.name;
    const projectKey = body.issue.fields.project.key;

    const triggerStatusName = (trigger.params.find(o => o.name === 'statusName').value || "").trim();
    const triggerProjectKey = (trigger.params.find(o => o.name === 'projectKey').value || "").trim();

    if (triggerStatusName && triggerStatusName !== statusName) {
        return console.error(`Not matching status name: ${statusName}`);
    } 
    if (triggerProjectKey && triggerProjectKey !== projectKey) {
        return console.error(`Not matching status name: ${statusName}`);
    } 
    execMap(trigger, body, io);
}

function execTriggerNewIssue (trigger, body,io) {
    const projectKey = body.issue.fields.project.key;
    const triggerProjectKey = (trigger.params.find(o => o.name === 'projectKey').value || "").trim();
    if (triggerProjectKey && triggerProjectKey !== projectKey) {
        return console.error(`Not matching project key: ${projectKey}`);
    }
    execMap(trigger, body, io);
}

module.exports = {
    issueUpdateWebhook,
    newIssueWebhook
}
