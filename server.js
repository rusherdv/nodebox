const express = require("express");
const { exec } = require("child_process");
const app = express();
const port = 2498;

const multiMonitorToolRoute = '"./tools/MultiMonitorTool.exe"';
const nirCmdRoute = '"./tools/nircmd.exe"';
const ID_TV = 2;
const ID_MONITOR_PC = 1;

let tvOn = false;
let primaryDisplay = ID_MONITOR_PC;

app.get("/shutdown", (req, res) => {
  exec("shutdown /s /t 0", (error) => {
    if (error) {
      console.error("Error shutting down PC:", error);
      return res.status(500).send("Could not shut down PC.");
    }
    res.send("PC shutting down...");
  });
});

app.get("/lock", (req, res) => {
  exec("rundll32.exe user32.dll,LockWorkStation", (error) => {
    if (error) {
      console.error("Error locking PC:", error);
      return res.status(500).send("Could not lock PC.");
    }
    res.send("PC locked. Enter your password to resume.");
  });
});

app.get("/toggle-tv", (req, res) => {
  if (!tvOn) {
    exec(`${multiMonitorToolRoute} /enable ${ID_TV}`, (err) => {
      if (err) {
        console.error("Error turning on TV:", err);
        return res.status(500).send("Error turning on TV.");
      }
      tvOn = true;
      res.send("TV turned on.");
    });
  } else {
    exec(`${multiMonitorToolRoute} /disable ${ID_TV}`, (err) => {
      if (err) {
        console.error("Error turning off TV:", err);
        return res.status(500).send("Error turning off TV.");
      }
      tvOn = false;
      res.send("TV turned off.");
    });
  }
});

app.get("/alternate-primary", (req, res) => {
  const target = primaryDisplay === ID_MONITOR_PC ? ID_TV : ID_MONITOR_PC;
  exec(`${multiMonitorToolRoute} /SetPrimary ${target}`, (err) => {
    if (err) {
      console.error("Error switching primary display:", err);
      return res.status(500).send("Error switching primary display.");
    }
    primaryDisplay = target;
    res.send(`Primary display set to ${target == 2 ? "TV" : "PC"}`);
  });
});

app.get("/station-mode", (req, res) => {
  exec(`${multiMonitorToolRoute} /enable ${ID_TV}`, () => {
    exec(`${multiMonitorToolRoute} /SetPrimary ${ID_TV}`, () => {
      tvOn = true;
      setTimeout(() => {
        exec("start steam://open/bigpicture", (err) => {
          if (err) {
            console.error("Error opening Steam Big Picture:", err);
            return res.status(500).send("Error opening Steam Big Picture.");
          }
          res.send("Steam Big Picture opened.");
        });
        res.send("Station Mode started: TV primary and game launched.");
      }, 2000);
    });
  });
});

app.get("/steam-big-picture", (req, res) => {
  exec("start steam://open/bigpicture", (err) => {
    if (err) {
      console.error("Error opening Steam Big Picture:", err);
      return res.status(500).send("Error opening Steam Big Picture.");
    }
    res.send("Steam Big Picture opened.");
  });
});

app.get("/audio/headphones", (req, res) => {
  exec(`${nirCmdRoute} setdefaultsounddevice "Headphones"`, (err) => {
    if (err) {
      console.error("Error setting headphones audio:", err);
      return res.status(500).send("Error setting headphones.");
    }
    res.send("Headphones set as default audio device.");
  });
});

app.get("/audio/tv", (req, res) => {
  exec(`${nirCmdRoute} setdefaultsounddevice "AndroidTV"`, (err) => {
    if (err) {
      console.error("Error setting TV audio:", err);
      return res.status(500).send("Error setting TV audio.");
    }
    res.send("TV set as default audio device.");
  });
});

