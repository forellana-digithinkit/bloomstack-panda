import expect from 'expect'
import { Component } from 'src';

const spyOn = expect.spyOn;

describe("Component", async () => {
  it("Construct static defaults", async () => {
    let comp = await Component.create();
    expect(comp._inited).toBe(false);
    await comp.init();
    expect(comp._inited).toBe(true);
  });

  it("Construct static defaults", async () => {
    let comp = await Component.createAndInit();
    expect(comp._inited).toBe(true);
  });

  it("Construct static baseComponent", async () => {
    let baseComp = await Component.createAndInit();
    let comp = await Component.create(baseComp);
    expect(comp._inited).toBe(false);
    expect(comp.baseComponent === baseComp).toBe(true);
  });

  it("Construct static parent", async () => {
    let parentComp = await Component.createAndInit();
    let comp = await Component.create(null, parentComp);
    expect(comp._inited).toBe(false);
    expect(!comp.baseComp).toBe(true);
    expect(comp.parent === parentComp).toBe(true);
  });

  it("Construct static baseComponent and parent", async () => {
    let baseComp = await Component.createAndInit();
    let parentComp = await Component.createAndInit();
    let comp = await Component.create(baseComp, parentComp);
    expect(comp._inited).toBe(false);
    expect(!comp.baseComp).toBe(true);
    expect(comp.baseComponent === baseComp).toBe(true);
    expect(comp.parent === parentComp).toBe(true);
  });
})


class TestComponent extends Component {
  testMethod() {
    return "testMethodResult";
  }
}

class TestComponent2 extends Component {
  testMethod() {
    return "testMethodResult2";
  }
}

class TestComponentRequire extends Component {
  static requiredComponents = [
    TestComponent
  ]
}

class TestComponentRequireLvl2 extends Component {
  static requiredComponents = [
    TestComponent,
    TestComponent2
  ]

  testMethod() {
    return "fromTestComponentRequireLvl2";
  }
}

class TestComponentRequireMultiple extends Component {
  static requiredComponents = [
    TestComponent,
    TestComponentRequireLvl2
  ]

  testMethod() {
    return "fromTestComponentRequireMultiple";
  }
}


describe('Sub Component', () => {
  let comp;

  beforeEach(async () => {
    comp = await Component.create();
  });

  it('is base component', async () => {
    await comp.init();
    expect(comp.isBaseComponent()).toBe(true);
  });

  it('Add component', async () => {
    expect(comp.getAllComponents().length).toBe(0);
    await comp.addComponent(TestComponent);
    expect(comp.getAllComponents().length).toBe(1);
    expect(comp.getComponent(TestComponent).testMethod()).toBe("testMethodResult");
  });

  it('Remove component', async () => {
    expect(comp.getAllComponents().length).toBe(0);
    await comp.addComponent(TestComponent);
    expect(comp.getAllComponents().length).toBe(1);
    expect(comp.getComponent(TestComponent) instanceof TestComponent).toBe(true);
    await comp.removeComponent(TestComponent);
    expect(() => comp.getComponent(TestComponent)).toThrow();
  });

  it('Has component', async () => {
    expect(comp.getAllComponents().length).toBe(0);
    await comp.addComponent(TestComponent);
    expect(comp.getAllComponents().length).toBe(1);
    expect(comp.hasComponent(TestComponent)).toBe(true);
    expect(comp.hasComponent(Component)).toBe(false);
  });


})

describe('Child components', () => {
  let comp;
  beforeEach(async () => {
    comp = await Component.createAndInit();
  });

  it('Add child', async () => {
    expect(comp.getChildren().length).toBe(0);
    await comp.addChild(Component);
    expect(comp.getChildren().length).toBe(1);
  });

  it('Add child with props', async () => {
    expect(comp.getChildren().length).toBe(0);
    let child = await comp.addChild(Component, { customField: true });
    expect(comp.getChildren().length).toBe(1);
    expect(child.customField).toBe(true);
  });

  it('Add child from sub component', async () => {
    let sub = await comp.addComponent(Component);
    expect(comp.getChildren().length).toBe(0);
    await sub.addChild(Component);
    expect(comp.getChildren().length).toBe(1);
  });

  it('Add child from sub component with props', async () => {
    let sub = await comp.addComponent(Component);
    expect(comp.getChildren().length).toBe(0);
    let child = await sub.addChild(Component, { customField: true });
    expect(child).toExist();
    expect(comp.getChildren().length).toBe(1);
    expect(child.customField).toBe(true);
  });

  it('Remove child', async () => {
    expect(comp.getChildren().length).toBe(0);
    await comp.addChild(Component);
    expect(comp.getChildren().length).toBe(1);
    let removedResult = await comp.removeChild(comp.getChildren()[0]);
    expect(removedResult).toBe(true);
    expect(comp.getChildren().length).toBe(0);
  });

  it('Remove child from sub component', async () => {
    let sub = await comp.addComponent(Component);
    expect(comp.getChildren().length).toBe(0);
    await comp.addChild(Component);
    expect(comp.getChildren().length).toBe(1);
    let removedResult = await sub.removeChild(sub.getChildren()[0]);
    expect(removedResult).toBe(true);
    expect(comp.getChildren().length).toBe(0);
  });

  it('find child', async () => {
    expect(comp.getChildren().length).toBe(0);
    await comp.addChild(Component);
    expect(comp.getChildren().length).toBe(1);
    let predicates = {
      find: (child) => child !== null
    }
    spyOn(predicates, 'find').andCallThrough();
    let children = comp.findChildren(predicates.find);
    expect(predicates.find).toHaveBeenCalled();
    expect(children.length).toBe(1);
  });

  it('find child from subcomponent', async () => {
    let sub = await comp.addComponent(Component);
    expect(comp.getChildren().length).toBe(0);
    await comp.addChild(Component);
    expect(comp.getChildren().length).toBe(1);
    let predicates = {
      find: (child) => child !== null
    }
    spyOn(predicates, 'find').andCallThrough();
    let children = sub.findChildren(predicates.find);
    expect(predicates.find).toHaveBeenCalled();
    expect(children.length).toBe(1);
  });

  it('getAllComponents results in component and subcomponent', async () => {
    let sub = await comp.addComponent(Component);
    expect(comp.getAllComponents().length).toBe(1);
    expect(comp.getAllComponents()).toEqual(sub.getAllComponents());
  });

});

