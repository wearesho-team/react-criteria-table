import { expect } from "chai";

import { TableColumn, TableColumnRepository } from "../../../src/Components/TableColumn"
import { ColumnData } from "../helpers/ColumnData";

describe("TableColumnRepository", () => {
    let instance: TableColumnRepository;

    beforeEach(() => {
        instance = new TableColumnRepository();
    });

    afterEach(() => {
        instance = undefined;
    });

    it("Should add data to repository", () => {
        instance.add(new TableColumn(ColumnData));

        expect(instance.findById("id_1")).to.be.instanceof(TableColumn);
        expect(instance.arrayList).to.have.length(1);
    });

    it("Should throw error if id already exist in repo on add", () => {
        instance.add(new TableColumn(ColumnData));

        expect(() => instance.add(new TableColumn(ColumnData))).to.throw("Id already exists")
    });

    it("Should throw error if id not found in repo on move", () => {
        expect(() => instance.move("notId", "itsNotIdToo")).to.throw("Id not found");
    });

    it("Should move data in repo according to args", () => {
        (new Array(4))
            .fill(undefined)
            .forEach((x, i) => instance.add(new TableColumn({
                id: `id_${i}`,
                show: true,
                Header: `Header_${i}`
            })));

        instance.move("id_0", "id_3");
        expect(instance.arrayList.findIndex(({ id }) => id === "id_0")).to.equal(3);
        expect(instance.arrayList.findIndex(({ id }) => id === "id_3")).to.equal(2);

        instance.move("id_0", "id_3");
        expect(instance.arrayList.findIndex(({ id }) => id === "id_0")).to.equal(2);
        expect(instance.arrayList.findIndex(({ id }) => id === "id_3")).to.equal(3);
    });
});
