// =====================================================================
// 1. STATE & NAVIGASI UTAMA
// =====================================================================
const state = {
    activeTab: 'overview',
    completedTabs: new Set(['overview']),
    totalTabs: 7,
    quiz: {
        started: false,
        currentQuestion: 0,
        score: 0,
        answered: false,
        selectedOption: null
    }
};

// Data Preset Reaksi untuk Bab 2 (Energetika)
const reactionPresets = {
    fusi_dt: {
        name: "Fusi D + T -> α + n (Eksotermik)",
        mX: 3.0160,  // Tritium (u)
        ma: 2.0141,  // Deuterium (u)
        mY: 4.0026,  // Alpha (u)
        mb: 1.0087   // Neutron (u)
    },
    fisi_c: {
        name: "p + ¹⁴N -> α + ¹¹C (Endotermik)",
        mX: 14.0031, // Nitrogen-14 (u)
        ma: 1.0078,  // Proton (u)
        mY: 11.0114, // Carbon-11 (u)
        mb: 4.0026   // Alpha (u)
    },
    be_alpha: {
        name: "α + ⁹Be -> n + ¹²C (Eksotermik)",
        mX: 9.0122,  // Beryllium-9 (u)
        ma: 4.0026,  // Alpha (u)
        mY: 12.0000, // Carbon-12 (u)
        mb: 1.0087   // Neutron (u)
    }
};

// Data Preset Isotop untuk Bab 5 (Eksperimen HPGe)
const isotopePresets = {
    co60: {
        name: "Cobalt-60 (⁶⁰Co)",
        decayMode: "Beta-minus (β⁻)",
        halfLife: "5.27 Tahun",
        peaks: [1173.2, 1332.5],
        intensities: [1.0, 0.9]
    },
    cs137: {
        name: "Caesium-137 (¹³⁷Cs)",
        decayMode: "Beta-minus (β⁻)",
        halfLife: "30.08 Tahun",
        peaks: [661.7],
        intensities: [0.85]
    },
    na22: {
        name: "Sodium-22 (²²Na)",
        decayMode: "Positron (β⁺) / EC",
        halfLife: "2.60 Tahun",
        peaks: [511.0, 1274.5],
        intensities: [1.8, 1.0] // 511 keV memiliki intensitas tinggi karena annihilation menghasilkan 2 foton
    }
};

