import '../styles/EventCard.css';

function EventCard({ event }) {
    return (
        <div className="event-card">
            {event.image && (
                <div className="event-image">
                    <img src={event.image} alt={event.title} />
                </div>
            )}
            <div className="event-content">
                <div className="event-header">
                    <h3 className="event-title">{event.title}</h3>
                    <span className="event-date">
                        {event.month} {event.day}
                    </span>
                </div>
                
                <p className="event-society">{event.societyname}</p>
                
                <div className="event-meta">
                    <span className="event-category">{event.subtitle}</span>
                    <span className="event-badge">{event.info}</span>
                </div>
            </div>
        </div>
    );
}

export default EventCard;
