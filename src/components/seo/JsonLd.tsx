/**
 * Renders a JSON-LD block.
 *
 * `undefined` values are dropped by JSON.stringify, and `<` is escaped so a
 * product name can never break out of the script tag.
 */
export function JsonLd({ data, id }: { data: object; id?: string }) {
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
