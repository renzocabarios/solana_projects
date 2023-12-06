const { writeFileSync, copyFile } = require("fs");

const path = "./assets/";

const INSTANCES = 10;

function imagePicker(num) {
  if (num < 20) {
    return 0;
  }

  if (num >= 20 && num < 60) {
    return 1;
  }

  return 2;
}

function typePicker(num) {
  if (num < 20) {
    return "A";
  }

  if (num >= 20 && num < 60) {
    return "B";
  }

  return "C";
}

for (let i = 0; i < INSTANCES; i++) {
  copyFile(`./images/${imagePicker(i)}.png`, `./assets/${i}.png`, (err) => {
    if (err) throw err;
    console.log("source.txt was copied to destination.txt");
  });
  writeFileSync(
    `${path}${i}.json`,
    JSON.stringify(
      {
        name: `BCC 2023 POAP #${i + 1}`,
        symbol: "BCC",
        description: `The BLOKC - Blockchain Campus Conference 2023 POAP #000${
          i + 1
        }.`,
        image: `${i}.png`,
        attributes: [
          {
            trait_type: "Number",
            value: `${i}`,
          },
          {
            trait_type: "Prize Type",
            value: `${typePicker(i)}`,
          },
        ],
        properties: {
          files: [
            {
              uri: `${i}.png`,
              type: "image/png",
            },
          ],
        },
      },
      null,
      2
    ),
    "utf8"
  );
}
try {
  copyFile("./images/0.png", `./assets/collection.png`, (err) => {
    if (err) throw err;
    console.log("source.txt was copied to destination.txt");
  });
  writeFileSync(
    `./assets/collection.json`,
    JSON.stringify(
      {
        name: `The BLOKC BCC 2023`,
        symbol: "BCC",
        description: `The BLOKC - Blockchain Campus Conference 2023 POAP`,
        image: `collection.png`,
        properties: {
          files: [
            {
              uri: `collection.png`,
              type: "image/png",
            },
          ],
        },
      },
      null,
      2
    ),
    "utf8"
  );
  console.log("Data successfully saved to disk");
} catch (error) {
  console.log("An error has occurred ", error);
}

// {
//   "name": "Numbers Collection",
//   "symbol": "NB",
//   "description": "Collection of 10 numbers on the blockchain.",
//   "image": "collection.png",
//   "attributes": [],
//   "properties": {
//     "files": [
//       {
//         "uri": "collection.png",
//         "type": "image/png"
//       }
//     ]
//   }
// }
// {
//   "name": "Number #0002",
//   "symbol": "NB",
//   "description": "Collection of 10 numbers on the blockchain. This is the number 2/10.",
//   "image": "1.png",
//   "attributes": [
//     {
//       "trait_type": "Number",
//       "value": "1"
//     }
//   ],
//   "properties": {
//     "files": [
//       {
//         "uri": "1.png",
//         "type": "image/png"
//       }
//     ]
//   }
// }
