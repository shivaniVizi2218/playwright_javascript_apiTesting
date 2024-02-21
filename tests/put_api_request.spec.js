const { test, expect } = require("@playwright/test");
import { stringFormat } from "../utils/common";
const bookingAPIDynamicRequestBody = require("../test_data/post_dynamic_request_body.json");
const tokenRequestBody = require("../test_data/token_request_body.json");
const putRequestBody = require("../test_data/post_request_body.json");

test("Create PUT API Request ", async ({ request }) => {
  const dynamicRequestBody = stringFormat(
    JSON.stringify(bookingAPIDynamicRequestBody),
    "Algebra",
    "Geometry",
    "Mathematics"
  );

  const postAPIResponse = await request.post("/booking", {
    data: JSON.parse(dynamicRequestBody),
  });

  const postAPIResponseBody = await postAPIResponse.json();
  console.log("POST API Response --------> ", postAPIResponseBody);
  const bookingID = await postAPIResponseBody.bookingid;

  //Genearete Token
  const tokenAPIResponse = await request.post(`/auth`, {
    data: tokenRequestBody,
  });

  const tokenAPIResponseBody = await tokenAPIResponse.json();
  //console.log("Token API Response  ------->", tokenAPIResponseBody);

  const token = tokenAPIResponseBody.token;
  console.log("token ------->", token);

  //PUT API Request Call
  const putAPIResponse = await request.put(`/booking/${bookingID}`, {
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${token}`,
    },
    data: putRequestBody,
  });

  console.log("PUT API Response ------>", await putAPIResponse.json());

  //Validate Status Code
  expect(postAPIResponse.status()).toBe(200);
  expect(putAPIResponse.ok()).toBeTruthy();

  //Checking whether data updated or not
  const getAPIResponse = await request.get(`/booking/${bookingID}`);
  console.log("GET API REsponse ------>", await getAPIResponse.json());
});
