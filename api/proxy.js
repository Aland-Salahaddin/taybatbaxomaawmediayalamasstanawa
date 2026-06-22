// Vercel Serverless Proxy - Bypasses CORS for stream CDN domains
// Also allows any HTTPS source for M3U playlist imports
const ALLOWED_DOMAINS = [
    'alkassdigital.net',
    'akamaized.net',
    'rudaw.net',
    'itworkscdn.net',
    'streamlockercdn.net',
    'host247.net',
    'streambrothers.com',
    'zoomnews.info',
    'karwan.tv',
    'github.io',
    'githubusercontent.com',
    'raw.githubusercontent.com',
    'ava1.store',
    'ava2.store',
    'ava3.store',
    'ava4.store',
    'ava5.store',
    'channel8.com',
    'avamedia.tv',
    'avatv.live',
    'amagi.tv',
    'cloudfront.net',
    '23.237.104.106',
    'bozztv.com',
    'jmp2.uk',
    'uplynk.com',
    'oottoo.online',
    'daioncdn.net'
];

export default async function handler(req, res) {
    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
        return res.status(204).end();
    }

    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'Missing url' });

    let targetUrl;
    try {
        targetUrl = decodeURIComponent(url);
        const parsed = new URL(targetUrl);
        const allowed = ALLOWED_DOMAINS.some(d => parsed.hostname === d || parsed.hostname.endsWith('.' + d));
        if (!allowed) return res.status(403).json({ error: 'Domain not allowed' });
    } catch (e) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    try {
        const upstream = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Origin': 'https://www.alkass.net',
                'Referer': 'https://www.alkass.net/',
            }
        });

        if (!upstream.ok) {
            return res.status(upstream.status).json({ error: `Upstream returned ${upstream.status}` });
        }

        const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
        const buffer = await upstream.arrayBuffer();

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'no-cache, no-store');

        // If it's an m3u8 manifest, rewrite absolute segment URLs to go through proxy too
        if (contentType.includes('mpegurl') || targetUrl.endsWith('.m3u8')) {
            const text = new TextDecoder().decode(buffer);
            const baseUrl = new URL(targetUrl);
            const rewritten = text.split('\n').map(line => {
                const trimmed = line.trim();
                if (trimmed === '') return line;
                
                // Rewrite URI="..." inside tags like #EXT-X-MEDIA
                if (trimmed.startsWith('#')) {
                    return trimmed.replace(/URI="([^"]+)"/g, (match, uri) => {
                        try {
                            const abs = new URL(uri, baseUrl).href;
                            return `URI="/api/proxy?url=${encodeURIComponent(abs)}"`;
                        } catch (e) {
                            return match;
                        }
                    });
                }
                
                // Rewrite absolute URLs
                if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
                    return '/api/proxy?url=' + encodeURIComponent(trimmed);
                }
                
                // Rewrite relative URLs to absolute then proxy
                try {
                    const abs = new URL(trimmed, baseUrl).href;
                    return '/api/proxy?url=' + encodeURIComponent(abs);
                } catch (e) {
                    return line;
                }
            }).join('\n');
            return res.send(rewritten);
        }

        return res.send(Buffer.from(buffer));
    } catch (e) {
        return res.status(500).json({ error: 'Proxy error: ' + e.message });
    }
}
