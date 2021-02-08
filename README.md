# kaholo-trigger-jira
Kaholo Trigger for Jira

## Method: Update issue:
This trigger will start when issue move across the board in Jira
Exposed route: /webhook/jira/updateissue

## Method: new issue
This trigger execute when there is a new issue in Jira.
When creating the webhook in Jira - make sure that you check the create issue.
**Exposed Route:** /webhook/jira/newissue
### Parameters:
1. Project key (can retrieve fron the URL or the issue prefix.

