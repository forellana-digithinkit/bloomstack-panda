"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.safe = safe;
exports.resolveComponentName = resolveComponentName;
exports.resolveRequiredComponents = resolveRequiredComponents;
exports.default = exports.Component = void 0;

require("core-js/modules/es6.object.define-property");

require("core-js/modules/es6.reflect.apply");

require("core-js/modules/es6.object.assign");

require("core-js/modules/es7.object.values");

require("core-js/modules/es6.reflect.delete-property");

require("core-js/modules/es6.reflect.set");

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.promise");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.string.iterator");

require("core-js/modules/es6.reflect.construct");

require("regenerator-runtime/runtime");

require("core-js/modules/es6.array.index-of");

require("core-js/modules/es6.array.reduce");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.for-each");

require("core-js/modules/es6.reflect.get");

require("core-js/modules/es6.reflect.has");

require("core-js/modules/es6.function.name");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Helper function which returns function results or variable value from the passed
 * fnOrVal parameter. Optionally when fnOrVar is not a function, args[0] will be used
 * as a default return value.
 * @param {any} fnOrVar A value or function to call.
 * @param {...any} args Arguments used when fnOrVar is a function. Else first value is
 *                       used as a default return value.
 */
function safe(fnOrVar) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (typeof fnOrVar === 'function') {
    return fnOrVar.apply(void 0, args);
  } else if (typeof fnOrVar === 'undefined') {
    return args.length > 0 ? args[0] : undefined;
  }

  return fnOrVar;
}
/**
 * Helper function used to retrieve a class instance name from either
 * its instance or constructor.
 * @param {Component} component The component instance or constructor to 
 *                              extract class name.
 */


function resolveComponentName(component) {
  var componentName = component.constructor.name;

  if (componentName === 'Function') {
    componentName = component.name;
  }

  return componentName;
}
/**
 * Helper function used to resolve components static required components 
 * while keeping inherited components intact.
 * @param {Component} component The component to resolve requirements.
 */


function resolveRequiredComponents(component) {
  var requiredComponents = (component.requiredComponents || []).reverse();
  var parentClass = component.constructor; // build component list using inheritance order

  do {
    if (parentClass.name !== undefined) {
      if (Reflect.has(parentClass, "requiredComponents")) {
        // add our components in reverse so we keep inheritance
        // component addition order
        var inheritedComponents = Reflect.get(parentClass, "requiredComponents");

        if (inheritedComponents.constructor === Array) {
          inheritedComponents.slice().reverse().forEach(function (comp) {
            requiredComponents.push(comp);
          });
        }
      }
    }
  } while (parentClass = Object.getPrototypeOf(parentClass));

  requiredComponents = requiredComponents.reverse(); // deduplicate components

  requiredComponents = requiredComponents.reduce(function (result, comp) {
    if (comp !== undefined && result.indexOf(comp) === -1) {
      result.push(comp);
    }

    return result;
  }, []);
  return requiredComponents;
}
/**
 * @callback Component~onUpdate
 * @returns Promise
 */

/**
 * A generic aggregation style component class meant to be used for extensible
 * code reuse and independent testing.
 */


