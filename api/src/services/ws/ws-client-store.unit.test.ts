import WebSocket from "ws";
import { beforeEach, jest, describe, it, expect } from "@jest/globals";
import { faker } from "@faker-js/faker";
import { randomUUID } from "crypto";
import { logger } from "../../config/logger";
import { WSClientStore } from "./ws-client-store";

jest.mock("../../../src/config/logger");

describe("WSClientStore class", () => {
  function createClient() {
    return {
      id: faker.number.int(),
      uuid: randomUUID(),
      username: faker.internet.username(),
      socket: {} as WebSocket,
    };
  }

  const schedulerMock = { start: jest.fn(), stop: jest.fn() };
  let clientStore: WSClientStore;

  beforeEach(() => {
    clientStore = new WSClientStore(schedulerMock);
    schedulerMock.start.mockClear();
    schedulerMock.stop.mockClear();
    jest.mocked(logger.debug).mockClear();
  });

  describe("addClient", () => {
    it("adds a new client to the store", () => {
      const client = createClient();
      const addClientSpy = jest.spyOn(clientStore, "addClient");

      clientStore.addClient(client);

      expect(addClientSpy).toHaveBeenCalledWith(client);
      expect(addClientSpy).toHaveBeenCalledTimes(1);

      addClientSpy.mockRestore();
    });

    it("emits 'add_client' event with added client as argument", () => {
      const client = createClient();
      const addClient = jest.fn();
      clientStore.on("add_client", addClient);

      clientStore.addClient(client);

      expect(addClient).toHaveBeenCalledTimes(1);
      expect(addClient).toHaveBeenCalledWith({
        uuid: client.uuid,
        username: client.username,
      });
    });

    it("schedules stats updates, when the first client is added to the store", () => {
      const client = createClient();
      clientStore.addClient(client);

      expect(schedulerMock.start).toHaveBeenCalledTimes(1);
    });

    it("stops emitting stats updates, when no clients left in the store", () => {
      const client1 = createClient();
      const client2 = createClient();

      clientStore.addClient(client1);
      clientStore.addClient(client2);

      clientStore.deleteClient(client1.uuid);
      expect(schedulerMock.stop).not.toHaveBeenCalled();

      clientStore.deleteClient(client2.uuid);
      expect(schedulerMock.stop).toHaveBeenCalled();
    });
  });

  describe("deleteClient", () => {
    it("deletes a client from the store by client's uuid", () => {
      const client = createClient();
      const deleteClientSpy = jest.spyOn(clientStore, "deleteClient");
      clientStore.addClient(client);

      clientStore.deleteClient(client.uuid);

      expect(deleteClientSpy).toHaveBeenCalledTimes(1);
      expect(deleteClientSpy).toHaveBeenCalledWith(client.uuid);
      expect(clientStore.clients.length).toStrictEqual(0);

      deleteClientSpy.mockRestore();
    });

    it("does not throw an error on attempt to delete non-existent client", () => {
      const client = createClient();
      clientStore.addClient(client);

      expect(() => clientStore.getClient(randomUUID())).not.toThrowError();
    });

    it("emits 'delete_client' event with the client as argument when the client deleted", () => {
      const client = createClient();
      const deleteClient = jest.fn();
      clientStore.on("delete_client", deleteClient);
      clientStore.addClient(client);

      clientStore.deleteClient(client.uuid);

      expect(deleteClient).toBeCalledTimes(1);
      expect(deleteClient).toHaveBeenCalledWith({
        uuid: client.uuid,
        username: client.username,
        id: client.id,
      });
    });
  });

  describe("getClient", () => {
    it("retrieves a client from the store by uuid", () => {
      const client = createClient();
      const getClientSpy = jest.spyOn(clientStore, "getClient");
      clientStore.addClient(client);

      const clientFromStore = clientStore.getClient(client.uuid);

      expect(getClientSpy).toHaveBeenCalledTimes(1);
      expect(getClientSpy).toHaveBeenCalledWith(client.uuid);
      expect(client).toStrictEqual(clientFromStore);

      getClientSpy.mockRestore();
    });

    it("does not throw an error on attempt to retrieve non-existent client", () => {
      expect(() =>
        clientStore.getClient(faker.internet.username()),
      ).not.toThrowError();

      expect(clientStore.getClient(faker.internet.username())).toBeUndefined();
    });
  });

  describe("get clients", () => {
    it("returns all clients as an array", () => {
      const client1 = createClient();
      const client2 = createClient();
      const client3 = createClient();
      const clientsSpy = jest.spyOn(clientStore, "clients", "get");

      clientStore.addClient(client1);
      clientStore.addClient(client2);
      clientStore.addClient(client3);

      const clients = clientStore.clients;

      expect(clientsSpy).toBeCalledTimes(1);
      expect(clients).toStrictEqual([client1, client2, client3]);

      clientsSpy.mockRestore();
    });
  });

  describe("get clientCount", () => {
    it("returns current client count", () => {
      const client1 = createClient();
      const client2 = createClient();

      expect(clientStore.clientCount).toBe(0);

      const clientCountSpy = jest.spyOn(clientStore, "clientCount", "get");

      clientStore.addClient(client1);

      expect(clientStore.clientCount).toBe(1);
      expect(clientCountSpy).toBeCalled();

      clientStore.addClient(client2);
      expect(clientStore.clientCount).toBe(2);

      clientCountSpy.mockRestore();
    });
  });

  describe("get sanitizedClients", () => {
    it("returns an array of sanitized clients", () => {
      const client1 = createClient();
      const client2 = createClient();
      const sanitizedClientsSpy = jest.spyOn(
        clientStore,
        "sanitizedClients",
        "get",
      );

      clientStore.addClient(client1);
      clientStore.addClient(client2);

      const sanitizedClients = clientStore.sanitizedClients;

      expect(sanitizedClientsSpy).toHaveBeenCalledTimes(1);
      expect(sanitizedClients).toStrictEqual([
        { uuid: client1.uuid, username: client1.username },
        { uuid: client2.uuid, username: client2.username },
      ]);

      sanitizedClientsSpy.mockRestore();
    });
  });
});
