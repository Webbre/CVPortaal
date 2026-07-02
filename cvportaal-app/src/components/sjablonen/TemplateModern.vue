<script setup>
import {
  voornaam, achternaam, woonplaats, email, telefoon, geboorteJaar, profieltekst,
  heeftRijbewijs, heeftAuto, profielfoto, toonFotoOpCv, gekozenKleur,
  toonWerkervaring, werkervaringen, gesorteerdeWerkervaringen, toonSterkePunten, sterkePunten,
  toonOpleidingen, opleidingen, gesorteerdeOpleidingen, toonTalen, talen, toonHobbys, hobbys,
  toonMeerOverMij, meerOverMijTekst
} from '../../cvStore.js'
</script>

<template>
  <div class="cv-modern-papier">
    <div class="modern-header" :style="{ backgroundColor: gekozenKleur }">
      <div class="header-content">
        <h1 class="modern-naam">{{ voornaam || 'Jouw' }} {{ achternaam || 'Naam' }}</h1>
        <div class="modern-contact">
  <span v-if="woonplaats">{{ woonplaats }}</span>
  <span v-if="email">• {{ email }}</span>
  <span v-if="telefoon">• {{ telefoon }}</span>
  <span v-if="geboorteJaar">• {{ geboorteJaar }}</span>
</div>
      </div>
      <div v-if="profielfoto && toonFotoOpCv" class="modern-foto" :style="{ backgroundImage: `url(${profielfoto})` }"></div>
    </div>

    <div class="modern-body">
      <div class="modern-zijbalk">
        <div class="modern-profiel-kaart">
          <h3 class="modern-sectietitel" :style="{ color: gekozenKleur }">Profiel</h3>
          <p class="modern-tekst">{{ profieltekst || 'Jouw profieltekst verschijnt hier...' }}</p>
        </div>

        <div v-if="toonSterkePunten && sterkePunten.length > 0" class="modern-sectie">
          <h3 class="modern-sectietitel" :style="{ color: gekozenKleur }">Sterke punten</h3>
          <div class="modern-tags">
            <span v-for="p in sterkePunten" :key="p.id" v-show="p.tekst" class="modern-tag" :style="{ backgroundColor: gekozenKleur + '20', color: gekozenKleur }">{{ p.tekst }}</span>
          </div>
        </div>

        <div v-if="toonTalen && talen.length > 0" class="modern-sectie">
          <h3 class="modern-sectietitel" :style="{ color: gekozenKleur }">Talen</h3>
          <div v-for="t in talen" :key="t.id" v-show="t.naam" class="modern-taal">
            <span class="taal-naam">{{ t.naam }}</span>
            <div class="taal-balk">
              <div class="taal-vul" :style="{ width: (t.niveau * 20) + '%', backgroundColor: gekozenKleur }"></div>
            </div>
          </div>
        </div>

        <div v-if="toonHobbys && hobbys.length > 0" class="modern-sectie">
          <h3 class="modern-sectietitel" :style="{ color: gekozenKleur }">Dit vind ik leuk</h3>
          <ul class="modern-lijst">
            <li v-for="h in hobbys" :key="h.id" v-show="h.tekst">{{ h.tekst }}</li>
          </ul>
        </div>
        <div v-if="heeftRijbewijs || heeftAuto" class="modern-sectie">
  <h3 class="modern-sectietitel" :style="{ color: gekozenKleur }">Vervoer</h3>
  <ul class="modern-lijst">
    <li v-if="heeftRijbewijs">Rijbewijs B</li>
    <li v-if="heeftAuto">Eigen auto</li>
  </ul>
