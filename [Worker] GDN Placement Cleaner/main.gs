// Copyright 2023, https://github.com/pamnard

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

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