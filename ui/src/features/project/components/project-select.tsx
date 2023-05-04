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
  const projectsCacheState = useSelector((state: AppState) => state.ProjectsCache);

  // ------------------ Html templet ------------------ 
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <Select
        // inputProps={{ 'aria-label': 'Without label' }}
        value={ projectsCacheState._activeProject?.id ? projectsCacheState._activeProject?.id: "-" }
        onChange={ props.handleOnProjectChange } >
        <MenuItem disabled={ props.yourProjectDisabled } value="-" >
          Your Projects
        </MenuItem>

        {
          projectsCacheState._allProjects.map(project => {
            return (
              <MenuItem key={ project.id } value={ project.id }>
                <Tooltip 
                  style={{
                    width: "100%",
                    height: "100%"
                  }} 
                  title={ project.name } >
                  <div>
                    { truncate(project.name, 7) }
                  </div>
                </Tooltip>
              </MenuItem>
            )
          })
        }

        <MenuItem disabled={ true } value="+" >
          Joined Projects
        </MenuItem>
      </Select>
    </FormControl>
  )
}

export default ProjectSelect;