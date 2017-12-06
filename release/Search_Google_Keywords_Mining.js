function main() {

    // Settings

    var CONFIG = {
        targetCampaign: 'Search_New_Mining',
        // Целевая кампания

        scriptLabel: 'Key_Parser',
        // Ярлык которым скрипт помечает созданные слова

        impressionsThreshold: '10'
        // Минимальный порог показов для исходных ключевых слов
    };

    var REPORTING_OPTIONS = {
        // Comment out the following line to default to the latest reporting version.
        apiVersion: 'v201705'
    };

    //---------------------------------------------------------------------------------------------------------

    ensureAccountLabels(); // Проверяем и создаем ярлыки

    var campaignPerfomaceAWQL = 'SELECT CampaignName, CampaignId ' +
        'FROM CAMPAIGN_PERFORMANCE_REPORT ' +
        'WHERE AdvertisingChannelType = SEARCH ' +
        'AND CampaignName = ' + CONFIG.targetCampaign + ' ' +
        'DURING TODAY';
    var campaignPerfomaceRowsIter = AdWordsApp.report(campaignPerfomaceAWQL, REPORTING_OPTIONS).rows();
    Logger.log(campaignPerfomaceAWQL);
    while (campaignPerfomaceRowsIter.hasNext()) {
        var CampaignRow = campaignPerfomaceRowsIter.next(),
            CampaignName = CampaignRow['CampaignName'],
            CampaignId = CampaignRow['CampaignId'];
        if (CampaignRow) {
            var negativesListFromCampaign = getCampaignNegatives();
            var campaignSettings = getCampaignSettings();
            var googleSettings = setGoogleSettings(campaignSettings);
            var domainsList = allDomains();
            var langsList = allLangs();
            getAdGroups();
        }
    }

    function getAdGroups() {
        var adGroupPerfomanceAWQL = 'SELECT AdGroupName, AdGroupId ' +
            'FROM ADGROUP_PERFORMANCE_REPORT ' +
            'WHERE CampaignId = ' + CampaignId + ' AND AdGroupStatus = ENABLED ' +
            'DURING TODAY';
        var adGroupPerfomanceRowsIter = AdWordsApp.report(adGroupPerfomanceAWQL, REPORTING_OPTIONS).rows();
        while (adGroupPerfomanceRowsIter.hasNext()) {
            var AdGroupRow = adGroupPerfomanceRowsIter.next();
            var AdGroupName = AdGroupRow['AdGroupName'];
            var AdGroupId = AdGroupRow['AdGroupId'];
            if (AdGroupRow) {
                var negativeKeywords = getNegativeKeywordForAdGroup();
                Logger.log('Минус-слов: ' + negativeKeywords.length);
                getKeywords();
            }
        }

        function getNegativeKeywordForAdGroup() {
            var result = [];
            var adGroupIterator = AdWordsApp.adGroups()
                .withCondition('AdGroupId = ' + AdGroupId)
                .get();
            if (adGroupIterator.hasNext()) {
                var adGroup = adGroupIterator.next();
                var negativeKeywordIterator = adGroup.negativeKeywords()
                    .get();
                while (negativeKeywordIterator.hasNext()) {
                    var negativeKeyword = negativeKeywordIterator.next();
                    if (negativeKeyword.getMatchType() == 'BROAD') {
                        result.push(negativeKeyword.getText().toString());
                    }
                }
            }
            result = result.concat(negativesListFromCampaign, result);
            return result;
        }

        function getKeywords() { // Получаем ключи для обработки
            var keywordSelector = AdWordsApp.keywords()
                .withCondition('CampaignId = ' + CampaignId)
                .withCondition('AdGroupId = ' + AdGroupId)
                .withCondition('Status != REMOVED')
                .withCondition('LabelNames CONTAINS_NONE ["' + CONFIG.scriptLabel + '"]')
                .withCondition('KeywordMatchType = BROAD')
                .withCondition('Impressions >= ' + CONFIG.impressionsThreshold)
                .orderBy('Impressions DESC')
                .forDateRange('LAST_30_DAYS');
            var keywordIterator = keywordSelector.get();
            while (keywordIterator.hasNext()) {
                var keyword = keywordIterator.next();
                var keywordtext = keyword.getText().toString().replace(/\+/g, '');
                Logger.log(keywordtext);
                for (var q = 0; q < domainsList.length; q++) {
                    var domain = domainsList[q];
                    Logger.log(domain);
                    for (var z = 0; z < langsList.length; z++) {
                        var alphabet = langsList[z];
                        var serp = queryKeyword(keywordtext, domain, alphabet); // Собираем ключи
                    }
                }
                keyword.applyLabel(CONFIG.scriptLabel);
            }
        }

        function queryKeyword(keyword, url, letters) {
            var alphabet = letters;
            var primary = [];
            primary.push(keyword);
            alphabet.forEach(function (letter) {
                var wordPlusOneLetter = keyword + ' ' + letter;
                primary.push(wordPlusOneLetter);
            });
            var secondary = [];
            primary.forEach(function (line) {
                if (line != keyword) {
                    var querykeyword = encodeURIComponent(line);
                    var clearedphrases = keysFetch(querykeyword);
                    addingKeywords(clearedphrases); // Добавляем новые ключевые слова
                    if (clearedphrases.length > +9) {
                        alphabet.forEach(function (letter) {
                            var wordPlusTwoLetter = line + letter;
                            secondary.push(wordPlusTwoLetter);
                        });
                    }
                }
            });
            secondary.forEach(function (line) {
                if (line != keyword) {
                    var querykeyword = encodeURIComponent(line);
                    var clearedphrases = keysFetch(querykeyword);
                    addingKeywords(clearedphrases); // Добавляем новые ключевые слова
                }
            });

            function addingKeywords(keywordsArray) {
                var newKeywordsArray = keywordsArray;
                newKeywordsArray.forEach(
                    function (newKeyword) {
                        var newKey = '+' + newKeyword.toString().replace(/ /g, ' +').replace(/\./g, ' +').replace(/\&/g, ' +');
                        var adGroupIterator = AdWordsApp.adGroups()
                            .withCondition('CampaignName = "' + CampaignName + '"')
                            .withCondition('AdGroupName = "' + AdGroupName + '"')
                            .get();
                        while (adGroupIterator.hasNext()) {
                            var adGroup = adGroupIterator.next();
                            var keywordOperation = adGroup.newKeywordBuilder()
                                .withText(newKey)
                                .build();
                        }
                    }
                );
            }

            function keysFetch(key) {
                Utilities.sleep(100);
                var googleUrl = 'https://www.' + url + '/s?gs_rn=18&gs_ri=psy-ab&cp=7&gs_id=d7&xhr=t&q=',
                    response = UrlFetchApp.fetch(googleUrl + key),
                    text = response.getContentText('UTF-8'),
                    phrases = JSON.parse(text),
                    arr = [];

                phrases[1].forEach(function (line) {
                    var words = line[0].toString().replace(/[\.;#\(\)=\+:\-\/]+/g, ' ').split(' ');
                    if (words.length < 6) {
                        var reason = true;
                        words.forEach(function (word) {
                            negativeKeywords.forEach(function (negativeWord) {
                                if (word == negativeWord) {
                                    reason = false;
                                }
                            });
                        });
                        if (reason != false) {
                            arr.push(line[0]);
                        }
                    }
                });
                return arr;
            }
        }
    }
    
    function getCampaignNegatives() {
        var campaignNegativeKeywordsList = [];
        var campaignIterator = AdWordsApp.campaigns()
            .withCondition('CampaignId = ' + CampaignId)
            .get();
        if (campaignIterator.hasNext()) {
            var campaign = campaignIterator.next();
            var negativeKeywordListSelector = campaign.negativeKeywordLists() // Получаем минус-слова из списков
                .withCondition('Status = ACTIVE');
            var negativeKeywordListIterator = negativeKeywordListSelector
                .get();
            while (negativeKeywordListIterator.hasNext()) {
                var negativeKeywordList = negativeKeywordListIterator.next();
                var sharedNegativeKeywordIterator = negativeKeywordList.negativeKeywords()
                    .get();
                var sharedNegativeKeywords = [];
                while (sharedNegativeKeywordIterator.hasNext()) {
                    var negativeKeywordFromList = sharedNegativeKeywordIterator.next();
                    sharedNegativeKeywords.push(negativeKeywordFromList.getText());
                }
                campaignNegativeKeywordsList = campaignNegativeKeywordsList.concat(campaignNegativeKeywordsList, sharedNegativeKeywords);
            }
            var campaignNegativeKeywordIterator = campaign.negativeKeywords() // Получаем минус-слова из кампании
                .get();
            while (campaignNegativeKeywordIterator.hasNext()) {
                var campaignNegativeKeyword = campaignNegativeKeywordIterator.next();
                campaignNegativeKeywordsList.push(campaignNegativeKeyword.getText());
            }
        }
        campaignNegativeKeywordsList = campaignNegativeKeywordsList.sort();
        return campaignNegativeKeywordsList;
    }
    
    function allDomains() {
        var arr = [];
        for (var i = 0; i < googleSettings.length; i++) {
            var row = googleSettings[i];
            if (JSON.stringify(row).indexOf('domain') != -1) {
                var domain = googleSettings[i].location.domain;
                arr.push(domain);
            }
        }
        return arr;
    }

    function allLangs() {
        var arr = [];
        for (var i = 0; i < googleSettings.length; i++) {
            var row = googleSettings[i];
            if (JSON.stringify(row).indexOf('alphabet') != -1) {
                var alphabet = googleSettings[i].language.alphabet;
                arr.push(alphabet);
            }
        }
        return arr;
    }

    function getCampaignSettings() {
        var settings = [],
            regionIds = allRegionsIds();

        var campaignIterator = AdWordsApp.campaigns()
            .withCondition('Name = ' + CONFIG.targetCampaign)
            .get();
        if (campaignIterator.hasNext()) {
            var campaign = campaignIterator.next();
            var languageIterator = campaign.targeting().languages()
                .get();
            while (languageIterator.hasNext()) {
                var campaignlanguage = languageIterator.next();
                var row = {
                    languageId: parseFloat(campaignlanguage.getId()).toFixed(),
                    languageName: campaignlanguage.getName()
                };
                settings.push(row);
            }
            var targetedLocationIterator = campaign.targeting().targetedLocations().get();
            while (targetedLocationIterator.hasNext()) {
                var campaigntargetedLocation = targetedLocationIterator.next();
                var row = {
                    locationId: parseFloat(campaigntargetedLocation.getId()).toFixed(),
                    locationName: campaigntargetedLocation.getName()
                };
                regionIds.forEach(
                    function (id) {
                        if (id == parseFloat(campaigntargetedLocation.getId().toString()).toFixed()) {
                            settings.push(row);
                        }
                    }
                )
            }
        }
        return settings;
    }

    function setGoogleSettings(arr) {
        var settings = arr;
        var result = [];
        for (var i = 0; i < settings.length; i++) {
            var row = settings[i];
            if (row.languageId) {
                var row = {
                    language: {
                        id: row.languageId,
                        alphabet: alphabet(row.languageId)
                    }
                }
                result.push(row);
            }
            if (row.locationId) {
                var googleDomain = regionGoogle(row.locationId);
                var row = {
                    location: {
                        id: row.languageId,
                        domain: googleDomain
                    }
                }
                result.push(row);
            }
        }
        return result;
    }

    function allRegionsIds() {
        var regionSettings = regionGoogle();
        var idsList = [];
        for (var i = 0; i < regionSettings.length; i++) {
            var row = regionSettings[i];
            var idCol = row[0];
            idsList.push(idCol);
        }
        return idsList;
    }

    function regionGoogle(id) {
        var arr = [
            ['2004', 'AF', 'Afghanistan', 'google.com.af'],
            ['2008', 'AL', 'Albania', '--'],
            ['2012', 'DZ', 'Algeria', 'google.dz'],
            ['2016', 'AS', 'American Samoa', 'google.as'],
            ['2020', 'AD', 'Andorra', 'gooagle.ad'],
            ['2024', 'AO', 'Angola', 'google.co.ao'],
            ['2010', 'AQ', 'Antarctica', '--'],
            ['2028', 'AG', 'Antigua and Barbuda', 'google.com.ag'],
            ['2032', 'AR', 'Argentina', 'google.com.ar'],
            ['2051', 'AM', 'Armenia', 'google.am'],
            ['2036', 'AU', 'Australia', 'google.com.au'],
            ['2040', 'AT', 'Austria', 'google.at'],
            ['2031', 'AZ', 'Azerbaijan', 'google.az'],
            ['2048', 'BH', 'Bahrain', 'google.com.bh'],
            ['2050', 'BD', 'Bangladesh', 'google.com.bd'],
            ['2052', 'BB', 'Barbados', '--'],
            ['2112', 'BY', 'Belarus', 'google.by'],
            ['2056', 'BE', 'Belgium', 'google.be'],
            ['2084', 'BZ', 'Belize', 'google.com.bz'],
            ['2204', 'BJ', 'Benin', 'google.bj'],
            ['2064', 'BT', 'Bhutan', '--'],
            ['2068', 'BO', 'Bolivia', 'google.com.bo'],
            ['2070', 'BA', 'Bosnia and Herzegovina', 'google.ba'],
            ['2072', 'BW', 'Botswana', 'google.co.bw'],
            ['2076', 'BR', 'Brazil', 'google.com.br'],
            ['2096', 'BN', 'Brunei', 'google.com.bn'],
            ['2100', 'BG', 'Bulgaria', 'google.bg'],
            ['2854', 'BF', 'Burkina Faso', 'google.bf'],
            ['2108', 'BI', 'Burundi', 'google.bi'],
            ['2116', 'KH', 'Cambodia', 'google.com.kh'],
            ['2120', 'CM', 'Cameroon', 'google.cm'],
            ['2124', 'CA', 'Canada', 'google.ca'],
            ['2132', 'CV', 'Cape Verde', 'google.cv'],
            ['2535', 'BQ', 'Caribbean Netherlands', '--'],
            ['2140', 'CF', 'Central African Republic', '--'],
            ['2148', 'TD', 'Chad', '--'],
            ['2152', 'CL', 'Chile', '--'],
            ['2156', 'CN', 'China', 'google.com.hk'],
            ['2162', 'CX', 'Christmas Island', '--'],
            ['2166', 'CC', 'Cocos (Keeling) Islands', '--'],
            ['2170', 'CO', 'Colombia', 'google.com.co'],
            ['2174', 'KM', 'Comoros', '--'],
            ['2184', 'CK', 'Cook Islands', 'google.co.ck'],
            ['2188', 'CR', 'Costa Rica', 'google.co.cr'],
            ['2384', 'CI', 'Cote d`Ivoire ', 'google.ci '],
            ['2191', 'HR', 'Croatia', 'google.hr'],
            ['2531', 'CW', 'Curacao', '--'],
            ['2196', 'CY', 'Cyprus', 'google.com.cy'],
            ['2203', 'CZ', 'Czechia', 'google.cz'],
            ['2180', 'CD', 'Democratic Republic of the Congo', 'google.cg'],
            ['2208', 'DK', 'Denmark', 'google.dk'],
            ['2262', 'DJ', 'Djibouti', 'google.dj'],
            ['2212', 'DM', 'Dominica', 'google.dm'],
            ['2214', 'DO', 'Dominican Republic', 'google.com.do'],
            ['2218', 'EC', 'Ecuador', 'google.com.ec'],
            ['2818', 'EG', 'Egypt', 'google.com.eg'],
            ['2222', 'SV', 'El Salvador', 'google.com.sv'],
            ['2226', 'GQ', 'Equatorial Guinea', '--'],
            ['2232', 'ER', 'Eritrea', '--'],
            ['2233', 'EE', 'Estonia', 'google.ee'],
            ['2231', 'ET', 'Ethiopia', 'google.com.et'],
            ['2583', 'FM', 'Federated States of Micronesia', 'google.fm'],
            ['2242', 'FJ', 'Fiji', 'google.com.fj'],
            ['2246', 'FI', 'Finland', 'google.fi'],
            ['2250', 'FR', 'France', 'google.fr'],
            ['2258', 'PF', 'French Polynesia', '--'],
            ['2260', 'TF', 'French Southern and Antarctic Lands', '--'],
            ['2266', 'GA', 'Gabon', 'google.ga'],
            ['2268', 'GE', 'Georgia', 'google.ge'],
            ['2276', 'DE', 'Germany', 'google.de'],
            ['2288', 'GH', 'Ghana', 'google.com.gh'],
            ['2300', 'GR', 'Greece', 'google.gr'],
            ['2308', 'GD', 'Grenada', '--'],
            ['2316', 'GU', 'Guam', '--'],
            ['2320', 'GT', 'Guatemala', 'google.com.gt'],
            ['2831', 'GG', 'Guernsey', 'google.gg'],
            ['2324', 'GN', 'Guinea', '--'],
            ['2624', 'GW', 'Guinea-Bissau', '--'],
            ['2328', 'GY', 'Guyana', 'google.gy'],
            ['2332', 'HT', 'Haiti', 'google.ht'],
            ['2334', 'HM', 'Heard Island and McDonald Islands', '--'],
            ['2340', 'HN', 'Honduras', 'google.hn'],
            ['2348', 'HU', 'Hungary', 'google.hu'],
            ['2352', 'IS', 'Iceland', 'google.is'],
            ['2356', 'IN', 'India', 'google.co.in'],
            ['2360', 'ID', 'Indonesia', 'google.co.id'],
            ['2368', 'IQ', 'Iraq', 'google.iq'],
            ['2372', 'IE', 'Ireland', 'google.ie'],
            ['2376', 'IL', 'Israel', 'google.co.il'],
            ['2380', 'IT', 'Italy', 'google.it'],
            ['2388', 'JM', 'Jamaica', 'google.com.jm'],
            ['2392', 'JP', 'Japan', 'google.co.jp'],
            ['2832', 'JE', 'Jersey', 'google.je'],
            ['2400', 'JO', 'Jordan', 'google.jo'],
            ['2398', 'KZ', 'Kazakhstan', 'google.kz'],
            ['2404', 'KE', 'Kenya', 'google.co.ke'],
            ['2296', 'KI', 'Kiribati', 'google.ki'],
            ['2414', 'KW', 'Kuwait', 'google.com.kw'],
            ['2417', 'KG', 'Kyrgyzstan', 'google.kg'],
            ['2418', 'LA', 'Laos', 'google.la'],
            ['2428', 'LV', 'Latvia', 'google.lv'],
            ['2422', 'LB', 'Lebanon', 'google.com.lb'],
            ['2426', 'LS', 'Lesotho', 'google.co.ls'],
            ['2430', 'LR', 'Liberia', '--'],
            ['2434', 'LY', 'Libya', 'google.com.ly'],
            ['2438', 'LI', 'Liechtenstein', 'google.li'],
            ['2440', 'LT', 'Lithuania', 'google.lt'],
            ['2442', 'LU', 'Luxembourg', 'google.lu'],
            ['2807', 'MK', 'Macedonia (FYROM)', 'google.mk'],
            ['2450', 'MG', 'Madagascar', 'google.mg'],
            ['2454', 'MW', 'Malawi', 'google.mw'],
            ['2458', 'MY', 'Malaysia', 'google.com.my'],
            ['2462', 'MV', 'Maldives', 'google.mv'],
            ['2466', 'ML', 'Mali', 'google.ml'],
            ['2470', 'MT', 'Malta', 'google.com.mt'],
            ['2584', 'MH', 'Marshall Islands', '--'],
            ['2478', 'MR', 'Mauritania', '--'],
            ['2480', 'MU', 'Mauritius', 'google.mu'],
            ['2484', 'MX', 'Mexico', 'google.com.mx'],
            ['2498', 'MD', 'Moldova', 'google.md'],
            ['2492', 'MC', 'Monaco', '--'],
            ['2496', 'MN', 'Mongolia', 'google.mn'],
            ['2499', 'ME', 'Montenegro', 'google.me'],
            ['2504', 'MA', 'Morocco', 'google.co.ma'],
            ['2508', 'MZ', 'Mozambique', 'google.co.mz'],
            ['2104', 'MM', 'Myanmar (Burma)', 'google.com.mm'],
            ['2516', 'NA', 'Namibia', 'google.com.na'],
            ['2520', 'NR', 'Nauru', 'google.nr'],
            ['2524', 'NP', 'Nepal', 'google.com.np'],
            ['2528', 'NL', 'Netherlands', 'google.nl'],
            ['2540', 'NC', 'New Caledonia', '--'],
            ['2554', 'NZ', 'New Zealand', 'google.co.nz'],
            ['2558', 'NI', 'Nicaragua', 'google.com.ni'],
            ['2562', 'NE', 'Niger', 'google.ne'],
            ['2566', 'NG', 'Nigeria', 'google.com.ng'],
            ['2570', 'NU', 'Niue', 'google.nu'],
            ['2574', 'NF', 'Norfolk Island', 'google.com.nf'],
            ['2580', 'MP', 'Northern Mariana Islands', '--'],
            ['2578', 'NO', 'Norway', 'google.no'],
            ['2512', 'OM', 'Oman', 'google.com.om'],
            ['2586', 'PK', 'Pakistan', 'google.com.pk'],
            ['2585', 'PW', 'Palau', '--'],
            ['2591', 'PA', 'Panama', 'google.com.pa'],
            ['2598', 'PG', 'Papua New Guinea', '--'],
            ['2600', 'PY', 'Paraguay', 'google.com.py'],
            ['2604', 'PE', 'Peru', 'google.com.pe'],
            ['2608', 'PH', 'Philippines', 'google.com.ph'],
            ['2612', 'PN', 'Pitcairn Islands', 'google.pn'],
            ['2616', 'PL', 'Poland', 'google.pl'],
            ['2620', 'PT', 'Portugal', 'google.pt'],
            ['2634', 'QA', 'Qatar', 'google.com.qa'],
            ['2178', 'CG', 'Republic of the Congo', '--'],
            ['2642', 'RO', 'Romania', 'google.ro'],
            ['2643', 'RU', 'Russia', 'google.ru'],
            ['2646', 'RW', 'Rwanda', 'google.rw'],
            ['2654', 'SH', 'Saint Helena, Ascension and Tristan da Cunha', 'google.sh'],
            ['2659', 'KN', 'Saint Kitts and Nevis', '--'],
            ['2662', 'LC', 'Saint Lucia', '--'],
            ['2666', 'PM', 'Saint Pierre and Miquelon', '--'],
            ['2670', 'VC', 'Saint Vincent and the Grenadines', 'google.com.vc'],
            ['2882', 'WS', 'Samoa', 'google.ws'],
            ['2674', 'SM', 'San Marino', 'google.sm'],
            ['2678', 'ST', 'Sao Tome and Principe', 'google.st'],
            ['2682', 'SA', 'Saudi Arabia', 'google.com.sa'],
            ['2686', 'SN', 'Senegal', 'google.sn'],
            ['2688', 'RS', 'Serbia', 'google.rs'],
            ['2690', 'SC', 'Seychelles', 'google.sc'],
            ['2694', 'SL', 'Sierra Leone', 'google.com.sl'],
            ['2702', 'SG', 'Singapore', 'google.com.sg'],
            ['2534', 'SX', 'Sint Maarten', '--'],
            ['2703', 'SK', 'Slovakia', 'google.sk'],
            ['2705', 'SI', 'Slovenia', 'google.si'],
            ['2090', 'SB', 'Solomon Islands', 'google.com.sb'],
            ['2706', 'SO', 'Somalia', 'google.so'],
            ['2710', 'ZA', 'South Africa', 'google.co.za'],
            ['2239', 'GS', 'South Georgia and the South Sandwich Islands', '--'],
            ['2410', 'KR', 'South Korea', '--'],
            ['2724', 'ES', 'Spain', 'google.es'],
            ['2144', 'LK', 'Sri Lanka', 'google.lk'],
            ['2740', 'SR', 'Suriname', '--'],
            ['2748', 'SZ', 'Swaziland', '--'],
            ['2752', 'SE', 'Sweden', 'google.se'],
            ['2756', 'CH', 'Switzerland', 'google.ch'],
            ['2762', 'TJ', 'Tajikistan', 'google.com.tj'],
            ['2834', 'TZ', 'Tanzania', 'google.co.tz'],
            ['2764', 'TH', 'Thailand', 'google.co.th'],
            ['2044', 'BS', 'The Bahamas', 'google.bs'],
            ['2270', 'GM', 'The Gambia', 'google.gm'],
            ['2626', 'TL', 'Timor-Leste', 'google.tl'],
            ['2768', 'TG', 'Togo', 'google.tg'],
            ['2772', 'TK', 'Tokelau', 'google.tk'],
            ['2776', 'TO', 'Tonga', 'google.to'],
            ['2780', 'TT', 'Trinidad and Tobago', 'google.tt'],
            ['2788', 'TN', 'Tunisia', 'google.tn'],
            ['2792', 'TR', 'Turkey', 'google.com.tr'],
            ['2795', 'TM', 'Turkmenistan', 'google.tm'],
            ['2798', 'TV', 'Tuvalu', '--'],
            ['2800', 'UG', 'Uganda', 'google.co.ug'],
            ['2804', 'UA', 'Ukraine', 'google.com.ua'],
            ['2784', 'AE', 'United Arab Emirates', 'google.ae'],
            ['2826', 'GB', 'United Kingdom', 'google.co.uk'],
            ['2840', 'US', 'United States', 'google.com'],
            ['2581', 'UM', 'United States Minor Outlying Islands', '--'],
            ['2858', 'UY', 'Uruguay', 'google.com.uy'],
            ['2860', 'UZ', 'Uzbekistan', 'google.co.uz'],
            ['2548', 'VU', 'Vanuatu', 'google.vu'],
            ['2336', 'VA', 'Vatican City', '--'],
            ['2862', 'VE', 'Venezuela', 'google.co.ve'],
            ['2704', 'VN', 'Vietnam', 'google.com.vn'],
            ['2876', 'WF', 'Wallis and Futuna', '--'],
            ['2887', 'YE', 'Yemen', '--'],
            ['2894', 'ZM', 'Zambia', 'google.co.zm'],
            ['2716', 'ZW', 'Zimbabwe', 'google.co.zw'],
        ];
        if (id) {
            var domain;
            arr.forEach(function (row) {
                if (parseFloat(row[0].toString()).toFixed() == id) {
                    domain = row[3];
                    if (domain == '--') {
                        domain = 'google.com';
                    }
                }
            });
            return domain;
        } else {
            return arr;
        }
    }

    function alphabet(id) {
        var arr = [
            ['Arabic', 'ar', 1019, ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'و', 'ي', 'ﻩ', 'غ']], // Arabic
            ['Bulgarian', 'bg', 1020, ['а', 'б', 'в', 'г', 'д', 'е', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ь', 'ю', 'я']], // Bulgarian
            ['Catalan', 'ca', 1038, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'à', 'ç', 'è', 'é', 'í', 'ï', 'ò', 'ó', 'ú', 'ü']], // Catalan
            ['Chinese (simplified)', 'zh_CN', 1017, []], // Chinese(simplified), reserved
            ['Chinese (traditional)', 'zh_TW', 1018, []], // Chinese(traditional), reserved
            ['Croatian', 'hr', 1039, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'v', 'z', 'ć', 'č', 'đ', 'š', 'ž', 'ǆ', 'ǉ', 'ǌ']], // Croatian
            ['Czech', 'cs', 1021, ['a', 'b', 'c', 'ch', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'á', 'é', 'í', 'ó', 'ú', 'ý', 'č', 'ď', 'ě', 'ň', 'ř', 'š', 'ť', 'ů', 'ž']], // Czech
            ['Danish', 'da', 1009, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'æ', 'ø', 'å']], // Danish
            ['Dutch', 'nl', 1010, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']], // Dutch
            ['English', 'en', 1000, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']], // English
            ['Estonian', 'et', 1043, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'ä', 'õ', 'ö', 'ü', 'š', 'ž']], // Estonian
            ['Filipino', 'tl', 1042, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'ng', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'ñ']], // Filipino
            ['Finnish', 'fi', 1011, ['a', 'ä', 'å', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'ö', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']], // Finnish
            ['French', 'fr', 1002, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'à', 'â', 'æ', 'ç', 'è', 'é', 'ê', 'ë', 'î', 'ï', 'ô', 'ù', 'û', 'ü', 'ÿ', 'œ']], // French
            ['German', 'de', 1001, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'ß', 'ä', 'ö', 'ü']], // German
            ['Greek', 'el', 1022, ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'ς', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω']], // Greek
            ['Hebrew', 'iw', 1027, ['א', 'אֽ', 'אֿ', 'ב', 'ג', 'ד', 'ה', 'ו', 'וֹ', 'וּ', 'ז', 'ח', 'ט', 'י', 'ך', 'כ', 'ל', 'ם', 'מ', 'ן', 'נ', 'ס', 'ע', 'ף', 'פ', 'פּ', 'ץ', 'צ', 'ק', 'ר', 'ש', 'שׁ', 'שׂ', 'ת', 'תּ']], // Hebrew
            ['Hindi', 'hi', 1023, ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ऌ', 'ऍ', 'ऎ', 'ए', 'ऐ', 'ऑ', 'ऒ', 'ओ', 'औ', 'क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ', 'ट', 'ठ', 'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न', 'ऩ', 'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ऱ', 'ल', 'ळ', 'ऴ', 'व', 'श', 'ष', 'स', 'ह', 'ॐ', 'क़', 'ख़', 'ग़', 'ज़', 'ड़', 'ढ़', 'फ़', 'य़', 'ॠ', 'ॡ']], // Hindi
            ['Hungarian', 'hu', 1024, ['A', 'B', 'C', 'Cs', 'D', 'Dz', 'Dzs', 'E', 'F', 'G', 'Gy', 'H', 'I', 'J', 'K', 'L', 'Ly', 'M', 'N', 'Ny', 'O', 'P', 'Q', 'R', 'S', 'Sz', 'T', 'Ty', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Zs', 'Á', 'É', 'Ë', 'Í', 'Ó', 'Ö', 'Ú', 'Ü', 'Ő', 'Ű']], // Hungarian
            ['Icelandic', 'is', 1026, ['a', 'b', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'v', 'x', 'y', 'z', 'á', 'æ', 'é', 'í', 'ð', 'ó', 'ö', 'ú', 'ý', 'þ']], // Icelandic
            ['Indonesian', 'id', 1025, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']], // Indonesian
            ['Italian', 'it', 1004, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'z', 'à', 'è', 'é', 'ì', 'í', 'î', 'ò', 'ó', 'ù', 'ú']], // Italian
            ['Japanese', 'ja', 1005, ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と', 'な', 'に', 'ぬ', 'ね', 'の', 'は', 'ひ', 'ふ', 'へ', 'ほ', 'ま', 'み', 'む', 'め', 'も', 'や', 'ゆ', 'よ', 'ら', 'り', 'る', 'れ', 'ろ', 'わ', 'ゐ', 'ゑ', 'を', 'ん']], // Japanese
            ['Korean', 'ko', 1012, ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ', 'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ']], // Korean
            ['Latvian', 'lv', 1028, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'v', 'z', 'ā', 'č', 'ē', 'ģ', 'ī', 'ķ', 'ļ', 'ņ', 'š', 'ū', 'ž']], // Latvian
            ['Lithuanian', 'lt', 1029, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'v', 'y', 'z', 'ą', 'č', 'ė', 'ę', 'į', 'š', 'ū', 'ų', 'ž']], // Lithuanian
            ['Malay', 'ms', 1102, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']], // Malay
            ['Norwegian', 'no', 1013, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'å', 'æ', 'ø']], // Norwegian
            ['Persian', 'fa', 1064, ['ء', 'آ', 'أ', 'ئـ', 'ا', 'ب', 'بـ', 'ت', 'تـ', 'ث', 'ثـ', 'ج', 'جـ', 'ح', 'حـ', 'خ', 'خـ', 'د', 'ذ', 'ر', 'ز', 'س', 'سـ', 'ش', 'شـ', 'ص', 'صـ', 'ض', 'ضـ', 'ط', 'طـ', 'ظ', 'ظـ', 'ع', 'عـ', 'غ', 'غـ', 'ـأ', 'ـؤ', 'ـئ', 'ـئـ', 'ـا', 'ـب', 'ـبـ', 'ـت', 'ـتـ', 'ـث', 'ـثـ', 'ـج', 'ـجـ', 'ـح', 'ـحـ', 'ـخ', 'ـخـ', 'ـد', 'ـذ', 'ـر', 'ـز', 'ـس', 'ـسـ', 'ـش', 'ـشـ', 'ـص', 'ـصـ', 'ـض', 'ـضـ', 'ـط', 'ـطـ', 'ـظ', 'ـظـ', 'ـع', 'ـعـ', 'ـغ', 'ـغـ', 'ـف', 'ـفـ', 'ـق', 'ـقـ', 'ـل', 'ـلـ', 'ـم', 'ـمـ', 'ـن', 'ـنـ', 'ه', 'ـهـ', 'ـو', 'ـپ', 'ـپـ', 'ـچ', 'ـچـ', 'ـژ', 'ـک', 'ـکـ', 'ـگ', 'ـگـ', 'ـی', 'ـیـ', 'ف', 'فـ', 'ق', 'قـ', 'ل', 'لـ', 'م', 'مـ', 'ن', 'نـ', 'ه', 'هـ', 'و', 'پ', 'پـ', 'چ', 'چـ', 'ژ', 'ک', 'کـ', 'گ', 'گـ', 'ی', 'یـ']], // Persian
            ['Polish', 'pl', 1030, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'ó', 'ą', 'ć', 'ę', 'ł', 'ń', 'ś', 'ź', 'ż']], // Polish
            ['Portuguese', 'pt', 1014, ['a', 'b', 'c', 'ch', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'ç']], // Portuguese
            ['Romanian', 'ro', 1032, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'â', 'î', 'ă', 'ș', 'ț']], // Romanian
            ['Russian', 'ru', 1031, ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я']], // Russian
            ['Serbian', 'sr', 1035, ['а', 'б', 'в', 'г', 'д', 'е', 'ж', 'з', 'и', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'ђ', 'ј', 'љ', 'њ', 'ћ', 'џ']], // Serbian
            ['Slovak', 'sk', 1033, ['a', 'b', 'c', 'ch', 'd', 'dz', 'dž', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'á', 'ä', 'é', 'í', 'ó', 'ô', 'ú', 'ý', 'č', 'ď', 'ĺ', 'ľ', 'ň', 'ŕ', 'š', 'ť', 'ž']], // Slovak
            ['Slovenian', 'sl', 1034, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'v', 'z', 'č', 'š', 'ž']], // Slovenian
            ['Spanish', 'es', 1003, ['a', 'b', 'c', 'ch', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'll', 'm', 'n', 'o', 'p', 'q', 'r', 'rr', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'ñ']], // Spanish
            ['Swedish', 'sv', 1015, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'ä', 'å', 'ö', 'š', 'ž']], // Swedish
            ['Thai', 'th', 1044, ['ก', 'ข', 'ฃ', 'ค', 'ฅ', 'ฆ', 'ง', 'จ', 'ฉ', 'ช', 'ซ', 'ฌ', 'ญ', 'ฎ', 'ฏ', 'ฐ', 'ฑ', 'ฒ', 'ณ', 'ด', 'ต', 'ถ', 'ท', 'ธ', 'น', 'บ', 'ป', 'ผ', 'ฝ', 'พ', 'ฟ', 'ภ', 'ม', 'ย', 'ร', 'ฤ', 'ฤๅ', 'ล', 'ฦ', 'ว', 'ศ', 'ษ', 'ส', 'ห', 'ฬ', 'อ', 'อิ', 'อี', 'อุ', 'อู', 'ฮ', 'ะ', 'า', 'ึๅ', 'เ', 'โ']], // Thai
            ['Turkish', 'tr', 1037, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'v', 'y', 'z', 'ç', 'ö', 'ü', 'ğ', 'ı', 'ş']], // Turkish
            ['Ukrainian', 'uk', 1036, ['є', 'і', 'ї', 'а', 'б', 'в', 'г', 'д', 'е', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ь', 'ю', 'я', 'ґ']], // Ukrainian
            ['Urdu', 'ur', 1041, ['ء', 'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ل', 'م', 'ن', 'و', 'ٹ', 'پ', 'چ', 'ڈ', 'ڑ', 'ژ', 'ک', 'گ', 'ھ', 'ہ', 'ی', 'ے', 'ﮩ']], // Urdu
            ['Vietnamese', 'vi', 1040, ['a', 'ă', 'â', 'b', 'c', 'd', 'đ', 'e', 'ê', 'g', 'h', 'i', 'k', 'l', 'm', 'n', 'o', 'ô', 'ơ', 'p', 'q', 'r', 's', 't', 'u', 'ư', 'v', 'x', 'y']] // Vietnamese
        ];
        var alphabet = [];
        arr.forEach(function (row) {
            if (row[2].toFixed() == id) {
                alphabet = row[3];
            }
        });
        return alphabet;
    }

    function ensureAccountLabels() {
        function getAccountLabelNames() {
            var labelNames = [];
            var iterator = AdWordsApp.labels()
                .get();
            while (iterator.hasNext()) {
                labelNames.push(iterator.next().getName());
            }
            return labelNames;
        }
        var labelNames = getAccountLabelNames();
        if (labelNames.indexOf(CONFIG.scriptLabel) == -1) {
            AdWordsApp.createLabel(CONFIG.scriptLabel);
        }
    }
}
