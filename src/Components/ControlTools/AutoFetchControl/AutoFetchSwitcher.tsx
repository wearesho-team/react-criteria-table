import * as React from "react";

import { BaseControl, BaseControlProps } from "../BaseControl";
import { CriteriaTable, ControlActions } from "../../CriteriaTable";

export interface AutoFetchSwitcherState {
    enabled: boolean
}

export class AutoFetchSwitcher extends BaseControl<BaseControlProps, AutoFetchSwitcherState> {
    public readonly state: AutoFetchSwitcherState = {
        enabled: CriteriaTable.AutoFetchDefaultParams.autoFetch,
    };

    public get controlAction(): ((state: boolean) => void) {
        return this.context.getControlAction(this.props.tableId, ControlActions.setAutoFetchState)
    }

    public componentDidMount() {
        const getDefaults: () => AutoFetchSwitcherState
            = this.context.getControlAction(this.props.tableId, ControlActions.getAutoFetchParams);
        if (getDefaults) {
            const defaults = getDefaults();
            defaults && this.setState({
                enabled: defaults.enabled
            });
        }
    }

    public render(): React.ReactNode {
        const { tableId, ...checkboxProps } = this.props;

        return (
            <input
                type="checkbox"
                {...checkboxProps}
                checked={!this.state.enabled}
                onClick={this.handleCheckboxClick}
                readOnly
            />
        );
    }

    protected handleCheckboxClick = (event: React.MouseEvent<HTMLInputElement>): void => {
        this.props.onClick && this.props.onClick(event);

        event.persist();
        this.setState(({ enabled }) => ({
            enabled: !enabled
        }), () => {
            if (!event.defaultPrevented && this.controlAction) {
                this.controlAction(this.state.enabled);
            }
        });
    }
}
