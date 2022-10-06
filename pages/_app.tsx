import * as React from 'react';
import { CacheProvider, EmotionCache } from '@emotion/react';

import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import theme from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';

import '../styles/globals.css';
import '../styles/kanban-card.scss';

import { ProjectsCacheProvider } from '../src/providers/projects-cache';
import { TasksCacheProvider } from '../src/providers/tasks-cache';
import { TagsSearchResultPanelProvider } from '../src/providers/tags-search-result-panel';
import { UserCacheProvider } from '../src/providers/user-cache';
import { KanbanDatesProvider } from '../src/providers/dates-cache';
import { TasksSearchProvider } from '../src/providers/tasks-search';
import { TaskCreateProvider } from '../src/providers/task-create';
import { ProjectCreateDialogProvider } from '../src/providers/project-create-dialog';
import { KanbanTableProvider } from '../src/providers/kanban-table';
import { TaskUpdateProvider } from '../src/providers/task-update';
import { ProjectDeleteDialogProvider } from '../src/providers/project-delete-dialog';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (

      <CacheProvider value={ emotionCache }>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          
          <DndProvider backend={ HTML5Backend }>
          <KanbanTableProvider>
          <ProjectDeleteDialogProvider>
          <ProjectCreateDialogProvider>
          <TaskCreateProvider>
          <TaskUpdateProvider>
       
          <TasksSearchProvider>
          <KanbanDatesProvider>
          <UserCacheProvider>
          <ProjectsCacheProvider>
            <TasksCacheProvider>
            <TagsSearchResultPanelProvider>
                        <Component { ...pageProps } />
                    </TagsSearchResultPanelProvider>
            </TasksCacheProvider>
          </ProjectsCacheProvider>
          </UserCacheProvider>
          </KanbanDatesProvider>
          </TasksSearchProvider>
          </TaskUpdateProvider> 
          </TaskCreateProvider>
          </ProjectCreateDialogProvider>
          </ProjectDeleteDialogProvider>
          </KanbanTableProvider>  
          </DndProvider>

        </ThemeProvider>
      </CacheProvider>
  );
}
