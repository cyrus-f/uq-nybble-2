const CACHE_KEY = 'free_events_cache';
const TIMESTAMP_KEY = 'free_events_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Fetch events from the HelloRubric API
async function fetchFromAPI() {
    const headers = {
        'accept': '*/*',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'origin': 'https://campus.hellorubric.com',
        'referer': 'https://campus.hellorubric.com/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    };

    const data = new URLSearchParams({
        'details': '{"firstCall":true,"sortType":"date","desiredType":"events","limit":200,"offset":0,"sortDirection":"asc","searchQuery":"","eventsPeriodFilter":"All","countryCode":"AU","state":"Queensland","selectedUniversityId":"12","currentUrl":"https://campus.hellorubric.com/search?country=AU&state=Queensland&universityid=12&type=events","device":"web_portal","version":4}',
        'endpoint': 'getUnifiedSearch',
    });

    const response = await fetch('https://api.hellorubric.com/', {
        method: 'POST',
        headers: headers,
        body: data,
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    const results = await response.json();
    
    // Filter for free events only
    const events = (results.results || []).filter(event => event.info === 'Free');
    
    return events;
}

// Get cached events if they exist and are fresh
function getCachedEvents() {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        const timestamp = localStorage.getItem(TIMESTAMP_KEY);

        if (!cached || !timestamp) {
            return null;
        }

        const age = Date.now() - parseInt(timestamp);
        
        // If cache is less than 24 hours old, use it
        if (age < CACHE_DURATION) {
            return JSON.parse(cached);
        }

        return null;
    } catch (error) {
        console.error('Error reading cache:', error);
        return null;
    }
}

// Save events to cache
function cacheEvents(events) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(events));
        localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
        console.error('Error saving to cache:', error);
    }
}

// Main function: get events with intelligent caching
export async function getEvents() {
    // Try to use cached data first
    const cached = getCachedEvents();
    if (cached) {
        return cached;
    }

    // If no cache or cache is stale, fetch from API
    const events = await fetchFromAPI();
    cacheEvents(events);
    return events;
}

// Get cache age in hours (for debugging/UI)
export function getCacheAge() {
    try {
        const timestamp = localStorage.getItem(TIMESTAMP_KEY);
        if (!timestamp) return null;
        
        const ageMs = Date.now() - parseInt(timestamp);
        const ageHours = ageMs / (60 * 60 * 1000);
        return ageHours;
    } catch {
        return null;
    }
}

// Force refresh from API
export async function refreshEvents() {
    const events = await fetchFromAPI();
    cacheEvents(events);
    return events;
}
