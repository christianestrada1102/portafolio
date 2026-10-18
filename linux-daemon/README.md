# Live Sky Daemon

Sends system telemetry to the portfolio `/api/heartbeat` every 10 seconds.  
No npm dependencies — pure Node.js ESM using only built-ins and `/proc`.

## Requirements

- Node.js 18+
- Hyprland (`hyprctl`)
- `playerctl` (optional — for current song)

## Installation

### 1. Edit `config.json`

```json
{
  "endpoint": "https://www.codebynas.dev/api/heartbeat",
  "hostname": "cachyos",
  "publicRepos": ["portafolio", "CotiEstima", ...],
  "appClassMap": { ... }
}
```

- `hostname` — display name shown in the live terminal line
- `publicRepos` — only repos in this list are surfaced (privacy)
- `appClassMap` — maps Hyprland window classes to `editor | terminal | browser | other`

### 2. Create the secret env file

```bash
mkdir -p ~/.config/live-sky
echo "HEARTBEAT_SECRET=be84143ae8b1f5e337dbc1c4ff1c176e66a760868d796baf7bd1881e3478a5e2" > ~/.config/live-sky/env
chmod 600 ~/.config/live-sky/env
```

The secret must match `HEARTBEAT_SECRET` in your Vercel environment variables.

### 3. Install the systemd user service

```bash
cp live-sky.service ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now live-sky
```

### 4. Verify

```bash
# Check it's running
systemctl --user status live-sky

# Watch live logs
journalctl --user -u live-sky -f
```

You should see lines like:
```
[live-sky] 14:32:01 — editor · cpu 12% · ram 6.2/16gb · The Less I Know
```

## Stopping / disabling

```bash
systemctl --user disable --now live-sky
```

## Updating

After pulling new code, restart the service:

```bash
systemctl --user restart live-sky
```

## Privacy

- Raw window titles are **never sent** — only the app category (`editor`, `terminal`, `browser`, `other`)
- Repo names are only surfaced if listed in `publicRepos`
- Song title/artist from `playerctl` is sent as-is (your choice to leave it on)
