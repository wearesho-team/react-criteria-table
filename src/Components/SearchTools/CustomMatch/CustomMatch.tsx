import * as React from "react";
import * as PropTypes from "prop-types";

import { CustomMatchPropTypes, CustomMatchProps } from "./CustomMatchProps";
import { SearchToolRequiredDefaultProps } from "../SearchToolRequiredProps";
import { Condition, CriteriaTableContextTypes, CriteriaTableContext } from "../../CriteriaTable";

export interface CustomMatchState {
    searchValue: string | number;
}

export class CustomMatch extends React.Component<CustomMatchProps, CustomMatchState> {
    public static readonly propTypes = CustomMatchPropTypes;
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
        return this.props.element({ onChange: this.handleChange, value: this.state.searchValue });
    }

    protected handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        Object.assign(this.state, { searchValue: event.currentTarget.value })
        this.forceUpdate();

        this.context.setQueries(this.handleCreateQueries());
        this.props.onFetch();
    }

    private handleCreateQueries = (): Array<Condition> => ([
        this.state.searchValue
            ? [this.props.isStrict ? "=" : "like", this.props.columnId, this.state.searchValue]
            : [] as Condition
    ]);
}
