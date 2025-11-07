# Lahmacun Radio Frontend - Local Development Setup

## Environment Setup

1. **Copy the environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Configure ARCSI_TOKEN:**
   - The `ARCSI_TOKEN` is required to fetch schedule and show data from the Arcsi API
   - Get the token from your team or server admin
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
- Restart the dev server after updating `.env`

### News not loading
- Check your network connection
- Verify the WordPress API at `https://cms.lahmacun.hu/wp-json/wp/v2` is accessible

### Port conflicts
If port 3333 is already in use:
```bash
npm run dev -- --port 3082
```
