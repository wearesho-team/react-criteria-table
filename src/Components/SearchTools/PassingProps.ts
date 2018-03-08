import * as React from "react";
import * as PropTypes from "prop-types";

export interface PassingProps {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    value: string | number
}

export const PassingPropsPropTypes: {[P in keyof PassingProps]: PropTypes.Validator<any>} = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]).isRequired
};
