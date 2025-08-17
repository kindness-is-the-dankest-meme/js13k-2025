const { host, protocol } = location;
const ws = new WebSocket(`${protocol.replace("http", "ws")}//${host}`);

ws.addEventListener("open", (event) => {
  console.log(event);
});
