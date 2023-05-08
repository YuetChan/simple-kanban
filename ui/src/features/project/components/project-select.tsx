import { FormControl, MenuItem, Select, Tooltip } from "@mui/material";

import { truncate } from "../../../libs/text-lib";

import { Project } from "../../../types/Project";

interface ProjectSelectProps {
  activeProject?: Project,
  projects: Array<Project>,
  yourProjectDisabled: boolean,

  handleOnProjectChange: Function
}

const ProjectSelect = (props: ProjectSelectProps) => {
  const handleOnProjectChange = (e: any) => {
    props.handleOnProjectChange(e.target.value)
  }
  
  // ------------------ Html templet ------------------ 
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <Select
        value={ props.activeProject? props.activeProject.id : "-" }
        onChange={ (e) => handleOnProjectChange(e) } >
        <MenuItem disabled={ props.yourProjectDisabled } value="-" >
          Your Projects
        </MenuItem>

        {
          props.projects.map(project => {
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