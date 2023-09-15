
const StreamArray = require('stream-json/streamers/StreamArray');
const fs = require('fs');
const dataPath = './data/input.json'


/**
 * Parses a big data file and searches for a specific ID.
 *
 * @param {string} searchId - The ID to search for from the commande line.
 * @return {string} The name associated with the ID, or 'Aucune donnée trouvée' if no match is found.
 */
function bigparsing() {
  const searchId = process.argv[2];

  // Solution whitout memory limit  
  // const result = data.find((element) => element.id === Number(searchId));
  // if (!result) {
  //   return 'Aucune donnée trouvé'
  // }
  // return result.name;

  const stream = fs.createReadStream(dataPath);
  const jsonStream = StreamArray.withParser();
  stream.pipe(jsonStream.input);

  let isDataFound = false;
  jsonStream.on('data', ({ key, value }) => {


    if (value.id === Number(searchId)) {
      console.log(value.name);
      isDataFound = true;
      stream.destroy(); // Kill the stream when one result match
    }
  });

  jsonStream.on('end', () => {
    if (!isDataFound) {
      console.log('Aucune donnée trouvée');
    }
  });
}

bigparsing()