import * as React from "react";

import { BaseControl } from "./BaseControl";
import { ControlActions } from "../CriteriaTable";

export class ResetQueries extends BaseControl {
    public get controlAction() {
        return this.context.getControlAction(this.props.tableId, ControlActions.resetQueries);
    };
}
