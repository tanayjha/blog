# Blog engagement API

Optional Azure Functions API for blog likes, comments, and read counts.

## Local test

```bash
cd engagement-api
npm install
npm run start:local
```

In another terminal:

```bash
HUGO_PARAMS_ENGAGEMENT_ENABLED=true hugo server
```

The Hugo site uses `http://localhost:7071/api` from `config.toml`. If the API is not running, the blog still renders and the engagement widget removes itself.

## Azure deployment

Deploy only after local validation:

```bash
./scripts/deploy.sh tanayjha-blog-rg eastus2 https://tanayjha-blog.vercel.app
```

After deployment, set `params.engagement.apiBaseUrl` to the printed Function API URL and set `params.engagement.enabled = true`.
