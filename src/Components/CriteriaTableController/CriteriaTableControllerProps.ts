import * as PropTypes from "prop-types";

export interface CriteriaTableControllerProps {
    onError?: (error: any) => void;
    children: JSX.Element;
}

export const CriteriaTableControllerPropTypes: {[P in keyof CriteriaTableControllerProps]: PropTypes.Validator<any>} = {
    children: PropTypes.element.isRequired,
    onError: PropTypes.func
};
