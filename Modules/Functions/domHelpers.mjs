export async function waitVisible(el) {
  try {
    await el.waitFor({ state: 'visible', timeout: 600000 });
    return true;
  } catch {
    return false;
  }
}

export async function clickIfVisible(el) {
  if (await waitVisible(el)) {
    try { await el.click(); } catch {}
  }
}

export async function fillIfVisible(el, value) {
  if (await waitVisible(el)) {
    try { await el.fill(value); } catch {}
  }
}

export async function waitForUrl(page, url, timeout = 600000) {
  try {
    await page.waitForURL(url, { timeout });
    return true;
  } catch {
    return false;
  }
}