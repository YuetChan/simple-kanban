import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Divider, IconButton, Stack } from "@mui/material";

import KanbanColumn from "./kanban-column";
import KanbanCard from "./kanban-card";
import TaskUpdateDialog from "../features/task/components/task-update-dialog";
import UserListMenu from "../features/user/components/user-list-menu";
import TaskSearchFilterMenu from "../features/task/components/task-search-filter-menu";
import ProjectOwnerMenu from "../features/project/components/project-owner-menu";
import ProjectCollaboratorMenu from "../features/project/components/project-collaborator-menu";
import UserList from "../features/user/components/user-list";

import { Task } from "../types/Task";
import { User } from "../types/User";

import { AppState } from "../stores/app-reducers";

import { actions as kanbanTableActions } from "../stores/kanban-table-slice";
import { actions as TasksCacheActions } from "../stores/tasks-cache-slice";
import { actions as projectsCacheActions } from '../stores/projects-cache-slice';
import { actions as projectDeleteDialogActions } from '../stores/project-delete-dialog-slice';
import { actions as usersCacheActions } from '../stores/user-cache-slice';
import { actions as tasksSearchActions } from '../stores/tasks-search-slice';

import { stringToEnum } from "../services/backend-enum-service";
import { deleteTask, searchTasksByFilterParams, updateTask } from "../features/task/services/tasks-service";
import { getProjectById, updateProjectById } from '../features/project/services/projects-service';

import TuneIcon from '@mui/icons-material/Tune';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';

interface KanbanTableProps { }

