/**
 * Analytics: GA4 loads when `PUBLIC_GA4_MEASUREMENT_ID` is set.
 * TikTok Pixel loads when `PUBLIC_TIKTOK_PIXEL_ID` is set (CSP updated in
 * `entry.server.tsx`). Meta ID is exposed as a `<meta>` hook for GTM or
 * `useMarketingPixels`.
 */
function tiktokPixelBootstrap(sdkId: string) {
  return `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};ttq.load(${JSON.stringify(sdkId)});ttq.page();}(window,document,"ttq");`;
}

export function AnalyticsScripts({
  ga4Id,
  metaPixelId,
  tiktokPixelId,
}: {
  ga4Id?: string;
  metaPixelId?: string;
  tiktokPixelId?: string;
}) {
  return (
    <>
      {metaPixelId ? (
        <meta name="x-meta-pixel-id" content={metaPixelId} />
      ) : null}
      {tiktokPixelId ? (
        <meta name="x-tiktok-pixel-id" content={tiktokPixelId} />
      ) : null}
      {tiktokPixelId ? (
        <script
          dangerouslySetInnerHTML={{
            __html: tiktokPixelBootstrap(tiktokPixelId),
          }}
        />
      ) : null}
      {ga4Id ? (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', ${JSON.stringify(ga4Id)});
              `,
            }}
          />
        </>
      ) : null}
    </>
  );
}
