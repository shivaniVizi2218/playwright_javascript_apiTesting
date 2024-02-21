const { test, expect } = require("@playwright/test");
import { stringFormat } from "../utils/common";
const bookingAPIDynamicRequestBody = require("../test_data/post_dynamic_request_body.json");
const tokenRequestBody = require("../test_data/token_request_body.json");
const patchRequestData = require("../test_data/patch_request_body.json");

test("Create PATCH API Request", async ({ request }) => {
  const dynamicRequestBody = stringFormat(
    JSON.stringify(bookingAPIDynamicRequestBody),
    "Algebra",
    "Geometry",
    "Mathematics"
  );
  const postAPIResponse = await request.post(`/booking`, {
    data: JSON.parse(dynamicRequestBody),
  });
  const postAPIResponseBody = await postAPIResponse.json();
  console.log("POST API Response ------>", postAPIResponseBody);
  const bookingID = await postAPIResponseBody.bookingid;
  //validate status code
  expect(postAPIResponse.status()).toBe(200);

  //Token Generation
  const tokenAPIResponse = await request.post(`/auth`, {
    data: tokenRequestBody,
  });
  const tokenID = (await tokenAPIResponse.json()).token;
  console.log("token ------------>", tokenID);

  //PATCH API Call
  const patchAPIResponse = await request.patch(`/booking/${bookingID}`, {
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${tokenID}`,
    },
    data: patchRequestData,
  });
  console.log("PATCH API Response ----->", await patchAPIResponse.json());

  //validate status
  expect(patchAPIResponse.ok()).toBeTruthy();
  expect(patchAPIResponse.status()).toBe(200);
});
