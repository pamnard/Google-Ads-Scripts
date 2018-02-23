function main() {

    var CONFIG = {
        scriptLabel: 'SKAG',
        // Ярлык которым скрипт помечает созданные слова

        customDaysInDateRange: 4,
        // Указываем количество дней для выборки
        // Если хотим использовать данные о конверсиях или доходности, то в качестве значения 
        // следует указывать число больее чем окно конверсии.

        customDateRangeShift: 0,
        // Указываем на сколько дней от сегодняшнего мы сдвигаем выборку. 
        // Нужно для того чтобы не брать те дни когда запаздывает статистика.
        // Если хотим использовать данные о конверсиях или доходности, то в качестве значения 
        // следует указывать число равное дням в окне конверсии. 

        ImpressionsTreshold: 4,
        // Минимальный порог по поисковым запросам для создания из них ключевых слов

        REPORTING_OPTIONS: {
            // Comment out the following line to default to the latest reporting version.
            apiVersion: 'v201708'
        }
    }

    // -----------------------------------

    ensureAccountLabels(); // Проверяем и создаем ярлыки

    var label = AdWordsApp.labels()
        .withCondition('Name = "' + CONFIG.scriptLabel + '"')
        .get()
        .next();

    var campaignPerfomaceAWQL = 'SELECT CampaignName, CampaignId ' +
        'FROM CAMPAIGN_PERFORMANCE_REPORT ' +
        'WHERE AdvertisingChannelType = SEARCH ' +
        'AND Labels CONTAINS_ANY [' + label.getId() + '] ' +
        'AND Impressions >= ' + CONFIG.ImpressionsTreshold + ' ' +
        'DURING ' + customDateRange();
    var campaignPerfomaceRowsIter = AdWordsApp.report(campaignPerfomaceAWQL, CONFIG.REPORTING_OPTIONS).rows();
    while (campaignPerfomaceRowsIter.hasNext()) {
        var CampaignRow = campaignPerfomaceRowsIter.next(),
            CampaignName = CampaignRow['CampaignName'],
            CampaignId = CampaignRow['CampaignId'];
        if (CampaignRow) {
            Logger.log(CampaignName);
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
            'AND Impressions >= ' + CONFIG.ImpressionsTreshold + ' ' +
            'DURING ' + customDateRange();
        var adGroupPerfomanceRowsIter = AdWordsApp.report(adGroupPerfomanceAWQL, CONFIG.REPORTING_OPTIONS).rows();
        while (adGroupPerfomanceRowsIter.hasNext()) {
            var adGroupRow = adGroupPerfomanceRowsIter.next(),
                AdGroupName = adGroupRow['AdGroupName'],
                AdGroupId = adGroupRow['AdGroupId'];
            if (adGroupRow != undefined) {
                Logger.log('Campaign: ' + CampaignName + ', Ad Group: ' + AdGroupName);
                var Ads = getExpandedTextAdsInAdGroup();
                var keysForNewGroups = getQueries();
                addingKeywords(keysForNewGroups, Ads);
                Logger.log('-----------------------------------------------------------------------------------------');
            }
        }

        function getQueries() {
            var report = [];
            var allNegativeKeywordsList = getNegativeKeywordForAdGroup(); // Все минус-слова применяемые к группе
            var keyStats = [];
            var QueryPerfomanceAWQL = 'SELECT Query, KeywordId, KeywordTextMatchingQuery, Impressions ' +
                'FROM SEARCH_QUERY_PERFORMANCE_REPORT ' +
                'WHERE CampaignId = ' + CampaignId + ' AND AdGroupId = ' + AdGroupId + ' ' +
                'AND QueryTargetingStatus != EXCLUDED AND QueryTargetingStatus != BOTH '
            'DURING ' + customDateRange();
            var QueryPerfomanceRowsIter = AdWordsApp.report(QueryPerfomanceAWQL, CONFIG.REPORTING_OPTIONS).rows();
            while (QueryPerfomanceRowsIter.hasNext()) {
                var QueryRow = QueryPerfomanceRowsIter.next(),
                    Query = QueryRow['Query'].toString().toLowerCase(),
                    KeywordId = QueryRow['KeywordId'],
                    KeywordTextMatchingQuery = QueryRow['KeywordTextMatchingQuery'].toString().toLowerCase().replace(/["\[\]\+]+/g, ''),
                    Impressions = parseFloat(QueryRow['Impressions']).toFixed(),
                    NewKeyword = Query.replace(/[";#\(\)\&=\+:\-\/\.\*]+/g, ' ').trim();
                // Logger.log('KeywordTextMatchingQuery = ' + KeywordTextMatchingQuery + ', Query = ' + Query + ', Impressions - ' + Impressions);
                if (QueryRow) {
                    if (NewKeyword.indexOf(AdGroupName) != -1) {
                        var queryWords = Query.replace(/[";#\(\)\&=\+:\-\/\.\*]+/g, ' ').trim().split(' ');
                        var keywordWords = KeywordTextMatchingQuery.replace(/[";#\(\)\&=\+:\-\/\.\*]+/g, ' ').trim().split(' ');
                        Array.prototype.diff = function (a) {
                            return this.filter(function (i) {
                                return !(a.indexOf(i) > -1);
                            });
                        };
                        var diffWords = queryWords.diff(keywordWords);
                        if (diffWords.length > +0) {
                            if (Impressions >= CONFIG.ImpressionsTreshold) {
                                // Logger.log(diffWords.toString());
                                if (diffWords.length == +1) {
                                    var word = diffWords.toString();
                                    var reason = true;
                                    allNegativeKeywordsList.forEach(function (negativeword) {
                                        if (word == negativeword) {
                                            reason = false;
                                        }
                                    });
                                    if (reason != false) {
                                        report.push(AdGroupName + ' ' + word);
                                        report.push(word + ' ' + AdGroupName);
                                        // Logger.log(NewKeyword);
                                        addNegativeKeywordToAdGroup(word);
                                        addNegativeKeywordToAdGroup('[' + AdGroupName + ' ' + word + ']');
                                        addNegativeKeywordToAdGroup('[' + word + ' ' + AdGroupName + ']');
                                    }
                                } else {
                                    // var word = diffWords.toString().replace(/,/g, ' ').trim();
                                    report.push(NewKeyword);
                                    addNegativeKeywordToAdGroup('"' + NewKeyword + '"');
                                }
                            }
                            if (keyStats.length == +0) {
                                diffWords.forEach(function (word) {
                                    var line = {
                                        key: word,
                                        stats: Impressions
                                    }
                                    keyStats.push(line);
                                });
                            } else {
                                diffWords.forEach(function (word) {
                                    var isInclude = false;
                                    keyStats.forEach(function (line) {
                                        // Logger.log(line.key + ' - ' + line.stats);
                                        if (line.key == word) {
                                            isInclude = true;
                                            line.stats = +line.stats + +Impressions;
                                        }
                                    });
                                    if (isInclude != true) {
                                        var line = {
                                            key: word,
                                            stats: Impressions
                                        }
                                        keyStats.push(line);
                                    }
                                });

                            }
                        }
                    } else {
                        addNegativeKeywordToAdGroup('[' + NewKeyword + ']');
                    }
                }
            }
            keyStats.forEach(function (line) {
                if (line.stats >= CONFIG.ImpressionsTreshold) {
                    report.push(AdGroupName + ' ' + line.key);
                    report.push(line.key + ' ' + AdGroupName);
                    addNegativeKeywordToAdGroup(line.key);
                    addNegativeKeywordToAdGroup('[' + AdGroupName + ' ' + line.key + ']');
                    addNegativeKeywordToAdGroup('[' + line.key + ' ' + AdGroupName + ']');
                }
            });
            report = unique(report).sort();
            return report;
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

        function getExpandedTextAdsInAdGroup() {
            var report = [];
            var adGroupIterator = AdWordsApp.adGroups()
                .withCondition('Name = "' + AdGroupName + '"')
                .get();
            if (adGroupIterator.hasNext()) {
                var adGroup = adGroupIterator.next();
                var adsIterator = adGroup.ads()
                    .withCondition('Type=EXPANDED_TEXT_AD')
                    .get();
                while (adsIterator.hasNext()) {
                    var ad = adsIterator.next().asType().expandedTextAd(),
                        headlinePart1 = ad.getHeadlinePart1(),
                        headlinePart2 = ad.getHeadlinePart2(),
                        description = ad.getDescription(),
                        path1 = ad.getPath1(),
                        path2 = ad.getPath2(),
                        finalUrl = ad.urls().getFinalUrl();
                    var newAd = {
                        HeadlinePart1: headlinePart1,
                        HeadlinePart2: headlinePart2,
                        Description: description,
                        Path1: path1,
                        Path2: path2,
                        FinalUrl: finalUrl
                    };
                    report.push(newAd);
                }
            }
            return report;
        }

        function addingKeywords(keywordsArray, adsArray) {
            var newKeywordsArray = keywordsArray;
            newKeywordsArray.forEach(function (newKeyword) {
                var adGroupIterator = AdWordsApp.adGroups()
                    .withCondition('CampaignName = "' + CampaignName + '"')
                    .withCondition('Name = "' + newKeyword + '"')
                    .get();
                if (adGroupIterator.totalNumEntities() == +0) {
                    Logger.log(newKeyword);
                    var campaignIterator = AdWordsApp.campaigns()
                        .withCondition('Name = "' + CampaignName + '"')
                        .get();
                    if (campaignIterator.hasNext()) {
                        var campaign = campaignIterator.next();
                        var AdGroupOperation = campaign.newAdGroupBuilder()
                            .withName(newKeyword.toString())
                            .build();
                        if (AdGroupOperation.isSuccessful()) { // Получение результатов.
                            var adGroup = AdGroupOperation.getResult();
                            Logger.log('Создана группа - ' + adGroup.getName());
                            adGroup.applyLabel(CONFIG.scriptLabel);
                            var newKeys = [];
                            newKeys[newKeys.length] = '+' + newKeyword.toString().replace(/ /g, ' +');
                            newKeys[newKeys.length] = '"' + newKeyword.toString() + '"';
                            newKeys[newKeys.length] = '[' + newKeyword.toString() + ']';
                            newKeys.forEach(function (key) {
                                var keywordOperation = adGroup.newKeywordBuilder()
                                    .withText(key.toString())
                                    .build();
                                if (keywordOperation.isSuccessful()) { // Получение результатов.
                                    var keyword = keywordOperation.getResult();
                                    Logger.log('В группу "' + adGroup.getName() + '" добавлен ключ ' + keyword.getText())
                                    // keyword.pause();
                                    keyword.applyLabel(customDateRange('now').toString());
                                    keyword.applyLabel(CONFIG.scriptLabel);
                                } else {
                                    var errors = keywordOperation.getErrors(); // Исправление ошибок.
                                }
                            });
                            if (adsArray.length < 10) {
                                Logger.log('Заливаем родительские объявления, ' + adsArray.length + ' шт.')
                                adsArray.forEach(function (ad) {
                                    adGroup.newAd().expandedTextAdBuilder()
                                        .withHeadlinePart1(ad.HeadlinePart1)
                                        .withHeadlinePart2(ad.HeadlinePart2)
                                        .withDescription(ad.Description)
                                        .withPath1(ad.Path1)
                                        .withPath2(ad.Path2)
                                        .withFinalUrl(ad.FinalUrl)
                                        .build();
                                });
                                var capitalizeKey = newKeyword.toLowerCase().replace(/\b[a-z]/g, function (letter) {
                                    return letter.toUpperCase();
                                });
                                if (capitalizeKey.length < 30) {
                                    var temp = [];
                                    adsArray.forEach(function (ad) {
                                        var path2 = ad.Path2;
                                        if (capitalizeKey.length <= 15) {
                                            path2 = capitalizeKey;
                                        }
                                        var newAdWithKey = {
                                            HeadlinePart1: capitalizeKey,
                                            HeadlinePart2: ad.HeadlinePart2,
                                            Description: ad.Description,
                                            Path1: ad.Path1,
                                            Path2: path2,
                                            FinalUrl: ad.FinalUrl
                                        }
                                        temp.push(newAdWithKey);
                                        var newAdWithMask = {
                                            HeadlinePart1: '{KeyWord:' + capitalizeKey + '}',
                                            HeadlinePart2: ad.HeadlinePart2,
                                            Description: ad.Description,
                                            Path1: ad.Path1,
                                            Path2: path2,
                                            FinalUrl: ad.FinalUrl
                                        }
                                        temp.push(newAdWithMask);
                                        if (capitalizeKey.length < 25) {
                                            var newAdWithMaskAndBrand = {
                                                HeadlinePart1: 'FBS - {KeyWord:' + capitalizeKey + '}',
                                                HeadlinePart2: ad.HeadlinePart2,
                                                Description: ad.Description,
                                                Path1: ad.Path1,
                                                Path2: path2,
                                                FinalUrl: ad.FinalUrl
                                            }
                                            temp.push(newAdWithMaskAndBrand);
                                            var newAdWithBrand = {
                                                HeadlinePart1: 'FBS - ' + capitalizeKey,
                                                HeadlinePart2: ad.HeadlinePart2,
                                                Description: ad.Description,
                                                Path1: ad.Path1,
                                                Path2: path2,
                                                FinalUrl: ad.FinalUrl
                                            }
                                            temp.push(newAdWithBrand);
                                        }
                                    });
                                    temp = unique(temp).sort();
                                    Logger.log('Заливаем созданные объявления, ' + temp.length + ' шт.')
                                    temp.forEach(function (ad) {
                                        adGroup.newAd().expandedTextAdBuilder()
                                            .withHeadlinePart1(ad.HeadlinePart1)
                                            .withHeadlinePart2(ad.HeadlinePart2)
                                            .withDescription(ad.Description)
                                            .withPath1(ad.Path1)
                                            .withPath2(ad.Path2)
                                            .withFinalUrl(ad.FinalUrl)
                                            .build();
                                    });
                                }
                            }
                        } else {
                            var errors = AdGroupOperation.getErrors(); // Исправление ошибок.
                        }
                    }
                }
            });
        }
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
        if (labelNames.indexOf(CONFIG.scriptLabel) == -1) {
            AdWordsApp.createLabel(CONFIG.scriptLabel);
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
}
