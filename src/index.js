const express = require("express"),
      port = process.env.PORT || 1488,
      app = express(),
      path = require("path");

app.use(express.static(path.join(__dirname, "ui")));

app.get("/", (req, res) => {
    res.sendFile("./ui/index.html");
})

app.get("*", (req, res) => {
    console.log(`IP: ${req.ip} | ${req.url}`); // work nigger
})

app.listen(port, () => {
    console.log("Listening on PORT %d", port);
})