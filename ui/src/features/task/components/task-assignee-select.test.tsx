import { render, screen, fireEvent } from '@testing-library/react';
import TaskAssigneeSelect from './task-assignee-select';

describe('AssigneeSelect', () => {


  const allAssignees = ["Alice", "Bob", "Charlie"];
  const assignee = "Alice";
  const handleOnSelectChange = jest.fn();

  beforeEach(() => {

  });

    it('should render the AssigneeSelect component', () => {
        render(
            <TaskAssigneeSelect
                assignee={ assignee }
                allAssignees={ allAssignees }
                handleOnSelectChange={ handleOnSelectChange }
            />
        );

        const assigneeSelect = screen.getByRole('combobox');
        expect(assigneeSelect).toBeInTheDocument();
    });

    it('should display the current assignee', () => {
        render(
            <TaskAssigneeSelect
                assignee={ assignee }
                allAssignees={ allAssignees }
                handleOnSelectChange={ handleOnSelectChange }
            />
        );
        
        const selectedAssignee = screen.getByText(assignee);
        
        expect(selectedAssignee).toBeInTheDocument();
    });

//   it('should display all the assignees', () => {
//     const assigneeItems = screen.getAllByRole('option');
//     expect(assigneeItems.length).toEqual(allAssignees.length + 1); // +1 for the "none" option

//     allAssignees.forEach((assignee) => {
//       const assigneeItem = screen.getByText(assignee);
//       expect(assigneeItem).toBeInTheDocument();
//     });
//   });

//   it('should call the handleOnSelectChange function when an assignee is selected', () => {
//     const assigneeSelect = screen.getByRole('combobox');
//     const newAssignee = "Bob";
//     fireEvent.change(assigneeSelect, { target: { value: newAssignee } });

//     expect(handleOnSelectChange).toHaveBeenCalledTimes(1);
//     expect(handleOnSelectChange).toHaveBeenCalledWith(expect.any(Object));
//   });
});
