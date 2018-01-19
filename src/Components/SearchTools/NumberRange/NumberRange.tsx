import * as React from "react";
import * as PropTypes from "prop-types";

import { ToolTip } from "../ToolTip"
import { Condition } from "../../CriteriaTable";
import {
    SearchToolRequiredProps,
    SearchToolRequiredPropTypes,
    SearchToolRequiredDefaultProps
} from "../SearchToolRequiredProps";

export interface NumberRangeState {
    label: string;
    from?: number;
    to?: number;
}

export class NumberRange extends React.Component<SearchToolRequiredProps, NumberRangeState> {
    public static readonly propTypes = SearchToolRequiredPropTypes;
    public static readonly defaultProps = SearchToolRequiredDefaultProps;

    constructor(props) {
        super(props);

        this.state = {
            label: this.props.defaultLabel
        }
    }

    public render(): JSX.Element {
        return (
            <ToolTip
                onClear={this.state.label !== this.props.defaultLabel ? this.handleClear : undefined}
                createQueries={this.handleCreateQueries}
                displayedValue={this.state.label}
                onFetch={this.props.onFetch}
            >
                <div className="search search-number-range">
                    <span className="label label-from">от</span>
                    <input
                        className="control control-from"
                        onChange={this.handleChange("from")}
                        value={this.state.from || ""}
                        type="number"
                    />
                    <span className="label label-to">до</span>
                    <input
                        className="control control-to"
                        onChange={this.handleChange("to")}
                        value={this.state.to || ""}
                        type="number"
                    />
                </div>
            </ToolTip>
        )
    }

    protected handleChange = (field: any) => (event: React.ChangeEvent<HTMLInputElement>): void => {
        Object.assign(this.state, { [field]: event.currentTarget.value })
        this.forceUpdate();

        let label = "";
        if (this.state.from !== undefined) {
            label += `от ${this.state.from}`;
        }

        if (this.state.to !== undefined) {
            label += ` до ${this.state.to}`;
        }

        if (!label.length) {
            label = this.props.defaultLabel;
        }

        this.setState({ label });
    }

    protected handleClear = () => {
        this.setState({
            label: this.props.defaultLabel,
            from: undefined,
            to: undefined
        });
    }

    private handleCreateQueries = (): Array<Condition> => ([
        this.state.from !== undefined ? [">=", this.props.columnId, this.state.from] : [] as Condition,
        this.state.to !== undefined ? ["<=", this.props.columnId, this.state.to] : [] as Condition
    ]);

}
