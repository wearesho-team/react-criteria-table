import * as React from "react";

import { Condition } from "../../CriteriaTable";
import {BaseMatch, BaseMatchState} from "../BaseMatch";

export class StringMatch extends BaseMatch {
    public state: BaseMatchState = {
        searchValue: ""
    };

    public render(): JSX.Element {
        return (
            <input
                placeholder={this.props.defaultLabel}
                className="control control-from"
                value={this.state.searchValue}
                onChange={this.handleChange}
                type="text"
            />
        )
    }

    protected handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        Object.assign(this.state, { searchValue: event.currentTarget.value });
        this.forceUpdate();

        this.context.setQueries(this.handleCreateQueries());
        this.props.onFetch();
    }

    protected handleCreateQueries = (): Array<Condition> => ([
        ["like", this.props.columnId, this.state.searchValue || ""]
    ]);
}