describe('Required Components setup', () => {
  let comp;

  beforeEach(async () => {
    comp = await TestComponentRequire.create();
  })

  it('Static requiredComponents set', () => {
    expect(comp.constructor.requiredComponents.length).toBe(1);
  });

  it('init', async () => {
    await comp.init();
    expect(comp.getComponent(TestComponent) instanceof TestComponent).toBe(true);
  });

  it('getComponent', async () => {
    await comp.init();
    expect(comp.getComponent(TestComponent).testMethod()).toBe("testMethodResult");
  })
});

describe('Components in child components', () => {

  let base;
  let child;
  let childSub;

  beforeEach(async () => {
    base = await Component.create();
    child = await base.addChild(Component);
    await base.init();
  });

  it('is base component', async () => {
    childSub = await child.addComponent(Component);
    expect(base.isBaseComponent()).toBe(true);
    expect(child.isBaseComponent()).toBe(true);
    expect(childSub.isBaseComponent()).toBe(false);
    expect(childSub.baseComponent === child).toBe(true);
  });

  it('Add component', async () => {
    expect(base.getAllComponents().length).toBe(0);
    expect(child.getAllComponents().length).toBe(0);
    childSub = await child.addComponent(Component);
    expect(base.getAllComponents().length).toBe(0);
    expect(child.getAllComponents().length).toBe(1);
  });

  it('Remove component', async () => {
    expect(base.getAllComponents().length).toBe(0);
    expect(child.getAllComponents().length).toBe(0);
    childSub = await child.addComponent(Component);
    expect(base.getAllComponents().length).toBe(0);
    expect(child.getAllComponents().length).toBe(1);
    expect(child.getComponent(Component) instanceof Component).toBe(true);
    await child.removeComponent(Component);
    expect(() => child.getComponent(Component)).toThrow();
    expect(child.getAllComponents().length).toBe(0);
  });

});

describe("Multiple Require Component Setup", () => {
  let comp;

  beforeEach(async () => {
    comp = await TestComponentRequireMultiple.create();
  });

  it('Static requiredComponents set', () => {
    expect(comp.constructor.requiredComponents.length).toBe(2);
  });

  it('getComponent', async () => {
    
    await comp.init();

    expect(comp.getAllComponents().length === 3).toBe(true);
    
    expect(comp.getComponent(TestComponent) instanceof TestComponent).toBe(true);
    expect(comp.getComponent(TestComponent2) instanceof TestComponent2).toBe(true);
    expect(comp.getComponent(TestComponentRequireLvl2) instanceof TestComponentRequireLvl2).toBe(true);

    expect(comp.getComponent(TestComponent).testMethod()).toBe("testMethodResult");
    expect(comp.getComponent(TestComponent2).testMethod()).toBe("testMethodResult2");
    expect(comp.getComponent(TestComponentRequireLvl2).testMethod()).toBe("fromTestComponentRequireLvl2");
  })

});

class SubComp extends Component {}
class ChildComp extends Component {}

describe('Component Messaging', () => {
  let comp;
  let subComp;
  let childComp;

  beforeEach(async () => {
    comp = await Component.create();
    await comp.addComponent(SubComp);
    await comp.addChild(ChildComp);

    await comp.init();

    comp.onCustomMethod = () => {}
    SubComp.of(comp).onCustomMethod = () => {}
    comp.getChildren()[0].onCustomMethod = () => {}
    
  });

  it('Send message', async () => {
    spyOn(comp, 'onCustomMethod');
    spyOn(SubComp.of(comp), 'onCustomMethod');
    spyOn(comp.getChildren()[0], 'onCustomMethod');
    
    await comp.send("onCustomMethod", "arg1", "arg2");

    expect(comp.onCustomMethod).toHaveBeenCalledWith("arg1", "arg2");
    expect(SubComp.of(comp).onCustomMethod).toHaveBeenCalledWith("arg1", "arg2");
    expect(comp.getChildren()[0].onCustomMethod).toNotHaveBeenCalled();
  });

  it('Broadcast message', async () => {
    spyOn(comp, 'onCustomMethod');
    spyOn(SubComp.of(comp), 'onCustomMethod');
    spyOn(comp.getChildren()[0], 'onCustomMethod');
    
    await comp.broadcast("onCustomMethod", "arg1", "arg2");

    expect(comp.onCustomMethod).toHaveBeenCalledWith("arg1", "arg2");
    expect(SubComp.of(comp).onCustomMethod).toHaveBeenCalledWith("arg1", "arg2");
    expect(comp.getChildren()[0].onCustomMethod).toHaveBeenCalledWith("arg1", "arg2");
  });
});