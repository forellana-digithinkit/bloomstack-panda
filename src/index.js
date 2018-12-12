
/**
 * Helper function which returns function results or variable value from the passed
 * fnOrVal parameter. Optionally when fnOrVar is not a function, args[0] will be used
 * as a default return value.
 * @param {any} fnOrVar A value or function to call.
 * @param  {...any} args Arguments used when fnOrVar is a function. Else first value is
 *                       used as a default return value.
 */
export function safe(fnOrVar, ...args) {
    if ( typeof fnOrVar === 'function' ) {
        return fnOrVar(...args);
    } else if ( typeof fnOrVar === 'undefined' ) {
        return args.length > 0?args[0]:undefined;
    }

    return fnOrVar;
}

/**
 * Helper function used to retrieve a class instance name from either
 * its instance or constructor.
 * @param {Component} component The component instance or constructor to 
 *                              extract class name.
 */
export function resolveComponentName(component) {
    let componentName = component.constructor.name;
    if ( componentName === 'Function' ) {
        componentName = component.name;
    }
    return componentName;
}

/**
 * Helper function used to resolve components static required components 
 * while keeping inherited components intact.
 * @param {Component} component The component to resolve requirements.
 */
export function resolveRequiredComponents(component) {
    let requiredComponents = (component.requiredComponents || []).reverse();
    let parentClass = component.constructor;


    // build component list using inheritance order
    do {
        if ( parentClass.name !== undefined ) {
            if ( Reflect.has(parentClass, "requiredComponents") ) {
                // add our components in reverse so we keep inheritance
                // component addition order
                let inheritedComponents = Reflect.get(parentClass, "requiredComponents");
                if ( inheritedComponents.constructor === Array ) {
                    inheritedComponents.slice().reverse().forEach((comp) => {
                        requiredComponents.push(comp);
                    })
                }
            }
        }
    
    } while((parentClass = Object.getPrototypeOf(parentClass)))

    requiredComponents = requiredComponents.reverse();

    // deduplicate components
    requiredComponents = requiredComponents.reduce((result, comp) => {
        if ( comp !== undefined && result.indexOf(comp) === -1 ) {
            result.push(comp);
        }

        return result;
    }, []);
    
    return requiredComponents;
}


/**
 * A generic aggregation style component class meant to be used for extensible
 * code reuse and independent testing.
 */
export class Component {

    /**
     * Component name used to quickly identify components when used as child
     * components.
     */
    name = "Component";
    /**
     * When false, component will refuse updates.
     */
    enabled = true;

    /**
     * Helper static method used to quickly find the instance of this class
     * on the passed component. This is the same as calling: this.getComponent(MyComponent)
     * @param {Component} instance 
     */
    static of(instance) {
        return instance.getComponent(this);
    }

    /**
     * Static component instantiator. You should use this method when creating new
     * instances of this component. It will resolve components async in a single call.
     */
    static async create() {
        let comp = Reflect.construct(this, arguments);
        // build default required components
        await Promise.all(resolveRequiredComponents(comp)
            .map(c => comp.addComponent(c)));
        return comp;
    }

    /**
     * Static component instantiator. You should use this method when creating new
     * instances of this component. It will resolve components async in a single call as
     * well as initializing the component and all of its sub-components and children.
     */
    static async createAndInit() {
        let comp = Reflect.construct(this, arguments);
        // build default required components
        await Promise.all(resolveRequiredComponents(comp)
            .map(c => comp.addComponent(c)));
        await comp.init();
        return comp;
    }

    /**
     * Component constructor. Avoid instantiating components directly, instead use
     * Component.create() or if inherited MyComponent.create()
     * @param {Component} baseComponent The root component where the main logic lives.
     * @param {Component} parent The root component when this component is a used as a child.
     */
    constructor(baseComponent, parent) {
        this._inited = false;
        this._started = false;
        this._enabled = true;
        this._components = {}
        this._parent = parent;
        this._children = [];

        this._baseComponent = baseComponent || null;
    }

    get parent() {
        return this._parent;
    }

    get baseComponent() {
        return this._baseComponent;
    }

    /**
     * Returns true if this component is the root component.
     */
    isBaseComponent() {
        return !this._baseComponent;
    }

    /**
     * Adds a sub component to this component.
     * @param {Component} component 
     */
    async addComponent(component) {
        if ( this._baseComponent ) {
            return await this._baseComponent.addComponent(component);
        }

        let componentName = resolveComponentName(component);

        if ( Reflect.has(this._components, componentName) ) {
            return Reflect.get(this._components, componentName);
        }

        let instance = await component.create(this);// Reflect.construct(component, [this]);

        let instanceRequiredComponents = Reflect.get(component, "requiredComponents") || [];
        await Promise.all(instanceRequiredComponents.map((comp) => instance.addComponent(comp)));

        Reflect.set(this._components, componentName, instance);

        if ( this._inited ) {
            await instance.init();
        }

        return instance;
    }
    
    /**
     * Removes a sub component from this component.
     * @param {Component} component The component to remove.
     */
    async removeComponent(component) {
        if ( this._baseComponent ) {
            return this._baseComponent.removeComponent(component);
        }

        let componentName = resolveComponentName(component);

        let comp = this.getComponent(component);
        comp.shutdown();

        return Reflect.deleteProperty(this._components, componentName);
    }

