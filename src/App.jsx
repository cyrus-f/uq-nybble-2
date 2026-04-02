import { useState, useEffect } from 'react';
import EventCard from './components/EventCard';
import { getEvents, refreshEvents, getCacheAge } from './utils/eventService';
import './App.css';

function App() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cacheAge, setCacheAge] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const data = await getEvents();
                setEvents(data);
                setCacheAge(getCacheAge());
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            const data = await refreshEvents();
            setEvents(data);
            setCacheAge(getCacheAge());
        } catch (err) {
            setError(err.message);
        } finally {
            setRefreshing(false);
        }
    };

    if (loading) return <div className="loading">Loading events...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="app">
            <header className="header">
                <div className="header-top">
                    <div>
                        <h1>UQ Free Events</h1>
                        <p>{events.length} events available</p>
                    </div>
                    <button
                        className={`refresh-btn ${refreshing ? 'loading' : ''}`}
                        onClick={handleRefresh}
                        disabled={refreshing}
                        title="Refresh from API"
                    >
                        ↻
                    </button>
                </div>
                {cacheAge !== null && (
                    <p className="cache-info">
                        Updated {cacheAge < 1 ? 'just now' : `${Math.round(cacheAge)}h ago`}
                    </p>
                )}
            </header>
            <main className="events-grid">
                {events.map((event) => (
                    <EventCard key={event.destination} event={event} />
                ))}
            </main>
        </div>
    );
}

export default App;