// Soal-soal Kuis (Kenneth S. Krane 1988 Problems)
const quizQuestions = [
    {
        question: "Problem 7 (Energetics of Nuclear Reactions):\nCalculate the Q value of the reaction: He-4(p, d)He-3. What is the threshold energy if (a) protons are incident on helium? (b) alpha particles are incident on hydrogen?",
        options: [
            "Q = -18.35 MeV, Eth(a) = 22.97 MeV, Eth(b) = 91.24 MeV",
            "Q = 18.35 MeV, Eth(a) = 22.97 MeV, Eth(b) = 91.24 MeV",
            "Q = -18.35 MeV, Eth(a) = 18.35 MeV, Eth(b) = 18.35 MeV",
            "Q = -22.97 MeV, Eth(a) = 91.24 MeV, Eth(b) = 22.97 MeV"
        ],
        correct: 0,
        explanation: "<strong>Pembahasan:</strong><br><br>" +
            "Defisit Massa:<br>" +
            "$$\\Delta m = m(p) + m(^{4}\\text{He}) - m(d) - m(^{3}\\text{He})$$" +
            "$$\\Delta m = (1.007825 + 4.002603 - 2.014102 - 3.016029)\\text{ u} = -0.019703\\text{ u}$$" +
            "$$Q = -0.019703 \\times 931.5\\text{ MeV} = -18.35\\text{ MeV} \\quad \\text{(Endotermik)}$$<br>" +
            "Untuk target diam:<br>" +
            "$$E_{th} = |Q| \\left(1 + \\frac{m_{proyektil}}{m_{target}}\\right)$$<br>" +
            "<strong>(a) Proton pada He:</strong><br>" +
            "$$E_{th} = 18.35 \\left(1 + \\frac{1.007825}{4.002603}\\right) = 22.97\\text{ MeV}$$<br>" +
            "<strong>(b) Alpha pada H:</strong><br>" +
            "$$E_{th} = 18.35 \\left(1 + \\frac{4.002603}{1.007825}\\right) = 91.24\\text{ MeV}$$"
    },
    {
        question: "Problem 5 (Isospin & Types of Reactions):\nThe reaction X(p,n)Y can be regarded as equivalent to beta-minus decay in that the same initial and final nuclei are involved. Relate the Q value of the reaction to the maximum energy release in beta-minus decay (Q_beta).",
        options: [
            "Q = Q_beta + 0.782 MeV",
            "Q = Q_beta - 0.782 MeV",
            "Q = Q_beta - 1.293 MeV",
            "Q = -Q_beta + 0.782 MeV"
        ],
        correct: 1,
        explanation: "<strong>Pembahasan:</strong><br><br>" +
            "Persamaan Reaksi:<br>" +
            "$$X + p \\rightarrow Y + n$$" +
            "$$Q_{reaksi} = (m_X + m_p - m_Y - m_n)c^2$$<br>" +
            "Peluruhan $\\beta^-$ dari X:<br>" +
            "$$X \\rightarrow Y + e^- + \\bar{\\nu}$$" +
            "$$Q_{\\beta^-} = (m_X - m_Y)c^2$$<br>" +
            "Substitusikan $(m_X - m_Y)c^2$ ke dalam $Q_{reaksi}$:<br>" +
            "$$Q_{reaksi} = Q_{\\beta^-} + (m_p - m_n)c^2$$" +
            "$$\\text{Di mana } (m_p - m_n)c^2 = 1.007825\\text{ u} - 1.008665\\text{ u} = -0.00084\\text{ u} \\approx -0.782\\text{ MeV}$$" +
            "$$Q_{reaksi} = Q_{\\beta^-} - 0.782\\text{ MeV}$$<br>" +
            "Ini menunjukkan bahwa beda nilai Q hanya berasal dari perbedaan massa diam partikel bebas (proton vs neutron)."
    },
    {
        question: "Problem 1 (Types of Reactions & Conservation Laws):\nLengkapilah reaksi-reaksi berikut agar mematuhi hukum kekekalan muatan (Z) dan nomor massa (A):\n(a) N-14(n, p)?\n(b) C-12(p, gamma)?\n(c) N-13(?, p)O-16",
        options: [
            "(a) C-14, (b) N-13, (c) alpha (He-4)",
            "(a) N-14, (b) C-13, (c) d (Deuterium)",
            "(a) C-15, (b) O-13, (c) n (Neutron)",
            "(a) C-14, (b) N-12, (c) p (Proton)"
        ],
        correct: 0,
        explanation: "<strong>Pembahasan:</strong><br><br>" +
            "<strong>(a) $^{14}\\text{N} + n \\rightarrow \\text{?} + p$</strong><br>" +
            "Muatan $Z: 7 + 0 = Z_Y + 1 \\Rightarrow Z_Y = 6$ (Karbon, C)<br>" +
            "Massa $A: 14 + 1 = A_Y + 1 \\Rightarrow A_Y = 14$<br>" +
            "Maka produknya adalah: **$^{14}\\text{C}$**<br><br>" +
            "<strong>(b) $^{12}\\text{C} + p \\rightarrow \\text{?} + \\gamma$</strong><br>" +
            "Muatan $Z: 6 + 1 = Z_Y + 0 \\Rightarrow Z_Y = 7$ (Nitrogen, N)<br>" +
            "Massa $A: 12 + 1 = A_Y + 0 \\Rightarrow A_Y = 13$<br>" +
            "Maka produknya adalah: **$^{13}\\text{N}$**<br><br>" +
            "<strong>(c) $^{13}\\text{N} + \\text{?} \\rightarrow ^{16}\\text{O} + p$</strong><br>" +
            "Muatan $Z: 7 + Z_a = 8 + 1 \\Rightarrow Z_a = 2$ (Helium, He)<br>" +
            "Massa $A: 13 + A_a = 16 + 1 \\Rightarrow A_a = 4$<br>" +
            "Maka partikel penumbuk adalah: **$\\alpha$** (atau **$^{4}\\text{He}$**)"
    }
];

// Inisialisasi Aplikasi saat DOM Siap
document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initBab2Calculator();
    initBab4Sliders();
    initBab5Dropdown();
    initQuiz();
    
    // Render grafik tab pertama (Bab 1) jika diakses
    renderAllCharts();
});

// =====================================================================
// 2. LOGIKA NAVIGASI TAB & PROGRESS
// =====================================================================
function initNavigation() {
    const menuItems = document.querySelectorAll(".menu-item");
    const tabContents = document.querySelectorAll(".tab-content");
    const currentTitle = document.getElementById("current-tab-title");
    
    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            const targetTab = item.getAttribute("data-tab");
            
            // Nonaktifkan menu & tab aktif sebelumnya
            document.querySelector(".menu-item.active").classList.remove("active");
            document.querySelector(".tab-content.active").classList.remove("active");
            
            // Aktifkan menu & tab baru
            item.classList.add("active");
            const targetContent = document.getElementById(`${targetTab}-tab`);
            targetContent.classList.add("active");
            
            // Update Title Header
            const buttonText = item.querySelector("button").innerText;
            currentTitle.innerText = buttonText;
            
            // Update State Progress
            state.activeTab = targetTab;
            state.completedTabs.add(targetTab);
            updateProgressBar();
            
            // Re-render / resize plotly charts di tab aktif
            resizeChartsForTab(targetTab);
            
            // Trigger MathJax Typesetting agar persamaan render ulang di tab baru
            if (window.MathJax && window.MathJax.typeset) {
                window.MathJax.typeset();
            }
        });
    });
}

function updateProgressBar() {
    const bar = document.getElementById("progress-bar");
    const text = document.getElementById("progress-text");
    const percentage = Math.round((state.completedTabs.size / state.totalTabs) * 100);
    
    bar.style.width = `${percentage}%`;
    text.innerText = `${percentage}%`;
}

