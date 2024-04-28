import { MetaFunction } from "@remix-run/cloudflare";

export let meta: MetaFunction = () => {
  return [
    { title: "Remix Hacker News" },
    { name: "description", content: "Hacker News made with Remix.run" },
  ];
};

export default function FrontPage() {
  return (
    <div className="p-2">
      <h1>not implemented</h1>
    </div>
  );
}
