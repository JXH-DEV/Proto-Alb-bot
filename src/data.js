export const INITIAL_MESSAGE_TEXT =
    "Bashkë mund të komunikojmë vetëm në gjuhën shqipe. A dëshiron të vazhdojmë?";

export const MOTIVATIONAL_QUOTES = [
    "Të gjitha ëndrrat tona mund të bëhen realitet nëse kemi guximin t'i ndjekim ato.",
    "E vetmja mënyrë për të bërë punë të madhe është ta duash atë që bën.",
    "Nuk ka rëndësi sa ngadalë ecën, për sa kohë që nuk ndalon.",
    "Bëhu ndryshimi që dëshiron të shohësh në botë.",
    "Çdo ditë është një mundësi e re për të qenë më i mirë se dje.",
    "Dielli lind sërish pas çdo stuhie."
];

// Rendi ka rëndësi: kur një mesazh përmend dy gjymtyrë, fiton e para.
export const SYNTAX_DATA = {
    kryefjala: {
        label: "Kryefjala",
        accusative: "Kryefjalën",
        keywords: ["kryefjala", "kryefjal"],
        def: "<strong>Kryefjala</strong> është gjymtyra kryesore e fjalisë që shënon frymorin a sendin i cili kryen veprimin ose që ka tiparin e shprehur nga kallëzuesi.",
        shprehet: "<strong>Kryefjala shprehet:</strong><br>a) me <strong>emër</strong> – <em>Shiu vazhdonte të binte lehtë e gëzueshëm.</em><br>b) me <strong>përemër</strong> – <em>Lirinë nuk ua solla unë, po e gjeta në mes jush.</em><br>c) me <strong>grup emëror</strong> – <em>Midis reve, herë pas here ndriçonte tokën dielli pranveror.</em><br>d) me <strong>pjesë të nënrenditur ftilluese</strong> – <em>Mendohet se ky qytet është një vendbanim i lashtë.</em>",
        llojet: null,
        question: "A dëshiron të dish se me çfarë shprehet?"
    },
    kallezuesi: {
        label: "Kallëzuesi",
        accusative: "Kallëzuesin",
        keywords: ["kallëzuesi", "kallezuesi", "kallëzues", "kallezues"],
        def: "<strong>Kallëzuesi</strong> është gjymtyra kryesore e fjalisë që tregon një veprim a një gjendje të kryefjalës.",
        llojet: "<strong>Klasifikimi i kallëzuesve sipas mënyrës së shprehjes:</strong><br>a) <strong>Kallëzues emëror</strong> – <em>Ai është njeri i besës.</em><br>b) <strong>Kallëzues i thjeshtë foljor</strong> – <em>Drita e mëngjesit po mbulonte tokën e përgjumur.</em><br>c) <strong>Kallëzues i përbërë foljor</strong> – <em>Ajo filloi të shkruante librin e parë.</em>",
        shprehet: "<strong>Mënyra e formimit:</strong><br>• <strong>Kallëzues emëror:</strong> folja ‘jam/është- këpuja’ + gjymtyra emërore ‘njeri i besës’ (GE).<br>• <strong>Kallëzues i thjeshtë foljor:</strong> folje në kohët e thjeshta ose kohë të përbëra.<br>• <strong>Kallëzues i përbërë foljor:</strong> folje aspektore (filloj, zë, nis...) ose folje modale (mund, duhet, do) + folje në lidhore, forma të pashtjelluara ose emra prejfoljor asnjanës.",
        question: "A dëshiron të dish llojet apo me çfarë shprehet?"
    },
    percaktori: {
        label: "Përcaktori",
        accusative: "Përcaktorin",
        keywords: ["përcaktori", "percaktori", "përcaktor", "percaktor"],
        def: "<strong>Përcaktori</strong> është gjymtyrë e dytë e fjalisë, pjesë e grupit emëror.",
        llojet: "<strong>Llojet e përcaktorëve:</strong><br>1. Përcaktori me përshtatje.<br>2. Përcaktori me drejtim.<br>3. Përcaktori me bashkim.",
        shprehet: "<strong>1. Përcaktori me përshtatje shprehet:</strong><br>a) me mbiemër – <em>Uji po rridhte me një zhurmë ritmike.</em><br>b) me përemër – <em>Motra e saj fliste aq bukur!</em><br>c) me numëror – <em>Ata janë tre shokë të mirë.</em><br><br><strong>2. Përcaktori me drejtim shprehet:</strong><br>a) Me emër në rasën emërore me parafjalë – <em>Vajza nga Tirana fitoi vendin e parë në konkurs.</em><br>b) Me emër në rasën gjinore – <em>Vargu i njerëzve nuk kishte të mbaruar.</em><br>c) Me emër në rasën kallëzore – <em>Në mbrëmje shijova një gotë verë me miqtë e mi.</em><br>d) Me emër në rasën rrjedhore – <em>Ajo dukej e brishtë si një gotë kristali.</em><br><br><strong>3. Përcaktori me bashkim shprehet:</strong><br>a) me formë të pashtjelluar pjesore – <em>Dy aktorë mbuluar me pelerina filluan të dialogonin.</em><br>b) me formë të pashtjelluar paskajore – <em>Dëshira për të studiuar ishte e ethshme.</em><br>c) me ndajfolje – <em>Klasa përballë është e motrës sime.</em>",
        question: "A dëshiron të dish llojet apo me çfarë shprehet?"
    },
    kundrinori: {
        label: "Kundrinori",
        accusative: "Kundrinorin",
        keywords: ["kundrinori", "kundrinor"],
        def: "<strong>Kundrinori</strong> është gjymtyrë e dytë që tregon objektin mbi të cilin bie veprimi i foljes.",
        llojet: "<strong>Llojet:</strong><br>• Kundrinor i drejtë (pa parafjalë).<br>• Kundrinor i zhdrejtë (me ose pa parafjalë).",
        shprehet: "<strong>Shprehet me:</strong><br>• Emër, përemër ose grup emëror.",
        question: "A dëshiron të dish llojet apo me çfarë shprehet?"
    },
    rrethanori: {
        label: "Rrethanori",
        accusative: "Rrethanorin",
        keywords: ["rrethanori", "rrethanor"],
        def: "<strong>Rrethanori</strong> është gjymtyrë e dytë e fjalisë që tregon rrethanën (vendin, kohën, mënyrën, shkakun etj.) në të cilën kryhet veprimi ose ndodh gjendja e shprehur nga kallëzuesi.",
        llojet: "<strong>Llojet e rrethanorëve sipas kuptimit:</strong><br>a) <strong>Rrethanor vendi</strong> (ku?) – <em>Fëmijët luanin në oborr.</em><br>b) <strong>Rrethanor kohe</strong> (kur?) – <em>Në mëngjes ra shi i imët.</em><br>c) <strong>Rrethanor mënyre</strong> (si?) – <em>Ai fliste me qetësi.</em><br>d) <strong>Rrethanor shkaku</strong> (pse?) – <em>Nga gëzimi ajo nuk fliste dot.</em><br>e) <strong>Rrethanor qëllimi</strong> (për çfarë qëllimi?) – <em>Ai shkoi në qytet për të blerë libra.</em><br>f) <strong>Rrethanor sasie</strong> (sa?) – <em>Ai punon shumë.</em><br>g) <strong>Rrethanor kushti</strong> – <em>Pa ndihmën tënde, nuk do ta kisha mbaruar detyrën.</em><br>h) <strong>Rrethanor lejimi</strong> – <em>Megjithë shiun, ata dolën për shëtitje.</em>",
        shprehet: "<strong>Rrethanori shprehet:</strong><br>a) me <strong>ndajfolje</strong> – <em>Fëmijët luanin jashtë.</em><br>b) me <strong>emër me parafjalë</strong> – <em>Dielli perëndonte pas kodrës.</em><br>c) me <strong>grup emëror</strong> – <em>Atë mbrëmje u mblodhëm te shtëpia e gjyshit.</em><br>d) me <strong>formë të pashtjelluar</strong> – <em>Duke ecur nëpër rrugë, ai mendonte për shokët.</em><br>e) me <strong>pjesë të nënrenditur rrethanore</strong> – <em>Kur erdhi pranvera, fushat u mbuluan me lule.</em>",
        question: "A dëshiron të dish llojet apo me çfarë shprehet?"
    }
};

