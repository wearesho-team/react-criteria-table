import { expect } from "chai";
import * as React from "react";
import { ReactWrapper, mount } from "enzyme";

import { CriteriaTable } from "../../../src/Components/CriteriaTable";

describe("<CriteriaTable/>", () => {
    let wrapper: ReactWrapper<any, any>;

    const handleDefaults = () => () => [];
    const handleFetchData = (): any => {
        return {
            data: {
                value: "wow",
                count: 1,
                list: [],
            }
        }
    };

    const commonHandler = () => undefined;

    const context = {
        initData: commonHandler,
        getCurrentVisibleData: () => [],
        getColumn: commonHandler,
        getCurrentData: commonHandler,
        onError: commonHandler,
        saveData: commonHandler,
        getControlAction: commonHandler,
        bindControlAction: commonHandler,
        unbindControlAction: commonHandler,
        enableCaching: true,
    }

    beforeEach(() => {
        (window as any).localStorage = {
            getItem: () => JSON.stringify([]),
            setItem: commonHandler
        };

        wrapper = mount(
            <CriteriaTable onDefaults={handleDefaults} onFetchData={handleFetchData} cacheKey="key" />,
            { context }
        );

    });

    afterEach(() => {
        wrapper.unmount();
    });

    it("Should set empty`s state if localStorage is empty on mount", () => {
        expect(JSON.stringify(wrapper.state().data.list)).to.equal("[]");
        expect(JSON.stringify(wrapper.state().data.total)).to.equal("{}");
        expect(wrapper.state().data.count).to.equal(0);
    });

    it("Should set data to state from localStorage on mount", () => {
        Object.assign((window as any).localStorage, {
            getItem: () => JSON.stringify({ data: { list: ["list"], total: "total", count: 1 } })
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

        await (wrapper.instance() as any).handleFetchData();

        expect(savedData).to.equal(JSON.stringify({
            ...(wrapper.instance() as any).cachedState,
            data: {
                value: "wow",
                count: 1,
                list: [],
            }
        }));

        expect(JSON.stringify(wrapper.state().data)).to.equal(JSON.stringify({
            value: "wow",
            count: 1,
            list: [],
        }));
    });

    it("Should not save data to localStorage on `enableCaching=false`", async () => {
        wrapper.setContext({ enableCaching: false });

        let savedData;
        Object.assign((window as any).localStorage, {
            setItem: (key, data) => {
                savedData = data;
            }
        });

        await (wrapper.instance() as any).handleFetchData();

        expect(savedData).not.to.be.undefined;
        expect(JSON.stringify(JSON.parse(savedData).data)).to.equal(JSON.stringify({
            value: "wow",
            count: 1,
        }));

        expect(JSON.stringify(wrapper.state().data)).to.equal(JSON.stringify({
            value: "wow",
            count: 1,
        }));
    });

    it("Should set query to state on handleSetQueries according to passed data", () => {
        (wrapper.instance() as any).handleSetQueries([["=", "field", 1]]);
        expect(JSON.stringify(wrapper.state().queries)).to.equal(JSON.stringify([["=", "field", 1]]))
    });
});
