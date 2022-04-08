import { serve } from "https://deno.land/std@0.134.0/http/server.ts";
import { default as format } from "https://deno.land/x/date_fns@v2.22.1/format/index.js";
import { default as fr } from "https://deno.land/x/date_fns@v2.22.1/locale/fr/index.js";
import { default as parse } from "https://deno.land/x/date_fns@v2.22.1/parse/index.js";

import data from "./data.json" assert { type: "json" };

console.log("Listening on http://localhost:8000");
await serve(() => {
  const { url, version } = data;
  const [, build, , day, month, year] = version.split(" ");
  const defaultDate = new Date();
  const parsedDate: Date = parse(
    `${day}-${month}-${year}`,
    "d-LLLL-y",
    defaultDate,
    { locale: fr },
  );
  const date = format(parsedDate, "yyyy-MM-dd", defaultDate);

  return new Response(
    JSON.stringify({ version: build, date, url }),
    { headers: { "content-type": "application/json; charset=UTF-8" } },
  );
});
