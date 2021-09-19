import { cheerio } from "https://deno.land/x/cheerio@1.0.4/mod.ts";
import { default as format } from "https://deno.land/x/date_fns@v2.22.1/format/index.js";
import { default as fr } from "https://deno.land/x/date_fns@v2.22.1/locale/fr/index.js";
import { default as parse } from "https://deno.land/x/date_fns@v2.22.1/parse/index.js";

addEventListener("fetch", async (event) => {
  const data = await fetchData();
  const json = JSON.stringify(data);
  const response = new Response(json, {
    headers: { "content-type": "application/json; charset=UTF-8" },
  });
  // @ts-ignore-next-line
  event.respondWith(response);
});

async function fetchData() {
  const res = await fetch(
    "https://www.net-entreprises.fr/declaration/outils-de-controle-dsn-val/"
  );
  const html = await res.text();

  const $ = cheerio.load(html);
  const version = $("table strong").first().text().trim();
  const url = $("table strong a").attr("href");

  const [, build, , day, month, year] = version.split(" ");

  const defaultDate = new Date();
  const parsedDate: Date = parse(
    `${day}-${month}-${year}`,
    "d-LLLL-y",
    defaultDate,
    { locale: fr }
  );
  const date = format(parsedDate, "yyyy-MM-dd", defaultDate);

  return { version: build, date, url };
}
