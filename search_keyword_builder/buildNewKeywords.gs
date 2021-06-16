function buildNewKeywords(ad_group_id, campaign_id) {

    var allNegativeKeywordsList = getNegativeKeywordForAdGroup(), // Минус-слова собранные со всех уровней (группа, кампания, списки)
        google_ads_queries = getSearchQweries(), // поисковые запросы по данным Google Ads
        google_analytics_queries = getGaReport(AdWordsApp.currentAccount().getCustomerId().replace(/\-/gm, ''), CONFIG().gaProfileId); // поисковые запросы по данным Google Aanalytics

    var full_queries_list = google_ads_queries.concat(google_analytics_queries);
    full_queries_list = unique(full_queries_list).sort();
  
    addingKeywords(full_queries_list); // Добавляем новые ключевые слова

    function addingKeywords(arr) {
        var adGroupIterator = AdWordsApp.adGroups()
            .withCondition('CampaignId = ' + campaign_id)
            .withCondition('AdGroupId = ' + ad_group_id)
            .get();
        while (adGroupIterator.hasNext()) {
            var adGroup = adGroupIterator.next();
            for (var k = 0; k < arr.length; k++) {
                if (checkNegativeKeywords(arr[k]) != false) { // проверяем пересечение с минус-словами
                    var match_types = CONFIG().targetMatchType;
                    for (var m = 0; m < match_types.length; m++) {
                        if (match_types[m] == 'BROAD') { 
                            var new_key = '+' + arr[k].replace(/ /gm, ' +');
                        }
                        if (match_types[m] == 'PHRASE') { 
                            var new_key = '"' + arr[k] + '"';
                        }
                        if (match_types[m] == 'EXACT') { 
                            var new_key = '[' + arr[k] + ']';
                        }
                        var keywordOperation = adGroup.newKeywordBuilder()
                            .withText(new_key)
                            .build();
                        if (keywordOperation.isSuccessful()) { // Получение результатов.
                            var keyword = keywordOperation.getResult();
                            var stats = keyword.getStatsFor('LAST_30_DAYS');
                            if (stats.getImpressions() == +0) { // если по добавленному ключевому слову вернулись показы, значит оно склеилось с существующим ключём
                                keyword.pause();
                                keyword.applyLabel(customDateRange('now').toString());
                                keyword.applyLabel(CONFIG().scriptLabel);
                                Logger.log('Добавили: ' + new_key.toString());
                            }
                        } else {
                            var errors = keywordOperation.getErrors(); // Исправление ошибок.
                        }
                    }
                }
            }
        }
    }

    function getSearchQweries() {
        var report = [];
        var search_term_query = 'SELECT ' + 
            'search_term_view.search_term, ' +
            'metrics.impressions ' +
            'FROM search_term_view ' + 
            'WHERE search_term_view.status NOT IN ("ADDED", "ADDED_EXCLUDED", "EXCLUDED") ' +
            'AND campaign.id = ' + campaign_id + ' ' +
            'AND ad_group.id = ' + ad_group_id + ' ' +
            'AND metrics.impressions >= ' + CONFIG().customDaysInDateRange + ' ' +
            'AND segments.date BETWEEN "' + customDateRange('from') + '" AND "' + customDateRange('to') + '"';
        var search_term_result = AdsApp.search(search_term_query, {
            apiVersion: 'v8'
        });
        while (search_term_result.hasNext()) {
            var search_term_row = search_term_result.next();
            var search_term = search_term_row.searchTermView.searchTerm.toLowerCase().trim();
            var impressions = search_term_row.metrics.impressions;
            if (search_term.split(' ').length <= 7) {
                report.push(search_term);
            }
        }
        report = unique(report).sort();
        return report;
    }

    function getGaReport(id, profile_id) {
        var report = [];
        var today = new Date(),
            start_date = new Date(today.getTime() - (CONFIG().customDaysInDateRange + CONFIG().customDateRangeShift) * 24 * 60 * 60 * 1000),
            end_date = new Date(today.getTime() - CONFIG().customDateRangeShift * 24 * 60 * 60 * 1000),
            start_formatted_date = Utilities.formatDate(start_date, 'UTC', 'yyyy-MM-dd'),
            end_formatted_date = Utilities.formatDate(end_date, 'UTC', 'yyyy-MM-dd');
        var table_id = 'ga:' + profile_id;
        var metric = 'ga:impressions';
        var options = {
            'samplingLevel': 'HIGHER_PRECISION',
            'dimensions': 'ga:keyword,ga:adMatchedQuery',
            'sort': '-ga:impressions',
            'filters': 'ga:adwordsCustomerID==' + id + ';ga:adKeywordMatchType!=Exact;ga:impressions>' + CONFIG().customDaysInDateRange + ';ga:adwordsAdGroupID==' + ad_group_id + ';ga:adwordsCampaignID==' + campaign_id,
            'max-results': 10000
        };
        var ga_report = Analytics.Data.Ga.get(table_id, start_formatted_date, end_formatted_date, metric, options);
        if (ga_report.rows) {
            for (var i = 0; i < ga_report.rows.length; i++) {
                var ga_row = ga_report.rows[i];
                var keyword = ga_row[0].replace(/\+/gm, '').toLowerCase().trim(),
                    ad_matched_query = ga_row[1].toLowerCase().trim();
                if (keyword != ad_matched_query) {
                    if (ad_matched_query.split(' ').length <= 7) {
                        report.push(ad_matched_query);
                    }
                }
            }
        } else {
            Logger.log('No rows returned.');
        }
        report = unique(report).sort();
        return report;
    }
  
    function getNegativeKeywordForAdGroup() { // Получаем минус-слова из группы
        var fullNegativeKeywordsList = [];

        var adGroupIterator = AdWordsApp.adGroups() 
            .withCondition('CampaignId = ' + campaign_id)
            .withCondition('AdGroupId = ' + ad_group_id)
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
        var negativesListFromCampaign = getCampaignNegatives(campaign_id);
        fullNegativeKeywordsList = fullNegativeKeywordsList.concat(fullNegativeKeywordsList, negativesListFromCampaign).sort();
      
        return fullNegativeKeywordsList;
      
        function getCampaignNegatives(campaign_id) { // Получаем минус-слова из кампании
            var campaignNegativeKeywordsList = [];
            var campaignIterator = AdWordsApp.campaigns()
                .withCondition('CampaignId = ' + campaign_id)
                .get();
            if (campaignIterator.hasNext()) {
                var campaign = campaignIterator.next();
                var negativeKeywordListSelector = campaign.negativeKeywordLists() // Получаем минус-слова из списков
                    .withCondition('Status = ACTIVE');
                var negativeKeywordListIterator = negativeKeywordListSelector.get();
                while (negativeKeywordListIterator.hasNext()) {
                    var negativeKeywordList = negativeKeywordListIterator.next();
                    var sharedNegativeKeywordIterator = negativeKeywordList.negativeKeywords().get();
                    var sharedNegativeKeywords = [];
                    while (sharedNegativeKeywordIterator.hasNext()) {
                        var negativeKeywordFromList = sharedNegativeKeywordIterator.next();
                        sharedNegativeKeywords[sharedNegativeKeywords.length] = negativeKeywordFromList.getText();
                    }
                    campaignNegativeKeywordsList = campaignNegativeKeywordsList.concat(campaignNegativeKeywordsList, sharedNegativeKeywords);
                }
                var campaignNegativeKeywordIterator = campaign.negativeKeywords().get();
                while (campaignNegativeKeywordIterator.hasNext()) {
                    var campaignNegativeKeyword = campaignNegativeKeywordIterator.next();
                    campaignNegativeKeywordsList[campaignNegativeKeywordsList.length] = campaignNegativeKeyword.getText();
                }
            }
            campaignNegativeKeywordsList = campaignNegativeKeywordsList.sort();
            return campaignNegativeKeywordsList;
        }
    }

    function checkNegativeKeywords(keywordForCheck) { // это какой-то древний кусок, не буду его трогать
        function checkingNegativeKeywords() {
            var result = true;

            function checkResult(check) {
                if (check != true) {
                    result = false;
                }
            }
            allNegativeKeywordsList.forEach(
                function (negativeKeyword) {
                    var negativeWord = negativeKeyword.toString().toLowerCase();
                    var clearedNegativeKeyword = negativeWord.replace(/\+/g, '').replace(/\"/g, '');
                    if ((keywordForCheck.indexOf('[') != -1) || (keywordForCheck.indexOf('"') != -1)) { // минус-фраза с точным или фразовым соответствием
                        if (negativeWord == keywordForCheck) {
                            checkResult(false);
                            // Logger.log('(1) Фраза: ' + keywordForCheck + ' Минус-фраза: ' + negativeWord);
                        } else if (negativeWord.indexOf('[') == -1) {
                            if (clearedNegativeKeyword.indexOf(' ') != -1) {
                                if (keywordForCheck.indexOf(clearedNegativeKeyword) != -1) {
                                    // очищеная минус-фраза есть в ключевой фразе, но минус-фраза не в точном и не в широком соответствии
                                    checkResult(false);
                                    // Logger.log('(2) Фраза: ' + keywordForCheck + ' Минус-фраза: ' + negativeWord);
                                }
                            } else {
                                var words = [];
                                words = keywordForCheck.toLowerCase().replace(/\+/g, '').replace(/\"/g, '').replace(/\[/g, '').replace(/\]/g, '').split(' '); // разбиваем ключевую фразу на слова
                                // Logger.log(words);
                                words.forEach(
                                    function (word) {
                                        if (negativeWord == word) { // проверяем совпадение минус-фразы(слова), со словами в ключевой фразе
                                            checkResult(false);
                                            // Logger.log('(3) Фраза: ' + keywordForCheck + ' Минус-фраза: ' + negativeWord);
                                        }
                                    }
                                );
                            }
                        }
                    } else { // минус-фраза с широким соответствием
                        if (negativeWord.indexOf(' ') != -1) {
                            var negativeWords = [];
                            negativeWords = negativeWord.replace(/\+/g, '').replace(/\"/g, '').replace(/\[/g, '').replace(/\]/g, '').split(' ');
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
                                // Logger.log('(4) Фраза: ' + keywordForCheck + ' Минус-фраза: ' + negativeWord);
                            }
                        } else {
                            var words = [];
                            words = keywordForCheck.toLowerCase().replace(/\+/g, '').replace(/\"/g, '').replace(/\[/g, '').replace(/\]/g, '').split(' '); // разбиваем ключевую фразу на слова
                            // Logger.log(words);
                            words.forEach(
                                function (word) {
                                    if (negativeWord == word) { // проверяем совпадение минус-фразы(слова), со словами в ключевой фразе
                                        checkResult(false);
                                        // Logger.log('(5) Фраза: ' + keywordForCheck + ' Минус-фраза: ' + negativeWord);
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
