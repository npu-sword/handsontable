"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.splice");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.get-prototype-of");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.object.set-prototype-of");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.object.values");

require("core-js/modules/es.reflect.get");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.iterator");

exports.__esModule = true;
exports.default = void 0;

var _base = _interopRequireDefault(require("./../_base"));

var _plugins = require("./../../plugins");

var _object = require("./../../helpers/object");

var _number = require("./../../helpers/number");

var _array = require("./../../helpers/array");

var _src = require("./../../3rdparty/walkontable/src");

var C = _interopRequireWildcard(require("./../../i18n/constants"));

var _contextMenuItem = require("./contextMenuItem");

var _utils = require("./utils");

var _selection = require("./../../selection");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class CustomBorders
 * @plugin CustomBorders
 *
 * @description
 * This plugin enables an option to apply custom borders through the context menu (configurable with context menu key
 * `borders`).
 *
 * To initialize Handsontable with predefined custom borders, provide cell coordinates and border styles in a form
 * of an array.
 *
 * See [Custom Borders](http://docs.handsontable.com/demo-custom-borders.html) demo for more examples.
 *
 * @example
 * ```js
 * customBorders: [
 *   {
 *    range: {
 *      from: {
 *        row: 1,
 *        col: 1
 *      },
 *      to: {
 *        row: 3,
 *        col: 4
 *      },
 *    },
 *    left: {},
 *    right: {},
 *    top: {},
 *    bottom: {},
 *   },
 * ],
 *
 * // or
 * customBorders: [
 *   { row: 2,
 *     col: 2,
 *     left: {
 *       width: 2,
 *       color: 'red',
 *     },
 *     right: {
 *       width: 1,
 *       color: 'green',
 *     },
 *     top: '',
 *     bottom: '',
 *   }
 * ],
 * ```
 */
var CustomBorders =
/*#__PURE__*/
function (_BasePlugin) {
  _inherits(CustomBorders, _BasePlugin);

  function CustomBorders(hotInstance) {
    var _this;

    _classCallCheck(this, CustomBorders);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CustomBorders).call(this, hotInstance));
    /**
     * Saved borders.
     *
     * @private
     * @type {Array}
     */

    _this.savedBorders = [];
    return _this;
  }
  /**
  * Checks if the plugin is enabled in the handsontable settings. This method is executed in {@link Hooks#beforeInit}
  * hook and if it returns `true` than the {@link CustomBorders#enablePlugin} method is called.
   *
   * @returns {Boolean}
   */


  _createClass(CustomBorders, [{
    key: "isEnabled",
    value: function isEnabled() {
      return !!this.hot.getSettings().customBorders;
    }
    /**
     * Enables the plugin functionality for this Handsontable instance.
     */

  }, {
    key: "enablePlugin",
    value: function enablePlugin() {
      var _this2 = this;

      if (this.enabled) {
        return;
      }

      this.addHook('afterContextMenuDefaultOptions', function (options) {
        return _this2.onAfterContextMenuDefaultOptions(options);
      });
      this.addHook('init', function () {
        return _this2.onAfterInit();
      });

      _get(_getPrototypeOf(CustomBorders.prototype), "enablePlugin", this).call(this);
    }
    /**
     * Disables the plugin functionality for this Handsontable instance.
     */

  }, {
    key: "disablePlugin",
    value: function disablePlugin() {
      this.hideBorders();

      _get(_getPrototypeOf(CustomBorders.prototype), "disablePlugin", this).call(this);
    }
    /**
     * Updates the plugin state. This method is executed when {@link Core#updateSettings} is invoked.
     */

  }, {
    key: "updatePlugin",
    value: function updatePlugin() {
      this.disablePlugin();
      this.enablePlugin();
      this.changeBorderSettings();

      _get(_getPrototypeOf(CustomBorders.prototype), "updatePlugin", this).call(this);
    }
    /**
      * Set custom borders.
      *
      * @example
      * ```js
      * const customBordersPlugin = hot.getPlugin('customBorders');
      *
      * // Using an array of arrays (produced by `.getSelected()` method).
      * customBordersPlugin.setBorders([[1, 1, 2, 2], [6, 2, 0, 2]], {left: {width: 2, color: 'blue'}});
      * // Using an array of CellRange objects (produced by `.getSelectedRange()` method).
      * customBordersPlugin.setBorders(hot.getSelectedRange(), {left: {hide: false, width: 2, color: 'blue'}});
      * ```
      *
      * @param {Array[]|CellRange[]} selectionRanges Array of selection ranges.
      * @param {Object} borderObject Object with `top`, `right`, `bottom` and `left` properties.
      */

  }, {
    key: "setBorders",
    value: function setBorders(selectionRanges, borderObject) {
      var _this3 = this;

      var defaultBorderKeys = ['top', 'right', 'bottom', 'left'];
      var borderKeys = borderObject ? Object.keys(borderObject) : defaultBorderKeys;
      var selectionType = (0, _selection.detectSelectionType)(selectionRanges);
      var selectionSchemaNormalizer = (0, _selection.normalizeSelectionFactory)(selectionType);
      (0, _array.arrayEach)(selectionRanges, function (selection) {
        var _selectionSchemaNorma = selectionSchemaNormalizer(selection),
            _selectionSchemaNorma2 = _slicedToArray(_selectionSchemaNorma, 4),
            rowStart = _selectionSchemaNorma2[0],
            columnStart = _selectionSchemaNorma2[1],
            rowEnd = _selectionSchemaNorma2[2],
            columnEnd = _selectionSchemaNorma2[3];

        var _loop = function _loop(row) {
          var _loop2 = function _loop2(col) {
            (0, _array.arrayEach)(borderKeys, function (borderKey) {
              _this3.prepareBorderFromCustomAdded(row, col, borderObject, borderKey);
            });
          };

          for (var col = columnStart; col <= columnEnd; col += 1) {
            _loop2(col);
          }
        };

        for (var row = rowStart; row <= rowEnd; row += 1) {
          _loop(row);
        }
      });
      /*
      The line below triggers a re-render of Handsontable. This will be a "fastDraw"
      render, because that is the default for the TableView class.
       The re-render is needed for borders on cells that did not have a border before.
      The way this call works is that it calls Table.refreshSelections, which calls
      Selection.getBorder, which creates a new instance of Border.
       Seems wise to keep this single-direction flow of creating new Borders
      */

      this.hot.view.render();
    }
    /**
      * Get custom borders.
      *
      * @example
      * ```js
      * const customBordersPlugin = hot.getPlugin('customBorders');
      *
      * // Using an array of arrays (produced by `.getSelected()` method).
      * customBordersPlugin.getBorders([[1, 1, 2, 2], [6, 2, 0, 2]]);
      * // Using an array of CellRange objects (produced by `.getSelectedRange()` method).
      * customBordersPlugin.getBorders(hot.getSelectedRange());
      * // Using without param - return all customBorders.
      * customBordersPlugin.getBorders();
      * ```
      *
      * @param {Array[]|CellRange[]} selectionRanges Array of selection ranges.
      * @return {Object[]} Returns array of border objects.
      */

  }, {
    key: "getBorders",
    value: function getBorders(selectionRanges) {
      var _this4 = this;

      if (!Array.isArray(selectionRanges)) {
        return this.savedBorders;
      }

      var selectionType = (0, _selection.detectSelectionType)(selectionRanges);
      var selectionSchemaNormalizer = (0, _selection.normalizeSelectionFactory)(selectionType);
      var selectedBorders = [];
      (0, _array.arrayEach)(selectionRanges, function (selection) {
        var _selectionSchemaNorma3 = selectionSchemaNormalizer(selection),
            _selectionSchemaNorma4 = _slicedToArray(_selectionSchemaNorma3, 4),
            rowStart = _selectionSchemaNorma4[0],
            columnStart = _selectionSchemaNorma4[1],
            rowEnd = _selectionSchemaNorma4[2],
            columnEnd = _selectionSchemaNorma4[3];

        var _loop3 = function _loop3(row) {
          var _loop4 = function _loop4(col) {
            (0, _array.arrayEach)(_this4.savedBorders, function (border) {
              if (border.row === row && border.col === col) {
                selectedBorders.push(border);
              }
            });
          };

          for (var col = columnStart; col <= columnEnd; col += 1) {
            _loop4(col);
          }
        };

        for (var row = rowStart; row <= rowEnd; row += 1) {
          _loop3(row);
        }
      });
      return selectedBorders;
    }
    /**
      * Clear custom borders.
      *
      * @example
      * ```js
      * const customBordersPlugin = hot.getPlugin('customBorders');
      *
      * // Using an array of arrays (produced by `.getSelected()` method).
      * customBordersPlugin.clearBorders([[1, 1, 2, 2], [6, 2, 0, 2]]);
      * // Using an array of CellRange objects (produced by `.getSelectedRange()` method).
      * customBordersPlugin.clearBorders(hot.getSelectedRange());
      * // Using without param - clear all customBorders.
      * customBordersPlugin.clearBorders();
      * ```
      *
      * @param {Array[]|CellRange[]} selectionRanges Array of selection ranges.
      */

  }, {
    key: "clearBorders",
    value: function clearBorders(selectionRanges) {
      var _this5 = this;

      if (selectionRanges) {
        this.setBorders(selectionRanges);
      } else {
        (0, _array.arrayEach)(this.savedBorders, function (border) {
          _this5.clearBordersFromSelectionSettings(border.id);

          _this5.clearNullCellRange();

          _this5.hot.removeCellMeta(border.row, border.col, 'borders');
        });
        this.savedBorders.length = 0;
      }
    }
    /**
     * Insert WalkontableSelection instance into Walkontable settings.
     *
     * @private
     * @param {Object} border Object with `row` and `col`, `left`, `right`, `top` and `bottom`, `id` and `border` ({Object} with `color`, `width` and `cornerVisible` property) properties.
     * @param {String} place Coordinate where add/remove border - `top`, `bottom`, `left`, `right`.
     */

  }, {
    key: "insertBorderIntoSettings",
    value: function insertBorderIntoSettings(border, place) {
      var hasSavedBorders = this.checkSavedBorders(border);

      if (!hasSavedBorders) {
        this.savedBorders.push(border);
      }

      var coordinates = {
        row: border.row,
        col: border.col
      };
      var cellRange = new _src.CellRange(coordinates, coordinates, coordinates);
      var hasCustomSelections = this.checkCustomSelections(border, cellRange, place);

      if (!hasCustomSelections) {
        this.hot.selection.highlight.addCustomSelection({
          border: border,
          cellRange: cellRange
        });
      }
    }
    /**
     * Prepare borders from setting (single cell).
     *
     * @private
     * @param {Number} row Visual row index.
     * @param {Number} column Visual column index.
     * @param {Object} borderDescriptor Object with `row` and `col`, `left`, `right`, `top` and `bottom` properties.
     * @param {String} place Coordinate where add/remove border - `top`, `bottom`, `left`, `right`.
     */

  }, {
    key: "prepareBorderFromCustomAdded",
    value: function prepareBorderFromCustomAdded(row, column, borderDescriptor, place) {
      var border = (0, _utils.createEmptyBorders)(row, column);

      if (borderDescriptor) {
        border = (0, _utils.extendDefaultBorder)(border, borderDescriptor);
        (0, _array.arrayEach)(this.hot.selection.highlight.customSelections, function (customSelection) {
          if (border.id === customSelection.settings.id) {
            Object.assign(customSelection.settings, borderDescriptor);
            border = customSelection.settings;
            return false; // breaks forAll
          }
        });
      }

      this.hot.setCellMeta(row, column, 'borders', border);
      this.insertBorderIntoSettings(border, place);
    }
    /**
     * Prepare borders from setting (object).
     *
     * @private
     * @param {Object} rowDecriptor Object with `range`, `left`, `right`, `top` and `bottom` properties.
     */

  }, {
    key: "prepareBorderFromCustomAddedRange",
    value: function prepareBorderFromCustomAddedRange(rowDecriptor) {
      var _this6 = this;

      var range = rowDecriptor.range;
      (0, _number.rangeEach)(range.from.row, range.to.row, function (rowIndex) {
        (0, _number.rangeEach)(range.from.col, range.to.col, function (colIndex) {
          var border = (0, _utils.createEmptyBorders)(rowIndex, colIndex);
          var add = 0;

          if (rowIndex === range.from.row) {
            if ((0, _object.hasOwnProperty)(rowDecriptor, 'top')) {
              add += 1;
              border.top = rowDecriptor.top;
            }
          }

          if (rowIndex === range.to.row) {
            if ((0, _object.hasOwnProperty)(rowDecriptor, 'bottom')) {
              add += 1;
              border.bottom = rowDecriptor.bottom;
            }
          }

          if (colIndex === range.from.col) {
            if ((0, _object.hasOwnProperty)(rowDecriptor, 'left')) {
              add += 1;
              border.left = rowDecriptor.left;
            }
          }

          if (colIndex === range.to.col) {
            if ((0, _object.hasOwnProperty)(rowDecriptor, 'right')) {
              add += 1;
              border.right = rowDecriptor.right;
            }
          }

          if (add > 0) {
            _this6.hot.setCellMeta(rowIndex, colIndex, 'borders', border);

            _this6.insertBorderIntoSettings(border);
          } else {// TODO sometimes it enters here. Why?
          }
        });
      });
    }
    /**
     * Remove border (triggered from context menu).
     *
     * @private
     * @param {Number} row Visual row index.
     * @param {Number} column Visual column index.
     */

  }, {
    key: "removeAllBorders",
    value: function removeAllBorders(row, column) {
      var borderId = (0, _utils.createId)(row, column);
      this.spliceBorder(borderId);
      this.clearBordersFromSelectionSettings(borderId);
      this.clearNullCellRange();
      this.hot.removeCellMeta(row, column, 'borders');
    }
    /**
     * Set borders for each cell re. to border position.
     *
     * @private
     * @param {Number} row Visual row index.
     * @param {Number} column Visual column index.
     * @param {String} place Coordinate where add/remove border - `top`, `bottom`, `left`, `right` and `noBorders`.
     * @param {Boolean} remove True when remove borders, and false when add borders.
     */

  }, {
    key: "setBorder",
    value: function setBorder(row, column, place, remove) {
      var bordersMeta = this.hot.getCellMeta(row, column).borders;

      if (!bordersMeta || bordersMeta.border === void 0) {
        bordersMeta = (0, _utils.createEmptyBorders)(row, column);
      }

      if (remove) {
        bordersMeta[place] = (0, _utils.createSingleEmptyBorder)();
        var hideCount = this.countHide(bordersMeta);

        if (hideCount === 4) {
          this.removeAllBorders(row, column);
        } else {
          var customSelectionsChecker = this.checkCustomSelectionsFromContextMenu(bordersMeta, place, remove);

          if (!customSelectionsChecker) {
            this.insertBorderIntoSettings(bordersMeta);
          }

          this.hot.setCellMeta(row, column, 'borders', bordersMeta);
        }
      } else {
        bordersMeta[place] = (0, _utils.createDefaultCustomBorder)();

        var _customSelectionsChecker = this.checkCustomSelectionsFromContextMenu(bordersMeta, place, remove);

        if (!_customSelectionsChecker) {
          this.insertBorderIntoSettings(bordersMeta);
        }

        this.hot.setCellMeta(row, column, 'borders', bordersMeta);
      }
    }
    /**
     * Prepare borders based on cell and border position.
     *
     * @private
     * @param {Object} selected
     * @param {String} place Coordinate where add/remove border - `top`, `bottom`, `left`, `right` and `noBorders`.
     * @param {Boolean} remove True when remove borders, and false when add borders.
     */

  }, {
    key: "prepareBorder",
    value: function prepareBorder(selected, place, remove) {
      var _this7 = this;

      (0, _array.arrayEach)(selected, function (_ref) {
        var start = _ref.start,
            end = _ref.end;

        if (start.row === end.row && start.col === end.col) {
          if (place === 'noBorders') {
            _this7.removeAllBorders(start.row, start.col);
          } else {
            _this7.setBorder(start.row, start.col, place, remove);
          }
        } else {
          switch (place) {
            case 'noBorders':
              (0, _number.rangeEach)(start.col, end.col, function (colIndex) {
                (0, _number.rangeEach)(start.row, end.row, function (rowIndex) {
                  _this7.removeAllBorders(rowIndex, colIndex);
                });
              });
              break;

            case 'top':
              (0, _number.rangeEach)(start.col, end.col, function (topCol) {
                _this7.setBorder(start.row, topCol, place, remove);
              });
              break;

            case 'right':
              (0, _number.rangeEach)(start.row, end.row, function (rowRight) {
                _this7.setBorder(rowRight, end.col, place, remove);
              });
              break;

            case 'bottom':
              (0, _number.rangeEach)(start.col, end.col, function (bottomCol) {
                _this7.setBorder(end.row, bottomCol, place, remove);
              });
              break;

            case 'left':
              (0, _number.rangeEach)(start.row, end.row, function (rowLeft) {
                _this7.setBorder(rowLeft, start.col, place, remove);
              });
              break;

            default:
              break;
          }
        }
      });
    }
    /**
     * Create borders from settings.
     *
     * @private
     * @param {Array} customBorders Object with `row` and `col`, `left`, `right`, `top` and `bottom` properties.
     */

  }, {
    key: "createCustomBorders",
    value: function createCustomBorders(customBorders) {
      var _this8 = this;

      (0, _array.arrayEach)(customBorders, function (customBorder) {
        if (customBorder.range) {
          _this8.prepareBorderFromCustomAddedRange(customBorder);
        } else {
          _this8.prepareBorderFromCustomAdded(customBorder.row, customBorder.col, customBorder);
        }
      });
    }
    /**
    * Count hide property in border object.
    *
    * @private
    * @param {Object} border Object with `row` and `col`, `left`, `right`, `top` and `bottom`, `id` and `border` ({Object} with `color`, `width` and `cornerVisible` property) properties.
    */

  }, {
    key: "countHide",
    value: function countHide(border) {
      var values = Object.values(border);
      return (0, _array.arrayReduce)(values, function (accumulator, value) {
        var result = accumulator;

        if (value.hide) {
          result += 1;
        }

        return result;
      }, 0);
    }
    /**
    * Clear borders settings from custom selections.
    *
    * @private
    * @param {String} borderId Border id name as string.
    */

  }, {
    key: "clearBordersFromSelectionSettings",
    value: function clearBordersFromSelectionSettings(borderId) {
      var index = (0, _array.arrayMap)(this.hot.selection.highlight.customSelections, function (customSelection) {
        return customSelection.settings.id;
      }).indexOf(borderId);

      if (index > -1) {
        this.hot.selection.highlight.customSelections[index].clear();
      }
    }
    /**
    * Clear cellRange with null value.
    *
    * @private
    */

  }, {
    key: "clearNullCellRange",
    value: function clearNullCellRange() {
      var _this9 = this;

      (0, _array.arrayEach)(this.hot.selection.highlight.customSelections, function (customSelection, index) {
        if (customSelection.cellRange === null) {
          _this9.hot.selection.highlight.customSelections[index].destroy();

          _this9.hot.selection.highlight.customSelections.splice(index, 1);

          return false; // breaks forAll
        }
      });
    }
    /**
      * Hide custom borders.
      *
      * @private
      */

  }, {
    key: "hideBorders",
    value: function hideBorders() {
      var _this10 = this;

      (0, _array.arrayEach)(this.savedBorders, function (border) {
        _this10.clearBordersFromSelectionSettings(border.id);

        _this10.clearNullCellRange();
      });
    }
    /**
    * Splice border from savedBorders.
    *
    * @private
    * @param {String} borderId Border id name as string.
    */

  }, {
    key: "spliceBorder",
    value: function spliceBorder(borderId) {
      var index = (0, _array.arrayMap)(this.savedBorders, function (border) {
        return border.id;
      }).indexOf(borderId);

      if (index > -1) {
        this.savedBorders.splice(index, 1);
      }
    }
    /**
    * Check if an border already exists in the savedBorders array, and if true update border in savedBorders.
    *
    * @private
    * @param {Object} border Object with `row` and `col`, `left`, `right`, `top` and `bottom`, `id` and `border` ({Object} with `color`, `width` and `cornerVisible` property) properties.
    *
    * @return {Boolean}
    */

  }, {
    key: "checkSavedBorders",
    value: function checkSavedBorders(border) {
      var _this11 = this;

      var check = false;
      var hideCount = this.countHide(border);

      if (hideCount === 4) {
        this.spliceBorder(border.id);
        check = true;
      } else {
        (0, _array.arrayEach)(this.savedBorders, function (savedBorder, index) {
          if (border.id === savedBorder.id) {
            _this11.savedBorders[index] = border;
            check = true;
            return false; // breaks forAll
          }
        });
      }

      return check;
    }
    /**
    * Check if an border already exists in the customSelections, and if true call toggleHiddenClass method.
    *
    * @private
    * @param {Object} border Object with `row` and `col`, `left`, `right`, `top` and `bottom`, `id` and `border` ({Object} with `color`, `width` and `cornerVisible` property) properties.
    * @param {String} place Coordinate where add/remove border - `top`, `bottom`, `left`, `right` and `noBorders`.
    * @param {Boolean} remove True when remove borders, and false when add borders.
    *
    * @return {Boolean}
    */

  }, {
    key: "checkCustomSelectionsFromContextMenu",
    value: function checkCustomSelectionsFromContextMenu(border, place, remove) {
      var check = false;
      (0, _array.arrayEach)(this.hot.selection.highlight.customSelections, function (customSelection) {
        if (border.id === customSelection.settings.id) {
          (0, _object.objectEach)(customSelection.instanceBorders, function (borderObject) {
            borderObject.toggleHiddenClass(place, remove); // TODO this also bad?
          });
          check = true;
          return false; // breaks forAll
        }
      });
      return check;
    }
    /**
    * Check if an border already exists in the customSelections, and if true reset cellRange.
    *
    * @private
    * @param {Object} border Object with `row` and `col`, `left`, `right`, `top` and `bottom`, `id` and `border` ({Object} with `color`, `width` and `cornerVisible` property) properties.
    * @param {CellRange} cellRange
    * @param {String} place Coordinate where add/remove border - `top`, `bottom`, `left`, `right`.
    *
    * @return {Boolean}
    */

  }, {
    key: "checkCustomSelections",
    value: function checkCustomSelections(border, cellRange, place) {
      var hideCount = this.countHide(border);
      var check = false;

      if (hideCount === 4) {
        this.removeAllBorders(border.row, border.col);
        check = true;
      } else {
        (0, _array.arrayEach)(this.hot.selection.highlight.customSelections, function (customSelection) {
          if (border.id === customSelection.settings.id) {
            customSelection.cellRange = cellRange;

            if (place) {
              (0, _object.objectEach)(customSelection.instanceBorders, function (borderObject) {
                borderObject.changeBorderStyle(place, border);
              });
            }

            check = true;
            return false; // breaks forAll
          }
        });
      }

      return check;
    }
    /**
     * Change borders from settings.
     *
     * @private
     */

  }, {
    key: "changeBorderSettings",
    value: function changeBorderSettings() {
      var customBorders = this.hot.getSettings().customBorders;

      if (Array.isArray(customBorders)) {
        if (!customBorders.length) {
          this.savedBorders = customBorders;
        }

        this.createCustomBorders(customBorders);
      } else if (customBorders !== void 0) {
        this.createCustomBorders(this.savedBorders);
      }
    }
    /**
    * Add border options to context menu.
    *
    * @private
    * @param {Object} defaultOptions Context menu items.
    */

  }, {
    key: "onAfterContextMenuDefaultOptions",
    value: function onAfterContextMenuDefaultOptions(defaultOptions) {
      if (!this.hot.getSettings().customBorders) {
        return;
      }

      defaultOptions.items.push({
        name: '---------'
      }, {
        key: 'borders',
        name: function name() {
          return this.getTranslatedPhrase(C.CONTEXTMENU_ITEMS_BORDERS);
        },
        disabled: function disabled() {
          return this.selection.isSelectedByCorner();
        },
        submenu: {
          items: [(0, _contextMenuItem.top)(this), (0, _contextMenuItem.right)(this), (0, _contextMenuItem.bottom)(this), (0, _contextMenuItem.left)(this), (0, _contextMenuItem.noBorders)(this)]
        }
      });
    }
    /**
     * `afterInit` hook callback.
     *
     * @private
     */

  }, {
    key: "onAfterInit",
    value: function onAfterInit() {
      this.changeBorderSettings();
    }
    /**
     * Destroys the plugin instance.
     */

  }, {
    key: "destroy",
    value: function destroy() {
      _get(_getPrototypeOf(CustomBorders.prototype), "destroy", this).call(this);
    }
  }]);

  return CustomBorders;
}(_base.default);

(0, _plugins.registerPlugin)('customBorders', CustomBorders);
var _default = CustomBorders;
exports.default = _default;