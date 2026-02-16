const express = require("express");
const { ServerConfig , Logger} = require('./config')
require("dotenv").config();
const apiRoutes = require('./routes');


 // Importing PORT from config.js
const app = express();
app.use(express.json());




app.use('/api' , apiRoutes);
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});



app.listen(ServerConfig.PORT, () => {
    console.log(`Listening on port ${ServerConfig.PORT}`);
    Logger.info("Successfully started the Server" , {});
});
