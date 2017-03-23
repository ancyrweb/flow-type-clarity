# Flow Type Clarity

I've been watching over FlowType since it's appealing, quite easy to implement in a project
and to get rid of it, and it's purely developer-time (meaning it doesn't work at compile-time
like TypeScript but really while you're programming, Webstorm provide good support for it).
But some aspect are quite obscure and hard to understand. So I've tried my best to explain these to myself
and came to the conclusion that maybe I should share it with people so they could improve, or even learn.

I'm not a lot into subclass theory and stuff but it seems to be necessary to have the basics. Understanding
the why and not only the how helps a lot about reasonning flowtype errors.

## Summary
* [Property Invariance](src/propertyInvariance)
* [Property Variance](src/propertyVariance)