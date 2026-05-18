function testRoute(path) {
  try {
    require(path);
    console.info(path + " loaded");
  } catch (err) {
    console.error(path + " failed:", err.message);
  }
}

testRoute("./routes/auth");
testRoute("./routes/gatepass");
testRoute("./routes/notice");
testRoute("./routes/complaint");