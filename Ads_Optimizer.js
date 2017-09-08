function main() {

    var REPORTING_OPTIONS = {
        // Comment out the following line to default to the latest reporting version.
        apiVersion: 'v201705'
    };

    // Указываем количество дней для выборки
    // Если хотим использовать данные о конверсиях или доходности, то в качестве значения следует указывать число больее чем окно конверсии. 
    var customDaysInDateRange = 365;

    // Указываем на сколько дней от сегодняшнего мы сдвигаем выборку. Нужно для того чтобы не брать те дни когда запаздывает статистика.
    // Если хотим использовать данные о конверсиях или доходности, то в качестве значения следует указывать число равное дням в окне конверсии. 
    var customDateRangeShift = 0;

    var campaignPerfomaceAWQL = 'SELECT CampaignName, CampaignId ' +
        'FROM CAMPAIGN_PERFORMANCE_REPORT ' +
        'WHERE CampaignStatus = ENABLED AND AdvertisingChannelType = SEARCH ' +
        'DURING TODAY';
    var campaignPerfomaceRowsIter = AdWordsApp.report(campaignPerfomaceAWQL, REPORTING_OPTIONS).rows();
    while (campaignPerfomaceRowsIter.hasNext()) {
        var CampaignRow = campaignPerfomaceRowsIter.next();
        var CampaignName = CampaignRow['CampaignName'];
        var CampaignId = CampaignRow['CampaignId'];
        if (CampaignRow) {
            getAdGroups();
        }
    }

    function getAdGroups() {
        var AdGroupPerfomanceAWQL = 'SELECT AdGroupName, AdGroupId ' +
            'FROM ADGROUP_PERFORMANCE_REPORT ' +
            'WHERE CampaignId = ' + CampaignId + ' AND AdGroupStatus = ENABLED AND Clicks > 100 ' +
            'DURING ' + customDateRange();
        var AdGroupPerfomancerowsIter = AdWordsApp.report(AdGroupPerfomanceAWQL, REPORTING_OPTIONS).rows();
        while (AdGroupPerfomancerowsIter.hasNext()) {
            var AdGroupRow = AdGroupPerfomancerowsIter.next();
            var AdGroupName = AdGroupRow['AdGroupName'];
            var AdGroupId = AdGroupRow['AdGroupId'];
            if (AdGroupRow) {
                Logger.log('CampaignName: ' + CampaignName + ' AdGroupName: ' + AdGroupName);
                var statsForAdsInGroup = getAds();
                shuffle(statsForAdsInGroup);
            }
        }

        function getAds() {
            var adsStats = [];
            var adsAWQL = 'SELECT Id, Status, Clicks, Conversions, Cost ' +
                'FROM AD_PERFORMANCE_REPORT ' +
                'WHERE CampaignId = ' + CampaignId + ' AND AdGroupId = ' + AdGroupId + ' AND Status != DISABLED ' +
                'DURING ' + customDateRange();
            var adsRowsIter = AdWordsApp.report(adsAWQL, REPORTING_OPTIONS).rows();
            while (adsRowsIter.hasNext()) {
                var adsRow = adsRowsIter.next();
                var adsId = adsRow['Id'].toString();
                var adsStatus = adsRow['Status'].toString();
                var adsClicks = parseFloat(adsRow['Clicks']).toFixed();
                var adsConversions = parseFloat(adsRow['Conversions']).toFixed(2);
                var adsCost = parseFloat(adsRow['Cost']).toFixed(2);
                adsCost = adsCost * 1000000;
                var adsCostPerConversion = +0;
                if (adsConversions > 0) {
                    adsCostPerConversion = adsCost / adsConversions;
                }
                adsCostPerConversion = parseFloat(adsCostPerConversion).toFixed(2);
                if (adsRow) {
                    var statsRow = {
                        IdCol: adsId,
                        StatusCol: adsStatus,
                        ClicksCol: adsClicks,
                        ConversionsCol: adsConversions,
                        CostCol: adsCost,
                        CostPerConversionCol: adsCostPerConversion,
                    };
                    adsStats[adsStats.length] = statsRow;
                    if (adsStatus == 'enabled') {
                        pauseAdsInAdGroup(adsId);
                        Logger.log('Выключаем объявление: ' + adsId);
                    }
                }
            }
            return adsStats;
        }

        function shuffle(array) {
            var stats = array;
            var clicksStat = [];
            var conversionCostStat = [];
            var lowestClicks = +0;
            var bestConversionCost = +0;

            for (var i = 0; i < stats.length; i++) {
                var statsRow = stats[i];
                var clicks = statsRow['ClicksCol'];
                var conversionCost = statsRow['CostPerConversionCol'];
                clicksStat[clicksStat.length] = clicks;
                conversionCostStat[conversionCostStat.length] = conversionCost;
            }
            lowestClicks = getMinOfArray(clicksStat);
            bestConversionCost = getMinOfArray(conversionCostStat);
            if (lowestClicks < 100) {
                for (var i = 0; i < stats.length; i++) {
                    var statsRow = stats[i];
                    var clicks = statsRow['ClicksCol'];
                    if (clicks == lowestClicks) {
                        enableAdsInAdGroup(statsRow['IdCol']);
                        Logger.log('Включаем объявление: ' + statsRow['IdCol']);
                    }
                }
            }
            if (lowestClicks > 100) {
                for (var i = 0; i < stats.length; i++) {
                    var statsRow = stats[i];
                    var conversionCost = statsRow['CostPerConversionCol'];
                    if (conversionCost == bestConversionCost) {
                        enableAdsInAdGroup(statsRow['IdCol']);
                        Logger.log('Включаем лучшее объявление: ' + statsRow['IdCol']);
                    }
                }
            }
        }

        function pauseAdsInAdGroup(adsId) {
            var adGroupIterator = AdWordsApp.adGroups()
                .withCondition('AdGroupId = ' + AdGroupId)
                .get();
            if (adGroupIterator.hasNext()) {
                var adGroup = adGroupIterator.next();
                var adsIterator = adGroup.ads()
                    .withCondition('Id = ' + adsId)
                    .get();
                while (adsIterator.hasNext()) {
                    var ad = adsIterator.next();
                    ad.pause();
                }
            }
        }

        function enableAdsInAdGroup(adsId) {
            var adGroupIterator = AdWordsApp.adGroups()
                .withCondition('AdGroupId = ' + AdGroupId)
                .get();
            if (adGroupIterator.hasNext()) {
                var adGroup = adGroupIterator.next();
                var adsIterator = adGroup.ads()
                    .withCondition('Id = ' + adsId)
                    .get();
                while (adsIterator.hasNext()) {
                    var ad = adsIterator.next();
                    ad.enable();
                }
            }
        }
    }

    function getMinOfArray(numArray) {
        return Math.min.apply(null, numArray);
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
