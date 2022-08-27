import "dotenv/config";

import express from "express";

import Youtube from "./services/youtube";
import Twitch from "./services/twitch";

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

(async () => {
  try {
    const yt = await Youtube.init({ channelId: "UC9YUii4XC_prj5jqb4u5TUg" });
    const tw = await Twitch.init({ channelName: "geryan" });
    yt.on("chatMessage", (msg) => {
      tw.sendMessage(`${msg.author} (YT): ${msg.text}`);
    });
    tw.on("chatMessage", (msg) => {
      yt.sendMessage(`${msg.author} (TW): ${msg.text}`);
    });
  } catch (e) {
    console.error(e);
  }
})();

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => console.log(`Listening on port ${port}`));
