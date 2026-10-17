/* TOTAL FOCUS V36 — anatomia esquemática localizada por exercício.
* Contornos vetoriais e regiões destacadas são ilustrativos; não são fotografias nem medem ativação muscular.
* Sem acesso/alteração ao localStorage. */
(()=>{'use strict';
if(window.TF36_MUSCLES)return;
const FRONT=Object.freeze({
peitoral:'<path d="M47 83 Q68 74 80 91 Q92 74 114 83 L106 112 Q90 120 80 108 Q69 120 53 112Z"/>',
deltoides:'<path d="M47 77 Q36 75 31 93 L23 108 39 121 50 104Z M113 77 Q124 75 129 93 L137 108 121 121 110 104Z"/>',
biceps:'<path d="M28 119 Q21 125 18 150 L31 155 40 121Z M132 119 Q139 125 142 150 L129 155 120 121Z"/>',
core:'<path d="M69 120 L91 120 L93 172 67 172Z"/>',
obliquos:'<path d="M53 120 L67 124 67 175 57 180 50 154Z M107 120 L93 124 93 175 103 180 110 154Z"/>',
serratil:'<path d="M47 110 L55 108 59 119 65 113 67 131 57 130 51 144Z M113 110 L105 108 101 119 95 113 93 131 103 130 109 144Z"/>',
flexores:'<path d="M65 179 L79 179 75 218 60 213Z M95 179 L81 179 85 218 100 213Z"/>',
quadriceps:'<path d="M58 221 L78 219 75 297 58 299Z M102 221 L82 219 85 297 102 299Z"/>',
tibial:'<path d="M58 304 L74 303 69 366 58 367Z M102 304 L86 303 91 366 102 367Z"/>'
});
const BACK=Object.freeze({
trapezio:'<path d="M75 62 L85 62 109 84 102 111 81 100 58 111 51 84Z"/>',
romboides:'<path d="M64 102 L79 99 79 138 63 124Z M96 102 L81 99 81 138 97 124Z"/>',
dorsal:'<path d="M51 116 L66 128 69 178 54 179 44 147Z M109 116 L94 128 91 178 106 179 116 147Z"/>',
triceps:'<path d="M28 119 Q21 125 18 150 L31 155 40 121Z M132 119 Q139 125 142 150 L129 155 120 121Z"/>',
eretores:'<path d="M73 141 L79 142 77 211 68 209Z M87 141 L81 142 83 211 92 209Z"/>',
gluteos:'<path d="M54 190 Q68 181 80 199 Q92 181 106 190 L103 229 Q89 243 80 222 Q71 243 57 229Z"/>',
posteriores:'<path d="M58 235 L78 233 75 297 58 299Z M102 235 L82 233 85 297 102 299Z"/>',
panturrilhas:'<path d="M57 302 Q69 293 75 309 L68 356 59 353Z M103 302 Q91 293 85 309 L92 356 101 353Z"/>'
});
const LABELS=Object.freeze({peitoral:'Peitoral',deltoides:'Deltoides',biceps:'Bíceps',triceps:'Tríceps',core:'Reto abdominal e core',obliquos:'Oblíquos',serratil:'Serrátil anterior',flexores:'Flexores do quadril',quadriceps:'Quadríceps',tibial:'Tibial anterior',trapezio:'Trapézio',romboides:'Romboides',dorsal:'Grande dorsal',eretores:'Eretores da coluna',gluteos:'Glúteos',posteriores:'Posteriores de coxa',panturrilhas:'Panturrilhas'});
const MAP={
'Flexão na parede':[['peitoral','triceps','deltoides'],['core']],
'Flexão inclinada':[['peitoral','triceps','deltoides'],['core']],
'Flexão inclinada no sofá firme':[['peitoral','triceps','deltoides'],['core']],
'Flexão de joelhos':[['peitoral','triceps','deltoides'],['core']],
'Flexão no chão':[['peitoral','triceps','deltoides'],['core','serratil']],
'Flexão Spartana':[['peitoral','triceps','deltoides'],['core','obliquos','serratil']],
'Flexão tipo jacaré':[['peitoral','triceps','deltoides'],['core','obliquos','serratil']],
'Flexão com um pé elevado':[['peitoral','triceps','deltoides'],['core','obliquos','gluteos']],
'Polichinelo':[['quadriceps','panturrilhas','deltoides'],['gluteos','core']],
'Isometria de bíceps':[['biceps'],['core']],
'Remada auto-resistida':[['dorsal','romboides','biceps'],['trapezio','core']],
'Elevação escapular em W':[['romboides','trapezio'],['deltoides']],
'Anjo na parede':[['trapezio','romboides','deltoides'],['core']],
'Prancha inclinada':[['core','obliquos'],['deltoides','gluteos']],
'Prancha de joelhos':[['core','obliquos'],['deltoides','gluteos']],
'Prancha de antebraços':[['core','obliquos'],['gluteos','deltoides']],
'Prancha lateral adaptada':[['obliquos','core'],['deltoides','gluteos']],
'Dead bug':[['core','obliquos'],['flexores','eretores']],
'Abdominal supra curto':[['core'],['obliquos']],
'Abdominal reverso adaptado':[['core'],['obliquos','flexores']],
'Abdominal protocolo TAF PMERJ':[['core'],['flexores','obliquos']],
'Bird-dog':[['eretores','gluteos','core'],['deltoides']],
'Gato-vaca':[['eretores'],['core']],
'Ponte de glúteos':[['gluteos'],['posteriores','core']],
'Extensão de quadril em quatro apoios':[['gluteos'],['posteriores','eretores']],
'Agachamento na cadeira':[['quadriceps','gluteos'],['core','posteriores']],
'Agachamento livre':[['quadriceps','gluteos'],['core','posteriores']],
'Afundo reverso com apoio':[['quadriceps','gluteos'],['posteriores','core']],
'Panturrilhas':[['panturrilhas'],['core']],
'Mobilidade torácica':[['eretores','romboides'],['obliquos']],
'Mobilidade de quadril':[['flexores','gluteos'],['obliquos']],
'Mobilidade de tornozelo':[['panturrilhas','tibial'],[]],
'Respiração e relaxamento':[['core'],[]],
'Superman no chão':[['eretores','gluteos'],['posteriores','romboides']],
'Isometria na parede':[['quadriceps','gluteos'],['core','posteriores']]
};
const grey='#243b4d',line='#80aabb',main='#17e0b5',secondary='#fbbe42';
const silhouette='<g fill="'+grey+'" stroke="'+line+'" stroke-width="1.1" stroke-linejoin="round">'+
'<ellipse cx="80" cy="34" rx="21" ry="28"/><path d="M69 60L91 60L96 78L64 78Z"/>'+
'<path d="M45 77L115 77Q128 84 121 120L109 184 106 228 54 228 51 184 39 120Q32 84 45 77Z"/>'+
'<path d="M43 85Q28 82 23 112L12 162 23 176 39 129 48 103Z M117 85Q132 82 137 112L148 162 137 176 121 129 112 103Z"/>'+
'<path d="M12 162L23 166 17 229 9 250 2 245 6 219Z M148 162L137 166 143 229 151 250 158 245 154 219Z"/>'+
'<path d="M53 224L78 224 73 298 70 363 59 370 51 301Z M107 224L82 224 87 298 90 363 101 370 109 301Z"/>'+
'</g>';
function esc(v){return String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function figure(side,primary,assist){const patches=side==='frente'?FRONT:BACK;let overlay='';for(const [key,shape] of Object.entries(patches)){const fill=primary.includes(key)?main:assist.includes(key)?secondary:'#3b5363';const op=primary.includes(key)||assist.includes(key)?'.97':'.48';overlay+='<g fill="'+fill+'" fill-opacity="'+op+'" stroke="#051a29" stroke-width=".85">'+shape+'</g>';}
return '<g transform="translate('+(side==='frente'?84:370)+',26)">'+silhouette+overlay+'</g>';
}
function render(name,spec){const group=MAP[name];if(!group)return '';
const primary=group[0],assist=group[1],unique=[...new Set([...primary,...assist])];
const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 650 440" role="img" aria-label="Mapa muscular localizado de '+esc(name)+' com destaque para '+esc(unique.map(k=>LABELS[k]).join(', '))+'" style="width:100%;height:auto;max-height:410px;background:#071b28;border:1px solid #226277;border-radius:15px">'+
'<g font-family="system-ui,Arial,sans-serif" fill="#d4f8ff" text-anchor="middle"><text x="165" y="24" font-size="20" font-weight="700">FRENTE</text><text x="452" y="24" font-size="20" font-weight="700">COSTAS</text></g>'+figure('frente',primary,assist)+figure('costas',primary,assist)+
'<g font-family="system-ui,Arial,sans-serif" font-size="14" fill="#def7ff"><rect x="18" y="407" width="13" height="13" rx="3" fill="'+main+'"/><text x="38" y="419">Principais</text><rect x="180" y="407" width="13" height="13" rx="3" fill="'+secondary+'"/><text x="200" y="419">Auxiliares / estabilizadores</text></g></svg>';
const tags='<div style="display:flex;gap:6px;flex-wrap:wrap;margin:12px 0">'+unique.map(k=>'<span style="padding:5px 9px;border:1px solid '+(primary.includes(k)?'#17e0b5':'#bd872c')+';color:#e0f9fc;border-radius:25px;font-size:12px">'+esc(LABELS[k])+'</span>').join('')+'</div>';
const caution=(['Mobilidade torácica','Mobilidade de quadril','Mobilidade de tornozelo','Respiração e relaxamento','Gato-vaca'].includes(name)?'Em mobilidade e recuperação, os destaques indicam regiões relacionadas ao movimento, não músculos que precisam ser contraídos com força. ':'')+'Mapa anatômico esquemático específico deste movimento. Destaques representam músculos-alvo aproximados, não exame clínico ou mensuração de ativação.';
return '<section class="tf36-anatomy" aria-label="Músculos associados a '+esc(name)+'">'+svg+tags+'<p class="tf32-note">'+esc(caution)+'</p></section>';
}
window.TF36_MUSCLES=Object.freeze({version:'36.0',render,coverage:Object.keys(MAP)});
})();