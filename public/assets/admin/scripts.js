//! moment.js
//! version : 2.17.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

;
(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        global.moment = factory()
}(this, (function() {
    'use strict';

    var hookCallback;

    function hooks() {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback(callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
    }

    function isObject(input) {
        // IE8 will treat undefined and null as object if it wasn't for
        // input != null
        return input != null && Object.prototype.toString.call(input) === '[object Object]';
    }

    function isObjectEmpty(obj) {
        var k;
        for (k in obj) {
            // even if its not own property I'd still call it non-empty
            return false;
        }
        return true;
    }

    function isNumber(input) {
        return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [],
            i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function createUTC(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty: false,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: false,
            invalidMonth: null,
            invalidFormat: false,
            userInvalidated: false,
            iso: false,
            parsedDateParts: [],
            meridiem: null
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    var some;
    if (Array.prototype.some) {
        some = Array.prototype.some;
    } else {
        some = function(fun) {
            var t = Object(this);
            var len = t.length >>> 0;

            for (var i = 0; i < len; i++) {
                if (i in t && fun.call(this, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    var some$1 = some;

    function isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            var parsedParts = some$1.call(flags.parsedDateParts, function(i) {
                return i != null;
            });
            var isNowValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated &&
                (!flags.meridiem || (flags.meridiem && parsedParts));

            if (m._strict) {
                isNowValid = isNowValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }

            if (Object.isFrozen == null || !Object.isFrozen(m)) {
                m._isValid = isNowValid;
            } else {
                return isNowValid;
            }
        }
        return m._isValid;
    }

    function createInvalid(flags) {
        var m = createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        } else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    function isUndefined(input) {
        return input === void 0;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        if (!this.isValid()) {
            this._d = new Date(NaN);
        }
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment(obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor(number) {
        if (number < 0) {
            // -0 -> 0
            return Math.ceil(number) || 0;
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function warn(msg) {
        if (hooks.suppressDeprecationWarnings === false &&
            (typeof console !== 'undefined') && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function() {
            if (hooks.deprecationHandler != null) {
                hooks.deprecationHandler(null, msg);
            }
            if (firstTime) {
                var args = [];
                var arg;
                for (var i = 0; i < arguments.length; i++) {
                    arg = '';
                    if (typeof arguments[i] === 'object') {
                        arg += '\n[' + i + '] ';
                        for (var key in arguments[0]) {
                            arg += key + ': ' + arguments[0][key] + ', ';
                        }
                        arg = arg.slice(0, -2); // Remove trailing comma and space
                    } else {
                        arg = arguments[i];
                    }
                    args.push(arg);
                }
                warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    hooks.suppressDeprecationWarnings = false;
    hooks.deprecationHandler = null;

    function isFunction(input) {
        return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
    }

    function set(config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (isFunction(prop)) {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        this._config = config;
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _ordinalParseLenient.
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
    }

    function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig),
            prop;
        for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentConfig[prop]);
                    extend(res[prop], childConfig[prop]);
                } else if (childConfig[prop] != null) {
                    res[prop] = childConfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        for (prop in parentConfig) {
            if (hasOwnProp(parentConfig, prop) &&
                !hasOwnProp(childConfig, prop) &&
                isObject(parentConfig[prop])) {
                // make sure changes to properties don't modify parent config
                res[prop] = extend({}, res[prop]);
            }
        }
        return res;
    }

    function Locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    var keys;

    if (Object.keys) {
        keys = Object.keys;
    } else {
        keys = function(obj) {
            var i, res = [];
            for (i in obj) {
                if (hasOwnProp(obj, i)) {
                    res.push(i);
                }
            }
            return res;
        };
    }

    var keys$1 = keys;

    var defaultCalendar = {
        sameDay: '[Today at] LT',
        nextDay: '[Tomorrow at] LT',
        nextWeek: 'dddd [at] LT',
        lastDay: '[Yesterday at] LT',
        lastWeek: '[Last] dddd [at] LT',
        sameElse: 'L'
    };

    function calendar(key, mom, now) {
        var output = this._calendar[key] || this._calendar['sameElse'];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS: 'h:mm:ss A',
        LT: 'h:mm A',
        L: 'MM/DD/YYYY',
        LL: 'MMMM D, YYYY',
        LLL: 'MMMM D, YYYY h:mm A',
        LLLL: 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat(key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function(val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate() {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultOrdinalParse = /\d{1,2}/;

    function ordinal(number) {
        return this._ordinal.replace('%d', number);
    }

    var defaultRelativeTime = {
        future: 'in %s',
        past: '%s ago',
        s: 'a few seconds',
        m: 'a minute',
        mm: '%d minutes',
        h: 'an hour',
        hh: '%d hours',
        d: 'a day',
        dd: '%d days',
        M: 'a month',
        MM: '%d months',
        y: 'a year',
        yy: '%d years'
    };

    function relativeTime(number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (isFunction(output)) ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture(diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var aliases = {};

    function addUnitAlias(unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    var priorities = {};

    function addUnitPriority(unit, priority) {
        priorities[unit] = priority;
    }

    function getPrioritizedUnits(unitsObj) {
        var units = [];
        for (var u in unitsObj) {
            units.push({
                unit: u,
                priority: priorities[u]
            });
        }
        units.sort(function(a, b) {
            return a.priority - b.priority;
        });
        return units;
    }

    function makeGetSet(unit, keepTime) {
        return function(value) {
            if (value != null) {
                set$1(this, unit, value);
                hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get(this, unit);
            }
        };
    }

    function get(mom, unit) {
        return mom.isValid() ?
            mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
    }

    function set$1(mom, unit, value) {
        if (mom.isValid()) {
            mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
        }
    }

    // MOMENTS

    function stringGet(units) {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units]();
        }
        return this;
    }


    function stringSet(units, value) {
        if (typeof units === 'object') {
            units = normalizeObjectUnits(units);
            var prioritized = getPrioritizedUnits(units);
            for (var i = 0; i < prioritized.length; i++) {
                this[prioritized[i].unit](units[prioritized[i].unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken(token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function() {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function() {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function() {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens),
            i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function(mom) {
            var output = '',
                i;
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1 = /\d/; //       0 - 9
    var match2 = /\d\d/; //      00 - 99
    var match3 = /\d{3}/; //     000 - 999
    var match4 = /\d{4}/; //    0000 - 9999
    var match6 = /[+-]?\d{6}/; // -999999 - 999999
    var match1to2 = /\d\d?/; //       0 - 99
    var match3to4 = /\d\d\d\d?/; //     999 - 9999
    var match5to6 = /\d\d\d\d\d\d?/; //   99999 - 999999
    var match1to3 = /\d{1,3}/; //       0 - 999
    var match1to4 = /\d{1,4}/; //       0 - 9999
    var match1to6 = /[+-]?\d{1,6}/; // -999999 - 999999

    var matchUnsigned = /\d+/; //       0 - inf
    var matchSigned = /[+-]?\d+/; //    -inf - inf

    var matchOffset = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
    var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    // includes scottish gaelic two word and hyphenated months
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;


    var regexes = {};

    function addRegexToken(token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function(isStrict, localeData) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken(token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }));
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken(token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (isNumber(callback)) {
            func = function(input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken(token, callback) {
        addParseToken(token, function(input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;
    var WEEK = 7;
    var WEEKDAY = 8;

    var indexOf;

    if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(o) {
            // I know
            var i;
            for (i = 0; i < this.length; ++i) {
                if (this[i] === o) {
                    return i;
                }
            }
            return -1;
        };
    }

    var indexOf$1 = indexOf;

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function() {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function(format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function(format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PRIORITY

    addUnitPriority('month', 8);

    // PARSING

    addRegexToken('M', match1to2);
    addRegexToken('MM', match1to2, match2);
    addRegexToken('MMM', function(isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function(isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function(input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function(input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');

    function localeMonths(m, format) {
        if (!m) {
            return this._months;
        }
        return isArray(this._months) ? this._months[m.month()] :
            this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');

    function localeMonthsShort(m, format) {
        if (!m) {
            return this._monthsShort;
        }
        return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
            this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }

    function handleStrictParse(monthName, format, strict) {
        var i, ii, mom, llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
            // this is not used
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for (i = 0; i < 12; ++i) {
                mom = createUTC([2000, i]);
                this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'MMM') {
                ii = indexOf$1.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf$1.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'MMM') {
                ii = indexOf$1.call(this._shortMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf$1.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf$1.call(this._longMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf$1.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeMonthsParse(monthName, format, strict) {
        var i, mom, regex;

        if (this._monthsParseExact) {
            return handleStrictParse.call(this, monthName, format, strict);
        }

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        // TODO: add sorting
        // Sorting makes sure if one month (or abbr) is a prefix of another
        // see sorting in computeMonthsParse
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth(mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toInt(value);
            } else {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (!isNumber(value)) {
                    return mom;
                }
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth(value) {
        if (value != null) {
            setMonth(this, value);
            hooks.updateOffset(this, true);
            return this;
        } else {
            return get(this, 'Month');
        }
    }

    function getDaysInMonth() {
        return daysInMonth(this.year(), this.month());
    }

    var defaultMonthsShortRegex = matchWord;

    function monthsShortRegex(isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsShortRegex')) {
                this._monthsShortRegex = defaultMonthsShortRegex;
            }
            return this._monthsShortStrictRegex && isStrict ?
                this._monthsShortStrictRegex : this._monthsShortRegex;
        }
    }

    var defaultMonthsRegex = matchWord;

    function monthsRegex(isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsRegex')) {
                this._monthsRegex = defaultMonthsRegex;
            }
            return this._monthsStrictRegex && isStrict ?
                this._monthsStrictRegex : this._monthsRegex;
        }
    }

    function computeMonthsParse() {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [],
            longPieces = [],
            mixedPieces = [],
            i, mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
        }
        for (i = 0; i < 24; i++) {
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    }

    // FORMATTING

    addFormatToken('Y', 0, 0, function() {
        var y = this.year();
        return y <= 9999 ? '' + y : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function() {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY', 4], 0, 'year');
    addFormatToken(0, ['YYYYY', 5], 0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PRIORITIES

    addUnitPriority('year', 1);

    // PARSING

    addRegexToken('Y', matchSigned);
    addRegexToken('YY', match1to2, match2);
    addRegexToken('YYYY', match1to4, match4);
    addRegexToken('YYYYY', match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function(input, array) {
        array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function(input, array) {
        array[YEAR] = hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function(input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    hooks.parseTwoDigitYear = function(input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', true);

    function getIsLeapYear() {
        return isLeapYear(this.year());
    }

    function createDate(y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate(y) {
        var date = new Date(Date.UTC.apply(null, arguments));

        //the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear, resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek, resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PRIORITIES

    addUnitPriority('week', 5);
    addUnitPriority('isoWeek', 5);

    // PARSING

    addRegexToken('w', match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W', match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function(input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // LOCALES

    function localeWeek(mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow: 0, // Sunday is the first day of the week.
        doy: 6 // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek() {
        return this._week.dow;
    }

    function localeFirstDayOfYear() {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek(input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek(input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function(format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function(format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function(format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PRIORITY
    addUnitPriority('day', 11);
    addUnitPriority('weekday', 11);
    addUnitPriority('isoWeekday', 11);

    // PARSING

    addRegexToken('d', match1to2);
    addRegexToken('e', match1to2);
    addRegexToken('E', match1to2);
    addRegexToken('dd', function(isStrict, locale) {
        return locale.weekdaysMinRegex(isStrict);
    });
    addRegexToken('ddd', function(isStrict, locale) {
        return locale.weekdaysShortRegex(isStrict);
    });
    addRegexToken('dddd', function(isStrict, locale) {
        return locale.weekdaysRegex(isStrict);
    });

    addWeekParseToken(['dd', 'ddd', 'dddd'], function(input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function(input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    function parseIsoWeekday(input, locale) {
        if (typeof input === 'string') {
            return locale.weekdaysParse(input) % 7 || 7;
        }
        return isNaN(input) ? null : input;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');

    function localeWeekdays(m, format) {
        if (!m) {
            return this._weekdays;
        }
        return isArray(this._weekdays) ? this._weekdays[m.day()] :
            this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');

    function localeWeekdaysShort(m) {
        return (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');

    function localeWeekdaysMin(m) {
        return (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
    }

    function handleStrictParse$1(weekdayName, format, strict) {
        var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];

            for (i = 0; i < 7; ++i) {
                mom = createUTC([2000, 1]).day(i);
                this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
                this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'dddd') {
                ii = indexOf$1.call(this._weekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf$1.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf$1.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'dddd') {
                ii = indexOf$1.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf$1.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf$1.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf$1.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf$1.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf$1.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf$1.call(this._minWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf$1.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf$1.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeWeekdaysParse(weekdayName, format, strict) {
        var i, mom, regex;

        if (this._weekdaysParseExact) {
            return handleStrictParse$1.call(this, weekdayName, format, strict);
        }

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = createUTC([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
                this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
                this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
            }
            if (!this._weekdaysParse[i]) {
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }

        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.

        if (input != null) {
            var weekday = parseIsoWeekday(input, this.localeData());
            return this.day(this.day() % 7 ? weekday : weekday - 7);
        } else {
            return this.day() || 7;
        }
    }

    var defaultWeekdaysRegex = matchWord;

    function weekdaysRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                this._weekdaysRegex = defaultWeekdaysRegex;
            }
            return this._weekdaysStrictRegex && isStrict ?
                this._weekdaysStrictRegex : this._weekdaysRegex;
        }
    }

    var defaultWeekdaysShortRegex = matchWord;

    function weekdaysShortRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
            }
            return this._weekdaysShortStrictRegex && isStrict ?
                this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
        }
    }

    var defaultWeekdaysMinRegex = matchWord;

    function weekdaysMinRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
            }
            return this._weekdaysMinStrictRegex && isStrict ?
                this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
        }
    }


    function computeWeekdaysParse() {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var minPieces = [],
            shortPieces = [],
            longPieces = [],
            mixedPieces = [],
            i, mom, minp, shortp, longp;
        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, 1]).day(i);
            minp = this.weekdaysMin(mom, '');
            shortp = this.weekdaysShort(mom, '');
            longp = this.weekdays(mom, '');
            minPieces.push(minp);
            shortPieces.push(shortp);
            longPieces.push(longp);
            mixedPieces.push(minp);
            mixedPieces.push(shortp);
            mixedPieces.push(longp);
        }
        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
        // will match the longer piece.
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 7; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;

        this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
        this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    function kFormat() {
        return this.hours() || 24;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);
    addFormatToken('k', ['kk', 2], 0, kFormat);

    addFormatToken('hmm', 0, 0, function() {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function() {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    addFormatToken('Hmm', 0, 0, function() {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function() {
        return '' + this.hours() + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    function meridiem(token, lowercase) {
        addFormatToken(token, 0, 0, function() {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PRIORITY
    addUnitPriority('hour', 13);

    // PARSING

    function matchMeridiem(isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a', matchMeridiem);
    addRegexToken('A', matchMeridiem);
    addRegexToken('H', match1to2);
    addRegexToken('h', match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['a', 'A'], function(input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function(input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function(input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function(input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function(input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function(input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM(input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;

    function localeMeridiem(hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    // months
    // week
    // weekdays
    // meridiem
    var baseConfig = {
        calendar: defaultCalendar,
        longDateFormat: defaultLongDateFormat,
        invalidDate: defaultInvalidDate,
        ordinal: defaultOrdinal,
        ordinalParse: defaultOrdinalParse,
        relativeTime: defaultRelativeTime,

        months: defaultLocaleMonths,
        monthsShort: defaultLocaleMonthsShort,

        week: defaultLocaleWeek,

        weekdays: defaultLocaleWeekdays,
        weekdaysMin: defaultLocaleWeekdaysMin,
        weekdaysShort: defaultLocaleWeekdaysShort,

        meridiemParse: defaultLocaleMeridiemParse
    };

    // internal storage for locale config files
    var locales = {};
    var localeFamilies = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0,
            j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && (typeof module !== 'undefined') &&
            module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we
                // want to undo that for lazy loaded locales
                getSetGlobalLocale(oldLocale);
            } catch (e) {}
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function getSetGlobalLocale(key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = getLocale(key);
            } else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale(name, config) {
        if (config !== null) {
            var parentConfig = baseConfig;
            config.abbr = name;
            if (locales[name] != null) {
                deprecateSimple('defineLocaleOverride',
                    'use moment.updateLocale(localeName, config) to change ' +
                    'an existing locale. moment.defineLocale(localeName, ' +
                    'config) should only be used for creating a new locale ' +
                    'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
                parentConfig = locales[name]._config;
            } else if (config.parentLocale != null) {
                if (locales[config.parentLocale] != null) {
                    parentConfig = locales[config.parentLocale]._config;
                } else {
                    if (!localeFamilies[config.parentLocale]) {
                        localeFamilies[config.parentLocale] = [];
                    }
                    localeFamilies[config.parentLocale].push({
                        name: name,
                        config: config
                    });
                    return null;
                }
            }
            locales[name] = new Locale(mergeConfigs(parentConfig, config));

            if (localeFamilies[name]) {
                localeFamilies[name].forEach(function(x) {
                    defineLocale(x.name, x.config);
                });
            }

            // backwards compat for now: also set the locale
            // make sure we set the locale AFTER all child locales have been
            // created, so we won't end up with the child locale set.
            getSetGlobalLocale(name);


            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updateLocale(name, config) {
        if (config != null) {
            var locale, parentConfig = baseConfig;
            // MERGE
            if (locales[name] != null) {
                parentConfig = locales[name]._config;
            }
            config = mergeConfigs(parentConfig, config);
            locale = new Locale(config);
            locale.parentLocale = locales[name];
            locales[name] = locale;

            // backwards compat for now: also set the locale
            getSetGlobalLocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentLocale != null) {
                    locales[name] = locales[name].parentLocale;
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

    // returns locale data
    function getLocale(key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    function listLocales() {
        return keys$1(locales);
    }

    function checkOverflow(m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH] < 0 || a[MONTH] > 11 ? MONTH :
                a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR] < 0 || a[HOUR] > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE] < 0 || a[MINUTE] > 59 ? MINUTE :
                a[SECOND] < 0 || a[SECOND] > 59 ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
    var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

    var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
        ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
        ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
        ['YYYY-DDD', /\d{4}-\d{3}/],
        ['YYYY-MM', /\d{4}-\d\d/, false],
        ['YYYYYYMMDD', /[+-]\d{10}/],
        ['YYYYMMDD', /\d{8}/],
        // YYYYMM is NOT allowed by the standard
        ['GGGG[W]WWE', /\d{4}W\d{3}/],
        ['GGGG[W]WW', /\d{4}W\d{2}/, false],
        ['YYYYDDD', /\d{7}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
        ['HH:mm:ss', /\d\d:\d\d:\d\d/],
        ['HH:mm', /\d\d:\d\d/],
        ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
        ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
        ['HHmmss', /\d\d\d\d\d\d/],
        ['HHmm', /\d\d\d\d/],
        ['HH', /\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime, dateFormat, timeFormat, tzFormat;

        if (match) {
            getParsingFlags(config).iso = true;

            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimes.length; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            hooks.createFromInputFallback(config);
        }
    }

    hooks.createFromInputFallback = deprecate(
        'value provided is not in a recognized ISO format. moment construction falls back to js Date(), ' +
        'which is not reliable across all browsers and versions. Non ISO date formats are ' +
        'discouraged and will be removed in an upcoming major release. Please refer to ' +
        'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
        function(config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(hooks.now());
        if (config._useUTC) {
            return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray(config) {
        var i, date, input = [],
            currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
            config._a[MINUTE] === 0 &&
            config._a[SECOND] === 0 &&
            config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            var curWeek = weekOfYear(createLocal(), dow, doy);

            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

            // Default to current week.
            week = defaults(w.w, curWeek.week);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // constant that refers to the ISO standard
    hooks.ISO_8601 = function() {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === hooks.ISO_8601) {
            configFromISO(config);
            return;
        }

        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            // console.log('token', token, 'parsedInput', parsedInput,
            //         'regex', getParseRegexForToken(token, config));
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                } else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            } else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (config._a[HOUR] <= 12 &&
            getParsingFlags(config).bigHour === true &&
            config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }

        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap(locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function(obj) {
            return obj && parseInt(obj, 10);
        });

        configFromArray(config);
    }

    function createFromConfig(config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig(config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return createInvalid({
                nullInput: true
            });
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isDate(input)) {
            config._d = input;
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else {
            configFromInput(config);
        }

        if (!isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (input === undefined) {
            config._d = new Date(hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(input.valueOf());
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function(obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (typeof(input) === 'object') {
            configFromObject(config);
        } else if (isNumber(input)) {
            // from milliseconds
            config._d = new Date(input);
        } else {
            hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC(input, format, locale, strict, isUTC) {
        var c = {};

        if (locale === true || locale === false) {
            strict = locale;
            locale = undefined;
        }

        if ((isObject(input) && isObjectEmpty(input)) ||
            (isArray(input) && input.length === 0)) {
            input = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function createLocal(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
        'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
        function() {
            var other = createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other < this ? this : other;
            } else {
                return createInvalid();
            }
        }
    );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
        function() {
            var other = createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other > this ? this : other;
            } else {
                return createInvalid();
            }
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min() {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max() {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function() {
        return Date.now ? Date.now() : +(new Date());
    };

    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = getLocale();

        this._bubble();
    }

    function isDuration(obj) {
        return obj instanceof Duration;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.round(-1 * number) * -1;
        } else {
            return Math.round(number);
        }
    }

    // FORMATTING

    function offset(token, separator) {
        addFormatToken(token, 0, 0, function() {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z', matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function(input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = (string || '').match(matcher);

        if (matches === null) {
            return null;
        }

        var chunk = matches[matches.length - 1] || [];
        var parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return minutes === 0 ?
            0 :
            parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(res._d.valueOf() + diff);
            hooks.updateOffset(res, false);
            return res;
        } else {
            return createLocal(input).local();
        }
    }

    function getDateOffset(m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    hooks.updateOffset = function() {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset(input, keepLocalTime) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
                if (input === null) {
                    return this;
                }
            } else if (Math.abs(input) < 16) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    addSubtract(this, createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone(input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC(keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal(keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset() {
        if (this._tzm != null) {
            this.utcOffset(this._tzm);
        } else if (typeof this._i === 'string') {
            var tZone = offsetFromString(matchOffset, this._i);
            if (tZone != null) {
                this.utcOffset(tZone);
            } else {
                this.utcOffset(0, true);
            }
        }
        return this;
    }

    function hasAlignedHourOffset(input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime() {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted() {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal() {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset() {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc() {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    // and further modified to allow for strings containing both week and day
    var isoRegex = /^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;

    function createDuration(input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months
            };
        } else if (isNumber(input)) {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
            };
        } else if (!!(match = isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y: parseIso(match[2], sign),
                M: parseIso(match[3], sign),
                w: parseIso(match[4], sign),
                d: parseIso(match[5], sign),
                h: parseIso(match[6], sign),
                m: parseIso(match[7], sign),
                s: parseIso(match[8], sign)
            };
        } else if (duration == null) { // checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    createDuration.fn = Duration.prototype;

    function parseIso(inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {
            milliseconds: 0,
            months: 0
        };

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return {
                milliseconds: 0,
                months: 0
            };
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function(val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
                    'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
                tmp = val;
                val = period;
                period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = createDuration(val, period);
            addSubtract(this, dur, direction);
            return this;
        };
    }

    function addSubtract(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = absRound(duration._days),
            months = absRound(duration._months);

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
        }
        if (days) {
            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
        }
        if (months) {
            setMonth(mom, get(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            hooks.updateOffset(mom, days || months);
        }
    }

    var add = createAdder(1, 'add');
    var subtract = createAdder(-1, 'subtract');

    function getCalendarFormat(myMoment, now) {
        var diff = myMoment.diff(now, 'days', true);
        return diff < -6 ? 'sameElse' :
            diff < -1 ? 'lastWeek' :
            diff < 0 ? 'lastDay' :
            diff < 1 ? 'sameDay' :
            diff < 2 ? 'nextDay' :
            diff < 7 ? 'nextWeek' : 'sameElse';
    }

    function calendar$1(time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            format = hooks.calendarFormat(this, sod) || 'sameElse';

        var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

        return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
    }

    function clone() {
        return new Moment(this);
    }

    function isAfter(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() > localInput.valueOf();
        } else {
            return localInput.valueOf() < this.clone().startOf(units).valueOf();
        }
    }

    function isBefore(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() < localInput.valueOf();
        } else {
            return this.clone().endOf(units).valueOf() < localInput.valueOf();
        }
    }

    function isBetween(from, to, units, inclusivity) {
        inclusivity = inclusivity || '()';
        return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) &&
            (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
    }

    function isSame(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() === localInput.valueOf();
        } else {
            inputMs = localInput.valueOf();
            return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
        }
    }

    function isSameOrAfter(input, units) {
        return this.isSame(input, units) || this.isAfter(input, units);
    }

    function isSameOrBefore(input, units) {
        return this.isSame(input, units) || this.isBefore(input, units);
    }

    function diff(input, units, asFloat) {
        var that,
            zoneDelta,
            delta, output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        if (units === 'year' || units === 'month' || units === 'quarter') {
            output = monthDiff(this, that);
            if (units === 'quarter') {
                output = output / 3;
            } else if (units === 'year') {
                output = output / 12;
            }
        } else {
            delta = this - that;
            output = units === 'second' ? delta / 1e3 : // 1000
                units === 'minute' ? delta / 6e4 : // 1000 * 60
                units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
                units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                delta;
        }
        return asFloat ? output : absFloor(output);
    }

    function monthDiff(a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        //check for negative zero, return zero if negative zero
        return -(wholeMonthDiff + adjust) || 0;
    }

    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

    function toString() {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function toISOString() {
        var m = this.clone().utc();
        if (0 < m.year() && m.year() <= 9999) {
            if (isFunction(Date.prototype.toISOString)) {
                // native implementation is ~50x faster, use it when we can
                return this.toDate().toISOString();
            } else {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        } else {
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
    }

    /**
     * Return a human readable representation of a moment that can
     * also be evaluated to get a new moment which is the same
     *
     * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
     */
    function inspect() {
        if (!this.isValid()) {
            return 'moment.invalid(/* ' + this._i + ' */)';
        }
        var func = 'moment';
        var zone = '';
        if (!this.isLocal()) {
            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
            zone = 'Z';
        }
        var prefix = '[' + func + '("]';
        var year = (0 < this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
        var datetime = '-MM-DD[T]HH:mm:ss.SSS';
        var suffix = zone + '[")]';

        return this.format(prefix + year + datetime + suffix);
    }

    function format(inputString) {
        if (!inputString) {
            inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
    }

    function from(time, withoutSuffix) {
        if (this.isValid() &&
            ((isMoment(time) && time.isValid()) ||
                createLocal(time).isValid())) {
            return createDuration({
                to: this,
                from: time
            }).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow(withoutSuffix) {
        return this.from(createLocal(), withoutSuffix);
    }

    function to(time, withoutSuffix) {
        if (this.isValid() &&
            ((isMoment(time) && time.isValid()) ||
                createLocal(time).isValid())) {
            return createDuration({
                from: this,
                to: time
            }).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow(withoutSuffix) {
        return this.to(createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale(key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function(key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData() {
        return this._locale;
    }

    function startOf(units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
            case 'year':
                this.month(0);
                /* falls through */
            case 'quarter':
            case 'month':
                this.date(1);
                /* falls through */
            case 'week':
            case 'isoWeek':
            case 'day':
            case 'date':
                this.hours(0);
                /* falls through */
            case 'hour':
                this.minutes(0);
                /* falls through */
            case 'minute':
                this.seconds(0);
                /* falls through */
            case 'second':
                this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf(units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }

        // 'date' is an alias for 'day', so it should be considered as such.
        if (units === 'date') {
            units = 'day';
        }

        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function valueOf() {
        return this._d.valueOf() - ((this._offset || 0) * 60000);
    }

    function unix() {
        return Math.floor(this.valueOf() / 1000);
    }

    function toDate() {
        return new Date(this.valueOf());
    }

    function toArray() {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject() {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function toJSON() {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }

    function isValid$1() {
        return isValid(this);
    }

    function parsingFlags() {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt() {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        };
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function() {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function() {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken(token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg', 'weekYear');
    addWeekYearFormatToken('ggggg', 'weekYear');
    addWeekYearFormatToken('GGGG', 'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PRIORITY

    addUnitPriority('weekYear', 1);
    addUnitPriority('isoWeekYear', 1);


    // PARSING

    addRegexToken('G', matchSigned);
    addRegexToken('g', matchSigned);
    addRegexToken('GG', match1to2, match2);
    addRegexToken('gg', match1to2, match2);
    addRegexToken('GGGG', match1to4, match4);
    addRegexToken('gggg', match1to4, match4);
    addRegexToken('GGGGG', match1to6, match6);
    addRegexToken('ggggg', match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function(input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function(input, week, config, token) {
        week[token] = hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear(input) {
        return getSetWeekYearHelper.call(this,
            input,
            this.week(),
            this.weekday(),
            this.localeData()._week.dow,
            this.localeData()._week.doy);
    }

    function getSetISOWeekYear(input) {
        return getSetWeekYearHelper.call(this,
            input, this.isoWeek(), this.isoWeekday(), 1, 4);
    }

    function getISOWeeksInYear() {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PRIORITY

    addUnitPriority('quarter', 7);

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function(input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter(input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PRIOROITY
    addUnitPriority('date', 9);

    // PARSING

    addRegexToken('D', match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function(isStrict, locale) {
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function(input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PRIORITY
    addUnitPriority('dayOfYear', 4);

    // PARSING

    addRegexToken('DDD', match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function(input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear(input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PRIORITY

    addUnitPriority('minute', 14);

    // PARSING

    addRegexToken('m', match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PRIORITY

    addUnitPriority('second', 15);

    // PARSING

    addRegexToken('s', match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function() {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function() {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function() {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function() {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function() {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function() {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function() {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function() {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PRIORITY

    addUnitPriority('millisecond', 16);

    // PARSING

    addRegexToken('S', match1to3, match1);
    addRegexToken('SS', match1to3, match2);
    addRegexToken('SSS', match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z', 0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr() {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName() {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var proto = Moment.prototype;

    proto.add = add;
    proto.calendar = calendar$1;
    proto.clone = clone;
    proto.diff = diff;
    proto.endOf = endOf;
    proto.format = format;
    proto.from = from;
    proto.fromNow = fromNow;
    proto.to = to;
    proto.toNow = toNow;
    proto.get = stringGet;
    proto.invalidAt = invalidAt;
    proto.isAfter = isAfter;
    proto.isBefore = isBefore;
    proto.isBetween = isBetween;
    proto.isSame = isSame;
    proto.isSameOrAfter = isSameOrAfter;
    proto.isSameOrBefore = isSameOrBefore;
    proto.isValid = isValid$1;
    proto.lang = lang;
    proto.locale = locale;
    proto.localeData = localeData;
    proto.max = prototypeMax;
    proto.min = prototypeMin;
    proto.parsingFlags = parsingFlags;
    proto.set = stringSet;
    proto.startOf = startOf;
    proto.subtract = subtract;
    proto.toArray = toArray;
    proto.toObject = toObject;
    proto.toDate = toDate;
    proto.toISOString = toISOString;
    proto.inspect = inspect;
    proto.toJSON = toJSON;
    proto.toString = toString;
    proto.unix = unix;
    proto.valueOf = valueOf;
    proto.creationData = creationData;

    // Year
    proto.year = getSetYear;
    proto.isLeapYear = getIsLeapYear;

    // Week Year
    proto.weekYear = getSetWeekYear;
    proto.isoWeekYear = getSetISOWeekYear;

    // Quarter
    proto.quarter = proto.quarters = getSetQuarter;

    // Month
    proto.month = getSetMonth;
    proto.daysInMonth = getDaysInMonth;

    // Week
    proto.week = proto.weeks = getSetWeek;
    proto.isoWeek = proto.isoWeeks = getSetISOWeek;
    proto.weeksInYear = getWeeksInYear;
    proto.isoWeeksInYear = getISOWeeksInYear;

    // Day
    proto.date = getSetDayOfMonth;
    proto.day = proto.days = getSetDayOfWeek;
    proto.weekday = getSetLocaleDayOfWeek;
    proto.isoWeekday = getSetISODayOfWeek;
    proto.dayOfYear = getSetDayOfYear;

    // Hour
    proto.hour = proto.hours = getSetHour;

    // Minute
    proto.minute = proto.minutes = getSetMinute;

    // Second
    proto.second = proto.seconds = getSetSecond;

    // Millisecond
    proto.millisecond = proto.milliseconds = getSetMillisecond;

    // Offset
    proto.utcOffset = getSetOffset;
    proto.utc = setOffsetToUTC;
    proto.local = setOffsetToLocal;
    proto.parseZone = setOffsetToParsedOffset;
    proto.hasAlignedHourOffset = hasAlignedHourOffset;
    proto.isDST = isDaylightSavingTime;
    proto.isLocal = isLocal;
    proto.isUtcOffset = isUtcOffset;
    proto.isUtc = isUtc;
    proto.isUTC = isUtc;

    // Timezone
    proto.zoneAbbr = getZoneAbbr;
    proto.zoneName = getZoneName;

    // Deprecations
    proto.dates = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    proto.years = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    proto.zone = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
    proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

    function createUnix(input) {
        return createLocal(input * 1000);
    }

    function createInZone() {
        return createLocal.apply(null, arguments).parseZone();
    }

    function preParsePostFormat(string) {
        return string;
    }

    var proto$1 = Locale.prototype;

    proto$1.calendar = calendar;
    proto$1.longDateFormat = longDateFormat;
    proto$1.invalidDate = invalidDate;
    proto$1.ordinal = ordinal;
    proto$1.preparse = preParsePostFormat;
    proto$1.postformat = preParsePostFormat;
    proto$1.relativeTime = relativeTime;
    proto$1.pastFuture = pastFuture;
    proto$1.set = set;

    // Month
    proto$1.months = localeMonths;
    proto$1.monthsShort = localeMonthsShort;
    proto$1.monthsParse = localeMonthsParse;
    proto$1.monthsRegex = monthsRegex;
    proto$1.monthsShortRegex = monthsShortRegex;

    // Week
    proto$1.week = localeWeek;
    proto$1.firstDayOfYear = localeFirstDayOfYear;
    proto$1.firstDayOfWeek = localeFirstDayOfWeek;

    // Day of Week
    proto$1.weekdays = localeWeekdays;
    proto$1.weekdaysMin = localeWeekdaysMin;
    proto$1.weekdaysShort = localeWeekdaysShort;
    proto$1.weekdaysParse = localeWeekdaysParse;

    proto$1.weekdaysRegex = weekdaysRegex;
    proto$1.weekdaysShortRegex = weekdaysShortRegex;
    proto$1.weekdaysMinRegex = weekdaysMinRegex;

    // Hours
    proto$1.isPM = localeIsPM;
    proto$1.meridiem = localeMeridiem;

    function get$1(format, index, field, setter) {
        var locale = getLocale();
        var utc = createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function listMonthsImpl(format, index, field) {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return get$1(format, index, field, 'month');
        }

        var i;
        var out = [];
        for (i = 0; i < 12; i++) {
            out[i] = get$1(format, i, field, 'month');
        }
        return out;
    }

    // ()
    // (5)
    // (fmt, 5)
    // (fmt)
    // (true)
    // (true, 5)
    // (true, fmt, 5)
    // (true, fmt)
    function listWeekdaysImpl(localeSorted, format, index, field) {
        if (typeof localeSorted === 'boolean') {
            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        } else {
            format = localeSorted;
            index = format;
            localeSorted = false;

            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        }

        var locale = getLocale(),
            shift = localeSorted ? locale._week.dow : 0;

        if (index != null) {
            return get$1(format, (index + shift) % 7, field, 'day');
        }

        var i;
        var out = [];
        for (i = 0; i < 7; i++) {
            out[i] = get$1(format, (i + shift) % 7, field, 'day');
        }
        return out;
    }

    function listMonths(format, index) {
        return listMonthsImpl(format, index, 'months');
    }

    function listMonthsShort(format, index) {
        return listMonthsImpl(format, index, 'monthsShort');
    }

    function listWeekdays(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
    }

    function listWeekdaysShort(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
    }

    function listWeekdaysMin(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
    }

    getSetGlobalLocale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function(number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports
    hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
    hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

    var mathAbs = Math.abs;

    function abs() {
        var data = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days = mathAbs(this._days);
        this._months = mathAbs(this._months);

        data.milliseconds = mathAbs(data.milliseconds);
        data.seconds = mathAbs(data.seconds);
        data.minutes = mathAbs(data.minutes);
        data.hours = mathAbs(data.hours);
        data.months = mathAbs(data.months);
        data.years = mathAbs(data.years);

        return this;
    }

    function addSubtract$1(duration, input, value, direction) {
        var other = createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days += direction * other._days;
        duration._months += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function add$1(input, value) {
        return addSubtract$1(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function subtract$1(input, value) {
        return addSubtract$1(this, input, value, -1);
    }

    function absCeil(number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble() {
        var milliseconds = this._milliseconds;
        var days = this._days;
        var months = this._months;
        var data = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds = absFloor(milliseconds / 1000);
        data.seconds = seconds % 60;

        minutes = absFloor(seconds / 60);
        data.minutes = minutes % 60;

        hours = absFloor(minutes / 60);
        data.hours = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days = days;
        data.months = months;
        data.years = years;

        return this;
    }

    function daysToMonths(days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays(months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as(units) {
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days = this._days + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week':
                    return days / 7 + milliseconds / 6048e5;
                case 'day':
                    return days + milliseconds / 864e5;
                case 'hour':
                    return days * 24 + milliseconds / 36e5;
                case 'minute':
                    return days * 1440 + milliseconds / 6e4;
                case 'second':
                    return days * 86400 + milliseconds / 1000;
                    // Math.floor prevents floating point math errors here
                case 'millisecond':
                    return Math.floor(days * 864e5) + milliseconds;
                default:
                    throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function valueOf$1() {
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs(alias) {
        return function() {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds = makeAs('s');
    var asMinutes = makeAs('m');
    var asHours = makeAs('h');
    var asDays = makeAs('d');
    var asWeeks = makeAs('w');
    var asMonths = makeAs('M');
    var asYears = makeAs('y');

    function get$2(units) {
        units = normalizeUnits(units);
        return this[units + 's']();
    }

    function makeGetter(name) {
        return function() {
            return this._data[name];
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds = makeGetter('seconds');
    var minutes = makeGetter('minutes');
    var hours = makeGetter('hours');
    var days = makeGetter('days');
    var months = makeGetter('months');
    var years = makeGetter('years');

    function weeks() {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        s: 45, // seconds to minute
        m: 45, // minutes to hour
        h: 22, // hours to day
        d: 26, // days to month
        M: 11 // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime$1(posNegDuration, withoutSuffix, locale) {
        var duration = createDuration(posNegDuration).abs();
        var seconds = round(duration.as('s'));
        var minutes = round(duration.as('m'));
        var hours = round(duration.as('h'));
        var days = round(duration.as('d'));
        var months = round(duration.as('M'));
        var years = round(duration.as('y'));

        var a = seconds < thresholds.s && ['s', seconds] ||
            minutes <= 1 && ['m'] ||
            minutes < thresholds.m && ['mm', minutes] ||
            hours <= 1 && ['h'] ||
            hours < thresholds.h && ['hh', hours] ||
            days <= 1 && ['d'] ||
            days < thresholds.d && ['dd', days] ||
            months <= 1 && ['M'] ||
            months < thresholds.M && ['MM', months] ||
            years <= 1 && ['y'] || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set the rounding function for relative time strings
    function getSetRelativeTimeRounding(roundingFunction) {
        if (roundingFunction === undefined) {
            return round;
        }
        if (typeof(roundingFunction) === 'function') {
            round = roundingFunction;
            return true;
        }
        return false;
    }

    // This function allows you to set a threshold for relative time strings
    function getSetRelativeTimeThreshold(threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        return true;
    }

    function humanize(withSuffix) {
        var locale = this.localeData();
        var output = relativeTime$1(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var abs$1 = Math.abs;

    function toISOString$1() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        var seconds = abs$1(this._milliseconds) / 1000;
        var days = abs$1(this._days);
        var months = abs$1(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes = absFloor(seconds / 60);
        hours = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds;
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        return (total < 0 ? '-' : '') +
            'P' +
            (Y ? Y + 'Y' : '') +
            (M ? M + 'M' : '') +
            (D ? D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? h + 'H' : '') +
            (m ? m + 'M' : '') +
            (s ? s + 'S' : '');
    }

    var proto$2 = Duration.prototype;

    proto$2.abs = abs;
    proto$2.add = add$1;
    proto$2.subtract = subtract$1;
    proto$2.as = as;
    proto$2.asMilliseconds = asMilliseconds;
    proto$2.asSeconds = asSeconds;
    proto$2.asMinutes = asMinutes;
    proto$2.asHours = asHours;
    proto$2.asDays = asDays;
    proto$2.asWeeks = asWeeks;
    proto$2.asMonths = asMonths;
    proto$2.asYears = asYears;
    proto$2.valueOf = valueOf$1;
    proto$2._bubble = bubble;
    proto$2.get = get$2;
    proto$2.milliseconds = milliseconds;
    proto$2.seconds = seconds;
    proto$2.minutes = minutes;
    proto$2.hours = hours;
    proto$2.days = days;
    proto$2.weeks = weeks;
    proto$2.months = months;
    proto$2.years = years;
    proto$2.humanize = humanize;
    proto$2.toISOString = toISOString$1;
    proto$2.toString = toISOString$1;
    proto$2.toJSON = toISOString$1;
    proto$2.locale = locale;
    proto$2.localeData = localeData;

    // Deprecations
    proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
    proto$2.lang = lang;

    // Side effect imports

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function(input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function(input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    hooks.version = '2.17.1';

    setHookCallback(createLocal);

    hooks.fn = proto;
    hooks.min = min;
    hooks.max = max;
    hooks.now = now;
    hooks.utc = createUTC;
    hooks.unix = createUnix;
    hooks.months = listMonths;
    hooks.isDate = isDate;
    hooks.locale = getSetGlobalLocale;
    hooks.invalid = createInvalid;
    hooks.duration = createDuration;
    hooks.isMoment = isMoment;
    hooks.weekdays = listWeekdays;
    hooks.parseZone = createInZone;
    hooks.localeData = getLocale;
    hooks.isDuration = isDuration;
    hooks.monthsShort = listMonthsShort;
    hooks.weekdaysMin = listWeekdaysMin;
    hooks.defineLocale = defineLocale;
    hooks.updateLocale = updateLocale;
    hooks.locales = listLocales;
    hooks.weekdaysShort = listWeekdaysShort;
    hooks.normalizeUnits = normalizeUnits;
    hooks.relativeTimeRounding = getSetRelativeTimeRounding;
    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
    hooks.calendarFormat = getCalendarFormat;
    hooks.prototype = proto;

    return hooks;

})));

/**
 * simplemde v1.11.2
 * Copyright Next Step Webs, Inc.
 * @link https://github.com/NextStepWebs/simplemde-markdown-editor
 * @license MIT
 */
! function(e) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
    else if ("function" == typeof define && define.amd) define([], e);
    else {
        var t;
        t = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, t.SimpleMDE = e()
    }
}(function() {
    var e;
    return function t(e, n, r) {
        function i(a, l) {
            if (!n[a]) {
                if (!e[a]) {
                    var s = "function" == typeof require && require;
                    if (!l && s) return s(a, !0);
                    if (o) return o(a, !0);
                    var c = new Error("Cannot find module '" + a + "'");
                    throw c.code = "MODULE_NOT_FOUND", c
                }
                var u = n[a] = {
                    exports: {}
                };
                e[a][0].call(u.exports, function(t) {
                    var n = e[a][1][t];
                    return i(n ? n : t)
                }, u, u.exports, t, e, n, r)
            }
            return n[a].exports
        }
        for (var o = "function" == typeof require && require, a = 0; a < r.length; a++) i(r[a]);
        return i
    }({
        1: [function(e, t, n) {
            "use strict";

            function r() {
                for (var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", t = 0, n = e.length; n > t; ++t) s[t] = e[t], c[e.charCodeAt(t)] = t;
                c["-".charCodeAt(0)] = 62, c["_".charCodeAt(0)] = 63
            }

            function i(e) {
                var t, n, r, i, o, a, l = e.length;
                if (l % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
                o = "=" === e[l - 2] ? 2 : "=" === e[l - 1] ? 1 : 0, a = new u(3 * l / 4 - o), r = o > 0 ? l - 4 : l;
                var s = 0;
                for (t = 0, n = 0; r > t; t += 4, n += 3) i = c[e.charCodeAt(t)] << 18 | c[e.charCodeAt(t + 1)] << 12 | c[e.charCodeAt(t + 2)] << 6 | c[e.charCodeAt(t + 3)], a[s++] = i >> 16 & 255, a[s++] = i >> 8 & 255, a[s++] = 255 & i;
                return 2 === o ? (i = c[e.charCodeAt(t)] << 2 | c[e.charCodeAt(t + 1)] >> 4, a[s++] = 255 & i) : 1 === o && (i = c[e.charCodeAt(t)] << 10 | c[e.charCodeAt(t + 1)] << 4 | c[e.charCodeAt(t + 2)] >> 2, a[s++] = i >> 8 & 255, a[s++] = 255 & i), a
            }

            function o(e) {
                return s[e >> 18 & 63] + s[e >> 12 & 63] + s[e >> 6 & 63] + s[63 & e]
            }

            function a(e, t, n) {
                for (var r, i = [], a = t; n > a; a += 3) r = (e[a] << 16) + (e[a + 1] << 8) + e[a + 2], i.push(o(r));
                return i.join("")
            }

            function l(e) {
                for (var t, n = e.length, r = n % 3, i = "", o = [], l = 16383, c = 0, u = n - r; u > c; c += l) o.push(a(e, c, c + l > u ? u : c + l));
                return 1 === r ? (t = e[n - 1], i += s[t >> 2], i += s[t << 4 & 63], i += "==") : 2 === r && (t = (e[n - 2] << 8) + e[n - 1], i += s[t >> 10], i += s[t >> 4 & 63], i += s[t << 2 & 63], i += "="), o.push(i), o.join("")
            }
            n.toByteArray = i, n.fromByteArray = l;
            var s = [],
                c = [],
                u = "undefined" != typeof Uint8Array ? Uint8Array : Array;
            r()
        }, {}],
        2: [function(e, t, n) {}, {}],
        3: [function(e, t, n) {
            (function(t) {
                "use strict";

                function r() {
                    try {
                        var e = new Uint8Array(1);
                        return e.foo = function() {
                            return 42
                        }, 42 === e.foo() && "function" == typeof e.subarray && 0 === e.subarray(1, 1).byteLength
                    } catch (t) {
                        return !1
                    }
                }

                function i() {
                    return a.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823
                }

                function o(e, t) {
                    if (i() < t) throw new RangeError("Invalid typed array length");
                    return a.TYPED_ARRAY_SUPPORT ? (e = new Uint8Array(t), e.__proto__ = a.prototype) : (null === e && (e = new a(t)), e.length = t), e
                }

                function a(e, t, n) {
                    if (!(a.TYPED_ARRAY_SUPPORT || this instanceof a)) return new a(e, t, n);
                    if ("number" == typeof e) {
                        if ("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");
                        return u(this, e)
                    }
                    return l(this, e, t, n)
                }

                function l(e, t, n, r) {
                    if ("number" == typeof t) throw new TypeError('"value" argument must not be a number');
                    return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? d(e, t, n, r) : "string" == typeof t ? f(e, t, n) : p(e, t)
                }

                function s(e) {
                    if ("number" != typeof e) throw new TypeError('"size" argument must be a number')
                }

                function c(e, t, n, r) {
                    return s(t), 0 >= t ? o(e, t) : void 0 !== n ? "string" == typeof r ? o(e, t).fill(n, r) : o(e, t).fill(n) : o(e, t)
                }

                function u(e, t) {
                    if (s(t), e = o(e, 0 > t ? 0 : 0 | m(t)), !a.TYPED_ARRAY_SUPPORT)
                        for (var n = 0; t > n; n++) e[n] = 0;
                    return e
                }

                function f(e, t, n) {
                    if ("string" == typeof n && "" !== n || (n = "utf8"), !a.isEncoding(n)) throw new TypeError('"encoding" must be a valid string encoding');
                    var r = 0 | v(t, n);
                    return e = o(e, r), e.write(t, n), e
                }

                function h(e, t) {
                    var n = 0 | m(t.length);
                    e = o(e, n);
                    for (var r = 0; n > r; r += 1) e[r] = 255 & t[r];
                    return e
                }

                function d(e, t, n, r) {
                    if (t.byteLength, 0 > n || t.byteLength < n) throw new RangeError("'offset' is out of bounds");
                    if (t.byteLength < n + (r || 0)) throw new RangeError("'length' is out of bounds");
                    return t = void 0 === r ? new Uint8Array(t, n) : new Uint8Array(t, n, r), a.TYPED_ARRAY_SUPPORT ? (e = t, e.__proto__ = a.prototype) : e = h(e, t), e
                }

                function p(e, t) {
                    if (a.isBuffer(t)) {
                        var n = 0 | m(t.length);
                        return e = o(e, n), 0 === e.length ? e : (t.copy(e, 0, 0, n), e)
                    }
                    if (t) {
                        if ("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length" in t) return "number" != typeof t.length || K(t.length) ? o(e, 0) : h(e, t);
                        if ("Buffer" === t.type && J(t.data)) return h(e, t.data)
                    }
                    throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")
                }

                function m(e) {
                    if (e >= i()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + i().toString(16) + " bytes");
                    return 0 | e
                }

                function g(e) {
                    return +e != e && (e = 0), a.alloc(+e)
                }

                function v(e, t) {
                    if (a.isBuffer(e)) return e.length;
                    if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)) return e.byteLength;
                    "string" != typeof e && (e = "" + e);
                    var n = e.length;
                    if (0 === n) return 0;
                    for (var r = !1;;) switch (t) {
                        case "ascii":
                        case "binary":
                        case "raw":
                        case "raws":
                            return n;
                        case "utf8":
                        case "utf-8":
                        case void 0:
                            return q(e).length;
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return 2 * n;
                        case "hex":
                            return n >>> 1;
                        case "base64":
                            return $(e).length;
                        default:
                            if (r) return q(e).length;
                            t = ("" + t).toLowerCase(), r = !0
                    }
                }

                function y(e, t, n) {
                    var r = !1;
                    if ((void 0 === t || 0 > t) && (t = 0), t > this.length) return "";
                    if ((void 0 === n || n > this.length) && (n = this.length), 0 >= n) return "";
                    if (n >>>= 0, t >>>= 0, t >= n) return "";
                    for (e || (e = "utf8");;) switch (e) {
                        case "hex":
                            return I(this, t, n);
                        case "utf8":
                        case "utf-8":
                            return N(this, t, n);
                        case "ascii":
                            return E(this, t, n);
                        case "binary":
                            return O(this, t, n);
                        case "base64":
                            return M(this, t, n);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return P(this, t, n);
                        default:
                            if (r) throw new TypeError("Unknown encoding: " + e);
                            e = (e + "").toLowerCase(), r = !0
                    }
                }

                function x(e, t, n) {
                    var r = e[t];
                    e[t] = e[n], e[n] = r
                }

                function b(e, t, n, r) {
                    function i(e, t) {
                        return 1 === o ? e[t] : e.readUInt16BE(t * o)
                    }
                    var o = 1,
                        a = e.length,
                        l = t.length;
                    if (void 0 !== r && (r = String(r).toLowerCase(), "ucs2" === r || "ucs-2" === r || "utf16le" === r || "utf-16le" === r)) {
                        if (e.length < 2 || t.length < 2) return -1;
                        o = 2, a /= 2, l /= 2, n /= 2
                    }
                    for (var s = -1, c = 0; a > n + c; c++)
                        if (i(e, n + c) === i(t, -1 === s ? 0 : c - s)) {
                            if (-1 === s && (s = c), c - s + 1 === l) return (n + s) * o
                        } else -1 !== s && (c -= c - s), s = -1;
                    return -1
                }

                function w(e, t, n, r) {
                    n = Number(n) || 0;
                    var i = e.length - n;
                    r ? (r = Number(r), r > i && (r = i)) : r = i;
                    var o = t.length;
                    if (o % 2 !== 0) throw new Error("Invalid hex string");
                    r > o / 2 && (r = o / 2);
                    for (var a = 0; r > a; a++) {
                        var l = parseInt(t.substr(2 * a, 2), 16);
                        if (isNaN(l)) return a;
                        e[n + a] = l
                    }
                    return a
                }

                function k(e, t, n, r) {
                    return V(q(t, e.length - n), e, n, r)
                }

                function S(e, t, n, r) {
                    return V(G(t), e, n, r)
                }

                function C(e, t, n, r) {
                    return S(e, t, n, r)
                }

                function L(e, t, n, r) {
                    return V($(t), e, n, r)
                }

                function T(e, t, n, r) {
                    return V(Y(t, e.length - n), e, n, r)
                }

                function M(e, t, n) {
                    return 0 === t && n === e.length ? X.fromByteArray(e) : X.fromByteArray(e.slice(t, n))
                }

                function N(e, t, n) {
                    n = Math.min(e.length, n);
                    for (var r = [], i = t; n > i;) {
                        var o = e[i],
                            a = null,
                            l = o > 239 ? 4 : o > 223 ? 3 : o > 191 ? 2 : 1;
                        if (n >= i + l) {
                            var s, c, u, f;
                            switch (l) {
                                case 1:
                                    128 > o && (a = o);
                                    break;
                                case 2:
                                    s = e[i + 1], 128 === (192 & s) && (f = (31 & o) << 6 | 63 & s, f > 127 && (a = f));
                                    break;
                                case 3:
                                    s = e[i + 1], c = e[i + 2], 128 === (192 & s) && 128 === (192 & c) && (f = (15 & o) << 12 | (63 & s) << 6 | 63 & c, f > 2047 && (55296 > f || f > 57343) && (a = f));
                                    break;
                                case 4:
                                    s = e[i + 1], c = e[i + 2], u = e[i + 3], 128 === (192 & s) && 128 === (192 & c) && 128 === (192 & u) && (f = (15 & o) << 18 | (63 & s) << 12 | (63 & c) << 6 | 63 & u, f > 65535 && 1114112 > f && (a = f))
                            }
                        }
                        null === a ? (a = 65533, l = 1) : a > 65535 && (a -= 65536, r.push(a >>> 10 & 1023 | 55296), a = 56320 | 1023 & a), r.push(a), i += l
                    }
                    return A(r)
                }

                function A(e) {
                    var t = e.length;
                    if (Q >= t) return String.fromCharCode.apply(String, e);
                    for (var n = "", r = 0; t > r;) n += String.fromCharCode.apply(String, e.slice(r, r += Q));
                    return n
                }

                function E(e, t, n) {
                    var r = "";
                    n = Math.min(e.length, n);
                    for (var i = t; n > i; i++) r += String.fromCharCode(127 & e[i]);
                    return r
                }

                function O(e, t, n) {
                    var r = "";
                    n = Math.min(e.length, n);
                    for (var i = t; n > i; i++) r += String.fromCharCode(e[i]);
                    return r
                }

                function I(e, t, n) {
                    var r = e.length;
                    (!t || 0 > t) && (t = 0), (!n || 0 > n || n > r) && (n = r);
                    for (var i = "", o = t; n > o; o++) i += U(e[o]);
                    return i
                }

                function P(e, t, n) {
                    for (var r = e.slice(t, n), i = "", o = 0; o < r.length; o += 2) i += String.fromCharCode(r[o] + 256 * r[o + 1]);
                    return i
                }

                function R(e, t, n) {
                    if (e % 1 !== 0 || 0 > e) throw new RangeError("offset is not uint");
                    if (e + t > n) throw new RangeError("Trying to access beyond buffer length")
                }

                function D(e, t, n, r, i, o) {
                    if (!a.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
                    if (t > i || o > t) throw new RangeError('"value" argument is out of bounds');
                    if (n + r > e.length) throw new RangeError("Index out of range")
                }

                function H(e, t, n, r) {
                    0 > t && (t = 65535 + t + 1);
                    for (var i = 0, o = Math.min(e.length - n, 2); o > i; i++) e[n + i] = (t & 255 << 8 * (r ? i : 1 - i)) >>> 8 * (r ? i : 1 - i)
                }

                function W(e, t, n, r) {
                    0 > t && (t = 4294967295 + t + 1);
                    for (var i = 0, o = Math.min(e.length - n, 4); o > i; i++) e[n + i] = t >>> 8 * (r ? i : 3 - i) & 255
                }

                function B(e, t, n, r, i, o) {
                    if (n + r > e.length) throw new RangeError("Index out of range");
                    if (0 > n) throw new RangeError("Index out of range")
                }

                function _(e, t, n, r, i) {
                    return i || B(e, t, n, 4, 3.4028234663852886e38, -3.4028234663852886e38), Z.write(e, t, n, r, 23, 4), n + 4
                }

                function F(e, t, n, r, i) {
                    return i || B(e, t, n, 8, 1.7976931348623157e308, -1.7976931348623157e308), Z.write(e, t, n, r, 52, 8), n + 8
                }

                function z(e) {
                    if (e = j(e).replace(ee, ""), e.length < 2) return "";
                    for (; e.length % 4 !== 0;) e += "=";
                    return e
                }

                function j(e) {
                    return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "")
                }

                function U(e) {
                    return 16 > e ? "0" + e.toString(16) : e.toString(16)
                }

                function q(e, t) {
                    t = t || 1 / 0;
                    for (var n, r = e.length, i = null, o = [], a = 0; r > a; a++) {
                        if (n = e.charCodeAt(a), n > 55295 && 57344 > n) {
                            if (!i) {
                                if (n > 56319) {
                                    (t -= 3) > -1 && o.push(239, 191, 189);
                                    continue
                                }
                                if (a + 1 === r) {
                                    (t -= 3) > -1 && o.push(239, 191, 189);
                                    continue
                                }
                                i = n;
                                continue
                            }
                            if (56320 > n) {
                                (t -= 3) > -1 && o.push(239, 191, 189), i = n;
                                continue
                            }
                            n = (i - 55296 << 10 | n - 56320) + 65536
                        } else i && (t -= 3) > -1 && o.push(239, 191, 189);
                        if (i = null, 128 > n) {
                            if ((t -= 1) < 0) break;
                            o.push(n)
                        } else if (2048 > n) {
                            if ((t -= 2) < 0) break;
                            o.push(n >> 6 | 192, 63 & n | 128)
                        } else if (65536 > n) {
                            if ((t -= 3) < 0) break;
                            o.push(n >> 12 | 224, n >> 6 & 63 | 128, 63 & n | 128)
                        } else {
                            if (!(1114112 > n)) throw new Error("Invalid code point");
                            if ((t -= 4) < 0) break;
                            o.push(n >> 18 | 240, n >> 12 & 63 | 128, n >> 6 & 63 | 128, 63 & n | 128)
                        }
                    }
                    return o
                }

                function G(e) {
                    for (var t = [], n = 0; n < e.length; n++) t.push(255 & e.charCodeAt(n));
                    return t
                }

                function Y(e, t) {
                    for (var n, r, i, o = [], a = 0; a < e.length && !((t -= 2) < 0); a++) n = e.charCodeAt(a), r = n >> 8, i = n % 256, o.push(i), o.push(r);
                    return o
                }

                function $(e) {
                    return X.toByteArray(z(e))
                }

                function V(e, t, n, r) {
                    for (var i = 0; r > i && !(i + n >= t.length || i >= e.length); i++) t[i + n] = e[i];
                    return i
                }

                function K(e) {
                    return e !== e
                }
                var X = e("base64-js"),
                    Z = e("ieee754"),
                    J = e("isarray");
                n.Buffer = a, n.SlowBuffer = g, n.INSPECT_MAX_BYTES = 50, a.TYPED_ARRAY_SUPPORT = void 0 !== t.TYPED_ARRAY_SUPPORT ? t.TYPED_ARRAY_SUPPORT : r(), n.kMaxLength = i(), a.poolSize = 8192, a._augment = function(e) {
                    return e.__proto__ = a.prototype, e
                }, a.from = function(e, t, n) {
                    return l(null, e, t, n)
                }, a.TYPED_ARRAY_SUPPORT && (a.prototype.__proto__ = Uint8Array.prototype, a.__proto__ = Uint8Array, "undefined" != typeof Symbol && Symbol.species && a[Symbol.species] === a && Object.defineProperty(a, Symbol.species, {
                    value: null,
                    configurable: !0
                })), a.alloc = function(e, t, n) {
                    return c(null, e, t, n)
                }, a.allocUnsafe = function(e) {
                    return u(null, e)
                }, a.allocUnsafeSlow = function(e) {
                    return u(null, e)
                }, a.isBuffer = function(e) {
                    return !(null == e || !e._isBuffer)
                }, a.compare = function(e, t) {
                    if (!a.isBuffer(e) || !a.isBuffer(t)) throw new TypeError("Arguments must be Buffers");
                    if (e === t) return 0;
                    for (var n = e.length, r = t.length, i = 0, o = Math.min(n, r); o > i; ++i)
                        if (e[i] !== t[i]) {
                            n = e[i], r = t[i];
                            break
                        }
                    return r > n ? -1 : n > r ? 1 : 0
                }, a.isEncoding = function(e) {
                    switch (String(e).toLowerCase()) {
                        case "hex":
                        case "utf8":
                        case "utf-8":
                        case "ascii":
                        case "binary":
                        case "base64":
                        case "raw":
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return !0;
                        default:
                            return !1
                    }
                }, a.concat = function(e, t) {
                    if (!J(e)) throw new TypeError('"list" argument must be an Array of Buffers');
                    if (0 === e.length) return a.alloc(0);
                    var n;
                    if (void 0 === t)
                        for (t = 0, n = 0; n < e.length; n++) t += e[n].length;
                    var r = a.allocUnsafe(t),
                        i = 0;
                    for (n = 0; n < e.length; n++) {
                        var o = e[n];
                        if (!a.isBuffer(o)) throw new TypeError('"list" argument must be an Array of Buffers');
                        o.copy(r, i), i += o.length
                    }
                    return r
                }, a.byteLength = v, a.prototype._isBuffer = !0, a.prototype.swap16 = function() {
                    var e = this.length;
                    if (e % 2 !== 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
                    for (var t = 0; e > t; t += 2) x(this, t, t + 1);
                    return this
                }, a.prototype.swap32 = function() {
                    var e = this.length;
                    if (e % 4 !== 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
                    for (var t = 0; e > t; t += 4) x(this, t, t + 3), x(this, t + 1, t + 2);
                    return this
                }, a.prototype.toString = function() {
                    var e = 0 | this.length;
                    return 0 === e ? "" : 0 === arguments.length ? N(this, 0, e) : y.apply(this, arguments)
                }, a.prototype.equals = function(e) {
                    if (!a.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                    return this === e ? !0 : 0 === a.compare(this, e)
                }, a.prototype.inspect = function() {
                    var e = "",
                        t = n.INSPECT_MAX_BYTES;
                    return this.length > 0 && (e = this.toString("hex", 0, t).match(/.{2}/g).join(" "), this.length > t && (e += " ... ")), "<Buffer " + e + ">"
                }, a.prototype.compare = function(e, t, n, r, i) {
                    if (!a.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                    if (void 0 === t && (t = 0), void 0 === n && (n = e ? e.length : 0), void 0 === r && (r = 0), void 0 === i && (i = this.length), 0 > t || n > e.length || 0 > r || i > this.length) throw new RangeError("out of range index");
                    if (r >= i && t >= n) return 0;
                    if (r >= i) return -1;
                    if (t >= n) return 1;
                    if (t >>>= 0, n >>>= 0, r >>>= 0, i >>>= 0, this === e) return 0;
                    for (var o = i - r, l = n - t, s = Math.min(o, l), c = this.slice(r, i), u = e.slice(t, n), f = 0; s > f; ++f)
                        if (c[f] !== u[f]) {
                            o = c[f], l = u[f];
                            break
                        }
                    return l > o ? -1 : o > l ? 1 : 0
                }, a.prototype.indexOf = function(e, t, n) {
                    if ("string" == typeof t ? (n = t, t = 0) : t > 2147483647 ? t = 2147483647 : -2147483648 > t && (t = -2147483648), t >>= 0, 0 === this.length) return -1;
                    if (t >= this.length) return -1;
                    if (0 > t && (t = Math.max(this.length + t, 0)), "string" == typeof e && (e = a.from(e, n)), a.isBuffer(e)) return 0 === e.length ? -1 : b(this, e, t, n);
                    if ("number" == typeof e) return a.TYPED_ARRAY_SUPPORT && "function" === Uint8Array.prototype.indexOf ? Uint8Array.prototype.indexOf.call(this, e, t) : b(this, [e], t, n);
                    throw new TypeError("val must be string, number or Buffer")
                }, a.prototype.includes = function(e, t, n) {
                    return -1 !== this.indexOf(e, t, n)
                }, a.prototype.write = function(e, t, n, r) {
                    if (void 0 === t) r = "utf8", n = this.length, t = 0;
                    else if (void 0 === n && "string" == typeof t) r = t, n = this.length, t = 0;
                    else {
                        if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                        t = 0 | t, isFinite(n) ? (n = 0 | n, void 0 === r && (r = "utf8")) : (r = n, n = void 0)
                    }
                    var i = this.length - t;
                    if ((void 0 === n || n > i) && (n = i), e.length > 0 && (0 > n || 0 > t) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
                    r || (r = "utf8");
                    for (var o = !1;;) switch (r) {
                        case "hex":
                            return w(this, e, t, n);
                        case "utf8":
                        case "utf-8":
                            return k(this, e, t, n);
                        case "ascii":
                            return S(this, e, t, n);
                        case "binary":
                            return C(this, e, t, n);
                        case "base64":
                            return L(this, e, t, n);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return T(this, e, t, n);
                        default:
                            if (o) throw new TypeError("Unknown encoding: " + r);
                            r = ("" + r).toLowerCase(), o = !0
                    }
                }, a.prototype.toJSON = function() {
                    return {
                        type: "Buffer",
                        data: Array.prototype.slice.call(this._arr || this, 0)
                    }
                };
                var Q = 4096;
                a.prototype.slice = function(e, t) {
                    var n = this.length;
                    e = ~~e, t = void 0 === t ? n : ~~t, 0 > e ? (e += n, 0 > e && (e = 0)) : e > n && (e = n), 0 > t ? (t += n, 0 > t && (t = 0)) : t > n && (t = n), e > t && (t = e);
                    var r;
                    if (a.TYPED_ARRAY_SUPPORT) r = this.subarray(e, t), r.__proto__ = a.prototype;
                    else {
                        var i = t - e;
                        r = new a(i, void 0);
                        for (var o = 0; i > o; o++) r[o] = this[o + e]
                    }
                    return r
                }, a.prototype.readUIntLE = function(e, t, n) {
                    e = 0 | e, t = 0 | t, n || R(e, t, this.length);
                    for (var r = this[e], i = 1, o = 0; ++o < t && (i *= 256);) r += this[e + o] * i;
                    return r
                }, a.prototype.readUIntBE = function(e, t, n) {
                    e = 0 | e, t = 0 | t, n || R(e, t, this.length);
                    for (var r = this[e + --t], i = 1; t > 0 && (i *= 256);) r += this[e + --t] * i;
                    return r
                }, a.prototype.readUInt8 = function(e, t) {
                    return t || R(e, 1, this.length), this[e]
                }, a.prototype.readUInt16LE = function(e, t) {
                    return t || R(e, 2, this.length), this[e] | this[e + 1] << 8
                }, a.prototype.readUInt16BE = function(e, t) {
                    return t || R(e, 2, this.length), this[e] << 8 | this[e + 1]
                }, a.prototype.readUInt32LE = function(e, t) {
                    return t || R(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3]
                }, a.prototype.readUInt32BE = function(e, t) {
                    return t || R(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
                }, a.prototype.readIntLE = function(e, t, n) {
                    e = 0 | e, t = 0 | t, n || R(e, t, this.length);
                    for (var r = this[e], i = 1, o = 0; ++o < t && (i *= 256);) r += this[e + o] * i;
                    return i *= 128, r >= i && (r -= Math.pow(2, 8 * t)), r
                }, a.prototype.readIntBE = function(e, t, n) {
                    e = 0 | e, t = 0 | t, n || R(e, t, this.length);
                    for (var r = t, i = 1, o = this[e + --r]; r > 0 && (i *= 256);) o += this[e + --r] * i;
                    return i *= 128, o >= i && (o -= Math.pow(2, 8 * t)), o
                }, a.prototype.readInt8 = function(e, t) {
                    return t || R(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]
                }, a.prototype.readInt16LE = function(e, t) {
                    t || R(e, 2, this.length);
                    var n = this[e] | this[e + 1] << 8;
                    return 32768 & n ? 4294901760 | n : n
                }, a.prototype.readInt16BE = function(e, t) {
                    t || R(e, 2, this.length);
                    var n = this[e + 1] | this[e] << 8;
                    return 32768 & n ? 4294901760 | n : n
                }, a.prototype.readInt32LE = function(e, t) {
                    return t || R(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
                }, a.prototype.readInt32BE = function(e, t) {
                    return t || R(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
                }, a.prototype.readFloatLE = function(e, t) {
                    return t || R(e, 4, this.length), Z.read(this, e, !0, 23, 4)
                }, a.prototype.readFloatBE = function(e, t) {
                    return t || R(e, 4, this.length), Z.read(this, e, !1, 23, 4)
                }, a.prototype.readDoubleLE = function(e, t) {
                    return t || R(e, 8, this.length), Z.read(this, e, !0, 52, 8)
                }, a.prototype.readDoubleBE = function(e, t) {
                    return t || R(e, 8, this.length), Z.read(this, e, !1, 52, 8)
                }, a.prototype.writeUIntLE = function(e, t, n, r) {
                    if (e = +e, t = 0 | t, n = 0 | n, !r) {
                        var i = Math.pow(2, 8 * n) - 1;
                        D(this, e, t, n, i, 0)
                    }
                    var o = 1,
                        a = 0;
                    for (this[t] = 255 & e; ++a < n && (o *= 256);) this[t + a] = e / o & 255;
                    return t + n
                }, a.prototype.writeUIntBE = function(e, t, n, r) {
                    if (e = +e, t = 0 | t, n = 0 | n, !r) {
                        var i = Math.pow(2, 8 * n) - 1;
                        D(this, e, t, n, i, 0)
                    }
                    var o = n - 1,
                        a = 1;
                    for (this[t + o] = 255 & e; --o >= 0 && (a *= 256);) this[t + o] = e / a & 255;
                    return t + n
                }, a.prototype.writeUInt8 = function(e, t, n) {
                    return e = +e, t = 0 | t, n || D(this, e, t, 1, 255, 0), a.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), this[t] = 255 & e, t + 1
                }, a.prototype.writeUInt16LE = function(e, t, n) {
                    return e = +e, t = 0 | t, n || D(this, e, t, 2, 65535, 0), a.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : H(this, e, t, !0), t + 2
                }, a.prototype.writeUInt16BE = function(e, t, n) {
                    return e = +e, t = 0 | t, n || D(this, e, t, 2, 65535, 0), a.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : H(this, e, t, !1), t + 2
                }, a.prototype.writeUInt32LE = function(e, t, n) {
                    return e = +e, t = 0 | t, n || D(this, e, t, 4, 4294967295, 0), a.TYPED_ARRAY_SUPPORT ? (this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e) : W(this, e, t, !0), t + 4
                }, a.prototype.writeUInt32BE = function(e, t, n) {
                    return e = +e, t = 0 | t, n || D(this, e, t, 4, 4294967295, 0), a.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : W(this, e, t, !1), t + 4
                }, a.prototype.writeIntLE = function(e, t, n, r) {
                    if (e = +e, t = 0 | t, !r) {
                        var i = Math.pow(2, 8 * n - 1);
                        D(this, e, t, n, i - 1, -i)
                    }
                    var o = 0,
                        a = 1,
                        l = 0;
                    for (this[t] = 255 & e; ++o < n && (a *= 256);) 0 > e && 0 === l && 0 !== this[t + o - 1] && (l = 1), this[t + o] = (e / a >> 0) - l & 255;
                    return t + n
                }, a.prototype.writeIntBE = function(e, t, n, r) {
                    if (e = +e, t = 0 | t, !r) {
                        var i = Math.pow(2, 8 * n - 1);
                        D(this, e, t, n, i - 1, -i)
                    }
                    var o = n - 1,
                        a = 1,
                        l = 0;
                    for (this[t + o] = 255 & e; --o >= 0 && (a *= 256);) 0 > e && 0 === l && 0 !== this[t + o + 1] && (l = 1), this[t + o] = (e / a >> 0) - l & 255;
                    return t + n
                }, a.prototype.writeInt8 = function(e, t, n) {
                    return e = +e, t = 0 | t, n || D(this, e, t, 1, 127, -128), a.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), 0 > e && (e = 255 + e + 1), this[t] = 255 & e, t + 1
                }, a.prototype.writeInt16LE = function(e, t, n) {
                    return e = +e, t = 0 | t, n || D(this, e, t, 2, 32767, -32768), a.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : H(this, e, t, !0), t + 2
                }, a.prototype.writeInt16BE = function(e, t, n) {
                    return e = +e, t = 0 | t, n || D(this, e, t, 2, 32767, -32768), a.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : H(this, e, t, !1), t + 2
                }, a.prototype.writeInt32LE = function(e, t, n) {
                    return e = +e, t = 0 | t, n || D(this, e, t, 4, 2147483647, -2147483648), a.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24) : W(this, e, t, !0), t + 4
                }, a.prototype.writeInt32BE = function(e, t, n) {
                    return e = +e, t = 0 | t, n || D(this, e, t, 4, 2147483647, -2147483648), 0 > e && (e = 4294967295 + e + 1), a.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : W(this, e, t, !1), t + 4
                }, a.prototype.writeFloatLE = function(e, t, n) {
                    return _(this, e, t, !0, n)
                }, a.prototype.writeFloatBE = function(e, t, n) {
                    return _(this, e, t, !1, n)
                }, a.prototype.writeDoubleLE = function(e, t, n) {
                    return F(this, e, t, !0, n)
                }, a.prototype.writeDoubleBE = function(e, t, n) {
                    return F(this, e, t, !1, n)
                }, a.prototype.copy = function(e, t, n, r) {
                    if (n || (n = 0), r || 0 === r || (r = this.length), t >= e.length && (t = e.length), t || (t = 0), r > 0 && n > r && (r = n), r === n) return 0;
                    if (0 === e.length || 0 === this.length) return 0;
                    if (0 > t) throw new RangeError("targetStart out of bounds");
                    if (0 > n || n >= this.length) throw new RangeError("sourceStart out of bounds");
                    if (0 > r) throw new RangeError("sourceEnd out of bounds");
                    r > this.length && (r = this.length), e.length - t < r - n && (r = e.length - t + n);
                    var i, o = r - n;
                    if (this === e && t > n && r > t)
                        for (i = o - 1; i >= 0; i--) e[i + t] = this[i + n];
                    else if (1e3 > o || !a.TYPED_ARRAY_SUPPORT)
                        for (i = 0; o > i; i++) e[i + t] = this[i + n];
                    else Uint8Array.prototype.set.call(e, this.subarray(n, n + o), t);
                    return o
                }, a.prototype.fill = function(e, t, n, r) {
                    if ("string" == typeof e) {
                        if ("string" == typeof t ? (r = t, t = 0, n = this.length) : "string" == typeof n && (r = n, n = this.length), 1 === e.length) {
                            var i = e.charCodeAt(0);
                            256 > i && (e = i)
                        }
                        if (void 0 !== r && "string" != typeof r) throw new TypeError("encoding must be a string");
                        if ("string" == typeof r && !a.isEncoding(r)) throw new TypeError("Unknown encoding: " + r)
                    } else "number" == typeof e && (e = 255 & e);
                    if (0 > t || this.length < t || this.length < n) throw new RangeError("Out of range index");
                    if (t >= n) return this;
                    t >>>= 0, n = void 0 === n ? this.length : n >>> 0, e || (e = 0);
                    var o;
                    if ("number" == typeof e)
                        for (o = t; n > o; o++) this[o] = e;
                    else {
                        var l = a.isBuffer(e) ? e : q(new a(e, r).toString()),
                            s = l.length;
                        for (o = 0; n - t > o; o++) this[o + t] = l[o % s]
                    }
                    return this
                };
                var ee = /[^+\/0-9A-Za-z-_]/g
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {
            "base64-js": 1,
            ieee754: 15,
            isarray: 16
        }],
        4: [function(e, t, n) {
            "use strict";

            function r(e) {
                return e = e || {}, "function" != typeof e.codeMirrorInstance || "function" != typeof e.codeMirrorInstance.defineMode ? void console.log("CodeMirror Spell Checker: You must provide an instance of CodeMirror via the option `codeMirrorInstance`") : (String.prototype.includes || (String.prototype.includes = function() {
                    return -1 !== String.prototype.indexOf.apply(this, arguments)
                }), void e.codeMirrorInstance.defineMode("spell-checker", function(t) {
                    if (!r.aff_loading) {
                        r.aff_loading = !0;
                        var n = new XMLHttpRequest;
                        n.open("GET", "https://cdn.jsdelivr.net/codemirror.spell-checker/latest/en_US.aff", !0), n.onload = function() {
                            4 === n.readyState && 200 === n.status && (r.aff_data = n.responseText, r.num_loaded++, 2 == r.num_loaded && (r.typo = new i("en_US", r.aff_data, r.dic_data, {
                                platform: "any"
                            })))
                        }, n.send(null)
                    }
                    if (!r.dic_loading) {
                        r.dic_loading = !0;
                        var o = new XMLHttpRequest;
                        o.open("GET", "https://cdn.jsdelivr.net/codemirror.spell-checker/latest/en_US.dic", !0), o.onload = function() {
                            4 === o.readyState && 200 === o.status && (r.dic_data = o.responseText, r.num_loaded++, 2 == r.num_loaded && (r.typo = new i("en_US", r.aff_data, r.dic_data, {
                                platform: "any"
                            })))
                        }, o.send(null)
                    }
                    var a = '!"#$%&()*+,-./:;<=>?@[\\]^_`{|}~ ',
                        l = {
                            token: function(e) {
                                var t = e.peek(),
                                    n = "";
                                if (a.includes(t)) return e.next(), null;
                                for (; null != (t = e.peek()) && !a.includes(t);) n += t, e.next();
                                return r.typo && !r.typo.check(n) ? "spell-error" : null
                            }
                        },
                        s = e.codeMirrorInstance.getMode(t, t.backdrop || "text/plain");
                    return e.codeMirrorInstance.overlayMode(s, l, !0)
                }))
            }
            var i = e("typo-js");
            r.num_loaded = 0, r.aff_loading = !1, r.dic_loading = !1, r.aff_data = "", r.dic_data = "", r.typo, t.exports = r
        }, {
            "typo-js": 18
        }],
        5: [function(t, n, r) {
            ! function(i) {
                "object" == typeof r && "object" == typeof n ? i(t("../../lib/codemirror")) : "function" == typeof e && e.amd ? e(["../../lib/codemirror"], i) : i(CodeMirror)
            }(function(e) {
                "use strict";

                function t(e) {
                    var t = e.getWrapperElement();
                    e.state.fullScreenRestore = {
                        scrollTop: window.pageYOffset,
                        scrollLeft: window.pageXOffset,
                        width: t.style.width,
                        height: t.style.height
                    }, t.style.width = "", t.style.height = "auto", t.className += " CodeMirror-fullscreen", document.documentElement.style.overflow = "hidden", e.refresh()
                }

                function n(e) {
                    var t = e.getWrapperElement();
                    t.className = t.className.replace(/\s*CodeMirror-fullscreen\b/, ""), document.documentElement.style.overflow = "";
                    var n = e.state.fullScreenRestore;
                    t.style.width = n.width, t.style.height = n.height, window.scrollTo(n.scrollLeft, n.scrollTop), e.refresh()
                }
                e.defineOption("fullScreen", !1, function(r, i, o) {
                    o == e.Init && (o = !1), !o != !i && (i ? t(r) : n(r))
                })
            })
        }, {
            "../../lib/codemirror": 10
        }],
        6: [function(t, n, r) {
            ! function(i) {
                "object" == typeof r && "object" == typeof n ? i(t("../../lib/codemirror")) : "function" == typeof e && e.amd ? e(["../../lib/codemirror"], i) : i(CodeMirror)
            }(function(e) {
                function t(e) {
                    e.state.placeholder && (e.state.placeholder.parentNode.removeChild(e.state.placeholder), e.state.placeholder = null)
                }

                function n(e) {
                    t(e);
                    var n = e.state.placeholder = document.createElement("pre");
                    n.style.cssText = "height: 0; overflow: visible", n.className = "CodeMirror-placeholder";
                    var r = e.getOption("placeholder");
                    "string" == typeof r && (r = document.createTextNode(r)), n.appendChild(r), e.display.lineSpace.insertBefore(n, e.display.lineSpace.firstChild)
                }

                function r(e) {
                    o(e) && n(e)
                }

                function i(e) {
                    var r = e.getWrapperElement(),
                        i = o(e);
                    r.className = r.className.replace(" CodeMirror-empty", "") + (i ? " CodeMirror-empty" : ""), i ? n(e) : t(e)
                }

                function o(e) {
                    return 1 === e.lineCount() && "" === e.getLine(0)
                }
                e.defineOption("placeholder", "", function(n, o, a) {
                    var l = a && a != e.Init;
                    if (o && !l) n.on("blur", r), n.on("change", i), n.on("swapDoc", i), i(n);
                    else if (!o && l) {
                        n.off("blur", r), n.off("change", i), n.off("swapDoc", i), t(n);
                        var s = n.getWrapperElement();
                        s.className = s.className.replace(" CodeMirror-empty", "")
                    }
                    o && !n.hasFocus() && r(n)
                })
            })
        }, {
            "../../lib/codemirror": 10
        }],
        7: [function(t, n, r) {
            ! function(i) {
                "object" == typeof r && "object" == typeof n ? i(t("../../lib/codemirror")) : "function" == typeof e && e.amd ? e(["../../lib/codemirror"], i) : i(CodeMirror)
            }(function(e) {
                "use strict";
                var t = /^(\s*)(>[> ]*|[*+-]\s|(\d+)([.)]))(\s*)/,
                    n = /^(\s*)(>[> ]*|[*+-]|(\d+)[.)])(\s*)$/,
                    r = /[*+-]\s/;
                e.commands.newlineAndIndentContinueMarkdownList = function(i) {
                    if (i.getOption("disableInput")) return e.Pass;
                    for (var o = i.listSelections(), a = [], l = 0; l < o.length; l++) {
                        var s = o[l].head,
                            c = i.getStateAfter(s.line),
                            u = c.list !== !1,
                            f = 0 !== c.quote,
                            h = i.getLine(s.line),
                            d = t.exec(h);
                        if (!o[l].empty() || !u && !f || !d) return void i.execCommand("newlineAndIndent");
                        if (n.test(h)) i.replaceRange("", {
                            line: s.line,
                            ch: 0
                        }, {
                            line: s.line,
                            ch: s.ch + 1
                        }), a[l] = "\n";
                        else {
                            var p = d[1],
                                m = d[5],
                                g = r.test(d[2]) || d[2].indexOf(">") >= 0 ? d[2] : parseInt(d[3], 10) + 1 + d[4];
                            a[l] = "\n" + p + g + m
                        }
                    }
                    i.replaceSelections(a)
                }
            })
        }, {
            "../../lib/codemirror": 10
        }],
        8: [function(t, n, r) {
            ! function(i) {
                "object" == typeof r && "object" == typeof n ? i(t("../../lib/codemirror")) : "function" == typeof e && e.amd ? e(["../../lib/codemirror"], i) : i(CodeMirror)
            }(function(e) {
                "use strict";
                e.overlayMode = function(t, n, r) {
                    return {
                        startState: function() {
                            return {
                                base: e.startState(t),
                                overlay: e.startState(n),
                                basePos: 0,
                                baseCur: null,
                                overlayPos: 0,
                                overlayCur: null,
                                streamSeen: null
                            }
                        },
                        copyState: function(r) {
                            return {
                                base: e.copyState(t, r.base),
                                overlay: e.copyState(n, r.overlay),
                                basePos: r.basePos,
                                baseCur: null,
                                overlayPos: r.overlayPos,
                                overlayCur: null
                            }
                        },
                        token: function(e, i) {
                            return (e != i.streamSeen || Math.min(i.basePos, i.overlayPos) < e.start) && (i.streamSeen = e, i.basePos = i.overlayPos = e.start), e.start == i.basePos && (i.baseCur = t.token(e, i.base), i.basePos = e.pos), e.start == i.overlayPos && (e.pos = e.start, i.overlayCur = n.token(e, i.overlay), i.overlayPos = e.pos), e.pos = Math.min(i.basePos, i.overlayPos), null == i.overlayCur ? i.baseCur : null != i.baseCur && i.overlay.combineTokens || r && null == i.overlay.combineTokens ? i.baseCur + " " + i.overlayCur : i.overlayCur
                        },
                        indent: t.indent && function(e, n) {
                            return t.indent(e.base, n)
                        },
                        electricChars: t.electricChars,
                        innerMode: function(e) {
                            return {
                                state: e.base,
                                mode: t
                            }
                        },
                        blankLine: function(e) {
                            t.blankLine && t.blankLine(e.base), n.blankLine && n.blankLine(e.overlay)
                        }
                    }
                }
            })
        }, {
            "../../lib/codemirror": 10
        }],
        9: [function(t, n, r) {
            ! function(i) {
                "object" == typeof r && "object" == typeof n ? i(t("../../lib/codemirror")) : "function" == typeof e && e.amd ? e(["../../lib/codemirror"], i) : i(CodeMirror)
            }(function(e) {
                "use strict";

                function t(e) {
                    e.operation(function() {
                        a(e)
                    })
                }

                function n(e) {
                    e.state.markedSelection.length && e.operation(function() {
                        i(e)
                    })
                }

                function r(e, t, n, r) {
                    if (0 != c(t, n))
                        for (var i = e.state.markedSelection, o = e.state.markedSelectionStyle, a = t.line;;) {
                            var u = a == t.line ? t : s(a, 0),
                                f = a + l,
                                h = f >= n.line,
                                d = h ? n : s(f, 0),
                                p = e.markText(u, d, {
                                    className: o
                                });
                            if (null == r ? i.push(p) : i.splice(r++, 0, p), h) break;
                            a = f
                        }
                }

                function i(e) {
                    for (var t = e.state.markedSelection, n = 0; n < t.length; ++n) t[n].clear();
                    t.length = 0
                }

                function o(e) {
                    i(e);
                    for (var t = e.listSelections(), n = 0; n < t.length; n++) r(e, t[n].from(), t[n].to())
                }

                function a(e) {
                    if (!e.somethingSelected()) return i(e);
                    if (e.listSelections().length > 1) return o(e);
                    var t = e.getCursor("start"),
                        n = e.getCursor("end"),
                        a = e.state.markedSelection;
                    if (!a.length) return r(e, t, n);
                    var s = a[0].find(),
                        u = a[a.length - 1].find();
                    if (!s || !u || n.line - t.line < l || c(t, u.to) >= 0 || c(n, s.from) <= 0) return o(e);
                    for (; c(t, s.from) > 0;) a.shift().clear(), s = a[0].find();
                    for (c(t, s.from) < 0 && (s.to.line - t.line < l ? (a.shift().clear(), r(e, t, s.to, 0)) : r(e, t, s.from, 0)); c(n, u.to) < 0;) a.pop().clear(), u = a[a.length - 1].find();
                    c(n, u.to) > 0 && (n.line - u.from.line < l ? (a.pop().clear(), r(e, u.from, n)) : r(e, u.to, n))
                }
                e.defineOption("styleSelectedText", !1, function(r, a, l) {
                    var s = l && l != e.Init;
                    a && !s ? (r.state.markedSelection = [], r.state.markedSelectionStyle = "string" == typeof a ? a : "CodeMirror-selectedtext", o(r), r.on("cursorActivity", t), r.on("change", n)) : !a && s && (r.off("cursorActivity", t), r.off("change", n), i(r), r.state.markedSelection = r.state.markedSelectionStyle = null)
                });
                var l = 8,
                    s = e.Pos,
                    c = e.cmpPos
            })
        }, {
            "../../lib/codemirror": 10
        }],
        10: [function(t, n, r) {
            ! function(t) {
                if ("object" == typeof r && "object" == typeof n) n.exports = t();
                else {
                    if ("function" == typeof e && e.amd) return e([], t);
                    (this || window).CodeMirror = t()
                }
            }(function() {
                "use strict";

                function e(n, r) {
                    if (!(this instanceof e)) return new e(n, r);
                    this.options = r = r ? Wi(r) : {}, Wi(ea, r, !1), d(r);
                    var i = r.value;
                    "string" == typeof i && (i = new Ca(i, r.mode, null, r.lineSeparator)), this.doc = i;
                    var o = new e.inputStyles[r.inputStyle](this),
                        a = this.display = new t(n, i, o);
                    a.wrapper.CodeMirror = this, c(this), l(this), r.lineWrapping && (this.display.wrapper.className += " CodeMirror-wrap"), r.autofocus && !Ao && a.input.focus(), v(this), this.state = {
                        keyMaps: [],
                        overlays: [],
                        modeGen: 0,
                        overwrite: !1,
                        delayingBlurEvent: !1,
                        focused: !1,
                        suppressEdits: !1,
                        pasteIncoming: !1,
                        cutIncoming: !1,
                        selectingText: !1,
                        draggingText: !1,
                        highlight: new Ei,
                        keySeq: null,
                        specialChars: null
                    };
                    var s = this;
                    xo && 11 > bo && setTimeout(function() {
                        s.display.input.reset(!0)
                    }, 20), jt(this), Ki(), bt(this), this.curOp.forceUpdate = !0, Xr(this, i), r.autofocus && !Ao || s.hasFocus() ? setTimeout(Bi(vn, this), 20) : yn(this);
                    for (var u in ta) ta.hasOwnProperty(u) && ta[u](this, r[u], na);
                    k(this), r.finishInit && r.finishInit(this);
                    for (var f = 0; f < aa.length; ++f) aa[f](this);
                    kt(this), wo && r.lineWrapping && "optimizelegibility" == getComputedStyle(a.lineDiv).textRendering && (a.lineDiv.style.textRendering = "auto")
                }

                function t(e, t, n) {
                    var r = this;
                    this.input = n, r.scrollbarFiller = ji("div", null, "CodeMirror-scrollbar-filler"), r.scrollbarFiller.setAttribute("cm-not-content", "true"), r.gutterFiller = ji("div", null, "CodeMirror-gutter-filler"), r.gutterFiller.setAttribute("cm-not-content", "true"), r.lineDiv = ji("div", null, "CodeMirror-code"), r.selectionDiv = ji("div", null, null, "position: relative; z-index: 1"), r.cursorDiv = ji("div", null, "CodeMirror-cursors"), r.measure = ji("div", null, "CodeMirror-measure"), r.lineMeasure = ji("div", null, "CodeMirror-measure"), r.lineSpace = ji("div", [r.measure, r.lineMeasure, r.selectionDiv, r.cursorDiv, r.lineDiv], null, "position: relative; outline: none"), r.mover = ji("div", [ji("div", [r.lineSpace], "CodeMirror-lines")], null, "position: relative"), r.sizer = ji("div", [r.mover], "CodeMirror-sizer"), r.sizerWidth = null, r.heightForcer = ji("div", null, null, "position: absolute; height: " + Da + "px; width: 1px;"), r.gutters = ji("div", null, "CodeMirror-gutters"), r.lineGutter = null, r.scroller = ji("div", [r.sizer, r.heightForcer, r.gutters], "CodeMirror-scroll"), r.scroller.setAttribute("tabIndex", "-1"), r.wrapper = ji("div", [r.scrollbarFiller, r.gutterFiller, r.scroller], "CodeMirror"), xo && 8 > bo && (r.gutters.style.zIndex = -1, r.scroller.style.paddingRight = 0), wo || go && Ao || (r.scroller.draggable = !0), e && (e.appendChild ? e.appendChild(r.wrapper) : e(r.wrapper)), r.viewFrom = r.viewTo = t.first, r.reportedViewFrom = r.reportedViewTo = t.first, r.view = [], r.renderedView = null, r.externalMeasured = null, r.viewOffset = 0, r.lastWrapHeight = r.lastWrapWidth = 0, r.updateLineNumbers = null, r.nativeBarWidth = r.barHeight = r.barWidth = 0, r.scrollbarsClipped = !1, r.lineNumWidth = r.lineNumInnerWidth = r.lineNumChars = null, r.alignWidgets = !1, r.cachedCharWidth = r.cachedTextHeight = r.cachedPaddingH = null,
                        r.maxLine = null, r.maxLineLength = 0, r.maxLineChanged = !1, r.wheelDX = r.wheelDY = r.wheelStartX = r.wheelStartY = null, r.shift = !1, r.selForContextMenu = null, r.activeTouch = null, n.init(r)
                }

                function n(t) {
                    t.doc.mode = e.getMode(t.options, t.doc.modeOption), r(t)
                }

                function r(e) {
                    e.doc.iter(function(e) {
                        e.stateAfter && (e.stateAfter = null), e.styles && (e.styles = null)
                    }), e.doc.frontier = e.doc.first, _e(e, 100), e.state.modeGen++, e.curOp && Dt(e)
                }

                function i(e) {
                    e.options.lineWrapping ? (Ja(e.display.wrapper, "CodeMirror-wrap"), e.display.sizer.style.minWidth = "", e.display.sizerWidth = null) : (Za(e.display.wrapper, "CodeMirror-wrap"), h(e)), a(e), Dt(e), lt(e), setTimeout(function() {
                        y(e)
                    }, 100)
                }

                function o(e) {
                    var t = yt(e.display),
                        n = e.options.lineWrapping,
                        r = n && Math.max(5, e.display.scroller.clientWidth / xt(e.display) - 3);
                    return function(i) {
                        if (kr(e.doc, i)) return 0;
                        var o = 0;
                        if (i.widgets)
                            for (var a = 0; a < i.widgets.length; a++) i.widgets[a].height && (o += i.widgets[a].height);
                        return n ? o + (Math.ceil(i.text.length / r) || 1) * t : o + t
                    }
                }

                function a(e) {
                    var t = e.doc,
                        n = o(e);
                    t.iter(function(e) {
                        var t = n(e);
                        t != e.height && ei(e, t)
                    })
                }

                function l(e) {
                    e.display.wrapper.className = e.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") + e.options.theme.replace(/(^|\s)\s*/g, " cm-s-"), lt(e)
                }

                function s(e) {
                    c(e), Dt(e), setTimeout(function() {
                        w(e)
                    }, 20)
                }

                function c(e) {
                    var t = e.display.gutters,
                        n = e.options.gutters;
                    Ui(t);
                    for (var r = 0; r < n.length; ++r) {
                        var i = n[r],
                            o = t.appendChild(ji("div", null, "CodeMirror-gutter " + i));
                        "CodeMirror-linenumbers" == i && (e.display.lineGutter = o, o.style.width = (e.display.lineNumWidth || 1) + "px")
                    }
                    t.style.display = r ? "" : "none", u(e)
                }

                function u(e) {
                    var t = e.display.gutters.offsetWidth;
                    e.display.sizer.style.marginLeft = t + "px"
                }

                function f(e) {
                    if (0 == e.height) return 0;
                    for (var t, n = e.text.length, r = e; t = mr(r);) {
                        var i = t.find(0, !0);
                        r = i.from.line, n += i.from.ch - i.to.ch
                    }
                    for (r = e; t = gr(r);) {
                        var i = t.find(0, !0);
                        n -= r.text.length - i.from.ch, r = i.to.line, n += r.text.length - i.to.ch
                    }
                    return n
                }

                function h(e) {
                    var t = e.display,
                        n = e.doc;
                    t.maxLine = Zr(n, n.first), t.maxLineLength = f(t.maxLine), t.maxLineChanged = !0, n.iter(function(e) {
                        var n = f(e);
                        n > t.maxLineLength && (t.maxLineLength = n, t.maxLine = e)
                    })
                }

                function d(e) {
                    var t = Pi(e.gutters, "CodeMirror-linenumbers"); - 1 == t && e.lineNumbers ? e.gutters = e.gutters.concat(["CodeMirror-linenumbers"]) : t > -1 && !e.lineNumbers && (e.gutters = e.gutters.slice(0), e.gutters.splice(t, 1))
                }

                function p(e) {
                    var t = e.display,
                        n = t.gutters.offsetWidth,
                        r = Math.round(e.doc.height + qe(e.display));
                    return {
                        clientHeight: t.scroller.clientHeight,
                        viewHeight: t.wrapper.clientHeight,
                        scrollWidth: t.scroller.scrollWidth,
                        clientWidth: t.scroller.clientWidth,
                        viewWidth: t.wrapper.clientWidth,
                        barLeft: e.options.fixedGutter ? n : 0,
                        docHeight: r,
                        scrollHeight: r + Ye(e) + t.barHeight,
                        nativeBarWidth: t.nativeBarWidth,
                        gutterWidth: n
                    }
                }

                function m(e, t, n) {
                    this.cm = n;
                    var r = this.vert = ji("div", [ji("div", null, null, "min-width: 1px")], "CodeMirror-vscrollbar"),
                        i = this.horiz = ji("div", [ji("div", null, null, "height: 100%; min-height: 1px")], "CodeMirror-hscrollbar");
                    e(r), e(i), Ea(r, "scroll", function() {
                        r.clientHeight && t(r.scrollTop, "vertical")
                    }), Ea(i, "scroll", function() {
                        i.clientWidth && t(i.scrollLeft, "horizontal")
                    }), this.checkedZeroWidth = !1, xo && 8 > bo && (this.horiz.style.minHeight = this.vert.style.minWidth = "18px")
                }

                function g() {}

                function v(t) {
                    t.display.scrollbars && (t.display.scrollbars.clear(), t.display.scrollbars.addClass && Za(t.display.wrapper, t.display.scrollbars.addClass)), t.display.scrollbars = new e.scrollbarModel[t.options.scrollbarStyle](function(e) {
                        t.display.wrapper.insertBefore(e, t.display.scrollbarFiller), Ea(e, "mousedown", function() {
                            t.state.focused && setTimeout(function() {
                                t.display.input.focus()
                            }, 0)
                        }), e.setAttribute("cm-not-content", "true")
                    }, function(e, n) {
                        "horizontal" == n ? on(t, e) : rn(t, e)
                    }, t), t.display.scrollbars.addClass && Ja(t.display.wrapper, t.display.scrollbars.addClass)
                }

                function y(e, t) {
                    t || (t = p(e));
                    var n = e.display.barWidth,
                        r = e.display.barHeight;
                    x(e, t);
                    for (var i = 0; 4 > i && n != e.display.barWidth || r != e.display.barHeight; i++) n != e.display.barWidth && e.options.lineWrapping && O(e), x(e, p(e)), n = e.display.barWidth, r = e.display.barHeight
                }

                function x(e, t) {
                    var n = e.display,
                        r = n.scrollbars.update(t);
                    n.sizer.style.paddingRight = (n.barWidth = r.right) + "px", n.sizer.style.paddingBottom = (n.barHeight = r.bottom) + "px", n.heightForcer.style.borderBottom = r.bottom + "px solid transparent", r.right && r.bottom ? (n.scrollbarFiller.style.display = "block", n.scrollbarFiller.style.height = r.bottom + "px", n.scrollbarFiller.style.width = r.right + "px") : n.scrollbarFiller.style.display = "", r.bottom && e.options.coverGutterNextToScrollbar && e.options.fixedGutter ? (n.gutterFiller.style.display = "block", n.gutterFiller.style.height = r.bottom + "px", n.gutterFiller.style.width = t.gutterWidth + "px") : n.gutterFiller.style.display = ""
                }

                function b(e, t, n) {
                    var r = n && null != n.top ? Math.max(0, n.top) : e.scroller.scrollTop;
                    r = Math.floor(r - Ue(e));
                    var i = n && null != n.bottom ? n.bottom : r + e.wrapper.clientHeight,
                        o = ni(t, r),
                        a = ni(t, i);
                    if (n && n.ensure) {
                        var l = n.ensure.from.line,
                            s = n.ensure.to.line;
                        o > l ? (o = l, a = ni(t, ri(Zr(t, l)) + e.wrapper.clientHeight)) : Math.min(s, t.lastLine()) >= a && (o = ni(t, ri(Zr(t, s)) - e.wrapper.clientHeight), a = s)
                    }
                    return {
                        from: o,
                        to: Math.max(a, o + 1)
                    }
                }

                function w(e) {
                    var t = e.display,
                        n = t.view;
                    if (t.alignWidgets || t.gutters.firstChild && e.options.fixedGutter) {
                        for (var r = C(t) - t.scroller.scrollLeft + e.doc.scrollLeft, i = t.gutters.offsetWidth, o = r + "px", a = 0; a < n.length; a++)
                            if (!n[a].hidden) {
                                e.options.fixedGutter && n[a].gutter && (n[a].gutter.style.left = o);
                                var l = n[a].alignable;
                                if (l)
                                    for (var s = 0; s < l.length; s++) l[s].style.left = o
                            }
                        e.options.fixedGutter && (t.gutters.style.left = r + i + "px")
                    }
                }

                function k(e) {
                    if (!e.options.lineNumbers) return !1;
                    var t = e.doc,
                        n = S(e.options, t.first + t.size - 1),
                        r = e.display;
                    if (n.length != r.lineNumChars) {
                        var i = r.measure.appendChild(ji("div", [ji("div", n)], "CodeMirror-linenumber CodeMirror-gutter-elt")),
                            o = i.firstChild.offsetWidth,
                            a = i.offsetWidth - o;
                        return r.lineGutter.style.width = "", r.lineNumInnerWidth = Math.max(o, r.lineGutter.offsetWidth - a) + 1, r.lineNumWidth = r.lineNumInnerWidth + a, r.lineNumChars = r.lineNumInnerWidth ? n.length : -1, r.lineGutter.style.width = r.lineNumWidth + "px", u(e), !0
                    }
                    return !1
                }

                function S(e, t) {
                    return String(e.lineNumberFormatter(t + e.firstLineNumber))
                }

                function C(e) {
                    return e.scroller.getBoundingClientRect().left - e.sizer.getBoundingClientRect().left
                }

                function L(e, t, n) {
                    var r = e.display;
                    this.viewport = t, this.visible = b(r, e.doc, t), this.editorIsHidden = !r.wrapper.offsetWidth, this.wrapperHeight = r.wrapper.clientHeight, this.wrapperWidth = r.wrapper.clientWidth, this.oldDisplayWidth = $e(e), this.force = n, this.dims = P(e), this.events = []
                }

                function T(e) {
                    var t = e.display;
                    !t.scrollbarsClipped && t.scroller.offsetWidth && (t.nativeBarWidth = t.scroller.offsetWidth - t.scroller.clientWidth, t.heightForcer.style.height = Ye(e) + "px", t.sizer.style.marginBottom = -t.nativeBarWidth + "px", t.sizer.style.borderRightWidth = Ye(e) + "px", t.scrollbarsClipped = !0)
                }

                function M(e, t) {
                    var n = e.display,
                        r = e.doc;
                    if (t.editorIsHidden) return Wt(e), !1;
                    if (!t.force && t.visible.from >= n.viewFrom && t.visible.to <= n.viewTo && (null == n.updateLineNumbers || n.updateLineNumbers >= n.viewTo) && n.renderedView == n.view && 0 == zt(e)) return !1;
                    k(e) && (Wt(e), t.dims = P(e));
                    var i = r.first + r.size,
                        o = Math.max(t.visible.from - e.options.viewportMargin, r.first),
                        a = Math.min(i, t.visible.to + e.options.viewportMargin);
                    n.viewFrom < o && o - n.viewFrom < 20 && (o = Math.max(r.first, n.viewFrom)), n.viewTo > a && n.viewTo - a < 20 && (a = Math.min(i, n.viewTo)), Wo && (o = br(e.doc, o), a = wr(e.doc, a));
                    var l = o != n.viewFrom || a != n.viewTo || n.lastWrapHeight != t.wrapperHeight || n.lastWrapWidth != t.wrapperWidth;
                    Ft(e, o, a), n.viewOffset = ri(Zr(e.doc, n.viewFrom)), e.display.mover.style.top = n.viewOffset + "px";
                    var s = zt(e);
                    if (!l && 0 == s && !t.force && n.renderedView == n.view && (null == n.updateLineNumbers || n.updateLineNumbers >= n.viewTo)) return !1;
                    var c = Gi();
                    return s > 4 && (n.lineDiv.style.display = "none"), R(e, n.updateLineNumbers, t.dims), s > 4 && (n.lineDiv.style.display = ""), n.renderedView = n.view, c && Gi() != c && c.offsetHeight && c.focus(), Ui(n.cursorDiv), Ui(n.selectionDiv), n.gutters.style.height = n.sizer.style.minHeight = 0, l && (n.lastWrapHeight = t.wrapperHeight, n.lastWrapWidth = t.wrapperWidth, _e(e, 400)), n.updateLineNumbers = null, !0
                }

                function N(e, t) {
                    for (var n = t.viewport, r = !0;
                        (r && e.options.lineWrapping && t.oldDisplayWidth != $e(e) || (n && null != n.top && (n = {
                            top: Math.min(e.doc.height + qe(e.display) - Ve(e), n.top)
                        }), t.visible = b(e.display, e.doc, n), !(t.visible.from >= e.display.viewFrom && t.visible.to <= e.display.viewTo))) && M(e, t); r = !1) {
                        O(e);
                        var i = p(e);
                        Re(e), y(e, i), E(e, i)
                    }
                    t.signal(e, "update", e), e.display.viewFrom == e.display.reportedViewFrom && e.display.viewTo == e.display.reportedViewTo || (t.signal(e, "viewportChange", e, e.display.viewFrom, e.display.viewTo), e.display.reportedViewFrom = e.display.viewFrom, e.display.reportedViewTo = e.display.viewTo)
                }

                function A(e, t) {
                    var n = new L(e, t);
                    if (M(e, n)) {
                        O(e), N(e, n);
                        var r = p(e);
                        Re(e), y(e, r), E(e, r), n.finish()
                    }
                }

                function E(e, t) {
                    e.display.sizer.style.minHeight = t.docHeight + "px", e.display.heightForcer.style.top = t.docHeight + "px", e.display.gutters.style.height = t.docHeight + e.display.barHeight + Ye(e) + "px"
                }

                function O(e) {
                    for (var t = e.display, n = t.lineDiv.offsetTop, r = 0; r < t.view.length; r++) {
                        var i, o = t.view[r];
                        if (!o.hidden) {
                            if (xo && 8 > bo) {
                                var a = o.node.offsetTop + o.node.offsetHeight;
                                i = a - n, n = a
                            } else {
                                var l = o.node.getBoundingClientRect();
                                i = l.bottom - l.top
                            }
                            var s = o.line.height - i;
                            if (2 > i && (i = yt(t)), (s > .001 || -.001 > s) && (ei(o.line, i), I(o.line), o.rest))
                                for (var c = 0; c < o.rest.length; c++) I(o.rest[c])
                        }
                    }
                }

                function I(e) {
                    if (e.widgets)
                        for (var t = 0; t < e.widgets.length; ++t) e.widgets[t].height = e.widgets[t].node.parentNode.offsetHeight
                }

                function P(e) {
                    for (var t = e.display, n = {}, r = {}, i = t.gutters.clientLeft, o = t.gutters.firstChild, a = 0; o; o = o.nextSibling, ++a) n[e.options.gutters[a]] = o.offsetLeft + o.clientLeft + i, r[e.options.gutters[a]] = o.clientWidth;
                    return {
                        fixedPos: C(t),
                        gutterTotalWidth: t.gutters.offsetWidth,
                        gutterLeft: n,
                        gutterWidth: r,
                        wrapperWidth: t.wrapper.clientWidth
                    }
                }

                function R(e, t, n) {
                    function r(t) {
                        var n = t.nextSibling;
                        return wo && Eo && e.display.currentWheelTarget == t ? t.style.display = "none" : t.parentNode.removeChild(t), n
                    }
                    for (var i = e.display, o = e.options.lineNumbers, a = i.lineDiv, l = a.firstChild, s = i.view, c = i.viewFrom, u = 0; u < s.length; u++) {
                        var f = s[u];
                        if (f.hidden);
                        else if (f.node && f.node.parentNode == a) {
                            for (; l != f.node;) l = r(l);
                            var h = o && null != t && c >= t && f.lineNumber;
                            f.changes && (Pi(f.changes, "gutter") > -1 && (h = !1), D(e, f, c, n)), h && (Ui(f.lineNumber), f.lineNumber.appendChild(document.createTextNode(S(e.options, c)))), l = f.node.nextSibling
                        } else {
                            var d = U(e, f, c, n);
                            a.insertBefore(d, l)
                        }
                        c += f.size
                    }
                    for (; l;) l = r(l)
                }

                function D(e, t, n, r) {
                    for (var i = 0; i < t.changes.length; i++) {
                        var o = t.changes[i];
                        "text" == o ? _(e, t) : "gutter" == o ? z(e, t, n, r) : "class" == o ? F(t) : "widget" == o && j(e, t, r)
                    }
                    t.changes = null
                }

                function H(e) {
                    return e.node == e.text && (e.node = ji("div", null, null, "position: relative"), e.text.parentNode && e.text.parentNode.replaceChild(e.node, e.text), e.node.appendChild(e.text), xo && 8 > bo && (e.node.style.zIndex = 2)), e.node
                }

                function W(e) {
                    var t = e.bgClass ? e.bgClass + " " + (e.line.bgClass || "") : e.line.bgClass;
                    if (t && (t += " CodeMirror-linebackground"), e.background) t ? e.background.className = t : (e.background.parentNode.removeChild(e.background), e.background = null);
                    else if (t) {
                        var n = H(e);
                        e.background = n.insertBefore(ji("div", null, t), n.firstChild)
                    }
                }

                function B(e, t) {
                    var n = e.display.externalMeasured;
                    return n && n.line == t.line ? (e.display.externalMeasured = null, t.measure = n.measure, n.built) : Br(e, t)
                }

                function _(e, t) {
                    var n = t.text.className,
                        r = B(e, t);
                    t.text == t.node && (t.node = r.pre), t.text.parentNode.replaceChild(r.pre, t.text), t.text = r.pre, r.bgClass != t.bgClass || r.textClass != t.textClass ? (t.bgClass = r.bgClass, t.textClass = r.textClass, F(t)) : n && (t.text.className = n)
                }

                function F(e) {
                    W(e), e.line.wrapClass ? H(e).className = e.line.wrapClass : e.node != e.text && (e.node.className = "");
                    var t = e.textClass ? e.textClass + " " + (e.line.textClass || "") : e.line.textClass;
                    e.text.className = t || ""
                }

                function z(e, t, n, r) {
                    if (t.gutter && (t.node.removeChild(t.gutter), t.gutter = null), t.gutterBackground && (t.node.removeChild(t.gutterBackground), t.gutterBackground = null), t.line.gutterClass) {
                        var i = H(t);
                        t.gutterBackground = ji("div", null, "CodeMirror-gutter-background " + t.line.gutterClass, "left: " + (e.options.fixedGutter ? r.fixedPos : -r.gutterTotalWidth) + "px; width: " + r.gutterTotalWidth + "px"), i.insertBefore(t.gutterBackground, t.text)
                    }
                    var o = t.line.gutterMarkers;
                    if (e.options.lineNumbers || o) {
                        var i = H(t),
                            a = t.gutter = ji("div", null, "CodeMirror-gutter-wrapper", "left: " + (e.options.fixedGutter ? r.fixedPos : -r.gutterTotalWidth) + "px");
                        if (e.display.input.setUneditable(a), i.insertBefore(a, t.text), t.line.gutterClass && (a.className += " " + t.line.gutterClass), !e.options.lineNumbers || o && o["CodeMirror-linenumbers"] || (t.lineNumber = a.appendChild(ji("div", S(e.options, n), "CodeMirror-linenumber CodeMirror-gutter-elt", "left: " + r.gutterLeft["CodeMirror-linenumbers"] + "px; width: " + e.display.lineNumInnerWidth + "px"))), o)
                            for (var l = 0; l < e.options.gutters.length; ++l) {
                                var s = e.options.gutters[l],
                                    c = o.hasOwnProperty(s) && o[s];
                                c && a.appendChild(ji("div", [c], "CodeMirror-gutter-elt", "left: " + r.gutterLeft[s] + "px; width: " + r.gutterWidth[s] + "px"))
                            }
                    }
                }

                function j(e, t, n) {
                    t.alignable && (t.alignable = null);
                    for (var r, i = t.node.firstChild; i; i = r) {
                        var r = i.nextSibling;
                        "CodeMirror-linewidget" == i.className && t.node.removeChild(i)
                    }
                    q(e, t, n)
                }

                function U(e, t, n, r) {
                    var i = B(e, t);
                    return t.text = t.node = i.pre, i.bgClass && (t.bgClass = i.bgClass), i.textClass && (t.textClass = i.textClass), F(t), z(e, t, n, r), q(e, t, r), t.node
                }

                function q(e, t, n) {
                    if (G(e, t.line, t, n, !0), t.rest)
                        for (var r = 0; r < t.rest.length; r++) G(e, t.rest[r], t, n, !1)
                }

                function G(e, t, n, r, i) {
                    if (t.widgets)
                        for (var o = H(n), a = 0, l = t.widgets; a < l.length; ++a) {
                            var s = l[a],
                                c = ji("div", [s.node], "CodeMirror-linewidget");
                            s.handleMouseEvents || c.setAttribute("cm-ignore-events", "true"), Y(s, c, n, r), e.display.input.setUneditable(c), i && s.above ? o.insertBefore(c, n.gutter || n.text) : o.appendChild(c), Ci(s, "redraw")
                        }
                }

                function Y(e, t, n, r) {
                    if (e.noHScroll) {
                        (n.alignable || (n.alignable = [])).push(t);
                        var i = r.wrapperWidth;
                        t.style.left = r.fixedPos + "px", e.coverGutter || (i -= r.gutterTotalWidth, t.style.paddingLeft = r.gutterTotalWidth + "px"), t.style.width = i + "px"
                    }
                    e.coverGutter && (t.style.zIndex = 5, t.style.position = "relative", e.noHScroll || (t.style.marginLeft = -r.gutterTotalWidth + "px"))
                }

                function $(e) {
                    return Bo(e.line, e.ch)
                }

                function V(e, t) {
                    return _o(e, t) < 0 ? t : e
                }

                function K(e, t) {
                    return _o(e, t) < 0 ? e : t
                }

                function X(e) {
                    e.state.focused || (e.display.input.focus(), vn(e))
                }

                function Z(e, t, n, r, i) {
                    var o = e.doc;
                    e.display.shift = !1, r || (r = o.sel);
                    var a = e.state.pasteIncoming || "paste" == i,
                        l = o.splitLines(t),
                        s = null;
                    if (a && r.ranges.length > 1)
                        if (Fo && Fo.text.join("\n") == t) {
                            if (r.ranges.length % Fo.text.length == 0) {
                                s = [];
                                for (var c = 0; c < Fo.text.length; c++) s.push(o.splitLines(Fo.text[c]))
                            }
                        } else l.length == r.ranges.length && (s = Ri(l, function(e) {
                            return [e]
                        }));
                    for (var c = r.ranges.length - 1; c >= 0; c--) {
                        var u = r.ranges[c],
                            f = u.from(),
                            h = u.to();
                        u.empty() && (n && n > 0 ? f = Bo(f.line, f.ch - n) : e.state.overwrite && !a ? h = Bo(h.line, Math.min(Zr(o, h.line).text.length, h.ch + Ii(l).length)) : Fo && Fo.lineWise && Fo.text.join("\n") == t && (f = h = Bo(f.line, 0)));
                        var d = e.curOp.updateInput,
                            p = {
                                from: f,
                                to: h,
                                text: s ? s[c % s.length] : l,
                                origin: i || (a ? "paste" : e.state.cutIncoming ? "cut" : "+input")
                            };
                        Tn(e.doc, p), Ci(e, "inputRead", e, p)
                    }
                    t && !a && Q(e, t), Bn(e), e.curOp.updateInput = d, e.curOp.typing = !0, e.state.pasteIncoming = e.state.cutIncoming = !1
                }

                function J(e, t) {
                    var n = e.clipboardData && e.clipboardData.getData("text/plain");
                    return n ? (e.preventDefault(), t.isReadOnly() || t.options.disableInput || At(t, function() {
                        Z(t, n, 0, null, "paste")
                    }), !0) : void 0
                }

                function Q(e, t) {
                    if (e.options.electricChars && e.options.smartIndent)
                        for (var n = e.doc.sel, r = n.ranges.length - 1; r >= 0; r--) {
                            var i = n.ranges[r];
                            if (!(i.head.ch > 100 || r && n.ranges[r - 1].head.line == i.head.line)) {
                                var o = e.getModeAt(i.head),
                                    a = !1;
                                if (o.electricChars) {
                                    for (var l = 0; l < o.electricChars.length; l++)
                                        if (t.indexOf(o.electricChars.charAt(l)) > -1) {
                                            a = Fn(e, i.head.line, "smart");
                                            break
                                        }
                                } else o.electricInput && o.electricInput.test(Zr(e.doc, i.head.line).text.slice(0, i.head.ch)) && (a = Fn(e, i.head.line, "smart"));
                                a && Ci(e, "electricInput", e, i.head.line)
                            }
                        }
                }

                function ee(e) {
                    for (var t = [], n = [], r = 0; r < e.doc.sel.ranges.length; r++) {
                        var i = e.doc.sel.ranges[r].head.line,
                            o = {
                                anchor: Bo(i, 0),
                                head: Bo(i + 1, 0)
                            };
                        n.push(o), t.push(e.getRange(o.anchor, o.head))
                    }
                    return {
                        text: t,
                        ranges: n
                    }
                }

                function te(e) {
                    e.setAttribute("autocorrect", "off"), e.setAttribute("autocapitalize", "off"), e.setAttribute("spellcheck", "false")
                }

                function ne(e) {
                    this.cm = e, this.prevInput = "", this.pollingFast = !1, this.polling = new Ei, this.inaccurateSelection = !1, this.hasSelection = !1, this.composing = null
                }

                function re() {
                    var e = ji("textarea", null, null, "position: absolute; padding: 0; width: 1px; height: 1em; outline: none"),
                        t = ji("div", [e], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");
                    return wo ? e.style.width = "1000px" : e.setAttribute("wrap", "off"), No && (e.style.border = "1px solid black"), te(e), t
                }

                function ie(e) {
                    this.cm = e, this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null, this.polling = new Ei, this.gracePeriod = !1
                }

                function oe(e, t) {
                    var n = Qe(e, t.line);
                    if (!n || n.hidden) return null;
                    var r = Zr(e.doc, t.line),
                        i = Xe(n, r, t.line),
                        o = ii(r),
                        a = "left";
                    if (o) {
                        var l = co(o, t.ch);
                        a = l % 2 ? "right" : "left"
                    }
                    var s = nt(i.map, t.ch, a);
                    return s.offset = "right" == s.collapse ? s.end : s.start, s
                }

                function ae(e, t) {
                    return t && (e.bad = !0), e
                }

                function le(e, t, n) {
                    var r;
                    if (t == e.display.lineDiv) {
                        if (r = e.display.lineDiv.childNodes[n], !r) return ae(e.clipPos(Bo(e.display.viewTo - 1)), !0);
                        t = null, n = 0
                    } else
                        for (r = t;; r = r.parentNode) {
                            if (!r || r == e.display.lineDiv) return null;
                            if (r.parentNode && r.parentNode == e.display.lineDiv) break
                        }
                    for (var i = 0; i < e.display.view.length; i++) {
                        var o = e.display.view[i];
                        if (o.node == r) return se(o, t, n)
                    }
                }

                function se(e, t, n) {
                    function r(t, n, r) {
                        for (var i = -1; i < (u ? u.length : 0); i++)
                            for (var o = 0 > i ? c.map : u[i], a = 0; a < o.length; a += 3) {
                                var l = o[a + 2];
                                if (l == t || l == n) {
                                    var s = ti(0 > i ? e.line : e.rest[i]),
                                        f = o[a] + r;
                                    return (0 > r || l != t) && (f = o[a + (r ? 1 : 0)]), Bo(s, f)
                                }
                            }
                    }
                    var i = e.text.firstChild,
                        o = !1;
                    if (!t || !Va(i, t)) return ae(Bo(ti(e.line), 0), !0);
                    if (t == i && (o = !0, t = i.childNodes[n], n = 0, !t)) {
                        var a = e.rest ? Ii(e.rest) : e.line;
                        return ae(Bo(ti(a), a.text.length), o)
                    }
                    var l = 3 == t.nodeType ? t : null,
                        s = t;
                    for (l || 1 != t.childNodes.length || 3 != t.firstChild.nodeType || (l = t.firstChild, n && (n = l.nodeValue.length)); s.parentNode != i;) s = s.parentNode;
                    var c = e.measure,
                        u = c.maps,
                        f = r(l, s, n);
                    if (f) return ae(f, o);
                    for (var h = s.nextSibling, d = l ? l.nodeValue.length - n : 0; h; h = h.nextSibling) {
                        if (f = r(h, h.firstChild, 0)) return ae(Bo(f.line, f.ch - d), o);
                        d += h.textContent.length
                    }
                    for (var p = s.previousSibling, d = n; p; p = p.previousSibling) {
                        if (f = r(p, p.firstChild, -1)) return ae(Bo(f.line, f.ch + d), o);
                        d += h.textContent.length
                    }
                }

                function ce(e, t, n, r, i) {
                    function o(e) {
                        return function(t) {
                            return t.id == e
                        }
                    }

                    function a(t) {
                        if (1 == t.nodeType) {
                            var n = t.getAttribute("cm-text");
                            if (null != n) return "" == n && (n = t.textContent.replace(/\u200b/g, "")), void(l += n);
                            var u, f = t.getAttribute("cm-marker");
                            if (f) {
                                var h = e.findMarks(Bo(r, 0), Bo(i + 1, 0), o(+f));
                                return void(h.length && (u = h[0].find()) && (l += Jr(e.doc, u.from, u.to).join(c)))
                            }
                            if ("false" == t.getAttribute("contenteditable")) return;
                            for (var d = 0; d < t.childNodes.length; d++) a(t.childNodes[d]);
                            /^(pre|div|p)$/i.test(t.nodeName) && (s = !0)
                        } else if (3 == t.nodeType) {
                            var p = t.nodeValue;
                            if (!p) return;
                            s && (l += c, s = !1), l += p
                        }
                    }
                    for (var l = "", s = !1, c = e.doc.lineSeparator(); a(t), t != n;) t = t.nextSibling;
                    return l
                }

                function ue(e, t) {
                    this.ranges = e, this.primIndex = t
                }

                function fe(e, t) {
                    this.anchor = e, this.head = t
                }

                function he(e, t) {
                    var n = e[t];
                    e.sort(function(e, t) {
                        return _o(e.from(), t.from())
                    }), t = Pi(e, n);
                    for (var r = 1; r < e.length; r++) {
                        var i = e[r],
                            o = e[r - 1];
                        if (_o(o.to(), i.from()) >= 0) {
                            var a = K(o.from(), i.from()),
                                l = V(o.to(), i.to()),
                                s = o.empty() ? i.from() == i.head : o.from() == o.head;
                            t >= r && --t, e.splice(--r, 2, new fe(s ? l : a, s ? a : l))
                        }
                    }
                    return new ue(e, t)
                }

                function de(e, t) {
                    return new ue([new fe(e, t || e)], 0)
                }

                function pe(e, t) {
                    return Math.max(e.first, Math.min(t, e.first + e.size - 1))
                }

                function me(e, t) {
                    if (t.line < e.first) return Bo(e.first, 0);
                    var n = e.first + e.size - 1;
                    return t.line > n ? Bo(n, Zr(e, n).text.length) : ge(t, Zr(e, t.line).text.length)
                }

                function ge(e, t) {
                    var n = e.ch;
                    return null == n || n > t ? Bo(e.line, t) : 0 > n ? Bo(e.line, 0) : e
                }

                function ve(e, t) {
                    return t >= e.first && t < e.first + e.size
                }

                function ye(e, t) {
                    for (var n = [], r = 0; r < t.length; r++) n[r] = me(e, t[r]);
                    return n
                }

                function xe(e, t, n, r) {
                    if (e.cm && e.cm.display.shift || e.extend) {
                        var i = t.anchor;
                        if (r) {
                            var o = _o(n, i) < 0;
                            o != _o(r, i) < 0 ? (i = n, n = r) : o != _o(n, r) < 0 && (n = r)
                        }
                        return new fe(i, n)
                    }
                    return new fe(r || n, n)
                }

                function be(e, t, n, r) {
                    Te(e, new ue([xe(e, e.sel.primary(), t, n)], 0), r)
                }

                function we(e, t, n) {
                    for (var r = [], i = 0; i < e.sel.ranges.length; i++) r[i] = xe(e, e.sel.ranges[i], t[i], null);
                    var o = he(r, e.sel.primIndex);
                    Te(e, o, n)
                }

                function ke(e, t, n, r) {
                    var i = e.sel.ranges.slice(0);
                    i[t] = n, Te(e, he(i, e.sel.primIndex), r)
                }

                function Se(e, t, n, r) {
                    Te(e, de(t, n), r)
                }

                function Ce(e, t, n) {
                    var r = {
                        ranges: t.ranges,
                        update: function(t) {
                            this.ranges = [];
                            for (var n = 0; n < t.length; n++) this.ranges[n] = new fe(me(e, t[n].anchor), me(e, t[n].head))
                        },
                        origin: n && n.origin
                    };
                    return Pa(e, "beforeSelectionChange", e, r), e.cm && Pa(e.cm, "beforeSelectionChange", e.cm, r), r.ranges != t.ranges ? he(r.ranges, r.ranges.length - 1) : t
                }

                function Le(e, t, n) {
                    var r = e.history.done,
                        i = Ii(r);
                    i && i.ranges ? (r[r.length - 1] = t, Me(e, t, n)) : Te(e, t, n)
                }

                function Te(e, t, n) {
                    Me(e, t, n), fi(e, e.sel, e.cm ? e.cm.curOp.id : NaN, n)
                }

                function Me(e, t, n) {
                    (Ni(e, "beforeSelectionChange") || e.cm && Ni(e.cm, "beforeSelectionChange")) && (t = Ce(e, t, n));
                    var r = n && n.bias || (_o(t.primary().head, e.sel.primary().head) < 0 ? -1 : 1);
                    Ne(e, Ee(e, t, r, !0)), n && n.scroll === !1 || !e.cm || Bn(e.cm)
                }

                function Ne(e, t) {
                    t.equals(e.sel) || (e.sel = t, e.cm && (e.cm.curOp.updateInput = e.cm.curOp.selectionChanged = !0, Mi(e.cm)), Ci(e, "cursorActivity", e))
                }

                function Ae(e) {
                    Ne(e, Ee(e, e.sel, null, !1), Wa)
                }

                function Ee(e, t, n, r) {
                    for (var i, o = 0; o < t.ranges.length; o++) {
                        var a = t.ranges[o],
                            l = t.ranges.length == e.sel.ranges.length && e.sel.ranges[o],
                            s = Ie(e, a.anchor, l && l.anchor, n, r),
                            c = Ie(e, a.head, l && l.head, n, r);
                        (i || s != a.anchor || c != a.head) && (i || (i = t.ranges.slice(0, o)), i[o] = new fe(s, c))
                    }
                    return i ? he(i, t.primIndex) : t
                }

                function Oe(e, t, n, r, i) {
                    var o = Zr(e, t.line);
                    if (o.markedSpans)
                        for (var a = 0; a < o.markedSpans.length; ++a) {
                            var l = o.markedSpans[a],
                                s = l.marker;
                            if ((null == l.from || (s.inclusiveLeft ? l.from <= t.ch : l.from < t.ch)) && (null == l.to || (s.inclusiveRight ? l.to >= t.ch : l.to > t.ch))) {
                                if (i && (Pa(s, "beforeCursorEnter"), s.explicitlyCleared)) {
                                    if (o.markedSpans) {
                                        --a;
                                        continue
                                    }
                                    break
                                }
                                if (!s.atomic) continue;
                                if (n) {
                                    var c, u = s.find(0 > r ? 1 : -1);
                                    if ((0 > r ? s.inclusiveRight : s.inclusiveLeft) && (u = Pe(e, u, -r, u && u.line == t.line ? o : null)), u && u.line == t.line && (c = _o(u, n)) && (0 > r ? 0 > c : c > 0)) return Oe(e, u, t, r, i)
                                }
                                var f = s.find(0 > r ? -1 : 1);
                                return (0 > r ? s.inclusiveLeft : s.inclusiveRight) && (f = Pe(e, f, r, f.line == t.line ? o : null)), f ? Oe(e, f, t, r, i) : null
                            }
                        }
                    return t
                }

                function Ie(e, t, n, r, i) {
                    var o = r || 1,
                        a = Oe(e, t, n, o, i) || !i && Oe(e, t, n, o, !0) || Oe(e, t, n, -o, i) || !i && Oe(e, t, n, -o, !0);
                    return a ? a : (e.cantEdit = !0, Bo(e.first, 0))
                }

                function Pe(e, t, n, r) {
                    return 0 > n && 0 == t.ch ? t.line > e.first ? me(e, Bo(t.line - 1)) : null : n > 0 && t.ch == (r || Zr(e, t.line)).text.length ? t.line < e.first + e.size - 1 ? Bo(t.line + 1, 0) : null : new Bo(t.line, t.ch + n)
                }

                function Re(e) {
                    e.display.input.showSelection(e.display.input.prepareSelection())
                }

                function De(e, t) {
                    for (var n = e.doc, r = {}, i = r.cursors = document.createDocumentFragment(), o = r.selection = document.createDocumentFragment(), a = 0; a < n.sel.ranges.length; a++)
                        if (t !== !1 || a != n.sel.primIndex) {
                            var l = n.sel.ranges[a];
                            if (!(l.from().line >= e.display.viewTo || l.to().line < e.display.viewFrom)) {
                                var s = l.empty();
                                (s || e.options.showCursorWhenSelecting) && He(e, l.head, i), s || We(e, l, o)
                            }
                        }
                    return r
                }

                function He(e, t, n) {
                    var r = dt(e, t, "div", null, null, !e.options.singleCursorHeightPerLine),
                        i = n.appendChild(ji("div", " ", "CodeMirror-cursor"));
                    if (i.style.left = r.left + "px", i.style.top = r.top + "px", i.style.height = Math.max(0, r.bottom - r.top) * e.options.cursorHeight + "px", r.other) {
                        var o = n.appendChild(ji("div", " ", "CodeMirror-cursor CodeMirror-secondarycursor"));
                        o.style.display = "", o.style.left = r.other.left + "px", o.style.top = r.other.top + "px", o.style.height = .85 * (r.other.bottom - r.other.top) + "px"
                    }
                }

                function We(e, t, n) {
                    function r(e, t, n, r) {
                        0 > t && (t = 0), t = Math.round(t), r = Math.round(r), l.appendChild(ji("div", null, "CodeMirror-selected", "position: absolute; left: " + e + "px; top: " + t + "px; width: " + (null == n ? u - e : n) + "px; height: " + (r - t) + "px"))
                    }

                    function i(t, n, i) {
                        function o(n, r) {
                            return ht(e, Bo(t, n), "div", f, r)
                        }
                        var l, s, f = Zr(a, t),
                            h = f.text.length;
                        return eo(ii(f), n || 0, null == i ? h : i, function(e, t, a) {
                            var f, d, p, m = o(e, "left");
                            if (e == t) f = m, d = p = m.left;
                            else {
                                if (f = o(t - 1, "right"), "rtl" == a) {
                                    var g = m;
                                    m = f, f = g
                                }
                                d = m.left, p = f.right
                            }
                            null == n && 0 == e && (d = c), f.top - m.top > 3 && (r(d, m.top, null, m.bottom), d = c, m.bottom < f.top && r(d, m.bottom, null, f.top)), null == i && t == h && (p = u), (!l || m.top < l.top || m.top == l.top && m.left < l.left) && (l = m), (!s || f.bottom > s.bottom || f.bottom == s.bottom && f.right > s.right) && (s = f), c + 1 > d && (d = c), r(d, f.top, p - d, f.bottom)
                        }), {
                            start: l,
                            end: s
                        }
                    }
                    var o = e.display,
                        a = e.doc,
                        l = document.createDocumentFragment(),
                        s = Ge(e.display),
                        c = s.left,
                        u = Math.max(o.sizerWidth, $e(e) - o.sizer.offsetLeft) - s.right,
                        f = t.from(),
                        h = t.to();
                    if (f.line == h.line) i(f.line, f.ch, h.ch);
                    else {
                        var d = Zr(a, f.line),
                            p = Zr(a, h.line),
                            m = yr(d) == yr(p),
                            g = i(f.line, f.ch, m ? d.text.length + 1 : null).end,
                            v = i(h.line, m ? 0 : null, h.ch).start;
                        m && (g.top < v.top - 2 ? (r(g.right, g.top, null, g.bottom), r(c, v.top, v.left, v.bottom)) : r(g.right, g.top, v.left - g.right, g.bottom)), g.bottom < v.top && r(c, g.bottom, null, v.top)
                    }
                    n.appendChild(l)
                }

                function Be(e) {
                    if (e.state.focused) {
                        var t = e.display;
                        clearInterval(t.blinker);
                        var n = !0;
                        t.cursorDiv.style.visibility = "", e.options.cursorBlinkRate > 0 ? t.blinker = setInterval(function() {
                            t.cursorDiv.style.visibility = (n = !n) ? "" : "hidden"
                        }, e.options.cursorBlinkRate) : e.options.cursorBlinkRate < 0 && (t.cursorDiv.style.visibility = "hidden")
                    }
                }

                function _e(e, t) {
                    e.doc.mode.startState && e.doc.frontier < e.display.viewTo && e.state.highlight.set(t, Bi(Fe, e))
                }

                function Fe(e) {
                    var t = e.doc;
                    if (t.frontier < t.first && (t.frontier = t.first), !(t.frontier >= e.display.viewTo)) {
                        var n = +new Date + e.options.workTime,
                            r = sa(t.mode, je(e, t.frontier)),
                            i = [];
                        t.iter(t.frontier, Math.min(t.first + t.size, e.display.viewTo + 500), function(o) {
                            if (t.frontier >= e.display.viewFrom) {
                                var a = o.styles,
                                    l = o.text.length > e.options.maxHighlightLength,
                                    s = Rr(e, o, l ? sa(t.mode, r) : r, !0);
                                o.styles = s.styles;
                                var c = o.styleClasses,
                                    u = s.classes;
                                u ? o.styleClasses = u : c && (o.styleClasses = null);
                                for (var f = !a || a.length != o.styles.length || c != u && (!c || !u || c.bgClass != u.bgClass || c.textClass != u.textClass), h = 0; !f && h < a.length; ++h) f = a[h] != o.styles[h];
                                f && i.push(t.frontier), o.stateAfter = l ? r : sa(t.mode, r)
                            } else o.text.length <= e.options.maxHighlightLength && Hr(e, o.text, r), o.stateAfter = t.frontier % 5 == 0 ? sa(t.mode, r) : null;
                            return ++t.frontier, +new Date > n ? (_e(e, e.options.workDelay), !0) : void 0
                        }), i.length && At(e, function() {
                            for (var t = 0; t < i.length; t++) Ht(e, i[t], "text")
                        })
                    }
                }

                function ze(e, t, n) {
                    for (var r, i, o = e.doc, a = n ? -1 : t - (e.doc.mode.innerMode ? 1e3 : 100), l = t; l > a; --l) {
                        if (l <= o.first) return o.first;
                        var s = Zr(o, l - 1);
                        if (s.stateAfter && (!n || l <= o.frontier)) return l;
                        var c = Fa(s.text, null, e.options.tabSize);
                        (null == i || r > c) && (i = l - 1, r = c)
                    }
                    return i
                }

                function je(e, t, n) {
                    var r = e.doc,
                        i = e.display;
                    if (!r.mode.startState) return !0;
                    var o = ze(e, t, n),
                        a = o > r.first && Zr(r, o - 1).stateAfter;
                    return a = a ? sa(r.mode, a) : ca(r.mode), r.iter(o, t, function(n) {
                        Hr(e, n.text, a);
                        var l = o == t - 1 || o % 5 == 0 || o >= i.viewFrom && o < i.viewTo;
                        n.stateAfter = l ? sa(r.mode, a) : null, ++o
                    }), n && (r.frontier = o), a
                }

                function Ue(e) {
                    return e.lineSpace.offsetTop
                }

                function qe(e) {
                    return e.mover.offsetHeight - e.lineSpace.offsetHeight
                }

                function Ge(e) {
                    if (e.cachedPaddingH) return e.cachedPaddingH;
                    var t = qi(e.measure, ji("pre", "x")),
                        n = window.getComputedStyle ? window.getComputedStyle(t) : t.currentStyle,
                        r = {
                            left: parseInt(n.paddingLeft),
                            right: parseInt(n.paddingRight)
                        };
                    return isNaN(r.left) || isNaN(r.right) || (e.cachedPaddingH = r), r
                }

                function Ye(e) {
                    return Da - e.display.nativeBarWidth
                }

                function $e(e) {
                    return e.display.scroller.clientWidth - Ye(e) - e.display.barWidth
                }

                function Ve(e) {
                    return e.display.scroller.clientHeight - Ye(e) - e.display.barHeight
                }

                function Ke(e, t, n) {
                    var r = e.options.lineWrapping,
                        i = r && $e(e);
                    if (!t.measure.heights || r && t.measure.width != i) {
                        var o = t.measure.heights = [];
                        if (r) {
                            t.measure.width = i;
                            for (var a = t.text.firstChild.getClientRects(), l = 0; l < a.length - 1; l++) {
                                var s = a[l],
                                    c = a[l + 1];
                                Math.abs(s.bottom - c.bottom) > 2 && o.push((s.bottom + c.top) / 2 - n.top)
                            }
                        }
                        o.push(n.bottom - n.top)
                    }
                }

                function Xe(e, t, n) {
                    if (e.line == t) return {
                        map: e.measure.map,
                        cache: e.measure.cache
                    };
                    for (var r = 0; r < e.rest.length; r++)
                        if (e.rest[r] == t) return {
                            map: e.measure.maps[r],
                            cache: e.measure.caches[r]
                        };
                    for (var r = 0; r < e.rest.length; r++)
                        if (ti(e.rest[r]) > n) return {
                            map: e.measure.maps[r],
                            cache: e.measure.caches[r],
                            before: !0
                        }
                }

                function Ze(e, t) {
                    t = yr(t);
                    var n = ti(t),
                        r = e.display.externalMeasured = new Pt(e.doc, t, n);
                    r.lineN = n;
                    var i = r.built = Br(e, r);
                    return r.text = i.pre, qi(e.display.lineMeasure, i.pre), r
                }

                function Je(e, t, n, r) {
                    return tt(e, et(e, t), n, r)
                }

                function Qe(e, t) {
                    if (t >= e.display.viewFrom && t < e.display.viewTo) return e.display.view[Bt(e, t)];
                    var n = e.display.externalMeasured;
                    return n && t >= n.lineN && t < n.lineN + n.size ? n : void 0
                }

                function et(e, t) {
                    var n = ti(t),
                        r = Qe(e, n);
                    r && !r.text ? r = null : r && r.changes && (D(e, r, n, P(e)), e.curOp.forceUpdate = !0), r || (r = Ze(e, t));
                    var i = Xe(r, t, n);
                    return {
                        line: t,
                        view: r,
                        rect: null,
                        map: i.map,
                        cache: i.cache,
                        before: i.before,
                        hasHeights: !1
                    }
                }

                function tt(e, t, n, r, i) {
                    t.before && (n = -1);
                    var o, a = n + (r || "");
                    return t.cache.hasOwnProperty(a) ? o = t.cache[a] : (t.rect || (t.rect = t.view.text.getBoundingClientRect()), t.hasHeights || (Ke(e, t.view, t.rect), t.hasHeights = !0), o = rt(e, t, n, r), o.bogus || (t.cache[a] = o)), {
                        left: o.left,
                        right: o.right,
                        top: i ? o.rtop : o.top,
                        bottom: i ? o.rbottom : o.bottom
                    }
                }

                function nt(e, t, n) {
                    for (var r, i, o, a, l = 0; l < e.length; l += 3) {
                        var s = e[l],
                            c = e[l + 1];
                        if (s > t ? (i = 0, o = 1, a = "left") : c > t ? (i = t - s, o = i + 1) : (l == e.length - 3 || t == c && e[l + 3] > t) && (o = c - s, i = o - 1, t >= c && (a = "right")), null != i) {
                            if (r = e[l + 2], s == c && n == (r.insertLeft ? "left" : "right") && (a = n), "left" == n && 0 == i)
                                for (; l && e[l - 2] == e[l - 3] && e[l - 1].insertLeft;) r = e[(l -= 3) + 2], a = "left";
                            if ("right" == n && i == c - s)
                                for (; l < e.length - 3 && e[l + 3] == e[l + 4] && !e[l + 5].insertLeft;) r = e[(l += 3) + 2], a = "right";
                            break
                        }
                    }
                    return {
                        node: r,
                        start: i,
                        end: o,
                        collapse: a,
                        coverStart: s,
                        coverEnd: c
                    }
                }

                function rt(e, t, n, r) {
                    var i, o = nt(t.map, n, r),
                        a = o.node,
                        l = o.start,
                        s = o.end,
                        c = o.collapse;
                    if (3 == a.nodeType) {
                        for (var u = 0; 4 > u; u++) {
                            for (; l && zi(t.line.text.charAt(o.coverStart + l));) --l;
                            for (; o.coverStart + s < o.coverEnd && zi(t.line.text.charAt(o.coverStart + s));) ++s;
                            if (xo && 9 > bo && 0 == l && s == o.coverEnd - o.coverStart) i = a.parentNode.getBoundingClientRect();
                            else if (xo && e.options.lineWrapping) {
                                var f = qa(a, l, s).getClientRects();
                                i = f.length ? f["right" == r ? f.length - 1 : 0] : qo
                            } else i = qa(a, l, s).getBoundingClientRect() || qo;
                            if (i.left || i.right || 0 == l) break;
                            s = l, l -= 1, c = "right"
                        }
                        xo && 11 > bo && (i = it(e.display.measure, i))
                    } else {
                        l > 0 && (c = r = "right");
                        var f;
                        i = e.options.lineWrapping && (f = a.getClientRects()).length > 1 ? f["right" == r ? f.length - 1 : 0] : a.getBoundingClientRect()
                    }
                    if (xo && 9 > bo && !l && (!i || !i.left && !i.right)) {
                        var h = a.parentNode.getClientRects()[0];
                        i = h ? {
                            left: h.left,
                            right: h.left + xt(e.display),
                            top: h.top,
                            bottom: h.bottom
                        } : qo
                    }
                    for (var d = i.top - t.rect.top, p = i.bottom - t.rect.top, m = (d + p) / 2, g = t.view.measure.heights, u = 0; u < g.length - 1 && !(m < g[u]); u++);
                    var v = u ? g[u - 1] : 0,
                        y = g[u],
                        x = {
                            left: ("right" == c ? i.right : i.left) - t.rect.left,
                            right: ("left" == c ? i.left : i.right) - t.rect.left,
                            top: v,
                            bottom: y
                        };
                    return i.left || i.right || (x.bogus = !0), e.options.singleCursorHeightPerLine || (x.rtop = d, x.rbottom = p), x
                }

                function it(e, t) {
                    if (!window.screen || null == screen.logicalXDPI || screen.logicalXDPI == screen.deviceXDPI || !Qi(e)) return t;
                    var n = screen.logicalXDPI / screen.deviceXDPI,
                        r = screen.logicalYDPI / screen.deviceYDPI;
                    return {
                        left: t.left * n,
                        right: t.right * n,
                        top: t.top * r,
                        bottom: t.bottom * r
                    }
                }

                function ot(e) {
                    if (e.measure && (e.measure.cache = {}, e.measure.heights = null, e.rest))
                        for (var t = 0; t < e.rest.length; t++) e.measure.caches[t] = {}
                }

                function at(e) {
                    e.display.externalMeasure = null, Ui(e.display.lineMeasure);
                    for (var t = 0; t < e.display.view.length; t++) ot(e.display.view[t])
                }

                function lt(e) {
                    at(e), e.display.cachedCharWidth = e.display.cachedTextHeight = e.display.cachedPaddingH = null, e.options.lineWrapping || (e.display.maxLineChanged = !0), e.display.lineNumChars = null
                }

                function st() {
                    return window.pageXOffset || (document.documentElement || document.body).scrollLeft
                }

                function ct() {
                    return window.pageYOffset || (document.documentElement || document.body).scrollTop
                }

                function ut(e, t, n, r) {
                    if (t.widgets)
                        for (var i = 0; i < t.widgets.length; ++i)
                            if (t.widgets[i].above) {
                                var o = Lr(t.widgets[i]);
                                n.top += o, n.bottom += o
                            }
                    if ("line" == r) return n;
                    r || (r = "local");
                    var a = ri(t);
                    if ("local" == r ? a += Ue(e.display) : a -= e.display.viewOffset, "page" == r || "window" == r) {
                        var l = e.display.lineSpace.getBoundingClientRect();
                        a += l.top + ("window" == r ? 0 : ct());
                        var s = l.left + ("window" == r ? 0 : st());
                        n.left += s, n.right += s
                    }
                    return n.top += a, n.bottom += a, n
                }

                function ft(e, t, n) {
                    if ("div" == n) return t;
                    var r = t.left,
                        i = t.top;
                    if ("page" == n) r -= st(),
                        i -= ct();
                    else if ("local" == n || !n) {
                        var o = e.display.sizer.getBoundingClientRect();
                        r += o.left, i += o.top
                    }
                    var a = e.display.lineSpace.getBoundingClientRect();
                    return {
                        left: r - a.left,
                        top: i - a.top
                    }
                }

                function ht(e, t, n, r, i) {
                    return r || (r = Zr(e.doc, t.line)), ut(e, r, Je(e, r, t.ch, i), n)
                }

                function dt(e, t, n, r, i, o) {
                    function a(t, a) {
                        var l = tt(e, i, t, a ? "right" : "left", o);
                        return a ? l.left = l.right : l.right = l.left, ut(e, r, l, n)
                    }

                    function l(e, t) {
                        var n = s[t],
                            r = n.level % 2;
                        return e == to(n) && t && n.level < s[t - 1].level ? (n = s[--t], e = no(n) - (n.level % 2 ? 0 : 1), r = !0) : e == no(n) && t < s.length - 1 && n.level < s[t + 1].level && (n = s[++t], e = to(n) - n.level % 2, r = !1), r && e == n.to && e > n.from ? a(e - 1) : a(e, r)
                    }
                    r = r || Zr(e.doc, t.line), i || (i = et(e, r));
                    var s = ii(r),
                        c = t.ch;
                    if (!s) return a(c);
                    var u = co(s, c),
                        f = l(c, u);
                    return null != al && (f.other = l(c, al)), f
                }

                function pt(e, t) {
                    var n = 0,
                        t = me(e.doc, t);
                    e.options.lineWrapping || (n = xt(e.display) * t.ch);
                    var r = Zr(e.doc, t.line),
                        i = ri(r) + Ue(e.display);
                    return {
                        left: n,
                        right: n,
                        top: i,
                        bottom: i + r.height
                    }
                }

                function mt(e, t, n, r) {
                    var i = Bo(e, t);
                    return i.xRel = r, n && (i.outside = !0), i
                }

                function gt(e, t, n) {
                    var r = e.doc;
                    if (n += e.display.viewOffset, 0 > n) return mt(r.first, 0, !0, -1);
                    var i = ni(r, n),
                        o = r.first + r.size - 1;
                    if (i > o) return mt(r.first + r.size - 1, Zr(r, o).text.length, !0, 1);
                    0 > t && (t = 0);
                    for (var a = Zr(r, i);;) {
                        var l = vt(e, a, i, t, n),
                            s = gr(a),
                            c = s && s.find(0, !0);
                        if (!s || !(l.ch > c.from.ch || l.ch == c.from.ch && l.xRel > 0)) return l;
                        i = ti(a = c.to.line)
                    }
                }

                function vt(e, t, n, r, i) {
                    function o(r) {
                        var i = dt(e, Bo(n, r), "line", t, c);
                        return l = !0, a > i.bottom ? i.left - s : a < i.top ? i.left + s : (l = !1, i.left)
                    }
                    var a = i - ri(t),
                        l = !1,
                        s = 2 * e.display.wrapper.clientWidth,
                        c = et(e, t),
                        u = ii(t),
                        f = t.text.length,
                        h = ro(t),
                        d = io(t),
                        p = o(h),
                        m = l,
                        g = o(d),
                        v = l;
                    if (r > g) return mt(n, d, v, 1);
                    for (;;) {
                        if (u ? d == h || d == fo(t, h, 1) : 1 >= d - h) {
                            for (var y = p > r || g - r >= r - p ? h : d, x = r - (y == h ? p : g); zi(t.text.charAt(y));) ++y;
                            var b = mt(n, y, y == h ? m : v, -1 > x ? -1 : x > 1 ? 1 : 0);
                            return b
                        }
                        var w = Math.ceil(f / 2),
                            k = h + w;
                        if (u) {
                            k = h;
                            for (var S = 0; w > S; ++S) k = fo(t, k, 1)
                        }
                        var C = o(k);
                        C > r ? (d = k, g = C, (v = l) && (g += 1e3), f = w) : (h = k, p = C, m = l, f -= w)
                    }
                }

                function yt(e) {
                    if (null != e.cachedTextHeight) return e.cachedTextHeight;
                    if (null == zo) {
                        zo = ji("pre");
                        for (var t = 0; 49 > t; ++t) zo.appendChild(document.createTextNode("x")), zo.appendChild(ji("br"));
                        zo.appendChild(document.createTextNode("x"))
                    }
                    qi(e.measure, zo);
                    var n = zo.offsetHeight / 50;
                    return n > 3 && (e.cachedTextHeight = n), Ui(e.measure), n || 1
                }

                function xt(e) {
                    if (null != e.cachedCharWidth) return e.cachedCharWidth;
                    var t = ji("span", "xxxxxxxxxx"),
                        n = ji("pre", [t]);
                    qi(e.measure, n);
                    var r = t.getBoundingClientRect(),
                        i = (r.right - r.left) / 10;
                    return i > 2 && (e.cachedCharWidth = i), i || 10
                }

                function bt(e) {
                    e.curOp = {
                        cm: e,
                        viewChanged: !1,
                        startHeight: e.doc.height,
                        forceUpdate: !1,
                        updateInput: null,
                        typing: !1,
                        changeObjs: null,
                        cursorActivityHandlers: null,
                        cursorActivityCalled: 0,
                        selectionChanged: !1,
                        updateMaxLine: !1,
                        scrollLeft: null,
                        scrollTop: null,
                        scrollToPos: null,
                        focus: !1,
                        id: ++Yo
                    }, Go ? Go.ops.push(e.curOp) : e.curOp.ownsGroup = Go = {
                        ops: [e.curOp],
                        delayedCallbacks: []
                    }
                }

                function wt(e) {
                    var t = e.delayedCallbacks,
                        n = 0;
                    do {
                        for (; n < t.length; n++) t[n].call(null);
                        for (var r = 0; r < e.ops.length; r++) {
                            var i = e.ops[r];
                            if (i.cursorActivityHandlers)
                                for (; i.cursorActivityCalled < i.cursorActivityHandlers.length;) i.cursorActivityHandlers[i.cursorActivityCalled++].call(null, i.cm)
                        }
                    } while (n < t.length)
                }

                function kt(e) {
                    var t = e.curOp,
                        n = t.ownsGroup;
                    if (n) try {
                        wt(n)
                    } finally {
                        Go = null;
                        for (var r = 0; r < n.ops.length; r++) n.ops[r].cm.curOp = null;
                        St(n)
                    }
                }

                function St(e) {
                    for (var t = e.ops, n = 0; n < t.length; n++) Ct(t[n]);
                    for (var n = 0; n < t.length; n++) Lt(t[n]);
                    for (var n = 0; n < t.length; n++) Tt(t[n]);
                    for (var n = 0; n < t.length; n++) Mt(t[n]);
                    for (var n = 0; n < t.length; n++) Nt(t[n])
                }

                function Ct(e) {
                    var t = e.cm,
                        n = t.display;
                    T(t), e.updateMaxLine && h(t), e.mustUpdate = e.viewChanged || e.forceUpdate || null != e.scrollTop || e.scrollToPos && (e.scrollToPos.from.line < n.viewFrom || e.scrollToPos.to.line >= n.viewTo) || n.maxLineChanged && t.options.lineWrapping, e.update = e.mustUpdate && new L(t, e.mustUpdate && {
                        top: e.scrollTop,
                        ensure: e.scrollToPos
                    }, e.forceUpdate)
                }

                function Lt(e) {
                    e.updatedDisplay = e.mustUpdate && M(e.cm, e.update)
                }

                function Tt(e) {
                    var t = e.cm,
                        n = t.display;
                    e.updatedDisplay && O(t), e.barMeasure = p(t), n.maxLineChanged && !t.options.lineWrapping && (e.adjustWidthTo = Je(t, n.maxLine, n.maxLine.text.length).left + 3, t.display.sizerWidth = e.adjustWidthTo, e.barMeasure.scrollWidth = Math.max(n.scroller.clientWidth, n.sizer.offsetLeft + e.adjustWidthTo + Ye(t) + t.display.barWidth), e.maxScrollLeft = Math.max(0, n.sizer.offsetLeft + e.adjustWidthTo - $e(t))), (e.updatedDisplay || e.selectionChanged) && (e.preparedSelection = n.input.prepareSelection(e.focus))
                }

                function Mt(e) {
                    var t = e.cm;
                    null != e.adjustWidthTo && (t.display.sizer.style.minWidth = e.adjustWidthTo + "px", e.maxScrollLeft < t.doc.scrollLeft && on(t, Math.min(t.display.scroller.scrollLeft, e.maxScrollLeft), !0), t.display.maxLineChanged = !1);
                    var n = e.focus && e.focus == Gi() && (!document.hasFocus || document.hasFocus());
                    e.preparedSelection && t.display.input.showSelection(e.preparedSelection, n), (e.updatedDisplay || e.startHeight != t.doc.height) && y(t, e.barMeasure), e.updatedDisplay && E(t, e.barMeasure), e.selectionChanged && Be(t), t.state.focused && e.updateInput && t.display.input.reset(e.typing), n && X(e.cm)
                }

                function Nt(e) {
                    var t = e.cm,
                        n = t.display,
                        r = t.doc;
                    if (e.updatedDisplay && N(t, e.update), null == n.wheelStartX || null == e.scrollTop && null == e.scrollLeft && !e.scrollToPos || (n.wheelStartX = n.wheelStartY = null), null == e.scrollTop || n.scroller.scrollTop == e.scrollTop && !e.forceScroll || (r.scrollTop = Math.max(0, Math.min(n.scroller.scrollHeight - n.scroller.clientHeight, e.scrollTop)), n.scrollbars.setScrollTop(r.scrollTop), n.scroller.scrollTop = r.scrollTop), null == e.scrollLeft || n.scroller.scrollLeft == e.scrollLeft && !e.forceScroll || (r.scrollLeft = Math.max(0, Math.min(n.scroller.scrollWidth - n.scroller.clientWidth, e.scrollLeft)), n.scrollbars.setScrollLeft(r.scrollLeft), n.scroller.scrollLeft = r.scrollLeft, w(t)), e.scrollToPos) {
                        var i = Rn(t, me(r, e.scrollToPos.from), me(r, e.scrollToPos.to), e.scrollToPos.margin);
                        e.scrollToPos.isCursor && t.state.focused && Pn(t, i)
                    }
                    var o = e.maybeHiddenMarkers,
                        a = e.maybeUnhiddenMarkers;
                    if (o)
                        for (var l = 0; l < o.length; ++l) o[l].lines.length || Pa(o[l], "hide");
                    if (a)
                        for (var l = 0; l < a.length; ++l) a[l].lines.length && Pa(a[l], "unhide");
                    n.wrapper.offsetHeight && (r.scrollTop = t.display.scroller.scrollTop), e.changeObjs && Pa(t, "changes", t, e.changeObjs), e.update && e.update.finish()
                }

                function At(e, t) {
                    if (e.curOp) return t();
                    bt(e);
                    try {
                        return t()
                    } finally {
                        kt(e)
                    }
                }

                function Et(e, t) {
                    return function() {
                        if (e.curOp) return t.apply(e, arguments);
                        bt(e);
                        try {
                            return t.apply(e, arguments)
                        } finally {
                            kt(e)
                        }
                    }
                }

                function Ot(e) {
                    return function() {
                        if (this.curOp) return e.apply(this, arguments);
                        bt(this);
                        try {
                            return e.apply(this, arguments)
                        } finally {
                            kt(this)
                        }
                    }
                }

                function It(e) {
                    return function() {
                        var t = this.cm;
                        if (!t || t.curOp) return e.apply(this, arguments);
                        bt(t);
                        try {
                            return e.apply(this, arguments)
                        } finally {
                            kt(t)
                        }
                    }
                }

                function Pt(e, t, n) {
                    this.line = t, this.rest = xr(t), this.size = this.rest ? ti(Ii(this.rest)) - n + 1 : 1, this.node = this.text = null, this.hidden = kr(e, t)
                }

                function Rt(e, t, n) {
                    for (var r, i = [], o = t; n > o; o = r) {
                        var a = new Pt(e.doc, Zr(e.doc, o), o);
                        r = o + a.size, i.push(a)
                    }
                    return i
                }

                function Dt(e, t, n, r) {
                    null == t && (t = e.doc.first), null == n && (n = e.doc.first + e.doc.size), r || (r = 0);
                    var i = e.display;
                    if (r && n < i.viewTo && (null == i.updateLineNumbers || i.updateLineNumbers > t) && (i.updateLineNumbers = t), e.curOp.viewChanged = !0, t >= i.viewTo) Wo && br(e.doc, t) < i.viewTo && Wt(e);
                    else if (n <= i.viewFrom) Wo && wr(e.doc, n + r) > i.viewFrom ? Wt(e) : (i.viewFrom += r, i.viewTo += r);
                    else if (t <= i.viewFrom && n >= i.viewTo) Wt(e);
                    else if (t <= i.viewFrom) {
                        var o = _t(e, n, n + r, 1);
                        o ? (i.view = i.view.slice(o.index), i.viewFrom = o.lineN, i.viewTo += r) : Wt(e)
                    } else if (n >= i.viewTo) {
                        var o = _t(e, t, t, -1);
                        o ? (i.view = i.view.slice(0, o.index), i.viewTo = o.lineN) : Wt(e)
                    } else {
                        var a = _t(e, t, t, -1),
                            l = _t(e, n, n + r, 1);
                        a && l ? (i.view = i.view.slice(0, a.index).concat(Rt(e, a.lineN, l.lineN)).concat(i.view.slice(l.index)), i.viewTo += r) : Wt(e)
                    }
                    var s = i.externalMeasured;
                    s && (n < s.lineN ? s.lineN += r : t < s.lineN + s.size && (i.externalMeasured = null))
                }

                function Ht(e, t, n) {
                    e.curOp.viewChanged = !0;
                    var r = e.display,
                        i = e.display.externalMeasured;
                    if (i && t >= i.lineN && t < i.lineN + i.size && (r.externalMeasured = null), !(t < r.viewFrom || t >= r.viewTo)) {
                        var o = r.view[Bt(e, t)];
                        if (null != o.node) {
                            var a = o.changes || (o.changes = []); - 1 == Pi(a, n) && a.push(n)
                        }
                    }
                }

                function Wt(e) {
                    e.display.viewFrom = e.display.viewTo = e.doc.first, e.display.view = [], e.display.viewOffset = 0
                }

                function Bt(e, t) {
                    if (t >= e.display.viewTo) return null;
                    if (t -= e.display.viewFrom, 0 > t) return null;
                    for (var n = e.display.view, r = 0; r < n.length; r++)
                        if (t -= n[r].size, 0 > t) return r
                }

                function _t(e, t, n, r) {
                    var i, o = Bt(e, t),
                        a = e.display.view;
                    if (!Wo || n == e.doc.first + e.doc.size) return {
                        index: o,
                        lineN: n
                    };
                    for (var l = 0, s = e.display.viewFrom; o > l; l++) s += a[l].size;
                    if (s != t) {
                        if (r > 0) {
                            if (o == a.length - 1) return null;
                            i = s + a[o].size - t, o++
                        } else i = s - t;
                        t += i, n += i
                    }
                    for (; br(e.doc, n) != n;) {
                        if (o == (0 > r ? 0 : a.length - 1)) return null;
                        n += r * a[o - (0 > r ? 1 : 0)].size, o += r
                    }
                    return {
                        index: o,
                        lineN: n
                    }
                }

                function Ft(e, t, n) {
                    var r = e.display,
                        i = r.view;
                    0 == i.length || t >= r.viewTo || n <= r.viewFrom ? (r.view = Rt(e, t, n), r.viewFrom = t) : (r.viewFrom > t ? r.view = Rt(e, t, r.viewFrom).concat(r.view) : r.viewFrom < t && (r.view = r.view.slice(Bt(e, t))), r.viewFrom = t, r.viewTo < n ? r.view = r.view.concat(Rt(e, r.viewTo, n)) : r.viewTo > n && (r.view = r.view.slice(0, Bt(e, n)))), r.viewTo = n
                }

                function zt(e) {
                    for (var t = e.display.view, n = 0, r = 0; r < t.length; r++) {
                        var i = t[r];
                        i.hidden || i.node && !i.changes || ++n
                    }
                    return n
                }

                function jt(e) {
                    function t() {
                        i.activeTouch && (o = setTimeout(function() {
                            i.activeTouch = null
                        }, 1e3), a = i.activeTouch, a.end = +new Date)
                    }

                    function n(e) {
                        if (1 != e.touches.length) return !1;
                        var t = e.touches[0];
                        return t.radiusX <= 1 && t.radiusY <= 1
                    }

                    function r(e, t) {
                        if (null == t.left) return !0;
                        var n = t.left - e.left,
                            r = t.top - e.top;
                        return n * n + r * r > 400
                    }
                    var i = e.display;
                    Ea(i.scroller, "mousedown", Et(e, $t)), xo && 11 > bo ? Ea(i.scroller, "dblclick", Et(e, function(t) {
                        if (!Ti(e, t)) {
                            var n = Yt(e, t);
                            if (n && !Jt(e, t) && !Gt(e.display, t)) {
                                Ma(t);
                                var r = e.findWordAt(n);
                                be(e.doc, r.anchor, r.head)
                            }
                        }
                    })) : Ea(i.scroller, "dblclick", function(t) {
                        Ti(e, t) || Ma(t)
                    }), Do || Ea(i.scroller, "contextmenu", function(t) {
                        xn(e, t)
                    });
                    var o, a = {
                        end: 0
                    };
                    Ea(i.scroller, "touchstart", function(t) {
                        if (!Ti(e, t) && !n(t)) {
                            clearTimeout(o);
                            var r = +new Date;
                            i.activeTouch = {
                                start: r,
                                moved: !1,
                                prev: r - a.end <= 300 ? a : null
                            }, 1 == t.touches.length && (i.activeTouch.left = t.touches[0].pageX, i.activeTouch.top = t.touches[0].pageY)
                        }
                    }), Ea(i.scroller, "touchmove", function() {
                        i.activeTouch && (i.activeTouch.moved = !0)
                    }), Ea(i.scroller, "touchend", function(n) {
                        var o = i.activeTouch;
                        if (o && !Gt(i, n) && null != o.left && !o.moved && new Date - o.start < 300) {
                            var a, l = e.coordsChar(i.activeTouch, "page");
                            a = !o.prev || r(o, o.prev) ? new fe(l, l) : !o.prev.prev || r(o, o.prev.prev) ? e.findWordAt(l) : new fe(Bo(l.line, 0), me(e.doc, Bo(l.line + 1, 0))), e.setSelection(a.anchor, a.head), e.focus(), Ma(n)
                        }
                        t()
                    }), Ea(i.scroller, "touchcancel", t), Ea(i.scroller, "scroll", function() {
                        i.scroller.clientHeight && (rn(e, i.scroller.scrollTop), on(e, i.scroller.scrollLeft, !0), Pa(e, "scroll", e))
                    }), Ea(i.scroller, "mousewheel", function(t) {
                        an(e, t)
                    }), Ea(i.scroller, "DOMMouseScroll", function(t) {
                        an(e, t)
                    }), Ea(i.wrapper, "scroll", function() {
                        i.wrapper.scrollTop = i.wrapper.scrollLeft = 0
                    }), i.dragFunctions = {
                        enter: function(t) {
                            Ti(e, t) || Aa(t)
                        },
                        over: function(t) {
                            Ti(e, t) || (tn(e, t), Aa(t))
                        },
                        start: function(t) {
                            en(e, t)
                        },
                        drop: Et(e, Qt),
                        leave: function(t) {
                            Ti(e, t) || nn(e)
                        }
                    };
                    var l = i.input.getField();
                    Ea(l, "keyup", function(t) {
                        pn.call(e, t)
                    }), Ea(l, "keydown", Et(e, hn)), Ea(l, "keypress", Et(e, mn)), Ea(l, "focus", Bi(vn, e)), Ea(l, "blur", Bi(yn, e))
                }

                function Ut(t, n, r) {
                    var i = r && r != e.Init;
                    if (!n != !i) {
                        var o = t.display.dragFunctions,
                            a = n ? Ea : Ia;
                        a(t.display.scroller, "dragstart", o.start), a(t.display.scroller, "dragenter", o.enter), a(t.display.scroller, "dragover", o.over), a(t.display.scroller, "dragleave", o.leave), a(t.display.scroller, "drop", o.drop)
                    }
                }

                function qt(e) {
                    var t = e.display;
                    t.lastWrapHeight == t.wrapper.clientHeight && t.lastWrapWidth == t.wrapper.clientWidth || (t.cachedCharWidth = t.cachedTextHeight = t.cachedPaddingH = null, t.scrollbarsClipped = !1, e.setSize())
                }

                function Gt(e, t) {
                    for (var n = wi(t); n != e.wrapper; n = n.parentNode)
                        if (!n || 1 == n.nodeType && "true" == n.getAttribute("cm-ignore-events") || n.parentNode == e.sizer && n != e.mover) return !0
                }

                function Yt(e, t, n, r) {
                    var i = e.display;
                    if (!n && "true" == wi(t).getAttribute("cm-not-content")) return null;
                    var o, a, l = i.lineSpace.getBoundingClientRect();
                    try {
                        o = t.clientX - l.left, a = t.clientY - l.top
                    } catch (t) {
                        return null
                    }
                    var s, c = gt(e, o, a);
                    if (r && 1 == c.xRel && (s = Zr(e.doc, c.line).text).length == c.ch) {
                        var u = Fa(s, s.length, e.options.tabSize) - s.length;
                        c = Bo(c.line, Math.max(0, Math.round((o - Ge(e.display).left) / xt(e.display)) - u))
                    }
                    return c
                }

                function $t(e) {
                    var t = this,
                        n = t.display;
                    if (!(Ti(t, e) || n.activeTouch && n.input.supportsTouch())) {
                        if (n.shift = e.shiftKey, Gt(n, e)) return void(wo || (n.scroller.draggable = !1, setTimeout(function() {
                            n.scroller.draggable = !0
                        }, 100)));
                        if (!Jt(t, e)) {
                            var r = Yt(t, e);
                            switch (window.focus(), ki(e)) {
                                case 1:
                                    t.state.selectingText ? t.state.selectingText(e) : r ? Vt(t, e, r) : wi(e) == n.scroller && Ma(e);
                                    break;
                                case 2:
                                    wo && (t.state.lastMiddleDown = +new Date), r && be(t.doc, r), setTimeout(function() {
                                        n.input.focus()
                                    }, 20), Ma(e);
                                    break;
                                case 3:
                                    Do ? xn(t, e) : gn(t)
                            }
                        }
                    }
                }

                function Vt(e, t, n) {
                    xo ? setTimeout(Bi(X, e), 0) : e.curOp.focus = Gi();
                    var r, i = +new Date;
                    Uo && Uo.time > i - 400 && 0 == _o(Uo.pos, n) ? r = "triple" : jo && jo.time > i - 400 && 0 == _o(jo.pos, n) ? (r = "double", Uo = {
                        time: i,
                        pos: n
                    }) : (r = "single", jo = {
                        time: i,
                        pos: n
                    });
                    var o, a = e.doc.sel,
                        l = Eo ? t.metaKey : t.ctrlKey;
                    e.options.dragDrop && el && !e.isReadOnly() && "single" == r && (o = a.contains(n)) > -1 && (_o((o = a.ranges[o]).from(), n) < 0 || n.xRel > 0) && (_o(o.to(), n) > 0 || n.xRel < 0) ? Kt(e, t, n, l) : Xt(e, t, n, r, l)
                }

                function Kt(e, t, n, r) {
                    var i = e.display,
                        o = +new Date,
                        a = Et(e, function(l) {
                            wo && (i.scroller.draggable = !1), e.state.draggingText = !1, Ia(document, "mouseup", a), Ia(i.scroller, "drop", a), Math.abs(t.clientX - l.clientX) + Math.abs(t.clientY - l.clientY) < 10 && (Ma(l), !r && +new Date - 200 < o && be(e.doc, n), wo || xo && 9 == bo ? setTimeout(function() {
                                document.body.focus(), i.input.focus()
                            }, 20) : i.input.focus())
                        });
                    wo && (i.scroller.draggable = !0), e.state.draggingText = a, i.scroller.dragDrop && i.scroller.dragDrop(), Ea(document, "mouseup", a), Ea(i.scroller, "drop", a)
                }

                function Xt(e, t, n, r, i) {
                    function o(t) {
                        if (0 != _o(g, t))
                            if (g = t, "rect" == r) {
                                for (var i = [], o = e.options.tabSize, a = Fa(Zr(c, n.line).text, n.ch, o), l = Fa(Zr(c, t.line).text, t.ch, o), s = Math.min(a, l), d = Math.max(a, l), p = Math.min(n.line, t.line), m = Math.min(e.lastLine(), Math.max(n.line, t.line)); m >= p; p++) {
                                    var v = Zr(c, p).text,
                                        y = za(v, s, o);
                                    s == d ? i.push(new fe(Bo(p, y), Bo(p, y))) : v.length > y && i.push(new fe(Bo(p, y), Bo(p, za(v, d, o))))
                                }
                                i.length || i.push(new fe(n, n)), Te(c, he(h.ranges.slice(0, f).concat(i), f), {
                                    origin: "*mouse",
                                    scroll: !1
                                }), e.scrollIntoView(t)
                            } else {
                                var x = u,
                                    b = x.anchor,
                                    w = t;
                                if ("single" != r) {
                                    if ("double" == r) var k = e.findWordAt(t);
                                    else var k = new fe(Bo(t.line, 0), me(c, Bo(t.line + 1, 0)));
                                    _o(k.anchor, b) > 0 ? (w = k.head, b = K(x.from(), k.anchor)) : (w = k.anchor, b = V(x.to(), k.head))
                                }
                                var i = h.ranges.slice(0);
                                i[f] = new fe(me(c, b), w), Te(c, he(i, f), Ba)
                            }
                    }

                    function a(t) {
                        var n = ++y,
                            i = Yt(e, t, !0, "rect" == r);
                        if (i)
                            if (0 != _o(i, g)) {
                                e.curOp.focus = Gi(), o(i);
                                var l = b(s, c);
                                (i.line >= l.to || i.line < l.from) && setTimeout(Et(e, function() {
                                    y == n && a(t)
                                }), 150)
                            } else {
                                var u = t.clientY < v.top ? -20 : t.clientY > v.bottom ? 20 : 0;
                                u && setTimeout(Et(e, function() {
                                    y == n && (s.scroller.scrollTop += u, a(t))
                                }), 50)
                            }
                    }

                    function l(t) {
                        e.state.selectingText = !1, y = 1 / 0, Ma(t), s.input.focus(), Ia(document, "mousemove", x), Ia(document, "mouseup", w), c.history.lastSelOrigin = null
                    }
                    var s = e.display,
                        c = e.doc;
                    Ma(t);
                    var u, f, h = c.sel,
                        d = h.ranges;
                    if (i && !t.shiftKey ? (f = c.sel.contains(n), u = f > -1 ? d[f] : new fe(n, n)) : (u = c.sel.primary(), f = c.sel.primIndex), Oo ? t.shiftKey && t.metaKey : t.altKey) r = "rect", i || (u = new fe(n, n)), n = Yt(e, t, !0, !0), f = -1;
                    else if ("double" == r) {
                        var p = e.findWordAt(n);
                        u = e.display.shift || c.extend ? xe(c, u, p.anchor, p.head) : p
                    } else if ("triple" == r) {
                        var m = new fe(Bo(n.line, 0), me(c, Bo(n.line + 1, 0)));
                        u = e.display.shift || c.extend ? xe(c, u, m.anchor, m.head) : m
                    } else u = xe(c, u, n);
                    i ? -1 == f ? (f = d.length, Te(c, he(d.concat([u]), f), {
                        scroll: !1,
                        origin: "*mouse"
                    })) : d.length > 1 && d[f].empty() && "single" == r && !t.shiftKey ? (Te(c, he(d.slice(0, f).concat(d.slice(f + 1)), 0), {
                        scroll: !1,
                        origin: "*mouse"
                    }), h = c.sel) : ke(c, f, u, Ba) : (f = 0, Te(c, new ue([u], 0), Ba), h = c.sel);
                    var g = n,
                        v = s.wrapper.getBoundingClientRect(),
                        y = 0,
                        x = Et(e, function(e) {
                            ki(e) ? a(e) : l(e)
                        }),
                        w = Et(e, l);
                    e.state.selectingText = w, Ea(document, "mousemove", x), Ea(document, "mouseup", w)
                }

                function Zt(e, t, n, r) {
                    try {
                        var i = t.clientX,
                            o = t.clientY
                    } catch (t) {
                        return !1
                    }
                    if (i >= Math.floor(e.display.gutters.getBoundingClientRect().right)) return !1;
                    r && Ma(t);
                    var a = e.display,
                        l = a.lineDiv.getBoundingClientRect();
                    if (o > l.bottom || !Ni(e, n)) return bi(t);
                    o -= l.top - a.viewOffset;
                    for (var s = 0; s < e.options.gutters.length; ++s) {
                        var c = a.gutters.childNodes[s];
                        if (c && c.getBoundingClientRect().right >= i) {
                            var u = ni(e.doc, o),
                                f = e.options.gutters[s];
                            return Pa(e, n, e, u, f, t), bi(t)
                        }
                    }
                }

                function Jt(e, t) {
                    return Zt(e, t, "gutterClick", !0)
                }

                function Qt(e) {
                    var t = this;
                    if (nn(t), !Ti(t, e) && !Gt(t.display, e)) {
                        Ma(e), xo && ($o = +new Date);
                        var n = Yt(t, e, !0),
                            r = e.dataTransfer.files;
                        if (n && !t.isReadOnly())
                            if (r && r.length && window.FileReader && window.File)
                                for (var i = r.length, o = Array(i), a = 0, l = function(e, r) {
                                        if (!t.options.allowDropFileTypes || -1 != Pi(t.options.allowDropFileTypes, e.type)) {
                                            var l = new FileReader;
                                            l.onload = Et(t, function() {
                                                var e = l.result;
                                                if (/[\x00-\x08\x0e-\x1f]{2}/.test(e) && (e = ""), o[r] = e, ++a == i) {
                                                    n = me(t.doc, n);
                                                    var s = {
                                                        from: n,
                                                        to: n,
                                                        text: t.doc.splitLines(o.join(t.doc.lineSeparator())),
                                                        origin: "paste"
                                                    };
                                                    Tn(t.doc, s), Le(t.doc, de(n, Qo(s)))
                                                }
                                            }), l.readAsText(e)
                                        }
                                    }, s = 0; i > s; ++s) l(r[s], s);
                            else {
                                if (t.state.draggingText && t.doc.sel.contains(n) > -1) return t.state.draggingText(e), void setTimeout(function() {
                                    t.display.input.focus()
                                }, 20);
                                try {
                                    var o = e.dataTransfer.getData("Text");
                                    if (o) {
                                        if (t.state.draggingText && !(Eo ? e.altKey : e.ctrlKey)) var c = t.listSelections();
                                        if (Me(t.doc, de(n, n)), c)
                                            for (var s = 0; s < c.length; ++s) In(t.doc, "", c[s].anchor, c[s].head, "drag");
                                        t.replaceSelection(o, "around", "paste"), t.display.input.focus()
                                    }
                                } catch (e) {}
                            }
                    }
                }

                function en(e, t) {
                    if (xo && (!e.state.draggingText || +new Date - $o < 100)) return void Aa(t);
                    if (!Ti(e, t) && !Gt(e.display, t) && (t.dataTransfer.setData("Text", e.getSelection()), t.dataTransfer.effectAllowed = "copyMove", t.dataTransfer.setDragImage && !Lo)) {
                        var n = ji("img", null, null, "position: fixed; left: 0; top: 0;");
                        n.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==", Co && (n.width = n.height = 1, e.display.wrapper.appendChild(n), n._top = n.offsetTop), t.dataTransfer.setDragImage(n, 0, 0), Co && n.parentNode.removeChild(n)
                    }
                }

                function tn(e, t) {
                    var n = Yt(e, t);
                    if (n) {
                        var r = document.createDocumentFragment();
                        He(e, n, r), e.display.dragCursor || (e.display.dragCursor = ji("div", null, "CodeMirror-cursors CodeMirror-dragcursors"), e.display.lineSpace.insertBefore(e.display.dragCursor, e.display.cursorDiv)), qi(e.display.dragCursor, r)
                    }
                }

                function nn(e) {
                    e.display.dragCursor && (e.display.lineSpace.removeChild(e.display.dragCursor), e.display.dragCursor = null)
                }

                function rn(e, t) {
                    Math.abs(e.doc.scrollTop - t) < 2 || (e.doc.scrollTop = t, go || A(e, {
                        top: t
                    }), e.display.scroller.scrollTop != t && (e.display.scroller.scrollTop = t), e.display.scrollbars.setScrollTop(t), go && A(e), _e(e, 100))
                }

                function on(e, t, n) {
                    (n ? t == e.doc.scrollLeft : Math.abs(e.doc.scrollLeft - t) < 2) || (t = Math.min(t, e.display.scroller.scrollWidth - e.display.scroller.clientWidth), e.doc.scrollLeft = t, w(e), e.display.scroller.scrollLeft != t && (e.display.scroller.scrollLeft = t), e.display.scrollbars.setScrollLeft(t))
                }

                function an(e, t) {
                    var n = Xo(t),
                        r = n.x,
                        i = n.y,
                        o = e.display,
                        a = o.scroller,
                        l = a.scrollWidth > a.clientWidth,
                        s = a.scrollHeight > a.clientHeight;
                    if (r && l || i && s) {
                        if (i && Eo && wo) e: for (var c = t.target, u = o.view; c != a; c = c.parentNode)
                            for (var f = 0; f < u.length; f++)
                                if (u[f].node == c) {
                                    e.display.currentWheelTarget = c;
                                    break e
                                }
                        if (r && !go && !Co && null != Ko) return i && s && rn(e, Math.max(0, Math.min(a.scrollTop + i * Ko, a.scrollHeight - a.clientHeight))), on(e, Math.max(0, Math.min(a.scrollLeft + r * Ko, a.scrollWidth - a.clientWidth))), (!i || i && s) && Ma(t), void(o.wheelStartX = null);
                        if (i && null != Ko) {
                            var h = i * Ko,
                                d = e.doc.scrollTop,
                                p = d + o.wrapper.clientHeight;
                            0 > h ? d = Math.max(0, d + h - 50) : p = Math.min(e.doc.height, p + h + 50), A(e, {
                                top: d,
                                bottom: p
                            })
                        }
                        20 > Vo && (null == o.wheelStartX ? (o.wheelStartX = a.scrollLeft, o.wheelStartY = a.scrollTop, o.wheelDX = r, o.wheelDY = i, setTimeout(function() {
                            if (null != o.wheelStartX) {
                                var e = a.scrollLeft - o.wheelStartX,
                                    t = a.scrollTop - o.wheelStartY,
                                    n = t && o.wheelDY && t / o.wheelDY || e && o.wheelDX && e / o.wheelDX;
                                o.wheelStartX = o.wheelStartY = null, n && (Ko = (Ko * Vo + n) / (Vo + 1), ++Vo)
                            }
                        }, 200)) : (o.wheelDX += r, o.wheelDY += i))
                    }
                }

                function ln(e, t, n) {
                    if ("string" == typeof t && (t = ua[t], !t)) return !1;
                    e.display.input.ensurePolled();
                    var r = e.display.shift,
                        i = !1;
                    try {
                        e.isReadOnly() && (e.state.suppressEdits = !0), n && (e.display.shift = !1), i = t(e) != Ha
                    } finally {
                        e.display.shift = r, e.state.suppressEdits = !1
                    }
                    return i
                }

                function sn(e, t, n) {
                    for (var r = 0; r < e.state.keyMaps.length; r++) {
                        var i = ha(t, e.state.keyMaps[r], n, e);
                        if (i) return i
                    }
                    return e.options.extraKeys && ha(t, e.options.extraKeys, n, e) || ha(t, e.options.keyMap, n, e)
                }

                function cn(e, t, n, r) {
                    var i = e.state.keySeq;
                    if (i) {
                        if (da(t)) return "handled";
                        Zo.set(50, function() {
                            e.state.keySeq == i && (e.state.keySeq = null, e.display.input.reset())
                        }), t = i + " " + t
                    }
                    var o = sn(e, t, r);
                    return "multi" == o && (e.state.keySeq = t), "handled" == o && Ci(e, "keyHandled", e, t, n), "handled" != o && "multi" != o || (Ma(n), Be(e)), i && !o && /\'$/.test(t) ? (Ma(n), !0) : !!o
                }

                function un(e, t) {
                    var n = pa(t, !0);
                    return n ? t.shiftKey && !e.state.keySeq ? cn(e, "Shift-" + n, t, function(t) {
                        return ln(e, t, !0)
                    }) || cn(e, n, t, function(t) {
                        return ("string" == typeof t ? /^go[A-Z]/.test(t) : t.motion) ? ln(e, t) : void 0
                    }) : cn(e, n, t, function(t) {
                        return ln(e, t)
                    }) : !1
                }

                function fn(e, t, n) {
                    return cn(e, "'" + n + "'", t, function(t) {
                        return ln(e, t, !0)
                    })
                }

                function hn(e) {
                    var t = this;
                    if (t.curOp.focus = Gi(), !Ti(t, e)) {
                        xo && 11 > bo && 27 == e.keyCode && (e.returnValue = !1);
                        var n = e.keyCode;
                        t.display.shift = 16 == n || e.shiftKey;
                        var r = un(t, e);
                        Co && (Jo = r ? n : null, !r && 88 == n && !rl && (Eo ? e.metaKey : e.ctrlKey) && t.replaceSelection("", null, "cut")), 18 != n || /\bCodeMirror-crosshair\b/.test(t.display.lineDiv.className) || dn(t)
                    }
                }

                function dn(e) {
                    function t(e) {
                        18 != e.keyCode && e.altKey || (Za(n, "CodeMirror-crosshair"), Ia(document, "keyup", t), Ia(document, "mouseover", t))
                    }
                    var n = e.display.lineDiv;
                    Ja(n, "CodeMirror-crosshair"), Ea(document, "keyup", t), Ea(document, "mouseover", t)
                }

                function pn(e) {
                    16 == e.keyCode && (this.doc.sel.shift = !1), Ti(this, e)
                }

                function mn(e) {
                    var t = this;
                    if (!(Gt(t.display, e) || Ti(t, e) || e.ctrlKey && !e.altKey || Eo && e.metaKey)) {
                        var n = e.keyCode,
                            r = e.charCode;
                        if (Co && n == Jo) return Jo = null, void Ma(e);
                        if (!Co || e.which && !(e.which < 10) || !un(t, e)) {
                            var i = String.fromCharCode(null == r ? n : r);
                            fn(t, e, i) || t.display.input.onKeyPress(e)
                        }
                    }
                }

                function gn(e) {
                    e.state.delayingBlurEvent = !0, setTimeout(function() {
                        e.state.delayingBlurEvent && (e.state.delayingBlurEvent = !1, yn(e))
                    }, 100)
                }

                function vn(e) {
                    e.state.delayingBlurEvent && (e.state.delayingBlurEvent = !1), "nocursor" != e.options.readOnly && (e.state.focused || (Pa(e, "focus", e), e.state.focused = !0, Ja(e.display.wrapper, "CodeMirror-focused"), e.curOp || e.display.selForContextMenu == e.doc.sel || (e.display.input.reset(), wo && setTimeout(function() {
                        e.display.input.reset(!0)
                    }, 20)), e.display.input.receivedFocus()), Be(e))
                }

                function yn(e) {
                    e.state.delayingBlurEvent || (e.state.focused && (Pa(e, "blur", e), e.state.focused = !1, Za(e.display.wrapper, "CodeMirror-focused")), clearInterval(e.display.blinker), setTimeout(function() {
                        e.state.focused || (e.display.shift = !1)
                    }, 150))
                }

                function xn(e, t) {
                    Gt(e.display, t) || bn(e, t) || Ti(e, t, "contextmenu") || e.display.input.onContextMenu(t)
                }

                function bn(e, t) {
                    return Ni(e, "gutterContextMenu") ? Zt(e, t, "gutterContextMenu", !1) : !1
                }

                function wn(e, t) {
                    if (_o(e, t.from) < 0) return e;
                    if (_o(e, t.to) <= 0) return Qo(t);
                    var n = e.line + t.text.length - (t.to.line - t.from.line) - 1,
                        r = e.ch;
                    return e.line == t.to.line && (r += Qo(t).ch - t.to.ch), Bo(n, r)
                }

                function kn(e, t) {
                    for (var n = [], r = 0; r < e.sel.ranges.length; r++) {
                        var i = e.sel.ranges[r];
                        n.push(new fe(wn(i.anchor, t), wn(i.head, t)))
                    }
                    return he(n, e.sel.primIndex)
                }

                function Sn(e, t, n) {
                    return e.line == t.line ? Bo(n.line, e.ch - t.ch + n.ch) : Bo(n.line + (e.line - t.line), e.ch)
                }

                function Cn(e, t, n) {
                    for (var r = [], i = Bo(e.first, 0), o = i, a = 0; a < t.length; a++) {
                        var l = t[a],
                            s = Sn(l.from, i, o),
                            c = Sn(Qo(l), i, o);
                        if (i = l.to, o = c, "around" == n) {
                            var u = e.sel.ranges[a],
                                f = _o(u.head, u.anchor) < 0;
                            r[a] = new fe(f ? c : s, f ? s : c)
                        } else r[a] = new fe(s, s)
                    }
                    return new ue(r, e.sel.primIndex)
                }

                function Ln(e, t, n) {
                    var r = {
                        canceled: !1,
                        from: t.from,
                        to: t.to,
                        text: t.text,
                        origin: t.origin,
                        cancel: function() {
                            this.canceled = !0
                        }
                    };
                    return n && (r.update = function(t, n, r, i) {
                        t && (this.from = me(e, t)), n && (this.to = me(e, n)), r && (this.text = r), void 0 !== i && (this.origin = i)
                    }), Pa(e, "beforeChange", e, r), e.cm && Pa(e.cm, "beforeChange", e.cm, r), r.canceled ? null : {
                        from: r.from,
                        to: r.to,
                        text: r.text,
                        origin: r.origin
                    }
                }

                function Tn(e, t, n) {
                    if (e.cm) {
                        if (!e.cm.curOp) return Et(e.cm, Tn)(e, t, n);
                        if (e.cm.state.suppressEdits) return
                    }
                    if (!(Ni(e, "beforeChange") || e.cm && Ni(e.cm, "beforeChange")) || (t = Ln(e, t, !0))) {
                        var r = Ho && !n && sr(e, t.from, t.to);
                        if (r)
                            for (var i = r.length - 1; i >= 0; --i) Mn(e, {
                                from: r[i].from,
                                to: r[i].to,
                                text: i ? [""] : t.text
                            });
                        else Mn(e, t)
                    }
                }

                function Mn(e, t) {
                    if (1 != t.text.length || "" != t.text[0] || 0 != _o(t.from, t.to)) {
                        var n = kn(e, t);
                        ci(e, t, n, e.cm ? e.cm.curOp.id : NaN), En(e, t, n, or(e, t));
                        var r = [];
                        Kr(e, function(e, n) {
                            n || -1 != Pi(r, e.history) || (xi(e.history, t), r.push(e.history)), En(e, t, null, or(e, t))
                        })
                    }
                }

                function Nn(e, t, n) {
                    if (!e.cm || !e.cm.state.suppressEdits) {
                        for (var r, i = e.history, o = e.sel, a = "undo" == t ? i.done : i.undone, l = "undo" == t ? i.undone : i.done, s = 0; s < a.length && (r = a[s], n ? !r.ranges || r.equals(e.sel) : r.ranges); s++);
                        if (s != a.length) {
                            for (i.lastOrigin = i.lastSelOrigin = null; r = a.pop(), r.ranges;) {
                                if (hi(r, l), n && !r.equals(e.sel)) return void Te(e, r, {
                                    clearRedo: !1
                                });
                                o = r
                            }
                            var c = [];
                            hi(o, l), l.push({
                                changes: c,
                                generation: i.generation
                            }), i.generation = r.generation || ++i.maxGeneration;
                            for (var u = Ni(e, "beforeChange") || e.cm && Ni(e.cm, "beforeChange"), s = r.changes.length - 1; s >= 0; --s) {
                                var f = r.changes[s];
                                if (f.origin = t, u && !Ln(e, f, !1)) return void(a.length = 0);
                                c.push(ai(e, f));
                                var h = s ? kn(e, f) : Ii(a);
                                En(e, f, h, lr(e, f)), !s && e.cm && e.cm.scrollIntoView({
                                    from: f.from,
                                    to: Qo(f)
                                });
                                var d = [];
                                Kr(e, function(e, t) {
                                    t || -1 != Pi(d, e.history) || (xi(e.history, f), d.push(e.history)), En(e, f, null, lr(e, f))
                                })
                            }
                        }
                    }
                }

                function An(e, t) {
                    if (0 != t && (e.first += t, e.sel = new ue(Ri(e.sel.ranges, function(e) {
                            return new fe(Bo(e.anchor.line + t, e.anchor.ch), Bo(e.head.line + t, e.head.ch))
                        }), e.sel.primIndex), e.cm)) {
                        Dt(e.cm, e.first, e.first - t, t);
                        for (var n = e.cm.display, r = n.viewFrom; r < n.viewTo; r++) Ht(e.cm, r, "gutter")
                    }
                }

                function En(e, t, n, r) {
                    if (e.cm && !e.cm.curOp) return Et(e.cm, En)(e, t, n, r);
                    if (t.to.line < e.first) return void An(e, t.text.length - 1 - (t.to.line - t.from.line));
                    if (!(t.from.line > e.lastLine())) {
                        if (t.from.line < e.first) {
                            var i = t.text.length - 1 - (e.first - t.from.line);
                            An(e, i), t = {
                                from: Bo(e.first, 0),
                                to: Bo(t.to.line + i, t.to.ch),
                                text: [Ii(t.text)],
                                origin: t.origin
                            }
                        }
                        var o = e.lastLine();
                        t.to.line > o && (t = {
                            from: t.from,
                            to: Bo(o, Zr(e, o).text.length),
                            text: [t.text[0]],
                            origin: t.origin
                        }), t.removed = Jr(e, t.from, t.to), n || (n = kn(e, t)), e.cm ? On(e.cm, t, r) : Yr(e, t, r), Me(e, n, Wa)
                    }
                }

                function On(e, t, n) {
                    var r = e.doc,
                        i = e.display,
                        a = t.from,
                        l = t.to,
                        s = !1,
                        c = a.line;
                    e.options.lineWrapping || (c = ti(yr(Zr(r, a.line))), r.iter(c, l.line + 1, function(e) {
                        return e == i.maxLine ? (s = !0, !0) : void 0
                    })), r.sel.contains(t.from, t.to) > -1 && Mi(e), Yr(r, t, n, o(e)), e.options.lineWrapping || (r.iter(c, a.line + t.text.length, function(e) {
                        var t = f(e);
                        t > i.maxLineLength && (i.maxLine = e, i.maxLineLength = t, i.maxLineChanged = !0, s = !1)
                    }), s && (e.curOp.updateMaxLine = !0)), r.frontier = Math.min(r.frontier, a.line), _e(e, 400);
                    var u = t.text.length - (l.line - a.line) - 1;
                    t.full ? Dt(e) : a.line != l.line || 1 != t.text.length || Gr(e.doc, t) ? Dt(e, a.line, l.line + 1, u) : Ht(e, a.line, "text");
                    var h = Ni(e, "changes"),
                        d = Ni(e, "change");
                    if (d || h) {
                        var p = {
                            from: a,
                            to: l,
                            text: t.text,
                            removed: t.removed,
                            origin: t.origin
                        };
                        d && Ci(e, "change", e, p), h && (e.curOp.changeObjs || (e.curOp.changeObjs = [])).push(p)
                    }
                    e.display.selForContextMenu = null
                }

                function In(e, t, n, r, i) {
                    if (r || (r = n), _o(r, n) < 0) {
                        var o = r;
                        r = n, n = o
                    }
                    "string" == typeof t && (t = e.splitLines(t)), Tn(e, {
                        from: n,
                        to: r,
                        text: t,
                        origin: i
                    })
                }

                function Pn(e, t) {
                    if (!Ti(e, "scrollCursorIntoView")) {
                        var n = e.display,
                            r = n.sizer.getBoundingClientRect(),
                            i = null;
                        if (t.top + r.top < 0 ? i = !0 : t.bottom + r.top > (window.innerHeight || document.documentElement.clientHeight) && (i = !1), null != i && !Mo) {
                            var o = ji("div", "​", null, "position: absolute; top: " + (t.top - n.viewOffset - Ue(e.display)) + "px; height: " + (t.bottom - t.top + Ye(e) + n.barHeight) + "px; left: " + t.left + "px; width: 2px;");
                            e.display.lineSpace.appendChild(o), o.scrollIntoView(i), e.display.lineSpace.removeChild(o)
                        }
                    }
                }

                function Rn(e, t, n, r) {
                    null == r && (r = 0);
                    for (var i = 0; 5 > i; i++) {
                        var o = !1,
                            a = dt(e, t),
                            l = n && n != t ? dt(e, n) : a,
                            s = Hn(e, Math.min(a.left, l.left), Math.min(a.top, l.top) - r, Math.max(a.left, l.left), Math.max(a.bottom, l.bottom) + r),
                            c = e.doc.scrollTop,
                            u = e.doc.scrollLeft;
                        if (null != s.scrollTop && (rn(e, s.scrollTop), Math.abs(e.doc.scrollTop - c) > 1 && (o = !0)), null != s.scrollLeft && (on(e, s.scrollLeft), Math.abs(e.doc.scrollLeft - u) > 1 && (o = !0)), !o) break
                    }
                    return a
                }

                function Dn(e, t, n, r, i) {
                    var o = Hn(e, t, n, r, i);
                    null != o.scrollTop && rn(e, o.scrollTop), null != o.scrollLeft && on(e, o.scrollLeft)
                }

                function Hn(e, t, n, r, i) {
                    var o = e.display,
                        a = yt(e.display);
                    0 > n && (n = 0);
                    var l = e.curOp && null != e.curOp.scrollTop ? e.curOp.scrollTop : o.scroller.scrollTop,
                        s = Ve(e),
                        c = {};
                    i - n > s && (i = n + s);
                    var u = e.doc.height + qe(o),
                        f = a > n,
                        h = i > u - a;
                    if (l > n) c.scrollTop = f ? 0 : n;
                    else if (i > l + s) {
                        var d = Math.min(n, (h ? u : i) - s);
                        d != l && (c.scrollTop = d)
                    }
                    var p = e.curOp && null != e.curOp.scrollLeft ? e.curOp.scrollLeft : o.scroller.scrollLeft,
                        m = $e(e) - (e.options.fixedGutter ? o.gutters.offsetWidth : 0),
                        g = r - t > m;
                    return g && (r = t + m), 10 > t ? c.scrollLeft = 0 : p > t ? c.scrollLeft = Math.max(0, t - (g ? 0 : 10)) : r > m + p - 3 && (c.scrollLeft = r + (g ? 0 : 10) - m), c
                }

                function Wn(e, t, n) {
                    null == t && null == n || _n(e), null != t && (e.curOp.scrollLeft = (null == e.curOp.scrollLeft ? e.doc.scrollLeft : e.curOp.scrollLeft) + t), null != n && (e.curOp.scrollTop = (null == e.curOp.scrollTop ? e.doc.scrollTop : e.curOp.scrollTop) + n)
                }

                function Bn(e) {
                    _n(e);
                    var t = e.getCursor(),
                        n = t,
                        r = t;
                    e.options.lineWrapping || (n = t.ch ? Bo(t.line, t.ch - 1) : t, r = Bo(t.line, t.ch + 1)), e.curOp.scrollToPos = {
                        from: n,
                        to: r,
                        margin: e.options.cursorScrollMargin,
                        isCursor: !0
                    }
                }

                function _n(e) {
                    var t = e.curOp.scrollToPos;
                    if (t) {
                        e.curOp.scrollToPos = null;
                        var n = pt(e, t.from),
                            r = pt(e, t.to),
                            i = Hn(e, Math.min(n.left, r.left), Math.min(n.top, r.top) - t.margin, Math.max(n.right, r.right), Math.max(n.bottom, r.bottom) + t.margin);
                        e.scrollTo(i.scrollLeft, i.scrollTop)
                    }
                }

                function Fn(e, t, n, r) {
                    var i, o = e.doc;
                    null == n && (n = "add"), "smart" == n && (o.mode.indent ? i = je(e, t) : n = "prev");
                    var a = e.options.tabSize,
                        l = Zr(o, t),
                        s = Fa(l.text, null, a);
                    l.stateAfter && (l.stateAfter = null);
                    var c, u = l.text.match(/^\s*/)[0];
                    if (r || /\S/.test(l.text)) {
                        if ("smart" == n && (c = o.mode.indent(i, l.text.slice(u.length), l.text), c == Ha || c > 150)) {
                            if (!r) return;
                            n = "prev"
                        }
                    } else c = 0, n = "not";
                    "prev" == n ? c = t > o.first ? Fa(Zr(o, t - 1).text, null, a) : 0 : "add" == n ? c = s + e.options.indentUnit : "subtract" == n ? c = s - e.options.indentUnit : "number" == typeof n && (c = s + n), c = Math.max(0, c);
                    var f = "",
                        h = 0;
                    if (e.options.indentWithTabs)
                        for (var d = Math.floor(c / a); d; --d) h += a, f += "	";
                    if (c > h && (f += Oi(c - h)), f != u) return In(o, f, Bo(t, 0), Bo(t, u.length), "+input"), l.stateAfter = null, !0;
                    for (var d = 0; d < o.sel.ranges.length; d++) {
                        var p = o.sel.ranges[d];
                        if (p.head.line == t && p.head.ch < u.length) {
                            var h = Bo(t, u.length);
                            ke(o, d, new fe(h, h));
                            break
                        }
                    }
                }

                function zn(e, t, n, r) {
                    var i = t,
                        o = t;
                    return "number" == typeof t ? o = Zr(e, pe(e, t)) : i = ti(t), null == i ? null : (r(o, i) && e.cm && Ht(e.cm, i, n), o)
                }

                function jn(e, t) {
                    for (var n = e.doc.sel.ranges, r = [], i = 0; i < n.length; i++) {
                        for (var o = t(n[i]); r.length && _o(o.from, Ii(r).to) <= 0;) {
                            var a = r.pop();
                            if (_o(a.from, o.from) < 0) {
                                o.from = a.from;
                                break
                            }
                        }
                        r.push(o)
                    }
                    At(e, function() {
                        for (var t = r.length - 1; t >= 0; t--) In(e.doc, "", r[t].from, r[t].to, "+delete");
                        Bn(e)
                    })
                }

                function Un(e, t, n, r, i) {
                    function o() {
                        var t = l + n;
                        return t < e.first || t >= e.first + e.size ? !1 : (l = t, u = Zr(e, t))
                    }

                    function a(e) {
                        var t = (i ? fo : ho)(u, s, n, !0);
                        if (null == t) {
                            if (e || !o()) return !1;
                            s = i ? (0 > n ? io : ro)(u) : 0 > n ? u.text.length : 0
                        } else s = t;
                        return !0
                    }
                    var l = t.line,
                        s = t.ch,
                        c = n,
                        u = Zr(e, l);
                    if ("char" == r) a();
                    else if ("column" == r) a(!0);
                    else if ("word" == r || "group" == r)
                        for (var f = null, h = "group" == r, d = e.cm && e.cm.getHelper(t, "wordChars"), p = !0; !(0 > n) || a(!p); p = !1) {
                            var m = u.text.charAt(s) || "\n",
                                g = _i(m, d) ? "w" : h && "\n" == m ? "n" : !h || /\s/.test(m) ? null : "p";
                            if (!h || p || g || (g = "s"), f && f != g) {
                                0 > n && (n = 1, a());
                                break
                            }
                            if (g && (f = g), n > 0 && !a(!p)) break
                        }
                    var v = Ie(e, Bo(l, s), t, c, !0);
                    return _o(t, v) || (v.hitSide = !0), v
                }

                function qn(e, t, n, r) {
                    var i, o = e.doc,
                        a = t.left;
                    if ("page" == r) {
                        var l = Math.min(e.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight);
                        i = t.top + n * (l - (0 > n ? 1.5 : .5) * yt(e.display))
                    } else "line" == r && (i = n > 0 ? t.bottom + 3 : t.top - 3);
                    for (;;) {
                        var s = gt(e, a, i);
                        if (!s.outside) break;
                        if (0 > n ? 0 >= i : i >= o.height) {
                            s.hitSide = !0;
                            break
                        }
                        i += 5 * n
                    }
                    return s
                }

                function Gn(t, n, r, i) {
                    e.defaults[t] = n, r && (ta[t] = i ? function(e, t, n) {
                        n != na && r(e, t, n)
                    } : r)
                }

                function Yn(e) {
                    for (var t, n, r, i, o = e.split(/-(?!$)/), e = o[o.length - 1], a = 0; a < o.length - 1; a++) {
                        var l = o[a];
                        if (/^(cmd|meta|m)$/i.test(l)) i = !0;
                        else if (/^a(lt)?$/i.test(l)) t = !0;
                        else if (/^(c|ctrl|control)$/i.test(l)) n = !0;
                        else {
                            if (!/^s(hift)$/i.test(l)) throw new Error("Unrecognized modifier name: " + l);
                            r = !0
                        }
                    }
                    return t && (e = "Alt-" + e), n && (e = "Ctrl-" + e), i && (e = "Cmd-" + e), r && (e = "Shift-" + e), e
                }

                function $n(e) {
                    return "string" == typeof e ? fa[e] : e
                }

                function Vn(e, t, n, r, i) {
                    if (r && r.shared) return Kn(e, t, n, r, i);
                    if (e.cm && !e.cm.curOp) return Et(e.cm, Vn)(e, t, n, r, i);
                    var o = new va(e, i),
                        a = _o(t, n);
                    if (r && Wi(r, o, !1), a > 0 || 0 == a && o.clearWhenEmpty !== !1) return o;
                    if (o.replacedWith && (o.collapsed = !0, o.widgetNode = ji("span", [o.replacedWith], "CodeMirror-widget"), r.handleMouseEvents || o.widgetNode.setAttribute("cm-ignore-events", "true"), r.insertLeft && (o.widgetNode.insertLeft = !0)), o.collapsed) {
                        if (vr(e, t.line, t, n, o) || t.line != n.line && vr(e, n.line, t, n, o)) throw new Error("Inserting collapsed marker partially overlapping an existing one");
                        Wo = !0
                    }
                    o.addToHistory && ci(e, {
                        from: t,
                        to: n,
                        origin: "markText"
                    }, e.sel, NaN);
                    var l, s = t.line,
                        c = e.cm;
                    if (e.iter(s, n.line + 1, function(e) {
                            c && o.collapsed && !c.options.lineWrapping && yr(e) == c.display.maxLine && (l = !0), o.collapsed && s != t.line && ei(e, 0), nr(e, new Qn(o, s == t.line ? t.ch : null, s == n.line ? n.ch : null)), ++s
                        }), o.collapsed && e.iter(t.line, n.line + 1, function(t) {
                            kr(e, t) && ei(t, 0)
                        }), o.clearOnEnter && Ea(o, "beforeCursorEnter", function() {
                            o.clear()
                        }), o.readOnly && (Ho = !0, (e.history.done.length || e.history.undone.length) && e.clearHistory()), o.collapsed && (o.id = ++ga, o.atomic = !0), c) {
                        if (l && (c.curOp.updateMaxLine = !0), o.collapsed) Dt(c, t.line, n.line + 1);
                        else if (o.className || o.title || o.startStyle || o.endStyle || o.css)
                            for (var u = t.line; u <= n.line; u++) Ht(c, u, "text");
                        o.atomic && Ae(c.doc), Ci(c, "markerAdded", c, o)
                    }
                    return o
                }

                function Kn(e, t, n, r, i) {
                    r = Wi(r), r.shared = !1;
                    var o = [Vn(e, t, n, r, i)],
                        a = o[0],
                        l = r.widgetNode;
                    return Kr(e, function(e) {
                        l && (r.widgetNode = l.cloneNode(!0)), o.push(Vn(e, me(e, t), me(e, n), r, i));
                        for (var s = 0; s < e.linked.length; ++s)
                            if (e.linked[s].isParent) return;
                        a = Ii(o)
                    }), new ya(o, a)
                }

                function Xn(e) {
                    return e.findMarks(Bo(e.first, 0), e.clipPos(Bo(e.lastLine())), function(e) {
                        return e.parent
                    })
                }

                function Zn(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n],
                            i = r.find(),
                            o = e.clipPos(i.from),
                            a = e.clipPos(i.to);
                        if (_o(o, a)) {
                            var l = Vn(e, o, a, r.primary, r.primary.type);
                            r.markers.push(l), l.parent = r
                        }
                    }
                }

                function Jn(e) {
                    for (var t = 0; t < e.length; t++) {
                        var n = e[t],
                            r = [n.primary.doc];
                        Kr(n.primary.doc, function(e) {
                            r.push(e)
                        });
                        for (var i = 0; i < n.markers.length; i++) {
                            var o = n.markers[i]; - 1 == Pi(r, o.doc) && (o.parent = null, n.markers.splice(i--, 1))
                        }
                    }
                }

                function Qn(e, t, n) {
                    this.marker = e, this.from = t, this.to = n
                }

                function er(e, t) {
                    if (e)
                        for (var n = 0; n < e.length; ++n) {
                            var r = e[n];
                            if (r.marker == t) return r
                        }
                }

                function tr(e, t) {
                    for (var n, r = 0; r < e.length; ++r) e[r] != t && (n || (n = [])).push(e[r]);
                    return n
                }

                function nr(e, t) {
                    e.markedSpans = e.markedSpans ? e.markedSpans.concat([t]) : [t], t.marker.attachLine(e)
                }

                function rr(e, t, n) {
                    if (e)
                        for (var r, i = 0; i < e.length; ++i) {
                            var o = e[i],
                                a = o.marker,
                                l = null == o.from || (a.inclusiveLeft ? o.from <= t : o.from < t);
                            if (l || o.from == t && "bookmark" == a.type && (!n || !o.marker.insertLeft)) {
                                var s = null == o.to || (a.inclusiveRight ? o.to >= t : o.to > t);
                                (r || (r = [])).push(new Qn(a, o.from, s ? null : o.to))
                            }
                        }
                    return r
                }

                function ir(e, t, n) {
                    if (e)
                        for (var r, i = 0; i < e.length; ++i) {
                            var o = e[i],
                                a = o.marker,
                                l = null == o.to || (a.inclusiveRight ? o.to >= t : o.to > t);
                            if (l || o.from == t && "bookmark" == a.type && (!n || o.marker.insertLeft)) {
                                var s = null == o.from || (a.inclusiveLeft ? o.from <= t : o.from < t);
                                (r || (r = [])).push(new Qn(a, s ? null : o.from - t, null == o.to ? null : o.to - t))
                            }
                        }
                    return r
                }

                function or(e, t) {
                    if (t.full) return null;
                    var n = ve(e, t.from.line) && Zr(e, t.from.line).markedSpans,
                        r = ve(e, t.to.line) && Zr(e, t.to.line).markedSpans;
                    if (!n && !r) return null;
                    var i = t.from.ch,
                        o = t.to.ch,
                        a = 0 == _o(t.from, t.to),
                        l = rr(n, i, a),
                        s = ir(r, o, a),
                        c = 1 == t.text.length,
                        u = Ii(t.text).length + (c ? i : 0);
                    if (l)
                        for (var f = 0; f < l.length; ++f) {
                            var h = l[f];
                            if (null == h.to) {
                                var d = er(s, h.marker);
                                d ? c && (h.to = null == d.to ? null : d.to + u) : h.to = i
                            }
                        }
                    if (s)
                        for (var f = 0; f < s.length; ++f) {
                            var h = s[f];
                            if (null != h.to && (h.to += u), null == h.from) {
                                var d = er(l, h.marker);
                                d || (h.from = u, c && (l || (l = [])).push(h))
                            } else h.from += u, c && (l || (l = [])).push(h)
                        }
                    l && (l = ar(l)), s && s != l && (s = ar(s));
                    var p = [l];
                    if (!c) {
                        var m, g = t.text.length - 2;
                        if (g > 0 && l)
                            for (var f = 0; f < l.length; ++f) null == l[f].to && (m || (m = [])).push(new Qn(l[f].marker, null, null));
                        for (var f = 0; g > f; ++f) p.push(m);
                        p.push(s)
                    }
                    return p
                }

                function ar(e) {
                    for (var t = 0; t < e.length; ++t) {
                        var n = e[t];
                        null != n.from && n.from == n.to && n.marker.clearWhenEmpty !== !1 && e.splice(t--, 1)
                    }
                    return e.length ? e : null
                }

                function lr(e, t) {
                    var n = mi(e, t),
                        r = or(e, t);
                    if (!n) return r;
                    if (!r) return n;
                    for (var i = 0; i < n.length; ++i) {
                        var o = n[i],
                            a = r[i];
                        if (o && a) e: for (var l = 0; l < a.length; ++l) {
                            for (var s = a[l], c = 0; c < o.length; ++c)
                                if (o[c].marker == s.marker) continue e;
                            o.push(s)
                        } else a && (n[i] = a)
                    }
                    return n
                }

                function sr(e, t, n) {
                    var r = null;
                    if (e.iter(t.line, n.line + 1, function(e) {
                            if (e.markedSpans)
                                for (var t = 0; t < e.markedSpans.length; ++t) {
                                    var n = e.markedSpans[t].marker;
                                    !n.readOnly || r && -1 != Pi(r, n) || (r || (r = [])).push(n)
                                }
                        }), !r) return null;
                    for (var i = [{
                            from: t,
                            to: n
                        }], o = 0; o < r.length; ++o)
                        for (var a = r[o], l = a.find(0), s = 0; s < i.length; ++s) {
                            var c = i[s];
                            if (!(_o(c.to, l.from) < 0 || _o(c.from, l.to) > 0)) {
                                var u = [s, 1],
                                    f = _o(c.from, l.from),
                                    h = _o(c.to, l.to);
                                (0 > f || !a.inclusiveLeft && !f) && u.push({
                                    from: c.from,
                                    to: l.from
                                }), (h > 0 || !a.inclusiveRight && !h) && u.push({
                                    from: l.to,
                                    to: c.to
                                }), i.splice.apply(i, u), s += u.length - 1
                            }
                        }
                    return i
                }

                function cr(e) {
                    var t = e.markedSpans;
                    if (t) {
                        for (var n = 0; n < t.length; ++n) t[n].marker.detachLine(e);
                        e.markedSpans = null
                    }
                }

                function ur(e, t) {
                    if (t) {
                        for (var n = 0; n < t.length; ++n) t[n].marker.attachLine(e);
                        e.markedSpans = t
                    }
                }

                function fr(e) {
                    return e.inclusiveLeft ? -1 : 0
                }

                function hr(e) {
                    return e.inclusiveRight ? 1 : 0
                }

                function dr(e, t) {
                    var n = e.lines.length - t.lines.length;
                    if (0 != n) return n;
                    var r = e.find(),
                        i = t.find(),
                        o = _o(r.from, i.from) || fr(e) - fr(t);
                    if (o) return -o;
                    var a = _o(r.to, i.to) || hr(e) - hr(t);
                    return a ? a : t.id - e.id
                }

                function pr(e, t) {
                    var n, r = Wo && e.markedSpans;
                    if (r)
                        for (var i, o = 0; o < r.length; ++o) i = r[o], i.marker.collapsed && null == (t ? i.from : i.to) && (!n || dr(n, i.marker) < 0) && (n = i.marker);
                    return n
                }

                function mr(e) {
                    return pr(e, !0)
                }

                function gr(e) {
                    return pr(e, !1)
                }

                function vr(e, t, n, r, i) {
                    var o = Zr(e, t),
                        a = Wo && o.markedSpans;
                    if (a)
                        for (var l = 0; l < a.length; ++l) {
                            var s = a[l];
                            if (s.marker.collapsed) {
                                var c = s.marker.find(0),
                                    u = _o(c.from, n) || fr(s.marker) - fr(i),
                                    f = _o(c.to, r) || hr(s.marker) - hr(i);
                                if (!(u >= 0 && 0 >= f || 0 >= u && f >= 0) && (0 >= u && (s.marker.inclusiveRight && i.inclusiveLeft ? _o(c.to, n) >= 0 : _o(c.to, n) > 0) || u >= 0 && (s.marker.inclusiveRight && i.inclusiveLeft ? _o(c.from, r) <= 0 : _o(c.from, r) < 0))) return !0
                            }
                        }
                }

                function yr(e) {
                    for (var t; t = mr(e);) e = t.find(-1, !0).line;
                    return e
                }

                function xr(e) {
                    for (var t, n; t = gr(e);) e = t.find(1, !0).line, (n || (n = [])).push(e);
                    return n
                }

                function br(e, t) {
                    var n = Zr(e, t),
                        r = yr(n);
                    return n == r ? t : ti(r)
                }

                function wr(e, t) {
                    if (t > e.lastLine()) return t;
                    var n, r = Zr(e, t);
                    if (!kr(e, r)) return t;
                    for (; n = gr(r);) r = n.find(1, !0).line;
                    return ti(r) + 1
                }

                function kr(e, t) {
                    var n = Wo && t.markedSpans;
                    if (n)
                        for (var r, i = 0; i < n.length; ++i)
                            if (r = n[i], r.marker.collapsed) {
                                if (null == r.from) return !0;
                                if (!r.marker.widgetNode && 0 == r.from && r.marker.inclusiveLeft && Sr(e, t, r)) return !0
                            }
                }

                function Sr(e, t, n) {
                    if (null == n.to) {
                        var r = n.marker.find(1, !0);
                        return Sr(e, r.line, er(r.line.markedSpans, n.marker))
                    }
                    if (n.marker.inclusiveRight && n.to == t.text.length) return !0;
                    for (var i, o = 0; o < t.markedSpans.length; ++o)
                        if (i = t.markedSpans[o], i.marker.collapsed && !i.marker.widgetNode && i.from == n.to && (null == i.to || i.to != n.from) && (i.marker.inclusiveLeft || n.marker.inclusiveRight) && Sr(e, t, i)) return !0
                }

                function Cr(e, t, n) {
                    ri(t) < (e.curOp && e.curOp.scrollTop || e.doc.scrollTop) && Wn(e, null, n)
                }

                function Lr(e) {
                    if (null != e.height) return e.height;
                    var t = e.doc.cm;
                    if (!t) return 0;
                    if (!Va(document.body, e.node)) {
                        var n = "position: relative;";
                        e.coverGutter && (n += "margin-left: -" + t.display.gutters.offsetWidth + "px;"), e.noHScroll && (n += "width: " + t.display.wrapper.clientWidth + "px;"), qi(t.display.measure, ji("div", [e.node], null, n))
                    }
                    return e.height = e.node.parentNode.offsetHeight
                }

                function Tr(e, t, n, r) {
                    var i = new xa(e, n, r),
                        o = e.cm;
                    return o && i.noHScroll && (o.display.alignWidgets = !0), zn(e, t, "widget", function(t) {
                        var n = t.widgets || (t.widgets = []);
                        if (null == i.insertAt ? n.push(i) : n.splice(Math.min(n.length - 1, Math.max(0, i.insertAt)), 0, i), i.line = t, o && !kr(e, t)) {
                            var r = ri(t) < e.scrollTop;
                            ei(t, t.height + Lr(i)), r && Wn(o, null, i.height), o.curOp.forceUpdate = !0
                        }
                        return !0
                    }), i
                }

                function Mr(e, t, n, r) {
                    e.text = t, e.stateAfter && (e.stateAfter = null), e.styles && (e.styles = null), null != e.order && (e.order = null), cr(e), ur(e, n);
                    var i = r ? r(e) : 1;
                    i != e.height && ei(e, i)
                }

                function Nr(e) {
                    e.parent = null, cr(e)
                }

                function Ar(e, t) {
                    if (e)
                        for (;;) {
                            var n = e.match(/(?:^|\s+)line-(background-)?(\S+)/);
                            if (!n) break;
                            e = e.slice(0, n.index) + e.slice(n.index + n[0].length);
                            var r = n[1] ? "bgClass" : "textClass";
                            null == t[r] ? t[r] = n[2] : new RegExp("(?:^|s)" + n[2] + "(?:$|s)").test(t[r]) || (t[r] += " " + n[2])
                        }
                    return e
                }

                function Er(t, n) {
                    if (t.blankLine) return t.blankLine(n);
                    if (t.innerMode) {
                        var r = e.innerMode(t, n);
                        return r.mode.blankLine ? r.mode.blankLine(r.state) : void 0
                    }
                }

                function Or(t, n, r, i) {
                    for (var o = 0; 10 > o; o++) {
                        i && (i[0] = e.innerMode(t, r).mode);
                        var a = t.token(n, r);
                        if (n.pos > n.start) return a
                    }
                    throw new Error("Mode " + t.name + " failed to advance stream.")
                }

                function Ir(e, t, n, r) {
                    function i(e) {
                        return {
                            start: f.start,
                            end: f.pos,
                            string: f.current(),
                            type: o || null,
                            state: e ? sa(a.mode, u) : u
                        }
                    }
                    var o, a = e.doc,
                        l = a.mode;
                    t = me(a, t);
                    var s, c = Zr(a, t.line),
                        u = je(e, t.line, n),
                        f = new ma(c.text, e.options.tabSize);
                    for (r && (s = []);
                        (r || f.pos < t.ch) && !f.eol();) f.start = f.pos, o = Or(l, f, u), r && s.push(i(!0));
                    return r ? s : i()
                }

                function Pr(e, t, n, r, i, o, a) {
                    var l = n.flattenSpans;
                    null == l && (l = e.options.flattenSpans);
                    var s, c = 0,
                        u = null,
                        f = new ma(t, e.options.tabSize),
                        h = e.options.addModeClass && [null];
                    for ("" == t && Ar(Er(n, r), o); !f.eol();) {
                        if (f.pos > e.options.maxHighlightLength ? (l = !1, a && Hr(e, t, r, f.pos), f.pos = t.length, s = null) : s = Ar(Or(n, f, r, h), o), h) {
                            var d = h[0].name;
                            d && (s = "m-" + (s ? d + " " + s : d))
                        }
                        if (!l || u != s) {
                            for (; c < f.start;) c = Math.min(f.start, c + 5e4), i(c, u);
                            u = s
                        }
                        f.start = f.pos
                    }
                    for (; c < f.pos;) {
                        var p = Math.min(f.pos, c + 5e4);
                        i(p, u), c = p
                    }
                }

                function Rr(e, t, n, r) {
                    var i = [e.state.modeGen],
                        o = {};
                    Pr(e, t.text, e.doc.mode, n, function(e, t) {
                        i.push(e, t)
                    }, o, r);
                    for (var a = 0; a < e.state.overlays.length; ++a) {
                        var l = e.state.overlays[a],
                            s = 1,
                            c = 0;
                        Pr(e, t.text, l.mode, !0, function(e, t) {
                            for (var n = s; e > c;) {
                                var r = i[s];
                                r > e && i.splice(s, 1, e, i[s + 1], r), s += 2, c = Math.min(e, r)
                            }
                            if (t)
                                if (l.opaque) i.splice(n, s - n, e, "cm-overlay " + t), s = n + 2;
                                else
                                    for (; s > n; n += 2) {
                                        var o = i[n + 1];
                                        i[n + 1] = (o ? o + " " : "") + "cm-overlay " + t
                                    }
                        }, o)
                    }
                    return {
                        styles: i,
                        classes: o.bgClass || o.textClass ? o : null
                    }
                }

                function Dr(e, t, n) {
                    if (!t.styles || t.styles[0] != e.state.modeGen) {
                        var r = je(e, ti(t)),
                            i = Rr(e, t, t.text.length > e.options.maxHighlightLength ? sa(e.doc.mode, r) : r);
                        t.stateAfter = r, t.styles = i.styles, i.classes ? t.styleClasses = i.classes : t.styleClasses && (t.styleClasses = null), n === e.doc.frontier && e.doc.frontier++
                    }
                    return t.styles
                }

                function Hr(e, t, n, r) {
                    var i = e.doc.mode,
                        o = new ma(t, e.options.tabSize);
                    for (o.start = o.pos = r || 0, "" == t && Er(i, n); !o.eol();) Or(i, o, n), o.start = o.pos
                }

                function Wr(e, t) {
                    if (!e || /^\s*$/.test(e)) return null;
                    var n = t.addModeClass ? ka : wa;
                    return n[e] || (n[e] = e.replace(/\S+/g, "cm-$&"))
                }

                function Br(e, t) {
                    var n = ji("span", null, null, wo ? "padding-right: .1px" : null),
                        r = {
                            pre: ji("pre", [n], "CodeMirror-line"),
                            content: n,
                            col: 0,
                            pos: 0,
                            cm: e,
                            splitSpaces: (xo || wo) && e.getOption("lineWrapping")
                        };
                    t.measure = {};
                    for (var i = 0; i <= (t.rest ? t.rest.length : 0); i++) {
                        var o, a = i ? t.rest[i - 1] : t.line;
                        r.pos = 0, r.addToken = Fr, Ji(e.display.measure) && (o = ii(a)) && (r.addToken = jr(r.addToken, o)), r.map = [];
                        var l = t != e.display.externalMeasured && ti(a);
                        qr(a, r, Dr(e, a, l)), a.styleClasses && (a.styleClasses.bgClass && (r.bgClass = $i(a.styleClasses.bgClass, r.bgClass || "")), a.styleClasses.textClass && (r.textClass = $i(a.styleClasses.textClass, r.textClass || ""))), 0 == r.map.length && r.map.push(0, 0, r.content.appendChild(Zi(e.display.measure))), 0 == i ? (t.measure.map = r.map, t.measure.cache = {}) : ((t.measure.maps || (t.measure.maps = [])).push(r.map), (t.measure.caches || (t.measure.caches = [])).push({}))
                    }
                    if (wo) {
                        var s = r.content.lastChild;
                        (/\bcm-tab\b/.test(s.className) || s.querySelector && s.querySelector(".cm-tab")) && (r.content.className = "cm-tab-wrap-hack")
                    }
                    return Pa(e, "renderLine", e, t.line, r.pre), r.pre.className && (r.textClass = $i(r.pre.className, r.textClass || "")), r
                }

                function _r(e) {
                    var t = ji("span", "•", "cm-invalidchar");
                    return t.title = "\\u" + e.charCodeAt(0).toString(16), t.setAttribute("aria-label", t.title), t
                }

                function Fr(e, t, n, r, i, o, a) {
                    if (t) {
                        var l = e.splitSpaces ? t.replace(/ {3,}/g, zr) : t,
                            s = e.cm.state.specialChars,
                            c = !1;
                        if (s.test(t))
                            for (var u = document.createDocumentFragment(), f = 0;;) {
                                s.lastIndex = f;
                                var h = s.exec(t),
                                    d = h ? h.index - f : t.length - f;
                                if (d) {
                                    var p = document.createTextNode(l.slice(f, f + d));
                                    xo && 9 > bo ? u.appendChild(ji("span", [p])) : u.appendChild(p), e.map.push(e.pos, e.pos + d, p), e.col += d, e.pos += d
                                }
                                if (!h) break;
                                if (f += d + 1, "	" == h[0]) {
                                    var m = e.cm.options.tabSize,
                                        g = m - e.col % m,
                                        p = u.appendChild(ji("span", Oi(g), "cm-tab"));
                                    p.setAttribute("role", "presentation"), p.setAttribute("cm-text", "	"), e.col += g
                                } else if ("\r" == h[0] || "\n" == h[0]) {
                                    var p = u.appendChild(ji("span", "\r" == h[0] ? "␍" : "␤", "cm-invalidchar"));
                                    p.setAttribute("cm-text", h[0]), e.col += 1
                                } else {
                                    var p = e.cm.options.specialCharPlaceholder(h[0]);
                                    p.setAttribute("cm-text", h[0]), xo && 9 > bo ? u.appendChild(ji("span", [p])) : u.appendChild(p), e.col += 1
                                }
                                e.map.push(e.pos, e.pos + 1, p), e.pos++
                            } else {
                                e.col += t.length;
                                var u = document.createTextNode(l);
                                e.map.push(e.pos, e.pos + t.length, u), xo && 9 > bo && (c = !0), e.pos += t.length
                            }
                        if (n || r || i || c || a) {
                            var v = n || "";
                            r && (v += r), i && (v += i);
                            var y = ji("span", [u], v, a);
                            return o && (y.title = o), e.content.appendChild(y)
                        }
                        e.content.appendChild(u)
                    }
                }

                function zr(e) {
                    for (var t = " ", n = 0; n < e.length - 2; ++n) t += n % 2 ? " " : " ";
                    return t += " "
                }

                function jr(e, t) {
                    return function(n, r, i, o, a, l, s) {
                        i = i ? i + " cm-force-border" : "cm-force-border";
                        for (var c = n.pos, u = c + r.length;;) {
                            for (var f = 0; f < t.length; f++) {
                                var h = t[f];
                                if (h.to > c && h.from <= c) break
                            }
                            if (h.to >= u) return e(n, r, i, o, a, l, s);
                            e(n, r.slice(0, h.to - c), i, o, null, l, s), o = null, r = r.slice(h.to - c), c = h.to
                        }
                    }
                }

                function Ur(e, t, n, r) {
                    var i = !r && n.widgetNode;
                    i && e.map.push(e.pos, e.pos + t, i), !r && e.cm.display.input.needsContentAttribute && (i || (i = e.content.appendChild(document.createElement("span"))), i.setAttribute("cm-marker", n.id)), i && (e.cm.display.input.setUneditable(i), e.content.appendChild(i)), e.pos += t
                }

                function qr(e, t, n) {
                    var r = e.markedSpans,
                        i = e.text,
                        o = 0;
                    if (r)
                        for (var a, l, s, c, u, f, h, d = i.length, p = 0, m = 1, g = "", v = 0;;) {
                            if (v == p) {
                                s = c = u = f = l = "", h = null, v = 1 / 0;
                                for (var y, x = [], b = 0; b < r.length; ++b) {
                                    var w = r[b],
                                        k = w.marker;
                                    "bookmark" == k.type && w.from == p && k.widgetNode ? x.push(k) : w.from <= p && (null == w.to || w.to > p || k.collapsed && w.to == p && w.from == p) ? (null != w.to && w.to != p && v > w.to && (v = w.to, c = ""), k.className && (s += " " + k.className), k.css && (l = (l ? l + ";" : "") + k.css), k.startStyle && w.from == p && (u += " " + k.startStyle), k.endStyle && w.to == v && (y || (y = [])).push(k.endStyle, w.to), k.title && !f && (f = k.title), k.collapsed && (!h || dr(h.marker, k) < 0) && (h = w)) : w.from > p && v > w.from && (v = w.from)
                                }
                                if (y)
                                    for (var b = 0; b < y.length; b += 2) y[b + 1] == v && (c += " " + y[b]);
                                if (!h || h.from == p)
                                    for (var b = 0; b < x.length; ++b) Ur(t, 0, x[b]);
                                if (h && (h.from || 0) == p) {
                                    if (Ur(t, (null == h.to ? d + 1 : h.to) - p, h.marker, null == h.from), null == h.to) return;
                                    h.to == p && (h = !1)
                                }
                            }
                            if (p >= d) break;
                            for (var S = Math.min(d, v);;) {
                                if (g) {
                                    var C = p + g.length;
                                    if (!h) {
                                        var L = C > S ? g.slice(0, S - p) : g;
                                        t.addToken(t, L, a ? a + s : s, u, p + L.length == v ? c : "", f, l)
                                    }
                                    if (C >= S) {
                                        g = g.slice(S - p), p = S;
                                        break
                                    }
                                    p = C, u = ""
                                }
                                g = i.slice(o, o = n[m++]), a = Wr(n[m++], t.cm.options)
                            }
                        } else
                            for (var m = 1; m < n.length; m += 2) t.addToken(t, i.slice(o, o = n[m]), Wr(n[m + 1], t.cm.options))
                }

                function Gr(e, t) {
                    return 0 == t.from.ch && 0 == t.to.ch && "" == Ii(t.text) && (!e.cm || e.cm.options.wholeLineUpdateBefore)
                }

                function Yr(e, t, n, r) {
                    function i(e) {
                        return n ? n[e] : null
                    }

                    function o(e, n, i) {
                        Mr(e, n, i, r), Ci(e, "change", e, t)
                    }

                    function a(e, t) {
                        for (var n = e, o = []; t > n; ++n) o.push(new ba(c[n], i(n), r));
                        return o
                    }
                    var l = t.from,
                        s = t.to,
                        c = t.text,
                        u = Zr(e, l.line),
                        f = Zr(e, s.line),
                        h = Ii(c),
                        d = i(c.length - 1),
                        p = s.line - l.line;
                    if (t.full) e.insert(0, a(0, c.length)), e.remove(c.length, e.size - c.length);
                    else if (Gr(e, t)) {
                        var m = a(0, c.length - 1);
                        o(f, f.text, d), p && e.remove(l.line, p), m.length && e.insert(l.line, m)
                    } else if (u == f)
                        if (1 == c.length) o(u, u.text.slice(0, l.ch) + h + u.text.slice(s.ch), d);
                        else {
                            var m = a(1, c.length - 1);
                            m.push(new ba(h + u.text.slice(s.ch), d, r)), o(u, u.text.slice(0, l.ch) + c[0], i(0)), e.insert(l.line + 1, m)
                        }
                    else if (1 == c.length) o(u, u.text.slice(0, l.ch) + c[0] + f.text.slice(s.ch), i(0)), e.remove(l.line + 1, p);
                    else {
                        o(u, u.text.slice(0, l.ch) + c[0], i(0)), o(f, h + f.text.slice(s.ch), d);
                        var m = a(1, c.length - 1);
                        p > 1 && e.remove(l.line + 1, p - 1), e.insert(l.line + 1, m)
                    }
                    Ci(e, "change", e, t)
                }

                function $r(e) {
                    this.lines = e, this.parent = null;
                    for (var t = 0, n = 0; t < e.length; ++t) e[t].parent = this, n += e[t].height;
                    this.height = n
                }

                function Vr(e) {
                    this.children = e;
                    for (var t = 0, n = 0, r = 0; r < e.length; ++r) {
                        var i = e[r];
                        t += i.chunkSize(), n += i.height, i.parent = this
                    }
                    this.size = t, this.height = n, this.parent = null
                }

                function Kr(e, t, n) {
                    function r(e, i, o) {
                        if (e.linked)
                            for (var a = 0; a < e.linked.length; ++a) {
                                var l = e.linked[a];
                                if (l.doc != i) {
                                    var s = o && l.sharedHist;
                                    n && !s || (t(l.doc, s), r(l.doc, e, s))
                                }
                            }
                    }
                    r(e, null, !0)
                }

                function Xr(e, t) {
                    if (t.cm) throw new Error("This document is already in use.");
                    e.doc = t, t.cm = e, a(e), n(e), e.options.lineWrapping || h(e), e.options.mode = t.modeOption, Dt(e)
                }

                function Zr(e, t) {
                    if (t -= e.first, 0 > t || t >= e.size) throw new Error("There is no line " + (t + e.first) + " in the document.");
                    for (var n = e; !n.lines;)
                        for (var r = 0;; ++r) {
                            var i = n.children[r],
                                o = i.chunkSize();
                            if (o > t) {
                                n = i;
                                break
                            }
                            t -= o
                        }
                    return n.lines[t]
                }

                function Jr(e, t, n) {
                    var r = [],
                        i = t.line;
                    return e.iter(t.line, n.line + 1, function(e) {
                        var o = e.text;
                        i == n.line && (o = o.slice(0, n.ch)), i == t.line && (o = o.slice(t.ch)), r.push(o), ++i
                    }), r
                }

                function Qr(e, t, n) {
                    var r = [];
                    return e.iter(t, n, function(e) {
                        r.push(e.text)
                    }), r
                }

                function ei(e, t) {
                    var n = t - e.height;
                    if (n)
                        for (var r = e; r; r = r.parent) r.height += n
                }

                function ti(e) {
                    if (null == e.parent) return null;
                    for (var t = e.parent, n = Pi(t.lines, e), r = t.parent; r; t = r, r = r.parent)
                        for (var i = 0; r.children[i] != t; ++i) n += r.children[i].chunkSize();
                    return n + t.first
                }

                function ni(e, t) {
                    var n = e.first;
                    e: do {
                        for (var r = 0; r < e.children.length; ++r) {
                            var i = e.children[r],
                                o = i.height;
                            if (o > t) {
                                e = i;
                                continue e
                            }
                            t -= o, n += i.chunkSize()
                        }
                        return n
                    } while (!e.lines);
                    for (var r = 0; r < e.lines.length; ++r) {
                        var a = e.lines[r],
                            l = a.height;
                        if (l > t) break;
                        t -= l
                    }
                    return n + r
                }

                function ri(e) {
                    e = yr(e);
                    for (var t = 0, n = e.parent, r = 0; r < n.lines.length; ++r) {
                        var i = n.lines[r];
                        if (i == e) break;
                        t += i.height
                    }
                    for (var o = n.parent; o; n = o, o = n.parent)
                        for (var r = 0; r < o.children.length; ++r) {
                            var a = o.children[r];
                            if (a == n) break;
                            t += a.height
                        }
                    return t
                }

                function ii(e) {
                    var t = e.order;
                    return null == t && (t = e.order = ll(e.text)), t
                }

                function oi(e) {
                    this.done = [], this.undone = [], this.undoDepth = 1 / 0, this.lastModTime = this.lastSelTime = 0, this.lastOp = this.lastSelOp = null, this.lastOrigin = this.lastSelOrigin = null, this.generation = this.maxGeneration = e || 1
                }

                function ai(e, t) {
                    var n = {
                        from: $(t.from),
                        to: Qo(t),
                        text: Jr(e, t.from, t.to)
                    };
                    return di(e, n, t.from.line, t.to.line + 1), Kr(e, function(e) {
                        di(e, n, t.from.line, t.to.line + 1)
                    }, !0), n
                }

                function li(e) {
                    for (; e.length;) {
                        var t = Ii(e);
                        if (!t.ranges) break;
                        e.pop()
                    }
                }

                function si(e, t) {
                    return t ? (li(e.done), Ii(e.done)) : e.done.length && !Ii(e.done).ranges ? Ii(e.done) : e.done.length > 1 && !e.done[e.done.length - 2].ranges ? (e.done.pop(), Ii(e.done)) : void 0
                }

                function ci(e, t, n, r) {
                    var i = e.history;
                    i.undone.length = 0;
                    var o, a = +new Date;
                    if ((i.lastOp == r || i.lastOrigin == t.origin && t.origin && ("+" == t.origin.charAt(0) && e.cm && i.lastModTime > a - e.cm.options.historyEventDelay || "*" == t.origin.charAt(0))) && (o = si(i, i.lastOp == r))) {
                        var l = Ii(o.changes);
                        0 == _o(t.from, t.to) && 0 == _o(t.from, l.to) ? l.to = Qo(t) : o.changes.push(ai(e, t))
                    } else {
                        var s = Ii(i.done);
                        for (s && s.ranges || hi(e.sel, i.done), o = {
                                changes: [ai(e, t)],
                                generation: i.generation
                            }, i.done.push(o); i.done.length > i.undoDepth;) i.done.shift(), i.done[0].ranges || i.done.shift()
                    }
                    i.done.push(n), i.generation = ++i.maxGeneration, i.lastModTime = i.lastSelTime = a, i.lastOp = i.lastSelOp = r, i.lastOrigin = i.lastSelOrigin = t.origin, l || Pa(e, "historyAdded")
                }

                function ui(e, t, n, r) {
                    var i = t.charAt(0);
                    return "*" == i || "+" == i && n.ranges.length == r.ranges.length && n.somethingSelected() == r.somethingSelected() && new Date - e.history.lastSelTime <= (e.cm ? e.cm.options.historyEventDelay : 500)
                }

                function fi(e, t, n, r) {
                    var i = e.history,
                        o = r && r.origin;
                    n == i.lastSelOp || o && i.lastSelOrigin == o && (i.lastModTime == i.lastSelTime && i.lastOrigin == o || ui(e, o, Ii(i.done), t)) ? i.done[i.done.length - 1] = t : hi(t, i.done), i.lastSelTime = +new Date, i.lastSelOrigin = o, i.lastSelOp = n, r && r.clearRedo !== !1 && li(i.undone)
                }

                function hi(e, t) {
                    var n = Ii(t);
                    n && n.ranges && n.equals(e) || t.push(e)
                }

                function di(e, t, n, r) {
                    var i = t["spans_" + e.id],
                        o = 0;
                    e.iter(Math.max(e.first, n), Math.min(e.first + e.size, r), function(n) {
                        n.markedSpans && ((i || (i = t["spans_" + e.id] = {}))[o] = n.markedSpans), ++o
                    })
                }

                function pi(e) {
                    if (!e) return null;
                    for (var t, n = 0; n < e.length; ++n) e[n].marker.explicitlyCleared ? t || (t = e.slice(0, n)) : t && t.push(e[n]);
                    return t ? t.length ? t : null : e
                }

                function mi(e, t) {
                    var n = t["spans_" + e.id];
                    if (!n) return null;
                    for (var r = 0, i = []; r < t.text.length; ++r) i.push(pi(n[r]));
                    return i
                }

                function gi(e, t, n) {
                    for (var r = 0, i = []; r < e.length; ++r) {
                        var o = e[r];
                        if (o.ranges) i.push(n ? ue.prototype.deepCopy.call(o) : o);
                        else {
                            var a = o.changes,
                                l = [];
                            i.push({
                                changes: l
                            });
                            for (var s = 0; s < a.length; ++s) {
                                var c, u = a[s];
                                if (l.push({
                                        from: u.from,
                                        to: u.to,
                                        text: u.text
                                    }), t)
                                    for (var f in u)(c = f.match(/^spans_(\d+)$/)) && Pi(t, Number(c[1])) > -1 && (Ii(l)[f] = u[f], delete u[f])
                            }
                        }
                    }
                    return i
                }

                function vi(e, t, n, r) {
                    n < e.line ? e.line += r : t < e.line && (e.line = t, e.ch = 0)
                }

                function yi(e, t, n, r) {
                    for (var i = 0; i < e.length; ++i) {
                        var o = e[i],
                            a = !0;
                        if (o.ranges) {
                            o.copied || (o = e[i] = o.deepCopy(), o.copied = !0);
                            for (var l = 0; l < o.ranges.length; l++) vi(o.ranges[l].anchor, t, n, r), vi(o.ranges[l].head, t, n, r)
                        } else {
                            for (var l = 0; l < o.changes.length; ++l) {
                                var s = o.changes[l];
                                if (n < s.from.line) s.from = Bo(s.from.line + r, s.from.ch), s.to = Bo(s.to.line + r, s.to.ch);
                                else if (t <= s.to.line) {
                                    a = !1;
                                    break
                                }
                            }
                            a || (e.splice(0, i + 1), i = 0)
                        }
                    }
                }

                function xi(e, t) {
                    var n = t.from.line,
                        r = t.to.line,
                        i = t.text.length - (r - n) - 1;
                    yi(e.done, n, r, i), yi(e.undone, n, r, i)
                }

                function bi(e) {
                    return null != e.defaultPrevented ? e.defaultPrevented : 0 == e.returnValue
                }

                function wi(e) {
                    return e.target || e.srcElement
                }

                function ki(e) {
                    var t = e.which;
                    return null == t && (1 & e.button ? t = 1 : 2 & e.button ? t = 3 : 4 & e.button && (t = 2)), Eo && e.ctrlKey && 1 == t && (t = 3), t
                }

                function Si(e, t, n) {
                    var r = e._handlers && e._handlers[t];
                    return n ? r && r.length > 0 ? r.slice() : Oa : r || Oa
                }

                function Ci(e, t) {
                    function n(e) {
                        return function() {
                            e.apply(null, o)
                        }
                    }
                    var r = Si(e, t, !1);
                    if (r.length) {
                        var i, o = Array.prototype.slice.call(arguments, 2);
                        Go ? i = Go.delayedCallbacks : Ra ? i = Ra : (i = Ra = [], setTimeout(Li, 0));
                        for (var a = 0; a < r.length; ++a) i.push(n(r[a]))
                    }
                }

                function Li() {
                    var e = Ra;
                    Ra = null;
                    for (var t = 0; t < e.length; ++t) e[t]()
                }

                function Ti(e, t, n) {
                    return "string" == typeof t && (t = {
                        type: t,
                        preventDefault: function() {
                            this.defaultPrevented = !0
                        }
                    }), Pa(e, n || t.type, e, t), bi(t) || t.codemirrorIgnore
                }

                function Mi(e) {
                    var t = e._handlers && e._handlers.cursorActivity;
                    if (t)
                        for (var n = e.curOp.cursorActivityHandlers || (e.curOp.cursorActivityHandlers = []), r = 0; r < t.length; ++r) - 1 == Pi(n, t[r]) && n.push(t[r])
                }

                function Ni(e, t) {
                    return Si(e, t).length > 0
                }

                function Ai(e) {
                    e.prototype.on = function(e, t) {
                        Ea(this, e, t)
                    }, e.prototype.off = function(e, t) {
                        Ia(this, e, t)
                    }
                }

                function Ei() {
                    this.id = null
                }

                function Oi(e) {
                    for (; ja.length <= e;) ja.push(Ii(ja) + " ");
                    return ja[e]
                }

                function Ii(e) {
                    return e[e.length - 1]
                }

                function Pi(e, t) {
                    for (var n = 0; n < e.length; ++n)
                        if (e[n] == t) return n;
                    return -1
                }

                function Ri(e, t) {
                    for (var n = [], r = 0; r < e.length; r++) n[r] = t(e[r], r);
                    return n
                }

                function Di() {}

                function Hi(e, t) {
                    var n;
                    return Object.create ? n = Object.create(e) : (Di.prototype = e, n = new Di), t && Wi(t, n), n
                }

                function Wi(e, t, n) {
                    t || (t = {});
                    for (var r in e) !e.hasOwnProperty(r) || n === !1 && t.hasOwnProperty(r) || (t[r] = e[r]);
                    return t
                }

                function Bi(e) {
                    var t = Array.prototype.slice.call(arguments, 1);
                    return function() {
                        return e.apply(null, t)
                    }
                }

                function _i(e, t) {
                    return t ? t.source.indexOf("\\w") > -1 && Ya(e) ? !0 : t.test(e) : Ya(e)
                }

                function Fi(e) {
                    for (var t in e)
                        if (e.hasOwnProperty(t) && e[t]) return !1;
                    return !0
                }

                function zi(e) {
                    return e.charCodeAt(0) >= 768 && $a.test(e)
                }

                function ji(e, t, n, r) {
                    var i = document.createElement(e);
                    if (n && (i.className = n), r && (i.style.cssText = r), "string" == typeof t) i.appendChild(document.createTextNode(t));
                    else if (t)
                        for (var o = 0; o < t.length; ++o) i.appendChild(t[o]);
                    return i
                }

                function Ui(e) {
                    for (var t = e.childNodes.length; t > 0; --t) e.removeChild(e.firstChild);
                    return e
                }

                function qi(e, t) {
                    return Ui(e).appendChild(t)
                }

                function Gi() {
                    for (var e = document.activeElement; e && e.root && e.root.activeElement;) e = e.root.activeElement;
                    return e
                }

                function Yi(e) {
                    return new RegExp("(^|\\s)" + e + "(?:$|\\s)\\s*")
                }

                function $i(e, t) {
                    for (var n = e.split(" "), r = 0; r < n.length; r++) n[r] && !Yi(n[r]).test(t) && (t += " " + n[r]);
                    return t
                }

                function Vi(e) {
                    if (document.body.getElementsByClassName)
                        for (var t = document.body.getElementsByClassName("CodeMirror"), n = 0; n < t.length; n++) {
                            var r = t[n].CodeMirror;
                            r && e(r)
                        }
                }

                function Ki() {
                    Qa || (Xi(), Qa = !0)
                }

                function Xi() {
                    var e;
                    Ea(window, "resize", function() {
                        null == e && (e = setTimeout(function() {
                            e = null, Vi(qt)
                        }, 100))
                    }), Ea(window, "blur", function() {
                        Vi(yn)
                    })
                }

                function Zi(e) {
                    if (null == Ka) {
                        var t = ji("span", "​");
                        qi(e, ji("span", [t, document.createTextNode("x")])), 0 != e.firstChild.offsetHeight && (Ka = t.offsetWidth <= 1 && t.offsetHeight > 2 && !(xo && 8 > bo))
                    }
                    var n = Ka ? ji("span", "​") : ji("span", " ", null, "display: inline-block; width: 1px; margin-right: -1px");
                    return n.setAttribute("cm-text", ""), n
                }

                function Ji(e) {
                    if (null != Xa) return Xa;
                    var t = qi(e, document.createTextNode("AخA")),
                        n = qa(t, 0, 1).getBoundingClientRect();
                    if (!n || n.left == n.right) return !1;
                    var r = qa(t, 1, 2).getBoundingClientRect();
                    return Xa = r.right - n.right < 3
                }

                function Qi(e) {
                    if (null != il) return il;
                    var t = qi(e, ji("span", "x")),
                        n = t.getBoundingClientRect(),
                        r = qa(t, 0, 1).getBoundingClientRect();
                    return il = Math.abs(n.left - r.left) > 1
                }

                function eo(e, t, n, r) {
                    if (!e) return r(t, n, "ltr");
                    for (var i = !1, o = 0; o < e.length; ++o) {
                        var a = e[o];
                        (a.from < n && a.to > t || t == n && a.to == t) && (r(Math.max(a.from, t), Math.min(a.to, n), 1 == a.level ? "rtl" : "ltr"), i = !0)
                    }
                    i || r(t, n, "ltr")
                }

                function to(e) {
                    return e.level % 2 ? e.to : e.from
                }

                function no(e) {
                    return e.level % 2 ? e.from : e.to
                }

                function ro(e) {
                    var t = ii(e);
                    return t ? to(t[0]) : 0
                }

                function io(e) {
                    var t = ii(e);
                    return t ? no(Ii(t)) : e.text.length
                }

                function oo(e, t) {
                    var n = Zr(e.doc, t),
                        r = yr(n);
                    r != n && (t = ti(r));
                    var i = ii(r),
                        o = i ? i[0].level % 2 ? io(r) : ro(r) : 0;
                    return Bo(t, o)
                }

                function ao(e, t) {
                    for (var n, r = Zr(e.doc, t); n = gr(r);) r = n.find(1, !0).line, t = null;
                    var i = ii(r),
                        o = i ? i[0].level % 2 ? ro(r) : io(r) : r.text.length;
                    return Bo(null == t ? ti(r) : t, o)
                }

                function lo(e, t) {
                    var n = oo(e, t.line),
                        r = Zr(e.doc, n.line),
                        i = ii(r);
                    if (!i || 0 == i[0].level) {
                        var o = Math.max(0, r.text.search(/\S/)),
                            a = t.line == n.line && t.ch <= o && t.ch;
                        return Bo(n.line, a ? 0 : o)
                    }
                    return n
                }

                function so(e, t, n) {
                    var r = e[0].level;
                    return t == r ? !0 : n == r ? !1 : n > t
                }

                function co(e, t) {
                    al = null;
                    for (var n, r = 0; r < e.length; ++r) {
                        var i = e[r];
                        if (i.from < t && i.to > t) return r;
                        if (i.from == t || i.to == t) {
                            if (null != n) return so(e, i.level, e[n].level) ? (i.from != i.to && (al = n), r) : (i.from != i.to && (al = r), n);
                            n = r
                        }
                    }
                    return n
                }

                function uo(e, t, n, r) {
                    if (!r) return t + n;
                    do t += n; while (t > 0 && zi(e.text.charAt(t)));
                    return t
                }

                function fo(e, t, n, r) {
                    var i = ii(e);
                    if (!i) return ho(e, t, n, r);
                    for (var o = co(i, t), a = i[o], l = uo(e, t, a.level % 2 ? -n : n, r);;) {
                        if (l > a.from && l < a.to) return l;
                        if (l == a.from || l == a.to) return co(i, l) == o ? l : (a = i[o += n], n > 0 == a.level % 2 ? a.to : a.from);
                        if (a = i[o += n], !a) return null;
                        l = n > 0 == a.level % 2 ? uo(e, a.to, -1, r) : uo(e, a.from, 1, r)
                    }
                }

                function ho(e, t, n, r) {
                    var i = t + n;
                    if (r)
                        for (; i > 0 && zi(e.text.charAt(i));) i += n;
                    return 0 > i || i > e.text.length ? null : i
                }
                var po = navigator.userAgent,
                    mo = navigator.platform,
                    go = /gecko\/\d/i.test(po),
                    vo = /MSIE \d/.test(po),
                    yo = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(po),
                    xo = vo || yo,
                    bo = xo && (vo ? document.documentMode || 6 : yo[1]),
                    wo = /WebKit\//.test(po),
                    ko = wo && /Qt\/\d+\.\d+/.test(po),
                    So = /Chrome\//.test(po),
                    Co = /Opera\//.test(po),
                    Lo = /Apple Computer/.test(navigator.vendor),
                    To = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(po),
                    Mo = /PhantomJS/.test(po),
                    No = /AppleWebKit/.test(po) && /Mobile\/\w+/.test(po),
                    Ao = No || /Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(po),
                    Eo = No || /Mac/.test(mo),
                    Oo = /\bCrOS\b/.test(po),
                    Io = /win/i.test(mo),
                    Po = Co && po.match(/Version\/(\d*\.\d*)/);
                Po && (Po = Number(Po[1])), Po && Po >= 15 && (Co = !1, wo = !0);
                var Ro = Eo && (ko || Co && (null == Po || 12.11 > Po)),
                    Do = go || xo && bo >= 9,
                    Ho = !1,
                    Wo = !1;
                m.prototype = Wi({
                    update: function(e) {
                        var t = e.scrollWidth > e.clientWidth + 1,
                            n = e.scrollHeight > e.clientHeight + 1,
                            r = e.nativeBarWidth;
                        if (n) {
                            this.vert.style.display = "block", this.vert.style.bottom = t ? r + "px" : "0";
                            var i = e.viewHeight - (t ? r : 0);
                            this.vert.firstChild.style.height = Math.max(0, e.scrollHeight - e.clientHeight + i) + "px"
                        } else this.vert.style.display = "", this.vert.firstChild.style.height = "0";
                        if (t) {
                            this.horiz.style.display = "block", this.horiz.style.right = n ? r + "px" : "0", this.horiz.style.left = e.barLeft + "px";
                            var o = e.viewWidth - e.barLeft - (n ? r : 0);
                            this.horiz.firstChild.style.width = e.scrollWidth - e.clientWidth + o + "px"
                        } else this.horiz.style.display = "", this.horiz.firstChild.style.width = "0";
                        return !this.checkedZeroWidth && e.clientHeight > 0 && (0 == r && this.zeroWidthHack(), this.checkedZeroWidth = !0), {
                            right: n ? r : 0,
                            bottom: t ? r : 0
                        }
                    },
                    setScrollLeft: function(e) {
                        this.horiz.scrollLeft != e && (this.horiz.scrollLeft = e), this.disableHoriz && this.enableZeroWidthBar(this.horiz, this.disableHoriz)
                    },
                    setScrollTop: function(e) {
                        this.vert.scrollTop != e && (this.vert.scrollTop = e), this.disableVert && this.enableZeroWidthBar(this.vert, this.disableVert)
                    },
                    zeroWidthHack: function() {
                        var e = Eo && !To ? "12px" : "18px";
                        this.horiz.style.height = this.vert.style.width = e, this.horiz.style.pointerEvents = this.vert.style.pointerEvents = "none", this.disableHoriz = new Ei, this.disableVert = new Ei
                    },
                    enableZeroWidthBar: function(e, t) {
                        function n() {
                            var r = e.getBoundingClientRect(),
                                i = document.elementFromPoint(r.left + 1, r.bottom - 1);
                            i != e ? e.style.pointerEvents = "none" : t.set(1e3, n)
                        }
                        e.style.pointerEvents = "auto", t.set(1e3, n)
                    },
                    clear: function() {
                        var e = this.horiz.parentNode;
                        e.removeChild(this.horiz), e.removeChild(this.vert)
                    }
                }, m.prototype), g.prototype = Wi({
                    update: function() {
                        return {
                            bottom: 0,
                            right: 0
                        }
                    },
                    setScrollLeft: function() {},
                    setScrollTop: function() {},
                    clear: function() {}
                }, g.prototype), e.scrollbarModel = {
                    "native": m,
                    "null": g
                }, L.prototype.signal = function(e, t) {
                    Ni(e, t) && this.events.push(arguments)
                }, L.prototype.finish = function() {
                    for (var e = 0; e < this.events.length; e++) Pa.apply(null, this.events[e])
                };
                var Bo = e.Pos = function(e, t) {
                        return this instanceof Bo ? (this.line = e, void(this.ch = t)) : new Bo(e, t)
                    },
                    _o = e.cmpPos = function(e, t) {
                        return e.line - t.line || e.ch - t.ch
                    },
                    Fo = null;
                ne.prototype = Wi({
                    init: function(e) {
                        function t(e) {
                            if (!Ti(r, e)) {
                                if (r.somethingSelected()) Fo = {
                                    lineWise: !1,
                                    text: r.getSelections()
                                }, n.inaccurateSelection && (n.prevInput = "", n.inaccurateSelection = !1, o.value = Fo.text.join("\n"), Ua(o));
                                else {
                                    if (!r.options.lineWiseCopyCut) return;
                                    var t = ee(r);
                                    Fo = {
                                        lineWise: !0,
                                        text: t.text
                                    }, "cut" == e.type ? r.setSelections(t.ranges, null, Wa) : (n.prevInput = "", o.value = t.text.join("\n"), Ua(o))
                                }
                                "cut" == e.type && (r.state.cutIncoming = !0)
                            }
                        }
                        var n = this,
                            r = this.cm,
                            i = this.wrapper = re(),
                            o = this.textarea = i.firstChild;
                        e.wrapper.insertBefore(i, e.wrapper.firstChild), No && (o.style.width = "0px"), Ea(o, "input", function() {
                            xo && bo >= 9 && n.hasSelection && (n.hasSelection = null), n.poll()
                        }), Ea(o, "paste", function(e) {
                            Ti(r, e) || J(e, r) || (r.state.pasteIncoming = !0, n.fastPoll())
                        }), Ea(o, "cut", t), Ea(o, "copy", t), Ea(e.scroller, "paste", function(t) {
                            Gt(e, t) || Ti(r, t) || (r.state.pasteIncoming = !0, n.focus())
                        }), Ea(e.lineSpace, "selectstart", function(t) {
                            Gt(e, t) || Ma(t)
                        }), Ea(o, "compositionstart", function() {
                            var e = r.getCursor("from");
                            n.composing && n.composing.range.clear(), n.composing = {
                                start: e,
                                range: r.markText(e, r.getCursor("to"), {
                                    className: "CodeMirror-composing"
                                })
                            }
                        }), Ea(o, "compositionend", function() {
                            n.composing && (n.poll(), n.composing.range.clear(), n.composing = null)
                        })
                    },
                    prepareSelection: function() {
                        var e = this.cm,
                            t = e.display,
                            n = e.doc,
                            r = De(e);
                        if (e.options.moveInputWithCursor) {
                            var i = dt(e, n.sel.primary().head, "div"),
                                o = t.wrapper.getBoundingClientRect(),
                                a = t.lineDiv.getBoundingClientRect();
                            r.teTop = Math.max(0, Math.min(t.wrapper.clientHeight - 10, i.top + a.top - o.top)), r.teLeft = Math.max(0, Math.min(t.wrapper.clientWidth - 10, i.left + a.left - o.left))
                        }
                        return r
                    },
                    showSelection: function(e) {
                        var t = this.cm,
                            n = t.display;
                        qi(n.cursorDiv, e.cursors), qi(n.selectionDiv, e.selection), null != e.teTop && (this.wrapper.style.top = e.teTop + "px", this.wrapper.style.left = e.teLeft + "px")
                    },
                    reset: function(e) {
                        if (!this.contextMenuPending) {
                            var t, n, r = this.cm,
                                i = r.doc;
                            if (r.somethingSelected()) {
                                this.prevInput = "";
                                var o = i.sel.primary();
                                t = rl && (o.to().line - o.from().line > 100 || (n = r.getSelection()).length > 1e3);
                                var a = t ? "-" : n || r.getSelection();
                                this.textarea.value = a, r.state.focused && Ua(this.textarea), xo && bo >= 9 && (this.hasSelection = a)
                            } else e || (this.prevInput = this.textarea.value = "", xo && bo >= 9 && (this.hasSelection = null));
                            this.inaccurateSelection = t
                        }
                    },
                    getField: function() {
                        return this.textarea
                    },
                    supportsTouch: function() {
                        return !1
                    },
                    focus: function() {
                        if ("nocursor" != this.cm.options.readOnly && (!Ao || Gi() != this.textarea)) try {
                            this.textarea.focus()
                        } catch (e) {}
                    },
                    blur: function() {
                        this.textarea.blur()
                    },
                    resetPosition: function() {
                        this.wrapper.style.top = this.wrapper.style.left = 0;
                    },
                    receivedFocus: function() {
                        this.slowPoll()
                    },
                    slowPoll: function() {
                        var e = this;
                        e.pollingFast || e.polling.set(this.cm.options.pollInterval, function() {
                            e.poll(), e.cm.state.focused && e.slowPoll()
                        })
                    },
                    fastPoll: function() {
                        function e() {
                            var r = n.poll();
                            r || t ? (n.pollingFast = !1, n.slowPoll()) : (t = !0, n.polling.set(60, e))
                        }
                        var t = !1,
                            n = this;
                        n.pollingFast = !0, n.polling.set(20, e)
                    },
                    poll: function() {
                        var e = this.cm,
                            t = this.textarea,
                            n = this.prevInput;
                        if (this.contextMenuPending || !e.state.focused || nl(t) && !n && !this.composing || e.isReadOnly() || e.options.disableInput || e.state.keySeq) return !1;
                        var r = t.value;
                        if (r == n && !e.somethingSelected()) return !1;
                        if (xo && bo >= 9 && this.hasSelection === r || Eo && /[\uf700-\uf7ff]/.test(r)) return e.display.input.reset(), !1;
                        if (e.doc.sel == e.display.selForContextMenu) {
                            var i = r.charCodeAt(0);
                            if (8203 != i || n || (n = "​"), 8666 == i) return this.reset(), this.cm.execCommand("undo")
                        }
                        for (var o = 0, a = Math.min(n.length, r.length); a > o && n.charCodeAt(o) == r.charCodeAt(o);) ++o;
                        var l = this;
                        return At(e, function() {
                            Z(e, r.slice(o), n.length - o, null, l.composing ? "*compose" : null), r.length > 1e3 || r.indexOf("\n") > -1 ? t.value = l.prevInput = "" : l.prevInput = r, l.composing && (l.composing.range.clear(), l.composing.range = e.markText(l.composing.start, e.getCursor("to"), {
                                className: "CodeMirror-composing"
                            }))
                        }), !0
                    },
                    ensurePolled: function() {
                        this.pollingFast && this.poll() && (this.pollingFast = !1)
                    },
                    onKeyPress: function() {
                        xo && bo >= 9 && (this.hasSelection = null), this.fastPoll()
                    },
                    onContextMenu: function(e) {
                        function t() {
                            if (null != a.selectionStart) {
                                var e = i.somethingSelected(),
                                    t = "​" + (e ? a.value : "");
                                a.value = "⇚", a.value = t, r.prevInput = e ? "" : "​", a.selectionStart = 1, a.selectionEnd = t.length, o.selForContextMenu = i.doc.sel
                            }
                        }

                        function n() {
                            if (r.contextMenuPending = !1, r.wrapper.style.cssText = f, a.style.cssText = u, xo && 9 > bo && o.scrollbars.setScrollTop(o.scroller.scrollTop = s), null != a.selectionStart) {
                                (!xo || xo && 9 > bo) && t();
                                var e = 0,
                                    n = function() {
                                        o.selForContextMenu == i.doc.sel && 0 == a.selectionStart && a.selectionEnd > 0 && "​" == r.prevInput ? Et(i, ua.selectAll)(i) : e++ < 10 ? o.detectingSelectAll = setTimeout(n, 500) : o.input.reset()
                                    };
                                o.detectingSelectAll = setTimeout(n, 200)
                            }
                        }
                        var r = this,
                            i = r.cm,
                            o = i.display,
                            a = r.textarea,
                            l = Yt(i, e),
                            s = o.scroller.scrollTop;
                        if (l && !Co) {
                            var c = i.options.resetSelectionOnContextMenu;
                            c && -1 == i.doc.sel.contains(l) && Et(i, Te)(i.doc, de(l), Wa);
                            var u = a.style.cssText,
                                f = r.wrapper.style.cssText;
                            r.wrapper.style.cssText = "position: absolute";
                            var h = r.wrapper.getBoundingClientRect();
                            if (a.style.cssText = "position: absolute; width: 30px; height: 30px; top: " + (e.clientY - h.top - 5) + "px; left: " + (e.clientX - h.left - 5) + "px; z-index: 1000; background: " + (xo ? "rgba(255, 255, 255, .05)" : "transparent") + "; outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);", wo) var d = window.scrollY;
                            if (o.input.focus(), wo && window.scrollTo(null, d), o.input.reset(), i.somethingSelected() || (a.value = r.prevInput = " "), r.contextMenuPending = !0, o.selForContextMenu = i.doc.sel, clearTimeout(o.detectingSelectAll), xo && bo >= 9 && t(), Do) {
                                Aa(e);
                                var p = function() {
                                    Ia(window, "mouseup", p), setTimeout(n, 20)
                                };
                                Ea(window, "mouseup", p)
                            } else setTimeout(n, 50)
                        }
                    },
                    readOnlyChanged: function(e) {
                        e || this.reset()
                    },
                    setUneditable: Di,
                    needsContentAttribute: !1
                }, ne.prototype), ie.prototype = Wi({
                    init: function(e) {
                        function t(e) {
                            if (!Ti(r, e)) {
                                if (r.somethingSelected()) Fo = {
                                    lineWise: !1,
                                    text: r.getSelections()
                                }, "cut" == e.type && r.replaceSelection("", null, "cut");
                                else {
                                    if (!r.options.lineWiseCopyCut) return;
                                    var t = ee(r);
                                    Fo = {
                                        lineWise: !0,
                                        text: t.text
                                    }, "cut" == e.type && r.operation(function() {
                                        r.setSelections(t.ranges, 0, Wa), r.replaceSelection("", null, "cut")
                                    })
                                }
                                if (e.clipboardData && !No) e.preventDefault(), e.clipboardData.clearData(), e.clipboardData.setData("text/plain", Fo.text.join("\n"));
                                else {
                                    var n = re(),
                                        i = n.firstChild;
                                    r.display.lineSpace.insertBefore(n, r.display.lineSpace.firstChild), i.value = Fo.text.join("\n");
                                    var o = document.activeElement;
                                    Ua(i), setTimeout(function() {
                                        r.display.lineSpace.removeChild(n), o.focus()
                                    }, 50)
                                }
                            }
                        }
                        var n = this,
                            r = n.cm,
                            i = n.div = e.lineDiv;
                        te(i), Ea(i, "paste", function(e) {
                            Ti(r, e) || J(e, r)
                        }), Ea(i, "compositionstart", function(e) {
                            var t = e.data;
                            if (n.composing = {
                                    sel: r.doc.sel,
                                    data: t,
                                    startData: t
                                }, t) {
                                var i = r.doc.sel.primary(),
                                    o = r.getLine(i.head.line),
                                    a = o.indexOf(t, Math.max(0, i.head.ch - t.length));
                                a > -1 && a <= i.head.ch && (n.composing.sel = de(Bo(i.head.line, a), Bo(i.head.line, a + t.length)))
                            }
                        }), Ea(i, "compositionupdate", function(e) {
                            n.composing.data = e.data
                        }), Ea(i, "compositionend", function(e) {
                            var t = n.composing;
                            t && (e.data == t.startData || /\u200b/.test(e.data) || (t.data = e.data), setTimeout(function() {
                                t.handled || n.applyComposition(t), n.composing == t && (n.composing = null)
                            }, 50))
                        }), Ea(i, "touchstart", function() {
                            n.forceCompositionEnd()
                        }), Ea(i, "input", function() {
                            n.composing || !r.isReadOnly() && n.pollContent() || At(n.cm, function() {
                                Dt(r)
                            })
                        }), Ea(i, "copy", t), Ea(i, "cut", t)
                    },
                    prepareSelection: function() {
                        var e = De(this.cm, !1);
                        return e.focus = this.cm.state.focused, e
                    },
                    showSelection: function(e, t) {
                        e && this.cm.display.view.length && ((e.focus || t) && this.showPrimarySelection(), this.showMultipleSelections(e))
                    },
                    showPrimarySelection: function() {
                        var e = window.getSelection(),
                            t = this.cm.doc.sel.primary(),
                            n = le(this.cm, e.anchorNode, e.anchorOffset),
                            r = le(this.cm, e.focusNode, e.focusOffset);
                        if (!n || n.bad || !r || r.bad || 0 != _o(K(n, r), t.from()) || 0 != _o(V(n, r), t.to())) {
                            var i = oe(this.cm, t.from()),
                                o = oe(this.cm, t.to());
                            if (i || o) {
                                var a = this.cm.display.view,
                                    l = e.rangeCount && e.getRangeAt(0);
                                if (i) {
                                    if (!o) {
                                        var s = a[a.length - 1].measure,
                                            c = s.maps ? s.maps[s.maps.length - 1] : s.map;
                                        o = {
                                            node: c[c.length - 1],
                                            offset: c[c.length - 2] - c[c.length - 3]
                                        }
                                    }
                                } else i = {
                                    node: a[0].measure.map[2],
                                    offset: 0
                                };
                                try {
                                    var u = qa(i.node, i.offset, o.offset, o.node)
                                } catch (f) {}
                                u && (!go && this.cm.state.focused ? (e.collapse(i.node, i.offset), u.collapsed || e.addRange(u)) : (e.removeAllRanges(), e.addRange(u)), l && null == e.anchorNode ? e.addRange(l) : go && this.startGracePeriod()), this.rememberSelection()
                            }
                        }
                    },
                    startGracePeriod: function() {
                        var e = this;
                        clearTimeout(this.gracePeriod), this.gracePeriod = setTimeout(function() {
                            e.gracePeriod = !1, e.selectionChanged() && e.cm.operation(function() {
                                e.cm.curOp.selectionChanged = !0
                            })
                        }, 20)
                    },
                    showMultipleSelections: function(e) {
                        qi(this.cm.display.cursorDiv, e.cursors), qi(this.cm.display.selectionDiv, e.selection)
                    },
                    rememberSelection: function() {
                        var e = window.getSelection();
                        this.lastAnchorNode = e.anchorNode, this.lastAnchorOffset = e.anchorOffset, this.lastFocusNode = e.focusNode, this.lastFocusOffset = e.focusOffset
                    },
                    selectionInEditor: function() {
                        var e = window.getSelection();
                        if (!e.rangeCount) return !1;
                        var t = e.getRangeAt(0).commonAncestorContainer;
                        return Va(this.div, t)
                    },
                    focus: function() {
                        "nocursor" != this.cm.options.readOnly && this.div.focus()
                    },
                    blur: function() {
                        this.div.blur()
                    },
                    getField: function() {
                        return this.div
                    },
                    supportsTouch: function() {
                        return !0
                    },
                    receivedFocus: function() {
                        function e() {
                            t.cm.state.focused && (t.pollSelection(), t.polling.set(t.cm.options.pollInterval, e))
                        }
                        var t = this;
                        this.selectionInEditor() ? this.pollSelection() : At(this.cm, function() {
                            t.cm.curOp.selectionChanged = !0
                        }), this.polling.set(this.cm.options.pollInterval, e)
                    },
                    selectionChanged: function() {
                        var e = window.getSelection();
                        return e.anchorNode != this.lastAnchorNode || e.anchorOffset != this.lastAnchorOffset || e.focusNode != this.lastFocusNode || e.focusOffset != this.lastFocusOffset
                    },
                    pollSelection: function() {
                        if (!this.composing && !this.gracePeriod && this.selectionChanged()) {
                            var e = window.getSelection(),
                                t = this.cm;
                            this.rememberSelection();
                            var n = le(t, e.anchorNode, e.anchorOffset),
                                r = le(t, e.focusNode, e.focusOffset);
                            n && r && At(t, function() {
                                Te(t.doc, de(n, r), Wa), (n.bad || r.bad) && (t.curOp.selectionChanged = !0)
                            })
                        }
                    },
                    pollContent: function() {
                        var e = this.cm,
                            t = e.display,
                            n = e.doc.sel.primary(),
                            r = n.from(),
                            i = n.to();
                        if (r.line < t.viewFrom || i.line > t.viewTo - 1) return !1;
                        var o;
                        if (r.line == t.viewFrom || 0 == (o = Bt(e, r.line))) var a = ti(t.view[0].line),
                            l = t.view[0].node;
                        else var a = ti(t.view[o].line),
                            l = t.view[o - 1].node.nextSibling;
                        var s = Bt(e, i.line);
                        if (s == t.view.length - 1) var c = t.viewTo - 1,
                            u = t.lineDiv.lastChild;
                        else var c = ti(t.view[s + 1].line) - 1,
                            u = t.view[s + 1].node.previousSibling;
                        for (var f = e.doc.splitLines(ce(e, l, u, a, c)), h = Jr(e.doc, Bo(a, 0), Bo(c, Zr(e.doc, c).text.length)); f.length > 1 && h.length > 1;)
                            if (Ii(f) == Ii(h)) f.pop(), h.pop(), c--;
                            else {
                                if (f[0] != h[0]) break;
                                f.shift(), h.shift(), a++
                            }
                        for (var d = 0, p = 0, m = f[0], g = h[0], v = Math.min(m.length, g.length); v > d && m.charCodeAt(d) == g.charCodeAt(d);) ++d;
                        for (var y = Ii(f), x = Ii(h), b = Math.min(y.length - (1 == f.length ? d : 0), x.length - (1 == h.length ? d : 0)); b > p && y.charCodeAt(y.length - p - 1) == x.charCodeAt(x.length - p - 1);) ++p;
                        f[f.length - 1] = y.slice(0, y.length - p), f[0] = f[0].slice(d);
                        var w = Bo(a, d),
                            k = Bo(c, h.length ? Ii(h).length - p : 0);
                        return f.length > 1 || f[0] || _o(w, k) ? (In(e.doc, f, w, k, "+input"), !0) : void 0
                    },
                    ensurePolled: function() {
                        this.forceCompositionEnd()
                    },
                    reset: function() {
                        this.forceCompositionEnd()
                    },
                    forceCompositionEnd: function() {
                        this.composing && !this.composing.handled && (this.applyComposition(this.composing), this.composing.handled = !0, this.div.blur(), this.div.focus())
                    },
                    applyComposition: function(e) {
                        this.cm.isReadOnly() ? Et(this.cm, Dt)(this.cm) : e.data && e.data != e.startData && Et(this.cm, Z)(this.cm, e.data, 0, e.sel)
                    },
                    setUneditable: function(e) {
                        e.contentEditable = "false"
                    },
                    onKeyPress: function(e) {
                        e.preventDefault(), this.cm.isReadOnly() || Et(this.cm, Z)(this.cm, String.fromCharCode(null == e.charCode ? e.keyCode : e.charCode), 0)
                    },
                    readOnlyChanged: function(e) {
                        this.div.contentEditable = String("nocursor" != e)
                    },
                    onContextMenu: Di,
                    resetPosition: Di,
                    needsContentAttribute: !0
                }, ie.prototype), e.inputStyles = {
                    textarea: ne,
                    contenteditable: ie
                }, ue.prototype = {
                    primary: function() {
                        return this.ranges[this.primIndex]
                    },
                    equals: function(e) {
                        if (e == this) return !0;
                        if (e.primIndex != this.primIndex || e.ranges.length != this.ranges.length) return !1;
                        for (var t = 0; t < this.ranges.length; t++) {
                            var n = this.ranges[t],
                                r = e.ranges[t];
                            if (0 != _o(n.anchor, r.anchor) || 0 != _o(n.head, r.head)) return !1
                        }
                        return !0
                    },
                    deepCopy: function() {
                        for (var e = [], t = 0; t < this.ranges.length; t++) e[t] = new fe($(this.ranges[t].anchor), $(this.ranges[t].head));
                        return new ue(e, this.primIndex)
                    },
                    somethingSelected: function() {
                        for (var e = 0; e < this.ranges.length; e++)
                            if (!this.ranges[e].empty()) return !0;
                        return !1
                    },
                    contains: function(e, t) {
                        t || (t = e);
                        for (var n = 0; n < this.ranges.length; n++) {
                            var r = this.ranges[n];
                            if (_o(t, r.from()) >= 0 && _o(e, r.to()) <= 0) return n
                        }
                        return -1
                    }
                }, fe.prototype = {
                    from: function() {
                        return K(this.anchor, this.head)
                    },
                    to: function() {
                        return V(this.anchor, this.head)
                    },
                    empty: function() {
                        return this.head.line == this.anchor.line && this.head.ch == this.anchor.ch
                    }
                };
                var zo, jo, Uo, qo = {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    },
                    Go = null,
                    Yo = 0,
                    $o = 0,
                    Vo = 0,
                    Ko = null;
                xo ? Ko = -.53 : go ? Ko = 15 : So ? Ko = -.7 : Lo && (Ko = -1 / 3);
                var Xo = function(e) {
                    var t = e.wheelDeltaX,
                        n = e.wheelDeltaY;
                    return null == t && e.detail && e.axis == e.HORIZONTAL_AXIS && (t = e.detail), null == n && e.detail && e.axis == e.VERTICAL_AXIS ? n = e.detail : null == n && (n = e.wheelDelta), {
                        x: t,
                        y: n
                    }
                };
                e.wheelEventPixels = function(e) {
                    var t = Xo(e);
                    return t.x *= Ko, t.y *= Ko, t
                };
                var Zo = new Ei,
                    Jo = null,
                    Qo = e.changeEnd = function(e) {
                        return e.text ? Bo(e.from.line + e.text.length - 1, Ii(e.text).length + (1 == e.text.length ? e.from.ch : 0)) : e.to
                    };
                e.prototype = {
                    constructor: e,
                    focus: function() {
                        window.focus(), this.display.input.focus()
                    },
                    setOption: function(e, t) {
                        var n = this.options,
                            r = n[e];
                        n[e] == t && "mode" != e || (n[e] = t, ta.hasOwnProperty(e) && Et(this, ta[e])(this, t, r))
                    },
                    getOption: function(e) {
                        return this.options[e]
                    },
                    getDoc: function() {
                        return this.doc
                    },
                    addKeyMap: function(e, t) {
                        this.state.keyMaps[t ? "push" : "unshift"]($n(e))
                    },
                    removeKeyMap: function(e) {
                        for (var t = this.state.keyMaps, n = 0; n < t.length; ++n)
                            if (t[n] == e || t[n].name == e) return t.splice(n, 1), !0
                    },
                    addOverlay: Ot(function(t, n) {
                        var r = t.token ? t : e.getMode(this.options, t);
                        if (r.startState) throw new Error("Overlays may not be stateful.");
                        this.state.overlays.push({
                            mode: r,
                            modeSpec: t,
                            opaque: n && n.opaque
                        }), this.state.modeGen++, Dt(this)
                    }),
                    removeOverlay: Ot(function(e) {
                        for (var t = this.state.overlays, n = 0; n < t.length; ++n) {
                            var r = t[n].modeSpec;
                            if (r == e || "string" == typeof e && r.name == e) return t.splice(n, 1), this.state.modeGen++, void Dt(this)
                        }
                    }),
                    indentLine: Ot(function(e, t, n) {
                        "string" != typeof t && "number" != typeof t && (t = null == t ? this.options.smartIndent ? "smart" : "prev" : t ? "add" : "subtract"), ve(this.doc, e) && Fn(this, e, t, n)
                    }),
                    indentSelection: Ot(function(e) {
                        for (var t = this.doc.sel.ranges, n = -1, r = 0; r < t.length; r++) {
                            var i = t[r];
                            if (i.empty()) i.head.line > n && (Fn(this, i.head.line, e, !0), n = i.head.line, r == this.doc.sel.primIndex && Bn(this));
                            else {
                                var o = i.from(),
                                    a = i.to(),
                                    l = Math.max(n, o.line);
                                n = Math.min(this.lastLine(), a.line - (a.ch ? 0 : 1)) + 1;
                                for (var s = l; n > s; ++s) Fn(this, s, e);
                                var c = this.doc.sel.ranges;
                                0 == o.ch && t.length == c.length && c[r].from().ch > 0 && ke(this.doc, r, new fe(o, c[r].to()), Wa)
                            }
                        }
                    }),
                    getTokenAt: function(e, t) {
                        return Ir(this, e, t)
                    },
                    getLineTokens: function(e, t) {
                        return Ir(this, Bo(e), t, !0)
                    },
                    getTokenTypeAt: function(e) {
                        e = me(this.doc, e);
                        var t, n = Dr(this, Zr(this.doc, e.line)),
                            r = 0,
                            i = (n.length - 1) / 2,
                            o = e.ch;
                        if (0 == o) t = n[2];
                        else
                            for (;;) {
                                var a = r + i >> 1;
                                if ((a ? n[2 * a - 1] : 0) >= o) i = a;
                                else {
                                    if (!(n[2 * a + 1] < o)) {
                                        t = n[2 * a + 2];
                                        break
                                    }
                                    r = a + 1
                                }
                            }
                        var l = t ? t.indexOf("cm-overlay ") : -1;
                        return 0 > l ? t : 0 == l ? null : t.slice(0, l - 1)
                    },
                    getModeAt: function(t) {
                        var n = this.doc.mode;
                        return n.innerMode ? e.innerMode(n, this.getTokenAt(t).state).mode : n
                    },
                    getHelper: function(e, t) {
                        return this.getHelpers(e, t)[0]
                    },
                    getHelpers: function(e, t) {
                        var n = [];
                        if (!la.hasOwnProperty(t)) return n;
                        var r = la[t],
                            i = this.getModeAt(e);
                        if ("string" == typeof i[t]) r[i[t]] && n.push(r[i[t]]);
                        else if (i[t])
                            for (var o = 0; o < i[t].length; o++) {
                                var a = r[i[t][o]];
                                a && n.push(a)
                            } else i.helperType && r[i.helperType] ? n.push(r[i.helperType]) : r[i.name] && n.push(r[i.name]);
                        for (var o = 0; o < r._global.length; o++) {
                            var l = r._global[o];
                            l.pred(i, this) && -1 == Pi(n, l.val) && n.push(l.val)
                        }
                        return n
                    },
                    getStateAfter: function(e, t) {
                        var n = this.doc;
                        return e = pe(n, null == e ? n.first + n.size - 1 : e), je(this, e + 1, t)
                    },
                    cursorCoords: function(e, t) {
                        var n, r = this.doc.sel.primary();
                        return n = null == e ? r.head : "object" == typeof e ? me(this.doc, e) : e ? r.from() : r.to(), dt(this, n, t || "page")
                    },
                    charCoords: function(e, t) {
                        return ht(this, me(this.doc, e), t || "page")
                    },
                    coordsChar: function(e, t) {
                        return e = ft(this, e, t || "page"), gt(this, e.left, e.top)
                    },
                    lineAtHeight: function(e, t) {
                        return e = ft(this, {
                            top: e,
                            left: 0
                        }, t || "page").top, ni(this.doc, e + this.display.viewOffset)
                    },
                    heightAtLine: function(e, t) {
                        var n, r = !1;
                        if ("number" == typeof e) {
                            var i = this.doc.first + this.doc.size - 1;
                            e < this.doc.first ? e = this.doc.first : e > i && (e = i, r = !0), n = Zr(this.doc, e)
                        } else n = e;
                        return ut(this, n, {
                            top: 0,
                            left: 0
                        }, t || "page").top + (r ? this.doc.height - ri(n) : 0)
                    },
                    defaultTextHeight: function() {
                        return yt(this.display)
                    },
                    defaultCharWidth: function() {
                        return xt(this.display)
                    },
                    setGutterMarker: Ot(function(e, t, n) {
                        return zn(this.doc, e, "gutter", function(e) {
                            var r = e.gutterMarkers || (e.gutterMarkers = {});
                            return r[t] = n, !n && Fi(r) && (e.gutterMarkers = null), !0
                        })
                    }),
                    clearGutter: Ot(function(e) {
                        var t = this,
                            n = t.doc,
                            r = n.first;
                        n.iter(function(n) {
                            n.gutterMarkers && n.gutterMarkers[e] && (n.gutterMarkers[e] = null, Ht(t, r, "gutter"), Fi(n.gutterMarkers) && (n.gutterMarkers = null)), ++r
                        })
                    }),
                    lineInfo: function(e) {
                        if ("number" == typeof e) {
                            if (!ve(this.doc, e)) return null;
                            var t = e;
                            if (e = Zr(this.doc, e), !e) return null
                        } else {
                            var t = ti(e);
                            if (null == t) return null
                        }
                        return {
                            line: t,
                            handle: e,
                            text: e.text,
                            gutterMarkers: e.gutterMarkers,
                            textClass: e.textClass,
                            bgClass: e.bgClass,
                            wrapClass: e.wrapClass,
                            widgets: e.widgets
                        }
                    },
                    getViewport: function() {
                        return {
                            from: this.display.viewFrom,
                            to: this.display.viewTo
                        }
                    },
                    addWidget: function(e, t, n, r, i) {
                        var o = this.display;
                        e = dt(this, me(this.doc, e));
                        var a = e.bottom,
                            l = e.left;
                        if (t.style.position = "absolute", t.setAttribute("cm-ignore-events", "true"), this.display.input.setUneditable(t), o.sizer.appendChild(t), "over" == r) a = e.top;
                        else if ("above" == r || "near" == r) {
                            var s = Math.max(o.wrapper.clientHeight, this.doc.height),
                                c = Math.max(o.sizer.clientWidth, o.lineSpace.clientWidth);
                            ("above" == r || e.bottom + t.offsetHeight > s) && e.top > t.offsetHeight ? a = e.top - t.offsetHeight : e.bottom + t.offsetHeight <= s && (a = e.bottom), l + t.offsetWidth > c && (l = c - t.offsetWidth)
                        }
                        t.style.top = a + "px", t.style.left = t.style.right = "", "right" == i ? (l = o.sizer.clientWidth - t.offsetWidth, t.style.right = "0px") : ("left" == i ? l = 0 : "middle" == i && (l = (o.sizer.clientWidth - t.offsetWidth) / 2), t.style.left = l + "px"), n && Dn(this, l, a, l + t.offsetWidth, a + t.offsetHeight)
                    },
                    triggerOnKeyDown: Ot(hn),
                    triggerOnKeyPress: Ot(mn),
                    triggerOnKeyUp: pn,
                    execCommand: function(e) {
                        return ua.hasOwnProperty(e) ? ua[e].call(null, this) : void 0
                    },
                    triggerElectric: Ot(function(e) {
                        Q(this, e)
                    }),
                    findPosH: function(e, t, n, r) {
                        var i = 1;
                        0 > t && (i = -1, t = -t);
                        for (var o = 0, a = me(this.doc, e); t > o && (a = Un(this.doc, a, i, n, r), !a.hitSide); ++o);
                        return a
                    },
                    moveH: Ot(function(e, t) {
                        var n = this;
                        n.extendSelectionsBy(function(r) {
                            return n.display.shift || n.doc.extend || r.empty() ? Un(n.doc, r.head, e, t, n.options.rtlMoveVisually) : 0 > e ? r.from() : r.to()
                        }, _a)
                    }),
                    deleteH: Ot(function(e, t) {
                        var n = this.doc.sel,
                            r = this.doc;
                        n.somethingSelected() ? r.replaceSelection("", null, "+delete") : jn(this, function(n) {
                            var i = Un(r, n.head, e, t, !1);
                            return 0 > e ? {
                                from: i,
                                to: n.head
                            } : {
                                from: n.head,
                                to: i
                            }
                        })
                    }),
                    findPosV: function(e, t, n, r) {
                        var i = 1,
                            o = r;
                        0 > t && (i = -1, t = -t);
                        for (var a = 0, l = me(this.doc, e); t > a; ++a) {
                            var s = dt(this, l, "div");
                            if (null == o ? o = s.left : s.left = o, l = qn(this, s, i, n), l.hitSide) break
                        }
                        return l
                    },
                    moveV: Ot(function(e, t) {
                        var n = this,
                            r = this.doc,
                            i = [],
                            o = !n.display.shift && !r.extend && r.sel.somethingSelected();
                        if (r.extendSelectionsBy(function(a) {
                                if (o) return 0 > e ? a.from() : a.to();
                                var l = dt(n, a.head, "div");
                                null != a.goalColumn && (l.left = a.goalColumn), i.push(l.left);
                                var s = qn(n, l, e, t);
                                return "page" == t && a == r.sel.primary() && Wn(n, null, ht(n, s, "div").top - l.top), s
                            }, _a), i.length)
                            for (var a = 0; a < r.sel.ranges.length; a++) r.sel.ranges[a].goalColumn = i[a]
                    }),
                    findWordAt: function(e) {
                        var t = this.doc,
                            n = Zr(t, e.line).text,
                            r = e.ch,
                            i = e.ch;
                        if (n) {
                            var o = this.getHelper(e, "wordChars");
                            (e.xRel < 0 || i == n.length) && r ? --r : ++i;
                            for (var a = n.charAt(r), l = _i(a, o) ? function(e) {
                                    return _i(e, o)
                                } : /\s/.test(a) ? function(e) {
                                    return /\s/.test(e)
                                } : function(e) {
                                    return !/\s/.test(e) && !_i(e)
                                }; r > 0 && l(n.charAt(r - 1));) --r;
                            for (; i < n.length && l(n.charAt(i));) ++i
                        }
                        return new fe(Bo(e.line, r), Bo(e.line, i))
                    },
                    toggleOverwrite: function(e) {
                        null != e && e == this.state.overwrite || ((this.state.overwrite = !this.state.overwrite) ? Ja(this.display.cursorDiv, "CodeMirror-overwrite") : Za(this.display.cursorDiv, "CodeMirror-overwrite"), Pa(this, "overwriteToggle", this, this.state.overwrite))
                    },
                    hasFocus: function() {
                        return this.display.input.getField() == Gi()
                    },
                    isReadOnly: function() {
                        return !(!this.options.readOnly && !this.doc.cantEdit)
                    },
                    scrollTo: Ot(function(e, t) {
                        null == e && null == t || _n(this), null != e && (this.curOp.scrollLeft = e), null != t && (this.curOp.scrollTop = t)
                    }),
                    getScrollInfo: function() {
                        var e = this.display.scroller;
                        return {
                            left: e.scrollLeft,
                            top: e.scrollTop,
                            height: e.scrollHeight - Ye(this) - this.display.barHeight,
                            width: e.scrollWidth - Ye(this) - this.display.barWidth,
                            clientHeight: Ve(this),
                            clientWidth: $e(this)
                        }
                    },
                    scrollIntoView: Ot(function(e, t) {
                        if (null == e ? (e = {
                                from: this.doc.sel.primary().head,
                                to: null
                            }, null == t && (t = this.options.cursorScrollMargin)) : "number" == typeof e ? e = {
                                from: Bo(e, 0),
                                to: null
                            } : null == e.from && (e = {
                                from: e,
                                to: null
                            }), e.to || (e.to = e.from), e.margin = t || 0, null != e.from.line) _n(this), this.curOp.scrollToPos = e;
                        else {
                            var n = Hn(this, Math.min(e.from.left, e.to.left), Math.min(e.from.top, e.to.top) - e.margin, Math.max(e.from.right, e.to.right), Math.max(e.from.bottom, e.to.bottom) + e.margin);
                            this.scrollTo(n.scrollLeft, n.scrollTop)
                        }
                    }),
                    setSize: Ot(function(e, t) {
                        function n(e) {
                            return "number" == typeof e || /^\d+$/.test(String(e)) ? e + "px" : e
                        }
                        var r = this;
                        null != e && (r.display.wrapper.style.width = n(e)), null != t && (r.display.wrapper.style.height = n(t)), r.options.lineWrapping && at(this);
                        var i = r.display.viewFrom;
                        r.doc.iter(i, r.display.viewTo, function(e) {
                            if (e.widgets)
                                for (var t = 0; t < e.widgets.length; t++)
                                    if (e.widgets[t].noHScroll) {
                                        Ht(r, i, "widget");
                                        break
                                    }++i
                        }), r.curOp.forceUpdate = !0, Pa(r, "refresh", this)
                    }),
                    operation: function(e) {
                        return At(this, e)
                    },
                    refresh: Ot(function() {
                        var e = this.display.cachedTextHeight;
                        Dt(this), this.curOp.forceUpdate = !0, lt(this), this.scrollTo(this.doc.scrollLeft, this.doc.scrollTop), u(this), (null == e || Math.abs(e - yt(this.display)) > .5) && a(this), Pa(this, "refresh", this)
                    }),
                    swapDoc: Ot(function(e) {
                        var t = this.doc;
                        return t.cm = null, Xr(this, e), lt(this), this.display.input.reset(), this.scrollTo(e.scrollLeft, e.scrollTop), this.curOp.forceScroll = !0, Ci(this, "swapDoc", this, t), t
                    }),
                    getInputField: function() {
                        return this.display.input.getField()
                    },
                    getWrapperElement: function() {
                        return this.display.wrapper
                    },
                    getScrollerElement: function() {
                        return this.display.scroller
                    },
                    getGutterElement: function() {
                        return this.display.gutters
                    }
                }, Ai(e);
                var ea = e.defaults = {},
                    ta = e.optionHandlers = {},
                    na = e.Init = {
                        toString: function() {
                            return "CodeMirror.Init"
                        }
                    };
                Gn("value", "", function(e, t) {
                    e.setValue(t)
                }, !0), Gn("mode", null, function(e, t) {
                    e.doc.modeOption = t, n(e)
                }, !0), Gn("indentUnit", 2, n, !0), Gn("indentWithTabs", !1), Gn("smartIndent", !0), Gn("tabSize", 4, function(e) {
                    r(e), lt(e), Dt(e)
                }, !0), Gn("lineSeparator", null, function(e, t) {
                    if (e.doc.lineSep = t, t) {
                        var n = [],
                            r = e.doc.first;
                        e.doc.iter(function(e) {
                            for (var i = 0;;) {
                                var o = e.text.indexOf(t, i);
                                if (-1 == o) break;
                                i = o + t.length, n.push(Bo(r, o))
                            }
                            r++
                        });
                        for (var i = n.length - 1; i >= 0; i--) In(e.doc, t, n[i], Bo(n[i].line, n[i].ch + t.length))
                    }
                }), Gn("specialChars", /[\u0000-\u001f\u007f\u00ad\u200b-\u200f\u2028\u2029\ufeff]/g, function(t, n, r) {
                    t.state.specialChars = new RegExp(n.source + (n.test("	") ? "" : "|	"), "g"), r != e.Init && t.refresh()
                }), Gn("specialCharPlaceholder", _r, function(e) {
                    e.refresh()
                }, !0), Gn("electricChars", !0), Gn("inputStyle", Ao ? "contenteditable" : "textarea", function() {
                    throw new Error("inputStyle can not (yet) be changed in a running editor")
                }, !0), Gn("rtlMoveVisually", !Io), Gn("wholeLineUpdateBefore", !0), Gn("theme", "default", function(e) {
                    l(e), s(e)
                }, !0), Gn("keyMap", "default", function(t, n, r) {
                    var i = $n(n),
                        o = r != e.Init && $n(r);
                    o && o.detach && o.detach(t, i), i.attach && i.attach(t, o || null)
                }), Gn("extraKeys", null), Gn("lineWrapping", !1, i, !0), Gn("gutters", [], function(e) {
                    d(e.options), s(e)
                }, !0), Gn("fixedGutter", !0, function(e, t) {
                    e.display.gutters.style.left = t ? C(e.display) + "px" : "0", e.refresh()
                }, !0), Gn("coverGutterNextToScrollbar", !1, function(e) {
                    y(e)
                }, !0), Gn("scrollbarStyle", "native", function(e) {
                    v(e), y(e), e.display.scrollbars.setScrollTop(e.doc.scrollTop), e.display.scrollbars.setScrollLeft(e.doc.scrollLeft)
                }, !0), Gn("lineNumbers", !1, function(e) {
                    d(e.options), s(e)
                }, !0), Gn("firstLineNumber", 1, s, !0), Gn("lineNumberFormatter", function(e) {
                    return e
                }, s, !0), Gn("showCursorWhenSelecting", !1, Re, !0), Gn("resetSelectionOnContextMenu", !0), Gn("lineWiseCopyCut", !0), Gn("readOnly", !1, function(e, t) {
                    "nocursor" == t ? (yn(e), e.display.input.blur(), e.display.disabled = !0) : e.display.disabled = !1, e.display.input.readOnlyChanged(t)
                }), Gn("disableInput", !1, function(e, t) {
                    t || e.display.input.reset()
                }, !0), Gn("dragDrop", !0, Ut), Gn("allowDropFileTypes", null), Gn("cursorBlinkRate", 530), Gn("cursorScrollMargin", 0), Gn("cursorHeight", 1, Re, !0), Gn("singleCursorHeightPerLine", !0, Re, !0), Gn("workTime", 100), Gn("workDelay", 100), Gn("flattenSpans", !0, r, !0), Gn("addModeClass", !1, r, !0), Gn("pollInterval", 100), Gn("undoDepth", 200, function(e, t) {
                    e.doc.history.undoDepth = t
                }), Gn("historyEventDelay", 1250), Gn("viewportMargin", 10, function(e) {
                    e.refresh()
                }, !0), Gn("maxHighlightLength", 1e4, r, !0), Gn("moveInputWithCursor", !0, function(e, t) {
                    t || e.display.input.resetPosition()
                }), Gn("tabindex", null, function(e, t) {
                    e.display.input.getField().tabIndex = t || ""
                }), Gn("autofocus", null);
                var ra = e.modes = {},
                    ia = e.mimeModes = {};
                e.defineMode = function(t, n) {
                    e.defaults.mode || "null" == t || (e.defaults.mode = t), arguments.length > 2 && (n.dependencies = Array.prototype.slice.call(arguments, 2)), ra[t] = n
                }, e.defineMIME = function(e, t) {
                    ia[e] = t
                }, e.resolveMode = function(t) {
                    if ("string" == typeof t && ia.hasOwnProperty(t)) t = ia[t];
                    else if (t && "string" == typeof t.name && ia.hasOwnProperty(t.name)) {
                        var n = ia[t.name];
                        "string" == typeof n && (n = {
                            name: n
                        }), t = Hi(n, t), t.name = n.name
                    } else if ("string" == typeof t && /^[\w\-]+\/[\w\-]+\+xml$/.test(t)) return e.resolveMode("application/xml");
                    return "string" == typeof t ? {
                        name: t
                    } : t || {
                        name: "null"
                    }
                }, e.getMode = function(t, n) {
                    var n = e.resolveMode(n),
                        r = ra[n.name];
                    if (!r) return e.getMode(t, "text/plain");
                    var i = r(t, n);
                    if (oa.hasOwnProperty(n.name)) {
                        var o = oa[n.name];
                        for (var a in o) o.hasOwnProperty(a) && (i.hasOwnProperty(a) && (i["_" + a] = i[a]), i[a] = o[a])
                    }
                    if (i.name = n.name, n.helperType && (i.helperType = n.helperType), n.modeProps)
                        for (var a in n.modeProps) i[a] = n.modeProps[a];
                    return i
                }, e.defineMode("null", function() {
                    return {
                        token: function(e) {
                            e.skipToEnd()
                        }
                    }
                }), e.defineMIME("text/plain", "null");
                var oa = e.modeExtensions = {};
                e.extendMode = function(e, t) {
                    var n = oa.hasOwnProperty(e) ? oa[e] : oa[e] = {};
                    Wi(t, n)
                }, e.defineExtension = function(t, n) {
                    e.prototype[t] = n
                }, e.defineDocExtension = function(e, t) {
                    Ca.prototype[e] = t
                }, e.defineOption = Gn;
                var aa = [];
                e.defineInitHook = function(e) {
                    aa.push(e)
                };
                var la = e.helpers = {};
                e.registerHelper = function(t, n, r) {
                    la.hasOwnProperty(t) || (la[t] = e[t] = {
                        _global: []
                    }), la[t][n] = r
                }, e.registerGlobalHelper = function(t, n, r, i) {
                    e.registerHelper(t, n, i), la[t]._global.push({
                        pred: r,
                        val: i
                    })
                };
                var sa = e.copyState = function(e, t) {
                        if (t === !0) return t;
                        if (e.copyState) return e.copyState(t);
                        var n = {};
                        for (var r in t) {
                            var i = t[r];
                            i instanceof Array && (i = i.concat([])), n[r] = i
                        }
                        return n
                    },
                    ca = e.startState = function(e, t, n) {
                        return e.startState ? e.startState(t, n) : !0
                    };
                e.innerMode = function(e, t) {
                    for (; e.innerMode;) {
                        var n = e.innerMode(t);
                        if (!n || n.mode == e) break;
                        t = n.state, e = n.mode
                    }
                    return n || {
                        mode: e,
                        state: t
                    }
                };
                var ua = e.commands = {
                        selectAll: function(e) {
                            e.setSelection(Bo(e.firstLine(), 0), Bo(e.lastLine()), Wa)
                        },
                        singleSelection: function(e) {
                            e.setSelection(e.getCursor("anchor"), e.getCursor("head"), Wa)
                        },
                        killLine: function(e) {
                            jn(e, function(t) {
                                if (t.empty()) {
                                    var n = Zr(e.doc, t.head.line).text.length;
                                    return t.head.ch == n && t.head.line < e.lastLine() ? {
                                        from: t.head,
                                        to: Bo(t.head.line + 1, 0)
                                    } : {
                                        from: t.head,
                                        to: Bo(t.head.line, n)
                                    }
                                }
                                return {
                                    from: t.from(),
                                    to: t.to()
                                }
                            })
                        },
                        deleteLine: function(e) {
                            jn(e, function(t) {
                                return {
                                    from: Bo(t.from().line, 0),
                                    to: me(e.doc, Bo(t.to().line + 1, 0))
                                }
                            })
                        },
                        delLineLeft: function(e) {
                            jn(e, function(e) {
                                return {
                                    from: Bo(e.from().line, 0),
                                    to: e.from()
                                }
                            })
                        },
                        delWrappedLineLeft: function(e) {
                            jn(e, function(t) {
                                var n = e.charCoords(t.head, "div").top + 5,
                                    r = e.coordsChar({
                                        left: 0,
                                        top: n
                                    }, "div");
                                return {
                                    from: r,
                                    to: t.from()
                                }
                            })
                        },
                        delWrappedLineRight: function(e) {
                            jn(e, function(t) {
                                var n = e.charCoords(t.head, "div").top + 5,
                                    r = e.coordsChar({
                                        left: e.display.lineDiv.offsetWidth + 100,
                                        top: n
                                    }, "div");
                                return {
                                    from: t.from(),
                                    to: r
                                }
                            })
                        },
                        undo: function(e) {
                            e.undo()
                        },
                        redo: function(e) {
                            e.redo()
                        },
                        undoSelection: function(e) {
                            e.undoSelection()
                        },
                        redoSelection: function(e) {
                            e.redoSelection()
                        },
                        goDocStart: function(e) {
                            e.extendSelection(Bo(e.firstLine(), 0))
                        },
                        goDocEnd: function(e) {
                            e.extendSelection(Bo(e.lastLine()))
                        },
                        goLineStart: function(e) {
                            e.extendSelectionsBy(function(t) {
                                return oo(e, t.head.line)
                            }, {
                                origin: "+move",
                                bias: 1
                            })
                        },
                        goLineStartSmart: function(e) {
                            e.extendSelectionsBy(function(t) {
                                return lo(e, t.head)
                            }, {
                                origin: "+move",
                                bias: 1
                            })
                        },
                        goLineEnd: function(e) {
                            e.extendSelectionsBy(function(t) {
                                return ao(e, t.head.line)
                            }, {
                                origin: "+move",
                                bias: -1
                            })
                        },
                        goLineRight: function(e) {
                            e.extendSelectionsBy(function(t) {
                                var n = e.charCoords(t.head, "div").top + 5;
                                return e.coordsChar({
                                    left: e.display.lineDiv.offsetWidth + 100,
                                    top: n
                                }, "div")
                            }, _a)
                        },
                        goLineLeft: function(e) {
                            e.extendSelectionsBy(function(t) {
                                var n = e.charCoords(t.head, "div").top + 5;
                                return e.coordsChar({
                                    left: 0,
                                    top: n
                                }, "div")
                            }, _a)
                        },
                        goLineLeftSmart: function(e) {
                            e.extendSelectionsBy(function(t) {
                                var n = e.charCoords(t.head, "div").top + 5,
                                    r = e.coordsChar({
                                        left: 0,
                                        top: n
                                    }, "div");
                                return r.ch < e.getLine(r.line).search(/\S/) ? lo(e, t.head) : r
                            }, _a)
                        },
                        goLineUp: function(e) {
                            e.moveV(-1, "line")
                        },
                        goLineDown: function(e) {
                            e.moveV(1, "line")
                        },
                        goPageUp: function(e) {
                            e.moveV(-1, "page")
                        },
                        goPageDown: function(e) {
                            e.moveV(1, "page")
                        },
                        goCharLeft: function(e) {
                            e.moveH(-1, "char")
                        },
                        goCharRight: function(e) {
                            e.moveH(1, "char")
                        },
                        goColumnLeft: function(e) {
                            e.moveH(-1, "column")
                        },
                        goColumnRight: function(e) {
                            e.moveH(1, "column")
                        },
                        goWordLeft: function(e) {
                            e.moveH(-1, "word")
                        },
                        goGroupRight: function(e) {
                            e.moveH(1, "group")
                        },
                        goGroupLeft: function(e) {
                            e.moveH(-1, "group")
                        },
                        goWordRight: function(e) {
                            e.moveH(1, "word")
                        },
                        delCharBefore: function(e) {
                            e.deleteH(-1, "char")
                        },
                        delCharAfter: function(e) {
                            e.deleteH(1, "char")
                        },
                        delWordBefore: function(e) {
                            e.deleteH(-1, "word")
                        },
                        delWordAfter: function(e) {
                            e.deleteH(1, "word")
                        },
                        delGroupBefore: function(e) {
                            e.deleteH(-1, "group")
                        },
                        delGroupAfter: function(e) {
                            e.deleteH(1, "group")
                        },
                        indentAuto: function(e) {
                            e.indentSelection("smart")
                        },
                        indentMore: function(e) {
                            e.indentSelection("add")
                        },
                        indentLess: function(e) {
                            e.indentSelection("subtract")
                        },
                        insertTab: function(e) {
                            e.replaceSelection("	")
                        },
                        insertSoftTab: function(e) {
                            for (var t = [], n = e.listSelections(), r = e.options.tabSize, i = 0; i < n.length; i++) {
                                var o = n[i].from(),
                                    a = Fa(e.getLine(o.line), o.ch, r);
                                t.push(Oi(r - a % r))
                            }
                            e.replaceSelections(t)
                        },
                        defaultTab: function(e) {
                            e.somethingSelected() ? e.indentSelection("add") : e.execCommand("insertTab")
                        },
                        transposeChars: function(e) {
                            At(e, function() {
                                for (var t = e.listSelections(), n = [], r = 0; r < t.length; r++) {
                                    var i = t[r].head,
                                        o = Zr(e.doc, i.line).text;
                                    if (o)
                                        if (i.ch == o.length && (i = new Bo(i.line, i.ch - 1)), i.ch > 0) i = new Bo(i.line, i.ch + 1), e.replaceRange(o.charAt(i.ch - 1) + o.charAt(i.ch - 2), Bo(i.line, i.ch - 2), i, "+transpose");
                                        else if (i.line > e.doc.first) {
                                        var a = Zr(e.doc, i.line - 1).text;
                                        a && e.replaceRange(o.charAt(0) + e.doc.lineSeparator() + a.charAt(a.length - 1), Bo(i.line - 1, a.length - 1), Bo(i.line, 1), "+transpose")
                                    }
                                    n.push(new fe(i, i))
                                }
                                e.setSelections(n)
                            })
                        },
                        newlineAndIndent: function(e) {
                            At(e, function() {
                                for (var t = e.listSelections().length, n = 0; t > n; n++) {
                                    var r = e.listSelections()[n];
                                    e.replaceRange(e.doc.lineSeparator(), r.anchor, r.head, "+input"), e.indentLine(r.from().line + 1, null, !0)
                                }
                                Bn(e)
                            })
                        },
                        openLine: function(e) {
                            e.replaceSelection("\n", "start")
                        },
                        toggleOverwrite: function(e) {
                            e.toggleOverwrite()
                        }
                    },
                    fa = e.keyMap = {};
                fa.basic = {
                    Left: "goCharLeft",
                    Right: "goCharRight",
                    Up: "goLineUp",
                    Down: "goLineDown",
                    End: "goLineEnd",
                    Home: "goLineStartSmart",
                    PageUp: "goPageUp",
                    PageDown: "goPageDown",
                    Delete: "delCharAfter",
                    Backspace: "delCharBefore",
                    "Shift-Backspace": "delCharBefore",
                    Tab: "defaultTab",
                    "Shift-Tab": "indentAuto",
                    Enter: "newlineAndIndent",
                    Insert: "toggleOverwrite",
                    Esc: "singleSelection"
                }, fa.pcDefault = {
                    "Ctrl-A": "selectAll",
                    "Ctrl-D": "deleteLine",
                    "Ctrl-Z": "undo",
                    "Shift-Ctrl-Z": "redo",
                    "Ctrl-Y": "redo",
                    "Ctrl-Home": "goDocStart",
                    "Ctrl-End": "goDocEnd",
                    "Ctrl-Up": "goLineUp",
                    "Ctrl-Down": "goLineDown",
                    "Ctrl-Left": "goGroupLeft",
                    "Ctrl-Right": "goGroupRight",
                    "Alt-Left": "goLineStart",
                    "Alt-Right": "goLineEnd",
                    "Ctrl-Backspace": "delGroupBefore",
                    "Ctrl-Delete": "delGroupAfter",
                    "Ctrl-S": "save",
                    "Ctrl-F": "find",
                    "Ctrl-G": "findNext",
                    "Shift-Ctrl-G": "findPrev",
                    "Shift-Ctrl-F": "replace",
                    "Shift-Ctrl-R": "replaceAll",
                    "Ctrl-[": "indentLess",
                    "Ctrl-]": "indentMore",
                    "Ctrl-U": "undoSelection",
                    "Shift-Ctrl-U": "redoSelection",
                    "Alt-U": "redoSelection",
                    fallthrough: "basic"
                }, fa.emacsy = {
                    "Ctrl-F": "goCharRight",
                    "Ctrl-B": "goCharLeft",
                    "Ctrl-P": "goLineUp",
                    "Ctrl-N": "goLineDown",
                    "Alt-F": "goWordRight",
                    "Alt-B": "goWordLeft",
                    "Ctrl-A": "goLineStart",
                    "Ctrl-E": "goLineEnd",
                    "Ctrl-V": "goPageDown",
                    "Shift-Ctrl-V": "goPageUp",
                    "Ctrl-D": "delCharAfter",
                    "Ctrl-H": "delCharBefore",
                    "Alt-D": "delWordAfter",
                    "Alt-Backspace": "delWordBefore",
                    "Ctrl-K": "killLine",
                    "Ctrl-T": "transposeChars",
                    "Ctrl-O": "openLine"
                }, fa.macDefault = {
                    "Cmd-A": "selectAll",
                    "Cmd-D": "deleteLine",
                    "Cmd-Z": "undo",
                    "Shift-Cmd-Z": "redo",
                    "Cmd-Y": "redo",
                    "Cmd-Home": "goDocStart",
                    "Cmd-Up": "goDocStart",
                    "Cmd-End": "goDocEnd",
                    "Cmd-Down": "goDocEnd",
                    "Alt-Left": "goGroupLeft",
                    "Alt-Right": "goGroupRight",
                    "Cmd-Left": "goLineLeft",
                    "Cmd-Right": "goLineRight",
                    "Alt-Backspace": "delGroupBefore",
                    "Ctrl-Alt-Backspace": "delGroupAfter",
                    "Alt-Delete": "delGroupAfter",
                    "Cmd-S": "save",
                    "Cmd-F": "find",
                    "Cmd-G": "findNext",
                    "Shift-Cmd-G": "findPrev",
                    "Cmd-Alt-F": "replace",
                    "Shift-Cmd-Alt-F": "replaceAll",
                    "Cmd-[": "indentLess",
                    "Cmd-]": "indentMore",
                    "Cmd-Backspace": "delWrappedLineLeft",
                    "Cmd-Delete": "delWrappedLineRight",
                    "Cmd-U": "undoSelection",
                    "Shift-Cmd-U": "redoSelection",
                    "Ctrl-Up": "goDocStart",
                    "Ctrl-Down": "goDocEnd",
                    fallthrough: ["basic", "emacsy"]
                }, fa["default"] = Eo ? fa.macDefault : fa.pcDefault, e.normalizeKeyMap = function(e) {
                    var t = {};
                    for (var n in e)
                        if (e.hasOwnProperty(n)) {
                            var r = e[n];
                            if (/^(name|fallthrough|(de|at)tach)$/.test(n)) continue;
                            if ("..." == r) {
                                delete e[n];
                                continue
                            }
                            for (var i = Ri(n.split(" "), Yn), o = 0; o < i.length; o++) {
                                var a, l;
                                o == i.length - 1 ? (l = i.join(" "), a = r) : (l = i.slice(0, o + 1).join(" "), a = "...");
                                var s = t[l];
                                if (s) {
                                    if (s != a) throw new Error("Inconsistent bindings for " + l)
                                } else t[l] = a
                            }
                            delete e[n]
                        }
                    for (var c in t) e[c] = t[c];
                    return e
                };
                var ha = e.lookupKey = function(e, t, n, r) {
                        t = $n(t);
                        var i = t.call ? t.call(e, r) : t[e];
                        if (i === !1) return "nothing";
                        if ("..." === i) return "multi";
                        if (null != i && n(i)) return "handled";
                        if (t.fallthrough) {
                            if ("[object Array]" != Object.prototype.toString.call(t.fallthrough)) return ha(e, t.fallthrough, n, r);
                            for (var o = 0; o < t.fallthrough.length; o++) {
                                var a = ha(e, t.fallthrough[o], n, r);
                                if (a) return a
                            }
                        }
                    },
                    da = e.isModifierKey = function(e) {
                        var t = "string" == typeof e ? e : ol[e.keyCode];
                        return "Ctrl" == t || "Alt" == t || "Shift" == t || "Mod" == t
                    },
                    pa = e.keyName = function(e, t) {
                        if (Co && 34 == e.keyCode && e["char"]) return !1;
                        var n = ol[e.keyCode],
                            r = n;
                        return null == r || e.altGraphKey ? !1 : (e.altKey && "Alt" != n && (r = "Alt-" + r), (Ro ? e.metaKey : e.ctrlKey) && "Ctrl" != n && (r = "Ctrl-" + r), (Ro ? e.ctrlKey : e.metaKey) && "Cmd" != n && (r = "Cmd-" + r), !t && e.shiftKey && "Shift" != n && (r = "Shift-" + r), r)
                    };
                e.fromTextArea = function(t, n) {
                    function r() {
                        t.value = c.getValue()
                    }
                    if (n = n ? Wi(n) : {}, n.value = t.value, !n.tabindex && t.tabIndex && (n.tabindex = t.tabIndex), !n.placeholder && t.placeholder && (n.placeholder = t.placeholder), null == n.autofocus) {
                        var i = Gi();
                        n.autofocus = i == t || null != t.getAttribute("autofocus") && i == document.body
                    }
                    if (t.form && (Ea(t.form, "submit", r), !n.leaveSubmitMethodAlone)) {
                        var o = t.form,
                            a = o.submit;
                        try {
                            var l = o.submit = function() {
                                r(), o.submit = a, o.submit(), o.submit = l
                            }
                        } catch (s) {}
                    }
                    n.finishInit = function(e) {
                        e.save = r, e.getTextArea = function() {
                            return t
                        }, e.toTextArea = function() {
                            e.toTextArea = isNaN, r(), t.parentNode.removeChild(e.getWrapperElement()), t.style.display = "", t.form && (Ia(t.form, "submit", r), "function" == typeof t.form.submit && (t.form.submit = a))
                        }
                    }, t.style.display = "none";
                    var c = e(function(e) {
                        t.parentNode.insertBefore(e, t.nextSibling)
                    }, n);
                    return c
                };
                var ma = e.StringStream = function(e, t) {
                    this.pos = this.start = 0, this.string = e, this.tabSize = t || 8, this.lastColumnPos = this.lastColumnValue = 0, this.lineStart = 0
                };
                ma.prototype = {
                    eol: function() {
                        return this.pos >= this.string.length
                    },
                    sol: function() {
                        return this.pos == this.lineStart
                    },
                    peek: function() {
                        return this.string.charAt(this.pos) || void 0
                    },
                    next: function() {
                        return this.pos < this.string.length ? this.string.charAt(this.pos++) : void 0
                    },
                    eat: function(e) {
                        var t = this.string.charAt(this.pos);
                        if ("string" == typeof e) var n = t == e;
                        else var n = t && (e.test ? e.test(t) : e(t));
                        return n ? (++this.pos, t) : void 0
                    },
                    eatWhile: function(e) {
                        for (var t = this.pos; this.eat(e););
                        return this.pos > t
                    },
                    eatSpace: function() {
                        for (var e = this.pos;
                            /[\s\u00a0]/.test(this.string.charAt(this.pos));) ++this.pos;
                        return this.pos > e
                    },
                    skipToEnd: function() {
                        this.pos = this.string.length
                    },
                    skipTo: function(e) {
                        var t = this.string.indexOf(e, this.pos);
                        return t > -1 ? (this.pos = t, !0) : void 0
                    },
                    backUp: function(e) {
                        this.pos -= e
                    },
                    column: function() {
                        return this.lastColumnPos < this.start && (this.lastColumnValue = Fa(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue), this.lastColumnPos = this.start), this.lastColumnValue - (this.lineStart ? Fa(this.string, this.lineStart, this.tabSize) : 0)
                    },
                    indentation: function() {
                        return Fa(this.string, null, this.tabSize) - (this.lineStart ? Fa(this.string, this.lineStart, this.tabSize) : 0)
                    },
                    match: function(e, t, n) {
                        if ("string" != typeof e) {
                            var r = this.string.slice(this.pos).match(e);
                            return r && r.index > 0 ? null : (r && t !== !1 && (this.pos += r[0].length), r)
                        }
                        var i = function(e) {
                                return n ? e.toLowerCase() : e
                            },
                            o = this.string.substr(this.pos, e.length);
                        return i(o) == i(e) ? (t !== !1 && (this.pos += e.length), !0) : void 0
                    },
                    current: function() {
                        return this.string.slice(this.start, this.pos)
                    },
                    hideFirstChars: function(e, t) {
                        this.lineStart += e;
                        try {
                            return t()
                        } finally {
                            this.lineStart -= e
                        }
                    }
                };
                var ga = 0,
                    va = e.TextMarker = function(e, t) {
                        this.lines = [], this.type = t, this.doc = e, this.id = ++ga
                    };
                Ai(va), va.prototype.clear = function() {
                    if (!this.explicitlyCleared) {
                        var e = this.doc.cm,
                            t = e && !e.curOp;
                        if (t && bt(e), Ni(this, "clear")) {
                            var n = this.find();
                            n && Ci(this, "clear", n.from, n.to)
                        }
                        for (var r = null, i = null, o = 0; o < this.lines.length; ++o) {
                            var a = this.lines[o],
                                l = er(a.markedSpans, this);
                            e && !this.collapsed ? Ht(e, ti(a), "text") : e && (null != l.to && (i = ti(a)), null != l.from && (r = ti(a))), a.markedSpans = tr(a.markedSpans, l), null == l.from && this.collapsed && !kr(this.doc, a) && e && ei(a, yt(e.display))
                        }
                        if (e && this.collapsed && !e.options.lineWrapping)
                            for (var o = 0; o < this.lines.length; ++o) {
                                var s = yr(this.lines[o]),
                                    c = f(s);
                                c > e.display.maxLineLength && (e.display.maxLine = s, e.display.maxLineLength = c, e.display.maxLineChanged = !0)
                            }
                        null != r && e && this.collapsed && Dt(e, r, i + 1), this.lines.length = 0, this.explicitlyCleared = !0, this.atomic && this.doc.cantEdit && (this.doc.cantEdit = !1, e && Ae(e.doc)), e && Ci(e, "markerCleared", e, this), t && kt(e), this.parent && this.parent.clear()
                    }
                }, va.prototype.find = function(e, t) {
                    null == e && "bookmark" == this.type && (e = 1);
                    for (var n, r, i = 0; i < this.lines.length; ++i) {
                        var o = this.lines[i],
                            a = er(o.markedSpans, this);
                        if (null != a.from && (n = Bo(t ? o : ti(o), a.from), -1 == e)) return n;
                        if (null != a.to && (r = Bo(t ? o : ti(o), a.to), 1 == e)) return r
                    }
                    return n && {
                        from: n,
                        to: r
                    }
                }, va.prototype.changed = function() {
                    var e = this.find(-1, !0),
                        t = this,
                        n = this.doc.cm;
                    e && n && At(n, function() {
                        var r = e.line,
                            i = ti(e.line),
                            o = Qe(n, i);
                        if (o && (ot(o), n.curOp.selectionChanged = n.curOp.forceUpdate = !0), n.curOp.updateMaxLine = !0, !kr(t.doc, r) && null != t.height) {
                            var a = t.height;
                            t.height = null;
                            var l = Lr(t) - a;
                            l && ei(r, r.height + l)
                        }
                    })
                }, va.prototype.attachLine = function(e) {
                    if (!this.lines.length && this.doc.cm) {
                        var t = this.doc.cm.curOp;
                        t.maybeHiddenMarkers && -1 != Pi(t.maybeHiddenMarkers, this) || (t.maybeUnhiddenMarkers || (t.maybeUnhiddenMarkers = [])).push(this)
                    }
                    this.lines.push(e)
                }, va.prototype.detachLine = function(e) {
                    if (this.lines.splice(Pi(this.lines, e), 1), !this.lines.length && this.doc.cm) {
                        var t = this.doc.cm.curOp;
                        (t.maybeHiddenMarkers || (t.maybeHiddenMarkers = [])).push(this)
                    }
                };
                var ga = 0,
                    ya = e.SharedTextMarker = function(e, t) {
                        this.markers = e, this.primary = t;
                        for (var n = 0; n < e.length; ++n) e[n].parent = this
                    };
                Ai(ya), ya.prototype.clear = function() {
                    if (!this.explicitlyCleared) {
                        this.explicitlyCleared = !0;
                        for (var e = 0; e < this.markers.length; ++e) this.markers[e].clear();
                        Ci(this, "clear")
                    }
                }, ya.prototype.find = function(e, t) {
                    return this.primary.find(e, t)
                };
                var xa = e.LineWidget = function(e, t, n) {
                    if (n)
                        for (var r in n) n.hasOwnProperty(r) && (this[r] = n[r]);
                    this.doc = e, this.node = t
                };
                Ai(xa), xa.prototype.clear = function() {
                    var e = this.doc.cm,
                        t = this.line.widgets,
                        n = this.line,
                        r = ti(n);
                    if (null != r && t) {
                        for (var i = 0; i < t.length; ++i) t[i] == this && t.splice(i--, 1);
                        t.length || (n.widgets = null);
                        var o = Lr(this);
                        ei(n, Math.max(0, n.height - o)), e && At(e, function() {
                            Cr(e, n, -o), Ht(e, r, "widget")
                        })
                    }
                }, xa.prototype.changed = function() {
                    var e = this.height,
                        t = this.doc.cm,
                        n = this.line;
                    this.height = null;
                    var r = Lr(this) - e;
                    r && (ei(n, n.height + r), t && At(t, function() {
                        t.curOp.forceUpdate = !0, Cr(t, n, r)
                    }))
                };
                var ba = e.Line = function(e, t, n) {
                    this.text = e, ur(this, t), this.height = n ? n(this) : 1
                };
                Ai(ba), ba.prototype.lineNo = function() {
                    return ti(this)
                };
                var wa = {},
                    ka = {};
                $r.prototype = {
                    chunkSize: function() {
                        return this.lines.length
                    },
                    removeInner: function(e, t) {
                        for (var n = e, r = e + t; r > n; ++n) {
                            var i = this.lines[n];
                            this.height -= i.height, Nr(i), Ci(i, "delete")
                        }
                        this.lines.splice(e, t)
                    },
                    collapse: function(e) {
                        e.push.apply(e, this.lines)
                    },
                    insertInner: function(e, t, n) {
                        this.height += n, this.lines = this.lines.slice(0, e).concat(t).concat(this.lines.slice(e));
                        for (var r = 0; r < t.length; ++r) t[r].parent = this
                    },
                    iterN: function(e, t, n) {
                        for (var r = e + t; r > e; ++e)
                            if (n(this.lines[e])) return !0
                    }
                }, Vr.prototype = {
                    chunkSize: function() {
                        return this.size
                    },
                    removeInner: function(e, t) {
                        this.size -= t;
                        for (var n = 0; n < this.children.length; ++n) {
                            var r = this.children[n],
                                i = r.chunkSize();
                            if (i > e) {
                                var o = Math.min(t, i - e),
                                    a = r.height;
                                if (r.removeInner(e, o), this.height -= a - r.height, i == o && (this.children.splice(n--, 1), r.parent = null), 0 == (t -= o)) break;
                                e = 0
                            } else e -= i
                        }
                        if (this.size - t < 25 && (this.children.length > 1 || !(this.children[0] instanceof $r))) {
                            var l = [];
                            this.collapse(l), this.children = [new $r(l)], this.children[0].parent = this
                        }
                    },
                    collapse: function(e) {
                        for (var t = 0; t < this.children.length; ++t) this.children[t].collapse(e)
                    },
                    insertInner: function(e, t, n) {
                        this.size += t.length, this.height += n;
                        for (var r = 0; r < this.children.length; ++r) {
                            var i = this.children[r],
                                o = i.chunkSize();
                            if (o >= e) {
                                if (i.insertInner(e, t, n), i.lines && i.lines.length > 50) {
                                    for (var a = i.lines.length % 25 + 25, l = a; l < i.lines.length;) {
                                        var s = new $r(i.lines.slice(l, l += 25));
                                        i.height -= s.height, this.children.splice(++r, 0, s), s.parent = this
                                    }
                                    i.lines = i.lines.slice(0, a), this.maybeSpill()
                                }
                                break
                            }
                            e -= o
                        }
                    },
                    maybeSpill: function() {
                        if (!(this.children.length <= 10)) {
                            var e = this;
                            do {
                                var t = e.children.splice(e.children.length - 5, 5),
                                    n = new Vr(t);
                                if (e.parent) {
                                    e.size -= n.size, e.height -= n.height;
                                    var r = Pi(e.parent.children, e);
                                    e.parent.children.splice(r + 1, 0, n)
                                } else {
                                    var i = new Vr(e.children);
                                    i.parent = e, e.children = [i, n], e = i
                                }
                                n.parent = e.parent
                            } while (e.children.length > 10);
                            e.parent.maybeSpill()
                        }
                    },
                    iterN: function(e, t, n) {
                        for (var r = 0; r < this.children.length; ++r) {
                            var i = this.children[r],
                                o = i.chunkSize();
                            if (o > e) {
                                var a = Math.min(t, o - e);
                                if (i.iterN(e, a, n)) return !0;
                                if (0 == (t -= a)) break;
                                e = 0
                            } else e -= o
                        }
                    }
                };
                var Sa = 0,
                    Ca = e.Doc = function(e, t, n, r) {
                        if (!(this instanceof Ca)) return new Ca(e, t, n, r);
                        null == n && (n = 0), Vr.call(this, [new $r([new ba("", null)])]), this.first = n, this.scrollTop = this.scrollLeft = 0, this.cantEdit = !1, this.cleanGeneration = 1, this.frontier = n;
                        var i = Bo(n, 0);
                        this.sel = de(i), this.history = new oi(null), this.id = ++Sa, this.modeOption = t, this.lineSep = r, this.extend = !1, "string" == typeof e && (e = this.splitLines(e)), Yr(this, {
                            from: i,
                            to: i,
                            text: e
                        }), Te(this, de(i), Wa)
                    };
                Ca.prototype = Hi(Vr.prototype, {
                    constructor: Ca,
                    iter: function(e, t, n) {
                        n ? this.iterN(e - this.first, t - e, n) : this.iterN(this.first, this.first + this.size, e)
                    },
                    insert: function(e, t) {
                        for (var n = 0, r = 0; r < t.length; ++r) n += t[r].height;
                        this.insertInner(e - this.first, t, n)
                    },
                    remove: function(e, t) {
                        this.removeInner(e - this.first, t)
                    },
                    getValue: function(e) {
                        var t = Qr(this, this.first, this.first + this.size);
                        return e === !1 ? t : t.join(e || this.lineSeparator())
                    },
                    setValue: It(function(e) {
                        var t = Bo(this.first, 0),
                            n = this.first + this.size - 1;
                        Tn(this, {
                            from: t,
                            to: Bo(n, Zr(this, n).text.length),
                            text: this.splitLines(e),
                            origin: "setValue",
                            full: !0
                        }, !0), Te(this, de(t))
                    }),
                    replaceRange: function(e, t, n, r) {
                        t = me(this, t), n = n ? me(this, n) : t, In(this, e, t, n, r)
                    },
                    getRange: function(e, t, n) {
                        var r = Jr(this, me(this, e), me(this, t));
                        return n === !1 ? r : r.join(n || this.lineSeparator())
                    },
                    getLine: function(e) {
                        var t = this.getLineHandle(e);
                        return t && t.text
                    },
                    getLineHandle: function(e) {
                        return ve(this, e) ? Zr(this, e) : void 0
                    },
                    getLineNumber: function(e) {
                        return ti(e)
                    },
                    getLineHandleVisualStart: function(e) {
                        return "number" == typeof e && (e = Zr(this, e)), yr(e)
                    },
                    lineCount: function() {
                        return this.size
                    },
                    firstLine: function() {
                        return this.first
                    },
                    lastLine: function() {
                        return this.first + this.size - 1
                    },
                    clipPos: function(e) {
                        return me(this, e)
                    },
                    getCursor: function(e) {
                        var t, n = this.sel.primary();
                        return t = null == e || "head" == e ? n.head : "anchor" == e ? n.anchor : "end" == e || "to" == e || e === !1 ? n.to() : n.from()
                    },
                    listSelections: function() {
                        return this.sel.ranges
                    },
                    somethingSelected: function() {
                        return this.sel.somethingSelected()
                    },
                    setCursor: It(function(e, t, n) {
                        Se(this, me(this, "number" == typeof e ? Bo(e, t || 0) : e), null, n)
                    }),
                    setSelection: It(function(e, t, n) {
                        Se(this, me(this, e), me(this, t || e), n)
                    }),
                    extendSelection: It(function(e, t, n) {
                        be(this, me(this, e), t && me(this, t), n)
                    }),
                    extendSelections: It(function(e, t) {
                        we(this, ye(this, e), t)
                    }),
                    extendSelectionsBy: It(function(e, t) {
                        var n = Ri(this.sel.ranges, e);
                        we(this, ye(this, n), t)
                    }),
                    setSelections: It(function(e, t, n) {
                        if (e.length) {
                            for (var r = 0, i = []; r < e.length; r++) i[r] = new fe(me(this, e[r].anchor), me(this, e[r].head));
                            null == t && (t = Math.min(e.length - 1, this.sel.primIndex)), Te(this, he(i, t), n)
                        }
                    }),
                    addSelection: It(function(e, t, n) {
                        var r = this.sel.ranges.slice(0);
                        r.push(new fe(me(this, e), me(this, t || e))), Te(this, he(r, r.length - 1), n)
                    }),
                    getSelection: function(e) {
                        for (var t, n = this.sel.ranges, r = 0; r < n.length; r++) {
                            var i = Jr(this, n[r].from(), n[r].to());
                            t = t ? t.concat(i) : i
                        }
                        return e === !1 ? t : t.join(e || this.lineSeparator())
                    },
                    getSelections: function(e) {
                        for (var t = [], n = this.sel.ranges, r = 0; r < n.length; r++) {
                            var i = Jr(this, n[r].from(), n[r].to());
                            e !== !1 && (i = i.join(e || this.lineSeparator())), t[r] = i
                        }
                        return t
                    },
                    replaceSelection: function(e, t, n) {
                        for (var r = [], i = 0; i < this.sel.ranges.length; i++) r[i] = e;
                        this.replaceSelections(r, t, n || "+input")
                    },
                    replaceSelections: It(function(e, t, n) {
                        for (var r = [], i = this.sel, o = 0; o < i.ranges.length; o++) {
                            var a = i.ranges[o];
                            r[o] = {
                                from: a.from(),
                                to: a.to(),
                                text: this.splitLines(e[o]),
                                origin: n
                            }
                        }
                        for (var l = t && "end" != t && Cn(this, r, t), o = r.length - 1; o >= 0; o--) Tn(this, r[o]);
                        l ? Le(this, l) : this.cm && Bn(this.cm)
                    }),
                    undo: It(function() {
                        Nn(this, "undo")
                    }),
                    redo: It(function() {
                        Nn(this, "redo")
                    }),
                    undoSelection: It(function() {
                        Nn(this, "undo", !0)
                    }),
                    redoSelection: It(function() {
                        Nn(this, "redo", !0)
                    }),
                    setExtending: function(e) {
                        this.extend = e
                    },
                    getExtending: function() {
                        return this.extend
                    },
                    historySize: function() {
                        for (var e = this.history, t = 0, n = 0, r = 0; r < e.done.length; r++) e.done[r].ranges || ++t;
                        for (var r = 0; r < e.undone.length; r++) e.undone[r].ranges || ++n;
                        return {
                            undo: t,
                            redo: n
                        }
                    },
                    clearHistory: function() {
                        this.history = new oi(this.history.maxGeneration)
                    },
                    markClean: function() {
                        this.cleanGeneration = this.changeGeneration(!0)
                    },
                    changeGeneration: function(e) {
                        return e && (this.history.lastOp = this.history.lastSelOp = this.history.lastOrigin = null), this.history.generation
                    },
                    isClean: function(e) {
                        return this.history.generation == (e || this.cleanGeneration)
                    },
                    getHistory: function() {
                        return {
                            done: gi(this.history.done),
                            undone: gi(this.history.undone)
                        }
                    },
                    setHistory: function(e) {
                        var t = this.history = new oi(this.history.maxGeneration);
                        t.done = gi(e.done.slice(0), null, !0), t.undone = gi(e.undone.slice(0), null, !0)
                    },
                    addLineClass: It(function(e, t, n) {
                        return zn(this, e, "gutter" == t ? "gutter" : "class", function(e) {
                            var r = "text" == t ? "textClass" : "background" == t ? "bgClass" : "gutter" == t ? "gutterClass" : "wrapClass";
                            if (e[r]) {
                                if (Yi(n).test(e[r])) return !1;
                                e[r] += " " + n
                            } else e[r] = n;
                            return !0
                        })
                    }),
                    removeLineClass: It(function(e, t, n) {
                        return zn(this, e, "gutter" == t ? "gutter" : "class", function(e) {
                            var r = "text" == t ? "textClass" : "background" == t ? "bgClass" : "gutter" == t ? "gutterClass" : "wrapClass",
                                i = e[r];
                            if (!i) return !1;
                            if (null == n) e[r] = null;
                            else {
                                var o = i.match(Yi(n));
                                if (!o) return !1;
                                var a = o.index + o[0].length;
                                e[r] = i.slice(0, o.index) + (o.index && a != i.length ? " " : "") + i.slice(a) || null
                            }
                            return !0
                        })
                    }),
                    addLineWidget: It(function(e, t, n) {
                        return Tr(this, e, t, n)
                    }),
                    removeLineWidget: function(e) {
                        e.clear()
                    },
                    markText: function(e, t, n) {
                        return Vn(this, me(this, e), me(this, t), n, n && n.type || "range")
                    },
                    setBookmark: function(e, t) {
                        var n = {
                            replacedWith: t && (null == t.nodeType ? t.widget : t),
                            insertLeft: t && t.insertLeft,
                            clearWhenEmpty: !1,
                            shared: t && t.shared,
                            handleMouseEvents: t && t.handleMouseEvents
                        };
                        return e = me(this, e), Vn(this, e, e, n, "bookmark")
                    },
                    findMarksAt: function(e) {
                        e = me(this, e);
                        var t = [],
                            n = Zr(this, e.line).markedSpans;
                        if (n)
                            for (var r = 0; r < n.length; ++r) {
                                var i = n[r];
                                (null == i.from || i.from <= e.ch) && (null == i.to || i.to >= e.ch) && t.push(i.marker.parent || i.marker)
                            }
                        return t
                    },
                    findMarks: function(e, t, n) {
                        e = me(this, e), t = me(this, t);
                        var r = [],
                            i = e.line;
                        return this.iter(e.line, t.line + 1, function(o) {
                            var a = o.markedSpans;
                            if (a)
                                for (var l = 0; l < a.length; l++) {
                                    var s = a[l];
                                    null != s.to && i == e.line && e.ch >= s.to || null == s.from && i != e.line || null != s.from && i == t.line && s.from >= t.ch || n && !n(s.marker) || r.push(s.marker.parent || s.marker)
                                }++i
                        }), r
                    },
                    getAllMarks: function() {
                        var e = [];
                        return this.iter(function(t) {
                            var n = t.markedSpans;
                            if (n)
                                for (var r = 0; r < n.length; ++r) null != n[r].from && e.push(n[r].marker)
                        }), e
                    },
                    posFromIndex: function(e) {
                        var t, n = this.first,
                            r = this.lineSeparator().length;
                        return this.iter(function(i) {
                            var o = i.text.length + r;
                            return o > e ? (t = e, !0) : (e -= o, void++n)
                        }), me(this, Bo(n, t))
                    },
                    indexFromPos: function(e) {
                        e = me(this, e);
                        var t = e.ch;
                        if (e.line < this.first || e.ch < 0) return 0;
                        var n = this.lineSeparator().length;
                        return this.iter(this.first, e.line, function(e) {
                            t += e.text.length + n
                        }), t
                    },
                    copy: function(e) {
                        var t = new Ca(Qr(this, this.first, this.first + this.size), this.modeOption, this.first, this.lineSep);
                        return t.scrollTop = this.scrollTop, t.scrollLeft = this.scrollLeft, t.sel = this.sel, t.extend = !1, e && (t.history.undoDepth = this.history.undoDepth, t.setHistory(this.getHistory())), t
                    },
                    linkedDoc: function(e) {
                        e || (e = {});
                        var t = this.first,
                            n = this.first + this.size;
                        null != e.from && e.from > t && (t = e.from), null != e.to && e.to < n && (n = e.to);
                        var r = new Ca(Qr(this, t, n), e.mode || this.modeOption, t, this.lineSep);
                        return e.sharedHist && (r.history = this.history), (this.linked || (this.linked = [])).push({
                            doc: r,
                            sharedHist: e.sharedHist
                        }), r.linked = [{
                            doc: this,
                            isParent: !0,
                            sharedHist: e.sharedHist
                        }], Zn(r, Xn(this)), r
                    },
                    unlinkDoc: function(t) {
                        if (t instanceof e && (t = t.doc), this.linked)
                            for (var n = 0; n < this.linked.length; ++n) {
                                var r = this.linked[n];
                                if (r.doc == t) {
                                    this.linked.splice(n, 1), t.unlinkDoc(this), Jn(Xn(this));
                                    break
                                }
                            }
                        if (t.history == this.history) {
                            var i = [t.id];
                            Kr(t, function(e) {
                                i.push(e.id)
                            }, !0), t.history = new oi(null), t.history.done = gi(this.history.done, i), t.history.undone = gi(this.history.undone, i)
                        }
                    },
                    iterLinkedDocs: function(e) {
                        Kr(this, e)
                    },
                    getMode: function() {
                        return this.mode
                    },
                    getEditor: function() {
                        return this.cm
                    },
                    splitLines: function(e) {
                        return this.lineSep ? e.split(this.lineSep) : tl(e)
                    },
                    lineSeparator: function() {
                        return this.lineSep || "\n"
                    }
                }), Ca.prototype.eachLine = Ca.prototype.iter;
                var La = "iter insert remove copy getEditor constructor".split(" ");
                for (var Ta in Ca.prototype) Ca.prototype.hasOwnProperty(Ta) && Pi(La, Ta) < 0 && (e.prototype[Ta] = function(e) {
                    return function() {
                        return e.apply(this.doc, arguments)
                    }
                }(Ca.prototype[Ta]));
                Ai(Ca);
                var Ma = e.e_preventDefault = function(e) {
                        e.preventDefault ? e.preventDefault() : e.returnValue = !1
                    },
                    Na = e.e_stopPropagation = function(e) {
                        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0
                    },
                    Aa = e.e_stop = function(e) {
                        Ma(e), Na(e)
                    },
                    Ea = e.on = function(e, t, n) {
                        if (e.addEventListener) e.addEventListener(t, n, !1);
                        else if (e.attachEvent) e.attachEvent("on" + t, n);
                        else {
                            var r = e._handlers || (e._handlers = {}),
                                i = r[t] || (r[t] = []);
                            i.push(n)
                        }
                    },
                    Oa = [],
                    Ia = e.off = function(e, t, n) {
                        if (e.removeEventListener) e.removeEventListener(t, n, !1);
                        else if (e.detachEvent) e.detachEvent("on" + t, n);
                        else
                            for (var r = Si(e, t, !1), i = 0; i < r.length; ++i)
                                if (r[i] == n) {
                                    r.splice(i, 1);
                                    break
                                }
                    },
                    Pa = e.signal = function(e, t) {
                        var n = Si(e, t, !0);
                        if (n.length)
                            for (var r = Array.prototype.slice.call(arguments, 2), i = 0; i < n.length; ++i) n[i].apply(null, r)
                    },
                    Ra = null,
                    Da = 30,
                    Ha = e.Pass = {
                        toString: function() {
                            return "CodeMirror.Pass"
                        }
                    },
                    Wa = {
                        scroll: !1
                    },
                    Ba = {
                        origin: "*mouse"
                    },
                    _a = {
                        origin: "+move"
                    };
                Ei.prototype.set = function(e, t) {
                    clearTimeout(this.id), this.id = setTimeout(t, e)
                };
                var Fa = e.countColumn = function(e, t, n, r, i) {
                        null == t && (t = e.search(/[^\s\u00a0]/), -1 == t && (t = e.length));
                        for (var o = r || 0, a = i || 0;;) {
                            var l = e.indexOf("	", o);
                            if (0 > l || l >= t) return a + (t - o);
                            a += l - o, a += n - a % n, o = l + 1
                        }
                    },
                    za = e.findColumn = function(e, t, n) {
                        for (var r = 0, i = 0;;) {
                            var o = e.indexOf("	", r); - 1 == o && (o = e.length);
                            var a = o - r;
                            if (o == e.length || i + a >= t) return r + Math.min(a, t - i);
                            if (i += o - r, i += n - i % n, r = o + 1, i >= t) return r
                        }
                    },
                    ja = [""],
                    Ua = function(e) {
                        e.select()
                    };
                No ? Ua = function(e) {
                    e.selectionStart = 0, e.selectionEnd = e.value.length
                } : xo && (Ua = function(e) {
                    try {
                        e.select()
                    } catch (t) {}
                });
                var qa, Ga = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/,
                    Ya = e.isWordChar = function(e) {
                        return /\w/.test(e) || e > "" && (e.toUpperCase() != e.toLowerCase() || Ga.test(e))
                    },
                    $a = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
                qa = document.createRange ? function(e, t, n, r) {
                    var i = document.createRange();
                    return i.setEnd(r || e, n), i.setStart(e, t), i
                } : function(e, t, n) {
                    var r = document.body.createTextRange();
                    try {
                        r.moveToElementText(e.parentNode)
                    } catch (i) {
                        return r
                    }
                    return r.collapse(!0), r.moveEnd("character", n), r.moveStart("character", t), r
                };
                var Va = e.contains = function(e, t) {
                    if (3 == t.nodeType && (t = t.parentNode), e.contains) return e.contains(t);
                    do
                        if (11 == t.nodeType && (t = t.host), t == e) return !0; while (t = t.parentNode)
                };
                xo && 11 > bo && (Gi = function() {
                    try {
                        return document.activeElement
                    } catch (e) {
                        return document.body
                    }
                });
                var Ka, Xa, Za = e.rmClass = function(e, t) {
                        var n = e.className,
                            r = Yi(t).exec(n);
                        if (r) {
                            var i = n.slice(r.index + r[0].length);
                            e.className = n.slice(0, r.index) + (i ? r[1] + i : "")
                        }
                    },
                    Ja = e.addClass = function(e, t) {
                        var n = e.className;
                        Yi(t).test(n) || (e.className += (n ? " " : "") + t)
                    },
                    Qa = !1,
                    el = function() {
                        if (xo && 9 > bo) return !1;
                        var e = ji("div");
                        return "draggable" in e || "dragDrop" in e
                    }(),
                    tl = e.splitLines = 3 != "\n\nb".split(/\n/).length ? function(e) {
                        for (var t = 0, n = [], r = e.length; r >= t;) {
                            var i = e.indexOf("\n", t); - 1 == i && (i = e.length);
                            var o = e.slice(t, "\r" == e.charAt(i - 1) ? i - 1 : i),
                                a = o.indexOf("\r"); - 1 != a ? (n.push(o.slice(0, a)), t += a + 1) : (n.push(o), t = i + 1)
                        }
                        return n
                    } : function(e) {
                        return e.split(/\r\n?|\n/)
                    },
                    nl = window.getSelection ? function(e) {
                        try {
                            return e.selectionStart != e.selectionEnd
                        } catch (t) {
                            return !1
                        }
                    } : function(e) {
                        try {
                            var t = e.ownerDocument.selection.createRange()
                        } catch (n) {}
                        return t && t.parentElement() == e ? 0 != t.compareEndPoints("StartToEnd", t) : !1
                    },
                    rl = function() {
                        var e = ji("div");
                        return "oncopy" in e ? !0 : (e.setAttribute("oncopy", "return;"), "function" == typeof e.oncopy)
                    }(),
                    il = null,
                    ol = e.keyNames = {
                        3: "Enter",
                        8: "Backspace",
                        9: "Tab",
                        13: "Enter",
                        16: "Shift",
                        17: "Ctrl",
                        18: "Alt",
                        19: "Pause",
                        20: "CapsLock",
                        27: "Esc",
                        32: "Space",
                        33: "PageUp",
                        34: "PageDown",
                        35: "End",
                        36: "Home",
                        37: "Left",
                        38: "Up",
                        39: "Right",
                        40: "Down",
                        44: "PrintScrn",
                        45: "Insert",
                        46: "Delete",
                        59: ";",
                        61: "=",
                        91: "Mod",
                        92: "Mod",
                        93: "Mod",
                        106: "*",
                        107: "=",
                        109: "-",
                        110: ".",
                        111: "/",
                        127: "Delete",
                        173: "-",
                        186: ";",
                        187: "=",
                        188: ",",
                        189: "-",
                        190: ".",
                        191: "/",
                        192: "`",
                        219: "[",
                        220: "\\",
                        221: "]",
                        222: "'",
                        63232: "Up",
                        63233: "Down",
                        63234: "Left",
                        63235: "Right",
                        63272: "Delete",
                        63273: "Home",
                        63275: "End",
                        63276: "PageUp",
                        63277: "PageDown",
                        63302: "Insert"
                    };
                ! function() {
                    for (var e = 0; 10 > e; e++) ol[e + 48] = ol[e + 96] = String(e);
                    for (var e = 65; 90 >= e; e++) ol[e] = String.fromCharCode(e);
                    for (var e = 1; 12 >= e; e++) ol[e + 111] = ol[e + 63235] = "F" + e
                }();
                var al, ll = function() {
                    function e(e) {
                        return 247 >= e ? n.charAt(e) : e >= 1424 && 1524 >= e ? "R" : e >= 1536 && 1773 >= e ? r.charAt(e - 1536) : e >= 1774 && 2220 >= e ? "r" : e >= 8192 && 8203 >= e ? "w" : 8204 == e ? "b" : "L"
                    }

                    function t(e, t, n) {
                        this.level = e, this.from = t, this.to = n
                    }
                    var n = "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN",
                        r = "rrrrrrrrrrrr,rNNmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmrrrrrrrnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmNmmmm",
                        i = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/,
                        o = /[stwN]/,
                        a = /[LRr]/,
                        l = /[Lb1n]/,
                        s = /[1n]/,
                        c = "L";
                    return function(n) {
                        if (!i.test(n)) return !1;
                        for (var r, u = n.length, f = [], h = 0; u > h; ++h) f.push(r = e(n.charCodeAt(h)));
                        for (var h = 0, d = c; u > h; ++h) {
                            var r = f[h];
                            "m" == r ? f[h] = d : d = r
                        }
                        for (var h = 0, p = c; u > h; ++h) {
                            var r = f[h];
                            "1" == r && "r" == p ? f[h] = "n" : a.test(r) && (p = r, "r" == r && (f[h] = "R"))
                        }
                        for (var h = 1, d = f[0]; u - 1 > h; ++h) {
                            var r = f[h];
                            "+" == r && "1" == d && "1" == f[h + 1] ? f[h] = "1" : "," != r || d != f[h + 1] || "1" != d && "n" != d || (f[h] = d), d = r
                        }
                        for (var h = 0; u > h; ++h) {
                            var r = f[h];
                            if ("," == r) f[h] = "N";
                            else if ("%" == r) {
                                for (var m = h + 1; u > m && "%" == f[m]; ++m);
                                for (var g = h && "!" == f[h - 1] || u > m && "1" == f[m] ? "1" : "N", v = h; m > v; ++v) f[v] = g;
                                h = m - 1
                            }
                        }
                        for (var h = 0, p = c; u > h; ++h) {
                            var r = f[h];
                            "L" == p && "1" == r ? f[h] = "L" : a.test(r) && (p = r)
                        }
                        for (var h = 0; u > h; ++h)
                            if (o.test(f[h])) {
                                for (var m = h + 1; u > m && o.test(f[m]); ++m);
                                for (var y = "L" == (h ? f[h - 1] : c), x = "L" == (u > m ? f[m] : c), g = y || x ? "L" : "R", v = h; m > v; ++v) f[v] = g;
                                h = m - 1
                            }
                        for (var b, w = [], h = 0; u > h;)
                            if (l.test(f[h])) {
                                var k = h;
                                for (++h; u > h && l.test(f[h]); ++h);
                                w.push(new t(0, k, h))
                            } else {
                                var S = h,
                                    C = w.length;
                                for (++h; u > h && "L" != f[h]; ++h);
                                for (var v = S; h > v;)
                                    if (s.test(f[v])) {
                                        v > S && w.splice(C, 0, new t(1, S, v));
                                        var L = v;
                                        for (++v; h > v && s.test(f[v]); ++v);
                                        w.splice(C, 0, new t(2, L, v)), S = v
                                    } else ++v;
                                h > S && w.splice(C, 0, new t(1, S, h))
                            }
                        return 1 == w[0].level && (b = n.match(/^\s+/)) && (w[0].from = b[0].length, w.unshift(new t(0, 0, b[0].length))), 1 == Ii(w).level && (b = n.match(/\s+$/)) && (Ii(w).to -= b[0].length, w.push(new t(0, u - b[0].length, u))), 2 == w[0].level && w.unshift(new t(1, w[0].to, w[0].to)), w[0].level != Ii(w).level && w.push(new t(w[0].level, u, u)), w
                    }
                }();
                return e.version = "5.15.2", e
            })
        }, {}],
        11: [function(t, n, r) {
            ! function(i) {
                "object" == typeof r && "object" == typeof n ? i(t("../../lib/codemirror"), t("../markdown/markdown"), t("../../addon/mode/overlay")) : "function" == typeof e && e.amd ? e(["../../lib/codemirror", "../markdown/markdown", "../../addon/mode/overlay"], i) : i(CodeMirror)
            }(function(e) {
                "use strict";
                var t = /^((?:(?:aaas?|about|acap|adiumxtra|af[ps]|aim|apt|attachment|aw|beshare|bitcoin|bolo|callto|cap|chrome(?:-extension)?|cid|coap|com-eventbrite-attendee|content|crid|cvs|data|dav|dict|dlna-(?:playcontainer|playsingle)|dns|doi|dtn|dvb|ed2k|facetime|feed|file|finger|fish|ftp|geo|gg|git|gizmoproject|go|gopher|gtalk|h323|hcp|https?|iax|icap|icon|im|imap|info|ipn|ipp|irc[6s]?|iris(?:\.beep|\.lwz|\.xpc|\.xpcs)?|itms|jar|javascript|jms|keyparc|lastfm|ldaps?|magnet|mailto|maps|market|message|mid|mms|ms-help|msnim|msrps?|mtqp|mumble|mupdate|mvn|news|nfs|nih?|nntp|notes|oid|opaquelocktoken|palm|paparazzi|platform|pop|pres|proxy|psyc|query|res(?:ource)?|rmi|rsync|rtmp|rtsp|secondlife|service|session|sftp|sgn|shttp|sieve|sips?|skype|sm[bs]|snmp|soap\.beeps?|soldat|spotify|ssh|steam|svn|tag|teamspeak|tel(?:net)?|tftp|things|thismessage|tip|tn3270|tv|udp|unreal|urn|ut2004|vemmi|ventrilo|view-source|webcal|wss?|wtai|wyciwyg|xcon(?:-userid)?|xfire|xmlrpc\.beeps?|xmpp|xri|ymsgr|z39\.50[rs]?):(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]|\([^\s()<>]*\))+(?:\([^\s()<>]*\)|[^\s`*!()\[\]{};:'".,<>?«»“”‘’]))/i;
                e.defineMode("gfm", function(n, r) {
                    function i(e) {
                        return e.code = !1, null
                    }
                    var o = 0,
                        a = {
                            startState: function() {
                                return {
                                    code: !1,
                                    codeBlock: !1,
                                    ateSpace: !1
                                }
                            },
                            copyState: function(e) {
                                return {
                                    code: e.code,
                                    codeBlock: e.codeBlock,
                                    ateSpace: e.ateSpace
                                }
                            },
                            token: function(e, n) {
                                if (n.combineTokens = null, n.codeBlock) return e.match(/^```+/) ? (n.codeBlock = !1, null) : (e.skipToEnd(), null);
                                if (e.sol() && (n.code = !1), e.sol() && e.match(/^```+/)) return e.skipToEnd(), n.codeBlock = !0, null;
                                if ("`" === e.peek()) {
                                    e.next();
                                    var i = e.pos;
                                    e.eatWhile("`");
                                    var a = 1 + e.pos - i;
                                    return n.code ? a === o && (n.code = !1) : (o = a, n.code = !0), null
                                }
                                if (n.code) return e.next(), null;
                                if (e.eatSpace()) return n.ateSpace = !0, null;
                                if ((e.sol() || n.ateSpace) && (n.ateSpace = !1, r.gitHubSpice !== !1)) {
                                    if (e.match(/^(?:[a-zA-Z0-9\-_]+\/)?(?:[a-zA-Z0-9\-_]+@)?(?:[a-f0-9]{7,40}\b)/)) return n.combineTokens = !0, "link";
                                    if (e.match(/^(?:[a-zA-Z0-9\-_]+\/)?(?:[a-zA-Z0-9\-_]+)?#[0-9]+\b/)) return n.combineTokens = !0, "link"
                                }
                                return e.match(t) && "](" != e.string.slice(e.start - 2, e.start) && (0 == e.start || /\W/.test(e.string.charAt(e.start - 1))) ? (n.combineTokens = !0, "link") : (e.next(), null)
                            },
                            blankLine: i
                        },
                        l = {
                            underscoresBreakWords: !1,
                            taskLists: !0,
                            fencedCodeBlocks: "```",
                            strikethrough: !0
                        };
                    for (var s in r) l[s] = r[s];
                    return l.name = "markdown", e.overlayMode(e.getMode(n, l), a)
                }, "markdown"), e.defineMIME("text/x-gfm", "gfm")
            })
        }, {
            "../../addon/mode/overlay": 8,
            "../../lib/codemirror": 10,
            "../markdown/markdown": 12
        }],
        12: [function(t, n, r) {
            ! function(i) {
                "object" == typeof r && "object" == typeof n ? i(t("../../lib/codemirror"), t("../xml/xml"), t("../meta")) : "function" == typeof e && e.amd ? e(["../../lib/codemirror", "../xml/xml", "../meta"], i) : i(CodeMirror)
            }(function(e) {
                "use strict";
                e.defineMode("markdown", function(t, n) {
                    function r(n) {
                        if (e.findModeByName) {
                            var r = e.findModeByName(n);
                            r && (n = r.mime || r.mimes[0])
                        }
                        var i = e.getMode(t, n);
                        return "null" == i.name ? null : i
                    }

                    function i(e, t, n) {
                        return t.f = t.inline = n, n(e, t)
                    }

                    function o(e, t, n) {
                        return t.f = t.block = n, n(e, t)
                    }

                    function a(e) {
                        return !e || !/\S/.test(e.string)
                    }

                    function l(e) {
                        return e.linkTitle = !1, e.em = !1, e.strong = !1, e.strikethrough = !1, e.quote = 0, e.indentedCode = !1, k && e.f == c && (e.f = p, e.block = s), e.trailingSpace = 0, e.trailingSpaceNewLine = !1, e.prevLine = e.thisLine, e.thisLine = null, null
                    }

                    function s(t, o) {
                        var l = t.sol(),
                            s = o.list !== !1,
                            c = o.indentedCode;
                        o.indentedCode = !1, s && (o.indentationDiff >= 0 ? (o.indentationDiff < 4 && (o.indentation -= o.indentationDiff), o.list = null) : o.indentation > 0 ? o.list = null : o.list = !1);
                        var f = null;
                        if (o.indentationDiff >= 4) return t.skipToEnd(), c || a(o.prevLine) ? (o.indentation -= 4, o.indentedCode = !0, S.code) : null;
                        if (t.eatSpace()) return null;
                        if ((f = t.match(A)) && f[1].length <= 6) return o.header = f[1].length, n.highlightFormatting && (o.formatting = "header"), o.f = o.inline, h(o);
                        if (!(a(o.prevLine) || o.quote || s || c) && (f = t.match(E))) return o.header = "=" == f[0].charAt(0) ? 1 : 2, n.highlightFormatting && (o.formatting = "header"), o.f = o.inline, h(o);
                        if (t.eat(">")) return o.quote = l ? 1 : o.quote + 1, n.highlightFormatting && (o.formatting = "quote"), t.eatSpace(), h(o);
                        if ("[" === t.peek()) return i(t, o, y);
                        if (t.match(L, !0)) return o.hr = !0, S.hr;
                        if ((a(o.prevLine) || s) && (t.match(T, !1) || t.match(M, !1))) {
                            var d = null;
                            for (t.match(T, !0) ? d = "ul" : (t.match(M, !0), d = "ol"), o.indentation = t.column() + t.current().length, o.list = !0; o.listStack && t.column() < o.listStack[o.listStack.length - 1];) o.listStack.pop();
                            return o.listStack.push(o.indentation), n.taskLists && t.match(N, !1) && (o.taskList = !0), o.f = o.inline, n.highlightFormatting && (o.formatting = ["list", "list-" + d]), h(o)
                        }
                        return n.fencedCodeBlocks && (f = t.match(I, !0)) ? (o.fencedChars = f[1], o.localMode = r(f[2]), o.localMode && (o.localState = e.startState(o.localMode)), o.f = o.block = u, n.highlightFormatting && (o.formatting = "code-block"), o.code = -1, h(o)) : i(t, o, o.inline)
                    }

                    function c(t, n) {
                        var r = w.token(t, n.htmlState);
                        if (!k) {
                            var i = e.innerMode(w, n.htmlState);
                            ("xml" == i.mode.name && null === i.state.tagStart && !i.state.context && i.state.tokenize.isInText || n.md_inside && t.current().indexOf(">") > -1) && (n.f = p, n.block = s, n.htmlState = null)
                        }
                        return r
                    }

                    function u(e, t) {
                        return t.fencedChars && e.match(t.fencedChars, !1) ? (t.localMode = t.localState = null, t.f = t.block = f, null) : t.localMode ? t.localMode.token(e, t.localState) : (e.skipToEnd(), S.code)
                    }

                    function f(e, t) {
                        e.match(t.fencedChars), t.block = s, t.f = p, t.fencedChars = null, n.highlightFormatting && (t.formatting = "code-block"), t.code = 1;
                        var r = h(t);
                        return t.code = 0, r
                    }

                    function h(e) {
                        var t = [];
                        if (e.formatting) {
                            t.push(S.formatting), "string" == typeof e.formatting && (e.formatting = [e.formatting]);
                            for (var r = 0; r < e.formatting.length; r++) t.push(S.formatting + "-" + e.formatting[r]), "header" === e.formatting[r] && t.push(S.formatting + "-" + e.formatting[r] + "-" + e.header), "quote" === e.formatting[r] && (!n.maxBlockquoteDepth || n.maxBlockquoteDepth >= e.quote ? t.push(S.formatting + "-" + e.formatting[r] + "-" + e.quote) : t.push("error"))
                        }
                        if (e.taskOpen) return t.push("meta"), t.length ? t.join(" ") : null;
                        if (e.taskClosed) return t.push("property"), t.length ? t.join(" ") : null;
                        if (e.linkHref ? t.push(S.linkHref, "url") : (e.strong && t.push(S.strong), e.em && t.push(S.em), e.strikethrough && t.push(S.strikethrough), e.linkText && t.push(S.linkText), e.code && t.push(S.code)), e.header && t.push(S.header, S.header + "-" + e.header), e.quote && (t.push(S.quote), !n.maxBlockquoteDepth || n.maxBlockquoteDepth >= e.quote ? t.push(S.quote + "-" + e.quote) : t.push(S.quote + "-" + n.maxBlockquoteDepth)), e.list !== !1) {
                            var i = (e.listStack.length - 1) % 3;
                            i ? 1 === i ? t.push(S.list2) : t.push(S.list3) : t.push(S.list1)
                        }
                        return e.trailingSpaceNewLine ? t.push("trailing-space-new-line") : e.trailingSpace && t.push("trailing-space-" + (e.trailingSpace % 2 ? "a" : "b")), t.length ? t.join(" ") : null
                    }

                    function d(e, t) {
                        return e.match(O, !0) ? h(t) : void 0
                    }

                    function p(t, r) {
                        var i = r.text(t, r);
                        if ("undefined" != typeof i) return i;
                        if (r.list) return r.list = null, h(r);
                        if (r.taskList) {
                            var a = "x" !== t.match(N, !0)[1];
                            return a ? r.taskOpen = !0 : r.taskClosed = !0, n.highlightFormatting && (r.formatting = "task"), r.taskList = !1, h(r)
                        }
                        if (r.taskOpen = !1, r.taskClosed = !1, r.header && t.match(/^#+$/, !0)) return n.highlightFormatting && (r.formatting = "header"),
                            h(r);
                        var l = t.sol(),
                            s = t.next();
                        if (r.linkTitle) {
                            r.linkTitle = !1;
                            var u = s;
                            "(" === s && (u = ")"), u = (u + "").replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
                            var f = "^\\s*(?:[^" + u + "\\\\]+|\\\\\\\\|\\\\.)" + u;
                            if (t.match(new RegExp(f), !0)) return S.linkHref
                        }
                        if ("`" === s) {
                            var d = r.formatting;
                            n.highlightFormatting && (r.formatting = "code"), t.eatWhile("`");
                            var p = t.current().length;
                            if (0 == r.code) return r.code = p, h(r);
                            if (p == r.code) {
                                var v = h(r);
                                return r.code = 0, v
                            }
                            return r.formatting = d, h(r)
                        }
                        if (r.code) return h(r);
                        if ("\\" === s && (t.next(), n.highlightFormatting)) {
                            var y = h(r),
                                x = S.formatting + "-escape";
                            return y ? y + " " + x : x
                        }
                        if ("!" === s && t.match(/\[[^\]]*\] ?(?:\(|\[)/, !1)) return t.match(/\[[^\]]*\]/), r.inline = r.f = g, S.image;
                        if ("[" === s && t.match(/[^\]]*\](\(.*\)| ?\[.*?\])/, !1)) return r.linkText = !0, n.highlightFormatting && (r.formatting = "link"), h(r);
                        if ("]" === s && r.linkText && t.match(/\(.*?\)| ?\[.*?\]/, !1)) {
                            n.highlightFormatting && (r.formatting = "link");
                            var y = h(r);
                            return r.linkText = !1, r.inline = r.f = g, y
                        }
                        if ("<" === s && t.match(/^(https?|ftps?):\/\/(?:[^\\>]|\\.)+>/, !1)) {
                            r.f = r.inline = m, n.highlightFormatting && (r.formatting = "link");
                            var y = h(r);
                            return y ? y += " " : y = "", y + S.linkInline
                        }
                        if ("<" === s && t.match(/^[^> \\]+@(?:[^\\>]|\\.)+>/, !1)) {
                            r.f = r.inline = m, n.highlightFormatting && (r.formatting = "link");
                            var y = h(r);
                            return y ? y += " " : y = "", y + S.linkEmail
                        }
                        if ("<" === s && t.match(/^(!--|\w)/, !1)) {
                            var b = t.string.indexOf(">", t.pos);
                            if (-1 != b) {
                                var k = t.string.substring(t.start, b);
                                /markdown\s*=\s*('|"){0,1}1('|"){0,1}/.test(k) && (r.md_inside = !0)
                            }
                            return t.backUp(1), r.htmlState = e.startState(w), o(t, r, c)
                        }
                        if ("<" === s && t.match(/^\/\w*?>/)) return r.md_inside = !1, "tag";
                        var C = !1;
                        if (!n.underscoresBreakWords && "_" === s && "_" !== t.peek() && t.match(/(\w)/, !1)) {
                            var L = t.pos - 2;
                            if (L >= 0) {
                                var T = t.string.charAt(L);
                                "_" !== T && T.match(/(\w)/, !1) && (C = !0)
                            }
                        }
                        if ("*" === s || "_" === s && !C)
                            if (l && " " === t.peek());
                            else {
                                if (r.strong === s && t.eat(s)) {
                                    n.highlightFormatting && (r.formatting = "strong");
                                    var v = h(r);
                                    return r.strong = !1, v
                                }
                                if (!r.strong && t.eat(s)) return r.strong = s, n.highlightFormatting && (r.formatting = "strong"), h(r);
                                if (r.em === s) {
                                    n.highlightFormatting && (r.formatting = "em");
                                    var v = h(r);
                                    return r.em = !1, v
                                }
                                if (!r.em) return r.em = s, n.highlightFormatting && (r.formatting = "em"), h(r)
                            }
                        else if (" " === s && (t.eat("*") || t.eat("_"))) {
                            if (" " === t.peek()) return h(r);
                            t.backUp(1)
                        }
                        if (n.strikethrough)
                            if ("~" === s && t.eatWhile(s)) {
                                if (r.strikethrough) {
                                    n.highlightFormatting && (r.formatting = "strikethrough");
                                    var v = h(r);
                                    return r.strikethrough = !1, v
                                }
                                if (t.match(/^[^\s]/, !1)) return r.strikethrough = !0, n.highlightFormatting && (r.formatting = "strikethrough"), h(r)
                            } else if (" " === s && t.match(/^~~/, !0)) {
                            if (" " === t.peek()) return h(r);
                            t.backUp(2)
                        }
                        return " " === s && (t.match(/ +$/, !1) ? r.trailingSpace++ : r.trailingSpace && (r.trailingSpaceNewLine = !0)), h(r)
                    }

                    function m(e, t) {
                        var r = e.next();
                        if (">" === r) {
                            t.f = t.inline = p, n.highlightFormatting && (t.formatting = "link");
                            var i = h(t);
                            return i ? i += " " : i = "", i + S.linkInline
                        }
                        return e.match(/^[^>]+/, !0), S.linkInline
                    }

                    function g(e, t) {
                        if (e.eatSpace()) return null;
                        var r = e.next();
                        return "(" === r || "[" === r ? (t.f = t.inline = v("(" === r ? ")" : "]", 0), n.highlightFormatting && (t.formatting = "link-string"), t.linkHref = !0, h(t)) : "error"
                    }

                    function v(e) {
                        return function(t, r) {
                            var i = t.next();
                            if (i === e) {
                                r.f = r.inline = p, n.highlightFormatting && (r.formatting = "link-string");
                                var o = h(r);
                                return r.linkHref = !1, o
                            }
                            return t.match(P[e]), r.linkHref = !0, h(r)
                        }
                    }

                    function y(e, t) {
                        return e.match(/^([^\]\\]|\\.)*\]:/, !1) ? (t.f = x, e.next(), n.highlightFormatting && (t.formatting = "link"), t.linkText = !0, h(t)) : i(e, t, p)
                    }

                    function x(e, t) {
                        if (e.match(/^\]:/, !0)) {
                            t.f = t.inline = b, n.highlightFormatting && (t.formatting = "link");
                            var r = h(t);
                            return t.linkText = !1, r
                        }
                        return e.match(/^([^\]\\]|\\.)+/, !0), S.linkText
                    }

                    function b(e, t) {
                        return e.eatSpace() ? null : (e.match(/^[^\s]+/, !0), void 0 === e.peek() ? t.linkTitle = !0 : e.match(/^(?:\s+(?:"(?:[^"\\]|\\\\|\\.)+"|'(?:[^'\\]|\\\\|\\.)+'|\((?:[^)\\]|\\\\|\\.)+\)))?/, !0), t.f = t.inline = p, S.linkHref + " url")
                    }
                    var w = e.getMode(t, "text/html"),
                        k = "null" == w.name;
                    void 0 === n.highlightFormatting && (n.highlightFormatting = !1), void 0 === n.maxBlockquoteDepth && (n.maxBlockquoteDepth = 0), void 0 === n.underscoresBreakWords && (n.underscoresBreakWords = !0), void 0 === n.taskLists && (n.taskLists = !1), void 0 === n.strikethrough && (n.strikethrough = !1), void 0 === n.tokenTypeOverrides && (n.tokenTypeOverrides = {});
                    var S = {
                        header: "header",
                        code: "comment",
                        quote: "quote",
                        list1: "variable-2",
                        list2: "variable-3",
                        list3: "keyword",
                        hr: "hr",
                        image: "tag",
                        formatting: "formatting",
                        linkInline: "link",
                        linkEmail: "link",
                        linkText: "link",
                        linkHref: "string",
                        em: "em",
                        strong: "strong",
                        strikethrough: "strikethrough"
                    };
                    for (var C in S) S.hasOwnProperty(C) && n.tokenTypeOverrides[C] && (S[C] = n.tokenTypeOverrides[C]);
                    var L = /^([*\-_])(?:\s*\1){2,}\s*$/,
                        T = /^[*\-+]\s+/,
                        M = /^[0-9]+([.)])\s+/,
                        N = /^\[(x| )\](?=\s)/,
                        A = n.allowAtxHeaderWithoutSpace ? /^(#+)/ : /^(#+)(?: |$)/,
                        E = /^ *(?:\={1,}|-{1,})\s*$/,
                        O = /^[^#!\[\]*_\\<>` "'(~]+/,
                        I = new RegExp("^(" + (n.fencedCodeBlocks === !0 ? "~~~+|```+" : n.fencedCodeBlocks) + ")[ \\t]*([\\w+#-]*)"),
                        P = {
                            ")": /^(?:[^\\\(\)]|\\.|\((?:[^\\\(\)]|\\.)*\))*?(?=\))/,
                            "]": /^(?:[^\\\[\]]|\\.|\[(?:[^\\\[\\]]|\\.)*\])*?(?=\])/
                        },
                        R = {
                            startState: function() {
                                return {
                                    f: s,
                                    prevLine: null,
                                    thisLine: null,
                                    block: s,
                                    htmlState: null,
                                    indentation: 0,
                                    inline: p,
                                    text: d,
                                    formatting: !1,
                                    linkText: !1,
                                    linkHref: !1,
                                    linkTitle: !1,
                                    code: 0,
                                    em: !1,
                                    strong: !1,
                                    header: 0,
                                    hr: !1,
                                    taskList: !1,
                                    list: !1,
                                    listStack: [],
                                    quote: 0,
                                    trailingSpace: 0,
                                    trailingSpaceNewLine: !1,
                                    strikethrough: !1,
                                    fencedChars: null
                                }
                            },
                            copyState: function(t) {
                                return {
                                    f: t.f,
                                    prevLine: t.prevLine,
                                    thisLine: t.thisLine,
                                    block: t.block,
                                    htmlState: t.htmlState && e.copyState(w, t.htmlState),
                                    indentation: t.indentation,
                                    localMode: t.localMode,
                                    localState: t.localMode ? e.copyState(t.localMode, t.localState) : null,
                                    inline: t.inline,
                                    text: t.text,
                                    formatting: !1,
                                    linkTitle: t.linkTitle,
                                    code: t.code,
                                    em: t.em,
                                    strong: t.strong,
                                    strikethrough: t.strikethrough,
                                    header: t.header,
                                    hr: t.hr,
                                    taskList: t.taskList,
                                    list: t.list,
                                    listStack: t.listStack.slice(0),
                                    quote: t.quote,
                                    indentedCode: t.indentedCode,
                                    trailingSpace: t.trailingSpace,
                                    trailingSpaceNewLine: t.trailingSpaceNewLine,
                                    md_inside: t.md_inside,
                                    fencedChars: t.fencedChars
                                }
                            },
                            token: function(e, t) {
                                if (t.formatting = !1, e != t.thisLine) {
                                    var n = t.header || t.hr;
                                    if (t.header = 0, t.hr = !1, e.match(/^\s*$/, !0) || n) {
                                        if (l(t), !n) return null;
                                        t.prevLine = null
                                    }
                                    t.prevLine = t.thisLine, t.thisLine = e, t.taskList = !1, t.trailingSpace = 0, t.trailingSpaceNewLine = !1, t.f = t.block;
                                    var r = e.match(/^\s*/, !0)[0].replace(/\t/g, "    ").length;
                                    if (t.indentationDiff = Math.min(r - t.indentation, 4), t.indentation = t.indentation + t.indentationDiff, r > 0) return null
                                }
                                return t.f(e, t)
                            },
                            innerMode: function(e) {
                                return e.block == c ? {
                                    state: e.htmlState,
                                    mode: w
                                } : e.localState ? {
                                    state: e.localState,
                                    mode: e.localMode
                                } : {
                                    state: e,
                                    mode: R
                                }
                            },
                            blankLine: l,
                            getType: h,
                            fold: "markdown"
                        };
                    return R
                }, "xml"), e.defineMIME("text/x-markdown", "markdown")
            })
        }, {
            "../../lib/codemirror": 10,
            "../meta": 13,
            "../xml/xml": 14
        }],
        13: [function(t, n, r) {
            ! function(i) {
                "object" == typeof r && "object" == typeof n ? i(t("../lib/codemirror")) : "function" == typeof e && e.amd ? e(["../lib/codemirror"], i) : i(CodeMirror)
            }(function(e) {
                "use strict";
                e.modeInfo = [{
                    name: "APL",
                    mime: "text/apl",
                    mode: "apl",
                    ext: ["dyalog", "apl"]
                }, {
                    name: "PGP",
                    mimes: ["application/pgp", "application/pgp-keys", "application/pgp-signature"],
                    mode: "asciiarmor",
                    ext: ["pgp"]
                }, {
                    name: "ASN.1",
                    mime: "text/x-ttcn-asn",
                    mode: "asn.1",
                    ext: ["asn", "asn1"]
                }, {
                    name: "Asterisk",
                    mime: "text/x-asterisk",
                    mode: "asterisk",
                    file: /^extensions\.conf$/i
                }, {
                    name: "Brainfuck",
                    mime: "text/x-brainfuck",
                    mode: "brainfuck",
                    ext: ["b", "bf"]
                }, {
                    name: "C",
                    mime: "text/x-csrc",
                    mode: "clike",
                    ext: ["c", "h"]
                }, {
                    name: "C++",
                    mime: "text/x-c++src",
                    mode: "clike",
                    ext: ["cpp", "c++", "cc", "cxx", "hpp", "h++", "hh", "hxx"],
                    alias: ["cpp"]
                }, {
                    name: "Cobol",
                    mime: "text/x-cobol",
                    mode: "cobol",
                    ext: ["cob", "cpy"]
                }, {
                    name: "C#",
                    mime: "text/x-csharp",
                    mode: "clike",
                    ext: ["cs"],
                    alias: ["csharp"]
                }, {
                    name: "Clojure",
                    mime: "text/x-clojure",
                    mode: "clojure",
                    ext: ["clj", "cljc", "cljx"]
                }, {
                    name: "ClojureScript",
                    mime: "text/x-clojurescript",
                    mode: "clojure",
                    ext: ["cljs"]
                }, {
                    name: "Closure Stylesheets (GSS)",
                    mime: "text/x-gss",
                    mode: "css",
                    ext: ["gss"]
                }, {
                    name: "CMake",
                    mime: "text/x-cmake",
                    mode: "cmake",
                    ext: ["cmake", "cmake.in"],
                    file: /^CMakeLists.txt$/
                }, {
                    name: "CoffeeScript",
                    mime: "text/x-coffeescript",
                    mode: "coffeescript",
                    ext: ["coffee"],
                    alias: ["coffee", "coffee-script"]
                }, {
                    name: "Common Lisp",
                    mime: "text/x-common-lisp",
                    mode: "commonlisp",
                    ext: ["cl", "lisp", "el"],
                    alias: ["lisp"]
                }, {
                    name: "Cypher",
                    mime: "application/x-cypher-query",
                    mode: "cypher",
                    ext: ["cyp", "cypher"]
                }, {
                    name: "Cython",
                    mime: "text/x-cython",
                    mode: "python",
                    ext: ["pyx", "pxd", "pxi"]
                }, {
                    name: "Crystal",
                    mime: "text/x-crystal",
                    mode: "crystal",
                    ext: ["cr"]
                }, {
                    name: "CSS",
                    mime: "text/css",
                    mode: "css",
                    ext: ["css"]
                }, {
                    name: "CQL",
                    mime: "text/x-cassandra",
                    mode: "sql",
                    ext: ["cql"]
                }, {
                    name: "D",
                    mime: "text/x-d",
                    mode: "d",
                    ext: ["d"]
                }, {
                    name: "Dart",
                    mimes: ["application/dart", "text/x-dart"],
                    mode: "dart",
                    ext: ["dart"]
                }, {
                    name: "diff",
                    mime: "text/x-diff",
                    mode: "diff",
                    ext: ["diff", "patch"]
                }, {
                    name: "Django",
                    mime: "text/x-django",
                    mode: "django"
                }, {
                    name: "Dockerfile",
                    mime: "text/x-dockerfile",
                    mode: "dockerfile",
                    file: /^Dockerfile$/
                }, {
                    name: "DTD",
                    mime: "application/xml-dtd",
                    mode: "dtd",
                    ext: ["dtd"]
                }, {
                    name: "Dylan",
                    mime: "text/x-dylan",
                    mode: "dylan",
                    ext: ["dylan", "dyl", "intr"]
                }, {
                    name: "EBNF",
                    mime: "text/x-ebnf",
                    mode: "ebnf"
                }, {
                    name: "ECL",
                    mime: "text/x-ecl",
                    mode: "ecl",
                    ext: ["ecl"]
                }, {
                    name: "edn",
                    mime: "application/edn",
                    mode: "clojure",
                    ext: ["edn"]
                }, {
                    name: "Eiffel",
                    mime: "text/x-eiffel",
                    mode: "eiffel",
                    ext: ["e"]
                }, {
                    name: "Elm",
                    mime: "text/x-elm",
                    mode: "elm",
                    ext: ["elm"]
                }, {
                    name: "Embedded Javascript",
                    mime: "application/x-ejs",
                    mode: "htmlembedded",
                    ext: ["ejs"]
                }, {
                    name: "Embedded Ruby",
                    mime: "application/x-erb",
                    mode: "htmlembedded",
                    ext: ["erb"]
                }, {
                    name: "Erlang",
                    mime: "text/x-erlang",
                    mode: "erlang",
                    ext: ["erl"]
                }, {
                    name: "Factor",
                    mime: "text/x-factor",
                    mode: "factor",
                    ext: ["factor"]
                }, {
                    name: "FCL",
                    mime: "text/x-fcl",
                    mode: "fcl"
                }, {
                    name: "Forth",
                    mime: "text/x-forth",
                    mode: "forth",
                    ext: ["forth", "fth", "4th"]
                }, {
                    name: "Fortran",
                    mime: "text/x-fortran",
                    mode: "fortran",
                    ext: ["f", "for", "f77", "f90"]
                }, {
                    name: "F#",
                    mime: "text/x-fsharp",
                    mode: "mllike",
                    ext: ["fs"],
                    alias: ["fsharp"]
                }, {
                    name: "Gas",
                    mime: "text/x-gas",
                    mode: "gas",
                    ext: ["s"]
                }, {
                    name: "Gherkin",
                    mime: "text/x-feature",
                    mode: "gherkin",
                    ext: ["feature"]
                }, {
                    name: "GitHub Flavored Markdown",
                    mime: "text/x-gfm",
                    mode: "gfm",
                    file: /^(readme|contributing|history).md$/i
                }, {
                    name: "Go",
                    mime: "text/x-go",
                    mode: "go",
                    ext: ["go"]
                }, {
                    name: "Groovy",
                    mime: "text/x-groovy",
                    mode: "groovy",
                    ext: ["groovy", "gradle"]
                }, {
                    name: "HAML",
                    mime: "text/x-haml",
                    mode: "haml",
                    ext: ["haml"]
                }, {
                    name: "Haskell",
                    mime: "text/x-haskell",
                    mode: "haskell",
                    ext: ["hs"]
                }, {
                    name: "Haskell (Literate)",
                    mime: "text/x-literate-haskell",
                    mode: "haskell-literate",
                    ext: ["lhs"]
                }, {
                    name: "Haxe",
                    mime: "text/x-haxe",
                    mode: "haxe",
                    ext: ["hx"]
                }, {
                    name: "HXML",
                    mime: "text/x-hxml",
                    mode: "haxe",
                    ext: ["hxml"]
                }, {
                    name: "ASP.NET",
                    mime: "application/x-aspx",
                    mode: "htmlembedded",
                    ext: ["aspx"],
                    alias: ["asp", "aspx"]
                }, {
                    name: "HTML",
                    mime: "text/html",
                    mode: "htmlmixed",
                    ext: ["html", "htm"],
                    alias: ["xhtml"]
                }, {
                    name: "HTTP",
                    mime: "message/http",
                    mode: "http"
                }, {
                    name: "IDL",
                    mime: "text/x-idl",
                    mode: "idl",
                    ext: ["pro"]
                }, {
                    name: "Jade",
                    mime: "text/x-jade",
                    mode: "jade",
                    ext: ["jade"]
                }, {
                    name: "Java",
                    mime: "text/x-java",
                    mode: "clike",
                    ext: ["java"]
                }, {
                    name: "Java Server Pages",
                    mime: "application/x-jsp",
                    mode: "htmlembedded",
                    ext: ["jsp"],
                    alias: ["jsp"]
                }, {
                    name: "JavaScript",
                    mimes: ["text/javascript", "text/ecmascript", "application/javascript", "application/x-javascript", "application/ecmascript"],
                    mode: "javascript",
                    ext: ["js"],
                    alias: ["ecmascript", "js", "node"]
                }, {
                    name: "JSON",
                    mimes: ["application/json", "application/x-json"],
                    mode: "javascript",
                    ext: ["json", "map"],
                    alias: ["json5"]
                }, {
                    name: "JSON-LD",
                    mime: "application/ld+json",
                    mode: "javascript",
                    ext: ["jsonld"],
                    alias: ["jsonld"]
                }, {
                    name: "JSX",
                    mime: "text/jsx",
                    mode: "jsx",
                    ext: ["jsx"]
                }, {
                    name: "Jinja2",
                    mime: "null",
                    mode: "jinja2"
                }, {
                    name: "Julia",
                    mime: "text/x-julia",
                    mode: "julia",
                    ext: ["jl"]
                }, {
                    name: "Kotlin",
                    mime: "text/x-kotlin",
                    mode: "clike",
                    ext: ["kt"]
                }, {
                    name: "LESS",
                    mime: "text/x-less",
                    mode: "css",
                    ext: ["less"]
                }, {
                    name: "LiveScript",
                    mime: "text/x-livescript",
                    mode: "livescript",
                    ext: ["ls"],
                    alias: ["ls"]
                }, {
                    name: "Lua",
                    mime: "text/x-lua",
                    mode: "lua",
                    ext: ["lua"]
                }, {
                    name: "Markdown",
                    mime: "text/x-markdown",
                    mode: "markdown",
                    ext: ["markdown", "md", "mkd"]
                }, {
                    name: "mIRC",
                    mime: "text/mirc",
                    mode: "mirc"
                }, {
                    name: "MariaDB SQL",
                    mime: "text/x-mariadb",
                    mode: "sql"
                }, {
                    name: "Mathematica",
                    mime: "text/x-mathematica",
                    mode: "mathematica",
                    ext: ["m", "nb"]
                }, {
                    name: "Modelica",
                    mime: "text/x-modelica",
                    mode: "modelica",
                    ext: ["mo"]
                }, {
                    name: "MUMPS",
                    mime: "text/x-mumps",
                    mode: "mumps",
                    ext: ["mps"]
                }, {
                    name: "MS SQL",
                    mime: "text/x-mssql",
                    mode: "sql"
                }, {
                    name: "mbox",
                    mime: "application/mbox",
                    mode: "mbox",
                    ext: ["mbox"]
                }, {
                    name: "MySQL",
                    mime: "text/x-mysql",
                    mode: "sql"
                }, {
                    name: "Nginx",
                    mime: "text/x-nginx-conf",
                    mode: "nginx",
                    file: /nginx.*\.conf$/i
                }, {
                    name: "NSIS",
                    mime: "text/x-nsis",
                    mode: "nsis",
                    ext: ["nsh", "nsi"]
                }, {
                    name: "NTriples",
                    mime: "text/n-triples",
                    mode: "ntriples",
                    ext: ["nt"]
                }, {
                    name: "Objective C",
                    mime: "text/x-objectivec",
                    mode: "clike",
                    ext: ["m", "mm"],
                    alias: ["objective-c", "objc"]
                }, {
                    name: "OCaml",
                    mime: "text/x-ocaml",
                    mode: "mllike",
                    ext: ["ml", "mli", "mll", "mly"]
                }, {
                    name: "Octave",
                    mime: "text/x-octave",
                    mode: "octave",
                    ext: ["m"]
                }, {
                    name: "Oz",
                    mime: "text/x-oz",
                    mode: "oz",
                    ext: ["oz"]
                }, {
                    name: "Pascal",
                    mime: "text/x-pascal",
                    mode: "pascal",
                    ext: ["p", "pas"]
                }, {
                    name: "PEG.js",
                    mime: "null",
                    mode: "pegjs",
                    ext: ["jsonld"]
                }, {
                    name: "Perl",
                    mime: "text/x-perl",
                    mode: "perl",
                    ext: ["pl", "pm"]
                }, {
                    name: "PHP",
                    mime: "application/x-httpd-php",
                    mode: "php",
                    ext: ["php", "php3", "php4", "php5", "phtml"]
                }, {
                    name: "Pig",
                    mime: "text/x-pig",
                    mode: "pig",
                    ext: ["pig"]
                }, {
                    name: "Plain Text",
                    mime: "text/plain",
                    mode: "null",
                    ext: ["txt", "text", "conf", "def", "list", "log"]
                }, {
                    name: "PLSQL",
                    mime: "text/x-plsql",
                    mode: "sql",
                    ext: ["pls"]
                }, {
                    name: "PowerShell",
                    mime: "application/x-powershell",
                    mode: "powershell",
                    ext: ["ps1", "psd1", "psm1"]
                }, {
                    name: "Properties files",
                    mime: "text/x-properties",
                    mode: "properties",
                    ext: ["properties", "ini", "in"],
                    alias: ["ini", "properties"]
                }, {
                    name: "ProtoBuf",
                    mime: "text/x-protobuf",
                    mode: "protobuf",
                    ext: ["proto"]
                }, {
                    name: "Python",
                    mime: "text/x-python",
                    mode: "python",
                    ext: ["BUILD", "bzl", "py", "pyw"],
                    file: /^(BUCK|BUILD)$/
                }, {
                    name: "Puppet",
                    mime: "text/x-puppet",
                    mode: "puppet",
                    ext: ["pp"]
                }, {
                    name: "Q",
                    mime: "text/x-q",
                    mode: "q",
                    ext: ["q"]
                }, {
                    name: "R",
                    mime: "text/x-rsrc",
                    mode: "r",
                    ext: ["r"],
                    alias: ["rscript"]
                }, {
                    name: "reStructuredText",
                    mime: "text/x-rst",
                    mode: "rst",
                    ext: ["rst"],
                    alias: ["rst"]
                }, {
                    name: "RPM Changes",
                    mime: "text/x-rpm-changes",
                    mode: "rpm"
                }, {
                    name: "RPM Spec",
                    mime: "text/x-rpm-spec",
                    mode: "rpm",
                    ext: ["spec"]
                }, {
                    name: "Ruby",
                    mime: "text/x-ruby",
                    mode: "ruby",
                    ext: ["rb"],
                    alias: ["jruby", "macruby", "rake", "rb", "rbx"]
                }, {
                    name: "Rust",
                    mime: "text/x-rustsrc",
                    mode: "rust",
                    ext: ["rs"]
                }, {
                    name: "SAS",
                    mime: "text/x-sas",
                    mode: "sas",
                    ext: ["sas"]
                }, {
                    name: "Sass",
                    mime: "text/x-sass",
                    mode: "sass",
                    ext: ["sass"]
                }, {
                    name: "Scala",
                    mime: "text/x-scala",
                    mode: "clike",
                    ext: ["scala"]
                }, {
                    name: "Scheme",
                    mime: "text/x-scheme",
                    mode: "scheme",
                    ext: ["scm", "ss"]
                }, {
                    name: "SCSS",
                    mime: "text/x-scss",
                    mode: "css",
                    ext: ["scss"]
                }, {
                    name: "Shell",
                    mime: "text/x-sh",
                    mode: "shell",
                    ext: ["sh", "ksh", "bash"],
                    alias: ["bash", "sh", "zsh"],
                    file: /^PKGBUILD$/
                }, {
                    name: "Sieve",
                    mime: "application/sieve",
                    mode: "sieve",
                    ext: ["siv", "sieve"]
                }, {
                    name: "Slim",
                    mimes: ["text/x-slim", "application/x-slim"],
                    mode: "slim",
                    ext: ["slim"]
                }, {
                    name: "Smalltalk",
                    mime: "text/x-stsrc",
                    mode: "smalltalk",
                    ext: ["st"]
                }, {
                    name: "Smarty",
                    mime: "text/x-smarty",
                    mode: "smarty",
                    ext: ["tpl"]
                }, {
                    name: "Solr",
                    mime: "text/x-solr",
                    mode: "solr"
                }, {
                    name: "Soy",
                    mime: "text/x-soy",
                    mode: "soy",
                    ext: ["soy"],
                    alias: ["closure template"]
                }, {
                    name: "SPARQL",
                    mime: "application/sparql-query",
                    mode: "sparql",
                    ext: ["rq", "sparql"],
                    alias: ["sparul"]
                }, {
                    name: "Spreadsheet",
                    mime: "text/x-spreadsheet",
                    mode: "spreadsheet",
                    alias: ["excel", "formula"]
                }, {
                    name: "SQL",
                    mime: "text/x-sql",
                    mode: "sql",
                    ext: ["sql"]
                }, {
                    name: "Squirrel",
                    mime: "text/x-squirrel",
                    mode: "clike",
                    ext: ["nut"]
                }, {
                    name: "Swift",
                    mime: "text/x-swift",
                    mode: "swift",
                    ext: ["swift"]
                }, {
                    name: "sTeX",
                    mime: "text/x-stex",
                    mode: "stex"
                }, {
                    name: "LaTeX",
                    mime: "text/x-latex",
                    mode: "stex",
                    ext: ["text", "ltx"],
                    alias: ["tex"]
                }, {
                    name: "SystemVerilog",
                    mime: "text/x-systemverilog",
                    mode: "verilog",
                    ext: ["v"]
                }, {
                    name: "Tcl",
                    mime: "text/x-tcl",
                    mode: "tcl",
                    ext: ["tcl"]
                }, {
                    name: "Textile",
                    mime: "text/x-textile",
                    mode: "textile",
                    ext: ["textile"]
                }, {
                    name: "TiddlyWiki ",
                    mime: "text/x-tiddlywiki",
                    mode: "tiddlywiki"
                }, {
                    name: "Tiki wiki",
                    mime: "text/tiki",
                    mode: "tiki"
                }, {
                    name: "TOML",
                    mime: "text/x-toml",
                    mode: "toml",
                    ext: ["toml"]
                }, {
                    name: "Tornado",
                    mime: "text/x-tornado",
                    mode: "tornado"
                }, {
                    name: "troff",
                    mime: "text/troff",
                    mode: "troff",
                    ext: ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
                }, {
                    name: "TTCN",
                    mime: "text/x-ttcn",
                    mode: "ttcn",
                    ext: ["ttcn", "ttcn3", "ttcnpp"]
                }, {
                    name: "TTCN_CFG",
                    mime: "text/x-ttcn-cfg",
                    mode: "ttcn-cfg",
                    ext: ["cfg"]
                }, {
                    name: "Turtle",
                    mime: "text/turtle",
                    mode: "turtle",
                    ext: ["ttl"]
                }, {
                    name: "TypeScript",
                    mime: "application/typescript",
                    mode: "javascript",
                    ext: ["ts"],
                    alias: ["ts"]
                }, {
                    name: "Twig",
                    mime: "text/x-twig",
                    mode: "twig"
                }, {
                    name: "Web IDL",
                    mime: "text/x-webidl",
                    mode: "webidl",
                    ext: ["webidl"]
                }, {
                    name: "VB.NET",
                    mime: "text/x-vb",
                    mode: "vb",
                    ext: ["vb"]
                }, {
                    name: "VBScript",
                    mime: "text/vbscript",
                    mode: "vbscript",
                    ext: ["vbs"]
                }, {
                    name: "Velocity",
                    mime: "text/velocity",
                    mode: "velocity",
                    ext: ["vtl"]
                }, {
                    name: "Verilog",
                    mime: "text/x-verilog",
                    mode: "verilog",
                    ext: ["v"]
                }, {
                    name: "VHDL",
                    mime: "text/x-vhdl",
                    mode: "vhdl",
                    ext: ["vhd", "vhdl"]
                }, {
                    name: "XML",
                    mimes: ["application/xml", "text/xml"],
                    mode: "xml",
                    ext: ["xml", "xsl", "xsd"],
                    alias: ["rss", "wsdl", "xsd"]
                }, {
                    name: "XQuery",
                    mime: "application/xquery",
                    mode: "xquery",
                    ext: ["xy", "xquery"]
                }, {
                    name: "Yacas",
                    mime: "text/x-yacas",
                    mode: "yacas",
                    ext: ["ys"]
                }, {
                    name: "YAML",
                    mime: "text/x-yaml",
                    mode: "yaml",
                    ext: ["yaml", "yml"],
                    alias: ["yml"]
                }, {
                    name: "Z80",
                    mime: "text/x-z80",
                    mode: "z80",
                    ext: ["z80"]
                }, {
                    name: "mscgen",
                    mime: "text/x-mscgen",
                    mode: "mscgen",
                    ext: ["mscgen", "mscin", "msc"]
                }, {
                    name: "xu",
                    mime: "text/x-xu",
                    mode: "mscgen",
                    ext: ["xu"]
                }, {
                    name: "msgenny",
                    mime: "text/x-msgenny",
                    mode: "mscgen",
                    ext: ["msgenny"]
                }];
                for (var t = 0; t < e.modeInfo.length; t++) {
                    var n = e.modeInfo[t];
                    n.mimes && (n.mime = n.mimes[0])
                }
                e.findModeByMIME = function(t) {
                    t = t.toLowerCase();
                    for (var n = 0; n < e.modeInfo.length; n++) {
                        var r = e.modeInfo[n];
                        if (r.mime == t) return r;
                        if (r.mimes)
                            for (var i = 0; i < r.mimes.length; i++)
                                if (r.mimes[i] == t) return r
                    }
                }, e.findModeByExtension = function(t) {
                    for (var n = 0; n < e.modeInfo.length; n++) {
                        var r = e.modeInfo[n];
                        if (r.ext)
                            for (var i = 0; i < r.ext.length; i++)
                                if (r.ext[i] == t) return r
                    }
                }, e.findModeByFileName = function(t) {
                    for (var n = 0; n < e.modeInfo.length; n++) {
                        var r = e.modeInfo[n];
                        if (r.file && r.file.test(t)) return r
                    }
                    var i = t.lastIndexOf("."),
                        o = i > -1 && t.substring(i + 1, t.length);
                    return o ? e.findModeByExtension(o) : void 0
                }, e.findModeByName = function(t) {
                    t = t.toLowerCase();
                    for (var n = 0; n < e.modeInfo.length; n++) {
                        var r = e.modeInfo[n];
                        if (r.name.toLowerCase() == t) return r;
                        if (r.alias)
                            for (var i = 0; i < r.alias.length; i++)
                                if (r.alias[i].toLowerCase() == t) return r
                    }
                }
            })
        }, {
            "../lib/codemirror": 10
        }],
        14: [function(t, n, r) {
            ! function(i) {
                "object" == typeof r && "object" == typeof n ? i(t("../../lib/codemirror")) : "function" == typeof e && e.amd ? e(["../../lib/codemirror"], i) : i(CodeMirror)
            }(function(e) {
                "use strict";
                var t = {
                        autoSelfClosers: {
                            area: !0,
                            base: !0,
                            br: !0,
                            col: !0,
                            command: !0,
                            embed: !0,
                            frame: !0,
                            hr: !0,
                            img: !0,
                            input: !0,
                            keygen: !0,
                            link: !0,
                            meta: !0,
                            param: !0,
                            source: !0,
                            track: !0,
                            wbr: !0,
                            menuitem: !0
                        },
                        implicitlyClosed: {
                            dd: !0,
                            li: !0,
                            optgroup: !0,
                            option: !0,
                            p: !0,
                            rp: !0,
                            rt: !0,
                            tbody: !0,
                            td: !0,
                            tfoot: !0,
                            th: !0,
                            tr: !0
                        },
                        contextGrabbers: {
                            dd: {
                                dd: !0,
                                dt: !0
                            },
                            dt: {
                                dd: !0,
                                dt: !0
                            },
                            li: {
                                li: !0
                            },
                            option: {
                                option: !0,
                                optgroup: !0
                            },
                            optgroup: {
                                optgroup: !0
                            },
                            p: {
                                address: !0,
                                article: !0,
                                aside: !0,
                                blockquote: !0,
                                dir: !0,
                                div: !0,
                                dl: !0,
                                fieldset: !0,
                                footer: !0,
                                form: !0,
                                h1: !0,
                                h2: !0,
                                h3: !0,
                                h4: !0,
                                h5: !0,
                                h6: !0,
                                header: !0,
                                hgroup: !0,
                                hr: !0,
                                menu: !0,
                                nav: !0,
                                ol: !0,
                                p: !0,
                                pre: !0,
                                section: !0,
                                table: !0,
                                ul: !0
                            },
                            rp: {
                                rp: !0,
                                rt: !0
                            },
                            rt: {
                                rp: !0,
                                rt: !0
                            },
                            tbody: {
                                tbody: !0,
                                tfoot: !0
                            },
                            td: {
                                td: !0,
                                th: !0
                            },
                            tfoot: {
                                tbody: !0
                            },
                            th: {
                                td: !0,
                                th: !0
                            },
                            thead: {
                                tbody: !0,
                                tfoot: !0
                            },
                            tr: {
                                tr: !0
                            }
                        },
                        doNotIndent: {
                            pre: !0
                        },
                        allowUnquoted: !0,
                        allowMissing: !0,
                        caseFold: !0
                    },
                    n = {
                        autoSelfClosers: {},
                        implicitlyClosed: {},
                        contextGrabbers: {},
                        doNotIndent: {},
                        allowUnquoted: !1,
                        allowMissing: !1,
                        caseFold: !1
                    };
                e.defineMode("xml", function(r, i) {
                    function o(e, t) {
                        function n(n) {
                            return t.tokenize = n, n(e, t)
                        }
                        var r = e.next();
                        if ("<" == r) return e.eat("!") ? e.eat("[") ? e.match("CDATA[") ? n(s("atom", "]]>")) : null : e.match("--") ? n(s("comment", "-->")) : e.match("DOCTYPE", !0, !0) ? (e.eatWhile(/[\w\._\-]/), n(c(1))) : null : e.eat("?") ? (e.eatWhile(/[\w\._\-]/), t.tokenize = s("meta", "?>"), "meta") : (T = e.eat("/") ? "closeTag" : "openTag", t.tokenize = a, "tag bracket");
                        if ("&" == r) {
                            var i;
                            return i = e.eat("#") ? e.eat("x") ? e.eatWhile(/[a-fA-F\d]/) && e.eat(";") : e.eatWhile(/[\d]/) && e.eat(";") : e.eatWhile(/[\w\.\-:]/) && e.eat(";"), i ? "atom" : "error"
                        }
                        return e.eatWhile(/[^&<]/), null
                    }

                    function a(e, t) {
                        var n = e.next();
                        if (">" == n || "/" == n && e.eat(">")) return t.tokenize = o, T = ">" == n ? "endTag" : "selfcloseTag", "tag bracket";
                        if ("=" == n) return T = "equals", null;
                        if ("<" == n) {
                            t.tokenize = o, t.state = d, t.tagName = t.tagStart = null;
                            var r = t.tokenize(e, t);
                            return r ? r + " tag error" : "tag error"
                        }
                        return /[\'\"]/.test(n) ? (t.tokenize = l(n), t.stringStartCol = e.column(), t.tokenize(e, t)) : (e.match(/^[^\s\u00a0=<>\"\']*[^\s\u00a0=<>\"\'\/]/), "word")
                    }

                    function l(e) {
                        var t = function(t, n) {
                            for (; !t.eol();)
                                if (t.next() == e) {
                                    n.tokenize = a;
                                    break
                                }
                            return "string"
                        };
                        return t.isInAttribute = !0, t
                    }

                    function s(e, t) {
                        return function(n, r) {
                            for (; !n.eol();) {
                                if (n.match(t)) {
                                    r.tokenize = o;
                                    break
                                }
                                n.next()
                            }
                            return e
                        }
                    }

                    function c(e) {
                        return function(t, n) {
                            for (var r; null != (r = t.next());) {
                                if ("<" == r) return n.tokenize = c(e + 1), n.tokenize(t, n);
                                if (">" == r) {
                                    if (1 == e) {
                                        n.tokenize = o;
                                        break
                                    }
                                    return n.tokenize = c(e - 1), n.tokenize(t, n)
                                }
                            }
                            return "meta"
                        }
                    }

                    function u(e, t, n) {
                        this.prev = e.context, this.tagName = t, this.indent = e.indented, this.startOfLine = n, (S.doNotIndent.hasOwnProperty(t) || e.context && e.context.noIndent) && (this.noIndent = !0)
                    }

                    function f(e) {
                        e.context && (e.context = e.context.prev)
                    }

                    function h(e, t) {
                        for (var n;;) {
                            if (!e.context) return;
                            if (n = e.context.tagName, !S.contextGrabbers.hasOwnProperty(n) || !S.contextGrabbers[n].hasOwnProperty(t)) return;
                            f(e)
                        }
                    }

                    function d(e, t, n) {
                        return "openTag" == e ? (n.tagStart = t.column(), p) : "closeTag" == e ? m : d
                    }

                    function p(e, t, n) {
                        return "word" == e ? (n.tagName = t.current(), M = "tag", y) : (M = "error", p)
                    }

                    function m(e, t, n) {
                        if ("word" == e) {
                            var r = t.current();
                            return n.context && n.context.tagName != r && S.implicitlyClosed.hasOwnProperty(n.context.tagName) && f(n), n.context && n.context.tagName == r || S.matchClosing === !1 ? (M = "tag", g) : (M = "tag error", v)
                        }
                        return M = "error", v
                    }

                    function g(e, t, n) {
                        return "endTag" != e ? (M = "error", g) : (f(n), d)
                    }

                    function v(e, t, n) {
                        return M = "error", g(e, t, n)
                    }

                    function y(e, t, n) {
                        if ("word" == e) return M = "attribute", x;
                        if ("endTag" == e || "selfcloseTag" == e) {
                            var r = n.tagName,
                                i = n.tagStart;
                            return n.tagName = n.tagStart = null, "selfcloseTag" == e || S.autoSelfClosers.hasOwnProperty(r) ? h(n, r) : (h(n, r), n.context = new u(n, r, i == n.indented)), d
                        }
                        return M = "error", y
                    }

                    function x(e, t, n) {
                        return "equals" == e ? b : (S.allowMissing || (M = "error"), y(e, t, n))
                    }

                    function b(e, t, n) {
                        return "string" == e ? w : "word" == e && S.allowUnquoted ? (M = "string", y) : (M = "error", y(e, t, n))
                    }

                    function w(e, t, n) {
                        return "string" == e ? w : y(e, t, n)
                    }
                    var k = r.indentUnit,
                        S = {},
                        C = i.htmlMode ? t : n;
                    for (var L in C) S[L] = C[L];
                    for (var L in i) S[L] = i[L];
                    var T, M;
                    return o.isInText = !0, {
                        startState: function(e) {
                            var t = {
                                tokenize: o,
                                state: d,
                                indented: e || 0,
                                tagName: null,
                                tagStart: null,
                                context: null
                            };
                            return null != e && (t.baseIndent = e), t
                        },
                        token: function(e, t) {
                            if (!t.tagName && e.sol() && (t.indented = e.indentation()), e.eatSpace()) return null;
                            T = null;
                            var n = t.tokenize(e, t);
                            return (n || T) && "comment" != n && (M = null, t.state = t.state(T || n, e, t), M && (n = "error" == M ? n + " error" : M)), n
                        },
                        indent: function(t, n, r) {
                            var i = t.context;
                            if (t.tokenize.isInAttribute) return t.tagStart == t.indented ? t.stringStartCol + 1 : t.indented + k;
                            if (i && i.noIndent) return e.Pass;
                            if (t.tokenize != a && t.tokenize != o) return r ? r.match(/^(\s*)/)[0].length : 0;
                            if (t.tagName) return S.multilineTagIndentPastTag !== !1 ? t.tagStart + t.tagName.length + 2 : t.tagStart + k * (S.multilineTagIndentFactor || 1);
                            if (S.alignCDATA && /<!\[CDATA\[/.test(n)) return 0;
                            var l = n && /^<(\/)?([\w_:\.-]*)/.exec(n);
                            if (l && l[1])
                                for (; i;) {
                                    if (i.tagName == l[2]) {
                                        i = i.prev;
                                        break
                                    }
                                    if (!S.implicitlyClosed.hasOwnProperty(i.tagName)) break;
                                    i = i.prev
                                } else if (l)
                                    for (; i;) {
                                        var s = S.contextGrabbers[i.tagName];
                                        if (!s || !s.hasOwnProperty(l[2])) break;
                                        i = i.prev
                                    }
                            for (; i && i.prev && !i.startOfLine;) i = i.prev;
                            return i ? i.indent + k : t.baseIndent || 0
                        },
                        electricInput: /<\/[\s\w:]+>$/,
                        blockCommentStart: "<!--",
                        blockCommentEnd: "-->",
                        configuration: S.htmlMode ? "html" : "xml",
                        helperType: S.htmlMode ? "html" : "xml",
                        skipAttribute: function(e) {
                            e.state == b && (e.state = y)
                        }
                    }
                }), e.defineMIME("text/xml", "xml"), e.defineMIME("application/xml", "xml"), e.mimeModes.hasOwnProperty("text/html") || e.defineMIME("text/html", {
                    name: "xml",
                    htmlMode: !0
                })
            })
        }, {
            "../../lib/codemirror": 10
        }],
        15: [function(e, t, n) {
            n.read = function(e, t, n, r, i) {
                var o, a, l = 8 * i - r - 1,
                    s = (1 << l) - 1,
                    c = s >> 1,
                    u = -7,
                    f = n ? i - 1 : 0,
                    h = n ? -1 : 1,
                    d = e[t + f];
                for (f += h, o = d & (1 << -u) - 1, d >>= -u, u += l; u > 0; o = 256 * o + e[t + f], f += h, u -= 8);
                for (a = o & (1 << -u) - 1, o >>= -u, u += r; u > 0; a = 256 * a + e[t + f], f += h, u -= 8);
                if (0 === o) o = 1 - c;
                else {
                    if (o === s) return a ? NaN : (d ? -1 : 1) * (1 / 0);
                    a += Math.pow(2, r), o -= c
                }
                return (d ? -1 : 1) * a * Math.pow(2, o - r)
            }, n.write = function(e, t, n, r, i, o) {
                var a, l, s, c = 8 * o - i - 1,
                    u = (1 << c) - 1,
                    f = u >> 1,
                    h = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                    d = r ? 0 : o - 1,
                    p = r ? 1 : -1,
                    m = 0 > t || 0 === t && 0 > 1 / t ? 1 : 0;
                for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (l = isNaN(t) ? 1 : 0, a = u) : (a = Math.floor(Math.log(t) / Math.LN2), t * (s = Math.pow(2, -a)) < 1 && (a--, s *= 2), t += a + f >= 1 ? h / s : h * Math.pow(2, 1 - f), t * s >= 2 && (a++, s /= 2), a + f >= u ? (l = 0, a = u) : a + f >= 1 ? (l = (t * s - 1) * Math.pow(2, i), a += f) : (l = t * Math.pow(2, f - 1) * Math.pow(2, i), a = 0)); i >= 8; e[n + d] = 255 & l, d += p, l /= 256, i -= 8);
                for (a = a << i | l, c += i; c > 0; e[n + d] = 255 & a, d += p, a /= 256, c -= 8);
                e[n + d - p] |= 128 * m
            }
        }, {}],
        16: [function(e, t, n) {
            var r = {}.toString;
            t.exports = Array.isArray || function(e) {
                return "[object Array]" == r.call(e)
            }
        }, {}],
        17: [function(t, n, r) {
            (function(t) {
                (function() {
                    function t(e) {
                        this.tokens = [], this.tokens.links = {}, this.options = e || h.defaults, this.rules = d.normal, this.options.gfm && (this.options.tables ? this.rules = d.tables : this.rules = d.gfm)
                    }

                    function i(e, t) {
                        if (this.options = t || h.defaults, this.links = e, this.rules = p.normal, this.renderer = this.options.renderer || new o, this.renderer.options = this.options, !this.links) throw new Error("Tokens array requires a `links` property.");
                        this.options.gfm ? this.options.breaks ? this.rules = p.breaks : this.rules = p.gfm : this.options.pedantic && (this.rules = p.pedantic)
                    }

                    function o(e) {
                        this.options = e || {}
                    }

                    function a(e) {
                        this.tokens = [], this.token = null, this.options = e || h.defaults, this.options.renderer = this.options.renderer || new o, this.renderer = this.options.renderer, this.renderer.options = this.options
                    }

                    function l(e, t) {
                        return e.replace(t ? /&/g : /&(?!#?\w+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
                    }

                    function s(e) {
                        return e.replace(/&([#\w]+);/g, function(e, t) {
                            return t = t.toLowerCase(), "colon" === t ? ":" : "#" === t.charAt(0) ? "x" === t.charAt(1) ? String.fromCharCode(parseInt(t.substring(2), 16)) : String.fromCharCode(+t.substring(1)) : ""
                        })
                    }

                    function c(e, t) {
                        return e = e.source, t = t || "",
                            function n(r, i) {
                                return r ? (i = i.source || i, i = i.replace(/(^|[^\[])\^/g, "$1"), e = e.replace(r, i), n) : new RegExp(e, t)
                            }
                    }

                    function u() {}

                    function f(e) {
                        for (var t, n, r = 1; r < arguments.length; r++) {
                            t = arguments[r];
                            for (n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
                        }
                        return e
                    }

                    function h(e, n, r) {
                        if (r || "function" == typeof n) {
                            r || (r = n, n = null), n = f({}, h.defaults, n || {});
                            var i, o, s = n.highlight,
                                c = 0;
                            try {
                                i = t.lex(e, n)
                            } catch (u) {
                                return r(u)
                            }
                            o = i.length;
                            var d = function(e) {
                                if (e) return n.highlight = s, r(e);
                                var t;
                                try {
                                    t = a.parse(i, n)
                                } catch (o) {
                                    e = o
                                }
                                return n.highlight = s, e ? r(e) : r(null, t)
                            };
                            if (!s || s.length < 3) return d();
                            if (delete n.highlight, !o) return d();
                            for (; c < i.length; c++) ! function(e) {
                                return "code" !== e.type ? --o || d() : s(e.text, e.lang, function(t, n) {
                                    return t ? d(t) : null == n || n === e.text ? --o || d() : (e.text = n, e.escaped = !0, void(--o || d()))
                                })
                            }(i[c])
                        } else try {
                            return n && (n = f({}, h.defaults, n)), a.parse(t.lex(e, n), n)
                        } catch (u) {
                            if (u.message += "\nPlease report this to https://github.com/chjj/marked.", (n || h.defaults).silent) return "<p>An error occured:</p><pre>" + l(u.message + "", !0) + "</pre>";
                            throw u
                        }
                    }
                    var d = {
                        newline: /^\n+/,
                        code: /^( {4}[^\n]+\n*)+/,
                        fences: u,
                        hr: /^( *[-*_]){3,} *(?:\n+|$)/,
                        heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
                        nptable: u,
                        lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
                        blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
                        list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
                        html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
                        def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
                        table: u,
                        paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
                        text: /^[^\n]+/
                    };
                    d.bullet = /(?:[*+-]|\d+\.)/, d.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/, d.item = c(d.item, "gm")(/bull/g, d.bullet)(), d.list = c(d.list)(/bull/g, d.bullet)("hr", "\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))")("def", "\\n+(?=" + d.def.source + ")")(), d.blockquote = c(d.blockquote)("def", d.def)(), d._tag = "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b", d.html = c(d.html)("comment", /<!--[\s\S]*?-->/)("closed", /<(tag)[\s\S]+?<\/\1>/)("closing", /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g, d._tag)(), d.paragraph = c(d.paragraph)("hr", d.hr)("heading", d.heading)("lheading", d.lheading)("blockquote", d.blockquote)("tag", "<" + d._tag)("def", d.def)(), d.normal = f({}, d), d.gfm = f({}, d.normal, {
                        fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
                        paragraph: /^/,
                        heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
                    }), d.gfm.paragraph = c(d.paragraph)("(?!", "(?!" + d.gfm.fences.source.replace("\\1", "\\2") + "|" + d.list.source.replace("\\1", "\\3") + "|")(), d.tables = f({}, d.gfm, {
                        nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
                        table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
                    }), t.rules = d, t.lex = function(e, n) {
                        var r = new t(n);
                        return r.lex(e)
                    }, t.prototype.lex = function(e) {
                        return e = e.replace(/\r\n|\r/g, "\n").replace(/\t/g, "    ").replace(/\u00a0/g, " ").replace(/\u2424/g, "\n"), this.token(e, !0)
                    }, t.prototype.token = function(e, t, n) {
                        for (var r, i, o, a, l, s, c, u, f, e = e.replace(/^ +$/gm, ""); e;)
                            if ((o = this.rules.newline.exec(e)) && (e = e.substring(o[0].length), o[0].length > 1 && this.tokens.push({
                                    type: "space"
                                })), o = this.rules.code.exec(e)) e = e.substring(o[0].length), o = o[0].replace(/^ {4}/gm, ""), this.tokens.push({
                                type: "code",
                                text: this.options.pedantic ? o : o.replace(/\n+$/, "")
                            });
                            else if (o = this.rules.fences.exec(e)) e = e.substring(o[0].length), this.tokens.push({
                            type: "code",
                            lang: o[2],
                            text: o[3] || ""
                        });
                        else if (o = this.rules.heading.exec(e)) e = e.substring(o[0].length), this.tokens.push({
                            type: "heading",
                            depth: o[1].length,
                            text: o[2]
                        });
                        else if (t && (o = this.rules.nptable.exec(e))) {
                            for (e = e.substring(o[0].length), s = {
                                    type: "table",
                                    header: o[1].replace(/^ *| *\| *$/g, "").split(/ *\| */),
                                    align: o[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
                                    cells: o[3].replace(/\n$/, "").split("\n")
                                }, u = 0; u < s.align.length; u++) /^ *-+: *$/.test(s.align[u]) ? s.align[u] = "right" : /^ *:-+: *$/.test(s.align[u]) ? s.align[u] = "center" : /^ *:-+ *$/.test(s.align[u]) ? s.align[u] = "left" : s.align[u] = null;
                            for (u = 0; u < s.cells.length; u++) s.cells[u] = s.cells[u].split(/ *\| */);
                            this.tokens.push(s)
                        } else if (o = this.rules.lheading.exec(e)) e = e.substring(o[0].length), this.tokens.push({
                            type: "heading",
                            depth: "=" === o[2] ? 1 : 2,
                            text: o[1]
                        });
                        else if (o = this.rules.hr.exec(e)) e = e.substring(o[0].length), this.tokens.push({
                            type: "hr"
                        });
                        else if (o = this.rules.blockquote.exec(e)) e = e.substring(o[0].length), this.tokens.push({
                            type: "blockquote_start"
                        }), o = o[0].replace(/^ *> ?/gm, ""), this.token(o, t, !0), this.tokens.push({
                            type: "blockquote_end"
                        });
                        else if (o = this.rules.list.exec(e)) {
                            for (e = e.substring(o[0].length), a = o[2], this.tokens.push({
                                    type: "list_start",
                                    ordered: a.length > 1
                                }), o = o[0].match(this.rules.item), r = !1, f = o.length, u = 0; f > u; u++) s = o[u], c = s.length, s = s.replace(/^ *([*+-]|\d+\.) +/, ""), ~s.indexOf("\n ") && (c -= s.length, s = this.options.pedantic ? s.replace(/^ {1,4}/gm, "") : s.replace(new RegExp("^ {1," + c + "}", "gm"), "")), this.options.smartLists && u !== f - 1 && (l = d.bullet.exec(o[u + 1])[0], a === l || a.length > 1 && l.length > 1 || (e = o.slice(u + 1).join("\n") + e, u = f - 1)), i = r || /\n\n(?!\s*$)/.test(s), u !== f - 1 && (r = "\n" === s.charAt(s.length - 1), i || (i = r)), this.tokens.push({
                                type: i ? "loose_item_start" : "list_item_start"
                            }), this.token(s, !1, n), this.tokens.push({
                                type: "list_item_end"
                            });
                            this.tokens.push({
                                type: "list_end"
                            })
                        } else if (o = this.rules.html.exec(e)) e = e.substring(o[0].length), this.tokens.push({
                            type: this.options.sanitize ? "paragraph" : "html",
                            pre: !this.options.sanitizer && ("pre" === o[1] || "script" === o[1] || "style" === o[1]),
                            text: o[0]
                        });
                        else if (!n && t && (o = this.rules.def.exec(e))) e = e.substring(o[0].length), this.tokens.links[o[1].toLowerCase()] = {
                            href: o[2],
                            title: o[3]
                        };
                        else if (t && (o = this.rules.table.exec(e))) {
                            for (e = e.substring(o[0].length), s = {
                                    type: "table",
                                    header: o[1].replace(/^ *| *\| *$/g, "").split(/ *\| */),
                                    align: o[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
                                    cells: o[3].replace(/(?: *\| *)?\n$/, "").split("\n")
                                }, u = 0; u < s.align.length; u++) /^ *-+: *$/.test(s.align[u]) ? s.align[u] = "right" : /^ *:-+: *$/.test(s.align[u]) ? s.align[u] = "center" : /^ *:-+ *$/.test(s.align[u]) ? s.align[u] = "left" : s.align[u] = null;
                            for (u = 0; u < s.cells.length; u++) s.cells[u] = s.cells[u].replace(/^ *\| *| *\| *$/g, "").split(/ *\| */);
                            this.tokens.push(s)
                        } else if (t && (o = this.rules.paragraph.exec(e))) e = e.substring(o[0].length), this.tokens.push({
                            type: "paragraph",
                            text: "\n" === o[1].charAt(o[1].length - 1) ? o[1].slice(0, -1) : o[1]
                        });
                        else if (o = this.rules.text.exec(e)) e = e.substring(o[0].length), this.tokens.push({
                            type: "text",
                            text: o[0]
                        });
                        else if (e) throw new Error("Infinite loop on byte: " + e.charCodeAt(0));
                        return this.tokens
                    };
                    var p = {
                        escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
                        autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
                        url: u,
                        tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
                        link: /^!?\[(inside)\]\(href\)/,
                        reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
                        nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
                        strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
                        em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
                        code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
                        br: /^ {2,}\n(?!\s*$)/,
                        del: u,
                        text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
                    };
                    p._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/, p._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/, p.link = c(p.link)("inside", p._inside)("href", p._href)(), p.reflink = c(p.reflink)("inside", p._inside)(), p.normal = f({}, p), p.pedantic = f({}, p.normal, {
                        strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
                        em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
                    }), p.gfm = f({}, p.normal, {
                        escape: c(p.escape)("])", "~|])")(),
                        url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
                        del: /^~~(?=\S)([\s\S]*?\S)~~/,
                        text: c(p.text)("]|", "~]|")("|", "|https?://|")()
                    }), p.breaks = f({}, p.gfm, {
                        br: c(p.br)("{2,}", "*")(),
                        text: c(p.gfm.text)("{2,}", "*")()
                    }), i.rules = p, i.output = function(e, t, n) {
                        var r = new i(t, n);
                        return r.output(e)
                    }, i.prototype.output = function(e) {
                        for (var t, n, r, i, o = ""; e;)
                            if (i = this.rules.escape.exec(e)) e = e.substring(i[0].length), o += i[1];
                            else if (i = this.rules.autolink.exec(e)) e = e.substring(i[0].length), "@" === i[2] ? (n = ":" === i[1].charAt(6) ? this.mangle(i[1].substring(7)) : this.mangle(i[1]), r = this.mangle("mailto:") + n) : (n = l(i[1]), r = n), o += this.renderer.link(r, null, n);
                        else if (this.inLink || !(i = this.rules.url.exec(e))) {
                            if (i = this.rules.tag.exec(e)) !this.inLink && /^<a /i.test(i[0]) ? this.inLink = !0 : this.inLink && /^<\/a>/i.test(i[0]) && (this.inLink = !1), e = e.substring(i[0].length), o += this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(i[0]) : l(i[0]) : i[0];
                            else if (i = this.rules.link.exec(e)) e = e.substring(i[0].length), this.inLink = !0, o += this.outputLink(i, {
                                href: i[2],
                                title: i[3]
                            }), this.inLink = !1;
                            else if ((i = this.rules.reflink.exec(e)) || (i = this.rules.nolink.exec(e))) {
                                if (e = e.substring(i[0].length), t = (i[2] || i[1]).replace(/\s+/g, " "), t = this.links[t.toLowerCase()], !t || !t.href) {
                                    o += i[0].charAt(0), e = i[0].substring(1) + e;
                                    continue
                                }
                                this.inLink = !0, o += this.outputLink(i, t), this.inLink = !1
                            } else if (i = this.rules.strong.exec(e)) e = e.substring(i[0].length), o += this.renderer.strong(this.output(i[2] || i[1]));
                            else if (i = this.rules.em.exec(e)) e = e.substring(i[0].length), o += this.renderer.em(this.output(i[2] || i[1]));
                            else if (i = this.rules.code.exec(e)) e = e.substring(i[0].length), o += this.renderer.codespan(l(i[2], !0));
                            else if (i = this.rules.br.exec(e)) e = e.substring(i[0].length), o += this.renderer.br();
                            else if (i = this.rules.del.exec(e)) e = e.substring(i[0].length), o += this.renderer.del(this.output(i[1]));
                            else if (i = this.rules.text.exec(e)) e = e.substring(i[0].length), o += this.renderer.text(l(this.smartypants(i[0])));
                            else if (e) throw new Error("Infinite loop on byte: " + e.charCodeAt(0))
                        } else e = e.substring(i[0].length), n = l(i[1]), r = n, o += this.renderer.link(r, null, n);
                        return o
                    }, i.prototype.outputLink = function(e, t) {
                        var n = l(t.href),
                            r = t.title ? l(t.title) : null;
                        return "!" !== e[0].charAt(0) ? this.renderer.link(n, r, this.output(e[1])) : this.renderer.image(n, r, l(e[1]))
                    }, i.prototype.smartypants = function(e) {
                        return this.options.smartypants ? e.replace(/---/g, "—").replace(/--/g, "–").replace(/(^|[-\u2014\/(\[{"\s])'/g, "$1‘").replace(/'/g, "’").replace(/(^|[-\u2014\/(\[{\u2018\s])"/g, "$1“").replace(/"/g, "”").replace(/\.{3}/g, "…") : e
                    }, i.prototype.mangle = function(e) {
                        if (!this.options.mangle) return e;
                        for (var t, n = "", r = e.length, i = 0; r > i; i++) t = e.charCodeAt(i), Math.random() > .5 && (t = "x" + t.toString(16)), n += "&#" + t + ";";
                        return n
                    }, o.prototype.code = function(e, t, n) {
                        if (this.options.highlight) {
                            var r = this.options.highlight(e, t);
                            null != r && r !== e && (n = !0, e = r)
                        }
                        return t ? '<pre><code class="' + this.options.langPrefix + l(t, !0) + '">' + (n ? e : l(e, !0)) + "\n</code></pre>\n" : "<pre><code>" + (n ? e : l(e, !0)) + "\n</code></pre>"
                    }, o.prototype.blockquote = function(e) {
                        return "<blockquote>\n" + e + "</blockquote>\n"
                    }, o.prototype.html = function(e) {
                        return e
                    }, o.prototype.heading = function(e, t, n) {
                        return "<h" + t + ' id="' + this.options.headerPrefix + n.toLowerCase().replace(/[^\w]+/g, "-") + '">' + e + "</h" + t + ">\n"
                    }, o.prototype.hr = function() {
                        return this.options.xhtml ? "<hr/>\n" : "<hr>\n"
                    }, o.prototype.list = function(e, t) {
                        var n = t ? "ol" : "ul";
                        return "<" + n + ">\n" + e + "</" + n + ">\n"
                    }, o.prototype.listitem = function(e) {
                        return "<li>" + e + "</li>\n"
                    }, o.prototype.paragraph = function(e) {
                        return "<p>" + e + "</p>\n"
                    }, o.prototype.table = function(e, t) {
                        return "<table>\n<thead>\n" + e + "</thead>\n<tbody>\n" + t + "</tbody>\n</table>\n"
                    }, o.prototype.tablerow = function(e) {
                        return "<tr>\n" + e + "</tr>\n"
                    }, o.prototype.tablecell = function(e, t) {
                        var n = t.header ? "th" : "td",
                            r = t.align ? "<" + n + ' style="text-align:' + t.align + '">' : "<" + n + ">";
                        return r + e + "</" + n + ">\n"
                    }, o.prototype.strong = function(e) {
                        return "<strong>" + e + "</strong>"
                    }, o.prototype.em = function(e) {
                        return "<em>" + e + "</em>"
                    }, o.prototype.codespan = function(e) {
                        return "<code>" + e + "</code>"
                    }, o.prototype.br = function() {
                        return this.options.xhtml ? "<br/>" : "<br>"
                    }, o.prototype.del = function(e) {
                        return "<del>" + e + "</del>"
                    }, o.prototype.link = function(e, t, n) {
                        if (this.options.sanitize) {
                            try {
                                var r = decodeURIComponent(s(e)).replace(/[^\w:]/g, "").toLowerCase()
                            } catch (i) {
                                return ""
                            }
                            if (0 === r.indexOf("javascript:") || 0 === r.indexOf("vbscript:")) return ""
                        }
                        var o = '<a href="' + e + '"';
                        return t && (o += ' title="' + t + '"'), o += ">" + n + "</a>"
                    }, o.prototype.image = function(e, t, n) {
                        var r = '<img src="' + e + '" alt="' + n + '"';
                        return t && (r += ' title="' + t + '"'), r += this.options.xhtml ? "/>" : ">"
                    }, o.prototype.text = function(e) {
                        return e
                    }, a.parse = function(e, t, n) {
                        var r = new a(t, n);
                        return r.parse(e)
                    }, a.prototype.parse = function(e) {
                        this.inline = new i(e.links, this.options, this.renderer), this.tokens = e.reverse();
                        for (var t = ""; this.next();) t += this.tok();
                        return t
                    }, a.prototype.next = function() {
                        return this.token = this.tokens.pop()
                    }, a.prototype.peek = function() {
                        return this.tokens[this.tokens.length - 1] || 0
                    }, a.prototype.parseText = function() {
                        for (var e = this.token.text;
                            "text" === this.peek().type;) e += "\n" + this.next().text;
                        return this.inline.output(e)
                    }, a.prototype.tok = function() {
                        switch (this.token.type) {
                            case "space":
                                return "";
                            case "hr":
                                return this.renderer.hr();
                            case "heading":
                                return this.renderer.heading(this.inline.output(this.token.text), this.token.depth, this.token.text);
                            case "code":
                                return this.renderer.code(this.token.text, this.token.lang, this.token.escaped);
                            case "table":
                                var e, t, n, r, i, o = "",
                                    a = "";
                                for (n = "", e = 0; e < this.token.header.length; e++) r = {
                                    header: !0,
                                    align: this.token.align[e]
                                }, n += this.renderer.tablecell(this.inline.output(this.token.header[e]), {
                                    header: !0,
                                    align: this.token.align[e]
                                });
                                for (o += this.renderer.tablerow(n), e = 0; e < this.token.cells.length; e++) {
                                    for (t = this.token.cells[e], n = "", i = 0; i < t.length; i++) n += this.renderer.tablecell(this.inline.output(t[i]), {
                                        header: !1,
                                        align: this.token.align[i]
                                    });
                                    a += this.renderer.tablerow(n)
                                }
                                return this.renderer.table(o, a);
                            case "blockquote_start":
                                for (var a = "";
                                    "blockquote_end" !== this.next().type;) a += this.tok();
                                return this.renderer.blockquote(a);
                            case "list_start":
                                for (var a = "", l = this.token.ordered;
                                    "list_end" !== this.next().type;) a += this.tok();
                                return this.renderer.list(a, l);
                            case "list_item_start":
                                for (var a = "";
                                    "list_item_end" !== this.next().type;) a += "text" === this.token.type ? this.parseText() : this.tok();
                                return this.renderer.listitem(a);
                            case "loose_item_start":
                                for (var a = "";
                                    "list_item_end" !== this.next().type;) a += this.tok();
                                return this.renderer.listitem(a);
                            case "html":
                                var s = this.token.pre || this.options.pedantic ? this.token.text : this.inline.output(this.token.text);
                                return this.renderer.html(s);
                            case "paragraph":
                                return this.renderer.paragraph(this.inline.output(this.token.text));
                            case "text":
                                return this.renderer.paragraph(this.parseText())
                        }
                    }, u.exec = u, h.options = h.setOptions = function(e) {
                        return f(h.defaults, e), h
                    }, h.defaults = {
                        gfm: !0,
                        tables: !0,
                        breaks: !1,
                        pedantic: !1,
                        sanitize: !1,
                        sanitizer: null,
                        mangle: !0,
                        smartLists: !1,
                        silent: !1,
                        highlight: null,
                        langPrefix: "lang-",
                        smartypants: !1,
                        headerPrefix: "",
                        renderer: new o,
                        xhtml: !1
                    }, h.Parser = a, h.parser = a.parse, h.Renderer = o, h.Lexer = t, h.lexer = t.lex, h.InlineLexer = i, h.inlineLexer = i.output, h.parse = h, "undefined" != typeof n && "object" == typeof r ? n.exports = h : "function" == typeof e && e.amd ? e(function() {
                        return h
                    }) : this.marked = h
                }).call(function() {
                    return this || ("undefined" != typeof window ? window : t)
                }())
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {}],
        18: [function(e, t, n) {
            (function(n, r) {
                "use strict";
                var i = function(e, t, n, i) {
                    if (i = i || {}, this.dictionary = null, this.rules = {}, this.dictionaryTable = {}, this.compoundRules = [], this.compoundRuleCodes = {}, this.replacementTable = [], this.flags = i.flags || {}, e) {
                        if (this.dictionary = e, "undefined" != typeof window && "chrome" in window && "extension" in window.chrome && "getURL" in window.chrome.extension) t || (t = this._readFile(chrome.extension.getURL("lib/typo/dictionaries/" + e + "/" + e + ".aff"))), n || (n = this._readFile(chrome.extension.getURL("lib/typo/dictionaries/" + e + "/" + e + ".dic")));
                        else {
                            if (i.dictionaryPath) var o = i.dictionaryPath;
                            else if ("undefined" != typeof r) var o = r + "/dictionaries";
                            else var o = "./dictionaries";
                            t || (t = this._readFile(o + "/" + e + "/" + e + ".aff")), n || (n = this._readFile(o + "/" + e + "/" + e + ".dic"))
                        }
                        this.rules = this._parseAFF(t), this.compoundRuleCodes = {};
                        for (var a = 0, l = this.compoundRules.length; l > a; a++)
                            for (var s = this.compoundRules[a], c = 0, u = s.length; u > c; c++) this.compoundRuleCodes[s[c]] = [];
                        "ONLYINCOMPOUND" in this.flags && (this.compoundRuleCodes[this.flags.ONLYINCOMPOUND] = []), this.dictionaryTable = this._parseDIC(n);
                        for (var a in this.compoundRuleCodes) 0 == this.compoundRuleCodes[a].length && delete this.compoundRuleCodes[a];
                        for (var a = 0, l = this.compoundRules.length; l > a; a++) {
                            for (var f = this.compoundRules[a], h = "", c = 0, u = f.length; u > c; c++) {
                                var d = f[c];
                                h += d in this.compoundRuleCodes ? "(" + this.compoundRuleCodes[d].join("|") + ")" : d
                            }
                            this.compoundRules[a] = new RegExp(h, "i")
                        }
                    }
                    return this
                };
                i.prototype = {
                    load: function(e) {
                        for (var t in e) this[t] = e[t];
                        return this
                    },
                    _readFile: function(t, r) {
                        if (r || (r = "utf8"), "undefined" != typeof XMLHttpRequest) {
                            var i = new XMLHttpRequest;
                            return i.open("GET", t, !1), i.overrideMimeType && i.overrideMimeType("text/plain; charset=" + r), i.send(null), i.responseText
                        }
                        if ("undefined" != typeof e) {
                            var o = e("fs");
                            try {
                                if (o.existsSync(t)) {
                                    var a = o.statSync(t),
                                        l = o.openSync(t, "r"),
                                        s = new n(a.size);
                                    return o.readSync(l, s, 0, s.length, null), s.toString(r, 0, s.length)
                                }
                                console.log("Path " + t + " does not exist.")
                            } catch (c) {
                                return console.log(c), ""
                            }
                        }
                    },
                    _parseAFF: function(e) {
                        var t = {};
                        e = this._removeAffixComments(e);
                        for (var n = e.split("\n"), r = 0, i = n.length; i > r; r++) {
                            var o = n[r],
                                a = o.split(/\s+/),
                                l = a[0];
                            if ("PFX" == l || "SFX" == l) {
                                for (var s = a[1], c = a[2], u = parseInt(a[3], 10), f = [], h = r + 1, d = r + 1 + u; d > h; h++) {
                                    var o = n[h],
                                        p = o.split(/\s+/),
                                        m = p[2],
                                        g = p[3].split("/"),
                                        v = g[0];
                                    "0" === v && (v = "");
                                    var y = this.parseRuleCodes(g[1]),
                                        x = p[4],
                                        b = {};
                                    b.add = v, y.length > 0 && (b.continuationClasses = y), "." !== x && ("SFX" === l ? b.match = new RegExp(x + "$") : b.match = new RegExp("^" + x)), "0" != m && ("SFX" === l ? b.remove = new RegExp(m + "$") : b.remove = m), f.push(b)
                                }
                                t[s] = {
                                    type: l,
                                    combineable: "Y" == c,
                                    entries: f
                                }, r += u
                            } else if ("COMPOUNDRULE" === l) {
                                for (var u = parseInt(a[1], 10), h = r + 1, d = r + 1 + u; d > h; h++) {
                                    var o = n[h],
                                        p = o.split(/\s+/);
                                    this.compoundRules.push(p[1])
                                }
                                r += u
                            } else if ("REP" === l) {
                                var p = o.split(/\s+/);
                                3 === p.length && this.replacementTable.push([p[1], p[2]])
                            } else this.flags[l] = a[1]
                        }
                        return t
                    },
                    _removeAffixComments: function(e) {
                        return e = e.replace(/#.*$/gm, ""), e = e.replace(/^\s\s*/m, "").replace(/\s\s*$/m, ""), e = e.replace(/\n{2,}/g, "\n"), e = e.replace(/^\s\s*/, "").replace(/\s\s*$/, "")
                    },
                    _parseDIC: function(e) {
                        function t(e, t) {
                            e in r && "object" == typeof r[e] || (r[e] = []), r[e].push(t)
                        }
                        e = this._removeDicComments(e);
                        for (var n = e.split("\n"), r = {}, i = 1, o = n.length; o > i; i++) {
                            var a = n[i],
                                l = a.split("/", 2),
                                s = l[0];
                            if (l.length > 1) {
                                var c = this.parseRuleCodes(l[1]);
                                "NEEDAFFIX" in this.flags && -1 != c.indexOf(this.flags.NEEDAFFIX) || t(s, c);
                                for (var u = 0, f = c.length; f > u; u++) {
                                    var h = c[u],
                                        d = this.rules[h];
                                    if (d)
                                        for (var p = this._applyRule(s, d), m = 0, g = p.length; g > m; m++) {
                                            var v = p[m];
                                            if (t(v, []), d.combineable)
                                                for (var y = u + 1; f > y; y++) {
                                                    var x = c[y],
                                                        b = this.rules[x];
                                                    if (b && b.combineable && d.type != b.type)
                                                        for (var w = this._applyRule(v, b), k = 0, S = w.length; S > k; k++) {
                                                            var C = w[k];
                                                            t(C, [])
                                                        }
                                                }
                                        }
                                    h in this.compoundRuleCodes && this.compoundRuleCodes[h].push(s)
                                }
                            } else t(s.trim(), [])
                        }
                        return r
                    },
                    _removeDicComments: function(e) {
                        return e = e.replace(/^\t.*$/gm, "")
                    },
                    parseRuleCodes: function(e) {
                        if (!e) return [];
                        if (!("FLAG" in this.flags)) return e.split("");
                        if ("long" === this.flags.FLAG) {
                            for (var t = [], n = 0, r = e.length; r > n; n += 2) t.push(e.substr(n, 2));
                            return t
                        }
                        return "num" === this.flags.FLAG ? textCode.split(",") : void 0
                    },
                    _applyRule: function(e, t) {
                        for (var n = t.entries, r = [], i = 0, o = n.length; o > i; i++) {
                            var a = n[i];
                            if (!a.match || e.match(a.match)) {
                                var l = e;
                                if (a.remove && (l = l.replace(a.remove, "")), "SFX" === t.type ? l += a.add : l = a.add + l, r.push(l), "continuationClasses" in a)
                                    for (var s = 0, c = a.continuationClasses.length; c > s; s++) {
                                        var u = this.rules[a.continuationClasses[s]];
                                        u && (r = r.concat(this._applyRule(l, u)))
                                    }
                            }
                        }
                        return r
                    },
                    check: function(e) {
                        var t = e.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
                        if (this.checkExact(t)) return !0;
                        if (t.toUpperCase() === t) {
                            var n = t[0] + t.substring(1).toLowerCase();
                            if (this.hasFlag(n, "KEEPCASE")) return !1;
                            if (this.checkExact(n)) return !0
                        }
                        var r = t.toLowerCase();
                        if (r !== t) {
                            if (this.hasFlag(r, "KEEPCASE")) return !1;
                            if (this.checkExact(r)) return !0
                        }
                        return !1
                    },
                    checkExact: function(e) {
                        var t = this.dictionaryTable[e];
                        if ("undefined" == typeof t) {
                            if ("COMPOUNDMIN" in this.flags && e.length >= this.flags.COMPOUNDMIN)
                                for (var n = 0, r = this.compoundRules.length; r > n; n++)
                                    if (e.match(this.compoundRules[n])) return !0;
                            return !1
                        }
                        if ("object" == typeof t) {
                            for (var n = 0, r = t.length; r > n; n++)
                                if (!this.hasFlag(e, "ONLYINCOMPOUND", t[n])) return !0;
                            return !1
                        }
                    },
                    hasFlag: function(e, t, n) {
                        if (t in this.flags) {
                            if ("undefined" == typeof n) var n = Array.prototype.concat.apply([], this.dictionaryTable[e]);
                            if (n && -1 !== n.indexOf(this.flags[t])) return !0
                        }
                        return !1
                    },
                    alphabet: "",
                    suggest: function(e, t) {
                        function n(e) {
                            for (var t = [], n = 0, r = e.length; r > n; n++) {
                                for (var i = e[n], o = [], a = 0, l = i.length + 1; l > a; a++) o.push([i.substring(0, a), i.substring(a, i.length)]);
                                for (var s = [], a = 0, l = o.length; l > a; a++) {
                                    var u = o[a];
                                    u[1] && s.push(u[0] + u[1].substring(1))
                                }
                                for (var f = [], a = 0, l = o.length; l > a; a++) {
                                    var u = o[a];
                                    u[1].length > 1 && f.push(u[0] + u[1][1] + u[1][0] + u[1].substring(2))
                                }
                                for (var h = [], a = 0, l = o.length; l > a; a++) {
                                    var u = o[a];
                                    if (u[1])
                                        for (var d = 0, p = c.alphabet.length; p > d; d++) h.push(u[0] + c.alphabet[d] + u[1].substring(1))
                                }
                                for (var m = [], a = 0, l = o.length; l > a; a++) {
                                    var u = o[a];
                                    if (u[1])
                                        for (var d = 0, p = c.alphabet.length; p > d; d++) h.push(u[0] + c.alphabet[d] + u[1])
                                }
                                t = t.concat(s), t = t.concat(f), t = t.concat(h), t = t.concat(m)
                            }
                            return t
                        }

                        function r(e) {
                            for (var t = [], n = 0; n < e.length; n++) c.check(e[n]) && t.push(e[n]);
                            return t
                        }

                        function i(e) {
                            function i(e, t) {
                                return e[1] < t[1] ? -1 : 1
                            }
                            for (var o = n([e]), a = n(o), l = r(o).concat(r(a)), s = {}, u = 0, f = l.length; f > u; u++) l[u] in s ? s[l[u]] += 1 : s[l[u]] = 1;
                            var h = [];
                            for (var u in s) h.push([u, s[u]]);
                            h.sort(i).reverse();
                            for (var d = [], u = 0, f = Math.min(t, h.length); f > u; u++) c.hasFlag(h[u][0], "NOSUGGEST") || d.push(h[u][0]);
                            return d
                        }
                        if (t || (t = 5), this.check(e)) return [];
                        for (var o = 0, a = this.replacementTable.length; a > o; o++) {
                            var l = this.replacementTable[o];
                            if (-1 !== e.indexOf(l[0])) {
                                var s = e.replace(l[0], l[1]);
                                if (this.check(s)) return [s]
                            }
                        }
                        var c = this;
                        return c.alphabet = "abcdefghijklmnopqrstuvwxyz", i(e)
                    }
                }, "undefined" != typeof t && (t.exports = i)
            }).call(this, e("buffer").Buffer, "/node_modules/typo-js")
        }, {
            buffer: 3,
            fs: 2
        }],
        19: [function(e, t, n) {
            var r = e("codemirror");
            r.commands.tabAndIndentMarkdownList = function(e) {
                var t = e.listSelections(),
                    n = t[0].head,
                    r = e.getStateAfter(n.line),
                    i = r.list !== !1;
                if (i) return void e.execCommand("indentMore");
                if (e.options.indentWithTabs) e.execCommand("insertTab");
                else {
                    var o = Array(e.options.tabSize + 1).join(" ");
                    e.replaceSelection(o)
                }
            }, r.commands.shiftTabAndUnindentMarkdownList = function(e) {
                var t = e.listSelections(),
                    n = t[0].head,
                    r = e.getStateAfter(n.line),
                    i = r.list !== !1;
                if (i) return void e.execCommand("indentLess");
                if (e.options.indentWithTabs) e.execCommand("insertTab");
                else {
                    var o = Array(e.options.tabSize + 1).join(" ");
                    e.replaceSelection(o)
                }
            }
        }, {
            codemirror: 10
        }],
        20: [function(e, t, n) {
            "use strict";

            function r(e) {
                return e = U ? e.replace("Ctrl", "Cmd") : e.replace("Cmd", "Ctrl")
            }

            function i(e, t, n) {
                e = e || {};
                var r = document.createElement("a");
                return t = void 0 == t ? !0 : t, e.title && t && (r.title = a(e.title, e.action, n), U && (r.title = r.title.replace("Ctrl", "⌘"), r.title = r.title.replace("Alt", "⌥"))), r.tabIndex = -1, r.className = e.className, r
            }

            function o() {
                var e = document.createElement("i");
                return e.className = "separator", e.innerHTML = "|", e
            }

            function a(e, t, n) {
                var i, o = e;
                return t && (i = Y(t), n[i] && (o += " (" + r(n[i]) + ")")), o
            }

            function l(e, t) {
                t = t || e.getCursor("start");
                var n = e.getTokenAt(t);
                if (!n.type) return {};
                for (var r, i, o = n.type.split(" "), a = {}, l = 0; l < o.length; l++) r = o[l], "strong" === r ? a.bold = !0 : "variable-2" === r ? (i = e.getLine(t.line), /^\s*\d+\.\s/.test(i) ? a["ordered-list"] = !0 : a["unordered-list"] = !0) : "atom" === r ? a.quote = !0 : "em" === r ? a.italic = !0 : "quote" === r ? a.quote = !0 : "strikethrough" === r ? a.strikethrough = !0 : "comment" === r ? a.code = !0 : "link" === r ? a.link = !0 : "tag" === r ? a.image = !0 : r.match(/^header(\-[1-6])?$/) && (a[r.replace("header", "heading")] = !0);
                return a
            }

            function s(e) {
                var t = e.codemirror;
                t.setOption("fullScreen", !t.getOption("fullScreen")), t.getOption("fullScreen") ? (V = document.body.style.overflow, document.body.style.overflow = "hidden") : document.body.style.overflow = V;
                var n = t.getWrapperElement();
                /fullscreen/.test(n.previousSibling.className) ? n.previousSibling.className = n.previousSibling.className.replace(/\s*fullscreen\b/, "") : n.previousSibling.className += " fullscreen";
                var r = e.toolbarElements.fullscreen;
                /active/.test(r.className) ? r.className = r.className.replace(/\s*active\s*/g, "") : r.className += " active";
                var i = t.getWrapperElement().nextSibling;
                /editor-preview-active-side/.test(i.className) && N(e)
            }

            function c(e) {
                P(e, "bold", e.options.blockStyles.bold)
            }

            function u(e) {
                P(e, "italic", e.options.blockStyles.italic)
            }

            function f(e) {
                P(e, "strikethrough", "~~")
            }

            function h(e) {
                function t(e) {
                    if ("object" != typeof e) throw "fencing_line() takes a 'line' object (not a line number, or line text).  Got: " + typeof e + ": " + e;
                    return e.styles && e.styles[2] && -1 !== e.styles[2].indexOf("formatting-code-block")
                }

                function n(e) {
                    return e.state.base.base || e.state.base
                }

                function r(e, r, i, o, a) {
                    i = i || e.getLineHandle(r), o = o || e.getTokenAt({
                        line: r,
                        ch: 1
                    }), a = a || !!i.text && e.getTokenAt({
                        line: r,
                        ch: i.text.length - 1
                    });
                    var l = o.type ? o.type.split(" ") : [];
                    return a && n(a).indentedCode ? "indented" : -1 === l.indexOf("comment") ? !1 : n(o).fencedChars || n(a).fencedChars || t(i) ? "fenced" : "single"
                }

                function i(e, t, n, r) {
                    var i = t.line + 1,
                        o = n.line + 1,
                        a = t.line !== n.line,
                        l = r + "\n",
                        s = "\n" + r;
                    a && o++, a && 0 === n.ch && (s = r + "\n", o--), E(e, !1, [l, s]), e.setSelection({
                        line: i,
                        ch: 0
                    }, {
                        line: o,
                        ch: 0
                    })
                }
                var o, a, l, s = e.options.blockStyles.code,
                    c = e.codemirror,
                    u = c.getCursor("start"),
                    f = c.getCursor("end"),
                    h = c.getTokenAt({
                        line: u.line,
                        ch: u.ch || 1
                    }),
                    d = c.getLineHandle(u.line),
                    p = r(c, u.line, d, h);
                if ("single" === p) {
                    var m = d.text.slice(0, u.ch).replace("`", ""),
                        g = d.text.slice(u.ch).replace("`", "");
                    c.replaceRange(m + g, {
                        line: u.line,
                        ch: 0
                    }, {
                        line: u.line,
                        ch: 99999999999999
                    }), u.ch--, u !== f && f.ch--, c.setSelection(u, f), c.focus()
                } else if ("fenced" === p)
                    if (u.line !== f.line || u.ch !== f.ch) {
                        for (o = u.line; o >= 0 && (d = c.getLineHandle(o), !t(d)); o--);
                        var v, y, x, b, w = c.getTokenAt({
                                line: o,
                                ch: 1
                            }),
                            k = n(w).fencedChars;
                        t(c.getLineHandle(u.line)) ? (v = "", y = u.line) : t(c.getLineHandle(u.line - 1)) ? (v = "", y = u.line - 1) : (v = k + "\n", y = u.line), t(c.getLineHandle(f.line)) ? (x = "", b = f.line, 0 === f.ch && (b += 1)) : 0 !== f.ch && t(c.getLineHandle(f.line + 1)) ? (x = "", b = f.line + 1) : (x = k + "\n", b = f.line + 1), 0 === f.ch && (b -= 1), c.operation(function() {
                            c.replaceRange(x, {
                                line: b,
                                ch: 0
                            }, {
                                line: b + (x ? 0 : 1),
                                ch: 0
                            }), c.replaceRange(v, {
                                line: y,
                                ch: 0
                            }, {
                                line: y + (v ? 0 : 1),
                                ch: 0
                            })
                        }), c.setSelection({
                            line: y + (v ? 1 : 0),
                            ch: 0
                        }, {
                            line: b + (v ? 1 : -1),
                            ch: 0
                        }), c.focus()
                    } else {
                        var S = u.line;
                        if (t(c.getLineHandle(u.line)) && ("fenced" === r(c, u.line + 1) ? (o = u.line, S = u.line + 1) : (a = u.line, S = u.line - 1)), void 0 === o)
                            for (o = S; o >= 0 && (d = c.getLineHandle(o), !t(d)); o--);
                        if (void 0 === a)
                            for (l = c.lineCount(), a = S; l > a && (d = c.getLineHandle(a), !t(d)); a++);
                        c.operation(function() {
                            c.replaceRange("", {
                                line: o,
                                ch: 0
                            }, {
                                line: o + 1,
                                ch: 0
                            }), c.replaceRange("", {
                                line: a - 1,
                                ch: 0
                            }, {
                                line: a,
                                ch: 0
                            })
                        }), c.focus()
                    }
                else if ("indented" === p) {
                    if (u.line !== f.line || u.ch !== f.ch) o = u.line, a = f.line, 0 === f.ch && a--;
                    else {
                        for (o = u.line; o >= 0; o--)
                            if (d = c.getLineHandle(o), !d.text.match(/^\s*$/) && "indented" !== r(c, o, d)) {
                                o += 1;
                                break
                            }
                        for (l = c.lineCount(), a = u.line; l > a; a++)
                            if (d = c.getLineHandle(a), !d.text.match(/^\s*$/) && "indented" !== r(c, a, d)) {
                                a -= 1;
                                break
                            }
                    }
                    var C = c.getLineHandle(a + 1),
                        L = C && c.getTokenAt({
                            line: a + 1,
                            ch: C.text.length - 1
                        }),
                        T = L && n(L).indentedCode;
                    T && c.replaceRange("\n", {
                        line: a + 1,
                        ch: 0
                    });
                    for (var M = o; a >= M; M++) c.indentLine(M, "subtract");
                    c.focus()
                } else {
                    var N = u.line === f.line && u.ch === f.ch && 0 === u.ch,
                        A = u.line !== f.line;
                    N || A ? i(c, u, f, s) : E(c, !1, ["`", "`"])
                }
            }

            function d(e) {
                var t = e.codemirror;
                I(t, "quote")
            }

            function p(e) {
                var t = e.codemirror;
                O(t, "smaller")
            }

            function m(e) {
                var t = e.codemirror;
                O(t, "bigger")
            }

            function g(e) {
                var t = e.codemirror;
                O(t, void 0, 1)
            }

            function v(e) {
                var t = e.codemirror;
                O(t, void 0, 2)
            }

            function y(e) {
                var t = e.codemirror;
                O(t, void 0, 3)
            }

            function x(e) {
                var t = e.codemirror;
                I(t, "unordered-list")
            }

            function b(e) {
                var t = e.codemirror;
                I(t, "ordered-list")
            }

            function w(e) {
                var t = e.codemirror;
                R(t)
            }

            function k(e) {
                var t = e.codemirror,
                    n = l(t),
                    r = e.options,
                    i = "http://";
                return r.promptURLs && (i = prompt(r.promptTexts.link), !i) ? !1 : void E(t, n.link, r.insertTexts.link, i)
            }

            function S(e) {
                var t = e.codemirror,
                    n = l(t),
                    r = e.options,
                    i = "http://";
                return r.promptURLs && (i = prompt(r.promptTexts.image), !i) ? !1 : void E(t, n.image, r.insertTexts.image, i)
            }

            function C(e) {
                var t = e.codemirror,
                    n = l(t),
                    r = e.options;
                E(t, n.table, r.insertTexts.table)
            }

            function L(e) {
                var t = e.codemirror,
                    n = l(t),
                    r = e.options;
                E(t, n.image, r.insertTexts.horizontalRule)
            }

            function T(e) {
                var t = e.codemirror;
                t.undo(), t.focus()
            }

            function M(e) {
                var t = e.codemirror;
                t.redo(), t.focus()
            }

            function N(e) {
                var t = e.codemirror,
                    n = t.getWrapperElement(),
                    r = n.nextSibling,
                    i = e.toolbarElements["side-by-side"],
                    o = !1;
                /editor-preview-active-side/.test(r.className) ? (r.className = r.className.replace(/\s*editor-preview-active-side\s*/g, ""), i.className = i.className.replace(/\s*active\s*/g, ""), n.className = n.className.replace(/\s*CodeMirror-sided\s*/g, " ")) : (setTimeout(function() {
                    t.getOption("fullScreen") || s(e), r.className += " editor-preview-active-side"
                }, 1), i.className += " active", n.className += " CodeMirror-sided", o = !0);
                var a = n.lastChild;
                if (/editor-preview-active/.test(a.className)) {
                    a.className = a.className.replace(/\s*editor-preview-active\s*/g, "");
                    var l = e.toolbarElements.preview,
                        c = n.previousSibling;
                    l.className = l.className.replace(/\s*active\s*/g, ""), c.className = c.className.replace(/\s*disabled-for-preview*/g, "")
                }
                var u = function() {
                    r.innerHTML = e.options.previewRender(e.value(), r)
                };
                t.sideBySideRenderingFunction || (t.sideBySideRenderingFunction = u), o ? (r.innerHTML = e.options.previewRender(e.value(), r), t.on("update", t.sideBySideRenderingFunction)) : t.off("update", t.sideBySideRenderingFunction), t.refresh()
            }

            function A(e) {
                var t = e.codemirror,
                    n = t.getWrapperElement(),
                    r = n.previousSibling,
                    i = e.options.toolbar ? e.toolbarElements.preview : !1,
                    o = n.lastChild;
                o && /editor-preview/.test(o.className) || (o = document.createElement("div"), o.className = "editor-preview", n.appendChild(o)), /editor-preview-active/.test(o.className) ? (o.className = o.className.replace(/\s*editor-preview-active\s*/g, ""), i && (i.className = i.className.replace(/\s*active\s*/g, ""), r.className = r.className.replace(/\s*disabled-for-preview*/g, ""))) : (setTimeout(function() {
                    o.className += " editor-preview-active"
                }, 1), i && (i.className += " active", r.className += " disabled-for-preview")), o.innerHTML = e.options.previewRender(e.value(), o);
                var a = t.getWrapperElement().nextSibling;
                /editor-preview-active-side/.test(a.className) && N(e)
            }

            function E(e, t, n, r) {
                if (!/editor-preview-active/.test(e.getWrapperElement().lastChild.className)) {
                    var i, o = n[0],
                        a = n[1],
                        l = e.getCursor("start"),
                        s = e.getCursor("end");
                    r && (a = a.replace("#url#", r)), t ? (i = e.getLine(l.line), o = i.slice(0, l.ch), a = i.slice(l.ch), e.replaceRange(o + a, {
                        line: l.line,
                        ch: 0
                    })) : (i = e.getSelection(), e.replaceSelection(o + i + a), l.ch += o.length, l !== s && (s.ch += o.length)), e.setSelection(l, s), e.focus()
                }
            }

            function O(e, t, n) {
                if (!/editor-preview-active/.test(e.getWrapperElement().lastChild.className)) {
                    for (var r = e.getCursor("start"), i = e.getCursor("end"), o = r.line; o <= i.line; o++) ! function(r) {
                        var i = e.getLine(r),
                            o = i.search(/[^#]/);
                        i = void 0 !== t ? 0 >= o ? "bigger" == t ? "###### " + i : "# " + i : 6 == o && "smaller" == t ? i.substr(7) : 1 == o && "bigger" == t ? i.substr(2) : "bigger" == t ? i.substr(1) : "#" + i : 1 == n ? 0 >= o ? "# " + i : o == n ? i.substr(o + 1) : "# " + i.substr(o + 1) : 2 == n ? 0 >= o ? "## " + i : o == n ? i.substr(o + 1) : "## " + i.substr(o + 1) : 0 >= o ? "### " + i : o == n ? i.substr(o + 1) : "### " + i.substr(o + 1), e.replaceRange(i, {
                            line: r,
                            ch: 0
                        }, {
                            line: r,
                            ch: 99999999999999
                        })
                    }(o);
                    e.focus()
                }
            }

            function I(e, t) {
                if (!/editor-preview-active/.test(e.getWrapperElement().lastChild.className)) {
                    for (var n = l(e), r = e.getCursor("start"), i = e.getCursor("end"), o = {
                            quote: /^(\s*)\>\s+/,
                            "unordered-list": /^(\s*)(\*|\-|\+)\s+/,
                            "ordered-list": /^(\s*)\d+\.\s+/
                        }, a = {
                            quote: "> ",
                            "unordered-list": "* ",
                            "ordered-list": "1. "
                        }, s = r.line; s <= i.line; s++) ! function(r) {
                        var i = e.getLine(r);
                        i = n[t] ? i.replace(o[t], "$1") : a[t] + i, e.replaceRange(i, {
                            line: r,
                            ch: 0
                        }, {
                            line: r,
                            ch: 99999999999999
                        })
                    }(s);
                    e.focus()
                }
            }

            function P(e, t, n, r) {
                if (!/editor-preview-active/.test(e.codemirror.getWrapperElement().lastChild.className)) {
                    r = "undefined" == typeof r ? n : r;
                    var i, o = e.codemirror,
                        a = l(o),
                        s = n,
                        c = r,
                        u = o.getCursor("start"),
                        f = o.getCursor("end");
                    a[t] ? (i = o.getLine(u.line), s = i.slice(0, u.ch), c = i.slice(u.ch), "bold" == t ? (s = s.replace(/(\*\*|__)(?![\s\S]*(\*\*|__))/, ""), c = c.replace(/(\*\*|__)/, "")) : "italic" == t ? (s = s.replace(/(\*|_)(?![\s\S]*(\*|_))/, ""), c = c.replace(/(\*|_)/, "")) : "strikethrough" == t && (s = s.replace(/(\*\*|~~)(?![\s\S]*(\*\*|~~))/, ""), c = c.replace(/(\*\*|~~)/, "")), o.replaceRange(s + c, {
                        line: u.line,
                        ch: 0
                    }, {
                        line: u.line,
                        ch: 99999999999999
                    }), "bold" == t || "strikethrough" == t ? (u.ch -= 2, u !== f && (f.ch -= 2)) : "italic" == t && (u.ch -= 1, u !== f && (f.ch -= 1))) : (i = o.getSelection(), "bold" == t ? (i = i.split("**").join(""), i = i.split("__").join("")) : "italic" == t ? (i = i.split("*").join(""), i = i.split("_").join("")) : "strikethrough" == t && (i = i.split("~~").join("")), o.replaceSelection(s + i + c), u.ch += n.length, f.ch = u.ch + i.length), o.setSelection(u, f), o.focus()
                }
            }

            function R(e) {
                if (!/editor-preview-active/.test(e.getWrapperElement().lastChild.className))
                    for (var t, n = e.getCursor("start"), r = e.getCursor("end"), i = n.line; i <= r.line; i++) t = e.getLine(i), t = t.replace(/^[ ]*([# ]+|\*|\-|[> ]+|[0-9]+(.|\)))[ ]*/, ""), e.replaceRange(t, {
                        line: i,
                        ch: 0
                    }, {
                        line: i,
                        ch: 99999999999999
                    })
            }

            function D(e, t) {
                for (var n in t) t.hasOwnProperty(n) && (t[n] instanceof Array ? e[n] = t[n].concat(e[n] instanceof Array ? e[n] : []) : null !== t[n] && "object" == typeof t[n] && t[n].constructor === Object ? e[n] = D(e[n] || {}, t[n]) : e[n] = t[n]);
                return e
            }

            function H(e) {
                for (var t = 1; t < arguments.length; t++) e = D(e, arguments[t]);
                return e
            }

            function W(e) {
                var t = /[a-zA-Z0-9_\u0392-\u03c9\u0410-\u04F9]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g,
                    n = e.match(t),
                    r = 0;
                if (null === n) return r;
                for (var i = 0; i < n.length; i++) r += n[i].charCodeAt(0) >= 19968 ? n[i].length : 1;
                return r
            }

            function B(e) {
                e = e || {}, e.parent = this;
                var t = !0;
                if (e.autoDownloadFontAwesome === !1 && (t = !1), e.autoDownloadFontAwesome !== !0)
                    for (var n = document.styleSheets, r = 0; r < n.length; r++) n[r].href && n[r].href.indexOf("//maxcdn.bootstrapcdn.com/font-awesome/") > -1 && (t = !1);
                if (t) {
                    var i = document.createElement("link");
                    i.rel = "stylesheet", i.href = "https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css", document.getElementsByTagName("head")[0].appendChild(i)
                }
                if (e.element) this.element = e.element;
                else if (null === e.element) return void console.log("SimpleMDE: Error. No element was found.");
                if (void 0 === e.toolbar) {
                    e.toolbar = [];
                    for (var o in K) K.hasOwnProperty(o) && (-1 != o.indexOf("separator-") && e.toolbar.push("|"), (K[o]["default"] === !0 || e.showIcons && e.showIcons.constructor === Array && -1 != e.showIcons.indexOf(o)) && e.toolbar.push(o))
                }
                e.hasOwnProperty("status") || (e.status = ["autosave", "lines", "words", "cursor"]), e.previewRender || (e.previewRender = function(e) {
                    return this.parent.markdown(e)
                }), e.parsingConfig = H({
                    highlightFormatting: !0
                }, e.parsingConfig || {}), e.insertTexts = H({}, X, e.insertTexts || {}), e.promptTexts = Z, e.blockStyles = H({}, J, e.blockStyles || {}), e.shortcuts = H({}, G, e.shortcuts || {}), void 0 != e.autosave && void 0 != e.autosave.unique_id && "" != e.autosave.unique_id && (e.autosave.uniqueId = e.autosave.unique_id), this.options = e, this.render(), !e.initialValue || this.options.autosave && this.options.autosave.foundSavedValue === !0 || this.value(e.initialValue)
            }

            function _() {
                if ("object" != typeof localStorage) return !1;
                try {
                    localStorage.setItem("smde_localStorage", 1), localStorage.removeItem("smde_localStorage")
                } catch (e) {
                    return !1
                }
                return !0
            }
            var F = e("codemirror");
            e("codemirror/addon/edit/continuelist.js"), e("./codemirror/tablist"), e("codemirror/addon/display/fullscreen.js"), e("codemirror/mode/markdown/markdown.js"), e("codemirror/addon/mode/overlay.js"), e("codemirror/addon/display/placeholder.js"), e("codemirror/addon/selection/mark-selection.js"), e("codemirror/mode/gfm/gfm.js"), e("codemirror/mode/xml/xml.js");
            var z = e("codemirror-spell-checker"),
                j = e("marked"),
                U = /Mac/.test(navigator.platform),
                q = {
                    toggleBold: c,
                    toggleItalic: u,
                    drawLink: k,
                    toggleHeadingSmaller: p,
                    toggleHeadingBigger: m,
                    drawImage: S,
                    toggleBlockquote: d,
                    toggleOrderedList: b,
                    toggleUnorderedList: x,
                    toggleCodeBlock: h,
                    togglePreview: A,
                    toggleStrikethrough: f,
                    toggleHeading1: g,
                    toggleHeading2: v,
                    toggleHeading3: y,
                    cleanBlock: w,
                    drawTable: C,
                    drawHorizontalRule: L,
                    undo: T,
                    redo: M,
                    toggleSideBySide: N,
                    toggleFullScreen: s
                },
                G = {
                    toggleBold: "Cmd-B",
                    toggleItalic: "Cmd-I",
                    drawLink: "Cmd-K",
                    toggleHeadingSmaller: "Cmd-H",
                    toggleHeadingBigger: "Shift-Cmd-H",
                    cleanBlock: "Cmd-E",
                    drawImage: "Cmd-Alt-I",
                    toggleBlockquote: "Cmd-'",
                    toggleOrderedList: "Cmd-Alt-L",
                    toggleUnorderedList: "Cmd-L",
                    toggleCodeBlock: "Cmd-Alt-C",
                    togglePreview: "Cmd-P",
                    toggleSideBySide: "F9",
                    toggleFullScreen: "F11"
                },
                Y = function(e) {
                    for (var t in q)
                        if (q[t] === e) return t;
                    return null
                },
                $ = function() {
                    var e = !1;
                    return function(t) {
                        (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(t) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0, 4))) && (e = !0);
                    }(navigator.userAgent || navigator.vendor || window.opera), e
                },
                V = "",
                K = {
                    bold: {
                        name: "bold",
                        action: c,
                        className: "fa fa-bold",
                        title: "Bold",
                        "default": !0
                    },
                    italic: {
                        name: "italic",
                        action: u,
                        className: "fa fa-italic",
                        title: "Italic",
                        "default": !0
                    },
                    strikethrough: {
                        name: "strikethrough",
                        action: f,
                        className: "fa fa-strikethrough",
                        title: "Strikethrough"
                    },
                    heading: {
                        name: "heading",
                        action: p,
                        className: "fa fa-header",
                        title: "Heading",
                        "default": !0
                    },
                    "heading-smaller": {
                        name: "heading-smaller",
                        action: p,
                        className: "fa fa-header fa-header-x fa-header-smaller",
                        title: "Smaller Heading"
                    },
                    "heading-bigger": {
                        name: "heading-bigger",
                        action: m,
                        className: "fa fa-header fa-header-x fa-header-bigger",
                        title: "Bigger Heading"
                    },
                    "heading-1": {
                        name: "heading-1",
                        action: g,
                        className: "fa fa-header fa-header-x fa-header-1",
                        title: "Big Heading"
                    },
                    "heading-2": {
                        name: "heading-2",
                        action: v,
                        className: "fa fa-header fa-header-x fa-header-2",
                        title: "Medium Heading"
                    },
                    "heading-3": {
                        name: "heading-3",
                        action: y,
                        className: "fa fa-header fa-header-x fa-header-3",
                        title: "Small Heading"
                    },
                    "separator-1": {
                        name: "separator-1"
                    },
                    code: {
                        name: "code",
                        action: h,
                        className: "fa fa-code",
                        title: "Code"
                    },
                    quote: {
                        name: "quote",
                        action: d,
                        className: "fa fa-quote-left",
                        title: "Quote",
                        "default": !0
                    },
                    "unordered-list": {
                        name: "unordered-list",
                        action: x,
                        className: "fa fa-list-ul",
                        title: "Generic List",
                        "default": !0
                    },
                    "ordered-list": {
                        name: "ordered-list",
                        action: b,
                        className: "fa fa-list-ol",
                        title: "Numbered List",
                        "default": !0
                    },
                    "clean-block": {
                        name: "clean-block",
                        action: w,
                        className: "fa fa-eraser fa-clean-block",
                        title: "Clean block"
                    },
                    "separator-2": {
                        name: "separator-2"
                    },
                    link: {
                        name: "link",
                        action: k,
                        className: "fa fa-link",
                        title: "Create Link",
                        "default": !0
                    },
                    image: {
                        name: "image",
                        action: S,
                        className: "fa fa-picture-o",
                        title: "Insert Image",
                        "default": !0
                    },
                    table: {
                        name: "table",
                        action: C,
                        className: "fa fa-table",
                        title: "Insert Table"
                    },
                    "horizontal-rule": {
                        name: "horizontal-rule",
                        action: L,
                        className: "fa fa-minus",
                        title: "Insert Horizontal Line"
                    },
                    "separator-3": {
                        name: "separator-3"
                    },
                    preview: {
                        name: "preview",
                        action: A,
                        className: "fa fa-eye no-disable",
                        title: "Toggle Preview",
                        "default": !0
                    },
                    "side-by-side": {
                        name: "side-by-side",
                        action: N,
                        className: "fa fa-columns no-disable no-mobile",
                        title: "Toggle Side by Side",
                        "default": !0
                    },
                    fullscreen: {
                        name: "fullscreen",
                        action: s,
                        className: "fa fa-arrows-alt no-disable no-mobile",
                        title: "Toggle Fullscreen",
                        "default": !0
                    },
                    "separator-4": {
                        name: "separator-4"
                    },
                    guide: {
                        name: "guide",
                        action: "https://simplemde.com/markdown-guide",
                        className: "fa fa-question-circle",
                        title: "Markdown Guide",
                        "default": !0
                    },
                    "separator-5": {
                        name: "separator-5"
                    },
                    undo: {
                        name: "undo",
                        action: T,
                        className: "fa fa-undo no-disable",
                        title: "Undo"
                    },
                    redo: {
                        name: "redo",
                        action: M,
                        className: "fa fa-repeat no-disable",
                        title: "Redo"
                    }
                },
                X = {
                    link: ["[", "](#url#)"],
                    image: ["![](", "#url#)"],
                    table: ["", "\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text     | Text     |\n\n"],
                    horizontalRule: ["", "\n\n-----\n\n"]
                },
                Z = {
                    link: "URL for the link:",
                    image: "URL of the image:"
                },
                J = {
                    bold: "**",
                    code: "```",
                    italic: "*"
                };
            B.prototype.markdown = function(e) {
                if (j) {
                    var t = {};
                    return this.options && this.options.renderingConfig && this.options.renderingConfig.singleLineBreaks === !1 ? t.breaks = !1 : t.breaks = !0, this.options && this.options.renderingConfig && this.options.renderingConfig.codeSyntaxHighlighting === !0 && window.hljs && (t.highlight = function(e) {
                        return window.hljs.highlightAuto(e).value
                    }), j.setOptions(t), j(e)
                }
            }, B.prototype.render = function(e) {
                if (e || (e = this.element || document.getElementsByTagName("textarea")[0]), !this._rendered || this._rendered !== e) {
                    this.element = e;
                    var t = this.options,
                        n = this,
                        i = {};
                    for (var o in t.shortcuts) null !== t.shortcuts[o] && null !== q[o] && ! function(e) {
                        i[r(t.shortcuts[e])] = function() {
                            q[e](n)
                        }
                    }(o);
                    i.Enter = "newlineAndIndentContinueMarkdownList", i.Tab = "tabAndIndentMarkdownList", i["Shift-Tab"] = "shiftTabAndUnindentMarkdownList", i.Esc = function(e) {
                        e.getOption("fullScreen") && s(n)
                    }, document.addEventListener("keydown", function(e) {
                        e = e || window.event, 27 == e.keyCode && n.codemirror.getOption("fullScreen") && s(n)
                    }, !1);
                    var a, l;
                    if (t.spellChecker !== !1 ? (a = "spell-checker", l = t.parsingConfig, l.name = "gfm", l.gitHubSpice = !1, z({
                            codeMirrorInstance: F
                        })) : (a = t.parsingConfig, a.name = "gfm", a.gitHubSpice = !1), this.codemirror = F.fromTextArea(e, {
                            mode: a,
                            backdrop: l,
                            theme: "paper",
                            tabSize: void 0 != t.tabSize ? t.tabSize : 2,
                            indentUnit: void 0 != t.tabSize ? t.tabSize : 2,
                            indentWithTabs: t.indentWithTabs !== !1,
                            lineNumbers: !1,
                            autofocus: t.autofocus === !0,
                            extraKeys: i,
                            lineWrapping: t.lineWrapping !== !1,
                            allowDropFileTypes: ["text/plain"],
                            placeholder: t.placeholder || e.getAttribute("placeholder") || "",
                            styleSelectedText: void 0 != t.styleSelectedText ? t.styleSelectedText : !0
                        }), t.forceSync === !0) {
                        var c = this.codemirror;
                        c.on("change", function() {
                            c.save()
                        })
                    }
                    this.gui = {}, t.toolbar !== !1 && (this.gui.toolbar = this.createToolbar()), t.status !== !1 && (this.gui.statusbar = this.createStatusbar()), void 0 != t.autosave && t.autosave.enabled === !0 && this.autosave(), this.gui.sideBySide = this.createSideBySide(), this._rendered = this.element;
                    var u = this.codemirror;
                    setTimeout(function() {
                        u.refresh()
                    }.bind(u), 0)
                }
            }, B.prototype.autosave = function() {
                if (_()) {
                    var e = this;
                    if (void 0 == this.options.autosave.uniqueId || "" == this.options.autosave.uniqueId) return void console.log("SimpleMDE: You must set a uniqueId to use the autosave feature");
                    null != e.element.form && void 0 != e.element.form && e.element.form.addEventListener("submit", function() {
                        localStorage.removeItem("smde_" + e.options.autosave.uniqueId)
                    }), this.options.autosave.loaded !== !0 && ("string" == typeof localStorage.getItem("smde_" + this.options.autosave.uniqueId) && "" != localStorage.getItem("smde_" + this.options.autosave.uniqueId) && (this.codemirror.setValue(localStorage.getItem("smde_" + this.options.autosave.uniqueId)), this.options.autosave.foundSavedValue = !0), this.options.autosave.loaded = !0), localStorage.setItem("smde_" + this.options.autosave.uniqueId, e.value());
                    var t = document.getElementById("autosaved");
                    if (null != t && void 0 != t && "" != t) {
                        var n = new Date,
                            r = n.getHours(),
                            i = n.getMinutes(),
                            o = "am",
                            a = r;
                        a >= 12 && (a = r - 12, o = "pm"), 0 == a && (a = 12), i = 10 > i ? "0" + i : i, t.innerHTML = "Autosaved: " + a + ":" + i + " " + o
                    }
                    this.autosaveTimeoutId = setTimeout(function() {
                        e.autosave()
                    }, this.options.autosave.delay || 1e4)
                } else console.log("SimpleMDE: localStorage not available, cannot autosave")
            }, B.prototype.clearAutosavedValue = function() {
                if (_()) {
                    if (void 0 == this.options.autosave || void 0 == this.options.autosave.uniqueId || "" == this.options.autosave.uniqueId) return void console.log("SimpleMDE: You must set a uniqueId to clear the autosave value");
                    localStorage.removeItem("smde_" + this.options.autosave.uniqueId)
                } else console.log("SimpleMDE: localStorage not available, cannot autosave")
            }, B.prototype.createSideBySide = function() {
                var e = this.codemirror,
                    t = e.getWrapperElement(),
                    n = t.nextSibling;
                n && /editor-preview-side/.test(n.className) || (n = document.createElement("div"), n.className = "editor-preview-side", t.parentNode.insertBefore(n, t.nextSibling));
                var r = !1,
                    i = !1;
                return e.on("scroll", function(e) {
                    if (r) return void(r = !1);
                    i = !0;
                    var t = e.getScrollInfo().height - e.getScrollInfo().clientHeight,
                        o = parseFloat(e.getScrollInfo().top) / t,
                        a = (n.scrollHeight - n.clientHeight) * o;
                    n.scrollTop = a
                }), n.onscroll = function() {
                    if (i) return void(i = !1);
                    r = !0;
                    var t = n.scrollHeight - n.clientHeight,
                        o = parseFloat(n.scrollTop) / t,
                        a = (e.getScrollInfo().height - e.getScrollInfo().clientHeight) * o;
                    e.scrollTo(0, a)
                }, n
            }, B.prototype.createToolbar = function(e) {
                if (e = e || this.options.toolbar, e && 0 !== e.length) {
                    var t;
                    for (t = 0; t < e.length; t++) void 0 != K[e[t]] && (e[t] = K[e[t]]);
                    var n = document.createElement("div");
                    n.className = "editor-toolbar";
                    var r = this,
                        a = {};
                    for (r.toolbar = e, t = 0; t < e.length; t++)
                        if (("guide" != e[t].name || r.options.toolbarGuideIcon !== !1) && !(r.options.hideIcons && -1 != r.options.hideIcons.indexOf(e[t].name) || ("fullscreen" == e[t].name || "side-by-side" == e[t].name) && $())) {
                            if ("|" === e[t]) {
                                for (var s = !1, c = t + 1; c < e.length; c++) "|" === e[c] || r.options.hideIcons && -1 != r.options.hideIcons.indexOf(e[c].name) || (s = !0);
                                if (!s) continue
                            }! function(e) {
                                var t;
                                t = "|" === e ? o() : i(e, r.options.toolbarTips, r.options.shortcuts), e.action && ("function" == typeof e.action ? t.onclick = function(t) {
                                    t.preventDefault(), e.action(r)
                                } : "string" == typeof e.action && (t.href = e.action, t.target = "_blank")), a[e.name || e] = t, n.appendChild(t)
                            }(e[t])
                        }
                    r.toolbarElements = a;
                    var u = this.codemirror;
                    u.on("cursorActivity", function() {
                        var e = l(u);
                        for (var t in a) ! function(t) {
                            var n = a[t];
                            e[t] ? n.className += " active" : "fullscreen" != t && "side-by-side" != t && (n.className = n.className.replace(/\s*active\s*/g, ""))
                        }(t)
                    });
                    var f = u.getWrapperElement();
                    return f.parentNode.insertBefore(n, f), n
                }
            }, B.prototype.createStatusbar = function(e) {
                e = e || this.options.status;
                var t = this.options,
                    n = this.codemirror;
                if (e && 0 !== e.length) {
                    var r, i, o, a = [];
                    for (r = 0; r < e.length; r++)
                        if (i = void 0, o = void 0, "object" == typeof e[r]) a.push({
                            className: e[r].className,
                            defaultValue: e[r].defaultValue,
                            onUpdate: e[r].onUpdate
                        });
                        else {
                            var l = e[r];
                            "words" === l ? (o = function(e) {
                                e.innerHTML = W(n.getValue())
                            }, i = function(e) {
                                e.innerHTML = W(n.getValue())
                            }) : "lines" === l ? (o = function(e) {
                                e.innerHTML = n.lineCount()
                            }, i = function(e) {
                                e.innerHTML = n.lineCount()
                            }) : "cursor" === l ? (o = function(e) {
                                e.innerHTML = "0:0"
                            }, i = function(e) {
                                var t = n.getCursor();
                                e.innerHTML = t.line + ":" + t.ch
                            }) : "autosave" === l && (o = function(e) {
                                void 0 != t.autosave && t.autosave.enabled === !0 && e.setAttribute("id", "autosaved")
                            }), a.push({
                                className: l,
                                defaultValue: o,
                                onUpdate: i
                            })
                        }
                    var s = document.createElement("div");
                    for (s.className = "editor-statusbar", r = 0; r < a.length; r++) {
                        var c = a[r],
                            u = document.createElement("span");
                        u.className = c.className, "function" == typeof c.defaultValue && c.defaultValue(u), "function" == typeof c.onUpdate && this.codemirror.on("update", function(e, t) {
                            return function() {
                                t.onUpdate(e)
                            }
                        }(u, c)), s.appendChild(u)
                    }
                    var f = this.codemirror.getWrapperElement();
                    return f.parentNode.insertBefore(s, f.nextSibling), s
                }
            }, B.prototype.value = function(e) {
                return void 0 === e ? this.codemirror.getValue() : (this.codemirror.getDoc().setValue(e), this)
            }, B.toggleBold = c, B.toggleItalic = u, B.toggleStrikethrough = f, B.toggleBlockquote = d, B.toggleHeadingSmaller = p, B.toggleHeadingBigger = m, B.toggleHeading1 = g, B.toggleHeading2 = v, B.toggleHeading3 = y, B.toggleCodeBlock = h, B.toggleUnorderedList = x, B.toggleOrderedList = b, B.cleanBlock = w, B.drawLink = k, B.drawImage = S, B.drawTable = C, B.drawHorizontalRule = L, B.undo = T, B.redo = M, B.togglePreview = A, B.toggleSideBySide = N, B.toggleFullScreen = s, B.prototype.toggleBold = function() {
                c(this)
            }, B.prototype.toggleItalic = function() {
                u(this)
            }, B.prototype.toggleStrikethrough = function() {
                f(this)
            }, B.prototype.toggleBlockquote = function() {
                d(this)
            }, B.prototype.toggleHeadingSmaller = function() {
                p(this)
            }, B.prototype.toggleHeadingBigger = function() {
                m(this)
            }, B.prototype.toggleHeading1 = function() {
                g(this)
            }, B.prototype.toggleHeading2 = function() {
                v(this)
            }, B.prototype.toggleHeading3 = function() {
                y(this)
            }, B.prototype.toggleCodeBlock = function() {
                h(this)
            }, B.prototype.toggleUnorderedList = function() {
                x(this)
            }, B.prototype.toggleOrderedList = function() {
                b(this)
            }, B.prototype.cleanBlock = function() {
                w(this)
            }, B.prototype.drawLink = function() {
                k(this)
            }, B.prototype.drawImage = function() {
                S(this)
            }, B.prototype.drawTable = function() {
                C(this)
            }, B.prototype.drawHorizontalRule = function() {
                L(this)
            }, B.prototype.undo = function() {
                T(this)
            }, B.prototype.redo = function() {
                M(this)
            }, B.prototype.togglePreview = function() {
                A(this)
            }, B.prototype.toggleSideBySide = function() {
                N(this)
            }, B.prototype.toggleFullScreen = function() {
                s(this)
            }, B.prototype.isPreviewActive = function() {
                var e = this.codemirror,
                    t = e.getWrapperElement(),
                    n = t.lastChild;
                return /editor-preview-active/.test(n.className)
            }, B.prototype.isSideBySideActive = function() {
                var e = this.codemirror,
                    t = e.getWrapperElement(),
                    n = t.nextSibling;
                return /editor-preview-active-side/.test(n.className)
            }, B.prototype.isFullscreenActive = function() {
                var e = this.codemirror;
                return e.getOption("fullScreen")
            }, B.prototype.getState = function() {
                var e = this.codemirror;
                return l(e)
            }, B.prototype.toTextArea = function() {
                var e = this.codemirror,
                    t = e.getWrapperElement();
                t.parentNode && (this.gui.toolbar && t.parentNode.removeChild(this.gui.toolbar), this.gui.statusbar && t.parentNode.removeChild(this.gui.statusbar), this.gui.sideBySide && t.parentNode.removeChild(this.gui.sideBySide)), e.toTextArea(), this.autosaveTimeoutId && (clearTimeout(this.autosaveTimeoutId), this.autosaveTimeoutId = void 0, this.clearAutosavedValue())
            }, t.exports = B
        }, {
            "./codemirror/tablist": 19,
            codemirror: 10,
            "codemirror-spell-checker": 4,
            "codemirror/addon/display/fullscreen.js": 5,
            "codemirror/addon/display/placeholder.js": 6,
            "codemirror/addon/edit/continuelist.js": 7,
            "codemirror/addon/mode/overlay.js": 8,
            "codemirror/addon/selection/mark-selection.js": 9,
            "codemirror/mode/gfm/gfm.js": 11,
            "codemirror/mode/markdown/markdown.js": 12,
            "codemirror/mode/xml/xml.js": 14,
            marked: 17
        }]
    }, {}, [20])(20)
});

/*jslint newcap: true */
/*global XMLHttpRequest: false, FormData: false */
/*
 * Inline Text Attachment
 *
 * Author: Roy van Kaathoven
 * Contact: ik@royvankaathoven.nl
 */
(function(document, window) {
    'use strict';

    var inlineAttachment = function(options, instance) {
        this.settings = inlineAttachment.util.merge(options, inlineAttachment.defaults);
        this.editor = instance;
        this.filenameTag = '{filename}';
        this.lastValue = null;
    };

    /**
     * Will holds the available editors
     *
     * @type {Object}
     */
    inlineAttachment.editors = {};

    /**
     * Utility functions
     */
    inlineAttachment.util = {

        /**
         * Simple function to merge the given objects
         *
         * @param {Object[]} object Multiple object parameters
         * @returns {Object}
         */
        merge: function() {
            var result = {};
            for (var i = arguments.length - 1; i >= 0; i--) {
                var obj = arguments[i];
                for (var k in obj) {
                    if (obj.hasOwnProperty(k)) {
                        result[k] = obj[k];
                    }
                }
            }
            return result;
        },

        /**
         * Append a line of text at the bottom, ensuring there aren't unnecessary newlines
         *
         * @param {String} appended Current content
         * @param {String} previous Value which should be appended after the current content
         */
        appendInItsOwnLine: function(previous, appended) {
            return (previous + "\n\n[[D]]" + appended)
                .replace(/(\n{2,})\[\[D\]\]/, "\n\n")
                .replace(/^(\n*)/, "");
        },

        /**
         * Inserts the given value at the current cursor position of the textarea element
         *
         * @param  {HtmlElement} el
         * @param  {String} value Text which will be inserted at the cursor position
         */
        insertTextAtCursor: function(el, text) {
            var scrollPos = el.scrollTop,
                strPos = 0,
                browser = false,
                range;

            if ((el.selectionStart || el.selectionStart === '0')) {
                browser = "ff";
            } else if (document.selection) {
                browser = "ie";
            }

            if (browser === "ie") {
                el.focus();
                range = document.selection.createRange();
                range.moveStart('character', -el.value.length);
                strPos = range.text.length;
            } else if (browser === "ff") {
                strPos = el.selectionStart;
            }

            var front = (el.value).substring(0, strPos);
            var back = (el.value).substring(strPos, el.value.length);
            el.value = front + text + back;
            strPos = strPos + text.length;
            if (browser === "ie") {
                el.focus();
                range = document.selection.createRange();
                range.moveStart('character', -el.value.length);
                range.moveStart('character', strPos);
                range.moveEnd('character', 0);
                range.select();
            } else if (browser === "ff") {
                el.selectionStart = strPos;
                el.selectionEnd = strPos;
                el.focus();
            }
            el.scrollTop = scrollPos;
        }
    };

    /**
     * Default configuration options
     *
     * @type {Object}
     */
    inlineAttachment.defaults = {
        /**
         * URL where the file will be send
         */
        uploadUrl: 'upload_attachment.php',

        /**
         * Which method will be used to send the file to the upload URL
         */
        uploadMethod: 'POST',

        /**
         * Name in which the file will be placed
         */
        uploadFieldName: 'file',

        /**
         * Extension which will be used when a file extension could not
         * be detected
         */
        defaultExtension: 'png',

        /**
         * JSON field which refers to the uploaded file URL
         */
        jsonFieldName: 'filename',

        /**
         * Allowed MIME types
         */
        allowedTypes: [
            'image/jpeg',
            'image/png',
            'image/jpg',
            'image/gif'
        ],

        /**
         * Text which will be inserted when dropping or pasting a file.
         * Acts as a placeholder which will be replaced when the file is done with uploading
         */
        progressText: '![Uploading file...]()',

        /**
         * When a file has successfully been uploaded the progressText
         * will be replaced by the urlText, the {filename} tag will be replaced
         * by the filename that has been returned by the server
         */
        urlText: "![file]({filename})",

        /**
         * Text which will be used when uploading has failed
         */
        errorText: "Error uploading file",

        /**
         * Extra parameters which will be send when uploading a file
         */
        extraParams: {},

        /**
         * Extra headers which will be send when uploading a file
         */
        extraHeaders: {},

        /**
         * Before the file is send
         */
        beforeFileUpload: function() {
            return true;
        },

        /**
         * Triggers when a file is dropped or pasted
         */
        onFileReceived: function() {},

        /**
         * Custom upload handler
         *
         * @return {Boolean} when false is returned it will prevent default upload behavior
         */
        onFileUploadResponse: function() {
            return true;
        },

        /**
         * Custom error handler. Runs after removing the placeholder text and before the alert().
         * Return false from this function to prevent the alert dialog.
         *
         * @return {Boolean} when false is returned it will prevent default error behavior
         */
        onFileUploadError: function() {
            return true;
        },

        /**
         * When a file has succesfully been uploaded
         */
        onFileUploaded: function() {}
    };

    /**
     * Uploads the blob
     *
     * @param  {Blob} file blob data received from event.dataTransfer object
     * @return {XMLHttpRequest} request object which sends the file
     */
    inlineAttachment.prototype.uploadFile = function(file) {
        var me = this,
            formData = new FormData(),
            xhr = new XMLHttpRequest(),
            settings = this.settings,
            extension = settings.defaultExtension || settings.defualtExtension;

        if (typeof settings.setupFormData === 'function') {
            settings.setupFormData(formData, file);
        }

        // Attach the file. If coming from clipboard, add a default filename (only works in Chrome for now)
        // http://stackoverflow.com/questions/6664967/how-to-give-a-blob-uploaded-as-formdata-a-file-name
        if (file.name) {
            var fileNameMatches = file.name.match(/\.(.+)$/);
            if (fileNameMatches) {
                extension = fileNameMatches[1];
            }
        }

        var remoteFilename = "image-" + Date.now() + "." + extension;
        if (typeof settings.remoteFilename === 'function') {
            remoteFilename = settings.remoteFilename(file);
        }

        formData.append(settings.uploadFieldName, file, remoteFilename);

        // Append the extra parameters to the formdata
        if (typeof settings.extraParams === "object") {
            for (var key in settings.extraParams) {
                if (settings.extraParams.hasOwnProperty(key)) {
                    formData.append(key, settings.extraParams[key]);
                }
            }
        }

        xhr.open('POST', settings.uploadUrl);

        // Add any available extra headers
        if (typeof settings.extraHeaders === "object") {
            for (var header in settings.extraHeaders) {
                if (settings.extraHeaders.hasOwnProperty(header)) {
                    xhr.setRequestHeader(header, settings.extraHeaders[header]);
                }
            }
        }

        xhr.onload = function() {
            // If HTTP status is OK or Created
            if (xhr.status === 200 || xhr.status === 201) {
                me.onFileUploadResponse(xhr);
            } else {
                me.onFileUploadError(xhr);
            }
        };
        if (settings.beforeFileUpload(xhr) !== false) {
            xhr.send(formData);
        }
        return xhr;
    };

    /**
     * Returns if the given file is allowed to handle
     *
     * @param {File} clipboard data file
     */
    inlineAttachment.prototype.isFileAllowed = function(file) {
        if (file.kind === 'string') {
            return false;
        }
        if (this.settings.allowedTypes.indexOf('*') === 0) {
            return true;
        } else {
            return this.settings.allowedTypes.indexOf(file.type) >= 0;
        }
    };

    /**
     * Handles upload response
     *
     * @param  {XMLHttpRequest} xhr
     * @return {Void}
     */
    inlineAttachment.prototype.onFileUploadResponse = function(xhr) {
        if (this.settings.onFileUploadResponse.call(this, xhr) !== false) {
            var result = JSON.parse(xhr.responseText),
                filename = result[this.settings.jsonFieldName];

            if (result && filename) {
                var newValue;
                if (typeof this.settings.urlText === 'function') {
                    newValue = this.settings.urlText.call(this, filename, result);
                } else {
                    newValue = this.settings.urlText.replace(this.filenameTag, filename);
                }
                var text = this.editor.getValue().replace(this.lastValue, newValue);
                this.editor.setValue(text);
                this.settings.onFileUploaded.call(this, filename);
            }
        }
    };


    /**
     * Called when a file has failed to upload
     *
     * @param  {XMLHttpRequest} xhr
     * @return {Void}
     */
    inlineAttachment.prototype.onFileUploadError = function(xhr) {
        if (this.settings.onFileUploadError.call(this, xhr) !== false) {
            var text = this.editor.getValue().replace(this.lastValue, "");
            this.editor.setValue(text);
        }
    };

    /**
     * Called when a file has been inserted, either by drop or paste
     *
     * @param  {File} file
     * @return {Void}
     */
    inlineAttachment.prototype.onFileInserted = function(file) {
        if (this.settings.onFileReceived.call(this, file) !== false) {
            this.lastValue = this.settings.progressText;
            this.editor.insertValue(this.lastValue);
        }
    };


    /**
     * Called when a paste event occured
     * @param  {Event} e
     * @return {Boolean} if the event was handled
     */
    inlineAttachment.prototype.onPaste = function(e) {
        var result = false,
            clipboardData = e.clipboardData,
            items;

        if (typeof clipboardData === "object") {
            items = clipboardData.items || clipboardData.files || [];

            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (this.isFileAllowed(item)) {
                    result = true;
                    this.onFileInserted(item.getAsFile());
                    this.uploadFile(item.getAsFile());
                }
            }
        }

        if (result) {
            e.preventDefault();
        }

        return result;
    };

    /**
     * Called when a drop event occures
     * @param  {Event} e
     * @return {Boolean} if the event was handled
     */
    inlineAttachment.prototype.onDrop = function(e) {
        var result = false;
        for (var i = 0; i < e.dataTransfer.files.length; i++) {
            var file = e.dataTransfer.files[i];
            if (this.isFileAllowed(file)) {
                result = true;
                this.onFileInserted(file);
                this.uploadFile(file);
            }
        }

        return result;
    };

    window.inlineAttachment = inlineAttachment;

})(document, window);

/*jslint newcap: true */
/*global inlineAttachment: false */
/**
 * CodeMirror version for inlineAttachment
 *
 * Call inlineAttachment.attach(editor) to attach to a codemirror instance
 */
(function() {
    'use strict';

    var codeMirrorEditor = function(instance) {

        if (!instance.getWrapperElement) {
            throw "Invalid CodeMirror object given";
        }

        this.codeMirror = instance;
    };

    codeMirrorEditor.prototype.getValue = function() {
        return this.codeMirror.getValue();
    };

    codeMirrorEditor.prototype.insertValue = function(val) {
        this.codeMirror.replaceSelection(val);
    };

    codeMirrorEditor.prototype.setValue = function(val) {
        var cursor = this.codeMirror.getCursor();
        this.codeMirror.setValue(val);
        this.codeMirror.setCursor(cursor);
    };

    /**
     * Attach InlineAttachment to CodeMirror
     *
     * @param {CodeMirror} codeMirror
     */
    codeMirrorEditor.attach = function(codeMirror, options) {

        options = options || {};

        var editor = new codeMirrorEditor(codeMirror),
            inlineattach = new inlineAttachment(options, editor),
            el = codeMirror.getWrapperElement();

        el.addEventListener('paste', function(e) {
            inlineattach.onPaste(e);
        }, false);

        codeMirror.setOption('onDragEvent', function(data, e) {
            if (e.type === "drop") {
                e.stopPropagation();
                e.preventDefault();
                return inlineattach.onDrop(e);
            }
        });
    };

    var codeMirrorEditor4 = function(instance) {
        codeMirrorEditor.call(this, instance);
    };

    codeMirrorEditor4.attach = function(codeMirror, options) {

        options = options || {};

        var editor = new codeMirrorEditor(codeMirror),
            inlineattach = new inlineAttachment(options, editor),
            el = codeMirror.getWrapperElement();

        el.addEventListener('paste', function(e) {
            inlineattach.onPaste(e);
        }, false);

        codeMirror.on('drop', function(data, e) {
            if (inlineattach.onDrop(e)) {
                e.stopPropagation();
                e.preventDefault();
                return true;
            } else {
                return false;
            }
        });
    };

    inlineAttachment.editors.codemirror4 = codeMirrorEditor4;

})();

! function(a) {
    "use strict";
    if ("function" == typeof define && define.amd) define(["jquery", "moment"], a);
    else if ("object" == typeof exports) module.exports = a(require("jquery"), require("moment"));
    else {
        if ("undefined" == typeof jQuery) throw "bootstrap-datetimepicker requires jQuery to be loaded first";
        if ("undefined" == typeof moment) throw "bootstrap-datetimepicker requires Moment.js to be loaded first";
        a(jQuery, moment)
    }
}(function(a, b) {
    "use strict";
    if (!b) throw new Error("bootstrap-datetimepicker requires Moment.js to be loaded first");
    var c = function(c, d) {
        var e, f, g, h, i, j, k, l = {},
            m = !0,
            n = !1,
            o = !1,
            p = 0,
            q = [{
                clsName: "days",
                navFnc: "M",
                navStep: 1
            }, {
                clsName: "months",
                navFnc: "y",
                navStep: 1
            }, {
                clsName: "years",
                navFnc: "y",
                navStep: 10
            }, {
                clsName: "decades",
                navFnc: "y",
                navStep: 100
            }],
            r = ["days", "months", "years", "decades"],
            s = ["top", "bottom", "auto"],
            t = ["left", "right", "auto"],
            u = ["default", "top", "bottom"],
            v = {
                up: 38,
                38: "up",
                down: 40,
                40: "down",
                left: 37,
                37: "left",
                right: 39,
                39: "right",
                tab: 9,
                9: "tab",
                escape: 27,
                27: "escape",
                enter: 13,
                13: "enter",
                pageUp: 33,
                33: "pageUp",
                pageDown: 34,
                34: "pageDown",
                shift: 16,
                16: "shift",
                control: 17,
                17: "control",
                space: 32,
                32: "space",
                t: 84,
                84: "t",
                delete: 46,
                46: "delete"
            },
            w = {},
            x = function() {
                return void 0 !== b.tz && void 0 !== d.timeZone && null !== d.timeZone && "" !== d.timeZone
            },
            y = function(a) {
                var c;
                return c = void 0 === a || null === a ? b() : b.isDate(a) || b.isMoment(a) ? b(a) : x() ? b.tz(a, j, d.useStrict, d.timeZone) : b(a, j, d.useStrict), x() && c.tz(d.timeZone), c
            },
            z = function(a) {
                if ("string" != typeof a || a.length > 1) throw new TypeError("isEnabled expects a single character string parameter");
                switch (a) {
                    case "y":
                        return i.indexOf("Y") !== -1;
                    case "M":
                        return i.indexOf("M") !== -1;
                    case "d":
                        return i.toLowerCase().indexOf("d") !== -1;
                    case "h":
                    case "H":
                        return i.toLowerCase().indexOf("h") !== -1;
                    case "m":
                        return i.indexOf("m") !== -1;
                    case "s":
                        return i.indexOf("s") !== -1;
                    default:
                        return !1
                }
            },
            A = function() {
                return z("h") || z("m") || z("s")
            },
            B = function() {
                return z("y") || z("M") || z("d")
            },
            C = function() {
                var b = a("<thead>").append(a("<tr>").append(a("<th>").addClass("prev").attr("data-action", "previous").append(a("<span>").addClass(d.icons.previous))).append(a("<th>").addClass("picker-switch").attr("data-action", "pickerSwitch").attr("colspan", d.calendarWeeks ? "6" : "5")).append(a("<th>").addClass("next").attr("data-action", "next").append(a("<span>").addClass(d.icons.next)))),
                    c = a("<tbody>").append(a("<tr>").append(a("<td>").attr("colspan", d.calendarWeeks ? "8" : "7")));
                return [a("<div>").addClass("datepicker-days").append(a("<table>").addClass("table-condensed").append(b).append(a("<tbody>"))), a("<div>").addClass("datepicker-months").append(a("<table>").addClass("table-condensed").append(b.clone()).append(c.clone())), a("<div>").addClass("datepicker-years").append(a("<table>").addClass("table-condensed").append(b.clone()).append(c.clone())), a("<div>").addClass("datepicker-decades").append(a("<table>").addClass("table-condensed").append(b.clone()).append(c.clone()))]
            },
            D = function() {
                var b = a("<tr>"),
                    c = a("<tr>"),
                    e = a("<tr>");
                return z("h") && (b.append(a("<td>").append(a("<a>").attr({
                    href: "#",
                    tabindex: "-1",
                    title: d.tooltips.incrementHour
                }).addClass("btn").attr("data-action", "incrementHours").append(a("<span>").addClass(d.icons.up)))), c.append(a("<td>").append(a("<span>").addClass("timepicker-hour").attr({
                    "data-time-component": "hours",
                    title: d.tooltips.pickHour
                }).attr("data-action", "showHours"))), e.append(a("<td>").append(a("<a>").attr({
                    href: "#",
                    tabindex: "-1",
                    title: d.tooltips.decrementHour
                }).addClass("btn").attr("data-action", "decrementHours").append(a("<span>").addClass(d.icons.down))))), z("m") && (z("h") && (b.append(a("<td>").addClass("separator")), c.append(a("<td>").addClass("separator").html(":")), e.append(a("<td>").addClass("separator"))), b.append(a("<td>").append(a("<a>").attr({
                    href: "#",
                    tabindex: "-1",
                    title: d.tooltips.incrementMinute
                }).addClass("btn").attr("data-action", "incrementMinutes").append(a("<span>").addClass(d.icons.up)))), c.append(a("<td>").append(a("<span>").addClass("timepicker-minute").attr({
                    "data-time-component": "minutes",
                    title: d.tooltips.pickMinute
                }).attr("data-action", "showMinutes"))), e.append(a("<td>").append(a("<a>").attr({
                    href: "#",
                    tabindex: "-1",
                    title: d.tooltips.decrementMinute
                }).addClass("btn").attr("data-action", "decrementMinutes").append(a("<span>").addClass(d.icons.down))))), z("s") && (z("m") && (b.append(a("<td>").addClass("separator")), c.append(a("<td>").addClass("separator").html(":")), e.append(a("<td>").addClass("separator"))), b.append(a("<td>").append(a("<a>").attr({
                    href: "#",
                    tabindex: "-1",
                    title: d.tooltips.incrementSecond
                }).addClass("btn").attr("data-action", "incrementSeconds").append(a("<span>").addClass(d.icons.up)))), c.append(a("<td>").append(a("<span>").addClass("timepicker-second").attr({
                    "data-time-component": "seconds",
                    title: d.tooltips.pickSecond
                }).attr("data-action", "showSeconds"))), e.append(a("<td>").append(a("<a>").attr({
                    href: "#",
                    tabindex: "-1",
                    title: d.tooltips.decrementSecond
                }).addClass("btn").attr("data-action", "decrementSeconds").append(a("<span>").addClass(d.icons.down))))), h || (b.append(a("<td>").addClass("separator")), c.append(a("<td>").append(a("<button>").addClass("btn btn-primary").attr({
                    "data-action": "togglePeriod",
                    tabindex: "-1",
                    title: d.tooltips.togglePeriod
                }))), e.append(a("<td>").addClass("separator"))), a("<div>").addClass("timepicker-picker").append(a("<table>").addClass("table-condensed").append([b, c, e]))
            },
            E = function() {
                var b = a("<div>").addClass("timepicker-hours").append(a("<table>").addClass("table-condensed")),
                    c = a("<div>").addClass("timepicker-minutes").append(a("<table>").addClass("table-condensed")),
                    d = a("<div>").addClass("timepicker-seconds").append(a("<table>").addClass("table-condensed")),
                    e = [D()];
                return z("h") && e.push(b), z("m") && e.push(c), z("s") && e.push(d), e
            },
            F = function() {
                var b = [];
                return d.showTodayButton && b.push(a("<td>").append(a("<a>").attr({
                    "data-action": "today",
                    title: d.tooltips.today
                }).append(a("<span>").addClass(d.icons.today)))), !d.sideBySide && B() && A() && b.push(a("<td>").append(a("<a>").attr({
                    "data-action": "togglePicker",
                    title: d.tooltips.selectTime
                }).append(a("<span>").addClass(d.icons.time)))), d.showClear && b.push(a("<td>").append(a("<a>").attr({
                    "data-action": "clear",
                    title: d.tooltips.clear
                }).append(a("<span>").addClass(d.icons.clear)))), d.showClose && b.push(a("<td>").append(a("<a>").attr({
                    "data-action": "close",
                    title: d.tooltips.close
                }).append(a("<span>").addClass(d.icons.close)))), a("<table>").addClass("table-condensed").append(a("<tbody>").append(a("<tr>").append(b)))
            },
            G = function() {
                var b = a("<div>").addClass("bootstrap-datetimepicker-widget dropdown-menu"),
                    c = a("<div>").addClass("datepicker").append(C()),
                    e = a("<div>").addClass("timepicker").append(E()),
                    f = a("<ul>").addClass("list-unstyled"),
                    g = a("<li>").addClass("picker-switch" + (d.collapse ? " accordion-toggle" : "")).append(F());
                return d.inline && b.removeClass("dropdown-menu"), h && b.addClass("usetwentyfour"), z("s") && !h && b.addClass("wider"), d.sideBySide && B() && A() ? (b.addClass("timepicker-sbs"), "top" === d.toolbarPlacement && b.append(g), b.append(a("<div>").addClass("row").append(c.addClass("col-md-6")).append(e.addClass("col-md-6"))), "bottom" === d.toolbarPlacement && b.append(g), b) : ("top" === d.toolbarPlacement && f.append(g), B() && f.append(a("<li>").addClass(d.collapse && A() ? "collapse in" : "").append(c)), "default" === d.toolbarPlacement && f.append(g), A() && f.append(a("<li>").addClass(d.collapse && B() ? "collapse" : "").append(e)), "bottom" === d.toolbarPlacement && f.append(g), b.append(f))
            },
            H = function() {
                var b, e = {};
                return b = c.is("input") || d.inline ? c.data() : c.find("input").data(), b.dateOptions && b.dateOptions instanceof Object && (e = a.extend(!0, e, b.dateOptions)), a.each(d, function(a) {
                    var c = "date" + a.charAt(0).toUpperCase() + a.slice(1);
                    void 0 !== b[c] && (e[a] = b[c])
                }), e
            },
            I = function() {
                var b, e = (n || c).position(),
                    f = (n || c).offset(),
                    g = d.widgetPositioning.vertical,
                    h = d.widgetPositioning.horizontal;
                if (d.widgetParent) b = d.widgetParent.append(o);
                else if (c.is("input")) b = c.after(o).parent();
                else {
                    if (d.inline) return void(b = c.append(o));
                    b = c, c.children().first().after(o)
                }
                if ("auto" === g && (g = f.top + 1.5 * o.height() >= a(window).height() + a(window).scrollTop() && o.height() + c.outerHeight() < f.top ? "top" : "bottom"), "auto" === h && (h = b.width() < f.left + o.outerWidth() / 2 && f.left + o.outerWidth() > a(window).width() ? "right" : "left"), "top" === g ? o.addClass("top").removeClass("bottom") : o.addClass("bottom").removeClass("top"), "right" === h ? o.addClass("pull-right") : o.removeClass("pull-right"), "relative" !== b.css("position") && (b = b.parents().filter(function() {
                        return "relative" === a(this).css("position")
                    }).first()), 0 === b.length) throw new Error("datetimepicker component should be placed within a relative positioned container");
                o.css({
                    top: "top" === g ? "auto" : e.top + c.outerHeight(),
                    bottom: "top" === g ? b.outerHeight() - (b === c ? 0 : e.top) : "auto",
                    left: "left" === h ? b === c ? 0 : e.left : "auto",
                    right: "left" === h ? "auto" : b.outerWidth() - c.outerWidth() - (b === c ? 0 : e.left)
                })
            },
            J = function(a) {
                "dp.change" === a.type && (a.date && a.date.isSame(a.oldDate) || !a.date && !a.oldDate) || c.trigger(a)
            },
            K = function(a) {
                "y" === a && (a = "YYYY"), J({
                    type: "dp.update",
                    change: a,
                    viewDate: f.clone()
                })
            },
            L = function(a) {
                o && (a && (k = Math.max(p, Math.min(3, k + a))), o.find(".datepicker > div").hide().filter(".datepicker-" + q[k].clsName).show())
            },
            M = function() {
                var b = a("<tr>"),
                    c = f.clone().startOf("w").startOf("d");
                for (d.calendarWeeks === !0 && b.append(a("<th>").addClass("cw").text("#")); c.isBefore(f.clone().endOf("w"));) b.append(a("<th>").addClass("dow").text(c.format("dd"))), c.add(1, "d");
                o.find(".datepicker-days thead").append(b)
            },
            N = function(a) {
                return d.disabledDates[a.format("YYYY-MM-DD")] === !0
            },
            O = function(a) {
                return d.enabledDates[a.format("YYYY-MM-DD")] === !0
            },
            P = function(a) {
                return d.disabledHours[a.format("H")] === !0
            },
            Q = function(a) {
                return d.enabledHours[a.format("H")] === !0
            },
            R = function(b, c) {
                if (!b.isValid()) return !1;
                if (d.disabledDates && "d" === c && N(b)) return !1;
                if (d.enabledDates && "d" === c && !O(b)) return !1;
                if (d.minDate && b.isBefore(d.minDate, c)) return !1;
                if (d.maxDate && b.isAfter(d.maxDate, c)) return !1;
                if (d.daysOfWeekDisabled && "d" === c && d.daysOfWeekDisabled.indexOf(b.day()) !== -1) return !1;
                if (d.disabledHours && ("h" === c || "m" === c || "s" === c) && P(b)) return !1;
                if (d.enabledHours && ("h" === c || "m" === c || "s" === c) && !Q(b)) return !1;
                if (d.disabledTimeIntervals && ("h" === c || "m" === c || "s" === c)) {
                    var e = !1;
                    if (a.each(d.disabledTimeIntervals, function() {
                            if (b.isBetween(this[0], this[1])) return e = !0, !1
                        }), e) return !1
                }
                return !0
            },
            S = function() {
                for (var b = [], c = f.clone().startOf("y").startOf("d"); c.isSame(f, "y");) b.push(a("<span>").attr("data-action", "selectMonth").addClass("month").text(c.format("MMM"))), c.add(1, "M");
                o.find(".datepicker-months td").empty().append(b)
            },
            T = function() {
                var b = o.find(".datepicker-months"),
                    c = b.find("th"),
                    g = b.find("tbody").find("span");
                c.eq(0).find("span").attr("title", d.tooltips.prevYear), c.eq(1).attr("title", d.tooltips.selectYear), c.eq(2).find("span").attr("title", d.tooltips.nextYear), b.find(".disabled").removeClass("disabled"), R(f.clone().subtract(1, "y"), "y") || c.eq(0).addClass("disabled"), c.eq(1).text(f.year()), R(f.clone().add(1, "y"), "y") || c.eq(2).addClass("disabled"), g.removeClass("active"), e.isSame(f, "y") && !m && g.eq(e.month()).addClass("active"), g.each(function(b) {
                    R(f.clone().month(b), "M") || a(this).addClass("disabled")
                })
            },
            U = function() {
                var a = o.find(".datepicker-years"),
                    b = a.find("th"),
                    c = f.clone().subtract(5, "y"),
                    g = f.clone().add(6, "y"),
                    h = "";
                for (b.eq(0).find("span").attr("title", d.tooltips.prevDecade), b.eq(1).attr("title", d.tooltips.selectDecade), b.eq(2).find("span").attr("title", d.tooltips.nextDecade), a.find(".disabled").removeClass("disabled"), d.minDate && d.minDate.isAfter(c, "y") && b.eq(0).addClass("disabled"), b.eq(1).text(c.year() + "-" + g.year()), d.maxDate && d.maxDate.isBefore(g, "y") && b.eq(2).addClass("disabled"); !c.isAfter(g, "y");) h += '<span data-action="selectYear" class="year' + (c.isSame(e, "y") && !m ? " active" : "") + (R(c, "y") ? "" : " disabled") + '">' + c.year() + "</span>", c.add(1, "y");
                a.find("td").html(h)
            },
            V = function() {
                var a, c = o.find(".datepicker-decades"),
                    g = c.find("th"),
                    h = b({
                        y: f.year() - f.year() % 100 - 1
                    }),
                    i = h.clone().add(100, "y"),
                    j = h.clone(),
                    k = !1,
                    l = !1,
                    m = "";
                for (g.eq(0).find("span").attr("title", d.tooltips.prevCentury), g.eq(2).find("span").attr("title", d.tooltips.nextCentury), c.find(".disabled").removeClass("disabled"), (h.isSame(b({
                        y: 1900
                    })) || d.minDate && d.minDate.isAfter(h, "y")) && g.eq(0).addClass("disabled"), g.eq(1).text(h.year() + "-" + i.year()), (h.isSame(b({
                        y: 2e3
                    })) || d.maxDate && d.maxDate.isBefore(i, "y")) && g.eq(2).addClass("disabled"); !h.isAfter(i, "y");) a = h.year() + 12, k = d.minDate && d.minDate.isAfter(h, "y") && d.minDate.year() <= a, l = d.maxDate && d.maxDate.isAfter(h, "y") && d.maxDate.year() <= a, m += '<span data-action="selectDecade" class="decade' + (e.isAfter(h) && e.year() <= a ? " active" : "") + (R(h, "y") || k || l ? "" : " disabled") + '" data-selection="' + (h.year() + 6) + '">' + (h.year() + 1) + " - " + (h.year() + 12) + "</span>", h.add(12, "y");
                m += "<span></span><span></span><span></span>", c.find("td").html(m), g.eq(1).text(j.year() + 1 + "-" + h.year())
            },
            W = function() {
                var b, c, g, h = o.find(".datepicker-days"),
                    i = h.find("th"),
                    j = [],
                    k = [];
                if (B()) {
                    for (i.eq(0).find("span").attr("title", d.tooltips.prevMonth), i.eq(1).attr("title", d.tooltips.selectMonth), i.eq(2).find("span").attr("title", d.tooltips.nextMonth), h.find(".disabled").removeClass("disabled"), i.eq(1).text(f.format(d.dayViewHeaderFormat)), R(f.clone().subtract(1, "M"), "M") || i.eq(0).addClass("disabled"), R(f.clone().add(1, "M"), "M") || i.eq(2).addClass("disabled"), b = f.clone().startOf("M").startOf("w").startOf("d"), g = 0; g < 42; g++) 0 === b.weekday() && (c = a("<tr>"), d.calendarWeeks && c.append('<td class="cw">' + b.week() + "</td>"), j.push(c)), k = ["day"], b.isBefore(f, "M") && k.push("old"), b.isAfter(f, "M") && k.push("new"), b.isSame(e, "d") && !m && k.push("active"), R(b, "d") || k.push("disabled"), b.isSame(y(), "d") && k.push("today"), 0 !== b.day() && 6 !== b.day() || k.push("weekend"), J({
                        type: "dp.classify",
                        date: b,
                        classNames: k
                    }), c.append('<td data-action="selectDay" data-day="' + b.format("L") + '" class="' + k.join(" ") + '">' + b.date() + "</td>"), b.add(1, "d");
                    h.find("tbody").empty().append(j), T(), U(), V()
                }
            },
            X = function() {
                var b = o.find(".timepicker-hours table"),
                    c = f.clone().startOf("d"),
                    d = [],
                    e = a("<tr>");
                for (f.hour() > 11 && !h && c.hour(12); c.isSame(f, "d") && (h || f.hour() < 12 && c.hour() < 12 || f.hour() > 11);) c.hour() % 4 === 0 && (e = a("<tr>"), d.push(e)), e.append('<td data-action="selectHour" class="hour' + (R(c, "h") ? "" : " disabled") + '">' + c.format(h ? "HH" : "hh") + "</td>"), c.add(1, "h");
                b.empty().append(d)
            },
            Y = function() {
                for (var b = o.find(".timepicker-minutes table"), c = f.clone().startOf("h"), e = [], g = a("<tr>"), h = 1 === d.stepping ? 5 : d.stepping; f.isSame(c, "h");) c.minute() % (4 * h) === 0 && (g = a("<tr>"), e.push(g)), g.append('<td data-action="selectMinute" class="minute' + (R(c, "m") ? "" : " disabled") + '">' + c.format("mm") + "</td>"), c.add(h, "m");
                b.empty().append(e)
            },
            Z = function() {
                for (var b = o.find(".timepicker-seconds table"), c = f.clone().startOf("m"), d = [], e = a("<tr>"); f.isSame(c, "m");) c.second() % 20 === 0 && (e = a("<tr>"), d.push(e)), e.append('<td data-action="selectSecond" class="second' + (R(c, "s") ? "" : " disabled") + '">' + c.format("ss") + "</td>"), c.add(5, "s");
                b.empty().append(d)
            },
            $ = function() {
                var a, b, c = o.find(".timepicker span[data-time-component]");
                h || (a = o.find(".timepicker [data-action=togglePeriod]"), b = e.clone().add(e.hours() >= 12 ? -12 : 12, "h"), a.text(e.format("A")), R(b, "h") ? a.removeClass("disabled") : a.addClass("disabled")), c.filter("[data-time-component=hours]").text(e.format(h ? "HH" : "hh")), c.filter("[data-time-component=minutes]").text(e.format("mm")), c.filter("[data-time-component=seconds]").text(e.format("ss")), X(), Y(), Z()
            },
            _ = function() {
                o && (W(), $())
            },
            aa = function(a) {
                var b = m ? null : e;
                if (!a) return m = !0, g.val(""), c.data("date", ""), J({
                    type: "dp.change",
                    date: !1,
                    oldDate: b
                }), void _();
                if (a = a.clone().locale(d.locale), x() && a.tz(d.timeZone), 1 !== d.stepping)
                    for (a.minutes(Math.round(a.minutes() / d.stepping) * d.stepping).seconds(0); d.minDate && a.isBefore(d.minDate);) a.add(d.stepping, "minutes");
                R(a) ? (e = a, f = e.clone(), g.val(e.format(i)), c.data("date", e.format(i)), m = !1, _(), J({
                    type: "dp.change",
                    date: e.clone(),
                    oldDate: b
                })) : (d.keepInvalid ? J({
                    type: "dp.change",
                    date: a,
                    oldDate: b
                }) : g.val(m ? "" : e.format(i)), J({
                    type: "dp.error",
                    date: a,
                    oldDate: b
                }))
            },
            ba = function() {
                var b = !1;
                return o ? (o.find(".collapse").each(function() {
                    var c = a(this).data("collapse");
                    return !c || !c.transitioning || (b = !0, !1)
                }), b ? l : (n && n.hasClass("btn") && n.toggleClass("active"), o.hide(), a(window).off("resize", I), o.off("click", "[data-action]"), o.off("mousedown", !1), o.remove(), o = !1, J({
                    type: "dp.hide",
                    date: e.clone()
                }), g.blur(), k = 0, f = e.clone(), l)) : l
            },
            ca = function() {
                aa(null)
            },
            da = function(a) {
                return void 0 === d.parseInputDate ? (!b.isMoment(a) || a instanceof Date) && (a = y(a)) : a = d.parseInputDate(a), a
            },
            ea = {
                next: function() {
                    var a = q[k].navFnc;
                    f.add(q[k].navStep, a), W(), K(a)
                },
                previous: function() {
                    var a = q[k].navFnc;
                    f.subtract(q[k].navStep, a), W(), K(a)
                },
                pickerSwitch: function() {
                    L(1)
                },
                selectMonth: function(b) {
                    var c = a(b.target).closest("tbody").find("span").index(a(b.target));
                    f.month(c), k === p ? (aa(e.clone().year(f.year()).month(f.month())), d.inline || ba()) : (L(-1), W()), K("M")
                },
                selectYear: function(b) {
                    var c = parseInt(a(b.target).text(), 10) || 0;
                    f.year(c), k === p ? (aa(e.clone().year(f.year())), d.inline || ba()) : (L(-1), W()), K("YYYY")
                },
                selectDecade: function(b) {
                    var c = parseInt(a(b.target).data("selection"), 10) || 0;
                    f.year(c), k === p ? (aa(e.clone().year(f.year())), d.inline || ba()) : (L(-1), W()), K("YYYY")
                },
                selectDay: function(b) {
                    var c = f.clone();
                    a(b.target).is(".old") && c.subtract(1, "M"), a(b.target).is(".new") && c.add(1, "M"), aa(c.date(parseInt(a(b.target).text(), 10))), A() || d.keepOpen || d.inline || ba()
                },
                incrementHours: function() {
                    var a = e.clone().add(1, "h");
                    R(a, "h") && aa(a)
                },
                incrementMinutes: function() {
                    var a = e.clone().add(d.stepping, "m");
                    R(a, "m") && aa(a)
                },
                incrementSeconds: function() {
                    var a = e.clone().add(1, "s");
                    R(a, "s") && aa(a)
                },
                decrementHours: function() {
                    var a = e.clone().subtract(1, "h");
                    R(a, "h") && aa(a)
                },
                decrementMinutes: function() {
                    var a = e.clone().subtract(d.stepping, "m");
                    R(a, "m") && aa(a)
                },
                decrementSeconds: function() {
                    var a = e.clone().subtract(1, "s");
                    R(a, "s") && aa(a)
                },
                togglePeriod: function() {
                    aa(e.clone().add(e.hours() >= 12 ? -12 : 12, "h"))
                },
                togglePicker: function(b) {
                    var c, e = a(b.target),
                        f = e.closest("ul"),
                        g = f.find(".in"),
                        h = f.find(".collapse:not(.in)");
                    if (g && g.length) {
                        if (c = g.data("collapse"), c && c.transitioning) return;
                        g.collapse ? (g.collapse("hide"), h.collapse("show")) : (g.removeClass("in"), h.addClass("in")), e.is("span") ? e.toggleClass(d.icons.time + " " + d.icons.date) : e.find("span").toggleClass(d.icons.time + " " + d.icons.date)
                    }
                },
                showPicker: function() {
                    o.find(".timepicker > div:not(.timepicker-picker)").hide(), o.find(".timepicker .timepicker-picker").show()
                },
                showHours: function() {
                    o.find(".timepicker .timepicker-picker").hide(), o.find(".timepicker .timepicker-hours").show()
                },
                showMinutes: function() {
                    o.find(".timepicker .timepicker-picker").hide(), o.find(".timepicker .timepicker-minutes").show()
                },
                showSeconds: function() {
                    o.find(".timepicker .timepicker-picker").hide(), o.find(".timepicker .timepicker-seconds").show()
                },
                selectHour: function(b) {
                    var c = parseInt(a(b.target).text(), 10);
                    h || (e.hours() >= 12 ? 12 !== c && (c += 12) : 12 === c && (c = 0)), aa(e.clone().hours(c)), ea.showPicker.call(l)
                },
                selectMinute: function(b) {
                    aa(e.clone().minutes(parseInt(a(b.target).text(), 10))), ea.showPicker.call(l)
                },
                selectSecond: function(b) {
                    aa(e.clone().seconds(parseInt(a(b.target).text(), 10))), ea.showPicker.call(l)
                },
                clear: ca,
                today: function() {
                    var a = y();
                    R(a, "d") && aa(a)
                },
                close: ba
            },
            fa = function(b) {
                return !a(b.currentTarget).is(".disabled") && (ea[a(b.currentTarget).data("action")].apply(l, arguments), !1)
            },
            ga = function() {
                var b, c = {
                    year: function(a) {
                        return a.month(0).date(1).hours(0).seconds(0).minutes(0)
                    },
                    month: function(a) {
                        return a.date(1).hours(0).seconds(0).minutes(0)
                    },
                    day: function(a) {
                        return a.hours(0).seconds(0).minutes(0)
                    },
                    hour: function(a) {
                        return a.seconds(0).minutes(0)
                    },
                    minute: function(a) {
                        return a.seconds(0)
                    }
                };
                return g.prop("disabled") || !d.ignoreReadonly && g.prop("readonly") || o ? l : (void 0 !== g.val() && 0 !== g.val().trim().length ? aa(da(g.val().trim())) : m && d.useCurrent && (d.inline || g.is("input") && 0 === g.val().trim().length) && (b = y(), "string" == typeof d.useCurrent && (b = c[d.useCurrent](b)), aa(b)), o = G(), M(), S(), o.find(".timepicker-hours").hide(), o.find(".timepicker-minutes").hide(), o.find(".timepicker-seconds").hide(), _(), L(), a(window).on("resize", I), o.on("click", "[data-action]", fa), o.on("mousedown", !1), n && n.hasClass("btn") && n.toggleClass("active"), I(), o.show(), d.focusOnShow && !g.is(":focus") && g.focus(), J({
                    type: "dp.show"
                }), l)
            },
            ha = function() {
                return o ? ba() : ga()
            },
            ia = function(a) {
                var b, c, e, f, g = null,
                    h = [],
                    i = {},
                    j = a.which,
                    k = "p";
                w[j] = k;
                for (b in w) w.hasOwnProperty(b) && w[b] === k && (h.push(b), parseInt(b, 10) !== j && (i[b] = !0));
                for (b in d.keyBinds)
                    if (d.keyBinds.hasOwnProperty(b) && "function" == typeof d.keyBinds[b] && (e = b.split(" "), e.length === h.length && v[j] === e[e.length - 1])) {
                        for (f = !0, c = e.length - 2; c >= 0; c--)
                            if (!(v[e[c]] in i)) {
                                f = !1;
                                break
                            }
                        if (f) {
                            g = d.keyBinds[b];
                            break
                        }
                    }
                g && (g.call(l, o), a.stopPropagation(), a.preventDefault())
            },
            ja = function(a) {
                w[a.which] = "r", a.stopPropagation(), a.preventDefault()
            },
            ka = function(b) {
                var c = a(b.target).val().trim(),
                    d = c ? da(c) : null;
                return aa(d), b.stopImmediatePropagation(), !1
            },
            la = function() {
                g.on({
                    change: ka,
                    blur: d.debug ? "" : ba,
                    keydown: ia,
                    keyup: ja,
                    focus: d.allowInputToggle ? ga : ""
                }), c.is("input") ? g.on({
                    focus: ga
                }) : n && (n.on("click", ha), n.on("mousedown", !1))
            },
            ma = function() {
                g.off({
                    change: ka,
                    blur: blur,
                    keydown: ia,
                    keyup: ja,
                    focus: d.allowInputToggle ? ba : ""
                }), c.is("input") ? g.off({
                    focus: ga
                }) : n && (n.off("click", ha), n.off("mousedown", !1))
            },
            na = function(b) {
                var c = {};
                return a.each(b, function() {
                    var a = da(this);
                    a.isValid() && (c[a.format("YYYY-MM-DD")] = !0)
                }), !!Object.keys(c).length && c
            },
            oa = function(b) {
                var c = {};
                return a.each(b, function() {
                    c[this] = !0
                }), !!Object.keys(c).length && c
            },
            pa = function() {
                var a = d.format || "L LT";
                i = a.replace(/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, function(a) {
                    var b = e.localeData().longDateFormat(a) || a;
                    return b.replace(/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, function(a) {
                        return e.localeData().longDateFormat(a) || a
                    })
                }), j = d.extraFormats ? d.extraFormats.slice() : [], j.indexOf(a) < 0 && j.indexOf(i) < 0 && j.push(i), h = i.toLowerCase().indexOf("a") < 1 && i.replace(/\[.*?\]/g, "").indexOf("h") < 1, z("y") && (p = 2), z("M") && (p = 1), z("d") && (p = 0), k = Math.max(p, k), m || aa(e)
            };
        if (l.destroy = function() {
                ba(), ma(), c.removeData("DateTimePicker"), c.removeData("date")
            }, l.toggle = ha, l.show = ga, l.hide = ba, l.disable = function() {
                return ba(), n && n.hasClass("btn") && n.addClass("disabled"), g.prop("disabled", !0), l
            }, l.enable = function() {
                return n && n.hasClass("btn") && n.removeClass("disabled"), g.prop("disabled", !1), l
            }, l.ignoreReadonly = function(a) {
                if (0 === arguments.length) return d.ignoreReadonly;
                if ("boolean" != typeof a) throw new TypeError("ignoreReadonly () expects a boolean parameter");
                return d.ignoreReadonly = a, l
            }, l.options = function(b) {
                if (0 === arguments.length) return a.extend(!0, {}, d);
                if (!(b instanceof Object)) throw new TypeError("options() options parameter should be an object");
                return a.extend(!0, d, b), a.each(d, function(a, b) {
                    if (void 0 === l[a]) throw new TypeError("option " + a + " is not recognized!");
                    l[a](b)
                }), l
            }, l.date = function(a) {
                if (0 === arguments.length) return m ? null : e.clone();
                if (!(null === a || "string" == typeof a || b.isMoment(a) || a instanceof Date)) throw new TypeError("date() parameter must be one of [null, string, moment or Date]");
                return aa(null === a ? null : da(a)), l
            }, l.format = function(a) {
                if (0 === arguments.length) return d.format;
                if ("string" != typeof a && ("boolean" != typeof a || a !== !1)) throw new TypeError("format() expects a string or boolean:false parameter " + a);
                return d.format = a, i && pa(), l
            }, l.timeZone = function(a) {
                if (0 === arguments.length) return d.timeZone;
                if ("string" != typeof a) throw new TypeError("newZone() expects a string parameter");
                return d.timeZone = a, l
            }, l.dayViewHeaderFormat = function(a) {
                if (0 === arguments.length) return d.dayViewHeaderFormat;
                if ("string" != typeof a) throw new TypeError("dayViewHeaderFormat() expects a string parameter");
                return d.dayViewHeaderFormat = a, l
            }, l.extraFormats = function(a) {
                if (0 === arguments.length) return d.extraFormats;
                if (a !== !1 && !(a instanceof Array)) throw new TypeError("extraFormats() expects an array or false parameter");
                return d.extraFormats = a, j && pa(), l
            }, l.disabledDates = function(b) {
                if (0 === arguments.length) return d.disabledDates ? a.extend({}, d.disabledDates) : d.disabledDates;
                if (!b) return d.disabledDates = !1, _(), l;
                if (!(b instanceof Array)) throw new TypeError("disabledDates() expects an array parameter");
                return d.disabledDates = na(b), d.enabledDates = !1, _(), l
            }, l.enabledDates = function(b) {
                if (0 === arguments.length) return d.enabledDates ? a.extend({}, d.enabledDates) : d.enabledDates;
                if (!b) return d.enabledDates = !1, _(), l;
                if (!(b instanceof Array)) throw new TypeError("enabledDates() expects an array parameter");
                return d.enabledDates = na(b), d.disabledDates = !1, _(), l
            }, l.daysOfWeekDisabled = function(a) {
                if (0 === arguments.length) return d.daysOfWeekDisabled.splice(0);
                if ("boolean" == typeof a && !a) return d.daysOfWeekDisabled = !1, _(), l;
                if (!(a instanceof Array)) throw new TypeError("daysOfWeekDisabled() expects an array parameter");
                if (d.daysOfWeekDisabled = a.reduce(function(a, b) {
                        return b = parseInt(b, 10), b > 6 || b < 0 || isNaN(b) ? a : (a.indexOf(b) === -1 && a.push(b), a)
                    }, []).sort(), d.useCurrent && !d.keepInvalid) {
                    for (var b = 0; !R(e, "d");) {
                        if (e.add(1, "d"), 31 === b) throw "Tried 31 times to find a valid date";
                        b++
                    }
                    aa(e)
                }
                return _(), l
            }, l.maxDate = function(a) {
                if (0 === arguments.length) return d.maxDate ? d.maxDate.clone() : d.maxDate;
                if ("boolean" == typeof a && a === !1) return d.maxDate = !1, _(), l;
                "string" == typeof a && ("now" !== a && "moment" !== a || (a = y()));
                var b = da(a);
                if (!b.isValid()) throw new TypeError("maxDate() Could not parse date parameter: " + a);
                if (d.minDate && b.isBefore(d.minDate)) throw new TypeError("maxDate() date parameter is before options.minDate: " + b.format(i));
                return d.maxDate = b, d.useCurrent && !d.keepInvalid && e.isAfter(a) && aa(d.maxDate), f.isAfter(b) && (f = b.clone().subtract(d.stepping, "m")), _(), l
            }, l.minDate = function(a) {
                if (0 === arguments.length) return d.minDate ? d.minDate.clone() : d.minDate;
                if ("boolean" == typeof a && a === !1) return d.minDate = !1, _(), l;
                "string" == typeof a && ("now" !== a && "moment" !== a || (a = y()));
                var b = da(a);
                if (!b.isValid()) throw new TypeError("minDate() Could not parse date parameter: " + a);
                if (d.maxDate && b.isAfter(d.maxDate)) throw new TypeError("minDate() date parameter is after options.maxDate: " + b.format(i));
                return d.minDate = b, d.useCurrent && !d.keepInvalid && e.isBefore(a) && aa(d.minDate), f.isBefore(b) && (f = b.clone().add(d.stepping, "m")), _(), l
            }, l.defaultDate = function(a) {
                if (0 === arguments.length) return d.defaultDate ? d.defaultDate.clone() : d.defaultDate;
                if (!a) return d.defaultDate = !1, l;
                "string" == typeof a && (a = "now" === a || "moment" === a ? y() : y(a));
                var b = da(a);
                if (!b.isValid()) throw new TypeError("defaultDate() Could not parse date parameter: " + a);
                if (!R(b)) throw new TypeError("defaultDate() date passed is invalid according to component setup validations");
                return d.defaultDate = b, (d.defaultDate && d.inline || "" === g.val().trim()) && aa(d.defaultDate), l
            }, l.locale = function(a) {
                if (0 === arguments.length) return d.locale;
                if (!b.localeData(a)) throw new TypeError("locale() locale " + a + " is not loaded from moment locales!");
                return d.locale = a, e.locale(d.locale), f.locale(d.locale), i && pa(), o && (ba(), ga()), l
            }, l.stepping = function(a) {
                return 0 === arguments.length ? d.stepping : (a = parseInt(a, 10), (isNaN(a) || a < 1) && (a = 1), d.stepping = a, l)
            }, l.useCurrent = function(a) {
                var b = ["year", "month", "day", "hour", "minute"];
                if (0 === arguments.length) return d.useCurrent;
                if ("boolean" != typeof a && "string" != typeof a) throw new TypeError("useCurrent() expects a boolean or string parameter");
                if ("string" == typeof a && b.indexOf(a.toLowerCase()) === -1) throw new TypeError("useCurrent() expects a string parameter of " + b.join(", "));
                return d.useCurrent = a, l
            }, l.collapse = function(a) {
                if (0 === arguments.length) return d.collapse;
                if ("boolean" != typeof a) throw new TypeError("collapse() expects a boolean parameter");
                return d.collapse === a ? l : (d.collapse = a, o && (ba(), ga()), l)
            }, l.icons = function(b) {
                if (0 === arguments.length) return a.extend({}, d.icons);
                if (!(b instanceof Object)) throw new TypeError("icons() expects parameter to be an Object");
                return a.extend(d.icons, b), o && (ba(), ga()), l
            }, l.tooltips = function(b) {
                if (0 === arguments.length) return a.extend({}, d.tooltips);
                if (!(b instanceof Object)) throw new TypeError("tooltips() expects parameter to be an Object");
                return a.extend(d.tooltips, b), o && (ba(), ga()), l
            }, l.useStrict = function(a) {
                if (0 === arguments.length) return d.useStrict;
                if ("boolean" != typeof a) throw new TypeError("useStrict() expects a boolean parameter");
                return d.useStrict = a, l
            }, l.sideBySide = function(a) {
                if (0 === arguments.length) return d.sideBySide;
                if ("boolean" != typeof a) throw new TypeError("sideBySide() expects a boolean parameter");
                return d.sideBySide = a, o && (ba(), ga()), l
            }, l.viewMode = function(a) {
                if (0 === arguments.length) return d.viewMode;
                if ("string" != typeof a) throw new TypeError("viewMode() expects a string parameter");
                if (r.indexOf(a) === -1) throw new TypeError("viewMode() parameter must be one of (" + r.join(", ") + ") value");
                return d.viewMode = a, k = Math.max(r.indexOf(a), p), L(), l
            }, l.toolbarPlacement = function(a) {
                if (0 === arguments.length) return d.toolbarPlacement;
                if ("string" != typeof a) throw new TypeError("toolbarPlacement() expects a string parameter");
                if (u.indexOf(a) === -1) throw new TypeError("toolbarPlacement() parameter must be one of (" + u.join(", ") + ") value");
                return d.toolbarPlacement = a, o && (ba(), ga()), l
            }, l.widgetPositioning = function(b) {
                if (0 === arguments.length) return a.extend({}, d.widgetPositioning);
                if ("[object Object]" !== {}.toString.call(b)) throw new TypeError("widgetPositioning() expects an object variable");
                if (b.horizontal) {
                    if ("string" != typeof b.horizontal) throw new TypeError("widgetPositioning() horizontal variable must be a string");
                    if (b.horizontal = b.horizontal.toLowerCase(), t.indexOf(b.horizontal) === -1) throw new TypeError("widgetPositioning() expects horizontal parameter to be one of (" + t.join(", ") + ")");
                    d.widgetPositioning.horizontal = b.horizontal
                }
                if (b.vertical) {
                    if ("string" != typeof b.vertical) throw new TypeError("widgetPositioning() vertical variable must be a string");
                    if (b.vertical = b.vertical.toLowerCase(), s.indexOf(b.vertical) === -1) throw new TypeError("widgetPositioning() expects vertical parameter to be one of (" + s.join(", ") + ")");
                    d.widgetPositioning.vertical = b.vertical
                }
                return _(), l
            }, l.calendarWeeks = function(a) {
                if (0 === arguments.length) return d.calendarWeeks;
                if ("boolean" != typeof a) throw new TypeError("calendarWeeks() expects parameter to be a boolean value");
                return d.calendarWeeks = a, _(), l
            }, l.showTodayButton = function(a) {
                if (0 === arguments.length) return d.showTodayButton;
                if ("boolean" != typeof a) throw new TypeError("showTodayButton() expects a boolean parameter");
                return d.showTodayButton = a, o && (ba(), ga()), l
            }, l.showClear = function(a) {
                if (0 === arguments.length) return d.showClear;
                if ("boolean" != typeof a) throw new TypeError("showClear() expects a boolean parameter");
                return d.showClear = a, o && (ba(), ga()), l
            }, l.widgetParent = function(b) {
                if (0 === arguments.length) return d.widgetParent;
                if ("string" == typeof b && (b = a(b)), null !== b && "string" != typeof b && !(b instanceof a)) throw new TypeError("widgetParent() expects a string or a jQuery object parameter");
                return d.widgetParent = b, o && (ba(), ga()), l
            }, l.keepOpen = function(a) {
                if (0 === arguments.length) return d.keepOpen;
                if ("boolean" != typeof a) throw new TypeError("keepOpen() expects a boolean parameter");
                return d.keepOpen = a, l
            }, l.focusOnShow = function(a) {
                if (0 === arguments.length) return d.focusOnShow;
                if ("boolean" != typeof a) throw new TypeError("focusOnShow() expects a boolean parameter");
                return d.focusOnShow = a, l
            }, l.inline = function(a) {
                if (0 === arguments.length) return d.inline;
                if ("boolean" != typeof a) throw new TypeError("inline() expects a boolean parameter");
                return d.inline = a, l
            }, l.clear = function() {
                return ca(), l
            }, l.keyBinds = function(a) {
                return 0 === arguments.length ? d.keyBinds : (d.keyBinds = a, l)
            }, l.getMoment = function(a) {
                return y(a)
            }, l.debug = function(a) {
                if ("boolean" != typeof a) throw new TypeError("debug() expects a boolean parameter");
                return d.debug = a, l
            }, l.allowInputToggle = function(a) {
                if (0 === arguments.length) return d.allowInputToggle;
                if ("boolean" != typeof a) throw new TypeError("allowInputToggle() expects a boolean parameter");
                return d.allowInputToggle = a, l
            }, l.showClose = function(a) {
                if (0 === arguments.length) return d.showClose;
                if ("boolean" != typeof a) throw new TypeError("showClose() expects a boolean parameter");
                return d.showClose = a, l
            }, l.keepInvalid = function(a) {
                if (0 === arguments.length) return d.keepInvalid;
                if ("boolean" != typeof a) throw new TypeError("keepInvalid() expects a boolean parameter");
                return d.keepInvalid = a, l
            }, l.datepickerInput = function(a) {
                if (0 === arguments.length) return d.datepickerInput;
                if ("string" != typeof a) throw new TypeError("datepickerInput() expects a string parameter");
                return d.datepickerInput = a, l
            }, l.parseInputDate = function(a) {
                if (0 === arguments.length) return d.parseInputDate;
                if ("function" != typeof a) throw new TypeError("parseInputDate() sholud be as function");
                return d.parseInputDate = a, l
            }, l.disabledTimeIntervals = function(b) {
                if (0 === arguments.length) return d.disabledTimeIntervals ? a.extend({}, d.disabledTimeIntervals) : d.disabledTimeIntervals;
                if (!b) return d.disabledTimeIntervals = !1, _(), l;
                if (!(b instanceof Array)) throw new TypeError("disabledTimeIntervals() expects an array parameter");
                return d.disabledTimeIntervals = b, _(), l
            }, l.disabledHours = function(b) {
                if (0 === arguments.length) return d.disabledHours ? a.extend({}, d.disabledHours) : d.disabledHours;
                if (!b) return d.disabledHours = !1, _(), l;
                if (!(b instanceof Array)) throw new TypeError("disabledHours() expects an array parameter");
                if (d.disabledHours = oa(b), d.enabledHours = !1, d.useCurrent && !d.keepInvalid) {
                    for (var c = 0; !R(e, "h");) {
                        if (e.add(1, "h"), 24 === c) throw "Tried 24 times to find a valid date";
                        c++
                    }
                    aa(e)
                }
                return _(), l
            }, l.enabledHours = function(b) {
                if (0 === arguments.length) return d.enabledHours ? a.extend({}, d.enabledHours) : d.enabledHours;
                if (!b) return d.enabledHours = !1, _(), l;
                if (!(b instanceof Array)) throw new TypeError("enabledHours() expects an array parameter");
                if (d.enabledHours = oa(b), d.disabledHours = !1, d.useCurrent && !d.keepInvalid) {
                    for (var c = 0; !R(e, "h");) {
                        if (e.add(1, "h"), 24 === c) throw "Tried 24 times to find a valid date";
                        c++
                    }
                    aa(e)
                }
                return _(), l
            }, l.viewDate = function(a) {
                if (0 === arguments.length) return f.clone();
                if (!a) return f = e.clone(), l;
                if (!("string" == typeof a || b.isMoment(a) || a instanceof Date)) throw new TypeError("viewDate() parameter must be one of [string, moment or Date]");
                return f = da(a), K(), l
            }, c.is("input")) g = c;
        else if (g = c.find(d.datepickerInput), 0 === g.length) g = c.find("input");
        else if (!g.is("input")) throw new Error('CSS class "' + d.datepickerInput + '" cannot be applied to non input element');
        if (c.hasClass("input-group") && (n = 0 === c.find(".datepickerbutton").length ? c.find(".input-group-addon") : c.find(".datepickerbutton")), !d.inline && !g.is("input")) throw new Error("Could not initialize DateTimePicker without an input element");
        return e = y(), f = e.clone(), a.extend(!0, d, H()), l.options(d), pa(), la(), g.prop("disabled") && l.disable(), g.is("input") && 0 !== g.val().trim().length ? aa(da(g.val().trim())) : d.defaultDate && void 0 === g.attr("placeholder") && aa(d.defaultDate), d.inline && ga(), l
    };
    return a.fn.datetimepicker = function(b) {
        b = b || {};
        var d, e = Array.prototype.slice.call(arguments, 1),
            f = !0,
            g = ["destroy", "hide", "show", "toggle"];
        if ("object" == typeof b) return this.each(function() {
            var d, e = a(this);
            e.data("DateTimePicker") || (d = a.extend(!0, {}, a.fn.datetimepicker.defaults, b), e.data("DateTimePicker", c(e, d)))
        });
        if ("string" == typeof b) return this.each(function() {
            var c = a(this),
                g = c.data("DateTimePicker");
            if (!g) throw new Error('bootstrap-datetimepicker("' + b + '") method was called on an element that is not using DateTimePicker');
            d = g[b].apply(g, e), f = d === g
        }), f || a.inArray(b, g) > -1 ? this : d;
        throw new TypeError("Invalid arguments for DateTimePicker: " + b)
    }, a.fn.datetimepicker.defaults = {
        timeZone: "",
        format: !1,
        dayViewHeaderFormat: "MMMM YYYY",
        extraFormats: !1,
        stepping: 1,
        minDate: !1,
        maxDate: !1,
        useCurrent: !0,
        collapse: !0,
        locale: b.locale(),
        defaultDate: !1,
        disabledDates: !1,
        enabledDates: !1,
        icons: {
            time: "glyphicon glyphicon-time",
            date: "glyphicon glyphicon-calendar",
            up: "glyphicon glyphicon-chevron-up",
            down: "glyphicon glyphicon-chevron-down",
            previous: "glyphicon glyphicon-chevron-left",
            next: "glyphicon glyphicon-chevron-right",
            today: "glyphicon glyphicon-screenshot",
            clear: "glyphicon glyphicon-trash",
            close: "glyphicon glyphicon-remove"
        },
        tooltips: {
            today: "Go to today",
            clear: "Clear selection",
            close: "Close the picker",
            selectMonth: "Select Month",
            prevMonth: "Previous Month",
            nextMonth: "Next Month",
            selectYear: "Select Year",
            prevYear: "Previous Year",
            nextYear: "Next Year",
            selectDecade: "Select Decade",
            prevDecade: "Previous Decade",
            nextDecade: "Next Decade",
            prevCentury: "Previous Century",
            nextCentury: "Next Century",
            pickHour: "Pick Hour",
            incrementHour: "Increment Hour",
            decrementHour: "Decrement Hour",
            pickMinute: "Pick Minute",
            incrementMinute: "Increment Minute",
            decrementMinute: "Decrement Minute",
            pickSecond: "Pick Second",
            incrementSecond: "Increment Second",
            decrementSecond: "Decrement Second",
            togglePeriod: "Toggle Period",
            selectTime: "Select Time"
        },
        useStrict: !1,
        sideBySide: !1,
        daysOfWeekDisabled: !1,
        calendarWeeks: !1,
        viewMode: "days",
        toolbarPlacement: "default",
        showTodayButton: !1,
        showClear: !1,
        showClose: !1,
        widgetPositioning: {
            horizontal: "auto",
            vertical: "auto"
        },
        widgetParent: null,
        ignoreReadonly: !1,
        keepOpen: !1,
        focusOnShow: !0,
        inline: !1,
        keepInvalid: !1,
        datepickerInput: ".datepickerinput",
        keyBinds: {
            up: function(a) {
                if (a) {
                    var b = this.date() || this.getMoment();
                    a.find(".datepicker").is(":visible") ? this.date(b.clone().subtract(7, "d")) : this.date(b.clone().add(this.stepping(), "m"))
                }
            },
            down: function(a) {
                if (!a) return void this.show();
                var b = this.date() || this.getMoment();
                a.find(".datepicker").is(":visible") ? this.date(b.clone().add(7, "d")) : this.date(b.clone().subtract(this.stepping(), "m"))
            },
            "control up": function(a) {
                if (a) {
                    var b = this.date() || this.getMoment();
                    a.find(".datepicker").is(":visible") ? this.date(b.clone().subtract(1, "y")) : this.date(b.clone().add(1, "h"))
                }
            },
            "control down": function(a) {
                if (a) {
                    var b = this.date() || this.getMoment();
                    a.find(".datepicker").is(":visible") ? this.date(b.clone().add(1, "y")) : this.date(b.clone().subtract(1, "h"))
                }
            },
            left: function(a) {
                if (a) {
                    var b = this.date() || this.getMoment();
                    a.find(".datepicker").is(":visible") && this.date(b.clone().subtract(1, "d"))
                }
            },
            right: function(a) {
                if (a) {
                    var b = this.date() || this.getMoment();
                    a.find(".datepicker").is(":visible") && this.date(b.clone().add(1, "d"))
                }
            },
            pageUp: function(a) {
                if (a) {
                    var b = this.date() || this.getMoment();
                    a.find(".datepicker").is(":visible") && this.date(b.clone().subtract(1, "M"))
                }
            },
            pageDown: function(a) {
                if (a) {
                    var b = this.date() || this.getMoment();
                    a.find(".datepicker").is(":visible") && this.date(b.clone().add(1, "M"))
                }
            },
            enter: function() {
                this.hide()
            },
            escape: function() {
                this.hide()
            },
            "control space": function(a) {
                a && a.find(".timepicker").is(":visible") && a.find('.btn[data-action="togglePeriod"]').click()
            },
            t: function() {
                this.date(this.getMoment())
            },
            delete: function() {
                this.clear()
            }
        },
        debug: !1,
        allowInputToggle: !1,
        disabledTimeIntervals: !1,
        disabledHours: !1,
        enabledHours: !1,
        viewDate: !1
    }, a.fn.datetimepicker
});

/*!
 * jQuery Form Plugin
 * version: 3.51.0-2014.06.20
 * Requires jQuery v1.5 or later
 * Copyright (c) 2014 M. Alsup
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Project repository: https://github.com/malsup/form
 * Dual licensed under the MIT and GPL licenses.
 * https://github.com/malsup/form#copyright-and-license
 */
! function(e) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery"], e) : e("undefined" != typeof jQuery ? jQuery : window.Zepto)
}(function(e) {
    "use strict";

    function t(t) {
        var r = t.data;
        t.isDefaultPrevented() || (t.preventDefault(), e(t.target).ajaxSubmit(r))
    }

    function r(t) {
        var r = t.target,
            a = e(r);
        if (!a.is("[type=submit],[type=image]")) {
            var n = a.closest("[type=submit]");
            if (0 === n.length) return;
            r = n[0]
        }
        var i = this;
        if (i.clk = r, "image" == r.type)
            if (void 0 !== t.offsetX) i.clk_x = t.offsetX, i.clk_y = t.offsetY;
            else if ("function" == typeof e.fn.offset) {
            var o = a.offset();
            i.clk_x = t.pageX - o.left, i.clk_y = t.pageY - o.top
        } else i.clk_x = t.pageX - r.offsetLeft, i.clk_y = t.pageY - r.offsetTop;
        setTimeout(function() {
            i.clk = i.clk_x = i.clk_y = null
        }, 100)
    }

    function a() {
        if (e.fn.ajaxSubmit.debug) {
            var t = "[jquery.form] " + Array.prototype.join.call(arguments, "");
            window.console && window.console.log ? window.console.log(t) : window.opera && window.opera.postError && window.opera.postError(t)
        }
    }
    var n = {};
    n.fileapi = void 0 !== e("<input type='file'/>").get(0).files, n.formdata = void 0 !== window.FormData;
    var i = !!e.fn.prop;
    e.fn.attr2 = function() {
        if (!i) return this.attr.apply(this, arguments);
        var e = this.prop.apply(this, arguments);
        return e && e.jquery || "string" == typeof e ? e : this.attr.apply(this, arguments)
    }, e.fn.ajaxSubmit = function(t) {
        function r(r) {
            var a, n, i = e.param(r, t.traditional).split("&"),
                o = i.length,
                s = [];
            for (a = 0; o > a; a++) i[a] = i[a].replace(/\+/g, " "), n = i[a].split("="), s.push([decodeURIComponent(n[0]), decodeURIComponent(n[1])]);
            return s
        }

        function o(a) {
            for (var n = new FormData, i = 0; i < a.length; i++) n.append(a[i].name, a[i].value);
            if (t.extraData) {
                var o = r(t.extraData);
                for (i = 0; i < o.length; i++) o[i] && n.append(o[i][0], o[i][1])
            }
            t.data = null;
            var s = e.extend(!0, {}, e.ajaxSettings, t, {
                contentType: !1,
                processData: !1,
                cache: !1,
                type: u || "POST"
            });
            t.uploadProgress && (s.xhr = function() {
                var r = e.ajaxSettings.xhr();
                return r.upload && r.upload.addEventListener("progress", function(e) {
                    var r = 0,
                        a = e.loaded || e.position,
                        n = e.total;
                    e.lengthComputable && (r = Math.ceil(a / n * 100)), t.uploadProgress(e, a, n, r)
                }, !1), r
            }), s.data = null;
            var c = s.beforeSend;
            return s.beforeSend = function(e, r) {
                r.data = t.formData ? t.formData : n, c && c.call(this, e, r)
            }, e.ajax(s)
        }

        function s(r) {
            function n(e) {
                var t = null;
                try {
                    e.contentWindow && (t = e.contentWindow.document)
                } catch (r) {
                    a("cannot get iframe.contentWindow document: " + r)
                }
                if (t) return t;
                try {
                    t = e.contentDocument ? e.contentDocument : e.document
                } catch (r) {
                    a("cannot get iframe.contentDocument: " + r), t = e.document
                }
                return t
            }

            function o() {
                function t() {
                    try {
                        var e = n(g).readyState;
                        a("state = " + e), e && "uninitialized" == e.toLowerCase() && setTimeout(t, 50)
                    } catch (r) {
                        a("Server abort: ", r, " (", r.name, ")"), s(k), j && clearTimeout(j), j = void 0
                    }
                }
                var r = f.attr2("target"),
                    i = f.attr2("action"),
                    o = "multipart/form-data",
                    c = f.attr("enctype") || f.attr("encoding") || o;
                w.setAttribute("target", p), (!u || /post/i.test(u)) && w.setAttribute("method", "POST"), i != m.url && w.setAttribute("action", m.url), m.skipEncodingOverride || u && !/post/i.test(u) || f.attr({
                    encoding: "multipart/form-data",
                    enctype: "multipart/form-data"
                }), m.timeout && (j = setTimeout(function() {
                    T = !0, s(D)
                }, m.timeout));
                var l = [];
                try {
                    if (m.extraData)
                        for (var d in m.extraData) m.extraData.hasOwnProperty(d) && l.push(e.isPlainObject(m.extraData[d]) && m.extraData[d].hasOwnProperty("name") && m.extraData[d].hasOwnProperty("value") ? e('<input type="hidden" name="' + m.extraData[d].name + '">').val(m.extraData[d].value).appendTo(w)[0] : e('<input type="hidden" name="' + d + '">').val(m.extraData[d]).appendTo(w)[0]);
                    m.iframeTarget || v.appendTo("body"), g.attachEvent ? g.attachEvent("onload", s) : g.addEventListener("load", s, !1), setTimeout(t, 15);
                    try {
                        w.submit()
                    } catch (h) {
                        var x = document.createElement("form").submit;
                        x.apply(w)
                    }
                } finally {
                    w.setAttribute("action", i), w.setAttribute("enctype", c), r ? w.setAttribute("target", r) : f.removeAttr("target"), e(l).remove()
                }
            }

            function s(t) {
                if (!x.aborted && !F) {
                    if (M = n(g), M || (a("cannot access response document"), t = k), t === D && x) return x.abort("timeout"), void S.reject(x, "timeout");
                    if (t == k && x) return x.abort("server abort"), void S.reject(x, "error", "server abort");
                    if (M && M.location.href != m.iframeSrc || T) {
                        g.detachEvent ? g.detachEvent("onload", s) : g.removeEventListener("load", s, !1);
                        var r, i = "success";
                        try {
                            if (T) throw "timeout";
                            var o = "xml" == m.dataType || M.XMLDocument || e.isXMLDoc(M);
                            if (a("isXml=" + o), !o && window.opera && (null === M.body || !M.body.innerHTML) && --O) return a("requeing onLoad callback, DOM not available"), void setTimeout(s, 250);
                            var u = M.body ? M.body : M.documentElement;
                            x.responseText = u ? u.innerHTML : null, x.responseXML = M.XMLDocument ? M.XMLDocument : M, o && (m.dataType = "xml"), x.getResponseHeader = function(e) {
                                var t = {
                                    "content-type": m.dataType
                                };
                                return t[e.toLowerCase()]
                            }, u && (x.status = Number(u.getAttribute("status")) || x.status, x.statusText = u.getAttribute("statusText") || x.statusText);
                            var c = (m.dataType || "").toLowerCase(),
                                l = /(json|script|text)/.test(c);
                            if (l || m.textarea) {
                                var f = M.getElementsByTagName("textarea")[0];
                                if (f) x.responseText = f.value, x.status = Number(f.getAttribute("status")) || x.status, x.statusText = f.getAttribute("statusText") || x.statusText;
                                else if (l) {
                                    var p = M.getElementsByTagName("pre")[0],
                                        h = M.getElementsByTagName("body")[0];
                                    p ? x.responseText = p.textContent ? p.textContent : p.innerText : h && (x.responseText = h.textContent ? h.textContent : h.innerText)
                                }
                            } else "xml" == c && !x.responseXML && x.responseText && (x.responseXML = X(x.responseText));
                            try {
                                E = _(x, c, m)
                            } catch (y) {
                                i = "parsererror", x.error = r = y || i
                            }
                        } catch (y) {
                            a("error caught: ", y), i = "error", x.error = r = y || i
                        }
                        x.aborted && (a("upload aborted"), i = null), x.status && (i = x.status >= 200 && x.status < 300 || 304 === x.status ? "success" : "error"), "success" === i ? (m.success && m.success.call(m.context, E, "success", x), S.resolve(x.responseText, "success", x), d && e.event.trigger("ajaxSuccess", [x, m])) : i && (void 0 === r && (r = x.statusText), m.error && m.error.call(m.context, x, i, r), S.reject(x, "error", r), d && e.event.trigger("ajaxError", [x, m, r])), d && e.event.trigger("ajaxComplete", [x, m]), d && !--e.active && e.event.trigger("ajaxStop"), m.complete && m.complete.call(m.context, x, i), F = !0, m.timeout && clearTimeout(j), setTimeout(function() {
                            m.iframeTarget ? v.attr("src", m.iframeSrc) : v.remove(), x.responseXML = null
                        }, 100)
                    }
                }
            }
            var c, l, m, d, p, v, g, x, y, b, T, j, w = f[0],
                S = e.Deferred();
            if (S.abort = function(e) {
                    x.abort(e)
                }, r)
                for (l = 0; l < h.length; l++) c = e(h[l]), i ? c.prop("disabled", !1) : c.removeAttr("disabled");
            if (m = e.extend(!0, {}, e.ajaxSettings, t), m.context = m.context || m, p = "jqFormIO" + (new Date).getTime(), m.iframeTarget ? (v = e(m.iframeTarget), b = v.attr2("name"), b ? p = b : v.attr2("name", p)) : (v = e('<iframe name="' + p + '" src="' + m.iframeSrc + '" />'), v.css({
                    position: "absolute",
                    top: "-1000px",
                    left: "-1000px"
                })), g = v[0], x = {
                    aborted: 0,
                    responseText: null,
                    responseXML: null,
                    status: 0,
                    statusText: "n/a",
                    getAllResponseHeaders: function() {},
                    getResponseHeader: function() {},
                    setRequestHeader: function() {},
                    abort: function(t) {
                        var r = "timeout" === t ? "timeout" : "aborted";
                        a("aborting upload... " + r), this.aborted = 1;
                        try {
                            g.contentWindow.document.execCommand && g.contentWindow.document.execCommand("Stop")
                        } catch (n) {}
                        v.attr("src", m.iframeSrc), x.error = r, m.error && m.error.call(m.context, x, r, t), d && e.event.trigger("ajaxError", [x, m, r]), m.complete && m.complete.call(m.context, x, r)
                    }
                }, d = m.global, d && 0 === e.active++ && e.event.trigger("ajaxStart"), d && e.event.trigger("ajaxSend", [x, m]), m.beforeSend && m.beforeSend.call(m.context, x, m) === !1) return m.global && e.active--, S.reject(), S;
            if (x.aborted) return S.reject(), S;
            y = w.clk, y && (b = y.name, b && !y.disabled && (m.extraData = m.extraData || {}, m.extraData[b] = y.value, "image" == y.type && (m.extraData[b + ".x"] = w.clk_x, m.extraData[b + ".y"] = w.clk_y)));
            var D = 1,
                k = 2,
                A = e("meta[name=csrf-token]").attr("content"),
                L = e("meta[name=csrf-param]").attr("content");
            L && A && (m.extraData = m.extraData || {}, m.extraData[L] = A), m.forceSync ? o() : setTimeout(o, 10);
            var E, M, F, O = 50,
                X = e.parseXML || function(e, t) {
                    return window.ActiveXObject ? (t = new ActiveXObject("Microsoft.XMLDOM"), t.async = "false", t.loadXML(e)) : t = (new DOMParser).parseFromString(e, "text/xml"), t && t.documentElement && "parsererror" != t.documentElement.nodeName ? t : null
                },
                C = e.parseJSON || function(e) {
                    return window.eval("(" + e + ")")
                },
                _ = function(t, r, a) {
                    var n = t.getResponseHeader("content-type") || "",
                        i = "xml" === r || !r && n.indexOf("xml") >= 0,
                        o = i ? t.responseXML : t.responseText;
                    return i && "parsererror" === o.documentElement.nodeName && e.error && e.error("parsererror"), a && a.dataFilter && (o = a.dataFilter(o, r)), "string" == typeof o && ("json" === r || !r && n.indexOf("json") >= 0 ? o = C(o) : ("script" === r || !r && n.indexOf("javascript") >= 0) && e.globalEval(o)), o
                };
            return S
        }
        if (!this.length) return a("ajaxSubmit: skipping submit process - no element selected"), this;
        var u, c, l, f = this;
        "function" == typeof t ? t = {
            success: t
        } : void 0 === t && (t = {}), u = t.type || this.attr2("method"), c = t.url || this.attr2("action"), l = "string" == typeof c ? e.trim(c) : "", l = l || window.location.href || "", l && (l = (l.match(/^([^#]+)/) || [])[1]), t = e.extend(!0, {
            url: l,
            success: e.ajaxSettings.success,
            type: u || e.ajaxSettings.type,
            iframeSrc: /^https/i.test(window.location.href || "") ? "javascript:false" : "about:blank"
        }, t);
        var m = {};
        if (this.trigger("form-pre-serialize", [this, t, m]), m.veto) return a("ajaxSubmit: submit vetoed via form-pre-serialize trigger"), this;
        if (t.beforeSerialize && t.beforeSerialize(this, t) === !1) return a("ajaxSubmit: submit aborted via beforeSerialize callback"), this;
        var d = t.traditional;
        void 0 === d && (d = e.ajaxSettings.traditional);
        var p, h = [],
            v = this.formToArray(t.semantic, h);
        if (t.data && (t.extraData = t.data, p = e.param(t.data, d)), t.beforeSubmit && t.beforeSubmit(v, this, t) === !1) return a("ajaxSubmit: submit aborted via beforeSubmit callback"), this;
        if (this.trigger("form-submit-validate", [v, this, t, m]), m.veto) return a("ajaxSubmit: submit vetoed via form-submit-validate trigger"), this;
        var g = e.param(v, d);
        p && (g = g ? g + "&" + p : p), "GET" == t.type.toUpperCase() ? (t.url += (t.url.indexOf("?") >= 0 ? "&" : "?") + g, t.data = null) : t.data = g;
        var x = [];
        if (t.resetForm && x.push(function() {
                f.resetForm()
            }), t.clearForm && x.push(function() {
                f.clearForm(t.includeHidden)
            }), !t.dataType && t.target) {
            var y = t.success || function() {};
            x.push(function(r) {
                var a = t.replaceTarget ? "replaceWith" : "html";
                e(t.target)[a](r).each(y, arguments)
            })
        } else t.success && x.push(t.success);
        if (t.success = function(e, r, a) {
                for (var n = t.context || this, i = 0, o = x.length; o > i; i++) x[i].apply(n, [e, r, a || f, f])
            }, t.error) {
            var b = t.error;
            t.error = function(e, r, a) {
                var n = t.context || this;
                b.apply(n, [e, r, a, f])
            }
        }
        if (t.complete) {
            var T = t.complete;
            t.complete = function(e, r) {
                var a = t.context || this;
                T.apply(a, [e, r, f])
            }
        }
        var j = e("input[type=file]:enabled", this).filter(function() {
                return "" !== e(this).val()
            }),
            w = j.length > 0,
            S = "multipart/form-data",
            D = f.attr("enctype") == S || f.attr("encoding") == S,
            k = n.fileapi && n.formdata;
        a("fileAPI :" + k);
        var A, L = (w || D) && !k;
        t.iframe !== !1 && (t.iframe || L) ? t.closeKeepAlive ? e.get(t.closeKeepAlive, function() {
            A = s(v)
        }) : A = s(v) : A = (w || D) && k ? o(v) : e.ajax(t), f.removeData("jqxhr").data("jqxhr", A);
        for (var E = 0; E < h.length; E++) h[E] = null;
        return this.trigger("form-submit-notify", [this, t]), this
    }, e.fn.ajaxForm = function(n) {
        if (n = n || {}, n.delegation = n.delegation && e.isFunction(e.fn.on), !n.delegation && 0 === this.length) {
            var i = {
                s: this.selector,
                c: this.context
            };
            return !e.isReady && i.s ? (a("DOM not ready, queuing ajaxForm"), e(function() {
                e(i.s, i.c).ajaxForm(n)
            }), this) : (a("terminating; zero elements found by selector" + (e.isReady ? "" : " (DOM not ready)")), this)
        }
        return n.delegation ? (e(document).off("submit.form-plugin", this.selector, t).off("click.form-plugin", this.selector, r).on("submit.form-plugin", this.selector, n, t).on("click.form-plugin", this.selector, n, r), this) : this.ajaxFormUnbind().bind("submit.form-plugin", n, t).bind("click.form-plugin", n, r)
    }, e.fn.ajaxFormUnbind = function() {
        return this.unbind("submit.form-plugin click.form-plugin")
    }, e.fn.formToArray = function(t, r) {
        var a = [];
        if (0 === this.length) return a;
        var i, o = this[0],
            s = this.attr("id"),
            u = t ? o.getElementsByTagName("*") : o.elements;
        if (u && !/MSIE [678]/.test(navigator.userAgent) && (u = e(u).get()), s && (i = e(':input[form="' + s + '"]').get(), i.length && (u = (u || []).concat(i))), !u || !u.length) return a;
        var c, l, f, m, d, p, h;
        for (c = 0, p = u.length; p > c; c++)
            if (d = u[c], f = d.name, f && !d.disabled)
                if (t && o.clk && "image" == d.type) o.clk == d && (a.push({
                    name: f,
                    value: e(d).val(),
                    type: d.type
                }), a.push({
                    name: f + ".x",
                    value: o.clk_x
                }, {
                    name: f + ".y",
                    value: o.clk_y
                }));
                else if (m = e.fieldValue(d, !0), m && m.constructor == Array)
            for (r && r.push(d), l = 0, h = m.length; h > l; l++) a.push({
                name: f,
                value: m[l]
            });
        else if (n.fileapi && "file" == d.type) {
            r && r.push(d);
            var v = d.files;
            if (v.length)
                for (l = 0; l < v.length; l++) a.push({
                    name: f,
                    value: v[l],
                    type: d.type
                });
            else a.push({
                name: f,
                value: "",
                type: d.type
            })
        } else null !== m && "undefined" != typeof m && (r && r.push(d), a.push({
            name: f,
            value: m,
            type: d.type,
            required: d.required
        }));
        if (!t && o.clk) {
            var g = e(o.clk),
                x = g[0];
            f = x.name, f && !x.disabled && "image" == x.type && (a.push({
                name: f,
                value: g.val()
            }), a.push({
                name: f + ".x",
                value: o.clk_x
            }, {
                name: f + ".y",
                value: o.clk_y
            }))
        }
        return a
    }, e.fn.formSerialize = function(t) {
        return e.param(this.formToArray(t))
    }, e.fn.fieldSerialize = function(t) {
        var r = [];
        return this.each(function() {
            var a = this.name;
            if (a) {
                var n = e.fieldValue(this, t);
                if (n && n.constructor == Array)
                    for (var i = 0, o = n.length; o > i; i++) r.push({
                        name: a,
                        value: n[i]
                    });
                else null !== n && "undefined" != typeof n && r.push({
                    name: this.name,
                    value: n
                })
            }
        }), e.param(r)
    }, e.fn.fieldValue = function(t) {
        for (var r = [], a = 0, n = this.length; n > a; a++) {
            var i = this[a],
                o = e.fieldValue(i, t);
            null === o || "undefined" == typeof o || o.constructor == Array && !o.length || (o.constructor == Array ? e.merge(r, o) : r.push(o))
        }
        return r
    }, e.fieldValue = function(t, r) {
        var a = t.name,
            n = t.type,
            i = t.tagName.toLowerCase();
        if (void 0 === r && (r = !0), r && (!a || t.disabled || "reset" == n || "button" == n || ("checkbox" == n || "radio" == n) && !t.checked || ("submit" == n || "image" == n) && t.form && t.form.clk != t || "select" == i && -1 == t.selectedIndex)) return null;
        if ("select" == i) {
            var o = t.selectedIndex;
            if (0 > o) return null;
            for (var s = [], u = t.options, c = "select-one" == n, l = c ? o + 1 : u.length, f = c ? o : 0; l > f; f++) {
                var m = u[f];
                if (m.selected) {
                    var d = m.value;
                    if (d || (d = m.attributes && m.attributes.value && !m.attributes.value.specified ? m.text : m.value), c) return d;
                    s.push(d)
                }
            }
            return s
        }
        return e(t).val()
    }, e.fn.clearForm = function(t) {
        return this.each(function() {
            e("input,select,textarea", this).clearFields(t)
        })
    }, e.fn.clearFields = e.fn.clearInputs = function(t) {
        var r = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;
        return this.each(function() {
            var a = this.type,
                n = this.tagName.toLowerCase();
            r.test(a) || "textarea" == n ? this.value = "" : "checkbox" == a || "radio" == a ? this.checked = !1 : "select" == n ? this.selectedIndex = -1 : "file" == a ? /MSIE/.test(navigator.userAgent) ? e(this).replaceWith(e(this).clone(!0)) : e(this).val("") : t && (t === !0 && /hidden/.test(a) || "string" == typeof t && e(this).is(t)) && (this.value = "")
        })
    }, e.fn.resetForm = function() {
        return this.each(function() {
            ("function" == typeof this.reset || "object" == typeof this.reset && !this.reset.nodeType) && this.reset()
        })
    }, e.fn.enable = function(e) {
        return void 0 === e && (e = !0), this.each(function() {
            this.disabled = !e
        })
    }, e.fn.selected = function(t) {
        return void 0 === t && (t = !0), this.each(function() {
            var r = this.type;
            if ("checkbox" == r || "radio" == r) this.checked = t;
            else if ("option" == this.tagName.toLowerCase()) {
                var a = e(this).parent("select");
                t && a[0] && "select-one" == a[0].type && a.find("option").selected(!1), this.selected = t
            }
        })
    }, e.fn.ajaxSubmit.debug = !1
});

/*! Select2 4.0.3 | https://github.com/select2/select2/blob/master/LICENSE.md */
! function(a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : a("object" == typeof exports ? require("jquery") : jQuery)
}(function(a) {
    var b = function() {
            if (a && a.fn && a.fn.select2 && a.fn.select2.amd) var b = a.fn.select2.amd;
            var b;
            return function() {
                if (!b || !b.requirejs) {
                    b ? c = b : b = {};
                    var a, c, d;
                    ! function(b) {
                        function e(a, b) {
                            return u.call(a, b)
                        }

                        function f(a, b) {
                            var c, d, e, f, g, h, i, j, k, l, m, n = b && b.split("/"),
                                o = s.map,
                                p = o && o["*"] || {};
                            if (a && "." === a.charAt(0))
                                if (b) {
                                    for (a = a.split("/"), g = a.length - 1, s.nodeIdCompat && w.test(a[g]) && (a[g] = a[g].replace(w, "")), a = n.slice(0, n.length - 1).concat(a), k = 0; k < a.length; k += 1)
                                        if (m = a[k], "." === m) a.splice(k, 1), k -= 1;
                                        else if (".." === m) {
                                        if (1 === k && (".." === a[2] || ".." === a[0])) break;
                                        k > 0 && (a.splice(k - 1, 2), k -= 2)
                                    }
                                    a = a.join("/")
                                } else 0 === a.indexOf("./") && (a = a.substring(2));
                            if ((n || p) && o) {
                                for (c = a.split("/"), k = c.length; k > 0; k -= 1) {
                                    if (d = c.slice(0, k).join("/"), n)
                                        for (l = n.length; l > 0; l -= 1)
                                            if (e = o[n.slice(0, l).join("/")], e && (e = e[d])) {
                                                f = e, h = k;
                                                break
                                            }
                                    if (f) break;
                                    !i && p && p[d] && (i = p[d], j = k)
                                }!f && i && (f = i, h = j), f && (c.splice(0, h, f), a = c.join("/"))
                            }
                            return a
                        }

                        function g(a, c) {
                            return function() {
                                var d = v.call(arguments, 0);
                                return "string" != typeof d[0] && 1 === d.length && d.push(null), n.apply(b, d.concat([a, c]))
                            }
                        }

                        function h(a) {
                            return function(b) {
                                return f(b, a)
                            }
                        }

                        function i(a) {
                            return function(b) {
                                q[a] = b
                            }
                        }

                        function j(a) {
                            if (e(r, a)) {
                                var c = r[a];
                                delete r[a], t[a] = !0, m.apply(b, c)
                            }
                            if (!e(q, a) && !e(t, a)) throw new Error("No " + a);
                            return q[a]
                        }

                        function k(a) {
                            var b, c = a ? a.indexOf("!") : -1;
                            return c > -1 && (b = a.substring(0, c), a = a.substring(c + 1, a.length)), [b, a]
                        }

                        function l(a) {
                            return function() {
                                return s && s.config && s.config[a] || {}
                            }
                        }
                        var m, n, o, p, q = {},
                            r = {},
                            s = {},
                            t = {},
                            u = Object.prototype.hasOwnProperty,
                            v = [].slice,
                            w = /\.js$/;
                        o = function(a, b) {
                            var c, d = k(a),
                                e = d[0];
                            return a = d[1], e && (e = f(e, b), c = j(e)), e ? a = c && c.normalize ? c.normalize(a, h(b)) : f(a, b) : (a = f(a, b), d = k(a), e = d[0], a = d[1], e && (c = j(e))), {
                                f: e ? e + "!" + a : a,
                                n: a,
                                pr: e,
                                p: c
                            }
                        }, p = {
                            require: function(a) {
                                return g(a)
                            },
                            exports: function(a) {
                                var b = q[a];
                                return "undefined" != typeof b ? b : q[a] = {}
                            },
                            module: function(a) {
                                return {
                                    id: a,
                                    uri: "",
                                    exports: q[a],
                                    config: l(a)
                                }
                            }
                        }, m = function(a, c, d, f) {
                            var h, k, l, m, n, s, u = [],
                                v = typeof d;
                            if (f = f || a, "undefined" === v || "function" === v) {
                                for (c = !c.length && d.length ? ["require", "exports", "module"] : c, n = 0; n < c.length; n += 1)
                                    if (m = o(c[n], f), k = m.f, "require" === k) u[n] = p.require(a);
                                    else if ("exports" === k) u[n] = p.exports(a), s = !0;
                                else if ("module" === k) h = u[n] = p.module(a);
                                else if (e(q, k) || e(r, k) || e(t, k)) u[n] = j(k);
                                else {
                                    if (!m.p) throw new Error(a + " missing " + k);
                                    m.p.load(m.n, g(f, !0), i(k), {}), u[n] = q[k]
                                }
                                l = d ? d.apply(q[a], u) : void 0, a && (h && h.exports !== b && h.exports !== q[a] ? q[a] = h.exports : l === b && s || (q[a] = l))
                            } else a && (q[a] = d)
                        }, a = c = n = function(a, c, d, e, f) {
                            if ("string" == typeof a) return p[a] ? p[a](c) : j(o(a, c).f);
                            if (!a.splice) {
                                if (s = a, s.deps && n(s.deps, s.callback), !c) return;
                                c.splice ? (a = c, c = d, d = null) : a = b
                            }
                            return c = c || function() {}, "function" == typeof d && (d = e, e = f), e ? m(b, a, c, d) : setTimeout(function() {
                                m(b, a, c, d)
                            }, 4), n
                        }, n.config = function(a) {
                            return n(a)
                        }, a._defined = q, d = function(a, b, c) {
                            if ("string" != typeof a) throw new Error("See almond README: incorrect module build, no module name");
                            b.splice || (c = b, b = []), e(q, a) || e(r, a) || (r[a] = [a, b, c])
                        }, d.amd = {
                            jQuery: !0
                        }
                    }(), b.requirejs = a, b.require = c, b.define = d
                }
            }(), b.define("almond", function() {}), b.define("jquery", [], function() {
                var b = a || $;
                return null == b && console && console.error && console.error("Select2: An instance of jQuery or a jQuery-compatible library was not found. Make sure that you are including jQuery before Select2 on your web page."), b
            }), b.define("select2/utils", ["jquery"], function(a) {
                function b(a) {
                    var b = a.prototype,
                        c = [];
                    for (var d in b) {
                        var e = b[d];
                        "function" == typeof e && "constructor" !== d && c.push(d)
                    }
                    return c
                }
                var c = {};
                c.Extend = function(a, b) {
                    function c() {
                        this.constructor = a
                    }
                    var d = {}.hasOwnProperty;
                    for (var e in b) d.call(b, e) && (a[e] = b[e]);
                    return c.prototype = b.prototype, a.prototype = new c, a.__super__ = b.prototype, a
                }, c.Decorate = function(a, c) {
                    function d() {
                        var b = Array.prototype.unshift,
                            d = c.prototype.constructor.length,
                            e = a.prototype.constructor;
                        d > 0 && (b.call(arguments, a.prototype.constructor), e = c.prototype.constructor), e.apply(this, arguments)
                    }

                    function e() {
                        this.constructor = d
                    }
                    var f = b(c),
                        g = b(a);
                    c.displayName = a.displayName, d.prototype = new e;
                    for (var h = 0; h < g.length; h++) {
                        var i = g[h];
                        d.prototype[i] = a.prototype[i]
                    }
                    for (var j = (function(a) {
                            var b = function() {};
                            a in d.prototype && (b = d.prototype[a]);
                            var e = c.prototype[a];
                            return function() {
                                var a = Array.prototype.unshift;
                                return a.call(arguments, b), e.apply(this, arguments)
                            }
                        }), k = 0; k < f.length; k++) {
                        var l = f[k];
                        d.prototype[l] = j(l)
                    }
                    return d
                };
                var d = function() {
                    this.listeners = {}
                };
                return d.prototype.on = function(a, b) {
                    this.listeners = this.listeners || {}, a in this.listeners ? this.listeners[a].push(b) : this.listeners[a] = [b]
                }, d.prototype.trigger = function(a) {
                    var b = Array.prototype.slice,
                        c = b.call(arguments, 1);
                    this.listeners = this.listeners || {}, null == c && (c = []), 0 === c.length && c.push({}), c[0]._type = a, a in this.listeners && this.invoke(this.listeners[a], b.call(arguments, 1)), "*" in this.listeners && this.invoke(this.listeners["*"], arguments)
                }, d.prototype.invoke = function(a, b) {
                    for (var c = 0, d = a.length; d > c; c++) a[c].apply(this, b)
                }, c.Observable = d, c.generateChars = function(a) {
                    for (var b = "", c = 0; a > c; c++) {
                        var d = Math.floor(36 * Math.random());
                        b += d.toString(36)
                    }
                    return b
                }, c.bind = function(a, b) {
                    return function() {
                        a.apply(b, arguments)
                    }
                }, c._convertData = function(a) {
                    for (var b in a) {
                        var c = b.split("-"),
                            d = a;
                        if (1 !== c.length) {
                            for (var e = 0; e < c.length; e++) {
                                var f = c[e];
                                f = f.substring(0, 1).toLowerCase() + f.substring(1), f in d || (d[f] = {}), e == c.length - 1 && (d[f] = a[b]), d = d[f]
                            }
                            delete a[b]
                        }
                    }
                    return a
                }, c.hasScroll = function(b, c) {
                    var d = a(c),
                        e = c.style.overflowX,
                        f = c.style.overflowY;
                    return e !== f || "hidden" !== f && "visible" !== f ? "scroll" === e || "scroll" === f ? !0 : d.innerHeight() < c.scrollHeight || d.innerWidth() < c.scrollWidth : !1
                }, c.escapeMarkup = function(a) {
                    var b = {
                        "\\": "&#92;",
                        "&": "&amp;",
                        "<": "&lt;",
                        ">": "&gt;",
                        '"': "&quot;",
                        "'": "&#39;",
                        "/": "&#47;"
                    };
                    return "string" != typeof a ? a : String(a).replace(/[&<>"'\/\\]/g, function(a) {
                        return b[a]
                    })
                }, c.appendMany = function(b, c) {
                    if ("1.7" === a.fn.jquery.substr(0, 3)) {
                        var d = a();
                        a.map(c, function(a) {
                            d = d.add(a)
                        }), c = d
                    }
                    b.append(c)
                }, c
            }), b.define("select2/results", ["jquery", "./utils"], function(a, b) {
                function c(a, b, d) {
                    this.$element = a, this.data = d, this.options = b, c.__super__.constructor.call(this)
                }
                return b.Extend(c, b.Observable), c.prototype.render = function() {
                    var b = a('<ul class="select2-results__options" role="tree"></ul>');
                    return this.options.get("multiple") && b.attr("aria-multiselectable", "true"), this.$results = b, b
                }, c.prototype.clear = function() {
                    this.$results.empty()
                }, c.prototype.displayMessage = function(b) {
                    var c = this.options.get("escapeMarkup");
                    this.clear(), this.hideLoading();
                    var d = a('<li role="treeitem" aria-live="assertive" class="select2-results__option"></li>'),
                        e = this.options.get("translations").get(b.message);
                    d.append(c(e(b.args))), d[0].className += " select2-results__message", this.$results.append(d)
                }, c.prototype.hideMessages = function() {
                    this.$results.find(".select2-results__message").remove()
                }, c.prototype.append = function(a) {
                    this.hideLoading();
                    var b = [];
                    if (null == a.results || 0 === a.results.length) return void(0 === this.$results.children().length && this.trigger("results:message", {
                        message: "noResults"
                    }));
                    a.results = this.sort(a.results);
                    for (var c = 0; c < a.results.length; c++) {
                        var d = a.results[c],
                            e = this.option(d);
                        b.push(e)
                    }
                    this.$results.append(b)
                }, c.prototype.position = function(a, b) {
                    var c = b.find(".select2-results");
                    c.append(a)
                }, c.prototype.sort = function(a) {
                    var b = this.options.get("sorter");
                    return b(a)
                }, c.prototype.highlightFirstItem = function() {
                    var a = this.$results.find(".select2-results__option[aria-selected]"),
                        b = a.filter("[aria-selected=true]");
                    b.length > 0 ? b.first().trigger("mouseenter") : a.first().trigger("mouseenter"), this.ensureHighlightVisible()
                }, c.prototype.setClasses = function() {
                    var b = this;
                    this.data.current(function(c) {
                        var d = a.map(c, function(a) {
                                return a.id.toString()
                            }),
                            e = b.$results.find(".select2-results__option[aria-selected]");
                        e.each(function() {
                            var b = a(this),
                                c = a.data(this, "data"),
                                e = "" + c.id;
                            null != c.element && c.element.selected || null == c.element && a.inArray(e, d) > -1 ? b.attr("aria-selected", "true") : b.attr("aria-selected", "false")
                        })
                    })
                }, c.prototype.showLoading = function(a) {
                    this.hideLoading();
                    var b = this.options.get("translations").get("searching"),
                        c = {
                            disabled: !0,
                            loading: !0,
                            text: b(a)
                        },
                        d = this.option(c);
                    d.className += " loading-results", this.$results.prepend(d)
                }, c.prototype.hideLoading = function() {
                    this.$results.find(".loading-results").remove()
                }, c.prototype.option = function(b) {
                    var c = document.createElement("li");
                    c.className = "select2-results__option";
                    var d = {
                        role: "treeitem",
                        "aria-selected": "false"
                    };
                    b.disabled && (delete d["aria-selected"], d["aria-disabled"] = "true"), null == b.id && delete d["aria-selected"], null != b._resultId && (c.id = b._resultId), b.title && (c.title = b.title), b.children && (d.role = "group", d["aria-label"] = b.text, delete d["aria-selected"]);
                    for (var e in d) {
                        var f = d[e];
                        c.setAttribute(e, f)
                    }
                    if (b.children) {
                        var g = a(c),
                            h = document.createElement("strong");
                        h.className = "select2-results__group";
                        a(h);
                        this.template(b, h);
                        for (var i = [], j = 0; j < b.children.length; j++) {
                            var k = b.children[j],
                                l = this.option(k);
                            i.push(l)
                        }
                        var m = a("<ul></ul>", {
                            "class": "select2-results__options select2-results__options--nested"
                        });
                        m.append(i), g.append(h), g.append(m)
                    } else this.template(b, c);
                    return a.data(c, "data", b), c
                }, c.prototype.bind = function(b, c) {
                    var d = this,
                        e = b.id + "-results";
                    this.$results.attr("id", e), b.on("results:all", function(a) {
                        d.clear(), d.append(a.data), b.isOpen() && (d.setClasses(), d.highlightFirstItem())
                    }), b.on("results:append", function(a) {
                        d.append(a.data), b.isOpen() && d.setClasses()
                    }), b.on("query", function(a) {
                        d.hideMessages(), d.showLoading(a)
                    }), b.on("select", function() {
                        b.isOpen() && (d.setClasses(), d.highlightFirstItem())
                    }), b.on("unselect", function() {
                        b.isOpen() && (d.setClasses(), d.highlightFirstItem())
                    }), b.on("open", function() {
                        d.$results.attr("aria-expanded", "true"), d.$results.attr("aria-hidden", "false"), d.setClasses(), d.ensureHighlightVisible()
                    }), b.on("close", function() {
                        d.$results.attr("aria-expanded", "false"), d.$results.attr("aria-hidden", "true"), d.$results.removeAttr("aria-activedescendant")
                    }), b.on("results:toggle", function() {
                        var a = d.getHighlightedResults();
                        0 !== a.length && a.trigger("mouseup")
                    }), b.on("results:select", function() {
                        var a = d.getHighlightedResults();
                        if (0 !== a.length) {
                            var b = a.data("data");
                            "true" == a.attr("aria-selected") ? d.trigger("close", {}) : d.trigger("select", {
                                data: b
                            })
                        }
                    }), b.on("results:previous", function() {
                        var a = d.getHighlightedResults(),
                            b = d.$results.find("[aria-selected]"),
                            c = b.index(a);
                        if (0 !== c) {
                            var e = c - 1;
                            0 === a.length && (e = 0);
                            var f = b.eq(e);
                            f.trigger("mouseenter");
                            var g = d.$results.offset().top,
                                h = f.offset().top,
                                i = d.$results.scrollTop() + (h - g);
                            0 === e ? d.$results.scrollTop(0) : 0 > h - g && d.$results.scrollTop(i)
                        }
                    }), b.on("results:next", function() {
                        var a = d.getHighlightedResults(),
                            b = d.$results.find("[aria-selected]"),
                            c = b.index(a),
                            e = c + 1;
                        if (!(e >= b.length)) {
                            var f = b.eq(e);
                            f.trigger("mouseenter");
                            var g = d.$results.offset().top + d.$results.outerHeight(!1),
                                h = f.offset().top + f.outerHeight(!1),
                                i = d.$results.scrollTop() + h - g;
                            0 === e ? d.$results.scrollTop(0) : h > g && d.$results.scrollTop(i)
                        }
                    }), b.on("results:focus", function(a) {
                        a.element.addClass("select2-results__option--highlighted")
                    }), b.on("results:message", function(a) {
                        d.displayMessage(a)
                    }), a.fn.mousewheel && this.$results.on("mousewheel", function(a) {
                        var b = d.$results.scrollTop(),
                            c = d.$results.get(0).scrollHeight - b + a.deltaY,
                            e = a.deltaY > 0 && b - a.deltaY <= 0,
                            f = a.deltaY < 0 && c <= d.$results.height();
                        e ? (d.$results.scrollTop(0), a.preventDefault(), a.stopPropagation()) : f && (d.$results.scrollTop(d.$results.get(0).scrollHeight - d.$results.height()), a.preventDefault(), a.stopPropagation())
                    }), this.$results.on("mouseup", ".select2-results__option[aria-selected]", function(b) {
                        var c = a(this),
                            e = c.data("data");
                        return "true" === c.attr("aria-selected") ? void(d.options.get("multiple") ? d.trigger("unselect", {
                            originalEvent: b,
                            data: e
                        }) : d.trigger("close", {})) : void d.trigger("select", {
                            originalEvent: b,
                            data: e
                        })
                    }), this.$results.on("mouseenter", ".select2-results__option[aria-selected]", function(b) {
                        var c = a(this).data("data");
                        d.getHighlightedResults().removeClass("select2-results__option--highlighted"), d.trigger("results:focus", {
                            data: c,
                            element: a(this)
                        })
                    })
                }, c.prototype.getHighlightedResults = function() {
                    var a = this.$results.find(".select2-results__option--highlighted");
                    return a
                }, c.prototype.destroy = function() {
                    this.$results.remove()
                }, c.prototype.ensureHighlightVisible = function() {
                    var a = this.getHighlightedResults();
                    if (0 !== a.length) {
                        var b = this.$results.find("[aria-selected]"),
                            c = b.index(a),
                            d = this.$results.offset().top,
                            e = a.offset().top,
                            f = this.$results.scrollTop() + (e - d),
                            g = e - d;
                        f -= 2 * a.outerHeight(!1), 2 >= c ? this.$results.scrollTop(0) : (g > this.$results.outerHeight() || 0 > g) && this.$results.scrollTop(f)
                    }
                }, c.prototype.template = function(b, c) {
                    var d = this.options.get("templateResult"),
                        e = this.options.get("escapeMarkup"),
                        f = d(b, c);
                    null == f ? c.style.display = "none" : "string" == typeof f ? c.innerHTML = e(f) : a(c).append(f)
                }, c
            }), b.define("select2/keys", [], function() {
                var a = {
                    BACKSPACE: 8,
                    TAB: 9,
                    ENTER: 13,
                    SHIFT: 16,
                    CTRL: 17,
                    ALT: 18,
                    ESC: 27,
                    SPACE: 32,
                    PAGE_UP: 33,
                    PAGE_DOWN: 34,
                    END: 35,
                    HOME: 36,
                    LEFT: 37,
                    UP: 38,
                    RIGHT: 39,
                    DOWN: 40,
                    DELETE: 46
                };
                return a
            }), b.define("select2/selection/base", ["jquery", "../utils", "../keys"], function(a, b, c) {
                function d(a, b) {
                    this.$element = a, this.options = b, d.__super__.constructor.call(this)
                }
                return b.Extend(d, b.Observable), d.prototype.render = function() {
                    var b = a('<span class="select2-selection" role="combobox"  aria-haspopup="true" aria-expanded="false"></span>');
                    return this._tabindex = 0, null != this.$element.data("old-tabindex") ? this._tabindex = this.$element.data("old-tabindex") : null != this.$element.attr("tabindex") && (this._tabindex = this.$element.attr("tabindex")), b.attr("title", this.$element.attr("title")), b.attr("tabindex", this._tabindex), this.$selection = b, b
                }, d.prototype.bind = function(a, b) {
                    var d = this,
                        e = (a.id + "-container", a.id + "-results");
                    this.container = a, this.$selection.on("focus", function(a) {
                        d.trigger("focus", a)
                    }), this.$selection.on("blur", function(a) {
                        d._handleBlur(a)
                    }), this.$selection.on("keydown", function(a) {
                        d.trigger("keypress", a), a.which === c.SPACE && a.preventDefault()
                    }), a.on("results:focus", function(a) {
                        d.$selection.attr("aria-activedescendant", a.data._resultId)
                    }), a.on("selection:update", function(a) {
                        d.update(a.data)
                    }), a.on("open", function() {
                        d.$selection.attr("aria-expanded", "true"), d.$selection.attr("aria-owns", e), d._attachCloseHandler(a)
                    }), a.on("close", function() {
                        d.$selection.attr("aria-expanded", "false"), d.$selection.removeAttr("aria-activedescendant"), d.$selection.removeAttr("aria-owns"), d.$selection.focus(), d._detachCloseHandler(a)
                    }), a.on("enable", function() {
                        d.$selection.attr("tabindex", d._tabindex)
                    }), a.on("disable", function() {
                        d.$selection.attr("tabindex", "-1")
                    })
                }, d.prototype._handleBlur = function(b) {
                    var c = this;
                    window.setTimeout(function() {
                        document.activeElement == c.$selection[0] || a.contains(c.$selection[0], document.activeElement) || c.trigger("blur", b)
                    }, 1)
                }, d.prototype._attachCloseHandler = function(b) {
                    a(document.body).on("mousedown.select2." + b.id, function(b) {
                        var c = a(b.target),
                            d = c.closest(".select2"),
                            e = a(".select2.select2-container--open");
                        e.each(function() {
                            var b = a(this);
                            if (this != d[0]) {
                                var c = b.data("element");
                                c.select2("close")
                            }
                        })
                    })
                }, d.prototype._detachCloseHandler = function(b) {
                    a(document.body).off("mousedown.select2." + b.id)
                }, d.prototype.position = function(a, b) {
                    var c = b.find(".selection");
                    c.append(a)
                }, d.prototype.destroy = function() {
                    this._detachCloseHandler(this.container)
                }, d.prototype.update = function(a) {
                    throw new Error("The `update` method must be defined in child classes.")
                }, d
            }), b.define("select2/selection/single", ["jquery", "./base", "../utils", "../keys"], function(a, b, c, d) {
                function e() {
                    e.__super__.constructor.apply(this, arguments)
                }
                return c.Extend(e, b), e.prototype.render = function() {
                    var a = e.__super__.render.call(this);
                    return a.addClass("select2-selection--single"), a.html('<span class="select2-selection__rendered"></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span>'), a
                }, e.prototype.bind = function(a, b) {
                    var c = this;
                    e.__super__.bind.apply(this, arguments);
                    var d = a.id + "-container";
                    this.$selection.find(".select2-selection__rendered").attr("id", d), this.$selection.attr("aria-labelledby", d), this.$selection.on("mousedown", function(a) {
                        1 === a.which && c.trigger("toggle", {
                            originalEvent: a
                        })
                    }), this.$selection.on("focus", function(a) {}), this.$selection.on("blur", function(a) {}), a.on("focus", function(b) {
                        a.isOpen() || c.$selection.focus()
                    }), a.on("selection:update", function(a) {
                        c.update(a.data)
                    })
                }, e.prototype.clear = function() {
                    this.$selection.find(".select2-selection__rendered").empty()
                }, e.prototype.display = function(a, b) {
                    var c = this.options.get("templateSelection"),
                        d = this.options.get("escapeMarkup");
                    return d(c(a, b))
                }, e.prototype.selectionContainer = function() {
                    return a("<span></span>")
                }, e.prototype.update = function(a) {
                    if (0 === a.length) return void this.clear();
                    var b = a[0],
                        c = this.$selection.find(".select2-selection__rendered"),
                        d = this.display(b, c);
                    c.empty().append(d), c.prop("title", b.title || b.text)
                }, e
            }), b.define("select2/selection/multiple", ["jquery", "./base", "../utils"], function(a, b, c) {
                function d(a, b) {
                    d.__super__.constructor.apply(this, arguments)
                }
                return c.Extend(d, b), d.prototype.render = function() {
                    var a = d.__super__.render.call(this);
                    return a.addClass("select2-selection--multiple"), a.html('<ul class="select2-selection__rendered"></ul>'), a
                }, d.prototype.bind = function(b, c) {
                    var e = this;
                    d.__super__.bind.apply(this, arguments), this.$selection.on("click", function(a) {
                        e.trigger("toggle", {
                            originalEvent: a
                        })
                    }), this.$selection.on("click", ".select2-selection__choice__remove", function(b) {
                        if (!e.options.get("disabled")) {
                            var c = a(this),
                                d = c.parent(),
                                f = d.data("data");
                            e.trigger("unselect", {
                                originalEvent: b,
                                data: f
                            })
                        }
                    })
                }, d.prototype.clear = function() {
                    this.$selection.find(".select2-selection__rendered").empty()
                }, d.prototype.display = function(a, b) {
                    var c = this.options.get("templateSelection"),
                        d = this.options.get("escapeMarkup");
                    return d(c(a, b))
                }, d.prototype.selectionContainer = function() {
                    var b = a('<li class="select2-selection__choice"><span class="select2-selection__choice__remove" role="presentation">&times;</span></li>');
                    return b
                }, d.prototype.update = function(a) {
                    if (this.clear(), 0 !== a.length) {
                        for (var b = [], d = 0; d < a.length; d++) {
                            var e = a[d],
                                f = this.selectionContainer(),
                                g = this.display(e, f);
                            f.append(g), f.prop("title", e.title || e.text), f.data("data", e), b.push(f)
                        }
                        var h = this.$selection.find(".select2-selection__rendered");
                        c.appendMany(h, b)
                    }
                }, d
            }), b.define("select2/selection/placeholder", ["../utils"], function(a) {
                function b(a, b, c) {
                    this.placeholder = this.normalizePlaceholder(c.get("placeholder")), a.call(this, b, c)
                }
                return b.prototype.normalizePlaceholder = function(a, b) {
                    return "string" == typeof b && (b = {
                        id: "",
                        text: b
                    }), b
                }, b.prototype.createPlaceholder = function(a, b) {
                    var c = this.selectionContainer();
                    return c.html(this.display(b)), c.addClass("select2-selection__placeholder").removeClass("select2-selection__choice"), c
                }, b.prototype.update = function(a, b) {
                    var c = 1 == b.length && b[0].id != this.placeholder.id,
                        d = b.length > 1;
                    if (d || c) return a.call(this, b);
                    this.clear();
                    var e = this.createPlaceholder(this.placeholder);
                    this.$selection.find(".select2-selection__rendered").append(e)
                }, b
            }), b.define("select2/selection/allowClear", ["jquery", "../keys"], function(a, b) {
                function c() {}
                return c.prototype.bind = function(a, b, c) {
                    var d = this;
                    a.call(this, b, c), null == this.placeholder && this.options.get("debug") && window.console && console.error && console.error("Select2: The `allowClear` option should be used in combination with the `placeholder` option."), this.$selection.on("mousedown", ".select2-selection__clear", function(a) {
                        d._handleClear(a)
                    }), b.on("keypress", function(a) {
                        d._handleKeyboardClear(a, b)
                    })
                }, c.prototype._handleClear = function(a, b) {
                    if (!this.options.get("disabled")) {
                        var c = this.$selection.find(".select2-selection__clear");
                        if (0 !== c.length) {
                            b.stopPropagation();
                            for (var d = c.data("data"), e = 0; e < d.length; e++) {
                                var f = {
                                    data: d[e]
                                };
                                if (this.trigger("unselect", f), f.prevented) return
                            }
                            this.$element.val(this.placeholder.id).trigger("change"), this.trigger("toggle", {})
                        }
                    }
                }, c.prototype._handleKeyboardClear = function(a, c, d) {
                    d.isOpen() || (c.which == b.DELETE || c.which == b.BACKSPACE) && this._handleClear(c)
                }, c.prototype.update = function(b, c) {
                    if (b.call(this, c), !(this.$selection.find(".select2-selection__placeholder").length > 0 || 0 === c.length)) {
                        var d = a('<span class="select2-selection__clear">&times;</span>');
                        d.data("data", c), this.$selection.find(".select2-selection__rendered").prepend(d)
                    }
                }, c
            }), b.define("select2/selection/search", ["jquery", "../utils", "../keys"], function(a, b, c) {
                function d(a, b, c) {
                    a.call(this, b, c)
                }
                return d.prototype.render = function(b) {
                    var c = a('<li class="select2-search select2-search--inline"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" aria-autocomplete="list" /></li>');
                    this.$searchContainer = c, this.$search = c.find("input");
                    var d = b.call(this);
                    return this._transferTabIndex(), d
                }, d.prototype.bind = function(a, b, d) {
                    var e = this;
                    a.call(this, b, d), b.on("open", function() {
                        e.$search.trigger("focus")
                    }), b.on("close", function() {
                        e.$search.val(""), e.$search.removeAttr("aria-activedescendant"), e.$search.trigger("focus")
                    }), b.on("enable", function() {
                        e.$search.prop("disabled", !1), e._transferTabIndex()
                    }), b.on("disable", function() {
                        e.$search.prop("disabled", !0)
                    }), b.on("focus", function(a) {
                        e.$search.trigger("focus")
                    }), b.on("results:focus", function(a) {
                        e.$search.attr("aria-activedescendant", a.id)
                    }), this.$selection.on("focusin", ".select2-search--inline", function(a) {
                        e.trigger("focus", a)
                    }), this.$selection.on("focusout", ".select2-search--inline", function(a) {
                        e._handleBlur(a)
                    }), this.$selection.on("keydown", ".select2-search--inline", function(a) {
                        a.stopPropagation(), e.trigger("keypress", a), e._keyUpPrevented = a.isDefaultPrevented();
                        var b = a.which;
                        if (b === c.BACKSPACE && "" === e.$search.val()) {
                            var d = e.$searchContainer.prev(".select2-selection__choice");
                            if (d.length > 0) {
                                var f = d.data("data");
                                e.searchRemoveChoice(f), a.preventDefault()
                            }
                        }
                    });
                    var f = document.documentMode,
                        g = f && 11 >= f;
                    this.$selection.on("input.searchcheck", ".select2-search--inline", function(a) {
                        return g ? void e.$selection.off("input.search input.searchcheck") : void e.$selection.off("keyup.search")
                    }), this.$selection.on("keyup.search input.search", ".select2-search--inline", function(a) {
                        if (g && "input" === a.type) return void e.$selection.off("input.search input.searchcheck");
                        var b = a.which;
                        b != c.SHIFT && b != c.CTRL && b != c.ALT && b != c.TAB && e.handleSearch(a)
                    })
                }, d.prototype._transferTabIndex = function(a) {
                    this.$search.attr("tabindex", this.$selection.attr("tabindex")), this.$selection.attr("tabindex", "-1")
                }, d.prototype.createPlaceholder = function(a, b) {
                    this.$search.attr("placeholder", b.text)
                }, d.prototype.update = function(a, b) {
                    var c = this.$search[0] == document.activeElement;
                    this.$search.attr("placeholder", ""), a.call(this, b), this.$selection.find(".select2-selection__rendered").append(this.$searchContainer), this.resizeSearch(), c && this.$search.focus()
                }, d.prototype.handleSearch = function() {
                    if (this.resizeSearch(), !this._keyUpPrevented) {
                        var a = this.$search.val();
                        this.trigger("query", {
                            term: a
                        })
                    }
                    this._keyUpPrevented = !1
                }, d.prototype.searchRemoveChoice = function(a, b) {
                    this.trigger("unselect", {
                        data: b
                    }), this.$search.val(b.text), this.handleSearch()
                }, d.prototype.resizeSearch = function() {
                    this.$search.css("width", "25px");
                    var a = "";
                    if ("" !== this.$search.attr("placeholder")) a = this.$selection.find(".select2-selection__rendered").innerWidth();
                    else {
                        var b = this.$search.val().length + 1;
                        a = .75 * b + "em"
                    }
                    this.$search.css("width", a)
                }, d
            }), b.define("select2/selection/eventRelay", ["jquery"], function(a) {
                function b() {}
                return b.prototype.bind = function(b, c, d) {
                    var e = this,
                        f = ["open", "opening", "close", "closing", "select", "selecting", "unselect", "unselecting"],
                        g = ["opening", "closing", "selecting", "unselecting"];
                    b.call(this, c, d), c.on("*", function(b, c) {
                        if (-1 !== a.inArray(b, f)) {
                            c = c || {};
                            var d = a.Event("select2:" + b, {
                                params: c
                            });
                            e.$element.trigger(d), -1 !== a.inArray(b, g) && (c.prevented = d.isDefaultPrevented())
                        }
                    })
                }, b
            }), b.define("select2/translation", ["jquery", "require"], function(a, b) {
                function c(a) {
                    this.dict = a || {}
                }
                return c.prototype.all = function() {
                    return this.dict
                }, c.prototype.get = function(a) {
                    return this.dict[a]
                }, c.prototype.extend = function(b) {
                    this.dict = a.extend({}, b.all(), this.dict)
                }, c._cache = {}, c.loadPath = function(a) {
                    if (!(a in c._cache)) {
                        var d = b(a);
                        c._cache[a] = d
                    }
                    return new c(c._cache[a])
                }, c
            }), b.define("select2/diacritics", [], function() {
                var a = {
                    "Ⓐ": "A",
                    "Ａ": "A",
                    "À": "A",
                    "Á": "A",
                    "Â": "A",
                    "Ầ": "A",
                    "Ấ": "A",
                    "Ẫ": "A",
                    "Ẩ": "A",
                    "Ã": "A",
                    "Ā": "A",
                    "Ă": "A",
                    "Ằ": "A",
                    "Ắ": "A",
                    "Ẵ": "A",
                    "Ẳ": "A",
                    "Ȧ": "A",
                    "Ǡ": "A",
                    "Ä": "A",
                    "Ǟ": "A",
                    "Ả": "A",
                    "Å": "A",
                    "Ǻ": "A",
                    "Ǎ": "A",
                    "Ȁ": "A",
                    "Ȃ": "A",
                    "Ạ": "A",
                    "Ậ": "A",
                    "Ặ": "A",
                    "Ḁ": "A",
                    "Ą": "A",
                    "Ⱥ": "A",
                    "Ɐ": "A",
                    "Ꜳ": "AA",
                    "Æ": "AE",
                    "Ǽ": "AE",
                    "Ǣ": "AE",
                    "Ꜵ": "AO",
                    "Ꜷ": "AU",
                    "Ꜹ": "AV",
                    "Ꜻ": "AV",
                    "Ꜽ": "AY",
                    "Ⓑ": "B",
                    "Ｂ": "B",
                    "Ḃ": "B",
                    "Ḅ": "B",
                    "Ḇ": "B",
                    "Ƀ": "B",
                    "Ƃ": "B",
                    "Ɓ": "B",
                    "Ⓒ": "C",
                    "Ｃ": "C",
                    "Ć": "C",
                    "Ĉ": "C",
                    "Ċ": "C",
                    "Č": "C",
                    "Ç": "C",
                    "Ḉ": "C",
                    "Ƈ": "C",
                    "Ȼ": "C",
                    "Ꜿ": "C",
                    "Ⓓ": "D",
                    "Ｄ": "D",
                    "Ḋ": "D",
                    "Ď": "D",
                    "Ḍ": "D",
                    "Ḑ": "D",
                    "Ḓ": "D",
                    "Ḏ": "D",
                    "Đ": "D",
                    "Ƌ": "D",
                    "Ɗ": "D",
                    "Ɖ": "D",
                    "Ꝺ": "D",
                    "Ǳ": "DZ",
                    "Ǆ": "DZ",
                    "ǲ": "Dz",
                    "ǅ": "Dz",
                    "Ⓔ": "E",
                    "Ｅ": "E",
                    "È": "E",
                    "É": "E",
                    "Ê": "E",
                    "Ề": "E",
                    "Ế": "E",
                    "Ễ": "E",
                    "Ể": "E",
                    "Ẽ": "E",
                    "Ē": "E",
                    "Ḕ": "E",
                    "Ḗ": "E",
                    "Ĕ": "E",
                    "Ė": "E",
                    "Ë": "E",
                    "Ẻ": "E",
                    "Ě": "E",
                    "Ȅ": "E",
                    "Ȇ": "E",
                    "Ẹ": "E",
                    "Ệ": "E",
                    "Ȩ": "E",
                    "Ḝ": "E",
                    "Ę": "E",
                    "Ḙ": "E",
                    "Ḛ": "E",
                    "Ɛ": "E",
                    "Ǝ": "E",
                    "Ⓕ": "F",
                    "Ｆ": "F",
                    "Ḟ": "F",
                    "Ƒ": "F",
                    "Ꝼ": "F",
                    "Ⓖ": "G",
                    "Ｇ": "G",
                    "Ǵ": "G",
                    "Ĝ": "G",
                    "Ḡ": "G",
                    "Ğ": "G",
                    "Ġ": "G",
                    "Ǧ": "G",
                    "Ģ": "G",
                    "Ǥ": "G",
                    "Ɠ": "G",
                    "Ꞡ": "G",
                    "Ᵹ": "G",
                    "Ꝿ": "G",
                    "Ⓗ": "H",
                    "Ｈ": "H",
                    "Ĥ": "H",
                    "Ḣ": "H",
                    "Ḧ": "H",
                    "Ȟ": "H",
                    "Ḥ": "H",
                    "Ḩ": "H",
                    "Ḫ": "H",
                    "Ħ": "H",
                    "Ⱨ": "H",
                    "Ⱶ": "H",
                    "Ɥ": "H",
                    "Ⓘ": "I",
                    "Ｉ": "I",
                    "Ì": "I",
                    "Í": "I",
                    "Î": "I",
                    "Ĩ": "I",
                    "Ī": "I",
                    "Ĭ": "I",
                    "İ": "I",
                    "Ï": "I",
                    "Ḯ": "I",
                    "Ỉ": "I",
                    "Ǐ": "I",
                    "Ȉ": "I",
                    "Ȋ": "I",
                    "Ị": "I",
                    "Į": "I",
                    "Ḭ": "I",
                    "Ɨ": "I",
                    "Ⓙ": "J",
                    "Ｊ": "J",
                    "Ĵ": "J",
                    "Ɉ": "J",
                    "Ⓚ": "K",
                    "Ｋ": "K",
                    "Ḱ": "K",
                    "Ǩ": "K",
                    "Ḳ": "K",
                    "Ķ": "K",
                    "Ḵ": "K",
                    "Ƙ": "K",
                    "Ⱪ": "K",
                    "Ꝁ": "K",
                    "Ꝃ": "K",
                    "Ꝅ": "K",
                    "Ꞣ": "K",
                    "Ⓛ": "L",
                    "Ｌ": "L",
                    "Ŀ": "L",
                    "Ĺ": "L",
                    "Ľ": "L",
                    "Ḷ": "L",
                    "Ḹ": "L",
                    "Ļ": "L",
                    "Ḽ": "L",
                    "Ḻ": "L",
                    "Ł": "L",
                    "Ƚ": "L",
                    "Ɫ": "L",
                    "Ⱡ": "L",
                    "Ꝉ": "L",
                    "Ꝇ": "L",
                    "Ꞁ": "L",
                    "Ǉ": "LJ",
                    "ǈ": "Lj",
                    "Ⓜ": "M",
                    "Ｍ": "M",
                    "Ḿ": "M",
                    "Ṁ": "M",
                    "Ṃ": "M",
                    "Ɱ": "M",
                    "Ɯ": "M",
                    "Ⓝ": "N",
                    "Ｎ": "N",
                    "Ǹ": "N",
                    "Ń": "N",
                    "Ñ": "N",
                    "Ṅ": "N",
                    "Ň": "N",
                    "Ṇ": "N",
                    "Ņ": "N",
                    "Ṋ": "N",
                    "Ṉ": "N",
                    "Ƞ": "N",
                    "Ɲ": "N",
                    "Ꞑ": "N",
                    "Ꞥ": "N",
                    "Ǌ": "NJ",
                    "ǋ": "Nj",
                    "Ⓞ": "O",
                    "Ｏ": "O",
                    "Ò": "O",
                    "Ó": "O",
                    "Ô": "O",
                    "Ồ": "O",
                    "Ố": "O",
                    "Ỗ": "O",
                    "Ổ": "O",
                    "Õ": "O",
                    "Ṍ": "O",
                    "Ȭ": "O",
                    "Ṏ": "O",
                    "Ō": "O",
                    "Ṑ": "O",
                    "Ṓ": "O",
                    "Ŏ": "O",
                    "Ȯ": "O",
                    "Ȱ": "O",
                    "Ö": "O",
                    "Ȫ": "O",
                    "Ỏ": "O",
                    "Ő": "O",
                    "Ǒ": "O",
                    "Ȍ": "O",
                    "Ȏ": "O",
                    "Ơ": "O",
                    "Ờ": "O",
                    "Ớ": "O",
                    "Ỡ": "O",
                    "Ở": "O",
                    "Ợ": "O",
                    "Ọ": "O",
                    "Ộ": "O",
                    "Ǫ": "O",
                    "Ǭ": "O",
                    "Ø": "O",
                    "Ǿ": "O",
                    "Ɔ": "O",
                    "Ɵ": "O",
                    "Ꝋ": "O",
                    "Ꝍ": "O",
                    "Ƣ": "OI",
                    "Ꝏ": "OO",
                    "Ȣ": "OU",
                    "Ⓟ": "P",
                    "Ｐ": "P",
                    "Ṕ": "P",
                    "Ṗ": "P",
                    "Ƥ": "P",
                    "Ᵽ": "P",
                    "Ꝑ": "P",
                    "Ꝓ": "P",
                    "Ꝕ": "P",
                    "Ⓠ": "Q",
                    "Ｑ": "Q",
                    "Ꝗ": "Q",
                    "Ꝙ": "Q",
                    "Ɋ": "Q",
                    "Ⓡ": "R",
                    "Ｒ": "R",
                    "Ŕ": "R",
                    "Ṙ": "R",
                    "Ř": "R",
                    "Ȑ": "R",
                    "Ȓ": "R",
                    "Ṛ": "R",
                    "Ṝ": "R",
                    "Ŗ": "R",
                    "Ṟ": "R",
                    "Ɍ": "R",
                    "Ɽ": "R",
                    "Ꝛ": "R",
                    "Ꞧ": "R",
                    "Ꞃ": "R",
                    "Ⓢ": "S",
                    "Ｓ": "S",
                    "ẞ": "S",
                    "Ś": "S",
                    "Ṥ": "S",
                    "Ŝ": "S",
                    "Ṡ": "S",
                    "Š": "S",
                    "Ṧ": "S",
                    "Ṣ": "S",
                    "Ṩ": "S",
                    "Ș": "S",
                    "Ş": "S",
                    "Ȿ": "S",
                    "Ꞩ": "S",
                    "Ꞅ": "S",
                    "Ⓣ": "T",
                    "Ｔ": "T",
                    "Ṫ": "T",
                    "Ť": "T",
                    "Ṭ": "T",
                    "Ț": "T",
                    "Ţ": "T",
                    "Ṱ": "T",
                    "Ṯ": "T",
                    "Ŧ": "T",
                    "Ƭ": "T",
                    "Ʈ": "T",
                    "Ⱦ": "T",
                    "Ꞇ": "T",
                    "Ꜩ": "TZ",
                    "Ⓤ": "U",
                    "Ｕ": "U",
                    "Ù": "U",
                    "Ú": "U",
                    "Û": "U",
                    "Ũ": "U",
                    "Ṹ": "U",
                    "Ū": "U",
                    "Ṻ": "U",
                    "Ŭ": "U",
                    "Ü": "U",
                    "Ǜ": "U",
                    "Ǘ": "U",
                    "Ǖ": "U",
                    "Ǚ": "U",
                    "Ủ": "U",
                    "Ů": "U",
                    "Ű": "U",
                    "Ǔ": "U",
                    "Ȕ": "U",
                    "Ȗ": "U",
                    "Ư": "U",
                    "Ừ": "U",
                    "Ứ": "U",
                    "Ữ": "U",
                    "Ử": "U",
                    "Ự": "U",
                    "Ụ": "U",
                    "Ṳ": "U",
                    "Ų": "U",
                    "Ṷ": "U",
                    "Ṵ": "U",
                    "Ʉ": "U",
                    "Ⓥ": "V",
                    "Ｖ": "V",
                    "Ṽ": "V",
                    "Ṿ": "V",
                    "Ʋ": "V",
                    "Ꝟ": "V",
                    "Ʌ": "V",
                    "Ꝡ": "VY",
                    "Ⓦ": "W",
                    "Ｗ": "W",
                    "Ẁ": "W",
                    "Ẃ": "W",
                    "Ŵ": "W",
                    "Ẇ": "W",
                    "Ẅ": "W",
                    "Ẉ": "W",
                    "Ⱳ": "W",
                    "Ⓧ": "X",
                    "Ｘ": "X",
                    "Ẋ": "X",
                    "Ẍ": "X",
                    "Ⓨ": "Y",
                    "Ｙ": "Y",
                    "Ỳ": "Y",
                    "Ý": "Y",
                    "Ŷ": "Y",
                    "Ỹ": "Y",
                    "Ȳ": "Y",
                    "Ẏ": "Y",
                    "Ÿ": "Y",
                    "Ỷ": "Y",
                    "Ỵ": "Y",
                    "Ƴ": "Y",
                    "Ɏ": "Y",
                    "Ỿ": "Y",
                    "Ⓩ": "Z",
                    "Ｚ": "Z",
                    "Ź": "Z",
                    "Ẑ": "Z",
                    "Ż": "Z",
                    "Ž": "Z",
                    "Ẓ": "Z",
                    "Ẕ": "Z",
                    "Ƶ": "Z",
                    "Ȥ": "Z",
                    "Ɀ": "Z",
                    "Ⱬ": "Z",
                    "Ꝣ": "Z",
                    "ⓐ": "a",
                    "ａ": "a",
                    "ẚ": "a",
                    "à": "a",
                    "á": "a",
                    "â": "a",
                    "ầ": "a",
                    "ấ": "a",
                    "ẫ": "a",
                    "ẩ": "a",
                    "ã": "a",
                    "ā": "a",
                    "ă": "a",
                    "ằ": "a",
                    "ắ": "a",
                    "ẵ": "a",
                    "ẳ": "a",
                    "ȧ": "a",
                    "ǡ": "a",
                    "ä": "a",
                    "ǟ": "a",
                    "ả": "a",
                    "å": "a",
                    "ǻ": "a",
                    "ǎ": "a",
                    "ȁ": "a",
                    "ȃ": "a",
                    "ạ": "a",
                    "ậ": "a",
                    "ặ": "a",
                    "ḁ": "a",
                    "ą": "a",
                    "ⱥ": "a",
                    "ɐ": "a",
                    "ꜳ": "aa",
                    "æ": "ae",
                    "ǽ": "ae",
                    "ǣ": "ae",
                    "ꜵ": "ao",
                    "ꜷ": "au",
                    "ꜹ": "av",
                    "ꜻ": "av",
                    "ꜽ": "ay",
                    "ⓑ": "b",
                    "ｂ": "b",
                    "ḃ": "b",
                    "ḅ": "b",
                    "ḇ": "b",
                    "ƀ": "b",
                    "ƃ": "b",
                    "ɓ": "b",
                    "ⓒ": "c",
                    "ｃ": "c",
                    "ć": "c",
                    "ĉ": "c",
                    "ċ": "c",
                    "č": "c",
                    "ç": "c",
                    "ḉ": "c",
                    "ƈ": "c",
                    "ȼ": "c",
                    "ꜿ": "c",
                    "ↄ": "c",
                    "ⓓ": "d",
                    "ｄ": "d",
                    "ḋ": "d",
                    "ď": "d",
                    "ḍ": "d",
                    "ḑ": "d",
                    "ḓ": "d",
                    "ḏ": "d",
                    "đ": "d",
                    "ƌ": "d",
                    "ɖ": "d",
                    "ɗ": "d",
                    "ꝺ": "d",
                    "ǳ": "dz",
                    "ǆ": "dz",
                    "ⓔ": "e",
                    "ｅ": "e",
                    "è": "e",
                    "é": "e",
                    "ê": "e",
                    "ề": "e",
                    "ế": "e",
                    "ễ": "e",
                    "ể": "e",
                    "ẽ": "e",
                    "ē": "e",
                    "ḕ": "e",
                    "ḗ": "e",
                    "ĕ": "e",
                    "ė": "e",
                    "ë": "e",
                    "ẻ": "e",
                    "ě": "e",
                    "ȅ": "e",
                    "ȇ": "e",
                    "ẹ": "e",
                    "ệ": "e",
                    "ȩ": "e",
                    "ḝ": "e",
                    "ę": "e",
                    "ḙ": "e",
                    "ḛ": "e",
                    "ɇ": "e",
                    "ɛ": "e",
                    "ǝ": "e",
                    "ⓕ": "f",
                    "ｆ": "f",
                    "ḟ": "f",
                    "ƒ": "f",
                    "ꝼ": "f",
                    "ⓖ": "g",
                    "ｇ": "g",
                    "ǵ": "g",
                    "ĝ": "g",
                    "ḡ": "g",
                    "ğ": "g",
                    "ġ": "g",
                    "ǧ": "g",
                    "ģ": "g",
                    "ǥ": "g",
                    "ɠ": "g",
                    "ꞡ": "g",
                    "ᵹ": "g",
                    "ꝿ": "g",
                    "ⓗ": "h",
                    "ｈ": "h",
                    "ĥ": "h",
                    "ḣ": "h",
                    "ḧ": "h",
                    "ȟ": "h",
                    "ḥ": "h",
                    "ḩ": "h",
                    "ḫ": "h",
                    "ẖ": "h",
                    "ħ": "h",
                    "ⱨ": "h",
                    "ⱶ": "h",
                    "ɥ": "h",
                    "ƕ": "hv",
                    "ⓘ": "i",
                    "ｉ": "i",
                    "ì": "i",
                    "í": "i",
                    "î": "i",
                    "ĩ": "i",
                    "ī": "i",
                    "ĭ": "i",
                    "ï": "i",
                    "ḯ": "i",
                    "ỉ": "i",
                    "ǐ": "i",
                    "ȉ": "i",
                    "ȋ": "i",
                    "ị": "i",
                    "į": "i",
                    "ḭ": "i",
                    "ɨ": "i",
                    "ı": "i",
                    "ⓙ": "j",
                    "ｊ": "j",
                    "ĵ": "j",
                    "ǰ": "j",
                    "ɉ": "j",
                    "ⓚ": "k",
                    "ｋ": "k",
                    "ḱ": "k",
                    "ǩ": "k",
                    "ḳ": "k",
                    "ķ": "k",
                    "ḵ": "k",
                    "ƙ": "k",
                    "ⱪ": "k",
                    "ꝁ": "k",
                    "ꝃ": "k",
                    "ꝅ": "k",
                    "ꞣ": "k",
                    "ⓛ": "l",
                    "ｌ": "l",
                    "ŀ": "l",
                    "ĺ": "l",
                    "ľ": "l",
                    "ḷ": "l",
                    "ḹ": "l",
                    "ļ": "l",
                    "ḽ": "l",
                    "ḻ": "l",
                    "ſ": "l",
                    "ł": "l",
                    "ƚ": "l",
                    "ɫ": "l",
                    "ⱡ": "l",
                    "ꝉ": "l",
                    "ꞁ": "l",
                    "ꝇ": "l",
                    "ǉ": "lj",
                    "ⓜ": "m",
                    "ｍ": "m",
                    "ḿ": "m",
                    "ṁ": "m",
                    "ṃ": "m",
                    "ɱ": "m",
                    "ɯ": "m",
                    "ⓝ": "n",
                    "ｎ": "n",
                    "ǹ": "n",
                    "ń": "n",
                    "ñ": "n",
                    "ṅ": "n",
                    "ň": "n",
                    "ṇ": "n",
                    "ņ": "n",
                    "ṋ": "n",
                    "ṉ": "n",
                    "ƞ": "n",
                    "ɲ": "n",
                    "ŉ": "n",
                    "ꞑ": "n",
                    "ꞥ": "n",
                    "ǌ": "nj",
                    "ⓞ": "o",
                    "ｏ": "o",
                    "ò": "o",
                    "ó": "o",
                    "ô": "o",
                    "ồ": "o",
                    "ố": "o",
                    "ỗ": "o",
                    "ổ": "o",
                    "õ": "o",
                    "ṍ": "o",
                    "ȭ": "o",
                    "ṏ": "o",
                    "ō": "o",
                    "ṑ": "o",
                    "ṓ": "o",
                    "ŏ": "o",
                    "ȯ": "o",
                    "ȱ": "o",
                    "ö": "o",
                    "ȫ": "o",
                    "ỏ": "o",
                    "ő": "o",
                    "ǒ": "o",
                    "ȍ": "o",
                    "ȏ": "o",
                    "ơ": "o",
                    "ờ": "o",
                    "ớ": "o",
                    "ỡ": "o",
                    "ở": "o",
                    "ợ": "o",
                    "ọ": "o",
                    "ộ": "o",
                    "ǫ": "o",
                    "ǭ": "o",
                    "ø": "o",
                    "ǿ": "o",
                    "ɔ": "o",
                    "ꝋ": "o",
                    "ꝍ": "o",
                    "ɵ": "o",
                    "ƣ": "oi",
                    "ȣ": "ou",
                    "ꝏ": "oo",
                    "ⓟ": "p",
                    "ｐ": "p",
                    "ṕ": "p",
                    "ṗ": "p",
                    "ƥ": "p",
                    "ᵽ": "p",
                    "ꝑ": "p",
                    "ꝓ": "p",
                    "ꝕ": "p",
                    "ⓠ": "q",
                    "ｑ": "q",
                    "ɋ": "q",
                    "ꝗ": "q",
                    "ꝙ": "q",
                    "ⓡ": "r",
                    "ｒ": "r",
                    "ŕ": "r",
                    "ṙ": "r",
                    "ř": "r",
                    "ȑ": "r",
                    "ȓ": "r",
                    "ṛ": "r",
                    "ṝ": "r",
                    "ŗ": "r",
                    "ṟ": "r",
                    "ɍ": "r",
                    "ɽ": "r",
                    "ꝛ": "r",
                    "ꞧ": "r",
                    "ꞃ": "r",
                    "ⓢ": "s",
                    "ｓ": "s",
                    "ß": "s",
                    "ś": "s",
                    "ṥ": "s",
                    "ŝ": "s",
                    "ṡ": "s",
                    "š": "s",
                    "ṧ": "s",
                    "ṣ": "s",
                    "ṩ": "s",
                    "ș": "s",
                    "ş": "s",
                    "ȿ": "s",
                    "ꞩ": "s",
                    "ꞅ": "s",
                    "ẛ": "s",
                    "ⓣ": "t",
                    "ｔ": "t",
                    "ṫ": "t",
                    "ẗ": "t",
                    "ť": "t",
                    "ṭ": "t",
                    "ț": "t",
                    "ţ": "t",
                    "ṱ": "t",
                    "ṯ": "t",
                    "ŧ": "t",
                    "ƭ": "t",
                    "ʈ": "t",
                    "ⱦ": "t",
                    "ꞇ": "t",
                    "ꜩ": "tz",
                    "ⓤ": "u",
                    "ｕ": "u",
                    "ù": "u",
                    "ú": "u",
                    "û": "u",
                    "ũ": "u",
                    "ṹ": "u",
                    "ū": "u",
                    "ṻ": "u",
                    "ŭ": "u",
                    "ü": "u",
                    "ǜ": "u",
                    "ǘ": "u",
                    "ǖ": "u",
                    "ǚ": "u",
                    "ủ": "u",
                    "ů": "u",
                    "ű": "u",
                    "ǔ": "u",
                    "ȕ": "u",
                    "ȗ": "u",
                    "ư": "u",
                    "ừ": "u",
                    "ứ": "u",
                    "ữ": "u",
                    "ử": "u",
                    "ự": "u",
                    "ụ": "u",
                    "ṳ": "u",
                    "ų": "u",
                    "ṷ": "u",
                    "ṵ": "u",
                    "ʉ": "u",
                    "ⓥ": "v",
                    "ｖ": "v",
                    "ṽ": "v",
                    "ṿ": "v",
                    "ʋ": "v",
                    "ꝟ": "v",
                    "ʌ": "v",
                    "ꝡ": "vy",
                    "ⓦ": "w",
                    "ｗ": "w",
                    "ẁ": "w",
                    "ẃ": "w",
                    "ŵ": "w",
                    "ẇ": "w",
                    "ẅ": "w",
                    "ẘ": "w",
                    "ẉ": "w",
                    "ⱳ": "w",
                    "ⓧ": "x",
                    "ｘ": "x",
                    "ẋ": "x",
                    "ẍ": "x",
                    "ⓨ": "y",
                    "ｙ": "y",
                    "ỳ": "y",
                    "ý": "y",
                    "ŷ": "y",
                    "ỹ": "y",
                    "ȳ": "y",
                    "ẏ": "y",
                    "ÿ": "y",
                    "ỷ": "y",
                    "ẙ": "y",
                    "ỵ": "y",
                    "ƴ": "y",
                    "ɏ": "y",
                    "ỿ": "y",
                    "ⓩ": "z",
                    "ｚ": "z",
                    "ź": "z",
                    "ẑ": "z",
                    "ż": "z",
                    "ž": "z",
                    "ẓ": "z",
                    "ẕ": "z",
                    "ƶ": "z",
                    "ȥ": "z",
                    "ɀ": "z",
                    "ⱬ": "z",
                    "ꝣ": "z",
                    "Ά": "Α",
                    "Έ": "Ε",
                    "Ή": "Η",
                    "Ί": "Ι",
                    "Ϊ": "Ι",
                    "Ό": "Ο",
                    "Ύ": "Υ",
                    "Ϋ": "Υ",
                    "Ώ": "Ω",
                    "ά": "α",
                    "έ": "ε",
                    "ή": "η",
                    "ί": "ι",
                    "ϊ": "ι",
                    "ΐ": "ι",
                    "ό": "ο",
                    "ύ": "υ",
                    "ϋ": "υ",
                    "ΰ": "υ",
                    "ω": "ω",
                    "ς": "σ"
                };
                return a
            }), b.define("select2/data/base", ["../utils"], function(a) {
                function b(a, c) {
                    b.__super__.constructor.call(this)
                }
                return a.Extend(b, a.Observable), b.prototype.current = function(a) {
                    throw new Error("The `current` method must be defined in child classes.")
                }, b.prototype.query = function(a, b) {
                    throw new Error("The `query` method must be defined in child classes.")
                }, b.prototype.bind = function(a, b) {}, b.prototype.destroy = function() {}, b.prototype.generateResultId = function(b, c) {
                    var d = b.id + "-result-";
                    return d += a.generateChars(4), d += null != c.id ? "-" + c.id.toString() : "-" + a.generateChars(4)
                }, b
            }), b.define("select2/data/select", ["./base", "../utils", "jquery"], function(a, b, c) {
                function d(a, b) {
                    this.$element = a, this.options = b, d.__super__.constructor.call(this)
                }
                return b.Extend(d, a), d.prototype.current = function(a) {
                    var b = [],
                        d = this;
                    this.$element.find(":selected").each(function() {
                        var a = c(this),
                            e = d.item(a);
                        b.push(e)
                    }), a(b)
                }, d.prototype.select = function(a) {
                    var b = this;
                    if (a.selected = !0, c(a.element).is("option")) return a.element.selected = !0, void this.$element.trigger("change");
                    if (this.$element.prop("multiple")) this.current(function(d) {
                        var e = [];
                        a = [a], a.push.apply(a, d);
                        for (var f = 0; f < a.length; f++) {
                            var g = a[f].id; - 1 === c.inArray(g, e) && e.push(g)
                        }
                        b.$element.val(e), b.$element.trigger("change")
                    });
                    else {
                        var d = a.id;
                        this.$element.val(d), this.$element.trigger("change")
                    }
                }, d.prototype.unselect = function(a) {
                    var b = this;
                    if (this.$element.prop("multiple")) return a.selected = !1, c(a.element).is("option") ? (a.element.selected = !1, void this.$element.trigger("change")) : void this.current(function(d) {
                        for (var e = [], f = 0; f < d.length; f++) {
                            var g = d[f].id;
                            g !== a.id && -1 === c.inArray(g, e) && e.push(g)
                        }
                        b.$element.val(e), b.$element.trigger("change")
                    })
                }, d.prototype.bind = function(a, b) {
                    var c = this;
                    this.container = a, a.on("select", function(a) {
                        c.select(a.data)
                    }), a.on("unselect", function(a) {
                        c.unselect(a.data)
                    })
                }, d.prototype.destroy = function() {
                    this.$element.find("*").each(function() {
                        c.removeData(this, "data")
                    })
                }, d.prototype.query = function(a, b) {
                    var d = [],
                        e = this,
                        f = this.$element.children();
                    f.each(function() {
                        var b = c(this);
                        if (b.is("option") || b.is("optgroup")) {
                            var f = e.item(b),
                                g = e.matches(a, f);
                            null !== g && d.push(g)
                        }
                    }), b({
                        results: d
                    })
                }, d.prototype.addOptions = function(a) {
                    b.appendMany(this.$element, a)
                }, d.prototype.option = function(a) {
                    var b;
                    a.children ? (b = document.createElement("optgroup"), b.label = a.text) : (b = document.createElement("option"), void 0 !== b.textContent ? b.textContent = a.text : b.innerText = a.text), a.id && (b.value = a.id), a.disabled && (b.disabled = !0), a.selected && (b.selected = !0), a.title && (b.title = a.title);
                    var d = c(b),
                        e = this._normalizeItem(a);
                    return e.element = b, c.data(b, "data", e), d
                }, d.prototype.item = function(a) {
                    var b = {};
                    if (b = c.data(a[0], "data"), null != b) return b;
                    if (a.is("option")) b = {
                        id: a.val(),
                        text: a.text(),
                        disabled: a.prop("disabled"),
                        selected: a.prop("selected"),
                        title: a.prop("title")
                    };
                    else if (a.is("optgroup")) {
                        b = {
                            text: a.prop("label"),
                            children: [],
                            title: a.prop("title")
                        };
                        for (var d = a.children("option"), e = [], f = 0; f < d.length; f++) {
                            var g = c(d[f]),
                                h = this.item(g);
                            e.push(h)
                        }
                        b.children = e
                    }
                    return b = this._normalizeItem(b), b.element = a[0], c.data(a[0], "data", b), b
                }, d.prototype._normalizeItem = function(a) {
                    c.isPlainObject(a) || (a = {
                        id: a,
                        text: a
                    }), a = c.extend({}, {
                        text: ""
                    }, a);
                    var b = {
                        selected: !1,
                        disabled: !1
                    };
                    return null != a.id && (a.id = a.id.toString()), null != a.text && (a.text = a.text.toString()), null == a._resultId && a.id && null != this.container && (a._resultId = this.generateResultId(this.container, a)), c.extend({}, b, a)
                }, d.prototype.matches = function(a, b) {
                    var c = this.options.get("matcher");
                    return c(a, b)
                }, d
            }), b.define("select2/data/array", ["./select", "../utils", "jquery"], function(a, b, c) {
                function d(a, b) {
                    var c = b.get("data") || [];
                    d.__super__.constructor.call(this, a, b), this.addOptions(this.convertToOptions(c))
                }
                return b.Extend(d, a), d.prototype.select = function(a) {
                    var b = this.$element.find("option").filter(function(b, c) {
                        return c.value == a.id.toString()
                    });
                    0 === b.length && (b = this.option(a), this.addOptions(b)), d.__super__.select.call(this, a)
                }, d.prototype.convertToOptions = function(a) {
                    function d(a) {
                        return function() {
                            return c(this).val() == a.id
                        }
                    }
                    for (var e = this, f = this.$element.find("option"), g = f.map(function() {
                            return e.item(c(this)).id
                        }).get(), h = [], i = 0; i < a.length; i++) {
                        var j = this._normalizeItem(a[i]);
                        if (c.inArray(j.id, g) >= 0) {
                            var k = f.filter(d(j)),
                                l = this.item(k),
                                m = c.extend(!0, {}, j, l),
                                n = this.option(m);
                            k.replaceWith(n)
                        } else {
                            var o = this.option(j);
                            if (j.children) {
                                var p = this.convertToOptions(j.children);
                                b.appendMany(o, p)
                            }
                            h.push(o)
                        }
                    }
                    return h
                }, d
            }), b.define("select2/data/ajax", ["./array", "../utils", "jquery"], function(a, b, c) {
                function d(a, b) {
                    this.ajaxOptions = this._applyDefaults(b.get("ajax")), null != this.ajaxOptions.processResults && (this.processResults = this.ajaxOptions.processResults), d.__super__.constructor.call(this, a, b)
                }
                return b.Extend(d, a), d.prototype._applyDefaults = function(a) {
                    var b = {
                        data: function(a) {
                            return c.extend({}, a, {
                                q: a.term
                            })
                        },
                        transport: function(a, b, d) {
                            var e = c.ajax(a);
                            return e.then(b), e.fail(d), e
                        }
                    };
                    return c.extend({}, b, a, !0)
                }, d.prototype.processResults = function(a) {
                    return a
                }, d.prototype.query = function(a, b) {
                    function d() {
                        var d = f.transport(f, function(d) {
                            var f = e.processResults(d, a);
                            e.options.get("debug") && window.console && console.error && (f && f.results && c.isArray(f.results) || console.error("Select2: The AJAX results did not return an array in the `results` key of the response.")), b(f)
                        }, function() {
                            d.status && "0" === d.status || e.trigger("results:message", {
                                message: "errorLoading"
                            })
                        });
                        e._request = d
                    }
                    var e = this;
                    null != this._request && (c.isFunction(this._request.abort) && this._request.abort(), this._request = null);
                    var f = c.extend({
                        type: "GET"
                    }, this.ajaxOptions);
                    "function" == typeof f.url && (f.url = f.url.call(this.$element, a)), "function" == typeof f.data && (f.data = f.data.call(this.$element, a)), this.ajaxOptions.delay && null != a.term ? (this._queryTimeout && window.clearTimeout(this._queryTimeout), this._queryTimeout = window.setTimeout(d, this.ajaxOptions.delay)) : d()
                }, d
            }), b.define("select2/data/tags", ["jquery"], function(a) {
                function b(b, c, d) {
                    var e = d.get("tags"),
                        f = d.get("createTag");
                    void 0 !== f && (this.createTag = f);
                    var g = d.get("insertTag");
                    if (void 0 !== g && (this.insertTag = g), b.call(this, c, d), a.isArray(e))
                        for (var h = 0; h < e.length; h++) {
                            var i = e[h],
                                j = this._normalizeItem(i),
                                k = this.option(j);
                            this.$element.append(k)
                        }
                }
                return b.prototype.query = function(a, b, c) {
                    function d(a, f) {
                        for (var g = a.results, h = 0; h < g.length; h++) {
                            var i = g[h],
                                j = null != i.children && !d({
                                    results: i.children
                                }, !0),
                                k = i.text === b.term;
                            if (k || j) return f ? !1 : (a.data = g, void c(a))
                        }
                        if (f) return !0;
                        var l = e.createTag(b);
                        if (null != l) {
                            var m = e.option(l);
                            m.attr("data-select2-tag", !0), e.addOptions([m]), e.insertTag(g, l)
                        }
                        a.results = g, c(a)
                    }
                    var e = this;
                    return this._removeOldTags(), null == b.term || null != b.page ? void a.call(this, b, c) : void a.call(this, b, d)
                }, b.prototype.createTag = function(b, c) {
                    var d = a.trim(c.term);
                    return "" === d ? null : {
                        id: d,
                        text: d
                    }
                }, b.prototype.insertTag = function(a, b, c) {
                    b.unshift(c)
                }, b.prototype._removeOldTags = function(b) {
                    var c = (this._lastTag, this.$element.find("option[data-select2-tag]"));
                    c.each(function() {
                        this.selected || a(this).remove()
                    })
                }, b
            }), b.define("select2/data/tokenizer", ["jquery"], function(a) {
                function b(a, b, c) {
                    var d = c.get("tokenizer");
                    void 0 !== d && (this.tokenizer = d), a.call(this, b, c)
                }
                return b.prototype.bind = function(a, b, c) {
                    a.call(this, b, c), this.$search = b.dropdown.$search || b.selection.$search || c.find(".select2-search__field")
                }, b.prototype.query = function(b, c, d) {
                    function e(b) {
                        var c = g._normalizeItem(b),
                            d = g.$element.find("option").filter(function() {
                                return a(this).val() === c.id
                            });
                        if (!d.length) {
                            var e = g.option(c);
                            e.attr("data-select2-tag", !0), g._removeOldTags(), g.addOptions([e])
                        }
                        f(c)
                    }

                    function f(a) {
                        g.trigger("select", {
                            data: a
                        })
                    }
                    var g = this;
                    c.term = c.term || "";
                    var h = this.tokenizer(c, this.options, e);
                    h.term !== c.term && (this.$search.length && (this.$search.val(h.term), this.$search.focus()), c.term = h.term), b.call(this, c, d)
                }, b.prototype.tokenizer = function(b, c, d, e) {
                    for (var f = d.get("tokenSeparators") || [], g = c.term, h = 0, i = this.createTag || function(a) {
                            return {
                                id: a.term,
                                text: a.term
                            }
                        }; h < g.length;) {
                        var j = g[h];
                        if (-1 !== a.inArray(j, f)) {
                            var k = g.substr(0, h),
                                l = a.extend({}, c, {
                                    term: k
                                }),
                                m = i(l);
                            null != m ? (e(m), g = g.substr(h + 1) || "", h = 0) : h++
                        } else h++
                    }
                    return {
                        term: g
                    }
                }, b
            }), b.define("select2/data/minimumInputLength", [], function() {
                function a(a, b, c) {
                    this.minimumInputLength = c.get("minimumInputLength"), a.call(this, b, c)
                }
                return a.prototype.query = function(a, b, c) {
                    return b.term = b.term || "", b.term.length < this.minimumInputLength ? void this.trigger("results:message", {
                        message: "inputTooShort",
                        args: {
                            minimum: this.minimumInputLength,
                            input: b.term,
                            params: b
                        }
                    }) : void a.call(this, b, c)
                }, a
            }), b.define("select2/data/maximumInputLength", [], function() {
                function a(a, b, c) {
                    this.maximumInputLength = c.get("maximumInputLength"), a.call(this, b, c)
                }
                return a.prototype.query = function(a, b, c) {
                    return b.term = b.term || "", this.maximumInputLength > 0 && b.term.length > this.maximumInputLength ? void this.trigger("results:message", {
                        message: "inputTooLong",
                        args: {
                            maximum: this.maximumInputLength,
                            input: b.term,
                            params: b
                        }
                    }) : void a.call(this, b, c)
                }, a
            }), b.define("select2/data/maximumSelectionLength", [], function() {
                function a(a, b, c) {
                    this.maximumSelectionLength = c.get("maximumSelectionLength"), a.call(this, b, c)
                }
                return a.prototype.query = function(a, b, c) {
                    var d = this;
                    this.current(function(e) {
                        var f = null != e ? e.length : 0;
                        return d.maximumSelectionLength > 0 && f >= d.maximumSelectionLength ? void d.trigger("results:message", {
                            message: "maximumSelected",
                            args: {
                                maximum: d.maximumSelectionLength
                            }
                        }) : void a.call(d, b, c)
                    })
                }, a
            }), b.define("select2/dropdown", ["jquery", "./utils"], function(a, b) {
                function c(a, b) {
                    this.$element = a, this.options = b, c.__super__.constructor.call(this)
                }
                return b.Extend(c, b.Observable), c.prototype.render = function() {
                    var b = a('<span class="select2-dropdown"><span class="select2-results"></span></span>');
                    return b.attr("dir", this.options.get("dir")), this.$dropdown = b, b
                }, c.prototype.bind = function() {}, c.prototype.position = function(a, b) {}, c.prototype.destroy = function() {
                    this.$dropdown.remove()
                }, c
            }), b.define("select2/dropdown/search", ["jquery", "../utils"], function(a, b) {
                function c() {}
                return c.prototype.render = function(b) {
                    var c = b.call(this),
                        d = a('<span class="select2-search select2-search--dropdown"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" /></span>');
                    return this.$searchContainer = d, this.$search = d.find("input"), c.prepend(d), c
                }, c.prototype.bind = function(b, c, d) {
                    var e = this;
                    b.call(this, c, d), this.$search.on("keydown", function(a) {
                        e.trigger("keypress", a), e._keyUpPrevented = a.isDefaultPrevented()
                    }), this.$search.on("input", function(b) {
                        a(this).off("keyup")
                    }), this.$search.on("keyup input", function(a) {
                        e.handleSearch(a)
                    }), c.on("open", function() {
                        e.$search.attr("tabindex", 0), e.$search.focus(), window.setTimeout(function() {
                            e.$search.focus()
                        }, 0)
                    }), c.on("close", function() {
                        e.$search.attr("tabindex", -1), e.$search.val("")
                    }), c.on("focus", function() {
                        c.isOpen() && e.$search.focus()
                    }), c.on("results:all", function(a) {
                        if (null == a.query.term || "" === a.query.term) {
                            var b = e.showSearch(a);
                            b ? e.$searchContainer.removeClass("select2-search--hide") : e.$searchContainer.addClass("select2-search--hide")
                        }
                    })
                }, c.prototype.handleSearch = function(a) {
                    if (!this._keyUpPrevented) {
                        var b = this.$search.val();
                        this.trigger("query", {
                            term: b
                        })
                    }
                    this._keyUpPrevented = !1
                }, c.prototype.showSearch = function(a, b) {
                    return !0
                }, c
            }), b.define("select2/dropdown/hidePlaceholder", [], function() {
                function a(a, b, c, d) {
                    this.placeholder = this.normalizePlaceholder(c.get("placeholder")), a.call(this, b, c, d)
                }
                return a.prototype.append = function(a, b) {
                    b.results = this.removePlaceholder(b.results), a.call(this, b)
                }, a.prototype.normalizePlaceholder = function(a, b) {
                    return "string" == typeof b && (b = {
                        id: "",
                        text: b
                    }), b
                }, a.prototype.removePlaceholder = function(a, b) {
                    for (var c = b.slice(0), d = b.length - 1; d >= 0; d--) {
                        var e = b[d];
                        this.placeholder.id === e.id && c.splice(d, 1)
                    }
                    return c
                }, a
            }), b.define("select2/dropdown/infiniteScroll", ["jquery"], function(a) {
                function b(a, b, c, d) {
                    this.lastParams = {}, a.call(this, b, c, d), this.$loadingMore = this.createLoadingMore(), this.loading = !1
                }
                return b.prototype.append = function(a, b) {
                    this.$loadingMore.remove(), this.loading = !1, a.call(this, b), this.showLoadingMore(b) && this.$results.append(this.$loadingMore)
                }, b.prototype.bind = function(b, c, d) {
                    var e = this;
                    b.call(this, c, d), c.on("query", function(a) {
                        e.lastParams = a, e.loading = !0
                    }), c.on("query:append", function(a) {
                        e.lastParams = a, e.loading = !0
                    }), this.$results.on("scroll", function() {
                        var b = a.contains(document.documentElement, e.$loadingMore[0]);
                        if (!e.loading && b) {
                            var c = e.$results.offset().top + e.$results.outerHeight(!1),
                                d = e.$loadingMore.offset().top + e.$loadingMore.outerHeight(!1);
                            c + 50 >= d && e.loadMore()
                        }
                    })
                }, b.prototype.loadMore = function() {
                    this.loading = !0;
                    var b = a.extend({}, {
                        page: 1
                    }, this.lastParams);
                    b.page++, this.trigger("query:append", b)
                }, b.prototype.showLoadingMore = function(a, b) {
                    return b.pagination && b.pagination.more
                }, b.prototype.createLoadingMore = function() {
                    var b = a('<li class="select2-results__option select2-results__option--load-more"role="treeitem" aria-disabled="true"></li>'),
                        c = this.options.get("translations").get("loadingMore");
                    return b.html(c(this.lastParams)), b
                }, b
            }), b.define("select2/dropdown/attachBody", ["jquery", "../utils"], function(a, b) {
                function c(b, c, d) {
                    this.$dropdownParent = d.get("dropdownParent") || a(document.body), b.call(this, c, d)
                }
                return c.prototype.bind = function(a, b, c) {
                    var d = this,
                        e = !1;
                    a.call(this, b, c), b.on("open", function() {
                        d._showDropdown(), d._attachPositioningHandler(b), e || (e = !0, b.on("results:all", function() {
                            d._positionDropdown(), d._resizeDropdown()
                        }), b.on("results:append", function() {
                            d._positionDropdown(), d._resizeDropdown()
                        }))
                    }), b.on("close", function() {
                        d._hideDropdown(), d._detachPositioningHandler(b)
                    }), this.$dropdownContainer.on("mousedown", function(a) {
                        a.stopPropagation()
                    })
                }, c.prototype.destroy = function(a) {
                    a.call(this), this.$dropdownContainer.remove()
                }, c.prototype.position = function(a, b, c) {
                    b.attr("class", c.attr("class")), b.removeClass("select2"), b.addClass("select2-container--open"), b.css({
                        position: "absolute",
                        top: -999999
                    }), this.$container = c
                }, c.prototype.render = function(b) {
                    var c = a("<span></span>"),
                        d = b.call(this);
                    return c.append(d), this.$dropdownContainer = c, c
                }, c.prototype._hideDropdown = function(a) {
                    this.$dropdownContainer.detach()
                }, c.prototype._attachPositioningHandler = function(c, d) {
                    var e = this,
                        f = "scroll.select2." + d.id,
                        g = "resize.select2." + d.id,
                        h = "orientationchange.select2." + d.id,
                        i = this.$container.parents().filter(b.hasScroll);
                    i.each(function() {
                        a(this).data("select2-scroll-position", {
                            x: a(this).scrollLeft(),
                            y: a(this).scrollTop()
                        })
                    }), i.on(f, function(b) {
                        var c = a(this).data("select2-scroll-position");
                        a(this).scrollTop(c.y)
                    }), a(window).on(f + " " + g + " " + h, function(a) {
                        e._positionDropdown(), e._resizeDropdown()
                    })
                }, c.prototype._detachPositioningHandler = function(c, d) {
                    var e = "scroll.select2." + d.id,
                        f = "resize.select2." + d.id,
                        g = "orientationchange.select2." + d.id,
                        h = this.$container.parents().filter(b.hasScroll);
                    h.off(e), a(window).off(e + " " + f + " " + g)
                }, c.prototype._positionDropdown = function() {
                    var b = a(window),
                        c = this.$dropdown.hasClass("select2-dropdown--above"),
                        d = this.$dropdown.hasClass("select2-dropdown--below"),
                        e = null,
                        f = this.$container.offset();
                    f.bottom = f.top + this.$container.outerHeight(!1);
                    var g = {
                        height: this.$container.outerHeight(!1)
                    };
                    g.top = f.top, g.bottom = f.top + g.height;
                    var h = {
                            height: this.$dropdown.outerHeight(!1)
                        },
                        i = {
                            top: b.scrollTop(),
                            bottom: b.scrollTop() + b.height()
                        },
                        j = i.top < f.top - h.height,
                        k = i.bottom > f.bottom + h.height,
                        l = {
                            left: f.left,
                            top: g.bottom
                        },
                        m = this.$dropdownParent;
                    "static" === m.css("position") && (m = m.offsetParent());
                    var n = m.offset();
                    l.top -= n.top, l.left -= n.left, c || d || (e = "below"), k || !j || c ? !j && k && c && (e = "below") : e = "above", ("above" == e || c && "below" !== e) && (l.top = g.top - n.top - h.height), null != e && (this.$dropdown.removeClass("select2-dropdown--below select2-dropdown--above").addClass("select2-dropdown--" + e), this.$container.removeClass("select2-container--below select2-container--above").addClass("select2-container--" + e)), this.$dropdownContainer.css(l)
                }, c.prototype._resizeDropdown = function() {
                    var a = {
                        width: this.$container.outerWidth(!1) + "px"
                    };
                    this.options.get("dropdownAutoWidth") && (a.minWidth = a.width, a.position = "relative", a.width = "auto"), this.$dropdown.css(a)
                }, c.prototype._showDropdown = function(a) {
                    this.$dropdownContainer.appendTo(this.$dropdownParent), this._positionDropdown(), this._resizeDropdown()
                }, c
            }), b.define("select2/dropdown/minimumResultsForSearch", [], function() {
                function a(b) {
                    for (var c = 0, d = 0; d < b.length; d++) {
                        var e = b[d];
                        e.children ? c += a(e.children) : c++
                    }
                    return c
                }

                function b(a, b, c, d) {
                    this.minimumResultsForSearch = c.get("minimumResultsForSearch"), this.minimumResultsForSearch < 0 && (this.minimumResultsForSearch = 1 / 0), a.call(this, b, c, d)
                }
                return b.prototype.showSearch = function(b, c) {
                    return a(c.data.results) < this.minimumResultsForSearch ? !1 : b.call(this, c)
                }, b
            }), b.define("select2/dropdown/selectOnClose", [], function() {
                function a() {}
                return a.prototype.bind = function(a, b, c) {
                    var d = this;
                    a.call(this, b, c), b.on("close", function(a) {
                        d._handleSelectOnClose(a)
                    })
                }, a.prototype._handleSelectOnClose = function(a, b) {
                    if (b && null != b.originalSelect2Event) {
                        var c = b.originalSelect2Event;
                        if ("select" === c._type || "unselect" === c._type) return
                    }
                    var d = this.getHighlightedResults();
                    if (!(d.length < 1)) {
                        var e = d.data("data");
                        null != e.element && e.element.selected || null == e.element && e.selected || this.trigger("select", {
                            data: e
                        })
                    }
                }, a
            }), b.define("select2/dropdown/closeOnSelect", [], function() {
                function a() {}
                return a.prototype.bind = function(a, b, c) {
                    var d = this;
                    a.call(this, b, c), b.on("select", function(a) {
                        d._selectTriggered(a)
                    }), b.on("unselect", function(a) {
                        d._selectTriggered(a)
                    })
                }, a.prototype._selectTriggered = function(a, b) {
                    var c = b.originalEvent;
                    c && c.ctrlKey || this.trigger("close", {
                        originalEvent: c,
                        originalSelect2Event: b
                    })
                }, a
            }), b.define("select2/i18n/en", [], function() {
                return {
                    errorLoading: function() {
                        return "The results could not be loaded."
                    },
                    inputTooLong: function(a) {
                        var b = a.input.length - a.maximum,
                            c = "Please delete " + b + " character";
                        return 1 != b && (c += "s"), c
                    },
                    inputTooShort: function(a) {
                        var b = a.minimum - a.input.length,
                            c = "Please enter " + b + " or more characters";
                        return c
                    },
                    loadingMore: function() {
                        return "Loading more results…"
                    },
                    maximumSelected: function(a) {
                        var b = "You can only select " + a.maximum + " item";
                        return 1 != a.maximum && (b += "s"), b
                    },
                    noResults: function() {
                        return "No results found"
                    },
                    searching: function() {
                        return "Searching…"
                    }
                }
            }), b.define("select2/defaults", ["jquery", "require", "./results", "./selection/single", "./selection/multiple", "./selection/placeholder", "./selection/allowClear", "./selection/search", "./selection/eventRelay", "./utils", "./translation", "./diacritics", "./data/select", "./data/array", "./data/ajax", "./data/tags", "./data/tokenizer", "./data/minimumInputLength", "./data/maximumInputLength", "./data/maximumSelectionLength", "./dropdown", "./dropdown/search", "./dropdown/hidePlaceholder", "./dropdown/infiniteScroll", "./dropdown/attachBody", "./dropdown/minimumResultsForSearch", "./dropdown/selectOnClose", "./dropdown/closeOnSelect", "./i18n/en"], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C) {
                function D() {
                    this.reset()
                }
                D.prototype.apply = function(l) {
                    if (l = a.extend(!0, {}, this.defaults, l), null == l.dataAdapter) {
                        if (null != l.ajax ? l.dataAdapter = o : null != l.data ? l.dataAdapter = n : l.dataAdapter = m, l.minimumInputLength > 0 && (l.dataAdapter = j.Decorate(l.dataAdapter, r)), l.maximumInputLength > 0 && (l.dataAdapter = j.Decorate(l.dataAdapter, s)), l.maximumSelectionLength > 0 && (l.dataAdapter = j.Decorate(l.dataAdapter, t)), l.tags && (l.dataAdapter = j.Decorate(l.dataAdapter, p)), (null != l.tokenSeparators || null != l.tokenizer) && (l.dataAdapter = j.Decorate(l.dataAdapter, q)), null != l.query) {
                            var C = b(l.amdBase + "compat/query");
                            l.dataAdapter = j.Decorate(l.dataAdapter, C)
                        }
                        if (null != l.initSelection) {
                            var D = b(l.amdBase + "compat/initSelection");
                            l.dataAdapter = j.Decorate(l.dataAdapter, D)
                        }
                    }
                    if (null == l.resultsAdapter && (l.resultsAdapter = c, null != l.ajax && (l.resultsAdapter = j.Decorate(l.resultsAdapter, x)), null != l.placeholder && (l.resultsAdapter = j.Decorate(l.resultsAdapter, w)), l.selectOnClose && (l.resultsAdapter = j.Decorate(l.resultsAdapter, A))), null == l.dropdownAdapter) {
                        if (l.multiple) l.dropdownAdapter = u;
                        else {
                            var E = j.Decorate(u, v);
                            l.dropdownAdapter = E
                        }
                        if (0 !== l.minimumResultsForSearch && (l.dropdownAdapter = j.Decorate(l.dropdownAdapter, z)), l.closeOnSelect && (l.dropdownAdapter = j.Decorate(l.dropdownAdapter, B)), null != l.dropdownCssClass || null != l.dropdownCss || null != l.adaptDropdownCssClass) {
                            var F = b(l.amdBase + "compat/dropdownCss");
                            l.dropdownAdapter = j.Decorate(l.dropdownAdapter, F)
                        }
                        l.dropdownAdapter = j.Decorate(l.dropdownAdapter, y)
                    }
                    if (null == l.selectionAdapter) {
                        if (l.multiple ? l.selectionAdapter = e : l.selectionAdapter = d, null != l.placeholder && (l.selectionAdapter = j.Decorate(l.selectionAdapter, f)), l.allowClear && (l.selectionAdapter = j.Decorate(l.selectionAdapter, g)), l.multiple && (l.selectionAdapter = j.Decorate(l.selectionAdapter, h)), null != l.containerCssClass || null != l.containerCss || null != l.adaptContainerCssClass) {
                            var G = b(l.amdBase + "compat/containerCss");
                            l.selectionAdapter = j.Decorate(l.selectionAdapter, G)
                        }
                        l.selectionAdapter = j.Decorate(l.selectionAdapter, i)
                    }
                    if ("string" == typeof l.language)
                        if (l.language.indexOf("-") > 0) {
                            var H = l.language.split("-"),
                                I = H[0];
                            l.language = [l.language, I]
                        } else l.language = [l.language];
                    if (a.isArray(l.language)) {
                        var J = new k;
                        l.language.push("en");
                        for (var K = l.language, L = 0; L < K.length; L++) {
                            var M = K[L],
                                N = {};
                            try {
                                N = k.loadPath(M)
                            } catch (O) {
                                try {
                                    M = this.defaults.amdLanguageBase + M, N = k.loadPath(M)
                                } catch (P) {
                                    l.debug && window.console && console.warn && console.warn('Select2: The language file for "' + M + '" could not be automatically loaded. A fallback will be used instead.');
                                    continue
                                }
                            }
                            J.extend(N)
                        }
                        l.translations = J
                    } else {
                        var Q = k.loadPath(this.defaults.amdLanguageBase + "en"),
                            R = new k(l.language);
                        R.extend(Q), l.translations = R
                    }
                    return l
                }, D.prototype.reset = function() {
                    function b(a) {
                        function b(a) {
                            return l[a] || a
                        }
                        return a.replace(/[^\u0000-\u007E]/g, b)
                    }

                    function c(d, e) {
                        if ("" === a.trim(d.term)) return e;
                        if (e.children && e.children.length > 0) {
                            for (var f = a.extend(!0, {}, e), g = e.children.length - 1; g >= 0; g--) {
                                var h = e.children[g],
                                    i = c(d, h);
                                null == i && f.children.splice(g, 1)
                            }
                            return f.children.length > 0 ? f : c(d, f)
                        }
                        var j = b(e.text).toUpperCase(),
                            k = b(d.term).toUpperCase();
                        return j.indexOf(k) > -1 ? e : null
                    }
                    this.defaults = {
                        amdBase: "./",
                        amdLanguageBase: "./i18n/",
                        closeOnSelect: !0,
                        debug: !1,
                        dropdownAutoWidth: !1,
                        escapeMarkup: j.escapeMarkup,
                        language: C,
                        matcher: c,
                        minimumInputLength: 0,
                        maximumInputLength: 0,
                        maximumSelectionLength: 0,
                        minimumResultsForSearch: 0,
                        selectOnClose: !1,
                        sorter: function(a) {
                            return a
                        },
                        templateResult: function(a) {
                            return a.text
                        },
                        templateSelection: function(a) {
                            return a.text
                        },
                        theme: "default",
                        width: "resolve"
                    }
                }, D.prototype.set = function(b, c) {
                    var d = a.camelCase(b),
                        e = {};
                    e[d] = c;
                    var f = j._convertData(e);
                    a.extend(this.defaults, f)
                };
                var E = new D;
                return E
            }), b.define("select2/options", ["require", "jquery", "./defaults", "./utils"], function(a, b, c, d) {
                function e(b, e) {
                    if (this.options = b, null != e && this.fromElement(e), this.options = c.apply(this.options), e && e.is("input")) {
                        var f = a(this.get("amdBase") + "compat/inputData");
                        this.options.dataAdapter = d.Decorate(this.options.dataAdapter, f)
                    }
                }
                return e.prototype.fromElement = function(a) {
                    var c = ["select2"];
                    null == this.options.multiple && (this.options.multiple = a.prop("multiple")), null == this.options.disabled && (this.options.disabled = a.prop("disabled")), null == this.options.language && (a.prop("lang") ? this.options.language = a.prop("lang").toLowerCase() : a.closest("[lang]").prop("lang") && (this.options.language = a.closest("[lang]").prop("lang"))), null == this.options.dir && (a.prop("dir") ? this.options.dir = a.prop("dir") : a.closest("[dir]").prop("dir") ? this.options.dir = a.closest("[dir]").prop("dir") : this.options.dir = "ltr"), a.prop("disabled", this.options.disabled), a.prop("multiple", this.options.multiple), a.data("select2Tags") && (this.options.debug && window.console && console.warn && console.warn('Select2: The `data-select2-tags` attribute has been changed to use the `data-data` and `data-tags="true"` attributes and will be removed in future versions of Select2.'), a.data("data", a.data("select2Tags")), a.data("tags", !0)), a.data("ajaxUrl") && (this.options.debug && window.console && console.warn && console.warn("Select2: The `data-ajax-url` attribute has been changed to `data-ajax--url` and support for the old attribute will be removed in future versions of Select2."), a.attr("ajax--url", a.data("ajaxUrl")), a.data("ajax--url", a.data("ajaxUrl")));
                    var e = {};
                    e = b.fn.jquery && "1." == b.fn.jquery.substr(0, 2) && a[0].dataset ? b.extend(!0, {}, a[0].dataset, a.data()) : a.data();
                    var f = b.extend(!0, {}, e);
                    f = d._convertData(f);
                    for (var g in f) b.inArray(g, c) > -1 || (b.isPlainObject(this.options[g]) ? b.extend(this.options[g], f[g]) : this.options[g] = f[g]);
                    return this
                }, e.prototype.get = function(a) {
                    return this.options[a]
                }, e.prototype.set = function(a, b) {
                    this.options[a] = b
                }, e
            }), b.define("select2/core", ["jquery", "./options", "./utils", "./keys"], function(a, b, c, d) {
                var e = function(a, c) {
                    null != a.data("select2") && a.data("select2").destroy(), this.$element = a, this.id = this._generateId(a), c = c || {}, this.options = new b(c, a), e.__super__.constructor.call(this);
                    var d = a.attr("tabindex") || 0;
                    a.data("old-tabindex", d), a.attr("tabindex", "-1");
                    var f = this.options.get("dataAdapter");
                    this.dataAdapter = new f(a, this.options);
                    var g = this.render();
                    this._placeContainer(g);
                    var h = this.options.get("selectionAdapter");
                    this.selection = new h(a, this.options), this.$selection = this.selection.render(), this.selection.position(this.$selection, g);
                    var i = this.options.get("dropdownAdapter");
                    this.dropdown = new i(a, this.options), this.$dropdown = this.dropdown.render(), this.dropdown.position(this.$dropdown, g);
                    var j = this.options.get("resultsAdapter");
                    this.results = new j(a, this.options, this.dataAdapter), this.$results = this.results.render(), this.results.position(this.$results, this.$dropdown);
                    var k = this;
                    this._bindAdapters(), this._registerDomEvents(), this._registerDataEvents(), this._registerSelectionEvents(), this._registerDropdownEvents(), this._registerResultsEvents(), this._registerEvents(), this.dataAdapter.current(function(a) {
                        k.trigger("selection:update", {
                            data: a
                        })
                    }), a.addClass("select2-hidden-accessible"), a.attr("aria-hidden", "true"), this._syncAttributes(), a.data("select2", this)
                };
                return c.Extend(e, c.Observable), e.prototype._generateId = function(a) {
                    var b = "";
                    return b = null != a.attr("id") ? a.attr("id") : null != a.attr("name") ? a.attr("name") + "-" + c.generateChars(2) : c.generateChars(4), b = b.replace(/(:|\.|\[|\]|,)/g, ""), b = "select2-" + b
                }, e.prototype._placeContainer = function(a) {
                    a.insertAfter(this.$element);
                    var b = this._resolveWidth(this.$element, this.options.get("width"));
                    null != b && a.css("width", b)
                }, e.prototype._resolveWidth = function(a, b) {
                    var c = /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;
                    if ("resolve" == b) {
                        var d = this._resolveWidth(a, "style");
                        return null != d ? d : this._resolveWidth(a, "element")
                    }
                    if ("element" == b) {
                        var e = a.outerWidth(!1);
                        return 0 >= e ? "auto" : e + "px"
                    }
                    if ("style" == b) {
                        var f = a.attr("style");
                        if ("string" != typeof f) return null;
                        for (var g = f.split(";"), h = 0, i = g.length; i > h; h += 1) {
                            var j = g[h].replace(/\s/g, ""),
                                k = j.match(c);
                            if (null !== k && k.length >= 1) return k[1]
                        }
                        return null
                    }
                    return b
                }, e.prototype._bindAdapters = function() {
                    this.dataAdapter.bind(this, this.$container), this.selection.bind(this, this.$container), this.dropdown.bind(this, this.$container), this.results.bind(this, this.$container)
                }, e.prototype._registerDomEvents = function() {
                    var b = this;
                    this.$element.on("change.select2", function() {
                        b.dataAdapter.current(function(a) {
                            b.trigger("selection:update", {
                                data: a
                            })
                        })
                    }), this.$element.on("focus.select2", function(a) {
                        b.trigger("focus", a)
                    }), this._syncA = c.bind(this._syncAttributes, this), this._syncS = c.bind(this._syncSubtree, this), this.$element[0].attachEvent && this.$element[0].attachEvent("onpropertychange", this._syncA);
                    var d = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
                    null != d ? (this._observer = new d(function(c) {
                        a.each(c, b._syncA), a.each(c, b._syncS)
                    }), this._observer.observe(this.$element[0], {
                        attributes: !0,
                        childList: !0,
                        subtree: !1
                    })) : this.$element[0].addEventListener && (this.$element[0].addEventListener("DOMAttrModified", b._syncA, !1), this.$element[0].addEventListener("DOMNodeInserted", b._syncS, !1), this.$element[0].addEventListener("DOMNodeRemoved", b._syncS, !1))
                }, e.prototype._registerDataEvents = function() {
                    var a = this;
                    this.dataAdapter.on("*", function(b, c) {
                        a.trigger(b, c)
                    })
                }, e.prototype._registerSelectionEvents = function() {
                    var b = this,
                        c = ["toggle", "focus"];
                    this.selection.on("toggle", function() {
                        b.toggleDropdown()
                    }), this.selection.on("focus", function(a) {
                        b.focus(a)
                    }), this.selection.on("*", function(d, e) {
                        -1 === a.inArray(d, c) && b.trigger(d, e)
                    })
                }, e.prototype._registerDropdownEvents = function() {
                    var a = this;
                    this.dropdown.on("*", function(b, c) {
                        a.trigger(b, c)
                    })
                }, e.prototype._registerResultsEvents = function() {
                    var a = this;
                    this.results.on("*", function(b, c) {
                        a.trigger(b, c)
                    })
                }, e.prototype._registerEvents = function() {
                    var a = this;
                    this.on("open", function() {
                        a.$container.addClass("select2-container--open")
                    }), this.on("close", function() {
                        a.$container.removeClass("select2-container--open")
                    }), this.on("enable", function() {
                        a.$container.removeClass("select2-container--disabled")
                    }), this.on("disable", function() {
                        a.$container.addClass("select2-container--disabled")
                    }), this.on("blur", function() {
                        a.$container.removeClass("select2-container--focus")
                    }), this.on("query", function(b) {
                        a.isOpen() || a.trigger("open", {}), this.dataAdapter.query(b, function(c) {
                            a.trigger("results:all", {
                                data: c,
                                query: b
                            })
                        })
                    }), this.on("query:append", function(b) {
                        this.dataAdapter.query(b, function(c) {
                            a.trigger("results:append", {
                                data: c,
                                query: b
                            })
                        })
                    }), this.on("keypress", function(b) {
                        var c = b.which;
                        a.isOpen() ? c === d.ESC || c === d.TAB || c === d.UP && b.altKey ? (a.close(), b.preventDefault()) : c === d.ENTER ? (a.trigger("results:select", {}), b.preventDefault()) : c === d.SPACE && b.ctrlKey ? (a.trigger("results:toggle", {}), b.preventDefault()) : c === d.UP ? (a.trigger("results:previous", {}), b.preventDefault()) : c === d.DOWN && (a.trigger("results:next", {}), b.preventDefault()) : (c === d.ENTER || c === d.SPACE || c === d.DOWN && b.altKey) && (a.open(), b.preventDefault())
                    })
                }, e.prototype._syncAttributes = function() {
                    this.options.set("disabled", this.$element.prop("disabled")), this.options.get("disabled") ? (this.isOpen() && this.close(), this.trigger("disable", {})) : this.trigger("enable", {})
                }, e.prototype._syncSubtree = function(a, b) {
                    var c = !1,
                        d = this;
                    if (!a || !a.target || "OPTION" === a.target.nodeName || "OPTGROUP" === a.target.nodeName) {
                        if (b)
                            if (b.addedNodes && b.addedNodes.length > 0)
                                for (var e = 0; e < b.addedNodes.length; e++) {
                                    var f = b.addedNodes[e];
                                    f.selected && (c = !0)
                                } else b.removedNodes && b.removedNodes.length > 0 && (c = !0);
                            else c = !0;
                        c && this.dataAdapter.current(function(a) {
                            d.trigger("selection:update", {
                                data: a
                            })
                        })
                    }
                }, e.prototype.trigger = function(a, b) {
                    var c = e.__super__.trigger,
                        d = {
                            open: "opening",
                            close: "closing",
                            select: "selecting",
                            unselect: "unselecting"
                        };
                    if (void 0 === b && (b = {}), a in d) {
                        var f = d[a],
                            g = {
                                prevented: !1,
                                name: a,
                                args: b
                            };
                        if (c.call(this, f, g), g.prevented) return void(b.prevented = !0)
                    }
                    c.call(this, a, b)
                }, e.prototype.toggleDropdown = function() {
                    this.options.get("disabled") || (this.isOpen() ? this.close() : this.open())
                }, e.prototype.open = function() {
                    this.isOpen() || this.trigger("query", {})
                }, e.prototype.close = function() {
                    this.isOpen() && this.trigger("close", {})
                }, e.prototype.isOpen = function() {
                    return this.$container.hasClass("select2-container--open")
                }, e.prototype.hasFocus = function() {
                    return this.$container.hasClass("select2-container--focus")
                }, e.prototype.focus = function(a) {
                    this.hasFocus() || (this.$container.addClass("select2-container--focus"), this.trigger("focus", {}))
                }, e.prototype.enable = function(a) {
                    this.options.get("debug") && window.console && console.warn && console.warn('Select2: The `select2("enable")` method has been deprecated and will be removed in later Select2 versions. Use $element.prop("disabled") instead.'), (null == a || 0 === a.length) && (a = [!0]);
                    var b = !a[0];
                    this.$element.prop("disabled", b)
                }, e.prototype.data = function() {
                    this.options.get("debug") && arguments.length > 0 && window.console && console.warn && console.warn('Select2: Data can no longer be set using `select2("data")`. You should consider setting the value instead using `$element.val()`.');
                    var a = [];
                    return this.dataAdapter.current(function(b) {
                        a = b
                    }), a
                }, e.prototype.val = function(b) {
                    if (this.options.get("debug") && window.console && console.warn && console.warn('Select2: The `select2("val")` method has been deprecated and will be removed in later Select2 versions. Use $element.val() instead.'), null == b || 0 === b.length) return this.$element.val();
                    var c = b[0];
                    a.isArray(c) && (c = a.map(c, function(a) {
                        return a.toString()
                    })), this.$element.val(c).trigger("change")
                }, e.prototype.destroy = function() {
                    this.$container.remove(), this.$element[0].detachEvent && this.$element[0].detachEvent("onpropertychange", this._syncA), null != this._observer ? (this._observer.disconnect(), this._observer = null) : this.$element[0].removeEventListener && (this.$element[0].removeEventListener("DOMAttrModified", this._syncA, !1), this.$element[0].removeEventListener("DOMNodeInserted", this._syncS, !1), this.$element[0].removeEventListener("DOMNodeRemoved", this._syncS, !1)), this._syncA = null, this._syncS = null, this.$element.off(".select2"), this.$element.attr("tabindex", this.$element.data("old-tabindex")), this.$element.removeClass("select2-hidden-accessible"), this.$element.attr("aria-hidden", "false"), this.$element.removeData("select2"), this.dataAdapter.destroy(), this.selection.destroy(), this.dropdown.destroy(), this.results.destroy(), this.dataAdapter = null, this.selection = null, this.dropdown = null, this.results = null;
                }, e.prototype.render = function() {
                    var b = a('<span class="select2 select2-container"><span class="selection"></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>');
                    return b.attr("dir", this.options.get("dir")), this.$container = b, this.$container.addClass("select2-container--" + this.options.get("theme")), b.data("element", this.$element), b
                }, e
            }), b.define("jquery-mousewheel", ["jquery"], function(a) {
                return a
            }), b.define("jquery.select2", ["jquery", "jquery-mousewheel", "./select2/core", "./select2/defaults"], function(a, b, c, d) {
                if (null == a.fn.select2) {
                    var e = ["open", "close", "destroy"];
                    a.fn.select2 = function(b) {
                        if (b = b || {}, "object" == typeof b) return this.each(function() {
                            var d = a.extend(!0, {}, b);
                            new c(a(this), d)
                        }), this;
                        if ("string" == typeof b) {
                            var d, f = Array.prototype.slice.call(arguments, 1);
                            return this.each(function() {
                                var c = a(this).data("select2");
                                null == c && window.console && console.error && console.error("The select2('" + b + "') method was called on an element that is not using Select2."), d = c[b].apply(c, f)
                            }), a.inArray(b, e) > -1 ? this : d
                        }
                        throw new Error("Invalid arguments for Select2: " + b)
                    }
                }
                return null == a.fn.select2.defaults && (a.fn.select2.defaults = d), c
            }), {
                define: b.define,
                require: b.require
            }
        }(),
        c = b.require("jquery.select2");
    return a.fn.select2.amd = b, c
});

/**!
 * Sortable
 * @author	RubaXa   <trash@rubaxa.org>
 * @license MIT
 */

(function sortableModule(factory) {
    "use strict";

    if (typeof define === "function" && define.amd) {
        define(factory);
    } else if (typeof module != "undefined" && typeof module.exports != "undefined") {
        module.exports = factory();
    } else {
        /* jshint sub:true */
        window["Sortable"] = factory();
    }
})(function sortableFactory() {
    "use strict";

    if (typeof window == "undefined" || !window.document) {
        return function sortableError() {
            throw new Error("Sortable.js requires a window with a document");
        };
    }

    var dragEl,
        parentEl,
        ghostEl,
        cloneEl,
        rootEl,
        nextEl,
        lastDownEl,

        scrollEl,
        scrollParentEl,
        scrollCustomFn,

        lastEl,
        lastCSS,
        lastParentCSS,

        oldIndex,
        newIndex,

        activeGroup,
        putSortable,

        autoScroll = {},

        tapEvt,
        touchEvt,

        moved,

        /** @const */
        R_SPACE = /\s+/g,
        R_FLOAT = /left|right|inline/,

        expando = 'Sortable' + (new Date).getTime(),

        win = window,
        document = win.document,
        parseInt = win.parseInt,

        $ = win.jQuery || win.Zepto,
        Polymer = win.Polymer,

        captureMode = false,

        supportDraggable = !!('draggable' in document.createElement('div')),
        supportCssPointerEvents = (function(el) {
            // false when IE11
            if (!!navigator.userAgent.match(/Trident.*rv[ :]?11\./)) {
                return false;
            }
            el = document.createElement('x');
            el.style.cssText = 'pointer-events:auto';
            return el.style.pointerEvents === 'auto';
        })(),

        _silent = false,

        abs = Math.abs,
        min = Math.min,

        savedInputChecked = [],
        touchDragOverListeners = [],

        _autoScroll = _throttle(function( /**Event*/ evt, /**Object*/ options, /**HTMLElement*/ rootEl) {
            // Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
            if (rootEl && options.scroll) {
                var _this = rootEl[expando],
                    el,
                    rect,
                    sens = options.scrollSensitivity,
                    speed = options.scrollSpeed,

                    x = evt.clientX,
                    y = evt.clientY,

                    winWidth = window.innerWidth,
                    winHeight = window.innerHeight,

                    vx,
                    vy,

                    scrollOffsetX,
                    scrollOffsetY;

                // Delect scrollEl
                if (scrollParentEl !== rootEl) {
                    scrollEl = options.scroll;
                    scrollParentEl = rootEl;
                    scrollCustomFn = options.scrollFn;

                    if (scrollEl === true) {
                        scrollEl = rootEl;

                        do {
                            if ((scrollEl.offsetWidth < scrollEl.scrollWidth) ||
                                (scrollEl.offsetHeight < scrollEl.scrollHeight)
                            ) {
                                break;
                            }
                            /* jshint boss:true */
                        } while (scrollEl = scrollEl.parentNode);
                    }
                }

                if (scrollEl) {
                    el = scrollEl;
                    rect = scrollEl.getBoundingClientRect();
                    vx = (abs(rect.right - x) <= sens) - (abs(rect.left - x) <= sens);
                    vy = (abs(rect.bottom - y) <= sens) - (abs(rect.top - y) <= sens);
                }


                if (!(vx || vy)) {
                    vx = (winWidth - x <= sens) - (x <= sens);
                    vy = (winHeight - y <= sens) - (y <= sens);

                    /* jshint expr:true */
                    (vx || vy) && (el = win);
                }


                if (autoScroll.vx !== vx || autoScroll.vy !== vy || autoScroll.el !== el) {
                    autoScroll.el = el;
                    autoScroll.vx = vx;
                    autoScroll.vy = vy;

                    clearInterval(autoScroll.pid);

                    if (el) {
                        autoScroll.pid = setInterval(function() {
                            scrollOffsetY = vy ? vy * speed : 0;
                            scrollOffsetX = vx ? vx * speed : 0;

                            if ('function' === typeof(scrollCustomFn)) {
                                return scrollCustomFn.call(_this, scrollOffsetX, scrollOffsetY, evt);
                            }

                            if (el === win) {
                                win.scrollTo(win.pageXOffset + scrollOffsetX, win.pageYOffset + scrollOffsetY);
                            } else {
                                el.scrollTop += scrollOffsetY;
                                el.scrollLeft += scrollOffsetX;
                            }
                        }, 24);
                    }
                }
            }
        }, 30),

        _prepareGroup = function(options) {
            function toFn(value, pull) {
                if (value === void 0 || value === true) {
                    value = group.name;
                }

                if (typeof value === 'function') {
                    return value;
                } else {
                    return function(to, from) {
                        var fromGroup = from.options.group.name;

                        return pull ?
                            value :
                            value && (value.join ?
                                value.indexOf(fromGroup) > -1 :
                                (fromGroup == value)
                            );
                    };
                }
            }

            var group = {};
            var originalGroup = options.group;

            if (!originalGroup || typeof originalGroup != 'object') {
                originalGroup = {
                    name: originalGroup
                };
            }

            group.name = originalGroup.name;
            group.checkPull = toFn(originalGroup.pull, true);
            group.checkPut = toFn(originalGroup.put);
            group.revertClone = originalGroup.revertClone;

            options.group = group;
        };


    /**
     * @class  Sortable
     * @param  {HTMLElement}  el
     * @param  {Object}       [options]
     */
    function Sortable(el, options) {
        if (!(el && el.nodeType && el.nodeType === 1)) {
            throw 'Sortable: `el` must be HTMLElement, and not ' + {}.toString.call(el);
        }

        this.el = el; // root element
        this.options = options = _extend({}, options);


        // Export instance
        el[expando] = this;

        // Default options
        var defaults = {
            group: Math.random(),
            sort: true,
            disabled: false,
            store: null,
            handle: null,
            scroll: true,
            scrollSensitivity: 30,
            scrollSpeed: 10,
            draggable: /[uo]l/i.test(el.nodeName) ? 'li' : '>*',
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            dragClass: 'sortable-drag',
            ignore: 'a, img',
            filter: null,
            preventOnFilter: true,
            animation: 0,
            setData: function(dataTransfer, dragEl) {
                dataTransfer.setData('Text', dragEl.textContent);
            },
            dropBubble: false,
            dragoverBubble: false,
            dataIdAttr: 'data-id',
            delay: 0,
            forceFallback: false,
            fallbackClass: 'sortable-fallback',
            fallbackOnBody: false,
            fallbackTolerance: 0,
            fallbackOffset: {
                x: 0,
                y: 0
            }
        };


        // Set default options
        for (var name in defaults) {
            !(name in options) && (options[name] = defaults[name]);
        }

        _prepareGroup(options);

        // Bind all private methods
        for (var fn in this) {
            if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
                this[fn] = this[fn].bind(this);
            }
        }

        // Setup drag mode
        this.nativeDraggable = options.forceFallback ? false : supportDraggable;

        // Bind events
        _on(el, 'mousedown', this._onTapStart);
        _on(el, 'touchstart', this._onTapStart);
        _on(el, 'pointerdown', this._onTapStart);

        if (this.nativeDraggable) {
            _on(el, 'dragover', this);
            _on(el, 'dragenter', this);
        }

        touchDragOverListeners.push(this._onDragOver);

        // Restore sorting
        options.store && this.sort(options.store.get(this));
    }


    Sortable.prototype = /** @lends Sortable.prototype */ {
        constructor: Sortable,

        _onTapStart: function( /** Event|TouchEvent */ evt) {
            var _this = this,
                el = this.el,
                options = this.options,
                preventOnFilter = options.preventOnFilter,
                type = evt.type,
                touch = evt.touches && evt.touches[0],
                target = (touch || evt).target,
                originalTarget = evt.target.shadowRoot && (evt.path && evt.path[0]) || target,
                filter = options.filter,
                startIndex;

            _saveInputCheckedState(el);


            // Don't trigger start event when an element is been dragged, otherwise the evt.oldindex always wrong when set option.group.
            if (dragEl) {
                return;
            }

            if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
                return; // only left button or enabled
            }


            target = _closest(target, options.draggable, el);

            if (!target) {
                return;
            }

            if (lastDownEl === target) {
                // Ignoring duplicate `down`
                return;
            }

            // Get the index of the dragged element within its parent
            startIndex = _index(target, options.draggable);

            // Check filter
            if (typeof filter === 'function') {
                if (filter.call(this, evt, target, this)) {
                    _dispatchEvent(_this, originalTarget, 'filter', target, el, startIndex);
                    preventOnFilter && evt.preventDefault();
                    return; // cancel dnd
                }
            } else if (filter) {
                filter = filter.split(',').some(function(criteria) {
                    criteria = _closest(originalTarget, criteria.trim(), el);

                    if (criteria) {
                        _dispatchEvent(_this, criteria, 'filter', target, el, startIndex);
                        return true;
                    }
                });

                if (filter) {
                    preventOnFilter && evt.preventDefault();
                    return; // cancel dnd
                }
            }

            if (options.handle && !_closest(originalTarget, options.handle, el)) {
                return;
            }

            // Prepare `dragstart`
            this._prepareDragStart(evt, touch, target, startIndex);
        },

        _prepareDragStart: function( /** Event */ evt, /** Touch */ touch, /** HTMLElement */ target, /** Number */ startIndex) {
            var _this = this,
                el = _this.el,
                options = _this.options,
                ownerDocument = el.ownerDocument,
                dragStartFn;

            if (target && !dragEl && (target.parentNode === el)) {
                tapEvt = evt;

                rootEl = el;
                dragEl = target;
                parentEl = dragEl.parentNode;
                nextEl = dragEl.nextSibling;
                lastDownEl = target;
                activeGroup = options.group;
                oldIndex = startIndex;

                this._lastX = (touch || evt).clientX;
                this._lastY = (touch || evt).clientY;

                dragEl.style['will-change'] = 'transform';

                dragStartFn = function() {
                    // Delayed drag has been triggered
                    // we can re-enable the events: touchmove/mousemove
                    _this._disableDelayedDrag();

                    // Make the element draggable
                    dragEl.draggable = _this.nativeDraggable;

                    // Chosen item
                    _toggleClass(dragEl, options.chosenClass, true);

                    // Bind the events: dragstart/dragend
                    _this._triggerDragStart(evt, touch);

                    // Drag start event
                    _dispatchEvent(_this, rootEl, 'choose', dragEl, rootEl, oldIndex);
                };

                // Disable "draggable"
                options.ignore.split(',').forEach(function(criteria) {
                    _find(dragEl, criteria.trim(), _disableDraggable);
                });

                _on(ownerDocument, 'mouseup', _this._onDrop);
                _on(ownerDocument, 'touchend', _this._onDrop);
                _on(ownerDocument, 'touchcancel', _this._onDrop);
                _on(ownerDocument, 'pointercancel', _this._onDrop);
                _on(ownerDocument, 'selectstart', _this);

                if (options.delay) {
                    // If the user moves the pointer or let go the click or touch
                    // before the delay has been reached:
                    // disable the delayed drag
                    _on(ownerDocument, 'mouseup', _this._disableDelayedDrag);
                    _on(ownerDocument, 'touchend', _this._disableDelayedDrag);
                    _on(ownerDocument, 'touchcancel', _this._disableDelayedDrag);
                    _on(ownerDocument, 'mousemove', _this._disableDelayedDrag);
                    _on(ownerDocument, 'touchmove', _this._disableDelayedDrag);
                    _on(ownerDocument, 'pointermove', _this._disableDelayedDrag);

                    _this._dragStartTimer = setTimeout(dragStartFn, options.delay);
                } else {
                    dragStartFn();
                }


            }
        },

        _disableDelayedDrag: function() {
            var ownerDocument = this.el.ownerDocument;

            clearTimeout(this._dragStartTimer);
            _off(ownerDocument, 'mouseup', this._disableDelayedDrag);
            _off(ownerDocument, 'touchend', this._disableDelayedDrag);
            _off(ownerDocument, 'touchcancel', this._disableDelayedDrag);
            _off(ownerDocument, 'mousemove', this._disableDelayedDrag);
            _off(ownerDocument, 'touchmove', this._disableDelayedDrag);
            _off(ownerDocument, 'pointermove', this._disableDelayedDrag);
        },

        _triggerDragStart: function( /** Event */ evt, /** Touch */ touch) {
            touch = touch || (evt.pointerType == 'touch' ? evt : null);

            if (touch) {
                // Touch device support
                tapEvt = {
                    target: dragEl,
                    clientX: touch.clientX,
                    clientY: touch.clientY
                };

                this._onDragStart(tapEvt, 'touch');
            } else if (!this.nativeDraggable) {
                this._onDragStart(tapEvt, true);
            } else {
                _on(dragEl, 'dragend', this);
                _on(rootEl, 'dragstart', this._onDragStart);
            }

            try {
                if (document.selection) {
                    // Timeout neccessary for IE9
                    setTimeout(function() {
                        document.selection.empty();
                    });
                } else {
                    window.getSelection().removeAllRanges();
                }
            } catch (err) {}
        },

        _dragStarted: function() {
            if (rootEl && dragEl) {
                var options = this.options;

                // Apply effect
                _toggleClass(dragEl, options.ghostClass, true);
                _toggleClass(dragEl, options.dragClass, false);

                Sortable.active = this;

                // Drag start event
                _dispatchEvent(this, rootEl, 'start', dragEl, rootEl, oldIndex);
            } else {
                this._nulling();
            }
        },

        _emulateDragOver: function() {
            if (touchEvt) {
                if (this._lastX === touchEvt.clientX && this._lastY === touchEvt.clientY) {
                    return;
                }

                this._lastX = touchEvt.clientX;
                this._lastY = touchEvt.clientY;

                if (!supportCssPointerEvents) {
                    _css(ghostEl, 'display', 'none');
                }

                var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY),
                    parent = target,
                    i = touchDragOverListeners.length;

                if (parent) {
                    do {
                        if (parent[expando]) {
                            while (i--) {
                                touchDragOverListeners[i]({
                                    clientX: touchEvt.clientX,
                                    clientY: touchEvt.clientY,
                                    target: target,
                                    rootEl: parent
                                });
                            }

                            break;
                        }

                        target = parent; // store last element
                    }
                    /* jshint boss:true */
                    while (parent = parent.parentNode);
                }

                if (!supportCssPointerEvents) {
                    _css(ghostEl, 'display', '');
                }
            }
        },


        _onTouchMove: function( /**TouchEvent*/ evt) {
            if (tapEvt) {
                var options = this.options,
                    fallbackTolerance = options.fallbackTolerance,
                    fallbackOffset = options.fallbackOffset,
                    touch = evt.touches ? evt.touches[0] : evt,
                    dx = (touch.clientX - tapEvt.clientX) + fallbackOffset.x,
                    dy = (touch.clientY - tapEvt.clientY) + fallbackOffset.y,
                    translate3d = evt.touches ? 'translate3d(' + dx + 'px,' + dy + 'px,0)' : 'translate(' + dx + 'px,' + dy + 'px)';

                // only set the status to dragging, when we are actually dragging
                if (!Sortable.active) {
                    if (fallbackTolerance &&
                        min(abs(touch.clientX - this._lastX), abs(touch.clientY - this._lastY)) < fallbackTolerance
                    ) {
                        return;
                    }

                    this._dragStarted();
                }

                // as well as creating the ghost element on the document body
                this._appendGhost();

                moved = true;
                touchEvt = touch;

                _css(ghostEl, 'webkitTransform', translate3d);
                _css(ghostEl, 'mozTransform', translate3d);
                _css(ghostEl, 'msTransform', translate3d);
                _css(ghostEl, 'transform', translate3d);

                evt.preventDefault();
            }
        },

        _appendGhost: function() {
            if (!ghostEl) {
                var rect = dragEl.getBoundingClientRect(),
                    css = _css(dragEl),
                    options = this.options,
                    ghostRect;

                ghostEl = dragEl.cloneNode(true);

                _toggleClass(ghostEl, options.ghostClass, false);
                _toggleClass(ghostEl, options.fallbackClass, true);
                _toggleClass(ghostEl, options.dragClass, true);

                _css(ghostEl, 'top', rect.top - parseInt(css.marginTop, 10));
                _css(ghostEl, 'left', rect.left - parseInt(css.marginLeft, 10));
                _css(ghostEl, 'width', rect.width);
                _css(ghostEl, 'height', rect.height);
                _css(ghostEl, 'opacity', '0.8');
                _css(ghostEl, 'position', 'fixed');
                _css(ghostEl, 'zIndex', '100000');
                _css(ghostEl, 'pointerEvents', 'none');

                options.fallbackOnBody && document.body.appendChild(ghostEl) || rootEl.appendChild(ghostEl);

                // Fixing dimensions.
                ghostRect = ghostEl.getBoundingClientRect();
                _css(ghostEl, 'width', rect.width * 2 - ghostRect.width);
                _css(ghostEl, 'height', rect.height * 2 - ghostRect.height);
            }
        },

        _onDragStart: function( /**Event*/ evt, /**boolean*/ useFallback) {
            var dataTransfer = evt.dataTransfer,
                options = this.options;

            this._offUpEvents();

            if (activeGroup.checkPull(this, this, dragEl, evt)) {
                cloneEl = _clone(dragEl);

                cloneEl.draggable = false;
                cloneEl.style['will-change'] = '';

                _css(cloneEl, 'display', 'none');
                _toggleClass(cloneEl, this.options.chosenClass, false);

                rootEl.insertBefore(cloneEl, dragEl);
                _dispatchEvent(this, rootEl, 'clone', dragEl);
            }

            _toggleClass(dragEl, options.dragClass, true);

            if (useFallback) {
                if (useFallback === 'touch') {
                    // Bind touch events
                    _on(document, 'touchmove', this._onTouchMove);
                    _on(document, 'touchend', this._onDrop);
                    _on(document, 'touchcancel', this._onDrop);
                    _on(document, 'pointermove', this._onTouchMove);
                    _on(document, 'pointerup', this._onDrop);
                } else {
                    // Old brwoser
                    _on(document, 'mousemove', this._onTouchMove);
                    _on(document, 'mouseup', this._onDrop);
                }

                this._loopId = setInterval(this._emulateDragOver, 50);
            } else {
                if (dataTransfer) {
                    dataTransfer.effectAllowed = 'move';
                    options.setData && options.setData.call(this, dataTransfer, dragEl);
                }

                _on(document, 'drop', this);
                setTimeout(this._dragStarted, 0);
            }
        },

        _onDragOver: function( /**Event*/ evt) {
            var el = this.el,
                target,
                dragRect,
                targetRect,
                revert,
                options = this.options,
                group = options.group,
                activeSortable = Sortable.active,
                isOwner = (activeGroup === group),
                isMovingBetweenSortable = false,
                canSort = options.sort;

            if (evt.preventDefault !== void 0) {
                evt.preventDefault();
                !options.dragoverBubble && evt.stopPropagation();
            }

            if (dragEl.animated) {
                return;
            }

            moved = true;

            if (activeSortable && !options.disabled &&
                (isOwner ?
                    canSort || (revert = !rootEl.contains(dragEl)) // Reverting item into the original list
                    :
                    (
                        putSortable === this ||
                        (
                            (activeSortable.lastPullMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) &&
                            group.checkPut(this, activeSortable, dragEl, evt)
                        )
                    )
                ) &&
                (evt.rootEl === void 0 || evt.rootEl === this.el) // touch fallback
            ) {
                // Smart auto-scrolling
                _autoScroll(evt, options, this.el);

                if (_silent) {
                    return;
                }

                target = _closest(evt.target, options.draggable, el);
                dragRect = dragEl.getBoundingClientRect();

                if (putSortable !== this) {
                    putSortable = this;
                    isMovingBetweenSortable = true;
                }

                if (revert) {
                    _cloneHide(activeSortable, true);
                    parentEl = rootEl; // actualization

                    if (cloneEl || nextEl) {
                        rootEl.insertBefore(dragEl, cloneEl || nextEl);
                    } else if (!canSort) {
                        rootEl.appendChild(dragEl);
                    }

                    return;
                }


                if ((el.children.length === 0) || (el.children[0] === ghostEl) ||
                    (el === evt.target) && (_ghostIsLast(el, evt))
                ) {
                    //assign target only if condition is true
                    if (el.children.length !== 0 && el.children[0] !== ghostEl && el === evt.target) {
                        target = el.lastElementChild;
                    }

                    if (target) {
                        if (target.animated) {
                            return;
                        }

                        targetRect = target.getBoundingClientRect();
                    }

                    _cloneHide(activeSortable, isOwner);

                    if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt) !== false) {
                        if (!dragEl.contains(el)) {
                            el.appendChild(dragEl);
                            parentEl = el; // actualization
                        }

                        this._animate(dragRect, dragEl);
                        target && this._animate(targetRect, target);
                    }
                } else if (target && !target.animated && target !== dragEl && (target.parentNode[expando] !== void 0)) {
                    if (lastEl !== target) {
                        lastEl = target;
                        lastCSS = _css(target);
                        lastParentCSS = _css(target.parentNode);
                    }

                    targetRect = target.getBoundingClientRect();

                    var width = targetRect.right - targetRect.left,
                        height = targetRect.bottom - targetRect.top,
                        floating = R_FLOAT.test(lastCSS.cssFloat + lastCSS.display) ||
                        (lastParentCSS.display == 'flex' && lastParentCSS['flex-direction'].indexOf('row') === 0),
                        isWide = (target.offsetWidth > dragEl.offsetWidth),
                        isLong = (target.offsetHeight > dragEl.offsetHeight),
                        halfway = (floating ? (evt.clientX - targetRect.left) / width : (evt.clientY - targetRect.top) / height) > 0.5,
                        nextSibling = target.nextElementSibling,
                        after = false;

                    if (floating) {
                        var elTop = dragEl.offsetTop,
                            tgTop = target.offsetTop;

                        if (elTop === tgTop) {
                            after = (target.previousElementSibling === dragEl) && !isWide || halfway && isWide;
                        } else if (target.previousElementSibling === dragEl || dragEl.previousElementSibling === target) {
                            after = (evt.clientY - targetRect.top) / height > 0.5;
                        } else {
                            after = tgTop > elTop;
                        }
                    } else if (!isMovingBetweenSortable) {
                        after = (nextSibling !== dragEl) && !isLong || halfway && isLong;
                    }

                    var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);

                    if (moveVector !== false) {
                        if (moveVector === 1 || moveVector === -1) {
                            after = (moveVector === 1);
                        }

                        _silent = true;
                        setTimeout(_unsilent, 30);

                        _cloneHide(activeSortable, isOwner);

                        if (!dragEl.contains(el)) {
                            if (after && !nextSibling) {
                                el.appendChild(dragEl);
                            } else {
                                target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
                            }
                        }

                        parentEl = dragEl.parentNode; // actualization

                        this._animate(dragRect, dragEl);
                        this._animate(targetRect, target);
                    }
                }
            }
        },

        _animate: function(prevRect, target) {
            var ms = this.options.animation;

            if (ms) {
                var currentRect = target.getBoundingClientRect();

                if (prevRect.nodeType === 1) {
                    prevRect = prevRect.getBoundingClientRect();
                }

                _css(target, 'transition', 'none');
                _css(target, 'transform', 'translate3d(' +
                    (prevRect.left - currentRect.left) + 'px,' +
                    (prevRect.top - currentRect.top) + 'px,0)'
                );

                target.offsetWidth; // repaint

                _css(target, 'transition', 'all ' + ms + 'ms');
                _css(target, 'transform', 'translate3d(0,0,0)');

                clearTimeout(target.animated);
                target.animated = setTimeout(function() {
                    _css(target, 'transition', '');
                    _css(target, 'transform', '');
                    target.animated = false;
                }, ms);
            }
        },

        _offUpEvents: function() {
            var ownerDocument = this.el.ownerDocument;

            _off(document, 'touchmove', this._onTouchMove);
            _off(document, 'pointermove', this._onTouchMove);
            _off(ownerDocument, 'mouseup', this._onDrop);
            _off(ownerDocument, 'touchend', this._onDrop);
            _off(ownerDocument, 'pointerup', this._onDrop);
            _off(ownerDocument, 'touchcancel', this._onDrop);
            _off(ownerDocument, 'pointercancel', this._onDrop);
            _off(ownerDocument, 'selectstart', this);
        },

        _onDrop: function( /**Event*/ evt) {
            var el = this.el,
                options = this.options;

            clearInterval(this._loopId);
            clearInterval(autoScroll.pid);
            clearTimeout(this._dragStartTimer);

            // Unbind events
            _off(document, 'mousemove', this._onTouchMove);

            if (this.nativeDraggable) {
                _off(document, 'drop', this);
                _off(el, 'dragstart', this._onDragStart);
            }

            this._offUpEvents();

            if (evt) {
                if (moved) {
                    evt.preventDefault();
                    !options.dropBubble && evt.stopPropagation();
                }

                ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);

                if (rootEl === parentEl || Sortable.active.lastPullMode !== 'clone') {
                    // Remove clone
                    cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
                }

                if (dragEl) {
                    if (this.nativeDraggable) {
                        _off(dragEl, 'dragend', this);
                    }

                    _disableDraggable(dragEl);
                    dragEl.style['will-change'] = '';

                    // Remove class's
                    _toggleClass(dragEl, this.options.ghostClass, false);
                    _toggleClass(dragEl, this.options.chosenClass, false);

                    // Drag stop event
                    _dispatchEvent(this, rootEl, 'unchoose', dragEl, rootEl, oldIndex);

                    if (rootEl !== parentEl) {
                        newIndex = _index(dragEl, options.draggable);

                        if (newIndex >= 0) {
                            // Add event
                            _dispatchEvent(null, parentEl, 'add', dragEl, rootEl, oldIndex, newIndex);

                            // Remove event
                            _dispatchEvent(this, rootEl, 'remove', dragEl, rootEl, oldIndex, newIndex);

                            // drag from one list and drop into another
                            _dispatchEvent(null, parentEl, 'sort', dragEl, rootEl, oldIndex, newIndex);
                            _dispatchEvent(this, rootEl, 'sort', dragEl, rootEl, oldIndex, newIndex);
                        }
                    } else {
                        if (dragEl.nextSibling !== nextEl) {
                            // Get the index of the dragged element within its parent
                            newIndex = _index(dragEl, options.draggable);

                            if (newIndex >= 0) {
                                // drag & drop within the same list
                                _dispatchEvent(this, rootEl, 'update', dragEl, rootEl, oldIndex, newIndex);
                                _dispatchEvent(this, rootEl, 'sort', dragEl, rootEl, oldIndex, newIndex);
                            }
                        }
                    }

                    if (Sortable.active) {
                        /* jshint eqnull:true */
                        if (newIndex == null || newIndex === -1) {
                            newIndex = oldIndex;
                        }

                        _dispatchEvent(this, rootEl, 'end', dragEl, rootEl, oldIndex, newIndex);

                        // Save sorting
                        this.save();
                    }
                }

            }

            this._nulling();
        },

        _nulling: function() {
            rootEl =
                dragEl =
                parentEl =
                ghostEl =
                nextEl =
                cloneEl =
                lastDownEl =

                scrollEl =
                scrollParentEl =

                tapEvt =
                touchEvt =

                moved =
                newIndex =

                lastEl =
                lastCSS =

                putSortable =
                activeGroup =
                Sortable.active = null;

            savedInputChecked.forEach(function(el) {
                el.checked = true;
            });
            savedInputChecked.length = 0;
        },

        handleEvent: function( /**Event*/ evt) {
            switch (evt.type) {
                case 'drop':
                case 'dragend':
                    this._onDrop(evt);
                    break;

                case 'dragover':
                case 'dragenter':
                    if (dragEl) {
                        this._onDragOver(evt);
                        _globalDragOver(evt);
                    }
                    break;

                case 'selectstart':
                    evt.preventDefault();
                    break;
            }
        },


        /**
         * Serializes the item into an array of string.
         * @returns {String[]}
         */
        toArray: function() {
            var order = [],
                el,
                children = this.el.children,
                i = 0,
                n = children.length,
                options = this.options;

            for (; i < n; i++) {
                el = children[i];
                if (_closest(el, options.draggable, this.el)) {
                    order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
                }
            }

            return order;
        },


        /**
         * Sorts the elements according to the array.
         * @param  {String[]}  order  order of the items
         */
        sort: function(order) {
            var items = {},
                rootEl = this.el;

            this.toArray().forEach(function(id, i) {
                var el = rootEl.children[i];

                if (_closest(el, this.options.draggable, rootEl)) {
                    items[id] = el;
                }
            }, this);

            order.forEach(function(id) {
                if (items[id]) {
                    rootEl.removeChild(items[id]);
                    rootEl.appendChild(items[id]);
                }
            });
        },


        /**
         * Save the current sorting
         */
        save: function() {
            var store = this.options.store;
            store && store.set(this);
        },


        /**
         * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
         * @param   {HTMLElement}  el
         * @param   {String}       [selector]  default: `options.draggable`
         * @returns {HTMLElement|null}
         */
        closest: function(el, selector) {
            return _closest(el, selector || this.options.draggable, this.el);
        },


        /**
         * Set/get option
         * @param   {string} name
         * @param   {*}      [value]
         * @returns {*}
         */
        option: function(name, value) {
            var options = this.options;

            if (value === void 0) {
                return options[name];
            } else {
                options[name] = value;

                if (name === 'group') {
                    _prepareGroup(options);
                }
            }
        },


        /**
         * Destroy
         */
        destroy: function() {
            var el = this.el;

            el[expando] = null;

            _off(el, 'mousedown', this._onTapStart);
            _off(el, 'touchstart', this._onTapStart);
            _off(el, 'pointerdown', this._onTapStart);

            if (this.nativeDraggable) {
                _off(el, 'dragover', this);
                _off(el, 'dragenter', this);
            }

            // Remove draggable attributes
            Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function(el) {
                el.removeAttribute('draggable');
            });

            touchDragOverListeners.splice(touchDragOverListeners.indexOf(this._onDragOver), 1);

            this._onDrop();

            this.el = el = null;
        }
    };


    function _cloneHide(sortable, state) {
        if (sortable.lastPullMode !== 'clone') {
            state = true;
        }

        if (cloneEl && (cloneEl.state !== state)) {
            _css(cloneEl, 'display', state ? 'none' : '');

            if (!state) {
                if (cloneEl.state) {
                    if (sortable.options.group.revertClone) {
                        rootEl.insertBefore(cloneEl, nextEl);
                        sortable._animate(dragEl, cloneEl);
                    } else {
                        rootEl.insertBefore(cloneEl, dragEl);
                    }
                }
            }

            cloneEl.state = state;
        }
    }


    function _closest( /**HTMLElement*/ el, /**String*/ selector, /**HTMLElement*/ ctx) {
        if (el) {
            ctx = ctx || document;

            do {
                if ((selector === '>*' && el.parentNode === ctx) || _matches(el, selector)) {
                    return el;
                }
                /* jshint boss:true */
            } while (el = _getParentOrHost(el));
        }

        return null;
    }


    function _getParentOrHost(el) {
        var parent = el.host;

        return (parent && parent.nodeType) ? parent : el.parentNode;
    }


    function _globalDragOver( /**Event*/ evt) {
        if (evt.dataTransfer) {
            evt.dataTransfer.dropEffect = 'move';
        }
        evt.preventDefault();
    }


    function _on(el, event, fn) {
        el.addEventListener(event, fn, captureMode);
    }


    function _off(el, event, fn) {
        el.removeEventListener(event, fn, captureMode);
    }


    function _toggleClass(el, name, state) {
        if (el) {
            if (el.classList) {
                el.classList[state ? 'add' : 'remove'](name);
            } else {
                var className = (' ' + el.className + ' ').replace(R_SPACE, ' ').replace(' ' + name + ' ', ' ');
                el.className = (className + (state ? ' ' + name : '')).replace(R_SPACE, ' ');
            }
        }
    }


    function _css(el, prop, val) {
        var style = el && el.style;

        if (style) {
            if (val === void 0) {
                if (document.defaultView && document.defaultView.getComputedStyle) {
                    val = document.defaultView.getComputedStyle(el, '');
                } else if (el.currentStyle) {
                    val = el.currentStyle;
                }

                return prop === void 0 ? val : val[prop];
            } else {
                if (!(prop in style)) {
                    prop = '-webkit-' + prop;
                }

                style[prop] = val + (typeof val === 'string' ? '' : 'px');
            }
        }
    }


    function _find(ctx, tagName, iterator) {
        if (ctx) {
            var list = ctx.getElementsByTagName(tagName),
                i = 0,
                n = list.length;

            if (iterator) {
                for (; i < n; i++) {
                    iterator(list[i], i);
                }
            }

            return list;
        }

        return [];
    }



    function _dispatchEvent(sortable, rootEl, name, targetEl, fromEl, startIndex, newIndex) {
        sortable = (sortable || rootEl[expando]);

        var evt = document.createEvent('Event'),
            options = sortable.options,
            onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1);

        evt.initEvent(name, true, true);

        evt.to = rootEl;
        evt.from = fromEl || rootEl;
        evt.item = targetEl || rootEl;
        evt.clone = cloneEl;

        evt.oldIndex = startIndex;
        evt.newIndex = newIndex;

        rootEl.dispatchEvent(evt);

        if (options[onName]) {
            options[onName].call(sortable, evt);
        }
    }


    function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvt, willInsertAfter) {
        var evt,
            sortable = fromEl[expando],
            onMoveFn = sortable.options.onMove,
            retVal;

        evt = document.createEvent('Event');
        evt.initEvent('move', true, true);

        evt.to = toEl;
        evt.from = fromEl;
        evt.dragged = dragEl;
        evt.draggedRect = dragRect;
        evt.related = targetEl || toEl;
        evt.relatedRect = targetRect || toEl.getBoundingClientRect();
        evt.willInsertAfter = willInsertAfter;

        fromEl.dispatchEvent(evt);

        if (onMoveFn) {
            retVal = onMoveFn.call(sortable, evt, originalEvt);
        }

        return retVal;
    }


    function _disableDraggable(el) {
        el.draggable = false;
    }


    function _unsilent() {
        _silent = false;
    }


    /** @returns {HTMLElement|false} */
    function _ghostIsLast(el, evt) {
        var lastEl = el.lastElementChild,
            rect = lastEl.getBoundingClientRect();

        // 5 — min delta
        // abs — нельзя добавлять, а то глюки при наведении сверху
        return (evt.clientY - (rect.top + rect.height) > 5) ||
            (evt.clientX - (rect.left + rect.width) > 5);
    }


    /**
     * Generate id
     * @param   {HTMLElement} el
     * @returns {String}
     * @private
     */
    function _generateId(el) {
        var str = el.tagName + el.className + el.src + el.href + el.textContent,
            i = str.length,
            sum = 0;

        while (i--) {
            sum += str.charCodeAt(i);
        }

        return sum.toString(36);
    }

    /**
     * Returns the index of an element within its parent for a selected set of
     * elements
     * @param  {HTMLElement} el
     * @param  {selector} selector
     * @return {number}
     */
    function _index(el, selector) {
        var index = 0;

        if (!el || !el.parentNode) {
            return -1;
        }

        while (el && (el = el.previousElementSibling)) {
            if ((el.nodeName.toUpperCase() !== 'TEMPLATE') && (selector === '>*' || _matches(el, selector))) {
                index++;
            }
        }

        return index;
    }

    function _matches( /**HTMLElement*/ el, /**String*/ selector) {
        if (el) {
            selector = selector.split('.');

            var tag = selector.shift().toUpperCase(),
                re = new RegExp('\\s(' + selector.join('|') + ')(?=\\s)', 'g');

            return (
                (tag === '' || el.nodeName.toUpperCase() == tag) &&
                (!selector.length || ((' ' + el.className + ' ').match(re) || []).length == selector.length)
            );
        }

        return false;
    }

    function _throttle(callback, ms) {
        var args, _this;

        return function() {
            if (args === void 0) {
                args = arguments;
                _this = this;

                setTimeout(function() {
                    if (args.length === 1) {
                        callback.call(_this, args[0]);
                    } else {
                        callback.apply(_this, args);
                    }

                    args = void 0;
                }, ms);
            }
        };
    }

    function _extend(dst, src) {
        if (dst && src) {
            for (var key in src) {
                if (src.hasOwnProperty(key)) {
                    dst[key] = src[key];
                }
            }
        }

        return dst;
    }

    function _clone(el) {
        return $ ?
            $(el).clone(true)[0] :
            (Polymer && Polymer.dom ?
                Polymer.dom(el).cloneNode(true) :
                el.cloneNode(true)
            );
    }

    function _saveInputCheckedState(root) {
        var inputs = root.getElementsByTagName('input');
        var idx = inputs.length;

        while (idx--) {
            var el = inputs[idx];
            el.checked && savedInputChecked.push(el);
        }
    }

    // Fixed #973:
    _on(document, 'touchmove', function(evt) {
        if (Sortable.active) {
            evt.preventDefault();
        }
    });

    try {
        window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
            get: function() {
                captureMode = {
                    capture: false,
                    passive: false
                };
            }
        }));
    } catch (err) {}

    // Export utils
    Sortable.utils = {
        on: _on,
        off: _off,
        css: _css,
        find: _find,
        is: function(el, selector) {
            return !!_closest(el, selector, el);
        },
        extend: _extend,
        throttle: _throttle,
        closest: _closest,
        toggleClass: _toggleClass,
        clone: _clone,
        index: _index
    };


    /**
     * Create sortable instance
     * @param {HTMLElement}  el
     * @param {Object}      [options]
     */
    Sortable.create = function(el, options) {
        return new Sortable(el, options);
    };


    // Export
    Sortable.version = '1.6.1';
    return Sortable;
});

/*!
 * Bootstrap Colorpicker v2.5.1
 * https://itsjavi.com/bootstrap-colorpicker/
 */
! function(a, b) {
    "function" == typeof define && define.amd ? define(["jquery"], function(a) {
        return b(a)
    }) : "object" == typeof exports ? module.exports = b(require("jquery")) : jQuery && !jQuery.fn.colorpicker && b(jQuery)
}(this, function(a) {
    "use strict";
    var b = function(c, d, e, f, g) {
        this.fallbackValue = e ? e && "undefined" != typeof e.h ? e : this.value = {
            h: 0,
            s: 0,
            b: 0,
            a: 1
        } : null, this.fallbackFormat = f ? f : "rgba", this.hexNumberSignPrefix = g === !0, this.value = this.fallbackValue, this.origFormat = null, this.predefinedColors = d ? d : {}, this.colors = a.extend({}, b.webColors, this.predefinedColors), c && ("undefined" != typeof c.h ? this.value = c : this.setColor(String(c))), this.value || (this.value = {
            h: 0,
            s: 0,
            b: 0,
            a: 1
        })
    };
    b.webColors = {
        aliceblue: "f0f8ff",
        antiquewhite: "faebd7",
        aqua: "00ffff",
        aquamarine: "7fffd4",
        azure: "f0ffff",
        beige: "f5f5dc",
        bisque: "ffe4c4",
        black: "000000",
        blanchedalmond: "ffebcd",
        blue: "0000ff",
        blueviolet: "8a2be2",
        brown: "a52a2a",
        burlywood: "deb887",
        cadetblue: "5f9ea0",
        chartreuse: "7fff00",
        chocolate: "d2691e",
        coral: "ff7f50",
        cornflowerblue: "6495ed",
        cornsilk: "fff8dc",
        crimson: "dc143c",
        cyan: "00ffff",
        darkblue: "00008b",
        darkcyan: "008b8b",
        darkgoldenrod: "b8860b",
        darkgray: "a9a9a9",
        darkgreen: "006400",
        darkkhaki: "bdb76b",
        darkmagenta: "8b008b",
        darkolivegreen: "556b2f",
        darkorange: "ff8c00",
        darkorchid: "9932cc",
        darkred: "8b0000",
        darksalmon: "e9967a",
        darkseagreen: "8fbc8f",
        darkslateblue: "483d8b",
        darkslategray: "2f4f4f",
        darkturquoise: "00ced1",
        darkviolet: "9400d3",
        deeppink: "ff1493",
        deepskyblue: "00bfff",
        dimgray: "696969",
        dodgerblue: "1e90ff",
        firebrick: "b22222",
        floralwhite: "fffaf0",
        forestgreen: "228b22",
        fuchsia: "ff00ff",
        gainsboro: "dcdcdc",
        ghostwhite: "f8f8ff",
        gold: "ffd700",
        goldenrod: "daa520",
        gray: "808080",
        green: "008000",
        greenyellow: "adff2f",
        honeydew: "f0fff0",
        hotpink: "ff69b4",
        indianred: "cd5c5c",
        indigo: "4b0082",
        ivory: "fffff0",
        khaki: "f0e68c",
        lavender: "e6e6fa",
        lavenderblush: "fff0f5",
        lawngreen: "7cfc00",
        lemonchiffon: "fffacd",
        lightblue: "add8e6",
        lightcoral: "f08080",
        lightcyan: "e0ffff",
        lightgoldenrodyellow: "fafad2",
        lightgrey: "d3d3d3",
        lightgreen: "90ee90",
        lightpink: "ffb6c1",
        lightsalmon: "ffa07a",
        lightseagreen: "20b2aa",
        lightskyblue: "87cefa",
        lightslategray: "778899",
        lightsteelblue: "b0c4de",
        lightyellow: "ffffe0",
        lime: "00ff00",
        limegreen: "32cd32",
        linen: "faf0e6",
        magenta: "ff00ff",
        maroon: "800000",
        mediumaquamarine: "66cdaa",
        mediumblue: "0000cd",
        mediumorchid: "ba55d3",
        mediumpurple: "9370d8",
        mediumseagreen: "3cb371",
        mediumslateblue: "7b68ee",
        mediumspringgreen: "00fa9a",
        mediumturquoise: "48d1cc",
        mediumvioletred: "c71585",
        midnightblue: "191970",
        mintcream: "f5fffa",
        mistyrose: "ffe4e1",
        moccasin: "ffe4b5",
        navajowhite: "ffdead",
        navy: "000080",
        oldlace: "fdf5e6",
        olive: "808000",
        olivedrab: "6b8e23",
        orange: "ffa500",
        orangered: "ff4500",
        orchid: "da70d6",
        palegoldenrod: "eee8aa",
        palegreen: "98fb98",
        paleturquoise: "afeeee",
        palevioletred: "d87093",
        papayawhip: "ffefd5",
        peachpuff: "ffdab9",
        peru: "cd853f",
        pink: "ffc0cb",
        plum: "dda0dd",
        powderblue: "b0e0e6",
        purple: "800080",
        red: "ff0000",
        rosybrown: "bc8f8f",
        royalblue: "4169e1",
        saddlebrown: "8b4513",
        salmon: "fa8072",
        sandybrown: "f4a460",
        seagreen: "2e8b57",
        seashell: "fff5ee",
        sienna: "a0522d",
        silver: "c0c0c0",
        skyblue: "87ceeb",
        slateblue: "6a5acd",
        slategray: "708090",
        snow: "fffafa",
        springgreen: "00ff7f",
        steelblue: "4682b4",
        tan: "d2b48c",
        teal: "008080",
        thistle: "d8bfd8",
        tomato: "ff6347",
        turquoise: "40e0d0",
        violet: "ee82ee",
        wheat: "f5deb3",
        white: "ffffff",
        whitesmoke: "f5f5f5",
        yellow: "ffff00",
        yellowgreen: "9acd32",
        transparent: "transparent"
    }, b.prototype = {
        constructor: b,
        colors: {},
        predefinedColors: {},
        getValue: function() {
            return this.value
        },
        setValue: function(a) {
            this.value = a
        },
        _sanitizeNumber: function(a) {
            return "number" == typeof a ? a : isNaN(a) || null === a || "" === a || void 0 === a ? 1 : "" === a ? 0 : "undefined" != typeof a.toLowerCase ? (a.match(/^\./) && (a = "0" + a), Math.ceil(100 * parseFloat(a)) / 100) : 1
        },
        isTransparent: function(a) {
            return !(!a || !("string" == typeof a || a instanceof String)) && (a = a.toLowerCase().trim(), "transparent" === a || a.match(/#?00000000/) || a.match(/(rgba|hsla)\(0,0,0,0?\.?0\)/))
        },
        rgbaIsTransparent: function(a) {
            return 0 === a.r && 0 === a.g && 0 === a.b && 0 === a.a
        },
        setColor: function(a) {
            if (a = a.toLowerCase().trim()) {
                if (this.isTransparent(a)) return this.value = {
                    h: 0,
                    s: 0,
                    b: 0,
                    a: 0
                }, !0;
                var b = this.parse(a);
                b ? (this.value = this.value = {
                    h: b.h,
                    s: b.s,
                    b: b.b,
                    a: b.a
                }, this.origFormat || (this.origFormat = b.format)) : this.fallbackValue && (this.value = this.fallbackValue)
            }
            return !1
        },
        setHue: function(a) {
            this.value.h = 1 - a
        },
        setSaturation: function(a) {
            this.value.s = a
        },
        setBrightness: function(a) {
            this.value.b = 1 - a
        },
        setAlpha: function(a) {
            this.value.a = Math.round(parseInt(100 * (1 - a), 10) / 100 * 100) / 100
        },
        toRGB: function(a, b, c, d) {
            0 === arguments.length && (a = this.value.h, b = this.value.s, c = this.value.b, d = this.value.a), a *= 360;
            var e, f, g, h, i;
            return a = a % 360 / 60, i = c * b, h = i * (1 - Math.abs(a % 2 - 1)), e = f = g = c - i, a = ~~a, e += [i, h, 0, 0, h, i][a], f += [h, i, i, h, 0, 0][a], g += [0, 0, h, i, i, h][a], {
                r: Math.round(255 * e),
                g: Math.round(255 * f),
                b: Math.round(255 * g),
                a: d
            }
        },
        toHex: function(a, b, c, d) {
            0 === arguments.length && (a = this.value.h, b = this.value.s, c = this.value.b, d = this.value.a);
            var e = this.toRGB(a, b, c, d);
            if (this.rgbaIsTransparent(e)) return "transparent";
            var f = (this.hexNumberSignPrefix ? "#" : "") + ((1 << 24) + (parseInt(e.r) << 16) + (parseInt(e.g) << 8) + parseInt(e.b)).toString(16).slice(1);
            return f
        },
        toHSL: function(a, b, c, d) {
            0 === arguments.length && (a = this.value.h, b = this.value.s, c = this.value.b, d = this.value.a);
            var e = a,
                f = (2 - b) * c,
                g = b * c;
            return g /= f > 0 && f <= 1 ? f : 2 - f, f /= 2, g > 1 && (g = 1), {
                h: isNaN(e) ? 0 : e,
                s: isNaN(g) ? 0 : g,
                l: isNaN(f) ? 0 : f,
                a: isNaN(d) ? 0 : d
            }
        },
        toAlias: function(a, b, c, d) {
            var e, f = 0 === arguments.length ? this.toHex() : this.toHex(a, b, c, d),
                g = "alias" === this.origFormat ? f : this.toString(this.origFormat, !1);
            for (var h in this.colors)
                if (e = this.colors[h].toLowerCase().trim(), e === f || e === g) return h;
            return !1
        },
        RGBtoHSB: function(a, b, c, d) {
            a /= 255, b /= 255, c /= 255;
            var e, f, g, h;
            return g = Math.max(a, b, c), h = g - Math.min(a, b, c), e = 0 === h ? null : g === a ? (b - c) / h : g === b ? (c - a) / h + 2 : (a - b) / h + 4, e = (e + 360) % 6 * 60 / 360, f = 0 === h ? 0 : h / g, {
                h: this._sanitizeNumber(e),
                s: f,
                b: g,
                a: this._sanitizeNumber(d)
            }
        },
        HueToRGB: function(a, b, c) {
            return c < 0 ? c += 1 : c > 1 && (c -= 1), 6 * c < 1 ? a + (b - a) * c * 6 : 2 * c < 1 ? b : 3 * c < 2 ? a + (b - a) * (2 / 3 - c) * 6 : a
        },
        HSLtoRGB: function(a, b, c, d) {
            b < 0 && (b = 0);
            var e;
            e = c <= .5 ? c * (1 + b) : c + b - c * b;
            var f = 2 * c - e,
                g = a + 1 / 3,
                h = a,
                i = a - 1 / 3,
                j = Math.round(255 * this.HueToRGB(f, e, g)),
                k = Math.round(255 * this.HueToRGB(f, e, h)),
                l = Math.round(255 * this.HueToRGB(f, e, i));
            return [j, k, l, this._sanitizeNumber(d)]
        },
        parse: function(b) {
            if (0 === arguments.length) return !1;
            var c, d, e = this,
                f = !1,
                g = "undefined" != typeof this.colors[b];
            return g && (b = this.colors[b].toLowerCase().trim()), a.each(this.stringParsers, function(a, h) {
                var i = h.re.exec(b);
                return c = i && h.parse.apply(e, [i]), !c || (f = {}, d = g ? "alias" : h.format ? h.format : e.getValidFallbackFormat(), f = d.match(/hsla?/) ? e.RGBtoHSB.apply(e, e.HSLtoRGB.apply(e, c)) : e.RGBtoHSB.apply(e, c), f instanceof Object && (f.format = d), !1)
            }), f
        },
        getValidFallbackFormat: function() {
            var a = ["rgba", "rgb", "hex", "hsla", "hsl"];
            return this.origFormat && a.indexOf(this.origFormat) !== -1 ? this.origFormat : this.fallbackFormat && a.indexOf(this.fallbackFormat) !== -1 ? this.fallbackFormat : "rgba"
        },
        toString: function(a, c) {
            a = a || this.origFormat || this.fallbackFormat, c = c || !1;
            var d = !1;
            switch (a) {
                case "rgb":
                    return d = this.toRGB(), this.rgbaIsTransparent(d) ? "transparent" : "rgb(" + d.r + "," + d.g + "," + d.b + ")";
                case "rgba":
                    return d = this.toRGB(), "rgba(" + d.r + "," + d.g + "," + d.b + "," + d.a + ")";
                case "hsl":
                    return d = this.toHSL(), "hsl(" + Math.round(360 * d.h) + "," + Math.round(100 * d.s) + "%," + Math.round(100 * d.l) + "%)";
                case "hsla":
                    return d = this.toHSL(), "hsla(" + Math.round(360 * d.h) + "," + Math.round(100 * d.s) + "%," + Math.round(100 * d.l) + "%," + d.a + ")";
                case "hex":
                    return this.toHex();
                case "alias":
                    return d = this.toAlias(), d === !1 ? this.toString(this.getValidFallbackFormat()) : c && !(d in b.webColors) && d in this.predefinedColors ? this.predefinedColors[d] : d;
                default:
                    return d
            }
        },
        stringParsers: [{
            re: /rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*?\)/,
            format: "rgb",
            parse: function(a) {
                return [a[1], a[2], a[3], 1]
            }
        }, {
            re: /rgb\(\s*(\d*(?:\.\d+)?)\%\s*,\s*(\d*(?:\.\d+)?)\%\s*,\s*(\d*(?:\.\d+)?)\%\s*?\)/,
            format: "rgb",
            parse: function(a) {
                return [2.55 * a[1], 2.55 * a[2], 2.55 * a[3], 1]
            }
        }, {
            re: /rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d*(?:\.\d+)?)\s*)?\)/,
            format: "rgba",
            parse: function(a) {
                return [a[1], a[2], a[3], a[4]]
            }
        }, {
            re: /rgba\(\s*(\d*(?:\.\d+)?)\%\s*,\s*(\d*(?:\.\d+)?)\%\s*,\s*(\d*(?:\.\d+)?)\%\s*(?:,\s*(\d*(?:\.\d+)?)\s*)?\)/,
            format: "rgba",
            parse: function(a) {
                return [2.55 * a[1], 2.55 * a[2], 2.55 * a[3], a[4]]
            }
        }, {
            re: /hsl\(\s*(\d*(?:\.\d+)?)\s*,\s*(\d*(?:\.\d+)?)\%\s*,\s*(\d*(?:\.\d+)?)\%\s*?\)/,
            format: "hsl",
            parse: function(a) {
                return [a[1] / 360, a[2] / 100, a[3] / 100, a[4]]
            }
        }, {
            re: /hsla\(\s*(\d*(?:\.\d+)?)\s*,\s*(\d*(?:\.\d+)?)\%\s*,\s*(\d*(?:\.\d+)?)\%\s*(?:,\s*(\d*(?:\.\d+)?)\s*)?\)/,
            format: "hsla",
            parse: function(a) {
                return [a[1] / 360, a[2] / 100, a[3] / 100, a[4]]
            }
        }, {
            re: /#?([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,
            format: "hex",
            parse: function(a) {
                return [parseInt(a[1], 16), parseInt(a[2], 16), parseInt(a[3], 16), 1]
            }
        }, {
            re: /#?([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/,
            format: "hex",
            parse: function(a) {
                return [parseInt(a[1] + a[1], 16), parseInt(a[2] + a[2], 16), parseInt(a[3] + a[3], 16), 1]
            }
        }],
        colorNameToHex: function(a) {
            return "undefined" != typeof this.colors[a.toLowerCase()] && this.colors[a.toLowerCase()]
        }
    };
    var c = {
            horizontal: !1,
            inline: !1,
            color: !1,
            format: !1,
            input: "input",
            container: !1,
            component: ".add-on, .input-group-addon",
            fallbackColor: !1,
            fallbackFormat: "hex",
            hexNumberSignPrefix: !0,
            sliders: {
                saturation: {
                    maxLeft: 100,
                    maxTop: 100,
                    callLeft: "setSaturation",
                    callTop: "setBrightness"
                },
                hue: {
                    maxLeft: 0,
                    maxTop: 100,
                    callLeft: !1,
                    callTop: "setHue"
                },
                alpha: {
                    maxLeft: 0,
                    maxTop: 100,
                    callLeft: !1,
                    callTop: "setAlpha"
                }
            },
            slidersHorz: {
                saturation: {
                    maxLeft: 100,
                    maxTop: 100,
                    callLeft: "setSaturation",
                    callTop: "setBrightness"
                },
                hue: {
                    maxLeft: 100,
                    maxTop: 0,
                    callLeft: "setHue",
                    callTop: !1
                },
                alpha: {
                    maxLeft: 100,
                    maxTop: 0,
                    callLeft: "setAlpha",
                    callTop: !1
                }
            },
            template: '<div class="colorpicker dropdown-menu"><div class="colorpicker-saturation"><i><b></b></i></div><div class="colorpicker-hue"><i></i></div><div class="colorpicker-alpha"><i></i></div><div class="colorpicker-color"><div /></div><div class="colorpicker-selectors"></div></div>',
            align: "right",
            customClass: null,
            colorSelectors: null
        },
        d = function(b, d) {
            this.element = a(b).addClass("colorpicker-element"), this.options = a.extend(!0, {}, c, this.element.data(), d), this.component = this.options.component, this.component = this.component !== !1 && this.element.find(this.component), this.component && 0 === this.component.length && (this.component = !1), this.container = this.options.container === !0 ? this.element : this.options.container, this.container = this.container !== !1 && a(this.container), this.input = this.element.is("input") ? this.element : !!this.options.input && this.element.find(this.options.input), this.input && 0 === this.input.length && (this.input = !1), this.color = this.createColor(this.options.color !== !1 ? this.options.color : this.getValue()), this.format = this.options.format !== !1 ? this.options.format : this.color.origFormat, this.options.color !== !1 && (this.updateInput(this.color), this.updateData(this.color));
            var e = this.picker = a(this.options.template);
            if (this.options.customClass && e.addClass(this.options.customClass), this.options.inline ? e.addClass("colorpicker-inline colorpicker-visible") : e.addClass("colorpicker-hidden"), this.options.horizontal && e.addClass("colorpicker-horizontal"), ["rgba", "hsla", "alias"].indexOf(this.format) === -1 && this.options.format !== !1 && "transparent" !== this.getValue() || e.addClass("colorpicker-with-alpha"), "right" === this.options.align && e.addClass("colorpicker-right"), this.options.inline === !0 && e.addClass("colorpicker-no-arrow"), this.options.colorSelectors) {
                var f = this,
                    g = f.picker.find(".colorpicker-selectors");
                g.length > 0 && (a.each(this.options.colorSelectors, function(b, c) {
                    var d = a("<i />").addClass("colorpicker-selectors-color").css("background-color", c).data("class", b).data("alias", b);
                    d.on("mousedown.colorpicker touchstart.colorpicker", function(b) {
                        b.preventDefault(), f.setValue("alias" === f.format ? a(this).data("alias") : a(this).css("background-color"))
                    }), g.append(d)
                }), g.show().addClass("colorpicker-visible"))
            }
            e.on("mousedown.colorpicker touchstart.colorpicker", a.proxy(function(a) {
                a.target === a.currentTarget && a.preventDefault()
            }, this)), e.find(".colorpicker-saturation, .colorpicker-hue, .colorpicker-alpha").on("mousedown.colorpicker touchstart.colorpicker", a.proxy(this.mousedown, this)), e.appendTo(this.container ? this.container : a("body")), this.input !== !1 && (this.input.on({
                "keyup.colorpicker": a.proxy(this.keyup, this)
            }), this.input.on({
                "change.colorpicker": a.proxy(this.change, this)
            }), this.component === !1 && this.element.on({
                "focus.colorpicker": a.proxy(this.show, this)
            }), this.options.inline === !1 && this.element.on({
                "focusout.colorpicker": a.proxy(this.hide, this)
            })), this.component !== !1 && this.component.on({
                "click.colorpicker": a.proxy(this.show, this)
            }), this.input === !1 && this.component === !1 && this.element.on({
                "click.colorpicker": a.proxy(this.show, this)
            }), this.input !== !1 && this.component !== !1 && "color" === this.input.attr("type") && this.input.on({
                "click.colorpicker": a.proxy(this.show, this),
                "focus.colorpicker": a.proxy(this.show, this)
            }), this.update(), a(a.proxy(function() {
                this.element.trigger("create")
            }, this))
        };
    d.Color = b, d.prototype = {
        constructor: d,
        destroy: function() {
            this.picker.remove(), this.element.removeData("colorpicker", "color").off(".colorpicker"), this.input !== !1 && this.input.off(".colorpicker"), this.component !== !1 && this.component.off(".colorpicker"), this.element.removeClass("colorpicker-element"), this.element.trigger({
                type: "destroy"
            })
        },
        reposition: function() {
            if (this.options.inline !== !1 || this.options.container) return !1;
            var a = this.container && this.container[0] !== window.document.body ? "position" : "offset",
                b = this.component || this.element,
                c = b[a]();
            "right" === this.options.align && (c.left -= this.picker.outerWidth() - b.outerWidth()), this.picker.css({
                top: c.top + b.outerHeight(),
                left: c.left
            })
        },
        show: function(b) {
            this.isDisabled() || (this.picker.addClass("colorpicker-visible").removeClass("colorpicker-hidden"), this.reposition(), a(window).on("resize.colorpicker", a.proxy(this.reposition, this)), !b || this.hasInput() && "color" !== this.input.attr("type") || b.stopPropagation && b.preventDefault && (b.stopPropagation(), b.preventDefault()), !this.component && this.input || this.options.inline !== !1 || a(window.document).on({
                "mousedown.colorpicker": a.proxy(this.hide, this)
            }), this.element.trigger({
                type: "showPicker",
                color: this.color
            }))
        },
        hide: function(b) {
            return ("undefined" == typeof b || !b.target || !(a(b.currentTarget).parents(".colorpicker").length > 0 || a(b.target).parents(".colorpicker").length > 0)) && (this.picker.addClass("colorpicker-hidden").removeClass("colorpicker-visible"), a(window).off("resize.colorpicker", this.reposition), a(window.document).off({
                "mousedown.colorpicker": this.hide
            }), this.update(), void this.element.trigger({
                type: "hidePicker",
                color: this.color
            }))
        },
        updateData: function(a) {
            return a = a || this.color.toString(this.format, !1), this.element.data("color", a), a
        },
        updateInput: function(a) {
            return a = a || this.color.toString(this.format, !1), this.input !== !1 && (this.input.prop("value", a), this.input.trigger("change")), a
        },
        updatePicker: function(a) {
            "undefined" != typeof a && (this.color = this.createColor(a));
            var b = this.options.horizontal === !1 ? this.options.sliders : this.options.slidersHorz,
                c = this.picker.find("i");
            if (0 !== c.length) return this.options.horizontal === !1 ? (b = this.options.sliders, c.eq(1).css("top", b.hue.maxTop * (1 - this.color.value.h)).end().eq(2).css("top", b.alpha.maxTop * (1 - this.color.value.a))) : (b = this.options.slidersHorz, c.eq(1).css("left", b.hue.maxLeft * (1 - this.color.value.h)).end().eq(2).css("left", b.alpha.maxLeft * (1 - this.color.value.a))), c.eq(0).css({
                top: b.saturation.maxTop - this.color.value.b * b.saturation.maxTop,
                left: this.color.value.s * b.saturation.maxLeft
            }), this.picker.find(".colorpicker-saturation").css("backgroundColor", (this.options.hexNumberSignPrefix ? "" : "#") + this.color.toHex(this.color.value.h, 1, 1, 1)), this.picker.find(".colorpicker-alpha").css("backgroundColor", (this.options.hexNumberSignPrefix ? "" : "#") + this.color.toHex()), this.picker.find(".colorpicker-color, .colorpicker-color div").css("backgroundColor", this.color.toString(this.format, !0)), a
        },
        updateComponent: function(a) {
            var b;
            if (b = "undefined" != typeof a ? this.createColor(a) : this.color, this.component !== !1) {
                var c = this.component.find("i").eq(0);
                c.length > 0 ? c.css({
                    backgroundColor: b.toString(this.format, !0)
                }) : this.component.css({
                    backgroundColor: b.toString(this.format, !0)
                })
            }
            return b.toString(this.format, !1)
        },
        update: function(a) {
            var b;
            return this.getValue(!1) === !1 && a !== !0 || (b = this.updateComponent(), this.updateInput(b), this.updateData(b), this.updatePicker()), b
        },
        setValue: function(a) {
            this.color = this.createColor(a), this.update(!0), this.element.trigger({
                type: "changeColor",
                color: this.color,
                value: a
            })
        },
        createColor: function(a) {
            return new b(a ? a : null, this.options.colorSelectors, this.options.fallbackColor ? this.options.fallbackColor : this.color, this.options.fallbackFormat, this.options.hexNumberSignPrefix)
        },
        getValue: function(a) {
            a = "undefined" == typeof a ? this.options.fallbackColor : a;
            var b;
            return b = this.hasInput() ? this.input.val() : this.element.data("color"), void 0 !== b && "" !== b && null !== b || (b = a), b
        },
        hasInput: function() {
            return this.input !== !1
        },
        isDisabled: function() {
            return !!this.hasInput() && this.input.prop("disabled") === !0
        },
        disable: function() {
            return !!this.hasInput() && (this.input.prop("disabled", !0), this.element.trigger({
                type: "disable",
                color: this.color,
                value: this.getValue()
            }), !0)
        },
        enable: function() {
            return !!this.hasInput() && (this.input.prop("disabled", !1), this.element.trigger({
                type: "enable",
                color: this.color,
                value: this.getValue()
            }), !0)
        },
        currentSlider: null,
        mousePointer: {
            left: 0,
            top: 0
        },
        mousedown: function(b) {
            !b.pageX && !b.pageY && b.originalEvent && b.originalEvent.touches && (b.pageX = b.originalEvent.touches[0].pageX, b.pageY = b.originalEvent.touches[0].pageY), b.stopPropagation(), b.preventDefault();
            var c = a(b.target),
                d = c.closest("div"),
                e = this.options.horizontal ? this.options.slidersHorz : this.options.sliders;
            if (!d.is(".colorpicker")) {
                if (d.is(".colorpicker-saturation")) this.currentSlider = a.extend({}, e.saturation);
                else if (d.is(".colorpicker-hue")) this.currentSlider = a.extend({}, e.hue);
                else {
                    if (!d.is(".colorpicker-alpha")) return !1;
                    this.currentSlider = a.extend({}, e.alpha)
                }
                var f = d.offset();
                this.currentSlider.guide = d.find("i")[0].style, this.currentSlider.left = b.pageX - f.left, this.currentSlider.top = b.pageY - f.top, this.mousePointer = {
                    left: b.pageX,
                    top: b.pageY
                }, a(window.document).on({
                    "mousemove.colorpicker": a.proxy(this.mousemove, this),
                    "touchmove.colorpicker": a.proxy(this.mousemove, this),
                    "mouseup.colorpicker": a.proxy(this.mouseup, this),
                    "touchend.colorpicker": a.proxy(this.mouseup, this)
                }).trigger("mousemove")
            }
            return !1
        },
        mousemove: function(a) {
            !a.pageX && !a.pageY && a.originalEvent && a.originalEvent.touches && (a.pageX = a.originalEvent.touches[0].pageX, a.pageY = a.originalEvent.touches[0].pageY), a.stopPropagation(), a.preventDefault();
            var b = Math.max(0, Math.min(this.currentSlider.maxLeft, this.currentSlider.left + ((a.pageX || this.mousePointer.left) - this.mousePointer.left))),
                c = Math.max(0, Math.min(this.currentSlider.maxTop, this.currentSlider.top + ((a.pageY || this.mousePointer.top) - this.mousePointer.top)));
            return this.currentSlider.guide.left = b + "px", this.currentSlider.guide.top = c + "px", this.currentSlider.callLeft && this.color[this.currentSlider.callLeft].call(this.color, b / this.currentSlider.maxLeft), this.currentSlider.callTop && this.color[this.currentSlider.callTop].call(this.color, c / this.currentSlider.maxTop), this.options.format !== !1 || "setAlpha" !== this.currentSlider.callTop && "setAlpha" !== this.currentSlider.callLeft || (1 !== this.color.value.a ? (this.format = "rgba", this.color.origFormat = "rgba") : (this.format = "hex", this.color.origFormat = "hex")), this.update(!0), this.element.trigger({
                type: "changeColor",
                color: this.color
            }), !1
        },
        mouseup: function(b) {
            return b.stopPropagation(), b.preventDefault(), a(window.document).off({
                "mousemove.colorpicker": this.mousemove,
                "touchmove.colorpicker": this.mousemove,
                "mouseup.colorpicker": this.mouseup,
                "touchend.colorpicker": this.mouseup
            }), !1
        },
        change: function(a) {
            this.keyup(a)
        },
        keyup: function(a) {
            38 === a.keyCode ? (this.color.value.a < 1 && (this.color.value.a = Math.round(100 * (this.color.value.a + .01)) / 100), this.update(!0)) : 40 === a.keyCode ? (this.color.value.a > 0 && (this.color.value.a = Math.round(100 * (this.color.value.a - .01)) / 100), this.update(!0)) : (this.color = this.createColor(this.input.val()), this.color.origFormat && this.options.format === !1 && (this.format = this.color.origFormat), this.getValue(!1) !== !1 && (this.updateData(), this.updateComponent(), this.updatePicker())), this.element.trigger({
                type: "changeColor",
                color: this.color,
                value: this.input.val()
            })
        }
    }, a.colorpicker = d, a.fn.colorpicker = function(b) {
        var c = Array.prototype.slice.call(arguments, 1),
            e = 1 === this.length,
            f = null,
            g = this.each(function() {
                var e = a(this),
                    g = e.data("colorpicker"),
                    h = "object" == typeof b ? b : {};
                g || (g = new d(this, h), e.data("colorpicker", g)), "string" == typeof b ? a.isFunction(g[b]) ? f = g[b].apply(g, c) : (c.length && (g[b] = c[0]), f = g[b]) : f = e
            });
        return e ? f : g
    }, a.fn.colorpicker.constructor = d
});
$(document).ready(function() {
    if ($('.select-admin-layout').length) {

        form_layout($('.select-admin-layout'));

        $(".select-admin-layout").change(function() {
            form_layout($(this));
        });


    }
});


function form_layout(el) {
    var clss = el.val();
    var parent = el.parent().parent();
    parent.children('.form-group.opt').each(function() {
        // $(this).addClass(clss);
        if ($(this).hasClass(clss)) {
            $(this).show();
        } else {
            $(this).hide();
        }

    });
}

$('nav .js-dropdown-toggle').click(function(e) {
    e.preventDefault;
    if ($(this).find('.js-dropdown-content').html() == $('.js-dropdown-menu').html()) {
        $(this).removeClass('js-dropdown-active');
        $('.nav--secondary').slideUp(100);
        $('.js-dropdown-menu').empty();
    } else {
        $('.js-dropdown-toggle').removeClass('js-dropdown-active');
        $('.js-dropdown-menu').html($(this).find('.js-dropdown-content').html());
        $('.nav--secondary').slideDown(100);
        $(this).addClass('js-dropdown-active');
    }
});

$(document).ready(function() {

    // ----- Markdown editor ----- //
    // https://github.com/NextStepWebs/simplemde-markdown-editor

    if ($('.md-editor').length) {
        // Loop editors
        $('.md-editor').each(function() {
            var simplemde = new SimpleMDE({
                element: this,
                toolbar: [
                    "heading-3", "bold", "italic", "|", "quote", "ordered-list", "unordered-list", "link", "|", "preview", "side-by-side", "fullscreen", "|",
                    {
                        name: "help",
                        action: function customFunction(editor) {
                            window.open('http://variable.club/_docs/markdown-guide.html', '_blank');
                        },
                        className: "fa fa-question-circle",
                        title: "Help",
                    }
                ],
            });
            // simplemde.render();

            inlineAttachment.editors.codemirror4.attach(simplemde.codemirror, {
                uploadUrl: admin_url + '/fileupload',
                allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'application/pdf'],
                extraHeaders: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                // Controller Response
                onFileUploadResponse: function(xhr) {
                    var result = JSON.parse(xhr.responseText),
                        filename = result[this.settings.jsonFieldName];

                    if (result && filename) {
                        var newValue;
                        // Test si pdf > change l'insert Markdown
                        if (result.extension == 'pdf') {
                            urlText = '[' + result.name + ']({filename})';
                        } else {
                            urlText = this.settings.urlText;
                        }
                        if (typeof urlText === 'function') {
                            newValue = urlText.call(this, filename, result);
                        } else {
                            newValue = urlText.replace(this.filenameTag, filename);
                        }
                        var text = this.editor.getValue().replace(this.lastValue, newValue);
                        this.editor.setValue(text);
                        this.settings.onFileUploaded.call(this, filename);
                    }
                    return false;
                }
            });
            // Relaunch simplemde on tab change
            $('.tab-select li').click(function(e) {
                setTimeout(function() {
                    simplemde.codemirror.refresh();
                }, 10);
            });
        })
    }

});

$(document).on('click', 'a[data-toggle="modal"]', function(e) {
    e.preventDefault();
    $($(this).attr('data-target')).fadeIn(250);
});

$(document).on('click', '*[data-dismiss="modal"]', function(e) {
    e.preventDefault();
    $(this).parents('.modal').fadeOut(250);
});

$(document).keyup(function(e) {
    if (e.keyCode == 27) { // escape key maps to keycode `27`
        $(".modal").fadeOut(250);
    }
});

// if ( $('table #sortable').length ){
//
//   var list = document.getElementById("sortable");
//   Sortable.create(list,{
//     onUpdate: function (evt) {
//       var mediatable_type = evt.item.getAttribute('data-mediatable-type');
//       var article_id      = evt.item.getAttribute('data-article-id');
//       var parent_id       = evt.item.getAttribute('data-parent-id');
//       var new_order       = evt.newIndex;
//       if (article_id && mediatable_type) {
//         jQuery.ajax({
//           url: admin_url + '/' + mediatable_type + '/reorder',
//           data: {
//             'id'        : article_id,
//             'parent_id' : parent_id,
//             'new_order' : new_order,
//           },
//           type: 'POST',
//           success: function(response){
//             if(response.status == 'success'){
//               //$('<span class="message pull-right">Updated !</span>').appendTo(".panel-mediagallery .panel-heading").fadeOut(3000);
//             }
//           }
//         });
//       }
//     }
//   });
// }

$('.tab-select li').click(function(e) {
    $('.tab-select li').removeClass('active');
    $('.tab-content .tab-pane').removeClass('active');
    var selected_tab = $(this).data('tab');
    $(this).addClass('active');
    $('.tab-content').find('#tab' + selected_tab).addClass('active');
});

$(document).ready(function() {

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    // ----- Date picker ----- //
    // http://eonasdan.github.io/bootstrap-datetimepicker/

    if ($('.datepicker').length) {
        $('.datepicker').datetimepicker({
            locale: 'en',
            format: 'DD/MM/YYYY'
        });
    }


    // ----- Tags list select ----- //
    if ($('.select2').length) {
        $('.select2').select2({
            placeholder: 'Select or add something',
            tags: true,
            tokenSeparators: [","],
            allowClear: true,
        });
    }


    // ----- Color picker ----- //
    if ($('.color-picker').length) {
        $('.color-picker').colorpicker({ /*options...*/ });
    }

    // ----- Hide index alerts ----- //

    window.setTimeout(function() {
        $(".alert").fadeOut(600);
    }, 2000);

    window.setTimeout(function() {
        $(".help-block").fadeOut(600);
    }, 5000);

    $("body").on({
        mouseenter: function() {
            $('.help-block').fadeOut(300);
        }
    }, ".help-block");

    $("body").on({
        mouseenter: function() {
            $('.alert').fadeOut(300);
        }
    }, ".alert");
    // ----- Login logo  ----- //

    // var top = Math.floor(Math.random() * (90 - 2 + 1)) + 2;
    // var left = Math.floor(Math.random() * (90 - 2 + 1)) + 2;
    // var n = Math.floor(Math.random() * (11 - 1 + 1)) + 1;
    // var oizo = $('#oizo');
    // oizo.css("left", left + "%");
    // oizo.css("top", top + "%");
    // oizo.css("display", "block");
    // oizo.html('<img src="/assets/admin/images/'+ n +'.png"/>');


});


// ----- Login fantom  ----- //

function getRandomY(bottom, top) {
    return Math.floor(Math.random() * (1 + top - bottom)) + bottom;
}

// fantom
var div = document.getElementById('fantom');

if (typeof(div) != 'undefined' && div != null) {
    // screen limits
    var maxY = $(window).height();
    var maxX = $(window).width();
    var x = 0;
    // move around up and down y
    var range = 20;
    var start_y = getRandomY(range, maxY - range);
    // calculate the sin-values from the angle variable
    // since the Math.sin function is working in radiants
    // we must increase the angle value in small steps -> anglespeed
    // the bigger the anglespeed value is, the wider the sine gets
    var angle = 0;
    var anglespeed = 0.10;
    // speed of the movement - 1 means it increases the x value
    var speed = 1;
    // go
    animate();
}

function animate() {
    x += speed;
    // increase value for sin calculation
    angle += anglespeed;
    // always add to a fixed value
    // multiply with range, sine only delivers values between -1 and 1
    y = start_y + Math.sin(angle) * range;
    if (x > (maxX + 30)) {
        maxY = $(window).height();
        maxX = $(window).width();
        x = 0;
        // increase range
        range += 0.10;
        start_y = getRandomY(range, maxY - range);
    }
    div.style.top = y + "px";
    div.style.left = x + "px";
    setTimeout(animate, 33);
}