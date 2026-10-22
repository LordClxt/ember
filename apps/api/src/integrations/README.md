# integrations/

Wrappers around external or internal services (Stripe, AWS, mailers, other APIs).
One folder per provider, exposing a Nest module and typed clients.

```
integrations/
└── stripe/
    ├── stripe.module.ts
    └── stripe-payment.client.ts   # [provider]-[entity].client.ts
```

Business modules inject the client; they never call the SDK directly.
