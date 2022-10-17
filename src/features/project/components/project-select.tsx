import { useSelector } from "react-redux";

import { FormControl, MenuItem, Select, Tooltip } from "@mui/material";

import { truncate } from "../../../libs/text-lib";

import { AppState } from "../../../stores/app-reducers";

interface ProjectSelectProps {
  yourProjectDisabled: boolean,
  handleOnProjectChange: any
}

const ProjectSelect = (props: ProjectSelectProps) => {
  // ------------------ Project cache ------------------ 
  const projectsCacheContextState = useSelector((state: AppState) => state.ProjectsCache);

  // ------------------ Html templet ------------------ 
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <Select
        value={ projectsCacheContextState._activeProject?.id ? projectsCacheContextState._activeProject?.id: "-" }
        onChange={ props.handleOnProjectChange }
        inputProps={{ 'aria-label': 'Without label' }}>
        <MenuItem value="-" disabled={ props.yourProjectDisabled }>
          <em>Your Projects</em>
        </MenuItem>

        {
          projectsCacheContextState._allProjects.map(project => {
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