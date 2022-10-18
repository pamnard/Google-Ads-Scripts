/* ===================================================================================

   Перед началом работы со скриптом его необходимо настроить в файле\функции - config

=================================================================================== */

function main() {
    if (config().is_mcc_account) {
        mcc_account();
    } else {
        account();
        all_finished();
    }
}

function mcc_account() {

    var account_ids = [],
        accountSelector = AdsManagerApp.accounts(),
        accountIterator = accountSelector.get();
    while (accountIterator.hasNext()) {
        var account = accountIterator.next(),
            account_name = account.getName(),
            cost = account.getStatsFor('LAST_7_DAYS').getCost();
        if (cost > +0) {
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
