const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

const USERS = [
    {
        username: "username",
        password: "password"
    }
];

let loggedUser = null;

function authMiddleware(req, res, next) {
    const base64Authorization = (req.headers.authorization || "").split(" ")[1] || "";
    const [login, password] = Buffer.from(base64Authorization, "base64")
        .toString()
        .split(":");

    const user = USERS.find(user => user.username == login && user.password == password);

    if (!user) {
        res.set("WWW-Authenticate", 'Basic realm="401"');
        res.status(401).send("Authentication required.");
        return;
    }

    loggedUser = user;

    return next();
}

app.use(authMiddleware);

app.get("/", function(req, res) {
    res.send("Hello " + loggedUser.username);
});

app.listen(PORT, () =>
    console.log("Server listening on http://localhost:" + PORT)
);