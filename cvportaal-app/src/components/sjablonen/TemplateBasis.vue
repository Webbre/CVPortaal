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
  <div class="cv-papier">
    <div class="cv-zijbalk" :style="{ backgroundColor: gekozenKleur }">
      <div v-if="profielfoto && toonFotoOpCv" class="cv-profielfoto" :style="{ backgroundImage: `url(${profielfoto})`, backgroundSize: 'cover', backgroundPosition: 'top center' }"></div>
      <div v-else style="height: 40px;"></div>
      
      <div class="cv-sectie-titel-zijbalk">Mijn gegevens</div>
      <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 8px;">
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              <span class="cv-tekst-zijbalk" style="margin-bottom: 0;">{{ woonplaats || 'Woonplaats' }}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <span class="cv-tekst-zijbalk" style="margin-bottom: 0;">{{ email || 'E-mail' }}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <span class="cv-tekst-zijbalk" style="margin-bottom: 0;">{{ telefoon || 'Telefoon' }}</span>
          </div>
          <div v-if="geboorteJaar" style="display: flex; align-items: center; gap: 8px;">
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <span class="cv-tekst-zijbalk" style="margin-bottom: 0;">{{ geboorteJaar }}</span>
          </div>
      </div>

      <div v-if="heeftRijbewijs || heeftAuto" style="margin-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.3); padding-top: 15px;">
          <div class="cv-tekst-zijbalk" v-if="heeftRijbewijs">✓ Rijbewijs B</div>
          <div class="cv-tekst-zijbalk" v-if="heeftAuto">✓ Eigen auto</div>
      </div>

      <div v-if="toonSterkePunten" style="margin-top: 25px; border-top: 1px solid rgba(255, 255, 255, 0.3); padding-top: 20px;">
          <div class="cv-sectie-titel-zijbalk">Sterke punten</div>
          <div v-if="sterkePunten.length === 0"><div class="cv-tekst-zijbalk" style="font-style: italic; opacity: 0.7;">Nog geen sterke punten toegevoegd.</div></div>
          <div v-else style="display: flex; flex-direction: column; gap: 8px;">
              <div v-for="p in sterkePunten" :key="p.id" v-show="p.tekst" style="display: flex; align-items: flex-start; gap: 8px;">
                  <span style="font-size: 14px; line-height: 1.2;">•</span>
                  <span class="cv-tekst-zijbalk" style="margin-bottom: 0;">{{ p.tekst }}</span>
              </div>
          </div>
      </div>

      <div v-if="toonTalen" style="margin-top: 25px; border-top: 1px solid rgba(255, 255, 255, 0.3); padding-top: 20px;">
          <div class="cv-sectie-titel-zijbalk">Talen</div>
          <div v-if="talen.length === 0"><div class="cv-tekst-zijbalk" style="font-style: italic; opacity: 0.7;">Nog geen talen toegevoegd.</div></div>
          <div v-else v-for="taal in talen" :key="taal.id" v-show="taal.naam" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span class="cv-tekst-zijbalk" style="margin-bottom: 0; font-weight: 600;">{{ taal.naam }}</span>
              <div style="display: flex; gap: 3px;">
                  <svg aria-hidden="true" focusable="false" v-for="ster in 5" :key="ster" :fill="ster <= taal.niveau ? '#FFD700' : 'none'" stroke="#FFD700" viewBox="0 0 24 24" stroke-width="1.5" width="14" height="14">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
              </div>
          </div>
      </div>

    </div>
    <div class="cv-hoofdkolom">
        <div class="cv-naam">{{ voornaam || 'Jouw' }} {{ achternaam || 'Naam' }}</div>
        
        <div class="cv-sectie-titel-hoofd" :style="{ color: gekozenKleur }">Dit ben ik</div>
        <p class="cv-p">{{ profieltekst || 'Jouw profieltekst verschijnt hier...' }}</p>
        
        <div v-if="toonWerkervaring">
            <div class="cv-sectie-titel-hoofd" :style="{ color: gekozenKleur }">Werkervaring</div>
            <div v-if="werkervaringen.length === 0"><p class="cv-p-italic">Nog geen werkervaring toegevoegd.</p></div>
            <div v-else v-for="w in gesorteerdeWerkervaringen" :key="w.id" class="cv-item">
                <div class="cv-item-titel">{{ w.functie || 'Functie' }}</div>
                <div class="cv-item-sub">
                        {{ w.bedrijf || 'Organisatie' }} | 
                        <span v-if="w.vanMaand && w.vanJaar">{{ w.vanMaand.toString().padStart(2, '0') }}/{{ w.vanJaar }}</span>
                        <span v-if="w.isHuidigeBaan"> - Heden</span>
                        <span v-else-if="w.totMaand && w.totJaar"> - {{ w.totMaand.toString().padStart(2, '0') }}/{{ w.totJaar }}</span>
                </div>
                <p class="cv-p">{{ w.omschrijving }}</p>
            </div>
        </div>

        <div v-if="toonOpleidingen">
            <div class="cv-sectie-titel-hoofd" :style="{ color: gekozenKleur }">Opleidingen en cursussen</div>
            <div v-if="opleidingen.length === 0"><p class="cv-p-italic">Nog geen opleidingen of cursussen toegevoegd.</p></div>
            <div v-else v-for="o in gesorteerdeOpleidingen" :key="o.id" class="cv-item">
                <div class="cv-item-titel">{{ o.studie || 'Opleiding of cursus' }}</div>
                <div class="cv-item-sub">
                    {{ o.instelling || 'School of Instituut' }} | 
                    <span v-if="o.vanMaand && o.vanJaar">{{ o.vanMaand.toString().padStart(2, '0') }}/{{ o.vanJaar }}</span>
                    <span v-if="o.isHuidigeOpleiding"> - Heden</span>
                    <span v-else-if="o.totMaand && o.totJaar"> - {{ o.totMaand.toString().padStart(2, '0') }}/{{ o.totJaar }}</span>
                    <span v-if="!o.isHuidigeOpleiding && o.isBehaald" style="font-weight: 700; margin-left: 5px;">
                        | <span :style="{ color: gekozenKleur }">✓</span> {{ o.type === 'Cursus' ? 'Certificaat' : 'Diploma' }}
                    </span>
                </div>
            </div>
        </div>

        <div v-if="toonHobbys">
            <div class="cv-sectie-titel-hoofd" :style="{ color: gekozenKleur }">Dit vind ik leuk</div>
            <div v-if="hobbys.length === 0"><p class="cv-p-italic">Nog geen items toegevoegd.</p></div>
            <div v-else style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 25px; align-content: flex-start;">
                <span v-for="hobby in hobbys" :key="hobby.id" v-show="hobby.tekst" class="cv-tag" :style="{ color: gekozenKleur, border: '1.5px solid ' + gekozenKleur }">
                    {{ hobby.tekst }}
                </span>
            </div>
        </div>

        <div v-if="toonMeerOverMij">
            <div class="cv-sectie-titel-hoofd" :style="{ color: gekozenKleur }">Meer over mij</div>
            <div v-if="!meerOverMijTekst"><p class="cv-p-italic">Nog geen tekst toegevoegd.</p></div>
              <div v-else class="cv-info-kaart" :style="{ borderLeftColor: gekozenKleur }">
                {{ meerOverMijTekst }}
            </div>
        </div>
    </div>
  </div>
</template>