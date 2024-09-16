"use server";

import { createApiResponse, CreateApiResponse } from "@/app/api/api";

const GET = async () => {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/`, { method: "GET" }).then(async (response) => {
      return await response.json();
    });

    return createApiResponse(response, "OK", null);
  } catch (error) {
    return createApiResponse(null, "ERROR", { message: "error" });
  }
};

export { GET };

const apiUserGetSome = async (): Promise<
  CreateApiResponse<
    {
      id: string;
      name: string;
      email: string;
      phone: string;
      username: string;
      website: string;
      comapny: { bs: string; catchPhrase: string; name: string };
      address: { city: string; geo: { lat: string; lng: string }; street: string; suite: string; zipcode: string };
    }[]
  >
> => {
  return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/get/some`, { method: "GET" }).then(async (response) => {
    return await response.json();
  });
};

export { apiUserGetSome };
