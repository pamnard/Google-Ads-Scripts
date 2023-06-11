/**
 * Retrieves statistics on campaigns and identifies bad placements based on cost per acquisition (CPA) threshold.
 * Creates an excluded placement list for each campaign with bad placements.
 */
function account() {
    const campaigns_stats = getCampagnsStats();
    for (let campaign_id in campaigns_stats) {
        const bad_placements = getBadPlacements(
            campaign_id,
            campaigns_stats[campaign_id]
        );
        if (bad_placements.length !== 0) {
            const list_name = `${CONFIG().blacklistName} - cid ${campaign_id}`;
            makeAndPopulateExcludedPlacementList(
                list_name,
                bad_placements,
                campaign_id
            );
        }
    }
}

/**
 * Creates or updates an excluded placement list with bad placements for a specific campaign.
 * @param {string} list_name - Name of the excluded placement list to create or update.
 * @param {Array.<string>} bad_placements - An array of bad placements to add to the excluded placement list.
 * @param {string} campaign_id - ID of the campaign to add the excluded placement list to.
 */
function makeAndPopulateExcludedPlacementList(list_name, bad_placements, campaign_id) {
    const excludedPlacementListIterator = AdsApp.excludedPlacementLists()
        .withCondition(`shared_set.name = '${list_name}'`)
        .get();
    const campaign = AdsApp.campaigns().withIds([campaign_id]).get().next();

    let excludedPlacementList;

    if (excludedPlacementListIterator.hasNext()) {
        // If the list exists, use it
        excludedPlacementList = excludedPlacementListIterator.next();
    } else {
        // If the list does not exist, create it
        excludedPlacementList = AdsApp.newExcludedPlacementListBuilder()
            .withName(list_name)
            .build()
            .getResult();
    }

    excludedPlacementList.addExcludedPlacements(bad_placements);
    campaign.addExcludedPlacementList(excludedPlacementList);
}

/**
 * Identifies bad placements based on CPA threshold.
 * @param {string} campaign_id - Campaign ID to search for bad placements.
 * @param {number} avg_cpa - Average CPA of the campaign.
 * @return {Array.<string>} An array of bad placements.
 */
function getBadPlacements(campaign_id, avg_cpa) {
    const arr = [];
    const threshold = parseInt(Number(avg_cpa) * 1000000 * 5);
    const startDate = daysToGaqlDate(
        CONFIG().customDaysInDateRange + CONFIG().customDateRangeShift
    );
    const endDate = daysToGaqlDate(CONFIG().customDateRangeShift);

    const query = `SELECT 
            detail_placement_view.target_url, 
            detail_placement_view.resource_name, 
            detail_placement_view.placement_type, 
            detail_placement_view.placement, 
            detail_placement_view.group_placement_target_url, 
            metrics.clicks, 
            metrics.conversions, 
            metrics.cost_micros 
        FROM 
            detail_placement_view 
        WHERE 
            segments.date BETWEEN "${startDate}" AND "${endDate}" 
            AND metrics.cost_micros > ${threshold} 
            AND campaign.id = ${campaign_id}`;
    const result = AdsApp.search(query, {
        apiVersion: "v13",
    });
    while (result.hasNext()) {
        const row = result.next();
        if (row) {
            try {
                let to_bad_list = false;
                const placement = row.detailPlacementView.groupPlacementTargetUrl;
                const conversions = parseFloat(row.metrics.conversions).toFixed(2);
                const cost_micros = parseFloat(row.metrics.costMicros).toFixed(2);
                const cost = cost_micros / 1000000;
                let placement_cpa = Number(cost);
                if (conversions !== 0) {
                    placement_cpa = (Number(cost) / Number(conversions)).toFixed(2);
                    if (+cost > +avg_cpa * +CONFIG().badRate) {
                        if (+placement_cpa > +avg_cpa * +CONFIG().badRate) {
                            to_bad_list = true;
                        }
                    }
                } else {
                    if (cost > avg_cpa * +CONFIG().badRate) {
                        to_bad_list = true;
                    }
                }
                if (to_bad_list) {
                    arr.push(placement);
                    Logger.log(`placement - ${placement} > placement_cpa - ${placement_cpa}`);
                }
            } catch (e) {
                Logger.log(e);
                // Add more error handling here if necessary
            }
        }
    }
    return arr;
}

/**
 * Retrieves statistics on campaigns.
 * @return {Object} An object with campaign ID as keys and average CPA as values.
 */
function getCampagnsStats() {
    const report = {};
    const startDate = daysToGaqlDate(
        CONFIG().customDaysInDateRange + CONFIG().customDateRangeShift
    );
    const endDate = daysToGaqlDate(CONFIG().customDateRangeShift);

    const query = `SELECT 
            campaign.id, 
            campaign.name, 
            campaign.serving_status, 
            campaign.status, 
            metrics.clicks, 
            metrics.conversions, 
            metrics.cost_micros, 
            metrics.conversions_value 
        FROM 
            campaign 
        WHERE 
            metrics.conversions > 30 
            AND campaign.serving_status = 'SERVING' 
            AND campaign.status = 'ENABLED' 
            AND campaign.advertising_channel_type = 'DISPLAY' 
            AND segments.date BETWEEN "${startDate}" AND "${endDate}" 
        ORDER BY 
            metrics.cost_micros DESC`;

    const result = AdsApp.search(query, {
        apiVersion: "v13",
    });

    while (result.hasNext()) {
        let row = result.next();
        if (row) {
            try {
                const campaign_id = row.campaign.id;
                const campaign_name = row.campaign.name;
                const conversions = parseFloat(row.metrics.conversions).toFixed(2);
                const cost_micros = parseFloat(row.metrics.costMicros).toFixed(2);
                const cost = cost_micros / 1000000;
                const avg_cpa = (Number(cost) / Number(conversions)).toFixed(2);

                Logger.log(
                    `campaign_name - ${campaign_name} > avg_cpa - ${avg_cpa}`
                );

                report[campaign_id] = avg_cpa;
            } catch (e) {
                Logger.log(e);
            }
        }
    }

    return report;
}