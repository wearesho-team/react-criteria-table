import * as React from "react";
import * as PropTypes from "prop-types";

import { ToolTip } from "../ToolTip"
import { BaseRange } from "../BaseRange";
import { CustomRangeProps, CustomRangePropTypes } from "./CustomRangeProps";

export class CustomRange extends BaseRange<CustomRangeProps> {
    public static readonly propTypes = CustomRangePropTypes;

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
                    {this.props.fromElement({ onChange: this.handleChange("from"), value: this.state.from })}
                    <span className="label label-to">до</span>
                    {this.props.fromElement({ onChange: this.handleChange("to"), value: this.state.to })}
                </div>
            </ToolTip>
        )
    }
}
