import * as React from "react";
import * as PropTypes from "prop-types";
import * as ReactDOM from "react-dom";

import { ToolTipProps, ToolTipPropTypes } from "./ToolTipProps";
import { CriteriaTableContextTypes, CriteriaTableContext } from "../../CriteriaTable";

export interface ToolTipState {
    isOpen: boolean;
}

export class ToolTip extends React.Component<ToolTipProps, ToolTipState> {
    public static readonly propTypes = ToolTipPropTypes
    public static readonly contextTypes = CriteriaTableContextTypes;

    public readonly context: CriteriaTableContext;
    public readonly id = Date.now().toString() + Math.random().toString();

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        };
    }

    public componentDidMount() {
        window.addEventListener("click", this.handleClose as any);
    }

    public componentWillUnmount() {
        window.removeEventListener("click", this.handleClose as any);
    }

    public render(): JSX.Element {
        return (
            <React.Fragment>
                <span onClick={this.handleOpen} className="search search-value" id={this.id}>
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
            <div className="tooltip table-tooltip" onClick={this.handleStopPropagation}>
                {this.props.children}
                <button className="btn btn-outline-secondary" type="button" onClick={this.handleFetch}>
                    Найти
                </button>
            </div>
        )
    }

    protected handleStopPropagation = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
    }

    protected handleOpen = (): void => {
        !this.state.isOpen && this.setState({ isOpen: true })
    };

    protected handleClose = (event?: React.MouseEvent<HTMLElement>) => {
        if (event && (event.target as HTMLElement).id === this.id) {
            return;
        }

        this.setState({ isOpen: false });
    }

    protected handleFetch = (): void => {
        this.handleClose();

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
