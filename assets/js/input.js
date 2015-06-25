(function ($) {

    var origamInput = function () {
        var
            defaults = {
                placeholder: '',
                classes: {
                    loading: 'text-field--loading',
                    loaded: 'text-field--loaded',
                    focus: 'text-field--focused',
                    active: 'text-field--active',
                    addonsLeft: 'text-field--addons left',
                    addonsRight: 'text-field--addons right',
                    success: 'text-field--success',
                    warning: 'text-field--warning',
                    error: 'text-field--error',
                    password: 'text-field--password'
                },
                wrapper: '<div class="text-field--group__addons"></div>',
                parentNode: 'text-field',
                phone: {
                    autoFormat: true,
                    autoPlaceholder: true,
                    defaultCountry: "",
                    onlyCountries: [],
                    preferredCountries: [ "US", "GB", "FR" ],
                    HtmlElement: 'div',
                    Class: 'origamicon text-field--group__selectcountry',
                    ClassShow: 'origamicon-angle-down',
                    ClassHide: 'origamicon-angle-up',
                    AdddAfter: true
                },
                textarea: {
                    baseHeight: '24'
                },
                password: {
                    showHide:{
                        HtmlElement: 'span',
                        Class: 'origamicon text-field--group__switchpass',
                        ClassShow: 'origamicon-eye',
                        ClassHide: 'origamicon-eye-blocked',
                        AdddAfter: true
                    },
                    strenght: {
                        strenghtMinimumChars: 8,
                        strengthScaleFactor: 1,
                        strenghtClass: 'text-field--progressbar',
                        strenghtClassDanger: 'text-field--progressbar__danger',
                        strenghtClassSuccess: 'text-field--progressbar__success'
                    }
                },
                modules: [
                    'phone',
                    'textarea',
                    'password'
                ]
            },
            min_point = 49,
            max_point = 120,
            charsets = [
                // Commonly Used
                ////////////////////
                [0x0020, 0x0020], // Space
                [0x0030, 0x0039], // Numbers
                [0x0041, 0x005A], // Uppercase
                [0x0061, 0x007A], // Lowercase
                [0x0021, 0x002F], // Punctuation
                [0x003A, 0x0040], // Punctuation
                [0x005B, 0x0060], // Punctuation
                [0x007B, 0x007E], // Punctuation
                // Everything Else
                ////////////////////
                [0x0080, 0x00FF], // Latin-1 Supplement
                [0x0100, 0x017F], // Latin Extended-A
                [0x0180, 0x024F], // Latin Extended-B
                [0x0250, 0x02AF], // IPA Extensions
                [0x02B0, 0x02FF], // Spacing Modifier Letters
                [0x0300, 0x036F], // Combining Diacritical Marks
                [0x0370, 0x03FF], // Greek
                [0x0400, 0x04FF], // Cyrillic
                [0x0530, 0x058F], // Armenian
                [0x0590, 0x05FF], // Hebrew
                [0x0600, 0x06FF], // Arabic
                [0x0700, 0x074F], // Syriac
                [0x0780, 0x07BF], // Thaana
                [0x0900, 0x097F], // Devanagari
                [0x0980, 0x09FF], // Bengali
                [0x0A00, 0x0A7F], // Gurmukhi
                [0x0A80, 0x0AFF], // Gujarati
                [0x0B00, 0x0B7F], // Oriya
                [0x0B80, 0x0BFF], // Tamil
                [0x0C00, 0x0C7F], // Telugu
                [0x0C80, 0x0CFF], // Kannada
                [0x0D00, 0x0D7F], // Malayalam
                [0x0D80, 0x0DFF], // Sinhala
                [0x0E00, 0x0E7F], // Thai
                [0x0E80, 0x0EFF], // Lao
                [0x0F00, 0x0FFF], // Tibetan
                [0x1000, 0x109F], // Myanmar
                [0x10A0, 0x10FF], // Georgian
                [0x1100, 0x11FF], // Hangul Jamo
                [0x1200, 0x137F], // Ethiopic
                [0x13A0, 0x13FF], // Cherokee
                [0x1400, 0x167F], // Unified Canadian Aboriginal Syllabics
                [0x1680, 0x169F], // Ogham
                [0x16A0, 0x16FF], // Runic
                [0x1780, 0x17FF], // Khmer
                [0x1800, 0x18AF], // Mongolian
                [0x1E00, 0x1EFF], // Latin Extended Additional
                [0x1F00, 0x1FFF], // Greek Extended
                [0x2000, 0x206F], // General Punctuation
                [0x2070, 0x209F], // Superscripts and Subscripts
                [0x20A0, 0x20CF], // Currency Symbols
                [0x20D0, 0x20FF], // Combining Marks for Symbols
                [0x2100, 0x214F], // Letterlike Symbols
                [0x2150, 0x218F], // Number Forms
                [0x2190, 0x21FF], // Arrows
                [0x2200, 0x22FF], // Mathematical Operators
                [0x2300, 0x23FF], // Miscellaneous Technical
                [0x2400, 0x243F], // Control Pictures
                [0x2440, 0x245F], // Optical Character Recognition
                [0x2460, 0x24FF], // Enclosed Alphanumerics
                [0x2500, 0x257F], // Box Drawing
                [0x2580, 0x259F], // Block Elements
                [0x25A0, 0x25FF], // Geometric Shapes
                [0x2600, 0x26FF], // Miscellaneous Symbols
                [0x2700, 0x27BF], // Dingbats
                [0x2800, 0x28FF], // Braille Patterns
                [0x2E80, 0x2EFF], // CJK Radicals Supplement
                [0x2F00, 0x2FDF], // Kangxi Radicals
                [0x2FF0, 0x2FFF], // Ideographic Description Characters
                [0x3000, 0x303F], // CJK Symbols and Punctuation
                [0x3040, 0x309F], // Hiragana
                [0x30A0, 0x30FF], // Katakana
                [0x3100, 0x312F], // Bopomofo
                [0x3130, 0x318F], // Hangul Compatibility Jamo
                [0x3190, 0x319F], // Kanbun
                [0x31A0, 0x31BF], // Bopomofo Extended
                [0x3200, 0x32FF], // Enclosed CJK Letters and Months
                [0x3300, 0x33FF], // CJK Compatibility
                [0x3400, 0x4DB5], // CJK Unified Ideographs Extension A
                [0x4E00, 0x9FFF], // CJK Unified Ideographs
                [0xA000, 0xA48F], // Yi Syllables
                [0xA490, 0xA4CF], // Yi Radicals
                [0xAC00, 0xD7A3], // Hangul Syllables
                [0xD800, 0xDB7F], // High Surrogates
                [0xDB80, 0xDBFF], // High Private Use Surrogates
                [0xDC00, 0xDFFF], // Low Surrogates
                [0xE000, 0xF8FF], // Private Use
                [0xF900, 0xFAFF], // CJK Compatibility Ideographs
                [0xFB00, 0xFB4F], // Alphabetic Presentation Forms
                [0xFB50, 0xFDFF], // Arabic Presentation Forms-A
                [0xFE20, 0xFE2F], // Combining Half Marks
                [0xFE30, 0xFE4F], // CJK Compatibility Forms
                [0xFE50, 0xFE6F], // Small Form Variants
                [0xFE70, 0xFEFE], // Arabic Presentation Forms-B
                [0xFEFF, 0xFEFF], // Specials
                [0xFF00, 0xFFEF], // Halfwidth and Fullwidth Forms
                [0xFFF0, 0xFFFD]  // Specials
            ],
            countries = {
                "AF": "Afghanistan",
                "AL": "Albania",
                "DZ": "Algeria",
                "AS": "American Samoa",
                "AD": "Andorra",
                "AO": "Angola",
                "AI": "Anguilla",
                "AG": "Antigua and Barbuda",
                "AR": "Argentina",
                "AM": "Armenia",
                "AW": "Aruba",
                "AU": "Australia",
                "AT": "Austria",
                "AZ": "Azerbaijan",
                "BS": "Bahamas",
                "BH": "Bahrain",
                "BD": "Bangladesh",
                "BB": "Barbados",
                "BY": "Belarus",
                "BE": "Belgium",
                "BZ": "Belize",
                "BJ": "Benin",
                "BM": "Bermuda",
                "BT": "Bhutan",
                "BO": "Bolivia, Plurinational State of",
                "BA": "Bosnia and Herzegovina",
                "BW": "Botswana",
                "BV": "Bouvet Island",
                "BR": "Brazil",
                "IO": "British Indian Ocean Territory",
                "BN": "Brunei Darussalam",
                "BG": "Bulgaria",
                "BF": "Burkina Faso",
                "BI": "Burundi",
                "KH": "Cambodia",
                "CM": "Cameroon",
                "CA": "Canada",
                "CV": "Cape Verde",
                "KY": "Cayman Islands",
                "CF": "Central African Republic",
                "TD": "Chad",
                "CL": "Chile",
                "CN": "China",
                "CO": "Colombia",
                "KM": "Comoros",
                "CG": "Congo",
                "CD": "Congo, the Democratic Republic of the",
                "CK": "Cook Islands",
                "CR": "Costa Rica",
                "CI": "CÃ´te d'Ivoire",
                "HR": "Croatia",
                "CU": "Cuba",
                "CW": "CuraÃ§ao",
                "CY": "Cyprus",
                "CZ": "Czech Republic",
                "DK": "Denmark",
                "DJ": "Djibouti",
                "DM": "Dominica",
                "DO": "Dominican Republic",
                "EC": "Ecuador",
                "EG": "Egypt",
                "SV": "El Salvador",
                "GQ": "Equatorial Guinea",
                "ER": "Eritrea",
                "EE": "Estonia",
                "ET": "Ethiopia",
                "FK": "Falkland Islands (Malvinas)",
                "FO": "Faroe Islands",
                "FJ": "Fiji",
                "FI": "Finland",
                "FR": "France",
                "GF": "French Guiana",
                "PF": "French Polynesia",
                "TF": "French Southern Territories",
                "GA": "Gabon",
                "GM": "Gambia",
                "GE": "Georgia",
                "DE": "Germany",
                "GH": "Ghana",
                "GI": "Gibraltar",
                "GR": "Greece",
                "GL": "Greenland",
                "GD": "Grenada",
                "GP": "Guadeloupe",
                "GU": "Guam",
                "GT": "Guatemala",
                "GG": "Guernsey",
                "GN": "Guinea",
                "GW": "Guinea-Bissau",
                "GY": "Guyana",
                "HT": "Haiti",
                "HM": "Heard Island and McDonald Islands",
                "VA": "Holy See (Vatican City State)",
                "HN": "Honduras",
                "HK": "Hong Kong",
                "HU": "Hungary",
                "IS": "Iceland",
                "IN": "India",
                "ID": "Indonesia",
                "IR": "Iran, Islamic Republic of",
                "IQ": "Iraq",
                "IE": "Ireland",
                "IM": "Isle of Man",
                "IL": "Israel",
                "IT": "Italy",
                "JM": "Jamaica",
                "JP": "Japan",
                "JE": "Jersey",
                "JO": "Jordan",
                "KZ": "Kazakhstan",
                "KE": "Kenya",
                "KI": "Kiribati",
                "KP": "Korea, Democratic People's Republic of",
                "KR": "Korea, Republic of",
                "KW": "Kuwait",
                "KG": "Kyrgyzstan",
                "LA": "Lao People's Democratic Republic",
                "LV": "Latvia",
                "LB": "Lebanon",
                "LS": "Lesotho",
                "LR": "Liberia",
                "LY": "Libya",
                "LI": "Liechtenstein",
                "LT": "Lithuania",
                "LU": "Luxembourg",
                "MO": "Macao",
                "MK": "Macedonia, the former Yugoslav Republic of",
                "MG": "Madagascar",
                "MW": "Malawi",
                "MY": "Malaysia",
                "MV": "Maldives",
                "ML": "Mali",
                "MT": "Malta",
                "MH": "Marshall Islands",
                "MQ": "Martinique",
                "MR": "Mauritania",
                "MU": "Mauritius",
                "YT": "Mayotte",
                "MX": "Mexico",
                "FM": "Micronesia, Federated States of",
                "MD": "Moldova, Republic of",
                "MC": "Monaco",
                "MN": "Mongolia",
                "ME": "Montenegro",
                "MS": "Montserrat",
                "MA": "Morocco",
                "MZ": "Mozambique",
                "MM": "Myanmar",
                "NA": "Namibia",
                "NR": "Nauru",
                "NP": "Nepal",
                "NL": "Netherlands",
                "NC": "New Caledonia",
                "NZ": "New Zealand",
                "NI": "Nicaragua",
                "NE": "Niger",
                "NG": "Nigeria",
                "NU": "Niue",
                "NF": "Norfolk Island",
                "MP": "Northern Mariana Islands",
                "NO": "Norway",
                "OM": "Oman",
                "PK": "Pakistan",
                "PW": "Palau",
                "PS": "Palestinian Territory, Occupied",
                "PA": "Panama",
                "PG": "Papua New Guinea",
                "PY": "Paraguay",
                "PE": "Peru",
                "PH": "Philippines",
                "PN": "Pitcairn",
                "PL": "Poland",
                "PT": "Portugal",
                "PR": "Puerto Rico",
                "QA": "Qatar",
                "RE": "RÃ©union",
                "RO": "Romania",
                "RU": "Russian Federation",
                "RW": "Rwanda",
                "SH": "Saint Helena, Ascension and Tristan da Cunha",
                "KN": "Saint Kitts and Nevis",
                "LC": "Saint Lucia",
                "MF": "Saint Martin (French part)",
                "PM": "Saint Pierre and Miquelon",
                "VC": "Saint Vincent and the Grenadines",
                "WS": "Samoa",
                "SM": "San Marino",
                "ST": "Sao Tome and Principe",
                "SA": "Saudi Arabia",
                "SN": "Senegal",
                "RS": "Serbia",
                "SC": "Seychelles",
                "SL": "Sierra Leone",
                "SG": "Singapore",
                "SX": "Sint Maarten (Dutch part)",
                "SK": "Slovakia",
                "SI": "Slovenia",
                "SB": "Solomon Islands",
                "SO": "Somalia",
                "ZA": "South Africa",
                "GS": "South Georgia and the South Sandwich Islands",
                "SS": "South Sudan",
                "ES": "Spain",
                "LK": "Sri Lanka",
                "SD": "Sudan",
                "SR": "Suriname",
                "SZ": "Swaziland",
                "SE": "Sweden",
                "CH": "Switzerland",
                "SY": "Syrian Arab Republic",
                "TW": "Taiwan, Province of China",
                "TJ": "Tajikistan",
                "TZ": "Tanzania, United Republic of",
                "TH": "Thailand",
                "TL": "Timor-Leste",
                "TG": "Togo",
                "TK": "Tokelau",
                "TO": "Tonga",
                "TT": "Trinidad and Tobago",
                "TN": "Tunisia",
                "TR": "Turkey",
                "TM": "Turkmenistan",
                "TC": "Turks and Caicos Islands",
                "TV": "Tuvalu",
                "UG": "Uganda",
                "UA": "Ukraine",
                "AE": "United Arab Emirates",
                "GB": "United Kingdom",
                "US": "United States",
                "UM": "United States Minor Outlying Islands",
                "UY": "Uruguay",
                "UZ": "Uzbekistan",
                "VU": "Vanuatu",
                "VE": "Venezuela, Bolivarian Republic of",
                "VN": "Viet Nam",
                "VG": "Virgin Islands, British",
                "VI": "Virgin Islands, U.S.",
                "WF": "Wallis and Futuna",
                "EH": "Western Sahara",
                "YE": "Yemen",
                "ZM": "Zambia",
                "ZW": "Zimbabwe"
            },


            /**
             * Global Functions
             */
            addAddons = function($element,opt, optAddonsPosition){
                var parentNode = '.' + opt.parentNode;
                var classPosition = '';
                optAddonsPosition ? classPosition = opt.classes.addonsRight : opt.classes.addonsLeft;

                $element.parents(parentNode).addClass(classPosition);

                if(optAddonsPosition) {
                    $element.after(opt.wrapper);
                    return ($element.next());
                }
                else{
                    $element.before(opt.wrapper);
                    return ($element.prev());
                }
            },
            generateId = function(length) {
                var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
                if (!length) {
                    length = Math.floor(Math.random() * chars.length);
                }
                var str = '';
                for (var i = 0; i < length; i++) {
                    str += chars[Math.floor(Math.random() * chars.length)];
                }
                return str;
            },
            placeholder = function(){

            },
            /**
             * Init Functions
             */
            moduleSwitch = function(mdl, e, $i, opt){
                switch (mdl){
                    case "textarea":
                        if ($i.is('textarea')) {
                            resizeTextarea(e, $i, opt);
                        }
                        break;
                    case "phone":
                        if($i.attr('type') === 'phone') {
                            phoneFormat(e, $i, opt);
                        }
                        break;
                    case "password":
                        if($i.attr('type') === 'password') {
                            passwordSwitch(e, $i, opt);
                            passwordStrenght(e, $i, opt);
                        }
                        break;
                }
            },
            focus = function(){
                $(this).parents('.text-field').removeClass(defaults.classes.active);
                $(this).parents('.text-field').addClass(defaults.classes.focus);
            },
            blur = function(){
                $(this)
                    .parents('.text-field')
                    .removeClass(defaults.classes.focus);
                if($(this).val() != ''){
                    $(this)
                        .parents('.text-field')
                        .addClass(defaults.classes.active);
                }
            },
            /**
             * Textare Functions
             */
            resizeTextarea = function(e, $textarea, opt) {
                var offset = e.offsetHeight - e.clientHeight;
                $textarea.on('keyup input', function () {
                    var baseHeight = opt.textarea.baseHeight + 'px';
                    $textarea.css('height', baseHeight).css('height', e.scrollHeight + offset);
                });
            },
            /**
             * Phone Functions
             */
            phoneFormat = function(e, $phone, opt){
                var $wrapper = addAddons($phone, opt, opt.phone.AdddAfter)
                    .append(document.createElement(opt.phone.HtmlElement));
                var plugin = this;
                var $container = $wrapper.children();

                var uniqueId = generateId(8);

                plugin.countries = {};
                plugin.selected = {value: null, text: null};
                plugin.settings = {inputName: 'country-' + uniqueId};

                var htmlSelectId = 'selectcountry-' + uniqueId;
                var htmlSelect = '#' + htmlSelectId;

                // Merge in global settings then merge in individual settings via data attributes
                plugin.countries = countries;

                if (undefined !== plugin.settings.countries) {
                    plugin.countries = plugin.settings.countries;
                }

                // Build HTML Select, Construct the drop down button, Assemble the drop down list items element and insert
                $container
                    .addClass(opt.phone.Class)
                    .addClass(opt.phone.ClassShow)
                    .append(phoneSelect(plugin, htmlSelectId, opt))
                    .append(phoneDropDownButton(plugin, uniqueId, htmlSelect, opt))
                    .append(phoneDropDownButtonItemList(plugin, uniqueId, htmlSelect, opt));

                // Hide the actual HTML select
                $(htmlSelect).hide();
            },
            phoneSelect = function (plugin, htmlSelectId, opt) {
                var htmlSelectElement = $('<select/>').attr('id', htmlSelectId).attr('name', plugin.settings.inputName);

                $.each(plugin.countries, function (code, country) {
                    var optionAttributes = {value: code};
                    if (plugin.settings.selectedCountry !== undefined) {
                        if (plugin.settings.selectedCountry === code) {
                            optionAttributes = {value: code, selected: "selected"};
                            plugin.selected = {value: code, text: code}
                        }
                    }
                    htmlSelectElement.append($('<option>', optionAttributes).text(country));
                });

                return htmlSelectElement;
            },
            phoneDropDownButton = function (plugin, uniqueId, htmlSelect, opt) {

                var selectedText = $(htmlSelect).find('option').first().val();
                var selectedValue = $(htmlSelect).find('option').first().val();

                selectedText = $('<span/>').addClass('selectcountry-selected--value').html( plugin.selected.value || selectedText );
                selectedValue = plugin.selected.value || selectedValue;

                var $selectedLabel = $('<i/>').addClass('selectcountry-selected--icon flag-icon flag-' + selectedValue.toLowerCase());

                var button = $('<div/>')
                    .addClass('selectcountry-selected')
                    .attr('data-toggle', 'dropdown')
                    .attr('id', 'selectcountry-dropdown-' + uniqueId)
                    .attr('data-value', selectedValue)
                    .html($selectedLabel)
                    .append(selectedText)

                return button;

            },
            phoneDropDownButtonItemList = function (plugin, uniqueId, htmlSelect, opt) {
                var items = $('<ul/>')
                    .attr('id', 'selectcountry-dropdown-' + uniqueId + '-list')
                    .addClass('selectcountry-select');

                // Populate the bootstrap dropdown item list
                $(htmlSelect).find('option').each(function () {

                    // Get original select option values and labels
                    var title = $(this).text();
                    var value = $(this).val();
                    var text = value;
                    var $element = $('<span/>').addClass('selectcountry-select--list__value').html(text);

                    // Build the flag icon
                    var flagIcon = $('<i/>').addClass('selectcountry-select--list__icon flag-icon flag-' + value.toLowerCase());

                    // Build a clickable drop down option item, insert the flag and label, attach click event
                    var flagItem = $('<a/>')
                        .attr('data-val', value)
                        .attr('title', title)
                        .html(flagIcon)
                        .append($element)
                        .on('click', function (e) {
                            $(htmlSelect).find('option').removeAttr('selected');
                            $(htmlSelect).find('option[value="' + $(this).data('val') + '"]').attr("selected", "selected");
                            $('.selectcountry-selected').html($(this).html());
                            e.preventDefault();
                        });

                    // Make it a list item
                    var listItem = $('<li/>').addClass('selectcountry-select--list').prepend(flagItem);

                    // Append it to the drop down item list
                    items.append(listItem);

                });

                return items;
            },
            /**
             * Password Functions
             */
            passwordSwitch = function(e, $password, opt){
                var $wrapper = addAddons($password, opt, opt.password.showHide.AdddAfter);
                $wrapper.append(document.createElement(opt.password.showHide.HtmlElement));
                var $switch = $wrapper.children();
                $switch.addClass(opt.password.showHide.Class).addClass(opt.password.showHide.ClassShow);
                $switch.bind('click', function () {
                    $password.focus();
                    if ($switch.hasClass(opt.password.showHide.ClassShow)) {
                        $password.attr('type', 'text');
                        $switch.removeClass(opt.password.showHide.ClassShow).addClass(opt.password.showHide.ClassHide);
                    } else {
                        $password.attr('type', 'password');
                        $switch.removeClass(opt.password.showHide.ClassHide).addClass(opt.password.showHide.ClassShow);
                    }
                });
            },
            passwordStrenght = function(e,$password, opt){
                $password.bind('keyup focus input propertychange mouseup', function() {
                    var password = $password.val();
                    var complexity = 0, valid = false;
                    var parentNode = '.' + opt.parentNode;
                    var $inputParent = $password.parents(parentNode);

                    $inputParent.addClass(opt.classes.password);

                    // Add character complexity
                    for (var i = charsets.length - 1; i >= 0; i--) {
                        complexity += passwordScore(password, charsets[i]);
                    }

                    // Use natural log to produce linear scale
                    complexity = Math.log(Math.pow(complexity, password.length)) * (1 / opt.password.strenght.strengthScaleFactor);

                    valid = (complexity > min_point && password.length >= opt.password.strenght.strenghtMinimumChars);

                    // Scale to percentage, so it can be used for a progress bar
                    complexity = (complexity / max_point) * 100;
                    complexity = (complexity > 100) ? 100 : complexity;

                    var $element = document.createElement(opt.HtmlElement);
                    var progressBarClass = '.' + opt.password.strenght.strenghtClass;
                    var $progressBar = null;

                    if($(progressBarClass).length === 0) {
                        $password.parent().append($element);
                        $progressBar = $password.siblings().last();
                        $progressBar.addClass(opt.password.strenght.strenghtClass);
                    }else{
                        $progressBar = $password.siblings().last();
                    }

                    $progressBar.toggleClass(opt.password.strenght.strenghtClassSuccess, valid);
                    $progressBar.toggleClass(opt.password.strenght.strenghtClassDanger, !valid);
                    $progressBar.css({'width': complexity + '%'});
                });
            },
            passwordScore = function (str, charset) {
                for (var i = str.length - 1; i >= 0; i--) {
                    if (charset[0] <= str.charCodeAt(i) && str.charCodeAt(i) <= charset[1]) {
                        return charset[1] - charset[0] + 1;
                    }
                }
                return 0;
            };

        return {
            init: function (opt) {
                opt = $.extend({}, defaults, opt || {});

                //For each selected DOM element
                return this.each(function () {
                    var event = this;
                    var $input = $(event);
                    var options = $.extend({}, opt);
                    var parentNode = '.' + options.parentNode;
                    var $inputParent = $input.parents(parentNode);
                    var $inputlabel = $inputParent.children('label');
                    var cls = options.classes;
                    var modules = options.modules;

                    $inputParent.addClass(cls.loaded);
                    $input.focus(focus).blur(blur);

                    modules.forEach(function(index){
                        moduleSwitch(index, event, $input, options);
                    });

                });
            },
            validate: function(opt) {
                opt = $.extend({}, defaults, opt || {});

                //For each selected DOM element
                return this.each(function () {
                    var event = this;
                    var $input = $(event);
                    var $inputParent = $input.parents('.text-field');
                    var $inputlabel = $inputParent.children('label');
                    var options = $.extend({}, opt);
                    var cls = options.classes;


                });
            }
        };
    }();

    $.fn.extend({
        origamInput: origamInput.init,
        origamInputValidate: origamInput.validate
    });

})(jQuery);