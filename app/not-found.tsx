export default function NotFound() {
  return (
    <main className="empty-state">
      <span className="eyebrow">A SMALL DETOUR</span>
      <h1>This page has taken a different route.</h1>
      <p>
        The trip may be unpublished or out of season. Explore our current
        journeys instead.
      </p>
      <a className="button" href="/tours">
        Explore tour packages
      </a>
      <a className="text-link" href="/">
        Back to home
      </a>
    </main>
  );
}
