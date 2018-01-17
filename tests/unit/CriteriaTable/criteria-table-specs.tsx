import * as React from "react";
import {expect} from "chai";
import {ReactWrapper, mount} from "enzyme";
import {CriteriaTable} from "../../../src/Components/CriteriaTable";
import {ColumnData} from "../helpers/ColumnData";

describe("<CriteriaTable/>", () => {
    let wrapper: ReactWrapper<any, any>;

    const handleDefaults = () => () => [];
    const handleFetchData = (): any => {
        return {
            data: {
                value: "wow",
                count: 1,
            }
        }
    }

    beforeEach(() => {
        (window as any).localStorage = {
            getItem: () => JSON.stringify([]),
            setItem: () => undefined
        };

        wrapper = mount(
            <CriteriaTable onDefaults={handleDefaults} onFetchData={handleFetchData} cacheKey="key"/>,
            {
                context: {
                    initData: () => undefined,
                    getCurrentVisibleData: () => [],
                    getColumn: () => undefined,
                    getCurrentData: () => undefined,
                    onError: () => undefined,
                    saveData: () => undefined
                }
            }
        );
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it("Should set empty`s state if localStorage is empty on mount", () => {
        expect(JSON.stringify(wrapper.state().data.list)).to.equal("[]");
        expect(JSON.stringify(wrapper.state().data.total)).to.equal("{}");
        expect(wrapper.state().data.count).to.equal(0);
    })

    it("Should set data to state from localStorage on mount", () => {
        Object.assign((window as any).localStorage, {
            getItem: () => JSON.stringify({data: { list: ["list"], total: "total", count: 1 }})
        });

        wrapper.unmount().mount();

        expect(wrapper.state().data.list[0]).to.equal("list");
        expect(wrapper.state().data.total).to.equal("total");
        expect(wrapper.state().data.count).to.equal(1);
    });

    it("Should save data to localStorage on fetchingData", async () => {
        let savedData;
        Object.assign((window as any).localStorage, {
            setItem: (key, data) => {
                savedData = data;
            }
        });

        await wrapper.unmount().mount();

        expect(savedData).to.equal(JSON.stringify({
            data: {
                value: "wow",
                count: 1,
            }
        }));

        expect(JSON.stringify(wrapper.state().data)).to.equal(JSON.stringify({
            value: "wow",
            count: 1,
        }));
    })

    it("Should set query to state on handleFilterChange according to passed data", () => {
        (wrapper.instance() as any).handleFilterChange([{id: "field", value: 1}]);
        expect(JSON.stringify(wrapper.state().queries)).to.equal(JSON.stringify([["=", "field", 1]]))
    })

})