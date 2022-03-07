This folder contains all the webpages for AlgoRent. Our React application uses this folder to route to the referenced webpage.

To redirect user from one page to another, use the following imports:

`import { BrowserRouter, Routes, Route, Link as RouteLink } from "react-router-dom";`

Note: If you have not installed react-router-dom, use:
`nvm i react-router-dom`

Chakra UI has its own "Link" tag, so we import React's Link as RouteLink.