(function ($) {

    var origamPhone = function () {
        var
            defaults = {
                classes: {
                    addonsLeft: 'text-field--addons left',
                    addonsRight: 'text-field--addons right',
                    wrapper: 'text-field--group__addons',
                    phone: 'text-field--phone',
                    selected: 'selectcountry-selected',
                    items: 'selectcountry-select',
                    icon: 'origamicon',
                    group : 'text-field--group__selectcountry',
                    Show: 'origamicon-angle-down',
                    Hide: 'origamicon-angle-up',
                    flagicon: 'flag-icon',
                    flagPrefix: 'flag-',
                    selectFlag: 'selectcountry-select--list__icon',
                    selectValue: 'selectcountry-select--list__value',
                    selectList: 'selectcountry-select--list',
                    selectedFlag: 'selectcountry-selected--icon',
                    selectedValue: 'selectcountry-selected--value'
                },
                parentNode: 'text-field',
                HtmlElement: 'span',
                AddonHtmlElement : 'div',
                buttonHtmlElement : 'div',
                flagHtmlElement: 'i',
                itemsHtmlElement: 'div',
                AdddAfter: true,
                phone: {
                    autoFormat: true,
                    autoPlaceholder: true,
                    defaultCountry: "",
                    onlyCountries: [],
                    preferredCountries: [ "US", "GB", "FR" ],
                }
            },
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
            addAddons = function($element,opt){
                var parentNode = '.' + opt.parentNode;
                var classPosition = '';
                optAddonsPosition = opt.AdddAfter;
                optAddonsPosition ? classPosition = opt.classes.addonsRight : opt.classes.addonsLeft;

                $element.parents(parentNode).addClass(classPosition);

                var wrapper = addWrapper(opt.AddonHtmlElement,opt.classes.wrapper);

                if(optAddonsPosition) {
                    $element.after(wrapper);
                    return ($element.next());
                }
                else{
                    $element.before(wrapper);
                    return ($element.prev());
                }
            },
            addWrapper = function(element, opt){
                var wrapper = createHtmlElement(element);
                var $wrapper = $(wrapper).addClass(opt);

                return $wrapper;
            },
            createHtmlElement = function (element){
                element = '<' + element + '/>';

                return element;
            },
            Select = function (plugin, htmlSelectId, opt) {
                var selectHtml = createHtmlElement('select');
                var optionHtml = createHtmlElement('option');
                var htmlSelectElement = $(selectHtml)
                    .attr('id', htmlSelectId)
                    .attr('name', plugin.settings.inputName);

                $.each(plugin.countries, function (code, country) {
                    var optionAttributes = {value: code};
                    if (plugin.settings.selectedCountry !== undefined) {
                        if (plugin.settings.selectedCountry === code) {
                            optionAttributes = {value: code, selected: "selected"};
                            plugin.selected = {value: code, text: code}
                        }
                    }
                    htmlSelectElement.append($(optionHtml, optionAttributes).text(country));
                });

                return htmlSelectElement;
            },
            Button = function (plugin, uniqueId, htmlSelect, opt) {

                var selectedText = $(htmlSelect).find('option').first().text();
                var selectedValue = $(htmlSelect).find('option').first().val();
                var buttonHtml = createHtmlElement(opt.buttonHtmlElement);
                var textHtml = createHtmlElement(opt.HtmlElement);
                var flagHtml = createHtmlElement(opt.flagHtmlElement);

                var $selectedLabel = $(flagHtml)
                    .addClass(opt.classes.selectedFlag)
                    .addClass(opt.classes.flagicon)
                    .addClass(opt.classes.flagPrefix + selectedValue.toLowerCase());;
                selectedText = $(textHtml)
                    .addClass(opt.classes.selectedValue)
                    .html( plugin.selected.value || selectedText );

                selectedValue = plugin.selected.value || selectedValue;

                var button = $(buttonHtml)
                    .addClass(opt.classes.selected)
                    .attr('id', 'selectcountry-' + uniqueId)
                    .attr('data-value', selectedValue)
                    .html($selectedLabel)
                    .append(selectedText);

                return button;

            },
            ItemList = function (plugin, uniqueId, htmlSelect, opt) {
                var itemsHtml = createHtmlElement(opt.itemsHtmlElement);
                var textHtml = createHtmlElement(opt.HtmlElement);
                var flagHtml = createHtmlElement(opt.flagHtmlElement);
                var linkHtml = createHtmlElement('a');

                var items = $(itemsHtml)
                    .attr('id', 'selectcountry-' + uniqueId + '-list')
                    .addClass(opt.classes.items)
                    .addClass('hide');

                // Populate the bootstrap dropdown item list
                $(htmlSelect).find('option').each(function () {

                    // Get original select option values and labels
                    var title = $(this).text();
                    var value = $(this).val();
                    var text = title;
                    var $element = $(textHtml)
                        .addClass(opt.classes.selectValue)
                        .html(text);

                    // Build the flag icon
                    var flagIcon = $(flagHtml)
                        .addClass(opt.classes.selectFlag)
                        .addClass(opt.classes.flagicon)
                        .addClass(opt.classes.flagPrefix + value.toLowerCase());

                    // Build a clickable drop down option item, insert the flag and label, attach click event
                    var flagItem = $(linkHtml)
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
                    var listItem = $(itemsHtml).addClass(opt.classes.selectList).prepend(flagItem);

                    // Append it to the drop down item list
                    items.append(listItem);

                });

                return items;
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

                    if($input.attr('type') === 'phone') {

                        var select = createHtmlElement(opt.HtmlElement);
                        var $wrapper = addAddons($input, opt).append($(select));
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
                            .addClass(opt.classes.group)
                            .addClass(opt.classes.icon)
                            .addClass(opt.classes.Show)
                            .append(Select(plugin, htmlSelectId, options))
                            .append(Button(plugin, uniqueId, htmlSelect, options));

                        $inputParent.append(ItemList(plugin, uniqueId, htmlSelect, options))

                        var $button = $('.selectcountry-selected');

                        $button.bind('click', function(){
                            var button = $(this);
                            var id = $(this).attr('id');
                            var $list = $('#' +  id + '-list');
                        });

                        // Hide the actual HTML select
                        $(htmlSelect).hide();
                    }
                });
            }
        };
    }();

    $.fn.extend({
        origamPhone: origamPhone.init
    });

})(jQuery);