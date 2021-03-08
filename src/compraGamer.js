const puppeteer = require("puppeteer");
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  //const itemToSearch = "Mouse Glorious Model O Minus (White)";
  const itemToSearch = "Placa de Video ASUS GeForce RTX 2060 6GB GDDR6 DUAL MINI OC";
  const page = await browser.newPage();
  await page.goto("https://compragamer.com");

  await page.waitForSelector(".tituloNotificacion");
  await page.click(".notificacionNoMostrar");
  await page.waitForTimeout(1000);
  // # id
  await page.type("#searchQuery", itemToSearch);
  console.log(`Searching ${itemToSearch}`);
  // . clase
  await page.click("#botonBusqueda");
  await page.waitForSelector(".contenidoPrincipal");
  await page.screenshot({ path: "test.jpg" });
  const products = await page.evaluate(() => {
    const elementToFind = 'div[class="contenidoPrincipal"]';
    const elements = document.querySelectorAll(`${elementToFind}`);
    let items = [];
    for (let element of elements) {
      items.push({
        title: element.querySelector("div > span").innerText,
        price: element.querySelector("h1").innerText,
        inStock: element.querySelector('div > button[disabled="true"]')
          ? false
          : true,
      });
    }
    return items;
  });
  console.log(products);

  specificProduct(products, itemToSearch);

  await browser.close();
})();

const specificProduct = (products, itemToSearch) => {
  const found = products.find((product) => product.title === itemToSearch);
  if (found && found.inStock) {
    console.log(`${itemToSearch} found and in stock`);
    console.log(found);
  } else if (found) {
    console.log(`${itemToSearch} out stock`);
  } else {
    console.log(`${itemToSearch} not found`);
  }
};
