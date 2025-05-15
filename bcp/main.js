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
  try {
    /** @type {{ content: string, file_identifier: string }} */
    const { content, file_identifier } = req.body;
    await save_file({
      content,
      file_identifier,
    });

    return res.json({
      message: "ok",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "error",
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
