import * as PropTypes from "prop-types";

import {
    SearchToolRequiredProps,
    SearchToolRequiredPropTypes
} from "../SearchToolRequiredProps";

import { PassingProps } from "../PassingProps"

export interface CustomMatchProps extends SearchToolRequiredProps {
    element: (PassingProps) => JSX.Element;
    isStrict?: boolean;
}

export const CustomMatchPropTypes: {[P in keyof CustomMatchProps]: PropTypes.Validator<any>} = {
    ...SearchToolRequiredPropTypes,
    isStrict: PropTypes.bool,
    element: PropTypes.func.isRequired
};
