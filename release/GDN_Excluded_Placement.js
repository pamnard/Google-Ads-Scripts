function main() {

    // Скрипт добавляет площадки в список исключений по заданным параметрам

    var CONFIG = {
        ARPU: 15,
        // Средняя выручка на конверсию

        AverageCheck: 190,
        // Средняя выручка на конверсию с Value

        customDaysInDateRange: 180,
        // Указываем количество дней для выборки
        // Если хотим использовать данные о конверсиях или доходности, то в качестве значения следует указывать число больее чем окно конверсии. 

        customDateRangeShift: 0
        // Указываем на сколько дней от сегодняшнего мы сдвигаем выборку. Нужно для того чтобы не брать те дни когда запаздывает статистика.
        // Если хотим использовать данные о конверсиях или доходности, то в качестве значения следует указывать число равное дням в окне конверсии. 
    };

    //======================================================================

    var REPORTING_OPTIONS = {
        // Comment out the following line to default to the latest reporting version.
        apiVersion: 'v201705'
    };

    var campaignPerfomaceAWQL = 'SELECT CampaignName, CampaignId ' +
        'FROM CAMPAIGN_PERFORMANCE_REPORT ' +
        'WHERE CampaignStatus = ENABLED AND AdvertisingChannelType = DISPLAY ' +
        'AND Cost > ' + (CONFIG.ARPU * 1000000) + ' ' +
        'DURING ' + customDateRange();
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
            'WHERE CampaignId = ' + CampaignId + ' AND AdGroupStatus = ENABLED ' +
            'AND Cost > ' + (CONFIG.ARPU * 1000000) + ' ' +
            'DURING ' + customDateRange();
        var AdGroupPerfomancerowsIter = AdWordsApp.report(AdGroupPerfomanceAWQL, REPORTING_OPTIONS).rows();
        while (AdGroupPerfomancerowsIter.hasNext()) {
            var AdGroupRow = AdGroupPerfomancerowsIter.next();
            var AdGroupName = AdGroupRow['AdGroupName'];
            var AdGroupId = AdGroupRow['AdGroupId'];
            if (AdGroupRow) {
                Logger.log('CampaignName: ' + CampaignName + ' AdGroupName: ' + AdGroupName);
                placemetsBlock();
            }
        }

        function placemetsBlock() {
            var AWQL = 'SELECT Criteria, Clicks, Conversions, Cost, ConversionValue, CostPerConversion, IsNegative ' +
                'FROM PLACEMENT_PERFORMANCE_REPORT ' +
                'WHERE CampaignId = ' + CampaignId + ' AND AdGroupId = ' + AdGroupId + ' AND IsNegative = FALSE ' +
                'AND Cost > ' + (CONFIG.ARPU * 1000000) + ' ' +
                'DURING ' + customDateRange(); //
            var rowsIter = AdWordsApp.report(AWQL).rows();
            while (rowsIter.hasNext()) { // определяем исключаемые площадки
                var row = rowsIter.next(),
                    Domain = row['Criteria'].toString(),
                    Clicks = parseFloat(row['Clicks']).toFixed(),
                    Conversions = parseFloat(row['Conversions']).toFixed(2),
                    ConversionValue = parseFloat(row['ConversionValue']).toFixed(),
                    CostPerConversion = parseFloat(row['CostPerConversion']).toFixed(2),
                    Cost = parseFloat(row['Cost']).toFixed(2),
                    IsNegative = row['IsNegative'].toString(),
                    CustomConversionRate = ((Conversions / Clicks) * 100).toFixed(2);
                if (ConversionValue == +0) {
                    if ((Conversions < 0.01) && (Cost > (CONFIG.ARPU * 3))) { // на 2 ARPU нет конверсий
                        addNegativeKeywordToAdGroup(Domain);
                        Logger.log('Исключаем ' + Domain + ' - нет конверсий при большом расходе (больше 2-х ARPU).');
                        Logger.log('Клики - ' + Clicks +
                            ' Конверсии - ' + Conversions +
                            ' Конверсия(%) - ' + CustomConversionRate +
                            ' Стоимость конверсии - ' + CostPerConversion +
                            ' Расход - ' + Cost +
                            ' Доход с площадки - ' + ConversionValue);
                        Logger.log('------------------------------------');
                    }
                    if ((Conversions > +0) && (Cost > (CONFIG.ARPU * 3)) && (Conversions < 3) && (CostPerConversion > (CONFIG.ARPU * 2))) { // 1-2 сильно дорогие конверсии
                        addNegativeKeywordToAdGroup(Domain);
                        Logger.log('Исключаем ' + Domain + ' - конверсий мало, а те что есть очень дорогие.');
                        Logger.log('Клики - ' + Clicks +
                            ' Конверсии - ' + Conversions +
                            ' Конверсия(%) - ' + CustomConversionRate +
                            ' Стоимость конверсии - ' + CostPerConversion +
                            ' Расход - ' + Cost +
                            ' Доход с площадки - ' + ConversionValue);
                        Logger.log('------------------------------------');
                    }

                    if ((Conversions > 2) && (Cost > (CONFIG.ARPU * 2)) && (CostPerConversion > CONFIG.ARPU)) { // конверсий много, но они дороже ARPU
                        addNegativeKeywordToAdGroup(Domain);
                        Logger.log('Исключаем ' + Domain + ' - конверсий много, но они дороже ARPU.');
                        Logger.log('Клики - ' + Clicks +
                            ' Конверсии - ' + Conversions +
                            ' Конверсия(%) - ' + CustomConversionRate +
                            ' Стоимость конверсии - ' + CostPerConversion +
                            ' Расход - ' + Cost +
                            ' Доход с площадки - ' + ConversionValue);
                        Logger.log('------------------------------------');
                    }
                    if ((Cost > CONFIG.AverageCheck)) { // ROI = 0 
                        addNegativeKeywordToAdGroup(Domain);
                        Logger.log('Исключаем ' + Domain + ' - ROI = 0.');
                        Logger.log('Клики - ' + Clicks +
                            ' Конверсии - ' + Conversions +
                            ' Конверсия(%) - ' + CustomConversionRate +
                            ' Стоимость конверсии - ' + CostPerConversion +
                            ' Расход - ' + Cost +
                            ' Доход с площадки - ' + ConversionValue);
                        Logger.log('------------------------------------');
                    }
                }
            }
        }

        function addNegativeKeywordToAdGroup(negativePlacement) { // исключаем площадки
            Logger.log(negativePlacement);
            var adGroupIterator = AdWordsApp.adGroups()
                .withCondition('CampaignId = ' + CampaignId)
                .withCondition('AdGroupId = ' + AdGroupId)
                .get();
            if (adGroupIterator.hasNext()) {
                var adGroup = adGroupIterator.next();
                var placementIterator = AdWordsApp.display().placements()
                    .withCondition('CampaignId = ' + CampaignId)
                    .withCondition('AdGroupId = ' + AdGroupId)
                    .withCondition('Status = ENABLED')
                    .withCondition('PlacementUrl = ' + negativePlacement)
                    .get();
                while (placementIterator.hasNext()) {
                    var placement = placementIterator.next();
                    placement.remove();
                }
                var placementBuilder = adGroup.display().newPlacementBuilder()
                    .withUrl(negativePlacement) // required
                    .exclude(); // create the placement
            }
        }
    }

    function customDateRange(select) { // Формируем значение параметра временного диапазона для выборки AWQL
        var timeType = select,
            MILLIS_PER_DAY = 1000 * 60 * 60 * 24,
            now = new Date(),
            fromDate = new Date(now.getTime() - (customDaysInDateRange + customDateRangeShift) * MILLIS_PER_DAY),
            toDate = new Date(now.getTime() - customDateRangeShift * MILLIS_PER_DAY),
            nowDate = new Date(now.getTime()),
            timeZone = AdWordsApp.currentAccount().getTimeZone(),
            fromformatDate = Utilities.formatDate(fromDate, timeZone, 'yyyyMMdd'),
            toformatDate = Utilities.formatDate(toDate, timeZone, 'yyyyMMdd'),
            nowformatDate = Utilities.formatDate(nowDate, timeZone, 'yyyyMMdd'),
            duringDates = fromformatDate + ',' + toformatDate;
        return duringDates;
    }
}
