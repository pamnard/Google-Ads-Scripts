function main() {
    
    // Hello!
    
    var CONFIG = {
        codeUrl: 'https://google.com/script.js'
    };

    function getCode(url) {
        var codeText = UrlFetchApp.fetch(url).getContentText('UTF-8');
        return codeText;
    }
    var code = getCode(CONFIG.codeUrl);
    eval(code);
}
