import * as React from "react";
import {expect} from "chai";
import {ReactWrapper, mount} from "enzyme";
import {CriteriaTableController} from "../../../src/Components/CriteriaTableController";
import {ColumnData} from "../helpers/ColumnData";
import {TableColumnRepository} from "../../../src/Components/TableColumn/TableColumnRepository";

describe("CriteriaTableController", () => {
    let wrapper: ReactWrapper<any, any>;
    let instance: CriteriaTableController;

    let onErrorMessage;
    const handleError = (error: any) => {
        onErrorMessage = error.message;
    }

    beforeEach(() => {
        wrapper = mount(<CriteriaTableController onError={handleError}>
            <div/>
        </CriteriaTableController>);

        instance = wrapper.instance() as CriteriaTableController;
    })

    afterEach(() => {
        wrapper.unmount();
        onErrorMessage = undefined;
        (window as any).localStorage = {
            getItem: () => "[]",
        };
    })

    it("Should initialize only default data when cached data empty", () => {
        const initializedData = instance.getChildContext().initData("notExistCacheKey", [ColumnData]);

        expect(initializedData).to.be.instanceof(TableColumnRepository);
        expect(initializedData.arrayList).to.have.length(1);
        expect(initializedData.findById(ColumnData.id).Header).to.equal(ColumnData.Header);
    });

    it("Should initialize default and cached data at the same time", () => {
        (window as any).localStorage = {
            getItem: () => JSON.stringify([{
                id: "id_1",
                Footer: "Footer_cached_1",
                columns: [
                    {
                        id: "id_2",
                        Footer: "Footer_cached_2"
                    }
                ]
            }])
        };

        const initializedData = instance.getChildContext().initData("someKey", [ColumnData]);

        expect(initializedData).to.be.instanceof(TableColumnRepository);
        expect(initializedData.arrayList).to.have.length(1);
        expect(initializedData.findById("id_1").Footer).to.equal("Footer_cached_1");
        expect(initializedData.findById("id_1").getChildColumnById("id_2").Footer).to.equal("Footer_cached_2");
    });

    it("Should call `onError` when initializing on cache parsing or data merging throw error", () => {
        (window as any).localStorage = {
            getItem: () => "notValidJSONData"
        };

        instance.getChildContext().initData("someKey", [ColumnData]);
        expect(onErrorMessage).to.equal("Unexpected token o in JSON at position 1");

        onErrorMessage = undefined;
        (window as any).localStorage = {
            getItem: () => JSON.stringify([
                {
                    id: "id_1",
                    Footer: "Footer_cached_1"
                },
                {
                    id: "id_1",
                    Footer: "Footer_cached_1"
                }
            ])
        };

        instance.getChildContext().initData("someKey", [ColumnData]);
        expect(onErrorMessage).to.equal("Id already exists");
    });

    it("Should return data according to id on `getCurrentData`", () => {
        instance.getChildContext().initData("someKey", [ColumnData]);

        expect(instance.getChildContext().getCurrentData("someKey").findById("id_1").Header).to.equal(ColumnData.Header);
    });

    it("Should return only data with `show` true according to id on `getCurrentVisibleData`", () => {
        instance.getChildContext().initData("someKey", [
            {id: "hidden", show: false},
            {id: "visible", show: true}
        ]);

        expect(instance.getChildContext().getCurrentVisibleData("someKey").length).to.equal(1);
        expect(instance.getChildContext().getCurrentVisibleData("someKey")[0].id).to.equal("visible");
    });

    it("Should return column from table according to tableId and columnId", () => {
        instance.getChildContext().initData("someKey", [ColumnData]);

        expect(instance.getChildContext().getColumn("someKey", ColumnData.id).Header).to.equal(ColumnData.Header);
    });

    it("Should put data to localStorage on save", () => {
        instance.getChildContext().initData("someKey", [ColumnData]);

        let savedData;
        (window as any).localStorage = {
            setItem: (key, data) => {
               savedData = data;
            }
        }

        instance.getChildContext().saveData("someKey");

        expect(savedData).to.equal(JSON.stringify([ColumnData]));
    });
})