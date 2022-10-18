# Скрипты для Google AdWords

`/_lib`
+ Basic Google Ads script template

`/dev/`
+ `Eval.js` - Исполняет код внешней библиотеки
+ `TelegramAPI_sample.js` - Шлёт сообщения в Telegram

`/release/`

+ `Budget_Control.js` - Контролирует точный расход бюджета для борьбы с https://support.google.com/adwords/answer/1704443
+ `GDN_Excluded_Placement.js` - Исключает площадки с плохими финасовыми показателями
+ `GDN_Excluded_Placement_ByName.js` - Исключает площадки по вхождению строки
+ `Search_AdGroup_CrossKeys.js` - Кросс-минусовка между группами объявлений
+ `Search_Ads_Optimizer.js` - Тестирует объявления, выбирая то у кого ниже Cost Per Conversion
+ `Search_Bidder.js` - Контролирует позицию ключевых слов
+ `Search_Google_Keywords_Mining.js` - Создаёт новые ключевые слова на основании сервиса подсказок Google
+ `Video_Youtube_parser.js` - Ищет места размещения на YouTube с помощью поиска по ключевым словам

`/search_keyword_builder`
+ Создает новые ключевые слова на основании отчета о поисковых запросах

`/n-gram`
+ Создаёт детальный отчет по поисковым запросам
