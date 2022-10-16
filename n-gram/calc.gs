function calc_stats(stats) {
    
    var report = {};
    
    for (var level in stats) {
        if (level == 'account') {
            for (var phrase in stats[level]) {
                if ((stats[level][phrase].clicks >= config().clicks_threshold) &&
                    (stats[level][phrase].impressions >= config().impressions_threshold)) {
                    var n = stats[level][phrase].phrase.toString().split(' ').length;
                    var ctr = 0,
                        cost = 0,
                        cpc = 0,
                        conv_rate = 0,
                        cost_per_conv = 0,
                        conv_value_per_cost = 0;
                    if ((+stats[level][phrase].clicks > +0) && (+stats[level][phrase].impressions > +0)) {
                        ctr = +stats[level][phrase].clicks / +stats[level][phrase].impressions;
                    }
                    if (+stats[level][phrase].cost_micros > +0) {
                        cost = +stats[level][phrase].cost_micros / 1000000;
                    }
                    if ((+cost > +0) && (+stats[level][phrase].clicks > +0)) {
                        cpc = +cost / +stats[level][phrase].clicks;
                    }
                    if ((+stats[level][phrase].conversions > +0) && (+stats[level][phrase].clicks > +0)) {
                        conv_rate = +stats[level][phrase].conversions / +stats[level][phrase].clicks;
                    }
                    if ((+cost > +0) && (+stats[level][phrase].conversions > +0)) {
                        cost_per_conv = +cost / +stats[level][phrase].conversions;
                    }
                    if ((+stats[level][phrase].conversions_value > +0) && (+cost > +0)) {
                        conv_value_per_cost = +stats[level][phrase].conversions_value / +cost;
                    }
                    if (report[level] == undefined) {
                        report[level] = [];
                    }
                    report[level].push([
                        stats[level][phrase].phrase,
                        n,
                        stats[level][phrase].impressions,
                        stats[level][phrase].clicks,
                        ctr,
                        cost,
                        cpc,
                        stats[level][phrase].conversions,
                        conv_rate,
                        cost_per_conv,
                        stats[level][phrase].conversions_value,
                        conv_value_per_cost
                    ]);
                }
            }
        }
        if (level == 'campaign') {
            for (var campaign_id in stats[level]) {
                for (var phrase in stats[level][campaign_id]) {
                    if ((stats[level][campaign_id][phrase].clicks >= config().clicks_threshold) &&
                        (stats[level][campaign_id][phrase].impressions >= config().impressions_threshold)) {
                        var n = stats[level][campaign_id][phrase].phrase.toString().split(' ').length;
                        var ctr = 0,
                            cost = 0,
                            cpc = 0,
                            conv_rate = 0,
                            cost_per_conv = 0,
                            conv_value_per_cost = 0;
                        if ((+stats[level][campaign_id][phrase].clicks > +0) && (+stats[level][campaign_id][phrase].impressions > +0)) {
                            ctr = +stats[level][campaign_id][phrase].clicks / +stats[level][campaign_id][phrase].impressions;
                        }
                        if (+stats[level][campaign_id][phrase].cost_micros > +0) {
                            cost = +stats[level][campaign_id][phrase].cost_micros / 1000000;
                        }
                        if ((+cost > +0) && (+stats[level][campaign_id][phrase].clicks > +0)) {
                            cpc = +cost / +stats[level][campaign_id][phrase].clicks;
                        }
                        if ((+stats[level][campaign_id][phrase].conversions > +0) && (+stats[level][campaign_id][phrase].clicks > +0)) {
                            conv_rate = +stats[level][campaign_id][phrase].conversions / +stats[level][campaign_id][phrase].clicks;
                        }
                        if ((+cost > +0) && (+stats[level][campaign_id][phrase].conversions > +0)) {
                            cost_per_conv = +cost / +stats[level][campaign_id][phrase].conversions;
                        }
                        if ((+stats[level][campaign_id][phrase].conversions_value > +0) && (+cost > +0)) {
                            conv_value_per_cost = +stats[level][campaign_id][phrase].conversions_value / +cost;
                        }
                        if (report[level] == undefined) {
                            report[level] = [];
                        }
                        report[level].push([
                            stats[level][campaign_id][phrase].campaign_name,
                            stats[level][campaign_id][phrase].campaign_id,
                            stats[level][campaign_id][phrase].phrase,
                            n,
                            stats[level][campaign_id][phrase].impressions,
                            stats[level][campaign_id][phrase].clicks,
                            ctr,
                            cost,
                            cpc,
                            stats[level][campaign_id][phrase].conversions,
                            conv_rate,
                            cost_per_conv,
                            stats[level][campaign_id][phrase].conversions_value,
                            conv_value_per_cost
                        ]);
                    }
                }
            }
        }
        if (level == 'adgroup') {
            for (var campaign_id in stats[level]) {
                for (var ad_group_id in stats[level][campaign_id]) {
                    for (var phrase in stats[level][campaign_id][ad_group_id]) {
                        if ((stats[level][campaign_id][ad_group_id][phrase].clicks >= config().clicks_threshold) &&
                            (stats[level][campaign_id][ad_group_id][phrase].impressions >= config().impressions_threshold)) {
                            var n = stats[level][campaign_id][ad_group_id][phrase].phrase.toString().split(' ').length;
                            var ctr = 0,
                                cost = 0,
                                cpc = 0,
                                conv_rate = 0,
                                cost_per_conv = 0,
                                conv_value_per_cost = 0;
                            if ((+stats[level][campaign_id][ad_group_id][phrase].clicks > +0) && (+stats[level][campaign_id][ad_group_id][phrase].impressions > +0)) {
                                ctr = +stats[level][campaign_id][ad_group_id][phrase].clicks / +stats[level][campaign_id][ad_group_id][phrase].impressions;
                            }
                            if (+stats[level][campaign_id][ad_group_id][phrase].cost_micros > +0) {
                                cost = +stats[level][campaign_id][ad_group_id][phrase].cost_micros / 1000000;
                            }
                            if ((+cost > +0) && (+stats[level][campaign_id][ad_group_id][phrase].clicks > +0)) {
                                cpc = +cost / +stats[level][campaign_id][ad_group_id][phrase].clicks;
                            }
                            if ((+stats[level][campaign_id][ad_group_id][phrase].conversions > +0) && (+stats[level][campaign_id][ad_group_id][phrase].clicks > +0)) {
                                conv_rate = +stats[level][campaign_id][ad_group_id][phrase].conversions / +stats[level][campaign_id][ad_group_id][phrase].clicks;
                            }
                            if ((+cost > +0) && (+stats[level][campaign_id][ad_group_id][phrase].conversions > +0)) {
                                cost_per_conv = +cost / +stats[level][campaign_id][ad_group_id][phrase].conversions;
                            }
                            if ((+stats[level][campaign_id][ad_group_id][phrase].conversions_value > +0) && (+cost > +0)) {
                                conv_value_per_cost = +stats[level][campaign_id][ad_group_id][phrase].conversions_value / +cost;
                            }
                            if (report[level] == undefined) {
                                report[level] = [];
                            }
                            report[level].push([
                                stats[level][campaign_id][ad_group_id][phrase].campaign_name,
                                stats[level][campaign_id][ad_group_id][phrase].campaign_id,
                                stats[level][campaign_id][ad_group_id][phrase].ad_group_name,
                                stats[level][campaign_id][ad_group_id][phrase].ad_group_id,
                                stats[level][campaign_id][ad_group_id][phrase].phrase,
                                n,
                                stats[level][campaign_id][ad_group_id][phrase].impressions,
                                stats[level][campaign_id][ad_group_id][phrase].clicks,
                                ctr,
                                cost,
                                cpc,
                                stats[level][campaign_id][ad_group_id][phrase].conversions,
                                conv_rate,
                                cost_per_conv,
                                stats[level][campaign_id][ad_group_id][phrase].conversions_value,
                                conv_value_per_cost
                            ]);
                        }
                    }
                }
            }
        }
    }
    Logger.log(get_account_name() + ' - Рассчитали финальный отчёт');
    return report
}
