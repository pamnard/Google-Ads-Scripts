function main() {

    /**
     * Скрипт добавляет площадки в список исключений по заданным параметрам
     **/

    var REPORTING_OPTIONS = {
        // Comment out the following line to default to the latest reporting version.
        apiVersion: 'v201705'
    };

    var ARPU = 15;
    var AverageCheck = 190;

    // Указываем количество дней для выборки
    // Если хотим использовать данные о конверсиях или доходности, то в качестве значения следует указывать число больее чем окно конверсии. 
    var customDaysInDateRange = 180;

    // Указываем на сколько дней от сегодняшнего мы сдвигаем выборку. Нужно для того чтобы не брать те дни когда запаздывает статистика.
    // Если хотим использовать данные о конверсиях или доходности, то в качестве значения следует указывать число равное дням в окне конверсии. 
    var customDateRangeShift = 0;

    var campaignPerfomaceAWQL = 'SELECT CampaignName, CampaignId ' +
        'FROM CAMPAIGN_PERFORMANCE_REPORT ' +
        'WHERE CampaignStatus = ENABLED AND AdvertisingChannelType = DISPLAY ' +
        'AND Cost > ' + (ARPU * 1000000) + ' ' + 
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
            'AND Cost > ' + (ARPU * 1000000) + ' ' + 
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
            var awql = 'SELECT Criteria, Clicks, Conversions, Cost, ConversionValue, CostPerConversion, IsNegative ' +
                'FROM PLACEMENT_PERFORMANCE_REPORT ' +
                'WHERE CampaignId = ' + CampaignId + ' AND AdGroupId = ' + AdGroupId + ' AND IsNegative = FALSE ' +
                'AND Cost > ' + (ARPU * 1000000) + ' ' +
                'DURING ' + customDateRange(); //
            var rowsIter = AdWordsApp.report(awql).rows();
            while (rowsIter.hasNext()) { // определяем исключаемые площадки
                var row = rowsIter.next();
                var Domain = row['Criteria'].toString();
                var Clicks = parseFloat(row['Clicks']).toFixed();
                var Conversions = parseFloat(row['Conversions']).toFixed(2);
                var ConversionValue = parseFloat(row['ConversionValue']).toFixed();
                var CostPerConversion = parseFloat(row['CostPerConversion']).toFixed(2);
                var Cost = parseFloat(row['Cost']).toFixed(2);
                var IsNegative = row['IsNegative'];
                var CustomConversionRate = (Conversions / Clicks) * 100;
                CustomConversionRate = +CustomConversionRate.toFixed(2);
                if (ConversionValue == 0) {
                    if ((Conversions < 0.01) && (Cost > (ARPU * 3))) { // на 2 ARPU нет конверсий
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
                    if ((Conversions > 0) && (Cost > (ARPU * 3)) && (Conversions < 3) && (CostPerConversion > (ARPU * 2))) { // 1-2 сильно дорогие конверсии
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

                    if ((Conversions > 2) && (Cost > (ARPU * 2)) && (CostPerConversion > ARPU)) { // конверсий много, но они дороже ARPU
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
                    if ((Cost > AverageCheck)) { // ROI = 0 
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
