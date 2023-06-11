function config() {
    return {
        // Prefix of the list where we put bad CPA placements
        blacklistName: "BadCPA",

        // Specify the number of days to select
        // If we want to use conversion or profitability data, then we should specify a value
        // greater than the conversion window.
        customDaysInDateRange: 180,

        // Specify how many days we shift the selection from today.
        // It is needed so as not to take those days when statistics are delayed.
        // If we want to use conversion or profitability data, then we should specify a value equal to
        // the days in the conversion window.
        customDateRangeShift: 0,

        // The threshold ratio of CPA to the campaign average, after which the placement starts to be considered "bad"
        badRate: 2,
    };
}