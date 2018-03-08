import * as React from "react";

import { CriteriaTableControllerContext, CriteriaTableControllerContextTypes } from "../CriteriaTableController"

export class ResetQueries extends React.Component<React.HTMLProps<HTMLButtonElement>> {
    public static readonly contextTypes = CriteriaTableControllerContextTypes;

    public readonly context: CriteriaTableControllerContext;

    public render(): React.ReactNode {
        return (
            <button
                type="button"
                onClick={this.handleClick}
                {...this.props}
            >
                {this.props.children}
            </button>
        );
    }

    protected handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        this.props.onClick && this.props.onClick(event);

        if (!event.defaultPrevented) {
            this.context.resetQueries && this.context.resetQueries();
        }
    }
};
