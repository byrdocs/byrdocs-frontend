import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider"

import './index.css'

import { Toaster } from "@/components/ui/sonner"

import Home from '@/pages/Home.tsx'
import About from '@/pages/About.tsx'
import Notfound from './pages/Notfound';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "*",
    element: <Notfound />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system">
      <RouterProvider router={router}/>
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>,
)
