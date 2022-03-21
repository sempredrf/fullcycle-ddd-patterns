import CustomerChangedAddressEvent from "../../customer/event/customer-changed-address.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import EnviaConsoleLogQuandoEnderecoForMudadoHandler from "../../customer/event/handler/log-when-customer-address-is-changed.handler";
import EnviaConsoleLog1Handler from "../../customer/event/handler/log-when-customer-is-created-one.handler";
import EnviaConsoleLog2Handler from "../../customer/event/handler/log-when-customer-is-created-two.handler";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });

  
  it("should notify when a customer was created", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandlerOne = new EnviaConsoleLog1Handler();
    const eventHandlerTwo = new EnviaConsoleLog2Handler();
    const spyEventHandlerOne = jest.spyOn(eventHandlerOne, "handle");
    const spyEventHandlerTwo = jest.spyOn(eventHandlerTwo, "handle");

    eventDispatcher.register("CustomerCreatedEvent", eventHandlerOne);
    eventDispatcher.register("CustomerCreatedEvent", eventHandlerTwo);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandlerOne);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(eventHandlerTwo);

    const customerCreatedEvent = new CustomerCreatedEvent({
      id: '123',
      name: "Customer 01",
    });
    
    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandlerOne).toHaveBeenCalled();
    expect(spyEventHandlerTwo).toHaveBeenCalled();
  });

  it("should notify when a customer address was changed", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLogQuandoEnderecoForMudadoHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("CustomerChangedAddressEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]
    ).toMatchObject(eventHandler);

    const addressChangedEvent = new CustomerChangedAddressEvent({
      id: "123",
      name: "Customer 01",
      address: 'Rua 01 Lote 01 Quadra 01',
    });
    
    eventDispatcher.notify(addressChangedEvent);

    expect(spyEventHandler).toHaveBeenCalled();  
  });

  
});
