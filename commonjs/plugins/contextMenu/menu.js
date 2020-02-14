"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.constructor");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.replace");

exports.__esModule = true;
exports.default = void 0;

var _core = _interopRequireDefault(require("./../../core"));

var _element = require("./../../helpers/dom/element");

var _array = require("./../../helpers/array");

var _cursor = _interopRequireDefault(require("./cursor"));

var _eventManager = _interopRequireDefault(require("./../../eventManager"));

var _object = require("./../../helpers/object");

var _mixed = require("./../../helpers/mixed");

var _function = require("./../../helpers/function");

var _utils = require("./utils");

var _unicode = require("./../../helpers/unicode");

var _localHooks = _interopRequireDefault(require("./../../mixins/localHooks"));

var _predefinedItems = require("./predefinedItems");

var _event = require("./../../helpers/dom/event");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MIN_WIDTH = 215;
/**
 * @class Menu
 * @plugin ContextMenu
 */

var Menu =
/*#__PURE__*/
function () {
  function Menu(hotInstance, options) {
    _classCallCheck(this, Menu);

    this.hot = hotInstance;
    this.options = options || {
      parent: null,
      name: null,
      className: '',
      keepInViewport: true,
      standalone: false,
      minWidth: MIN_WIDTH,
      container: this.hot.rootDocument.documentElement
    };
    this.eventManager = new _eventManager.default(this);
    this.container = this.createContainer(this.options.name);
    this.hotMenu = null;
    this.hotSubMenus = {};
    this.parentMenu = this.options.parent || null;
    this.menuItems = null;
    this.origOutsideClickDeselects = null;
    this.keyEvent = false;
    this.offset = {
      above: 0,
      below: 0,
      left: 0,
      right: 0
    };
    this._afterScrollCallback = null;
    this.registerEvents();
  }
  /**
   * Register event listeners.
   *
   * @private
   */


  _createClass(Menu, [{
    key: "registerEvents",
    value: function registerEvents() {
      var _this = this;

      var frame = this.hot.rootWindow;

      while (frame) {
        this.eventManager.addEventListener(frame.document, 'mousedown', function (event) {
          return _this.onDocumentMouseDown(event);
        });
        frame = (0, _element.getParentWindow)(frame);
      }
    }
    /**
     * Set array of objects which defines menu items.
     *
     * @param {Array} menuItems Menu items to display.
     */

  }, {
    key: "setMenuItems",
    value: function setMenuItems(menuItems) {
      this.menuItems = menuItems;
    }
    /**
     * Returns currently selected menu item. Returns `null` if no item was selected.
     *
     * @returns {Object|null}
     */

  }, {
    key: "getSelectedItem",
    value: function getSelectedItem() {
      return this.hasSelectedItem() ? this.hotMenu.getSourceDataAtRow(this.hotMenu.getSelectedLast()[0]) : null;
    }
    /**
     * Checks if the menu has selected (highlighted) any item from the menu list.
     *
     * @returns {Boolean}
     */

  }, {
    key: "hasSelectedItem",
    value: function hasSelectedItem() {
      return Array.isArray(this.hotMenu.getSelectedLast());
    }
    /**
     * Set offset menu position for specified area (`above`, `below`, `left` or `right`).
     *
     * @param {String} area Specified area name (`above`, `below`, `left` or `right`).
     * @param {Number} offset Offset value.
     */

  }, {
    key: "setOffset",
    value: function setOffset(area) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      this.offset[area] = offset;
    }
    /**
     * Check if menu is using as sub-menu.
     *
     * @returns {Boolean}
     */

  }, {
    key: "isSubMenu",
    value: function isSubMenu() {
      return this.parentMenu !== null;
    }
    /**
     * Open menu.
     *
     * @fires Hooks#beforeContextMenuShow
     * @fires Hooks#afterContextMenuShow
     */

  }, {
    key: "open",
    value: function open() {
      var _this2 = this;

      this.runLocalHooks('beforeOpen');
      this.container.removeAttribute('style');
      this.container.style.display = 'block';
      var delayedOpenSubMenu = (0, _function.debounce)(function (row) {
        return _this2.openSubMenu(row);
      }, 300);
      var minWidthOfMenu = this.options.minWidth || MIN_WIDTH;
      var noItemsDefined = false;
      var filteredItems = (0, _array.arrayFilter)(this.menuItems, function (item) {
        if (item.key === _predefinedItems.NO_ITEMS) {
          noItemsDefined = true;
        }

        return (0, _utils.isItemHidden)(item, _this2.hot);
      });

      if (filteredItems.length < 1 && !noItemsDefined) {
        filteredItems.push((0, _predefinedItems.predefinedItems)()[_predefinedItems.NO_ITEMS]);
      } else if (filteredItems.length === 0) {
        return;
      }

      filteredItems = (0, _utils.filterSeparators)(filteredItems, _predefinedItems.SEPARATOR);
      var shouldAutoCloseMenu = false;
      var settings = {
        data: filteredItems,
        colHeaders: false,
        autoColumnSize: true,
        autoWrapRow: false,
        modifyColWidth: function modifyColWidth(width) {
          if ((0, _mixed.isDefined)(width) && width < minWidthOfMenu) {
            return minWidthOfMenu;
          }

          return width;
        },
        autoRowSize: false,
        readOnly: true,
        editor: false,
        copyPaste: false,
        columns: [{
          data: 'name',
          renderer: function renderer(hot, TD, row, col, prop, value) {
            return _this2.menuItemRenderer(hot, TD, row, col, prop, value);
          }
        }],
        renderAllRows: true,
        fragmentSelection: false,
        outsideClickDeselects: false,
        disableVisualSelection: 'area',
        beforeKeyDown: function beforeKeyDown(event) {
          return _this2.onBeforeKeyDown(event);
        },
        afterOnCellMouseOver: function afterOnCellMouseOver(event, coords) {
          if (_this2.isAllSubMenusClosed()) {
            delayedOpenSubMenu(coords.row);
          } else {
            _this2.openSubMenu(coords.row);
          }
        },
        rowHeights: function rowHeights(row) {
          return filteredItems[row].name === _predefinedItems.SEPARATOR ? 1 : 23;
        },
        afterOnCellContextMenu: function afterOnCellContextMenu(event) {
          event.preventDefault();

          if (_this2.hasSelectedItem()) {
            _this2.executeCommand(event);

            if (!_this2.isCommandPassive(_this2.getSelectedItem())) {
              _this2.close(true);
            }
          }
        },
        beforeOnCellMouseUp: function beforeOnCellMouseUp(event) {
          if (_this2.hasSelectedItem()) {
            shouldAutoCloseMenu = !_this2.isCommandPassive(_this2.getSelectedItem());

            _this2.executeCommand(event);
          }
        },
        afterOnCellMouseUp: function afterOnCellMouseUp() {
          if (shouldAutoCloseMenu && _this2.hasSelectedItem()) {
            _this2.close(true);
          }
        },
        afterUnlisten: function afterUnlisten() {
          // Restore menu focus, fix for `this.instance.unlisten();` call in the tableView.js@260 file.
          // This prevents losing table responsiveness for keyboard events when filter select menu is closed (#6497).
          if (!_this2.hasSelectedItem() && _this2.isOpened()) {
            _this2.hotMenu.listen(false);
          }
        }
      };
      this.origOutsideClickDeselects = this.hot.getSettings().outsideClickDeselects;
      this.hot.getSettings().outsideClickDeselects = false;
      this.hotMenu = new _core.default(this.container, settings);
      this.hotMenu.addHook('afterInit', function () {
        return _this2.onAfterInit();
      });
      this.hotMenu.addHook('afterSelection', function () {
        return _this2.onAfterSelection.apply(_this2, arguments);
      });
      this.hotMenu.init();
      this.hotMenu.listen();
      this.blockMainTableCallbacks();
      this.runLocalHooks('afterOpen');
    }
    /**
     * Close menu.
     *
     * @param {Boolean} [closeParent=false] if `true` try to close parent menu if exists.
     */

  }, {
    key: "close",
    value: function close() {
      var closeParent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (!this.isOpened()) {
        return;
      }

      if (closeParent && this.parentMenu) {
        this.parentMenu.close();
      } else {
        this.closeAllSubMenus();
        this.container.style.display = 'none';
        this.releaseMainTableCallbacks();
        this.hotMenu.destroy();
        this.hotMenu = null;
        this.hot.getSettings().outsideClickDeselects = this.origOutsideClickDeselects;
        this.runLocalHooks('afterClose');

        if (this.parentMenu) {
          this.parentMenu.hotMenu.listen();
        }
      }
    }
    /**
     * Open sub menu at the provided row index.
     *
     * @param {Number} row Row index.
     * @returns {Menu|Boolean} Returns created menu or `false` if no one menu was created.
     */

  }, {
    key: "openSubMenu",
    value: function openSubMenu(row) {
      if (!this.hotMenu) {
        return false;
      }

      var cell = this.hotMenu.getCell(row, 0);
      this.closeAllSubMenus();

      if (!cell || !(0, _utils.hasSubMenu)(cell)) {
        return false;
      }

      var dataItem = this.hotMenu.getSourceDataAtRow(row);
      var subMenu = new Menu(this.hot, {
        parent: this,
        name: dataItem.name,
        className: this.options.className,
        keepInViewport: true,
        container: this.options.container
      });
      subMenu.setMenuItems(dataItem.submenu.items);
      subMenu.open();
      subMenu.setPosition(cell.getBoundingClientRect());
      this.hotSubMenus[dataItem.key] = subMenu;
      return subMenu;
    }
    /**
     * Close sub menu at row index.
     *
     * @param {Number} row Row index.
     */

  }, {
    key: "closeSubMenu",
    value: function closeSubMenu(row) {
      var dataItem = this.hotMenu.getSourceDataAtRow(row);
      var menus = this.hotSubMenus[dataItem.key];

      if (menus) {
        menus.destroy();
        delete this.hotSubMenus[dataItem.key];
      }
    }
    /**
     * Close all opened sub menus.
     */

  }, {
    key: "closeAllSubMenus",
    value: function closeAllSubMenus() {
      var _this3 = this;

      (0, _array.arrayEach)(this.hotMenu.getData(), function (value, row) {
        return _this3.closeSubMenu(row);
      });
    }
    /**
     * Checks if all created and opened sub menus are closed.
     *
     * @returns {Boolean}
     */

  }, {
    key: "isAllSubMenusClosed",
    value: function isAllSubMenusClosed() {
      return Object.keys(this.hotSubMenus).length === 0;
    }
    /**
     * Destroy instance.
     */

  }, {
    key: "destroy",
    value: function destroy() {
      var menuContainerParentElement = this.container.parentNode;
      this.clearLocalHooks();
      this.close();
      this.parentMenu = null;
      this.eventManager.destroy();

      if (menuContainerParentElement) {
        menuContainerParentElement.removeChild(this.container);
      }
    }
    /**
     * Checks if menu was opened.
     *
     * @returns {Boolean} Returns `true` if menu was opened.
     */

  }, {
    key: "isOpened",
    value: function isOpened() {
      return this.hotMenu !== null;
    }
    /**
     * Execute menu command.
     *
     * @param {Event} [event]
     */

  }, {
    key: "executeCommand",
    value: function executeCommand(event) {
      if (!this.isOpened() || !this.hasSelectedItem()) {
        return;
      }

      var selectedItem = this.getSelectedItem();
      this.runLocalHooks('select', selectedItem, event);

      if (this.isCommandPassive(selectedItem)) {
        return;
      }

      var selRanges = this.hot.getSelectedRange();
      var normalizedSelection = selRanges ? (0, _utils.normalizeSelection)(selRanges) : [];
      this.runLocalHooks('executeCommand', selectedItem.key, normalizedSelection, event);

      if (this.isSubMenu()) {
        this.parentMenu.runLocalHooks('executeCommand', selectedItem.key, normalizedSelection, event);
      }
    }
    /**
     * Checks if the passed command is passive or not. The command is passive when it's marked as
     * disabled, the descriptor object contains `isCommand` property set to `false`, command
     * is a separator, or the item is recognized as submenu. For passive items the menu is not
     * closed automatically after the user trigger the command through the UI.
     *
     * @param {Object} commandDescriptor Selected menu item from the menu data source.
     * @returns {Boolean}
     */

  }, {
    key: "isCommandPassive",
    value: function isCommandPassive(commandDescriptor) {
      var isCommand = commandDescriptor.isCommand,
          commandName = commandDescriptor.name,
          disabled = commandDescriptor.disabled,
          submenu = commandDescriptor.submenu;
      var isItemDisabled = disabled === true || typeof disabled === 'function' && disabled.call(this.hot) === true;
      return isCommand === false || commandName === _predefinedItems.SEPARATOR || isItemDisabled === true || submenu;
    }
    /**
     * Set menu position based on dom event or based on literal object.
     *
     * @param {Event|Object} coords Event or literal Object with coordinates.
     */

  }, {
    key: "setPosition",
    value: function setPosition(coords) {
      var cursor = new _cursor.default(coords, this.container.ownerDocument.defaultView);

      if (this.options.keepInViewport) {
        if (cursor.fitsBelow(this.container)) {
          this.setPositionBelowCursor(cursor);
        } else if (cursor.fitsAbove(this.container)) {
          this.setPositionAboveCursor(cursor);
        } else {
          this.setPositionBelowCursor(cursor);
        }

        if (cursor.fitsOnRight(this.container)) {
          this.setPositionOnRightOfCursor(cursor);
        } else {
          this.setPositionOnLeftOfCursor(cursor);
        }
      } else {
        this.setPositionBelowCursor(cursor);
        this.setPositionOnRightOfCursor(cursor);
      }
    }
    /**
     * Set menu position above cursor object.
     *
     * @param {Cursor} cursor `Cursor` object.
     */

  }, {
    key: "setPositionAboveCursor",
    value: function setPositionAboveCursor(cursor) {
      var top = this.offset.above + cursor.top - this.container.offsetHeight;

      if (this.isSubMenu()) {
        top = cursor.top + cursor.cellHeight - this.container.offsetHeight + 3;
      }

      this.container.style.top = "".concat(top, "px");
    }
    /**
     * Set menu position below cursor object.
     *
     * @param {Cursor} cursor `Cursor` object.
     */

  }, {
    key: "setPositionBelowCursor",
    value: function setPositionBelowCursor(cursor) {
      var top = this.offset.below + cursor.top;

      if (this.isSubMenu()) {
        top = cursor.top - 1;
      }

      this.container.style.top = "".concat(top, "px");
    }
    /**
     * Set menu position on the right of cursor object.
     *
     * @param {Cursor} cursor `Cursor` object.
     */

  }, {
    key: "setPositionOnRightOfCursor",
    value: function setPositionOnRightOfCursor(cursor) {
      var left;

      if (this.isSubMenu()) {
        left = 1 + cursor.left + cursor.cellWidth;
      } else {
        left = this.offset.right + 1 + cursor.left;
      }

      this.container.style.left = "".concat(left, "px");
    }
    /**
     * Set menu position on the left of cursor object.
     *
     * @param {Cursor} cursor `Cursor` object.
     */

  }, {
    key: "setPositionOnLeftOfCursor",
    value: function setPositionOnLeftOfCursor(cursor) {
      var left = this.offset.left + cursor.left - this.container.offsetWidth + (0, _element.getScrollbarWidth)(this.hot.rootDocument) + 4;
      this.container.style.left = "".concat(left, "px");
    }
    /**
     * Select first cell in opened menu.
     */

  }, {
    key: "selectFirstCell",
    value: function selectFirstCell() {
      var cell = this.hotMenu.getCell(0, 0);

      if ((0, _utils.isSeparator)(cell) || (0, _utils.isDisabled)(cell) || (0, _utils.isSelectionDisabled)(cell)) {
        this.selectNextCell(0, 0);
      } else {
        this.hotMenu.selectCell(0, 0);
      }
    }
    /**
     * Select last cell in opened menu.
     */

  }, {
    key: "selectLastCell",
    value: function selectLastCell() {
      var lastRow = this.hotMenu.countRows() - 1;
      var cell = this.hotMenu.getCell(lastRow, 0);

      if ((0, _utils.isSeparator)(cell) || (0, _utils.isDisabled)(cell) || (0, _utils.isSelectionDisabled)(cell)) {
        this.selectPrevCell(lastRow, 0);
      } else {
        this.hotMenu.selectCell(lastRow, 0);
      }
    }
    /**
     * Select next cell in opened menu.
     *
     * @param {Number} row Row index.
     * @param {Number} col Column index.
     */

  }, {
    key: "selectNextCell",
    value: function selectNextCell(row, col) {
      var nextRow = row + 1;
      var cell = nextRow < this.hotMenu.countRows() ? this.hotMenu.getCell(nextRow, col) : null;

      if (!cell) {
        return;
      }

      if ((0, _utils.isSeparator)(cell) || (0, _utils.isDisabled)(cell) || (0, _utils.isSelectionDisabled)(cell)) {
        this.selectNextCell(nextRow, col);
      } else {
        this.hotMenu.selectCell(nextRow, col);
      }
    }
    /**
     * Select previous cell in opened menu.
     *
     * @param {Number} row Row index.
     * @param {Number} col Column index.
     */

  }, {
    key: "selectPrevCell",
    value: function selectPrevCell(row, col) {
      var prevRow = row - 1;
      var cell = prevRow >= 0 ? this.hotMenu.getCell(prevRow, col) : null;

      if (!cell) {
        return;
      }

      if ((0, _utils.isSeparator)(cell) || (0, _utils.isDisabled)(cell) || (0, _utils.isSelectionDisabled)(cell)) {
        this.selectPrevCell(prevRow, col);
      } else {
        this.hotMenu.selectCell(prevRow, col);
      }
    }
    /**
     * Menu item renderer.
     *
     * @private
     */

  }, {
    key: "menuItemRenderer",
    value: function menuItemRenderer(hot, TD, row, col, prop, value) {
      var _this4 = this;

      var item = hot.getSourceDataAtRow(row);
      var wrapper = this.hot.rootDocument.createElement('div');

      var isSubMenu = function isSubMenu(itemToTest) {
        return (0, _object.hasOwnProperty)(itemToTest, 'submenu');
      };

      var itemIsSeparator = function itemIsSeparator(itemToTest) {
        return new RegExp(_predefinedItems.SEPARATOR, 'i').test(itemToTest.name);
      };

      var itemIsDisabled = function itemIsDisabled(itemToTest) {
        return itemToTest.disabled === true || typeof itemToTest.disabled === 'function' && itemToTest.disabled.call(_this4.hot) === true;
      };

      var itemIsSelectionDisabled = function itemIsSelectionDisabled(itemToTest) {
        return itemToTest.disableSelection;
      };

      var itemValue = value;

      if (typeof itemValue === 'function') {
        itemValue = itemValue.call(this.hot);
      }

      (0, _element.empty)(TD);
      (0, _element.addClass)(wrapper, 'htItemWrapper');
      TD.appendChild(wrapper);

      if (itemIsSeparator(item)) {
        (0, _element.addClass)(TD, 'htSeparator');
      } else if (typeof item.renderer === 'function') {
        (0, _element.addClass)(TD, 'htCustomMenuRenderer');
        TD.appendChild(item.renderer(hot, wrapper, row, col, prop, itemValue));
      } else {
        (0, _element.fastInnerHTML)(wrapper, itemValue);
      }

      if (itemIsDisabled(item)) {
        (0, _element.addClass)(TD, 'htDisabled');
        this.eventManager.addEventListener(TD, 'mouseenter', function () {
          return hot.deselectCell();
        });
      } else if (itemIsSelectionDisabled(item)) {
        (0, _element.addClass)(TD, 'htSelectionDisabled');
        this.eventManager.addEventListener(TD, 'mouseenter', function () {
          return hot.deselectCell();
        });
      } else if (isSubMenu(item)) {
        (0, _element.addClass)(TD, 'htSubmenu');

        if (itemIsSelectionDisabled(item)) {
          this.eventManager.addEventListener(TD, 'mouseenter', function () {
            return hot.deselectCell();
          });
        } else {
          this.eventManager.addEventListener(TD, 'mouseenter', function () {
            return hot.selectCell(row, col, void 0, void 0, false, false);
          });
        }
      } else {
        (0, _element.removeClass)(TD, ['htSubmenu', 'htDisabled']);

        if (itemIsSelectionDisabled(item)) {
          this.eventManager.addEventListener(TD, 'mouseenter', function () {
            return hot.deselectCell();
          });
        } else {
          this.eventManager.addEventListener(TD, 'mouseenter', function () {
            return hot.selectCell(row, col, void 0, void 0, false, false);
          });
        }
      }
    }
    /**
     * Create container/wrapper for handsontable.
     *
     * @private
     * @param {String} [name] Class name.
     * @returns {HTMLElement}
     */

  }, {
    key: "createContainer",
    value: function createContainer() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var doc = this.options.container.ownerDocument;
      var className = name;
      var container;

      if (className) {
        if ((0, _function.isFunction)(className)) {
          className = className.call(this.hot);

          if (className === null || (0, _mixed.isUndefined)(className)) {
            className = '';
          } else {
            className = className.toString();
          }
        }

        className = className.replace(/[^A-z0-9]/g, '_');
        className = "".concat(this.options.className, "Sub_").concat(className);
        container = doc.querySelector(".".concat(this.options.className, ".").concat(className));
      }

      if (!container) {
        container = doc.createElement('div');
        (0, _element.addClass)(container, "htMenu ".concat(this.options.className));

        if (className) {
          (0, _element.addClass)(container, className);
        }

        this.options.container.appendChild(container);
      }

      return container;
    }
    /**
     * @private
     */

  }, {
    key: "blockMainTableCallbacks",
    value: function blockMainTableCallbacks() {
      this._afterScrollCallback = function () {};

      this.hot.addHook('afterScrollVertically', this._afterScrollCallback);
      this.hot.addHook('afterScrollHorizontally', this._afterScrollCallback);
    }
    /**
     * @private
     */

  }, {
    key: "releaseMainTableCallbacks",
    value: function releaseMainTableCallbacks() {
      if (this._afterScrollCallback) {
        this.hot.removeHook('afterScrollVertically', this._afterScrollCallback);
        this.hot.removeHook('afterScrollHorizontally', this._afterScrollCallback);
        this._afterScrollCallback = null;
      }
    }
    /**
     * On before key down listener.
     *
     * @private
     * @param {Event} event
     */

  }, {
    key: "onBeforeKeyDown",
    value: function onBeforeKeyDown(event) {
      // For input elements, prevent event propagation. It allows entering text into an input
      // element freely - without steeling the key events from the menu module (#6506, #6549).
      if ((0, _element.isInput)(event.target) && this.container.contains(event.target)) {
        (0, _event.stopImmediatePropagation)(event);
        return;
      }

      var selection = this.hotMenu.getSelectedLast();
      var stopEvent = false;
      this.keyEvent = true;

      switch (event.keyCode) {
        case _unicode.KEY_CODES.ESCAPE:
          this.close();
          stopEvent = true;
          break;

        case _unicode.KEY_CODES.ENTER:
          if (selection) {
            if (this.hotMenu.getSourceDataAtRow(selection[0]).submenu) {
              stopEvent = true;
            } else {
              this.executeCommand(event);
              this.close(true);
            }
          }

          break;

        case _unicode.KEY_CODES.ARROW_DOWN:
          if (selection) {
            this.selectNextCell(selection[0], selection[1]);
          } else {
            this.selectFirstCell();
          }

          stopEvent = true;
          break;

        case _unicode.KEY_CODES.ARROW_UP:
          if (selection) {
            this.selectPrevCell(selection[0], selection[1]);
          } else {
            this.selectLastCell();
          }

          stopEvent = true;
          break;

        case _unicode.KEY_CODES.ARROW_RIGHT:
          if (selection) {
            var menu = this.openSubMenu(selection[0]);

            if (menu) {
              menu.selectFirstCell();
            }
          }

          stopEvent = true;
          break;

        case _unicode.KEY_CODES.ARROW_LEFT:
          if (selection && this.isSubMenu()) {
            this.close();

            if (this.parentMenu) {
              this.parentMenu.hotMenu.listen();
            }

            stopEvent = true;
          }

          break;

        default:
          break;
      }

      if (stopEvent) {
        event.preventDefault();
        (0, _event.stopImmediatePropagation)(event);
      }

      this.keyEvent = false;
    }
    /**
     * On after init listener.
     *
     * @private
     */

  }, {
    key: "onAfterInit",
    value: function onAfterInit() {
      var wtTable = this.hotMenu.view.wt.wtTable;
      var data = this.hotMenu.getSettings().data;
      var hiderStyle = wtTable.hider.style;
      var holderStyle = wtTable.holder.style;
      var currentHiderWidth = parseInt(hiderStyle.width, 10);
      var realHeight = (0, _array.arrayReduce)(data, function (accumulator, value) {
        return accumulator + (value.name === _predefinedItems.SEPARATOR ? 1 : 26);
      }, 0);
      holderStyle.width = "".concat(currentHiderWidth + 22, "px");
      holderStyle.height = "".concat(realHeight + 4, "px");
      hiderStyle.height = holderStyle.height;
    }
    /**
     * On after selection listener.
     *
     * @param {Number} r Selection start row index.
     * @param {Number} c Selection start column index.
     * @param {Number} r2 Selection end row index.
     * @param {Number} c2 Selection end column index.
     * @param {Object} preventScrolling Object with `value` property where its value change will be observed.
     * @param {Number} selectionLayerLevel The number which indicates what selection layer is currently modified.
     */

  }, {
    key: "onAfterSelection",
    value: function onAfterSelection(r, c, r2, c2, preventScrolling) {
      if (this.keyEvent === false) {
        preventScrolling.value = true;
      }
    }
    /**
     * Document mouse down listener.
     *
     * @private
     * @param {Event} event
     */

  }, {
    key: "onDocumentMouseDown",
    value: function onDocumentMouseDown(event) {
      if (!this.isOpened()) {
        return;
      } // Close menu when clicked element is not belongs to menu itself


      if (this.options.standalone && this.hotMenu && !(0, _element.isChildOf)(event.target, this.hotMenu.rootElement)) {
        this.close(true); // Automatically close menu when clicked element is not belongs to menu or submenu (not necessarily to itself)
      } else if ((this.isAllSubMenusClosed() || this.isSubMenu()) && !(0, _element.isChildOf)(event.target, '.htMenu') && ((0, _element.isChildOf)(event.target, this.container.ownerDocument) || (0, _element.isChildOf)(event.target, this.hot.rootDocument))) {
        this.close(true);
      }
    }
  }]);

  return Menu;
}();

(0, _object.mixin)(Menu, _localHooks.default);
var _default = Menu;
exports.default = _default;