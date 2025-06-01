import promBundle from "express-prom-bundle";
import client from "prom-client";

// Use global to avoid duplicate metric registration on hot reloads
if (!global.__ONLYPLANS_METRICS__) {
	const register = new client.Registry();

	// Default metrics
	client.collectDefaultMetrics({ register });

	// HTTP request duration histogram
	const httpRequestDurationSeconds = new client.Histogram({
		name: "http_request_duration_second",
		help: "Duration of HTTP requests in seconds",
		labelNames: ["method", "route", "code"],
		buckets: [0.1, 0.5, 1, 1.5, 2, 5],
	});
	register.registerMetric(httpRequestDurationSeconds);

	// Express middleware for metrics
	const metricsMiddleware = promBundle({
		includesMethod: true,
		includesPath: true,
		includesStatusCode: true,
		promClient: { collectDefaultMetrics: {}, register },
	});
	global.__ONLYPLANS_METRICS__ = { register, metricsMiddleware };
}

export const register = global.__ONLYPLANS_METRICS__.register;
export const metricsMiddleware = global.__ONLYPLANS_METRICS__.metricsMiddleware;
