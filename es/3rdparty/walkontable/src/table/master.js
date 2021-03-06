import "core-js/modules/es.symbol";
import "core-js/modules/es.symbol.description";
import "core-js/modules/es.symbol.iterator";
import "core-js/modules/es.array.includes";
import "core-js/modules/es.array.iterator";
import "core-js/modules/es.object.get-prototype-of";
import "core-js/modules/es.object.set-prototype-of";
import "core-js/modules/es.object.to-string";
import "core-js/modules/es.string.iterator";
import "core-js/modules/web.dom-collections.iterator";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import { getStyle, getComputedStyle, getTrimmingContainer, isVisible } from './../../../../helpers/dom/element';
import Table from '../table';
import calculatedRows from './mixin/calculatedRows';
import calculatedColumns from './mixin/calculatedColumns';
import { mixin } from './../../../../helpers/object';
/**
 * Subclass of `Table` that provides the helper methods relevant to the master table (not overlays), implemented through mixins.
 */

var MasterTable =
/*#__PURE__*/
function (_Table) {
  _inherits(MasterTable, _Table);

  function MasterTable() {
    _classCallCheck(this, MasterTable);

    return _possibleConstructorReturn(this, _getPrototypeOf(MasterTable).apply(this, arguments));
  }

  _createClass(MasterTable, [{
    key: "alignOverlaysWithTrimmingContainer",
    value: function alignOverlaysWithTrimmingContainer() {
      var trimmingElement = getTrimmingContainer(this.wtRootElement);
      var rootWindow = this.wot.rootWindow;

      if (trimmingElement === rootWindow) {
        var preventOverflow = this.wot.getSetting('preventOverflow');

        if (!preventOverflow) {
          this.holder.style.overflow = 'visible';
          this.wtRootElement.style.overflow = 'visible';
        }
      } else {
        var trimmingElementParent = trimmingElement.parentElement;
        var trimmingHeight = getStyle(trimmingElement, 'height', rootWindow);
        var trimmingOverflow = getStyle(trimmingElement, 'overflow', rootWindow);
        var holderStyle = this.holder.style;
        var scrollWidth = trimmingElement.scrollWidth,
            scrollHeight = trimmingElement.scrollHeight;

        var _trimmingElement$getB = trimmingElement.getBoundingClientRect(),
            width = _trimmingElement$getB.width,
            height = _trimmingElement$getB.height;

        var overflow = ['auto', 'hidden', 'scroll'];

        if (trimmingElementParent && overflow.includes(trimmingOverflow)) {
          var cloneNode = trimmingElement.cloneNode(false); // Before calculating the height of the trimming element, set overflow: auto to hide scrollbars.
          // An issue occurred on Firefox, where an empty element with overflow: scroll returns an element height higher than 0px
          // despite an empty content within.

          cloneNode.style.overflow = 'auto';

          if (trimmingElement.nextElementSibling) {
            trimmingElementParent.insertBefore(cloneNode, trimmingElement.nextElementSibling);
          } else {
            trimmingElementParent.appendChild(cloneNode);
          }

          var cloneHeight = parseInt(getComputedStyle(cloneNode, rootWindow).height, 10);
          trimmingElementParent.removeChild(cloneNode);

          if (cloneHeight === 0) {
            height = 0;
          }
        }

        height = Math.min(height, scrollHeight);
        holderStyle.height = trimmingHeight === 'auto' ? 'auto' : "".concat(height, "px");
        width = Math.min(width, scrollWidth);
        holderStyle.width = "".concat(width, "px");
        holderStyle.overflow = '';
        this.hasTableHeight = holderStyle.height === 'auto' ? true : height > 0;
        this.hasTableWidth = width > 0;
      }

      this.isTableVisible = isVisible(this.TABLE);
    }
  }, {
    key: "markOversizedColumnHeaders",
    value: function markOversizedColumnHeaders() {
      var wot = this.wot;
      var overlayName = wot.getOverlayName();
      var columnHeaders = wot.getSetting('columnHeaders');
      var columnHeadersCount = columnHeaders.length;

      if (columnHeadersCount && !wot.wtViewport.hasOversizedColumnHeadersMarked[overlayName]) {
        var rowHeaders = wot.getSetting('rowHeaders');
        var rowHeaderCount = rowHeaders.length;
        var columnCount = this.getRenderedColumnsCount();

        for (var i = 0; i < columnHeadersCount; i++) {
          for (var renderedColumnIndex = -1 * rowHeaderCount; renderedColumnIndex < columnCount; renderedColumnIndex++) {
            this.markIfOversizedColumnHeader(renderedColumnIndex);
          }
        }

        wot.wtViewport.hasOversizedColumnHeadersMarked[overlayName] = true;
      }
    }
  }]);

  return MasterTable;
}(Table);

mixin(MasterTable, calculatedRows);
mixin(MasterTable, calculatedColumns);
export default MasterTable;