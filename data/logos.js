module.exports = async () =>
  Object.fromEntries(
    await Promise.all(
      [
        "logo-color.svg",
        "logo-monochrome.svg",
        "logo-outline.svg",
        "logo-sticker.svg",
      ].map((filename) => {
        console.log("fetching:", filename);
        return fetch(
          `https://raw.githubusercontent.com/chaosdorf/chaosdorf-design/main/logos/${filename}`
        ).then(async (r) => {
          if (!r.ok) {
            throw new Error(`invalid status: ${r.status}`);
          }
          return [filename, await r.text()];
        });
      })
    )
  );
