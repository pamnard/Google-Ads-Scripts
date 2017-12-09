function main() {

    var CONFIG = {
        SLACK_URL: 'https://hooks.slack.com/services/xxxxxxxx/zzzzzzzz/yyyyyyyy',
        // Вебхук для Слака
        
        SCRIPT_LABEL: 'Budget_Control'
        // Следим за кампаниями помеченными этим ярлыком
    };

    // ===================================================================

    ensureAccountLabels(); // Проверяем и создаем ярлык

    var campaignSelector = AdWordsApp.campaigns()
        .withCondition('LabelNames CONTAINS_ANY ["' + CONFIG.SCRIPT_LABEL + '"]');
    var campaignIterator = campaignSelector.get();
    while (campaignIterator.hasNext()) {
        var campaign = campaignIterator.next();
        var budget = campaign.getBudget();
        var stats = campaign.getStatsFor('TODAY');
        var cost = parseFloat(stats.getCost()).toFixed(2);
        if (budget.isExplicitlyShared() == true) {
            var budgetCampaignIterator = budget.campaigns().get();
            var allAssociatedCost = +0;
            while (budgetCampaignIterator.hasNext()) {
                var associatedCampaign = budgetCampaignIterator.next();
                var associatedCampaignStats = associatedCampaign.getStatsFor('TODAY');
                var associatedCost = associatedCampaignStats.getCost();
                allAssociatedCost = allAssociatedCost + +associatedCost;
            }
            allAssociatedCost = parseFloat(allAssociatedCost).toFixed(2)
            if (allAssociatedCost > budget.getAmount()) {
                if (campaign.isEnabled() == true) {
                    campaign.pause();
                    Logger.log('Campaign ' + campaign.getName() + ' paused');
                    Logger.log('Budget amount: ' + budget.getAmount());
                    Logger.log('Budget spend: ' + allAssociatedCost);
                    Logger.log('-------------------------------------------------');
                    var message = ':double_vertical_bar: В кампании ' + campaign.getName() + ', сегодня расход ' + allAssociatedCost + ' при бюджете ' + budget.getAmount() + '. Кампания остановлена. \n\n';
                    sendSlackMessage(message);
                }
            } else {
                if (campaign.isPaused() == true) {
                    campaign.enable();
                    Logger.log('Campaign ' + campaign.getName() + ' enabled');
                    Logger.log('Budget amount: ' + budget.getAmount());
                    Logger.log('Budget spend: ' + allAssociatedCost);
                    Logger.log('-------------------------------------------------');
                }
            }
        } else {
            if (cost > budget.getAmount()) {
                if (campaign.isEnabled() == true) {
                    campaign.pause();
                    Logger.log('Campaign ' + campaign.getName() + ' paused');
                    Logger.log('Budget amount: ' + budget.getAmount());
                    Logger.log('Budget spend: ' + cost);
                    Logger.log('-------------------------------------------------');
                    var message = ':double_vertical_bar: В кампании ' + campaign.getName() + ', сегодня расход ' + cost + ' при бюджете ' + budget.getAmount() + '. Кампания остановлена. \n\n';
                    sendSlackMessage(message);
                }
            } else {
                if (campaign.isPaused() == true) {
                    campaign.enable();
                    Logger.log('Campaign ' + campaign.getName() + ' enabled');
                    Logger.log('Budget amount: ' + budget.getAmount());
                    Logger.log('Budget spend: ' + cost);
                    Logger.log('-------------------------------------------------');
                }
            }
        }
    }

    function ensureAccountLabels() {
        function getAccountLabelNames() {
            var labelNames = [];
            var iterator = AdWordsApp.labels().get();
            while (iterator.hasNext()) {
                labelNames.push(iterator.next().getName());
            }
            return labelNames;
        }
        var labelNames = getAccountLabelNames();
        if (labelNames.indexOf(CONFIG.SCRIPT_LABEL) == -1) {
            AdWordsApp.createLabel(CONFIG.SCRIPT_LABEL);
        }
    }

    function sendSlackMessage(text, opt_channel) {
        var slackMessage = {
            text: text,
            icon_url: 'https://www.gstatic.com/images/icons/material/product/1x/adwords_64dp.png',
            username: 'AdWords Scripts',
            channel: opt_channel || '#adwords'
        };

        var options = {
            method: 'POST',
            contentType: 'application/json',
            payload: JSON.stringify(slackMessage)
        };
        UrlFetchApp.fetch(CONFIG.SLACK_URL, options);
    }
}
