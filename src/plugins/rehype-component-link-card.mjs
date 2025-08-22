/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * Creates a Link Card component for third-party links.
 */
export function LinkCardComponent(properties, children) {
  if (Array.isArray(children) && children.length !== 0)
    return h("div", { class: "hidden" }, [
      'Invalid directive. ("link-card" directive must be leaf type "::link-card{url="https://example.com"}"))',
    ]);

  if (!properties.url || !properties.url.startsWith('http'))
    return h(
      "div",
      { class: "hidden" },
      'Invalid URL. ("url" attribute must be a valid HTTP/HTTPS URL)',
    );

  const url = properties.url;
  const customTitle = properties.title;
  const customDescription = properties.description;
  const customImage = properties.image;
  const customIcon = properties.icon;
  const cardUuid = `LC${Math.random().toString(36).slice(-6)}`;

  // Extract domain from URL for display
  const domain = new URL(url).hostname;

  // Use custom icon if provided, otherwise use Google favicon service
  const iconUrl = customIcon || `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  const nFavicon = h(`div#${cardUuid}-favicon`, {
    class: "lc-favicon",
    style: `background-image: url(${iconUrl})`
  });

  const nTitle = h("div", { class: "lc-titlebar" }, [
    h("div", { class: "lc-titlebar-left" }, [
      h("div", { class: "lc-site" }, [
        nFavicon,
        h("div", { class: "lc-domain" }, domain),
      ]),
    ]),
    h("div", { class: "lc-external-icon" }),
  ]);

  const nCardTitle = h(
    `div#${cardUuid}-title`,
    { class: "lc-card-title" },
    customTitle || "Loading...",
  );

  const nDescription = h(
    `div#${cardUuid}-description`,
    { class: "lc-description" },
    customDescription || "Loading description...",
  );

  const nImage = h(
    `div#${cardUuid}-image`,
    { class: "lc-image" },
    customImage ? h("img", { src: customImage, alt: "Link preview" }) : null
  );

  // Only fetch metadata if custom data is not provided
  const needsFetch = !customTitle || !customDescription;

  const nScript = needsFetch ? h(
    `script#${cardUuid}-script`,
    { type: "text/javascript", defer: true },
    `
      // Simple metadata extraction for link cards
      try {
        const cardElement = document.getElementById('${cardUuid}-card');
        const titleElement = document.getElementById('${cardUuid}-title');
        const descElement = document.getElementById('${cardUuid}-description');

        // Set default values if custom ones weren't provided
        if (!titleElement.dataset.hasCustomTitle) {
          titleElement.innerText = '${domain}';
        }
        if (!descElement.dataset.hasCustomDesc) {
          descElement.innerText = 'Visit ${domain}';
        }

        cardElement.classList.remove("fetch-waiting");
        console.log("[LINK-CARD] Loaded card for ${url} | ${cardUuid}.");
      } catch (err) {
        const c = document.getElementById('${cardUuid}-card');
        c?.classList.add("fetch-error");
        console.warn("[LINK-CARD] (Error) Loading card for ${url} | ${cardUuid}.");
      }
    `,
  ) : null;

  // Set data attributes for custom content
  if (customTitle) {
    nCardTitle.properties['data-has-custom-title'] = 'true';
  }
  if (customDescription) {
    nDescription.properties['data-has-custom-desc'] = 'true';
  }

  const cardContent = [
    nTitle,
    nCardTitle,
    nDescription,
  ];

  if (customImage) {
    cardContent.push(nImage);
  }

  if (nScript) {
    cardContent.push(nScript);
  }

  return h(
    `a#${cardUuid}-card`,
    {
      class: needsFetch ? "card-link fetch-waiting no-styling" : "card-link no-styling",
      href: url,
      target: "_blank",
      rel: "noopener noreferrer",
      'data-url': url,
    },
    cardContent,
  );
}