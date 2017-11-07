function main() {

    var CONFIG = {
        SpreadsheetUrl: 'https://docs.google.com/spreadsheets/d/XXXXXXXXXXXXXXXXXXXXXXXXXXXX/edit',
        SearchType: 'video', // video/channel - что ищем
        Lang: 'ur' // http://www.loc.gov/standards/iso639-2/php/code_list.php
    };

    // -----------------------------------

    var Spreadsheet = SpreadsheetApp.openByUrl(CONFIG.SpreadsheetUrl);
    var sheet = Spreadsheet.getSheets()[0];
    var sheetName = Spreadsheet.getName();

    var keyWords = getSpreadSheedData();

    saveResult();

    function saveResult() {
        var ssNew = SpreadsheetApp.create('Youtube (' + CONFIG.SearchType + ') - ' + sheetName);
        Logger.log(ssNew.getUrl());
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
        var range = sheet.getDataRange();
        var numRows = range.getNumRows().toFixed();
        var numColumns = range.getNumColumns().toFixed();
        var rangeWithData = sheet.getRange(1, 1, numRows, numColumns);
        var dataValues = rangeWithData.getValues();
        return dataValues;
    }

    function searchVideosByKeyword(key) {
        var result = [];
        if (CONFIG.SearchType == 'video') {
            var results = YouTube.Search.list(
                'id,snippet', {
                    'order': 'viewCount',
                    'q': key.toString().replace(/\"/g, ' ').replace(/\'/g, ' '),
                    'type': CONFIG.SearchType,
                    'maxResults': 50
                }
            );
            for (var i in results.items) {
                var item = results.items[i];
                var line = [];
                line[0] = 'youtube.com/video/' + item.id.videoId.toString();
                line[1] = key.toString().replace(/\"/g, ' ').replace(/\'/g, ' ');
                result.push(line);
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
}
