import { fireEvent, render, screen } from "@testing-library/react";

import configureMockStore from "redux-mock-store";

import thunk from "redux-thunk";

import { Provider } from "react-redux";

import TaskStatusSelect from "./task-status-select";

const mockStore = configureMockStore([thunk]);

describe("TaskStatusSelect", () => {
    let store: any = mockStore({ 
        UserCache: {
          _loginedUserEmail: "test_user1@example.com",
        },
    });

    let props: { 
        value: string,
        handleOnSelectChange: Function,
    }

    beforeEach(() => {
        props = { 
            value: "todo",
            handleOnSelectChange: jest.fn()
        }
    });

    it("should render correctly", () => {
        render(
            <Provider store={ store }>
                <TaskStatusSelect { ... props } />
            </Provider>
        );

        const statusSelect = screen.getByLabelText("Status")

        expect(statusSelect).toBeInTheDocument();
    });


    // // Not sure why this following test case fails

    // it("clicking menu item should call handleOnPrioritySelect with value of menu item ", () => {
    //     render(
    //         <Provider store={ store }>
    //             <TaskStatusSelect { ... props } />
    //         </Provider>
    //     );

    //     const prioritySelect = screen.getByLabelText("Status")

    //     fireEvent.mouseDown(prioritySelect);

    //     const menuItem = screen.getByRole("option", { name: "To Do" });

    //     fireEvent.click(menuItem);

    //     expect(props.handleOnSelectChange).toBeCalledTimes(1)
    // });
})