    /**
     * Returns true if the provided component exists in this component.
     * @param {Component} component 
     */
    hasComponent(component) {
        if ( this._baseComponent ) {
            return this._baseComponent.getComponent(component);
        }

        let componentName = resolveComponentName(component);

        return Reflect.has(this._components, componentName);
    }

    /**
     * Finds the component instance matching the passed constructor
     * @param {Component} component 
     */
    getComponent(component) {
        if ( this._baseComponent ) {
            return this._baseComponent.getComponent(component);
        }

        let componentName = resolveComponentName(component);

        if ( Reflect.has(this._components, componentName) ) {
            return Reflect.get(this._components, componentName);
        }

        throw new Error(`${this.constructor.name} has no component: ${componentName}`);
    }

    /**
     * Returns an array of all sub components of this component.
     */
    getAllComponents() {
        if ( this._baseComponent ) {
            return this._baseComponent.getAllComponents();
        }

        return Object.values(this._components);
    }

    /**
     * Adds a child component to this component hierarchy. 
     * @param {Component} child The child component constructor.
     * @param {object} props (optional) Default fields to set.
     */
    async addChild(child, props) {

        if ( this._baseComponent ) {
            return await this._baseComponent.addChild(child, props);
        }

        if ( child.constructor === Array ) {
            return await Promise.all(child.map(c => this.addChild(c, props)));
        }

        let childInstance = await child.create(null, this);

        if ( props ) {
            childInstance = Object.assign(childInstance, props);
        }

        this._children.push(childInstance);
        if ( this._inited ) {
            await childInstance.init();
        }

        await this.send('onAddChild', this, childInstance);
        await this.broadcast('onBaseAddChild', this, childInstance);
        
        return childInstance;
    }

    /**
     * Remvoes a child component from this component.
     * @param {Component} child The child component to remove.
     */
    async removeChild(child) {
        if ( this._baseComponent ) {
            return await this._baseComponent.removeChild(child);
        }

        let foundChildIdx = this._children.indexOf(child);
        if ( foundChildIdx > -1 ) {
            this._children.splice(foundChildIdx, 1);

            await this.send("onRemoveChild", this, child);
            await this.broadcast("onBaseRemoveChild", this, child);

            await child.shutdown();

            return true;
        }

        return false;
    }

    /**
     * Finds the child whose nape parameter matches the passed value.
     * @param {string} name Name of child component to find.
     */
    getChild(name) {
        if ( this._baseComponent ) {
            return this._baseComponent.getChild(name);
        }

        let result = this.findChildren((child) => child.name === name);
        if ( result.length > 0 ) {
            return result[0];
        }

        return null;
    }

    /**
     * Returns an array of children components attached to this component.
     */
    getChildren() {
        if ( this._baseComponent ) {
            return this._baseComponent.getChildren();
        }

        return this._children;
    }

    /**
     * Finds child components filtered by passed predicate.
     * @example this.findChildren((child) => child.enabled);
     * @param {function} predicate Filter predicate.
     */
    findChildren(predicate) {
        if ( this._baseComponent ) {
            return this._baseComponent.findChildren(predicate);
        }

        return this._children.reduce((cur, child) => {
            if ( predicate(child) ) {
                cur.push(child);
            }
            return cur;
        }, []);
    }

    /**
     * Initializes component and all attached components if this is the base component.
     * @async
     */
    async init() {
        if ( this._inited ) {
            return this;
        }

        this._inited = true;

        await this.broadcast("onInit");
        await this.broadcast('onStart');
        await this.update();
        await this.broadcast('onLateStart');

        return this;
    }

    /**
     * Calls the component update pipeline.
     */
    async update() {
        if ( !this._inited ) {
            await this.init()
        }

        if ( !this.enabled ) {
            return;
        }

        await this.broadcast('onUpdate', ...arguments);
        await this.broadcast('onAfterUpdate', ...arguments);

        return this;
    }

    /**
     * Internally called when component is being removed
     */
    async shutdown() {
        if ( this.isBaseComponent ) {
            await this.broadcast("onBaseShutdown", this);
        } else {
            await this.broadcast("onComponentShutdown", this);
        }

        return await this.broadcast("onShutdown", this);
    }

    /**
     * Broadcasts a method call to all components and child components. Including the base component.
     * @param {string} method The method name to call.
     * @param  {...any} args Arguments to pass to the method.
     */
    async broadcast(method, ...args) {
        if ( this._baseComponent ) {
            return await this._baseComponent.broadcast(method, ...args);
        }

        await this.send(method, ...args);

        await Promise.all(
            this.getChildren()
            .reduce((res, child) => {
                if( child.enabled ) {
                    let fn = Reflect.get(child, method);
                    if ( fn ) {
                        res.push(Reflect.apply(fn, child, args));
                    }
                }
                return res;
            }, [])
        )
    }

    /**
     * Similar to broadcast, it calls all sub components and the base component.
     * @param {string} method The method to call
     * @param  {...any} args Arguments to pass to method call.
     */
    async send(method, ...args) {
        if ( this._baseComponent ) {
            return await this._baseComponent.send(method, ...args);
        }

        let fn = Reflect.get(this, method);
        if ( fn ) {
            await Reflect.apply(fn, this, args);
        }

        await Promise.all(
            this.getAllComponents()
                .reduce((res, comp) => {
                    if ( comp.enabled ) {
                        let fn = Reflect.get(comp, method);
                        if ( fn ) {
                            res.push(Reflect.apply(fn, comp, args));
                        }
                    }
                    return res;
                }, [])
        )
    }
}

export default Component;