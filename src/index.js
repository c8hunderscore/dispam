const express = require("express"),
      port = process.env.PORT || 1488,
      app = express(),
      path = require("path");

app.use(express.static(path.join(__dirname, "ui")));

app.get("/", (req, res) => {
    res.sendFile("./ui/index.html");
})

app.listen(port, () => {
    console.log("Listening on PORT %d", port);
})
