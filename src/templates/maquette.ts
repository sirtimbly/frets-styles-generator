export default function(classProperties: string[]): string {
  return `
  import { maquette as Maquette } from "frets";

  export default class BaseStyles {
    public chain: string[];
    public conditions: boolean[] = [];
    public classProps: any = {};
    private writeConditionIndex: number = 0;
    private readConditionIndex: number = 0;
    private classObjectMode: boolean = false;

    constructor(selector: string) {
      this.chain = new Array<string>();
      if (selector.length > 0) {
        this.chain.push(selector);
      }
      return this;
    }

    public when = (condition: boolean): BaseStyles => {
      this.classObjectMode = true;
      this.conditions[this.writeConditionIndex] = condition;
      return this;
    };

    public andWhen = (condition: boolean): BaseStyles => {
      this.classObjectMode = true;
      this.writeConditionIndex++;
      this.readConditionIndex++;
      return this.when(condition);
    };

    public otherwise = (): BaseStyles => {
      this.classObjectMode = true;
      return this.andWhen(!this.conditions[this.readConditionIndex]);
    };

    public h = (
      ...children: Array<(Maquette.VNodeProperties | string | Maquette.VNode | Maquette.VNodeChild)>
    ): Maquette.VNode => {
      if (this.classObjectMode) {
        throw Error(
          "You can't build a vnode when you are using this for building a classes object"
        );
      }
      if (children[0]
          && typeof children[0] === "object"
          && !Array.isArray(children[0])
          && !(children[0] as VNode).vnodeSelector) {
              return Maquette.h(this.toString()
              , children[0] as Maquette.VNodeProperties
              , children.slice(1) as Array<(string | Maquette.VNode | Maquette.VNodeChild)>);
          }
      return Maquette.h(this.toString(), {}, children as Array<(string | Maquette.VNode | Maquette.VNodeChild)>);
    }

    public toObj = () => {
      if (!this.classObjectMode) {
        // tslint:disable-next-line:max-line-length
        throw Error(
          "You need to call at least one conditional method in order to use this as a classes object generator"
        );
      }
      return this.classProps;
    };

    get div(): BaseStyles {
      return new BaseStyles("div");
    }
    get img(): BaseStyles {
      return new BaseStyles("img");
    }
    get a(): BaseStyles {
      return new BaseStyles("a");
    }
    get p(): BaseStyles {
      return new BaseStyles("p");
    }
    get ul(): BaseStyles {
      return new BaseStyles("ul");
    }
    get ol(): BaseStyles {
      return new BaseStyles("ol");
    }
    get li(): BaseStyles {
      return new BaseStyles("li");
    }
    get section(): BaseStyles {
      return new BaseStyles("section");
    }
    get header(): BaseStyles {
      return new BaseStyles("header");
    }
    get article(): BaseStyles {
      return new BaseStyles("article");
    }
    get nav(): BaseStyles {
      return new BaseStyles("nav");
    }
    get aside(): BaseStyles {
      return new BaseStyles("aside");
    }
    get span(): BaseStyles {
      return new BaseStyles("span");
    }
    get button(): BaseStyles {
      return new BaseStyles("button");
    }
    get input(): BaseStyles {
      return new BaseStyles("input");
    }
    get label(): BaseStyles {
      return new BaseStyles("label");
    }
    get select(): BaseStyles {
      return new BaseStyles("select");
    }
    get textarea(): BaseStyles {
      return new BaseStyles("textarea");
    }

    public toString = (): string => {
      if (this.classObjectMode) {
        throw Error(
          "You can't build a selector string when you are calling conditional methods"
        );
      }
      if (this.chain.length === 1) {
        return this.chain[0] || "div";
      }
      return this.chain.join(".");
    };

    public $ = (className: string): BaseStyles => {
      return this.add(className);
    };

    public add = (className: string): BaseStyles => {
      if (this.classObjectMode) {
        this.classProps[className] = this.conditions[this.readConditionIndex];
      } else if (className.length > 0) {
        this.chain.push(className);
      }
      return this;
    };
    ${classProperties.join("\n")}

}

export const $$ = (selector?: string): BaseStyles =>  {
    return new BaseStyles("" + selector || "");
};

export const $ = $$();

`;
}
