import { useMemo, createContext, useReducer, useContext } from "react";
import { initialState, TagsSearchResultPanelReducer } from "../stores/tags-search-result-panel-reducer";

interface TagsSearchResultPanelContext {
  state: {
    mouseOver: boolean
  },
  Dispatch: any
}

const TagsSearchResultPanelContext = createContext<TagsSearchResultPanelContext>({
  state: {
    mouseOver: false
  },
  Dispatch: undefined
});

export function TagsSearchResultPanelProvider ({ children }: { children: any }) {
  const [ state, Dispatch ] = useReducer(TagsSearchResultPanelReducer, initialState);

  const contextValue = useMemo(() => {
    return { state, Dispatch };
  }, [ state, Dispatch ]);

  return (
    <TagsSearchResultPanelContext.Provider value={ contextValue }>
      { children }
    </TagsSearchResultPanelContext.Provider>
  );
}

export function useTagsSearchResultPanelContext() {
  return useContext(TagsSearchResultPanelContext);
}