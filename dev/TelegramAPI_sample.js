function main() {

	var CONFIG = {
		// Токен надо получить у BotFather, создав нового бота
		TOKEN: '0987654321:QQQWWWEEERRRTTTYYYUUUIIIOOOPPP111222333',

		// Напишите что-нибудь в чат вашему боту, посе чего перейдите по ссылке https://api.telegram.org/bot<ТОКЕН>/getUpdates
		// в ответном тексте найдите строку ..."chat":{"id":123456789,"first_name"... Нужно значение id.
		CHAT_ID: '123456789'
	};

	var message = 'Юстас, я Алекс, приём!';
	sendTelegramMessage(message);

	function sendTelegramMessage(text) {
		var telegramUrl = 'https://api.telegram.org/bot' + CONFIG.TOKEN + '/sendMessage?chat_id=' + CONFIG.CHAT_ID + '&text=';
		var message = encodeURIComponent(text);
		var sendMessageUrl = telegramUrl + message;
		var options = {
			method: 'POST',
			contentType: 'application/json'
		};
		UrlFetchApp.fetch(sendMessageUrl, options);
	}
}
