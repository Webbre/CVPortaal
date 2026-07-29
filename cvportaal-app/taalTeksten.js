// taalTeksten.js
// ---------------------------------------------------------------------------
// De uitleg "je mag in je eigen taal schrijven", per taal.
//
// ⚠️ STATUS VAN DE VERTALINGEN — NOG NA TE KIJKEN DOOR MOEDERTAALSPREKERS.
// Aandachtspunten om specifiek voor te leggen:
//   - Somalisch: de eerste zin lijkt over praten te gaan in plaats van
//     schrijven ("kala hadaysaa"), en "klikken" lijkt vertaald als
//     "toevoegen" ("dar"). Laten controleren.
//   - Tigrinya: onsamenhangende zinsbouw en gewone punten in plaats van het
//     Tigrinya-scheidingsteken (።). Dit is de minst betrouwbare van allemaal
//     en verdient de meeste aandacht.
//   - Dari en Farsi verschillen hier in één werkwoord. Dat kán kloppen —
//     in formeel geschreven Perzisch liggen beide varianten dicht bij
//     elkaar — maar het is het navragen waard.
//
// Vraag bij het nakijken niet alleen "klopt dit", maar ook "klinkt dit
// normaal en respectvol". Een kromme zin in iemands moedertaal is erger dan
// geen zin — zeker bij een doelgroep die vaak al ervaart dat instanties niet
// met hen meedenken.
//
// De naam van elke taal staat bewust in het eigen schrift, niet met een vlag:
// bij Arabisch zou je moeten kiezen tussen Syrië, Irak of Jemen, en een
// Russische vlag is voor veel Oekraïners onacceptabel.
//
// De knopnaam 'Verbeter met AI' blijft in elke taal onvertaald, zodat de
// gebruiker de knop kan terugvinden.
// ---------------------------------------------------------------------------

export const taalTeksten = [
  {
    code: 'nl',
    naam: 'Nederlands',
    richting: 'ltr',
    uitleg: `Je mag in je eigen taal schrijven. Klik daarna op "Verbeter met AI". Je tekst wordt dan omgezet naar het Nederlands.`,
    let_op: `Laat je begeleider de Nederlandse tekst nakijken voordat je het cv gebruikt.`,
  },
  {
    code: 'en',
    naam: 'English',
    richting: 'ltr',
    uitleg: `You can write in your own language. Then click on "Verbeter met AI". Your text will then be converted to Dutch.`,
    let_op: `Have your coach check the Dutch text before using the CV.`,
  },
  {
    code: 'ar',
    naam: 'العربية',
    richting: 'rtl',
    uitleg: `يمكنك الكتابة بلغتك الخاصة. ثم انقر على "Verbeter met AI". سيتم بعد ذلك تحويل نصك إلى الهولندية.`,
    let_op: `اطلب من مدربك مراجعة النص الهولندي قبل استخدام السيرة الذاتية.`,
  },
  {
    code: 'ti',
    naam: 'ትግርኛ',
    richting: 'ltr',
    uitleg: `ናይ ነፍስኻ ቋንቋኻ ብዛዕባ ክትብ እንተኣለኻ. ካልእ ኣብ "Verbeter met AI" ጠቕል. ጽሑርኻ ካልእ ናይ ሆላንዳዊ እዩ.`,
    let_op: `ኣብቲ ንሓትኻ ምምሕዳስ ናይ ሆላንዳዊ ጽሑር ኣብ ምንጭ ንኡስ እንጥቀም CV ክትወሃቦ እንተኣለኻ.`,
  },
  {
    code: 'uk',
    naam: 'Українська',
    richting: 'ltr',
    uitleg: `Ти можеш писати своєю мовою. Потім натисни "Verbeter met AI". Твій текст буде перекладений на нідерландську.`,
    let_op: `Попроси свого тренера перевірити нідерландський текст, перш ніж використовувати резюме.`,
  },
  {
    code: 'ru',
    naam: 'Русский',
    richting: 'ltr',
    uitleg: `Ты можешь писать на своём языке. Затем нажми "Verbeter met AI". Твой текст будет переведён на нидерландский.`,
    let_op: `Попроси своего тренера проверить нидерландский текст, прежде чем использовать резюме.`,
  },
  {
    code: 'tr',
    naam: 'Türkçe',
    richting: 'ltr',
    uitleg: `Kendi dilinde yazabilirsin. Sonra "Verbeter met AI"'ye tıkla. Metnin ardından Hollandacaya çevrilecek.`,
    let_op: `CV'yi kullanmadan önce Hollandaca metni koçuna kontrol ettir.`,
  },
  {
    code: 'fa',
    naam: 'فارسی',
    richting: 'rtl',
    uitleg: `می‌توانید به زبان خود بنویسید. سپس روی "Verbeter met AI" کلیک کنید. متن شما سپس به زبان هلندی تبدیل می‌شود.`,
    let_op: `قبل از استفاده از رزومه، متن هلندی را به مربی خود برای بررسی بدهید.`,
  },
  {
    // LET OP: deze tekst is momenteel identiek aan het Farsi hierboven.
    code: 'prs',
    naam: 'دری',
    richting: 'rtl',
    uitleg: `می‌توانید به زبان خود بنویسید. سپس روی "Verbeter met AI" کلیک کنید. متن شما سپس به زبان هلندی ترجمه می‌شود.`,
    let_op: `قبل از استفاده از رزومه، متن هلندی را به مربی خود برای بررسی بدهید.`,
  },
  {
    code: 'ps',
    naam: 'پښتو',
    richting: 'rtl',
    uitleg: `تاسو کولی شئ په خپله ژبه ليکل شئ. بيا په "Verbeter met AI" کلیک وکړئ. تاسو متن بيا په هولنډي ژبه بدلول کیږي.`,
    let_op: `چې CV وکاروئ، لومړی په هولنډي متن خپل کوچ ته وگورئ.`,
  },
  {
    code: 'so',
    naam: 'Soomaali',
    richting: 'ltr',
    uitleg: `Waxaad kala hadaysaa luuqadaada. Markaas dar "Verbeter met AI". Waxaad markaa turjumaada ugu beddelayaa Af-Holandi.`,
    let_op: `Ka hor intaad CV-ga isticmaalsato, Af-Holandi ku eeg barahaada.`,
  },
]