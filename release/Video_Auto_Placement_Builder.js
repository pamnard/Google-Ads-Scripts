function main() {

    var CONFIG = {
        SpreadsheetUrl: 'https://docs.google.com/spreadsheets/d/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/edit',
        // Таблица где в первой колонке содержится список ключевых слов для поиска

        Lang: ['en', 'ru'],
        // Коды языков для результатов поиска - язык инерфейса Ютуба - http://www.loc.gov/standards/iso639-2/php/code_list.php
        
        TargetLabel: 'YT_PlacementBuilder'
        // Этим ярлыком надо пометить целевую видео-кампанию и группу объявлений в ней
    };

    // -----------------------------------

    var Spreadsheet = SpreadsheetApp.openByUrl(CONFIG.SpreadsheetUrl),
        sheet = Spreadsheet.getSheets()[0],
        sheetName = Spreadsheet.getName();

    var keyWords = getSpreadSheedData(); // Получили исходные ключи

    saveResult(); // Запросили Ютуб и записали результат

    function saveResult() {
        keyWords.forEach(function (keyword) {
            Logger.log(keyword);
            var arr = searchVideosByKeyword(keyword[0].toString());
            arr.forEach(function (id) {
                addChannelPlacement(id);
            })
        });
    }

    function getSpreadSheedData() {
        var range = sheet.getDataRange(),
            numRows = range.getNumRows().toFixed(),
            numColumns = range.getNumColumns().toFixed(),
            rangeWithData = sheet.getRange(1, 1, numRows, numColumns),
            dataValues = rangeWithData.getValues();
        return dataValues;
    }

    function searchVideosByKeyword(key) {
        var result = [];
        CONFIG.Lang.forEach(function (lang) {
            var videoResults = YouTube.Search.list(
                'id, snippet', {
                    'order': 'viewCount',
                    'q': key.toString().replace(/\"/g, ' ').replace(/\'/g, ' '),
                    'relevanceLanguage': lang,
                    'type': 'video',
                    'maxResults': 50
                }
            );
            if (videoResults.items[0] !== undefined) {
                for (var i in videoResults.items) {
                    var line = [];
                    var item = videoResults.items[i];
                    var videoId = item.id.videoId.toString();
                    var results = videosListById('snippet', {
                        'id': videoId
                    });
                    if (results.items[0] !== undefined) {
                        var channelId = results.items[0].snippet.channelId;
                        if (channelId != undefined) {
                            var id = channelId;
                            result.push(id);
                        //  Logger.log(id);
                        }
                    }
                }
            }
            var channelResults = YouTube.Search.list(
                'id,snippet', {
                    'order': 'videoCount',
                    'q': key.toString().replace(/\"/g, ' ').replace(/\'/g, ' '),
                    'relevanceLanguage': lang,
                    'type': 'channel',
                    'maxResults': 50
                }
            );
            if (channelResults.items[0] !== undefined) {
                for (var i in channelResults.items) {
                    var item = channelResults.items[i];
                    var id = item.id.channelId.toString();
                    result.push(id);
                   // Logger.log(id);
                }
            }
        });
        result = unique(result);
        return result;
    }

    function videosListById(part, params) {
        var response = YouTube.Videos.list(part, params);
        return (response);
    }

    function addChannelPlacement(channelId) {
        var videoCampaignSelector = AdWordsApp.videoCampaigns()
            .withCondition('LabelNames CONTAINS_ANY [' + CONFIG.TargetLabel + ']');
        var videoCampaignIterator = videoCampaignSelector.get();
        if (videoCampaignIterator.totalNumEntities() == +1) {
            while (videoCampaignIterator.hasNext()) {
                var videoCampaign = videoCampaignIterator.next();
                var videoNetwork = videoCampaign.getNetworks();
            //  Logger.log(videoNetwork);
                if (videoNetwork == 'YOUTUBE_VIDEO') {
                    var videoAdGroupSelector = videoCampaign.videoAdGroups()
                        .withCondition('LabelNames CONTAINS_ANY [' + CONFIG.TargetLabel + ']');
                    var videoAdGroupIterator = videoAdGroupSelector.get();
                    if (videoAdGroupIterator.totalNumEntities() == +1) {
                        while (videoAdGroupIterator.hasNext()) {
                            var videoAdGroup = videoAdGroupIterator.next();
                            var videoYouTubeChannelBuilder = videoAdGroup.videoTargeting().newYouTubeChannelBuilder();
                            var videoYouTubeChannelOperation = videoYouTubeChannelBuilder
                                .withChannelId(channelId) // required
                                .build(); // create the YouTube channel
                        }
                    }
                }
            }
        }
    }

    function unique(arr) { // убираем повторы
        var tmp = {};
        return arr.filter(function (a) {
            return a in tmp ? 0 : tmp[a] = 1;
        });
    }
}
