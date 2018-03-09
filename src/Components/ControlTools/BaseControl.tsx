import * as React from "react";
import * as PropTypes from "prop-types";

import { CriteriaTableControllerContext, CriteriaTableControllerContextTypes } from "../CriteriaTableController"

export interface BaseControlProps extends React.HTMLProps<HTMLElement> {
    tableId: string;
}

export const BaseControlPropTypes: {[P in keyof BaseControlProps]: PropTypes.Validator<any>} = {
    tableId: PropTypes.string.isRequired
};

export class BaseControl<
    TProps extends BaseControlProps = BaseControlProps,
    TState = {}
    > extends React.Component<TProps, TState> {
    public static readonly propTypes = BaseControlPropTypes;
    public static readonly contextTypes = CriteriaTableControllerContextTypes;

    public readonly context: CriteriaTableControllerContext;

    public get controlAction() {
        return undefined;
    }

    public render(): React.ReactNode {
        const { tableId, ...buttonProps } = this.props as BaseControlProps;

        return (
            <button
                type="button"
                onClick={this.handleClick}
                {...buttonProps}
            >
                {this.props.children}
            </button>
        );
    }

    protected handleClick = (event: React.MouseEvent<HTMLElement>): void => {
        this.props.onClick && this.props.onClick(event);

        if (!event.defaultPrevented && this.controlAction) {
            this.controlAction();
        }
    }
}
