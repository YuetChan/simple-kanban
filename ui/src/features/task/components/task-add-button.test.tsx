import { render, screen, fireEvent } from "@testing-library/react";

import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import { Provider } from "react-redux";

import TaskAddButton from "./task-add-button";

const mockStore = configureMockStore([thunk]);

describe("TaskAddButton", () => {
    let store: any = mockStore({ });

    let props: {
        handleOnClick?: Function
    };

    beforeEach(() => {
        store = mockStore({
            UserCache: {
                _loginedUserEmail: "test_user1@example.com",
            },
        });

        props = {
            handleOnClick: jest.fn()
        };
    });


    it("renders correctly", () => {
        render(
            <Provider store={ store }>
                <TaskAddButton { ...props } />
            </Provider>
            );

        expect(screen.getByRole("button")).toBeInTheDocument();
    });


    it("clicking add icon should call handleOnClick", () => {
        render(
            <Provider store={ store }>
                <TaskAddButton { ...props } />
            </Provider>
            );
    
        const button = screen.getByRole("button");
    
        fireEvent.click(button);
    
        expect(props.handleOnClick).toBeCalledTimes(1);
    });
});
