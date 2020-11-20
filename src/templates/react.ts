export default function (classProperties: string[]): string {
  return `
import React, {
  ReactNode,
  ReactElement,
  HTMLAttributes,
  AllHTMLAttributes,
  Props
} from "react";

type hFn<T> = (
  children: Array<ReactNode | AllHTMLAttributes<T>>
) => ReactElement;

export const e = React.createElement;

export default class BaseStyles {
  public chain: string[];
  public overrideDisplayNone: boolean;
  public overrideDisplayInherit: boolean;
  public conditions: boolean[] = [];
  public classProps: any = {};
  private readConditionIndex: number = 0;
  private classObjectMode: boolean = false;

  constructor(selector: string) {
    this.chain = new Array<string>();
    if (selector.length > 0) {
      this.chain.push(selector);
    }
    return this;
  }

  // The first element in the arguments might be a attributes object, or they might all be Nodes
  public h = <T>(
    ...children: Array<ReactElement | string | AllHTMLAttributes<T> | Props<T> | Boolean>
  ): ReactElement => {
    const style = {
      display: this.overrideDisplayNone
        ? "none"
        : this.overrideDisplayInherit
        ? "inherit"
        : undefined
    };

    if (
      children[0] &&
      typeof children[0] === "object" &&
      !Array.isArray(children[0]) &&
      !(children[0] as ReactElement).type
    ) {
      return e(
        this.elementTag,
        {
          className: this.toString(),
          style,
          ...(children[0] as HTMLAttributes<T>)
        },
        ...(children.slice(1).filter(Boolean) as Array<ReactElement>)
      );
    }
    return e(
      this.elementTag,
      {
        className: this.toString(),
        style
      },
      ...(children.filter(Boolean) as Array<ReactElement>)
    );
  };

  public toObj = () => {
    if (!this.classObjectMode) {
      // tslint:disable-next-line:max-line-length
      throw Error(
        "You need to call at least one conditional method in order to use this as a classes object generator"
      );
    }
    return this.classProps;
  };

  get elementTag(): string {
    return this.chain[0] || "div";
  }

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
    return this.chain.slice(1).join(" ");
  };

  public $ = (className: string): BaseStyles => {
    return this.add(className);
  };

  public add = (className: string | false): BaseStyles => {
    if (!className) return this;
    if (this.classObjectMode) {
      this.classProps[className] = this.conditions[this.readConditionIndex];
    } else if (className.length > 0) {
      this.chain.push(className);
    }
    return this;
  };
  public show = (condition: any): BaseStyles => {
    this.overrideDisplayNone = !condition;
    return this;
  };
  public hide = (condition: any): BaseStyles => {
    this.overrideDisplayNone = condition;
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