var Component =
/*#__PURE__*/
function () {
  _createClass(Component, null, [{
    key: "of",

    /**
     * Component name used to quickly identify components when used as child
     * components.
     */

    /**
     * When false, component will refuse updates.
     */

    /**
     * Helper static method used to quickly find the instance of this class
     * on the passed component. This is the same as calling: this.getComponent(MyComponent)
     * @param {Component} instance 
     */
    value: function of(instance) {
      return instance.getComponent(this);
    }
    /**
     * Static component instantiator. You should use this method when creating new
     * instances of this component. It will resolve components async in a single call.
     */

  }, {
    key: "create",
    value: function () {
      var _create = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var comp,
            _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                comp = Reflect.construct(this, _args); // build default required components

                _context.next = 3;
                return Promise.all(resolveRequiredComponents(comp).map(function (c) {
                  return comp.addComponent(c);
                }));

              case 3:
                return _context.abrupt("return", comp);

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function create() {
        return _create.apply(this, arguments);
      }

      return create;
    }()
    /**
     * Static component instantiator. You should use this method when creating new
     * instances of this component. It will resolve components async in a single call as
     * well as initializing the component and all of its sub-components and children.
     */

  }, {
    key: "createAndInit",
    value: function () {
      var _createAndInit = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        var comp,
            _args2 = arguments;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                comp = Reflect.construct(this, _args2); // build default required components

                _context2.next = 3;
                return Promise.all(resolveRequiredComponents(comp).map(function (c) {
                  return comp.addComponent(c);
                }));

              case 3:
                _context2.next = 5;
                return comp.init();

              case 5:
                return _context2.abrupt("return", comp);

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function createAndInit() {
        return _createAndInit.apply(this, arguments);
      }

      return createAndInit;
    }()
    /**
     * Component constructor. Avoid instantiating components directly, instead use
     * Component.create() or if inherited MyComponent.create()
     * @param {Component} baseComponent The root component where the main logic lives.
     * @param {Component} parent The root component when this component is a used as a child.
     */

  }]);

  function Component(baseComponent, parent) {
    _classCallCheck(this, Component);

    _defineProperty(this, "name", "Component");

    _defineProperty(this, "enabled", true);

    this._inited = false;
    this._started = false;
    this._enabled = true;
    this._components = {};
    this._parent = parent;
    this._children = [];
    this._canUpdate = true;
    this.name = this.constructor.name;
    this._baseComponent = baseComponent || null;
  }
  /**
   * Gets this component's parent node
   */


  _createClass(Component, [{
    key: "isBaseComponent",

    /**
     * Returns true if this component is the root component.
     */
    value: function isBaseComponent() {
      return !this._baseComponent;
    }
    /**
     * Adds a sub component to this component.
     * @param {Component} component 
     */

  }, {
    key: "addComponent",
    value: function () {
      var _addComponent = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(component) {
        var componentName, instance, instanceRequiredComponents;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!this._baseComponent) {
                  _context3.next = 4;
                  break;
                }

                _context3.next = 3;
                return this._baseComponent.addComponent(component);

              case 3:
                return _context3.abrupt("return", _context3.sent);

              case 4:
                componentName = resolveComponentName(component);

                if (!Reflect.has(this._components, componentName)) {
                  _context3.next = 7;
                  break;
                }

                return _context3.abrupt("return", Reflect.get(this._components, componentName));

              case 7:
                _context3.next = 9;
                return component.create(this);

              case 9:
                instance = _context3.sent;
                // Reflect.construct(component, [this]);
                instanceRequiredComponents = Reflect.get(component, "requiredComponents") || [];
                _context3.next = 13;
                return Promise.all(instanceRequiredComponents.map(function (comp) {
                  return instance.addComponent(comp);
                }));

              case 13:
                Reflect.set(this._components, componentName, instance);

                if (!this._inited) {
                  _context3.next = 17;
                  break;
                }

                _context3.next = 17;
                return instance.init();

              case 17:
                return _context3.abrupt("return", instance);

              case 18:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function addComponent(_x) {
        return _addComponent.apply(this, arguments);
      }

      return addComponent;
    }()
    /**
     * Removes a sub component from this component.
     * @param {Component} component The component to remove.
     */

  }, {
    key: "removeComponent",
    value: function () {
      var _removeComponent = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(component) {
        var componentName, comp;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!this._baseComponent) {
                  _context4.next = 2;
                  break;
                }

                return _context4.abrupt("return", this._baseComponent.removeComponent(component));

              case 2:
                componentName = resolveComponentName(component);
                comp = this.getComponent(component);
                comp.shutdown();
                return _context4.abrupt("return", Reflect.deleteProperty(this._components, componentName));

              case 6:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function removeComponent(_x2) {
        return _removeComponent.apply(this, arguments);
      }

      return removeComponent;
    }()
    /**
     * Returns true if the provided component exists in this component.
     * @param {Component} component 
     */

  }, {
    key: "hasComponent",
    value: function hasComponent(component) {
      if (this._baseComponent) {
        return this._baseComponent.getComponent(component);
      }

      var componentName = resolveComponentName(component);
      return Reflect.has(this._components, componentName);
    }
    /**
     * Finds the component instance matching the passed constructor
     * @param {Component} component 
     */

  }, {
    key: "getComponent",
    value: function getComponent(component) {
      if (this._baseComponent) {
        return this._baseComponent.getComponent(component);
      }

      var componentName = resolveComponentName(component);

      if (Reflect.has(this._components, componentName)) {
        return Reflect.get(this._components, componentName);
      }

      throw new Error("".concat(this.constructor.name, " has no component: ").concat(componentName));
    }
    /**
     * Returns an array of all sub components of this component.
     */

  }, {
    key: "getAllComponents",
    value: function getAllComponents() {
      if (this._baseComponent) {
        return this._baseComponent.getAllComponents();
      }

      return Object.values(this._components);
    }
    /**
     * Adds a child component to this component hierarchy. 
     * @param {Component} child The child component constructor.
     * @param {object} props (optional) Default fields to set.
     */

  }, {
    key: "addChild",
    value: function () {
      var _addChild = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5(child, props) {
        var _this = this;

        var childInstance;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!this._baseComponent) {
                  _context5.next = 4;
                  break;
                }

                _context5.next = 3;
                return this._baseComponent.addChild(child, props);

              case 3:
                return _context5.abrupt("return", _context5.sent);

              case 4:
                if (!(child.constructor === Array)) {
                  _context5.next = 8;
                  break;
                }

                _context5.next = 7;
                return Promise.all(child.map(function (c) {
                  return _this.addChild(c, props);
                }));

              case 7:
                return _context5.abrupt("return", _context5.sent);

              case 8:
                _context5.next = 10;
                return child.create(null, this);

              case 10:
                childInstance = _context5.sent;

                if (props) {
                  childInstance = Object.assign(childInstance, props);
                }

                this._children.push(childInstance);

                if (!this._inited) {
                  _context5.next = 16;
                  break;
                }

                _context5.next = 16;
                return childInstance.init();

              case 16:
                _context5.next = 18;
                return this.send('onAddChild', this, childInstance);

              case 18:
                _context5.next = 20;
                return this.broadcast('onBaseAddChild', this, childInstance);

              case 20:
                return _context5.abrupt("return", childInstance);

              case 21:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function addChild(_x3, _x4) {
        return _addChild.apply(this, arguments);
      }

      return addChild;
    }()
    /**
     * Remvoes a child component from this component.
     * @param {Component} child The child component to remove.
     */

  }, {
    key: "removeChild",
    value: function () {
      var _removeChild = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6(child) {
        var foundChildIdx;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!this._baseComponent) {
                  _context6.next = 4;
                  break;
                }

                _context6.next = 3;
                return this._baseComponent.removeChild(child);

              case 3:
                return _context6.abrupt("return", _context6.sent);

              case 4:
                foundChildIdx = this._children.indexOf(child);

                if (!(foundChildIdx > -1)) {
                  _context6.next = 14;
                  break;
                }

                this._children.splice(foundChildIdx, 1);

                _context6.next = 9;
                return this.send("onRemoveChild", this, child);

              case 9:
                _context6.next = 11;
                return this.broadcast("onBaseRemoveChild", this, child);

              case 11:
                _context6.next = 13;
                return child.shutdown();

              case 13:
                return _context6.abrupt("return", true);

              case 14:
                return _context6.abrupt("return", false);

              case 15:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function removeChild(_x5) {
        return _removeChild.apply(this, arguments);
      }

      return removeChild;
    }()
    /**
     * Finds the child whose nape parameter matches the passed value.
     * @param {string} name Name of child component to find.
     */

  }, {
    key: "getChild",
    value: function getChild(name) {
      if (this._baseComponent) {
        return this._baseComponent.getChild(name);
      }

      var result = this.findChildren(function (child) {
        return child.name === name;
      });

      if (result.length > 0) {
        return result[0];
      }

      return null;
    }
    /**
     * Returns an array of children components attached to this component.
     */

  }, {
    key: "getChildren",
    value: function getChildren() {
      if (this._baseComponent) {
        return this._baseComponent.getChildren();
      }

      return this._children;
    }
    /**
     * Finds child components filtered by passed predicate.
     * @example this.findChildren((child) => child.enabled);
     * @param {function} predicate Filter predicate.
     */

  }, {
    key: "findChildren",
    value: function findChildren(predicate) {
      if (this._baseComponent) {
        return this._baseComponent.findChildren(predicate);
      }

      return this._children.reduce(function (cur, child) {
        if (predicate(child)) {
          cur.push(child);
        }

        return cur;
      }, []);
    }
    /**
     * Initializes component and all attached components if this is the base component.
     * @async
     */

  }, {
    key: "init",
    value: function () {
      var _init = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee7() {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (!this._inited) {
                  _context7.next = 2;
                  break;
                }

                return _context7.abrupt("return", this);

              case 2:
                this._inited = true;
                _context7.next = 5;
                return this.broadcast("onInit");

              case 5:
                console.log("-init->onStart");
                _context7.next = 8;
                return this.broadcast('onStart');

              case 8:
                this._started = true;

                if (!this.canUpdate) {
                  _context7.next = 12;
                  break;
                }

                _context7.next = 12;
                return this.update();

              case 12:
                _context7.next = 14;
                return this.broadcast('onLateStart', this.canUpdate);

              case 14:
                return _context7.abrupt("return", this);

              case 15:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function init() {
        return _init.apply(this, arguments);
      }

      return init;
    }()
    /**
     * Calls the component update pipeline.
     */

  }, {
    key: "update",
    value: function () {
      var _update = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee8() {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (this._inited) {
                  _context8.next = 3;
                  break;
                }

                _context8.next = 3;
                return this.init();

              case 3:
                if (!(!this.enabled || !this.canUpdate)) {
                  _context8.next = 5;
                  break;
                }

                return _context8.abrupt("return");

              case 5:
                _context8.next = 7;
                return this.broadcast('onUpdate');

              case 7:
                _context8.next = 9;
                return this.broadcast('onAfterUpdate', this.canUpdate);

              case 9:
                return _context8.abrupt("return", this);

              case 10:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function update() {
        return _update.apply(this, arguments);
      }

      return update;
    }()
    /**
     * Internally called when component is being removed
     */

  }, {
    key: "shutdown",
    value: function () {
      var _shutdown = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee9() {
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (!this.isBaseComponent) {
                  _context9.next = 5;
                  break;
                }

                _context9.next = 3;
                return this.broadcast("onBaseShutdown", this);

              case 3:
                _context9.next = 7;
                break;

              case 5:
                _context9.next = 7;
                return this.broadcast("onComponentShutdown", this);

              case 7:
                _context9.next = 9;
                return this.broadcast("onShutdown", this);

              case 9:
                return _context9.abrupt("return", _context9.sent);

              case 10:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function shutdown() {
        return _shutdown.apply(this, arguments);
      }

      return shutdown;
    }()
    /**
     * Broadcasts a method call to all components and child components. Including the base component.
     * @param {string} method The method name to call.
     * @param  {...any} args Arguments to pass to the method.
     */

  }, {
    key: "broadcast",
    value: function () {
      var _broadcast = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee10(method) {
        var _len2,
            args,
            _key2,
            _this$_baseComponent,
            _args10 = arguments;

        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                for (_len2 = _args10.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                  args[_key2 - 1] = _args10[_key2];
                }

                if (!this._baseComponent) {
                  _context10.next = 5;
                  break;
                }

                _context10.next = 4;
                return (_this$_baseComponent = this._baseComponent).broadcast.apply(_this$_baseComponent, [method].concat(args));

              case 4:
                return _context10.abrupt("return", _context10.sent);

              case 5:
                _context10.next = 7;
                return this.send.apply(this, [method].concat(args));

              case 7:
                _context10.next = 9;
                return Promise.all(this.getChildren().reduce(function (res, child) {
                  if (child.enabled) {
                    var fn = Reflect.get(child, method);

                    if (fn) {
                      res.push(Reflect.apply(fn, child, args));
                    }
                  }

                  return res;
                }, []));

              case 9:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function broadcast(_x6) {
        return _broadcast.apply(this, arguments);
      }

      return broadcast;
    }()
    /**
     * Similar to broadcast, it calls all sub components and the base component.
     * @param {string} method The method to call
     * @param  {...any} args Arguments to pass to method call.
     */

  }, {
    key: "send",
    value: function () {
      var _send = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee11(method) {
        var _len3,
            args,
            _key3,
            _this$_baseComponent2,
            fn,
            _args11 = arguments;

        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                for (_len3 = _args11.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                  args[_key3 - 1] = _args11[_key3];
                }

                if (!this._baseComponent) {
                  _context11.next = 5;
                  break;
                }

                _context11.next = 4;
                return (_this$_baseComponent2 = this._baseComponent).send.apply(_this$_baseComponent2, [method].concat(args));

              case 4:
                return _context11.abrupt("return", _context11.sent);

              case 5:
                fn = Reflect.get(this, method);

                if (!fn) {
                  _context11.next = 9;
                  break;
                }

                _context11.next = 9;
                return Reflect.apply(fn, this, args);

              case 9:
                _context11.next = 11;
                return Promise.all(this.getAllComponents().reduce(function (res, comp) {
                  if (comp.enabled) {
                    var _fn = Reflect.get(comp, method);

                    if (_fn) {
                      res.push(Reflect.apply(_fn, comp, args));
                    }
                  }

                  return res;
                }, []));

              case 11:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function send(_x7) {
        return _send.apply(this, arguments);
      }

      return send;
    }()
  }, {
    key: "parent",
    get: function get() {
      return this._parent;
    }
    /**
     * Gets this component base component instance.
     */

  }, {
    key: "baseComponent",
    get: function get() {
      return this._baseComponent;
    }
    /**
     * Returns true if component was initialized.
     */

  }, {
    key: "wasInitialized",
    get: function get() {
      return this._inited;
    }
    /**
     * Returns true if component was started.
     */

  }, {
    key: "wasStarted",
    get: function get() {
      return this._started;
    }
    /**
     * Returns true if component is allowed to run updates.
     */

  }, {
    key: "canUpdate",
    get: function get() {
      return this._canUpdate;
    }
    /**
     * Sets the component canUpdate flag. Only set this to pause rendering.
     */
    ,
    set: function set(value) {
      this._canUpdate = value;
    }
  }]);

  return Component;
}();

exports.Component = Component;
var _default = Component;
exports.default = _default;
