function main() {

    var CONFIG = {
        SpreadsheetUrl: 'https://docs.google.com/spreadsheets/d/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/edit',
        // Таблица где в первой колонке содержится список ключевых слов для поиска
      
        SearchType: 'video', 
        // video/channel - Будем искать каналы содержащие видео, или сразу каналы?
      
        Lang: 'en' 
        // Коды языков для результатов поиска - http://www.loc.gov/standards/iso639-2/php/code_list.php
    };

    // -----------------------------------

    var Spreadsheet = SpreadsheetApp.openByUrl(CONFIG.SpreadsheetUrl),
        sheet = Spreadsheet.getSheets()[0],
        sheetName = Spreadsheet.getName();

    var keyWords = getSpreadSheedData();

    saveResult();

    function saveResult() {
        var ssNew = SpreadsheetApp.create('Youtube (' + CONFIG.SearchType + ') - ' + sheetName);
        Logger.log(ssNew.getUrl());
        Logger.log('================================================');
        Utilities.sleep(100);
        var sheetNew = ssNew.getSheets()[0];

        sheetNew.appendRow([
                    'ID',
                    'Keyword'
        ]);

        keyWords.forEach(function (keyword) {
            var arr = searchVideosByKeyword(keyword.toString());
            arr.forEach(function (line) {
                sheetNew.appendRow(line);
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
        if (CONFIG.SearchType == 'video') {
            var resultsOne = YouTube.Search.list(
                'id,snippet', {
                    'order': 'viewCount',
                    'q': key.toString().replace(/\"/g, ' ').replace(/\'/g, ' '),
                    'type': CONFIG.SearchType,
                    'maxResults': 50
                }
            );
            if (resultsOne.items[0] !== undefined) {
                for (var i in resultsOne.items) {
                    var line = [];
                    var item = resultsOne.items[i],
                        videoId = item.id.videoId.toString();
                    var results = videosListById('snippet', {
                        'id': videoId
                    });
                    if (results.items[0] !== undefined) {
                        var channelId = results.items[0].snippet.channelId;
                        if (channelId != undefined) {
                            line[0] = 'youtube.com/channel/' + channelId;
                            line[1] = key.toString().replace(/\"/g, ' ').replace(/\'/g, ' ');
                            result.push(line);
                        }
                    }
                }
            }
        }
        if (CONFIG.SearchType == 'channel') {
            var results = YouTube.Search.list(
                'id,snippet', {
                    'order': 'videoCount',
                    'q': key.toString().replace(/\"/g, ' ').replace(/\'/g, ' '),
                    'type': CONFIG.SearchType,
                    'maxResults': 50
                }
            );
            for (var i in results.items) {
                var item = results.items[i];
                var line = [];
                line[0] = 'youtube.com/channel/' + item.id.channelId.toString();
                line[1] = key.toString().replace(/\"/g, ' ').replace(/\'/g, ' ');
                result.push(line);
            }
        }
        Utilities.sleep(100);
        return result;
    }

    function videosListById(part, params) {
        var response = YouTube.Videos.list(part, params);
        return (response);
    }
}
