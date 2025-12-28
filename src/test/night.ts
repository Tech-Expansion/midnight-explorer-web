async function main() {
  const res = await fetch("https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=NIGHT", {
  method: "GET",
  headers: {
    "X-CMC_PRO_API_KEY": "c4570f87eaf24fecbc59ae080ddba67f",
    "Accept": "application/json"
  }
})
  const json = await res.json();
  
 
  console.log(
    await json.data
  );
  console.log("Qoute: ", await json.data.NIGHT.quote.USD);
}

main();
