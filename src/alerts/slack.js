module.exports = function(alert, data) {
    let slackUrl = alert.url;
    if (slackUrl === "{replaceThis}" || slackUrl === "") {
        if (process.env.SLACK_HOOK_URL) {
            slackUrl = process.env.SLACK_HOOK_URL;
        } else {
            console.log("Slack URL must be in config file or implemented as an environment variable");
            return;
        }
    }

    if (!alert.post_data) {
        alert.post_data = {};
    }

    alert.post_data.text = "";
    data.results.forEach(function(item, i) {
        alert.post_data.text += "Amp Validation error found on <" + item.page + ">\n";
    });

    alert.post_options = {
        url : slackUrl,
        method: "POST",
        json: true,
        body: alert.post_data
    };

    return alert;
}