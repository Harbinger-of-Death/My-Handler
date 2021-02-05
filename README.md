This is a handler made with ts for discord.js bot

Just bored so I made this

Installation
1. just clone the repo
2. transpile the handler.ts
3. require it in your main js file

Usage:
```ts
let handler = require(path to the file)
```
```ts
let commandHandler = new handler(<Client>, prefix_here) //<Client> - Would be the client class from djs
```

Then you can use the following methods such as:

```ts
commandHandler.mathCommand(4, 2, { operations: "multiplication"}) //expected output is 8
```
