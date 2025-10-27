export async function POST(req: Request) {
    try {
        const body = await req.json();
        return new Response(
            JSON.stringify({ ok: true, echo: body }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch {
        return new Response(
            JSON.stringify({ ok: false, error: "Invalid JSON" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }
}