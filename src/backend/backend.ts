import express from 'express';
import { Server, ic, query } from 'azle';
import {
  HttpResponse,
  HttpTransformArgs,
} from 'azle/canisters/management';


export default Server(
  // Server section
  () => {
    const app = express();
    app.use(express.json());

    app.post("/check-domain", async (req, res) => {
      ic.setOutgoingHttpOptions({
        maxResponseBytes: 20_000n,
        cycles: 500_000_000_000n,
        transformMethodName: 'transform'
      });

      const url = `https://mailcheck.p.rapidapi.com/?domain=${req.body.domain}`;
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '353e3b06d8msh5aa1ada53357b71p198fc2jsn65781fbf7220',
          'x-rapidapi-host': 'mailcheck.p.rapidapi.com'
        }
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();
        res.json(result);
      } catch (error) {
        console.error(error);
        res.json({ valid: false });
      }
    })

    app.post("/randomize", async (req, res) => {
      const payload = req.body;
      const { length, useUppercase, useLowercase, useNumbers, useSymbols } = payload;

      const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
      const numberChars = '0123456789';
      const symbolChars = '!@#$%^&*';

      let availableChars = '';

      if (useUppercase) availableChars += uppercaseChars;
      if (useLowercase) availableChars += lowercaseChars;
      if (useNumbers) availableChars += numberChars;
      if (useSymbols) availableChars += symbolChars;

      if (availableChars === '') {
        throw new Error('At least one character type should be selected');
      }

      let password = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * availableChars.length);
        password += availableChars[randomIndex];
      }

      res.json({ password });
    })

    app.use(express.static('/dist'));
    return app.listen();
  },
  // Candid section
  {
    // The transformation function for the HTTP outcall responses.
    // Required to reach consensus among different results the nodes might get.
    // Only if they all get the same response, the result is returned, so make sure
    // your HTTP requests are idempotent and don't depend e.g. on the time.
    transform: query([HttpTransformArgs], HttpResponse, (args) => {
      return {
        ...args.response,
        headers: []
      };
    })
  }
);
