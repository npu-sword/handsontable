import "core-js/modules/es.symbol";
import "core-js/modules/es.symbol.description";
import "core-js/modules/es.symbol.iterator";
import "core-js/modules/es.array.iterator";
import "core-js/modules/es.object.get-own-property-descriptor";
import "core-js/modules/es.object.get-prototype-of";
import "core-js/modules/es.object.set-prototype-of";
import "core-js/modules/es.object.to-string";
import "core-js/modules/es.reflect.get";
import "core-js/modules/es.string.iterator";
import "core-js/modules/es.weak-map";
import "core-js/modules/web.dom-collections.iterator";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

import BasePlugin from './../_base';
import { registerPlugin } from './../../plugins';
import { arrayEach } from './../../helpers/array';
import freezeColumnItem from './contextMenuItem/freezeColumn';
import unfreezeColumnItem from './contextMenuItem/unfreezeColumn';
var privatePool = new WeakMap();
/**
 * This plugin allows to manually "freeze" and "unfreeze" a column using an entry in the Context Menu or using API.
 * You can turn it on by setting a {@link Options#manualColumnFreeze} property to `true`.
 *
 * @example
 * ```js
 * // Enables the plugin
 * manualColumnFreeze: true,
 * ```
 *
 * @plugin ManualColumnFreeze
 * @dependencies ManualColumnMove
 */

