/* ============================================================
   tracks.js — language-track registry. Each curriculum file
   registers one track. Order of registration = order in the UI.
   ============================================================ */
window.TRACKS = window.TRACKS || [];
window.registerTrack = function (t) {
  if (!window.TRACKS.some((x) => x.id === t.id)) window.TRACKS.push(t);
};
window.getTrack = function (id) {
  return window.TRACKS.find((t) => t.id === id) || null;
};
