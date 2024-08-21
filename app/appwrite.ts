import { Client, Account } from "appwrite";

export const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("66c4f647001360d40b49"); // Replace with your project ID

export const account = new Account(client);
export { ID } from "appwrite";
