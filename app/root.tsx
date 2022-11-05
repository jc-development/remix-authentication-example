import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
} from "@remix-run/react";

import styles from "./styles/app.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Quote Wall App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-purple-100 relative px-5">
        <div className="mt-20 w-full max-w-screen-lg mx-auto">
          <Outlet />
        </div>
        <LiveReload />
      </body>
    </html>
  );
}
