const config = require("./config");
const mapExecutionService = require("../../../api/services/map-execution.service");
const Trigger = require("../../../api/models/map-trigger.model");

function issueUpdateWebhook(req,res) {
    let body = req.body
    Trigger.find({ plugin: config.name }).then((triggers) => {
        console.log(`Found ${triggers.length} triggers`);
        res.send('OK');
        triggers.forEach(trigger=>execTrigger(trigger,body,req.io))
    }).catch((error) => res.send(error))
}

function execTrigger (trigger, body,io) {
    new Promise ((resolve,reject) => {
        const statusName = body.issue.fields.status.name;
        const projectName = body.issue.fields.project.name;
        const triggerStatusName = trigger.params.find(o => o.name === 'STATUS_NAME');
        const triggerProjectName = trigger.params.find(o => o.name === 'PROJECT');
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
        console.log(trigger.map);
        let message = trigger.name + ' started by Jira trigger'
        console.log(`********** Jira: executing map ${trigger.map} **********`);
        mapExecutionService.execute(trigger.map,null,io,{config: trigger.configuration},message,body);
    }).catch(err=>{
        console.error(err);
    })
}
module.exports = {
    ISSUE_UPDATE_WEBHOOK: issueUpdateWebhook
}
