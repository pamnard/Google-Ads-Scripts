function unique(arr) {
    var tmp = {};
    return arr.filter(function (a) {
        return a in tmp ? 0 : tmp[a] = 1;
    });
}

function handleErrors(errors) {
    Logger.log(errors);
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

function ensureAccountLabels() {
    function getAccountLabelNames() {
        var labelNames = [];
        var iterator = AdWordsApp.labels().get();
        while (iterator.hasNext()) {
            labelNames.push(iterator.next().getName());
        }
        return labelNames;
    }
    var labelNames = getAccountLabelNames();
    if (labelNames.indexOf('GPT_YES') == -1) {
        AdWordsApp.createLabel('GPT_YES');
    }
    if (labelNames.indexOf('GPT_NO') == -1) {
        AdWordsApp.createLabel('GPT_NO');
    }
}