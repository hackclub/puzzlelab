const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  for (const f of fs.readdirSync("../games/")) {
    let src;
    try {
      src = fs.readFileSync("../games/" + f, "utf-8");
    } catch(e) {
      console.log(`skipping ${f}: ${e}`);
      continue;
    }

    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    await page.$eval('.cm-content', (el, src) => el.innerText = src, src);
    await page.click('.run');

    const clip = JSON.parse(
      await page.evaluate(() => {
        return Promise.resolve(JSON.stringify(
          document
            .querySelector(".game-canvas")
            .getBoundingClientRect()
        ));
      })
    );

    if (clip.width == 0 || clip.height == 0) {
      console.log(`skipping ${f}: no canvas!`);
      continue;
    }

    const path = f.split('.')[0] + '.png';
    await page.screenshot({path, clip});

    console.log(`created ${path}!`);
  }

  await browser.close();
})();

