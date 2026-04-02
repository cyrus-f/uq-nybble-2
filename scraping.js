const fs = require('fs');

const headers = {
    'accept': '*/*',
    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'origin': 'https://campus.hellorubric.com',
    'priority': 'u=1, i',
    'referer': 'https://campus.hellorubric.com/',
    'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
};

// EXACT string taken from network request
const data = new URLSearchParams({
    'details': '{"firstCall":true,"sortType":"date","desiredType":"events","limit":200,"offset":0,"sortDirection":"asc","searchQuery":"","eventsPeriodFilter":"All","countryCode":"AU","state":"Queensland","selectedUniversityId":"12","currentUrl":"https://campus.hellorubric.com/search?country=AU&state=Queensland&universityid=12&type=events","device":"web_portal","version":4}',
    'endpoint': 'getUnifiedSearch',
});

async function scrapeEvents() {
    try {
        const response = await fetch('https://api.hellorubric.com/', {
            method: 'POST',
            headers: headers,
            body: data,
        });

        let results;
        try {
            results = await response.json();
        } catch (error) {
            console.error('JSON decode error. Raw response:');
            const text = await response.text();
            console.error(text);
            process.exit(1);
        }

        console.log(JSON.stringify(results, null, 2));  // Inspect the structure
        fs.writeFileSync('event_data.json', JSON.stringify(results, null, 2));

        const events = results.results || [];
        console.log(`Found ${events.length} events`);

        fs.writeFileSync('results.json', JSON.stringify(events, null, 2));

        const freeEvents = events.filter(event => event.info === 'Free');
        fs.writeFileSync('free_events.json', JSON.stringify(freeEvents, null, 2));

        let prettyOutput = '';
        for (const event of freeEvents) {
            const title = event.title || 'No title';
            const month = event.month || 'No time';
            const day = event.day || 'no day';
            const societyname = event.societyname || 'No location';
            const price = event.info || 'No price found';
            const linkExtension = event.destination || 'No link';
            const eventUrl = `https://campus.hellorubric.com${linkExtension}`;

            console.log(`📅 ${title}`);
            console.log(`   🕒 ${month} ${day}`);
            console.log(`   📍 ${societyname}`);
            console.log(`   📝 ${price}`);
            console.log(`   ⛓️‍💥 ${eventUrl}\n`);

            prettyOutput += `📅 ${title}\n`;
            prettyOutput += `   🕒 ${month} ${day}\n`;
            prettyOutput += `   📍 ${societyname}\n`;
            prettyOutput += `   📝 ${price}\n`;
            prettyOutput += `   ⛓️‍💥 ${eventUrl}\n`;
        }

        fs.writeFileSync('pretty_event_data.txt', prettyOutput);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

scrapeEvents();
