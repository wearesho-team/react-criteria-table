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
                {this.props.onClear && <i className="fa fa-times-circle" onClick={this.handleClear}/>}
                <this.renderForm />
            </React.Fragment>
        )
    }

    protected renderForm: React.SFC<undefined> = (): JSX.Element => {
        if (!this.state.isOpen) {
            return null;
        }

        return (
            <React.Fragment>
                {this.props.children}
                <button className="btn btn-outline-secondary" type="button" onClick={this.handleClose}>
                    Найти
                </button>
            </React.Fragment>
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

    protected handleClear = () => {
        this.setState({ isOpen: false });
        this.props.onClear();
        this.context.setQueries([]);
        this.props.onFetch();
    }
}