function resizeChartsForTab(tab) {
    const chartIds = {
        bab1: ['chart-reaction-sunburst'],
        bab2: ['chart-q-value'],
        bab3: ['chart-isospin'],
        bab4: ['chart-cross-section'],
        bab5: ['chart-hpge']
    };
    
    if (chartIds[tab]) {
        chartIds[tab].forEach(id => {
            const div = document.getElementById(id);
            if (div && div.innerHTML !== "") {
                Plotly.Plots.resize(div);
            }
        });
    }
}

function renderAllCharts() {
    // Inisialisasi chart sunburst (Bab 1) dan isospin (Bab 3)
    renderBab1Sunburst();
    renderBab2Chart();
    renderBab3Isospin();
    renderBab4Chart();
    renderBab5Chart();
}

// Global Styling Helper untuk Layout Plotly Gelap/Premium
const chartLayoutDefaults = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(20, 26, 36, 0.4)',
    font: {
        family: "'Outfit', sans-serif",
        color: '#c5c6c7'
    },
    xaxis: {
        gridcolor: 'rgba(255, 255, 255, 0.05)',
        zerolinecolor: 'rgba(255, 255, 255, 0.1)',
        linecolor: 'rgba(255, 255, 255, 0.1)'
    },
    yaxis: {
        gridcolor: 'rgba(255, 255, 255, 0.05)',
        zerolinecolor: 'rgba(255, 255, 255, 0.1)',
        linecolor: 'rgba(255, 255, 255, 0.1)'
    }
};

// =====================================================================
// 3. BAB 1: SUNBURST CLASSIFICATION
// =====================================================================
function renderBab1Sunburst() {
    const labels = [
        "Reaksi Inti", 
        "Hamburan<br>(~10⁻²² s)", "Reaksi Langsung<br>(~10⁻²¹ s)", "Inti Majemuk<br>(~10⁻¹⁹ s)",
        "Elastis (Q=0)", "Inelastis (Q≠0)", 
        "Stripping", "Pick-up", 
        "Fusi/Fisi", "Evaporasi"
    ];
    const parents = [
        "", 
        "Reaksi Inti", "Reaksi Inti", "Reaksi Inti",
        "Hamburan<br>(~10⁻²² s)", "Hamburan<br>(~10⁻²² s)", 
        "Reaksi Langsung<br>(~10⁻²¹ s)", "Reaksi Langsung<br>(~10⁻²¹ s)", 
        "Inti Majemuk<br>(~10⁻¹⁹ s)", "Inti Majemuk<br>(~10⁻¹⁹ s)"
    ];
    const values = [100, 30, 30, 40, 15, 15, 15, 15, 20, 20];

    const data = [{
        type: "sunburst",
        labels: labels,
        parents: parents,
        values: values,
        branchvalues: "total",
        marker: {
            colors: [
                '#1f2833', // Root
                '#45a29e', '#00b4d8', '#7209b7', // Mekanisme
                '#2ecc71', '#3498db', // Hamburan sub
                '#ffb81c', '#e67e22', // Reaksi Langsung sub
                '#ff4a5a', '#9b59b6'  // Inti majemuk sub
            ]
        },
        hovertemplate: '<b>%{label}</b><br>Proporsi Kontribusi: %{percentParent:.0%}<extra></extra>'
    }];

    const layout = {
        margin: {l: 0, r: 0, b: 0, t: 30},
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: chartLayoutDefaults.font,
        title: {
            text: "<b>Klasifikasi Reaksi Inti Berdasarkan Skala Waktu & Sifat</b>",
            font: { size: 14, color: '#66fcf1' }
        }
    };

    Plotly.newPlot("chart-reaction-sunburst", data, layout, {responsive: true});
}

// =====================================================================
// 4. BAB 2: CALCULATOR & ENERGETIKA GRAFIK
// =====================================================================
let calcState = {
    mX: 14.0031,
    ma: 1.0078,
    mY: 11.0114,
    mb: 4.0026,
    Q: -3.5,
    Eth: 3.75
};

function initBab2Calculator() {
    const presetSelect = document.getElementById("reaction-preset");
    const inMX = document.getElementById("mass-target");
    const inMa = document.getElementById("mass-projectile");
    const inMY = document.getElementById("mass-product-y");
    const inMb = document.getElementById("mass-ejectile-b");
    
    // Set default value based on initial preset (fisi_c)
    presetSelect.value = "fisi_c";
    
    // Listeners untuk Select Preset
    presetSelect.addEventListener("change", () => {
        const val = presetSelect.value;
        if (val !== "custom") {
            const data = reactionPresets[val];
            inMX.value = data.mX.toFixed(4);
            inMa.value = data.ma.toFixed(4);
            inMY.value = data.mY.toFixed(4);
            inMb.value = data.mb.toFixed(4);
            
            // Disable input fields
            inMX.disabled = true;
            inMa.disabled = true;
            inMY.disabled = true;
            inMb.disabled = true;
        } else {
            // Enable input fields untuk custom
            inMX.disabled = false;
            inMa.disabled = false;
            inMY.disabled = false;
            inMb.disabled = false;
        }
        calculateQAndRender();
    });
    
    // Listeners untuk Custom Mass Input
    [inMX, inMa, inMY, inMb].forEach(input => {
        input.addEventListener("input", calculateQAndRender);
    });

    calculateQAndRender();
}

