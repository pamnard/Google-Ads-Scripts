function main() {

    var CONFIG = {
        ScriptLabel: 'Сross_Keys'
        // Ярлык для обрабатываемых кампаний
    }
    
    //--------------------------------------------------------------
    
    var adGroupIdsList = [];
    Logger.log('Собираем все ключевые слова');
    var keywordsData = getData(); // Собираем все ключевые слова
    
    Logger.log('Выделяем минус-слова из пересекающихся');
    var negativeKeys = keysCross(keywordsData); // Выделяем минус-слова из пересекающихся
    
    Logger.log('Группируем минус-слова по группам');
    var groupedNegatives = keysByGroups(negativeKeys); // Группируем минус-слова по группам
    
    Logger.log('Исключаем минус-слова из групп');
    excludeKeys(groupedNegatives); // Исключаем минус-слова из групп

    function getData() {
        var result = [];
        var campaignSelector = AdWordsApp.campaigns()
            .withCondition('LabelNames CONTAINS_ANY ["' + CONFIG.ScriptLabel + '"]')
            .withCondition('Status = ENABLED');
        var campaignIterator = campaignSelector.get();
        while (campaignIterator.hasNext()) {
            var campaign = campaignIterator.next();
            var adGroupSelector = campaign.adGroups()
                .withCondition('AdGroupStatus = ENABLED');
            var adGroupIterator = adGroupSelector.get();
            while (adGroupIterator.hasNext()) {
                var adGroup = adGroupIterator.next();
                var adGroupId = adGroup.getId();
                adGroupIdsList.push(adGroupId);
                var keywordSelector = adGroup.keywords()
                    .withCondition('KeywordMatchType = BROAD');
                var keywordIterator = keywordSelector.get();
                while (keywordIterator.hasNext()) {
                    var keyWord = keywordIterator.next();
                    var keyWordText = keyWord.getText().toString().replace(/\+/g, '');
                    result.push({
                        adGroupId: adGroupId,
                        keyWordText: keyWordText
                    });
                }
            };
        }
        return result;
    }

    function keysCross(arr) {
        var result = [];
        arr.forEach(function (keyOne) {
            var wordsOne = keyOne.keyWordText.split(' ');
            arr.forEach(function (keyTwo) {
                var wordsTwo = keyTwo.keyWordText.split(' ');
                if (keyOne.adGroupId != keyTwo.adGroupId) {
                    if ((keyOne.keyWordText.indexOf(keyTwo.keyWordText) != -1) && (keyOne.keyWordText != keyTwo.keyWordText)) {
                        Array.prototype.diff = function (a) {
                            return this.filter(function (i) {
                                return !(a.indexOf(i) > -1);
                            });
                        };
                        var diffWords = wordsOne.diff(wordsTwo);
                        if (diffWords.length > +0) {
                            diffWords.forEach(function (negativekey) {
                                result.push({
                                    adGroupId: keyTwo.adGroupId,
                                    negativeKey: negativekey
                                });
                            });
                        }
                    }
                }
            });
        });
        result = unique(result);
        return result;
    }

    function keysByGroups(arr) {
        var result = [];
        adGroupIdsList.forEach(function (id) {
            var tmp = {
                adGroupId: id,
                negativeKeys: []
            }
            arr.forEach(function (line) {
                if (line.adGroupId == id) {
                    tmp.negativeKeys.push(line.negativeKey)
                }
            });
            result.push(tmp);
        });
        return result;
    }

    function excludeKeys(arr) {
        arr.forEach(function (line) {
            var adGroupSelector = AdWordsApp.adGroups()
                .withCondition('Id = ' + line.adGroupId);
            var adGroupIterator = adGroupSelector.get();
            if (adGroupIterator.hasNext()) {
                var adGroup = adGroupIterator.next();
                var campaign = adGroup.getCampaign();
                Logger.log('Кампания: ' + campaign.getName() + ', Группа объявлений: ' + adGroup.getName());
                line.negativeKeys.forEach(function(negativeKey) {
                    adGroup.createNegativeKeyword(negativeKey);
                    Logger.log('Добавлено минус-слово: ' + negativeKey);
                });
            }
            Logger.log('--------------------------------------------------------------');
        });
    }

    function unique(arr) { // убираем повторы
        var tmp = {};
        return arr.filter(function (a) {
            return a in tmp ? 0 : tmp[a] = 1;
        });
    }
}
