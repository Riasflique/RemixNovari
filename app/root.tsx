import React from "react";
import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import navStyles from "@navikt/ds-css/dist/index.css";
import {LayoutAppbar} from '~/components/layout-appbar';
import { Box, Page, BodyShort } from "@navikt/ds-react";

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
  useRouteError
} from "@remix-run/react";
import MeApi from "~/api/me-api";
import {json} from "@remix-run/node";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }, { rel: "stylesheet", href: navStyles }] : []),
];
/*
export async function loader(){
  const displayName = await MeApi.fetchDisplayName();
  return json({ displayName });
}
*/


export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
      <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
      Something went wrong.
      <Scripts />
      </body>
      </html>
  );
}

export default function App() {
  // const { displayName } = useLoaderData();
  return (
      <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>

      <Page
          footer={
            <Box background="grayalpha-100" padding="8" as="footer">
              <Page.Block gutters width="lg">
                <BodyShort><Link to={'#'}>Til Toppen</Link></BodyShort>
                Footer from root
              </Page.Block>
            </Box>
          }
      >
        <Box
            background="grayalpha-100"
            padding="8"
            as="header"
        >
          <Page.Block gutters>
            <LayoutAppbar />
          </Page.Block>
        </Box>

        <Box
            // background="surface-alt-4-moderate"
            padding="1"
            paddingBlock="2"
            as="main"
        >
          <Page.Block gutters>
            <Outlet />
          </Page.Block>
        </Box>
      </Page>

      <ScrollRestoration />
      <Scripts />
      {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
      </html>
  );
}
