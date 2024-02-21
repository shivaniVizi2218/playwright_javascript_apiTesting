const { test, expect } = require("@playwright/test");
const { faker } = require("@faker-js/faker");
const { DateTime } = require("luxon");
const bookingAPIRequestBody = require("../test_data/post_request_body.json");
const bookingAPIDynamicRequestBody = require("../test_data/post_dynamic_request_body.json");
//import { stringFormat } from "../utils/common";
const fs = require("fs");
let bookingId = require("../test_data/bookingID.json");
const utilTools = require("../utils/tools");
const readBookingID = utilTools.readJson(
  `${process.cwd()}\\test_data\\bookingID.json`
);

test("Create POST API Request using Static request body", async ({
  request,
}) => {
  //create post API request
  const postAPIResponse = await request.post(`/booking`, {
    data: {
      firstname: "Jimmy",
      lastname: "Choo",
      totalprice: 1000,
      depositpaid: true,
      bookingdates: {
        checkin: "2024-01-01",
        checkout: "2025-01-01",
      },
      additionalneeds: "super bowls",
    },
  });

  const postAPIResponseBody = await postAPIResponse.json();
  console.log("Post API REsponse ----->", postAPIResponseBody);

  //validate status code
  expect(postAPIResponse.ok()).toBeTruthy();
  expect(postAPIResponse.status()).toBe(200);

  //validate JSON API response
  expect(postAPIResponseBody.booking).toHaveProperty("firstname", "Jimmy");
  expect(postAPIResponseBody.booking).toHaveProperty("lastname", "Choo");
  expect(postAPIResponseBody.booking.bookingdates).toHaveProperty(
    "checkin",
    "2024-01-01"
  );
});

test("Create POST API using Static JSON file", async ({ request }) => {
  const postAPIResponse = await request.post(`/booking`, {
    data: bookingAPIRequestBody,
  });
  const postAPIResponseBody = await postAPIResponse.json();
  console.log("Post API REsponse ----->", postAPIResponseBody);

  //validate status code
  expect(postAPIResponse.ok()).toBeTruthy();
  expect(postAPIResponse.status()).toBe(200);

  //validate JSON API response
  expect(postAPIResponseBody.booking).toHaveProperty("firstname", "Jimmy");
  expect(postAPIResponseBody.booking).toHaveProperty("lastname", "Choo");
  expect(postAPIResponseBody.booking.bookingdates).toHaveProperty(
    "checkin",
    "2024-01-01"
  );
});

test("Create POST API Request using Dynamic request body", async ({
  request,
}) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const totalPrice = faker.number.int(1000);
  const checkInDate = DateTime.now().toFormat("yyyy-mm-dd");
  const checkOutDate = DateTime.now().plus({ day: 5 }).toFormat("yyyy-mm-dd");

  const postAPIResponse = await request.post(`/booking`, {
    data: {
      firstname: firstName,
      lastname: lastName,
      totalprice: totalPrice,
      depositpaid: true,
      bookingdates: {
        checkin: checkInDate,
        checkout: checkOutDate,
      },
      additionalneeds: "super bowls",
    },
  });

  const postAPIResponseBody = await postAPIResponse.json();
  console.log("Post API Response ----->", postAPIResponseBody);

  //validate status code
  expect(postAPIResponse.ok()).toBeTruthy();
  expect(postAPIResponse.status()).toBe(200);

  //validate JSON API response
  expect(postAPIResponseBody.booking).toHaveProperty("firstname", firstName);
  expect(postAPIResponseBody.booking).toHaveProperty("lastname", lastName);
  // expect(postAPIResponseBody.booking.bookingdates).toHaveProperty(
  //   "checkout",
  //   checkOutDate
  // );
  readBookingID.id = bookingId;
  fs.writeFileSync(
    `${process.cwd()}\\test_data\\bookingID.json`,
    JSON.stringify(readBookingID)
  );
});

test("Create POST API using Dynamic JSON file", async ({ request }) => {
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
});
