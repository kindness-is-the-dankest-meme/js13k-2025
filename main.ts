Deno.serve(
  () =>
    new Response("501 - Not Implemented", {
      status: 501,
      statusText: "Not Implemented",
    })
);
