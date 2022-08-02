var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
__markAsModule(exports);
__export(exports, {
  default: () => react_default
});
function react_default(classProperties) {
  return `
import React, {
  AllHTMLAttributes,
  MouseEventHandler,
  Props,
  PropsWithChildren,
  ReactElement,
  ReactNode,
} from "react";

type hFn<T> = (
  children: Array<ReactNode | AllHTMLAttributes<T>>
) => ReactElement;

export type BaseStyleArgs<T> = Array<
  ReactNode | string | AllHTMLAttributes<T> | Props<T> | boolean
>
export const e = React.createElement;

export default class BaseStyles {
  public chain: string[];
  public overrideDisplayNone: boolean = false;
  public overrideDisplayInherit: boolean = false;
  public conditions: boolean[] = [];
  public classProps: any = {};
  private writeConditionIndex = 0
  private readConditionIndex: number = 0;
  private classObjectMode: boolean = false;

   constructor(selector: string) {
    this.chain = new Array<string>()
    if (typeof selector === 'string') {
      const parts = selector.split('.')
      this.chain.push(...parts)
    }
    return this
  }
  public when = (condition: boolean): BaseStyles => {
    this.classObjectMode = true
    this.conditions[this.writeConditionIndex] = condition
    return this
  }

  public andWhen = (condition: boolean): BaseStyles => {
    this.classObjectMode = true
    this.writeConditionIndex++
    this.readConditionIndex++
    return this.when(condition)
  }

  public otherwise = (): BaseStyles => {
    this.classObjectMode = true
    return this.andWhen(!this.conditions[this.readConditionIndex])
  }

  // The first element in the arguments might be a attributes object, or they might all be Nodes
  public h = <T>(
    ...children: BaseStyleArgs<T>
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
          ...(children[0] as AllHTMLAttributes<T>)
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

  public fc: React.FC<PropsWithChildren<AllHTMLAttributes<unknown>>> = ({
    children,
    ...rest
  }) => this.h(rest, children)

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

  public toSelector = (): string => {
    if (this.chain.length === 1) {
      return this.chain[0] || 'div'
    }
    return this.chain.join('.')
  }

  public toString = (): string => {
    if (this.classObjectMode && this.classProps) {
      for (const [key, value] of Object.entries(this.classProps)) {
        if (value) {
          this.chain.push(key)
        }
      }
    }
    if (this.chain.length === 1) {
      return this.chain[0] || "div";
    }
    return this.chain.slice(1).join(" ");
  };

  public $ = (className: string): BaseStyles => {
    return this.add(className);
  };

  public addSelectors = (selector: string) => {
    if (typeof selector === 'string') {
      const parts = selector.split('.')
      this.chain.push(...parts)
    }
    return this
  }


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


  public injectProps<T>(props: AllHTMLAttributes<T>) {
    const oldFn = this.h
    const newFn = (...children: BaseStyleArgs<T>) => {
      const firstChild = children[0]
      const firstChildIsProps = Boolean(
        firstChild &&
          typeof firstChild === 'object' &&
          !Array.isArray(children[0]) &&
          !(children[0] as ReactElement).type
      )
      // const hyperScriptFnArgs: BaseStyleArgs<T> = [props, ...children]
      const hyperScriptFnArgs: BaseStyleArgs<T> = firstChildIsProps
        ? [
            {
              ...(props as AllHTMLAttributes<T>),
              ...(firstChild as AllHTMLAttributes<T>),
            },
            ...children.slice(1),
          ]
        : [{ ...props }, ...children]
      return oldFn(...hyperScriptFnArgs)
    }
    this.h = newFn as typeof oldFn
    return this
  }

  public beforeClick<T>(handler: <T>(e: React.MouseEvent<T>) => void) {
    const oldFn = this.h
    this.h = <T>(...children: BaseStyleArgs<T>) => {
      const firstChild = children[0]
      const firstChildIsProps = Boolean(
        firstChild &&
          typeof firstChild === 'object' &&
          !Array.isArray(children[0]) &&
          !(children[0] as ReactElement).type
      )

      let newClick: MouseEventHandler<T> | (() => void) | undefined
      if (
        firstChildIsProps &&
        (firstChild as React.AllHTMLAttributes<T>).onClick
      ) {
        newClick = (firstChild as React.AllHTMLAttributes<T>).onClick
      }
      const clickProps: Partial<
        AllHTMLAttributes<T> | React.ClassAttributes<T>
      > = {
        onClick: (evt) => {
          handler(evt)
          if (newClick) {
            newClick(evt)
          }
        },
      }
      const hyperScriptFnArgs = firstChildIsProps
        ? [
            {
              firstChild,
              ...clickProps,
            },
            ...children.slice(1),
          ]
        : [{ ...clickProps }, ...children]
      return oldFn(...hyperScriptFnArgs)
    }
    return this
  }
}

export const $$ = (selector?: string): BaseStyles => {
  return new BaseStyles('' + selector || '')
}
export function $onClick<T>(fn: React.MouseEventHandler<T>) {
  return (child: BaseStyles, ...children: BaseStyleArgs<T>) => {
    const firstChild = children[0]
    const firstChildIsProps = Boolean(
      firstChild &&
        typeof firstChild === 'object' &&
        !Array.isArray(children[0]) &&
        !(children[0] as ReactElement).type
    )
    return firstChildIsProps
      ? child.h(
          { ...(firstChild as React.AllHTMLAttributes<T>), onClick: fn },
          ...children.slice(1)
        )
      : child.h({ onClick: fn }, ...children)
  }
}

export function $formOnSubmit<T>(fn: (e?: React.FormEvent<any>) => void) {
  return $$('form').injectProps({
    onSubmit: (e) => {
      e.preventDefault()
      fn(e)
    },
  })
}
export const $ = $$()

`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
