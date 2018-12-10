import expect from 'expect'
import { Component, safe, resolveComponentName, resolveRequiredComponents } from 'src';
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
