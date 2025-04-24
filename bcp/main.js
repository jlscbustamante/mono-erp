import cors from "cors";
import express from "express";
import { save_file } from "./funcs/save_file";

const app = express();
const port = 8080;

app.use(cors()).use(express.json());

// Define a base route
app.get("/", (req, res) => {
  return res.json({
    message: "generar archivos de pago",
  });
});

app.post("/send_file", async (req, res) => {
  await save_file();
  return res.json({
    message: "ok",
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
