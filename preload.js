const { contextBridge } = require("electron/renderer");
const fs = require("fs");
const path = require("path");

contextBridge.exposeInMainWorld("fs", {
  readFileSync: (...args) => fs.readFileSync(...args),
});

contextBridge.exposeInMainWorld("path", {
  join: (...args) => path.join(...args),
  readUser: () => readUserData(),
  setCompletionsUrl: (url) => writeUserData({ llmUrl: url }),
});

const USER_DATA_PATH = path.join(__dirname, "user_data.json");

const writeUserData = (data) => {
  fs.writeFileSync(USER_DATA_PATH, JSON.stringify(data));
};

const readUserData = () => {
  try {
    if (fs.existsSync(USER_DATA_PATH)) {
      const data = fs.readFileSync(USER_DATA_PATH, "utf-8");
      return JSON.parse(data);
    } else {
      writeUserData({ llmUrl: "http://127.0.0.1:8080/v1/chat/completions" });
      return;
    }
  } catch (error) {
    console.log("Error retrieving user data", error);
    return null;
  }
};
