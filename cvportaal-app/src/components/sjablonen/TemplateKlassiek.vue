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
  <div class="cv-klassiek-papier">
    <div class="klassiek-header" :style="{ borderBottomColor: gekozenKleur }">
      <div class="header-links">
        <div v-if="profielfoto && toonFotoOpCv" class="klassiek-foto" :style="{ backgroundImage: `url(${profielfoto})`, borderColor: gekozenKleur }"></div>
        <div class="klassiek-titel-groep">
          <h1 class="klassiek-naam" :style="{ color: gekozenKleur }">{{ voornaam || 'Jouw' }} {{ achternaam || 'Naam' }}</h1>
          <p class="klassiek-profiel">{{ profieltekst || 'Jouw profieltekst verschijnt hier...' }}</p>
        </div>
      </div>
      <div class="header-rechts">
        <p v-if="woonplaats">{{ woonplaats }}</p>
        <p v-if="email">{{ email }}</p>
        <p v-if="telefoon">{{ telefoon }}</p>
        <p v-if="geboorteJaar">{{ geboorteJaar }}</p>
      </div>
    </div>

    <div class="klassiek-body">
      <div class="klassiek-hoofd">
        <div v-if="toonWerkervaring">
          <h2 class="klassiek-sectietitel" :style="{ color: gekozenKleur }">Werkervaring</h2>
          <div v-for="w in gesorteerdeWerkervaringen" :key="w.id" class="klassiek-item">
            <div class="item-header">
              <span class="item-titel">{{ w.functie || 'Functie' }}</span>
              <span class="item-datum">
                <span v-if="w.vanMaand">{{ w.vanMaand.toString().padStart(2, '0') }}/{{ w.vanJaar }}</span>
                <span v-if="w.isHuidigeBaan"> - Heden</span>
                <span v-else-if="w.totMaand"> - {{ w.totMaand.toString().padStart(2, '0') }}/{{ w.totJaar }}</span>
              </span>
            </div>
            <div class="item-sub">{{ w.bedrijf || 'Organisatie' }}</div>
            <p class="item-tekst">{{ w.omschrijving }}</p>
          </div>
        </div>

        <div v-if="toonOpleidingen">
          <h2 class="klassiek-sectietitel" :style="{ color: gekozenKleur }">Opleidingen & Cursussen</h2>
          <div v-for="o in gesorteerdeOpleidingen" :key="o.id" class="klassiek-item">
            <div class="item-header">
              <span class="item-titel">{{ o.studie || 'Opleiding of cursus' }}</span>
              <span class="item-datum">
                <span v-if="o.vanMaand">{{ o.vanMaand.toString().padStart(2, '0') }}/{{ o.vanJaar }}</span>
                <span v-if="o.isHuidigeOpleiding"> - Heden</span>
                <span v-else-if="o.totMaand"> - {{ o.totMaand.toString().padStart(2, '0') }}/{{ o.totJaar }}</span>
              </span>
            </div>
            <div class="item-sub">
              {{ o.instelling || 'Instituut' }}
              <span v-if="!o.isHuidigeOpleiding && o.isBehaald" style="margin-left: 5px; font-weight: bold;">(Behaald)</span>
            </div>
          </div>
        </div>
      </div>

      <div class="klassiek-zijbalk">
        <div v-if="toonSterkePunten && sterkePunten.length > 0" class="zijbalk-sectie">
          <h3 class="zijbalk-titel" :style="{ color: gekozenKleur }">Sterke punten</h3>
          <ul class="klassiek-lijst">
            <li v-for="p in sterkePunten" :key="p.id" v-show="p.tekst">{{ p.tekst }}</li>
          </ul>
        </div>

        <div v-if="toonTalen && talen.length > 0" class="zijbalk-sectie">
          <h3 class="zijbalk-titel" :style="{ color: gekozenKleur }">Talen</h3>
          <div v-for="t in talen" :key="t.id" v-show="t.naam" class="taal-item">
            <span>{{ t.naam }}</span>
            <span class="taal-niveau">{{ t.niveau }}/5</span>
          </div>
        </div>

        <div v-if="toonHobbys && hobbys.length > 0" class="zijbalk-sectie">
          <h3 class="zijbalk-titel" :style="{ color: gekozenKleur }">Hobby's</h3>
          <ul class="klassiek-lijst">
            <li v-for="h in hobbys" :key="h.id" v-show="h.tekst">{{ h.tekst }}</li>
          </ul>
        </div>

        <div v-if="heeftRijbewijs || heeftAuto" class="zijbalk-sectie">
          <h3 class="zijbalk-titel" :style="{ color: gekozenKleur }">Vervoer</h3>
          <ul class="klassiek-lijst">
            <li v-if="heeftRijbewijs">Rijbewijs B</li>
            <li v-if="heeftAuto">Eigen auto</li>
          </ul>
        </div>

        <div v-if="toonMeerOverMij && meerOverMijTekst" class="zijbalk-sectie">
          <h3 class="zijbalk-titel" :style="{ color: gekozenKleur }">Meer over mij</h3>
          <p style="font-size: 13px; line-height: 1.5; color: #444;">{{ meerOverMijTekst }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scoped zorgt dat deze opmaak NOOIT andere templates raakt */
.cv-klassiek-papier {
  width: 210mm; min-width: 210mm; height: 297mm; background: white; 
  box-shadow: 0 10px 30px rgba(0,0,0,0.15); flex-shrink: 0; padding: 40px;
  font-family: 'Times New Roman', Times, serif; color: #333;
}
.klassiek-header {
  display: flex; justify-content: space-between; border-bottom: 2px solid; padding-bottom: 20px; margin-bottom: 25px;
}
.header-links { display: flex; gap: 20px; align-items: center; max-width: 65%; }
.klassiek-foto {
  width: 100px; height: 100px; border-radius: 8px; border: 2px solid; background-size: cover; background-position: top center; flex-shrink: 0;
}
.klassiek-naam { font-size: 32px; font-weight: normal; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px; }
.klassiek-profiel { font-size: 14px; line-height: 1.5; font-style: italic; color: #555; }
.header-rechts { text-align: right; font-family: 'Arial', sans-serif; font-size: 12px; line-height: 1.6; color: #555; }

.klassiek-body { display: flex; gap: 30px; }
.klassiek-hoofd { width: 65%; }
.klassiek-zijbalk { width: 35%; border-left: 1px solid #ddd; padding-left: 20px; }

.klassiek-sectietitel { font-size: 18px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-bottom: 15px; letter-spacing: 1px; }
.klassiek-item { margin-bottom: 20px; font-family: 'Arial', sans-serif; }
.item-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; }
.item-titel { font-size: 15px; font-weight: bold; color: #111; }
.item-datum { font-size: 12px; color: #666; font-style: italic; }
.item-sub { font-size: 13px; font-weight: bold; color: #444; margin-bottom: 5px; }
.item-tekst { font-size: 13px; line-height: 1.5; color: #333; }

.zijbalk-sectie { margin-bottom: 25px; font-family: 'Arial', sans-serif; }
.zijbalk-titel { font-size: 14px; font-weight: bold; text-transform: uppercase; margin-bottom: 10px; }
.klassiek-lijst { list-style-type: square; padding-left: 15px; font-size: 13px; line-height: 1.8; color: #444; }
.taal-item { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; border-bottom: 1px dotted #ccc; padding-bottom: 2px;}
.taal-niveau { font-weight: bold; color: #666; }
</style>