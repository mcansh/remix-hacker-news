import { unstable_defineLoader } from "@remix-run/cloudflare";
import type { MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { cacheHeader } from "pretty-cache-header";
import { api } from "~/.server/api";
import { FeedType } from "~/components/feed";

export const loader = unstable_defineLoader(async ({ response }) => {
	const { stories } = await api.get_posts("/askstories.json");

	response.headers.append(
		"Cache-Control",
		cacheHeader({
			public: true,
			maxAge: "0m",
			mustRevalidate: true,
		}),
	);
	response.headers.append(
		"cdn-cache-control",
		cacheHeader({
			public: true,
			sMaxage: "60s",
			staleWhileRevalidate: "1w",
		}),
	);

	return { stories };
});

export const meta: MetaFunction = () => {
	return [
		{ title: "Ask | Remix Hacker News" },
		{ name: "description", content: "Hacker News made with Remix.run" },
	];
};

export default function AskPage() {
	const data = useLoaderData<typeof loader>();
	return <Feed stories={data.stories} />;
}
