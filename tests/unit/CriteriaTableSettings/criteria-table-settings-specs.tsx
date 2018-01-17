import * as React from "react";
import {expect} from "chai";
import {ReactWrapper, mount} from "enzyme";
import {CriteriaTableSettings} from "../../../src/Components/CriteriaTableSettings/CriteriaTableSettings";
import {CriteriaTableControllerContextTypes} from "../../../src/Components/CriteriaTableController/CriteriaTableControllerContext";
import {SettingsTreeView} from "../../../src/Components/SettingsTree/SettingsTreeView/SettingsTreeView";
import {ColumnData} from "../helpers/ColumnData";
import {TableColumn} from "../../../src/Components/TableColumn/TableColumn";
import {TableColumnRepository} from "../../../src/Components/TableColumn/TableColumnRepository";

describe("<CriteriaTableSettings/>", () => {
    let wrapper: ReactWrapper<any>;

    const commonHandler = () => undefined;

    const context = {
        initData: commonHandler,
        getCurrentVisibleData: commonHandler,
        getColumn: commonHandler,
        getCurrentData: commonHandler,
        onError: commonHandler,
        saveData: commonHandler,
    };

    beforeEach(() => {
        wrapper = mount(
            <CriteriaTableSettings activeTableKey="key"/>,
            {context, childContextTypes: CriteriaTableControllerContextTypes}
            );
    })

    afterEach(() => {
        wrapper.unmount();
    })

    it("Should return null when `context.getCurrentData` return nothing", () => {
        expect(wrapper.find(SettingsTreeView).length).to.equal(0)
    })

    it("Should return <SettingsTreeView/> when `context.getCurrentData` return correct data", () => {
        context.getCurrentData = () => new TableColumnRepository().add(new TableColumn(ColumnData));
        wrapper.unmount().mount();


        expect(wrapper.find(SettingsTreeView).length).to.equal(1)
    })
})
