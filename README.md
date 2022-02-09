# Krater API

> The "Krater" is nothing but a copy of a reddit-like app. The project was created for the purpose of learning Domain Driven Design, a Modular Monolith and event driven architecture.

## Architectural Drivers 🏎

## C4 Model 📡


#### Legend

![Model C4 Legend](./docs/model-c4/images/legend.png)


#### C1 System Context

![Model C4 - System Context](./docs/model-c4/images/c1-level.png)

#### C2 Container

![Model C4 - Container](./docs/model-c4/images/c2-level.png)
## Modular Monolith 🗄
The project uses rush.js to treat each module as a separate package from the node.js perspective.


## Domain Driven Design 👨🏼‍💼

In order to better understand and implement the application, Domain Driven Design (DDD) was used both from the strategic and tactical side.

### Strategic Part 🙊
When it comes to discovering the `domain`, getting to know the `actors` and likely `bounded contexts`, the Event Storming technique was used.

![Miro Board](./docs/assets/miro.png)

A full session snapshot can be found at the [Miro Board link](https://miro.com/app/board/uXjVOf_KGfs=/?invite_link_id=737256182042).



### Tactical Part 💻

## Event Driven Architecture ✉️

### Single module events 📦

### Module communication with Outbox Pattern 📤