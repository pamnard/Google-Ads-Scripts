function account() {

    Logger.log(`${get_account_name()} - Start`);

    ensureAccountLabels();

    let labels_arr = [];
    let labelSelector = AdsApp.labels()
        .withCondition("label.name LIKE 'GPT_%'");
        let labelIterator = labelSelector.get();
    while (labelIterator.hasNext()) {
        let label = labelIterator.next();
        labels_arr.push(`'${label.getResourceName()}'`);
    }
    let labels_str = labels_arr.join(',');
    Logger.log(labels_str);
    var campaignSelector = AdsApp
        .campaigns()
        .withCondition("campaign.name LIKE '%Generic%'");
        let campaignIterator = campaignSelector.get();
    while (campaignIterator.hasNext()) {
        let campaign = campaignIterator.next();
        let keywordSelector = campaign
            .keywords()
            .withCondition(`ad_group_criterion.labels CONTAINS NONE (${labels_str})`)
            .withCondition("ad_group_criterion.status != REMOVED")
            .withLimit(50)
            .orderBy("metrics.cost_micros DESC");
            let keywordIterator = keywordSelector.get();
        while (keywordIterator.hasNext()) {
            let keyword = keywordIterator.next();
            let text = keyword.getText();
            let prompt = create_prompt(text);
            let response = gpt4(prompt);
            if (response.indexOf('Yes') > -1) {
                keyword.applyLabel('GPT_YES')
            }
            if (response.indexOf('No') > -1) {
                keyword.applyLabel('GPT_NO')
            }
            Logger.log(`${text} => ${response}`);
        }
    }

    Logger.log(`${get_account_name()} - Finish`);
}

function create_prompt(key) {
    let str = `My company is a %%%online store%%%.
    We advertise in Google Ads to attract people interested in %%%buy shirts%%%.
    Do you think the "${key}" is a good target keyword for us?
    Answer only “Yes” or “No”.`;
    return str;
}
/**
 * This function sends a prompt to the OpenAI GPT-3 API and returns a response.
 *
 * @param {string} prompt - The prompt to send to the GPT-3 API.
 * @param {string} username - The username of the user sending the prompt.
 * @returns {string} The response from the GPT-3 API.
 */
function gpt4(prompt) {

    let messages = [{
        "role": "user",
        "content": prompt
    }];

    // Call the OpenAI GPT-3 API with the messages array to get a response.
    let response = callAPI(messages);

    // Return the GPT-3 response.
    return response;
}

/**
 * Call OpenAI API to get a response to a given message
 *
 * @param {string[]} messages - An array of messages to send to the API
 * @returns {string} - The response from the API
 */
function callAPI(messages) {
    Utilities.sleep(2000);
    // Create data object to send to API
    let data = {
        'model': 'gpt-4',
        'messages': messages,
    };

    // Set options for UrlFetchApp
    let options = {
        'method': 'post',
        'contentType': 'application/json',
        'payload': JSON.stringify(data),
        'headers': {
            Authorization: 'Bearer ' + config().openai_apikey,
        },
        muteHttpExceptions: true
    };

    // Fetch response from API using UrlFetchApp
    let response = UrlFetchApp.fetch(
        'https://api.openai.com/v1/chat/completions',
        options,
    );

    // Log the response content
    // Logger.log(response.getContentText());

    // Check if there is an error in the response
    if (JSON.parse(response.getContentText()).error?.message != undefined) {
        // Return the error message
        return JSON.parse(response.getContentText())['error']['message'];
    } else {
        // Return the response from the API
        return JSON.parse(response.getContentText())['choices'][0]['message']['content'].replace(/^\n\n/, '');
    }
}