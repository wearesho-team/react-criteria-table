import * as React from "react";
import * as PropTypes from "prop-types";

import { CustomMatchPropTypes, CustomMatchProps } from "./CustomMatchProps";
import { Condition } from "../../CriteriaTable";
import { BaseMatch } from "../BaseMatch"

export interface CustomMatchState {
    searchValue: string | number;
}

export class CustomMatch extends BaseMatch<CustomMatchProps> {
    public static readonly propTypes = CustomMatchPropTypes;

    constructor(props) {
        super(props);

        this.state = {
            searchValue: ""
        };
    }

    public render(): JSX.Element {
        return this.props.element({ onChange: this.handleChange, value: this.state.searchValue });
    }

    protected handleCreateQueries = (): Array<Condition> => ([
        [
            this.props.isStrict ? "=" : "like",
            this.props.columnId,
            this.state.searchValue !== undefined ? this.state.searchValue : ""
        ]
    ]);
}
