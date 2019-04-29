var express = require("express");
var app = express();
//routes
var indexRoute = require("./route/index");


app.set("view engine", "ejs");

app.use(require("express-session")({
    secret: "very secret key",
    resave: false,
    saveUnitialized: false
}));

app.use(express.static(__dirname + "/public"));
app.use(indexRoute);

app.listen(3000, '0.0.0.0', function(){
    console.log("Server has started ....");
})