function config() {
    return {
        is_mcc_account: false,
        // true - if account is MCC

        editors_mails: [
            'account_one@gmail.com',
            'account_two@gmail.com'
        ],
        // Список аккаунтов которые получат доступ к отчёту

        slack_url: 'https://hooks.slack.com/services/12342314132412341234/AGAGAFGRAFGR$/EXAMPLEURLafgjkhafhgafg',
        // Url вебхука для отправки сообщения в слак о готовности отчета

        custom_date_range: 180,
        // Указываем количество дней для выборки

        custom_date_range_shift: 1,
        // Указываем на сколько дней от сегодняшнего мы сдвигаем выборку. Нужно для того чтобы не брать те дни когда запаздывает статистика.

        impressions_threshold: 100,
        // Минимальный порог показов для отчета

        clicks_threshold: 100
        // Минимальный порог кликов для отчета
    }
}
