import * as React from "react";
import * as PropTypes from "prop-types";

import {
    SearchToolRequiredDefaultProps,
    SearchToolRequiredPropTypes,
    SearchToolRequiredProps
} from "./SearchToolRequiredProps";
import { Condition, CriteriaTableContextTypes, CriteriaTableContext } from "../CriteriaTable";

export interface BaseMatchState {
    searchValue?: number | string;
}

export class BaseMatch
    <
    ChildProps extends SearchToolRequiredProps = SearchToolRequiredProps,
    ChildState extends BaseMatchState = BaseMatchState
    >
    extends React.Component<ChildProps, ChildState> {

    public static readonly propTypes = SearchToolRequiredPropTypes;
    public static readonly contextTypes = CriteriaTableContextTypes;
    public static readonly defaultProps = SearchToolRequiredDefaultProps;

    public readonly context: CriteriaTableContext;

    constructor(props) {
        super(props);

        this.state = {
            searchValue: undefined
        } as ChildState;
    }

    protected handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        Object.assign(this.state, { searchValue: event.currentTarget.value })
        this.forceUpdate();

        this.context.setQueries(this.handleCreateQueries());
        this.props.onFetch();
    }

    protected handleCreateQueries = (): Array<Condition> => ([
        this.state.searchValue !== undefined && this.state.searchValue.toString().length
            ? ["=", this.props.columnId, this.state.searchValue]
            : [] as Condition
    ]);

}
