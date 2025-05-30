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
    "name": "Bar Miller",
    "address": null,
    "placeType": "Restaurant",
    "whatsGood": "Tagliatelle with uni, hand-rolled ziti, snow crab & togarashi lasagna, pasta dessert & caviar-topped ice cream",
    "vibe": "Interactive pasta omakase collab with Don Angie",
    "emoji": "🍝",
    "googleMapsUrl": "https://maps.google.com/?cid=9530206366881422164"
  }
]
```
