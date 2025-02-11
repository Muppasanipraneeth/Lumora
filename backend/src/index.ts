import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running with TypeScript! 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
