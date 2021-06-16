function account_main() {

    ensureAccountLabels(); // Проверяем и создаем ярлыки
    
    var campaignQuery = 'SELECT ' + 
        'campaign.name ' +
        'FROM campaign ' +
        'WHERE campaign.advertising_channel_type = "SEARCH" ' +
        'AND campaign.status != "REMOVED" ' +
        'AND metrics.impressions > ' + CONFIG().customDaysInDateRange + ' ' +
        'AND segments.date BETWEEN "' + customDateRange('from') + '" AND "' + customDateRange('to') + '"';
    var campaignResult = AdsApp.search(campaignQuery, {
        apiVersion: 'v8'
    });
    while (campaignResult.hasNext()) {
        var campaign_row = campaignResult.next(),
            campaign_name = campaign_row.campaign.name;
        if (campaign_row) {
            adGroupReport(campaign_name); // Создаем ключи
        }
    }
}

function adGroupReport(campaign_name) {
    var adGroupSelector = AdsApp.adGroups()
        .withCondition('Impressions > ' + CONFIG().customDaysInDateRange)
        .withCondition('CampaignName = "' + campaign_name + '"')
        .withCondition('Status != REMOVED')
        .forDateRange('LAST_30_DAYS')
        .orderBy('Cost DESC');
    var adGroupIterator = adGroupSelector.get();
    while (adGroupIterator.hasNext()) {
        var ad_group = adGroupIterator.next(),
            ad_group_id = ad_group.getId(),
            ad_group_name = ad_group.getName(),
            campaign_name = ad_group.getCampaign().getName(),
            campaign_id = ad_group.getCampaign().getId();
        Logger.log('Campaign: ' + campaign_name + ', Ad Group: ' + ad_group_name);
        buildNewKeywords(ad_group_id, campaign_id);
        Logger.log('-----------------------------------------------------------------------------------------');
    }
}
