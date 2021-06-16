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
    if (labelNames.indexOf(CONFIG().scriptLabel) == -1) {
        AdWordsApp.createLabel(CONFIG().scriptLabel);
    }
    if (labelNames.indexOf(customDateRange('now')) == -1) {
        AdWordsApp.createLabel(customDateRange('now'));
    }
    Logger.log('Ярлыки проверены, создан ярлык за ' + customDateRange('now'));
}

function customDateRange(select) { // Формируем значение параметра временного диапазона для выборки AWQL
    var timeType = select;
    var MILLIS_PER_DAY = 1000 * 60 * 60 * 24;
    var now = new Date();
    var fromDate = new Date(now.getTime() - (CONFIG().customDaysInDateRange + CONFIG().customDateRangeShift) * MILLIS_PER_DAY);
    var toDate = new Date(now.getTime() - CONFIG().customDateRangeShift * MILLIS_PER_DAY);
    var nowDate = new Date(now.getTime());
    var timeZone = AdWordsApp.currentAccount().getTimeZone();
    var fromformatDate = Utilities.formatDate(fromDate, timeZone, 'yyyyMMdd');
    var toformatDate = Utilities.formatDate(toDate, timeZone, 'yyyyMMdd');
    var nowformatDate = Utilities.formatDate(nowDate, timeZone, 'yyyyMMdd');
    var duringDates = fromformatDate + ',' + toformatDate;
    if (timeType == 'from') {
        return fromformatDate;
    } else if (timeType == 'to') {
        return toformatDate;
    } else if (timeType == 'now') {
        return nowformatDate;
    } else {
        return duringDates;
    }
}

function unique(arr) { // убираем повторы
    var tmp = {};
    return arr.filter(function (a) {
        return a in tmp ? 0 : tmp[a] = 1;
    });
}

function getCurrentAccountDetails() {
    var currentAccount = AdWordsApp.currentAccount();
    return currentAccount.getName();
}
