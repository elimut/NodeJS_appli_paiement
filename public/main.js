// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.register("/serviceWorker.js", {
//     scope: `./`,
//   });
//   console.log("ok");
// }
// document.addEventListener("DOMContentLoaded", init, false);
// function init() {
//   if ("serviceWorker" in navigator) {
//     (reg) => {
//       console.log("Service worker registered -->", reg);
//     },
//       (err) => {
//         console.error("Service worker not registered -->", err);
//       };
//   }
// }
navigator.serviceWorker
  .register("serviceWorker.js", { scope: "./" })
  .then(function (registration) {
    console.log("Service worker registered successfully");
  })
  .catch(function (e) {
    console.error("Error during service worker registration:", e);
  });
