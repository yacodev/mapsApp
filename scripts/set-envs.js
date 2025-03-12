const { writeFileSync, mkdirSync } = require("fs");
require("dotenv").config();

const targetPath = "./src/environments/environment.ts";
const targetPathDev = "./src/environments/environment.development.ts";

const mapboxKey = process.env["MAPBOX_KEY"];

if (!mapboxKey) {
  throw new Error("Environment variable MAPBOX_KEY is missing");
}

const envFileContent = `
export const environment = {
  mapboxKey: '${mapboxKey}',
};
`;

mkdirSync("./src/environments", { recursive: true });
writeFileSync(targetPath, envFileContent);
writeFileSync(targetPathDev, envFileContent);
