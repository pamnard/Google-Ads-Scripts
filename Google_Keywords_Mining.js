function main() {

    // In progress 

    var parseCountry = 'IDN'; // In ISO 3166-1 alpha-3 format
    var parseLanguage = 'id'; // In ISO 639-1 format

    function setGoogleSettings(countrycode, langcode) {

    }

    var regionGoogle = [
        {
            code: 'AFG',
            domain: 'google.com.af',
            country: 'Afghanistan',
            languages: ['fa', 'ps'] // Persian\Farsi, Pushto
        }, {
            code: 'DZA',
            domain: 'google.dz',
            country: 'Algeria',
            languages: ['fr', 'ar'] // French, Arabic
        }, {
            code: 'ASM',
            domain: 'google.as',
            country: 'American Samoa',
            languages: ['en'] // English
        }, {
            code: 'AND',
            domain: 'google.ad',
            country: 'Andorra',
            languages: ['ca'] // Catalan
        }, {
            code: 'AGO',
            domain: 'google.co.ao',
            country: 'Angola',
            languages: ['pt', 'kg'] // Portuguese, Kongo
        }, {
            code: 'AIA',
            domain: 'google.com.ai',
            country: 'Anguilla',
            languages: ['en'] // English
        }, {
            code: 'ATG',
            domain: 'google.com.ag',
            country: 'Antigua and Barbuda',
            languages: ['en'] // English
        }, {
            code: 'ARG',
            domain: 'google.com.ar',
            country: 'Argentina',
            languages: ['es'] // Español (Latinoamérica)
        }, {
            code: 'ARM',
            domain: 'google.am',
            country: 'Armenia',
            languages: ['hy'] // Armenian
        }, {
            code: 'AUS',
            domain: 'google.com.au',
            country: 'Australia',
            languages: ['en'] // English
        }, {
            code: 'AUT',
            domain: 'google.at',
            country: 'Austria',
            languages: ['de'] // German
        }, {
            code: 'AZE',
            domain: 'google.az',
            country: 'Azerbaijan',
            languages: ['az, ru'] // Azerbaijani, Russian
        }, {
            code: 'BHS',
            domain: 'google.bs',
            country: 'Bahamas',
            languages: ['en'] // English
        }, {
            code: 'BHR',
            domain: 'google.com.bh',
            country: 'Bahrain',
            languages: ['ar'] // Arabic
        }, {
            code: 'BGD',
            domain: 'google.com.bd',
            country: 'Bangladesh',
            languages: ['bn'] // Bengali
        }, {
            code: 'BLR',
            domain: 'google.by',
            country: 'Belarus',
            languages: ['be', 'ru'] // Belarusian, Russian
        }, {
            code: 'BEL',
            domain: 'google.be',
            country: 'Belgium',
            languages: ['nl', 'fr'] // Dutch, French
        }, {
            code: 'BLZ',
            domain: 'google.com.bz',
            country: 'Belize',
            languages: ['es', 'en'] // Español (Latinoamérica), English
        }, {
            code: 'BEN',
            domain: 'google.bj',
            country: 'Benin',
            languages: ['fr', 'yo'] // French, Yoruba
        }, {
            code: 'BOL',
            domain: 'google.com.bo',
            country: 'Bolivia',
            languages: ['es', 'qu'] // Español (Latinoamérica), Quechua
        }, {
            code: 'BIH',
            domain: 'google.ba',
            country: 'Bosnia and Herzegovina',
            languages: ['bs', 'sr'] // Bosnian, Serbian
        }, {
            code: 'BWA',
            domain: 'google.co.bw',
            country: 'Botswana',
            languages: ['tn'] // Tswana
        }, {
            code: 'BRA',
            domain: 'google.com.br',
            country: 'Brazil',
            languages: ['pt'] // Portuguese (Brasil)
        }, {
            code: 'BRN',
            domain: 'google.com.bn',
            country: 'Brunei Darussalam',
            languages: ['ms', 'cn'] // Malay, Chinese
        }, {
            code: 'BGR',
            domain: 'google.bg',
            country: 'Bulgaria',
            languages: ['bg'] // Bulgarian
        }, {
            code: 'BFA',
            domain: 'google.bf',
            country: 'Burkina Faso',
            languages: ['fr'] // French
        }, {
            code: 'BDI',
            domain: 'google.bi',
            country: 'Burundi',
            languages: ['fr', 'sw'] // French, Swahili
        }, {
            code: 'KHM',
            domain: 'google.com.kh',
            country: 'Cambodia',
            languages: ['km'] // Khmer
        }, {
            code: 'CMR',
            domain: 'google.cm',
            country: 'Cameroon',
            languages: ['fr'] // French
        }, {
            code: 'CAN',
            domain: 'google.ca',
            country: 'Canada',
            languages: ['en', 'fr'] // English, French
        }, {
            code: 'CPV',
            domain: 'google.cv',
            country: 'Cape Verde',
            languages: ['pt'] // Portuguese
        }, {
            code: 'CAF',
            domain: 'google.cf',
            country: 'Central African Republic',
            languages: ['fr'] // French
        }, {
            code: 'TCD',
            domain: 'google.td',
            country: 'Chad',
            languages: ['fr', 'ar'] // French, Arabic
        }, {
            code: 'CHL',
            domain: 'google.cl',
            country: 'Chile',
            languages: ['es'] // Español (Latinoamérica)
        }, {
            code: 'CHN',
            domain: 'google.cn',
            country: '* China(Google.hk)',
            languages: ['zh'] //  Chinese
        }, {
            code: 'COL',
            domain: 'google.com.co',
            country: 'Colombia',
            languages: ['es'] // Español (Latinoamérica)
        }, {
            code: 'COG',
            domain: 'google.cg',
            country: 'Congo',
            languages: ['fr'] // French
        }, {
            code: 'COD',
            domain: 'google.cd',
            country: 'Congo, The Democratic Republic of the',
            languages: ['fr', 'sw'] // French, Swahili
        }, {
            code: 'COK',
            domain: 'google.co.ck',
            country: 'Cook Islands',
            languages: ['en'] // English
        }, {
            code: 'CRI',
            domain: 'google.co.cr',
            country: 'Costa Rica',
            languages: ['es'] // Español (Latinoamérica)
        }, {
            code: 'CIV',
            domain: 'google.ci',
            country: 'Cote d `Ivoire',
            languages: ['fr'] // French
        }, {
            code: 'HRV',
            domain: 'google.hr',
            country: 'Croatia',
            languages: ['hr'] // Croatian
        }, {
            code: 'CUB',
            domain: 'google.com.cu',
            country: 'Cuba',
            languages: ['es'] // Español (Latinoamérica)
        }, {
            code: 'CYP',
            domain: 'google.com.cy',
            country: 'Cyprus',
            languages: ['en', 'el'] // English, Greek
        }, {
            code: 'CZE',
            domain: 'google.cz',
            country: 'Czech Republic',
            languages: ['cs'] // Czech
        }, {
            code: 'DNK',
            domain: 'google.dk',
            country: 'Denmark',
            languages: ['da', 'fo'] // Danish, Faroese
        }, {
            code: 'DJI',
            domain: 'google.dj',
            country: 'Djibouti',
            languages: ['fr', 'ar'] // French, Arabic
        }, {
            code: 'DMA',
            domain: 'google.dm',
            country: 'Dominica',
            languages: ['en'] // English
        }, {
            code: 'DOM',
            domain: 'google.com.do',
            country: 'Dominican Republic',
            languages: ['es'] // Español (Latinoamérica)
        }, {
            code: 'ECU',
            domain: 'google.com.ec',
            country: 'Ecuador',
            languages: ['es'] // Español (Latinoamérica)
        }, {
            code: 'EGY',
            domain: 'google.com.eg',
            country: 'Egypt',
            languages: ['ar'] // Arabic
        }, {
            code: 'SLV',
            domain: 'google.com.sv',
            country: 'El Salvador',
            languages: ['es'] // Español (Latinoamérica)
        }, {
            code: 'EST',
            domain: 'google.ee',
            country: 'Estonia',
            languages: ['et', 'ru'] // Estonian, Russian
        }, {
            code: 'ETH',
            domain: 'google.com.et',
            country: 'Ethiopia',
            languages: ['am', 'ti'] // Amharic, Tigrinya
        }, {
            code: 'FJI',
            domain: 'google.com.fj',
            country: 'Fiji',
            languages: ['en'] // English
        }, {
            code: 'FIN',
            domain: 'google.fi',
            country: 'Finland',
            languages: ['fi', 'sv'] // Finnish, Swedish
        }, {
            code: 'FSM',
            domain: 'google.fm',
            country: 'Micronesia',
            languages: ['en'] // English
        }, {
            code: 'FRA',
            domain: 'google.fr',
            country: 'France',
            languages: ['fr'] // French
        }, {
            code: 'GAB',
            domain: 'google.ga',
            country: 'Gabon',
            languages: ['fr'] // French
        }, {
            code: 'GMB',
            domain: 'google.gm',
            country: 'Gambia',
            languages: ['en', 'wo'] // English, Wolof
        }, {
            code: 'GEO',
            domain: 'google.ge',
            country: 'Georgia',
            languages: ['ka'] // Georgian
        }, {
            code: 'DEU',
            domain: 'google.de',
            country: 'Germany',
            languages: ['de'] // German
        }, {
            code: 'GHA',
            domain: 'google.com.gh',
            country: 'Ghana',
            languages: ['en', 'ha'] // English, Hausa
        }, {
            code: 'GIB',
            domain: 'google.com.gi',
            country: 'Gibraltar',
            languages: ['en', 'es'] // English, Spanish
        }, {
            code: 'GRC',
            domain: 'google.gr',
            country: 'Greece',
            languages: ['el'] // Greek
        }, {
            code: 'GRL',
            domain: 'google.gl',
            country: 'Greenland',
            languages: ['da'] // Danish
        }, {
            code: 'GLP',
            domain: 'google.gp',
            country: 'Guadeloupe',
            languages: ['fr'] // French
        }, {
            code: 'GTM',
            domain: 'google.com.gt',
            country: 'Guatemala',
            languages: ['es'] // Español (Latinoamérica)
        }, {
            code: 'GGY',
            domain: 'google.gg',
            country: 'Guernsey',
            languages: ['en', 'fr'] // English, French
        }, {
            code: 'GUY',
            domain: 'google.gy',
            country: 'Guyana',
            languages: ['en'] // English
        }, {
            code: 'HTI',
            domain: 'google.ht',
            country: 'Haiti',
            languages: ['fr', 'ht'] // French, Haitian
        }, {
            code: 'HND',
            domain: 'google.hn',
            country: 'Honduras',
            languages: ['es'] // Español (Latinoamérica)
        }, {
            code: 'HKG',
            domain: 'google.com.hk',
            country: 'Hong Kong',
            languages: ['zh'] // Chinese(Traditional)
        }, {
            code: 'HUN',
            domain: 'google.hu',
            country: 'Hungary',
            languages: ['hu'] // Hungarian
        }, {
            code: 'ISL',
            domain: 'google.is',
            country: 'Iceland',
            languages: ['is'] // Icelandic
        }, {
            code: 'IND',
            domain: 'google.co.in',
            country: 'India',
            languages: ['en', 'hi'] // English, Hindi
        }, {
            code: 'IDN',
            domain: 'google.co.id',
            country: 'Indonesia',
            languages: ['id', 'jw'] // Indonesian, Basa Jawa
        }, {
            code: 'IRQ',
            domain: 'google.iq',
            country: 'Iraq',
            languages: ['ckb', 'ar'] // Kurdish, Arabic
        }, {
            code: 'IRL',
            domain: 'google.ie',
            country: 'Ireland',
            languages: ['en', 'ga'] // English, Irish
        }, {
            code: 'IMN',
            domain: 'google.im',
            country: 'Isle of Man',
            languages: ['en'] // English
        }, {
            code: 'ISR',
            domain: 'google.co.il',
            country: 'Israel',
            languages: ['ar', 'iw'] // Arabic, Hebrew
        }, {
            code: 'ITA',
            domain: 'google.it',
            country: 'Italy',
            languages: ['it'] // Italian
        }, {
            code: 'JAM',
            domain: 'google.com.jm',
            country: 'Jamaica',
            languages: ['en'] // English
        }, {
            code: 'JPN',
            domain: 'google.co.jp',
            country: 'Japan',
            languages: ['ja'] // Japanese
        }, {
            code: 'JEY',
            domain: 'google.je',
            country: 'Jersey',
            languages: ['fr', 'em'] // French, English
        }, {
            code: 'JOR',
            domain: 'google.jo',
            country: 'Jordan',
            languages: ['ar'] // Arabic
        }, {
            code: 'KAZ',
            domain: 'google.kz',
            country: 'Kazakhstan',
            languages: ['kk', 'ru'] // Kazakh, Russian
        }, {
            code: 'KEN',
            domain: 'google.co.ke',
            country: 'Kenya',
            languages: ['sw'] // Swahili
        }, {
            code: 'KIR',
            domain: 'google.ki',
            country: 'Kiribati',
            languages: ['en'] // English
        }, {
            code: 'KOR',
            domain: 'google.co.kr',
            country: 'Korea, Republic of',
            languages: ['ko'] // Korean
        }, {
            code: 'KWT',
            domain: 'google.com.kw',
            country: 'Kuwait',
            languages: ['ar'] // Arabic
        }, {
            code: 'KGZ',
            domain: 'google.kg',
            country: 'Kyrgyzstan',
            languages: ['ky', 'ru'] // Kyrgyz, Russian
        }, {
            code: 'LAO',
            domain: 'google.la',
            country: 'Lao People`s Democratic Republic',
            languages: ['lo'] // Lao
        }, {
            code: 'LVA',
            domain: 'google.lv',
            country: 'Latvia',
            languages: ['lv', 'lt'] // Latvian, Lithuanian
        }, {
            code: 'LBN',
            domain: 'google.com.lb',
            country: 'Lebanon',
            languages: ['ar', 'fr'] // Arabic, French
        }, {
            code: 'LSO',
            domain: 'google.co.ls',
            country: 'Lesotho',
            languages: ['st', 'en'] // Southern Sotho, English
        }, {
            code: 'LBY',
            domain: 'google.com.ly',
            country: 'Libya',
            languages: ['ar', 'it'] // Arabic, Italian
        }, {
            code: 'LIE',
            domain: 'google.li',
            country: 'Liechtenstein',
            languages: [' de'] // German
        }, {
            code: 'LTU',
            domain: 'google.lt',
            country: 'Lithuania',
            languages: ['lt'] // Lithuanian
        }, {
            code: 'LUX',
            domain: 'google.lu',
            country: 'Luxembourg',
            languages: ['de', 'fr'] // German, French
        }, {
            code: 'MKD',
            domain: 'google.mk',
            country: 'Macedonia, The Former Yugoslav Republic of',
            languages: ['mk'] // Macedonian
        }, {
            code: 'MDG',
            domain: 'google.mg',
            country: 'Madagascar',
            languages: ['mg', 'fr'] // Malagasy, French
        }, {
            code: 'MWI',
            domain: 'google.mw',
            country: 'Malawi',
            languages: ['ny'] // Nyanja
        }, {
            code: 'MYS',
            domain: 'google.com.my',
            country: 'Malaysia',
            languages: ['ms'] // Malay
        }, {
            code: 'MDV',
            domain: 'google.mv',
            country: 'Maldives',
            languages: ['en'] // English
        }, {
            code: 'MLI',
            domain: 'google.ml',
            country: 'Mali',
            languages: ['fr'] // French
        }, {
            code: 'MLT',
            domain: 'google.com.mt',
            country: 'Malta',
            languages: ['mt', 'en'] // Maltese, English
        }, {
            code: 'MUS',
            domain: 'google.mu',
            country: 'Mauritius',
            languages: ['en', 'fr'] // English, French
        }, {
            code: 'MEX',
            domain: 'google.com.mx',
            country: 'Mexico',
            languages: ['es'] // Español (Latinoamérica)
        }, {
            code: 'MDA',
            domain: 'google.md',
            country: 'Moldova, Republic of',
            languages: ['mo', 'ru'] // Moldovan, Russian
        }, {
            code: 'MNG',
            domain: 'google.mn',
            country: 'Mongolia',
            languages: ['mn'] // Mongolian
        }, {
            code: 'MNE',
            domain: 'google.me',
            country: 'Montenegro',
            languages: ['sr'] // Serbian
        }, {
            code: 'MSR',
            domain: 'google.ms',
            country: 'Montserrat',
            languages: ['en'] // English
        }, {
            code: 'MAR',
            domain: 'google.co.ma',
            country: 'Morocco',
            languages: ['fr', 'ar'] // French, Arabic
        }, {
            code: 'MOZ',
            domain: 'google.co.mz',
            country: 'Mozambique',
            languages: ['pt', 'sw'] // Portuguese, Swahili
        }, {
            code: 'NAM',
            domain: 'google.com.na',
            country: 'Namibia',
            languages: ['en', 'ar'] // English, Afrikaans
        }, {
            code: 'NRU',
            domain: 'google.nr',
            country: 'Nauru',
            languages: ['en'] // English
        }, {
            code: 'NPL',
            domain: 'google.com.np',
            country: 'Nepal',
            languages: ['ne'] // Nepali
        }, {
            code: 'NLD',
            domain: 'google.nl',
            country: 'Netherlands',
            languages: ['nl', 'en'] // Dutch, English
        }, {
            code: 'NZL',
            domain: 'google.co.nz',
            country: 'New Zealand',
            languages: ['en', 'mi'] // English, Māori
        }, {
            code: 'NIC',
            domain: 'google.com.ni',
            country: 'Nicaragua',
            languages: ['es'] // Español (Latinoamérica)
        }, {
            code: 'NER',
            domain: 'google.ne',
            country: 'Niger',
            languages: ['fr', 'ha'] // French, Hausa
        }, {
            code: 'NGA',
            domain: 'google.com.ng',
            country: 'Nigeria',
            languages: ['en', 'ha'] // English, Hausa
        }, {
            code: 'NIU',
            domain: 'google.nu',
            country: 'Niue',
            languages: ['en'] // English
        }, {
            code: 'NFK',
            domain: 'google.com.nf',
            country: 'Norfolk Island',
            languages: ['en'] // English
        }, {
            code: 'NOR',
            domain: 'google.no',
            country: 'Norway',
            languages: ['no', 'nn'] // Norwegian, Norwegian Nynorsk
        }, {
            code: 'OMN',
            domain: 'google.com.om',
            country: 'Oman',
            languages: ['ar'] // Arabic
        }, {
            code: 'PAK',
            domain: 'google.com.pk',
            country: 'Pakistan',
            languages: ['en', 'ur'] // English, Urdu
        }, {
            code: 'PSE',
            domain: 'google.ps',
            country: 'Palestine, State of',
            languages: ['ar'] // Arabic
        }, {
            code: 'PAN',
            domain: 'google.com.pa',
            country: 'Panama',
            languages: ['es'] // Español (Latinoamérica)
        }, {
            code: 'PRY',
            domain: 'google.com.py',
            country: 'Paraguay',
            languages: ['es'] // Español (Latinoamérica)
        }, {
            code: 'PER',
            domain: 'google.com.pe',
            country: 'Peru',
            languages: ['es', 'qu'] // Español (Latinoamérica), Quechua
        }, {
            code: 'PHL',
            domain: 'google.com.ph',
            country: 'Philippines',
            languages: ['tl'] // Tagalog
        }, {
            code: 'PCN',
            domain: 'google.pn',
            country: 'Pitcairn',
            languages: ['en'] // English
        }, {
            code: 'POL',
            domain: 'google.pl',
            country: 'Poland',
            languages: ['pl'] // Polish
        }, {
            code: 'PRT',
            domain: 'google.pt',
            country: 'Portugal',
            languages: ['pt'] // Portuguese
        }, {
            code: 'PRI',
            domain: 'google.com.pr',
            country: 'Puerto Rico',
            languages: ['es'] // Español (Latinoamérica)
        }, {
            code: 'QAT',
            domain: 'google.com.qa',
            country: 'Qatar',
            languages: ['ar'] // Arabic
        }, {
            code: 'ROU',
            domain: 'google.ro',
            country: 'Romania',
            languages: ['ro', 'hu'] // Romanian, Hungarian
        }, {
            code: 'RUS',
            domain: 'google.ru',
            country: 'Russia',
            languages: ['ru'] // Russian
        }, {
            code: 'RWA',
            domain: 'google.rw',
            country: 'Rwanda',
            languages: ['en', 'fr'] // English, French
        }, {
            code: 'SHN',
            domain: 'google.sh',
            country: 'Saint Helena',
            languages: ['en'] // English
        }, {
            code: 'VCT',
            domain: 'google.com.vc',
            country: 'Saint Vincent and the Grenadines',
            languages: ['en'] // English
        }, {
            code: 'WSM',
            domain: 'google.ws',
            country: 'Samoa',
            languages: ['en'] // English
        }, {
            code: 'SMR',
            domain: 'google.sm',
            country: 'San Marino',
            languages: ['it'] // Italian
        }, {
            code: 'STP',
            domain: 'google.st',
            country: 'Sao Tome and Principe',
            languages: ['pt'] // Portuguese
        }, {
            code: 'SAU',
            domain: 'google.com.sa',
            country: 'Saudi Arabia',
            languages: ['ar'] // Arabic
        }, {
            code: 'SEN',
            domain: 'google.sn',
            country: 'Senegal',
            languages: ['fr', 'wo'] // French, Wolof
        }, {
            code: 'SRB',
            domain: 'google.rs',
            country: 'Serbia',
            languages: ['sr'] // Serbian
        }, {
            code: 'SYC',
            domain: 'google.sc',
            country: 'Seychelles',
            languages: ['crs', 'fr'] // Kreol Seselwa, French
        }, {
            code: 'SLE',
            domain: 'google.com.sl',
            country: 'Sierra Leone',
            languages: ['en', 'kri'] // English, Krio
        }, {
            code: 'SGP',
            domain: 'google.com.sg',
            country: 'Singapore',
            languages: ['en', 'cn'] // English, Chinese (Simplified)'
        }, {
            code: 'SVK',
            domain: 'google.sk',
            country: 'Slovakia',
            languages: ['sk'] // Slovak
        }, {
            code: 'SVN',
            domain: 'google.si',
            country: 'Slovenia',
            languages: ['sl'] // Slovene
        }, {
            code: 'SLB',
            domain: 'google.com.sb',
            country: 'Solomon Islands',
            languages: ['en'] // English
        }, {
            code: 'SOM',
            domain: 'google.so',
            country: 'Somalia',
            languages: ['so', 'ar'] // Somali, Arabic
        }, {
            code: 'ZAF',
            domain: 'google.co.za',
            country: 'South Africa',
            languages: ['af', 'st'] // Afrikaans, Southern Sotho or Sesotho
        }, {
            code: 'ESP',
            domain: 'google.es',
            country: 'Spain',
            languages: ['es', 'ca'] // Spanish, Catalan
        }, {
            code: 'LKA',
            domain: 'google.lk',
            country: 'Sri Lanka',
            languages: ['en', 'si'] // English, Sinhalese
        }, {
            code: 'SWE',
            domain: 'google.se',
            country: 'Sweden',
            languages: ['sv'] // Swedish
        }, {
            code: 'CHE',
            domain: 'google.ch',
            country: 'Switzerland',
            languages: ['de', 'fr'] // German, French
        }, {
            code: 'TWN',
            domain: 'google.com.tw',
            country: 'Taiwan, Province of China',
            languages: ['zh'] // Chinese
        }, {
            code: 'TJK',
            domain: 'google.com.tj',
            country: 'Tajikistan',
            languages: ['tg', 'ru'] // Tajik, Russian
        }, {
            code: 'TZA',
            domain: 'google.co.tz',
            country: 'Tanzania, United Republic of',
            languages: ['sw'] // Swahili
        }, {
            code: 'THA',
            domain: 'google.co.th',
            country: 'Thailand',
            languages: ['th'] // Thai
        }, {
            code: 'TLS',
            domain: 'google.tl',
            country: 'Timor-Leste',
            languages: ['pt'] // Portuguese
        }, {
            code: 'TGO',
            domain: 'google.tg',
            country: 'Togo',
            languages: ['fr', 'ee'] // French, Ewe
        }, {
            code: 'TKL',
            domain: 'google.tk',
            country: 'Tokelau',
            languages: ['en'] // English
        }, {
            code: 'TON',
            domain: 'google.to',
            country: 'Tonga',
            languages: ['en', 'to'] // English, Tonga
        }, {
            code: 'TTO',
            domain: 'google.tt',
            country: 'Trinidad and Tobago',
            languages: ['en', 'hi'] // English, Hindi
        }, {
            code: 'TUN',
            domain: 'google.tn',
            country: 'Tunisia',
            languages: ['ar', 'fr'] // Arabic, French
        }, {
            code: 'TUR',
            domain: 'google.com.tr',
            country: 'Turkey',
            languages: ['tr'] // Turkish
        }, {
            code: 'TKM',
            domain: 'google.tm',
            country: 'Turkmenistan',
            languages: ['tk', 'ru'] // Turkmen, Russian
        }, {
            code: 'UGA',
            domain: 'google.co.ug',
            country: 'Uganda',
            languages: ['lg', 'sw'] // Ganda, Swahili
        }, {
            code: 'UKR',
            domain: 'google.com.ua',
            country: 'Ukraine',
            languages: ['uk', 'ru'] // Ukrainian, Russian
        }, {
            code: 'ARE',
            domain: 'google.ae',
            country: 'United Arab Emirates',
            languages: ['ar', 'fa'] // Arabic, Persian
        }, {
            code: 'GBR',
            domain: 'google.co.uk',
            country: 'United Kingdom',
            languages: ['en'] // English
        }, {
            code: 'USA',
            domain: 'google.com',
            country: 'United States',
            languages: ['en'] // English
        }, {
            code: 'URY',
            domain: 'google.com.uy',
            country: 'Uruguay',
            languages: ['es'] // Español (Latinoamérica)
        }, {
            code: 'UZB',
            domain: 'google.co.uz',
            country: 'Uzbekistan',
            languages: ['uz', 'ru'] // Uzbek, Russian
        }, {
            code: 'VUT',
            domain: 'google.vu',
            country: 'Vanuatu',
            languages: ['en', 'fr'] // English, French
        }, {
            code: 'VEN',
            domain: 'google.co.ve',
            country: 'Venezuela, Bolivarian Republic of',
            languages: ['es'] // Español (Latinoamérica)
        }, {
            code: 'VNM',
            domain: 'google.com.vn',
            country: 'Viet Nam',
            languages: ['vi', 'fr'] // Vietnamese, French
        }, {
            code: 'VGB',
            domain: 'google.vg',
            country: 'Virgin Islands, British',
            languages: ['en'] // English
        }, {
            code: 'VIR',
            domain: 'google.co.vi',
            country: 'Virgin Islands, U.S.',
            languages: ['en'] // English
        }, {
            code: 'ZMB',
            domain: 'google.co.zm',
            country: 'Zambia',
            languages: ['en', 'ny'] // English, Nyanja
        }, {
            code: 'ZWE',
            domain: 'google.co.zw',
            country: 'Zimbabwe',
            languages: ['en', 'sn'] // English, Shona
        }
    ];


    var alphabet = {
        /*af - Afrikaans
        am - Amharic
        ar - Arabic
        bg - Bulgarian
        bn - Bengali
        bs - Bosnian
        ca - Catalan; Valencian
        crs - Kreol Seselwa
        cs - Czech
        de - German
        ee - Ewe
        es - Español (Latinoamérica)
        es - Spanish; Castilian
        et - Estonian
        fa - Persian
        fo - Faroese
        fr - French
        ga - Irish
        ha - Hausa
        hi - Hindi
        hr - Croatian
        ht - Haitian; Haitian Creole or Kreyòl Ayisyen
        hu - Hungarian
        hy - Armenian
        id - Indonesian
        in - Lingala
        is - Icelandic
        it - Italian
        iw - Hebrew
        ja - Japanese
        jw - Basa Jawa
        ka - Georgian
        kg - Kongo
        kk - Kazakh
        km - Khmer
        ko - Korean
        kri - Krio
        ky - Kyrgyz
        lg - Ganda
        lo - Lao
        lt - Lithuanian
        lv - Latvian
        mg - Malagasy
        mi - Māori
        mk - Macedonian
        mn - Mongolian
        mo - Moldovan
        mt - Maltese
        ne - Nepali
        nl - Dutch
        nn - Norwegian Nynorsk
        no - Norwegian
        ny - Chichewa; Chewa; Nyanja
        pl - Polish
        ps - Pashto, Pushto
        pt-BR - Portuguese (Brasil)
        pt-PT - Portuguese
        qu - Quechua
        ro - Romanian, Moldavian, Moldovan
        si - Sinhala, Sinhalese
        sk - Slovak
        sl - Slovene
        sn - Shona
        so - Somali
        sr - Serbian
        sr-ME - Montenegro - Serbian (Latin)
        st - Southern Sotho
        st - Southern Sotho or Sesotho
        sv - Swedish
        sw - Swahili
        sw - Swahili or Kiswahilior Kiswahili
        tg - Tajik
        th - Thai
        ti - Tigrinya
        tk - Turkmen
        tl - Tagalog
        tn - Tswana
        to - Tonga (Tonga Islands)
        tr - Turkish
        uk - Ukrainian
        ur - Urdu
        wo - Wolof
        yo - Yoruba
        zh - Chinese
        zh-CN - Chinese (Simplified Han)
        zh-TW - Chinese (Traditional Han)*/
        az = ['a', 'b', 'c', 'ç', 'd', 'e', 'ə', 'f', 'g', 'ğ', 'h', 'x', 'ı', 'i', 'j', 'k', 'q', 'l', 'm', 'n', 'o', 'ö', 'p', 'r', 's', 'ş', 't', 'u', 'ü', 'v', 'y', 'z'], // Azerbaijani
        ckb = ['a', 'b', 'c', 'ç', 'd', 'e', 'ê', 'f', 'g', 'h', 'i', 'î', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 'ş', 't', 'u', 'û', 'v', 'w', 'x', 'y', 'z'], // Kurdish
        be = ['a', 'b', 'c', 'ć', 'č', 'd', 'e', 'ě', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'ľ', 'm', 'n', 'ň', 'o', 'p', 'r', 's', 'ś', 'š', 't', 'u', 'ŭ', 'y', 'z', 'ź', 'ž'], // Belarusian
        da = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'æ', 'ø', 'å'], // Danish
        el = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'ς', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω'], // Greek
        en = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'], // English
        fi = ['a', 'ä', 'å', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'ö', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'], // Finnish
        ms = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'], // Malay
        ru = ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я'], // Russian
        vi = ['a', 'ă', 'â', 'b', 'c', 'd', 'đ', 'e', 'ê', 'g', 'h', 'i', 'k', 'l', 'm', 'n', 'o', 'ô', 'ơ', 'p', 'q', 'r', 's', 't', 'u', 'ư', 'v', 'x', 'y'], // Vietnamese
        uz = ['а', 'b', 'd', 'е', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'о', 'p', 'q', 'r', 's', 't', 'u', 'v', 'x', 'y', 'z', 'oʻ', 'gʻ', 'sh', 'ch', 'ng'] // Uzbek
    }
}
