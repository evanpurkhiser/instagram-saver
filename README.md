A small API which uses AI to extract place names from Instagram Reels
("My top 5 Thai Resturuants in NYC" type videos).

The input is simply a instagram URL

```
curl http://127.0.0.1:3006/i/https://www.instagram.com/p/DKNy8qPOd6C/
```

The output is a list of places:

```json
[
  {
    "name": "Chad NYC",
    "address": null,
    "placeType": "Restaurant",
    "whatsGood": "Pandan-peanut gluten-free dumplings, beef tartare w/ coconut milk & rice chips, pan-seared duck breast red curry, fall-off-the-bone short rib curry, shrimp pad thai, GF fried rice, papaya salad with crab, coconut ice cream",
    "vibe": "Gorgeous modern space with fun, photogenic cocktails",
    "emoji": "🥟",
    "googleMapsUrl": "https://maps.google.com/?cid=12110630138132854106",
    "instagramUrl": "https://instagram.com/p/DKNy8qPOd6C"
  }
]
```
