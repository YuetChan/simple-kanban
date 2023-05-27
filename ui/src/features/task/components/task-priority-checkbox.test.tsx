import { fireEvent, render, screen } from "@testing-library/react";

import configureMockStore from "redux-mock-store";

import thunk from "redux-thunk";

import { Provider } from "react-redux";

import TaskPriorityCheckbox from "./task-priority-checkbox";

const mockStore = configureMockStore([thunk]);

describe("TaskPriorityCheckbox", () => {
    let store: any = mockStore({ 
        UserCache: {
          _loginedUserEmail: "test_user1@example.com",
        },
    });

    let props: { 
        checkedValues?: Array<string>,
        handleOnPrioritiesCheck?: Function
    }

    beforeEach(() => {
        props = { 
            checkedValues: [],
            handleOnPrioritiesCheck: jest.fn()
        }
    });

    it("render correctly", () => {
        render(
            <Provider store={ store }>
                <TaskPriorityCheckbox { ... props } />
            </Provider>
        );

        const titleIcon = screen.getByText("Priorities:")    

        expect(titleIcon).toBeInTheDocument();

        const lowForm = screen.getByLabelText("Low"); 
        const mediumForm = screen.getByLabelText("Medium");
        const highForm = screen.getByLabelText("High");

        expect(lowForm).toBeInTheDocument();
        expect(mediumForm).toBeInTheDocument();
        expect(highForm).toBeInTheDocument();
    });
 

    it("clicking checkbox should call handleOnPrioritiesChange", () => {
        render(
            <Provider store={ store }>
                <TaskPriorityCheckbox { ... props } />
            </Provider>
        );

        const lowForm = screen.getByLabelText("Low"); 
        
        fireEvent.click(lowForm);

        expect(props.handleOnPrioritiesCheck).toHaveBeenCalledWith(["low"]);
    });
});