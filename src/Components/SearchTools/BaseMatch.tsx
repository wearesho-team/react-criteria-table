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
    public state: ChildState = {
        searchValue: undefined
    } as ChildState;

    public componentWillMount() {
        const matchQuery = this.context.getQueries().find((condition) => condition[1] === this.props.columnId);
        matchQuery && (this.state.searchValue = matchQuery[2] as string);
    }

    public componentWillUpdate(nextProps, nextState, nextContext: CriteriaTableContext) {
        if (!nextContext.queriesList.length && this.state.searchValue) {
            this.setState({
                searchValue: ""
            }, () => {
                this.props.onFetch();
            });
        }
    }

    protected handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        this.state.searchValue = event.currentTarget.value;
        this.forceUpdate();

        this.context.setQueries(this.handleCreateQueries());
        this.props.onFetch();
    }

    protected handleCreateQueries = (): Array<Condition> => ([
        ["=", this.props.columnId, this.state.searchValue || ""]
    ]);

}
