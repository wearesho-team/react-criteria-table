import * as React from "react";

import { BaseControl, BaseControlProps } from "../BaseControl";
import { ControlActions, CriteriaTable } from "../../CriteriaTable";

export interface AutoFetchDelayState {
    delay: number;
}

export class AutoFetchDelay extends BaseControl<BaseControlProps, AutoFetchDelayState> {
    public readonly state: AutoFetchDelayState = {
        delay: CriteriaTable.AutoFetchDefaultParams.autoFetchDelay,
    };

    public get controlAction(): ((delay: number) => void) {
        return this.context.getControlAction(this.props.tableId, ControlActions.setAutoFetchDelay)
    }

    public componentDidMount() {
        const getDefaults: () => AutoFetchDelayState
            = this.context.getControlAction(this.props.tableId, ControlActions.getAutoFetchParams);
        if (getDefaults) {
            const defaults = getDefaults();
            defaults && this.setState({
                delay: defaults.delay / 1000
            });
        }
    }

    public render(): React.ReactNode {
        const { tableId, ...inputProps } = this.props;

        return (
            <input
                type="tel"
                {...inputProps}
                value={this.state.delay}
                onChange={this.handleInputChange}
                onBlur={this.handleInputBlur}
            />
        );
    }

    protected handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        this.props.onChange && this.props.onChange(event);

        const delay = Number(event.currentTarget.value);
        if (isNaN(delay) || delay === this.state.delay) {
            return;
        }

        this.setState({ delay });
    }

    protected handleInputBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
        this.props.onBlur && this.props.onBlur(event);

        let delay = Number(event.currentTarget.value);
        if (delay < 60) {
            delay = 60;
        }

        if (!event.defaultPrevented && this.controlAction) {
            this.controlAction(delay * 1000);
        }

        this.setState({ delay });
    }
}
