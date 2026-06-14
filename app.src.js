// Stream Blacklist (Filters Kurmanji and other unwanted channels)
const BLACKLIST_TERMS = [
    "waar",
    "ronahi",
    "rojava",
    "4kurd",
    "4 kurd",
    "medmuzik",
    "med muzik",
    "kurdmax",
    "ilke",
    "jin tv",
    "komala",
    "kurd channel",
    "kurdchanel",
    "mixkurdy",
    "trt kurd",
    "zarok",
    "atrak",
    "azerbaijan gharbi",
    "cira tv",
    "├ºira tv",
    "aryen",
    "sterk",
    "st├¬rk",
    "nubar",
    "k24",
    "kurdistan 24",
    "kurdistan tv",
    "al iraqia tv",
    "al iraqia kurdish",
    "iraqia kurdish",
    "kurmanji",
    "kurmanci",
    "nrt 720p",
    "not 24/7",
    "zoom tv",
    "alkass two",
    "alkass three",
    "alkass five"
];

function isBlacklisted(name, url) {
    const n = (name || "").toLowerCase();
    const u = (url || "").toLowerCase();
    
    // Check if name or url contains any blacklisted term
    for (const term of BLACKLIST_TERMS) {
        if (n.includes(term) || u.includes(term)) {
            return true;
        }
    }
    
    // Block general Iraqia channels but keep Iraqiya Sports
    if ((n.includes("iraqia") || n.includes("iraqiya")) && !n.includes("sport")) {
        return true;
    }
    if ((u.includes("iraqia") || u.includes("iraqiya")) && !u.includes("sport")) {
        return true;
    }
    
    return false;
}

