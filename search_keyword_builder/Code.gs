//////////////////////////////////////////////////////////////////////////////
// Search Keyword Builder 2.0
// Настройки в config.js
//////////////////////////////////////////////////////////////////////////////

function main() {

    // Select the accounts to be processed. You can process up to 50 accounts.
    var accountSelector = MccApp.accounts()
        .withCondition('Cost > 0')
        .forDateRange('LAST_7_DAYS')
        .orderBy('Cost DESC')
        .withLimit(50);
    // Process the account in parallel. The callback method is optional.
    accountSelector.executeInParallel('account_main', 'allFinished');
}

function allFinished(results) {
    if (!AdsApp.getExecutionInfo().isPreview()) {
        Logger.log('Работа закончена');
    } else {
        Logger.log('Отработали превью');
    }
}