function calculateQAndRender() {
    const inMX = parseFloat(document.getElementById("mass-target").value) || 0;
    const inMa = parseFloat(document.getElementById("mass-projectile").value) || 0;
    const inMY = parseFloat(document.getElementById("mass-product-y").value) || 0;
    const inMb = parseFloat(document.getElementById("mass-ejectile-b").value) || 0;
    
    // Defisit Massa (u)
    const massDefect = (inMX + inMa) - (inMY + inMb);
    
    // Q = dm * 931.5 MeV
    const qValue = massDefect * 931.5;
    
    // Sifat Reaksi & Energi Ambang
    let typeText = "";
    let typeColor = "";
    let threshold = 0;
    const thRow = document.getElementById("row-threshold");
    
    if (qValue >= 0) {
        typeText = "Eksotermik (Melepas Energi)";
        typeColor = varColor('--accent-green');
        thRow.style.display = "none";
    } else {
        typeText = "Endotermik (Menyerap Energi)";
        typeColor = varColor('--accent-red');
        thRow.style.display = "flex";
        threshold = Math.abs(qValue) * (1 + (inMa / inMX));
    }
    
    // Update label kalkulator
    document.getElementById("val-mass-defect").innerText = `${massDefect.toFixed(5)} u`;
    
    const qLabel = document.getElementById("val-q-value");
    qLabel.innerText = `${qValue.toFixed(3)} MeV`;
    qLabel.style.color = qValue >= 0 ? varColor('--accent-green') : varColor('--accent-red');
    
    const typeLabel = document.getElementById("val-reaction-type");
    typeLabel.innerText = typeText;
    typeLabel.style.color = typeColor;
    
    document.getElementById("val-threshold").innerText = `${threshold.toFixed(3)} MeV`;
    
    // Update global state
    calcState = {
        mX: inMX,
        ma: inMa,
        mY: inMY,
        mb: inMb,
        Q: qValue,
        Eth: threshold
    };
    
    // Redraw chart energetika
    renderBab2Chart();
}

function renderBab2Chart() {
    const x = [];
    const y = [];
    const x_forbidden = [];
    const y_forbidden = [];
    const step = 0.2;
    const maxE = 15; // MeV
    
    for (let energy = 0; energy <= maxE; energy += step) {
        if (calcState.Q >= 0) {
            x.push(energy);
            y.push(energy + calcState.Q);
        } else {
            if (energy < calcState.Eth) {
                x_forbidden.push(energy);
                y_forbidden.push(0);
            } else {
                x.push(energy);
                y.push(energy + calcState.Q);
            }
        }
    }
    
    if (calcState.Q < 0 && calcState.Eth <= maxE) {
        x.unshift(calcState.Eth);
        y.unshift(calcState.Eth + calcState.Q);
        x_forbidden.push(calcState.Eth);
        y_forbidden.push(0);
    }
    
    const data = [];
    
    if (calcState.Q < 0) {
        data.push({
            x: x_forbidden,
            y: y_forbidden,
            mode: 'lines',
            fill: 'tozeroy',
            fillcolor: 'rgba(255, 74, 90, 0.1)',
            line: { color: 'rgba(255, 74, 90, 0.4)', width: 2, dash: 'dot' },
            name: 'Daerah Terlarang',
            hovertemplate: 'E Kinetik: %{x:.2f} MeV<br>Reaksi Endotermik Terlarang<extra></extra>'
        });
    }

    data.push({
        x: x,
        y: y,
        mode: 'lines',
        fill: 'tozeroy',
        fillcolor: calcState.Q >= 0 ? 'rgba(46, 204, 113, 0.15)' : 'rgba(102, 252, 241, 0.15)',
        name: 'Kinetika Reaksi',
        line: {
            color: calcState.Q >= 0 ? varColor('--accent-green') : varColor('--accent-cyan'),
            width: 3
        },
        hovertemplate: 'E Kinetik Proyektil: %{x:.2f} MeV<br>E Kinetik Produk: %{y:.2f} MeV<extra></extra>'
    });
    
    const shapes = [];
    const annotations = [];
    
    if (calcState.Q < 0 && calcState.Eth <= maxE) {
        shapes.push({
            type: 'line',
            x0: calcState.Eth,
            y0: 0,
            x1: calcState.Eth,
            y1: maxE + calcState.Q,
            line: { color: varColor('--accent-gold'), width: 2, dash: 'dash' }
        });
        
        annotations.push({
            x: calcState.Eth,
            y: (maxE + calcState.Q) / 2,
            text: `Energi Ambang (E<sub>th</sub> = ${calcState.Eth.toFixed(2)} MeV)`,
            showarrow: true,
            arrowhead: 2,
            arrowcolor: varColor('--accent-gold'),
            font: { color: varColor('--accent-gold') },
            ax: 60,
            ay: 0
        });
    }
    
    const layout = {
        title: { text: `<b>Energetika Reaksi: Kinetika Kurva Nilai-Q</b>`, font: { size: 14, color: '#66fcf1' } },
        xaxis: { title: "Energi Kinetik Proyektil Datang, E_a (MeV)", gridcolor: chartLayoutDefaults.xaxis.gridcolor, zerolinecolor: chartLayoutDefaults.xaxis.zerolinecolor, linecolor: chartLayoutDefaults.xaxis.linecolor },
        yaxis: { title: "Energi Kinetik Produk, E_b + E_Y (MeV)", gridcolor: chartLayoutDefaults.yaxis.gridcolor, zerolinecolor: chartLayoutDefaults.yaxis.zerolinecolor, linecolor: chartLayoutDefaults.yaxis.linecolor },
        margin: { l: 60, r: 40, b: 50, t: 50 },
        paper_bgcolor: chartLayoutDefaults.paper_bgcolor,
        plot_bgcolor: chartLayoutDefaults.plot_bgcolor,
        font: chartLayoutDefaults.font,
        shapes: shapes,
        annotations: annotations,
        showlegend: false
    };
    
    Plotly.newPlot("chart-q-value", data, layout, {responsive: true});
}

