"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.from");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.get-prototype-of");

require("core-js/modules/es.object.set-prototype-of");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.reflect.get");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/es.weak-map");

require("core-js/modules/web.dom-collections.iterator");

require("core-js/modules/web.timers");

exports.__esModule = true;
exports.default = void 0;

var _base = _interopRequireDefault(require("./../_base"));

var _pluginHooks = _interopRequireDefault(require("./../../pluginHooks"));

var _array = require("./../../helpers/array");

var _element = require("./../../helpers/dom/element");

var _number = require("./../../helpers/number");

var _eventManager = _interopRequireDefault(require("./../../eventManager"));

var _plugins = require("./../../plugins");

var _rowsMapper = _interopRequireDefault(require("./rowsMapper"));

var _backlight = _interopRequireDefault(require("./ui/backlight"));

var _guideline = _interopRequireDefault(require("./ui/guideline"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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

_pluginHooks.default.getSingleton().register('beforeRowMove');

_pluginHooks.default.getSingleton().register('afterRowMove');

_pluginHooks.default.getSingleton().register('unmodifyRow');

var privatePool = new WeakMap();
var CSS_PLUGIN = 'ht__manualRowMove';
var CSS_SHOW_UI = 'show-ui';
var CSS_ON_MOVING = 'on-moving--rows';
var CSS_AFTER_SELECTION = 'after-selection--rows';
/**
 * @plugin ManualRowMove
 *
 * @description
 * This plugin allows to change rows order. To make rows order persistent the {@link Options#persistentState}
 * plugin should be enabled.
 *
 * API:
 * - moveRow - move single row to the new position.
 * - moveRows - move many rows (as an array of indexes) to the new position.
 *
 * If you want apply visual changes, you have to call manually the render() method on the instance of handsontable.
 *
 * The plugin creates additional components to make moving possibly using user interface:
 * - backlight - highlight of selected rows.
 * - guideline - line which shows where rows has been moved.
 *
 * @class ManualRowMove
 * @plugin ManualRowMove
 */

var ManualRowMove =
/*#__PURE__*/
function (_BasePlugin) {
  _inherits(ManualRowMove, _BasePlugin);

  function ManualRowMove(hotInstance) {
    var _this;

    _classCallCheck(this, ManualRowMove);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ManualRowMove).call(this, hotInstance));
    /**
     * Set up WeakMap of plugin to sharing private parameters;
     */

    privatePool.set(_assertThisInitialized(_this), {
      rowsToMove: [],
      pressed: void 0,
      disallowMoving: void 0,
      target: {
        eventPageY: void 0,
        coords: void 0,
        TD: void 0,
        row: void 0
      }
    });
    /**
     * List of last removed row indexes.
     *
     * @private
     * @type {Array}
     */

    _this.removedRows = [];
    /**
     * Object containing visual row indexes mapped to data source indexes.
     *
     * @private
     * @type {RowsMapper}
     */

    _this.rowsMapper = new _rowsMapper.default(_assertThisInitialized(_this));
    /**
     * Event Manager object.
     *
     * @private
     * @type {Object}
     */

    _this.eventManager = new _eventManager.default(_assertThisInitialized(_this));
    /**
     * Backlight UI object.
     *
     * @private
     * @type {Object}
     */

    _this.backlight = new _backlight.default(hotInstance);
    /**
     * Guideline UI object.
     *
     * @private
     * @type {Object}
     */

    _this.guideline = new _guideline.default(hotInstance);
    return _this;
  }
  /**
   * Checks if the plugin is enabled in the handsontable settings. This method is executed in {@link Hooks#beforeInit}
   * hook and if it returns `true` than the {@link ManualRowMove#enablePlugin} method is called.
   *
   * @returns {Boolean}
   */


  _createClass(ManualRowMove, [{
    key: "isEnabled",
    value: function isEnabled() {
      return !!this.hot.getSettings().manualRowMove;
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

      this.addHook('beforeOnCellMouseDown', function (event, coords, TD, blockCalculations) {
        return _this2.onBeforeOnCellMouseDown(event, coords, TD, blockCalculations);
      });
      this.addHook('beforeOnCellMouseOver', function (event, coords, TD, blockCalculations) {
        return _this2.onBeforeOnCellMouseOver(event, coords, TD, blockCalculations);
      });
      this.addHook('afterScrollHorizontally', function () {
        return _this2.onAfterScrollHorizontally();
      });
      this.addHook('modifyRow', function (row, source) {
        return _this2.onModifyRow(row, source);
      });
      this.addHook('beforeRemoveRow', function (index, amount) {
        return _this2.onBeforeRemoveRow(index, amount);
      });
      this.addHook('afterRemoveRow', function () {
        return _this2.onAfterRemoveRow();
      });
      this.addHook('afterCreateRow', function (index, amount) {
        return _this2.onAfterCreateRow(index, amount);
      });
      this.addHook('afterLoadData', function () {
        return _this2.onAfterLoadData();
      });
      this.addHook('beforeColumnSort', function (column, order) {
        return _this2.onBeforeColumnSort(column, order);
      });
      this.addHook('unmodifyRow', function (row) {
        return _this2.onUnmodifyRow(row);
      });
      this.registerEvents(); // TODO: move adding plugin classname to BasePlugin.

      (0, _element.addClass)(this.hot.rootElement, CSS_PLUGIN);

      _get(_getPrototypeOf(ManualRowMove.prototype), "enablePlugin", this).call(this);
    }
    /**
     * Updates the plugin state. This method is executed when {@link Core#updateSettings} is invoked.
     */

  }, {
    key: "updatePlugin",
    value: function updatePlugin() {
      this.disablePlugin();
      this.enablePlugin();
      this.onAfterPluginsInitialized();

      _get(_getPrototypeOf(ManualRowMove.prototype), "updatePlugin", this).call(this);
    }
    /**
     * Disables the plugin functionality for this Handsontable instance.
     */

  }, {
    key: "disablePlugin",
    value: function disablePlugin() {
      var pluginSettings = this.hot.getSettings().manualRowMove;

      if (Array.isArray(pluginSettings)) {
        this.rowsMapper.clearMap();
      }

      (0, _element.removeClass)(this.hot.rootElement, CSS_PLUGIN);
      this.unregisterEvents();
      this.backlight.destroy();
      this.guideline.destroy();

      _get(_getPrototypeOf(ManualRowMove.prototype), "disablePlugin", this).call(this);
    }
    /**
     * Moves a single row.
     *
     * @param {Number} row Visual row index to be moved.
     * @param {Number} target Visual row index being a target for the moved row.
     * @fires Hooks#beforeRowMove
     * @fires Hooks#afterRowMove
     */

  }, {
    key: "moveRow",
    value: function moveRow(row, target) {
      this.moveRows([row], target);
    }
    /**
     * Moves a multiple rows.
     *
     * @param {Array} rows Array of visual row indexes to be moved.
     * @param {Number} target Visual row index being a target for the moved rows.
     * @fires Hooks#beforeRowMove
     * @fires Hooks#afterRowMove
     */

  }, {
    key: "moveRows",
    value: function moveRows(rows, target) {
      var _this3 = this;

      var visualRows = _toConsumableArray(rows);

      var priv = privatePool.get(this);
      var beforeMoveHook = this.hot.runHooks('beforeRowMove', visualRows, target);
      priv.disallowMoving = beforeMoveHook === false;

      if (!priv.disallowMoving) {
        // first we need to rewrite an visual indexes to physical for save reference after move
        (0, _array.arrayEach)(rows, function (row, index, array) {
          array[index] = _this3.rowsMapper.getValueByIndex(row);
        }); // next, when we have got an physical indexes, we can move rows

        (0, _array.arrayEach)(rows, function (row, index) {
          var actualPosition = _this3.rowsMapper.getIndexByValue(row);

          if (actualPosition !== target) {
            _this3.rowsMapper.moveRow(actualPosition, target + index);
          }
        }); // after moving we have to clear rowsMapper from null entries

        this.rowsMapper.clearNull();
      }

      this.hot.runHooks('afterRowMove', visualRows, target);
    }
    /**
     * Correct the cell selection after the move action. Fired only when action was made with a mouse.
     * That means that changing the row order using the API won't correct the selection.
     *
     * @private
     * @param {Number} startRow Visual row index for the start of the selection.
     * @param {Number} endRow Visual row index for the end of the selection.
     */

  }, {
    key: "changeSelection",
    value: function changeSelection(startRow, endRow) {
      this.hot.selectRows(startRow, endRow);
    }
    /**
     * Gets the sum of the heights of rows in the provided range.
     *
     * @private
     * @param {Number} from Visual row index.
     * @param {Number} to Visual row index.
     * @returns {Number}
     */

  }, {
    key: "getRowsHeight",
    value: function getRowsHeight(from, to) {
      var height = 0;

      for (var i = from; i < to; i++) {
        var rowHeight = this.hot.view.wt.wtTable.getRowHeight(i) || 23;
        height += rowHeight;
      }

      return height;
    }
    /**
     * Loads initial settings when persistent state is saved or when plugin was initialized as an array.
     *
     * @private
     */

  }, {
    key: "initialSettings",
    value: function initialSettings() {
      var pluginSettings = this.hot.getSettings().manualRowMove;

      if (Array.isArray(pluginSettings)) {
        this.moveRows(pluginSettings, 0);
      } else if (pluginSettings !== void 0) {
        var persistentState = this.persistentStateLoad();

        if (persistentState.length) {
          this.moveRows(persistentState, 0);
        }
      }
    }
    /**
     * Checks if the provided row is in the fixedRowsTop section.
     *
     * @private
     * @param {Number} row Visual row index to check.
     * @returns {Boolean}
     */

  }, {
    key: "isFixedRowTop",
    value: function isFixedRowTop(row) {
      return row < this.hot.getSettings().fixedRowsTop;
    }
    /**
     * Checks if the provided row is in the fixedRowsBottom section.
     *
     * @private
     * @param {Number} row Visual row index to check.
     * @returns {Boolean}
     */

  }, {
    key: "isFixedRowBottom",
    value: function isFixedRowBottom(row) {
      return row > this.hot.getSettings().fixedRowsBottom;
    }
    /**
     * Saves the manual row positions to the persistent state (the {@link Options#persistentState} option has to be enabled).
     *
     * @fires Hooks#persistentStateSave
     * @fires Hooks#manualRowMove
     */

  }, {
    key: "persistentStateSave",
    value: function persistentStateSave() {
      this.hot.runHooks('persistentStateSave', 'manualRowMove', this.rowsMapper._arrayMap);
    }
    /**
     * Loads the manual row positions from the persistent state (the {@link Options#persistentState} option has to be enabled).
     *
     * @returns {Array} Stored state.
     *
     * @fires Hooks#persistentStateLoad
     * @fires Hooks#manualRowMove
     */

  }, {
    key: "persistentStateLoad",
    value: function persistentStateLoad() {
      var storedState = {};
      this.hot.runHooks('persistentStateLoad', 'manualRowMove', storedState);
      return storedState.value ? storedState.value : [];
    }
    /**
     * Prepare array of indexes based on actual selection.
     *
     * @private
     * @returns {Array}
     */

  }, {
    key: "prepareRowsToMoving",
    value: function prepareRowsToMoving() {
      var selection = this.hot.getSelectedRangeLast();
      var selectedRows = [];

      if (!selection) {
        return selectedRows;
      }

      var from = selection.from,
          to = selection.to;
      var start = Math.min(from.row, to.row);
      var end = Math.max(from.row, to.row);
      (0, _number.rangeEach)(start, end, function (i) {
        selectedRows.push(i);
      });
      return selectedRows;
    }
    /**
     * Update the UI visual position.
     *
     * @private
     */

  }, {
    key: "refreshPositions",
    value: function refreshPositions() {
      var priv = privatePool.get(this);
      var coords = priv.target.coords;
      var firstVisible = this.hot.view.wt.wtTable.getFirstVisibleRow();
      var lastVisible = this.hot.view.wt.wtTable.getLastVisibleRow();
      var fixedRows = this.hot.getSettings().fixedRowsTop;
      var countRows = this.hot.countRows();

      if (coords.row < fixedRows && firstVisible > 0) {
        this.hot.scrollViewportTo(firstVisible - 1);
      }

      if (coords.row >= lastVisible && lastVisible < countRows) {
        this.hot.scrollViewportTo(lastVisible + 1, undefined, true);
      }

      var wtTable = this.hot.view.wt.wtTable;
      var TD = priv.target.TD;
      var rootElementOffset = (0, _element.offset)(this.hot.rootElement);
      var tdOffsetTop = this.hot.view.THEAD.offsetHeight + this.getRowsHeight(0, coords.row);
      var mouseOffsetTop = priv.target.eventPageY - rootElementOffset.top + wtTable.holder.scrollTop;
      var hiderHeight = wtTable.hider.offsetHeight;
      var tbodyOffsetTop = wtTable.TBODY.offsetTop;
      var backlightElemMarginTop = this.backlight.getOffset().top;
      var backlightElemHeight = this.backlight.getSize().height;

      if (this.isFixedRowTop(coords.row)) {
        tdOffsetTop += wtTable.holder.scrollTop;
      } // todo: fixedRowsBottom
      // if (this.isFixedRowBottom(coords.row)) {
      //
      // }


      if (coords.row < 0) {
        // if hover on colHeader
        priv.target.row = firstVisible > 0 ? firstVisible - 1 : firstVisible;
      } else if (TD.offsetHeight / 2 + tdOffsetTop <= mouseOffsetTop) {
        // if hover on lower part of TD
        priv.target.row = coords.row + 1; // unfortunately first row is bigger than rest

        tdOffsetTop += coords.row === 0 ? TD.offsetHeight - 1 : TD.offsetHeight;
      } else {
        // elsewhere on table
        priv.target.row = coords.row;
      }

      var backlightTop = mouseOffsetTop;
      var guidelineTop = tdOffsetTop;

      if (mouseOffsetTop + backlightElemHeight + backlightElemMarginTop >= hiderHeight) {
        // prevent display backlight below table
        backlightTop = hiderHeight - backlightElemHeight - backlightElemMarginTop;
      } else if (mouseOffsetTop + backlightElemMarginTop < tbodyOffsetTop) {
        // prevent display above below table
        backlightTop = tbodyOffsetTop + Math.abs(backlightElemMarginTop);
      }

      if (tdOffsetTop >= hiderHeight - 1) {
        // prevent display guideline below table
        guidelineTop = hiderHeight - 1;
      }

      var topOverlayHeight = 0;

      if (this.hot.view.wt.wtOverlays.topOverlay) {
        topOverlayHeight = this.hot.view.wt.wtOverlays.topOverlay.clone.wtTable.TABLE.offsetHeight;
      }

      if (coords.row >= fixedRows && guidelineTop - wtTable.holder.scrollTop < topOverlayHeight) {
        this.hot.scrollViewportTo(coords.row);
      }

      this.backlight.setPosition(backlightTop);
      this.guideline.setPosition(guidelineTop);
    }
    /**
     * This method checks arrayMap from rowsMapper and updates the rowsMapper if it's necessary.
     *
     * @private
     */

  }, {
    key: "updateRowsMapper",
    value: function updateRowsMapper() {
      var countRows = this.hot.countSourceRows();
      var rowsMapperLen = this.rowsMapper._arrayMap.length;

      if (rowsMapperLen === 0) {
        this.rowsMapper.createMap(countRows || this.hot.getSettings().startRows);
      } else if (rowsMapperLen < countRows) {
        var diff = countRows - rowsMapperLen;
        this.rowsMapper.insertItems(rowsMapperLen, diff);
      } else if (rowsMapperLen > countRows) {
        var maxIndex = countRows - 1;
        var rowsToRemove = [];
        (0, _array.arrayEach)(this.rowsMapper._arrayMap, function (value, index) {
          if (value > maxIndex) {
            rowsToRemove.push(index);
          }
        });
        this.rowsMapper.removeItems(rowsToRemove);
      }
    }
    /**
     * Binds the events used by the plugin.
     *
     * @private
     */

  }, {
    key: "registerEvents",
    value: function registerEvents() {
      var _this4 = this;

      var documentElement = this.hot.rootDocument.documentElement;
      this.eventManager.addEventListener(documentElement, 'mousemove', function (event) {
        return _this4.onMouseMove(event);
      });
      this.eventManager.addEventListener(documentElement, 'mouseup', function () {
        return _this4.onMouseUp();
      });
    }
    /**
     * Unbinds the events used by the plugin.
     *
     * @private
     */

  }, {
    key: "unregisterEvents",
    value: function unregisterEvents() {
      this.eventManager.clear();
    }
    /**
     * `beforeColumnSort` hook callback. If user uses the sorting, manual row moving is disabled.
     *
     * @private
     * @param {Number} column Column index where soring is present
     * @param {*} order State of sorting. ASC/DESC/None
     */

  }, {
    key: "onBeforeColumnSort",
    value: function onBeforeColumnSort(column, order) {
      var priv = privatePool.get(this);
      priv.disallowMoving = order !== void 0;
    }
    /**
     * Changes the behavior of selection / dragging.
     *
     * @private
     * @param {MouseEvent} event
     * @param {CellCoords} coords Visual coordinates.
     * @param {HTMLElement} TD
     * @param {Object} blockCalculations
     */

  }, {
    key: "onBeforeOnCellMouseDown",
    value: function onBeforeOnCellMouseDown(event, coords, TD, blockCalculations) {
      var _this$hot$view$wt = this.hot.view.wt,
          wtTable = _this$hot$view$wt.wtTable,
          wtViewport = _this$hot$view$wt.wtViewport;
      var isHeaderSelection = this.hot.selection.isSelectedByRowHeader();
      var selection = this.hot.getSelectedRangeLast();
      var priv = privatePool.get(this);

      if (!selection || !isHeaderSelection || priv.pressed || event.button !== 0) {
        priv.pressed = false;
        priv.rowsToMove.length = 0;
        (0, _element.removeClass)(this.hot.rootElement, [CSS_ON_MOVING, CSS_SHOW_UI]);
        return;
      }

      var guidelineIsNotReady = this.guideline.isBuilt() && !this.guideline.isAppended();
      var backlightIsNotReady = this.backlight.isBuilt() && !this.backlight.isAppended();

      if (guidelineIsNotReady && backlightIsNotReady) {
        this.guideline.appendTo(wtTable.hider);
        this.backlight.appendTo(wtTable.hider);
      }

      var from = selection.from,
          to = selection.to;
      var start = Math.min(from.row, to.row);
      var end = Math.max(from.row, to.row);

      if (coords.col < 0 && coords.row >= start && coords.row <= end) {
        blockCalculations.row = true;
        priv.pressed = true;
        priv.target.eventPageY = event.pageY;
        priv.target.coords = coords;
        priv.target.TD = TD;
        priv.rowsToMove = this.prepareRowsToMoving();
        var leftPos = wtTable.holder.scrollLeft + wtViewport.getRowHeaderWidth();
        this.backlight.setPosition(null, leftPos);
        this.backlight.setSize(wtTable.hider.offsetWidth - leftPos, this.getRowsHeight(start, end + 1));
        this.backlight.setOffset((this.getRowsHeight(start, coords.row) + event.layerY) * -1, null);
        (0, _element.addClass)(this.hot.rootElement, CSS_ON_MOVING);
        this.refreshPositions();
      } else {
        (0, _element.removeClass)(this.hot.rootElement, CSS_AFTER_SELECTION);
        priv.pressed = false;
        priv.rowsToMove.length = 0;
      }
    }
    /**
     * 'mouseMove' event callback. Fired when pointer move on document.documentElement.
     *
     * @private
     * @param {MouseEvent} event `mousemove` event properties.
     */

  }, {
    key: "onMouseMove",
    value: function onMouseMove(event) {
      var priv = privatePool.get(this);

      if (!priv.pressed) {
        return;
      } // callback for browser which doesn't supports CSS pointer-event: none


      if (event.realTarget === this.backlight.element) {
        var height = this.backlight.getSize().height;
        this.backlight.setSize(null, 0);
        setTimeout(function () {
          this.backlight.setPosition(null, height);
        });
      }

      priv.target.eventPageY = event.pageY;
      this.refreshPositions();
    }
    /**
     * 'beforeOnCellMouseOver' hook callback. Fired when pointer was over cell.
     *
     * @private
     * @param {MouseEvent} event `mouseover` event properties.
     * @param {CellCoords} coords Visual cell coordinates where was fired event.
     * @param {HTMLElement} TD Cell represented as HTMLElement.
     * @param {Object} blockCalculations Object which contains information about blockCalculation for row, column or cells.
     */

  }, {
    key: "onBeforeOnCellMouseOver",
    value: function onBeforeOnCellMouseOver(event, coords, TD, blockCalculations) {
      var selectedRange = this.hot.getSelectedRangeLast();
      var priv = privatePool.get(this);

      if (!selectedRange || !priv.pressed) {
        return;
      }

      if (priv.rowsToMove.indexOf(coords.row) > -1) {
        (0, _element.removeClass)(this.hot.rootElement, CSS_SHOW_UI);
      } else {
        (0, _element.addClass)(this.hot.rootElement, CSS_SHOW_UI);
      }

      blockCalculations.row = true;
      blockCalculations.column = true;
      blockCalculations.cell = true;
      priv.target.coords = coords;
      priv.target.TD = TD;
    }
    /**
     * `onMouseUp` hook callback.
     *
     * @private
     */

  }, {
    key: "onMouseUp",
    value: function onMouseUp() {
      var priv = privatePool.get(this);
      var target = priv.target.row;
      var rowsLen = priv.rowsToMove.length;
      priv.pressed = false;
      priv.backlightHeight = 0;
      (0, _element.removeClass)(this.hot.rootElement, [CSS_ON_MOVING, CSS_SHOW_UI, CSS_AFTER_SELECTION]);

      if (this.hot.selection.isSelectedByRowHeader()) {
        (0, _element.addClass)(this.hot.rootElement, CSS_AFTER_SELECTION);
      }

      if (rowsLen < 1 || target === void 0 || priv.rowsToMove.indexOf(target) > -1 || priv.rowsToMove[rowsLen - 1] === target - 1) {
        return;
      }

      this.moveRows(priv.rowsToMove, target);
      this.persistentStateSave();
      this.hot.render();

      if (!priv.disallowMoving) {
        var selectionStart = this.rowsMapper.getIndexByValue(priv.rowsToMove[0]);
        var selectionEnd = this.rowsMapper.getIndexByValue(priv.rowsToMove[rowsLen - 1]);
        this.changeSelection(selectionStart, selectionEnd);
      }

      priv.rowsToMove.length = 0;
    }
    /**
     * `afterScrollHorizontally` hook callback. Fired the table was scrolled horizontally.
     *
     * @private
     */

  }, {
    key: "onAfterScrollHorizontally",
    value: function onAfterScrollHorizontally() {
      var wtTable = this.hot.view.wt.wtTable;
      var headerWidth = this.hot.view.wt.wtViewport.getRowHeaderWidth();
      var scrollLeft = wtTable.holder.scrollLeft;
      var posLeft = headerWidth + scrollLeft;
      this.backlight.setPosition(null, posLeft);
      this.backlight.setSize(wtTable.hider.offsetWidth - posLeft);
    }
    /**
     * `afterCreateRow` hook callback.
     *
     * @private
     * @param {Number} index Visual index of the created row.
     * @param {Number} amount Amount of created rows.
     */

  }, {
    key: "onAfterCreateRow",
    value: function onAfterCreateRow(index, amount) {
      this.rowsMapper.shiftItems(index, amount);
    }
    /**
     * On before remove row listener.
     *
     * @private
     * @param {Number} index Visual row index.
     * @param {Number} amount Defines how many rows removed.
     */

  }, {
    key: "onBeforeRemoveRow",
    value: function onBeforeRemoveRow(index, amount) {
      var _this5 = this;

      this.removedRows.length = 0;

      if (index !== false) {
        // Collect physical row index.
        (0, _number.rangeEach)(index, index + amount - 1, function (removedIndex) {
          _this5.removedRows.push(_this5.hot.runHooks('modifyRow', removedIndex, _this5.pluginName));
        });
      }
    }
    /**
     * `afterRemoveRow` hook callback.
     *
     * @private
     */

  }, {
    key: "onAfterRemoveRow",
    value: function onAfterRemoveRow() {
      this.rowsMapper.unshiftItems(this.removedRows);
    }
    /**
     * `afterLoadData` hook callback.
     *
     * @private
     */

  }, {
    key: "onAfterLoadData",
    value: function onAfterLoadData() {
      this.updateRowsMapper();
    }
    /**
     * 'modifyRow' hook callback.
     *
     * @private
     * @param {Number} row Visual Row index.
     * @returns {Number} Physical row index.
     */

  }, {
    key: "onModifyRow",
    value: function onModifyRow(row, source) {
      var physicalRow = row;

      if (source !== this.pluginName) {
        var rowInMapper = this.rowsMapper.getValueByIndex(physicalRow);
        physicalRow = rowInMapper === null ? physicalRow : rowInMapper;
      }

      return physicalRow;
    }
    /**
     * 'unmodifyRow' hook callback.
     *
     * @private
     * @param {Number} row Physical row index.
     * @returns {Number} Visual row index.
     */

  }, {
    key: "onUnmodifyRow",
    value: function onUnmodifyRow(row) {
      var indexInMapper = this.rowsMapper.getIndexByValue(row);
      return indexInMapper === null ? row : indexInMapper;
    }
    /**
     * `afterPluginsInitialized` hook callback.
     *
     * @private
     */

  }, {
    key: "onAfterPluginsInitialized",
    value: function onAfterPluginsInitialized() {
      this.updateRowsMapper();
      this.initialSettings();
      this.backlight.build();
      this.guideline.build();
    }
    /**
     * Destroys the plugin instance.
     */

  }, {
    key: "destroy",
    value: function destroy() {
      this.backlight.destroy();
      this.guideline.destroy();
      this.rowsMapper.destroy();

      _get(_getPrototypeOf(ManualRowMove.prototype), "destroy", this).call(this);
    }
  }]);

  return ManualRowMove;
}(_base.default);

(0, _plugins.registerPlugin)('ManualRowMove', ManualRowMove);
var _default = ManualRowMove;
exports.default = _default;