import { Provider } from 'react-redux';

import { render, fireEvent, screen } from '@testing-library/react';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ProjectCollaboratorMenu from './project-collaborator-menu';

const mockStore = configureMockStore([thunk]);

describe('ProjectCollaboratorMenu', () => {
    let store: any;

    let props: {
        anchorEl: any,
        open: boolean,
      
        handleOnClose?: Function,
        handleOnQuitProject?: Function
    }
  
    beforeEach(() => {
        store = mockStore({
            UserCache: {
              _loginedUserEmail: 'test_user1@example.com',
            },
        });

        props = {
            anchorEl: document.body,
            open: true,

            handleOnClose: jest.fn(),
            handleOnQuitProject: jest.fn()
        };
    });

    it('clicking quit project should call props.handleOnQuitProject', async () => {
        render(
          <Provider store={ store }>
            <ProjectCollaboratorMenu { ... props } />
          </Provider>
        );
    
        const quitProjectButton = screen.getByText("Quit project")

        fireEvent.click(quitProjectButton);
    
        expect(props.handleOnQuitProject).toHaveBeenCalledTimes(1)
    });


    it("clicking outside of menu should close menu", async () => {
        render(
          <Provider store={ store }>
            <ProjectCollaboratorMenu { ... props } />
          </Provider>
        );
    
        const menu = screen.getByRole("menu"); 

        fireEvent.keyDown(menu, { key: "Escape", code: 27 });
    
        expect(props.handleOnClose).toHaveBeenCalledTimes(1);
    })
})