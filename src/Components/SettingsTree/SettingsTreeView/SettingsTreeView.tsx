import * as React from "react";
import * as PropTypes from "prop-types";

import {
    SettingsTreeViewProps,
    SettingsTreeViewPropTypes,
    SettingsTreeViewDefaultProps
} from "./SettingsTreeViewProps";
import { CriteriaTableControllerContextTypes, CriteriaTableControllerContext } from "../../CriteriaTableController";
import { TableColumnRepository, TableColumn } from "../../TableColumn";
import { DraggableItem, DraggableContainer } from "../Draggable";
import { SettingsTreeItem } from "../SettingsTreeItem";

export class SettingsTreeView extends React.Component<SettingsTreeViewProps> {
    public static readonly propTypes = SettingsTreeViewPropTypes;
    public static readonly defaultProps = SettingsTreeViewDefaultProps;
    public static readonly contextTypes = CriteriaTableControllerContextTypes;

    public readonly context: CriteriaTableControllerContext;

    public render(): JSX.Element {
        return (
            <DraggableContainer
                onSortEnd={this.handleMove}
                helperClass="on-drag"
                lockToContainerEdges
                distance={10}
                lockAxis="y"
            >
                <ul className={this.props.className}>
                    <this.TreeItems />
                </ul>
            </DraggableContainer>
        );
    }

    protected TreeItems: React.SFC<undefined> = (): JSX.Element => {
        const list = this.props.childList.arrayList.map((item: TableColumn, index: number) => {
            const isEmpty = item.childColumnsArray.length;
            return (
                <DraggableItem index={index} key={item.id}>
                    <li className={`jqtree_common${isEmpty ? " jqtree-folder" : ""}`}>
                        <SettingsTreeItem
                            activeTableKey={this.props.activeTableKey}
                            onSaveData={this.handleSaveData}
                            columnData={item}
                        />
                    </li>
                </DraggableItem>
            )
        });

        return (
            <React.Fragment>
                {list}
            </React.Fragment>
        );
    }

    protected handleSaveData = (): void => {
        this.context.saveData(this.props.activeTableKey);
    }

    protected handleMove = ({ oldIndex, newIndex }): void | never => {
        try {
            this.props.childList.moveByIndex(oldIndex, newIndex);
        } catch (error) {
            this.context.onError(error);
        }

        this.context.saveData(this.props.activeTableKey);
    }
}
