function main() {

    var CONFIG = {
        customDaysInDateRange: 365,
        // Указываем количество дней для выборки
        // Если хотим использовать данные о конверсиях или доходности, то в качестве значения следует указывать число больее чем окно конверсии. 

        customDateRangeShift: 0
        // Указываем на сколько дней от сегодняшнего мы сдвигаем выборку. Нужно для того чтобы не брать те дни когда запаздывает статистика.
        // Если хотим использовать данные о конверсиях или доходности, то в качестве значения следует указывать число равное дням в окне конверсии. 
    };

    //===========================================================

    var REPORTING_OPTIONS = {
        // Comment out the following line to default to the latest reporting version.
        apiVersion: 'V201806'
    };

    var campaignPerfomaceAWQL = 'SELECT CampaignName, CampaignId ' +
        'FROM CAMPAIGN_PERFORMANCE_REPORT ' +
        'WHERE CampaignStatus = ENABLED AND AdvertisingChannelType = SEARCH AND Clicks > 100 ' +
        'DURING ' + customDateRange();
    var campaignPerfomaceRowsIter = AdWordsApp.report(campaignPerfomaceAWQL, REPORTING_OPTIONS).rows();
    while (campaignPerfomaceRowsIter.hasNext()) {
        var CampaignRow = campaignPerfomaceRowsIter.next(),
            CampaignName = CampaignRow['CampaignName'],
            CampaignId = CampaignRow['CampaignId'];
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
            var AdGroupRow = AdGroupPerfomancerowsIter.next(),
                AdGroupName = AdGroupRow['AdGroupName'],
                AdGroupId = AdGroupRow['AdGroupId'];
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
                var adsRow = adsRowsIter.next(),
                    adsId = adsRow['Id'].toString(),
                    adsStatus = adsRow['Status'].toString(),
                    adsClicks = parseFloat(adsRow['Clicks']).toFixed(),
                    adsConversions = parseFloat(adsRow['Conversions']).toFixed(2),
                    adsCost = parseFloat(adsRow['Cost']).toFixed(2) * 1000000;
                var adsCostPerConversion = +0;
                if (adsConversions > 0) {
                    adsCostPerConversion = parseFloat(adsCost / adsConversions).toFixed(2);
                }
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
                        toggleAdsInAdGroup(adsId, 'pause');
                        Logger.log('Выключаем объявление: ' + adsId);
                    }
                }
            }
            return adsStats;
        }

        function shuffle(array) {
            var stats = array,
                clicksStat = [],
                conversionCostStat = [],
                lowestClicks = +0,
                bestConversionCost = +0;
            for (var i = 0; i < stats.length; i++) {
                var statsRow = stats[i],
                    clicks = statsRow['ClicksCol'],
                    conversionCost = statsRow['CostPerConversionCol'];
                clicksStat[clicksStat.length] = clicks;
                conversionCostStat[conversionCostStat.length] = conversionCost;
            }
            lowestClicks = getMinOfArray(clicksStat);
            bestConversionCost = getMinOfArray(conversionCostStat);

            if (lowestClicks < 100) {
                for (var i = 0; i < stats.length; i++) {
                    var statsRow = stats[i],
                        clicks = statsRow['ClicksCol'];
                    if (clicks == lowestClicks) {
                        toggleAdsInAdGroup(statsRow['IdCol'], 'enable');
                        Logger.log('Включаем объявление: ' + statsRow['IdCol']);
                    }
                }
            }
            if (lowestClicks > 100) {
                for (var i = 0; i < stats.length; i++) {
                    var statsRow = stats[i],
                        conversionCost = statsRow['CostPerConversionCol'];
                    if (conversionCost == bestConversionCost) {
                        toggleAdsInAdGroup(statsRow['IdCol'], 'enable');
                        Logger.log('Включаем лучшее объявление: ' + statsRow['IdCol']);
                    }
                }
            }
        }

        function toggleAdsInAdGroup(adId, status) {
            var adGroupIterator = AdWordsApp.adGroups()
                .withCondition('AdGroupId = ' + AdGroupId)
                .get();
            if (adGroupIterator.hasNext()) {
                var adGroup = adGroupIterator.next(),
                    adsIterator = adGroup.ads()
                    .withCondition('Id = ' + adId)
                    .get();
                while (adsIterator.hasNext()) {
                    var ad = adsIterator.next();
                    if (status == 'pause') {
                        ad.pause();
                    }
                    if (status == 'enable') {
                        ad.enable();
                    }
                }
            }
        }
    }

    function getMinOfArray(numArray) {
        return Math.min.apply(null, numArray);
    }

    function customDateRange() { // Формируем значение параметра временного диапазона для выборки AWQL
        var MILLIS_PER_DAY = 1000 * 60 * 60 * 24,
            now = new Date(),
            fromDate = new Date(now.getTime() - (CONFIG.customDaysInDateRange + CONFIG.customDateRangeShift) * MILLIS_PER_DAY),
            toDate = new Date(now.getTime() - CONFIG.customDateRangeShift * MILLIS_PER_DAY),
            nowDate = new Date(now.getTime()),
            timeZone = AdWordsApp.currentAccount().getTimeZone(),
            fromformatDate = Utilities.formatDate(fromDate, timeZone, 'yyyyMMdd'),
            toformatDate = Utilities.formatDate(toDate, timeZone, 'yyyyMMdd'),
            nowformatDate = Utilities.formatDate(nowDate, timeZone, 'yyyyMMdd'),
            duringDates = fromformatDate + ',' + toformatDate;
        return duringDates;
    }
}
