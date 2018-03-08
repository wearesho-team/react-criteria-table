import * as PropTypes from "prop-types";

export type ConditionType = "=" | "<>" | ">" | "<" | "!=" | ">=" | "<=" | "like" | "in";
export type Condition = [ConditionType, string, string | number | boolean];

export interface CriteriaTableContext {
    setQueries: (queries: Array<Condition>) => void;
    getQueries: () => Array<Condition>;
    queriesList: Array<Condition>;
}

export const CriteriaTableContextTypes: {[P in keyof CriteriaTableContext]: PropTypes.Validator<any>} = {
    setQueries: PropTypes.func.isRequired,
    getQueries: PropTypes.func.isRequired,
    queriesList: PropTypes.array.isRequired
};
