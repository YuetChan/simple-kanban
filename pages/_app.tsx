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

import { KanbanProjectsProvider } from '../src/providers/kanban-projects';
import { KanbanTasksProvider } from '../src/providers/kanban-tasks';
import { KanbanTagsSearchResultPanelProvider } from '../src/providers/kanban-tags-search-result-panel';
import { KanbanUsersProvider } from '../src/providers/kanban-users';
import { KanbanDatesProvider } from '../src/providers/kanban-dates';
import { KanbanDrawerProvider } from '../src/providers/kanban-drawer';
import { KanbanCardCreateProvider } from '../src/providers/kanban-card-create';
import { KanbanProjectCreateDialogProvider } from '../src/providers/kanban-project-create-dialog';
import { KanbanTableProvider } from '../src/providers/kanban-table';
import { KanbanCardUpdateProvider } from '../src/providers/kanban-card-update';
import { KanbanProjectDeleteDialogProvider } from '../src/providers/kanban-project-delete-dialog';

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
          <KanbanProjectDeleteDialogProvider>
          <KanbanProjectCreateDialogProvider>
          <KanbanCardCreateProvider>
          <KanbanCardUpdateProvider>
       
          <KanbanDrawerProvider>
          <KanbanDatesProvider>
          <KanbanUsersProvider>
          <KanbanProjectsProvider>
            <KanbanTasksProvider>
            <KanbanTagsSearchResultPanelProvider>
                        <Component { ...pageProps } />
                    </KanbanTagsSearchResultPanelProvider>
            </KanbanTasksProvider>
          </KanbanProjectsProvider>
          </KanbanUsersProvider>
          </KanbanDatesProvider>
          </KanbanDrawerProvider>
          </KanbanCardUpdateProvider> 
          </KanbanCardCreateProvider>
          </KanbanProjectCreateDialogProvider>
          </KanbanProjectDeleteDialogProvider>
          </KanbanTableProvider>  
          </DndProvider>

        </ThemeProvider>
      </CacheProvider>
  );
}
