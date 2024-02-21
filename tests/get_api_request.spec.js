const { test, expect } = require("@playwright/test");
const data = require("../test_data/bookingID.json");
console.log("booking Id in GET------------>", data.id);

test("Create GET API Request", async ({ request }) => {
  const getAPIResponse = await request.get(`/booking/${data.id}`);

  const getAPIResponseBody = await getAPIResponse.json();
  console.log("GET API Response ----->", getAPIResponseBody);

  // validate status code
  expect(getAPIResponse.ok()).toBeTruthy();
  expect(getAPIResponse.status()).toBe(200);
});
