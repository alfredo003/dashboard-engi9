import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";

import App from "./App"; 
import ProductRegistration from "./page/Product";
import CategoryBrandManagement from "./page/Categories";
import ProductTableManager from "./page/Product";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <ProductRegistration /> }, 
      { path: "products", element: <ProductTableManager /> },
      { path: "categories", element: <CategoryBrandManagement /> },
      { path: "portifolio", element: <CategoryBrandManagement /> },
      { path: "*", element: <h1>Página não encontrada</h1> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
