# Remix Hacker News

## Run locally

Use Node 22.23.3, as pinned in `.node-version`. The current React Router build uses Node APIs removed in Node 26.

```sh
nub node install
nub install
cp .dev.vars.example .dev.vars
nub run dev
```

`.dev.vars` supplies the local `SESSION_SECRET` and is ignored by Git.

## Check the app

```sh
nub run typecheck
nub run test
nub run build
nub exec wrangler deploy --dry-run
```

## Deploy to Cloudflare Workers

Authenticate with the Cloudflare account that owns the `remix-hacker-news` Worker.

```sh
nub exec wrangler login
nub exec wrangler whoami
```

Before the first deployment, generate a random session secret and enter it at Wrangler's prompt. Keep the existing secret on later deployments to preserve sessions.

```sh
nub exec wrangler secret put SESSION_SECRET
nub run deploy
```

The deploy script builds the app and uploads the Worker and client assets. `.dev.vars` values are local only. See [Cloudflare's secrets guide](https://developers.cloudflare.com/workers/configuration/secrets/) for deployed secrets.
