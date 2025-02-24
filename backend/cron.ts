const callApi = async () => {
  try {
    console.log("llamando api");
    await fetch("https://erpraul.com/api/xpos/inventario/cachear");
  } catch (_err) {
    //
  }
};

Deno.cron("Log message", "* 21 * * *", () => {
  console.log("============");
  console.log("GENERANDO CACHE ", new Date().toISOString());
  callApi();
  console.log("============");
});
