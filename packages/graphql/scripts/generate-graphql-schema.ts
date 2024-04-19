import fs from "fs/promises";
import { printSchema } from "graphql";

import { unwrappedSchema } from "../src/schema";

async function run() {
  await fs.writeFile("schema.graphql", printSchema(unwrappedSchema));
}

run()
  .then(async () => {
    // eslint-disable-next-line no-console
    console.log("Schema generation completed.");
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error("Schema generation failed.", e);
    process.exit(1);
  });