</div>
      </div>

      <div class="modern-hoofd">
        <div v-if="toonWerkervaring">
          <h2 class="modern-hoofdtitel" :style="{ color: gekozenKleur }">Werkervaring</h2>
          <div v-for="w in gesorteerdeWerkervaringen" :key="w.id" class="modern-card">
            <div class="card-header">
              <span class="card-titel">{{ w.functie || 'Functie' }}</span>
              <span class="card-datum" :style="{ color: gekozenKleur }">
                <span v-if="w.vanMaand">{{ w.vanMaand.toString().padStart(2, '0') }}/{{ w.vanJaar }}</span>
                <span v-if="w.isHuidigeBaan"> - Heden</span>
                <span v-else-if="w.totMaand"> - {{ w.totMaand.toString().padStart(2, '0') }}/{{ w.totJaar }}</span>
              </span>
            </div>
            <div class="card-sub">{{ w.bedrijf || 'Organisatie' }}</div>
            <p class="modern-tekst">{{ w.omschrijving }}</p>
          </div>
        </div>

        <div v-if="toonOpleidingen">
          <h2 class="modern-hoofdtitel" :style="{ color: gekozenKleur }">Opleidingen</h2>
          <div v-for="o in gesorteerdeOpleidingen" :key="o.id" class="modern-card">
            <div class="card-header">
              <span class="card-titel">{{ o.studie || 'Opleiding of cursus' }}</span>
              <span class="card-datum" :style="{ color: gekozenKleur }">
                <span v-if="o.vanMaand">{{ o.vanMaand.toString().padStart(2, '0') }}/{{ o.vanJaar }}</span>
                <span v-if="o.isHuidigeOpleiding"> - Heden</span>
                <span v-else-if="o.totMaand"> - {{ o.totMaand.toString().padStart(2, '0') }}/{{ o.totJaar }}</span>
              </span>
            </div>
            <div class="card-sub">
              {{ o.instelling || 'Instituut' }}
              <span v-if="!o.isHuidigeOpleiding && o.isBehaald" style="margin-left: 5px;">✓ Behaald</span>
            </div>
          </div>
        </div>
        
        <div v-if="toonMeerOverMij && meerOverMijTekst" class="modern-card" style="background: #f8fafc; border: none;">
          <h3 class="modern-sectietitel" :style="{ color: gekozenKleur }">Extra info</h3>
          <p class="modern-tekst">{{ meerOverMijTekst }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cv-modern-papier {
  width: 210mm; min-width: 210mm; height: 297mm; background: #f8fafc; 
  box-shadow: 0 10px 30px rgba(0,0,0,0.15); flex-shrink: 0; position: relative; overflow: hidden;
  font-family: 'Inter', Arial, sans-serif; color: #333;
}
.modern-header {
  padding: 40px; color: white; display: flex; justify-content: space-between; align-items: flex-end;
  border-bottom-right-radius: 60px; margin-bottom: 30px; position: relative;
}
.modern-naam { font-size: 38px; font-weight: 800; margin-bottom: 8px; letter-spacing: -1px; }
.modern-contact { font-size: 13px; font-weight: 500; opacity: 0.9; display: flex; gap: 8px; }
.modern-foto {
  width: 120px; height: 120px; border-radius: 50%; border: 4px solid white; background-size: cover; background-position: top center;
  position: absolute; right: 40px; bottom: -40px; box-shadow: 0 8px 15px rgba(0,0,0,0.1);
}

.modern-body { display: flex; gap: 30px; padding: 0 40px 40px 40px; }
.modern-zijbalk { width: 32%; display: flex; flex-direction: column; gap: 20px; }
.modern-hoofd { width: 68%; }

.modern-sectietitel { font-size: 15px; font-weight: 800; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.5px;}
.modern-hoofdtitel { font-size: 20px; font-weight: 800; margin-bottom: 15px; margin-top: 20px;}
.modern-tekst { font-size: 13px; line-height: 1.6; color: #4a5568; }

.modern-profiel-kaart { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.03); }

.modern-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.modern-tag { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }

.modern-taal { margin-bottom: 12px; }
.taal-naam { font-size: 13px; font-weight: 600; display: block; margin-bottom: 4px; }
.taal-balk { width: 100%; height: 6px; background: #e2e8f0; border-radius: 10px; overflow: hidden; }
.taal-vul { height: 100%; border-radius: 10px; }

.modern-lijst { list-style: none; padding: 0; font-size: 13px; line-height: 1.8; color: #4a5568; }
.modern-lijst li::before { content: "→"; margin-right: 8px; color: #a0aec0; }

.modern-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); margin-bottom: 15px; border-left: 4px solid transparent; }
.card-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
.card-titel { font-size: 16px; font-weight: 800; color: #1a202c; }
.card-datum { font-size: 12px; font-weight: 700; }
.card-sub { font-size: 14px; font-weight: 600; color: #718096; margin-bottom: 8px; }
</style>