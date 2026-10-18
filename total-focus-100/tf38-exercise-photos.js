/* TOTAL FOCUS 100 V38 — fotografias humanizadas no treino comum e guiado. */
(()=>{"use strict";
if(window.TF38_PHOTOS)return;
const base="./tf25-assets/treinos/";
const names={
"Isometria de bíceps":"isometria_biceps",
"Polichinelo":"polichinelo",
"Abdominal supra":"abdominal_supra",
"Abdominal supra curto":"abdominal_supra",
"Dead bug":"dead_bug",
"Agachamento na cadeira":"agachamento_cadeira",
"Extensão de quadril em quatro apoios":"extensao_quadril",
"Superman no chão":"superman",
"Gato-vaca":"gato_vaca",
"Flexão com um pé elevado":"flexao_pe_elevado",
"Isometria na parede":"isometria_parede",
"Prancha lateral adaptada":"prancha_lateral",
"Prancha lateral":"prancha_lateral",
"Flexão Spartana":"flexao_spartana",
"Flexão tipo jacaré":"flexao_jacare"
};
const old={
"Flexão no chão":["./tf25-assets/flexao_etapa_1.webp","./tf25-assets/flexao_etapa_3.webp"],
"Bird-dog":[base+"v31/bird_dog/etapa_01.webp",base+"v31/bird_dog/etapa_03.webp"],
"Ponte de glúteos":[base+"v31/ponte_gluteos/etapa_01.webp",base+"v31/ponte_gluteos/etapa_03.webp"],
"Prancha de antebraços":[base+"v31/prancha_antebracos/etapa_01.webp",base+"v31/prancha_antebracos/etapa_03.webp"],
"Agachamento livre":[base+"agachamento_livre/etapa_01.webp",base+"agachamento_livre/etapa_03.webp"],
"Abdominal reverso adaptado":[base+"v32/abdominal_reverso/etapa_01.webp",base+"v32/abdominal_reverso/etapa_03.webp"],
"Flexão na parede":[base+"v32/flexao_parede/etapa_01.webp",base+"v32/flexao_parede/etapa_03.webp"],
"Flexão inclinada no sofá firme":[base+"v32/flexao_sofa/etapa_01.webp",base+"v32/flexao_sofa/etapa_03.webp"]
};
function pair(name){const k=String(name||"").trim();if(names[k])return ["preparacao","execucao"].map(x=>base+"v38/"+names[k]+"/"+x+".webp");return old[k]||null;}
const escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function photoHTML(name,index){const photos=pair(name),label=index?"Execução":"Preparação";
if(!photos)return '<div class="tf38-pending">Fotografia de IA específica para '+escape(name)+' em preparação. Consulte as orientações de execução acima.</div>';
return '<div class="tf38-photo-wrap"><img class="tf38-photo" src="'+escape(photos[index])+'" alt="'+escape(name+" — "+label)+'" decoding="async" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="tf38-pending" hidden>Imagem indisponível. Confira as instruções de execução e tente atualizar a página.</span></div>';
}
const css=document.createElement("style");
css.id="tf38-photo-styles";
css.textContent=".tf-video .tf38-photo-wrap,.tf12-two .tf38-photo-wrap{display:flex;align-items:center;justify-content:center;min-height:145px;width:100%;background:#071f31;border-radius:10px;overflow:hidden}.tf38-photo{display:block;width:100%;height:100%;min-height:145px;max-height:275px;object-fit:contain;background:#071f31}.tf38-pending{display:block;color:#c9e8ee;font-size:12px;line-height:1.5;padding:16px 9px;text-align:center;min-height:145px}.tf38-pending[hidden]{display:none}.tf-video figure,.tf12-two figure{min-width:0;overflow:hidden}#tf12-dialog:has(.tf38-photo-wrap) .tf20-hero-exercise,#tf12-dialog:has(.tf38-photo-wrap) .tf15-photo{display:none!important}.tf38-ai-note{font-size:11px;color:#cde5ec}";
document.head.append(css);
window.TF38_PHOTOS=Object.freeze({version:"38.0",pair,has:name=>!!pair(name),photoHTML});
})();