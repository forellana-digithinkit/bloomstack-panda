import expect from 'expect'
import { Component, safe, resolveComponentName, resolveRequiredComponents } from 'src';
import { Event } from 'src/utils';
const spyOn = expect.spyOn;

class TestClass {}

describe("Safe function and value handling", () => {
    it("safe function call", () => {
        let obj = {
            test: () => { return true; }
        }

        spyOn(obj, "test");
        safe(obj.test)

        expect(obj.test).toHaveBeenCalled();
    });

    it("safe function call with args", () => {
        let obj = {
            test: (arg1) => { return arg1; }
        }

        spyOn(obj, "test");
        safe(obj.test, "arg1")

        expect(obj.test).toHaveBeenCalledWith("arg1");
    });

    it("safe value", () => {
        let obj = {
            testValue: true
        }
        expect(safe(obj.testValue)).toBe(true);
    });

    it("safe value with default", () => {
        let obj = {}
        expect(safe(obj.invalidVar, "default")).toBe("default");
    });

});

describe("Class name resolver", () => {
    it("from class constructor", () => {
        expect(resolveComponentName(TestClass)).toBe("TestClass");
    });

    it("from class instance", () => {
        let instance = new TestClass();
        expect(resolveComponentName(instance)).toBe("TestClass");
    });
});

class C1 {
    static requiredComponents = [ 1, 2, 3, 4 ]
}
class C2 extends C1 {
    static requiredComponents = [ 4, 5, 6, 7 ]
    requiredComponents = [6, 7, 8, 9]
}

describe("Required components inheritance", () => {

    it("Static lv1 components", () => {
        expect(resolveRequiredComponents(new C1())).toEqual([1, 2, 3, 4]);
    });

    it("Static lv2 components", () => {
        expect(resolveRequiredComponents(new C2())).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

});

class CancelEventComponent extends Component {
    onMessage(e) {
        e.cancel();
        return e;
    }
}

describe("Event", () => {

    it("Event construct defaults", () => {
        let e = new Event();
        expect(e.isCancelable).toBe(false);
        expect(e.wasCanceled).toBe(false);
    });

    it("Event construct cancelable", () => {
        let e = new Event(true);
        expect(e.isCancelable).toBe(true);
        expect(e.wasCanceled).toBe(false);
    });

    it("Event construct non cancelable", () => {
        let e = new Event(false);
        expect(e.isCancelable).toBe(false);
        expect(e.wasCanceled).toBe(false);
    });

    it("Event cancel", () => {
        let e = new Event(true);
        expect(e.isCancelable).toBe(true);
        expect(e.wasCanceled).toBe(false);
        spyOn(e, "cancel").andCallThrough();
        e.cancel();
        expect(e.cancel).toHaveBeenCalled();
        expect(e.wasCanceled).toBe(true);
    });

    it("Event non cancelable", () => {
        let e = new Event(false);
        expect(e.isCancelable).toBe(false);
        expect(e.wasCanceled).toBe(false);
        spyOn(e, "cancel").andCallThrough();
        expect(() => e.cancel()).toThrow();
        expect(e.cancel).toHaveBeenCalled();
        expect(e.wasCanceled).toBe(false);
    });    

    it("Component send Event cancel", async () => {
        let comp = await Component.create();
        await comp.addComponent(CancelEventComponent);
        await comp.init();

        let ec = CancelEventComponent.of(comp);

        expect(ec.constructor === CancelEventComponent).toBe(true);

        spyOn(ec, "onMessage").andCallThrough();
        
        let event = new Event(true);
        await comp.send("onMessage", event);

        expect(ec.onMessage).toHaveBeenCalledWith(event);
        expect(event.wasCanceled).toBe(true);

    });

});