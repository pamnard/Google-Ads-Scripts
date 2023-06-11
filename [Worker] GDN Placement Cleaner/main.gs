// Copyright 2023, https://github.com/pamnard
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* ========================================================================================

   Before start use the script, you need to configure it in the file\functions - config

======================================================================================== */

/**
 * Retrieves all child accounts of the MCC account with at least 30 conversions in the last 30 days
 * and proceeds them in parallel using the `proceedAccounts()` function.
 */
function main() {
    const account_to_proceed = [];
    const accountSelector = AdsManagerApp.accounts();
    const accountIterator = accountSelector.get();
    while (accountIterator.hasNext()) {
        const account = accountIterator.next();
        const stats = account.getStatsFor("LAST_30_DAYS");
        if (stats.getConversions() > 30) {
            account_to_proceed.push(account.getCustomerId());
        }
        if (account_to_proceed.length >= 50) {
            proceedAccounts(account_to_proceed);
            account_to_proceed.length = 0;
        }
    }
    if (account_to_proceed.length !== 0) {
        proceedAccounts(account_to_proceed);
    }

    function proceedAccounts(ids_array) {
        const selector = AdsManagerApp.accounts().withIds(ids_array);
        selector.executeInParallel("account");
    }
}

function all_finished() {
    Logger.log("All done!");
}
