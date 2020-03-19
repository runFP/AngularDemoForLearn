export class NameMapComponent {
  private components = new Map<string, Component>();

  constructor(components: Component[]) {
    for (let i = 0; i < components.length; i++) {
      const component = components[i];
      this.components.set(component.name, component);
    }
  }

  getComponent(name: string): Component | undefined {
    return this.components.get(name);
  }

  setComponent(component: Component) {
    const name = component.name;
    this.components.set(name, component);
  }

  getAllComponent(): { [key: string]: Component }[] {
    const components: { [key: string]: Component }[] = [];
    for (const [key, value] of this.components) {
      components.push({[key]: value});
    }
    return components;
  }
}

export class RegisterNMC {
  private static nmc = new Map<string, NameMapComponent>();

  static setNmc(name: string, value: NameMapComponent) {
    this.nmc.set(name, value);
  }

  static getNmc(name: string): NameMapComponent | undefined {
    return this.nmc.get(name);
  }

}

type Component = new (...args: any[]) => any;
