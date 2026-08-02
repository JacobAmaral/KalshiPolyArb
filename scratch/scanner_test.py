import urllib.request
import json
import re
from datetime import datetime

def fetch_data():
    k_req = urllib.request.Request('https://external-api.kalshi.com/trade-api/v2/events?limit=200&status=open', headers={'User-Agent': 'Mozilla/5.0'})
    k_events = json.loads(urllib.request.urlopen(k_req).read().decode('utf-8')).get('events', [])

    p_req = urllib.request.Request('https://gamma-api.polymarket.com/events?limit=100&active=true&closed=false', headers={'User-Agent': 'Mozilla/5.0'})
    p_events = json.loads(urllib.request.urlopen(p_req).read().decode('utf-8'))

    print(f"Loaded {len(k_events)} Kalshi events and {len(p_events)} Polymarket events.")

    matches = []

    for k in k_events:
        ktitle = k.get('title', '')
        kticker = k.get('event_ticker', '')
        # Get Kalshi sub markets
        kmkts = k.get('markets', [])
        k_exp = None
        if kmkts and kmkts[0].get('expiration_time'):
            k_exp = kmkts[0].get('expiration_time')[:10]

        for p in p_events:
            ptitle = p.get('title', '')
            pslug = p.get('slug', '')
            p_exp = p.get('endDate', '')[:10] if p.get('endDate') else None

            # Topic / Keyword matching logic
            kt_clean = re.sub(r'[^\w\s]', '', ktitle.lower())
            pt_clean = re.sub(r'[^\w\s]', '', ptitle.lower())

            k_words = set(w for w in kt_clean.split() if len(w) > 3 and w not in ['will', 'before', 'after', 'first', 'than', 'into', 'with', 'from', 'have', 'been', 'which', 'who', 'what', 'when', 'where', '2025', '2026', '2027', '2028', '2030'])
            p_words = set(w for w in pt_clean.split() if len(w) > 3 and w not in ['will', 'before', 'after', 'first', 'than', 'into', 'with', 'from', 'have', 'been', 'which', 'who', 'what', 'when', 'where', '2025', '2026', '2027', '2028', '2030'])

            overlap = k_words.intersection(p_words)

            if len(overlap) >= 2 or (len(overlap) == 1 and list(overlap)[0] in ['macron', 'netanyahu', 'zelenskyy', 'putin', 'taiwan', 'superbowl', 'gta6', 'hyperliquid', 'megaeth', 'spacex']):
                # Check expiration alignment
                exp_match = False
                if k_exp and p_exp:
                    k_year = k_exp[:4]
                    p_year = p_exp[:4]
                    if k_year == p_year:
                        exp_match = True

                matches.append({
                    'kalshi_ticker': kticker,
                    'kalshi_title': ktitle,
                    'kalshi_exp': k_exp,
                    'poly_slug': pslug,
                    'poly_title': ptitle,
                    'poly_exp': p_exp,
                    'overlap_keywords': list(overlap),
                    'exp_match': exp_match
                })

    print(f"\nFound {len(matches)} potential matched events across APIs:\n")
    for m in matches:
        status = "[MATCHED & EXP ALIGNED]" if m['exp_match'] else "[EXP MISMATCHED - FILTERED OUT]"
        print(f"{status}")
        print(f"  Kalshi: [{m['kalshi_ticker']}] \"{m['kalshi_title']}\" (Exp: {m['kalshi_exp']})")
        print(f"  Poly:   [{m['poly_slug']}] \"{m['poly_title']}\" (Exp: {m['poly_exp']})")
        print(f"  Overlap: {m['overlap_keywords']}")
        print("-" * 60)

if __name__ == '__main__':
    fetch_data()
