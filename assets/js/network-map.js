/* ==========================================================================
   Oceanus Line – Interactive network map (network.html)

   Replaces the static network-map.jpg with a real, pannable map. Every port
   we call at is a pin, grouped into the same nine regions listed further down
   the page, plus the Dubai corporate office. Built on self-hosted Leaflet so
   the page keeps working with no third-party API key.
   ========================================================================== */
(function () {
    "use strict";

    var HQ = { name: "Corporate Office", place: "Dubai, UAE", lat: 25.2532, lng: 55.3033 };

    // Region key -> label + pin colour. The Oceanus blues carry the regions we
    // are strongest in; the remaining regions take warm accents so every pin
    // stays readable against the blue water of the nautical basemap.
    var REGIONS = {
        "middle-east-gulf":    { label: "Middle East & Upper Gulf", color: "#0077B6" },
        "indian-subcontinent": { label: "Indian Subcontinent",      color: "#00B4D8" },
        "south-east-asia":     { label: "South East Asia",          color: "#06D6A0" },
        "far-east-asia":       { label: "Far East Asia",            color: "#023E8A" },
        "europe":              { label: "Europe",                   color: "#FFB703" },
        "red-sea":             { label: "Red Sea Countries",        color: "#E63946" },
        "africa":              { label: "African Countries",        color: "#F77F00" },
        "australia-nz":        { label: "Australia & New Zealand",  color: "#7B61FF" },
        "latin-america-usa":   { label: "Latin America & USA",      color: "#B5179E" }
    };

    // [region, country, port, lat, lng]
    var PORTS = [
        ["middle-east-gulf", "UAE",          "Jebel Ali",              25.0100,  55.0600],
        ["middle-east-gulf", "UAE",          "Khalifa Port, Abu Dhabi", 24.8100, 54.6800],
        ["middle-east-gulf", "Oman",         "Sohar",                  24.4972,  56.6100],
        ["middle-east-gulf", "Oman",         "Salalah",                16.9500,  54.0080],
        ["middle-east-gulf", "Qatar",        "Hamad Port",             25.0100,  51.6000],
        ["middle-east-gulf", "Saudi Arabia", "Jeddah Islamic Port",    21.4800,  39.1700],
        ["middle-east-gulf", "Saudi Arabia", "King Abdulaziz, Dammam", 26.5100,  50.2000],
        ["middle-east-gulf", "Kuwait",       "Shuwaikh",               29.3500,  47.9300],
        ["middle-east-gulf", "Bahrain",      "Khalifa Bin Salman",     26.1800,  50.6600],
        ["middle-east-gulf", "Iraq",         "Umm Qasr",               30.0400,  47.9300],
        ["middle-east-gulf", "Jordan",       "Aqaba",                  29.5200,  35.0000],

        ["indian-subcontinent", "India",      "Nhava Sheva (JNPT)",    18.9490,  72.9500],
        ["indian-subcontinent", "India",      "Mundra",                22.7390,  69.7050],
        ["indian-subcontinent", "India",      "Chennai",               13.1000,  80.2900],
        ["indian-subcontinent", "India",      "Kolkata (Haldia)",      22.0300,  88.0900],
        ["indian-subcontinent", "Pakistan",   "Karachi / Port Qasim",  24.8400,  66.9800],
        ["indian-subcontinent", "Sri Lanka",  "Colombo",                6.9500,  79.8400],
        ["indian-subcontinent", "Bangladesh", "Chattogram",            22.3100,  91.8000],
        ["indian-subcontinent", "Myanmar",    "Yangon",                16.7700,  96.1700],
        ["indian-subcontinent", "Nepal",      "Birgunj ICD",           27.0000,  84.8800],

        ["south-east-asia", "Singapore",   "Singapore",                 1.2650, 103.8200],
        ["south-east-asia", "Malaysia",    "Port Klang",                3.0000, 101.3900],
        ["south-east-asia", "Malaysia",    "Tanjung Pelepas",           1.3600, 103.5500],
        ["south-east-asia", "Thailand",    "Laem Chabang",             13.0800, 100.8800],
        ["south-east-asia", "Thailand",    "Bangkok",                  13.7000, 100.5800],
        ["south-east-asia", "Indonesia",   "Tanjung Priok, Jakarta",   -6.1000, 106.8800],
        ["south-east-asia", "Indonesia",   "Tanjung Perak, Surabaya",  -7.2000, 112.7300],
        ["south-east-asia", "Vietnam",     "Cat Lai, Ho Chi Minh City",10.7600, 106.7800],
        ["south-east-asia", "Vietnam",     "Haiphong",                 20.8600, 106.7000],
        ["south-east-asia", "Philippines", "Manila",                   14.5900, 120.9600],
        ["south-east-asia", "Cambodia",    "Sihanoukville",            10.6300, 103.5200],

        ["far-east-asia", "China",       "Shanghai",        31.3400, 121.5000],
        ["far-east-asia", "China",       "Ningbo-Zhoushan", 29.8700, 121.8400],
        ["far-east-asia", "China",       "Qingdao",         36.0800, 120.3000],
        ["far-east-asia", "China",       "Yantian, Shenzhen",22.5800, 114.2700],
        ["far-east-asia", "Hong Kong",   "Hong Kong",       22.3300, 114.1200],
        ["far-east-asia", "Taiwan",      "Kaohsiung",       22.6100, 120.2800],
        ["far-east-asia", "South Korea", "Busan",           35.1000, 129.0400],
        ["far-east-asia", "Japan",       "Yokohama",        35.4500, 139.6600],
        ["far-east-asia", "Japan",       "Kobe",            34.6800, 135.2000],

        ["europe", "Netherlands", "Rotterdam",        51.9500,  4.1400],
        ["europe", "Belgium",     "Antwerp",          51.2600,  4.4000],
        ["europe", "Germany",     "Hamburg",          53.5400,  9.9300],
        ["europe", "France",      "Le Havre",         49.4800,  0.1200],
        ["europe", "France",      "Fos-sur-Mer",      43.4000,  4.9000],
        ["europe", "Spain",       "Valencia",         39.4400, -0.3200],
        ["europe", "Spain",       "Barcelona",        41.3400,  2.1700],
        ["europe", "Portugal",    "Sines",            37.9500, -8.8700],
        ["europe", "Portugal",    "Lisbon",           38.7000, -9.1700],
        ["europe", "Italy",       "Genoa",            44.4000,  8.9000],
        ["europe", "Italy",       "Gioia Tauro",      38.4400, 15.9000],
        ["europe", "Greece",      "Piraeus",          37.9400, 23.6300],

        ["red-sea", "Turkey",  "Mersin",              36.7900, 34.6300],
        ["red-sea", "Turkey",  "Ambarli, Istanbul",   40.9700, 28.6800],
        ["red-sea", "Israel",  "Haifa",               32.8200, 35.0000],
        ["red-sea", "Israel",  "Ashdod",              31.8200, 34.6400],
        ["red-sea", "Lebanon", "Beirut",              33.9000, 35.5000],

        ["africa", "Djibouti",     "Port of Djibouti",  11.6000, 43.1400],
        ["africa", "Kenya",        "Mombasa",           -4.0500, 39.6700],
        ["africa", "Uganda",       "Kampala ICD",        0.3150, 32.5820],
        ["africa", "Tanzania",     "Dar es Salaam",     -6.8200, 39.2900],
        ["africa", "Zambia",       "Lusaka ICD",       -15.4160, 28.2830],
        ["africa", "South Africa", "Durban",           -29.8700, 31.0200],
        ["africa", "South Africa", "Cape Town",        -33.9100, 18.4300],
        ["africa", "Morocco",      "Tanger Med",        35.8850, -5.5000],
        ["africa", "Morocco",      "Casablanca",        33.6000, -7.6000],
        ["africa", "Algeria",      "Algiers",           36.7800,  3.0700],
        ["africa", "Tunisia",      "Rades, Tunis",      36.8000, 10.2800],

        ["australia-nz", "Australia",   "Port Botany, Sydney", -33.9700, 151.2200],
        ["australia-nz", "Australia",   "Melbourne",           -37.8300, 144.9200],
        ["australia-nz", "Australia",   "Fremantle",           -32.0500, 115.7400],
        ["australia-nz", "New Zealand", "Auckland",            -36.8400, 174.7800],
        ["australia-nz", "New Zealand", "Tauranga",            -37.6400, 176.1800],

        ["latin-america-usa", "USA",       "Houston",             29.7300,  -95.2700],
        ["latin-america-usa", "USA",       "New York / New Jersey",40.6700, -74.1400],
        ["latin-america-usa", "USA",       "Los Angeles",         33.7400, -118.2600],
        ["latin-america-usa", "Mexico",    "Manzanillo",          19.0500, -104.3200],
        ["latin-america-usa", "Colombia",  "Cartagena",           10.4000,  -75.5200],
        ["latin-america-usa", "Peru",      "Callao",             -12.0500,  -77.1500],
        ["latin-america-usa", "Brazil",    "Santos",             -23.9700,  -46.3000],
        ["latin-america-usa", "Argentina", "Buenos Aires",       -34.6000,  -58.3700]
    ];

    function ready(fn) {
        if (document.readyState !== "loading") { fn(); }
        else { document.addEventListener("DOMContentLoaded", fn); }
    }

    ready(function () {
        var el = document.getElementById("oceanus-network-map");
        if (!el || typeof L === "undefined") { return; }

        var map = L.map(el, {
            center: [22, 45],
            zoom: 2,
            minZoom: 1,
            maxZoom: 12,
            worldCopyJump: true,
            // The page runs GSAP ScrollSmoother; wheel-zoom would swallow the
            // page scroll as soon as the cursor crosses the map. Enable it only
            // once the visitor clicks into the map, and drop it again on blur.
            scrollWheelZoom: false
        });

        // Esri's Light Gray Canvas: a muted basemap that needs no API key and
        // lets the coloured port pins carry the page. Labels ride on a second,
        // transparent reference layer, which is how Esri ships this style.
        var esri = "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/";
        var esriAttr = 'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; ' +
                       'Esri, HERE, Garmin, &copy; OpenStreetMap contributors';

        L.tileLayer(esri + "World_Ocean_Base/MapServer/tile/{z}/{y}/{x}", {
            attribution: esriAttr,
            maxZoom: 16
        }).addTo(map);

        L.tileLayer(esri + "World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}", {
            maxZoom: 16,
            pane: "shadowPane"
        }).addTo(map);

        map.on("click", function () { map.scrollWheelZoom.enable(); });
        // Leaflet's own "mouseout" also fires when the pointer crosses between
        // markers, so listen on the container for a real exit instead.
        map.getContainer().addEventListener("mouseleave", function () {
            map.scrollWheelZoom.disable();
        });

        function pin(color, isHq) {
            return L.divIcon({
                className: "onm-pin-wrap",
                html: '<span class="onm-pin' + (isHq ? " onm-pin--hq" : "") +
                      '" style="--pin:' + color + '"></span>',
                iconSize: isHq ? [22, 22] : [14, 14],
                iconAnchor: isHq ? [11, 11] : [7, 7],
                popupAnchor: [0, isHq ? -12 : -8]
            });
        }

        // One layer group per region so the legend can toggle regions on and off.
        var groups = {};
        var allMarkers = [];

        Object.keys(REGIONS).forEach(function (key) {
            groups[key] = L.layerGroup().addTo(map);
        });

        PORTS.forEach(function (p) {
            var region = REGIONS[p[0]];
            if (!region) { return; }
            var marker = L.marker([p[3], p[4]], {
                icon: pin(region.color),
                title: p[2] + ", " + p[1],
                riseOnHover: true
            }).bindPopup(
                '<span class="onm-popup-region" style="--pin:' + region.color + '">' +
                    region.label +
                '</span>' +
                '<strong class="onm-popup-port">' + p[2] + '</strong>' +
                '<span class="onm-popup-country">' + p[1] + '</span>'
            );
            marker.addTo(groups[p[0]]);
            allMarkers.push(marker);
        });

        var hq = L.marker([HQ.lat, HQ.lng], {
            icon: pin("#03045E", true),
            title: HQ.place,
            zIndexOffset: 1000
        }).bindPopup(
            '<span class="onm-popup-region" style="--pin:#03045E">' + HQ.name + '</span>' +
            '<strong class="onm-popup-port">Oceanus Line &amp; Container Logistics LLC</strong>' +
            '<span class="onm-popup-country">' + HQ.place + '</span>'
        ).addTo(map);
        allMarkers.push(hq);

        // Fit to everything we serve, then keep that as the "reset" view.
        // Narrow viewports need a wider zoom-out (and less padding) before the
        // whole network fits, so let fitBounds go all the way to minZoom there.
        var bounds = L.featureGroup(allMarkers).getBounds();
        var tight = el.clientWidth < 768;
        map.fitBounds(bounds, { padding: tight ? [8, 8] : [30, 30] });
        var homeView = { center: map.getCenter(), zoom: map.getZoom() };

        // ---- Legend / region filter -----------------------------------------
        var legend = document.getElementById("oceanus-network-legend");
        if (legend) {
            var buttons = {};

            Object.keys(REGIONS).forEach(function (key) {
                var region = REGIONS[key];
                var btn = document.createElement("button");
                btn.type = "button";
                btn.className = "onm-legend-item is-active";
                btn.style.setProperty("--pin", region.color);
                btn.setAttribute("aria-pressed", "true");
                btn.innerHTML = '<span class="onm-legend-dot"></span>' +
                                '<span class="onm-legend-label">' + region.label + '</span>';
                btn.addEventListener("click", function () {
                    var on = btn.classList.toggle("is-active");
                    btn.setAttribute("aria-pressed", String(on));
                    if (on) {
                        groups[key].addTo(map);
                        map.fitBounds(L.featureGroup(groups[key].getLayers()).getBounds(),
                                      { padding: [40, 40], maxZoom: 5 });
                    } else {
                        map.removeLayer(groups[key]);
                    }
                });
                buttons[key] = btn;
                legend.appendChild(btn);
            });

            var reset = document.getElementById("oceanus-network-reset");
            if (reset) {
                legend.appendChild(reset); // keep the reset chip after the regions
                reset.addEventListener("click", function () {
                    Object.keys(groups).forEach(function (key) {
                        groups[key].addTo(map);
                        buttons[key].classList.add("is-active");
                        buttons[key].setAttribute("aria-pressed", "true");
                    });
                    map.setView(homeView.center, homeView.zoom);
                });
            }
        }

        // The map is laid out inside animated/smooth-scrolled content, so give
        // Leaflet a nudge once the surrounding layout has settled.
        setTimeout(function () { map.invalidateSize(); }, 400);
        window.addEventListener("load", function () { map.invalidateSize(); });
    });
})();
