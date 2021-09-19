import { cheerio } from "https://deno.land/x/cheerio/mod.ts";
import { default as format } from "https://deno.land/x/date_fns/format/index.js";
import { default as fr } from "https://deno.land/x/date_fns/locale/fr/index.js";
import { default as parse } from "https://deno.land/x/date_fns/parse/index.js";

addEventListener("fetch", async (event) => {
  const data = await fetchData();
  const json = JSON.stringify(data);
  const response = new Response(json, {
    headers: { "content-type": "application/json; charset=UTF-8" },
  });
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

  const [, raw_build, , day, month, year] = version.split(" ");

  const dirtyOptions = new Date();
  const raw_date: Date = parse(
    `${day}-${month}-${year}`,
    "d-LLLL-y",
    dirtyOptions,
    { locale: fr }
  );
  const date: string = format(raw_date, "yyyy-MM-dd", dirtyOptions);

  return { version: raw_build, date, url };
}
