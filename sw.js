const CACHE_NAME = 'signer-pdf-v1'; 
const REPO_NAME = '/Signature_pdf_pwa/'; // 🚨 AJOUT DE LA VARIABLE DE DÉPÔT

const urlsToCache = [
  // 🟢 CORRECTION : Utilisation du chemin absolu avec le nom du dépôt
  REPO_NAME + 'index.html',
  REPO_NAME + 'manifest.json',
  REPO_NAME + 'icon-192x192.png', 
  REPO_NAME + 'icon-512x512.png',
  
  // Chemins externes (restent inchangés)
  'https://cdn.tailwindcss.com', 
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// Événement d'installation: mise en cache de tous les fichiers statiques
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Ouverture du cache et mise en cache des assets.');
        // Ajoute tous les fichiers requis au cache local et permanent
        return cache.addAll(urlsToCache);
      })
  );
  // Force l'activation immédiate
  self.skipWaiting();
});

// Événement d'activation: nettoyage des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression de l\'ancien cache :', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Prise de contrôle des clients dès l'activation
  event.waitUntil(self.clients.claim());
});

// Événement de récupération (Fetch): sert depuis le cache en priorité
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - renvoie la version en cache
        if (response) {
          return response;
        }
        // Sinon, tente de récupérer la ressource via le réseau
        return fetch(event.request);
      })
  );
});
 
