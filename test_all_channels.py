import urllib.request
import ssl
import sys

# Set standard output encoding to UTF-8
sys.stdout.reconfigure(encoding='utf-8')

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def get_iptv_streams():
    url = 'https://iptv-org.github.io/iptv/languages/kur.m3u'
    print(f"Fetching {url}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as response:
            content = response.read().decode('utf-8')
            return content
    except Exception as e:
        print(f"Error fetching: {e}")
        return ""

def parse_m3u(content):
    lines = content.split('\n')
    channels = []
    current = None
    for line in lines:
        line = line.strip()
        if line.startswith('#EXTINF:'):
            name_idx = line.rfind(',')
            name = line[name_idx+1:] if name_idx != -1 else "Unknown"
            logo_match = line.find('tvg-logo="')
            logo = ""
            if logo_match != -1:
                logo_start = logo_match + len('tvg-logo="')
                logo_end = line.find('"', logo_start)
                logo = line[logo_start:logo_end]
            group_match = line.find('group-title="')
            group = "General"
            if group_match != -1:
                group_start = group_match + len('group-title="')
                group_end = line.find('"', group_start)
                group = line[group_start:group_end]
            current = {"name": name, "logo": logo, "category": group}
        elif (line.startswith('http://') or line.startswith('https://')) and current:
            current["url"] = line
            channels.append(current)
            current = None
    return channels

content = get_iptv_streams()
if not content:
    sys.exit(1)

parsed = parse_m3u(content)
print(f"Found {len(parsed)} channels. Testing live status (timeout=3s)...")

active_channels = []
for index, chan in enumerate(parsed):
    name = chan["name"]
    url = chan["url"]
    # print(f"Testing {index+1}/{len(parsed)}: {name}...")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx, timeout=3) as res:
            if res.status == 200:
                chan["status"] = 200
                active_channels.append(chan)
                print(f"[ACTIVE] {name:30} | URL: {url}")
    except Exception as e:
        # Ignore failed ones
        pass

print(f"\nDone! Tested {len(parsed)} channels. Found {len(active_channels)} ACTIVE channels.")
for ac in active_channels:
    print(f"  {{ name: \"{ac['name']}\", logo: \"{ac['logo']}\", url: \"{ac['url']}\", category: \"{ac['category']}\", type: \"tv\", secure: {str(ac['url'].startswith('https')).lower()} }},")
