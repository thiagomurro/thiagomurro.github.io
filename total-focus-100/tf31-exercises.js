/* TOTAL FOCUS 100 V33 — biblioteca didática completa de calistenia; somente leitura de dados privados. */
(()=>{"use strict";
if(window.TF31_EXERCISES?.version==="35.0")return;
const DK="totalfocus100.private.dataset.v1",SK="totalfocus100.v1";
const ROOT="./tf25-assets/treinos/";
const imgStep=(name,prefix,i)=>name==="Flexão no chão"?"./tf25-assets/flexao_etapa_"+(i+1)+".webp":ROOT+prefix+"/etapa_0"+(i+1)+".webp";
const PHOTO={
"Flexão inclinada":"v33/flexao_inclinada",
"Isometria de bíceps":"v33/isometria_biceps",
"Panturrilhas":"v33/panturrilhas",
"Mobilidade torácica":"v33/mobilidade_toracica",
"Mobilidade de quadril":"v33/mobilidade_quadril",
"Mobilidade de tornozelo":"v33/mobilidade_tornozelo",
"Elevação escapular em W":"v33/elevacao_escapular_w",
"Prancha inclinada":"v33/prancha_inclinada",
"Respiração e relaxamento":"v33/respiracao_relaxamento",
"Prancha de joelhos":"v33/prancha_joelhos",
"Anjo na parede":"v33/anjo_parede",
"Remada auto-resistida":"v33/remada_auto_resistida",
"Afundo reverso com apoio":"v33/afundo_reverso",
"Agachamento livre":"v33/agachamento_livre",
"Flexão de joelhos":"v33/flexao_joelhos",
"Flexão na parede":"v32/flexao_parede",
"Flexão inclinada no sofá firme":"v32/flexao_sofa",
"Agachamento na cadeira":"v32/agachamento_cadeira",
"Dead bug":"v32/dead_bug",
"Abdominal reverso adaptado":"v32/abdominal_reverso",
"Gato-vaca":"v32/gato_vaca",
"Prancha lateral adaptada":"v32/prancha_lateral",
"Extensão de quadril em quatro apoios":"v32/extensao_quadril",
"Abdominal supra curto":"abdominal_supra",
"Prancha de antebraços":"v31/prancha_antebracos",
"Bird-dog":"v31/bird_dog",
"Ponte de glúteos":"v31/ponte_gluteos"
};
const EXTRA={"Flexão no chão":"original_flexao","Superman no chão":"v32/superman","Isometria na parede":"v32/isometria_parede","Polichinelo":"v35/polichinelo","Flexão Spartana":"v35/flexao_spartana","Flexão tipo jacaré":"v35/flexao_jacare","Flexão com um pé elevado":"v35/flexao_pe_elevado"};
const MUSCLES_V35={
"Polichinelo":{"Principais":["Quadríceps","Panturrilhas","Deltoides"],"Estabilizadores":["Glúteos","Abdominais"]},
"Flexão Spartana":{"Principais":["Peitoral maior","Tríceps braquial","Deltoide anterior"],"Estabilizadores":["Reto abdominal","Oblíquos","Serrátil anterior"]},
"Flexão tipo jacaré":{"Principais":["Peitoral maior","Tríceps braquial","Deltoide anterior"],"Estabilizadores":["Serrátil anterior","Reto abdominal","Oblíquos"]},
"Flexão com um pé elevado":{"Principais":["Peitoral maior","Tríceps braquial","Deltoide anterior"],"Estabilizadores":["Abdominais","Glúteos","Estabilizadores pélvicos"]}
};
const STEPS={
"Polichinelo":["Em pé, una os pés e mantenha os braços ao lado do corpo.","Salte suavemente abrindo as pernas enquanto eleva os braços.","No ponto alto, mantenha o tronco estável e respire continuamente.","Feche as pernas, abaixe os braços e repita sem perder o controle."],
"Flexão Spartana":["Comece em prancha alta, com uma mão mais adiante ou mais aberta que a outra.","Flexione os cotovelos, mantendo tronco e quadril alinhados.","Empurre o chão até estender os braços, sem torcer a lombar.","Na repetição seguinte, inverta lentamente as posições das mãos."],
"Flexão tipo jacaré":["Comece em prancha alta, mãos apoiadas com firmeza.","Dobre os cotovelos aproximando o peito do chão, sem perder alinhamento.","Avance uma mão e o pé oposto em deslocamento curto, com o corpo baixo.","Empurre para cima e repita alternando lados, somente com controle."],
"Flexão com um pé elevado":["Inicie em prancha alta, com um pé apoiado em superfície estável — variação ilustrada.","Desça flexionando os cotovelos sem deixar a bacia girar.","Mantenha o core ativo e a perna elevada estável durante o movimento.","Empurre o chão, retorne e alterne o pé; faça a variante sem apoio apenas com técnica segura."],
"Flexão inclinada":["Utilize bancada ou apoio fixo que não deslize; mantenha o corpo alinhado.", "Dobre os cotovelos e aproxime o peito do apoio.", "Evite deixar quadril ou lombar caírem.", "Empurre e retorne com controle."],
"Isometria de bíceps":["Fique em pé com o cotovelo junto ao corpo.", "Com a mão oposta, ofereça resistência leve ao braço em flexão.", "Sustente por 10 a 15 segundos, respirando normalmente.", "Solte com calma e repita no outro braço."],
"Panturrilhas":["Fique em pé perto de apoio firme, com ambos os pés no chão.", "Levante os calcanhares lentamente, ficando sobre a parte dianteira dos pés.", "Segure um instante sem balançar o corpo.", "Abaixe os calcanhares com controle."],
"Mobilidade torácica":["Sente-se ereto ou apoie-se em quatro apoios, sem forçar.", "Gire suavemente o tronco para um dos lados.", "Gire para o lado oposto sem torcer a região lombar.", "Volte ao centro e respire."],
"Mobilidade de quadril":["Fique em pé e segure apoio que não deslize.", "Mova uma perna suavemente para a frente.", "Mova a perna para trás sem arquear a lombar.", "Volte ao centro e troque de lado."],
"Mobilidade de tornozelo":["Posicione uma perna à frente, com todo o calcanhar apoiado.", "Leve o joelho adiante na direção dos dedos do pé.", "Mantenha o calcanhar totalmente no chão.", "Retorne e repita com a outra perna."],
"Elevação escapular em W":["Fique ereto com os braços dobrados na posição de W.", "Mantenha os ombros baixos, evitando encolhê-los.", "Aproxime suavemente as escápulas, sem curvar o tronco.", "Relaxe e repita em ritmo controlado."],
"Prancha inclinada":["Apoie as mãos numa bancada firme e os pés no chão.", "Estenda os braços e alinhe cabeça, quadril e calcanhares.", "Contraia abdômen e glúteos e respire continuamente.", "Finalize após o tempo previsto, sem deixar o quadril cair."],
"Respiração e relaxamento":["Sente-se ou deite em posição confortável, com ombros soltos.", "Inspire naturalmente, sem forçar a expansão.", "Expire de maneira lenta e tranquila.", "Repita os ciclos mantendo o corpo relaxado."],
"Prancha de joelhos":["Apoie os antebraços e joelhos no chão, sobre uma toalha.", "Alinhe cotovelos sob os ombros, com abdômen levemente contraído.", "Sustente com quadril estável e respiração normal.", "Apoie o corpo no chão para finalizar, sem desabar."],
"Anjo na parede":["Encoste as costas à parede e posicione os braços em W.", "Deslize os braços lentamente para cima até onde for confortável.", "Evite arquear a lombar para alcançar maior altura.", "Deslize os braços de volta ao W."],
"Remada auto-resistida":["Fique ereto, com um cotovelo próximo ao tronco.", "Coloque a mão oposta no antebraço e ofereça resistência moderada.", "Puxe o cotovelo para trás sem torcer o tronco.", "Controle a volta e repita do outro lado."],
"Afundo reverso com apoio":["Fique em pé perto de apoio estável usado apenas para equilíbrio.", "Dê um passo para TRÁS com uma das pernas.", "Flexione os joelhos apenas até uma amplitude confortável.", "Retorne à posição em pé e troque a perna."],
"Agachamento livre":["Fique em pé com os pés aproximadamente na largura dos ombros.", "Leve o quadril para trás, flexionando os joelhos.", "Mantenha calcanhares no chão e joelhos alinhados aos pés.", "Empurre o chão e levante-se com controle."],
"Flexão de joelhos":["Apoie as mãos e os joelhos no chão, com o tronco firme.", "Dobre os cotovelos e aproxime o peito do chão.", "Mantenha o abdômen ativo, sem arquear a lombar.", "Estenda os cotovelos e volte ao início."],
"Flexão na parede":["Mãos na parede e pés afastados; mantenha o corpo em linha.","Flexione os cotovelos aproximando o peito da parede.","Mantenha abdômen firme e ombros estáveis.","Empurre a parede e retorne com controle."],
"Flexão inclinada no sofá firme":["Apoie as mãos em uma estrutura firme e que não deslize.","Flexione os cotovelos mantendo tronco e pernas alinhados.","Desça até uma amplitude confortável sem perder a postura.","Empurre o apoio e retorne lentamente."],
"Agachamento na cadeira":["Fique em pé à frente de uma cadeira estável.","Leve o quadril para trás e aproxime-se do assento.","Toque a cadeira com controle, sem desabar.","Empurre o chão e fique em pé novamente."],
"Dead bug":["Deite de costas, braços para cima e joelhos flexionados a 90°.","Estenda lentamente um braço e a perna oposta, sem arquear a lombar.","Retorne ao centro mantendo o abdômen ativo.","Alterne para o outro lado com o mesmo controle."],
"Abdominal reverso adaptado":["Deite com os joelhos flexionados e braços ao lado do tronco.","Aproxime os joelhos do peito sem usar impulso.","Expire e incline discretamente a pelve, sem balançar.","Retorne lentamente, mantendo o abdômen ativo."],
"Gato-vaca":["Entre em quatro apoios, mãos sob os ombros e joelhos sob os quadris.","Arredonde a coluna suavemente ao expirar.","Abra o peito e estenda a coluna apenas até onde for confortável.","Volte à posição neutra e repita com respiração lenta."],
"Prancha lateral adaptada":["De lado, apoie o antebraço e mantenha os joelhos dobrados.","Eleve o quadril alinhando ombro, quadril e joelhos.","Respire e mantenha o tronco estável.","Desça com controle e repita do outro lado."],
"Extensão de quadril em quatro apoios":["Em quatro apoios, alinhe mãos e joelhos.","A imagem mostra a variação de elevação com joelho dobrado.","Evite girar o quadril ou arquear a lombar.","Retorne e alterne; siga a versão da sua agenda."],
"Abdominal supra curto":["Deite no chão com joelhos flexionados e pés apoiados.","Expire e eleve apenas cabeça e ombros, sem puxar o pescoço.","Mantenha uma breve contração abdominal.","Desça lentamente com controle."],
"Prancha de antebraços":["Apoie antebraços no solo e alinhe cotovelos sob os ombros.","Estenda as pernas e mantenha corpo alinhado.","Contraia abdômen e glúteos; continue respirando.","Finalize apoiando os joelhos, sem desabar no chão."],
"Bird-dog":["Comece em quatro apoios com coluna neutra.","Estenda simultaneamente braço e perna contrários.","Mantenha a pelve estável e o tronco firme.","Volte ao centro e troque o lado."],
"Ponte de glúteos":["Deite de costas com os joelhos dobrados e pés no chão.","Contraia os glúteos e prepare a elevação.","Eleve o quadril sem exagerar a curvatura lombar.","Desça devagar e repita com controle."],
"Superman no chão":["Deite de bruços com braços à frente.","Eleve suavemente os braços e o peito, sem forçar a cervical.","Sustente brevemente sem comprimir a lombar.","Retorne ao chão com controle."],
"Isometria na parede":["Apoie as costas na parede e dê passos curtos à frente.","Deslize para baixo até uma flexão de joelhos confortável.","Mantenha a posição respirando normalmente.","Empurre o solo e retorne lentamente à posição em pé."]
};
const WARN={
"Flexão Spartana":"Exercício avançado. Progrida somente após dominar a flexão tradicional; evite dor nos ombros, punhos e lombar.",
"Flexão tipo jacaré":"Exercício avançado que exige estabilidade de ombros e tronco. Comece com amplitude e deslocamento pequenos; não force articulações.",
"Flexão com um pé elevado":"A imagem usa apoio elevado para um pé, diferente da versão com o pé suspenso no ar. Não confunda as variações; ambas exigem estabilidade e progressão.",
"Polichinelo":"Se houver desconforto articular, use polichinelo sem salto, alternando os pés.",
"Extensão de quadril em quatro apoios":"A sequência ilustra uma variante com joelho dobrado. No cronograma V30 a orientação é estender a perna para trás. As duas técnicas não devem ser confundidas; siga a versão indicada para sua sessão.",
"Flexão inclinada no sofá firme":"Use somente um sofá com apoio realmente firme, que não deslize ou tombe. Se não for estável, use uma bancada fixa.",
"Agachamento na cadeira":"Escolha uma cadeira estável, posicionada contra a parede e que não deslize.",
"Abdominal reverso adaptado":"A elevação do quadril deve ser pequena. Não balance as pernas nem force a lombar."
};
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||"null")||{};}catch{return {};}};
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const css=document.createElement("style");css.textContent=`
.tf31-trigger{border:1px solid #0cdeee!important;background:#062b39!important;color:#baffff!important;border-radius:12px!important;padding:9px 13px!important;font-weight:800!important;cursor:pointer}
.tf32-modal{width:min(96vw,790px);max-height:92dvh;overflow:auto;background:#041927;color:#eaffff;border:1px solid #08c7dd;border-radius:20px;padding:15px;box-shadow:0 30px 90px #000c}
.tf32-modal::backdrop{background:#000e}
.tf32-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin:0 0 14px}.tf32-head h2{margin:0;font-size:clamp(18px,4vw,26px);line-height:1.2}.tf32-heart{color:#18ddec;font-size:22px}
.tf32-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px;margin:8px 0 15px}.tf32-tabs button{min-width:0;background:#09283a;border:1px solid #13607d;color:#d6ffff;border-radius:12px;padding:12px 3px;font-size:13px;cursor:pointer}.tf32-tabs button[aria-selected=true]{background:#09e6ec;color:#001921;font-weight:900}
.tf32-steps{display:grid;gap:9px}.tf32-step{display:grid;grid-template-columns:minmax(0,48%) minmax(0,52%);align-items:stretch;overflow:hidden;background:#061f30;border:1px solid #00d8ee;border-radius:12px}.tf32-photo{display:block;width:100%;height:100%;padding:0;margin:0;border:none;background:#0d2230;cursor:zoom-in}.tf32-step img{display:block;width:100%;height:100%;min-height:125px;max-height:205px;object-fit:cover}.tf32-step-text{padding:11px 11px 9px;align-self:center}.tf32-step-text strong{display:block;color:#f1fbff;font-size:13px;margin-bottom:7px}.tf32-step-text p{font-size:12px;line-height:1.45;margin:0;color:#d8edf4}.tf32-number{display:inline-grid;place-items:center;width:23px;height:23px;margin-right:6px;background:#1aa9ff;border-radius:50%;color:white;font-weight:900}
.tf32-summary{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:12px 0;border:1px solid #0e6582;border-radius:12px;background:#092d3b;padding:10px;font-size:12px;line-height:1.4}.tf32-summary span{color:#9efaff}.tf32-diagrams{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.tf32-diagrams img{max-width:100%;border-radius:10px}.tf32-para{padding:13px;background:#0e3444;border:1px solid #206278;border-radius:11px;line-height:1.7;font-size:13px}
.tf32-warning{font-size:12px;color:#ffe1aa;background:#3b2c1c;border-left:3px solid #ffb951;border-radius:8px;padding:10px;margin:10px 0;line-height:1.5}.tf32-note{font-size:11px;line-height:1.5;color:#a9c9d4;margin:11px 0}.tf32-start{width:100%;background:#39e99a;color:#001f1c;border:0;border-radius:13px;padding:14px;font-weight:900;font-size:16px;cursor:pointer}.tf32-start:disabled{opacity:.6;cursor:default}.tf32-other{width:100%;border:1px solid #1b7d94;background:#0d3444;color:#c8ffff;padding:11px;border-radius:10px;margin-top:8px}
.tf32-library{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.tf32-libitem{border:1px solid #1b566e;border-radius:11px;background:#082739;color:#d7faff;padding:8px;text-align:left;cursor:pointer}.tf32-libitem img{display:block;width:100%;aspect-ratio:2.2;object-fit:cover;border-radius:7px;margin-bottom:6px}.tf32-libitem strong{display:block;font-size:12px}.tf32-libitem small{font-size:10px;color:#9dcbdb}
.tf32-zoom{display:block;width:100%;max-height:60vh;object-fit:contain;border-radius:12px}
@media(max-width:440px){.tf32-modal{padding:10px}.tf32-step img{min-height:110px;max-height:160px}.tf32-step-text{padding:7px}.tf32-step-text strong{font-size:11px;margin-bottom:4px}.tf32-step-text p{font-size:11px;line-height:1.34}.tf32-tabs button{font-size:11px;padding:11px 2px}}
`;document.head.append(css);
const dlg=document.createElement("dialog");dlg.id="tf31-modal";dlg.className="tf32-modal";document.body.append(dlg);
let active="",tab="steps",lastView="library";
function info(name){const d=read(DK);return {d,spec:d.exerciseSpecs?.[name]||null};}
function due(name){const {d}=info(name),done=read(SK).statuses||{};
const match=(d.tasks||[]).filter(t=>t.category==="Treino"&&Array.isArray(t.meta?.moves)&&t.meta.moves.includes(name)&&t.id&&!(["feito","cancelado"].includes(done[t.id]))).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));return match[0]||null;}
function frame(title,body){dlg.innerHTML='<div class="tf32-head"><button type="button" class="tf31-trigger" data-tf32-back aria-label="Voltar">‹</button><h2>'+esc(title)+'</h2><span class="tf32-heart">♡</span><button type="button" class="tf31-trigger" data-tf32-close aria-label="Fechar">✕</button></div>'+body;if(!dlg.open)dlg.showModal();dlg.scrollTop=0;}
function summary(name){const v=info(name).spec,extra=!v;
const sets=v?.sets||"Não agendado";
const reps=v?.reps||"Exercício complementar";
return '<div class="tf32-summary"><div><span>Séries</span><br>'+esc(sets)+'</div><div><span>Repetições ou duração</span><br>'+esc(reps)+'</div></div>'+(WARN[name]?'<p class="tf32-warning">'+esc(WARN[name])+'</p>':'')+'<p class="tf32-note">Imagens didáticas: as fotos de V31/V32 são geradas por IA; os desenhos V33 são esquemáticos. Consulte sempre seu plano privado. A biblioteca não registra atividades automaticamente.</p>';
}
function stage(name){const desc=STEPS[name]||[],prefix=PHOTO[name]||EXTRA[name];if(!prefix)return '<div class="tf32-para">Sequência fotográfica específica ainda não disponível. Consulte a aba Dicas para a técnica indicada no seu plano.</div>';
return '<div class="tf32-steps">'+(prefix.startsWith('v33/')?'<p class="tf32-note tf33-illustration">ILUSTRAÇÕES ESQUEMÁTICAS — use as instruções da V30 como referência. Não são fotografias.</p>':'')+desc.map((s,i)=>'<div class="tf32-step"><button type="button" class="tf32-photo" data-tf32-zoom="'+i+'" aria-label="Ampliar etapa '+(i+1)+'"><img src="'+imgStep(name,prefix,i)+'" loading="lazy" alt="'+esc(name)+' — etapa '+(i+1)+'" onerror="this.hidden=true"></button><div class="tf32-step-text"><strong><span class="tf32-number">'+(i+1)+'</span>'+["Posição inicial","Movimento","Controle","Retorno"][i]+'</strong><p>'+esc(s)+'</p></div></div>').join('')+'</div>';
}
function showExercise(name,select="steps"){const {d,spec}=info(name);if(!spec&&!EXTRA[name])return;active=name;tab=select;lastView="exercise";
const tabs='<div class="tf32-tabs" role="tablist">'+[["steps","Passo a passo"],["muscles","Músculos"],["tips","Dicas"]].map(([k,l])=>'<button type="button" role="tab" data-tf32-tab="'+k+'" aria-selected="'+(tab===k)+'">'+l+'</button>').join('')+'</div>';
let body='';
if(tab==="steps")body=stage(name);
else if(tab==="muscles")body=window.TF36_MUSCLES?.render(name,spec)||(MUSCLES_V35[name]?'<div class="tf32-para"><b>Principais músculos:</b> '+esc(MUSCLES_V35[name].Principais.join(", "))+'<p><b>Estabilizadores:</b> '+esc(MUSCLES_V35[name].Estabilizadores.join(", "))+'</p></div><p class="tf32-note">Os destaques anatômicos aqui são descritos especificamente para este exercício; não mostramos um mapa genérico com regiões coloridas que poderia sugerir músculos incorretos. A ativação varia conforme técnica e execução.</p>':'<div class="tf32-para"><b>Músculos envolvidos:</b> '+esc(spec?.muscles?.join(", ")||"Guia complementar: não pertence à programação V30")+'</div><div class="tf32-diagrams"><img src="./tf25-assets/musculos_frontal.webp" alt="Mapa muscular frontal ilustrativo genérico"><img src="./tf25-assets/musculos_traseiro.webp" alt="Mapa muscular traseiro ilustrativo genérico"></div><p class="tf32-note">Mapas anatômicos gerais, não representam músculos especificamente destacados para este exercício.</p>');
else body='<div class="tf32-para"><b>Como começar</b><p>'+esc(spec?.start||STEPS[name]?.[0]||"")+'</p><b>Como executar</b><p>'+esc(spec?.move||STEPS[name]?.[1]||"")+'</p><b>Erro a evitar</b><p>'+esc(spec?.mistake||"Não force amplitudes dolorosas.")+'</p></div>';
const session=spec?due(name):null;
frame(name,tabs+body+summary(name)+(session?'<button type="button" class="tf32-start" data-tf32-start>▶ Abrir treino agendado</button>':'<button type="button" class="tf32-start" disabled>▶ '+(spec?'Sem sessão pendente para este exercício':'Guia complementar, sem sessão agendada')+'</button>')+'<button class="tf32-other" data-tf32-library>▦ Voltar à biblioteca</button>');
}
function library(){lastView="library";active="";const specs=info("").d.exerciseSpecs||{},names=Object.keys(specs),has=names.length;
const build=(name)=>{const p=PHOTO[name]||EXTRA[name],photo=p?'<img src="'+imgStep(name,p,0)+'" alt="'+esc(name)+'" loading="lazy">':'';return '<button class="tf32-libitem" data-tf32-name="'+esc(name)+'">'+photo+'<strong>'+esc(name)+'</strong><small>'+(p?(p.startsWith('v33/')?'4 diagramas + técnica':'4 fotografias + técnica'):'Orientação técnica')+'</small></button>';};
frame('Biblioteca de exercícios','<p class="tf32-note">'+(has?'Exercícios extraídos do seu cronograma privado; nenhum registro será alterado.':'Importe primeiro seu cronograma privado para visualizar a cartela principal.')+'</p><div class="tf32-library">'+names.map(build).join('')+'</div><p class="tf32-note">Guias visuais complementares (não adicionados à rotina):</p><div class="tf32-library">'+Object.keys(EXTRA).map(build).join('')+'</div>');
}
function zoom(i){const p=PHOTO[active]||EXTRA[active];if(!p)return;lastView="zoom";frame(active+' · etapa '+(i+1),'<img class="tf32-zoom" src="'+imgStep(active,p,i)+'" alt="'+esc(active)+' ampliado"><button class="tf32-other" data-tf32-back-exercise>‹ Voltar às quatro etapas</button>');}
function begin(){const name=active,t=due(name);if(!t){showExercise(name);return;}dlg.close();const btn=document.createElement('button');btn.type='button';btn.hidden=true;btn.dataset.do='view';btn.dataset.id=t.id;document.body.append(btn);btn.click();btn.remove();}
document.addEventListener('click',e=>{const b=e.target.closest('[data-tf32-name],[data-tf32-close],[data-tf32-library],[data-tf32-tab],[data-tf32-zoom],[data-tf32-back],[data-tf32-back-exercise],[data-tf32-start]');if(!b)return;
e.preventDefault();if(b.hasAttribute('data-tf32-close'))dlg.close();else if(b.hasAttribute('data-tf32-name'))showExercise(b.dataset.tf32Name);else if(b.hasAttribute('data-tf32-library'))library();else if(b.hasAttribute('data-tf32-tab'))showExercise(active,b.dataset.tf32Tab);else if(b.hasAttribute('data-tf32-zoom'))zoom(Number(b.dataset.tf32Zoom));else if(b.hasAttribute('data-tf32-back-exercise'))showExercise(active);else if(b.hasAttribute('data-tf32-start'))begin();else if(lastView==='zoom')showExercise(active);else library();
});
function attach(){const root=document.querySelector('[data-tf25-root="treino"]'),trainer=document.querySelector('#tf12-dialog');
if(root&&!root.querySelector('[data-tf32-open]')){const b=document.createElement('button');b.type='button';b.className='tf31-trigger';b.dataset.tf32Open='';b.textContent='▦ Exercícios ilustrados · V35';b.addEventListener('click',library);(root.querySelector('.tf25-top')||root).append(b);}
if(trainer?.open&&!trainer.querySelector('[data-tf32-open]')){const b=document.createElement('button');b.className='tf31-trigger';b.dataset.tf32Open='';b.textContent='Ver fotos passo a passo';b.addEventListener('click',library);const view=trainer.querySelector('#tf12-view');(view||trainer).prepend(b);}
}
const main=document.querySelector('#main');if(main){let pending=false;new MutationObserver(()=>{if(!pending){pending=true;requestAnimationFrame(()=>{pending=false;attach();});}}).observe(main,{subtree:true,childList:true});}
setInterval(attach,1800);attach();
window.TF31_EXERCISES=Object.freeze({version:'35.0',library,open:showExercise,photoNames:Object.keys(PHOTO),extraNames:Object.keys(EXTRA)});
})();