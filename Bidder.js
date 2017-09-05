function main() {

    var ARPU = 13; // APRU
    var minPosition = 1.5; // Минимально удерживаемая позиция

    var adGroupPerfomanceAWQL = 'SELECT CampaignName, CampaignId, AdGroupName, AdGroupId ' +
        'FROM ADGROUP_PERFORMANCE_REPORT ' +
        'WHERE CampaignStatus = ENABLED AND AdGroupStatus = ENABLED AND CampaignName DOES_NOT_CONTAIN_IGNORE_CASE DSA AND CampaignName DOES_NOT_CONTAIN "[" ' +
        'DURING TODAY';

    var adGroupPerfomanceRowsIter = AdWordsApp.report(adGroupPerfomanceAWQL).rows();

    while (adGroupPerfomanceRowsIter.hasNext()) {
        var keywordRow = adGroupPerfomanceRowsIter.next();
        var keywordCampaignName = keywordRow['CampaignName'];
        var keywordCampaignId = keywordRow['CampaignId'];
        var keywordAdGroupName = keywordRow['AdGroupName'];
        var keywordAdGroupId = keywordRow['AdGroupId'];

        if (keywordRow != undefined) {
            Logger.log('Campaign: ' + keywordCampaignName + ', Ad Group: ' + keywordAdGroupName);
            lowPosition();
            firstPage();
            Logger.log('-----------------------------------------------------------------------------------------');
        }
    }

    function lowPosition() {

        var MILLIS_PER_DAY = 1000 * 60 * 60 * 24;
        var now = new Date();
        var nowDate = new Date(now.getTime());
        var timeZone = AdWordsApp.currentAccount().getTimeZone();
        var nowDateFormatted = Utilities.formatDate(nowDate, timeZone, 'HH');
        if (nowDateFormatted < 2) {
            nowDateFormatted = 2;
        }

        var awql = 'SELECT CampaignId, AdGroupId, Impressions, IsNegative, AveragePosition, CpcBid ' +
            'FROM KEYWORDS_PERFORMANCE_REPORT ' +
            'WHERE CampaignId = ' + keywordCampaignId + ' AND AdGroupId = ' + keywordAdGroupId + ' AND Status = ENABLED AND CpcBid > 0 AND AveragePosition > ' + minPosition + ' AND Impressions > ' + nowDateFormatted + ' ' +
            'DURING TODAY';
        // Logger.log(awql);

        var rowsIter = AdWordsApp.report(awql).rows();

        while (rowsIter.hasNext()) {
            var row = rowsIter.next();
            var Impressions = row['Impressions'];
            var IsNegative = row['IsNegative'];
            var AveragePosition = row['AveragePosition'];
            var CpcBid = row['CpcBid'].toString();
            var CpcBidInMicros = (CpcBid * 1000000);
            CpcBidInMicros = CpcBidInMicros.toFixed();

            if (IsNegative == 'false') {
                var keywordIterator = AdWordsApp.keywords()
                    .withCondition('CampaignId = ' + keywordCampaignId)
                    .withCondition('AdGroupId = ' + keywordAdGroupId)
                    .withCondition('AveragePosition > ' + minPosition)
                    .withCondition('Impressions > ' + nowDateFormatted)
                    .forDateRange('TODAY')
                    .get();
                if (keywordIterator.hasNext()) {
                    while (keywordIterator.hasNext()) {
                        var keyword = keywordIterator.next();
                        var keywordBidding = keyword.bidding();
                        var keywordCpc = keywordBidding.getCpc();
                        keywordCpc = keywordCpc.toString();
                        keyword.bidding().setCpc(bidCpc(keywordCpc));
                        Logger.log('Повышаем позицию');
                        Logger.log('Keyword: ' + keyword.getText() + ' Impressions: ' + Impressions + ' AveragePosition: ' + AveragePosition + ' OldCPC: ' + keywordCpc + ' NewCPC: ' + bidCpc(keywordCpc));
                    }
                }
            }
        }

    }

    function firstPage() {

        var awql = 'SELECT Id, IsNegative, FirstPageCpc, CpcBid ' +
            'FROM KEYWORDS_PERFORMANCE_REPORT ' +
            'WHERE CampaignId = ' + keywordCampaignId + ' AND AdGroupId = ' + keywordAdGroupId + ' AND Status = ENABLED AND CpcBid > 0 AND FirstPageCpc > 0 ' +
            'DURING TODAY';
        // Logger.log(awql);

        var rowsIter = AdWordsApp.report(awql).rows();

        while (rowsIter.hasNext()) {
            var row = rowsIter.next();
            var Id = row['Id'];
            var IsNegative = row['IsNegative'];
            var FirstPageCpc = row['FirstPageCpc'].toString();
            var FirstPageCpcInMicros = (FirstPageCpc * 1000000);
            FirstPageCpcInMicros = FirstPageCpcInMicros.toFixed();
            var CpcBid = row['CpcBid'].toString();
            var CpcBidInMicros = (CpcBid * 1000000);
            CpcBidInMicros = CpcBidInMicros.toFixed();

            if ((IsNegative == 'false') && (CpcBidInMicros < FirstPageCpcInMicros)) {
                var keywordIterator = AdWordsApp.keywords()
                    .withCondition('CampaignId = ' + keywordCampaignId)
                    .withCondition('AdGroupId = ' + keywordAdGroupId)
                    .withCondition('Id = ' + Id)
                    .withCondition('CpcBid < ' + FirstPageCpcInMicros)
                    .get();
                if (keywordIterator.hasNext()) {
                    while (keywordIterator.hasNext()) {
                        var keyword = keywordIterator.next();
                        var keywordBidding = keyword.bidding();
                        var keywordCpc = keywordBidding.getCpc();
                        keywordCpc = keywordCpc.toString();
                        keyword.bidding().setCpc(bidCpc(keywordCpc));
                        Logger.log('Выводим на 1-ю страницу');
                        Logger.log('Keyword: ' + keyword.getText() + ' OldCPC: ' + keywordCpc + ' NewCPC: ' + bidCpc(keywordCpc));
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
