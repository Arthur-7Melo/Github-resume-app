import app from "./app";
import { PORT } from "./config";

app.listen(PORT, () => {
  console.log(`Insights Service rodando na porta: ${PORT}`)
})