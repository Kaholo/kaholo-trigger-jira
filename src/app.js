function issueUpdateWebhook(req, res, settings, triggerControllers) {
    try {
        const body = req.body;
        const reqStatusName = body.issue.fields.status.name;
        const reqProjectKey = body.issue.fields.project.key;
        triggerControllers.forEach(trigger => {
            const {statusName, projectKey} = trigger.params;

            if (statusName && reqStatusName !== statusName) return;
            if (projectKey && reqProjectKey !== projectKey) return;
            
            trigger.execute(`Jira Update Issue - ${trigger.name}`, body);
        });
        res.status(200).send("OK");
      }
    catch (err){
        res.status(422).send(err.message);
    }
}

function newIssueWebhook(req, res, settings, triggerControllers) {
    try {
        const body = req.body;
        const reqProjectKey = body.issue.fields.project.key;
        triggerControllers.forEach(trigger => {
            const {projectKey} = trigger.params;
            if (projectKey && reqProjectKey !== projectKey) return;
            trigger.execute(`Jira New Issue - ${trigger.name}`, body);
        });
        res.status(200).send("OK");
      }
    catch (err){
        res.status(422).send(err.message);
    }
}

module.exports = {
    issueUpdateWebhook,
    newIssueWebhook
}
