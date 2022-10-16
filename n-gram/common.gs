function unique(arr) {
    var tmp = {};
    return arr.filter(function (a) {
        return a in tmp ? 0 : tmp[a] = 1;
    });
}

function get_account_name() {
    return AdsApp.currentAccount().getName();
}

function days_ago(days) {
    var MILLIS_PER_DAY = 1000 * 60 * 60 * 24,
        now = new Date(),
        fromDate = new Date(now.getTime() - days * MILLIS_PER_DAY),
        timeZone = AdsApp.currentAccount().getTimeZone(),
        formatDate = Utilities.formatDate(fromDate, timeZone, 'yyyy-MM-dd');
    return formatDate;
}

function send_slack_message(text) {
    var slack_url = config().slack_url,
        slack_message = {
            "text": text
        };
    var options = {
        method: 'POST',
        contentType: 'application/json',
        payload: JSON.stringify(slack_message)
    };
    UrlFetchApp.fetch(slack_url, options);
}
