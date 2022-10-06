import { useMemo, createContext, useReducer, useContext } from "react";
import { initialState, TagsSearchResultPanelReducer } from "../stores/kanban-tags-search-result-panel-reducer";

interface TagsSearchResultPanelContext {
  state: {
    mouseOver: boolean
  },
  Dispatch: any
}

const KanbanTagsSearchResultPanelContext = createContext<TagsSearchResultPanelContext>();

export function KanbanTagsSearchResultPanelProvider ({ children }) {
  const [ state, Dispatch ] = useReducer(TagsSearchResultPanelReducer, initialState);

  const contextValue = useMemo(() => {
    return { state, Dispatch };
  }, [ state, Dispatch ]);

  return (
    <KanbanTagsSearchResultPanelContext.Provider value={ contextValue }>
      { children }
    </KanbanTagsSearchResultPanelContext.Provider>
  );
}

export function useKanbanTagsSearchResultPanelContext() {
  return useContext(KanbanTagsSearchResultPanelContext);
}