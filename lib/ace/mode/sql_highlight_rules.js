/* ***** BEGIN LICENSE BLOCK *****
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * Contributor(s):
 *      Jonathan Camile <jonathan.camile AT gmail DOT com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK *****
 *
 */

define(function(require, exports, module) {

var oop = require("pilot/oop");
var lang = require("pilot/lang");
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

var SqlHighlightRules = function() {

    var keywords = lang.arrayToMap(
        ("select|from|where|and|or|group by|order by|limit|offset|having|as|case|" +
        "when|else|end|type|left|right|join|on|outer").split("|")
    );

    var builtinConstants = lang.arrayToMap(
        ("true|false|null").split("|")
    );

    var builtinFunctions = lang.arrayToMap(
        ("count|min|max|avg|sum|rank|now|coalesce").split("|")
    );

    this.$rules = {
        "start" : [ {
            token : "comment",
            regex : "--.*$"
        }, {
            token : "string",           // multi line " string start
            merge : true,
            regex : '".*$',
            next : "qqstring"
        }, {
            token : "string",           // " string
            regex : '"(?:[^\\\\]|\\\\.)*?"'
        }, {
            token : "string",           // multi line ' string start
            merge : true,
            regex : "'.*$",
            next : "qstring"
        }, {
            token : "string",           // ' string
            regex : "'(?:[^\\\\]|\\\\.)*?'"
        }, {
            token : "constant.numeric", // float
            regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
        }, {
            token : function(value) {
                value = value.toLowerCase();
                if (keywords.hasOwnProperty(value))
                    return "keyword";
                else if (builtinConstants.hasOwnProperty(value))
                    return "constant.language";
                else if (builtinFunctions.hasOwnProperty(value))
                    return "support.function";
                else
                    return "identifier";
            },
            regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        }, {
            token : "keyword.operator",
            regex : "\\+|\\-|\\/|\\/\\/|%|<@>|@>|<@|&|\\^|~|<|>|<=|=>|==|!=|<>|="
        }, {
            token : "lparen.paren",
            regex : "[\\(]"
        }, {
            token : "paren.rparen",
            regex : "[\\)]"
        }, {
            token : "text",
            regex : "\\s+"
        } ],
        "qqstring" : [ {
            token : "string", // multi line " string end
            regex : '(?:[^\\\\]|\\\\.)*?"',
            next : "start"
        }, {
            token : "string",
            merge : true,
            regex : '.+'
        } ],
        "qstring" : [ {
            token : "string",  // multi line ' string end
            regex : "(?:[^\\\\]|\\\\.)*?'",
            next : "start"
        }, {
            token : "string",
            merge : true,
            regex : '.+'
        } ]
    };
};

oop.inherits(SqlHighlightRules, TextHighlightRules);

exports.SqlHighlightRules = SqlHighlightRules;
});

