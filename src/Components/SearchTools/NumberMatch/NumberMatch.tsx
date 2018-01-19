import * as React from "react";
import * as PropTypes from "prop-types";

import { BaseMatch } from "../BaseMatch"

export class NumberMatch extends BaseMatch {
    public render(): JSX.Element {
        return (
            <input
                type="number"
                onChange={this.handleChange}
                placeholder={this.props.defaultLabel}
                value={this.state.searchValue !== undefined ? this.state.searchValue : ""}
            />
        );
    }
}
