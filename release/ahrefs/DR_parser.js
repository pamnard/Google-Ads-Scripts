function main() {
  
    var ahrefsToken = 'xyxyxyxyxyxyxyxyxyxyxyxyxy';

    // Указываем количество дней для выборки
    // Если хотим использовать данные о конверсиях или доходности, то в качестве значения следует указывать число больее чем окно конверсии. 
    var customDaysInDateRange = 365;

    // Указываем на сколько дней от сегодняшнего мы сдвигаем выборку. Нужно для того чтобы не брать те дни когда запаздывает статистика.
    // Если хотим использовать данные о конверсиях или доходности, то в качестве значения следует указывать число равное дням в окне конверсии. 
    var customDateRangeShift = 45;

    //---------------------------------------------------------------------------------------------------------

    var allDomains = [];
    var allData = [];

    var PerfomaceAWQL = 'SELECT Domain, Clicks, Conversions, ConversionValue, Cost ' +
        'FROM AUTOMATIC_PLACEMENTS_PERFORMANCE_REPORT ' +
        'WHERE Cost > 10000000 ' +
        'DURING ' + customDateRange();
    var PerfomaceRowsIter = AdWordsApp.report(PerfomaceAWQL).rows();
    Logger.log(PerfomaceAWQL);
    while (PerfomaceRowsIter.hasNext()) {
        var row = PerfomaceRowsIter.next();
        var Criteria = row['Domain'].toString();
        var Clicks = parseFloat(row['Clicks']).toFixed();
        var Conversions = parseFloat(row['Conversions']).toFixed(2);
        var ConversionValue = parseFloat(row['ConversionValue']).toFixed(2);
        var Cost = parseFloat(row['Cost']).toFixed(2);

        if (Criteria.indexOf('::') == -1) {
            allDomains.push(Criteria);
            var line = {
                CriteriaRow: Criteria,
                ClicksRow: Clicks,
                ConversionsRow: Conversions,
                ConversionValueRow: ConversionValue,
                CostRow: Cost
            };
            allData.push(line);
        }
    }

    allDomains = unique(allDomains);

    var uniqueDomains = [];

    allDomains.forEach(function (uniquedomain) {
        var domainStats = {};
        domainStats.Criteria = uniquedomain;
        domainStats.Clicks = +0;
        domainStats.Conversions = +0;
        domainStats.ConversionValue = +0;
        domainStats.Cost = +0;
        domainStats.Rating = getDomainRating(uniquedomain);
        allData.forEach(function (line) {
            if (line.CriteriaRow == uniquedomain) {
                domainStats.Clicks = domainStats.Clicks + +line.ClicksRow;
                domainStats.Conversions = domainStats.Conversions + +line.ConversionsRow;
                domainStats.ConversionValue = domainStats.ConversionValue + +line.ConversionValueRow;
                domainStats.Cost = domainStats.Cost + +line.CostRow;
            }
        });
        uniqueDomains.push(domainStats);
    });

    var statByRates = [];

    var rateCount = 0;
    while (rateCount < 101) {
        var rateStats = {};
        rateStats.Rating = rateCount;
        rateStats.Clicks = +0;
        rateStats.Conversions = +0;
        rateStats.ConversionValue = +0;
        rateStats.Cost = +0;
        uniqueDomains.forEach(function (line) {
            if (line.Rating == rateCount) {
                rateStats.Clicks = rateStats.Clicks + +line.Clicks;
                rateStats.Conversions = rateStats.Conversions + +line.Conversions;
                rateStats.ConversionValue = rateStats.ConversionValue + +line.ConversionValue;
                rateStats.Cost = rateStats.Cost + +line.Cost;
            }
        });
        statByRates.push(rateStats);
        rateCount++;
    }

    var ssNew = SpreadsheetApp.create('Stats By DR');
    var sheet = ssNew.getSheets()[0];
    sheet.appendRow([
                    'Domain Rating',
                    'Clicks',
                    'Conversions',
                    'ConversionValue',
                    'Cost',
        ]);
    statByRates.forEach(function (line) {
        sheet.appendRow([
            line.Rating,
            line.Clicks,
            line.Conversions,
            line.ConversionValue,
            line.Cost
        ]);
    })
    Logger.log(ssNew.getUrl());

    function getDomainRating(url) {
        var ahrefsUrl = 'http://apiv2.ahrefs.com/?from=domain_rating&target=' + url + '&mode=domain&output=json&token=' + ahrefsToken;
        var response = UrlFetchApp.fetch(ahrefsUrl);
        Utilities.sleep(100);
        var ahrefs = JSON.parse(response.getContentText('UTF-8'));
        var rating = ahrefs.domain.domain_rating;
        return rating;
    }

    function unique(arr) { // убираем повторы
        var result = [];
        nextInput:
            for (var i = 0; i < arr.length; i++) {
                var str = arr[i]; // для каждого элемента
                for (var j = 0; j < result.length; j++) { // ищем, был ли он уже?
                    if (result[j] == str) continue nextInput; // если да, то следующий
                }
                result.push(str);
            }
        return result;
    }

    function customDateRange(select) { // Формируем значение параметра временного диапазона для выборки AWQL
        var timeType = select;
        var MILLIS_PER_DAY = 1000 * 60 * 60 * 24;
        var now = new Date();
        var fromDate = new Date(now.getTime() - (customDaysInDateRange + customDateRangeShift) * MILLIS_PER_DAY);
        var toDate = new Date(now.getTime() - customDateRangeShift * MILLIS_PER_DAY);
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
}
