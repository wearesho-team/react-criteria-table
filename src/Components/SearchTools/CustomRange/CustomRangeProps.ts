import * as PropTypes from "prop-types";

import {
    SearchToolRequiredProps,
    SearchToolRequiredPropTypes
} from "../SearchToolRequiredProps";

import { PassingProps } from "../PassingProps"

export interface CustomRangeProps extends SearchToolRequiredProps {
    fromElement: (PassingProps) => JSX.Element;
    toElement: (PassingProps) => JSX.Element;
}

export const CustomRangePropTypes: {[P in keyof CustomRangeProps]: PropTypes.Validator<any>} = {
    ...SearchToolRequiredPropTypes,
    fromElement: PropTypes.func.isRequired,
    toElement: PropTypes.func.isRequired
};