const KanbanTable = (props: KanbanTableProps) => {
    // ------------------ Dispatch ------------------
    const dispatch = useDispatch();

    // ------------------ Project cache ------------------
    const projectsCacheState = useSelector((state: AppState) => state.ProjectsCache);

    const { selectActiveProject, updateActiveProject } = projectsCacheActions;


    // ------------------ Project delete dialog ------------------
    const { showProjectDeleteDialog } = projectDeleteDialogActions;

    // ------------------ Task cache ------------------
    const tasksState = useSelector((state: AppState) => state.TasksCache);

    const { allTasksUpdate } = TasksCacheActions;

    // ------------------ Tasks search ------------------
    const tasksSearchState = useSelector((state: AppState) => state.TasksSearch);

    const {  
        selectActivePriorities,
        updateActiveTags,
        addActiveUserEmail, removeActiveUserEmail
    } = tasksSearchActions;

    // ------------------ Table ------------------
    const tableState = useSelector((state: AppState) => state.KanbanTable);

    const { refreshTable } = kanbanTableActions;

    // -------------- User cache --------------
    const userCacheState = useSelector((state: AppState) => state.UserCache);

    const { updateLoginedUserEmail, updateLoginedUserSecret } = usersCacheActions;

    // ------------------ Task update dialog ------------------
    const [ taskToUpdate, setTaskToUpdate ] = React.useState<Task | undefined >(undefined);

    const handleOnCardClick = (task: Task) => {
        setTaskToUpdate(task);
    }

    const handleOnCardUpdateDialogClose = () => {
        setTaskToUpdate(undefined);
    }

    const handleOnCardUpdateDialogApply = (task: Task) => {
        updateTask(task).then(res => {
            dispatch(refreshTable());
        })

        setTaskToUpdate(undefined);
    }

    const handleOnCardUpdateDialogDelete = (task: Task) => {
        deleteTask(task.id).then(res => {
            dispatch(refreshTable());
        });

        setTaskToUpdate(undefined);
    }


    // ------------------ Meta ------------------
    const [ metaMp, setMetaMp ] = React.useState<Map<string, { headUUID: string, tailUUID: string }> | undefined>(undefined);


    // ------------------ Column html ------------------
    const [ columnMp, setColumnMp ] = React.useState<Map<string, any> | undefined>(undefined);

    useEffect(() => {
        const projectId = projectsCacheState._activeProject?.id;
        if(projectId && metaMp) {
            fetchTasks(projectId, 0);
        }
    }, [ 
        metaMp, 
        tableState,
    ]);

    useEffect(() => {
        const backlogMeta = metaMp?.get('backlog');
        const todoMeta = metaMp?.get('todo');
        const inProgressMeta = metaMp?.get('inProgress');
        const doneMeta = metaMp?.get('done');

        if(backlogMeta && todoMeta && inProgressMeta && doneMeta) {
            const columnMp = new Map();

            const matchPriority = (task: Task) => { 
                const priorityEnums = tasksSearchState._activePriorities.map(priority => stringToEnum(priority))
                return priorityEnums.includes(task.priority); 
            }

            const matchPriorityAll = () => { 
                return tasksSearchState._activePriorities.length === 3 
                || tasksSearchState._activePriorities.length === 0; 
            }
  
            const matchTags = (task: Task) => { 
                return tasksSearchState._activeTags.every(t => task.tagList.map(tag => tag.name).includes(t)); 
            }

            const isTagsEmpty = tasksSearchState._activeTags.length === 0;
  
            const matchAssignee = (task: Task) => { 
                return tasksSearchState._activeUserEmails.includes(task.assigneeEmail); 
            }

            const isAssigneeEmpty = tasksSearchState._activeUserEmails.length === 0
      
            const matchAll = (task: Task) => {
                return !(isTagsEmpty && matchPriorityAll() && isAssigneeEmpty) 
                &&  (
                    (matchTags(task) && (matchPriorityAll() || matchPriority(task)) && isAssigneeEmpty) 
                    || (matchTags(task) && (matchPriorityAll() || matchPriority(task)) && matchAssignee(task))
                );
            }
  
            const backlog = "backlog";

            const backlogCardStacks = tasksState._allTasks?.backlog.map(task => {
                return (
                    <KanbanCard 
                        highlight={ matchAll(task) } 
                        task={ task } 
                        category={ backlog }
                
                        handleOnCardClick={ handleOnCardClick }

                        style={{
                            width: "80%"
                        }}/>
                    )
            });
  
            const todo = "todo";

            const todoCardStacks = tasksState._allTasks?.todo.map(task => {
                return (
                    <KanbanCard 
                        highlight={ matchAll(task) } 
                        task={ task } 
                        category={ todo }  
                    
                        handleOnCardClick={ handleOnCardClick }
                        style={{
                            width: "80%"
                        }}/>
                        );
            });  
  
            const inProgress = "inProgress";

            const inProgressCardStacks = tasksState._allTasks?.inProgress.map(task => {
                return (
                    <KanbanCard 
                        highlight={ matchAll(task) } 
                        task={ task } 
                        category={ inProgress } 
                    
                        handleOnCardClick={ handleOnCardClick }
                        
                        style={{
                            width: "80%"
                        }}/>
                        );
            });
  
            const done = "done";  
        
            const doneCardStacks = tasksState._allTasks?.done.map(task => {
                return (
                    <KanbanCard 
                        highlight={ matchAll(task) } 
                        task={ task } 
                        category={ done } 
                    
                        handleOnCardClick={ handleOnCardClick }

                        style={{
                            width: "80%"
                        }} />
                        );
            });    
  
            columnMp.set("backlog", getColumn(backlogCardStacks, backlog, backlogMeta)); 
            columnMp.set("todo", getColumn(todoCardStacks, todo, todoMeta));
            columnMp.set("inProgress", getColumn(inProgressCardStacks, inProgress, inProgressMeta));
            columnMp.set("done", getColumn(doneCardStacks, done, doneMeta));
      
            setColumnMp(columnMp);
        }
    }, [ 
        tasksState._allTasks, 
        tasksSearchState._activeTags, 
        tasksSearchState._activePriorities,
        tasksSearchState._activeUserEmails 
    ]);
  
    useEffect(() => {
        if(projectsCacheState._activeProject) {
            const projectUUID = projectsCacheState._activeProject.projectUUID;

            const metaMp = new Map();
    
            metaMp.set('backlog', {
                headUUID: projectUUID.uuid1,
                tailUUID: projectUUID.uuid2
            });
  
            metaMp.set('todo', {
                headUUID: projectUUID.uuid3,
                tailUUID: projectUUID.uuid4
            });
  
            metaMp.set('inProgress', {
                headUUID: projectUUID.uuid5,
                tailUUID: projectUUID.uuid6
            });
  
            metaMp.set('done', {
                headUUID: projectUUID.uuid7,
                tailUUID: projectUUID.uuid8
            });
  
            setMetaMp(metaMp);
        }
    }, [ projectsCacheState._activeProject ]);


    // ------------------ Task utils ------------------
    const fetchTasks = (projectId: string, page: number) => {
        const timeout = setTimeout(() => {  
            if(projectsCacheState._activeProject) {
                searchTasksByFilterParams(
                    page, 
                    5000, 
                    projectId, 
                    tasksSearchState._activeTags).then(res => {
                        const tasks = res.tasks;

                        const backlogMeta = metaMp?.get('backlog');
                        const todoMeta = metaMp?.get('todo');
                        const inProgressMeta = metaMp?.get('inProgress');
                        const doneMeta = metaMp?.get('done');

                        if(backlogMeta && todoMeta && inProgressMeta && doneMeta) {
                            dispatch(
                                allTasksUpdate({
                                    backlog: extractTasksForCategory(tasks, 'backlog', backlogMeta),
                                    todo: extractTasksForCategory(tasks, 'todo', todoMeta),
                                    inProgress: extractTasksForCategory(tasks, 'inProgress', inProgressMeta),
                                    done: extractTasksForCategory(tasks, 'done', doneMeta)
                                }));
                        }
                    });
            }
        });
    
        return () => clearTimeout(timeout);
    }

    const extractTasksForCategory = (
        tasks: Array<Task>, 
        category: string, 
        meta: { 
            headUUID: string, 
            tailUUID: string
        }) => {
        const unsortedTasks = tasks.filter(task => task.taskNode.status === stringToEnum(category));

        if(tasks.length > 0) {
            let headTask = undefined;

            const idTaskMp = new Map();
  
            unsortedTasks.forEach(task => {
                if(task.taskNode.headUUID === meta.headUUID) {
                    headTask = task;
                }
    
                idTaskMp.set(task.id, task);
            });
  
            const sortedTasks = [];
  
            if(unsortedTasks.length > 0 && headTask) {
                sortedTasks.push(headTask);
  
                let nthTask = headTask as Task;
  
                while(nthTask.taskNode.tailUUID !== meta.tailUUID) {
                    nthTask = idTaskMp.get(nthTask.taskNode.tailUUID);
                    sortedTasks.push(nthTask);
                }
            }
  
            return sortedTasks;
        }

        return [];
    }

    // ------------------ Owner menu ------------------
    const [ ownerMenuAnchorEl, setOwnerMenuAnchorEl ] = useState(null);

    const handleOnOwnerMenuOpen = (e:any) => {
        setOwnerMenuAnchorEl(e.currentTarget);
    }

    const handleOnOwnerMenuClose = () => {
        setOwnerMenuAnchorEl(null);
    }

    const [ isOwner, setIsOwner ] = useState(false);

    useEffect(() => {
        if(userCacheState._loginedUserEmail === projectsCacheState._activeProject?.userEmail) {
            setIsOwner(true);
        }else {
            setIsOwner(false);
        }
    }, [ userCacheState ]);

    const handleOnCollaboratorAdd = (collaboratorToAddEmail: string) => {
        const activeProject = projectsCacheState._activeProject;

        if(activeProject) {
            const collaboratorEmails = activeProject.collaboratorList.map(collaborator =>  collaborator.email);

            if(collaboratorEmails.indexOf(collaboratorToAddEmail) !== -1) {
                alert("Collaborator already added to the project");

                return;
            }
 
        const updatedCollaborators = [ ...collaboratorEmails, collaboratorToAddEmail ].map(email => {
            return { 
                email: email 
            } as User;
        })
 
        const updatedProject = {
            ... activeProject,
            collaboratorList: updatedCollaborators
        }
 
        updateProjectById(activeProject.id, updatedProject).then(res => {
            alert("Collaborator added");
 
            getProjectById(activeProject.id).then(res => {
                dispatch(updateActiveProject(res));
            });
        }).catch(err => {
            console.log(err);

            alert("Opps, failed to add collaborator")
        });
    }
}

 const handleOnCollaboratorRemove = (collaboratorToRemoveEmail: string) => {
    const activeProject = projectsCacheState._activeProject;

    if(activeProject) {
        const collaboratorEmails = activeProject.collaboratorList.map(collaborator =>  collaborator.email);

        const updatedCollaboratorEmails = collaboratorEmails.filter(email => {
            return email !== collaboratorToRemoveEmail;
        })
 
        if(updatedCollaboratorEmails.length === collaboratorEmails.length) {
            alert("Collaborator not in project");
            return;
        }
 
        const updatedCollaborators = updatedCollaboratorEmails.map(email => {
            return { 
                email: email 
            } as User;
        })
 
        const updatedProject = {
            ... activeProject,
            collaboratorList: updatedCollaborators
        }
 
        updateProjectById(activeProject.id, updatedProject).then(res => {
            alert("Collaborator removed");
 
            getProjectById(activeProject.id).then(res => {
                dispatch(updateActiveProject(res));
            })
        }).catch(err => {
            console.log(err);

            alert("Opps, failed to remove collaborator")
        });
    }
 }

    const handleOnProjectDelete = (e: any) => {
        dispatch(showProjectDeleteDialog())
    }

    // -------------- User list menu --------------
    const [ usersFilterMenuAnchorEl, setUsersFilterMenuAnchorEl ] = useState(null);
    const [ usersFilterMenuShallowOpen, setUsersFilterMenuShallowOpen ] = useState(false);

    const [ userCheckMp, setUserCheckMp ] =  useState<Map<string, boolean> | undefined>(undefined);
 
    const [ userList, setUserList ] = useState<Array<string>>([])

    useEffect(() => {
        if(projectsCacheState._activeProject) {
            const checkMp = new Map();
            checkMp.set(projectsCacheState._activeProject.userEmail, false);

            setUserCheckMp(checkMp);

            const _userList = projectsCacheState._activeProject.collaboratorList.map(user => user.email)
            _userList.push(projectsCacheState._activeProject.userEmail)

            setUserList(_userList)
        }
    }, [ projectsCacheState._activeProject ]);

    useEffect(() => {
        if(projectsCacheState._activeProject) {
            const checkMp = new Map();

            tasksSearchState._activeUserEmails.forEach(email => checkMp.set(email, true));

            setUserCheckMp(checkMp);
        }
    }, [ tasksSearchState._activeUserEmails ]);

    const handleOnUsersFilterMenuClose = () => {
        setUsersFilterMenuShallowOpen(false);
    }

    const handleOnUserAvatarsClick = (e: any) => {
        setUsersFilterMenuAnchorEl(e.currentTarget);
        setUsersFilterMenuShallowOpen(true);
    }

    const handleOnOwnerCheck = (checked: boolean, email: string) => {
        dispatch(checked ? addActiveUserEmail(email) : removeActiveUserEmail(email));
    }

    const handleOnCollaboratorCheck = (checked: boolean, email: string) => {
        dispatch(checked ? addActiveUserEmail(email) : removeActiveUserEmail(email));
    }

    // -------------- Task search filter menu --------------
    const [ taskSearchFilterMenuAnchorEl, setTaskSearchFilterMenuAnchorEl ] = useState(null);
    const [ taskSearchFilterMenuOpen, setTaskSearchFilterMenuOpen ] = useState(false);

    const handleOnTaskSearchFilterMenuShallowClose = () => {
        setTaskSearchFilterMenuOpen(false)
    }

    const handleOnTaskSearchFilterMenuDeepClose = () => {
        setTaskSearchFilterMenuAnchorEl(null);
    }

    const handleOnTaskSearchFilterMenuIconClick = (e: any) => {
        setTaskSearchFilterMenuAnchorEl(e.currentTarget);
        setTaskSearchFilterMenuOpen(true);
    }

    const handleOnTaskSearchFilterMenuPrioritiesCheck = (priorities: Array<string>) => {
        dispatch(selectActivePriorities(priorities));
    }

    const handleOnTaskSearchFilterMenuTagsChange = (tags: Array<string>) => {
        dispatch(updateActiveTags(tags))
    }


    // -------------- Collaborators menu --------------
    const [ collaboratorsMenuAnchorEl, setCollaboratorsMenuAnchorEl ] = useState(null);

    const handleOnCollaboratorsMenuOpen = (e: any) => {
        setCollaboratorsMenuAnchorEl(e.currentTarget);
    }

    const handleOnCollaboratorsMenuClose = () => {
        setCollaboratorsMenuAnchorEl(null);
    }

    const handleOnQuitProject = () => {
        const activeProject = projectsCacheState._activeProject;

        if(activeProject) {
            const activeCollaboratorEmails = activeProject.collaboratorList.map(collaborator => collaborator.email);
     
            const updatedCollaboratorEmails = activeCollaboratorEmails.filter(email => 
                email !== userCacheState._loginedUserEmail);

            const updatedCollaborators = updatedCollaboratorEmails.map(email => {
                return { 
                    email: email 
                } as User;
            });
 
            const updatedProject = {
                ... activeProject,
                collaboratorList: updatedCollaborators
            }
 
            updateProjectById(updatedProject.id, updatedProject).then(res => {
                alert('You are removed from project');

                dispatch(updateActiveProject(undefined));
            }).catch(err => {
                console.log(err);

                alert('Opps, failed to remove yourself from project')
            });
        }
    }



  // ------------------ Style ------------------
  const columnContainerStyle = {
    flexBasis: "25%",
    padding: "8px"
  }

  // ------------------ Column ------------------
  const getHeader = (text: string) => {
    return (
      <div style={{
        width: "100%",
        marginTop: "4px",

        borderRight: text === "Done"? "none" : "2px solid rgba(48, 48, 48, 0.5)",

        fontSize: "24px",
        fontFamily: "'Caveat', cursive",
        textAlign: "center"
        }}>
        <b>{ text }</b>
      </div>
    )
  }

    const getColumn = (
        children: any, 
        category: string, 
        meta: { 
            headUUID: string, 
            tailUUID: string 
        }) => {
        return (
            <KanbanColumn  
                category={ category } 
                meta={ meta } 

                children={ children }

                style={{
                    height: "calc(100vh - 33px)",
                    paddingTop: "18px",
                    borderRight: category === "done"? "none" : "2px solid rgba(48, 48, 48, 0.5)",
                    overflow: "auto",
                }}/>
        )
    }

    return (
        <div style={{ width: "100%" }}>
            <Stack direction="column">
                <Stack 
                    direction="column" 
                    sx={{ 
                        background: "whitesmoke", 
                        paddingLeft: "32px", 
                    }}>
                    <div style={{ padding: "8px" }}>
                        <h1 style={{ 
                            textAlign: "left", 
                            padding: "12px", 
                            margin: "0px" 
                            }}>
                            Project:&nbsp;&nbsp;{ projectsCacheState._activeProject?.name }  
                        </h1>

                        <h3 style={{ 
                            textAlign: "left", 
                            padding: "12px", 
                            margin: "0px" 
                            }}>
                            Description: 
                        </h3>
                    </div>

                    <Divider />

                    <Stack 
                        direction="row" 
                        alignItems="center" 
                        spacing={ 18 }

                        sx={{ 
                            padding: "12px",
                        }}>
                    <Stack 
                        direction="row" 
                        alignItems="center"
                        >
                        <span>Team:&nbsp;&nbsp;&nbsp;</span>

                        <UserList handleOnUserAvatarsClick={ handleOnUserAvatarsClick } />

                        <UserListMenu 
                            userListMenuAnchorEl={ usersFilterMenuAnchorEl }
                            shallowOpen={ usersFilterMenuShallowOpen }

                            userCheckMp={ userCheckMp }
                            userList={ userList }

                            handleOnUsersFilterMenuClose={ handleOnUsersFilterMenuClose } 

                            handleOnOwnerCheck={ (checked: boolean, email: string) => 
                                handleOnOwnerCheck(checked, email) }

                            handleOnCollaboratorCheck={ (checked: boolean, email: string) => 
                                handleOnCollaboratorCheck(checked, email) }
                            />   
                    </Stack>

                    <Stack 
                        direction="row" 
                        alignItems="center"
                        spacing={ 2.4 }
                        >
                        <Stack 
                            direction="row" 
                            alignItems="center"
                            >
                            <span>Filter:&nbsp;&nbsp;&nbsp;</span>

                            <IconButton 
                                onClick={ (e: any) => handleOnTaskSearchFilterMenuIconClick(e) }
                                sx={{ 
                                    color: "rgb(47, 47, 47)", 
                                    borderColor:"rgb(47, 47, 47)" 
                                }}>
                                <TuneIcon />
                            </IconButton>

                            {
                                projectsCacheState._activeProject
                                ?(
                                    <TaskSearchFilterMenu  
                                        shallowOpen={ taskSearchFilterMenuOpen } 
                                        anchorEl={ taskSearchFilterMenuAnchorEl } 

                                        projectId= { projectsCacheState._activeProject.id }

                                        handleOnPrioritiesCheck = { (priorities: Array<string>) => 
                                            handleOnTaskSearchFilterMenuPrioritiesCheck(priorities) }

                                        handleOnTagsChange = { (tags: Array<string>) => 
                                            handleOnTaskSearchFilterMenuTagsChange(tags) }

                                        handleOnClose= { handleOnTaskSearchFilterMenuShallowClose }
                                        />
                                )
                                : null
                            }
                        </Stack>
          
                        <Stack             
                            direction="row" 
                            alignItems="center"
                            >
                            <span>Setting:&nbsp;&nbsp;&nbsp;</span>

                            <IconButton 
                                onClick={ (e: any) => {
                                    if(isOwner) {
                                        // handleOnCollaboratorsMenuOpen(e)
                                        handleOnOwnerMenuOpen(e)
                                    }else {
                                        handleOnCollaboratorsMenuOpen(e)
                                    }
                
                                } }

                                sx={{ 
                                    color: "rgb(47, 47, 47)", 
                                    borderColor:"rgb(47, 47, 47)" 
                                }}>
                                <SettingsSuggestIcon />
                            </ IconButton>

                            <ProjectOwnerMenu 
                                anchorEl={ ownerMenuAnchorEl }
                                open={ Boolean(ownerMenuAnchorEl) }

                                handleOnOwnerMenuClose={ handleOnOwnerMenuClose } 

                                handleOnCollaboratorAdd={ (collaboratorToAddEmail: string) => 
                                    handleOnCollaboratorAdd(collaboratorToAddEmail) } 

                                handleOnCollaboratorRemove={ (collaboratorToRemoveEmail: string) => 
                                    handleOnCollaboratorRemove(collaboratorToRemoveEmail) }

                                handleOnProjectDelete={ handleOnProjectDelete }    
                                />

                            <ProjectCollaboratorMenu
                                anchorEl={ collaboratorsMenuAnchorEl }
                                open={ Boolean(collaboratorsMenuAnchorEl) }

                                handleOnMenuClose={ handleOnCollaboratorsMenuClose }

                                handleOnQuitProject={ handleOnQuitProject }
                                />
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
      
            <Stack 
                direction="row" 
                style={{
                    background: "white",
                }}>
                <div style={ columnContainerStyle }>
                    { getHeader("Backlog") }

                    { columnMp?.get('backlog') } 
                </div>

                <div style={ columnContainerStyle }>
                    { getHeader("To Do") }

                    { columnMp?.get('todo') } 
                </div>

                <div style={ columnContainerStyle }>
                    { getHeader("In Progress") }
                
                    { columnMp?.get('inProgress') }   
                </div>

                <div style={ columnContainerStyle }>
                    { getHeader("Done") }

                    { columnMp?.get('done') } 
                </div>

                {
                    taskToUpdate
                    ? (
                        <TaskUpdateDialog 
                            label="Edit Kanban Card"
                            open={ true }
                            task={ taskToUpdate }
                        
                            handleOnClose={ handleOnCardUpdateDialogClose }
                            handleOnApply={ handleOnCardUpdateDialogApply }
                            handleOnDelete={ handleOnCardUpdateDialogDelete } 
                            />
                    )
                    : null

                }
            </Stack>
        </Stack>
    </div>
    )
}

export default KanbanTable;