// Predefined Channels Database (Sorani Kurdish & Sports/Radio Channels)
const CORE_CHANNELS = [
    // Predefined TV Channels (Sorani News & Entertainment)
    { name: "Rudaw TV (HD)", logo: "https://i.imgur.com/Zo3IWOn.png", url: atob("aHR0cHM6Ly9saXZlLnJ1ZGF3Lm5ldC9obHMvcnVkYXctdHYvbWFzdGVyLm0zdTg="), category: "News", type: "tv", secure: true },
    { name: "Kurdsat TV (HD)", logo: "https://i.imgur.com/UAbSwYA.png", url: atob("aHR0cHM6Ly9obHNwYWNrYWdlci5ha2FtYWl6ZWQubmV0L2xpdmUvREIvS1VSRFNBVF9IRC9ITFMvS1VSRFNBVF9IRC5tM3U4"), category: "Entertainment", type: "tv", secure: true },
    { name: "Kurdsat News", logo: "https://i.imgur.com/F3XRwkt.png", url: atob("aHR0cHM6Ly9obHNwYWNrYWdlci5ha2FtYWl6ZWQubmV0L2xpdmUvREIvS1VSRFNBVF9ORVdTL0hMUy9LVVJEU0FUX05FV1MubTN1OA=="), category: "News", type: "tv", secure: true },
    { name: "Channel 8 Kurdish", logo: "assets/channel8.webp", url: atob("aHR0cHM6Ly9saXZlLmNoYW5uZWw4LmNvbS9DaGFubmVsOC1LdXJkaXNoL2luZGV4LmZtcDQubTN1OA=="), category: "News", type: "tv", secure: true },
    { name: "Ava TV", logo: "https://ava.news/apple-touch-icon.png", url: atob("aHR0cHM6Ly9hdmExLnN0b3JlL3VwbG9hZC9hdmEubTN1OA=="), altUrls: [atob("aHR0cHM6Ly9hdmEzLnN0b3JlL3VwbG9hZC9hdmEubTN1OA=="), atob("aHR0cHM6Ly9hdmE0LnN0b3JlL3VwbG9hZC9hdmEubTN1OA==")], category: "General", type: "tv", secure: true },
    { name: "Ava Sport", logo: "https://unavatar.io/youtube/avasportchannel", url: "https://www.krdtv.online/api/hls-proxy?url=https%3A%2F%2Fprod-fastly-us-west-2.video.pscp.tv%2FTranscoding%2Fv1%2Fhls%2FIL2FtCXmdtapcgzf79rR0LjvR4-e6D4edaWmgyb4A8OR77mHEltRsG3qmStF86VxviiQuYJcI8vFo2vao-9t0w%2Ftranscode%2Fus-west-2%2Fperiscope-replay-direct-prod-us-west-2-public%2FeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsInZlcnNpb24iOiIyIn0.eyJFbmNvZGVyU2V0dGluZyI6ImVuY29kZXJfc2V0dGluZ183MjBwMzBfMTAiLCJIZWlnaHQiOjcyMCwiS2JwcyI6Mjc1MCwiV2lkdGgiOjEyODB9.ldktM4fCFRfkP4ZEBfZPKtlAUNAcTPkoz994YJAzWpE%2F%2Fdynamic_playlist.m3u8%3Ftype%3Dlive", category: "Sports", type: "tv", secure: true },
    { name: "Afarin TV", logo: "assets/Afarin_logo.png", url: atob("aHR0cHM6Ly82NWYxNmYwZmRmYzUxLnN0cmVhbWxvY2submV0L2FmYXJpblRWL2xpdmVzdHJlYW0vcGxheWxpc3QubTN1OA=="), category: "Kids", type: "tv", secure: true },
    { name: "Afarin Baxcha", logo: "https://i.postimg.cc/4xRkBDRx/Afarin-Baxcha-200.png", url: atob("aHR0cHM6Ly81ZGNhYmYwMjZiMTg4LnN0cmVhbWxvY2submV0L2FmYXJpblRWL2xpdmVzdHJlYW0vcGxheWxpc3QubTN1OA=="), category: "Kids", type: "tv", secure: true },
    { name: "EmanTv", logo: "https://i.imgur.com/QmgaPSi.png", url: atob("aHR0cHM6Ly9hdnIuaG9zdDI0Ny5uZXQvbGl2ZS9lbWFudHYvcGxheWxpc3QubTN1OA=="), category: "General", type: "tv", secure: true },
    { name: "FarmodaTV", logo: "https://i.imgur.com/x4KCQlH.png", url: atob("aHR0cHM6Ly9hdnIuaG9zdDI0Ny5uZXQvbGl2ZS9GYXJtb2RhVFYvcGxheWxpc3QubTN1OA=="), category: "General", type: "tv", secure: true },
    { name: "Payam TV", logo: "assets/payam.png", url: atob("aHR0cHM6Ly9tZWRpYTIuc3RyZWFtYnJvdGhlcnMuY29tOjE5MzYvODIxOC84MjE4L3BsYXlsaXN0Lm0zdTg="), category: "News", type: "tv", secure: true },
    { name: "Avar TV", logo: "https://i.imgur.com/JazFBkW.jpeg", url: atob("aHR0cHM6Ly9hdnIuaG9zdDI0Ny5uZXQvbGl2ZS9BdmFyVHYvcGxheWxpc3QubTN1OA=="), category: "General", type: "tv", secure: true },
    
    // International Football Channels (┌⌐█ò┘å╪º┌╡█ò ╪¼█î┘ç╪º┘å█î█ò┌⌐╪º┘å█î ╪¬█å┘╛█î ┘╛█Ä)
    { name: "Alkass One", logo: "https://i.imgur.com/10mmlha.png", url: atob("aHR0cHM6Ly9saXZlZXUtZ2NwLmFsa2Fzc2RpZ2l0YWwubmV0L2Fsa2FzczEtcC9tYWluLm0zdTg="), category: "Sports", type: "tv", secure: true },
    { name: "Alkass Four", logo: "https://i.imgur.com/iDL65Wu.png", url: atob("aHR0cHM6Ly9saXZlZXUtZ2NwLmFsa2Fzc2RpZ2l0YWwubmV0L2Fsa2FzczQtcC9tYWluLm0zdTg="), category: "Sports", type: "tv", secure: true },
];

// App State Management
let allChannels = [...CORE_CHANNELS];
let favoriteChannels = (JSON.parse(localStorage.getItem('kurdmedia_favorites')) || [])
    .filter(fav => !isBlacklisted(fav.name, fav.url));
let activeTab = 'tv'; // tv, favorites
let activeCategory = 'all';
let searchQuery = '';

// Media Elements & Control State
const videoTag = document.getElementById('hls-video');
let currentHlsInstance = null;
let currentPlayingChannel = null;

// UI Elements References
const gridContainer = document.getElementById('channels-grid-container');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const streamsCountLabel = document.getElementById('streams-count');

