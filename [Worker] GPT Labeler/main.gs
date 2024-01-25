/* ========================================================================================

   Before start use the script, you need to configure it in the file\functions - config

======================================================================================== */

function main() {
    var account_ids = [],
        accountSelector = AdsManagerApp.accounts(),
        accountIterator = accountSelector.get();
    while (accountIterator.hasNext()) {
        var account = accountIterator.next(),
            account_name = account.getName().toLowerCase(),
            cost = account.getStatsFor('LAST_7_DAYS').getCost();
        if ((cost > +0) &&
            // (account_name.indexOf('indonesia') > -1) &&
            (account_name.indexOf('web') > -1)) {
            if (account_ids.length < 50) {
                account_ids.push(account.getCustomerId());
            } else {
                execute_ids(account_ids);
                Utilities.sleep(1000);
                account_ids = [];
            }
        }
    }

    execute_ids(account_ids);

    function execute_ids(ids) {
        var accountSelector = AdsManagerApp.accounts()
            .withIds(ids)
            .withLimit(50);
        accountSelector.executeInParallel('account', 'all_finished');
    }
}

function all_finished() {
    Logger.log('All done!');
}