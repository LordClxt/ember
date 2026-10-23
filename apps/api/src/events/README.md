# events/

Domain event publishers and listeners (e.g. with `@nestjs/event-emitter` or a message broker).
One folder per event, named in kebab-case past tense.

```
events/
└── item-created/
    ├── item-created.event.ts      # payload class
    └── item-created.listener.ts   # @OnEvent('item.created')
```