// Helper untuk mengambil nilai warna CSS Variable
function varColor(variableName) {
    return getComputedStyle(document.body).getPropertyValue(variableName).trim();
}

// =====================================================================
// 5. BAB 3: ISOSPIN TRIAD PLOT
// =====================================================================
function renderBab3Isospin() {
    const data = [];
    
    // Fungsi helper untuk menggambar tingkat energi
    function addEnergyLevel(tz, energy, label, color, isIAS = false) {
        const width = 0.5; // lebar garis horizontal
        data.push({
            x: [tz - width/2, tz + width/2],
            y: [energy, energy],
            mode: 'lines',
            line: {
                color: color,
                width: 4
            },
            hoverinfo: 'skip',
            showlegend: false
        });
        
        data.push({
            x: [tz],
            y: [energy + 0.15],
            text: [label],
            mode: 'text',
            textfont: {
                family: "'Outfit', sans-serif",
                size: 13,
                color: '#ffffff'
            },
            hovertemplate: `<b>${label}</b><br>Isospin Tz: ${tz}<br>Eksitasi (relatif): ${energy} MeV<extra></extra>`,
            showlegend: false
        });
        
        // Titik tengah tak terlihat untuk interaktivitas hover
        data.push({
            x: [tz],
            y: [energy],
            mode: 'markers',
            marker: { size: 6, color: 'transparent' },
            hovertemplate: `<b>${label}</b><br>Isospin Tz: ${tz}<br>Eksitasi: ${energy} MeV<extra></extra>`,
            showlegend: false
        });
    }
    
    // 14C Ground State (T=1, Tz=1)
    addEnergyLevel(1, 0, "¹⁴C (Tz=1, T=1)", '#00b4d8');
    
    // 14N Ground State (T=0, Tz=0) - Referensi bawah IAS
    addEnergyLevel(0, -2.31, "¹⁴N g.s (Tz=0, T=0)", '#a3a3a3');
    
    // 14N IAS (T=1, Tz=0)
    addEnergyLevel(0, 0, "¹⁴N* IAS (Tz=0, T=1)", '#ffb81c', true);
    
    // 14O Ground State (T=1, Tz=-1)
    addEnergyLevel(-1, 0, "¹⁴O (Tz=-1, T=1)", '#ff4a5a');
    
    // Garis Penghubung Keadaan Analog (T=1)
    data.push({
        x: [1, 0, -1],
        y: [0, 0, 0],
        mode: 'lines',
        line: {
            color: 'rgba(255, 184, 28, 0.4)',
            width: 2,
            dash: 'dash'
        },
        hoverinfo: 'skip',
        showlegend: false
    });

    const layout = {
        title: {
            text: "<b>Diagram Tingkat Energi: Triad Analog Isobarik (A = 14)</b>",
            font: { size: 14, color: '#66fcf1' }
        },
        xaxis: {
            title: "Proyeksi Isospin, T_z",
            range: [-1.8, 1.8],
            dtick: 1,
            gridcolor: chartLayoutDefaults.xaxis.gridcolor,
            zerolinecolor: chartLayoutDefaults.xaxis.zerolinecolor,
            linecolor: chartLayoutDefaults.xaxis.linecolor
        },
        yaxis: {
            title: "Energi Relatif Terhadap IAS (MeV)",
            range: [-3.0, 1.0],
            gridcolor: chartLayoutDefaults.yaxis.gridcolor,
            zerolinecolor: chartLayoutDefaults.yaxis.zerolinecolor,
            linecolor: chartLayoutDefaults.yaxis.linecolor
        },
        margin: { l: 60, r: 40, b: 50, t: 50 },
        paper_bgcolor: chartLayoutDefaults.paper_bgcolor,
        plot_bgcolor: chartLayoutDefaults.plot_bgcolor,
        font: chartLayoutDefaults.font,
        showlegend: false
    };

    Plotly.newPlot("chart-isospin", data, layout, {responsive: true});
}

