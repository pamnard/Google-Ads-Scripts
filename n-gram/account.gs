function account() {

    Logger.log(get_account_name() + ' - Start');

    var active_campaign_ids = get_active_campaign_ids();
    
    if (active_campaign_ids.length > +0) {
        
        var negatives_by_groups = get_negatives_by_groups(active_campaign_ids), // Собираем минус-слова на уровне групп
            negatives_by_campaign = get_negatives_by_campaign(active_campaign_ids), // Собираем минус-слова на уровне кампаний
            search_term_stats = get_search_term_stats(), // Собираем данные по поисковым фразам
            report_data = calc_stats(search_term_stats); // Рассчитывем финальный отчёт

        var SS = SpreadsheetApp.create(get_account_name() + ' - N-Gram Search Term Analysis'),
            spreadsheetUrl = SS.getUrl();

        for (var i = 0; i < config().editors_mails.length; i++) {
            try {
                SS.addEditor(config().editors_mails[i]);
            } catch (e) {
                Logger.log(e);
            }
        }

        for (var level in report_data) {
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
                sheet.activate();
                SS.moveActiveSheet(1);
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
                sheet.activate();
                SS.moveActiveSheet(2);
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
                sheet.activate();
                SS.moveActiveSheet(3);
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

            var last_row = +report_data[level].length + +1,
                last_col = sheet.getLastColumn();
            var sheet_data_range = sheet.getRange(2, 1, report_data[level].length, report_data[level][0].length).setValues(report_data[level]);

            SpreadsheetApp.flush();

            var cost_col = sheet.createTextFinder('Cost').matchCase(true).matchEntireCell(true).findNext().getColumn();
            sheet_data_range.sort({
                column: cost_col,
                ascending: false
            });

            SpreadsheetApp.flush();

            // colors

            var ctr_col = sheet.createTextFinder('Ctr').matchCase(true).matchEntireCell(true).findNext().getColumn();
            for (var cc = ctr_col; cc <= last_col; cc++) {
                var range = sheet.getRange(2, cc, last_row, 1);
                if ((cc == ctr_col) || (cc == (ctr_col + 4)) || (cc == (ctr_col + 6)) || (cc == (ctr_col + 7))) {
                    var rule = SpreadsheetApp.newConditionalFormatRule()
                        .setGradientMaxpointWithValue("#C5E1A5", SpreadsheetApp.InterpolationType.PERCENTILE, "100")
                        .setGradientMidpointWithValue("#FFFFFF", SpreadsheetApp.InterpolationType.PERCENTILE, "50")
                        .setGradientMinpointWithValue("#EF9A9A", SpreadsheetApp.InterpolationType.PERCENTILE, "0")
                        .setRanges([range])
                        .build();
                }
                if ((cc == (ctr_col + 2)) || (cc == (ctr_col + 5))) {
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
            for (var fr = 2; fr <= last_row; fr++) {
                formats.push(["#0.00%", "#.00", "0.00", "0.00", "#0.00%", "0.00", "0.00", "#0.00%"]);
            }
            var formatRange = sheet.getRange(2, ctr_col, last_row - 1, last_col - (ctr_col - 1));
            formatRange.setNumberFormats(formats);
            SpreadsheetApp.flush();

            // resize

            Utilities.sleep(1000);
            var range = sheet.getDataRange(),
                num_rows = range.getNumRows().toFixed(),
                num_columns = range.getNumColumns().toFixed();
            var full_range = sheet.getRange(1, 1, num_rows, num_columns);
            var filter = full_range.createFilter();
            sheet.autoResizeColumns(1, num_columns);
            SpreadsheetApp.flush();
            for (var col = 1; col <= num_columns; col++) {
                try {
                    Utilities.sleep(500);
                    sheet.setColumnWidth(col, sheet.getColumnWidth(col) + 30);
                    SpreadsheetApp.flush();
                } catch (e) {
                    Logger.log(e);
                }
            }
        }

        Logger.log(get_account_name() + ' - Записали отчет в таблицу ' + spreadsheetUrl);

        if (config().slack_url.indexOf('EXAMPLEURL') == -1) {
            var message_text = '*N-Gram Search Term Analysis* - Готов для аккаунта ' + get_account_name() + '. <' + spreadsheetUrl + '|Смотреть отчёт>';
            send_slack_message(message_text);
        }
    }

    Logger.log(get_account_name() + ' - Finish');

    function get_search_term_stats() {
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
            'AND search_term_view.status != "EXCLUDED" ' +
            'AND metrics.clicks > 0 ' +
            'AND segments.date BETWEEN "' + days_ago(config().custom_date_range) + '" AND "' + days_ago(config().custom_date_range_shift) + '"';
        var search_term_result = AdsApp.search(search_term_query);
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

                var search_is_excluded = false;

                // Проверяем исключение на уровне группы
                if (!!negatives_by_groups[ad_group_id]) {
                    for (var i = 0; i < negatives_by_groups[ad_group_id].length; i++) {
                        if (((negatives_by_groups[ad_group_id][i][1].toUpperCase() == 'EXACT') && (search_term == negatives_by_groups[ad_group_id][i][0])) ||
                            ((negatives_by_groups[ad_group_id][i][1].toUpperCase() != 'EXACT') && ((' ' + search_term + ' ').indexOf(' ' + negatives_by_groups[ad_group_id][i][0] + ' ') > -1))) {
                            search_is_excluded = true;
                            break;
                        }
                    }
                }

                // Проверяем исключение на уровне кампании
                if (!search_is_excluded && !!negatives_by_campaign[campaign_id]) {
                    for (var i = 0; i < negatives_by_campaign[campaign_id].length; i++) {
                        if (((negatives_by_campaign[campaign_id][i][1] == 'EXACT') && (search_term == negatives_by_campaign[campaign_id][i][0])) ||
                            ((negatives_by_campaign[campaign_id][i][1] != 'EXACT') && ((' ' + search_term + ' ').indexOf(' ' + negatives_by_campaign[campaign_id][i][0] + ' ') > -1))) {
                            search_is_excluded = true;
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
        Logger.log(get_account_name() + ' - Собрали поисковые фразы');
        return search_term_stat
    }
}

function get_active_campaign_ids() {
    var arr = [];
    var campaign_query = 'SELECT ' +
        'campaign.id, ' +
        'metrics.cost_micros, ' +
        'metrics.conversions ' +
        'FROM campaign ' +
        'WHERE campaign.advertising_channel_type = "SEARCH" ' +
        'AND metrics.clicks > ' + config().clicks_threshold + ' ' +
        'AND metrics.impressions > ' + config().impressions_threshold + ' ' +
        'AND segments.date BETWEEN "' + days_ago(8) + '" AND "' + days_ago(1) + '"';
    var campaign_result = AdsApp.search(campaign_query);
    while (campaign_result.hasNext()) {
        var campaign_row = campaign_result.next(),
            campaign_id = campaign_row.campaign.id,
            campaign_conversions = campaign_row.metrics.conversions,
            campaign_cost = campaign_row.metrics.costMicros / 1000000;
        if (campaign_row) {
            arr.push(campaign_id);
        }
    }
    Logger.log(get_account_name() + ' - Собрали активные кампании');
    return unique(arr).sort();
}
