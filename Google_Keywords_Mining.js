function main() {

    var parseCountry = ''; // In ISO 3166-1 alpha-3 format
    var parseLanguage = ''; // In ISO 639-1 format
    // In progress 
    var regionGoogle = {
        {
            code: 'AFG',
            domain: 'google.com.af',
            country: 'Afghanistan',
            languages: ['fa', 'ps'] // Persian, Pushto
        } {
            code: 'DZA',
            domain: 'google.dz',
            country: 'Algeria'
            languages: ['fr', 'ar'] // French, Arabic
        } {
            code: 'ASM',
            domain: 'google.as',
            country: 'American Samoa',
            languages: ['en'] // English
        } {
            code: 'AND',
            domain: 'google.ad',
            country: 'Andorra',
            languages: ['ca'] // Catalan
        } {
            code: 'AGO',
            domain: 'google.co.ao',
            country: 'Angola',
            languages: ['pt', 'kg'] // Portuguese, Kongo
        } {
            code: 'AIA',
            domain: 'google.com.ai',
            country: 'Anguilla',
            languages: ['en'] // English
        } {
            code: 'ATG',
            domain: 'google.com.ag',
            country: 'Antigua and Barbuda',
            languages: ['en'] // English
        } {
            code: 'ARG',
            domain: 'google.com.ar',
            country: 'Argentina',
            languages: ['es'] // Español (Latinoamérica)
        } {
            code: 'ARM',
            domain: 'google.am',
            country: 'Armenia',
            languages: ['hy'] // Armenian
        } {
            code: 'AUS',
            domain: 'google.com.au',
            country: 'Australia',
            languages: ['en'] // English
        } {
            code: 'AUT',
            domain: 'google.at',
            country: 'Austria',
            languages: ['de'] // German
        } {
            code: 'AZE',
            domain: 'google.az',
            country: 'Azerbaijan',
            languages: ['az, ru'] // Azerbaijani, Russian
        } {
            code: 'BHS',
            domain: 'google.bs',
            country: 'Bahamas',
            languages: ['en'] // English
        } {
            code: 'BHR',
            domain: 'google.com.bh',
            country: 'Bahrain',
            languages: ['ar'] // Arabic
        } {
            code: 'BGD',
            domain: 'google.com.bd',
            country: 'Bangladesh',
            languages: ['bn'] // Bengali
        } {
            code: 'BLR',
            domain: 'google.by',
            country: 'Belarus',
            languages: ['be', 'ru'] // Belarusian, Russian
        } {
            code: 'BEL',
            domain: 'google.be',
            country: 'Belgium',
            languages: ['nl', 'fr'] // Dutch, French
        } {
            code: 'BLZ',
            domain: 'google.com.bz',
            country: 'Belize',
            languages: ['es', 'en'] // Español (Latinoamérica), English
        } {
            code: 'BEN',
            domain: 'google.bj',
            country: 'Benin',
            languages: ['fr', 'yo'] // French, Yoruba
        } {
            code: 'BOL',
            domain: 'google.com.bo',
            country: 'Bolivia',
            languages: ['es', 'qu'] // Español (Latinoamérica), Quechua
        } {
            code: 'BIH',
            domain: 'google.ba',
            country: 'Bosnia and Herzegovina',
            languages: ['bs', 'sr'] // Bosnian, Serbian
        } {
            code: 'BWA',
            domain: 'google.co.bw',
            country: 'Botswana',
            languages: ['tn'] // Tswana
        } {
            code: 'BRA',
            domain: 'google.com.br',
            country: 'Brazil',
            languages: ['pt'] // Portuguese (Brasil)
        } {
            code: 'BRN',
            domain: 'google.com.bn',
            country: 'Brunei Darussalam',
            languages: ['ms', 'cn'] // Malay, Chinese
        } {
            code: 'BGR',
            domain: 'google.bg',
            country: 'Bulgaria',
            languages: ['bg'] // Bulgarian
        } {
            code: 'BFA',
            domain: 'google.bf',
            country: 'Burkina Faso',
            languages: ['fr'] // French
        } {
            code: 'BDI',
            domain: 'google.bi',
            country: 'Burundi',
            languages: ['fr', 'sw'] // French, Swahili
        } {
            code: 'KHM',
            domain: 'google.com.kh',
            country: 'Cambodia',
            languages: ['km'] // Khmer
        } {
            code: 'CMR',
            domain: 'google.cm',
            country: 'Cameroon',
            languages: ['fr'] // French
        } {
            code: 'CAN',
            domain: 'google.ca',
            country: 'Canada',
            languages: ['en', 'fr'] // English, French
        } {
            code: 'CPV',
            domain: 'google.cv',
            country: 'Cape Verde',
            languages: ['pt'] // Portuguese
        } {
            code: 'CAF',
            domain: 'google.cf',
            country: 'Central African Republic',
            languages: ['fr'] // French
        } {
            code: 'TCD',
            domain: 'google.td',
            country: 'Chad',
            languages: ['fr', 'ar'] // French, Arabic
        } {
            code: 'CHL',
            domain: 'google.cl',
            country: 'Chile',
            languages: ['es'] // Español (Latinoamérica)
        } {
            code: 'CHN',
            domain: 'google.cn',
            country: '* China(Google.hk)',
            languages: ['zh'] //  Chinese
        } {
            code: 'COL',
            domain: 'google.com.co',
            country: 'Colombia',
            languages: ['es'] // Español (Latinoamérica)
        } {
            code: 'COG',
            domain: 'google.cg',
            country: 'Congo',
            languages: ['fr'] // French
        } {
            code: 'COD',
            domain: 'google.cd',
            country: 'Congo, The Democratic Republic of the',
            languages: ['fr', 'sw'] // French, Swahili
        } {
            code: 'COK',
            domain: 'google.co.ck',
            country: 'Cook Islands',
            languages: ['en'] // English
        } {
            code: 'CRI',
            domain: 'google.co.cr',
            country: 'Costa Rica',
            languages: ['es'] // Español (Latinoamérica)
        } {
            code: 'CIV',
            domain: 'google.ci',
            country: 'Cote d `Ivoire',
            languages: ['fr'] // French
        } {
            code: 'HRV',
            domain: 'google.hr',
            country: 'Croatia',
            languages: ['hr'] // Croatian
        } {
            code: 'CUB',
            domain: 'google.com.cu',
            country: 'Cuba',
            languages: ['es'] // Español (Latinoamérica)
        } {
            code: 'CYP',
            domain: 'google.com.cy',
            country: 'Cyprus',
            languages: ['en', 'el'] // English, Greek
        } {
            code: 'CZE',
            domain: 'google.cz',
            country: 'Czech Republic',
            languages: ['cs'] // Czech
        } {
            code: 'DNK',
            domain: 'google.dk',
            country: 'Denmark',
            languages: ['da', 'fo'] // Danish, Faroese
        } {
            code: 'DJI',
            domain: 'google.dj',
            country: 'Djibouti',
            languages: ['fr', 'ar'] // French, Arabic
        } {
            code: 'DMA',
            domain: 'google.dm',
            country: 'Dominica',
            languages: ['en'] // English
        } {
            code: 'DOM',
            domain: 'google.com.do',
            country: 'Dominican Republic',
            languages: ['es'] // Español (Latinoamérica)
        } {
            code: 'ECU',
            domain: 'google.com.ec',
            country: 'Ecuador',
            languages: ['es'] // Español (Latinoamérica)
        } {
            code: 'EGY',
            domain: 'google.com.eg',
            country: 'Egypt',
            languages: ['ar'] // Arabic
        } {
            code: 'SLV',
            domain: 'google.com.sv',
            country: 'El Salvador',
            languages: ['es'] // Español (Latinoamérica)
        } {
            code: 'EST',
            domain: 'google.ee',
            country: 'Estonia',
            languages: ['et', 'ru'] // Estonian, Russian
        } {
            code: 'ETH',
            domain: 'google.com.et',
            country: 'Ethiopia',
            languages: ['am', 'ti'] // Amharic, Tigrinya
        } {
            code: 'FJI',
            domain: 'google.com.fj',
            country: 'Fiji',
            languages: ['en'] // English
        } {
            code: 'FIN',
            domain: 'google.fi',
            country: 'Finland',
            languages: ['fi', 'sv'] // Finnish, Swedish
        } {
            code: 'FSM',
            domain: 'google.fm',
            country: 'Micronesia',
            languages: ['en'] // English
        } {
            code: 'FRA',
            domain: 'google.fr',
            country: 'France',
            languages: ['fr'] // French
        } {
            code: 'GAB',
            domain: 'google.ga',
            country: 'Gabon',
            languages: ['fr'] // French
        } {
            code: 'GMB',
            domain: 'google.gm',
            country: 'Gambia',
            languages: ['en', 'wo'] // English, Wolof
        } {
            code: 'GEO',
            domain: 'google.ge',
            country: 'Georgia',
            languages: ['ka'] // Georgian
        } {
            code: 'DEU',
            domain: 'google.de',
            country: 'Germany',
            languages: ['de'] // German
        } {
            code: 'GHA',
            domain: 'google.com.gh',
            country: 'Ghana',
            languages: ['en', 'ha'] // English, Hausa
        } {
            code: 'GIB',
            domain: 'google.com.gi',
            country: 'Gibraltar',
            languages: ['en', 'es'] // English, Spanish
        } {
            code: 'GRC',
            domain: 'google.gr',
            country: 'Greece',
            languages: ['el'] // Greek
        } {
            code: 'GRL',
            domain: 'google.gl',
            country: 'Greenland',
            languages: ['da'] // Danish
        } {
            code: 'GLP',
            domain: 'google.gp',
            country: 'Guadeloupe',
            languages: ['fr'] // French
        } {
            code: 'GTM',
            domain: 'google.com.gt',
            country: 'Guatemala',
            languages: ['es'] // Español (Latinoamérica)
        } {
            code: 'GGY',
            domain: 'google.gg',
            country: 'Guernsey',
            languages: ['en', 'fr'] // English, French
        } {
            code: 'GUY',
            domain: 'google.gy',
            country: 'Guyana',
            languages: ['en'] // English
        } {
            code: 'HTI',
            domain: 'google.ht',
            country: 'Haiti',
            languages: ['fr', 'ht'] // French, Haitian
        } {
            code: 'HND',
            domain: 'google.hn',
            country: 'Honduras',
            languages: ['es'] // Español (Latinoamérica)
        } {
            code: 'HKG',
            domain: 'google.com.hk',
            country: 'Hong Kong',
            languages: ['zh'] // Chinese(Traditional)
        } {
            code: 'HUN',
            domain: 'google.hu',
            country: 'Hungary',
            languages: ['hu'] // Hungarian
        } {
            code: 'ISL',
            domain: 'google.is',
            country: 'Iceland',
            languages: ['is'] // Icelandic
        } {
            code: 'IND',
            domain: 'google.co.in',
            country: 'India',
            languages: ['en', 'hi'] // English, Hindi
        } {
            code: 'IDN',
            domain: 'google.co.id',
            country: 'Indonesia',
            languages: ['id', 'jw'] // Indonesian, Basa Jawa
        } {
            code: 'IRQ',
            domain: 'google.iq',
            country: 'Iraq',
            languages: ['ckb', 'ar'] // Kurdish, Arabic
        } {
            code: 'IRL',
            domain: 'google.ie',
            country: 'Ireland',
            languages: ['en', 'ga'] // English, Irish
        } {
            code: 'IMN',
            domain: 'google.im',
            country: 'Isle of Man',
            languages: ['en'] // English
        } {
            code: 'ISR',
            domain: 'google.co.il',
            country: 'Israel',
            languages: ['ar', 'iw'] // Arabic, Hebrew
        } {
            code: 'ITA',
            domain: 'google.it',
            country: 'Italy',
            languages: ['it'] // Italian
        } {
            code: 'JAM',
            domain: 'google.com.jm',
            country: 'Jamaica',
            languages: ['en'] // English
        } {
            code: 'JPN',
            domain: 'google.co.jp',
            country: 'Japan',
            languages: ['ja'] // Japanese
        } {
            code: 'JEY',
            domain: 'google.je',
            country: 'Jersey',
            languages: ['fr', 'em'] // French, English
        } {
            code: 'JOR',
            domain: 'google.jo',
            country: 'Jordan',
            languages: ['ar'] // Arabic
        } {
            code: 'KAZ',
            domain: 'google.kz',
            country: 'Kazakhstan',
            languages: ['kk', 'ru'] // Kazakh, Russian
        } {
            code: 'KEN',
            domain: 'google.co.ke',
            country: 'Kenya',
            languages: ['sw'] // Swahili
        } {
            code: 'KIR',
            domain: 'google.ki',
            country: 'Kiribati',
            languages: ['en'] // English
        } {
            code: 'KOR',
            domain: 'google.co.kr',
            country: 'Korea, Republic of',
            languages: ['ko'] // Korean
        } {
            code: 'KWT',
            domain: 'google.com.kw',
            country: 'Kuwait',
            languages: ['ar'] // Arabic
        } {
            code: 'KGZ',
            domain: 'google.kg',
            country: 'Kyrgyzstan',
            languages: ['ky', 'ru'] // Kyrgyz, Russian
        } {
            code: 'LAO',
            domain: 'google.la',
            country: 'Lao People`s Democratic Republic',
            languages: ['lo'] // Lao
        } {
            code: 'LVA',
            domain: 'google.lv',
            country: 'Latvia',
            languages: ['lv', 'lt'] // Latvian, Lithuanian
        } {
            code: 'LBN',
            domain: 'google.com.lb',
            country: 'Lebanon',
            languages: ['ar', 'fr'] // Arabic, French
        } {
            code: 'ls',
            domain: 'google.co.ls',
            country: 'Lesotho',
            languages: ['st', 'en'] // Southern Sotho, English
        } {
            code: 'ly',
            domain: 'google.com.ly',
            country: 'Libya',
            languages: ['ar', 'it'] // Arabic, Italian
        } {
            code: 'li',
            domain: 'google.li',
            country: 'Liechtenstein',
            languages: [' de'] // German
        } {
            code: 'lt',
            domain: 'google.lt',
            country: 'Lithuania',
            languages: ['lt'] // Lithuanian
        } {
            code: 'lu',
            domain: 'google.lu',
            country: 'Luxembourg',
            languages: ['de', 'fr'] // German, French
        } {
            code: 'mk',
            domain: 'google.mk',
            country: 'Macedonia, The Former Yugoslav Republic of',
            languages: ['mk'] // Macedonian
        } {
            code: 'mg',
            domain: 'google.mg',
            country: 'Madagascar',
            languages: ['mg', 'fr'] // Malagasy, French
        } {
            code: 'mw',
            domain: 'google.mw',
            country: 'Malawi',
            languages: ['ny'] // Nyanja
        } {
            code: 'my',
            domain: 'google.com.my',
            country: 'Malaysia',
            languages: ['ms'] // Malay
        } {
            code: 'mv',
            domain: 'google.mv',
            country: 'Maldives',
            languages: ['en'] // English
        } {
            code: 'ml',
            domain: 'google.ml',
            country: 'Mali',
            languages: ['fr'] // French
        } {
            code: 'mt',
            domain: 'google.com.mt',
            country: 'Malta',
            languages: ['mt', 'en'] // Maltese, English
        } {
            code: 'mu',
            domain: 'google.mu',
            country: 'Mauritius',
            languages: ['en', 'fr'] // English, French
        } {
            code: 'mx',
            domain: 'google.com.mx',
            country: 'Mexico',
            languages: ['es'] // Español (Latinoamérica)
        } {
            code: 'md',
            domain: 'google.md',
            country: 'Moldova, Republic of',
            languages: ['mo', 'ru'] // Moldovan, Russian
        } {
            code: 'mn',
            domain: 'google.mn',
            country: 'Mongolia',
            languages: ['mn'] // Mongolian
        } {
            code: 'me',
            domain: 'google.me',
            country: 'Montenegro',
            languages: ['sr'] // Serbian
        } {
            code: 'ms',
            domain: 'google.ms',
            country: 'Montserrat',
            languages: ['en'] // English
        } {
            code: 'ma',
            domain: 'google.co.ma',
            country: 'Morocco',
            languages: ['fr', 'ar'] // French, Arabic
        } {
            code: 'mz',
            domain: 'google.co.mz',
            country: 'Mozambique',
            languages: ['pt', 'sw'] // Portuguese, Swahili
        } {
            code: 'na',
            domain: 'google.com.na',
            country: 'Namibia',
            languages: ['en', 'ar'] // English, Afrikaans
        } {
            code: 'nr',
            domain: 'google.nr',
            country: 'Nauru',
            languages: ['en'] // English
        } {
            code: 'np',
            domain: 'google.com.np',
            country: 'Nepal',
            languages: ['ne'] // Nepali
        } {
            code: 'nl',
            domain: 'google.nl',
            country: 'Netherlands',
            languages: ['nl', 'en'] // Dutch, English
        } {
            code: 'nz',
            domain: 'google.co.nz',
            country: 'New Zealand',
            languages: ['en', 'mi'] // English, Māori
        } {
            code: 'ni',
            domain: 'google.com.ni',
            country: 'Nicaragua',
            languages: ['es'] // Español (Latinoamérica)
        } {
            code: 'ne',
            domain: 'google.ne',
            country: 'Niger',
            languages: ['fr', 'ha'] // French, Hausa
        } {
            code: 'ng',
            domain: 'google.com.ng',
            country: 'Nigeria',
            languages: ['en', 'ha'] // English, Hausa
        } {
            code: 'nu',
            domain: 'google.nu',
            country: 'Niue',
            languages: ['en'] // English
        } {
            code: 'nf',
            domain: 'google.com.nf',
            country: 'Norfolk Island',
            languages: ['en'] // English
        } {
            code: 'no',
            domain: 'google.no',
            country: 'Norway',
            languages: ['no', 'nn'] // Norwegian, Norwegian Nynorsk
        } {
            code: 'om',
            domain: 'google.com.om',
            country: 'Oman',
            languages: ['ar'] // Arabic
        } {
            code: 'pk',
            domain: 'google.com.pk',
            country: 'Pakistan',
            languages: ['en', 'ur'] // English, Urdu
        } {
            code: 'ps',
            domain: 'google.ps',
            country: 'Palestinian Territory, Occupied',
            languages: ['ar'] // Arabic
        } {
            code: 'pa',
            domain: 'google.com.pa',
            country: 'Panama',
            languages: ['es'] // Español (Latinoamérica)
        } {
            code: 'py',
            domain: 'google.com.py',
            country: 'Paraguay',
            languages: ['es'] // Español (Latinoamérica)
        } {
            code: 'pe',
            domain: 'google.com.pe',
            country: 'Peru',
            languages: ['es', 'qu'] // Español (Latinoamérica), Quechua
        } {
            code: 'ph',
            domain: 'google.com.ph',
            country: 'Philippines',
            languages: ['tl'] // Tagalog
        } {
            code: 'pn',
            domain: 'google.pn',
            country: 'Pitcairn',
            languages: ['en'] // English
        } {
            code: 'pl',
            domain: 'google.pl',
            country: 'Poland',
            languages: ['pl'] // Polish
        } {
            code: 'pt',
            domain: 'google.pt',
            country: 'Portugal',
            languages: ['pt'] // Portuguese
        } {
            code: 'pr',
            domain: 'google.com.pr',
            country: 'Puerto Rico',
            languages: ['es'] // Español (Latinoamérica)
        } {
            code: 'qa',
            domain: 'google.com.qa',
            country: 'Qatar',
            languages: ['ar'] // Arabic
        } {
            code: 'cat',
            domain: 'google.cat',
            country: 'reserved for the Catalan linguistic and cultural',
            languages: ['ca'] // Catalan
        } {
            code: 'ro',
            domain: 'google.ro',
            country: 'Romania',
            languages: ['ro', 'hu'] // Romanian, Hungarian
        } {
            code: 'ru',
            domain: 'google.ru',
            country: 'Russia',
            languages: ['ru'] // Russian
        } {
            code: 'rw',
            domain: 'google.rw',
            country: 'Rwanda',
            languages: ['en', 'fr'] // English, French
        } {
            code: 'sh',
            domain: 'google.sh',
            country: 'Saint Helena',
            languages: ['en'] // English
        } {
            code: 'vc',
            domain: 'google.com.vc',
            country: 'Saint Vincent and the Grenadines',
            languages: ['en'] // English
        } {
            code: 'ws',
            domain: 'google.ws',
            country: 'Samoa',
            languages: ['en'] // English
        } {
            code: 'sm',
            domain: 'google.sm',
            country: 'San Marino',
            languages: ['it'] // Italian
        } {
            code: 'st',
            domain: 'google.st',
            country: 'Sao Tome and Principe',
            languages: ['pt'] // Portuguese
        } {
            code: 'sa',
            domain: 'google.com.sa',
            country: 'Saudi Arabia',
            languages: ['ar'] // Arabic
        } {
            code: 'sn',
            domain: 'google.sn',
            country: 'Senegal',
            languages: ['fr', 'wo'] // French, Wolof
        } {
            code: 'rs',
            domain: 'google.rs',
            country: 'Serbia',
            languages: ['sr'] // Serbian
        } {
            code: 'sc',
            domain: 'google.sc',
            country: 'Seychelles',
            languages: ['crs', 'fr'] // Kreol Seselwa, French
        } {
            code: 'sl',
            domain: 'google.com.sl',
            country: 'Sierra Leone',
            languages: ['en', 'kri'] // English, Krio
        } {
            code: 'sg',
            domain: 'google.com.sg',
            country: 'Singapore',
            languages: ['en', 'cn'] // English, Chinese (Simplified)'
        } {
            code: 'sk',
            domain: 'google.sk',
            country: 'Slovakia',
            languages: ['sk'] // Slovak
        } {
            code: 'si',
            domain: 'google.si',
            country: 'Slovenia',
            languages: ['sl'] // Slovene
        } {
            code: 'sb',
            domain: 'google.com.sb',
            country: 'Solomon Islands',
            languages: ['en'] // English
        } {
            code: 'so',
            domain: 'google.so',
            country: 'Somalia',
            languages: ['so', 'ar'] // Somali, Arabic
        } {
            code: 'za',
            domain: 'google.co.za',
            country: 'South Africa',
            languages: ['af', 'st'] // Afrikaans, Southern Sotho or Sesotho
        } {
            code: 'es',
            domain: 'google.es',
            country: 'Spain',
            languages: ['es', 'ca'] // Spanish, Catalan
        } {
            code: 'lk',
            domain: 'google.lk',
            country: 'Sri Lanka',
            languages: ['en', 'si'] // English, Sinhalese
        } {
            code: 'se',
            domain: 'google.se',
            country: 'Sweden',
            languages: ['sv'] // Swedish
        } {
            code: 'ch',
            domain: 'google.ch',
            country: 'Switzerland',
            languages: ['de', 'fr'] // German, French
        } {
            code: 'tw',
            domain: 'google.com.tw',
            country: 'Taiwan, Province of China',
            languages: ['zh'] // Chinese
        } {
            code: 'tj',
            domain: 'google.com.tj',
            country: 'Tajikistan',
            languages: ['tg', 'ru'] // Tajik, Russian
        } {
            code: 'tz',
            domain: 'google.co.tz',
            country: 'Tanzania, United Republic of',
            languages: ['sw'] // Swahili
        } {
            code: 'th',
            domain: 'google.co.th',
            country: 'Thailand',
            languages: ['th'] // Thai
        } {
            code: 'tl',
            domain: 'google.tl',
            country: 'Timor Leste',
            languages: ['pt'] // Portuguese
        } {
            code: 'tg',
            domain: 'google.tg',
            country: 'Togo',
            languages: ['fr', 'ee'] // French, Ewe
        } {
            code: 'tk',
            domain: 'google.tk',
            country: 'Tokelau',
            languages: ['en'] // English
        } {
            code: 'to',
            domain: 'google.to',
            country: 'Tonga',
            languages: ['en', 'to'] // English, Tonga
        } {
            code: 'tt',
            domain: 'google.tt',
            country: 'Trinidad and Tobago',
            languages: ['en', 'hi'] // English, Hindi
        } {
            code: 'tn',
            domain: 'google.tn',
            country: 'Tunisia',
            languages: ['ar', 'fr'] // Arabic, French
        } {
            code: 'tr',
            domain: 'google.com.tr',
            country: 'Turkey',
            languages: ['tr'] // Turkish
        } {
            code: 'tm',
            domain: 'google.tm',
            country: 'Turkmenistan',
            languages: ['tk', 'ru'] // Turkmen, Russian
        } {
            code: 'ug',
            domain: 'google.co.ug',
            country: 'Uganda',
            languages: ['lg', 'sw'] // Ganda, Swahili
        } {
            code: 'ua',
            domain: 'google.com.ua',
            country: 'Ukraine',
            languages: ['uk', 'ru'] // Ukrainian, Russian
        } {
            code: 'ae',
            domain: 'google.ae',
            country: 'United Arab Emirates',
            languages: ['ar', 'fa'] // Arabic, Persian
        } {
            code: 'uk',
            domain: 'google.co.uk',
            country: 'United Kingdom',
            languages: ['en'] // English
        } {
            code: 'com',
            domain: 'google.com',
            country: 'United States',
            languages: ['en'] // English
        } {
            code: 'uy',
            domain: 'google.com.uy',
            country: 'Uruguay',
            languages: ['es'] // Español (Latinoamérica)
        } {
            code: 'uz',
            domain: 'google.co.uz',
            country: 'Uzbekistan',
            languages: ['uz', 'ru'] // Uzbek, Russian
        } {
            code: 'vu',
            domain: 'google.vu',
            country: 'Vanuatu',
            languages: ['en', 'fr'] // English, French
        } {
            code: 've',
            domain: 'google.co.ve',
            country: 'Venezuela, Bolivarian Republic of',
            languages: ['es'] // Español (Latinoamérica)
        } {
            code: 'vn',
            domain: 'google.com.vn',
            country: 'Viet Nam',
            languages: ['vi', 'fr'] // Vietnamese, French
        } {
            code: 'vg',
            domain: 'google.vg',
            country: 'Virgin Islands, British',
            languages: ['en'] // English
        } {
            code: 'vi',
            domain: 'google.co.vi',
            country: 'Virgin Islands, U.S.',
            languages: ['en'] // English
        } {
            code: 'zm',
            domain: 'google.co.zm',
            country: 'Zambia',
            languages: ['en', 'ny'] // English, Nyanja
        } {
            code: 'zw',
            domain: 'google.co.zw',
            country: 'Zimbabwe',
            languages: ['en', 'sn'] // English, Shona
        }
    }
}
