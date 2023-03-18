# Benjamin Sterling's Assessment

This was a nice little challenge and I really enjoyed it.

## Some things to call out
* My approach to the expressjs server is not production ready, it was intended to simple feed up the form and log and allow for `POST` requests
* The regexs found in `app.post('/process'` can be improved, again, just trying to get it done quickly.
* Lastly, the second point under "Performance Requirements" has not been addressed. I was over the 4 hour recommended window and, per a statement either Adam or bret said in passing, something to the effect of "done is better than perfect", I figured getting it done was the best route. I would love to discuss what my plans were for preventing the "doubled for every transactions." 

## Testing Environment
### Node.js

This project requires `node.js` to serve, test, and  build.

This project is also using `nvm` (node version manager). `nvm` will help you manage multiple `node.js` version on your local machine.

Intall `nvm` from [here](https://github.com/nvm-sh/nvm)

If you have `nvm` installed already, activate or install the required version for this project by running...

```sh
$ nvm use
```

The `.nvmrc` file shows the supported version. What is being used is ``

### Installation

```sh
// checkout or download to the folder of your chosing
$ cd [path/to/your/folder]
// from the root of the project
$ nvm use
$ npm install
```

### Running tests

```sh
$ npm run test
```

If you are interested in coverage, docs will be found `[path/to/your/folder]/coverage/lcov-report/index.html`

_note:_ `src/main.ts` is not covered as this was only to serve up a quick and dirty frontend to allow for testing of this accessment.

### Running assessment
```sh
$ npm run build
$ npm run serve
```
Then navigate to [http://localhost:3000/](http://localhost:3000/). At this point you should see a single `input` and a `button`. Simply add a command (eg. `SET a foo`) and hit enter and you'll see a log below the `input` that looks similiar to `TechAssessmentPrompt_2023.pdf` document.
