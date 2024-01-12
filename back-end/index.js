import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "user",
  password: "user",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.get("/login", async (req, res) => {
  const result = await db.query(
    "SELECT * FROM user_data WHERE email = $1 AND password = $2",
    [req.query.email, req.query.password]
  );
  const userData = result.rows.map(({ id, email }) => ({ id, email }));

  res.send(userData);
});

app.post("/sign-up", async (req, res) => {
  //   const email = "test@gmail.com";
  //   const password = "1234";
  console.log("req", req.body);
  const result = await db.query(
    "SELECT * FROM user_data WHERE email = $1 AND password = $2",
    [req.body.email, req.body.password]
  );
  if (result.rows.length) {
    res.send({ message: "User already exist with this email", status: false });
  } else {
    try {
      await db.query("INSERT INTO user_data (email,password) VALUES ($1, $2)", [
        req.body.email,
        req.body.password,
      ]);
      res.send({ message: "Sign up successfully", status: true });
    } catch (err) {
      console.log(err);
    }
  }
});

app.listen(5678, () => {
  console.log("Listening on port number 5678");
});
