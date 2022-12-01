const playwright = require('playwright');

(async () => {
    const browser = await playwright.chromium.launch({
        headless: false
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://uat.aukai.io/');

    // check a title
    let target = await page.title();
    await assertion('01', 'シェアリング倉庫サービス｜WareX', target, page)

    // check a botton label and click
    target = await page.innerText('//*[@id="__layout"]/div/div[1]/div[2]/div[2]/ul[2]/li[2]/button');
    await assertion('02', '無料登録', target, page)

    await page.click('//*[@id="__layout"]/div/div[1]/div[2]/div[2]/ul[2]/li[2]/button');
    await page.waitForTimeout(1000);

    // check a placeholder
    target = await page.locator('//*[@id="email"]').getAttribute('placeholder');
    await assertion('03', 'メールアドレス', target, page)

    // input a email and submit
    await page.fill('//*[@id="email"]', 'aaaaa@example.com');
    await page.waitForTimeout(1000);
    await page.click('//*[@id="__layout"]/div/div[3]/div[2]/div/form/div/div[3]/label/div/span');
    await page.waitForTimeout(1000);
    await page.click('//*[@id="__layout"]/div/div[3]/div[2]/div/form/div/div[4]/button');

    // check error messages
    target = await page.innerText('//*[@id="__layout"]/div/div[3]/div[2]/div/form/div/div[1]/div[3]/p');
    await assertion('04', '会社名を入力して下さい。', target, page)

    // close a form
    await page.click('//*[@id="__layout"]/div/div[3]/div[2]/div/div/img');
    await page.waitForTimeout(1000);

    // click a link
    target = await page.click('//*[@id="__layout"]/div/div[2]/div[2]/div/div[3]/div[1]/div[2]/a[1]/span');
    await page.waitForTimeout(1000);

    // check a Url
    target = await page.url();
    await assertion('05', 'https://uat.aukai.io/warehouses/search/area/%E5%8C%97%E6%B5%B7%E9%81%93/', target, page)

    await browser.close();
})();

async function assertion(no, expect, exist, page) {
    if (expect === exist) {
        await page.screenshot({path: './' + no + '_OK.png', fullPage: true});
    } else {
        console.log(no + ' - ' + expect + ' / ' + exist)
        await page.screenshot({path: './' + no + '_NG.png', fullPage: true});
    }
}