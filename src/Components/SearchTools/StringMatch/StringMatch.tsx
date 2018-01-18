import * as React from "react";
import * as PropTypes from "prop-types";

import { Condition, CriteriaTableContextTypes, CriteriaTableContext } from "../../CriteriaTable";
import {
    SearchToolRequiredProps,
    SearchToolRequiredPropTypes,
    SearchToolRequiredDefaultProps
} from "../SearchToolRequiredProps";

export interface StringMatchState {
    searchValue: string;
}

export class StringMatch extends React.Component<SearchToolRequiredProps, StringMatchState> {
    public static readonly propTypes = SearchToolRequiredPropTypes;
    public static readonly contextTypes = CriteriaTableContextTypes;
    public static readonly defaultProps = SearchToolRequiredDefaultProps;

    public readonly context: CriteriaTableContext;

    constructor(props) {
        super(props);

        this.state = {
            searchValue: ""
        };
    }

    public render(): JSX.Element {
        return (
            <input
                className="control control-from"
                value={this.state.searchValue}
                onChange={this.handleChange}
                type="text"
            />
        )
    }

    protected handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        Object.assign(this.state, { searchValue: event.currentTarget.value })
        this.forceUpdate();

        this.context.setQueries(this.handleCreateQueries());
        this.props.onFecth();
    }

    private handleCreateQueries = (): Array<Condition> => ([
        this.state.searchValue ? ["like", this.props.columnId, this.state.searchValue] : [] as Condition
    ]);
}
