import * as React from "react";
import * as PropTypes from "prop-types";

import { ToolTip } from "../ToolTip"
import { BaseRange } from "../BaseRange";

export class NumberRange extends BaseRange {
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
}
