function main() {

    var ARPU = 9; // APRU на пользователя без партнёра
    var AverageCheck = 180; // Средний чек на пользователя без партнёра

    ARPU = +Math.round(ARPU / 3);
    AverageCheck = +Math.round(AverageCheck / 3);
    ARPU = +Math.round(((AverageCheck - ARPU) * 0.2) + ARPU); // Увеличиваем допустимый CPL на 10% снижения учета конверсий на 10%

    var minPosition = 2; // Минимально удерживаемая позиция

    var MILLIS_PER_DAY = 1000 * 60 * 60 * 24;
    var now = new Date();
    var nowDate = new Date(now.getTime());
    var timeZone = AdWordsApp.currentAccount().getTimeZone();
    var nowDateFormatted = Utilities.formatDate(nowDate, timeZone, 'HH');
    if (nowDateFormatted < 2) {
        nowDateFormatted = 2;
    }

    var campaignPerfomaceAWQL = 'SELECT CampaignName, CampaignId ' +
        'FROM CAMPAIGN_PERFORMANCE_REPORT ' +
        'WHERE CampaignStatus = ENABLED AND AdvertisingChannelType = SEARCH AND CampaignName DOES_NOT_CONTAIN_IGNORE_CASE DSA AND CampaignName DOES_NOT_CONTAIN "[" ' +
        'DURING TODAY';
    var campaignPerfomaceRowsIter = AdWordsApp.report(campaignPerfomaceAWQL).rows();
    while (campaignPerfomaceRowsIter.hasNext()) {
        var CampaignRow = campaignPerfomaceRowsIter.next();
        var CampaignName = CampaignRow['CampaignName'];
        var CampaignId = CampaignRow['CampaignId'];
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
            var AdGroupRow = adGroupPerfomanceRowsIter.next();
            var AdGroupName = AdGroupRow['AdGroupName'];
            var AdGroupId = AdGroupRow['AdGroupId'];

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
                .withCondition('AveragePosition > ' + minPosition)
                .withCondition('Impressions > ' + nowDateFormatted)
                .withCondition('Status = ENABLED')
                .forDateRange('TODAY')
                .get();
            if (keywordIterator.hasNext()) {
                while (keywordIterator.hasNext()) {
                    var keyword = keywordIterator.next();
                    var keyStrategy = keyword.bidding().getStrategyType().toString();
                    var keywordCpc = keyword.bidding().getCpc().toString();
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
                    var keyword = keywordIterator.next();
                    var keyStrategy = keyword.bidding().getStrategyType().toString();
                    var keywordFirstPageCpc = parseFloat(keyword.getFirstPageCpc()).toFixed(2);
                    var keywordCpc = parseFloat(keyword.bidding().getCpc()).toFixed(2);
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