export const GLOSSARY_TERMS = [
    { term: "Sintaksa", def: "Pjesë e gramatikës që studion ndërtimin e fjalive dhe marrëdhëniet mes fjalëve." },
    { term: "Kryefjala", def: "Gjymtyrë kryesore që tregon kush e kryen veprimin ose për kë flitet në fjali." },
    { term: "Kallëzuesi", def: "Gjymtyrë kryesore që tregon veprimin apo gjendjen e kryefjalës." },
    { term: "Kundrinori", def: "Gjymtyrë e dytë mbi të cilën bie veprimi i foljes." },
    { term: "Përcaktori", def: "Gjymtyrë e dytë që shërben për të përcaktuar (cilësuar) emrin bërthamë." },
    { term: "Rrethanori", def: "Gjymtyrë e dytë që tregon rrethanën e kryerjes së veprimit (kohë, vend, mënyrë etj.)." },
    { term: "Folja", def: "Pjesë e ligjëratës që tregon veprim ose gjendje (psh: <em>punoj, jam</em>)." },
    { term: "Emri", def: "Pjesë e ligjëratës që emërton frymorë, sende, vende ose dukuri (psh: <em>Tirana, djalë</em>)." },
    { term: "Mbiemri", def: "Pjesë e ligjëratës që tregon një cilësi të emrit (psh: <em>i bukur, e lartë</em>)." }
];
