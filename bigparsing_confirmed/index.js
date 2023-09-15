
import data from './data/input.json' assert{type: "json"}

function bigparsing() {
  const searchId = process.argv[2];
  console.log(typeof searchId)

  const result = data.find((element) => element.id === Number(searchId));

  return result.name;
}

console.log(bigparsing())