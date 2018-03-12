import * as React from "react";
import { StringMatch } from "./StringMatch";
import { Condition } from "../../CriteriaTable";

export class StringMultipleMatch extends StringMatch {
    protected handleCreateQueries = (): Array<Condition> => (
        this.state.searchValue
            ? this.state.searchValue
                .toString()
                .toLowerCase()
                .split(" ")
                .map((value): Condition => ["like", this.props.columnId, value])
            : [["like", this.props.columnId, ""]]
    );
}
