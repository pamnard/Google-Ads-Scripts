function unique(arr) { // убираем повторы
    var tmp = {};
    return arr.filter(function (a) {
        return a in tmp ? 0 : tmp[a] = 1;
    });
}

function getCurrentAccountDetails() { // Имя аккаунта
    var currentAccount = AdWordsApp.currentAccount();
    return currentAccount.getName();
}

function daysAgo(days) { // Формируем значение параметра временного диапазона для выборки GAQL
    var MILLIS_PER_DAY = 1000 * 60 * 60 * 24,
        now = new Date(),
        fromDate = new Date(now.getTime() - days * MILLIS_PER_DAY),
        timeZone = AdWordsApp.currentAccount().getTimeZone(),
        formatDate = Utilities.formatDate(fromDate, timeZone, 'yyyy-MM-dd');
    return formatDate;
}
