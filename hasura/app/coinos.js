const { coinos } = require("./api");
const btc = "5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225";

app.post("/bitcoin", auth, async (req, res) => {
  let network = "bitcoin";
  let { liquidAddress, amount } = req.body;
  let { address } = await coinos
    .url("/address")
    .query({ network, type: "bech32" })
    .get()
    .json();

  let { tx } = await coinos
    .url("/liquid/fee")
    .post({ address: liquidAddress, asset: btc, amount, feeRate: 1000 })
    .json();

  let fee = Math.round(100000000 * tx.fee);
  amount += fee;

  await coinos
    .url("/invoice")
    .post({
      liquidAddress,
      tx,
      invoice: {
        address,
        network,
        text: address,
        amount,
      },
    })
    .json();

  res.send({ address, fee });
});

app.post("/lightning", auth, async (req, res) => {
  let { liquidAddress, amount } = req.body;

  let { tx } = await coinos
    .url("/liquid/fee")
    .post({ address: liquidAddress, asset: btc, amount, feeRate: 1000 })
    .json()
    .catch(console.log);

  let fee = Math.round(100000000 * tx.fee);
  amount += fee;

  let text = await coinos.url("/lightning/invoice").post({ amount }).text();

  await coinos
    .url("/invoice")
    .post({
      liquidAddress,
      tx,
      invoice: {
        network: "lightning",
        text,
        amount,
      },
    })
    .json();

  res.send({ address: text, fee });
});