// =====================================================================
// 6. BAB 4: SLIDERS & BREIT-WIGNER
// =====================================================================
let bwState = {
    Er: 50,
    gamma: 4
};

function initBab4Sliders() {
    const slEr = document.getElementById("slide-er");
    const slGamma = document.getElementById("slide-gamma");
    
    const badgeEr = document.getElementById("badge-er");
    const badgeGamma = document.getElementById("badge-gamma");
    
    slEr.addEventListener("input", () => {
        const val = parseFloat(slEr.value);
        badgeEr.innerText = `${val.toFixed(1)} MeV`;
        bwState.Er = val;
        renderBab4Chart();
    });
    
    slGamma.addEventListener("input", () => {
        const val = parseFloat(slGamma.value);
        badgeGamma.innerText = `${val.toFixed(1)} MeV`;
        bwState.gamma = val;
        renderBab4Chart();
    });
    
    renderBab4Chart();
}

function renderBab4Chart() {
    const x = [];
    const y = [];
    const step = 0.25;
    const maxSigma = 100.0; // Puncak maksimum ternormalisasi (barns)
    
    for (let E = 10; E <= 90; E += step) {
        x.push(E);
        // Distribusi Breit-Wigner standard
        const term1 = Math.pow(bwState.gamma / 2, 2);
        const term2 = Math.pow(E - bwState.Er, 2) + term1;
        const sigma = maxSigma * (term1 / term2);
        y.push(sigma);
    }
    
    const trace = {
        x: x,
        y: y,
        mode: 'lines',
        fill: 'tozeroy',
        fillcolor: 'rgba(102, 252, 241, 0.15)',
        line: {
            color: varColor('--accent-cyan'),
            width: 3
        },
        hovertemplate: 'Energi Proyektil: %{x:.2f} MeV<br>Penampang Lintang: %{y:.2f} barns<extra></extra>'
    };
    
    const traceFWHM = {
        x: [bwState.Er - bwState.gamma/2, bwState.Er + bwState.gamma/2],
        y: [maxSigma/2, maxSigma/2],
        mode: 'lines+markers',
        line: { color: varColor('--accent-gold'), width: 2 },
        marker: { size: 6, color: varColor('--accent-gold') },
        hovertemplate: 'Lebar Resonansi (Γ) = ' + bwState.gamma.toFixed(1) + ' MeV<extra></extra>',
        name: 'FWHM (Γ)'
    };
    
    const layout = {
        title: {
            text: "<b>Penampang Lintang Resonansi Breit-Wigner Satu Tingkat</b>",
            font: { size: 14, color: '#66fcf1' }
        },
        xaxis: {
            title: "Energi Kinetik Proyektil Datang, E (MeV)",
            gridcolor: chartLayoutDefaults.xaxis.gridcolor,
            zerolinecolor: chartLayoutDefaults.xaxis.zerolinecolor,
            linecolor: chartLayoutDefaults.xaxis.linecolor
        },
        yaxis: {
            title: "Penampang Lintang Reaksi, σ (barns)",
            gridcolor: chartLayoutDefaults.yaxis.gridcolor,
            zerolinecolor: chartLayoutDefaults.yaxis.zerolinecolor,
            linecolor: chartLayoutDefaults.yaxis.linecolor,
            range: [0, 110]
        },
        margin: { l: 60, r: 40, b: 50, t: 50 },
        paper_bgcolor: chartLayoutDefaults.paper_bgcolor,
        plot_bgcolor: chartLayoutDefaults.plot_bgcolor,
        font: chartLayoutDefaults.font,
        showlegend: false,
        annotations: [
            {
                x: bwState.Er,
                y: maxSigma,
                text: `Puncak Resonansi (E<sub>r</sub> = ${bwState.Er} MeV)`,
                showarrow: true,
                arrowhead: 2,
                arrowcolor: '#ffffff',
                font: { color: '#ffffff' },
                ay: -40,
                ax: 0
            },
            {
                x: bwState.Er,
                y: maxSigma/2,
                text: `Γ = ${bwState.gamma.toFixed(1)} MeV`,
                showarrow: false,
                yshift: 10,
                font: { color: varColor('--accent-gold'), size: 12 }
            }
        ]
    };
    
    Plotly.newPlot("chart-cross-section", [trace, traceFWHM], layout, {responsive: true});
}

// =====================================================================
// 7. BAB 5: DETEKTOR & SPEKTRUM HPGe
// =====================================================================
let currentIsotope = 'co60';

function initBab5Dropdown() {
    const select = document.getElementById("isotope-select");
    
    select.value = 'co60';
    updateIsotopeInfo('co60');
    
    select.addEventListener("change", () => {
        const iso = select.value;
        currentIsotope = iso;
        updateIsotopeInfo(iso);
        renderBab5Chart();
    });
}

