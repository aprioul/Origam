
/**
 * Apply origamPhone
 *
 */

(function ($, w) {

    'use strict';

    // PHONE PUBLIC CLASS DEFINITION
    // ===============================

    var Phone = function (element, options) {
        this.type       = null;
        this.options    = null;
        this.$element   = null;

        this.init('phone', element, options)
    };

    if (!$.fn.input) throw new Error('Notification requires input.js');

    Phone.VERSION  = '0.1.0';

    Phone.TRANSITION_DURATION = 1000;

    Phone.DEFAULTS = $.extend({}, $.fn.input.Constructor.DEFAULTS, {
        autoFormat: true,
        autoPlaceholder: true,
        defaultCountry: "",
        onlyCountries: [],
        preferredCountries: [ "US", "GB", "FR" ],
        nationalMode: true,
        allowExtensions: false,
        numberType: "MOBILE",
        autoHideDialCode: true,
        utilsScript: ""
    });

    Phone.prototype = $.extend({}, $.fn.input.Constructor.prototype);

    Phone.prototype.constructor = Phone;

    Phone.prototype.event = function (options) {

        var windowLoaded = false,
            pluginName = 'phone',
            keys = {
                UP: 38,
                DOWN: 40,
                ENTER: 13,
                ESC: 27,
                PLUS: 43,
                A: 65,
                Z: 90,
                ZERO: 48,
                NINE: 57,
                SPACE: 32,
                BSPACE: 8,
                TAB: 9,
                DEL: 46,
                CTRL: 17,
                CMD1: 91, // Chrome
                CMD2: 224 // FF
            },
            allCountries = [
                [
                    "Afghanistan (‫افغانستان‬‎)",
                    "af",
                    "93"
                ],
                [
                    "Albania (Shqipëri)",
                    "al",
                    "355"
                ],
                [
                    "Algeria (‫الجزائر‬‎)",
                    "dz",
                    "213"
                ],
                [
                    "American Samoa",
                    "as",
                    "1684"
                ],
                [
                    "Andorra",
                    "ad",
                    "376"
                ],
                [
                    "Angola",
                    "ao",
                    "244"
                ],
                [
                    "Anguilla",
                    "ai",
                    "1264"
                ],
                [
                    "Antigua and Barbuda",
                    "ag",
                    "1268"
                ],
                [
                    "Argentina",
                    "ar",
                    "54"
                ],
                [
                    "Armenia (Հայաստան)",
                    "am",
                    "374"
                ],
                [
                    "Aruba",
                    "aw",
                    "297"
                ],
                [
                    "Australia",
                    "au",
                    "61"
                ],
                [
                    "Austria (Österreich)",
                    "at",
                    "43"
                ],
                [
                    "Azerbaijan (Azərbaycan)",
                    "az",
                    "994"
                ],
                [
                    "Bahamas",
                    "bs",
                    "1242"
                ],
                [
                    "Bahrain (‫البحرين‬‎)",
                    "bh",
                    "973"
                ],
                [
                    "Bangladesh (বাংলাদেশ)",
                    "bd",
                    "880"
                ],
                [
                    "Barbados",
                    "bb",
                    "1246"
                ],
                [
                    "Belarus (Беларусь)",
                    "by",
                    "375"
                ],
                [
                    "Belgium (België)",
                    "be",
                    "32"
                ],
                [
                    "Belize",
                    "bz",
                    "501"
                ],
                [
                    "Benin (Bénin)",
                    "bj",
                    "229"
                ],
                [
                    "Bermuda",
                    "bm",
                    "1441"
                ],
                [
                    "Bhutan (འབྲུག)",
                    "bt",
                    "975"
                ],
                [
                    "Bolivia",
                    "bo",
                    "591"
                ],
                [
                    "Bosnia and Herzegovina (Босна и Херцеговина)",
                    "ba",
                    "387"
                ],
                [
                    "Botswana",
                    "bw",
                    "267"
                ],
                [
                    "Brazil (Brasil)",
                    "br",
                    "55"
                ],
                [
                    "British Indian Ocean Territory",
                    "io",
                    "246"
                ],
                [
                    "British Virgin Islands",
                    "vg",
                    "1284"
                ],
                [
                    "Brunei",
                    "bn",
                    "673"
                ],
                [
                    "Bulgaria (България)",
                    "bg",
                    "359"
                ],
                [
                    "Burkina Faso",
                    "bf",
                    "226"
                ],
                [
                    "Burundi (Uburundi)",
                    "bi",
                    "257"
                ],
                [
                    "Cambodia (កម្ពុជា)",
                    "kh",
                    "855"
                ],
                [
                    "Cameroon (Cameroun)",
                    "cm",
                    "237"
                ],
                [
                    "Canada",
                    "ca",
                    "1",
                    1,
                    ["204", "226", "236", "249", "250", "289", "306", "343", "365", "387", "403", "416", "418", "431", "437", "438", "450", "506", "514", "519", "548", "579", "581", "587", "604", "613", "639", "647", "672", "705", "709", "742", "778", "780", "782", "807", "819", "825", "867", "873", "902", "905"]
                ],
                [
                    "Cape Verde (Kabu Verdi)",
                    "cv",
                    "238"
                ],
                [
                    "Caribbean Netherlands",
                    "bq",
                    "599",
                    1
                ],
                [
                    "Cayman Islands",
                    "ky",
                    "1345"
                ],
                [
                    "Central African Republic (République centrafricaine)",
                    "cf",
                    "236"
                ],
                [
                    "Chad (Tchad)",
                    "td",
                    "235"
                ],
                [
                    "Chile",
                    "cl",
                    "56"
                ],
                [
                    "China (中国)",
                    "cn",
                    "86"
                ],
                [
                    "Colombia",
                    "co",
                    "57"
                ],
                [
                    "Comoros (‫جزر القمر‬‎)",
                    "km",
                    "269"
                ],
                [
                    "Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)",
                    "cd",
                    "243"
                ],
                [
                    "Congo (Republic) (Congo-Brazzaville)",
                    "cg",
                    "242"
                ],
                [
                    "Cook Islands",
                    "ck",
                    "682"
                ],
                [
                    "Costa Rica",
                    "cr",
                    "506"
                ],
                [
                    "Côte d’Ivoire",
                    "ci",
                    "225"
                ],
                [
                    "Croatia (Hrvatska)",
                    "hr",
                    "385"
                ],
                [
                    "Cuba",
                    "cu",
                    "53"
                ],
                [
                    "Curaçao",
                    "cw",
                    "599",
                    0
                ],
                [
                    "Cyprus (Κύπρος)",
                    "cy",
                    "357"
                ],
                [
                    "Czech Republic (Česká republika)",
                    "cz",
                    "420"
                ],
                [
                    "Denmark (Danmark)",
                    "dk",
                    "45"
                ],
                [
                    "Djibouti",
                    "dj",
                    "253"
                ],
                [
                    "Dominica",
                    "dm",
                    "1767"
                ],
                [
                    "Dominican Republic (República Dominicana)",
                    "do",
                    "1",
                    2,
                    ["809", "829", "849"]
                ],
                [
                    "Ecuador",
                    "ec",
                    "593"
                ],
                [
                    "Egypt (‫مصر‬‎)",
                    "eg",
                    "20"
                ],
                [
                    "El Salvador",
                    "sv",
                    "503"
                ],
                [
                    "Equatorial Guinea (Guinea Ecuatorial)",
                    "gq",
                    "240"
                ],
                [
                    "Eritrea",
                    "er",
                    "291"
                ],
                [
                    "Estonia (Eesti)",
                    "ee",
                    "372"
                ],
                [
                    "Ethiopia",
                    "et",
                    "251"
                ],
                [
                    "Falkland Islands (Islas Malvinas)",
                    "fk",
                    "500"
                ],
                [
                    "Faroe Islands (Føroyar)",
                    "fo",
                    "298"
                ],
                [
                    "Fiji",
                    "fj",
                    "679"
                ],
                [
                    "Finland (Suomi)",
                    "fi",
                    "358"
                ],
                [
                    "France",
                    "fr",
                    "33"
                ],
                [
                    "French Guiana (Guyane française)",
                    "gf",
                    "594"
                ],
                [
                    "French Polynesia (Polynésie française)",
                    "pf",
                    "689"
                ],
                [
                    "Gabon",
                    "ga",
                    "241"
                ],
                [
                    "Gambia",
                    "gm",
                    "220"
                ],
                [
                    "Georgia (საქართველო)",
                    "ge",
                    "995"
                ],
                [
                    "Germany (Deutschland)",
                    "de",
                    "49"
                ],
                [
                    "Ghana (Gaana)",
                    "gh",
                    "233"
                ],
                [
                    "Gibraltar",
                    "gi",
                    "350"
                ],
                [
                    "Greece (Ελλάδα)",
                    "gr",
                    "30"
                ],
                [
                    "Greenland (Kalaallit Nunaat)",
                    "gl",
                    "299"
                ],
                [
                    "Grenada",
                    "gd",
                    "1473"
                ],
                [
                    "Guadeloupe",
                    "gp",
                    "590",
                    0
                ],
                [
                    "Guam",
                    "gu",
                    "1671"
                ],
                [
                    "Guatemala",
                    "gt",
                    "502"
                ],
                [
                    "Guinea (Guinée)",
                    "gn",
                    "224"
                ],
                [
                    "Guinea-Bissau (Guiné Bissau)",
                    "gw",
                    "245"
                ],
                [
                    "Guyana",
                    "gy",
                    "592"
                ],
                [
                    "Haiti",
                    "ht",
                    "509"
                ],
                [
                    "Honduras",
                    "hn",
                    "504"
                ],
                [
                    "Hong Kong (香港)",
                    "hk",
                    "852"
                ],
                [
                    "Hungary (Magyarország)",
                    "hu",
                    "36"
                ],
                [
                    "Iceland (Ísland)",
                    "is",
                    "354"
                ],
                [
                    "India (भारत)",
                    "in",
                    "91"
                ],
                [
                    "Indonesia",
                    "id",
                    "62"
                ],
                [
                    "Iran (‫ایران‬‎)",
                    "ir",
                    "98"
                ],
                [
                    "Iraq (‫العراق‬‎)",
                    "iq",
                    "964"
                ],
                [
                    "Ireland",
                    "ie",
                    "353"
                ],
                [
                    "Israel (‫ישראל‬‎)",
                    "il",
                    "972"
                ],
                [
                    "Italy (Italia)",
                    "it",
                    "39",
                    0
                ],
                [
                    "Jamaica",
                    "jm",
                    "1876"
                ],
                [
                    "Japan (日本)",
                    "jp",
                    "81"
                ],
                [
                    "Jordan (‫الأردن‬‎)",
                    "jo",
                    "962"
                ],
                [
                    "Kazakhstan (Казахстан)",
                    "kz",
                    "7",
                    1
                ],
                [
                    "Kenya",
                    "ke",
                    "254"
                ],
                [
                    "Kiribati",
                    "ki",
                    "686"
                ],
                [
                    "Kuwait (‫الكويت‬‎)",
                    "kw",
                    "965"
                ],
                [
                    "Kyrgyzstan (Кыргызстан)",
                    "kg",
                    "996"
                ],
                [
                    "Laos (ລາວ)",
                    "la",
                    "856"
                ],
                [
                    "Latvia (Latvija)",
                    "lv",
                    "371"
                ],
                [
                    "Lebanon (‫لبنان‬‎)",
                    "lb",
                    "961"
                ],
                [
                    "Lesotho",
                    "ls",
                    "266"
                ],
                [
                    "Liberia",
                    "lr",
                    "231"
                ],
                [
                    "Libya (‫ليبيا‬‎)",
                    "ly",
                    "218"
                ],
                [
                    "Liechtenstein",
                    "li",
                    "423"
                ],
                [
                    "Lithuania (Lietuva)",
                    "lt",
                    "370"
                ],
                [
                    "Luxembourg",
                    "lu",
                    "352"
                ],
                [
                    "Macau (澳門)",
                    "mo",
                    "853"
                ],
                [
                    "Macedonia (FYROM) (Македонија)",
                    "mk",
                    "389"
                ],
                [
                    "Madagascar (Madagasikara)",
                    "mg",
                    "261"
                ],
                [
                    "Malawi",
                    "mw",
                    "265"
                ],
                [
                    "Malaysia",
                    "my",
                    "60"
                ],
                [
                    "Maldives",
                    "mv",
                    "960"
                ],
                [
                    "Mali",
                    "ml",
                    "223"
                ],
                [
                    "Malta",
                    "mt",
                    "356"
                ],
                [
                    "Marshall Islands",
                    "mh",
                    "692"
                ],
                [
                    "Martinique",
                    "mq",
                    "596"
                ],
                [
                    "Mauritania (‫موريتانيا‬‎)",
                    "mr",
                    "222"
                ],
                [
                    "Mauritius (Moris)",
                    "mu",
                    "230"
                ],
                [
                    "Mexico (México)",
                    "mx",
                    "52"
                ],
                [
                    "Micronesia",
                    "fm",
                    "691"
                ],
                [
                    "Moldova (Republica Moldova)",
                    "md",
                    "373"
                ],
                [
                    "Monaco",
                    "mc",
                    "377"
                ],
                [
                    "Mongolia (Монгол)",
                    "mn",
                    "976"
                ],
                [
                    "Montenegro (Crna Gora)",
                    "me",
                    "382"
                ],
                [
                    "Montserrat",
                    "ms",
                    "1664"
                ],
                [
                    "Morocco (‫المغرب‬‎)",
                    "ma",
                    "212"
                ],
                [
                    "Mozambique (Moçambique)",
                    "mz",
                    "258"
                ],
                [
                    "Myanmar (Burma) (မြန်မာ)",
                    "mm",
                    "95"
                ],
                [
                    "Namibia (Namibië)",
                    "na",
                    "264"
                ],
                [
                    "Nauru",
                    "nr",
                    "674"
                ],
                [
                    "Nepal (नेपाल)",
                    "np",
                    "977"
                ],
                [
                    "Netherlands (Nederland)",
                    "nl",
                    "31"
                ],
                [
                    "New Caledonia (Nouvelle-Calédonie)",
                    "nc",
                    "687"
                ],
                [
                    "New Zealand",
                    "nz",
                    "64"
                ],
                [
                    "Nicaragua",
                    "ni",
                    "505"
                ],
                [
                    "Niger (Nijar)",
                    "ne",
                    "227"
                ],
                [
                    "Nigeria",
                    "ng",
                    "234"
                ],
                [
                    "Niue",
                    "nu",
                    "683"
                ],
                [
                    "Norfolk Island",
                    "nf",
                    "672"
                ],
                [
                    "North Korea (조선 민주주의 인민 공화국)",
                    "kp",
                    "850"
                ],
                [
                    "Northern Mariana Islands",
                    "mp",
                    "1670"
                ],
                [
                    "Norway (Norge)",
                    "no",
                    "47"
                ],
                [
                    "Oman (‫عُمان‬‎)",
                    "om",
                    "968"
                ],
                [
                    "Pakistan (‫پاکستان‬‎)",
                    "pk",
                    "92"
                ],
                [
                    "Palau",
                    "pw",
                    "680"
                ],
                [
                    "Palestine (‫فلسطين‬‎)",
                    "ps",
                    "970"
                ],
                [
                    "Panama (Panamá)",
                    "pa",
                    "507"
                ],
                [
                    "Papua New Guinea",
                    "pg",
                    "675"
                ],
                [
                    "Paraguay",
                    "py",
                    "595"
                ],
                [
                    "Peru (Perú)",
                    "pe",
                    "51"
                ],
                [
                    "Philippines",
                    "ph",
                    "63"
                ],
                [
                    "Poland (Polska)",
                    "pl",
                    "48"
                ],
                [
                    "Portugal",
                    "pt",
                    "351"
                ],
                [
                    "Puerto Rico",
                    "pr",
                    "1",
                    3,
                    ["787", "939"]
                ],
                [
                    "Qatar (‫قطر‬‎)",
                    "qa",
                    "974"
                ],
                [
                    "Réunion (La Réunion)",
                    "re",
                    "262"
                ],
                [
                    "Romania (România)",
                    "ro",
                    "40"
                ],
                [
                    "Russia (Россия)",
                    "ru",
                    "7",
                    0
                ],
                [
                    "Rwanda",
                    "rw",
                    "250"
                ],
                [
                    "Saint Barthélemy (Saint-Barthélemy)",
                    "bl",
                    "590",
                    1
                ],
                [
                    "Saint Helena",
                    "sh",
                    "290"
                ],
                [
                    "Saint Kitts and Nevis",
                    "kn",
                    "1869"
                ],
                [
                    "Saint Lucia",
                    "lc",
                    "1758"
                ],
                [
                    "Saint Martin (Saint-Martin (partie française))",
                    "mf",
                    "590",
                    2
                ],
                [
                    "Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)",
                    "pm",
                    "508"
                ],
                [
                    "Saint Vincent and the Grenadines",
                    "vc",
                    "1784"
                ],
                [
                    "Samoa",
                    "ws",
                    "685"
                ],
                [
                    "San Marino",
                    "sm",
                    "378"
                ],
                [
                    "São Tomé and Príncipe (São Tomé e Príncipe)",
                    "st",
                    "239"
                ],
                [
                    "Saudi Arabia (‫المملكة العربية السعودية‬‎)",
                    "sa",
                    "966"
                ],
                [
                    "Senegal (Sénégal)",
                    "sn",
                    "221"
                ],
                [
                    "Serbia (Србија)",
                    "rs",
                    "381"
                ],
                [
                    "Seychelles",
                    "sc",
                    "248"
                ],
                [
                    "Sierra Leone",
                    "sl",
                    "232"
                ],
                [
                    "Singapore",
                    "sg",
                    "65"
                ],
                [
                    "Sint Maarten",
                    "sx",
                    "1721"
                ],
                [
                    "Slovakia (Slovensko)",
                    "sk",
                    "421"
                ],
                [
                    "Slovenia (Slovenija)",
                    "si",
                    "386"
                ],
                [
                    "Solomon Islands",
                    "sb",
                    "677"
                ],
                [
                    "Somalia (Soomaaliya)",
                    "so",
                    "252"
                ],
                [
                    "South Africa",
                    "za",
                    "27"
                ],
                [
                    "South Korea (대한민국)",
                    "kr",
                    "82"
                ],
                [
                    "South Sudan (‫جنوب السودان‬‎)",
                    "ss",
                    "211"
                ],
                [
                    "Spain (España)",
                    "es",
                    "34"
                ],
                [
                    "Sri Lanka (ශ්‍රී ලංකාව)",
                    "lk",
                    "94"
                ],
                [
                    "Sudan (‫السودان‬‎)",
                    "sd",
                    "249"
                ],
                [
                    "Suriname",
                    "sr",
                    "597"
                ],
                [
                    "Swaziland",
                    "sz",
                    "268"
                ],
                [
                    "Sweden (Sverige)",
                    "se",
                    "46"
                ],
                [
                    "Switzerland (Schweiz)",
                    "ch",
                    "41"
                ],
                [
                    "Syria (‫سوريا‬‎)",
                    "sy",
                    "963"
                ],
                [
                    "Taiwan (台灣)",
                    "tw",
                    "886"
                ],
                [
                    "Tajikistan",
                    "tj",
                    "992"
                ],
                [
                    "Tanzania",
                    "tz",
                    "255"
                ],
                [
                    "Thailand (ไทย)",
                    "th",
                    "66"
                ],
                [
                    "Timor-Leste",
                    "tl",
                    "670"
                ],
                [
                    "Togo",
                    "tg",
                    "228"
                ],
                [
                    "Tokelau",
                    "tk",
                    "690"
                ],
                [
                    "Tonga",
                    "to",
                    "676"
                ],
                [
                    "Trinidad and Tobago",
                    "tt",
                    "1868"
                ],
                [
                    "Tunisia (‫تونس‬‎)",
                    "tn",
                    "216"
                ],
                [
                    "Turkey (Türkiye)",
                    "tr",
                    "90"
                ],
                [
                    "Turkmenistan",
                    "tm",
                    "993"
                ],
                [
                    "Turks and Caicos Islands",
                    "tc",
                    "1649"
                ],
                [
                    "Tuvalu",
                    "tv",
                    "688"
                ],
                [
                    "U.S. Virgin Islands",
                    "vi",
                    "1340"
                ],
                [
                    "Uganda",
                    "ug",
                    "256"
                ],
                [
                    "Ukraine (Україна)",
                    "ua",
                    "380"
                ],
                [
                    "United Arab Emirates (‫الإمارات العربية المتحدة‬‎)",
                    "ae",
                    "971"
                ],
                [
                    "United Kingdom",
                    "gb",
                    "44"
                ],
                [
                    "United States",
                    "us",
                    "1",
                    0
                ],
                [
                    "Uruguay",
                    "uy",
                    "598"
                ],
                [
                    "Uzbekistan (Oʻzbekiston)",
                    "uz",
                    "998"
                ],
                [
                    "Vanuatu",
                    "vu",
                    "678"
                ],
                [
                    "Vatican City (Città del Vaticano)",
                    "va",
                    "39",
                    1
                ],
                [
                    "Venezuela",
                    "ve",
                    "58"
                ],
                [
                    "Vietnam (Việt Nam)",
                    "vn",
                    "84"
                ],
                [
                    "Wallis and Futuna",
                    "wf",
                    "681"
                ],
                [
                    "Yemen (‫اليمن‬‎)",
                    "ye",
                    "967"
                ],
                [
                    "Zambia",
                    "zm",
                    "260"
                ],
                [
                    "Zimbabwe",
                    "zw",
                    "263"
                ]
            ];

        for (var i = 0; i < allCountries.length; i++) {
            var c = allCountries[i];
            allCountries[i] = {
                name: c[0],
                iso2: c[1],
                dialCode: c[2],
                priority: c[3] || 0,
                areaCodes: c[4] || null
            };
        }

        this.allCountries = allCountries;

        this.isGoodBrowser = Boolean(this.setSelectionRange);

        this.InitialPlaceholder = Boolean(this.$element.attr("placeholder"));

        if (this.options.nationalMode) {
            this.options.autoHideDialCode = false;
        }
        if (navigator.userAgent.match(/IEMobile/i)) {
            this.options.autoFormat = false;
        }

        this.isMobile = /Android.+Mobile|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        this.autoCountryDeferred = new $.Deferred();
        this.utilsScriptDeferred = new $.Deferred();

        this.countryData();

        this.markup();

        this.setInitialState();

        this.listeners();

        this.requests();

        return [this.autoCountryDeferred, this.utilsScriptDeferred];

    };

    Phone.prototype.getDefaults = function () {
        return Phone.DEFAULTS
    };

    Phone.prototype.countryData = function() {
        this.setInstanceCountryData();

        this.setPreferredCountries();
    };

    Phone.prototype.addCountryCode = function(iso2, dialCode, priority) {
        if (!(dialCode in this.countryCodes)) {
            this.countryCodes[dialCode] = [];
        }
        var index = priority || 0;
        this.countryCodes[dialCode][index] = iso2;
    };

    Phone.prototype.setInstanceCountryData = function() {
        var i;

        if (this.options.onlyCountries.length) {
            for (i = 0; i < this.options.onlyCountries.length; i++) {
                this.options.onlyCountries[i] = this.options.onlyCountries[i].toLowerCase();
            }
            this.countries = [];
            for (i = 0; i < allCountries.length; i++) {
                if ($.inArray(allCountries[i].iso2, this.options.onlyCountries) != -1) {
                    this.countries.push(allCountries[i]);
                }
            }
        } else {
            this.countries = this.allCountries;
        }

        this.countryCodes = {};
        for (i = 0; i < this.countries.length; i++) {
            var c = this.countries[i];
            this.addCountryCode(c.iso2, c.dialCode, c.priority);
            if (c.areaCodes) {
                for (var j = 0; j < c.areaCodes.length; j++) {
                    this.addCountryCode(c.iso2, c.dialCode + c.areaCodes[j]);
                }
            }
        }
    };

    Phone.prototype.setPreferredCountries = function() {
        this.preferredCountries = [];
        for (var i = 0; i < this.options.preferredCountries.length; i++) {
            var countryCode = this.options.preferredCountries[i].toLowerCase(),
                countryData = this.getCountryData(countryCode, false, true);
            if (countryData) {
                this.preferredCountries.push(countryData);
            }
        }
    };

    Phone.prototype.markup = function() {

        this.$element.attr("autocomplete", "off");

        this.$wrapper = this.addAddon();

        this.$flagsContainer = $("<div>", {
            "class": "flag-dropdown"
        }).appendTo(this.$wrapper);

        var selectedFlag = $("<div>", {
            "tabindex": "0",
            "class": "selected-flag"
        }).appendTo(this.$flagsContainer);
        this.$selectedFlagInner = $("<div>", {
            "class": "iti-flag"
        }).appendTo(selectedFlag);
        $("<div>", {
            "class": "arrow"
        }).appendTo(selectedFlag);

        if (this.isMobile) {
            this.$countryList = $("<select>", {
                "class": "iti-mobile-select"
            }).appendTo(this.$flagsContainer);
        } else {
            this.$countryList = $("<ul>", {
                "class": "country-list v-hide"
            }).appendTo(this.$flagsContainer);
            if (this.preferredCountries.length && !this.isMobile) {
                this.appendListItems(this.preferredCountries, "preferred");
                $("<li>", {
                    "class": "divider"
                }).appendTo(this.$countryList);
            }
        }
        this.appendListItems(this.countries, "");

        if (!this.isMobile) {
            this.dropdownHeight = this.$countryList.outerHeight();
            this.$countryList.removeClass("v-hide").addClass("hide");

            this.$countryListItems = this.$countryList.children(".country");
        }
    };

    Phone.prototype.appendListItems = function(countries, className) {
        var tmp = "";
        for (var i = 0; i < countries.length; i++) {
            var c = countries[i];
            if (this.isMobile) {
                tmp += "<option data-dial-code='" + c.dialCode + "' value='" + c.iso2 + "'>";
                tmp += c.name + " +" + c.dialCode;
                tmp += "</option>";
            } else {
                tmp += "<li class='country " + className + "' data-dial-code='" + c.dialCode + "' data-country-code='" + c.iso2 + "'>";
                tmp += "<div class='flag'><div class='iti-flag " + c.iso2 + "'></div></div>";
                tmp += "<span class='country-name'>" + c.name + "</span>";
                tmp += "<span class='dial-code'>+" + c.dialCode + "</span>";
                tmp += "</li>";
            }
        }
        this.$countryList.append(tmp);
    };

    Phone.prototype.setInitialState = function() {
        var val = this.$element.val();

        if (this.getDialCode(val)) {
            this.updateFlagFromNumber(val, true);
        } else if (this.options.defaultCountry != "auto") {
            if (this.options.defaultCountry) {
                this.options.defaultCountry = this.countryData(this.options.defaultCountry.toLowerCase(), false, false);
            } else {
                this.options.defaultCountry = (this.preferredCountries.length) ? this.preferredCountries[0] : this.countries[0];
            }
            this.selectFlag(this.options.defaultCountry.iso2);

            if (!val) {
                this.updateDialCode(this.options.defaultCountry.dialCode, false);
            }
        }

        if (val) {
            this.updateVal(val);
        }
    };

    Phone.prototype.listeners = function() {
        var that = this;

        this.keyListeners();

        if (this.options.autoHideDialCode || this.options.autoFormat) {
            this.focusListeners();
        }

        if (this.isMobile) {
            this.$countryList.on("change" + this.ns, function(e) {
                that.selectListItem($(this).find("option:selected"));
            });
        } else {
            var label = this.$element.closest("label");
            if (label.length) {
                label.on("click" + this.ns, function(e) {
                    if (that.$countryList.hasClass("hide")) {
                        that.$element.focus();
                    } else {
                        e.preventDefault();
                    }
                });
            }

            var selectedFlag = this.$selectedFlagInner.parent();
            selectedFlag.on("click" + this.ns, function(e) {
                if (that.$countryList.hasClass("hide") && !that.$element.prop("disabled") && !that.$element.prop("readonly")) {
                    that.show();
                }
            });
        }

        this.$flagsContainer.on("keydown" + that.ns, function(e) {
            var isDropdownHidden = that.$countryList.hasClass('hide');

            if (isDropdownHidden &&
                (e.which == keys.UP || e.which == keys.DOWN ||
                e.which == keys.SPACE || e.which == keys.ENTER)
            ) {
                e.preventDefault();

                e.stopPropagation();

                that.show();
            }

            if (e.which == keys.TAB) {
                that.hide();
            }
        });
    };

    Phone.prototype.requests = function() {
        var that = this;

        if (this.options.utilsScript) {
            if (windowLoaded) {
                this.loadUtils();
            } else {
                $(window).load(function() {
                    that.loadUtils();
                });
            }
        } else {
            this.utilsScriptDeferred.resolve();
        }

        if (this.options.defaultCountry == "auto") {
            this.loadAutoCountry();
        } else {
            this.autoCountryDeferred.resolve();
        }
    };

    Phone.prototype.loadAutoCountry = function() {
        var cookieAutoCountry = ($.cookie) ? $.cookie("itiAutoCountry") : "";
        if (cookieAutoCountry) {
            $.fn[pluginName].autoCountry = cookieAutoCountry;
        }

        if ($.fn[pluginName].autoCountry) {
            this.autoCountryLoaded();
        } else if (!$.fn[pluginName].startedLoadingAutoCountry) {
            $.fn[pluginName].startedLoadingAutoCountry = true;

            if (typeof this.options.geoIpLookup === 'function') {
                this.options.geoIpLookup(function(countryCode) {
                    $.fn[pluginName].autoCountry = countryCode.toLowerCase();
                    if ($.cookie) {
                        $.cookie("itiAutoCountry", $.fn[pluginName].autoCountry, {
                            path: '/'
                        });
                    }
                    $("[data-form='phone']").phone("autoCountryLoaded");
                });
            }
        }
    };

    Phone.prototype.keyListeners = function() {
        var that = this;

        if (this.options.autoFormat) {
            this.$element.on("keypress" + this.ns, function(e) {
                if (e.which >= keys.SPACE && !e.ctrlKey && !e.metaKey && window.intlOrigamPhoneUtils && !that.$element.prop("readonly")) {
                    e.preventDefault();
                    var isAllowedKey = ((e.which >= keys.ZERO && e.which <= keys.NINE) || e.which == keys.PLUS),
                        input = that.$element[0],
                        noSelection = (that.isGoodBrowser && input.selectionStart == input.selectionEnd),
                        max = that.$element.attr("maxlength"),
                        val = that.$element.val(),
                        isBelowMax = (max) ? (val.length < max) : true;
                    if (isBelowMax && (isAllowedKey || noSelection)) {
                        var newChar = (isAllowedKey) ? String.fromCharCode(e.which) : null;
                        that.inputKey(newChar, true, isAllowedKey);
                        if (val != that.$element.val()) {
                            that.$element.trigger("input");
                        }
                    }
                    if (!isAllowedKey) {
                        that.invalidKey();
                    }
                }
            });
        }

        this.$element.on("cut" + this.ns + " paste" + this.ns, function() {
            setTimeout(function() {
                if (that.options.autoFormat && window.intlOrigamPhoneUtils) {
                    var cursorAtEnd = (that.isGoodBrowser && that.$element[0].selectionStart == that.$element.val().length);
                    that.inputKey(null, cursorAtEnd);
                    that.ensurePlus();
                } else {
                    that.updateFlagFromNumber(that.$element.val());
                }
            });
        });

        this.$element.on("keyup" + this.ns, function(e) {
            if (e.which == keys.ENTER || that.$element.prop("readonly")) {
            } else if (that.options.autoFormat && window.intlOrigamPhoneUtils) {
                var cursorAtEnd = (that.isGoodBrowser && that.$element[0].selectionStart == that.$element.val().length);

                if (!that.$element.val()) {
                    that.updateFlagFromNumber("");
                } else if ((e.which == keys.DEL && !cursorAtEnd) || e.which == keys.BSPACE) {
                    that.inputKey();
                }
                that.ensurePlus();
            } else {
                // if no autoFormat, just update flag
                that.updateFlagFromNumber(that.$element.val());
            }
        });
    };

    Phone.prototype.ensurePlus = function() {
        if (!this.options.nationalMode) {
            var val = this.$element.val(),
                input = this.$element[0];
            if (val.charAt(0) != "+") {
                var newCursorPos = (this.isGoodBrowser) ? input.selectionStart + 1 : 0;
                this.$element.val("+" + val);
                if (this.isGoodBrowser) {
                    input.setSelectionRange(newCursorPos, newCursorPos);
                }
            }
        }
    };


    Phone.prototype.invalidKey = function() {
        var that = this;

        this.$element.trigger("invalidkey").addClass("iti-invalid-key");
        setTimeout(function() {
            that.$element.removeClass("iti-invalid-key");
        }, 100);
    };


    Phone.prototype.inputKey = function(newNumericChar, addSuffix, isAllowedKey) {
        var val = this.$element.val(),
            cleanBefore = this.getClean(val),
            originalLeftChars,
            input = this.$element[0],
            digitsOnRight = 0;

        if (this.isGoodBrowser) {
            digitsOnRight = this.getDigitsOnRight(val, input.selectionEnd);

            if (newNumericChar) {
                val = val.substr(0, input.selectionStart) + newNumericChar + val.substring(input.selectionEnd, val.length);
            } else {
                originalLeftChars = val.substr(input.selectionStart - 2, 2);
            }
        } else if (newNumericChar) {
            val += newNumericChar;
        }

       this.setNumber(val, null, addSuffix, true, isAllowedKey);

        if (this.isGoodBrowser) {
            var newCursor;
            val = this.$element.val();

            if (!digitsOnRight) {
                newCursor = val.length;
            } else {
                newCursor = this.getCursorFromDigitsOnRight(val, digitsOnRight);

               if (!newNumericChar) {
                    newCursor = this.getCursorFromLeftChar(val, newCursor, originalLeftChars);
                }
            }
            input.setSelectionRange(newCursor, newCursor);
        }
    };

    Phone.prototype.getCursorFromLeftChar = function(val, guessCursor, originalLeftChars) {
        for (var i = guessCursor; i > 0; i--) {
            var leftChar = val.charAt(i - 1);
            if ($.isNumeric(leftChar) || val.substr(i - 2, 2) == originalLeftChars) {
                return i;
            }
        }
        return 0;
    };

    Phone.prototype.getCursorFromDigitsOnRight = function(val, digitsOnRight) {
        for (var i = val.length - 1; i >= 0; i--) {
            if ($.isNumeric(val.charAt(i))) {
                if (--digitsOnRight === 0) {
                    return i;
                }
            }
        }
        return 0;
    };

    Phone.prototype.getDigitsOnRight = function(val, selectionEnd) {
        var digitsOnRight = 0;
        for (var i = selectionEnd; i < val.length; i++) {
            if ($.isNumeric(val.charAt(i))) {
                digitsOnRight++;
            }
        }
        return digitsOnRight;
    };

    Phone.prototype.focusListeners = function() {
        var that = this;

        if (this.options.autoHideDialCode) {
            this.$element.on("mousedown" + this.ns, function(e) {
                if (!that.$element.is(":focus") && !that.$element.val()) {
                    e.preventDefault();
                    that.$element.focus();
                }
            });
        }

        this.$element.on("focus" + this.ns, function(e) {
            var value = that.$element.val();
            that.$element.data("focusVal", value);

            if (that.options.autoHideDialCode && !value && !that.$element.prop("readonly") && that.selectedCountryData.dialCode) {
                that.updateVal("+" + that.selectedCountryData.dialCode, null, true);
                that.$element.one("keypress.plus" + that.ns, function(e) {
                    if (e.which == keys.PLUS) {
                        var newVal = (that.options.autoFormat && window.intlOrigamPhoneUtils) ? "+" : "";
                        that.$element.val(newVal);
                    }
                });

                setTimeout(function() {
                    var input = that.$element[0];
                    if (that.isGoodBrowser) {
                        var len = that.$element.val().length;
                        input.setSelectionRange(len, len);
                    }
                });
            }
        });

        this.$element.on("blur" + this.ns, function() {
            if (that.options.autoHideDialCode) {
                var value = that.$element.val(),
                    startsPlus = (value.charAt(0) == "+");
                if (startsPlus) {
                    var numeric = that.getNumeric(value);
                    if (!numeric || that.selectedCountryData.dialCode == numeric) {
                        that.$element.val("");
                    }
                }
                that.$element.off("keypress.plus" + that.ns);
            }

            if (that.options.autoFormat && window.intlOrigamPhoneUtils && that.$element.val() != that.$element.data("focusVal")) {
                that.$element.trigger("change");
            }
        });
    };

    Phone.prototype.getNumeric = function(s) {
        return s.replace(/\D/g, "");
    };


    Phone.prototype.getClean = function(s) {
        var prefix = (s.charAt(0) == "+") ? "+" : "";
        return prefix + this.getNumeric(s);
    };

    Phone.prototype.show = function() {
        this.setDropdownPosition();

        var activeListItem = this.$countryList.children(".active");
        if (activeListItem.length) {
            this.highlightListItem(activeListItem);
        }

        this.$countryList.removeClass("hide");
        if (activeListItem.length) {
            this.scrollTo(activeListItem);
        }

        this.bindDropdownListeners();

        this.$selectedFlagInner.children(".arrow").addClass("up");
    };

    Phone.prototype.setDropdownPosition = function() {
        var inputTop = this.$element.offset().top,
            windowTop = $(window).scrollTop(),
            dropdownFitsBelow = (inputTop + this.$element.outerHeight() + this.dropdownHeight < windowTop + $(window).height()),
            dropdownFitsAbove = (inputTop - this.dropdownHeight > windowTop);
        
        var cssTop = (!dropdownFitsBelow && dropdownFitsAbove) ? "-" + (this.dropdownHeight - 1) + "px" : "";
        this.$countryList.css("top", cssTop);
    };

    Phone.prototype.bindDropdownListeners = function() {
        var that = this;

        this.$countryList.on("mouseover" + this.ns, ".country", function(e) {
            that.highlightListItem($(this));
        });

        this.$countryList.on("click" + this.ns, ".country", function(e) {
            that.selectListItem($(this));
        });

        var isOpening = true;
        $("html").on("click" + this.ns, function(e) {
            if (!isOpening) {
                that.hide();
            }
            isOpening = false;
        });

        var query = "",
            queryTimer = null;
        $(document).on("keydown" + this.ns, function(e) {
            e.preventDefault();

            if (e.which == keys.UP || e.which == keys.DOWN) {
                that.handleUpDownKey(e.which);
            } else if (e.which == keys.ENTER) {
                that.handleEnterKey();
            } else if (e.which == keys.ESC) {
                that.hide();
            } else if ((e.which >= keys.A && e.which <= keys.Z) || e.which == keys.SPACE) {
                if (queryTimer) {
                    clearTimeout(queryTimer);
                }
                query += String.fromCharCode(e.which);
                that.searchForCountry(query);
                queryTimer = setTimeout(function() {
                    query = "";
                }, 1000);
            }
        });
    };

    Phone.prototype.handleUpDownKey = function(key) {
        var current = this.$countryList.children(".highlight").first();
        var next = (key == keys.UP) ? current.prev() : current.next();
        if (next.length) {
            if (next.hasClass("divider")) {
                next = (key == keys.UP) ? next.prev() : next.next();
            }
            this.highlightListItem(next);
            this.scrollTo(next);
        }
    };

    Phone.prototype.handleEnterKey = function() {
        var currentCountry = this.$countryList.children(".highlight").first();
        if (currentCountry.length) {
            this.selectListItem(currentCountry);
        }
    };

    Phone.prototype.searchForCountry = function(query) {
        for (var i = 0; i < this.countries.length; i++) {
            if (this.startsWith(this.countries[i].name, query)) {
                var listItem = this.countryList.children("[data-country-code=" + this.countries[i].iso2 + "]").not(".preferred");
                // update highlighting and scroll
                this.highlightListItem(listItem);
                this.scrollTo(listItem, true);
                break;
            }
        }
    };

    Phone.prototype.startsWith = function(a, b) {
        return (a.substr(0, b.length).toUpperCase() == b);
    };

    Phone.prototype.updateVal = function(val, format, addSuffix, preventConversion, isAllowedKey) {
        var formatted;

        if (this.options.autoFormat && window.intlOrigamPhoneUtils && this.selectedCountryData) {
            if (typeof(format) == "number" && intlOrigamPhoneUtils.isValidNumber(val, this.selectedCountryData.iso2)) {
                formatted = intlOrigamPhoneUtils.formatNumberByType(val, this.selectedCountryData.iso2, format);
            } else if (!preventConversion && this.options.nationalMode && val.charAt(0) == "+" && intlOrigamPhoneUtils.isValidNumber(val, this.selectedCountryData.iso2)) {
                formatted = intlOrigamPhoneUtils.formatNumberByType(val, this.selectedCountryData.iso2, intlOrigamPhoneUtils.numberFormat.NATIONAL);
            } else {
                formatted = intlOrigamPhoneUtils.formatNumber(val, this.selectedCountryData.iso2, addSuffix, this.options.allowExtensions, isAllowedKey);
            }
            var max = this.$element.attr("maxlength");
            if (max && formatted.length > max) {
                formatted = formatted.substr(0, max);
            }
        } else {
            formatted = val;
        }

        this.$element.val(formatted);
    };

    Phone.prototype.updateFlagFromNumber = function(number, updateDefault) {
        if (number && this.options.nationalMode && this.selectedCountryData && this.selectedCountryData.dialCode == "1" && number.charAt(0) != "+") {
            if (number.charAt(0) != "1") {
                number = "1" + number;
            }
            number = "+" + number;
        }
        var dialCode = this.getDialCode(number),
            countryCode = null;
        if (dialCode) {
            var countryCodes = this.countryCodes[this.getNumeric(dialCode)],
                alreadySelected = (this.selectedCountryData && $.inArray(this.selectedCountryData.iso2, countryCodes) != -1);
            if (!alreadySelected || this.isUnknownNanp(number, dialCode)) {
                for (var j = 0; j < countryCodes.length; j++) {
                    if (countryCodes[j]) {
                        countryCode = countryCodes[j];
                        break;
                    }
                }
            }
        } else if (number.charAt(0) == "+" && this.getNumeric(number).length) {
            countryCode = "";
        } else if (!number || number == "+") {
            countryCode = this.options.defaultCountry.iso2;
        }

        if (countryCode !== null) {
            this.selectFlag(countryCode, updateDefault);
        }
    };

    Phone.prototype.isUnknownNanp = function(number, dialCode) {
        return (dialCode == "+1" && this.getNumeric(number).length >= 4);
    };

    Phone.prototype.highlightListItem = function(listItem) {
        this.$countryListItems.removeClass("highlight");
        listItem.addClass("highlight");
    };

    Phone.prototype.getCountryData = function(countryCode, ignoreOnlyCountriesOption, allowFail) {
        var countryList = (ignoreOnlyCountriesOption) ? allCountries : this.countries;
        for (var i = 0; i < countryList.length; i++) {
            if (countryList[i].iso2 == countryCode) {
                return countryList[i];
            }
        }
        if (allowFail) {
            return null;
        } else {
            throw new Error("No country data for '" + countryCode + "'");
        }
    };

    Phone.prototype.selectFlag = function(countryCode, updateDefault) {
        this.selectedCountryData = (countryCode) ? this.getCountryData(countryCode, false, false) : {};
        if (updateDefault && this.selectedCountryData.iso2) {
            this.options.defaultCountry = {
                iso2: this.selectedCountryData.iso2
            };
        }

        this.$selectedFlagInner.attr("class", "flag " + countryCode);
        var title = (countryCode) ? this.selectedCountryData.name + ": +" + this.selectedCountryData.dialCode : "Unknown";
        this.$selectedFlagInner.parent().attr("title", title);
        
        this.updatePlaceholder();

        if (this.isMobile) {
            this.$countryList.val(countryCode);
        } else {
            this.$countryListItems.removeClass("active");
            if (countryCode) {
                this.$countryListItems.find(".flag." + countryCode).first().closest(".country").addClass("active");
            }
        }
    };

    Phone.prototype.updatePlaceholder = function() {
        if (window.intlOrigamPhoneUtils && !this.InitialPlaceholder && this.options.autoPlaceholder && this.selectedCountryData) {
            var iso2 = this.selectedCountryData.iso2,
                numberType = intlOrigamPhoneUtils.numberType[this.options.numberType || "FIXED_LINE"],
                placeholder = (iso2) ? intlOrigamPhoneUtils.getExampleNumber(iso2, this.options.nationalMode, numberType) : "";
            this.$element.attr("placeholder", placeholder);
        }
    };

    Phone.prototype.selectListItem = function(listItem) {
        var countryCodeAttr = (this.isMobile) ? "value" : "data-country-code";
        this.selectFlag(listItem.attr(countryCodeAttr), true);
        if (!this.isMobile) {
            this.close();
        }

        this.updateDialCode(listItem.attr("data-dial-code"), true);

        this.$element.trigger("change");

        this.$element.focus();
        if (this.isGoodBrowser) {
            var len = this.$element.val().length;
            this.$element[0].setSelectionRange(len, len);
        }
    };

    Phone.prototype.close = function() {
        this.$countryList.addClass("hide");

        this.$selectedFlagInner.children(".arrow").removeClass("up");

        $(document).off(this.ns);
        $("html").off(this.ns);
        this.$countryList.off(this.ns);
    };

    Phone.prototype.scrollTo = function(element, middle) {
        var container = this.$countryList,
            containerHeight = container.height(),
            containerTop = container.offset().top,
            containerBottom = containerTop + containerHeight,
            elementHeight = element.outerHeight(),
            elementTop = element.offset().top,
            elementBottom = elementTop + elementHeight,
            newScrollTop = elementTop - containerTop + container.scrollTop(),
            middleOffset = (containerHeight / 2) - (elementHeight / 2);

        if (elementTop < containerTop) {
            if (middle) {
                newScrollTop -= middleOffset;
            }
            container.scrollTop(newScrollTop);
        } else if (elementBottom > containerBottom) {
            if (middle) {
                newScrollTop += middleOffset;
            }
            var heightDifference = containerHeight - elementHeight;
            container.scrollTop(newScrollTop - heightDifference);
        }
    };

    Phone.prototype.updateDialCode = function(newDialCode, focusing) {
        var inputVal = this.$element.val(),
            newNumber;

        newDialCode = "+" + newDialCode;

        if (this.options.nationalMode && inputVal.charAt(0) != "+") {
            newNumber = inputVal;
        } else if (inputVal) {
            var prevDialCode = this.getDialCode(inputVal);
            if (prevDialCode.length > 1) {
                newNumber = inputVal.replace(prevDialCode, newDialCode);
            } else {
                var existingNumber = (inputVal.charAt(0) != "+") ? $.trim(inputVal) : "";
                newNumber = newDialCode + existingNumber;
            }
        } else {
            newNumber = (!this.options.autoHideDialCode || focusing) ? newDialCode : "";
        }

        this.updateVal(newNumber, null, focusing);
    };

    Phone.prototype.getDialCode = function(number) {
        var dialCode = "";
        if (number.charAt(0) == "+") {
            var numericChars = "";
            for (var i = 0; i < number.length; i++) {
                var c = number.charAt(i);
                if ($.isNumeric(c)) {
                    numericChars += c;
                    if (this.countryCodes[numericChars]) {
                        dialCode = number.substr(0, i + 1);
                    }
                    if (numericChars.length == 4) {
                        break;
                    }
                }
            }
        }
        return dialCode;
    };

    var autoCountryLoaded = function() {
            if (this.options.defaultCountry == "auto") {
                this.options.defaultCountry = $.fn[pluginName].autoCountry;
                this.setInitialState();
                this.autoCountryDeferred.resolve();
            }
        },

        destroy = function() {
            if (!this.isMobile) {
                this.close();
            }

            this.$element.off(this.ns);

            if (this.isMobile) {
                this.$countryList.off(this.ns);
            } else {
                this.$selectedFlagInner.parent().off(this.ns);
                this.$element.closest("label").off(this.ns);
            }

            var container = this.$element.parent();
            container.before(this.$element).remove();
        },


        getExtension = function() {
            return this.$element.val().split(" ext. ")[1] || "";
        },

        getNumber = function(type) {
            if (window.intlOrigamPhoneUtils) {
                return intlOrigamPhoneUtils.formatNumberByType(this.$element.val(), this.selectedCountryData.iso2, type);
            }
            return "";
        },

        getNumberType = function() {
            if (window.intlOrigamPhoneUtils) {
                return intlOrigamPhoneUtils.getNumberType(this.$element.val(), this.selectedCountryData.iso2);
            }
            return -99;
        },

        getSelectedCountryData = function() {
            return this.selectedCountryData || {};
        },

        getValidationError = function() {
            if (window.intlOrigamPhoneUtils) {
                return intlOrigamPhoneUtils.getValidationError(this.$element.val(), this.selectedCountryData.iso2);
            }
            return -99;
        },

        isValidNumber = function() {
            var val = $.trim(this.$element.val()),
                countryCode = (this.options.nationalMode) ? this.selectedCountryData.iso2 : "";
            if (window.intlOrigamPhoneUtils) {
                return intlOrigamPhoneUtils.isValidNumber(val, countryCode);
            }
            return false;
        },

        loadUtils = function(path) {
            var that = this;

            var utilsScript = path || this.options.utilsScript;
            if (!$.fn[pluginName].loadedUtilsScript && utilsScript) {
                $.fn[pluginName].loadedUtilsScript = true;
                
                $.ajax({
                    url: utilsScript,
                    success: function() {
                        $("[data-form='phone']").phone("utilsLoaded");
                    },
                    complete: function() {
                        that.utilsScriptDeferred.resolve();
                    },
                    dataType: "script",
                    cache: true
                });
            } else {
                this.utilsScriptDeferred.resolve();
            }
        },

        selectCountry = function(countryCode) {
            countryCode = countryCode.toLowerCase();
            // check if already selected
            if (!this.$selectedFlagInner.hasClass(countryCode)) {
                this.selectFlag(countryCode, true);
                this.updateDialCode(this.selectedCountryData.dialCode, false);
            }
        },


        setNumber = function(number, format, addSuffix, preventConversion, isAllowedKey) {
            if (!this.options.nationalMode && number.charAt(0) != "+") {
                number = "+" + number;
            }
            this.updateFlagFromNumber(number);
            this.updateVal(number, format, addSuffix, preventConversion, isAllowedKey);
        },


        utilsLoaded = function() {
            if (this.options.autoFormat && this.$element.val()) {
                this.updateVal(this.$element.val());
            }
            this.updatePlaceholder();
        };


    // PHONE PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('origam.phone');
            var options = typeof option == 'object' && option;

            if (!data) $this.data('origam.phone', (data = new Phone(this, options)));
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.phone;

    $.fn.phone             = Plugin;
    $.fn.phone.Constructor = Phone;


    // PHONE NO CONFLICT
    // ===================

    $.fn.input.noConflict = function () {
        $.fn.phone = old;
        return this
    }

    $(document).ready(function() {
        $('[data-form="phone"]').phone();
    });

})(jQuery, window);