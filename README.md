# NodeBox 🎮

A modern web-based control center for managing your PC, displays, audio devices, and gaming setup through a sleek glassmorphism interface.

## ✨ Features

- **PC Management**: Shutdown and lock your computer remotely
- **Display Control**: Toggle TV on/off and switch primary displays
- **Audio Management**: Switch between headphones and TV audio
- **Gaming Mode**: Quick access to Steam Big Picture and Station Mode
- **Modern UI**: Beautiful glassmorphism design with responsive layout

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- Windows OS (for system commands)
- [MultiMonitorTool](https://www.nirsoft.net/utils/multi_monitor_tool.html) by NirSoft
- [NirCmd](https://www.nirsoft.net/utils/nircmd.html) by NirSoft

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/rusherdv/nodebox
   cd nodebox
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Download required tools**

   - Download [MultiMonitorTool.exe](https://www.nirsoft.net/utils/multi_monitor_tool.html)
   - Download [nircmd.exe](https://www.nirsoft.net/utils/nircmd.html)
   - Place both files in the `tools/` directory

4. **Configure your setup**
   Edit the configuration variables in `server.js`:

   ```javascript
   const ID_TV = 2; // Your TV display ID
   const ID_MONITOR_PC = 3; // Your primary monitor ID
   ```

5. **Start the server**

   ```bash
   npm start
   ```

6. **Open in browser**
   Navigate to `http://localhost:2498`

## ⚙️ Configuration

### Display IDs

To find your display IDs:

1. Run MultiMonitorTool.exe
2. Note the display numbers for your TV and primary monitor
3. Update the constants in `server.js`:
   ```javascript
   const ID_TV = 2; // Replace with your TV ID
   const ID_MONITOR_PC = 3; // Replace with your monitor ID
   ```

### Audio Device Names

Update audio device names in `server.js` to match your system:

```javascript
// In /audio/headphones endpoint
setdefaultsounddevice "Headphones"  // Replace with your headphones name

// In /audio/tv endpoint
setdefaultsounddevice "AndroidTV"   // Replace with your TV audio name
```

### Port Configuration

Change the server port if needed:

```javascript
const port = 2498; // Default port
```

## 🎯 API Endpoints

### PC Management

- `GET /shutdown` - Shutdown the computer
- `GET /lock` - Lock the computer

### Display Control

- `GET /toggle-tv` - Toggle TV display on/off
- `GET /alternate-primary` - Switch primary display between TV and monitor

### Audio Management

- `GET /audio/headphones` - Set headphones as default audio device
- `GET /audio/tv` - Set TV as default audio device

### Gaming

- `GET /steam-big-picture` - Launch Steam Big Picture Mode
- `GET /station-mode` - Activate gaming mode (enable TV, set as primary, launch Steam)

### Web Interface

- `GET /` - Main web interface

## 🎮 Usage Examples

### Station Mode

Perfect for gaming sessions:

1. Enables TV display
2. Sets TV as primary display
3. Launches Steam Big Picture Mode
4. Switches audio to TV (if configured)

### Quick Display Switch

Toggle between desktop and TV setup:

1. Use "Toggle TV" to enable/disable TV
2. Use "Toggle Primary Display" to switch main screen

### Audio Control

Switch audio output on the fly:

1. "Set Headphones" for private listening
2. "Set TV Audio" for room audio

## 🛠️ File Structure

```
nodebox/
├── server.js           # Main server file
├── package.json        # Dependencies and scripts
├── tools/
│   ├── MultiMonitorTool.exe  # Display management tool
│   └── nircmd.exe           # System command tool
└── README.md          # This file
```

## 🎨 Web Interface

The web interface features:

- **Glassmorphism Design**: Modern translucent UI elements
- **Responsive Layout**: Works on desktop and mobile
- **Toast Notifications**: Real-time feedback for actions
- **Confirmation Dialogs**: Safety prompts for destructive actions
- **Organized Sections**: Grouped functionality for easy navigation

## 🔧 Troubleshooting

### Common Issues

**Tools not found**

- Ensure `MultiMonitorTool.exe` and `nircmd.exe` are in the `tools/` directory
- Check file permissions

**Display commands not working**

- Verify display IDs using MultiMonitorTool
- Update `ID_TV` and `ID_MONITOR_PC` constants

**Audio switching fails**

- Check audio device names in Windows Sound settings
- Update device names in the audio endpoints

**Steam Big Picture doesn't launch**

- Ensure Steam is installed and running
- Check that Steam is logged in

### Debug Mode

Add console logging for debugging:

```javascript
console.log("Command executed:", command);
```

## 📱 Mobile Access

The interface is fully responsive and works on mobile devices. Access it from your phone by connecting to the same network and navigating to `http://[your-pc-ip]:2498`.

## 🔒 Security Notes

- This tool is designed for local network use
- Be cautious when exposing the server to external networks
- Consider adding authentication for production use

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [NirSoft](https://www.nirsoft.net/) for the excellent system utilities
- [Toastify](https://github.com/apvarun/toastify-js) for toast notifications
- [Express.js](https://expressjs.com/) for the web framework
