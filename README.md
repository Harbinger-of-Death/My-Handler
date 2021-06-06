This is a handler made with ts for discord.js bot

Just bored so I made this

Installation
1. just clone the repo
2. transpile the handler.ts this creates a js version of the handler.ts code
3. require the newly created js version of the handler in your main file

***Note**: You need atleast v13-dev of D.JS for this to work, otherwise it will error out

Usage:
```ts
let handler = require(path to the file)
```
```ts
let commandHandler = new handler(<Client>, prefix_here, commandDirectory(optional), commandFiletype(optional)) //<Client> - Would be the client class from djs
```

Then you can use the following methods such as:

```ts
commandHandler.mathCommand(4, 2, { operations: "multiplication"}) //expected output is 8
```
