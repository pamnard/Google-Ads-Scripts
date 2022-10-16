function get_negatives_by_groups(campaign_ids) {
    
    var arr = [];
    
    var group_negatives_query = 'SELECT campaign.id, ' +
        'ad_group.id, ' +
        'ad_group_criterion.keyword.text, ' +
        'ad_group_criterion.keyword.match_type ' +
        'FROM keyword_view ' +
        'WHERE ad_group_criterion.negative = TRUE ' +
        'AND campaign.status = "ENABLED" ' + 
        'AND campaign.id IN (' + campaign_ids.join(', ') + ')';
    var group_negatives_result = AdsApp.search(group_negatives_query);
    while (group_negatives_result.hasNext()) {
        try {
            var row = group_negatives_result.next(),
                ad_group_id = row.adGroup.id,
                campaign_id = row.campaign.id,
                keyword_text = row.adGroupCriterion.keyword.text,
                keyword_matchtype = row.adGroupCriterion.keyword.matchType;
            if (arr[ad_group_id] == undefined) {
                arr[ad_group_id] = [[
                    keyword_text.toLowerCase(),
                    keyword_matchtype
                ]];
            } else {
                arr[ad_group_id].push([
                    keyword_text.toLowerCase(),
                    keyword_matchtype
                ]);
            }
        } catch (e) {
            Logger.log(e);
        }
    }
    Logger.log(get_account_name() + ' - Собрали минус-слова для групп');
    return arr
}

function get_negatives_by_campaign(campaign_ids) {
    
    var arr = [];

    var campaign_negatives_query = 'SELECT campaign.id, ' +
        'campaign_criterion.keyword.text, ' +
        'campaign_criterion.keyword.match_type ' +
        'FROM campaign_criterion ' +
        'WHERE campaign_criterion.negative = TRUE ' +
        'AND campaign_criterion.type = "KEYWORD" ' +
        'AND campaign.status = "ENABLED" ' +
        'AND campaign.id IN (' + campaign_ids.join(', ') + ')';
    var campaign_negatives_result = AdsApp.search(campaign_negatives_query);
    while (campaign_negatives_result.hasNext()) {
        try {
            var row = campaign_negatives_result.next(),
                campaign_id = row.campaign.id,
                keyword_text = row.campaignCriterion.keyword.text,
                keyword_matchtype = row.campaignCriterion.keyword.matchType;
            if (arr[campaign_id] == undefined) {
                arr[campaign_id] = [[
                    keyword_text.toLowerCase(),
                    keyword_matchtype
                ]];
            } else {
                arr[campaign_id].push([
                    keyword_text.toLowerCase(),
                    keyword_matchtype
                ]);
            }
        } catch (e) {
            Logger.log(e);
        }
    }

    // Ищем кампании используюшие общие списки минус-слов
    var shared_set_data = [],
        shared_set_names = [],
        shared_set_campaigns = [];

    var campaign_shared_set_negatives_query = 'SELECT campaign.name, ' +
        'campaign.id, ' +
        'shared_set.name ' +
        'FROM campaign_shared_set ' +
        'WHERE shared_set.type = "NEGATIVE_KEYWORDS" ' +
        'AND shared_set.status = "ENABLED"';
    var campaign_shared_set_negatives_result = AdsApp.search(campaign_shared_set_negatives_query);
    while (campaign_shared_set_negatives_result.hasNext()) {
        try {
            var campaign_shared_set_row = campaign_shared_set_negatives_result.next(),
                campaign_shared_set_negatives_campaign_id = campaign_shared_set_row.campaign.id,
                campaign_shared_set_negatives_shared_set_name = campaign_shared_set_row.sharedSet.name;
            if (shared_set_campaigns[campaign_shared_set_negatives_shared_set_name] == undefined) {
                shared_set_campaigns[campaign_shared_set_negatives_shared_set_name] = [campaign_shared_set_negatives_campaign_id];
            } else {
                shared_set_campaigns[campaign_shared_set_negatives_shared_set_name].push(campaign_shared_set_negatives_campaign_id);
            }
        } catch (e) {
            Logger.log(e);
        }
    }

    // Мапим айдишники и имена по общим спискам

    var shared_set_negatives_query = 'SELECT shared_set.name, ' +
        'shared_set.id, ' +
        'shared_set.member_count, ' +
        'shared_set.reference_count, ' +
        'shared_set.type ' +
        'FROM shared_set ' +
        'WHERE shared_set.type = "NEGATIVE_KEYWORDS" ' +
        'AND shared_set.reference_count > 0';
    var shared_set_negatives_result = AdsApp.search(shared_set_negatives_query);
    while (shared_set_negatives_result.hasNext()) {
        try {
            var shared_set_row = shared_set_negatives_result.next(),
                shared_set_negatives_campaign_id = shared_set_row.sharedSet.id,
                shared_set_negatives_shared_set_name = shared_set_row.sharedSet.name;
            shared_set_names[shared_set_negatives_campaign_id] = shared_set_negatives_shared_set_name;
        } catch (e) {
            Logger.log(e);
        }
    }

    // Склеиваем минус слова из сетов и кампаний

    var shared_criterion_negatives_query = 'SELECT shared_set.id, ' +
        'shared_criterion.keyword.match_type, ' +
        'shared_criterion.keyword.text, ' +
        'shared_set.name ' +
        'FROM shared_criterion ' +
        'WHERE shared_criterion.type = "KEYWORD" ' +
        'AND shared_set.type = "NEGATIVE_KEYWORDS"';
    var shared_criterion_negatives_result = AdsApp.search(shared_criterion_negatives_query);
    while (shared_criterion_negatives_result.hasNext()) {
        try {
            var shared_criterion_negatives_row = shared_criterion_negatives_result.next(),
                shared_criterion_negatives_set_name = shared_criterion_negatives_row.sharedSet.name,
                shared_criterion_negatives_keyword_text = shared_criterion_negatives_row.sharedCriterion.keyword.text,
                shared_criterion_negatives_keyword_match_type = shared_criterion_negatives_row.sharedCriterion.keyword.matchType;
            if (shared_set_campaigns[shared_criterion_negatives_set_name] !== undefined) {
                for (var i = 0; i < shared_set_campaigns[shared_criterion_negatives_set_name].length; i++) {
                    var campaignId = shared_set_campaigns[shared_criterion_negatives_set_name][i];
                    if (arr[campaignId] == undefined) {
                        arr[campaignId] = [[
                            shared_criterion_negatives_keyword_text.toLowerCase(),
                            shared_criterion_negatives_keyword_match_type
                        ]];
                    } else {
                        arr[campaignId].push([
                            shared_criterion_negatives_keyword_text.toLowerCase(),
                            shared_criterion_negatives_keyword_match_type
                        ]);
                    }
                }
            }
        } catch (e) {
            Logger.log(e);
        }
    }
    Logger.log(get_account_name() + ' - Собрали минус-слова для кампаний');
    return arr
}
