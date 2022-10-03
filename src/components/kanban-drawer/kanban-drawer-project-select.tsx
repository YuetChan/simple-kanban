import { FormControl, MenuItem, Select, Tooltip } from "@mui/material";

import { useKanbanProjectsContext } from "../../providers/kanban-projects";
import { truncate } from "../../apis/text-api";

const KanbanDrawerProjectSelect = (props: any) => {
  const projectsContextState = useKanbanProjectsContext().state;

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <Select
        value={ projectsContextState._activeProject?.id ? projectsContextState._activeProject?.id: "-" }
        onChange={ props.handleOnProjectChange }
        inputProps={{ 'aria-label': 'Without label' }}>
        <MenuItem value="-" disabled={ props.yourProjectDisabled }>
          <em>Your Projects</em>
        </MenuItem>

        {
          projectsContextState._allProjects.map(project => {
            return (
                <MenuItem key={ project.id } value={ project.id }>
                  <Tooltip style={{
                    width: "100%",
                    height: "100%"
                  }} title={ project.name }>
                    <div>
                      { truncate(project.name, 7) }
                    </div>
                  </Tooltip>
                </MenuItem>
            )
          })
        }

        <MenuItem value="+" disabled={ true }>
          <em>Joined Projects</em>
        </MenuItem>
      </Select>
    </FormControl>
  )
}

export default KanbanDrawerProjectSelect;