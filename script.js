// script.js

// Functie om een invoerveld live te koppelen aan een weergaveveld
function koppelVeld(invoerId, weergaveId) {
    // Zoek het invoerveld aan de linkerkant
    const invoerVeld = document.getElementById(invoerId);
    // Zoek de weergaveplek aan de rechterkant
    const weergaveVeld = document.getElementById(weergaveId);

    // Als de gebruiker typt ('input'), voer dan deze code uit
    invoerVeld.addEventListener('input', function() {
        // Kopieer de waarde (value) van links naar de tekst (innerText) van rechts
        weergaveVeld.innerText = invoerVeld.value;
    });
}

// Hier activeren we de functie voor al onze specifieke velden
koppelVeld('voornaam', 'weergave-voornaam');
koppelVeld('achternaam', 'weergave-achternaam');
koppelVeld('adres', 'weergave-adres');
koppelVeld('postcode', 'weergave-postcode');
koppelVeld('email', 'weergave-email');
koppelVeld('telefoon', 'weergave-telefoon');
koppelVeld('profieltekst', 'weergave-profieltekst');

console.log("Live datakoppeling is succesvol geactiveerd!");