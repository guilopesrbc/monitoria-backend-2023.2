import Express, { json } from "express";
import { authRouter } from "./routes/auth.js";
import { userRouter } from "./routes/user.js";
import { postsRouter } from "./routes/posts.js";

const app = Express();
app.use(json());

app.use("/user", userRouter);

app.use("/auth", authRouter);

app.use("/posts", postsRouter);

app.post("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("App is running ");
});
