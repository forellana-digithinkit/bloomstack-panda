"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Event = exports.ChildToggle = void 0;

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.define-property");

require("core-js/modules/es6.object.create");

require("core-js/modules/es6.object.set-prototype-of");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.for-each");

require("regenerator-runtime/runtime");

var _index = _interopRequireDefault(require("./index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * The child toggle component handles toggling child component enable/dissable states.
 * Only one child component can be enabled after calling toggle.
 */
var ChildToggle =
/*#__PURE__*/
function (_Component) {
  _inherits(ChildToggle, _Component);

  function ChildToggle() {
    _classCallCheck(this, ChildToggle);

    return _possibleConstructorReturn(this, _getPrototypeOf(ChildToggle).apply(this, arguments));
  }

  _createClass(ChildToggle, [{
    key: "toggle",

    /**
     * Dissables all child components except for the passed child.
     * @param {Component|string} page 
     */
    value: function () {
      var _toggle = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(child) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                child = this.getChild(child);

                if (!child) {
                  _context.next = 9;
                  break;
                }

                this.getChildren().forEach(function (c) {
                  return c.enabled = c === child;
                });
                _context.next = 5;
                return this.send("onToggleChild", child);

              case 5:
                _context.next = 7;
                return child.update();

              case 7:
                _context.next = 9;
                return this.send("onAfterToggleChild", child);

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function toggle(_x) {
        return _toggle.apply(this, arguments);
      }

      return toggle;
    }()
  }]);

  return ChildToggle;
}(_index.default);

exports.ChildToggle = ChildToggle;

var Event =
/*#__PURE__*/
function () {
  function Event(isCancelable) {
    _classCallCheck(this, Event);

    this._isCancelable = isCancelable ? true : false;
    this._wasCanceled = false;
  }

  _createClass(Event, [{
    key: "cancel",
    value: function cancel() {
      if (this._isCancelable) {
        this._wasCanceled = true;
      } else {
        throw new error("This event is not cancelable");
      }
    }
  }, {
    key: "isCancelable",
    get: function get() {
      return this._isCancelable;
    }
  }, {
    key: "wasCanceled",
    get: function get() {
      return this._wasCanceled;
    }
  }]);

  return Event;
}();

exports.Event = Event;
