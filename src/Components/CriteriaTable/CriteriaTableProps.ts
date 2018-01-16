import * as PropTypes from "prop-types";

import { CriteriaTableState, FetchState } from "./CriteriaTable";
import { IdentifiableTableColumn } from "../TableColumn";

export interface CriteriaTableProps {
    onDefaults: (state: CriteriaTableState) => () => Array<IdentifiableTableColumn>;
    onFetchData: (state: FetchState) => Promise<CriteriaTableState>;
    cacheKey: string;
}

export const CriteriaTablePropTypes: {[P in keyof CriteriaTableProps]: PropTypes.Validator<any>} = {
    onFetchData: PropTypes.func.isRequired,
    onDefaults: PropTypes.func.isRequired,
    cacheKey: PropTypes.string.isRequired
};
