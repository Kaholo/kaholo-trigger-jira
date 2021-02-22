# kaholo-trigger-jira
Kaholo Trigger for Jira webhooks.

## How to use:
After installing the plugin on Kaholo,
On jira administration console, create a new webhook and set the URL required by each method.

## Method: Update issue:
This trigger will start when issue moves across the board in Jira
When creating the webhook in Jira - make sure that you check the update issue option.

### Webhook URL:
**{KAHOLO_URL}/webhook/jira/updateissue**

### Parameters:
1) Status Name - The status on which the plugin shall trigger. If not provided than accept any.
2) Project Key - When provided only trigger on updates from the project with the project key that was provided. 
    If not provided accept updates from any project.

## Method: new issue
This trigger execute when there is a new issue in Jira.
When creating the webhook in Jira - make sure that you check the create issue option.

### Webhook URL:
**{KAHOLO_URL}/webhook/jira/newissue**

### Parameters:
1) Project Key - When provided only trigger on new issues from the project with the project key that was provided. 
    If not provided accept new issues from any project.
