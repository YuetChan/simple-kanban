import { Provider } from 'react-redux';

import { render, screen } from '@testing-library/react';

import configureMockStore from 'redux-mock-store';

import thunk from 'redux-thunk';

import ProjectWithOwnerIcon from './project-with-owner-icon';

const mockStore = configureMockStore([thunk]);

describe("ProjectOwnerMenu", () => {
    let store: any = mockStore({
        UserCache: {
          _loginedUserEmail: "test_user1@example.com",
        },
    });

    let props: {
        projectName: string,
        ownerEmail: string
    }

    beforeEach(() => {
        store = mockStore({
            UserCache: {
                _loginedUserEmail: 'test_user1@example.com',
            },
        });

        props = {
            projectName: "Test project name" ,
            ownerEmail:  "test_user_1@gmail.com"
        }; 
    })

    it("Render correctly", () => {    
        render(
            <Provider store={ store }>
                <ProjectWithOwnerIcon { ... props } />
            </Provider>
        );
    
        const projectNameDiv = screen.getByText("Test project name")  
        const projectOwnerAvatar = screen.getByTestId("project-owner-avatar")

        expect(projectNameDiv).toBeInTheDocument();
        expect(projectOwnerAvatar).toBeInTheDocument(); 
    });
})