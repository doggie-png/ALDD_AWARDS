const cron = require("node-cron");
const actualizarMetricas = require("../scripts/updateTopGames");

cron.schedule("* * * * *", async () => {
  console.log("Ejecutando tarea de actualización de métricas...");
  await actualizarMetricas();
});
