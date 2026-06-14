import urllib.request
import ssl
import sys

# Set standard output encoding to UTF-8 to prevent console crash on Windows
sys.stdout.reconfigure(encoding='utf-8')

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

streams = {
    "Rudaw TV (HD)": "https://live.rudaw.net/hls/rudaw-tv/master.m3u8",
    "Kurdistan 24 (HD)": "https://d1x82nydcxndze.cloudfront.net/live/index.m3u8",
    "Kurdsat TV (HD)": "https://hlspackager.akamaized.net/live/DB/KURDSAT_HD/HLS/KURDSAT_HD.m3u8",
    "Kurdsat News": "https://hlspackager.akamaized.net/live/DB/KURDSAT_NEWS/HLS/KURDSAT_NEWS.m3u8",
    "NRT TV": "https://media.streambrothers.com:1936/8226/8226/playlist.m3u8",
    "Zarok TV": "https://zindikurmanci.zaroktv.com.tr/hls/stream.m3u8",
    "Waar TV (HD)": "https://live.kwikmotion.com/waarmedialive/waarmedia.smil/waarmediapublish/waarmedia_source/chunks.m3u8",
    "Ronahi TV (HD)": "https://hlspackager.akamaized.net/live/DB/RONAHI_TV/HLS/RONAHI_TV.m3u8",
    "Rojava TV (HD)": "https://hlspackager.akamaized.net/live/DB/ROJAVA_HD/HLS/ROJAVA_HD.m3u8",
    "Al Iraqiya Sports HD": "https://imn-live.esite-lab.com/hls/iraqia-sports.m3u8",
    "TRT Spor HD": "https://tv-trtspor.medya.trt.com.tr/master.m3u8",
    "TRT Spor Yildiz HD": "https://tv-trtsporyildiz.medya.trt.com.tr/master.m3u8",
    "Rudaw Radio": "https://svs.itworkscdn.net/rudawlive/rudawlive.smil/rudawpublish/rudawradio_source/chunks.m3u8",
    "Kurdistan 24 Radio": "https://d1x82nydcxndze.cloudfront.net/radio/index.m3u8",
    "Babylon FM (Erbil)": "https://stream.zeno.fm/t2r7h1qws2hvv",
    "Dengi Kurdsat": "https://stream.zeno.fm/0t3zsh5sw2hvv"
}

print("Testing live streams...\n")
for name, url in streams.items():
    try:
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req, context=ctx, timeout=5) as response:
            status = response.status
            print(f"[ONLINE] {name:25} | Status: {status} | URL: {url}")
    except Exception as e:
        print(f"[OFFLINE] {name:25} | Error: {e} | URL: {url}")
