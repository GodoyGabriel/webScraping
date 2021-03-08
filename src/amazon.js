const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({headless: false});

  const page = await browser.newPage();

  await page.goto('http://www.amazon.es');
  await page.screenshot({path: './captures/amazon1.jpg'});

  // # id
  await page.type('#twotabsearchtextbox', 'libros de javascript');

  await page.screenshot({path: './captures/amazon2.jpg'});

  // . clase
  await page.click('.nav-search-submit input');
  // Es para esperar el selector, va entre [] porque es sobre un atributo
  await page.waitForSelector('[data-component-type=s-search-result]');
  await page.waitForTimeout(2000);
  await page.screenshot({path: './captures/amazon3.jpg'});

  const links = await page.evaluate(() => {
    const elements = document.querySelectorAll('[data-component-type=s-search-result] h2 a');

    const links = [];
    for (let element of elements){
      links.push(element.href);
    };
    return links;
  })

  console.log(links.length);
const items = [];
  for(let link of links){
    await page.goto(link);
    await page.waitForSelector('#productTitle');

    const item = await page.evaluate(() => {
      const tmp = {};
      tmp.title = document.querySelector('#productTitle').innerText;
      tmp.author = document.querySelector('.author a').innerText;
      return tmp;
    })
    items.push(item);
  }
  console.log(items);
  await browser.close();
})();

