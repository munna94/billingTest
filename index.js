const express = require("express");

let app = express();
//this is used to remove cors error while calling the api from clients
//let cors = require("cors");
//app.use(cors());
app.use(
  express.urlencoded({
    extended: false,
    limit: "500mb"
  })
);
app.use(
  express.json({
    limit: "50mb"
  })
);

let categoryMap = {
  food: 10,
  medicine: 20
};
// 5% on medicines and Food
// 5% on clothes below 1000INR and 12% above 1000INR purchase
// 3% on music cds/dvds
// Flat 18% on the imported commodities.
// Books are exempted from tax.

// On every purchase I get a receipt that has the below information :
// Date and Time of purchase
// List of commodities, each with their final price, tax amount with the applicable rate
// Total amount payable
// Additionally a 5% discount is applied by the store if the bill amount exceeds 2000INR. The bill is sorted in the ascending order of the commodity names.

app.post("/calculate", (req, res) => {
  let inputData = req.body;
  //console.log(inputData);
  computeBill(inputData);
  res.status(200).send(inputData);
});

function computeBill(items) {
  let totalTax = 0;
  let totalAmt = 0;

  for (let item of items) {
    item.totalPrice = item.quantity * item.price;
    item.totalTax = getTax(item.itemCategory, item.totalPrice);
    item.totalAmt = item.totalPrice - item.totalTax;
    item.billingdate = new Date();

    totalTax += item.totalTax;
    totalAmt += item.totalAmt;
    // delete item.itemCategory;
  }
  if (totalAmt > 2000) {
    totalAmt = 0.95 * totalAmt;
  }

  console.log("totalTax ", totalTax);
  console.log("totalAmt ", totalAmt);

  // return {
  //     items,
  //     totalTax,
  //     totalAmt
  // }
}

function getTax(category, price) {
  if (categoryMap.containsKey(category)) {
    let taxRate = categoryMap[category];
    return price * (taxRate / 100); //100 to convert from percentage to actual value
  }
  //   if (category == "Clothes") {
  //     if (price < 1000) {
  //       return price * 0.05;
  //     } else {
  //       return price * 0.12;
  //     }
  //   }
  //   if (category == "Music") {
  //     return price * 0.03;
  //   }
  //   if (category == "Imported") {
  //     return price * 0.18;
  //   }
  return price;
}

app.listen(5000, () => {
  console.log(`server started on port 5000`);
});
