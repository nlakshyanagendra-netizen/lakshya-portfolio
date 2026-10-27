export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - 88);
    window.scrollTo({ top, behavior: 'smooth' });
  }
}
