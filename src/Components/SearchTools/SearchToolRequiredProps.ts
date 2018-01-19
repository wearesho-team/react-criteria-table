import * as PropTypes from "prop-types";

export interface SearchToolRequiredProps {
    defaultLabel?: string;
    onFetch: () => void;
    columnId: string;
}

export const SearchToolRequiredPropTypes: {[P in keyof SearchToolRequiredProps]: PropTypes.Validator<any>} = {
    columnId: PropTypes.string.isRequired,
    onFetch: PropTypes.func.isRequired,
    defaultLabel: PropTypes.string
};

export const SearchToolRequiredDefaultProps: {[P in keyof SearchToolRequiredProps]?: SearchToolRequiredProps[P]} = {
    defaultLabel: "Найти"
};
