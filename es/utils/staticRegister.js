import "core-js/modules/es.symbol";
import "core-js/modules/es.symbol.description";
import "core-js/modules/es.symbol.iterator";
import "core-js/modules/es.array.from";
import "core-js/modules/es.array.iterator";
import "core-js/modules/es.map";
import "core-js/modules/es.object.to-string";
import "core-js/modules/es.regexp.to-string";
import "core-js/modules/es.string.iterator";
import "core-js/modules/web.dom-collections.iterator";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

export var collection = new Map();
export default function staticRegister() {
  var namespace = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'common';

  if (!collection.has(namespace)) {
    collection.set(namespace, new Map());
  }

  var subCollection = collection.get(namespace);
  /**
   * Register an item to the collection. If the item under the same was exist earlier then this item will be replaced with new one.
   *
   * @param {String} name Identification of the item.
   * @param {*} item Item to save in the collection.
   */

  function register(name, item) {
    subCollection.set(name, item);
  }
  /**
   * Retrieve the item from the collection.
   *
   * @param {String} name Identification of the item.
   * @returns {*} Returns item which was saved in the collection.
   */


  function getItem(name) {
    return subCollection.get(name);
  }
  /**
   * Check if item under specyfied name is exists.
   *
   * @param {String} name Identification of the item.
   * @returns {Boolean} Returns `true` or `false` depends on if element exists in the collection.
   */


  function hasItem(name) {
    return subCollection.has(name);
  }
  /**
   * Retrieve list of names registered from the collection.
   *
   * @returns {Array} Returns an array of strings with all names under which objects are stored.
   */


  function getNames() {
    return _toConsumableArray(subCollection.keys());
  }
  /**
   * Retrieve all registered values from the collection.
   *
   * @returns {Array} Returns an array with all values stored in the collection.
   */


  function getValues() {
    return _toConsumableArray(subCollection.values());
  }

  return {
    register: register,
    getItem: getItem,
    hasItem: hasItem,
    getNames: getNames,
    getValues: getValues
  };
}