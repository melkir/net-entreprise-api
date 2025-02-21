import data from "./data.json" with { type: "json" };

console.log("Listening on http://localhost:8000");

Deno.serve(() => {
	const { url, version } = data;
	const [, build, , day, month, year] = version.split(" ");

	// Convert month name to number (French months)
	const monthNames = [
		"janvier",
		"février",
		"mars",
		"avril",
		"mai",
		"juin",
		"juillet",
		"août",
		"septembre",
		"octobre",
		"novembre",
		"décembre",
	];

	const monthNumber = (monthNames.indexOf(month.toLowerCase()) + 1)
		.toString()
		.padStart(2, "0");

	// Create date string in yyyy-MM-dd format
	const date = `${year}-${monthNumber}-${day.padStart(2, "0")}`;

	return new Response(JSON.stringify({ version: build, date, url }), {
		headers: { "content-type": "application/json; charset=UTF-8" },
	});
});
