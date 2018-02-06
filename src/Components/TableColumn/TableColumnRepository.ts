import { arrayMove } from "react-sortable-hoc";
import { TableColumn } from "./TableColumn";

export class TableColumnRepository {
    private map: Map<string, TableColumn>;

    constructor() {
        this.map = new Map();
    }

    public get arrayList(): Array<TableColumn> {
        return Array.from(this.map.values());
    }

    public add = (data: TableColumn): TableColumnRepository | never => {
        if (this.map.has(data.id)) {
            throw new Error("Id already exists");
        }

        this.map.set(data.id, data);

        return this;
    }

    public moveByIndex = (oldIndex: number, newIndex: number): TableColumnRepository | never => {
        if (this.map.size < oldIndex || this.map.size < newIndex || newIndex < 0 || oldIndex < 0) {
            throw new Error("Index not found");
        }

        const newList = arrayMove(this.arrayList, oldIndex, newIndex);
        this.map.clear();
        newList.forEach((data: TableColumn) => this.add(data));

        return this;
    }

    public moveById = (cutId: string, toId: string): TableColumnRepository | never => {
        if (!this.map.has(cutId) || !this.map.has(toId)) {
            throw new Error("Id not found");
        }

        const newMap = new Map();
        const cut = this.map.get(cutId);

        let isBefore = false;

        this.map.forEach((item) => {
            if (item.id === cut.id) {
                isBefore = true;
                return;
            }

            if (isBefore) {
                newMap.set(item.id, item);
            }

            if (item.id === toId) {
                newMap.set(cut.id, cut);
            }

            if (!isBefore) {
                newMap.set(item.id, item);
            }

        });

        this.map = newMap;

        return this;
    }

    public findById = (searchId: string): TableColumn => {
        return this.map.get(searchId);
    }
}
