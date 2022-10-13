import { FormControl, MenuItem, Select, Tooltip } from "@mui/material";

import { useProjectsCacheContext } from "../../../providers/projects-cache";

import { truncate } from "../../../libs/text-lib";

interface ProjectSelectProps {
  yourProjectDisabled: boolean,
  handleOnProjectChange: any
}

const ProjectSelect = (props: ProjectSelectProps) => {
  // ------------------ Project ------------------ 
  const projectsContextState = useProjectsCacheContext().state;

  // ------------------ Html templet ------------------ 
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

export default ProjectSelect;