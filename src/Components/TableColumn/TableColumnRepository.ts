import { TableColumn } from "./TableColumn";

export class TableColumnRepository {
    private map: Map<string, TableColumn> = new Map();

    public get arrayList(): Array<TableColumn> {
        return Array.from(this.map.values());
    }

    public add = (data: TableColumn): TableColumnRepository => {
        if (this.map.has(data.id)) {
            throw new Error("Id already exists");
        }

        this.map.set(data.id, data);

        return this;
    }

    public move = (cutId: string, toId: string): TableColumnRepository => {
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
