import * as PropTypes from "prop-types";

import { Condition } from "../../CriteriaTable";

export interface ToolTipProps {
    createQueries: () => Array<Condition>;
    displayedValue: string;
    onFetch: () => void;
    onClear?: () => void;
}

export const ToolTipPropTypes: {[P in keyof ToolTipProps]: PropTypes.Validator<any>} = {
    displayedValue: PropTypes.string.isRequired,
    createQueries: PropTypes.func.isRequired,
    onFetch: PropTypes.func.isRequired,
    onClear: PropTypes.func
};
