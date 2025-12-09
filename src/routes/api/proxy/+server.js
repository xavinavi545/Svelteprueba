import axios from "axios";

export async function POST({ request }) {
	try {
		const contentType = request.headers.get("content-type") || "";

		let url, method, data;

		if (contentType.includes("multipart/form-data")) {
			const form = await request.formData();

			url = form.get("url");
			method = form.get("method")?.toUpperCase() || "POST";

			data = new FormData();
			form.forEach((value, key) => {
				if (key !== "url" && key !== "method") {
					data.append(key, value);
				}
			});
		}

		else {
			const body = await request.json();
			url = body.url;
			method = body.method || "POST";
			data = body.data || {};
		}

		let response;

		if (method === "GET") {
			response = await axios.get(
				`http://98.92.120.34/sveltephp/${url}`,
				{ params: data }
			);
		} else {
			response = await axios.post(
				`http://98.92.120.34/sveltephp/${url}`,
				data,
				{
					headers:
						data instanceof FormData
							? { "Content-Type": "multipart/form-data" }
							: {}
				}
			);
		}

		return new Response(JSON.stringify(response.data), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});

	} catch (error) {
		console.error("Error en proxy:", error);
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
}
