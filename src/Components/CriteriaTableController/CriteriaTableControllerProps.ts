import * as PropTypes from "prop-types";

export interface CriteriaTableControllerProps {
    onError?: (error: any) => void;
    enableCaching?: boolean;
}

export const CriteriaTableControllerPropTypes: {[P in keyof CriteriaTableControllerProps]: PropTypes.Validator<any>} = {
    onError: PropTypes.func,
    enableCaching: PropTypes.bool,
};

export const CriteriaTableControllerDefaultProps: {
    [P in keyof CriteriaTableControllerProps]?: CriteriaTableControllerProps[P]
} = {
    enableCaching: true,
};
