import { useState, useEffect } from 'react';
import EventCard from './components/EventCard';
import './App.css';

function App() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const response = await fetch('/free_events.json');
                if (!response.ok) throw new Error('Failed to load events');
                const data = await response.json();
                setEvents(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
    }, []);

    if (loading) return <div className="loading">Loading events...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="app">
            <header className="header">
                <h1>UQ Free Events</h1>
                <p>{events.length} events available</p>
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