function updateIsotopeInfo(iso) {
    const data = isotopePresets[iso];
    document.getElementById("iso-decay-mode").innerText = data.decayMode;
    document.getElementById("iso-halflife").innerText = data.halfLife;
    document.getElementById("iso-energies").innerText = data.peaks.map(p => `${p} keV`).join(" & ");
}

function renderBab5Chart() {
    const isoData = isotopePresets[currentIsotope];
    
    const x = [];
    const y = [];
    const step = 2.0; // keV
    
    // Inisialisasi seed random lokal sederhana agar noise konsisten saat render ulang
    let lcgSeed = 42;
    function pseudoRandom() {
        lcgSeed = (lcgSeed * 1664525 + 1013904223) % 4294967296;
        return lcgSeed / 4294967296;
    }
    
    for (let channelEnergy = 100; channelEnergy <= 1500; channelEnergy += step) {
        x.push(channelEnergy);
        
        // 1. Compton Continuum & Photopeaks
        let counts = 400 * Math.exp(-channelEnergy / 400); // Latar Belakang Eksponensial (Noise Rendah)
        
        isoData.peaks.forEach((peakEnergy, idx) => {
            const intensity = isoData.intensities[idx];
            
            // Puncak Gaussian (Photopeak)
            const sigmaPeak = 4.5; // Resolusi HPGe tinggi (FWHM sempit)
            const height = 1500 * intensity;
            const gaussian = height * Math.exp(-Math.pow(channelEnergy - peakEnergy, 2) / (2 * Math.pow(sigmaPeak, 2)));
            counts += gaussian;
            
            // Compton Edge fisis
            const comptonEdge = peakEnergy / (1 + 511.0 / (2 * peakEnergy));
            
            // Compton Continuum (Fungsi sigmoid step menurun di Compton Edge)
            const comptonHeight = 180 * intensity;
            const comptonWidth = 10.0; // Kelebaran transisi
            const compton = comptonHeight / (1.0 + Math.exp((channelEnergy - comptonEdge) / comptonWidth));
            counts += compton;
            
            // Backscatter peak kecil (~180-250 keV tergantung geometri)
            const backscatterEnergy = peakEnergy / (1 + 2 * peakEnergy / 511.0);
            const backscatter = (comptonHeight * 0.25) * Math.exp(-Math.pow(channelEnergy - backscatterEnergy, 2) / (2 * Math.pow(15, 2)));
            counts += backscatter;
        });
        
        // 2. Tambah Derau Statistik Poisson (Stat Noise)
        const stdDev = Math.sqrt(counts);
        const noise = (pseudoRandom() - 0.5) * 2.5 * stdDev;
        counts = Math.max(counts + noise, 1.0); // Cegah nilai log negatif
        
        y.push(counts);
    }
    
    const trace = {
        x: x,
        y: y,
        mode: 'lines',
        line: {
            color: '#00b4d8',
            width: 1.3
        },
        hovertemplate: 'Energi: %{x} keV<br>Cacahan: %{y:.0f}<extra></extra>'
    };
    
    // Tambah Anotasi Puncak secara Dinamis
    const annotations = [];
    isoData.peaks.forEach((p, idx) => {
        annotations.push({
            x: p,
            y: Math.log10(1600 * isoData.intensities[idx]),
            text: `Peak ${p} keV`,
            showarrow: true,
            arrowhead: 2,
            arrowcolor: '#ffffff',
            font: { color: '#ffffff', size: 11 },
            ay: -35,
            ax: idx === 0 ? -30 : 30
        });
    });
    
    const layout = {
        title: {
            text: `<b>Simulasi Spektrum Gamma Detektor HPGe: ${isoData.name}</b>`,
            font: { size: 14, color: '#66fcf1' }
        },
        xaxis: {
            title: "Energi Saluran (keV)",
            gridcolor: chartLayoutDefaults.xaxis.gridcolor,
            zerolinecolor: chartLayoutDefaults.xaxis.zerolinecolor,
            linecolor: chartLayoutDefaults.xaxis.linecolor,
            range: [100, 1500]
        },
        yaxis: {
            title: "Cacahan (Log Scale)",
            type: 'log',
            gridcolor: chartLayoutDefaults.yaxis.gridcolor,
            zerolinecolor: chartLayoutDefaults.yaxis.zerolinecolor,
            linecolor: chartLayoutDefaults.yaxis.linecolor
        },
        margin: { l: 60, r: 40, b: 50, t: 50 },
        paper_bgcolor: chartLayoutDefaults.paper_bgcolor,
        plot_bgcolor: chartLayoutDefaults.plot_bgcolor,
        font: chartLayoutDefaults.font,
        annotations: annotations,
        showlegend: false
    };
    
    Plotly.newPlot("chart-hpge", [trace], layout, {responsive: true});
}

// =====================================================================
// 8. LOGIKA KUIS INTERAKTIF
// =====================================================================
function initQuiz() {
    const btnStart = document.getElementById("btn-start-quiz");
    const btnNext = document.getElementById("btn-next-question");
    const btnRestart = document.getElementById("btn-restart-quiz");
    
    btnStart.addEventListener("click", startQuiz);
    btnNext.addEventListener("click", nextQuestion);
    btnRestart.addEventListener("click", startQuiz);
}

