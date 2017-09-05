function main() {

    var REPORTING_OPTIONS = {
        // Comment out the following line to default to the latest reporting version.
        apiVersion: 'v201705'
    };

    // Ярлык которым скрипт помечает созданные слова. Его предварительно надо создать в разделе "Ярлыки\Labels".
    var scriptLabel = 'Keyword Builder';

    // Указываем количество дней для выборки
    // Если хотим использовать данные о конверсиях или доходности, то в качестве значения следует указывать число большее чем окно конверсии. 
    var customDaysInDateRange = 30;

    // Указываем на сколько дней от сегодняшнего мы сдвигаем выборку. Нужно для того чтобы не брать те дни когда запаздывает статистика.
    // Если хотим использовать данные о конверсиях или доходности, то в качестве значения следует указывать число равное дням в окне конверсии. 
    var customDateRangeShift = 0;

    // -----------------------------------

    ensureAccountLabels(); // Проверяем и создаем ярлыки
    adGroupReport(); // Создаем ключи

    function adGroupReport() {
        var adGroupPerfomanceAWQL = 'SELECT CampaignName, CampaignId, AdGroupName, AdGroupId ' +
            'FROM ADGROUP_PERFORMANCE_REPORT ' +
            'WHERE CampaignStatus = ENABLED AND AdGroupStatus = ENABLED ' + // AND CampaignName DOES_NOT_CONTAIN_IGNORE_CASE DSA AND CampaignName DOES_NOT_CONTAIN "["
            'DURING ' + customDateRange();

        var adGroupPerfomanceRowsIter = AdWordsApp.report(adGroupPerfomanceAWQL, REPORTING_OPTIONS).rows();

        while (adGroupPerfomanceRowsIter.hasNext()) {
            var keywordRow = adGroupPerfomanceRowsIter.next();
            var keywordCampaignName = keywordRow['CampaignName'];
            var keywordCampaignId = keywordRow['CampaignId'];
            var keywordAdGroupName = keywordRow['AdGroupName'];
            var keywordAdGroupId = keywordRow['AdGroupId'];

            if (keywordRow != undefined) {
                Logger.log('Campaign: ' + keywordCampaignName + ', Ad Group: ' + keywordAdGroupName);
                buildNewKeywords();
                Logger.log('-----------------------------------------------------------------------------------------');
            }
        }

        function buildNewKeywords() {
            var allNegativeKeywordsList = getNegativeKeywordForAdGroup();
            var allalredyAddedKeywords = alredyAddedKeywords();
            var keywordsToAdd = checkSearchQweries();
            var cleanKeywords = [];
            var resultList = [];

            keywordsToAdd.forEach(
                function (keyword) {
                    if (checkingAddedKeywords(keyword) != false) {
                        cleanKeywords[cleanKeywords.length] = keyword;
                    } else {
                        // Logger.log('Не добавляем дубль: ' + keyword);
                    }
                }
            );
            cleanKeywords.forEach(
                function (keyword) {
                    if (checkNegativeKeywords(keyword) != false) {
                        resultList[resultList.length] = keyword;
                    } else {
                        // Logger.log('Не добавляем блокируемое слово: ' + keyword);
                    }
                }
            );
            resultList = unique(resultList).sort();

            addingKeywords(resultList); // Добавляем новые ключевые слова

            function addingKeywords(keywordsArray) {
                var newKeywordsArray = keywordsArray;
                newKeywordsArray.forEach(
                    function (newKeyword) {
                        var adGroupIterator = AdWordsApp.adGroups()
                            .withCondition('CampaignId = ' + keywordCampaignId)
                            .withCondition('AdGroupId = ' + keywordAdGroupId)
                            .withLimit(1)
                            .get();
                        while (adGroupIterator.hasNext()) {
                            var adGroup = adGroupIterator.next();
                            var keywordOperation = adGroup.newKeywordBuilder()
                                .withText(newKeyword.toString())
                                .build();
                            if (keywordOperation.isSuccessful()) { // Получение результатов.
                                var keyword = keywordOperation.getResult();
                                keyword.pause();
                                keyword.applyLabel(customDateRange('now').toString());
                                keyword.applyLabel(scriptLabel.toString());
                                Logger.log('Добавляем: ' + newKeyword);
                            } else {
                                var errors = keywordOperation.getErrors(); // Исправление ошибок.
                            }

                        }
                    }
                );
            }

            function alredyAddedKeywords() {
                var report = [];
                var keywordIterator = AdWordsApp.keywords()
                    .withCondition('CampaignId = ' + keywordCampaignId)
                    .withCondition('AdGroupId = ' + keywordAdGroupId)
                    .withCondition('Status != REMOVED')
                    .withCondition('IsNegative = FALSE')
                    .withLimit(20000)
                    .get();
                if (keywordIterator.hasNext()) {
                    while (keywordIterator.hasNext()) {
                        var keyword = keywordIterator.next();
                        keyword = keyword.getText();
                        report[report.length] = keyword.toString();
                    }
                }
                report = unique(report).sort();
                return report;
            }

            function checkSearchQweries() {
                var report = [];
                var searchQweryPerfomanceAWQL = 'SELECT CampaignName, CampaignId, AdGroupName, AdGroupId, Query, Impressions ' +
                    'FROM SEARCH_QUERY_PERFORMANCE_REPORT ' +
                    'WHERE CampaignId = ' + keywordCampaignId + ' AND AdGroupId = ' + keywordAdGroupId + ' ' +
                    'AND Impressions >= 2 ' + // <-------------------------------------- Здесь можно отредактировать условия выборки
                    'AND QueryMatchTypeWithVariant NOT_IN [AUTO, BROAD, EXPANDED] ' +
                    'DURING ' + customDateRange();
                var searchQweryPerfomanceRowsIter = AdWordsApp.report(searchQweryPerfomanceAWQL, REPORTING_OPTIONS).rows();

                while (searchQweryPerfomanceRowsIter.hasNext()) {
                    var row = searchQweryPerfomanceRowsIter.next();
                    var CampaignName = row['CampaignName'];
                    var CampaignId = row['CampaignId'];
                    var AdGroupName = row['AdGroupName'];
                    var AdGroupId = row['AdGroupId'];
                    var Query = row['Query'].toString().toLowerCase();
                    var Impressions = row['Impressions'];

                    var newKeyword = '+' + Query.replace(/ /ig, ' +');
                    var newKeywordPhrase = '"' + Query + '"';
                    var newKeywordExact = '[' + Query + ']';

                    // Ниже можно изменить параметры добавления новых фраз

                    if (Impressions >= 2) {
                        report[report.length] = newKeyword;
                    }
                    if (Impressions >= 4) {
                        report[report.length] = newKeywordPhrase;
                    }
                    if (Impressions >= 8) {
                        report[report.length] = newKeywordExact;
                    }
                }
                report = report.sort();
                return report;
            }

            function getNegativeKeywordForAdGroup() {
                var fullNegativeKeywordsList = [];
                var campaignIterator = AdWordsApp.campaigns()
                    .withCondition('CampaignId = ' + keywordCampaignId)
                    .withLimit(1)
                    .get();
                if (campaignIterator.hasNext()) {
                    var campaign = campaignIterator.next();
                    var negativeKeywordListSelector = campaign.negativeKeywordLists() // Получаем минус-слова из списков
                        .withCondition('Status = ACTIVE');
                    var negativeKeywordListIterator = negativeKeywordListSelector
                        .get();
                    while (negativeKeywordListIterator.hasNext()) {
                        var negativeKeywordList = negativeKeywordListIterator.next();
                        var sharedNegativeKeywordIterator = negativeKeywordList.negativeKeywords()
                            .get();
                        var sharedNegativeKeywords = [];
                        while (sharedNegativeKeywordIterator.hasNext()) {
                            var negativeKeywordFromList = sharedNegativeKeywordIterator.next();
                            sharedNegativeKeywords[sharedNegativeKeywords.length] = negativeKeywordFromList.getText();
                        }
                        fullNegativeKeywordsList = fullNegativeKeywordsList.concat(fullNegativeKeywordsList, sharedNegativeKeywords);
                    }
                    var campaignNegativeKeywordIterator = campaign.negativeKeywords() // Получаем минус-слова из кампании
                        .get();
                    while (campaignNegativeKeywordIterator.hasNext()) {
                        var campaignNegativeKeyword = campaignNegativeKeywordIterator.next();
                        fullNegativeKeywordsList[fullNegativeKeywordsList.length] = campaignNegativeKeyword.getText();
                    }
                    var adGroupIterator = AdWordsApp.adGroups() // Получаем минус-слова из группы
                        .withCondition('CampaignId = ' + keywordCampaignId)
                        .withCondition('AdGroupId = ' + keywordAdGroupId)
                        .withLimit(1)
                        .get();
                    if (adGroupIterator.hasNext()) {
                        var adGroup = adGroupIterator.next();
                        var adGroupNegativeKeywordIterator = adGroup.negativeKeywords()
                            .get();
                        while (adGroupNegativeKeywordIterator.hasNext()) {
                            var adGroupNegativeKeyword = adGroupNegativeKeywordIterator.next();
                            fullNegativeKeywordsList[fullNegativeKeywordsList.length] = adGroupNegativeKeyword.getText();
                        }
                    }
                }
                fullNegativeKeywordsList = fullNegativeKeywordsList.sort();
                return fullNegativeKeywordsList;
            }

            function checkingAddedKeywords(keywordForCheck) {
                var newkeyword = keywordForCheck;
                var result = true;

                function checkResult(check) {
                    if (check != true) {
                        result = false;
                    }
                }
                allalredyAddedKeywords.forEach(
                    function (addedkeyword) {
                        if (newkeyword == addedkeyword) {
                            checkResult(false);
                        }
                    }
                );
                return result;
            }

            function checkNegativeKeywords(keywordForCheck) {
                function checkingNegativeKeywords() {
                    var result = true;

                    function checkResult(check) {
                        if (check != true) {
                            result = false;
                        }
                    }
                    allNegativeKeywordsList.forEach(
                        function (negativeKeyword) {
                            var clearedNegativeKeyword = negativeKeyword.toString().toLowerCase().replace(/\+/g, '').replace(/\"/g, '');
                            if ((keywordForCheck.indexOf('[') != -1) || (keywordForCheck.indexOf('"') != -1)) { // минус-фраза с точным или фразовым соответствием
                                if (negativeKeyword == keywordForCheck) {
                                    checkResult(false);
                                    // Logger.log('(1) Фраза: ' + keywordForCheck + ' Минус-фраза: ' + negativeKeyword);
                                } else if (negativeKeyword.toString().indexOf('[') == -1) {
                                    if (clearedNegativeKeyword.indexOf(' ') != -1) {
                                        if (keywordForCheck.indexOf(clearedNegativeKeyword) != -1) {
                                            // очищеная минус-фраза есть в ключевой фразе, но минус-фраза не в точном и не в широком соответствии
                                            checkResult(false);
                                            // Logger.log('(2) Фраза: ' + keywordForCheck + ' Минус-фраза: ' + negativeKeyword);
                                        }
                                    } else {
                                        var words = [];
                                        words = keywordForCheck.toLowerCase().replace(/\+/g, '').replace(/\"/g, '').replace(/\[/g, '').replace(/\]/g, '').split(' '); // разбиваем ключевую фразу на слова
                                        // Logger.log(words);
                                        words.forEach(
                                            function (word) {
                                                if (negativeKeyword == word) { // проверяем совпадение минус-фразы(слова), со словами в ключевой фразе
                                                    checkResult(false);
                                                    // Logger.log('(3) Фраза: ' + keywordForCheck + ' Минус-фраза: ' + negativeKeyword);
                                                }
                                            }
                                        );
                                    }
                                }
                            } else { // минус-фраза с широким соответствием
                                if (negativeKeyword.toString().indexOf(' ') != -1) {
                                    var negativeWords = [];
                                    negativeWords = negativeKeyword.toLowerCase().replace(/\+/g, '').replace(/\"/g, '').replace(/\[/g, '').replace(/\]/g, '').split(' ');
                                    var words = [];
                                    words = keywordForCheck.toLowerCase().replace(/\+/g, '').replace(/\"/g, '').replace(/\[/g, '').replace(/\]/g, '').split(' '); // разбиваем ключевую фразу на слова
                                    // Logger.log(words);
                                    Array.prototype.diff = function (a) {
                                        return this.filter(function (i) {
                                            return !(a.indexOf(i) > -1);
                                        });
                                    };
                                    var diffWords = negativeWords.diff(words);
                                    if (diffWords.length == 0) {
                                        checkResult(false);
                                        // Logger.log('(4) Фраза: ' + keywordForCheck + ' Минус-фраза: ' + negativeKeyword);
                                    }
                                } else {
                                    var words = [];
                                    words = keywordForCheck.toLowerCase().replace(/\+/g, '').replace(/\"/g, '').replace(/\[/g, '').replace(/\]/g, '').split(' '); // разбиваем ключевую фразу на слова
                                    // Logger.log(words);
                                    words.forEach(
                                        function (word) {
                                            if (negativeKeyword == word) { // проверяем совпадение минус-фразы(слова), со словами в ключевой фразе
                                                checkResult(false);
                                                // Logger.log('(5) Фраза: ' + keywordForCheck + ' Минус-фраза: ' + negativeKeyword);
                                            }
                                        }
                                    );
                                }
                            }
                        }
                    );
                    return result;
                }
                return checkingNegativeKeywords();
            }
        }
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
}
