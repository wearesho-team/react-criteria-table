import * as React from "react";
import * as PropTypes from "prop-types";

import { ToolTipProps, ToolTipPropTypes } from "./ToolTipProps";
import { CriteriaTableContextTypes, CriteriaTableContext } from "../../CriteriaTable";

export interface ToolTipState {
    isOpen: boolean;
}

export class ToolTip extends React.Component<ToolTipProps, ToolTipState> {
    public static readonly propTypes = ToolTipPropTypes
    public static readonly contextTypes = CriteriaTableContextTypes;

    public readonly context: CriteriaTableContext;

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        };
    }

    public render(): JSX.Element {
        return (
            <React.Fragment>
                <span onClick={this.handleOpen} className="search search-value">
                    {this.props.displayedValue}
                </span>
                <this.renderForm/>
            </React.Fragment>
        )
    }

    protected renderForm: React.SFC<undefined> = (): JSX.Element => {
        if (!this.state.isOpen) {
            return null;
        }

        return (
            <div className="tooltip table-tooltip">
                {this.props.children}
                <button className="btn btn-search" type="button" onClick={this.handleClose}>
                    Найти
                </button>
            </div>
        )
    }

    protected handleOpen = (): void => !this.state.isOpen && this.setState({ isOpen: true });

    protected handleClose = (): void => {
        if (!this.state.isOpen) {
            return;
        }

        this.setState({ isOpen: false });

        this.context.setQueries(this.props.createQueries());
        this.props.onFetch();
    }
}
