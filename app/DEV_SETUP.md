# Lahmacun Radio Frontend - Local Development Setup

## Environment Setup

1. **Copy the environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Configure ARCSI_TOKEN:**
    - The `ARCSI_TOKEN` is required to fetch schedule and show data from the Arcsi API.
    - It is sent as the `authentication-token` request header by the custom `$axios` plugin.
    - The token is currently exposed via Nuxt `runtimeConfig.public.arcsiToken` for client-side requests.
    - Only keep it public if it is a read-only token. If it grants privileged access, move it to the private section in `nuxt.config.js` and create server API proxy routes (e.g. `/server/api/arcsi/*`) to attach the header server-side.
    - Update `.env` with your token:
       ```
       ARCSI_TOKEN=your_actual_token_here
       ```

3. **WordPress/News endpoints:**
   - News and other WordPress content endpoints don't require authentication
   - They will work automatically without any token

## Running the Development Server

```bash
cd app
npm install
npm run dev
```

The dev server will start at `http://localhost:3333` (or next available port).

## What Should Load

- **News section**: Should display recent posts from WordPress (no token needed)
- **Schedule section**: Requires `ARCSI_TOKEN` to be set, otherwise will show "Loading schedule..."
- **Arcsi Latest**: Episode data from Arcsi API (requires token)

## Troubleshooting

### Schedule/Shows not loading
- Verify `ARCSI_TOKEN` is set in your `.env` file
- Check the token is valid and not expired
- Confirm the header name is `authentication-token` (lowercase); the plugin sets this automatically
- Restart the dev server after updating `.env`

### News not loading
- Check your network connection
- Verify the WordPress API at `https://cms.lahmacun.hu/wp-json/wp/v2` is accessible

### Port conflicts
If port 3333 is already in use:
```bash
npm run dev -- --port 3082
```
