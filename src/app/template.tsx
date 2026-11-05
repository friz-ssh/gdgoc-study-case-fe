/**
 * A template (unlike a layout) is re-created on every navigation, so the CSS
 * enter animation defined in globals.css (.page-enter) plays for each page.
 * It is CSS-only on purpose: the content stays visible in the server-rendered
 * HTML and the animation costs no JavaScript.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
