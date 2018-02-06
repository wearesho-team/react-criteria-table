import * as React from "react";
import * as PropTypes from "prop-types";
import { DragDropContext } from "react-dnd";
import { default as TouchBackend } from "react-dnd-touch-backend";

import { CriteriaTableControllerContextTypes, CriteriaTableControllerContext } from "../CriteriaTableController";
import { CriteriaTableSettingsProps, CriteriaTableSettingsPropTypes } from "./CriteriaTableSettingsProps";
import { SettingsTreeView } from "../SettingsTree";

// @DragDropContext(TouchBackend({ enableMouseEvents: true }))
export class CriteriaTableSettings extends React.Component<CriteriaTableSettingsProps> {
    public static readonly contextTypes = CriteriaTableControllerContextTypes;
    public static readonly propTypes = CriteriaTableSettingsPropTypes;

    public readonly context: CriteriaTableControllerContext;

    public render(): JSX.Element {
        const SettingsChildList = this.context.getCurrentData(this.props.activeTableKey);

        if (!SettingsChildList) {
            return null;
        }

        return <SettingsTreeView childList={SettingsChildList} {...this.props} />
    }
}