// TV Video Modal UI Elements
const videoModal = document.getElementById('video-modal');
const btnCloseVideo = document.getElementById('btn-close-video');
const modalTitle = document.getElementById('modal-title');
const modalCategory = document.getElementById('modal-category');
const modalLogo = document.getElementById('modal-logo');
const videoLoader = document.getElementById('video-loader');
const videoErrorMsg = document.getElementById('video-error-msg');
const videoErrorText = document.getElementById('video-error-text');



/* ==========================================
   1. Initialization & Dynamic Fetching
   ========================================== */

/* Custom toast notification (replaces browser alert()) */
function showToast(message, type = 'info') {
    const existing = document.getElementById('sm-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'sm-toast';
    toast.style.cssText = `
        position:fixed;top:24px;left:50%;transform:translateX(-50%);
        background:${type === 'error' ? '#c0392b' : '#1a1d2e'};
        border:1px solid ${type === 'error' ? '#e74c3c' : 'rgba(226,162,39,0.4)'};
        color:#fff;padding:14px 24px;border-radius:12px;
        font-family:'Outfit',sans-serif;font-size:14px;
        box-shadow:0 8px 32px rgba(0,0,0,0.5);
        z-index:99999;max-width:400px;text-align:center;
        display:flex;flex-direction:column;gap:4px;
        animation:fadeInDown 0.3s ease;
    `;
    toast.innerHTML = `
        <span style="font-size:11px;font-weight:600;color:#e2a227;letter-spacing:1px;">ShutyMedia</span>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.style.opacity = '0', 2700);
    setTimeout(() => toast.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    generateStarfield();
    setupEventListeners();
    updateUI();
    
    // Proactively fetch live playlists
    fetchKurdishTVPlaylists();
});

// Dynamic Stars generator for background
function generateStarfield() {
    const starsContainer = document.getElementById('stars-container');
    const starCount = 80;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = `${Math.random() * 2}px`;
        star.style.height = star.style.width;
        star.style.backgroundColor = '#ffffff';
        star.style.borderRadius = '50%';
        star.style.opacity = Math.random() * 0.7;
        
        // Random locations
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        
        // Floating/pulsing animation
        if (Math.random() > 0.5) {
            star.style.animation = `bounce ${3 + Math.random() * 5}s infinite alternate ease-in-out`;
            star.style.animationDelay = `${Math.random() * 5}s`;
        }
        
        starsContainer.appendChild(star);
    }
}

// Fetch and Parse Kurdish M3U Live TV Playlist from IPTV-org
async function fetchKurdishTVPlaylists() {
    try {
        const response = await fetch('https://iptv-org.github.io/iptv/languages/kur.m3u');
        if (!response.ok) throw new Error('Network issue fetching main list');
        const m3uText = await response.text();
        parseAndMergeM3U(m3uText, 'tv');
    } catch (e) {
        console.warn('Could not fetch main Kurdish M3U, attempting fallback central list.', e);
        try {
            const secondaryResponse = await fetch('https://iptv-org.github.io/iptv/languages/ckb.m3u');
            if (secondaryResponse.ok) {
                const ckbM3uText = await secondaryResponse.text();
                parseAndMergeM3U(ckbM3uText, 'tv');
            }
        } catch (err) {
            console.error('Fallback fetch failed too. Using predefined list.', err);
        }
    }
}



// Simple Parser for M3U playlist files
function parseAndMergeM3U(m3uContent, defaultType = 'tv') {
    const lines = m3uContent.split(/\r?\n/);
    const parsedChannels = [];
    let currentMetadata = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('#EXTINF:')) {
            // Parse metadata
            const nameMatch = line.match(/,(.+)$/);
            const logoMatch = line.match(/tvg-logo="([^"]+)"/);
            const groupMatch = line.match(/group-title="([^"]+)"/);
            
            const name = nameMatch ? nameMatch[1].trim() : "Unnamed Channel";
            const logo = logoMatch ? logoMatch[1] : "";
            let category = groupMatch ? groupMatch[1] : "General";
            
            // Map category naming
            if (category === "Undefined") category = "General";
            
            currentMetadata = {
                name: name,
                logo: logo,
                category: category,
                type: defaultType
            };
        } else if (line.startsWith('http://') || line.startsWith('https://')) {
            if (currentMetadata) {
                currentMetadata.url = line;
                currentMetadata.secure = line.startsWith('https://');
                parsedChannels.push(currentMetadata);
                currentMetadata = null;
            }
        }
    }

    if (parsedChannels.length > 0) {
        mergeChannelsList(parsedChannels);
    }
}

// Merge list with duplicate handling and blacklist filtering
function mergeChannelsList(newList) {
    newList.forEach(newChan => {
        if (isBlacklisted(newChan.name, newChan.url)) {
            return; // Skip blacklisted channels
        }
        const exists = allChannels.some(c => 
            c.url.toLowerCase() === newChan.url.toLowerCase() || 
            c.name.toLowerCase() === newChan.name.toLowerCase()
        );
        if (!exists) {
            allChannels.push(newChan);
        }
    });
    updateUI();
}

/* ==========================================
   2. UI Updates & Rendering
   ========================================== */

function updateUI() {
    // 1. Update count
    streamsCountLabel.textContent = `${allChannels.length} Channels Active`;

    // 2. Clear grid
    gridContainer.innerHTML = '';

    // 3. Filter channels
    const filtered = allChannels.filter(chan => {
        // Active Navigation Tab Check
        if (activeTab === 'tv' && chan.type !== 'tv') return false;
        if (activeTab === 'favorites') {
            const isFav = favoriteChannels.some(fav => fav.url === chan.url);
            if (!isFav) return false;
        }

        // Category Check
        if (activeCategory !== 'all') {
            if (activeCategory === 'Sports' && chan.category !== 'Sports') return false;
            if (activeCategory !== 'Sports' && chan.category === 'Sports') return false; // separate sports
            if (chan.category.toLowerCase() !== activeCategory.toLowerCase()) return false;
        }

        // Search Query Check
        if (searchQuery) {
            const nameMatch = chan.name.toLowerCase().includes(searchQuery);
            const catMatch = chan.category.toLowerCase().includes(searchQuery);
            if (!nameMatch && !catMatch) return false;
        }

        return true;
    });

    // 4. Handle Empty State
    if (filtered.length === 0) {
        if (activeTab === 'favorites') {
            emptyState.innerHTML = `
                <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                <h3>No Favorites Yet</h3>
                <p>You haven't added any channels to your favorites. Click the heart icon on a channel to save it here.</p>
            `;
        } else {
            emptyState.innerHTML = `
                <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                <h3>No Channels Found</h3>
                <p>We couldn't find any channels matching your search or filters.</p>
            `;
        }
        emptyState.style.display = 'flex';
    } else {
        emptyState.style.display = 'none';
        
        // Render Cards
        filtered.forEach(chan => {
            const card = createChannelCard(chan);
            gridContainer.appendChild(card);
        });
    }
}

function createChannelCard(chan) {
    const card = document.createElement('div');
    card.className = 'channel-card';
    
    // Check if favorited
    const isFav = favoriteChannels.some(fav => fav.url === chan.url);
    
    // Fallback logo if empty
    const logoUrl = chan.logo || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='40' height='40'%3E%3Crect width='100%25' height='100%25' fill='%231f2330'/%3E%3Ccircle cx='12' cy='12' r='4' fill='%23e2a227'/%3E%3C/svg%3E";

    card.innerHTML = `
        <button class="card-favorite-btn ${isFav ? 'active' : ''}">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
        <div class="card-logo-wrapper">
            <img class="card-logo" src="${logoUrl}" alt="${chan.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='40' height='40'%3E%3Crect width='100%25' height='100%25' fill='%2312141c'/%3E%3C/svg%3E'">
        </div>
        <h3 class="card-title">${chan.name}</h3>
        <span class="card-type-badge ${chan.type}">${chan.type.toUpperCase()} - ${chan.category}</span>
        <div class="card-play-overlay">
            <div class="play-circle">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </div>
        </div>
    `;

    // Click on favorite button
    card.querySelector('.card-favorite-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(chan);
    });

    // Click on card plays the stream
    card.addEventListener('click', () => {
        playMedia(chan);
    });

    return card;
}

function toggleFavorite(chan) {
    const index = favoriteChannels.findIndex(fav => fav.url === chan.url);
    if (index === -1) {
        favoriteChannels.push(chan);
    } else {
        favoriteChannels.splice(index, 1);
    }
    localStorage.setItem('kurdmedia_favorites', JSON.stringify(favoriteChannels));
    updateUI();
}

/* ==========================================
   3. Playback Controls & Video Modals
   ========================================== */

function playMedia(chan) {
    openVideoModal(chan);
}

// -- TV HLS Video Stream Engine & Retries --
let currentStreamUrl = "";
let currentAltIndex = -1;
let streamTimeoutTimer = null;

const STREAM_ALT_URLS = {
    "https://d1x82nydcxndze.cloudfront.net/live/index.m3u8": [
        "https://d1x82nydcxndze.cloudfront.net/live/index_720p25.m3u8",
        "https://d1x82nydcxndze.cloudfront.net/live/index_480p25.m3u8",
        "https://d1x82nydcxndze.cloudfront.net/live/index_360p25.m3u8"
    ],
    "https://live.rudaw.net/hls/rudaw-tv/master.m3u8": [
        "https://svs.itworkscdn.net/rudawlive/rudawlive.smil/playlist.m3u8",
        "https://svs.itworkscdn.net/rudawlive/rudawlive.smil/rudawpublish/rudawtv_source/chunks.m3u8"
    ],
    "https://hlspackager.akamaized.net/live/DB/KURDSAT_HD/HLS/KURDSAT_HD.m3u8": [
        "https://kurdsat.akamaized.net/hls/stream_0.m3u8"
    ]
};

function openVideoModal(chan) {
    videoModal.classList.add('active');
    modalTitle.textContent = chan.name;
    modalCategory.textContent = chan.category;
    modalLogo.src = chan.logo || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='40' height='40'%3E%3Crect width='100%25' height='100%25' fill='%231f2330'/%3E%3Ccircle cx='12' cy='12' r='4' fill='%23e2a227'/%3E%3C/svg%3E";
    
    // Set external browser button link
    const btnOpenExternal = document.getElementById('btn-open-external');
    if (btnOpenExternal) {
        btnOpenExternal.href = chan.externalUrl || chan.url;
    }
    
    // Reset retry state
    currentStreamUrl = chan.url;
    currentAltIndex = -1;
    if (streamTimeoutTimer) {
        clearTimeout(streamTimeoutTimer);
        streamTimeoutTimer = null;
    }
    
    loadHlsStream(currentStreamUrl, chan);
}

function loadHlsStream(url, chan) {
    // Set loading state
    videoLoader.style.display = 'flex';
    videoErrorMsg.style.display = 'none';

    // Set 6-second connection timeout to prevent endless hanging loader
    if (streamTimeoutTimer) clearTimeout(streamTimeoutTimer);
    streamTimeoutTimer = setTimeout(() => {
        console.warn("Connection timeout. Trying alternative stream.");
        handleStreamFailure(chan);
    }, 6000);

    // Update external link
    const btnOpenExternal = document.getElementById('btn-open-external');
    if (btnOpenExternal) {
        btnOpenExternal.href = chan.externalUrl || url;
    }

    if (Hls.isSupported()) {
        if (currentHlsInstance) currentHlsInstance.destroy();
        
        // Domains that block CORS — route through our Vercel proxy
        const PROXY_DOMAINS = [
            'alkassdigital.net',
            'akamaized.net',
            'itworkscdn.net',
            'streamlockercdn.net',
            'streambrothers.com',
            'zoomnews.info',
            'amagi.tv'
        ];

        function needsProxy(u) {
            try {
                const h = new URL(u).hostname;
                return PROXY_DOMAINS.some(d => h === d || h.endsWith('.' + d));
            } catch(e) { return false; }
        }

        function toProxy(u) {
            return needsProxy(u) ? '/api/proxy?url=' + encodeURIComponent(u) : u;
        }

        currentHlsInstance = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            fetchSetup: function(context, initParams) {
                context.url = toProxy(context.url);
                return new Request(context.url, initParams);
            },
            xhrSetup: function(xhr, url) {
                const proxied = toProxy(url);
                if (proxied !== url) {
                    xhr.open('GET', proxied, true);
                }
            }
        });
        currentHlsInstance.loadSource(url);
        currentHlsInstance.attachMedia(videoTag);
        
        currentHlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
            if (streamTimeoutTimer) {
                clearTimeout(streamTimeoutTimer);
                streamTimeoutTimer = null;
            }
            videoLoader.style.display = 'none';
            videoTag.play().catch(err => {
                console.warn("Auto-play blocked by browser. User gesture needed.", err);
            });
        });

        currentHlsInstance.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.log('fatal network error encountered, try to recover');
                        currentHlsInstance.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.log('fatal media error encountered, try to recover');
                        currentHlsInstance.recoverMediaError();
                        break;
                    default:
                        if (streamTimeoutTimer) {
                            clearTimeout(streamTimeoutTimer);
                            streamTimeoutTimer = null;
                        }
                        handleStreamFailure(chan);
                        break;
                }
            }
        });
    } else if (videoTag.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS (iOS Safari, Mac Safari)
        videoTag.src = url;
        videoTag.play();
        videoTag.addEventListener('loadedmetadata', () => {
            if (streamTimeoutTimer) {
                clearTimeout(streamTimeoutTimer);
                streamTimeoutTimer = null;
            }
            videoLoader.style.display = 'none';
        });
        videoTag.addEventListener('error', () => {
            if (streamTimeoutTimer) {
                clearTimeout(streamTimeoutTimer);
                streamTimeoutTimer = null;
            }
            handleStreamFailure(chan);
        });
    } else {
        if (streamTimeoutTimer) {
            clearTimeout(streamTimeoutTimer);
            streamTimeoutTimer = null;
        }
        videoLoader.style.display = 'none';
        videoErrorText.textContent = "Your web browser cannot play HLS (.m3u8) live streams natively.";
        videoErrorMsg.style.display = 'flex';
    }
}

function handleStreamFailure(chan) {
    // Find alternatives
    const alts = STREAM_ALT_URLS[chan.url] || [];
    currentAltIndex++;
    
    if (currentAltIndex < alts.length) {
        console.log(`Stream failed. Trying alternative stream ${currentAltIndex + 1}/${alts.length}: ${alts[currentAltIndex]}`);
        loadHlsStream(alts[currentAltIndex], chan);
    } else {
        // Clear timeout
        if (streamTimeoutTimer) {
            clearTimeout(streamTimeoutTimer);
            streamTimeoutTimer = null;
        }
        // All alternatives failed, show error modal
        videoLoader.style.display = 'none';
        videoErrorMsg.style.display = 'flex';
        if (!chan.secure && window.location.protocol === 'https:') {
            videoErrorText.innerHTML = `This stream is insecure (HTTP). Your browser blocks loading insecure content on secure sites.<br><br>To play it, try loading the app on <b>localhost</b> or use a CORS-free browser.`;
        } else {
            videoErrorText.innerHTML = `The stream failed to load. The stream server might be offline or has rotated its CDN link.<br><br>Try launching it directly using the <b>"Open in Browser"</b> button below.`;
        }
    }
}

function stopVideo() {
    if (streamTimeoutTimer) {
        clearTimeout(streamTimeoutTimer);
        streamTimeoutTimer = null;
    }
    videoTag.pause();
    videoTag.src = "";
    if (currentHlsInstance) {
        currentHlsInstance.destroy();
        currentHlsInstance = null;
    }
    videoModal.classList.remove('active');
}

/* ==========================================
   4. Event Listeners & Interactions
   ========================================== */

function setupEventListeners() {
    // Navigation Tab Toggles
    const navButtons = {
        'nav-tv': 'tv',
        'nav-favorites': 'favorites'
    };

    Object.keys(navButtons).forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', (e) => {
                // Remove active classes
                Object.keys(navButtons).forEach(id => {
                    const b = document.getElementById(id);
                    if (b) b.classList.remove('active');
                });
                
                // Add active to current
                e.currentTarget.classList.add('active');
                activeTab = navButtons[btnId];
                updateUI();
            });
        }
    });

    // Search Input Event
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        updateUI();
    });

    // Category Filter Buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            activeCategory = e.currentTarget.getAttribute('data-category');
            updateUI();
        });
    });

    // Close TV Modal Trigger
    btnCloseVideo.addEventListener('click', () => {
        stopVideo();
    });

    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            stopVideo();
        }
    });
}



/* ==========================================
   5. Security & Privacy Protections
   ========================================== */

// 1. Prevent Right-Click context menu (Inspect Element)
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// 2. Prevent F12 and standard inspection hotkeys
document.addEventListener('keydown', (e) => {
    // Disable F12
    if (e.key === 'F12') {
        e.preventDefault();
        return false;
    }
    // Disable Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+U (View Source)
    if (e.ctrlKey && (e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j') || e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        return false;
    }
});

// 3. debugger loop to interrupt DevTools if opened via browser menu
setInterval(() => {
    (function() {
        debugger;
    }());
}, 1000);
