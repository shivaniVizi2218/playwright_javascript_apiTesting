const { test, expect } = require("@playwright/test");
import { stringFormat } from "../utils/common";
const bookingAPIDynamicRequestBody = require("../test_data/post_dynamic_request_body.json");

test("Query Parameters in GET API", async ({ request }) => {
  const dynamicRequestBody = stringFormat(
    JSON.stringify(bookingAPIDynamicRequestBody),
    "Playwright",
    "JavaScript",
    "Automation tool"
  );

  const postAPIResponse = await request.post(`/booking`, {
    data: JSON.parse(dynamicRequestBody),
  });

  const postAPIResponseBody = await postAPIResponse.json();
  console.log("Post API Response ----->", postAPIResponseBody);

  const bookingId = postAPIResponseBody.bookingid;
  //console.log("bookingID -------->", bookingId);

  //validate status code
  expect(postAPIResponse.ok()).toBeTruthy();
  expect(postAPIResponse.status()).toBe(200);

  //validate JSON API response
  expect(postAPIResponseBody.booking).toHaveProperty("firstname", "Playwright");
  expect(postAPIResponseBody.booking).toHaveProperty("lastname", "JavaScript");
  expect(postAPIResponseBody.booking.bookingdates).toHaveProperty(
    "checkin",
    "2024-01-01"
  );
  /*
  //GET API call
  const getAPIResponse = await request.get(`/booking/${bookingId}`);
  console.log("GET API Response -----> ", await getAPIResponse.json());

  //validate status code of GET
  //validate status code
  expect(getAPIResponse.ok()).toBeTruthy();
  expect(getAPIResponse.status()).toBe(200);
*/

  //Using Query Parameters in GET API call
  const getAPIResponse = await request.get(`/booking`, {
    params: {
      firstname: "Playwright",
      additionalneeds: "Automation tool",
    },
  });
  console.log("GET API Response Query Parameters ------>");
  console.log(await getAPIResponse.json());
  //validate status code
  expect(getAPIResponse.ok()).toBeTruthy();
  expect(getAPIResponse.status()).toBe(200);
});
