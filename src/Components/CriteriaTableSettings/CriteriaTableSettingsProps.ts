import * as PropTypes from "prop-types";

export interface CriteriaTableSettingsProps {
    activeTableKey: string;
}

export const CriteriaTableSettingsPropTypes: {[P in keyof CriteriaTableSettingsProps]: PropTypes.Validator<any>} = {
    activeTableKey: PropTypes.string.isRequired
};
