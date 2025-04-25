import cors from "cors";
import express from "express";
import { save_file } from "./funcs/save_file.js";

const app = express();
const port = 2221;

app.use(cors()).use(express.json());

// Define a base route
app.get("/", (req, res) => {
  console.log("Request received at /");
  return res.json({
    message: "generar archivos de pago",
  });
});

app.post("/send_file", async (req, res) => {
  /** @type {{ content: string }} */
  const { content } = req.body;
  await save_file({
    content,
  });

  return res.json({
    message: "ok",
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
