import * as React from "react";
import * as PropTypes from "prop-types";

import { ToolTip } from "../ToolTip"
import { Condition } from "../../CriteriaTable";
import { SearchToolRequiredDefaultProps } from "../SearchToolRequiredProps";
import { CustomRangeProps, CustomRangePropTypes } from "./CustomRangeProps";

export interface CustomRangeState {
    from?: string | number;
    to?: string | number;
    label: string;
}

export class CustomRange extends React.Component<CustomRangeProps, CustomRangeState> {
    public static readonly propTypes = CustomRangePropTypes;
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
                createQueries={this.handleCreateQueries}
                displayedValue={this.state.label}
                onFetch={this.props.onFecth}
            >
                <div className="search search-number-range">
                    <span className="label label-from">от</span>
                    {this.props.fromElement({onChange: this.handleChange("from"), value: this.state.from})}
                    <span className="label label-to">до</span>
                    {this.props.fromElement({onChange: this.handleChange("to"), value: this.state.to})}
                    <div className="align-container">
                        <button className="btn btn-clear" type="button" onClick={this.handleClear}>
                            Очистить
                        </button>
                    </div>
                </div>
            </ToolTip>
        )
    }

    protected handleChange = (field: any) => (event: React.ChangeEvent<HTMLInputElement>): void => {
        Object.assign(this.state, { [field]: event.currentTarget.value })
        this.forceUpdate();

        let label = "";
        if (this.state.from) {
            label += `от ${this.state.from}`;
        }

        if (this.state.to) {
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
        this.state.from ? [">=", this.props.columnId, this.state.from] : [] as Condition,
        this.state.to ? ["<=", this.props.columnId, this.state.to] : [] as Condition
    ]);
}
