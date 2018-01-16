import * as React from "react";
import classNames from "classnames";
import * as PropTypes from "prop-types";

import { SettingsTreeViewProps, SettingsTreeViewPropTypes, SettingsTreeViewDefaultProps } from "./SettingsTreeViewProps";
import { CriteriaTableControllerContextTypes, CriteriaTableControllerContext } from "../../CriteriaTableController";
import { TableColumnRepository, TableColumn } from "../../TableColumn";
import { SettingsTreeItem } from "../SettingsTreeItem";

export class SettingsTreeView extends React.Component<SettingsTreeViewProps> {
    public static readonly propTypes = SettingsTreeViewPropTypes;
    public static readonly defaultProps = SettingsTreeViewDefaultProps;
    public static readonly contextTypes = CriteriaTableControllerContextTypes;

    public readonly context: CriteriaTableControllerContext;

    private childId = Date.now().toString();

    public render(): JSX.Element {
        return (
            <ul className={this.props.className}>
                {this.renderView()}
            </ul>
        );
    }

    protected renderView = (): Array<JSX.Element> => {
        return this.props.childList.arrayList.map((item: TableColumn) => {
            const isEmpty = item.childColumnsArray.length;
            return (
                <li className={classNames("jqtree_common", isEmpty && "jqtree-folder")} key={item.id}>
                    <SettingsTreeItem
                        onMove={this.handleMove(this.props.childList.move)}
                        activeTableKey={this.props.activeTableKey}
                        onSaveData={this.handleSaveData}
                        groupId={this.childId}
                        columnData={item}
                    />
                </li>
            );
        });
    }

    protected handleSaveData = (): void => {
        this.context.saveData(this.props.activeTableKey);
    }

    protected handleMove = (onMove: (from: string, to: string) => void) => (from: string, to: string) => {
        try {
            onMove(from, to);
        } catch (error) {
            this.context.onError(error);
        }

        this.context.saveData(this.props.activeTableKey);
    }
}
