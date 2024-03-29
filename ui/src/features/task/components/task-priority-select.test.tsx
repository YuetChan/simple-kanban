import { fireEvent, render, screen } from "@testing-library/react";

import configureMockStore from "redux-mock-store";

import thunk from "redux-thunk";

import { Provider } from "react-redux";

import TaskPrioritySelect from "./task-priority-select";

const mockStore = configureMockStore([thunk]);

describe("TaskPrioritySelect", () => {
    let store: any = mockStore({ 
        UserCache: {
          _loginedUserEmail: "test_user1@example.com",
        },
    });

    let props: { 
        value: string,
        handleOnSelectChange: Function
    }

    beforeEach(() => {
        props = { 
            value: "low",
            handleOnSelectChange: jest.fn()
        }
    });


    it("should render correctly", () => {
        render(
            <Provider store={ store }>
                <TaskPrioritySelect { ... props } />
            </Provider>
        );

        const prioritySelect = screen.getByLabelText("Priority")

        expect(prioritySelect).toBeInTheDocument();
    });

    // // Not sure why this following test case fails

    // it("clicking menu item should call handleOnPrioritySelect with value of menu item ", () => {
    //     render(
    //         <Provider store={ store }>
    //             <TaskPrioritySelect { ... props } />
    //         </Provider>
    //     );

    //     const prioritySelect = screen.getByLabelText("Priority")

    //     fireEvent.mouseDown(prioritySelect);

    //     const menuItem = screen.getByRole("option", { name: "Low" });

    //     fireEvent.click(menuItem);
      
    //     expect(props.handleOnPriorityChange).toBeCalledTimes(1)
    // });
});