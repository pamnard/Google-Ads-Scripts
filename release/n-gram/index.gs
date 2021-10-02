function main() {

    Logger.log(getCurrentAccountDetails() + ' - Start');

    var activeCampaignIds = getActiveCampaignIds(),
        negativesByGroup = getNegativesByGroups(activeCampaignIds), // Собираем минус-слова на уровне групп
        negativesByCampaign = getNegativesByCampaign(activeCampaignIds), // Собираем минус-слова на уровне кампаний
        searchTermStats = getSearchTermStats(), // Собираем данные по поисковым фразам
        reportData = calcStats(searchTermStats); // Рассчитывем финальный отчёт

    var SS = SpreadsheetApp.openById(CONFIG().sheetID),
        spreadsheetUrl = SS.getUrl();

    for (var level in reportData) {
        var sheet = SS.getSheetByName(level);
        if (sheet == null) {
            sheet = SS.insertSheet(level);
        }
        sheet.clear();
        sheet.clearConditionalFormatRules();
        if (sheet.getFilter() != null) {
            sheet.getFilter().remove();
        }      
        if (level == 'account') {
            sheet.appendRow([
                'Phrase',
                'N-count',
                'Impressions',
                'Clicks',
                'Ctr',
                'Cost',
                'CPC',
                'Conversions',
                'Conv. Rate',
                'Conv. Cost',
                'Conv. Value',
                'Conv. Value / Cost'
            ]);
        }
        if (level == 'campaign') {
            sheet.appendRow([
                'Campaign Name',
                'Campaign ID',
                'Phrase',
                'N-count',
                'Impressions',
                'Clicks',
                'Ctr',
                'Cost',
                'CPC',
                'Conversions',
                'Conv. Rate',
                'Conv. Cost',
                'Conv. Value',
                'Conv. Value / Cost'
            ]);
        }
        if (level == 'adgroup') {
            sheet.appendRow([
                'Campaign Name',
                'Campaign ID',
                'AdGroup Name',
                'AdGroup ID',
                'Phrase',
                'N-count',
                'Impressions',
                'Clicks',
                'Ctr',
                'Cost',
                'CPC',
                'Conversions',
                'Conv. Rate',
                'Conv. Cost',
                'Conv. Value',
                'Conv. Value / Cost'
            ]);
        }
      
        SpreadsheetApp.flush();
      
        var lastRow = +reportData[level].length + +1,
            lastCol = sheet.getLastColumn();
        sheet.getRange(2, 1, reportData[level].length, reportData[level][0].length).setValues(reportData[level]);
        SpreadsheetApp.flush();

        // colors
      
        var ctrCol = sheet.createTextFinder('Ctr').matchCase(true).matchEntireCell(true).findNext().getColumn();
        for (var cc = ctrCol; cc <= lastCol; cc++) {
            var range = sheet.getRange(2, cc, lastRow, 1);
            if ((cc == ctrCol) || (cc == (ctrCol + 4)) || (cc == (ctrCol + 6)) || (cc == (ctrCol + 7))) {
                var rule = SpreadsheetApp.newConditionalFormatRule()
                    .setGradientMaxpointWithValue("#C5E1A5", SpreadsheetApp.InterpolationType.PERCENTILE, "100")
                    .setGradientMidpointWithValue("#FFFFFF", SpreadsheetApp.InterpolationType.PERCENTILE, "50")
                    .setGradientMinpointWithValue("#EF9A9A", SpreadsheetApp.InterpolationType.PERCENTILE, "0")
                    .setRanges([range])
                    .build();
            }
            if ((cc == (ctrCol + 2)) || (cc == (ctrCol + 5))) {
                var rule = SpreadsheetApp.newConditionalFormatRule()
                    .setGradientMaxpointWithValue("#EF9A9A", SpreadsheetApp.InterpolationType.PERCENTILE, "100")
                    .setGradientMidpointWithValue("#FFFFFF", SpreadsheetApp.InterpolationType.PERCENTILE, "50")
                    .setGradientMinpointWithValue("#C5E1A5", SpreadsheetApp.InterpolationType.PERCENTILE, "0")
                    .setRanges([range])
                    .build();
            }
            var rules = sheet.getConditionalFormatRules();
            rules.push(rule);
            sheet.setConditionalFormatRules(rules);
        }
        SpreadsheetApp.flush();
      
        // format
      
        var formats = [];
        for (var fr = 2; fr <= lastRow; fr++) {
            formats.push(["#0.00%", "#.00", "0.00", "0.00", "#0.00%", "0.00", "0.00", "#0.00%"]);
        }
        var formatRange = sheet.getRange(2, ctrCol, lastRow - 1, lastCol - (ctrCol - 1));
        formatRange.setNumberFormats(formats);
        SpreadsheetApp.flush();
      
        // resize
      
        Utilities.sleep(1000);
        var range = sheet.getDataRange();
        var numRows = range.getNumRows().toFixed();
        var numColumns = range.getNumColumns().toFixed();
        var fullRange = sheet.getRange(1, 1, numRows, numColumns);
        var filter = fullRange.createFilter();
        sheet.autoResizeColumns(1, numColumns);
        SpreadsheetApp.flush();
        for (var col = 1; col <= numColumns; col++) {
            sheet.setColumnWidth(col, sheet.getColumnWidth(col) + 30);
            SpreadsheetApp.flush();
        }
    }

    Logger.log(getCurrentAccountDetails() + ' - Записали отчет в таблицу ' + spreadsheetUrl);
    Logger.log(getCurrentAccountDetails() + ' - Finish');

    function getSearchTermStats() {
        var search_term_stat = {
            account: {},
            campaign: {},
            adgroup: {}
        };
        var search_term_query = 'SELECT campaign.name, ' +
            'campaign.id, ' +
            'ad_group.name, ' +
            'ad_group.id, ' +
            'search_term_view.search_term, ' +
            'metrics.clicks, ' +
            'metrics.impressions, ' +
            'metrics.cost_micros, ' +
            'metrics.conversions, ' +
            'metrics.conversions_value, ' +
            'ad_group_ad.status ' +
            'FROM search_term_view ' +
            'WHERE ad_group_ad.status = "ENABLED" ' +
            'AND campaign.status = "ENABLED" ' +
            'AND segments.date BETWEEN "' + daysAgo(CONFIG().customDateRange) + '" AND "' + daysAgo(CONFIG().customDateRangeShift) + '"';
        var search_term_result = AdsApp.search(search_term_query, {
            apiVersion: 'v8'
        });
        while (search_term_result.hasNext()) {
            try {
            var row = search_term_result.next(),
                campaign_id = row.campaign.id,
                campaign_name = row.campaign.name,
                ad_group_id = row.adGroup.id,
                ad_group_name = row.adGroup.name,
                search_term = row.searchTermView.searchTerm,
                clicks = row.metrics.clicks,
                impressions = row.metrics.impressions,
                cost_micros = row.metrics.costMicros,
                conversions = row.metrics.conversions,
                conversions_value = row.metrics.conversionsValue;

            var searchIsExcluded = false;

            // Проверяем исключение на уровне группы
            if (negativesByGroup[ad_group_id] !== undefined) {
                for (var i = 0; i < negativesByGroup[ad_group_id].length; i++) {
                    if (((negativesByGroup[ad_group_id][i][1].toUpperCase() == 'EXACT') &&
                            (search_term == negativesByGroup[ad_group_id][i][0])) ||
                        ((negativesByGroup[ad_group_id][i][1].toUpperCase() != 'EXACT') &&
                            ((' ' + search_term + ' ').indexOf(' ' + negativesByGroup[ad_group_id][i][0] + ' ') > -1))) {
                        searchIsExcluded = true;
                        break;
                    }
                }
            }

            // Проверяем исключение на уровне кампании
            if (!searchIsExcluded && negativesByCampaign[campaign_id] !== undefined) {
                for (var i = 0; i < negativesByCampaign[campaign_id].length; i++) {
                    if (((negativesByCampaign[campaign_id][i][1] == 'EXACT') &&
                            (search_term == negativesByCampaign[campaign_id][i][0])) ||
                        ((negativesByCampaign[campaign_id][i][1] != 'EXACT') &&
                            ((' ' + search_term + ' ').indexOf(' ' + negativesByCampaign[campaign_id][i][0] + ' ') > -1))) {
                        searchIsExcluded = true;
                        break;
                    }
                }
            }

            var words_arr = search_term.replace('.', ' ').split(' ');
            words_arr = unique(words_arr);
            var gramms_arr = [];
            for (var c1 = 0; c1 < words_arr.length; c1++) {
                gramms_arr.push(words_arr[c1]);
                for (var c2 = 0; c2 < words_arr.length; c2++) {
                    if (words_arr[c1] != words_arr[c2]) {
                        gramms_arr.push(words_arr[c1] + ' ' + words_arr[c2]);
                        for (var c3 = 0; c3 < words_arr.length; c3++) {
                            if ((words_arr[c1] != words_arr[c2]) &&
                                (words_arr[c2] != words_arr[c3]) &&
                                (words_arr[c1] != words_arr[c3])) {
                                gramms_arr.push(words_arr[c1] + ' ' + words_arr[c2] + ' ' + words_arr[c3]);
                            }
                        }
                    }
                }
            }

            gramms_arr = unique(gramms_arr).sort();

            for (var g = 0; g < gramms_arr.length; g++) {
                var phrase = gramms_arr[g];
                if (search_term.indexOf(phrase) > -1) {
                    // Аггрегируем статистику аккаунта
                    if (search_term_stat['account'][phrase] == undefined) {
                        search_term_stat['account'][phrase] = {
                            phrase: phrase,
                            clicks: clicks,
                            impressions: impressions,
                            cost_micros: cost_micros,
                            conversions: conversions,
                            conversions_value: conversions_value
                        };
                    } else {
                        search_term_stat['account'][phrase].clicks = +search_term_stat['account'][phrase].clicks + +clicks;
                        search_term_stat['account'][phrase].impressions = +search_term_stat['account'][phrase].impressions + +impressions;
                        search_term_stat['account'][phrase].cost_micros = +search_term_stat['account'][phrase].cost_micros + +cost_micros;
                        search_term_stat['account'][phrase].conversions = +search_term_stat['account'][phrase].conversions + +conversions;
                        search_term_stat['account'][phrase].conversions_value = +search_term_stat['account'][phrase].conversions_value + +conversions_value;
                    }

                    // Аггрегируем статистику кампаний
                    if (search_term_stat['campaign'][campaign_id] == undefined) {
                        search_term_stat['campaign'][campaign_id] = {};
                    }
                    if (search_term_stat['campaign'][campaign_id][phrase] == undefined) {
                        search_term_stat['campaign'][campaign_id][phrase] = {
                            campaign_name: campaign_name,
                            campaign_id: campaign_id,
                            phrase: phrase,
                            clicks: clicks,
                            impressions: impressions,
                            cost_micros: cost_micros,
                            conversions: conversions,
                            conversions_value: conversions_value
                        };
                    } else {
                        search_term_stat['campaign'][campaign_id][phrase].clicks = +search_term_stat['campaign'][campaign_id][phrase].clicks + +clicks;
                        search_term_stat['campaign'][campaign_id][phrase].impressions = +search_term_stat['campaign'][campaign_id][phrase].impressions + +impressions;
                        search_term_stat['campaign'][campaign_id][phrase].cost_micros = +search_term_stat['campaign'][campaign_id][phrase].cost_micros + +cost_micros;
                        search_term_stat['campaign'][campaign_id][phrase].conversions = +search_term_stat['campaign'][campaign_id][phrase].conversions + +conversions;
                        search_term_stat['campaign'][campaign_id][phrase].conversions_value = +search_term_stat['campaign'][campaign_id][phrase].conversions_value + +conversions_value;
                    }

                    // Аггрегируем статистику групп
                    if (search_term_stat['adgroup'][campaign_id] == undefined) {
                        search_term_stat['adgroup'][campaign_id] = {};
                    }
                    if (search_term_stat['adgroup'][campaign_id][ad_group_id] == undefined) {
                        search_term_stat['adgroup'][campaign_id][ad_group_id] = {};
                    }
                    if (search_term_stat['adgroup'][campaign_id][ad_group_id][phrase] == undefined) {
                        search_term_stat['adgroup'][campaign_id][ad_group_id][phrase] = {
                            campaign_name: campaign_name,
                            campaign_id: campaign_id,
                            ad_group_name: ad_group_name,
                            ad_group_id: ad_group_id,
                            phrase: phrase,
                            clicks: clicks,
                            impressions: impressions,
                            cost_micros: cost_micros,
                            conversions: conversions,
                            conversions_value: conversions_value
                        };
                    } else {
                        search_term_stat['adgroup'][campaign_id][ad_group_id][phrase].clicks = +search_term_stat['adgroup'][campaign_id][ad_group_id][phrase].clicks + +clicks;
                        search_term_stat['adgroup'][campaign_id][ad_group_id][phrase].impressions = +search_term_stat['adgroup'][campaign_id][ad_group_id][phrase].impressions + +impressions;
                        search_term_stat['adgroup'][campaign_id][ad_group_id][phrase].cost_micros = +search_term_stat['adgroup'][campaign_id][ad_group_id][phrase].cost_micros + +cost_micros;
                        search_term_stat['adgroup'][campaign_id][ad_group_id][phrase].conversions = +search_term_stat['adgroup'][campaign_id][ad_group_id][phrase].conversions + +conversions;
                        search_term_stat['adgroup'][campaign_id][ad_group_id][phrase].conversions_value = +search_term_stat['adgroup'][campaign_id][ad_group_id][phrase].conversions_value + +conversions_value;
                    }
                }
            }
            } catch (e) {
                Logger.log(e);
            }
        }
        Logger.log(getCurrentAccountDetails() + ' - Собрали поисковые фразы');
        return search_term_stat
    }
}

function getActiveCampaignIds() {
    var arr = [];
    var campaign_query = 'SELECT ' +
        'campaign.id, ' +
        'metrics.cost_micros, ' +
        'metrics.conversions ' +
        'FROM campaign ' +
        'WHERE campaign.advertising_channel_type = "SEARCH" ' +
        'AND metrics.clicks > ' + CONFIG().clickThreshold + ' ' +
        'AND metrics.impressions > ' + CONFIG().impressionThreshold + ' ' +
        'AND segments.date BETWEEN "' + daysAgo(CONFIG().customDateRange) + '" AND "' + daysAgo(CONFIG().customDateRangeShift) + '"';
    var campaign_result = AdsApp.search(campaign_query, {
        apiVersion: 'v8'
    });
    while (campaign_result.hasNext()) {
        var campaign_row = campaign_result.next(),
            campaign_id = campaign_row.campaign.id,
            campaign_conversions = campaign_row.metrics.conversions,
            campaign_cost = campaign_row.metrics.costMicros / 1000000;
        if (campaign_row) {
            arr.push(campaign_id);
        }
    }
    Logger.log(getCurrentAccountDetails() + ' - Собрали активные кампании');
    return unique(arr).sort();
}
