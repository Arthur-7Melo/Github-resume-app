import app from "./app";
import { PORT } from "./config";

app.listen(PORT, () => {
  console.log(`API gateway rodando na porta: ${PORT}`)
})