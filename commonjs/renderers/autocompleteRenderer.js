"use strict";

require("core-js/modules/es.array.concat");

exports.__esModule = true;
exports.default = void 0;

var _element = require("./../helpers/dom/element");

var _eventManager = _interopRequireDefault(require("./../eventManager"));

var _src = require("./../3rdparty/walkontable/src");

var _index = require("./index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Autocomplete renderer
 *
 * @private
 * @renderer AutocompleteRenderer
 * @param {Object} instance Handsontable instance
 * @param {Element} TD Table cell where to render
 * @param {Number} row
 * @param {Number} col
 * @param {String|Number} prop Row object property name
 * @param value Value to render (remember to escape unsafe HTML before inserting to DOM!)
 * @param {Object} cellProperties Cell properites (shared by cell renderer and editor)
 */
function autocompleteRenderer(instance, TD, row, col, prop, value, cellProperties) {
  var rootDocument = instance.rootDocument;
  var rendererType = cellProperties.allowHtml ? 'html' : 'text';
  var ARROW = rootDocument.createElement('DIV');
  ARROW.className = 'htAutocompleteArrow';
  ARROW.appendChild(rootDocument.createTextNode(String.fromCharCode(9660)));

  for (var _len = arguments.length, args = new Array(_len > 7 ? _len - 7 : 0), _key = 7; _key < _len; _key++) {
    args[_key - 7] = arguments[_key];
  }

  (0, _index.getRenderer)(rendererType).apply(this, [instance, TD, row, col, prop, value, cellProperties].concat(args));

  if (!TD.firstChild) {
    // http://jsperf.com/empty-node-if-needed
    // otherwise empty fields appear borderless in demo/renderers.html (IE)
    TD.appendChild(rootDocument.createTextNode(String.fromCharCode(160))); // workaround for https://github.com/handsontable/handsontable/issues/1946
    // this is faster than innerHTML. See: https://github.com/handsontable/handsontable/wiki/JavaScript-&-DOM-performance-tips
  }

  TD.insertBefore(ARROW, TD.firstChild);
  (0, _element.addClass)(TD, 'htAutocomplete');

  if (!instance.acArrowListener) {
    var eventManager = new _eventManager.default(instance); // not very elegant but easy and fast

    instance.acArrowListener = function (event) {
      if ((0, _element.hasClass)(event.target, 'htAutocompleteArrow')) {
        instance.view.wt.getSetting('onCellDblClick', null, new _src.CellCoords(row, col), TD);
      }
    };

    eventManager.addEventListener(instance.rootElement, 'mousedown', instance.acArrowListener); // We need to unbind the listener after the table has been destroyed

    instance.addHookOnce('afterDestroy', function () {
      eventManager.destroy();
    });
  }
}

var _default = autocompleteRenderer;
exports.default = _default;