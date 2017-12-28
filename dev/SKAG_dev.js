function main() {

    var CONFIG = {
        scriptLabel: 'SKAG',
        // Ярлык которым скрипт помечает созданные слова

        customDaysInDateRange: 30,
        // Указываем количество дней для выборки
        // Если хотим использовать данные о конверсиях или доходности, то в качестве значения 
        // следует указывать число больее чем окно конверсии.

        customDateRangeShift: 0,
        // Указываем на сколько дней от сегодняшнего мы сдвигаем выборку. 
        // Нужно для того чтобы не брать те дни когда запаздывает статистика.
        // Если хотим использовать данные о конверсиях или доходности, то в качестве значения 
        // следует указывать число равное дням в окне конверсии. 

        viewsTreshold: 3
        // Минимальный порог по поисковым запросам для создания из них ключевых слов
    }

    // -----------------------------------

    var REPORTING_OPTIONS = {
        // Comment out the following line to default to the latest reporting version.
        apiVersion: 'v201705'
    };

    ensureAccountLabels(); // Проверяем и создаем ярлыки

    var label = AdWordsApp.labels()
        .withCondition('Name = "' + CONFIG.scriptLabel + '"')
        .get()
        .next();

    var campaignPerfomaceAWQL = 'SELECT CampaignName, CampaignId ' +
        'FROM CAMPAIGN_PERFORMANCE_REPORT ' +
        'WHERE AdvertisingChannelType = SEARCH ' +
        'AND Labels CONTAINS_ANY [' + label.getId() + '] ' +
        'AND Views >= ' + CONFIG.viewsTreshold + ' ' +
        'DURING TODAY';
    var campaignPerfomaceRowsIter = AdWordsApp.report(campaignPerfomaceAWQL, REPORTING_OPTIONS).rows();
    while (campaignPerfomaceRowsIter.hasNext()) {
        var CampaignRow = campaignPerfomaceRowsIter.next(),
            CampaignName = CampaignRow['CampaignName'],
            CampaignId = CampaignRow['CampaignId'];
        if (CampaignRow) {
            var negativesListFromCampaign = getCampaignNegatives(); // Минус-слова кампании
            adGroupReport(); // Создаем ключи
        }
    }

    function getCampaignNegatives() {
        var campaignNegativeKeywordsList = [];
        var campaignIterator = AdWordsApp.campaigns()
            .withCondition('CampaignId = ' + CampaignId)
            .get();
        if (campaignIterator.hasNext()) {
            var campaign = campaignIterator.next(),
                negativeKeywordListSelector = campaign.negativeKeywordLists() // Получаем минус-слова из списков
                .withCondition('Status = ACTIVE'),
                negativeKeywordListIterator = negativeKeywordListSelector
                .get();
            while (negativeKeywordListIterator.hasNext()) {
                var negativeKeywordList = negativeKeywordListIterator.next(),
                    sharedNegativeKeywordIterator = negativeKeywordList.negativeKeywords()
                    .get(),
                    sharedNegativeKeywords = [];
                while (sharedNegativeKeywordIterator.hasNext()) {
                    var negativeKeywordFromList = sharedNegativeKeywordIterator.next();
                    sharedNegativeKeywords.push(negativeKeywordFromList.getText().toString());
                }
                campaignNegativeKeywordsList = campaignNegativeKeywordsList.concat(campaignNegativeKeywordsList, sharedNegativeKeywords);
            }
            var campaignNegativeKeywordIterator = campaign.negativeKeywords() // Получаем минус-слова из кампании
                .get();
            while (campaignNegativeKeywordIterator.hasNext()) {
                var campaignNegativeKeyword = campaignNegativeKeywordIterator.next();
                campaignNegativeKeywordsList.push(campaignNegativeKeyword.getText().toString());
            }
        }
        campaignNegativeKeywordsList = campaignNegativeKeywordsList.sort();
        return campaignNegativeKeywordsList;
    }

    function adGroupReport() {
        var adGroupPerfomanceAWQL = 'SELECT AdGroupName, AdGroupId ' +
            'FROM ADGROUP_PERFORMANCE_REPORT ' +
            'WHERE CampaignId = ' + CampaignId + ' ' +
            'AND Labels CONTAINS_ANY [' + label.getId() + '] ' +
            'AND Views >= ' + CONFIG.viewsTreshold + ' ' +
            'DURING TODAY';
        var adGroupPerfomanceRowsIter = AdWordsApp.report(adGroupPerfomanceAWQL, REPORTING_OPTIONS).rows();
        while (adGroupPerfomanceRowsIter.hasNext()) {
            var adGroupRow = adGroupPerfomanceRowsIter.next(),
                AdGroupName = adGroupRow['AdGroupName'],
                AdGroupId = adGroupRow['AdGroupId'];
            if (adGroupRow != undefined) {
                Logger.log('Campaign: ' + CampaignName + ', Ad Group: ' + AdGroupName);
                var keysForNewGroups = getQueries();
                addingKeywords(keysForNewGroups);
                Logger.log('-----------------------------------------------------------------------------------------');
            }
        }

        function getQueries() {
            var allNegativeKeywordsList = getNegativeKeywordForAdGroup(); // Все минус-слова применяемые к группе
            var report = [];
            var QueryPerfomanceAWQL = 'SELECT Query, KeywordId, KeywordTextMatchingQuery ' +
                'FROM SEARCH_QUERY_PERFORMANCE_REPORT ' +
                'WHERE CampaignId = ' + CampaignId + ' ' +
                'AND Views >= ' + CONFIG.viewsTreshold + ' ' +
                'AND QueryTargetingStatus != EXCLUDED AND QueryTargetingStatus != BOTH '
            'DURING TODAY';
            var QueryPerfomanceRowsIter = AdWordsApp.report(QueryPerfomanceAWQL, REPORTING_OPTIONS).rows();
            while (QueryPerfomanceRowsIter.hasNext()) {
                var QueryRow = QueryPerfomanceRowsIter.next(),
                    Query = QueryRow['Query'].toString().toLowerCase(),
                    KeywordId = QueryRow['KeywordId'],
                    KeywordTextMatchingQuery = QueryRow['KeywordTextMatchingQuery'].toString().toLowerCase(),
                    NewKeyword = Query.replace(/[;#\(\)\&=\+:\-\/\.]+/g, ' ').trim();
                if (QueryRow) {
                    if (AdGroupName.indexOf(NewKeyword) != -1) {
                        var queryWords = Query.replace(/[;#\(\)\&=\+:\-\/\.]+/g, ' ').trim().split(' ');
                        var keywordWords = KeywordTextMatchingQuery.replace(/[;#\(\)\&=\+:\-\/\.]+/g, ' ').trim().split(' ');
                        var diffWords = queryWords.diff(keywordWords);
                        if (diffWords.length > +0) {
                            var reason = true;
                            diffWords.forEach(function (word) {
                                allNegativeKeywordsList.forEach(function (negativeword) {
                                    if (word == negativeword) {
                                        reason = false;
                                    }
                                });
                            });
                            if (reason == true) {
                                report.push(NewKeyword);
                            }
                        }
                    } else {
                        addNegativeKeywordToAdGroup('[' + NewKeyword + ']');
                    }
                }
            }
        }

        function getNegativeKeywordForAdGroup() {
            var fullNegativeKeywordsList = [];
            var adGroupIterator = AdWordsApp.adGroups() // Получаем минус-слова из группы
                .withCondition('CampaignId = ' + CampaignId)
                .withCondition('AdGroupId = ' + AdGroupId)
                .get();
            if (adGroupIterator.hasNext()) {
                var adGroup = adGroupIterator.next(),
                    adGroupNegativeKeywordIterator = adGroup.negativeKeywords()
                    .get();
                while (adGroupNegativeKeywordIterator.hasNext()) {
                    var adGroupNegativeKeyword = adGroupNegativeKeywordIterator.next();
                    fullNegativeKeywordsList.push(adGroupNegativeKeyword.getText().toString());
                }
            }
            fullNegativeKeywordsList = fullNegativeKeywordsList.concat(fullNegativeKeywordsList, negativesListFromCampaign).sort();
            return fullNegativeKeywordsList;
        }

        function addNegativeKeywordToAdGroup(key) {
            var adGroupIterator = AdWordsApp.adGroups()
                .withCondition('AdGroupId = ' + AdGroupId)
                .get();
            if (adGroupIterator.hasNext()) {
                var adGroup = adGroupIterator.next();
                adGroup.createNegativeKeyword(key);
            }
        }
    }

    function addingKeywords(keywordsArray) {
        var newKeywordsArray = keywordsArray;
        newKeywordsArray.forEach(function (newKeyword) {
            function getAdGroupByName() {
                var adGroupIterator = AdWordsApp.adGroups()
                    .withCondition('Name = "' + newKeyword + '"')
                    .get();
                if (adGroupIterator.totalNumEntities() == +0) {
                    var campaignIterator = AdWordsApp.campaigns()
                        .withCondition('Name = "' + CampaignName + '"')
                        .get();
                    if (campaignIterator.hasNext()) {
                        var campaign = campaignIterator.next();
                        var NewAdGroup = campaign.newAdGroupBuilder()
                            .withName(newKeyword)
                            .build()
                            .getResult();
                        var newKeys = [];
                        newKeys[newKeys.length] = '+' + newKeyword.replace(/ /g, ' +');
                        newKeys[newKeys.length] = '"' + newKeyword + '"';
                        newKeys[newKeys.length] = '[' + newKeyword + ']';
                        newKeys.forEach(function (key) {
                            var keywordOperation = NewAdGroup.newKeywordBuilder()
                                .withText(key.toString())
                                .build();
                            if (keywordOperation.isSuccessful()) { // Получение результатов.
                                var keyword = keywordOperation.getResult();
                                keyword.pause();
                                keyword.applyLabel(customDateRange('now').toString());
                                keyword.applyLabel(CONFIG.scriptLabel);
                                Logger.log('Добавляем: ' + key);
                            } else {
                                var errors = keywordOperation.getErrors(); // Исправление ошибок.
                            }
                        });
                    }
                }
            }
        });
    }

    function ensureAccountLabels() {
        function getAccountLabelNames() {
            var labelNames = [],
                iterator = AdWordsApp.labels().get();
            while (iterator.hasNext()) {
                labelNames.push(iterator.next().getName());
            }
            return labelNames;
        }
        var labelNames = getAccountLabelNames();
        if (labelNames.indexOf(scriptLabel) == -1) {
            AdWordsApp.createLabel(scriptLabel);
        }
        if (labelNames.indexOf(customDateRange('now')) == -1) {
            AdWordsApp.createLabel(customDateRange('now'));
        }
        Logger.log('Ярлыки проверены, создан ярлык за ' + customDateRange('now'));
    }

    function customDateRange(select) { // Формируем значение параметра временного диапазона для выборки AWQL
        var timeType = select;
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
        if (timeType == 'now') {
            return nowformatDate;
        } else {
            return duringDates;
        }
        return duringDates;
    }

    function unique(arr) { // убираем повторы
        var tmp = {};
        return arr.filter(function (a) {
            return a in tmp ? 0 : tmp[a] = 1;
        });
    }

    Array.prototype.diff = function (a) {
        return this.filter(function (i) {
            return !(a.indexOf(i) > -1);
        });
    };
}
