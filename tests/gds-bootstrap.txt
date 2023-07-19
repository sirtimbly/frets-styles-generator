
import React, {
  AllHTMLAttributes,
  MouseEventHandler,
  PropsWithRef,
  PropsWithChildren,
  ReactElement,
  ReactNode,
} from "react";

export type hFn<T> = (
  children: Array<ReactNode | AllHTMLAttributes<T>>
) => ReactElement;

export type BaseStyleArgs<T> = Array<
  ReactNode | string | AllHTMLAttributes<T> | PropsWithRef<T> | boolean
>
export const e = React.createElement;

export default class BaseStyles {
  public chain: string[];
  public overrideDisplayNone = false;
  public overrideDisplayInherit = false;
  public conditions: boolean[] = [];
  public classProps: any = {};
  private writeConditionIndex = 0
  private readConditionIndex = 0;
  private classObjectMode = false;

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

  public toString = (clear = false): string => {
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
    const output = this.chain.slice(1).join(" ");
    this.chain = clear ? [this.chain[0]] : this.chain;
    return output;
  };

  public clear = (): BaseStyles => {
    this.chain = [];
    return this;
  }

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
  get lead() { return this.add("lead"); }
get display_1() { return this.add("display-1"); }
get display_2() { return this.add("display-2"); }
get display_3() { return this.add("display-3"); }
get display_4() { return this.add("display-4"); }
get listUnstyled() { return this.add("list-unstyled"); }
get listInline() { return this.add("list-inline"); }
get listInlineItem() { return this.add("list-inline-item"); }
get initialism() { return this.add("initialism"); }
get blockquote() { return this.add("blockquote"); }
get blockquoteFooter() { return this.add("blockquote-footer"); }
get imgFluid() { return this.add("img-fluid"); }
get imgThumbnail() { return this.add("img-thumbnail"); }
get figure() { return this.add("figure"); }
get figureImg() { return this.add("figure-img"); }
get figureCaption() { return this.add("figure-caption"); }
get preScrollable() { return this.add("pre-scrollable"); }
get container() { return this.add("container"); }
get containerFluid() { return this.add("container-fluid"); }
get containerXl() { return this.add("container-xl"); }
get containerLg() { return this.add("container-lg"); }
get containerMd() { return this.add("container-md"); }
get containerSm() { return this.add("container-sm"); }
get row() { return this.add("row"); }
get noGutters() { return this.add("no-gutters"); }
get colXl() { return this.add("col-xl"); }
get colXlAuto() { return this.add("col-xl-auto"); }
get colXl_12() { return this.add("col-xl-12"); }
get colXl_11() { return this.add("col-xl-11"); }
get colXl_10() { return this.add("col-xl-10"); }
get colXl_9() { return this.add("col-xl-9"); }
get colXl_8() { return this.add("col-xl-8"); }
get colXl_7() { return this.add("col-xl-7"); }
get colXl_6() { return this.add("col-xl-6"); }
get colXl_5() { return this.add("col-xl-5"); }
get colXl_4() { return this.add("col-xl-4"); }
get colXl_3() { return this.add("col-xl-3"); }
get colXl_2() { return this.add("col-xl-2"); }
get colXl_1() { return this.add("col-xl-1"); }
get colLg() { return this.add("col-lg"); }
get colLgAuto() { return this.add("col-lg-auto"); }
get colLg_12() { return this.add("col-lg-12"); }
get colLg_11() { return this.add("col-lg-11"); }
get colLg_10() { return this.add("col-lg-10"); }
get colLg_9() { return this.add("col-lg-9"); }
get colLg_8() { return this.add("col-lg-8"); }
get colLg_7() { return this.add("col-lg-7"); }
get colLg_6() { return this.add("col-lg-6"); }
get colLg_5() { return this.add("col-lg-5"); }
get colLg_4() { return this.add("col-lg-4"); }
get colLg_3() { return this.add("col-lg-3"); }
get colLg_2() { return this.add("col-lg-2"); }
get colLg_1() { return this.add("col-lg-1"); }
get colMd() { return this.add("col-md"); }
get colMdAuto() { return this.add("col-md-auto"); }
get colMd_12() { return this.add("col-md-12"); }
get colMd_11() { return this.add("col-md-11"); }
get colMd_10() { return this.add("col-md-10"); }
get colMd_9() { return this.add("col-md-9"); }
get colMd_8() { return this.add("col-md-8"); }
get colMd_7() { return this.add("col-md-7"); }
get colMd_6() { return this.add("col-md-6"); }
get colMd_5() { return this.add("col-md-5"); }
get colMd_4() { return this.add("col-md-4"); }
get colMd_3() { return this.add("col-md-3"); }
get colMd_2() { return this.add("col-md-2"); }
get colMd_1() { return this.add("col-md-1"); }
get colSm() { return this.add("col-sm"); }
get colSmAuto() { return this.add("col-sm-auto"); }
get colSm_12() { return this.add("col-sm-12"); }
get colSm_11() { return this.add("col-sm-11"); }
get colSm_10() { return this.add("col-sm-10"); }
get colSm_9() { return this.add("col-sm-9"); }
get colSm_8() { return this.add("col-sm-8"); }
get colSm_7() { return this.add("col-sm-7"); }
get colSm_6() { return this.add("col-sm-6"); }
get colSm_5() { return this.add("col-sm-5"); }
get colSm_4() { return this.add("col-sm-4"); }
get colSm_3() { return this.add("col-sm-3"); }
get colSm_2() { return this.add("col-sm-2"); }
get colSm_1() { return this.add("col-sm-1"); }
get col() { return this.add("col"); }
get colAuto() { return this.add("col-auto"); }
get col_12() { return this.add("col-12"); }
get col_11() { return this.add("col-11"); }
get col_10() { return this.add("col-10"); }
get col_9() { return this.add("col-9"); }
get col_8() { return this.add("col-8"); }
get col_7() { return this.add("col-7"); }
get col_6() { return this.add("col-6"); }
get col_5() { return this.add("col-5"); }
get col_4() { return this.add("col-4"); }
get col_3() { return this.add("col-3"); }
get col_2() { return this.add("col-2"); }
get col_1() { return this.add("col-1"); }
get orderFirst() { return this.add("order-first"); }
get orderLast() { return this.add("order-last"); }
get order_0() { return this.add("order-0"); }
get order_1() { return this.add("order-1"); }
get order_2() { return this.add("order-2"); }
get order_3() { return this.add("order-3"); }
get order_4() { return this.add("order-4"); }
get order_5() { return this.add("order-5"); }
get order_6() { return this.add("order-6"); }
get order_7() { return this.add("order-7"); }
get order_8() { return this.add("order-8"); }
get order_9() { return this.add("order-9"); }
get order_10() { return this.add("order-10"); }
get order_11() { return this.add("order-11"); }
get order_12() { return this.add("order-12"); }
get offset_1() { return this.add("offset-1"); }
get offset_2() { return this.add("offset-2"); }
get offset_3() { return this.add("offset-3"); }
get offset_4() { return this.add("offset-4"); }
get offset_5() { return this.add("offset-5"); }
get offset_6() { return this.add("offset-6"); }
get offset_7() { return this.add("offset-7"); }
get offset_8() { return this.add("offset-8"); }
get offset_9() { return this.add("offset-9"); }
get offset_10() { return this.add("offset-10"); }
get offset_11() { return this.add("offset-11"); }
get orderSmFirst() { return this.add("order-sm-first"); }
get orderSmLast() { return this.add("order-sm-last"); }
get orderSm_0() { return this.add("order-sm-0"); }
get orderSm_1() { return this.add("order-sm-1"); }
get orderSm_2() { return this.add("order-sm-2"); }
get orderSm_3() { return this.add("order-sm-3"); }
get orderSm_4() { return this.add("order-sm-4"); }
get orderSm_5() { return this.add("order-sm-5"); }
get orderSm_6() { return this.add("order-sm-6"); }
get orderSm_7() { return this.add("order-sm-7"); }
get orderSm_8() { return this.add("order-sm-8"); }
get orderSm_9() { return this.add("order-sm-9"); }
get orderSm_10() { return this.add("order-sm-10"); }
get orderSm_11() { return this.add("order-sm-11"); }
get orderSm_12() { return this.add("order-sm-12"); }
get offsetSm_0() { return this.add("offset-sm-0"); }
get offsetSm_1() { return this.add("offset-sm-1"); }
get offsetSm_2() { return this.add("offset-sm-2"); }
get offsetSm_3() { return this.add("offset-sm-3"); }
get offsetSm_4() { return this.add("offset-sm-4"); }
get offsetSm_5() { return this.add("offset-sm-5"); }
get offsetSm_6() { return this.add("offset-sm-6"); }
get offsetSm_7() { return this.add("offset-sm-7"); }
get offsetSm_8() { return this.add("offset-sm-8"); }
get offsetSm_9() { return this.add("offset-sm-9"); }
get offsetSm_10() { return this.add("offset-sm-10"); }
get offsetSm_11() { return this.add("offset-sm-11"); }
get orderMdFirst() { return this.add("order-md-first"); }
get orderMdLast() { return this.add("order-md-last"); }
get orderMd_0() { return this.add("order-md-0"); }
get orderMd_1() { return this.add("order-md-1"); }
get orderMd_2() { return this.add("order-md-2"); }
get orderMd_3() { return this.add("order-md-3"); }
get orderMd_4() { return this.add("order-md-4"); }
get orderMd_5() { return this.add("order-md-5"); }
get orderMd_6() { return this.add("order-md-6"); }
get orderMd_7() { return this.add("order-md-7"); }
get orderMd_8() { return this.add("order-md-8"); }
get orderMd_9() { return this.add("order-md-9"); }
get orderMd_10() { return this.add("order-md-10"); }
get orderMd_11() { return this.add("order-md-11"); }
get orderMd_12() { return this.add("order-md-12"); }
get offsetMd_0() { return this.add("offset-md-0"); }
get offsetMd_1() { return this.add("offset-md-1"); }
get offsetMd_2() { return this.add("offset-md-2"); }
get offsetMd_3() { return this.add("offset-md-3"); }
get offsetMd_4() { return this.add("offset-md-4"); }
get offsetMd_5() { return this.add("offset-md-5"); }
get offsetMd_6() { return this.add("offset-md-6"); }
get offsetMd_7() { return this.add("offset-md-7"); }
get offsetMd_8() { return this.add("offset-md-8"); }
get offsetMd_9() { return this.add("offset-md-9"); }
get offsetMd_10() { return this.add("offset-md-10"); }
get offsetMd_11() { return this.add("offset-md-11"); }
get orderLgFirst() { return this.add("order-lg-first"); }
get orderLgLast() { return this.add("order-lg-last"); }
get orderLg_0() { return this.add("order-lg-0"); }
get orderLg_1() { return this.add("order-lg-1"); }
get orderLg_2() { return this.add("order-lg-2"); }
get orderLg_3() { return this.add("order-lg-3"); }
get orderLg_4() { return this.add("order-lg-4"); }
get orderLg_5() { return this.add("order-lg-5"); }
get orderLg_6() { return this.add("order-lg-6"); }
get orderLg_7() { return this.add("order-lg-7"); }
get orderLg_8() { return this.add("order-lg-8"); }
get orderLg_9() { return this.add("order-lg-9"); }
get orderLg_10() { return this.add("order-lg-10"); }
get orderLg_11() { return this.add("order-lg-11"); }
get orderLg_12() { return this.add("order-lg-12"); }
get offsetLg_0() { return this.add("offset-lg-0"); }
get offsetLg_1() { return this.add("offset-lg-1"); }
get offsetLg_2() { return this.add("offset-lg-2"); }
get offsetLg_3() { return this.add("offset-lg-3"); }
get offsetLg_4() { return this.add("offset-lg-4"); }
get offsetLg_5() { return this.add("offset-lg-5"); }
get offsetLg_6() { return this.add("offset-lg-6"); }
get offsetLg_7() { return this.add("offset-lg-7"); }
get offsetLg_8() { return this.add("offset-lg-8"); }
get offsetLg_9() { return this.add("offset-lg-9"); }
get offsetLg_10() { return this.add("offset-lg-10"); }
get offsetLg_11() { return this.add("offset-lg-11"); }
get orderXlFirst() { return this.add("order-xl-first"); }
get orderXlLast() { return this.add("order-xl-last"); }
get orderXl_0() { return this.add("order-xl-0"); }
get orderXl_1() { return this.add("order-xl-1"); }
get orderXl_2() { return this.add("order-xl-2"); }
get orderXl_3() { return this.add("order-xl-3"); }
get orderXl_4() { return this.add("order-xl-4"); }
get orderXl_5() { return this.add("order-xl-5"); }
get orderXl_6() { return this.add("order-xl-6"); }
get orderXl_7() { return this.add("order-xl-7"); }
get orderXl_8() { return this.add("order-xl-8"); }
get orderXl_9() { return this.add("order-xl-9"); }
get orderXl_10() { return this.add("order-xl-10"); }
get orderXl_11() { return this.add("order-xl-11"); }
get orderXl_12() { return this.add("order-xl-12"); }
get offsetXl_0() { return this.add("offset-xl-0"); }
get offsetXl_1() { return this.add("offset-xl-1"); }
get offsetXl_2() { return this.add("offset-xl-2"); }
get offsetXl_3() { return this.add("offset-xl-3"); }
get offsetXl_4() { return this.add("offset-xl-4"); }
get offsetXl_5() { return this.add("offset-xl-5"); }
get offsetXl_6() { return this.add("offset-xl-6"); }
get offsetXl_7() { return this.add("offset-xl-7"); }
get offsetXl_8() { return this.add("offset-xl-8"); }
get offsetXl_9() { return this.add("offset-xl-9"); }
get offsetXl_10() { return this.add("offset-xl-10"); }
get offsetXl_11() { return this.add("offset-xl-11"); }
get table() { return this.add("table"); }
get tableBordered() { return this.add("table-bordered"); }
get tablePrimary() { return this.add("table-primary"); }
get tableSecondary() { return this.add("table-secondary"); }
get tableSuccess() { return this.add("table-success"); }
get tableInfo() { return this.add("table-info"); }
get tableWarning() { return this.add("table-warning"); }
get tableDanger() { return this.add("table-danger"); }
get tableLight() { return this.add("table-light"); }
get tableDark() { return this.add("table-dark"); }
get tableActive() { return this.add("table-active"); }
get tableDarkTableBordered() { return this.add("table-dark table-bordered"); }
get tableResponsiveSm() { return this.add("table-responsive-sm"); }
get tableResponsiveMd() { return this.add("table-responsive-md"); }
get tableResponsiveLg() { return this.add("table-responsive-lg"); }
get tableResponsiveXl() { return this.add("table-responsive-xl"); }
get tableResponsive() { return this.add("table-responsive"); }
get formControl() { return this.add("form-control"); }
get formControlFile() { return this.add("form-control-file"); }
get formControlRange() { return this.add("form-control-range"); }
get colFormLabel() { return this.add("col-form-label"); }
get colFormLabelLg() { return this.add("col-form-label-lg"); }
get colFormLabelSm() { return this.add("col-form-label-sm"); }
get formControlPlaintext() { return this.add("form-control-plaintext"); }
get formControlPlaintextFormControlSm() { return this.add("form-control-plaintext form-control-sm"); }
get formControlPlaintextFormControlLg() { return this.add("form-control-plaintext form-control-lg"); }
get formControlSm() { return this.add("form-control-sm"); }
get formControlLg() { return this.add("form-control-lg"); }
get formGroup() { return this.add("form-group"); }
get formText() { return this.add("form-text"); }
get formRow() { return this.add("form-row"); }
get formCheck() { return this.add("form-check"); }
get formCheckInput() { return this.add("form-check-input"); }
get formCheckLabel() { return this.add("form-check-label"); }
get formCheckInline() { return this.add("form-check-inline"); }
get validFeedback() { return this.add("valid-feedback"); }
get validTooltip() { return this.add("valid-tooltip"); }
get invalidFeedback() { return this.add("invalid-feedback"); }
get invalidTooltip() { return this.add("invalid-tooltip"); }
get formInline() { return this.add("form-inline"); }
get btn() { return this.add("btn"); }
get btnPrimary() { return this.add("btn-primary"); }
get btnSecondary() { return this.add("btn-secondary"); }
get btnSuccess() { return this.add("btn-success"); }
get btnInfo() { return this.add("btn-info"); }
get btnWarning() { return this.add("btn-warning"); }
get btnDanger() { return this.add("btn-danger"); }
get btnLight() { return this.add("btn-light"); }
get btnDark() { return this.add("btn-dark"); }
get btnOutlinePrimary() { return this.add("btn-outline-primary"); }
get btnOutlineSecondary() { return this.add("btn-outline-secondary"); }
get btnOutlineSuccess() { return this.add("btn-outline-success"); }
get btnOutlineInfo() { return this.add("btn-outline-info"); }
get btnOutlineWarning() { return this.add("btn-outline-warning"); }
get btnOutlineDanger() { return this.add("btn-outline-danger"); }
get btnOutlineLight() { return this.add("btn-outline-light"); }
get btnOutlineDark() { return this.add("btn-outline-dark"); }
get btnLink() { return this.add("btn-link"); }
get btnLg() { return this.add("btn-lg"); }
get btnSm() { return this.add("btn-sm"); }
get btnBlock() { return this.add("btn-block"); }
get btnBlockBtnBlock() { return this.add("btn-block+ btn-block"); }
get fade() { return this.add("fade"); }
get collapsing() { return this.add("collapsing"); }
get collapsingWidth() { return this.add("collapsing width"); }
get dropup() { return this.add("dropup"); }
get dropright() { return this.add("dropright"); }
get dropdown() { return this.add("dropdown"); }
get dropleft() { return this.add("dropleft"); }
get dropdownToggle() { return this.add("dropdown-toggle"); }
get dropdownMenu() { return this.add("dropdown-menu"); }
get dropdownMenuLeft() { return this.add("dropdown-menu-left"); }
get dropdownMenuRight() { return this.add("dropdown-menu-right"); }
get dropdownMenuSmLeft() { return this.add("dropdown-menu-sm-left"); }
get dropdownMenuSmRight() { return this.add("dropdown-menu-sm-right"); }
get dropdownMenuMdLeft() { return this.add("dropdown-menu-md-left"); }
get dropdownMenuMdRight() { return this.add("dropdown-menu-md-right"); }
get dropdownMenuLgLeft() { return this.add("dropdown-menu-lg-left"); }
get dropdownMenuLgRight() { return this.add("dropdown-menu-lg-right"); }
get dropdownMenuXlLeft() { return this.add("dropdown-menu-xl-left"); }
get dropdownMenuXlRight() { return this.add("dropdown-menu-xl-right"); }
get dropdownMenuXPlacementTop() { return this.add("dropdown-menu[x-placement^=top]"); }
get dropdownMenuXPlacementRight() { return this.add("dropdown-menu[x-placement^=right]"); }
get dropdownMenuXPlacementBottom() { return this.add("dropdown-menu[x-placement^=bottom]"); }
get dropdownMenuXPlacementLeft() { return this.add("dropdown-menu[x-placement^=left]"); }
get dropdownDivider() { return this.add("dropdown-divider"); }
get dropdownItem() { return this.add("dropdown-item"); }
get dropdownMenuShow() { return this.add("dropdown-menu show"); }
get dropdownHeader() { return this.add("dropdown-header"); }
get dropdownItemText() { return this.add("dropdown-item-text"); }
get btnGroup() { return this.add("btn-group"); }
get btnGroupVertical() { return this.add("btn-group-vertical"); }
get btnToolbar() { return this.add("btn-toolbar"); }
get dropdownToggleSplit() { return this.add("dropdown-toggle-split"); }
get btnSmDropdownToggleSplit() { return this.add("btn-sm+ dropdown-toggle-split"); }
get btnLgDropdownToggleSplit() { return this.add("btn-lg+ dropdown-toggle-split"); }
get inputGroup() { return this.add("input-group"); }
get inputGroupPrepend() { return this.add("input-group-prepend"); }
get inputGroupAppend() { return this.add("input-group-append"); }
get inputGroupText() { return this.add("input-group-text"); }
get customControl() { return this.add("custom-control"); }
get customControlInline() { return this.add("custom-control-inline"); }
get customControlInput() { return this.add("custom-control-input"); }
get customControlLabel() { return this.add("custom-control-label"); }
get customSwitch() { return this.add("custom-switch"); }
get customSelect() { return this.add("custom-select"); }
get customSelectSm() { return this.add("custom-select-sm"); }
get customSelectLg() { return this.add("custom-select-lg"); }
get customFile() { return this.add("custom-file"); }
get customFileInput() { return this.add("custom-file-input"); }
get customFileLabel() { return this.add("custom-file-label"); }
get customRange() { return this.add("custom-range"); }
get _nav() { return this.add("nav"); }
get navLink() { return this.add("nav-link"); }
get navLinkDisabled() { return this.add("nav-link disabled"); }
get navTabs() { return this.add("nav-tabs"); }
get navbar() { return this.add("navbar"); }
get navbarBrand() { return this.add("navbar-brand"); }
get navbarNav() { return this.add("navbar-nav"); }
get navbarText() { return this.add("navbar-text"); }
get navbarCollapse() { return this.add("navbar-collapse"); }
get navbarToggler() { return this.add("navbar-toggler"); }
get navbarTogglerIcon() { return this.add("navbar-toggler-icon"); }
get navbarNavScroll() { return this.add("navbar-nav-scroll"); }
get navbarExpandSm() { return this.add("navbar-expand-sm"); }
get navbarExpandMd() { return this.add("navbar-expand-md"); }
get navbarExpandLg() { return this.add("navbar-expand-lg"); }
get navbarExpandXl() { return this.add("navbar-expand-xl"); }
get navbarExpand() { return this.add("navbar-expand"); }
get card() { return this.add("card"); }
get cardBody() { return this.add("card-body"); }
get cardTitle() { return this.add("card-title"); }
get cardSubtitle() { return this.add("card-subtitle"); }
get cardLinkCardLink() { return this.add("card-link+ card-link"); }
get cardHeader() { return this.add("card-header"); }
get cardFooter() { return this.add("card-footer"); }
get cardHeaderTabs() { return this.add("card-header-tabs"); }
get cardHeaderPills() { return this.add("card-header-pills"); }
get cardImgOverlay() { return this.add("card-img-overlay"); }
get cardImg() { return this.add("card-img"); }
get cardImgTop() { return this.add("card-img-top"); }
get cardImgBottom() { return this.add("card-img-bottom"); }
get cardDeck() { return this.add("card-deck"); }
get cardGroup() { return this.add("card-group"); }
get cardColumns() { return this.add("card-columns"); }
get accordion() { return this.add("accordion"); }
get breadcrumb() { return this.add("breadcrumb"); }
get breadcrumbItemBreadcrumbItem() { return this.add("breadcrumb-item+ breadcrumb-item"); }
get breadcrumbItemActive() { return this.add("breadcrumb-item active"); }
get pagination() { return this.add("pagination"); }
get pageLink() { return this.add("page-link"); }
get badge() { return this.add("badge"); }
get badgePill() { return this.add("badge-pill"); }
get badgePrimary() { return this.add("badge-primary"); }
get badgeSecondary() { return this.add("badge-secondary"); }
get badgeSuccess() { return this.add("badge-success"); }
get badgeInfo() { return this.add("badge-info"); }
get badgeWarning() { return this.add("badge-warning"); }
get badgeDanger() { return this.add("badge-danger"); }
get badgeLight() { return this.add("badge-light"); }
get badgeDark() { return this.add("badge-dark"); }
get jumbotron() { return this.add("jumbotron"); }
get jumbotronFluid() { return this.add("jumbotron-fluid"); }
get alert() { return this.add("alert"); }
get alertHeading() { return this.add("alert-heading"); }
get alertLink() { return this.add("alert-link"); }
get alertDismissible() { return this.add("alert-dismissible"); }
get alertPrimary() { return this.add("alert-primary"); }
get alertSecondary() { return this.add("alert-secondary"); }
get alertSuccess() { return this.add("alert-success"); }
get alertInfo() { return this.add("alert-info"); }
get alertWarning() { return this.add("alert-warning"); }
get alertDanger() { return this.add("alert-danger"); }
get alertLight() { return this.add("alert-light"); }
get alertDark() { return this.add("alert-dark"); }
get progress() { return this.add("progress"); }
get progressBar() { return this.add("progress-bar"); }
get progressBarStriped() { return this.add("progress-bar-striped"); }
get progressBarAnimated() { return this.add("progress-bar-animated"); }
get media() { return this.add("media"); }
get mediaBody() { return this.add("media-body"); }
get listGroup() { return this.add("list-group"); }
get listGroupItemAction() { return this.add("list-group-item-action"); }
get listGroupItem() { return this.add("list-group-item"); }
get listGroupItemActive() { return this.add("list-group-item active"); }
get listGroupItemListGroupItem() { return this.add("list-group-item+ list-group-item"); }
get listGroupItemListGroupItemActive() { return this.add("list-group-item+ list-group-item active"); }
get listGroupHorizontal() { return this.add("list-group-horizontal"); }
get listGroupHorizontalSm() { return this.add("list-group-horizontal-sm"); }
get listGroupHorizontalMd() { return this.add("list-group-horizontal-md"); }
get listGroupHorizontalLg() { return this.add("list-group-horizontal-lg"); }
get listGroupHorizontalXl() { return this.add("list-group-horizontal-xl"); }
get listGroupFlush() { return this.add("list-group-flush"); }
get listGroupItemPrimary() { return this.add("list-group-item-primary"); }
get listGroupItemPrimaryListGroupItemActionActive() { return this.add("list-group-item-primary list-group-item-action active"); }
get listGroupItemSecondary() { return this.add("list-group-item-secondary"); }
get listGroupItemSecondaryListGroupItemActionActive() { return this.add("list-group-item-secondary list-group-item-action active"); }
get listGroupItemSuccess() { return this.add("list-group-item-success"); }
get listGroupItemSuccessListGroupItemActionActive() { return this.add("list-group-item-success list-group-item-action active"); }
get listGroupItemInfo() { return this.add("list-group-item-info"); }
get listGroupItemInfoListGroupItemActionActive() { return this.add("list-group-item-info list-group-item-action active"); }
get listGroupItemWarning() { return this.add("list-group-item-warning"); }
get listGroupItemWarningListGroupItemActionActive() { return this.add("list-group-item-warning list-group-item-action active"); }
get listGroupItemDanger() { return this.add("list-group-item-danger"); }
get listGroupItemDangerListGroupItemActionActive() { return this.add("list-group-item-danger list-group-item-action active"); }
get listGroupItemLight() { return this.add("list-group-item-light"); }
get listGroupItemLightListGroupItemActionActive() { return this.add("list-group-item-light list-group-item-action active"); }
get listGroupItemDark() { return this.add("list-group-item-dark"); }
get listGroupItemDarkListGroupItemActionActive() { return this.add("list-group-item-dark list-group-item-action active"); }
get close() { return this.add("close"); }
get toast() { return this.add("toast"); }
get toastShowing() { return this.add("toast showing"); }
get toastShow() { return this.add("toast show"); }
get toastHide() { return this.add("toast hide"); }
get toastHeader() { return this.add("toast-header"); }
get toastBody() { return this.add("toast-body"); }
get modalOpen() { return this.add("modal-open"); }
get modal() { return this.add("modal"); }
get modalDialog() { return this.add("modal-dialog"); }
get modalDialogScrollable() { return this.add("modal-dialog-scrollable"); }
get modalDialogCentered() { return this.add("modal-dialog-centered"); }
get modalDialogCenteredModalDialogScrollable() { return this.add("modal-dialog-centered modal-dialog-scrollable"); }
get modalContent() { return this.add("modal-content"); }
get modalBackdrop() { return this.add("modal-backdrop"); }
get modalBackdropFade() { return this.add("modal-backdrop fade"); }
get modalBackdropShow() { return this.add("modal-backdrop show"); }
get modalHeader() { return this.add("modal-header"); }
get modalTitle() { return this.add("modal-title"); }
get modalBody() { return this.add("modal-body"); }
get modalFooter() { return this.add("modal-footer"); }
get modalScrollbarMeasure() { return this.add("modal-scrollbar-measure"); }
get modalSm() { return this.add("modal-sm"); }
get modalLg() { return this.add("modal-lg"); }
get modalXl() { return this.add("modal-xl"); }
get tooltip() { return this.add("tooltip"); }
get tooltipShow() { return this.add("tooltip show"); }
get bsTooltipTop() { return this.add("bs-tooltip-top"); }
get bsTooltipAutoXPlacementTop() { return this.add("bs-tooltip-auto[x-placement^=top]"); }
get bsTooltipRight() { return this.add("bs-tooltip-right"); }
get bsTooltipAutoXPlacementRight() { return this.add("bs-tooltip-auto[x-placement^=right]"); }
get bsTooltipBottom() { return this.add("bs-tooltip-bottom"); }
get bsTooltipAutoXPlacementBottom() { return this.add("bs-tooltip-auto[x-placement^=bottom]"); }
get bsTooltipLeft() { return this.add("bs-tooltip-left"); }
get bsTooltipAutoXPlacementLeft() { return this.add("bs-tooltip-auto[x-placement^=left]"); }
get tooltipInner() { return this.add("tooltip-inner"); }
get popover() { return this.add("popover"); }
get bsPopoverTop() { return this.add("bs-popover-top"); }
get bsPopoverAutoXPlacementTop() { return this.add("bs-popover-auto[x-placement^=top]"); }
get bsPopoverRight() { return this.add("bs-popover-right"); }
get bsPopoverAutoXPlacementRight() { return this.add("bs-popover-auto[x-placement^=right]"); }
get bsPopoverBottom() { return this.add("bs-popover-bottom"); }
get bsPopoverAutoXPlacementBottom() { return this.add("bs-popover-auto[x-placement^=bottom]"); }
get bsPopoverLeft() { return this.add("bs-popover-left"); }
get bsPopoverAutoXPlacementLeft() { return this.add("bs-popover-auto[x-placement^=left]"); }
get popoverHeader() { return this.add("popover-header"); }
get popoverBody() { return this.add("popover-body"); }
get carousel() { return this.add("carousel"); }
get carouselPointerEvent() { return this.add("carousel pointer-event"); }
get carouselInner() { return this.add("carousel-inner"); }
get carouselItem() { return this.add("carousel-item"); }
get carouselItemActive() { return this.add("carousel-item active"); }
get carouselItemNext() { return this.add("carousel-item-next"); }
get carouselItemPrev() { return this.add("carousel-item-prev"); }
get carouselControlPrev() { return this.add("carousel-control-prev"); }
get carouselControlNext() { return this.add("carousel-control-next"); }
get carouselControlPrevIcon() { return this.add("carousel-control-prev-icon"); }
get carouselControlNextIcon() { return this.add("carousel-control-next-icon"); }
get carouselIndicators() { return this.add("carousel-indicators"); }
get carouselCaption() { return this.add("carousel-caption"); }
get spinnerBorder() { return this.add("spinner-border"); }
get spinnerBorderSm() { return this.add("spinner-border-sm"); }
get spinnerGrow() { return this.add("spinner-grow"); }
get spinnerGrowSm() { return this.add("spinner-grow-sm"); }
get alignBaseline() { return this.add("align-baseline"); }
get alignTop() { return this.add("align-top"); }
get alignMiddle() { return this.add("align-middle"); }
get alignBottom() { return this.add("align-bottom"); }
get alignTextBottom() { return this.add("align-text-bottom"); }
get alignTextTop() { return this.add("align-text-top"); }
get bgPrimary() { return this.add("bg-primary"); }
get bgSecondary() { return this.add("bg-secondary"); }
get bgSuccess() { return this.add("bg-success"); }
get bgInfo() { return this.add("bg-info"); }
get bgWarning() { return this.add("bg-warning"); }
get bgDanger() { return this.add("bg-danger"); }
get bgLight() { return this.add("bg-light"); }
get bgDark() { return this.add("bg-dark"); }
get bgWhite() { return this.add("bg-white"); }
get bgTransparent() { return this.add("bg-transparent"); }
get border() { return this.add("border"); }
get borderTop() { return this.add("border-top"); }
get borderRight() { return this.add("border-right"); }
get borderBottom() { return this.add("border-bottom"); }
get borderLeft() { return this.add("border-left"); }
get border_0() { return this.add("border-0"); }
get borderTop_0() { return this.add("border-top-0"); }
get borderRight_0() { return this.add("border-right-0"); }
get borderBottom_0() { return this.add("border-bottom-0"); }
get borderLeft_0() { return this.add("border-left-0"); }
get borderPrimary() { return this.add("border-primary"); }
get borderSecondary() { return this.add("border-secondary"); }
get borderSuccess() { return this.add("border-success"); }
get borderInfo() { return this.add("border-info"); }
get borderWarning() { return this.add("border-warning"); }
get borderDanger() { return this.add("border-danger"); }
get borderLight() { return this.add("border-light"); }
get borderDark() { return this.add("border-dark"); }
get borderWhite() { return this.add("border-white"); }
get roundedSm() { return this.add("rounded-sm"); }
get rounded() { return this.add("rounded"); }
get roundedTop() { return this.add("rounded-top"); }
get roundedRight() { return this.add("rounded-right"); }
get roundedBottom() { return this.add("rounded-bottom"); }
get roundedLeft() { return this.add("rounded-left"); }
get roundedLg() { return this.add("rounded-lg"); }
get roundedCircle() { return this.add("rounded-circle"); }
get roundedPill() { return this.add("rounded-pill"); }
get rounded_0() { return this.add("rounded-0"); }
get dNone() { return this.add("d-none"); }
get dInline() { return this.add("d-inline"); }
get dInlineBlock() { return this.add("d-inline-block"); }
get dBlock() { return this.add("d-block"); }
get dTable() { return this.add("d-table"); }
get dTableRow() { return this.add("d-table-row"); }
get dTableCell() { return this.add("d-table-cell"); }
get dFlex() { return this.add("d-flex"); }
get dInlineFlex() { return this.add("d-inline-flex"); }
get dSmNone() { return this.add("d-sm-none"); }
get dSmInline() { return this.add("d-sm-inline"); }
get dSmInlineBlock() { return this.add("d-sm-inline-block"); }
get dSmBlock() { return this.add("d-sm-block"); }
get dSmTable() { return this.add("d-sm-table"); }
get dSmTableRow() { return this.add("d-sm-table-row"); }
get dSmTableCell() { return this.add("d-sm-table-cell"); }
get dSmFlex() { return this.add("d-sm-flex"); }
get dSmInlineFlex() { return this.add("d-sm-inline-flex"); }
get dMdNone() { return this.add("d-md-none"); }
get dMdInline() { return this.add("d-md-inline"); }
get dMdInlineBlock() { return this.add("d-md-inline-block"); }
get dMdBlock() { return this.add("d-md-block"); }
get dMdTable() { return this.add("d-md-table"); }
get dMdTableRow() { return this.add("d-md-table-row"); }
get dMdTableCell() { return this.add("d-md-table-cell"); }
get dMdFlex() { return this.add("d-md-flex"); }
get dMdInlineFlex() { return this.add("d-md-inline-flex"); }
get dLgNone() { return this.add("d-lg-none"); }
get dLgInline() { return this.add("d-lg-inline"); }
get dLgInlineBlock() { return this.add("d-lg-inline-block"); }
get dLgBlock() { return this.add("d-lg-block"); }
get dLgTable() { return this.add("d-lg-table"); }
get dLgTableRow() { return this.add("d-lg-table-row"); }
get dLgTableCell() { return this.add("d-lg-table-cell"); }
get dLgFlex() { return this.add("d-lg-flex"); }
get dLgInlineFlex() { return this.add("d-lg-inline-flex"); }
get dXlNone() { return this.add("d-xl-none"); }
get dXlInline() { return this.add("d-xl-inline"); }
get dXlInlineBlock() { return this.add("d-xl-inline-block"); }
get dXlBlock() { return this.add("d-xl-block"); }
get dXlTable() { return this.add("d-xl-table"); }
get dXlTableRow() { return this.add("d-xl-table-row"); }
get dXlTableCell() { return this.add("d-xl-table-cell"); }
get dXlFlex() { return this.add("d-xl-flex"); }
get dXlInlineFlex() { return this.add("d-xl-inline-flex"); }
get dPrintNone() { return this.add("d-print-none"); }
get dPrintInline() { return this.add("d-print-inline"); }
get dPrintInlineBlock() { return this.add("d-print-inline-block"); }
get dPrintBlock() { return this.add("d-print-block"); }
get dPrintTable() { return this.add("d-print-table"); }
get dPrintTableRow() { return this.add("d-print-table-row"); }
get dPrintTableCell() { return this.add("d-print-table-cell"); }
get dPrintFlex() { return this.add("d-print-flex"); }
get dPrintInlineFlex() { return this.add("d-print-inline-flex"); }
get embedResponsive() { return this.add("embed-responsive"); }
get flexRow() { return this.add("flex-row"); }
get flexColumn() { return this.add("flex-column"); }
get flexRowReverse() { return this.add("flex-row-reverse"); }
get flexColumnReverse() { return this.add("flex-column-reverse"); }
get flexWrap() { return this.add("flex-wrap"); }
get flexNowrap() { return this.add("flex-nowrap"); }
get flexWrapReverse() { return this.add("flex-wrap-reverse"); }
get flexFill() { return this.add("flex-fill"); }
get flexGrow_0() { return this.add("flex-grow-0"); }
get flexGrow_1() { return this.add("flex-grow-1"); }
get flexShrink_0() { return this.add("flex-shrink-0"); }
get flexShrink_1() { return this.add("flex-shrink-1"); }
get justifyContentStart() { return this.add("justify-content-start"); }
get justifyContentEnd() { return this.add("justify-content-end"); }
get justifyContentCenter() { return this.add("justify-content-center"); }
get justifyContentBetween() { return this.add("justify-content-between"); }
get justifyContentAround() { return this.add("justify-content-around"); }
get alignItemsStart() { return this.add("align-items-start"); }
get alignItemsEnd() { return this.add("align-items-end"); }
get alignItemsCenter() { return this.add("align-items-center"); }
get alignItemsBaseline() { return this.add("align-items-baseline"); }
get alignItemsStretch() { return this.add("align-items-stretch"); }
get alignContentStart() { return this.add("align-content-start"); }
get alignContentEnd() { return this.add("align-content-end"); }
get alignContentCenter() { return this.add("align-content-center"); }
get alignContentBetween() { return this.add("align-content-between"); }
get alignContentAround() { return this.add("align-content-around"); }
get alignContentStretch() { return this.add("align-content-stretch"); }
get alignSelfAuto() { return this.add("align-self-auto"); }
get alignSelfStart() { return this.add("align-self-start"); }
get alignSelfEnd() { return this.add("align-self-end"); }
get alignSelfCenter() { return this.add("align-self-center"); }
get alignSelfBaseline() { return this.add("align-self-baseline"); }
get alignSelfStretch() { return this.add("align-self-stretch"); }
get flexSmRow() { return this.add("flex-sm-row"); }
get flexSmColumn() { return this.add("flex-sm-column"); }
get flexSmRowReverse() { return this.add("flex-sm-row-reverse"); }
get flexSmColumnReverse() { return this.add("flex-sm-column-reverse"); }
get flexSmWrap() { return this.add("flex-sm-wrap"); }
get flexSmNowrap() { return this.add("flex-sm-nowrap"); }
get flexSmWrapReverse() { return this.add("flex-sm-wrap-reverse"); }
get flexSmFill() { return this.add("flex-sm-fill"); }
get flexSmGrow_0() { return this.add("flex-sm-grow-0"); }
get flexSmGrow_1() { return this.add("flex-sm-grow-1"); }
get flexSmShrink_0() { return this.add("flex-sm-shrink-0"); }
get flexSmShrink_1() { return this.add("flex-sm-shrink-1"); }
get justifyContentSmStart() { return this.add("justify-content-sm-start"); }
get justifyContentSmEnd() { return this.add("justify-content-sm-end"); }
get justifyContentSmCenter() { return this.add("justify-content-sm-center"); }
get justifyContentSmBetween() { return this.add("justify-content-sm-between"); }
get justifyContentSmAround() { return this.add("justify-content-sm-around"); }
get alignItemsSmStart() { return this.add("align-items-sm-start"); }
get alignItemsSmEnd() { return this.add("align-items-sm-end"); }
get alignItemsSmCenter() { return this.add("align-items-sm-center"); }
get alignItemsSmBaseline() { return this.add("align-items-sm-baseline"); }
get alignItemsSmStretch() { return this.add("align-items-sm-stretch"); }
get alignContentSmStart() { return this.add("align-content-sm-start"); }
get alignContentSmEnd() { return this.add("align-content-sm-end"); }
get alignContentSmCenter() { return this.add("align-content-sm-center"); }
get alignContentSmBetween() { return this.add("align-content-sm-between"); }
get alignContentSmAround() { return this.add("align-content-sm-around"); }
get alignContentSmStretch() { return this.add("align-content-sm-stretch"); }
get alignSelfSmAuto() { return this.add("align-self-sm-auto"); }
get alignSelfSmStart() { return this.add("align-self-sm-start"); }
get alignSelfSmEnd() { return this.add("align-self-sm-end"); }
get alignSelfSmCenter() { return this.add("align-self-sm-center"); }
get alignSelfSmBaseline() { return this.add("align-self-sm-baseline"); }
get alignSelfSmStretch() { return this.add("align-self-sm-stretch"); }
get flexMdRow() { return this.add("flex-md-row"); }
get flexMdColumn() { return this.add("flex-md-column"); }
get flexMdRowReverse() { return this.add("flex-md-row-reverse"); }
get flexMdColumnReverse() { return this.add("flex-md-column-reverse"); }
get flexMdWrap() { return this.add("flex-md-wrap"); }
get flexMdNowrap() { return this.add("flex-md-nowrap"); }
get flexMdWrapReverse() { return this.add("flex-md-wrap-reverse"); }
get flexMdFill() { return this.add("flex-md-fill"); }
get flexMdGrow_0() { return this.add("flex-md-grow-0"); }
get flexMdGrow_1() { return this.add("flex-md-grow-1"); }
get flexMdShrink_0() { return this.add("flex-md-shrink-0"); }
get flexMdShrink_1() { return this.add("flex-md-shrink-1"); }
get justifyContentMdStart() { return this.add("justify-content-md-start"); }
get justifyContentMdEnd() { return this.add("justify-content-md-end"); }
get justifyContentMdCenter() { return this.add("justify-content-md-center"); }
get justifyContentMdBetween() { return this.add("justify-content-md-between"); }
get justifyContentMdAround() { return this.add("justify-content-md-around"); }
get alignItemsMdStart() { return this.add("align-items-md-start"); }
get alignItemsMdEnd() { return this.add("align-items-md-end"); }
get alignItemsMdCenter() { return this.add("align-items-md-center"); }
get alignItemsMdBaseline() { return this.add("align-items-md-baseline"); }
get alignItemsMdStretch() { return this.add("align-items-md-stretch"); }
get alignContentMdStart() { return this.add("align-content-md-start"); }
get alignContentMdEnd() { return this.add("align-content-md-end"); }
get alignContentMdCenter() { return this.add("align-content-md-center"); }
get alignContentMdBetween() { return this.add("align-content-md-between"); }
get alignContentMdAround() { return this.add("align-content-md-around"); }
get alignContentMdStretch() { return this.add("align-content-md-stretch"); }
get alignSelfMdAuto() { return this.add("align-self-md-auto"); }
get alignSelfMdStart() { return this.add("align-self-md-start"); }
get alignSelfMdEnd() { return this.add("align-self-md-end"); }
get alignSelfMdCenter() { return this.add("align-self-md-center"); }
get alignSelfMdBaseline() { return this.add("align-self-md-baseline"); }
get alignSelfMdStretch() { return this.add("align-self-md-stretch"); }
get flexLgRow() { return this.add("flex-lg-row"); }
get flexLgColumn() { return this.add("flex-lg-column"); }
get flexLgRowReverse() { return this.add("flex-lg-row-reverse"); }
get flexLgColumnReverse() { return this.add("flex-lg-column-reverse"); }
get flexLgWrap() { return this.add("flex-lg-wrap"); }
get flexLgNowrap() { return this.add("flex-lg-nowrap"); }
get flexLgWrapReverse() { return this.add("flex-lg-wrap-reverse"); }
get flexLgFill() { return this.add("flex-lg-fill"); }
get flexLgGrow_0() { return this.add("flex-lg-grow-0"); }
get flexLgGrow_1() { return this.add("flex-lg-grow-1"); }
get flexLgShrink_0() { return this.add("flex-lg-shrink-0"); }
get flexLgShrink_1() { return this.add("flex-lg-shrink-1"); }
get justifyContentLgStart() { return this.add("justify-content-lg-start"); }
get justifyContentLgEnd() { return this.add("justify-content-lg-end"); }
get justifyContentLgCenter() { return this.add("justify-content-lg-center"); }
get justifyContentLgBetween() { return this.add("justify-content-lg-between"); }
get justifyContentLgAround() { return this.add("justify-content-lg-around"); }
get alignItemsLgStart() { return this.add("align-items-lg-start"); }
get alignItemsLgEnd() { return this.add("align-items-lg-end"); }
get alignItemsLgCenter() { return this.add("align-items-lg-center"); }
get alignItemsLgBaseline() { return this.add("align-items-lg-baseline"); }
get alignItemsLgStretch() { return this.add("align-items-lg-stretch"); }
get alignContentLgStart() { return this.add("align-content-lg-start"); }
get alignContentLgEnd() { return this.add("align-content-lg-end"); }
get alignContentLgCenter() { return this.add("align-content-lg-center"); }
get alignContentLgBetween() { return this.add("align-content-lg-between"); }
get alignContentLgAround() { return this.add("align-content-lg-around"); }
get alignContentLgStretch() { return this.add("align-content-lg-stretch"); }
get alignSelfLgAuto() { return this.add("align-self-lg-auto"); }
get alignSelfLgStart() { return this.add("align-self-lg-start"); }
get alignSelfLgEnd() { return this.add("align-self-lg-end"); }
get alignSelfLgCenter() { return this.add("align-self-lg-center"); }
get alignSelfLgBaseline() { return this.add("align-self-lg-baseline"); }
get alignSelfLgStretch() { return this.add("align-self-lg-stretch"); }
get flexXlRow() { return this.add("flex-xl-row"); }
get flexXlColumn() { return this.add("flex-xl-column"); }
get flexXlRowReverse() { return this.add("flex-xl-row-reverse"); }
get flexXlColumnReverse() { return this.add("flex-xl-column-reverse"); }
get flexXlWrap() { return this.add("flex-xl-wrap"); }
get flexXlNowrap() { return this.add("flex-xl-nowrap"); }
get flexXlWrapReverse() { return this.add("flex-xl-wrap-reverse"); }
get flexXlFill() { return this.add("flex-xl-fill"); }
get flexXlGrow_0() { return this.add("flex-xl-grow-0"); }
get flexXlGrow_1() { return this.add("flex-xl-grow-1"); }
get flexXlShrink_0() { return this.add("flex-xl-shrink-0"); }
get flexXlShrink_1() { return this.add("flex-xl-shrink-1"); }
get justifyContentXlStart() { return this.add("justify-content-xl-start"); }
get justifyContentXlEnd() { return this.add("justify-content-xl-end"); }
get justifyContentXlCenter() { return this.add("justify-content-xl-center"); }
get justifyContentXlBetween() { return this.add("justify-content-xl-between"); }
get justifyContentXlAround() { return this.add("justify-content-xl-around"); }
get alignItemsXlStart() { return this.add("align-items-xl-start"); }
get alignItemsXlEnd() { return this.add("align-items-xl-end"); }
get alignItemsXlCenter() { return this.add("align-items-xl-center"); }
get alignItemsXlBaseline() { return this.add("align-items-xl-baseline"); }
get alignItemsXlStretch() { return this.add("align-items-xl-stretch"); }
get alignContentXlStart() { return this.add("align-content-xl-start"); }
get alignContentXlEnd() { return this.add("align-content-xl-end"); }
get alignContentXlCenter() { return this.add("align-content-xl-center"); }
get alignContentXlBetween() { return this.add("align-content-xl-between"); }
get alignContentXlAround() { return this.add("align-content-xl-around"); }
get alignContentXlStretch() { return this.add("align-content-xl-stretch"); }
get alignSelfXlAuto() { return this.add("align-self-xl-auto"); }
get alignSelfXlStart() { return this.add("align-self-xl-start"); }
get alignSelfXlEnd() { return this.add("align-self-xl-end"); }
get alignSelfXlCenter() { return this.add("align-self-xl-center"); }
get alignSelfXlBaseline() { return this.add("align-self-xl-baseline"); }
get alignSelfXlStretch() { return this.add("align-self-xl-stretch"); }
get floatLeft() { return this.add("float-left"); }
get floatRight() { return this.add("float-right"); }
get floatNone() { return this.add("float-none"); }
get floatSmLeft() { return this.add("float-sm-left"); }
get floatSmRight() { return this.add("float-sm-right"); }
get floatSmNone() { return this.add("float-sm-none"); }
get floatMdLeft() { return this.add("float-md-left"); }
get floatMdRight() { return this.add("float-md-right"); }
get floatMdNone() { return this.add("float-md-none"); }
get floatLgLeft() { return this.add("float-lg-left"); }
get floatLgRight() { return this.add("float-lg-right"); }
get floatLgNone() { return this.add("float-lg-none"); }
get floatXlLeft() { return this.add("float-xl-left"); }
get floatXlRight() { return this.add("float-xl-right"); }
get floatXlNone() { return this.add("float-xl-none"); }
get userSelectAll() { return this.add("user-select-all"); }
get userSelectAuto() { return this.add("user-select-auto"); }
get userSelectNone() { return this.add("user-select-none"); }
get overflowAuto() { return this.add("overflow-auto"); }
get overflowHidden() { return this.add("overflow-hidden"); }
get positionStatic() { return this.add("position-static"); }
get positionRelative() { return this.add("position-relative"); }
get positionAbsolute() { return this.add("position-absolute"); }
get positionFixed() { return this.add("position-fixed"); }
get positionSticky() { return this.add("position-sticky"); }
get fixedTop() { return this.add("fixed-top"); }
get fixedBottom() { return this.add("fixed-bottom"); }
get stickyTop() { return this.add("sticky-top"); }
get srOnly() { return this.add("sr-only"); }
get shadowSm() { return this.add("shadow-sm"); }
get shadow() { return this.add("shadow"); }
get shadowLg() { return this.add("shadow-lg"); }
get shadowNone() { return this.add("shadow-none"); }
get w_25() { return this.add("w-25"); }
get w_50() { return this.add("w-50"); }
get w_75() { return this.add("w-75"); }
get w_100() { return this.add("w-100"); }
get wAuto() { return this.add("w-auto"); }
get h_25() { return this.add("h-25"); }
get h_50() { return this.add("h-50"); }
get h_75() { return this.add("h-75"); }
get h_100() { return this.add("h-100"); }
get hAuto() { return this.add("h-auto"); }
get mw_100() { return this.add("mw-100"); }
get mh_100() { return this.add("mh-100"); }
get minVw_100() { return this.add("min-vw-100"); }
get minVh_100() { return this.add("min-vh-100"); }
get vw_100() { return this.add("vw-100"); }
get vh_100() { return this.add("vh-100"); }
get m_0() { return this.add("m-0"); }
get mt_0() { return this.add("mt-0"); }
get my_0() { return this.add("my-0"); }
get mr_0() { return this.add("mr-0"); }
get mx_0() { return this.add("mx-0"); }
get mb_0() { return this.add("mb-0"); }
get ml_0() { return this.add("ml-0"); }
get m_1() { return this.add("m-1"); }
get mt_1() { return this.add("mt-1"); }
get my_1() { return this.add("my-1"); }
get mr_1() { return this.add("mr-1"); }
get mx_1() { return this.add("mx-1"); }
get mb_1() { return this.add("mb-1"); }
get ml_1() { return this.add("ml-1"); }
get m_2() { return this.add("m-2"); }
get mt_2() { return this.add("mt-2"); }
get my_2() { return this.add("my-2"); }
get mr_2() { return this.add("mr-2"); }
get mx_2() { return this.add("mx-2"); }
get mb_2() { return this.add("mb-2"); }
get ml_2() { return this.add("ml-2"); }
get m_3() { return this.add("m-3"); }
get mt_3() { return this.add("mt-3"); }
get my_3() { return this.add("my-3"); }
get mr_3() { return this.add("mr-3"); }
get mx_3() { return this.add("mx-3"); }
get mb_3() { return this.add("mb-3"); }
get ml_3() { return this.add("ml-3"); }
get m_4() { return this.add("m-4"); }
get mt_4() { return this.add("mt-4"); }
get my_4() { return this.add("my-4"); }
get mr_4() { return this.add("mr-4"); }
get mx_4() { return this.add("mx-4"); }
get mb_4() { return this.add("mb-4"); }
get ml_4() { return this.add("ml-4"); }
get m_5() { return this.add("m-5"); }
get mt_5() { return this.add("mt-5"); }
get my_5() { return this.add("my-5"); }
get mr_5() { return this.add("mr-5"); }
get mx_5() { return this.add("mx-5"); }
get mb_5() { return this.add("mb-5"); }
get ml_5() { return this.add("ml-5"); }
get p_0() { return this.add("p-0"); }
get pt_0() { return this.add("pt-0"); }
get py_0() { return this.add("py-0"); }
get pr_0() { return this.add("pr-0"); }
get px_0() { return this.add("px-0"); }
get pb_0() { return this.add("pb-0"); }
get pl_0() { return this.add("pl-0"); }
get p_1() { return this.add("p-1"); }
get pt_1() { return this.add("pt-1"); }
get py_1() { return this.add("py-1"); }
get pr_1() { return this.add("pr-1"); }
get px_1() { return this.add("px-1"); }
get pb_1() { return this.add("pb-1"); }
get pl_1() { return this.add("pl-1"); }
get p_2() { return this.add("p-2"); }
get pt_2() { return this.add("pt-2"); }
get py_2() { return this.add("py-2"); }
get pr_2() { return this.add("pr-2"); }
get px_2() { return this.add("px-2"); }
get pb_2() { return this.add("pb-2"); }
get pl_2() { return this.add("pl-2"); }
get p_3() { return this.add("p-3"); }
get pt_3() { return this.add("pt-3"); }
get py_3() { return this.add("py-3"); }
get pr_3() { return this.add("pr-3"); }
get px_3() { return this.add("px-3"); }
get pb_3() { return this.add("pb-3"); }
get pl_3() { return this.add("pl-3"); }
get p_4() { return this.add("p-4"); }
get pt_4() { return this.add("pt-4"); }
get py_4() { return this.add("py-4"); }
get pr_4() { return this.add("pr-4"); }
get px_4() { return this.add("px-4"); }
get pb_4() { return this.add("pb-4"); }
get pl_4() { return this.add("pl-4"); }
get p_5() { return this.add("p-5"); }
get pt_5() { return this.add("pt-5"); }
get py_5() { return this.add("py-5"); }
get pr_5() { return this.add("pr-5"); }
get px_5() { return this.add("px-5"); }
get pb_5() { return this.add("pb-5"); }
get pl_5() { return this.add("pl-5"); }
get mN1() { return this.add("m-n1"); }
get mtN1() { return this.add("mt-n1"); }
get myN1() { return this.add("my-n1"); }
get mrN1() { return this.add("mr-n1"); }
get mxN1() { return this.add("mx-n1"); }
get mbN1() { return this.add("mb-n1"); }
get mlN1() { return this.add("ml-n1"); }
get mN2() { return this.add("m-n2"); }
get mtN2() { return this.add("mt-n2"); }
get myN2() { return this.add("my-n2"); }
get mrN2() { return this.add("mr-n2"); }
get mxN2() { return this.add("mx-n2"); }
get mbN2() { return this.add("mb-n2"); }
get mlN2() { return this.add("ml-n2"); }
get mN3() { return this.add("m-n3"); }
get mtN3() { return this.add("mt-n3"); }
get myN3() { return this.add("my-n3"); }
get mrN3() { return this.add("mr-n3"); }
get mxN3() { return this.add("mx-n3"); }
get mbN3() { return this.add("mb-n3"); }
get mlN3() { return this.add("ml-n3"); }
get mN4() { return this.add("m-n4"); }
get mtN4() { return this.add("mt-n4"); }
get myN4() { return this.add("my-n4"); }
get mrN4() { return this.add("mr-n4"); }
get mxN4() { return this.add("mx-n4"); }
get mbN4() { return this.add("mb-n4"); }
get mlN4() { return this.add("ml-n4"); }
get mN5() { return this.add("m-n5"); }
get mtN5() { return this.add("mt-n5"); }
get myN5() { return this.add("my-n5"); }
get mrN5() { return this.add("mr-n5"); }
get mxN5() { return this.add("mx-n5"); }
get mbN5() { return this.add("mb-n5"); }
get mlN5() { return this.add("ml-n5"); }
get mAuto() { return this.add("m-auto"); }
get mtAuto() { return this.add("mt-auto"); }
get myAuto() { return this.add("my-auto"); }
get mrAuto() { return this.add("mr-auto"); }
get mxAuto() { return this.add("mx-auto"); }
get mbAuto() { return this.add("mb-auto"); }
get mlAuto() { return this.add("ml-auto"); }
get mSm_0() { return this.add("m-sm-0"); }
get mtSm_0() { return this.add("mt-sm-0"); }
get mySm_0() { return this.add("my-sm-0"); }
get mrSm_0() { return this.add("mr-sm-0"); }
get mxSm_0() { return this.add("mx-sm-0"); }
get mbSm_0() { return this.add("mb-sm-0"); }
get mlSm_0() { return this.add("ml-sm-0"); }
get mSm_1() { return this.add("m-sm-1"); }
get mtSm_1() { return this.add("mt-sm-1"); }
get mySm_1() { return this.add("my-sm-1"); }
get mrSm_1() { return this.add("mr-sm-1"); }
get mxSm_1() { return this.add("mx-sm-1"); }
get mbSm_1() { return this.add("mb-sm-1"); }
get mlSm_1() { return this.add("ml-sm-1"); }
get mSm_2() { return this.add("m-sm-2"); }
get mtSm_2() { return this.add("mt-sm-2"); }
get mySm_2() { return this.add("my-sm-2"); }
get mrSm_2() { return this.add("mr-sm-2"); }
get mxSm_2() { return this.add("mx-sm-2"); }
get mbSm_2() { return this.add("mb-sm-2"); }
get mlSm_2() { return this.add("ml-sm-2"); }
get mSm_3() { return this.add("m-sm-3"); }
get mtSm_3() { return this.add("mt-sm-3"); }
get mySm_3() { return this.add("my-sm-3"); }
get mrSm_3() { return this.add("mr-sm-3"); }
get mxSm_3() { return this.add("mx-sm-3"); }
get mbSm_3() { return this.add("mb-sm-3"); }
get mlSm_3() { return this.add("ml-sm-3"); }
get mSm_4() { return this.add("m-sm-4"); }
get mtSm_4() { return this.add("mt-sm-4"); }
get mySm_4() { return this.add("my-sm-4"); }
get mrSm_4() { return this.add("mr-sm-4"); }
get mxSm_4() { return this.add("mx-sm-4"); }
get mbSm_4() { return this.add("mb-sm-4"); }
get mlSm_4() { return this.add("ml-sm-4"); }
get mSm_5() { return this.add("m-sm-5"); }
get mtSm_5() { return this.add("mt-sm-5"); }
get mySm_5() { return this.add("my-sm-5"); }
get mrSm_5() { return this.add("mr-sm-5"); }
get mxSm_5() { return this.add("mx-sm-5"); }
get mbSm_5() { return this.add("mb-sm-5"); }
get mlSm_5() { return this.add("ml-sm-5"); }
get pSm_0() { return this.add("p-sm-0"); }
get ptSm_0() { return this.add("pt-sm-0"); }
get pySm_0() { return this.add("py-sm-0"); }
get prSm_0() { return this.add("pr-sm-0"); }
get pxSm_0() { return this.add("px-sm-0"); }
get pbSm_0() { return this.add("pb-sm-0"); }
get plSm_0() { return this.add("pl-sm-0"); }
get pSm_1() { return this.add("p-sm-1"); }
get ptSm_1() { return this.add("pt-sm-1"); }
get pySm_1() { return this.add("py-sm-1"); }
get prSm_1() { return this.add("pr-sm-1"); }
get pxSm_1() { return this.add("px-sm-1"); }
get pbSm_1() { return this.add("pb-sm-1"); }
get plSm_1() { return this.add("pl-sm-1"); }
get pSm_2() { return this.add("p-sm-2"); }
get ptSm_2() { return this.add("pt-sm-2"); }
get pySm_2() { return this.add("py-sm-2"); }
get prSm_2() { return this.add("pr-sm-2"); }
get pxSm_2() { return this.add("px-sm-2"); }
get pbSm_2() { return this.add("pb-sm-2"); }
get plSm_2() { return this.add("pl-sm-2"); }
get pSm_3() { return this.add("p-sm-3"); }
get ptSm_3() { return this.add("pt-sm-3"); }
get pySm_3() { return this.add("py-sm-3"); }
get prSm_3() { return this.add("pr-sm-3"); }
get pxSm_3() { return this.add("px-sm-3"); }
get pbSm_3() { return this.add("pb-sm-3"); }
get plSm_3() { return this.add("pl-sm-3"); }
get pSm_4() { return this.add("p-sm-4"); }
get ptSm_4() { return this.add("pt-sm-4"); }
get pySm_4() { return this.add("py-sm-4"); }
get prSm_4() { return this.add("pr-sm-4"); }
get pxSm_4() { return this.add("px-sm-4"); }
get pbSm_4() { return this.add("pb-sm-4"); }
get plSm_4() { return this.add("pl-sm-4"); }
get pSm_5() { return this.add("p-sm-5"); }
get ptSm_5() { return this.add("pt-sm-5"); }
get pySm_5() { return this.add("py-sm-5"); }
get prSm_5() { return this.add("pr-sm-5"); }
get pxSm_5() { return this.add("px-sm-5"); }
get pbSm_5() { return this.add("pb-sm-5"); }
get plSm_5() { return this.add("pl-sm-5"); }
get mSmN1() { return this.add("m-sm-n1"); }
get mtSmN1() { return this.add("mt-sm-n1"); }
get mySmN1() { return this.add("my-sm-n1"); }
get mrSmN1() { return this.add("mr-sm-n1"); }
get mxSmN1() { return this.add("mx-sm-n1"); }
get mbSmN1() { return this.add("mb-sm-n1"); }
get mlSmN1() { return this.add("ml-sm-n1"); }
get mSmN2() { return this.add("m-sm-n2"); }
get mtSmN2() { return this.add("mt-sm-n2"); }
get mySmN2() { return this.add("my-sm-n2"); }
get mrSmN2() { return this.add("mr-sm-n2"); }
get mxSmN2() { return this.add("mx-sm-n2"); }
get mbSmN2() { return this.add("mb-sm-n2"); }
get mlSmN2() { return this.add("ml-sm-n2"); }
get mSmN3() { return this.add("m-sm-n3"); }
get mtSmN3() { return this.add("mt-sm-n3"); }
get mySmN3() { return this.add("my-sm-n3"); }
get mrSmN3() { return this.add("mr-sm-n3"); }
get mxSmN3() { return this.add("mx-sm-n3"); }
get mbSmN3() { return this.add("mb-sm-n3"); }
get mlSmN3() { return this.add("ml-sm-n3"); }
get mSmN4() { return this.add("m-sm-n4"); }
get mtSmN4() { return this.add("mt-sm-n4"); }
get mySmN4() { return this.add("my-sm-n4"); }
get mrSmN4() { return this.add("mr-sm-n4"); }
get mxSmN4() { return this.add("mx-sm-n4"); }
get mbSmN4() { return this.add("mb-sm-n4"); }
get mlSmN4() { return this.add("ml-sm-n4"); }
get mSmN5() { return this.add("m-sm-n5"); }
get mtSmN5() { return this.add("mt-sm-n5"); }
get mySmN5() { return this.add("my-sm-n5"); }
get mrSmN5() { return this.add("mr-sm-n5"); }
get mxSmN5() { return this.add("mx-sm-n5"); }
get mbSmN5() { return this.add("mb-sm-n5"); }
get mlSmN5() { return this.add("ml-sm-n5"); }
get mSmAuto() { return this.add("m-sm-auto"); }
get mtSmAuto() { return this.add("mt-sm-auto"); }
get mySmAuto() { return this.add("my-sm-auto"); }
get mrSmAuto() { return this.add("mr-sm-auto"); }
get mxSmAuto() { return this.add("mx-sm-auto"); }
get mbSmAuto() { return this.add("mb-sm-auto"); }
get mlSmAuto() { return this.add("ml-sm-auto"); }
get mMd_0() { return this.add("m-md-0"); }
get mtMd_0() { return this.add("mt-md-0"); }
get myMd_0() { return this.add("my-md-0"); }
get mrMd_0() { return this.add("mr-md-0"); }
get mxMd_0() { return this.add("mx-md-0"); }
get mbMd_0() { return this.add("mb-md-0"); }
get mlMd_0() { return this.add("ml-md-0"); }
get mMd_1() { return this.add("m-md-1"); }
get mtMd_1() { return this.add("mt-md-1"); }
get myMd_1() { return this.add("my-md-1"); }
get mrMd_1() { return this.add("mr-md-1"); }
get mxMd_1() { return this.add("mx-md-1"); }
get mbMd_1() { return this.add("mb-md-1"); }
get mlMd_1() { return this.add("ml-md-1"); }
get mMd_2() { return this.add("m-md-2"); }
get mtMd_2() { return this.add("mt-md-2"); }
get myMd_2() { return this.add("my-md-2"); }
get mrMd_2() { return this.add("mr-md-2"); }
get mxMd_2() { return this.add("mx-md-2"); }
get mbMd_2() { return this.add("mb-md-2"); }
get mlMd_2() { return this.add("ml-md-2"); }
get mMd_3() { return this.add("m-md-3"); }
get mtMd_3() { return this.add("mt-md-3"); }
get myMd_3() { return this.add("my-md-3"); }
get mrMd_3() { return this.add("mr-md-3"); }
get mxMd_3() { return this.add("mx-md-3"); }
get mbMd_3() { return this.add("mb-md-3"); }
get mlMd_3() { return this.add("ml-md-3"); }
get mMd_4() { return this.add("m-md-4"); }
get mtMd_4() { return this.add("mt-md-4"); }
get myMd_4() { return this.add("my-md-4"); }
get mrMd_4() { return this.add("mr-md-4"); }
get mxMd_4() { return this.add("mx-md-4"); }
get mbMd_4() { return this.add("mb-md-4"); }
get mlMd_4() { return this.add("ml-md-4"); }
get mMd_5() { return this.add("m-md-5"); }
get mtMd_5() { return this.add("mt-md-5"); }
get myMd_5() { return this.add("my-md-5"); }
get mrMd_5() { return this.add("mr-md-5"); }
get mxMd_5() { return this.add("mx-md-5"); }
get mbMd_5() { return this.add("mb-md-5"); }
get mlMd_5() { return this.add("ml-md-5"); }
get pMd_0() { return this.add("p-md-0"); }
get ptMd_0() { return this.add("pt-md-0"); }
get pyMd_0() { return this.add("py-md-0"); }
get prMd_0() { return this.add("pr-md-0"); }
get pxMd_0() { return this.add("px-md-0"); }
get pbMd_0() { return this.add("pb-md-0"); }
get plMd_0() { return this.add("pl-md-0"); }
get pMd_1() { return this.add("p-md-1"); }
get ptMd_1() { return this.add("pt-md-1"); }
get pyMd_1() { return this.add("py-md-1"); }
get prMd_1() { return this.add("pr-md-1"); }
get pxMd_1() { return this.add("px-md-1"); }
get pbMd_1() { return this.add("pb-md-1"); }
get plMd_1() { return this.add("pl-md-1"); }
get pMd_2() { return this.add("p-md-2"); }
get ptMd_2() { return this.add("pt-md-2"); }
get pyMd_2() { return this.add("py-md-2"); }
get prMd_2() { return this.add("pr-md-2"); }
get pxMd_2() { return this.add("px-md-2"); }
get pbMd_2() { return this.add("pb-md-2"); }
get plMd_2() { return this.add("pl-md-2"); }
get pMd_3() { return this.add("p-md-3"); }
get ptMd_3() { return this.add("pt-md-3"); }
get pyMd_3() { return this.add("py-md-3"); }
get prMd_3() { return this.add("pr-md-3"); }
get pxMd_3() { return this.add("px-md-3"); }
get pbMd_3() { return this.add("pb-md-3"); }
get plMd_3() { return this.add("pl-md-3"); }
get pMd_4() { return this.add("p-md-4"); }
get ptMd_4() { return this.add("pt-md-4"); }
get pyMd_4() { return this.add("py-md-4"); }
get prMd_4() { return this.add("pr-md-4"); }
get pxMd_4() { return this.add("px-md-4"); }
get pbMd_4() { return this.add("pb-md-4"); }
get plMd_4() { return this.add("pl-md-4"); }
get pMd_5() { return this.add("p-md-5"); }
get ptMd_5() { return this.add("pt-md-5"); }
get pyMd_5() { return this.add("py-md-5"); }
get prMd_5() { return this.add("pr-md-5"); }
get pxMd_5() { return this.add("px-md-5"); }
get pbMd_5() { return this.add("pb-md-5"); }
get plMd_5() { return this.add("pl-md-5"); }
get mMdN1() { return this.add("m-md-n1"); }
get mtMdN1() { return this.add("mt-md-n1"); }
get myMdN1() { return this.add("my-md-n1"); }
get mrMdN1() { return this.add("mr-md-n1"); }
get mxMdN1() { return this.add("mx-md-n1"); }
get mbMdN1() { return this.add("mb-md-n1"); }
get mlMdN1() { return this.add("ml-md-n1"); }
get mMdN2() { return this.add("m-md-n2"); }
get mtMdN2() { return this.add("mt-md-n2"); }
get myMdN2() { return this.add("my-md-n2"); }
get mrMdN2() { return this.add("mr-md-n2"); }
get mxMdN2() { return this.add("mx-md-n2"); }
get mbMdN2() { return this.add("mb-md-n2"); }
get mlMdN2() { return this.add("ml-md-n2"); }
get mMdN3() { return this.add("m-md-n3"); }
get mtMdN3() { return this.add("mt-md-n3"); }
get myMdN3() { return this.add("my-md-n3"); }
get mrMdN3() { return this.add("mr-md-n3"); }
get mxMdN3() { return this.add("mx-md-n3"); }
get mbMdN3() { return this.add("mb-md-n3"); }
get mlMdN3() { return this.add("ml-md-n3"); }
get mMdN4() { return this.add("m-md-n4"); }
get mtMdN4() { return this.add("mt-md-n4"); }
get myMdN4() { return this.add("my-md-n4"); }
get mrMdN4() { return this.add("mr-md-n4"); }
get mxMdN4() { return this.add("mx-md-n4"); }
get mbMdN4() { return this.add("mb-md-n4"); }
get mlMdN4() { return this.add("ml-md-n4"); }
get mMdN5() { return this.add("m-md-n5"); }
get mtMdN5() { return this.add("mt-md-n5"); }
get myMdN5() { return this.add("my-md-n5"); }
get mrMdN5() { return this.add("mr-md-n5"); }
get mxMdN5() { return this.add("mx-md-n5"); }
get mbMdN5() { return this.add("mb-md-n5"); }
get mlMdN5() { return this.add("ml-md-n5"); }
get mMdAuto() { return this.add("m-md-auto"); }
get mtMdAuto() { return this.add("mt-md-auto"); }
get myMdAuto() { return this.add("my-md-auto"); }
get mrMdAuto() { return this.add("mr-md-auto"); }
get mxMdAuto() { return this.add("mx-md-auto"); }
get mbMdAuto() { return this.add("mb-md-auto"); }
get mlMdAuto() { return this.add("ml-md-auto"); }
get mLg_0() { return this.add("m-lg-0"); }
get mtLg_0() { return this.add("mt-lg-0"); }
get myLg_0() { return this.add("my-lg-0"); }
get mrLg_0() { return this.add("mr-lg-0"); }
get mxLg_0() { return this.add("mx-lg-0"); }
get mbLg_0() { return this.add("mb-lg-0"); }
get mlLg_0() { return this.add("ml-lg-0"); }
get mLg_1() { return this.add("m-lg-1"); }
get mtLg_1() { return this.add("mt-lg-1"); }
get myLg_1() { return this.add("my-lg-1"); }
get mrLg_1() { return this.add("mr-lg-1"); }
get mxLg_1() { return this.add("mx-lg-1"); }
get mbLg_1() { return this.add("mb-lg-1"); }
get mlLg_1() { return this.add("ml-lg-1"); }
get mLg_2() { return this.add("m-lg-2"); }
get mtLg_2() { return this.add("mt-lg-2"); }
get myLg_2() { return this.add("my-lg-2"); }
get mrLg_2() { return this.add("mr-lg-2"); }
get mxLg_2() { return this.add("mx-lg-2"); }
get mbLg_2() { return this.add("mb-lg-2"); }
get mlLg_2() { return this.add("ml-lg-2"); }
get mLg_3() { return this.add("m-lg-3"); }
get mtLg_3() { return this.add("mt-lg-3"); }
get myLg_3() { return this.add("my-lg-3"); }
get mrLg_3() { return this.add("mr-lg-3"); }
get mxLg_3() { return this.add("mx-lg-3"); }
get mbLg_3() { return this.add("mb-lg-3"); }
get mlLg_3() { return this.add("ml-lg-3"); }
get mLg_4() { return this.add("m-lg-4"); }
get mtLg_4() { return this.add("mt-lg-4"); }
get myLg_4() { return this.add("my-lg-4"); }
get mrLg_4() { return this.add("mr-lg-4"); }
get mxLg_4() { return this.add("mx-lg-4"); }
get mbLg_4() { return this.add("mb-lg-4"); }
get mlLg_4() { return this.add("ml-lg-4"); }
get mLg_5() { return this.add("m-lg-5"); }
get mtLg_5() { return this.add("mt-lg-5"); }
get myLg_5() { return this.add("my-lg-5"); }
get mrLg_5() { return this.add("mr-lg-5"); }
get mxLg_5() { return this.add("mx-lg-5"); }
get mbLg_5() { return this.add("mb-lg-5"); }
get mlLg_5() { return this.add("ml-lg-5"); }
get pLg_0() { return this.add("p-lg-0"); }
get ptLg_0() { return this.add("pt-lg-0"); }
get pyLg_0() { return this.add("py-lg-0"); }
get prLg_0() { return this.add("pr-lg-0"); }
get pxLg_0() { return this.add("px-lg-0"); }
get pbLg_0() { return this.add("pb-lg-0"); }
get plLg_0() { return this.add("pl-lg-0"); }
get pLg_1() { return this.add("p-lg-1"); }
get ptLg_1() { return this.add("pt-lg-1"); }
get pyLg_1() { return this.add("py-lg-1"); }
get prLg_1() { return this.add("pr-lg-1"); }
get pxLg_1() { return this.add("px-lg-1"); }
get pbLg_1() { return this.add("pb-lg-1"); }
get plLg_1() { return this.add("pl-lg-1"); }
get pLg_2() { return this.add("p-lg-2"); }
get ptLg_2() { return this.add("pt-lg-2"); }
get pyLg_2() { return this.add("py-lg-2"); }
get prLg_2() { return this.add("pr-lg-2"); }
get pxLg_2() { return this.add("px-lg-2"); }
get pbLg_2() { return this.add("pb-lg-2"); }
get plLg_2() { return this.add("pl-lg-2"); }
get pLg_3() { return this.add("p-lg-3"); }
get ptLg_3() { return this.add("pt-lg-3"); }
get pyLg_3() { return this.add("py-lg-3"); }
get prLg_3() { return this.add("pr-lg-3"); }
get pxLg_3() { return this.add("px-lg-3"); }
get pbLg_3() { return this.add("pb-lg-3"); }
get plLg_3() { return this.add("pl-lg-3"); }
get pLg_4() { return this.add("p-lg-4"); }
get ptLg_4() { return this.add("pt-lg-4"); }
get pyLg_4() { return this.add("py-lg-4"); }
get prLg_4() { return this.add("pr-lg-4"); }
get pxLg_4() { return this.add("px-lg-4"); }
get pbLg_4() { return this.add("pb-lg-4"); }
get plLg_4() { return this.add("pl-lg-4"); }
get pLg_5() { return this.add("p-lg-5"); }
get ptLg_5() { return this.add("pt-lg-5"); }
get pyLg_5() { return this.add("py-lg-5"); }
get prLg_5() { return this.add("pr-lg-5"); }
get pxLg_5() { return this.add("px-lg-5"); }
get pbLg_5() { return this.add("pb-lg-5"); }
get plLg_5() { return this.add("pl-lg-5"); }
get mLgN1() { return this.add("m-lg-n1"); }
get mtLgN1() { return this.add("mt-lg-n1"); }
get myLgN1() { return this.add("my-lg-n1"); }
get mrLgN1() { return this.add("mr-lg-n1"); }
get mxLgN1() { return this.add("mx-lg-n1"); }
get mbLgN1() { return this.add("mb-lg-n1"); }
get mlLgN1() { return this.add("ml-lg-n1"); }
get mLgN2() { return this.add("m-lg-n2"); }
get mtLgN2() { return this.add("mt-lg-n2"); }
get myLgN2() { return this.add("my-lg-n2"); }
get mrLgN2() { return this.add("mr-lg-n2"); }
get mxLgN2() { return this.add("mx-lg-n2"); }
get mbLgN2() { return this.add("mb-lg-n2"); }
get mlLgN2() { return this.add("ml-lg-n2"); }
get mLgN3() { return this.add("m-lg-n3"); }
get mtLgN3() { return this.add("mt-lg-n3"); }
get myLgN3() { return this.add("my-lg-n3"); }
get mrLgN3() { return this.add("mr-lg-n3"); }
get mxLgN3() { return this.add("mx-lg-n3"); }
get mbLgN3() { return this.add("mb-lg-n3"); }
get mlLgN3() { return this.add("ml-lg-n3"); }
get mLgN4() { return this.add("m-lg-n4"); }
get mtLgN4() { return this.add("mt-lg-n4"); }
get myLgN4() { return this.add("my-lg-n4"); }
get mrLgN4() { return this.add("mr-lg-n4"); }
get mxLgN4() { return this.add("mx-lg-n4"); }
get mbLgN4() { return this.add("mb-lg-n4"); }
get mlLgN4() { return this.add("ml-lg-n4"); }
get mLgN5() { return this.add("m-lg-n5"); }
get mtLgN5() { return this.add("mt-lg-n5"); }
get myLgN5() { return this.add("my-lg-n5"); }
get mrLgN5() { return this.add("mr-lg-n5"); }
get mxLgN5() { return this.add("mx-lg-n5"); }
get mbLgN5() { return this.add("mb-lg-n5"); }
get mlLgN5() { return this.add("ml-lg-n5"); }
get mLgAuto() { return this.add("m-lg-auto"); }
get mtLgAuto() { return this.add("mt-lg-auto"); }
get myLgAuto() { return this.add("my-lg-auto"); }
get mrLgAuto() { return this.add("mr-lg-auto"); }
get mxLgAuto() { return this.add("mx-lg-auto"); }
get mbLgAuto() { return this.add("mb-lg-auto"); }
get mlLgAuto() { return this.add("ml-lg-auto"); }
get mXl_0() { return this.add("m-xl-0"); }
get mtXl_0() { return this.add("mt-xl-0"); }
get myXl_0() { return this.add("my-xl-0"); }
get mrXl_0() { return this.add("mr-xl-0"); }
get mxXl_0() { return this.add("mx-xl-0"); }
get mbXl_0() { return this.add("mb-xl-0"); }
get mlXl_0() { return this.add("ml-xl-0"); }
get mXl_1() { return this.add("m-xl-1"); }
get mtXl_1() { return this.add("mt-xl-1"); }
get myXl_1() { return this.add("my-xl-1"); }
get mrXl_1() { return this.add("mr-xl-1"); }
get mxXl_1() { return this.add("mx-xl-1"); }
get mbXl_1() { return this.add("mb-xl-1"); }
get mlXl_1() { return this.add("ml-xl-1"); }
get mXl_2() { return this.add("m-xl-2"); }
get mtXl_2() { return this.add("mt-xl-2"); }
get myXl_2() { return this.add("my-xl-2"); }
get mrXl_2() { return this.add("mr-xl-2"); }
get mxXl_2() { return this.add("mx-xl-2"); }
get mbXl_2() { return this.add("mb-xl-2"); }
get mlXl_2() { return this.add("ml-xl-2"); }
get mXl_3() { return this.add("m-xl-3"); }
get mtXl_3() { return this.add("mt-xl-3"); }
get myXl_3() { return this.add("my-xl-3"); }
get mrXl_3() { return this.add("mr-xl-3"); }
get mxXl_3() { return this.add("mx-xl-3"); }
get mbXl_3() { return this.add("mb-xl-3"); }
get mlXl_3() { return this.add("ml-xl-3"); }
get mXl_4() { return this.add("m-xl-4"); }
get mtXl_4() { return this.add("mt-xl-4"); }
get myXl_4() { return this.add("my-xl-4"); }
get mrXl_4() { return this.add("mr-xl-4"); }
get mxXl_4() { return this.add("mx-xl-4"); }
get mbXl_4() { return this.add("mb-xl-4"); }
get mlXl_4() { return this.add("ml-xl-4"); }
get mXl_5() { return this.add("m-xl-5"); }
get mtXl_5() { return this.add("mt-xl-5"); }
get myXl_5() { return this.add("my-xl-5"); }
get mrXl_5() { return this.add("mr-xl-5"); }
get mxXl_5() { return this.add("mx-xl-5"); }
get mbXl_5() { return this.add("mb-xl-5"); }
get mlXl_5() { return this.add("ml-xl-5"); }
get pXl_0() { return this.add("p-xl-0"); }
get ptXl_0() { return this.add("pt-xl-0"); }
get pyXl_0() { return this.add("py-xl-0"); }
get prXl_0() { return this.add("pr-xl-0"); }
get pxXl_0() { return this.add("px-xl-0"); }
get pbXl_0() { return this.add("pb-xl-0"); }
get plXl_0() { return this.add("pl-xl-0"); }
get pXl_1() { return this.add("p-xl-1"); }
get ptXl_1() { return this.add("pt-xl-1"); }
get pyXl_1() { return this.add("py-xl-1"); }
get prXl_1() { return this.add("pr-xl-1"); }
get pxXl_1() { return this.add("px-xl-1"); }
get pbXl_1() { return this.add("pb-xl-1"); }
get plXl_1() { return this.add("pl-xl-1"); }
get pXl_2() { return this.add("p-xl-2"); }
get ptXl_2() { return this.add("pt-xl-2"); }
get pyXl_2() { return this.add("py-xl-2"); }
get prXl_2() { return this.add("pr-xl-2"); }
get pxXl_2() { return this.add("px-xl-2"); }
get pbXl_2() { return this.add("pb-xl-2"); }
get plXl_2() { return this.add("pl-xl-2"); }
get pXl_3() { return this.add("p-xl-3"); }
get ptXl_3() { return this.add("pt-xl-3"); }
get pyXl_3() { return this.add("py-xl-3"); }
get prXl_3() { return this.add("pr-xl-3"); }
get pxXl_3() { return this.add("px-xl-3"); }
get pbXl_3() { return this.add("pb-xl-3"); }
get plXl_3() { return this.add("pl-xl-3"); }
get pXl_4() { return this.add("p-xl-4"); }
get ptXl_4() { return this.add("pt-xl-4"); }
get pyXl_4() { return this.add("py-xl-4"); }
get prXl_4() { return this.add("pr-xl-4"); }
get pxXl_4() { return this.add("px-xl-4"); }
get pbXl_4() { return this.add("pb-xl-4"); }
get plXl_4() { return this.add("pl-xl-4"); }
get pXl_5() { return this.add("p-xl-5"); }
get ptXl_5() { return this.add("pt-xl-5"); }
get pyXl_5() { return this.add("py-xl-5"); }
get prXl_5() { return this.add("pr-xl-5"); }
get pxXl_5() { return this.add("px-xl-5"); }
get pbXl_5() { return this.add("pb-xl-5"); }
get plXl_5() { return this.add("pl-xl-5"); }
get mXlN1() { return this.add("m-xl-n1"); }
get mtXlN1() { return this.add("mt-xl-n1"); }
get myXlN1() { return this.add("my-xl-n1"); }
get mrXlN1() { return this.add("mr-xl-n1"); }
get mxXlN1() { return this.add("mx-xl-n1"); }
get mbXlN1() { return this.add("mb-xl-n1"); }
get mlXlN1() { return this.add("ml-xl-n1"); }
get mXlN2() { return this.add("m-xl-n2"); }
get mtXlN2() { return this.add("mt-xl-n2"); }
get myXlN2() { return this.add("my-xl-n2"); }
get mrXlN2() { return this.add("mr-xl-n2"); }
get mxXlN2() { return this.add("mx-xl-n2"); }
get mbXlN2() { return this.add("mb-xl-n2"); }
get mlXlN2() { return this.add("ml-xl-n2"); }
get mXlN3() { return this.add("m-xl-n3"); }
get mtXlN3() { return this.add("mt-xl-n3"); }
get myXlN3() { return this.add("my-xl-n3"); }
get mrXlN3() { return this.add("mr-xl-n3"); }
get mxXlN3() { return this.add("mx-xl-n3"); }
get mbXlN3() { return this.add("mb-xl-n3"); }
get mlXlN3() { return this.add("ml-xl-n3"); }
get mXlN4() { return this.add("m-xl-n4"); }
get mtXlN4() { return this.add("mt-xl-n4"); }
get myXlN4() { return this.add("my-xl-n4"); }
get mrXlN4() { return this.add("mr-xl-n4"); }
get mxXlN4() { return this.add("mx-xl-n4"); }
get mbXlN4() { return this.add("mb-xl-n4"); }
get mlXlN4() { return this.add("ml-xl-n4"); }
get mXlN5() { return this.add("m-xl-n5"); }
get mtXlN5() { return this.add("mt-xl-n5"); }
get myXlN5() { return this.add("my-xl-n5"); }
get mrXlN5() { return this.add("mr-xl-n5"); }
get mxXlN5() { return this.add("mx-xl-n5"); }
get mbXlN5() { return this.add("mb-xl-n5"); }
get mlXlN5() { return this.add("ml-xl-n5"); }
get mXlAuto() { return this.add("m-xl-auto"); }
get mtXlAuto() { return this.add("mt-xl-auto"); }
get myXlAuto() { return this.add("my-xl-auto"); }
get mrXlAuto() { return this.add("mr-xl-auto"); }
get mxXlAuto() { return this.add("mx-xl-auto"); }
get mbXlAuto() { return this.add("mb-xl-auto"); }
get mlXlAuto() { return this.add("ml-xl-auto"); }
get textMonospace() { return this.add("text-monospace"); }
get textJustify() { return this.add("text-justify"); }
get textWrap() { return this.add("text-wrap"); }
get textNowrap() { return this.add("text-nowrap"); }
get textTruncate() { return this.add("text-truncate"); }
get textLeft() { return this.add("text-left"); }
get textRight() { return this.add("text-right"); }
get textCenter() { return this.add("text-center"); }
get textSmLeft() { return this.add("text-sm-left"); }
get textSmRight() { return this.add("text-sm-right"); }
get textSmCenter() { return this.add("text-sm-center"); }
get textMdLeft() { return this.add("text-md-left"); }
get textMdRight() { return this.add("text-md-right"); }
get textMdCenter() { return this.add("text-md-center"); }
get textLgLeft() { return this.add("text-lg-left"); }
get textLgRight() { return this.add("text-lg-right"); }
get textLgCenter() { return this.add("text-lg-center"); }
get textXlLeft() { return this.add("text-xl-left"); }
get textXlRight() { return this.add("text-xl-right"); }
get textXlCenter() { return this.add("text-xl-center"); }
get textLowercase() { return this.add("text-lowercase"); }
get textUppercase() { return this.add("text-uppercase"); }
get textCapitalize() { return this.add("text-capitalize"); }
get fontWeightLight() { return this.add("font-weight-light"); }
get fontWeightLighter() { return this.add("font-weight-lighter"); }
get fontWeightNormal() { return this.add("font-weight-normal"); }
get fontWeightBold() { return this.add("font-weight-bold"); }
get fontWeightBolder() { return this.add("font-weight-bolder"); }
get fontItalic() { return this.add("font-italic"); }
get textWhite() { return this.add("text-white"); }
get textPrimary() { return this.add("text-primary"); }
get textSecondary() { return this.add("text-secondary"); }
get textSuccess() { return this.add("text-success"); }
get textInfo() { return this.add("text-info"); }
get textWarning() { return this.add("text-warning"); }
get textDanger() { return this.add("text-danger"); }
get textLight() { return this.add("text-light"); }
get textDark() { return this.add("text-dark"); }
get textBody() { return this.add("text-body"); }
get textMuted() { return this.add("text-muted"); }
get textBlack_50() { return this.add("text-black-50"); }
get textWhite_50() { return this.add("text-white-50"); }
get textHide() { return this.add("text-hide"); }
get textDecorationNone() { return this.add("text-decoration-none"); }
get textBreak() { return this.add("text-break"); }
get textReset() { return this.add("text-reset"); }
get visible() { return this.add("visible"); }
get invisible() { return this.add("invisible"); }
get alertAlertPrimary() { return this.add("alert alert-primary"); }
get alertAlertSuccess() { return this.add("alert alert-success"); }
get alertAlertDanger() { return this.add("alert alert-danger"); }
get alertAlertInfo() { return this.add("alert alert-info"); }
get alertAlertWarning() { return this.add("alert alert-warning"); }
get btnBtnLink() { return this.add("btn btn-link"); }
get btnBtnLinkBtnEditable() { return this.add("btn btn-link btn-editable"); }
get btnBtnOutlinePrimary() { return this.add("btn btn-outline-primary"); }
get btnBtnIcon() { return this.add("btn btn-icon"); }
get btnBtnIconBtnSm() { return this.add("btn btn-icon btn-sm"); }
get btnBtnIconBtnLg() { return this.add("btn btn-icon btn-lg"); }
get btnBtnSm() { return this.add("btn btn-sm"); }
get btnBtnLg() { return this.add("btn btn-lg"); }
get btnLgBtnIcon() { return this.add("btn-lg btn-icon"); }
get btnSmBtnIcon() { return this.add("btn-sm btn-icon"); }
get gkGeoThumbnailNoIcon() { return this.add("gk-geo-thumbnail no-icon"); }
get customControlCustomRadio() { return this.add("custom-control custom-radio"); }
get customControlCustomCheckbox() { return this.add("custom-control custom-checkbox"); }
get formControlMinInlineFormControl() { return this.add("form-control-min-inline form-control"); }
get heroContainer() { return this.add("hero-container"); }
get heroContainerCard() { return this.add("hero-container card"); }
get heroContainerHeroSmText() { return this.add("hero-container hero-sm-text"); }
get heroContainerCardHeroSmText() { return this.add("hero-container card hero-sm-text"); }
get h5ModalTitle() { return this.add("h5 modal-title"); }
get tableStriped() { return this.add("table-striped"); }
get tableWhiteBg() { return this.add("table-white-bg"); }
get navTabsFlexColumn() { return this.add("nav-tabs flex-column"); }
get gkInputGroup() { return this.add("gk-input-group"); }
get gi() { return this.add("gi"); }
get gil() { return this.add("gil"); }
get cursorAuto() { return this.add("cursor-auto"); }
get cursorDefault() { return this.add("cursor-default"); }
get cursorNotAllowed() { return this.add("cursor-not-allowed"); }
get cursorPointer() { return this.add("cursor-pointer"); }
get dContents() { return this.add("d-contents"); }


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

  public beforeClick(handler: <T>(e: React.MouseEvent<T>) => void) {
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

export function $formOnSubmit(fn: (e?: React.FormEvent<any>) => void) {
  return $$('form').injectProps({
    onSubmit: (e) => {
      e.preventDefault()
      fn(e)
    },
  })
}
export const $ = $$()

