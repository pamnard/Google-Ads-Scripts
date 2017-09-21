function main() {

    // In progress 

    var parseCountry = 'USA', // In ISO 3166-1 alpha-3 format
        parseLanguage = 'en'; // In ISO 639-1 format

    setGoogleSettings(parseCountry, parseLanguage);

    function setGoogleSettings(countrycode, langcode) {
        var regionlist = regionGoogle();
        for (var i = 0; i < regionlist.length; i++) {
            var row = regionlist[i],
                code = row[1],
                domain = row[2],
                country = row[3],
                languages = row[4];
            if (code == countrycode) {
                Logger.log('Выбрана страна: ' + country);
                if (languages.indexOf(langcode) != -1) {
                    Logger.log(code + ' - ' + domain + ' - ' + country + ' - ' + languages + ' - ' + alphabet(langcode));
                } else {
                    Logger.log('Выбран не поддерживаемый язык: "' + langcode + '". Поддерживается: ' + languages);
                }

            }
        }
    }

    function regionGoogle() {
        var arr = [
            ['AFG', 'google.com.af', 'Afghanistan', ['fa', 'ps']], // Farsi, Pushto
            ['DZA', 'google.dz', 'Algeria', ['fr', 'ar']], // French, Arabic
            ['ASM', 'google.as', 'American Samoa', ['en']], // English
            ['AND', 'gooagle.ad', 'Andorra', ['ca']], // Catalan
            ['AGO', 'google.co.ao', 'Angola', ['pt', 'kg']], // Portuguese, Kongo
            ['AIA', 'google.com.ai', 'Anguilla', ['en']], // English
            ['ATG', 'google.com.ag', 'Antigua and Barbuda', ['en']], // English
            ['ARG', 'google.com.ar', 'Argentina', ['es']], // Español (Latinoamérica)
            ['ARM', 'google.am', 'Armenia', ['hy']], // Armenian
            ['AUS', 'google.com.au', 'Australia', ['en']], // English
            ['AUT', 'google.at', 'Austria', ['de']], // German
            ['AZE', 'google.az', 'Azerbaijan', ['az, ru']], // Azerbaijani, Russian
            ['BHS', 'google.bs', 'Bahamas', ['en']], // English
            ['BHR', 'google.com.bh', 'Bahrain', ['ar']], // Arabic
            ['BGD', 'google.com.bd', 'Bangladesh', ['bn']], // Bengali
            ['BLR', 'google.by', 'Belarus', ['be', 'ru']], // Belarusian, Russian
            ['BEL', 'google.be', 'Belgium', ['nl', 'fr']], // Dutch, French
            ['BLZ', 'google.com.bz', 'Belize', ['es', 'en']], // Español (Latinoamérica), English
            ['BEN', 'google.bj', 'Benin', ['fr', 'yo']], // French, Yoruba
            ['BOL', 'google.com.bo', 'Bolivia', ['es', 'qu']], // Español (Latinoamérica), Quechua
            ['BIH', 'google.ba', 'Bosnia and Herzegovina', ['bs', 'sr']], // Bosnian, Serbian
            ['BWA', 'google.co.bw', 'Botswana', ['tn']], // Tswana
            ['BRA', 'google.com.br', 'Brazil', ['pt']], // Portuguese (Brasil)
            ['BRN', 'google.com.bn', 'Brunei Darussalam', ['ms', 'cn']], // Malay, Chinese
            ['BGR', 'google.bg', 'Bulgaria', ['bg']], // Bulgarian
            ['BFA', 'google.bf', 'Burkina Faso', ['fr']], // French
            ['BDI', 'google.bi', 'Burundi', ['fr', 'sw']], // French, Swahili
            ['KHM', 'google.com.kh', 'Cambodia', ['km']], // Khmer
            ['CMR', 'google.cm', 'Cameroon', ['fr']], // French
            ['CAN', 'google.ca', 'Canada', ['en', 'fr']], // English, French
            ['CPV', 'google.cv', 'Cape Verde', ['pt']], // Portuguese
            ['CAF', 'google.cf', 'Central African Republic', ['fr']], // French
            ['TCD', 'google.td', 'Chad', ['fr', 'ar']], // French, Arabic
            ['CHL', 'google.cl', 'Chile', ['es']], // Español (Latinoamérica)
            ['CHN', 'google.cn', '* China(Google.hk)', ['zh']], //  Chinese
            ['COL', 'google.com.co', 'Colombia', ['es']], // Español (Latinoamérica)
            ['COG', 'google.cg', 'Congo', ['fr']], // French
            ['COD', 'google.cd', 'Congo, The Democratic Republic of the', ['fr', 'sw']], // French, Swahili
            ['COK', 'google.co.ck', 'Cook Islands', ['en']], // English
            ['CRI', 'google.co.cr', 'Costa Rica', ['es']], // Español (Latinoamérica)
            ['CIV', 'google.ci', 'Cote d `Ivoire', ['fr']], // French
            ['HRV', 'google.hr', 'Croatia', ['hr']], // Croatian
            ['CUB', 'google.com.cu', 'Cuba', ['es']], // Español (Latinoamérica)
            ['CYP', 'google.com.cy', 'Cyprus', ['en', 'el']], // English, Greek
            ['CZE', 'google.cz', 'Czech Republic', ['cs']], // Czech
            ['DNK', 'google.dk', 'Denmark', ['da', 'fo']], // Danish, Faroese
            ['DJI', 'google.dj', 'Djibouti', ['fr', 'ar']], // French, Arabic
            ['DMA', 'google.dm', 'Dominica', ['en']], // English
            ['DOM', 'google.com.do', 'Dominican Republic', ['es']], // Español (Latinoamérica)
            ['ECU', 'google.com.ec', 'Ecuador', ['es']], // Español (Latinoamérica)
            ['EGY', 'google.com.eg', 'Egypt', ['ar']], // Arabic
            ['SLV', 'google.com.sv', 'El Salvador', ['es']], // Español (Latinoamérica)
            ['EST', 'google.ee', 'Estonia', ['et', 'ru']], // Estonian, Russian
            ['ETH', 'google.com.et', 'Ethiopia', ['am', 'ti']], // Amharic, Tigrinya
            ['FJI', 'google.com.fj', 'Fiji', ['en']], // English
            ['FIN', 'google.fi', 'Finland', ['fi', 'sv']], // Finnish, Swedish
            ['FSM', 'google.fm', 'Micronesia', ['en']], // English
            ['FRA', 'google.fr', 'France', ['fr']], // French
            ['GAB', 'google.ga', 'Gabon', ['fr']], // French
            ['GMB', 'google.gm', 'Gambia', ['en', 'wo']], // English, Wolof
            ['GEO', 'google.ge', 'Georgia', ['ka']], // Georgian
            ['DEU', 'google.de', 'Germany', ['de']], // German
            ['GHA', 'google.com.gh', 'Ghana', ['en', 'ha']], // English, Hausa
            ['GIB', 'google.com.gi', 'Gibraltar', ['en', 'es']], // English, Spanish
            ['GRC', 'google.gr', 'Greece', ['el']], // Greek
            ['GRL', 'google.gl', 'Greenland', ['da']], // Danish
            ['GLP', 'google.gp', 'Guadeloupe', ['fr']], // French
            ['GTM', 'google.com.gt', 'Guatemala', ['es']], // Español (Latinoamérica)
            ['GGY', 'google.gg', 'Guernsey', ['en', 'fr']], // English, French
            ['GUY', 'google.gy', 'Guyana', ['en']], // English
            ['HTI', 'google.ht', 'Haiti', ['fr', 'ht']], // French, Haitian
            ['HND', 'google.hn', 'Honduras', ['es']], // Español (Latinoamérica)
            ['HKG', 'google.com.hk', 'Hong Kong', ['zh']], // Chinese(Traditional)
            ['HUN', 'google.hu', 'Hungary', ['hu']], // Hungarian
            ['ISL', 'google.is', 'Iceland', ['is']], // Icelandic
            ['IND', 'google.co.in', 'India', ['en', 'hi']], // English, Hindi
            ['IDN', 'google.co.id', 'Indonesia', ['id', 'jw']], // Indonesian, Basa Jawa
            ['IRQ', 'google.iq', 'Iraq', ['ckb', 'ar']], // Kurdish, Arabic
            ['IRL', 'google.ie', 'Ireland', ['en', 'ga']], // English, Irish
            ['IMN', 'google.im', 'Isle of Man', ['en']], // English
            ['ISR', 'google.co.il', 'Israel', ['ar', 'iw']], // Arabic, Hebrew
            ['ITA', 'google.it', 'Italy', ['it']], // Italian
            ['JAM', 'google.com.jm', 'Jamaica', ['en']], // English
            ['JPN', 'google.co.jp', 'Japan', ['ja']], // Japanese
            ['JEY', 'google.je', 'Jersey', ['fr', 'em']], // French, English
            ['JOR', 'google.jo', 'Jordan', ['ar']], // Arabic
            ['KAZ', 'google.kz', 'Kazakhstan', ['kk', 'ru']], // Kazakh, Russian
            ['KEN', 'google.co.ke', 'Kenya', ['sw']], // Swahili
            ['KIR', 'google.ki', 'Kiribati', ['en']], // English
            ['KOR', 'google.co.kr', 'Korea, Republic of', ['ko']], // Korean
            ['KWT', 'google.com.kw', 'Kuwait', ['ar']], // Arabic
            ['KGZ', 'google.kg', 'Kyrgyzstan', ['ky', 'ru']], // Kyrgyz, Russian
            ['LAO', 'google.la', 'Lao People`s Democratic Republic', ['lo']], // Lao
            ['LVA', 'google.lv', 'Latvia', ['lv', 'lt']], // Latvian, Lithuanian
            ['LBN', 'google.com.lb', 'Lebanon', ['ar', 'fr']], // Arabic, French
            ['LSO', 'google.co.ls', 'Lesotho', ['st', 'en']], // Southern Sotho, English
            ['LBY', 'google.com.ly', 'Libya', ['ar', 'it']], // Arabic, Italian
            ['LIE', 'google.li', 'Liechtenstein', [' de']], // German
            ['LTU', 'google.lt', 'Lithuania', ['lt']], // Lithuanian
            ['LUX', 'google.lu', 'Luxembourg', ['de', 'fr']], // German, French
            ['MKD', 'google.mk', 'Macedonia, The Former Yugoslav Republic of', ['mk']], // Macedonian
            ['MDG', 'google.mg', 'Madagascar', ['mg', 'fr']], // Malagasy, French
            ['MWI', 'google.mw', 'Malawi', ['ny']], // Nyanja
            ['MYS', 'google.com.my', 'Malaysia', ['ms']], // Malay
            ['MDV', 'google.mv', 'Maldives', ['en']], // English
            ['MLI', 'google.ml', 'Mali', ['fr']], // French
            ['MLT', 'google.com.mt', 'Malta', ['mt', 'en']], // Maltese, English
            ['MUS', 'google.mu', 'Mauritius', ['en', 'fr']], // English, French
            ['MEX', 'google.com.mx', 'Mexico', ['es']], // Español (Latinoamérica)
            ['MDA', 'google.md', 'Moldova, Republic of', ['mo', 'ru']], // Moldovan, Russian
            ['MNG', 'google.mn', 'Mongolia', ['mn']], // Mongolian
            ['MNE', 'google.me', 'Montenegro', ['sr']], // Serbian
            ['MSR', 'google.ms', 'Montserrat', ['en']], // English
            ['MAR', 'google.co.ma', 'Morocco', ['fr', 'ar']], // French, Arabic
            ['MOZ', 'google.co.mz', 'Mozambique', ['pt', 'sw']], // Portuguese, Swahili
            ['NAM', 'google.com.na', 'Namibia', ['en', 'ar']], // English, Afrikaans
            ['NRU', 'google.nr', 'Nauru', ['en']], // English
            ['NPL', 'google.com.np', 'Nepal', ['ne']], // Nepali
            ['NLD', 'google.nl', 'Netherlands', ['nl', 'en']], // Dutch, English
            ['NZL', 'google.co.nz', 'New Zealand', ['en', 'mi']], // English, Māori
            ['NIC', 'google.com.ni', 'Nicaragua', ['es']], // Español (Latinoamérica)
            ['NER', 'google.ne', 'Niger', ['fr', 'ha']], // French, Hausa
            ['NGA', 'google.com.ng', 'Nigeria', ['en', 'ha']], // English, Hausa
            ['NIU', 'google.nu', 'Niue', ['en']], // English
            ['NFK', 'google.com.nf', 'Norfolk Island', ['en']], // English
            ['NOR', 'google.no', 'Norway', ['no', 'nn']], // Norwegian, Norwegian Nynorsk
            ['OMN', 'google.com.om', 'Oman', ['ar']], // Arabic
            ['PAK', 'google.com.pk', 'Pakistan', ['en', 'ur']], // English, Urdu
            ['PSE', 'google.ps', 'Palestine, State of', ['ar']], // Arabic
            ['PAN', 'google.com.pa', 'Panama', ['es']], // Español (Latinoamérica)
            ['PRY', 'google.com.py', 'Paraguay', ['es']], // Español (Latinoamérica)
            ['PER', 'google.com.pe', 'Peru', ['es', 'qu']], // Español (Latinoamérica), Quechua
            ['PHL', 'google.com.ph', 'Philippines', ['tl']], // Tagalog
            ['PCN', 'google.pn', 'Pitcairn', ['en']], // English
            ['POL', 'google.pl', 'Poland', ['pl']], // Polish
            ['PRT', 'google.pt', 'Portugal', ['pt']], // Portuguese
            ['PRI', 'google.com.pr', 'Puerto Rico', ['es']], // Español (Latinoamérica)
            ['QAT', 'google.com.qa', 'Qatar', ['ar']], // Arabic
            ['ROU', 'google.ro', 'Romania', ['ro', 'hu']], // Romanian, Hungarian
            ['RUS', 'google.ru', 'Russia', ['ru']], // Russian
            ['RWA', 'google.rw', 'Rwanda', ['en', 'fr']], // English, French
            ['SHN', 'google.sh', 'Saint Helena', ['en']], // English
            ['VCT', 'google.com.vc', 'Saint Vincent and the Grenadines', ['en']], // English
            ['WSM', 'google.ws', 'Samoa', ['en']], // English
            ['SMR', 'google.sm', 'San Marino', ['it']], // Italian
            ['STP', 'google.st', 'Sao Tome and Principe', ['pt']], // Portuguese
            ['SAU', 'google.com.sa', 'Saudi Arabia', ['ar']], // Arabic
            ['SEN', 'google.sn', 'Senegal', ['fr', 'wo']], // French, Wolof
            ['SRB', 'google.rs', 'Serbia', ['sr']], // Serbian
            ['SYC', 'google.sc', 'Seychelles', ['crs', 'fr']], // Kreol Seselwa, French
            ['SLE', 'google.com.sl', 'Sierra Leone', ['en', 'kri']], // English, Krio
            ['SGP', 'google.com.sg', 'Singapore', ['en', 'cn']], // English, Chinese (Simplified)'
            ['SVK', 'google.sk', 'Slovakia', ['sk']], // Slovak
            ['SVN', 'google.si', 'Slovenia', ['sl']], // Slovene
            ['SLB', 'google.com.sb', 'Solomon Islands', ['en']], // English
            ['SOM', 'google.so', 'Somalia', ['so', 'ar']], // Somali, Arabic
            ['ZAF', 'google.co.za', 'South Africa', ['af', 'st']], // Afrikaans, Southern Sotho or Sesotho
            ['ESP', 'google.es', 'Spain', ['es', 'ca']], // Spanish, Catalan
            ['LKA', 'google.lk', 'Sri Lanka', ['en', 'si']], // English, Sinhalese
            ['SWE', 'google.se', 'Sweden', ['sv']], // Swedish
            ['CHE', 'google.ch', 'Switzerland', ['de', 'fr']], // German, French
            ['TWN', 'google.com.tw', 'Taiwan, Province of China', ['zh']], // Chinese
            ['TJK', 'google.com.tj', 'Tajikistan', ['tg', 'ru']], // Tajik, Russian
            ['TZA', 'google.co.tz', 'Tanzania, United Republic of', ['sw']], // Swahili
            ['THA', 'google.co.th', 'Thailand', ['th']], // Thai
            ['TLS', 'google.tl', 'Timor-Leste', ['pt']], // Portuguese
            ['TGO', 'google.tg', 'Togo', ['fr', 'ee']], // French, Ewe
            ['TKL', 'google.tk', 'Tokelau', ['en']], // English
            ['TON', 'google.to', 'Tonga', ['en', 'to']], // English, Tonga
            ['TTO', 'google.tt', 'Trinidad and Tobago', ['en', 'hi']], // English, Hindi
            ['TUN', 'google.tn', 'Tunisia', ['ar', 'fr']], // Arabic, French
            ['TUR', 'google.com.tr', 'Turkey', ['tr']], // Turkish
            ['TKM', 'google.tm', 'Turkmenistan', ['tk', 'ru']], // Turkmen, Russian
            ['UGA', 'google.co.ug', 'Uganda', ['lg', 'sw']], // Ganda, Swahili
            ['UKR', 'google.com.ua', 'Ukraine', ['uk', 'ru']], // Ukrainian, Russian
            ['ARE', 'google.ae', 'United Arab Emirates', ['ar', 'fa']], // Arabic, Persian
            ['GBR', 'google.co.uk', 'United Kingdom', ['en']], // English
            ['USA', 'google.com', 'United States', ['en']], // English
            ['URY', 'google.com.uy', 'Uruguay', ['es']], // Español (Latinoamérica)
            ['UZB', 'google.co.uz', 'Uzbekistan', ['uz', 'ru']], // Uzbek, Russian
            ['VUT', 'google.vu', 'Vanuatu', ['en', 'fr']], // English, French
            ['VEN', 'google.co.ve', 'Venezuela, Bolivarian Republic of', ['es']], // Español (Latinoamérica)
            ['VNM', 'google.com.vn', 'Viet Nam', ['vi', 'fr']], // Vietnamese, French
            ['VGB', 'google.vg', 'Virgin Islands, British', ['en']], // English
            ['VIR', 'google.co.vi', 'Virgin Islands, U.S.', ['en']], // English
            ['ZMB', 'google.co.zm', 'Zambia', ['en', 'ny']], // English, Nyanja
            ['ZWE', 'google.co.zw', 'Zimbabwe', ['en', 'sn']], // English, Shona
        ];
        return arr;
    }

    function alphabet(lang) {
        var arr = {
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
            az: ['a', 'b', 'c', 'ç', 'd', 'e', 'ə', 'f', 'g', 'ğ', 'h', 'x', 'ı', 'i', 'j', 'k', 'q', 'l', 'm', 'n', 'o', 'ö', 'p', 'r', 's', 'ş', 't', 'u', 'ü', 'v', 'y', 'z'], // Azerbaijani
            ckb: ['a', 'b', 'c', 'ç', 'd', 'e', 'ê', 'f', 'g', 'h', 'i', 'î', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 'ş', 't', 'u', 'û', 'v', 'w', 'x', 'y', 'z'], // Kurdish
            be: ['a', 'b', 'c', 'ć', 'č', 'd', 'e', 'ě', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'ľ', 'm', 'n', 'ň', 'o', 'p', 'r', 's', 'ś', 'š', 't', 'u', 'ŭ', 'y', 'z', 'ź', 'ž'], // Belarusian
            da: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'æ', 'ø', 'å'], // Danish
            el: ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'ς', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω'], // Greek
            en: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'], // English
            fi: ['a', 'ä', 'å', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'ö', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'], // Finnish
            ms: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'], // Malay
            ru: ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я'], // Russian
            vi: ['a', 'ă', 'â', 'b', 'c', 'd', 'đ', 'e', 'ê', 'g', 'h', 'i', 'k', 'l', 'm', 'n', 'o', 'ô', 'ơ', 'p', 'q', 'r', 's', 't', 'u', 'ư', 'v', 'x', 'y'], // Vietnamese
            uz: ['а', 'b', 'd', 'е', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'о', 'p', 'q', 'r', 's', 't', 'u', 'v', 'x', 'y', 'z', 'oʻ', 'gʻ', 'sh', 'ch', 'ng'] // Uzbek
        }
        for (var row in arr) {
            if (row == lang) {
                // Logger.log('Ключ: ' + row + ' значение: ' + arr[row] );
                return arr[row];
            }
        }
    }
}
