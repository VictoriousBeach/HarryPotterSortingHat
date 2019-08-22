const readline = require('readline');
const PersonalityInsightsV3 = require('ibm-watson/personality-insights/v3');

const personality_insights = new PersonalityInsightsV3({
    version: '2017-10-13',
    iam_apikey: 'l7SdqIQYabKP3bgayEywzIWMzxDc4oQC5Y8P-9aP0COQ',
    url: 'https://gateway-wdc.watsonplatform.net/personality-insights/api'
});
const PersonalityTextSummaries = require('personality-text-summary');
const v3EnglishTextSummaries = new PersonalityTextSummaries({
    locale: 'en',
    version: 'v3'
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Please enter a short paragraph for Watson to analyze... (at least 100 words)\n', (text) => {

    let params = {
        content: text,
        content_type: 'text/plain',
        raw_scores: true,
        consumption_preferences: true
    };

    personality_insights.profile(params, function(error, response) {
            if (error)
                console.log('Error:', error);
            else
                console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
                console.log(getTextSummary(response));
                console.log(getHouse(response));
                //console.log(JSON.stringify(response, null, 2));
        }
    );

    rl.close();
});

const getTextSummary = personalityProfile => {
    let textSummary = v3EnglishTextSummaries.getSummary(personalityProfile);
    if (typeof (textSummary) !== 'string') {
        console.log("Could not get summary.");
    } else {
        return textSummary;
    }
};

const getHouse = houseProfile => {
    let personalityPoints = [(houseProfile.personality[0].percentile * 100), (houseProfile.personality[1].percentile * 100), (houseProfile.personality[2].percentile * 100), (houseProfile.personality[3].percentile * 100), (houseProfile.personality[4].percentile * 100)];
    let ravPoints = (0.5 * personalityPoints[4]) + personalityPoints[1] + personalityPoints[0];
    let gryPoints = (0.5 * personalityPoints[3]) + personalityPoints[1] + personalityPoints[2];
    let slyPoints = (0.5 * personalityPoints[0]) + personalityPoints[2] + personalityPoints[4];
    let hufPoints = (0.5 * personalityPoints[2]) + personalityPoints[1] + personalityPoints[3];
    let evalResults = [ravPoints,gryPoints,slyPoints,hufPoints];
    let top = Math.max(ravPoints,gryPoints,slyPoints,hufPoints);
    // console.log(personalityPoints);
    // console.log(top);
    for(let i = 0; i < evalResults.length; i++) {
        if (evalResults[i] === top){
            if (i === 0){
                console.log("You've been sorted into RAVENCLAW!");
            } else if(i === 1){
                console.log("You've been sorted into GRYFFINDOR!");
            } else if(i === 2){
                console.log("You've been sorted into SLYTHERIN!");
            } else if(i === 3){
                console.log("You've been sorted into HUFFLEPUFF!");
            }
        }
    }
}
