import { promises as fs } from 'fs';
import path from 'path';

// Set up the database path: /tmp/analytics_db.json on Vercel, or local path otherwise.
const IS_VERCEL = !!process.env.VERCEL;
const DB_PATH = IS_VERCEL 
    ? '/tmp/analytics_db.json' 
    : path.join(process.cwd(), 'analytics_db.json');

// Helper functions for JSON database operations
async function readDb() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        // Initialize db structure if file does not exist
        return { sessions: [] };
    }
}

async function writeDb(data) {
    try {
        await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
        console.error('Failed to write database:', e);
    }
}

// Simple browser/device extraction from User-Agent
function getDeviceType(ua) {
    if (!ua) return 'Desktop';
    if (/tablet|ipad|playbook|silk/i.test(ua)) return 'Tablet';
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Opera Mini/i.test(ua)) return 'Mobile';
    return 'Desktop';
}

function getBrowserType(ua) {
    if (!ua) return 'Unknown';
    if (/edg/i.test(ua)) return 'Edge';
    if (/chrome|crios/i.test(ua) && !/opr|opios|opera|edg/i.test(ua)) return 'Chrome';
    if (/safari/i.test(ua) && !/chrome|crios|opr|opios|opera|edg/i.test(ua)) return 'Safari';
    if (/firefox|fxios/i.test(ua)) return 'Firefox';
    if (/opr|opios|opera/i.test(ua)) return 'Opera';
    return 'Other';
}

function getOsType(ua) {
    if (!ua) return 'Unknown';
    if (/windows/i.test(ua)) return 'Windows';
    if (/macintosh|mac os x/i.test(ua) && !/ipad|iphone|ipod/i.test(ua)) return 'macOS';
    if (/android/i.test(ua)) return 'Android';
    if (/ipad|iphone|ipod/i.test(ua)) return 'iOS';
    if (/linux/i.test(ua)) return 'Linux';
    return 'Other';
}

export default async function handler(req, res) {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    const url = req.url || '';
    
    // Route 1: POST /api/analytics/track
    if (url.includes('/track') && req.method === 'POST') {
        const { visitorId, sessionId, action, channelName, referrer, language } = req.body;
        const ua = req.headers['user-agent'] || '';
        const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';

        if (!visitorId || !sessionId) {
            return res.status(400).json({ error: 'Missing visitorId or sessionId' });
        }

        const db = await readDb();
        let session = db.sessions.find(s => s.sessionId === sessionId);

        if (!session) {
            session = {
                sessionId,
                visitorId,
                ip: ip === '::1' ? '127.0.0.1' : ip,
                userAgent: ua,
                device: getDeviceType(ua),
                browser: getBrowserType(ua),
                os: getOsType(ua),
                language: language || 'en',
                referrer: referrer || 'Direct',
                startTime: Date.now(),
                lastActive: Date.now(),
                duration: 0,
                history: []
            };
            db.sessions.push(session);
        }

        session.lastActive = Date.now();
        session.duration = Math.round((Date.now() - session.startTime) / 1000);

        const eventDetail = { action, time: Date.now() };
        if (action === 'channel_play' && channelName) {
            eventDetail.channel = channelName;
        }
        session.history.push(eventDetail);

        await writeDb(db);
        return res.status(200).json({ success: true });
    }

    // Route 2: POST /api/analytics/heartbeat
    if (url.includes('/heartbeat') && req.method === 'POST') {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({ error: 'Missing sessionId' });
        }

        const db = await readDb();
        const session = db.sessions.find(s => s.sessionId === sessionId);

        if (session) {
            session.lastActive = Date.now();
            session.duration = Math.round((Date.now() - session.startTime) / 1000);
            await writeDb(db);
            return res.status(200).json({ success: true, active: true });
        }

        return res.status(200).json({ success: false, active: false });
    }

    // Route 3: GET /api/analytics/stats
    if (url.includes('/stats') && req.method === 'GET') {
        const db = await readDb();
        const now = Date.now();

        // Active users: sent a heartbeat in the last 2 minutes
        const activeThreshold = 2 * 60 * 1000;
        const activeSessions = db.sessions.filter(s => (now - s.lastActive) < activeThreshold);
        const activeUsersCount = new Set(activeSessions.map(s => s.visitorId)).size;

        // Total counts
        const totalSessions = db.sessions.length;
        const uniqueVisitorsCount = new Set(db.sessions.map(s => s.visitorId)).size;

        // Average duration
        const validSessions = db.sessions.filter(s => s.duration > 0);
        const avgDuration = validSessions.length > 0 
            ? Math.round(validSessions.reduce((acc, s) => acc + s.duration, 0) / validSessions.length)
            : 0;

        // Device breakdown
        const deviceStats = { Desktop: 0, Mobile: 0, Tablet: 0 };
        db.sessions.forEach(s => {
            if (deviceStats[s.device] !== undefined) {
                deviceStats[s.device]++;
            } else {
                deviceStats['Desktop']++;
            }
        });

        // Browser breakdown
        const browserStats = {};
        db.sessions.forEach(s => {
            browserStats[s.browser] = (browserStats[s.browser] || 0) + 1;
        });

        // OS breakdown
        const osStats = {};
        db.sessions.forEach(s => {
            osStats[s.os] = (osStats[s.os] || 0) + 1;
        });

        // Top channels played
        const channelPlayCounts = {};
        db.sessions.forEach(s => {
            s.history.forEach(h => {
                if (h.action === 'channel_play' && h.channel) {
                    channelPlayCounts[h.channel] = (channelPlayCounts[h.channel] || 0) + 1;
                }
            });
        });
        const topChannels = Object.entries(channelPlayCounts)
            .map(([channel, count]) => ({ channel, count }))
            .sort((a, b) => b.count - a.count);

        // Recent active user activities for the live feed
        const recentSessions = [...db.sessions]
            .sort((a, b) => b.lastActive - a.lastActive)
            .slice(0, 15)
            .map(s => {
                const lastAction = s.history[s.history.length - 1] || { action: 'Joined', time: s.startTime };
                return {
                    visitorId: s.visitorId,
                    ip: s.ip,
                    device: s.device,
                    browser: s.browser,
                    os: s.os,
                    referrer: s.referrer,
                    startTime: s.startTime,
                    lastActive: s.lastActive,
                    duration: s.duration,
                    lastAction
                };
            });

        // Hourly visits in the last 24 hours
        const hourlyVisits = Array(24).fill(0);
        const oneDayAgo = now - 24 * 60 * 60 * 1000;
        db.sessions.forEach(s => {
            if (s.startTime > oneDayAgo) {
                const hourIndex = Math.floor((s.startTime - oneDayAgo) / (60 * 60 * 1000));
                if (hourIndex >= 0 && hourIndex < 24) {
                    hourlyVisits[hourIndex]++;
                }
            }
        });

        return res.status(200).json({
            activeUsers: activeUsersCount,
            totalSessions,
            uniqueVisitors: uniqueVisitorsCount,
            avgDuration,
            deviceStats,
            browserStats,
            osStats,
            topChannels,
            recentSessions,
            hourlyVisits
        });
    }

    return res.status(404).json({ error: 'Endpoint not found' });
}
