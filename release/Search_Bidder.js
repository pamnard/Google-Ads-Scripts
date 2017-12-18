function main() {

    var CONFIG = {
        ARPU: 9,
        // APRU на пользователя

        AverageCheck: 180,
        // Средний чек на пользователя

        minPosition: 2,
        // Минимально удерживаемая позиция
    };

    ARPU = (CONFIG.ARPU/3).toFixed(2);
    AverageCheck = (CONFIG.AverageCheck/3).toFixed(2);

    var campaignPerfomaceAWQL = 'SELECT CampaignName, CampaignId ' +
        'FROM CAMPAIGN_PERFORMANCE_REPORT ' +
        'WHERE CampaignStatus = ENABLED AND AdvertisingChannelType = SEARCH AND BiddingStrategyType = MANUAL_CPC ' +
        'AND CampaignName DOES_NOT_CONTAIN_IGNORE_CASE DSA AND CampaignName DOES_NOT_CONTAIN "[" ' +
        'DURING TODAY';
    var campaignPerfomaceRowsIter = AdWordsApp.report(campaignPerfomaceAWQL).rows();
    while (campaignPerfomaceRowsIter.hasNext()) {
        var CampaignRow = campaignPerfomaceRowsIter.next(),
            CampaignName = CampaignRow['CampaignName'],
            CampaignId = CampaignRow['CampaignId'];
        if (CampaignRow) {
            getAdGroups();
        }
    }

    function getAdGroups() {
        var adGroupPerfomanceAWQL = 'SELECT AdGroupName, AdGroupId ' +
            'FROM ADGROUP_PERFORMANCE_REPORT ' +
            'WHERE CampaignId = ' + CampaignId + ' AND AdGroupStatus = ENABLED  ' +
            'DURING TODAY';
        var adGroupPerfomanceRowsIter = AdWordsApp.report(adGroupPerfomanceAWQL).rows();
        while (adGroupPerfomanceRowsIter.hasNext()) {
            var AdGroupRow = adGroupPerfomanceRowsIter.next(),
                AdGroupName = AdGroupRow['AdGroupName'],
                AdGroupId = AdGroupRow['AdGroupId'];
            if (AdGroupRow != undefined) {
                Logger.log('Campaign: ' + CampaignName + ', Ad Group: ' + AdGroupName);
                lowPosition();
                firstPage();
                Logger.log('-----------------------------------------------------------------------------------------');
            }
        }

        function lowPosition() {
            var keywordIterator = AdWordsApp.keywords()
                .withCondition('CampaignId = ' + CampaignId)
                .withCondition('AdGroupId = ' + AdGroupId)
                .withCondition('AveragePosition > ' + CONFIG.minPosition)
                .withCondition('Impressions > ' + nowDateFormatted)
                .withCondition('Status = ENABLED')
                .forDateRange('TODAY')
                .get();
            if (keywordIterator.hasNext()) {
                while (keywordIterator.hasNext()) {
                    var keyword = keywordIterator.next(),
                        keyStrategy = keyword.bidding().getStrategyType().toString(),
                        keywordCpc = parseFloat(keyword.bidding().getCpc()).toFixed(2);
                    if (keyStrategy == 'MANUAL_CPC') {
                        keyword.bidding().setCpc(bidCpc(keywordCpc));
                        Logger.log('Повышаем позицию');
                        Logger.log('Keyword: ' + keyword.getText() + ' OldCPC: ' + keywordCpc + ' NewCPC: ' + bidCpc(keywordCpc));
                    }
                }
            }
        }

        function firstPage() {
            var keywordIterator = AdWordsApp.keywords()
                .withCondition('CampaignId = ' + CampaignId)
                .withCondition('AdGroupId = ' + AdGroupId)
                .withCondition('Status = ENABLED')
                .get();
            if (keywordIterator.hasNext()) {
                while (keywordIterator.hasNext()) {
                    var keyword = keywordIterator.next(),
                        keyStrategy = keyword.bidding().getStrategyType().toString(),
                        keywordFirstPageCpc = parseFloat(keyword.getFirstPageCpc()).toFixed(2),
                        keywordCpc = parseFloat(keyword.bidding().getCpc()).toFixed(2);
                    if (keyStrategy == 'MANUAL_CPC') {
                        if (keywordFirstPageCpc > keywordCpc) {
                            keyword.bidding().setCpc(bidCpc(keywordCpc));
                            Logger.log('Выводим на 1-ю страницу');
                            Logger.log('Keyword: ' + keyword.getText() + ' OldCPC: ' + keywordCpc + ' NewCPC: ' + bidCpc(keywordCpc));
                        }
                    }
                }
            }
        }
    }

    function bidCpc(cpc) {
        var oldBid = cpc;
        if (oldBid > 0) {
            // do nothing
        } else {
            oldBid = 1;
        }
        var newBid = oldBid * 1.1;
        if (newBid > ARPU) {
            newBid = ARPU;
        }
        return newBid.toFixed(2);
    }
}