function startQuiz() {
    state.quiz.started = true;
    state.quiz.currentQuestion = 0;
    state.quiz.score = 0;
    state.quiz.answered = false;
    state.quiz.selectedOption = null;
    
    document.getElementById("quiz-intro").style.display = "none";
    document.getElementById("quiz-results").style.display = "none";
    document.getElementById("quiz-card").style.display = "block";
    
    showQuestion();
}

function showQuestion() {
    const qData = quizQuestions[state.quiz.currentQuestion];
    state.quiz.answered = false;
    state.quiz.selectedOption = null;
    
    // Update Meta & Teks
    document.getElementById("quiz-progress-text").innerText = `Soal ${state.quiz.currentQuestion + 1} dari ${quizQuestions.length}`;
    document.getElementById("quiz-score-text").innerText = `Skor: ${state.quiz.score}/${quizQuestions.length}`;
    document.getElementById("quiz-question-text").innerText = qData.question;
    
    // Sembunyikan Feedback & Tombol Lanjut
    document.getElementById("quiz-feedback-box").style.display = "none";
    document.getElementById("btn-next-question").style.display = "none";
    
    // Render Opsi Jawaban
    const optionsContainer = document.getElementById("quiz-options-container");
    optionsContainer.innerHTML = "";
    
    qData.options.forEach((optionText, idx) => {
        const btn = document.createElement("button");
        btn.className = "quiz-option";
        btn.innerText = optionText;
        btn.addEventListener("click", () => handleSelectOption(idx));
        optionsContainer.appendChild(btn);
    });
}

function handleSelectOption(idx) {
    if (state.quiz.answered) return; // Tidak bisa ganti jawaban jika sudah di-submit
    
    const options = document.querySelectorAll(".quiz-option");
    
    // Reset selection styling
    options.forEach(opt => opt.classList.remove("selected"));
    
    // Set selection
    options[idx].classList.add("selected");
    state.quiz.selectedOption = idx;
    
    // Langsung submit setelah klik (feedback instan)
    submitAnswer();
}

function submitAnswer() {
    state.quiz.answered = true;
    const selected = state.quiz.selectedOption;
    const qData = quizQuestions[state.quiz.currentQuestion];
    const options = document.querySelectorAll(".quiz-option");
    
    const feedbackBox = document.getElementById("quiz-feedback-box");
    const feedbackTitle = document.getElementById("quiz-feedback-title");
    const feedbackText = document.getElementById("quiz-feedback-text");
    const btnNext = document.getElementById("btn-next-question");
    
    // Koreksi jawaban
    const isCorrect = (selected === qData.correct);
    
    if (isCorrect) {
        state.quiz.score++;
        options[selected].classList.add("correct-reveal");
        feedbackBox.className = "quiz-feedback correct";
        feedbackTitle.innerText = "Benar!";
    } else {
        options[selected].classList.add("wrong-reveal");
        options[qData.correct].classList.add("correct-reveal"); // Reveal correct answer
        feedbackBox.className = "quiz-feedback wrong";
        feedbackTitle.innerText = "Kurang Tepat!";
    }
    
    // Update live score display
    document.getElementById("quiz-score-text").innerText = `Skor: ${state.quiz.score}/${quizQuestions.length}`;
    
    // Tampilkan penjelasan kuis
    feedbackText.innerHTML = qData.explanation;
    feedbackBox.style.display = "block";
    
    // Pemicu rendering ulang MathJax untuk formula LaTeX di penjelasan
    if (window.MathJax && window.MathJax.typeset) {
        window.MathJax.typeset();
    }
    
    // Tampilkan tombol lanjut
    if (state.quiz.currentQuestion === quizQuestions.length - 1) {
        btnNext.innerText = "Lihat Hasil Akhir";
    } else {
        btnNext.innerText = "Pertanyaan Berikutnya";
    }
    btnNext.style.display = "block";
}

function nextQuestion() {
    if (state.quiz.currentQuestion === quizQuestions.length - 1) {
        showResults();
    } else {
        state.quiz.currentQuestion++;
        showQuestion();
    }
}

function showResults() {
    document.getElementById("quiz-card").style.display = "none";
    document.getElementById("quiz-results").style.display = "block";
    
    const finalPercent = Math.round((state.quiz.score / quizQuestions.length) * 100);
    document.getElementById("quiz-final-score").innerText = finalPercent;
    
    const comment = document.getElementById("quiz-performance-comment");
    if (finalPercent === 100) {
        comment.innerText = "Luar Biasa! Anda menyelesaikan seluruh soal latihan Krane dengan sempurna.";
        comment.style.color = varColor('--accent-cyan');
    } else if (finalPercent >= 60) {
        comment.innerText = "Kerja Bagus! Anda memahami materi buku Krane dengan baik.";
        comment.style.color = varColor('--accent-green');
    } else {
        comment.innerText = "Mari belajar lagi! Tinjau pembahasan soal di atas dan coba ulangi latihan.";
        comment.style.color = varColor('--accent-gold');
    }
}
