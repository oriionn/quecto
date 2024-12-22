interface Data {
    status?: number,
    data: object
}

export function makeResponse(status: number, data: object) {
    return new Response(JSON.stringify({ status: status, ...data }), { status });
}