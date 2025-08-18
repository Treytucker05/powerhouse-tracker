// Privacy-focused analytics utilities
// Safe alternative to Google Analytics that won't be blocked by ad blockers

class PrivacyAnalytics {
    constructor() {
        this.isEnabled = true;
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
    }

    generateSessionId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    // Track page views without personal data
    trackPageView(path) {
        if (!this.isEnabled || typeof window === 'undefined') return;

        try {
            const event = {
                type: 'pageview',
                path: path.replace(/\/\d+/g, '/:id'), // Remove specific IDs for privacy
                timestamp: Date.now(),
                sessionId: this.sessionId,
                referrer: document.referrer ? new URL(document.referrer).hostname : 'direct',
                userAgent: navigator.userAgent.slice(0, 100), // Truncated for privacy
            };

            // Store locally for now - could be sent to privacy-focused service
            this.storeEvent(event);
            console.log('📊 Analytics: Page view tracked', { path: event.path });
        } catch (error) {
            console.warn('Analytics tracking failed (safe to ignore):', error);
        }
    }

    // Track user interactions without personal data
    trackEvent(eventName, properties = {}) {
        if (!this.isEnabled || typeof window === 'undefined') return;

        try {
            const event = {
                type: 'event',
                name: eventName,
                properties: this.sanitizeProperties(properties),
                timestamp: Date.now(),
                sessionId: this.sessionId,
            };

            this.storeEvent(event);
            console.log('📊 Analytics: Event tracked', { name: eventName, properties });
        } catch (error) {
            console.warn('Analytics event tracking failed (safe to ignore):', error);
        }
    }

    sanitizeProperties(properties) {
        const sanitized = {};
        for (const [key, value] of Object.entries(properties)) {
            // Remove any personal data
            if (typeof value === 'string' && value.includes('@')) continue;
            if (key.toLowerCase().includes('email')) continue;
            if (key.toLowerCase().includes('password')) continue;
            if (key.toLowerCase().includes('token')) continue;

            sanitized[key] = typeof value === 'string' ? value.slice(0, 100) : value;
        }
        return sanitized;
    }

    storeEvent(event) {
        try {
            // Store in localStorage for local analytics (could be sent to server)
            const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
            events.push(event);

            // Keep only last 100 events
            if (events.length > 100) {
                events.splice(0, events.length - 100);
            }

            localStorage.setItem('analytics_events', JSON.stringify(events));
        } catch (error) {
            console.warn('Failed to store analytics event:', error);
        }
    }

    // Get session stats (for debugging)
    getSessionStats() {
        try {
            const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
            const sessionEvents = events.filter(e => e.sessionId === this.sessionId);

            return {
                sessionDuration: Date.now() - this.startTime,
                eventsCount: sessionEvents.length,
                pageViews: sessionEvents.filter(e => e.type === 'pageview').length,
                interactions: sessionEvents.filter(e => e.type === 'event').length,
            };
        } catch (error) {
            return { error: 'Failed to get stats' };
        }
    }

    // Opt-out functionality
    disable() {
        this.isEnabled = false;
        localStorage.setItem('analytics_disabled', 'true');
        console.log('📊 Analytics: Disabled');
    }

    enable() {
        this.isEnabled = true;
        localStorage.removeItem('analytics_disabled');
        console.log('📊 Analytics: Enabled');
    }

    isDisabled() {
        return localStorage.getItem('analytics_disabled') === 'true';
    }
}

// Create global instance
const analytics = new PrivacyAnalytics();

// Check if user has opted out
if (analytics.isDisabled()) {
    analytics.disable();
}

export default analytics;