app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NodeBox</title>
    <link
      rel="stylesheet"
      type="text/css"
      href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css"
    />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          sans-serif;
        font-weight: 300;
        background: conic-gradient(at bottom right, #1d4ed8, #1e40af, #111827);
        min-height: 100vh;
        color: white;
        overflow-x: hidden;
      }

      .container {
        max-width: 400px;
        margin: 0 auto;
        padding: 20px;
        position: relative;
        z-index: 1;
      }

      .power-button {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 50px;
        padding: 12px 24px;
        color: white;
        font-size: 14px;
        font-weight: 300;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .power-button:hover {
        background: white;
        color: black;
        transform: translateX(-50%) translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        border-color: rgba(255, 255, 255, 0.8);
      }

      .power-icon {
        width: 16px;
        height: 16px;
        border: 2px solid currentColor;
        border-radius: 50%;
        position: relative;
      }

      .power-icon::before {
        content: "";
        position: absolute;
        top: -6px;
        left: 50%;
        transform: translateX(-50%);
        width: 2px;
        height: 8px;
        background: currentColor;
      }

      .profile-section {
        text-align: center;
        margin-bottom: 40px;
        margin-top: 60px;
      }

      .profile-title {
        font-size: 40px;
        font-weight: 300;
        margin-bottom: 20px;
        background: linear-gradient(135deg, #fff, #a0aec0);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .content-container {
        display: flex;
        flex-direction: column;
        gap: 30px;
      }

      .section {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .section-title {
        font-size: 14px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.7);
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 8px;
        padding-left: 5px;
      }

      .buttons-container {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .glass-button {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 50px;
        padding: 18px 25px;
        color: white;
        text-decoration: none;
        font-size: 16px;
        font-weight: 300;
        text-align: center;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        cursor: pointer;
      }

      .glass-button:hover {
        background: white;
        color: black;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        border-color: rgba(255, 255, 255, 0.8);
      }

      .glass-button:active {
        transform: translateY(0);
      }

      /* Responsive design */
      @media (max-width: 480px) {
        .container {
          padding: 15px;
        }

        .profile-title {
          font-size: 20px;
        }

        .glass-button {
          font-size: 14px;
          padding: 15px 20px;
        }

        .section-title {
          font-size: 12px;
        }

        .power-button {
          padding: 10px 20px;
          font-size: 12px;
        }
      }

      /* Additional glass effects */
      .glass-button:nth-child(odd) {
        background: rgba(120, 119, 198, 0.1);
      }

      .glass-button:nth-child(even) {
        background: rgba(255, 119, 198, 0.1);
      }

      .glass-button:nth-child(odd):hover,
      .glass-button:nth-child(even):hover {
        background: white;
        color: black;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="profile-section">
        <h1 class="profile-title">NodeBox</h1>
      </div>

      <div class="content-container" id="contentContainer"></div>
    </div>

    <script>
      const structure = [
        {
          title: "TV Management",
          options: [
            { value: "Toggle TV", function: handleToggleTv },
            { value: "Toggle Primary Display", function: handleTogglePrimaryDisplay },
            { value: "Station Mode", function: handleStationMode }
          ]
        },
        {
          title: "Games Management",
          options: [
            { value: "Steam Big Picture Mode", function: handleSteamBigPicture }
          ]
        },
        {
          title: "Audio Management",
          options: [
            { value: "Set Headphones as Default Audio", function: handleSetHeadphonesDefault },
            { value: "Set TV as Default Audio", function: handleSetTvDefault }
          ]
        },
        {
          title: "PC Management",
          options: [
            { value: "Shutdown PC", function: handleShutdownPc },
            { value: "Lock PC", function: handleLockPc }
          ]
        }
      ];

      function handleToggleTv() {
        if (confirm("Confirm toggling the TV?")) {
          Toastify({ text: "Executing TV toggle...", duration: 3000 }).showToast();
          fetch('/toggle-tv').then(res => res.text()).then(msg => Toastify({ text: msg, duration: 3000 }).showToast());
        }
      }

      function handleTogglePrimaryDisplay() {
        if (confirm("Confirm switching primary display?")) {
          Toastify({ text: "Switching primary display...", duration: 3000 }).showToast();
          fetch('/alternate-primary').then(res => res.text()).then(msg => Toastify({ text: msg, duration: 3000 }).showToast());
        }
      }

      function handleStationMode() {
        if (confirm("Confirm activating Station Mode?")) {
          Toastify({ text: "Activating Station Mode...", duration: 3000 }).showToast();
          fetch('/station-mode').then(res => res.text()).then(msg => Toastify({ text: msg, duration: 3000 }).showToast());
        }
      }

      function handleSteamBigPicture() {
        if (confirm("Confirm opening Steam Big Picture Mode?")) {
          Toastify({ text: "Launching Steam Big Picture Mode...", duration: 3000 }).showToast();
          fetch('/steam-big-picture').then(res => res.text()).then(msg => Toastify({ text: msg, duration: 3000 }).showToast());
        }
      }

      function handleSetHeadphonesDefault() {
        if (confirm("Confirm setting headphones as default audio device?")) {
          Toastify({ text: "Setting headphones as default...", duration: 3000 }).showToast();
          fetch('/audio/headphones').then(res => res.text()).then(msg => Toastify({ text: msg, duration: 3000 }).showToast());
        }
      }

      function handleSetTvDefault() {
        if (confirm("Confirm setting TV as default audio device?")) {
          Toastify({ text: "Setting TV as default...", duration: 3000 }).showToast();
          fetch('/audio/tv').then(res => res.text()).then(msg => Toastify({ text: msg, duration: 3000 }).showToast());
        }
      }

      function handleShutdownPc() {
        if (confirm("Confirm shutting down the PC?")) {
          Toastify({ text: "Shutting down PC...", duration: 3000 }).showToast();
          fetch('/shutdown').then(res => res.text()).then(msg => Toastify({ text: msg, duration: 3000 }).showToast());
        }
      }

      function handleLockPc() {
        if (confirm("Confirm locking the PC?")) {
          Toastify({ text: "Locking PC...", duration: 3000 }).showToast();
          fetch('/lock').then(res => res.text()).then(msg => Toastify({ text: msg, duration: 3000 }).showToast());
        }
      }

      function generateContent() {
        const container = document.getElementById("contentContainer");

        structure.forEach((section) => {
          const sectionDiv = document.createElement("div");
          sectionDiv.className = "section";

          const titleDiv = document.createElement("div");
          titleDiv.className = "section-title";
          titleDiv.textContent = section.title;
          sectionDiv.appendChild(titleDiv);

          const buttonsContainer = document.createElement("div");
          buttonsContainer.className = "buttons-container";

          section.options.forEach((option) => {
            const button = document.createElement("button");
            button.className = "glass-button";
            button.textContent = option.value;
            button.onclick = option.function;
            buttonsContainer.appendChild(button);
          });

          sectionDiv.appendChild(buttonsContainer);
          container.appendChild(sectionDiv);
        });
      }

      document.addEventListener("DOMContentLoaded", generateContent);
    </script>
    <script
      type="text/javascript"
      src="https://cdn.jsdelivr.net/npm/toastify-js"
    ></script>
  </body>
</html>

  `);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
