import"./ProgramDesignWorkspace.41b0cd88.js";var e=globalThis,t={},n={},a=e.parcelRequire66c8;null==a&&((a=function(e){if(e in t)return t[e].exports;if(e in n){var a=n[e];delete n[e];var l={id:e,exports:{}};return t[e]=l,a.call(l.exports,l,l.exports),l.exports}var s=Error("Cannot find module '"+e+"'");throw s.code="MODULE_NOT_FOUND",s}).register=function(e,t){n[e]=t},e.parcelRequire66c8=a),a.register;var l=a("e8wst"),s=a("jlKM8"),o=a("9Ev1P"),d=a("76QZC"),r=a("b3qqF"),u=a("gBc5V");window.trainingState=u.default,window.updateChart=l.updateChart,window.resetWeeklyData=l.resetChart,window.showVolumeLandmarks=l.addVolumeLandmarks,window.exportSummary=l.exportChartImage,window.toggleSection=function(e){let t=document.getElementById(e+"-content"),n=t.previousElementSibling,a=n.querySelector(".expand-icon"),l=t.classList.toggle("expanded");n.classList.toggle("expanded",l),a&&(a.style.transform=l?"rotate(180deg)":"rotate(0deg)");let s=()=>{if(!window.parent)return;let e=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);window.parent.postMessage({phxHeight:e},"*")};s(),setTimeout(s,300)},window.scoreStimulus=s.scoreStimulus,window.setProgressionAlgorithm=s.setProgressionAlgorithm,window.getVolumeProgression=s.getVolumeProgression,window.analyzeDeloadNeed=s.analyzeDeloadNeed,window.calculateTargetRIR=o.calculateTargetRIR,window.validateEffortLevel=o.validateEffortLevel,window.analyzeFrequency=d.analyzeFrequency,window.calculateOptimalFrequency=d.calculateOptimalFrequency,window.validateLoad=r.validateLoad,window.validateSets=r.validateSets,window.validateMesocycleLength=r.validateMesocycleLength,window.submitFeedback=function(){let e=document.getElementById("muscleSelect").value,t=parseInt(document.getElementById("mmc").value,10),n=parseInt(document.getElementById("pump").value,10),a=parseInt(document.getElementById("dis").value,10),d=parseInt(document.getElementById("sore").value,10),r=document.getElementById("actualRIR").value,i=document.querySelector('input[name="perf"]:checked'),c=i?parseInt(i.value,10):2;if(!e||isNaN(t)||isNaN(n)||isNaN(a))return void alert("Please fill in all required fields");let m=(0,s.scoreStimulus)({mmc:t,pump:n,disruption:a}),g=(0,s.setProgressionAlgorithm)(d,c),v=(0,s.getVolumeProgression)(e,{stimulus:{mmc:t,pump:n,disruption:a},soreness:d,performance:c,hasIllness:!1}),p=null;r&&(p=(0,o.validateEffortLevel)(parseFloat(r))),-99!==g.setChange&&u.default.addSets(e,g.setChange);let y=document.getElementById("mevOut"),w=`
    <div class="feedback-results">
      <div class="main-recommendation">
        <h4>${e} Recommendation</h4>
        <p class="advice">${v.advice}</p>
        <p class="sets-info">
          ${v.currentSets} \u{2192} ${v.projectedSets} sets
          ${0!==v.setChange?`(${v.setChange>0?"+":""}${v.setChange})`:""}
        </p>
      </div>
      
      <div class="algorithm-details">
        <div>
          <strong>Stimulus:</strong> ${m.score}/9 
          <span class="stimulus-${m.action}">(${m.action.replace("_"," ")})</span>
        </div>
        <div>
          <strong>Volume Status:</strong> ${v.volumeStatus}
        </div>
        <div>
          <strong>RP Progression:</strong> ${g.advice}
        </div>
      </div>
    </div>
  `;p&&(w+=`
      <div class="rir-feedback ${p.urgency}">
        <strong>RIR Check:</strong> ${p.feedback}<br>
        <em>${p.recommendation}</em>
      </div>
    `),v.deloadRecommended&&(w+=`
      <div class="deload-warning">
        \u{26A0}\u{FE0F} <strong>Deload Recommended</strong>
      </div>
    `),y.innerHTML=w,y.className="result success active",(0,l.updateChart)()},window.analyzeDeload=function(){let e=document.getElementById("halfMuscles").checked,t=document.getElementById("mrvBreach").checked,n=document.getElementById("illness").checked,a=document.getElementById("lowMotivation").checked,o=(0,s.analyzeDeloadNeed)();e&&o.reasons.push("Most muscles need recovery (manual check)"),t&&o.reasons.push("Hit MRV twice consecutively (manual check)"),n&&o.reasons.push("Illness/injury present"),a&&o.reasons.push("Low motivation levels");let d=o.shouldDeload||e||t||n||a,r=document.getElementById("deloadOut");d?(r.innerHTML=`
      <strong>Deload Recommended</strong><br>
      Reasons: ${o.reasons.join(", ")}<br>
      <em>Take 1 week at 50% volume + 25-50% load reduction</em>
    `,r.className="result warning active",setTimeout(()=>{confirm("Start deload phase now? This will reduce all muscle volumes to 50% of MEV.")&&(u.default.startDeload(),(0,l.updateChart)())},1e3)):(r.innerHTML="No deload needed - continue current program",r.className="result success active")},window.analyzeFrequency=function(){let e=parseInt(document.getElementById("soreDays").value,10),t=parseInt(document.getElementById("sessionGap").value,10),n=document.getElementById("trainingAge").value,a=document.getElementById("muscleSelect").value,l=(0,d.analyzeFrequency)(e,t,a),s=(0,d.calculateOptimalFrequency)(a,{trainingAge:n,currentVolume:u.default.currentWeekSets[a]}),o=document.getElementById("freqOut");o.innerHTML=`
    <strong>${l.recommendation}</strong><br>
    Current: ${t} days between sessions<br>
    Recovery: ${e} days<br>
    Optimal frequency: ${s.recommendedFrequency}x/week (${s.setsPerSession} sets/session)
  `;let r="high"===l.urgency||"medium"===l.urgency?"warning":"success";o.className=`result ${r} active`},window.saveLandmarks=function(){let e=document.getElementById("landmarkMuscle").value,t=parseInt(document.getElementById("mv").value,10),n=parseInt(document.getElementById("mev").value,10),a=parseInt(document.getElementById("mav").value,10),s=parseInt(document.getElementById("mrv").value,10);if(t>n||n>a||a>s)return void alert("Invalid landmark relationship (MV ≤ MEV ≤ MAV ≤ MRV)");u.default.updateVolumeLandmarks(e,{MV:t,MEV:n,MAV:a,MRV:s}),(0,l.updateChart)();let o=document.getElementById("volumeOut");o.innerHTML=`Landmarks saved for ${e}: MV:${t}, MEV:${n}, MAV:${a}, MRV:${s}`,o.className="result success active"},window.applyVolumePreset=function(e){let t=document.getElementById("landmarkMuscle").value,n={beginner:.8,intermediate:1,advanced:1.2}[e],a=u.default.volumeLandmarks[t];document.getElementById("mv").value=Math.round(a.MV*n),document.getElementById("mev").value=Math.round(a.MEV*n),document.getElementById("mav").value=Math.round(a.MAV*n),document.getElementById("mrv").value=Math.round(a.MRV*n)},window.setupMeso=function(){let e=parseInt(document.getElementById("mesoLength").value,10),t=parseInt(document.getElementById("currentWeekNum").value,10),n=document.getElementById("trainingGoal").value,a=(0,r.validateMesocycleLength)(e,n);if(!a.isValid)return void alert(a.warning);u.default.mesoLen=e,u.default.weekNo=t,u.default.saveState();let l=document.getElementById("mesoOut");l.innerHTML=`
    Mesocycle configured: ${e} weeks for ${n}<br>
    Currently week ${t} (Target RIR: ${u.default.getTargetRIR().toFixed(1)})<br>
    ${a.recommendation}
  `,l.className="result success active"};
//# sourceMappingURL=ProgramDesignWorkspace.70a3fdfd.js.map