var ManualColumnFreeze =
/*#__PURE__*/
function (_BasePlugin) {
  _inherits(ManualColumnFreeze, _BasePlugin);

  function ManualColumnFreeze(hotInstance) {
    var _this;

    _classCallCheck(this, ManualColumnFreeze);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ManualColumnFreeze).call(this, hotInstance));
    privatePool.set(_assertThisInitialized(_this), {
      moveByFreeze: false,
      afterFirstUse: false
    });
    /**
     * Original column positions
     *
     * @private
     * @type {Array}
     */

    _this.frozenColumnsBasePositions = [];
    /**
     * Reference to the `ManualColumnMove` plugin.
     *
     * @private
     * @type {ManualColumnMove}
     */

    _this.manualColumnMovePlugin = void 0;
    return _this;
  }
  /**
   * Checks if the plugin is enabled in the handsontable settings. This method is executed in {@link Hooks#beforeInit}
   * hook and if it returns `true` than the {@link ManualColumnFreeze#enablePlugin} method is called.
   *
   * @returns {Boolean}
   */


  _createClass(ManualColumnFreeze, [{
    key: "isEnabled",
    value: function isEnabled() {
      return !!this.hot.getSettings().manualColumnFreeze;
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
        return _this2.addContextMenuEntry(options);
      });
      this.addHook('afterInit', function () {
        return _this2.onAfterInit();
      });
      this.addHook('beforeColumnMove', function (rows, target) {
        return _this2.onBeforeColumnMove(rows, target);
      });

      _get(_getPrototypeOf(ManualColumnFreeze.prototype), "enablePlugin", this).call(this);
    }
    /**
     * Disables the plugin functionality for this Handsontable instance.
     */

  }, {
    key: "disablePlugin",
    value: function disablePlugin() {
      var priv = privatePool.get(this);
      priv.afterFirstUse = false;
      priv.moveByFreeze = false;

      _get(_getPrototypeOf(ManualColumnFreeze.prototype), "disablePlugin", this).call(this);
    }
    /**
     * Updates the plugin state. This method is executed when {@link Core#updateSettings} is invoked.
     */

  }, {
    key: "updatePlugin",
    value: function updatePlugin() {
      this.disablePlugin();
      this.enablePlugin();

      _get(_getPrototypeOf(ManualColumnFreeze.prototype), "updatePlugin", this).call(this);
    }
    /**
     * Freezes the given column (add it to fixed columns).
     *
     * @param {Number} column Visual column index.
     */

  }, {
    key: "freezeColumn",
    value: function freezeColumn(column) {
      var priv = privatePool.get(this);
      var settings = this.hot.getSettings();

      if (!priv.afterFirstUse) {
        priv.afterFirstUse = true;
      }

      if (settings.fixedColumnsLeft === this.hot.countCols() || column <= settings.fixedColumnsLeft - 1) {
        return; // already fixed
      }

      priv.moveByFreeze = true;

      if (column !== this.getMovePlugin().columnsMapper.getValueByIndex(column)) {
        this.frozenColumnsBasePositions[settings.fixedColumnsLeft] = column;
      }

      this.getMovePlugin().moveColumn(column, settings.fixedColumnsLeft);
      settings.fixedColumnsLeft += 1;
    }
    /**
     * Unfreezes the given column (remove it from fixed columns and bring to it's previous position).
     *
     * @param {Number} column Visual column index.
     */

  }, {
    key: "unfreezeColumn",
    value: function unfreezeColumn(column) {
      var priv = privatePool.get(this);
      var settings = this.hot.getSettings();

      if (!priv.afterFirstUse) {
        priv.afterFirstUse = true;
      }

      if (settings.fixedColumnsLeft <= 0 || column > settings.fixedColumnsLeft - 1) {
        return; // not fixed
      }

      var returnCol = this.getBestColumnReturnPosition(column);
      priv.moveByFreeze = true;
      settings.fixedColumnsLeft -= 1;
      this.getMovePlugin().moveColumn(column, returnCol + 1);
    }
    /**
     * Gets the reference to the ManualColumnMove plugin.
     *
     * @private
     * @returns {Object}
     */

  }, {
    key: "getMovePlugin",
    value: function getMovePlugin() {
      if (!this.manualColumnMovePlugin) {
        this.manualColumnMovePlugin = this.hot.getPlugin('manualColumnMove');
      }

      return this.manualColumnMovePlugin;
    }
    /**
     * Estimates the most fitting return position for unfrozen column.
     *
     * @private
     * @param {Number} column Visual column index.
     */

  }, {
    key: "getBestColumnReturnPosition",
    value: function getBestColumnReturnPosition(column) {
      var movePlugin = this.getMovePlugin();
      var settings = this.hot.getSettings();
      var i = settings.fixedColumnsLeft;
      var j = movePlugin.columnsMapper.getValueByIndex(i);
      var initialCol;

      if (this.frozenColumnsBasePositions[column] === null || this.frozenColumnsBasePositions[column] === void 0) {
        initialCol = movePlugin.columnsMapper.getValueByIndex(column);

        while (j !== null && j <= initialCol) {
          i += 1;
          j = movePlugin.columnsMapper.getValueByIndex(i);
        }
      } else {
        initialCol = this.frozenColumnsBasePositions[column];
        this.frozenColumnsBasePositions[column] = void 0;

        while (j !== null && j <= initialCol) {
          i += 1;
          j = movePlugin.columnsMapper.getValueByIndex(i);
        }

        i = j;
      }

      return i - 1;
    }
    /**
     * Adds the manualColumnFreeze context menu entries.
     *
     * @private
     * @param {Object} options Context menu options.
     */

  }, {
    key: "addContextMenuEntry",
    value: function addContextMenuEntry(options) {
      options.items.push({
        name: '---------'
      }, freezeColumnItem(this), unfreezeColumnItem(this));
    }
    /**
     * Enables `manualColumnMove` plugin on `afterInit` hook.
     *
     * @private
     */

  }, {
    key: "onAfterInit",
    value: function onAfterInit() {
      if (!this.getMovePlugin().isEnabled()) {
        this.getMovePlugin().enablePlugin();
      }
    }
    /**
     * Prevents moving the rows from/to fixed area.
     *
     * @private
     * @param {Array} rows
     * @param {Number} target
     */

  }, {
    key: "onBeforeColumnMove",
    value: function onBeforeColumnMove(rows, target) {
      var priv = privatePool.get(this);

      if (priv.afterFirstUse && !priv.moveByFreeze) {
        var frozenLen = this.hot.getSettings().fixedColumnsLeft;
        var disallowMoving = target < frozenLen;

        if (!disallowMoving) {
          arrayEach(rows, function (value) {
            if (value < frozenLen) {
              disallowMoving = true;
              return false;
            }
          });
        }

        if (disallowMoving) {
          return false;
        }
      }

      if (priv.moveByFreeze) {
        priv.moveByFreeze = false;
      }
    }
    /**
     * Destroys the plugin instance.
     */

  }, {
    key: "destroy",
    value: function destroy() {
      _get(_getPrototypeOf(ManualColumnFreeze.prototype), "destroy", this).call(this);
    }
  }]);

  return ManualColumnFreeze;
}(BasePlugin);

registerPlugin('manualColumnFreeze', ManualColumnFreeze);
export default ManualColumnFreeze;