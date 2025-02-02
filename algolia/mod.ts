import type { App, AppContext as AC } from "deco/mod.ts";
import { createFetchRequester } from "npm:@algolia/requester-fetch@4.20.0";
import algolia from "npm:algoliasearch@4.20.0";
import manifest, { Manifest } from "./manifest.gen.ts";

export type AppContext = AC<ReturnType<typeof App>>;

export interface State {
  /**
   * @title Your Algolia App ID
   * @description https://dashboard.algolia.com/account/api-keys/all
   */
  applicationId: string;

  /**
   * @title Admin API Key
   * @description https://dashboard.algolia.com/account/api-keys/all
   * @format password
   */
  adminApiKey: string;
}

/**
 * @title algolia
 */
export default function App(
  props: State,
) {
  const { applicationId, adminApiKey } = props;
  const client = algolia.default(applicationId, adminApiKey, {
    requester: createFetchRequester(), // Fetch makes it perform mutch better
  });

  const state = { client };

  const app: App<Manifest, typeof state> = {
    manifest: {
      ...manifest,
      actions: {
        ...manifest.actions,
        "algolia/actions/setup.ts": {
          ...manifest.actions["algolia/actions/setup.ts"],
          default: (p, req, ctx) =>
            manifest.actions["algolia/actions/setup.ts"].default(
              { ...props, ...p },
              req,
              ctx,
            ),
        },
      },
    },
    state,
  };

  return app;
}
