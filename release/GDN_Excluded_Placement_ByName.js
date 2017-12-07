function main() {

    var CONFIG = {
        exclude: ['job', 'gta', 'game', 'blogspot', 'faucet', 'satoshi', 'dota', 'minecraft', 'flash', 'apk', 'android', 'mp3', 'fb2', 'farm', 'dating', 'astro', 'film', 'video', 'movie', 'book', 'download', 'torrent', 'kino', 'radio', 'weather', 'chords', 'zodiak', 'recept', 'recipe', 'spongebob', 'barbie', 'skyrim', 'ferma', 'mafia', 'mario', 'epub', '2048', 'dendy', 'sega', 'zuma', 'pdf', 'simulat', 'mods', 'play', 'spintires', 'spin-tires'],
        // Площадки содержаище любое из этих значений должны быть исключены

        period: 'LAST_7_DAYS',
        // Анализируем площадки у которых были показы за указанный период
        // ALL_TIME, LAST_7_DAYS, LAST_WEEK, LAST_MONTH, LAST_14_DAYS, LAST_30_DAYS, LAST_BUSINESS_WEEK, THIS_WEEK_SUN_TODAY, THIS_WEEK_MON_TODAY, LAST_WEEK_SUN_SAT, THIS_MONTH

        EXCLUDED_PLACEMENT_LIST_NAME: 'Trash'
        // В какой список будут складываться исключенные площадки
    }

    var placementArray = [];

    var AWQL = 'SELECT Domain, CampaignId ' +
        'FROM AUTOMATIC_PLACEMENTS_PERFORMANCE_REPORT ' +
        'WHERE Impressions > 0 AND Conversions < 1 ' +
        'DURING ' + CONFIG.period;

    var report = AdWordsApp.report(AWQL);
    var rows = report.rows();
    while (rows.hasNext()) {
        var row = rows.next();
        var Domain = row['Domain'].toString();
        var CampaignId = row['CampaignId'];
        if (containsAny(Domain, CONFIG.exclude)) {
            if (Domain.indexOf('mobileapp::') != -1) {
                Domain = Domain.replace(/mobileapp::/, '').replace(/2\-com/, 'com').replace(/1\-com/, 'com') + '.adsenseformobileapps.com';
            }
            placementArray.push(Domain);
        }
    }
    addNegativeKeywordToList(placementArray);

    function addNegativeKeywordToList(negativePlacements) { // исключаем площадки
        var excludedPlacementListIterator = AdWordsApp.excludedPlacementLists()
            .withCondition('Name = ' + CONFIG.EXCLUDED_PLACEMENT_LIST_NAME)
            .get();
        if (excludedPlacementListIterator.totalNumEntities() == 1) {
            var excludedPlacementList = excludedPlacementListIterator.next()
                .addExcludedPlacements(negativePlacements);
        } else {
            AdWordsApp.newExcludedPlacementListBuilder()
                .withName(CONFIG.EXCLUDED_PLACEMENT_LIST_NAME)
                .build()
                .getResult()
                .addExcludedPlacements(negativePlacements);
        }
    }

    function containsAny(str, arr) {
        for (var i = 0; i != arr.length; i++) {
            var substring = arr[i];
            if (str.indexOf(substring) != -1) {
                return true;
            }
        }
        return false;
    }
}
