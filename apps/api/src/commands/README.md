# commands/

CLI jobs and scheduled tasks (e.g. with `nest-commander` or `@nestjs/schedule`).

```
commands/
├── commands.module.ts
└── purge-items.command.ts        # [action]-[entity].command.ts
```

Commands orchestrate services from `modules/`; they hold no business logic themselves.
