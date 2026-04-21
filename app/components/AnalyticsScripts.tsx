/**
 * Analytics: GA4 loads when `PUBLIC_GA4_MEASUREMENT_ID` is set.
 * Meta / TikTok IDs are exposed as `<meta>` hooks so you can extend this file
 * or wire GTM without bloating the initial bundle.
 */
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
