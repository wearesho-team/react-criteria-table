import * as PropTypes from "prop-types";

export interface CriteriaTableControllerProps {
    onError?: (error: any) => void;
}

export const CriteriaTableControllerPropTypes: {[P in keyof CriteriaTableControllerProps]: PropTypes.Validator<any>} = {
    onError: PropTypes.func
};
