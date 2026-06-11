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
// Append exercises to an already-registered module (used by expansion packs).
window.addExercises = function (trackId, moduleId, exs) {
  var t = window.getTrack(trackId);
  if (!t) return;
  var m = t.modules.find(function (mm) { return mm.id === moduleId; });
  if (!m) return;
  (exs || []).forEach(function (e) {
    if (!m.exercises.some(function (x) { return x.id === e.id; })) m.exercises.push(e);
  });
};
