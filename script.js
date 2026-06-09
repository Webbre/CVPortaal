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

// --- NIEUWE CODE VOOR DE KLEURENKIEZER ---

// 1. Selecteer alle kleur-rondjes en de cv-elementen die moeten verkleuren
const kleurRondjes = document.querySelectorAll('.kleur-rondje');
const zijbalk = document.getElementById('cv-zijbalk-kleur');
const hoofdTitels = document.querySelectorAll('.cv-sectie-titel-hoofd'); 

// 2. Loop door elk rondje heen
kleurRondjes.forEach(rondje => {
    
    // 3. Luister naar een klik op een rondje
    rondje.addEventListener('click', function() {
        
        // Verwijder eerst de 'actief' status (het donkere randje) van álle rondjes
        kleurRondjes.forEach(r => r.classList.remove('actief'));
        
        // Geef het rondje waar we nu op geklikt hebben de 'actief' status
        this.classList.add('actief');
        
        // Lees de achtergrondkleur van het aangeklikte rondje uit
        const gekozenKleur = this.style.backgroundColor;
        
        // Pas de uitgelezen kleur toe op de achtergrond van de zijbalk
        zijbalk.style.backgroundColor = gekozenKleur;
        
        // Pas de kleur ook toe op de tekst van alle kopjes in de rechterkolom
        hoofdTitels.forEach(titel => {
            titel.style.color = gekozenKleur;
        });
    });
});