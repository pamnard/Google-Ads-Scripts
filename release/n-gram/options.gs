function CONFIG() {
    return {
        sheetID: '1234567890QWERTYUIOPASDFGHJKL',
        // ID файла в Google SpredSheets в котрый будет записываться отчёт

        customDateRange: 180,
        // Указываем количество дней для выборки

        customDateRangeShift: 0,
        // Указываем на сколько дней от сегодняшнего мы сдвигаем выборку. Нужно для того чтобы не брать те дни когда запаздывает статистика.

        impressionThreshold: 100,
        // Минимальный порог показов для отчета

        clickThreshold: 100,
        // Минимальный порог кликов для отчета
    }
}
