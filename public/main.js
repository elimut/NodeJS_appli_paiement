if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/serviceWorker.js")
    .then(function (registration) {
      console.log("Service Worker enregistré avec succès : ", registration);
    })
    .catch(function (error) {
      console.log(
        `Erreur lors de l'enregistrement du Service Worker : `,
        error
      );
    });
}
